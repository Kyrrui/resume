// Build-time fetcher for recent GitHub activity. Runs as a `prebuild` step
// and writes src/data/recent-repos.json which the Building section reads.
//
// Requires a Personal Access Token in env:
//   - $GITHUB_TOKEN  (preferred — also Netlify's convention)
//   - $GH_TOKEN      (fallback — gh CLI's convention)
//
// Token scopes:
//   - `repo` (for private repo metadata + commits)
//   - `read:user`
//
// If no token is found, the script logs a warning and leaves
// recent-repos.json untouched so dev builds keep working.

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const outPath = resolve(projectRoot, "src/data/recent-repos.json");
const REPO_COUNT = 4;
const COMMITS_PER_REPO_DISPLAY = 4;
// 30-day window for the per-day commit chart.
const CHART_WINDOW_DAYS = 30;

const token = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN;
if (!token) {
  console.warn(
    "[fetch-github-activity] No GITHUB_TOKEN or GH_TOKEN set; skipping refresh. " +
      "The Building section will fall back to whatever is currently in recent-repos.json."
  );
  process.exit(0);
}

const query = `
  query RecentRepos($repoCount: Int!, $since: GitTimestamp!) {
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
          repositoryTopics(first: 6) {
            nodes { topic { name } }
          }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 100, since: $since) {
                  nodes {
                    abbreviatedOid
                    messageHeadline
                    committedDate
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const since = new Date(Date.now() - CHART_WINDOW_DAYS * 24 * 60 * 60 * 1000);
// Pad slightly so the 30th-day boundary doesn't drop a same-day commit.
since.setUTCHours(0, 0, 0, 0);
const sinceIso = since.toISOString();

const res = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "User-Agent": "kyle-bryant-resume-site-build",
  },
  body: JSON.stringify({
    query,
    variables: { repoCount: REPO_COUNT, since: sinceIso },
  }),
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

// Build the chart's day buckets (UTC YYYY-MM-DD strings), oldest → newest.
const days = [];
for (let i = CHART_WINDOW_DAYS - 1; i >= 0; i--) {
  const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
  d.setUTCHours(0, 0, 0, 0);
  days.push(d.toISOString().slice(0, 10));
}
const dayIndex = new Map(days.map((d, i) => [d, i]));

const repos = (payload.data.viewer.repositories.nodes || [])
  .filter((r) => r && !r.isArchived)
  .map((r) => {
    const allCommits = (r.defaultBranchRef?.target?.history?.nodes || []).map(
      (c) => ({
        sha: c.abbreviatedOid,
        message: c.messageHeadline,
        date: c.committedDate,
      })
    );

    // Per-day counts for this repo across the chart window.
    const commitsByDay = new Array(days.length).fill(0);
    for (const c of allCommits) {
      const dayKey = c.date.slice(0, 10);
      const idx = dayIndex.get(dayKey);
      if (idx !== undefined) commitsByDay[idx]++;
    }

    return {
      name: r.name,
      fullName: r.nameWithOwner,
      description: r.description,
      isPrivate: r.isPrivate,
      pushedAt: r.pushedAt,
      // Don't expose private repo URLs — only public ones are linkable.
      url: r.isPrivate ? null : r.url,
      stars: r.stargazerCount,
      language: r.primaryLanguage
        ? { name: r.primaryLanguage.name, color: r.primaryLanguage.color }
        : null,
      topics: (r.repositoryTopics?.nodes || []).map((n) => n.topic.name),
      // Most recent N commits for display under each repo card.
      commits: allCommits.slice(0, COMMITS_PER_REPO_DISPLAY),
      // Total commits in the chart window for this repo.
      totalCommits: allCommits.length,
      // Per-day counts aligned to the shared `days` array.
      commitsByDay,
    };
  });

// Total per-day across all repos (same length / order as `days`).
const totalByDay = days.map((_, i) =>
  repos.reduce((sum, r) => sum + (r.commitsByDay[i] || 0), 0)
);

if (!existsSync(dirname(outPath))) {
  mkdirSync(dirname(outPath), { recursive: true });
}

writeFileSync(
  outPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      user: payload.data.viewer.login,
      chart: {
        windowDays: CHART_WINDOW_DAYS,
        days,
        totalByDay,
      },
      repos,
    },
    null,
    2
  )
);

console.log(
  `[fetch-github-activity] Wrote ${repos.length} repos + ${days.length}-day chart series to ${outPath}`
);
