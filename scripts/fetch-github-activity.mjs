// Build-time fetcher for recent GitHub activity. Runs as a `prebuild` step
// and writes src/data/recent-repos.json which the Building section reads.
//
// Emits TWO windows:
//   - "30":  last 30 days  (default view)
//   - "365": last 365 days (the "1 year" toggle)
// Each window independently ranks the top repos by commits *in that
// window* (so the year view surfaces projects the 30-day view doesn't),
// builds a per-day series, and rolls the rest into an "Other" series.
//
// Requires a Personal Access Token in env:
//   - $GITHUB_TOKEN  (preferred — also Netlify's convention)
//   - $GH_TOKEN      (fallback — gh CLI's convention)
// Token scopes: `repo` (private repo metadata + commits), `read:user`.
//
// No token -> logs a warning and leaves recent-repos.json untouched so
// dev builds keep working.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outPath = resolve(projectRoot, "src/data/recent-repos.json");

// How many owned repos to pull into the candidate pool.
const FETCH_REPO_COUNT = 25;
// Named (carded) repos per window — the rest aggregate into "Other".
const TOP_REPO_COUNT = { 30: 4, 365: 8 };
// Recent commits surfaced on a plain repo card (window-independent).
const COMMITS_PER_REPO_DISPLAY = 4;
// History pagination cap per repo (100 commits/page). 6 -> up to 600
// commits/repo/year, plenty for a stylized chart without unbounded calls.
const MAX_HISTORY_PAGES = 6;
const DAY_MS = 24 * 60 * 60 * 1000;
const WINDOWS = [30, 365];

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (!token) {
  console.warn(
    "[fetch-github-activity] No GITHUB_TOKEN or GH_TOKEN set; skipping refresh. " +
      "The Building section will fall back to whatever is currently in recent-repos.json."
  );
  process.exit(0);
}

async function gql(query, variables) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "kyle-bryant-resume-site-build",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) {
    console.error(
      `[fetch-github-activity] GitHub API ${res.status}:`,
      await res.text()
    );
    process.exit(1);
  }
  const payload = await res.json();
  if (payload.errors) {
    console.error(
      "[fetch-github-activity] GraphQL errors:",
      JSON.stringify(payload.errors, null, 2)
    );
    process.exit(1);
  }
  return payload.data;
}

// Pull the year-ago boundary (UTC midnight) — the widest window we need.
const since = new Date(Date.now() - 365 * DAY_MS);
since.setUTCHours(0, 0, 0, 0);
const sinceIso = since.toISOString();

const reposQuery = `
  query Repos($repoCount: Int!, $since: GitTimestamp!) {
    viewer {
      login
      repositories(
        first: $repoCount,
        ownerAffiliations: [OWNER],
        orderBy: {field: PUSHED_AT, direction: DESC},
        isFork: false
      ) {
        nodes {
          name
          nameWithOwner
          description
          isPrivate
          isArchived
          pushedAt
          url
          stargazerCount
          primaryLanguage { name color }
          repositoryTopics(first: 6) { nodes { topic { name } } }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100, since: $since) {
                  pageInfo { hasNextPage endCursor }
                  nodes { abbreviatedOid messageHeadline committedDate }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const historyPageQuery = `
  query History($name: String!, $owner: String!, $since: GitTimestamp!, $after: String!) {
    repository(name: $name, owner: $owner) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, since: $since, after: $after) {
              pageInfo { hasNextPage endCursor }
              nodes { abbreviatedOid messageHeadline committedDate }
            }
          }
        }
      }
    }
  }
`;

const data = await gql(reposQuery, {
  repoCount: FETCH_REPO_COUNT,
  since: sinceIso,
});
const login = data.viewer.login;

// Collect each repo's full year of commits (paginating where needed).
const allFetched = [];
for (const r of data.viewer.repositories.nodes || []) {
  if (!r || r.isArchived) continue;

  const hist = r.defaultBranchRef?.target?.history;
  const commits = (hist?.nodes || []).map((c) => ({
    sha: c.abbreviatedOid,
    message: c.messageHeadline,
    date: c.committedDate,
  }));

  let pageInfo = hist?.pageInfo;
  let pages = 1;
  const [owner, name] = r.nameWithOwner.split("/");
  while (pageInfo?.hasNextPage && pages < MAX_HISTORY_PAGES) {
    const pageData = await gql(historyPageQuery, {
      name,
      owner,
      since: sinceIso,
      after: pageInfo.endCursor,
    });
    const ph = pageData.repository?.defaultBranchRef?.target?.history;
    for (const c of ph?.nodes || []) {
      commits.push({
        sha: c.abbreviatedOid,
        message: c.messageHeadline,
        date: c.committedDate,
      });
    }
    pageInfo = ph?.pageInfo;
    pages += 1;
  }

  allFetched.push({
    name: r.name,
    fullName: r.nameWithOwner,
    description: r.description,
    isPrivate: r.isPrivate,
    pushedAt: r.pushedAt,
    url: r.isPrivate ? null : r.url,
    stars: r.stargazerCount,
    language: r.primaryLanguage
      ? { name: r.primaryLanguage.name, color: r.primaryLanguage.color }
      : null,
    topics: (r.repositoryTopics?.nodes || []).map((n) => n.topic.name),
    commits, // full year, newest-first
  });
}

// Build one window (e.g. 30 or 365 days) from the shared commit data.
function buildWindow(windowDays) {
  const days = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * DAY_MS);
    d.setUTCHours(0, 0, 0, 0);
    days.push(d.toISOString().slice(0, 10));
  }
  const dayIndex = new Map(days.map((d, i) => [d, i]));

  const scored = allFetched.map((r) => {
    const commitsByDay = new Array(days.length).fill(0);
    let totalCommits = 0;
    for (const c of r.commits) {
      const idx = dayIndex.get(c.date.slice(0, 10));
      if (idx !== undefined) {
        commitsByDay[idx] += 1;
        totalCommits += 1;
      }
    }
    return { ...r, commitsByDay, totalCommits };
  });

  // Rank by activity *within this window*, then split named vs Other.
  const active = scored
    .filter((r) => r.totalCommits > 0)
    .sort((a, b) => b.totalCommits - a.totalCommits);
  const topN = TOP_REPO_COUNT[windowDays] ?? 4;
  const named = active.slice(0, topN);
  const rest = active.slice(topN);

  const otherByDay = new Array(days.length).fill(0);
  let otherTotalCommits = 0;
  for (const r of rest) {
    otherTotalCommits += r.totalCommits;
    for (let i = 0; i < days.length; i++) otherByDay[i] += r.commitsByDay[i];
  }

  const totalByDay = days.map((_, i) =>
    scored.reduce((sum, r) => sum + (r.commitsByDay[i] || 0), 0)
  );

  const repos = named.map((r) => ({
    name: r.name,
    fullName: r.fullName,
    description: r.description,
    isPrivate: r.isPrivate,
    pushedAt: r.pushedAt,
    url: r.url,
    stars: r.stars,
    language: r.language,
    topics: r.topics,
    commits: r.commits.slice(0, COMMITS_PER_REPO_DISPLAY),
    totalCommits: r.totalCommits,
    commitsByDay: r.commitsByDay,
  }));

  return {
    windowDays,
    days,
    totalByDay,
    other: {
      repoCount: rest.length,
      totalCommits: otherTotalCommits,
      byDay: otherByDay,
    },
    repos,
  };
}

const windows = {};
for (const w of WINDOWS) windows[String(w)] = buildWindow(w);

if (!existsSync(dirname(outPath))) {
  mkdirSync(dirname(outPath), { recursive: true });
}

writeFileSync(
  outPath,
  JSON.stringify(
    { generatedAt: new Date().toISOString(), user: login, windows },
    null,
    2
  )
);

console.log(
  `[fetch-github-activity] Wrote windows: ` +
    WINDOWS.map(
      (w) =>
        `${w}d=${windows[String(w)].repos.length} repos +${windows[String(w)].other.repoCount} other`
    ).join(", ") +
    ` -> ${outPath}`
);
