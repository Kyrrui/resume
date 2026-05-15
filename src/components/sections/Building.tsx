"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BuildingChart } from "@/components/sections/BuildingChart";
import { ProjectCard } from "@/components/sections/ProjectCard";
import { DeepDiveModal } from "@/components/sections/DeepDiveModal";
import type { ProjectDetails } from "@/data/projects";
import { projects } from "@/data/projects";
import { relativeTime } from "@/lib/relative-time";
import recentRepos from "@/data/recent-repos.json";

type Commit = {
  sha: string;
  message: string;
  date: string;
};

type Repo = {
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  pushedAt: string;
  url: string | null;
  stars: number;
  language: { name: string; color: string | null } | null;
  topics: string[];
  commits: Commit[];
  totalCommits?: number;
  commitsByDay?: number[];
};

type ChartWindow = {
  windowDays: number;
  days: string[];
  totalByDay: number[];
  repos: Repo[];
};

type RecentReposData = {
  generatedAt: string | null;
  user: string | null;
  windows?: Record<string, ChartWindow>;
};

const data = recentRepos as RecentReposData;

export function Building() {
  // Collapsed = every repo touched in the last 30 days. "Show more"
  // expands to every repo touched in the past year (longer chart +
  // any projects that weren't active in the last month).
  const [expanded, setExpanded] = useState(false);
  const monthWin = data.windows?.["30"];
  const yearWin = data.windows?.["365"];
  const win = expanded ? yearWin : monthWin;

  // The chart always draws every line in the current window. The card
  // grid is capped at 4 (most active) until "show more" — keeps the
  // collapsed section tight even when many repos were touched.
  const COLLAPSED_CARDS = 4;
  const chartRepos = win?.repos ?? [];
  const cardRepos = expanded
    ? chartRepos
    : chartRepos.slice(0, COLLAPSED_CARDS);

  const hiddenCount = Math.max(
    0,
    (yearWin?.repos.length ?? 0) - COLLAPSED_CARDS
  );

  // At most one repo is "active" at a time — its line is what the chart
  // focuses on. Plain (non-curated) cards toggle this like a radio.
  // Curated project cards set it (and open the deep-dive modal); the
  // chart focus persists after the modal closes so you can see it.
  const [activeRepoName, setActiveRepoName] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<ProjectDetails | null>(null);

  const toggleActive = (name: string) => {
    setActiveRepoName((current) => (current === name ? null : name));
  };

  const openDeepDive = (name: string, project: ProjectDetails) => {
    setActiveRepoName(name);
    setOpenProject(project);
  };

  return (
    <section id="building" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="01 /"
          title="Currently Building"
          caption={
            expanded
              ? "Every repo I've touched in the past year — public and private, pulled live from GitHub at build time."
              : "My most active repos over the last 30 days — public and private, pulled live from GitHub at build time."
          }
          action={
            data.generatedAt && (
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                refreshed {relativeTime(data.generatedAt)}
              </span>
            )
          }
        />

        {!win || chartRepos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {win.days.length > 0 && (
              <BuildingChart
                chart={win}
                repos={chartRepos.map((r) => ({
                  name: r.name,
                  displayTitle: projects[r.name]?.title ?? r.name,
                  language: r.language,
                  commitsByDay: r.commitsByDay ?? [],
                }))}
                activeRepoName={activeRepoName}
              />
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {cardRepos.map((repo, i) => {
                const project = projects[repo.name];
                const isActive = activeRepoName === repo.name;
                return (
                  <Reveal key={repo.fullName} delay={i * 0.05}>
                    {project ? (
                      <ProjectCard
                        project={project}
                        monthlyCommits={repo.totalCommits ?? 0}
                        isActive={isActive}
                        onOpen={() => openDeepDive(repo.name, project)}
                      />
                    ) : (
                      <RepoCard
                        repo={repo}
                        isActive={isActive}
                        onSelect={() => toggleActive(repo.name)}
                      />
                    )}
                  </Reveal>
                );
              })}
            </div>

            {yearWin && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    setExpanded((v) => !v);
                    setActiveRepoName(null);
                  }}
                  className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-5 py-2.5 text-sm text-[var(--text)] transition hover:bg-white/[0.05]"
                  aria-expanded={expanded}
                >
                  {expanded ? (
                    <>
                      <span className="transition-transform group-hover:-translate-y-0.5">
                        ↑
                      </span>
                      <span>Show last 30 days</span>
                    </>
                  ) : (
                    <>
                      <span className="transition-transform group-hover:translate-y-0.5">
                        ↓
                      </span>
                      <span>
                        Show the past year
                        {hiddenCount > 0 ? ` · +${hiddenCount} more` : ""}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* One modal for the section, driven by whichever project is open. */}
      {openProject && (
        <DeepDiveModal
          open={!!openProject}
          onClose={() => setOpenProject(null)}
          project={openProject}
        />
      )}
    </section>
  );
}

function RepoCard({
  repo,
  isActive,
  onSelect,
}: {
  repo: Repo;
  isActive: boolean;
  onSelect: () => void;
}) {
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();
  const cardContent = (
    <article
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      aria-label={`${repo.name} — click to ${
        isActive ? "deselect from chart" : "focus chart on this repo"
      }`}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`card-lift relative h-[400px] cursor-pointer overflow-hidden rounded-2xl border bg-white/[0.015] p-6 md:p-7 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
        isActive
          ? "border-violet-400/40 ring-1 ring-violet-400/30"
          : "border-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--text)] truncate">
              {repo.name}
            </h3>
            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                repo.isPrivate
                  ? "border-amber-300/20 bg-amber-300/[0.06] text-amber-200"
                  : "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
              }`}
            >
              {repo.isPrivate ? "private" : "public"}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-xs text-[var(--text-faint)]">
            updated {relativeTime(repo.pushedAt)}
          </p>
        </div>
        {repo.url ? (
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            onClick={stop}
            onKeyDown={stop}
            className="shrink-0 text-[var(--text-muted)] transition hover:text-white"
            aria-label={`Open ${repo.name} on GitHub`}
          >
            ↗
          </a>
        ) : null}
      </div>

      {repo.description ? (
        <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
          {repo.description}
        </p>
      ) : null}

      {repo.commits.length > 0 ? (
        <ul className="mt-5 space-y-1.5 border-t border-white/[0.05] pt-4">
          {repo.commits.map((c) => (
            <li
              key={c.sha}
              className="flex items-start gap-2.5 text-sm text-[var(--text)]"
            >
              <span className="mt-1 font-mono text-[10px] text-[var(--text-faint)]">
                {c.sha}
              </span>
              <span className="flex-1 leading-snug">{c.message}</span>
              <span className="mt-1 shrink-0 font-mono text-[10px] text-[var(--text-faint)]">
                {relativeTime(c.date)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        {repo.language ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-[var(--text)]">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{
                background: repo.language.color ?? "rgba(255,255,255,0.4)",
              }}
            />
            {repo.language.name}
          </span>
        ) : null}
        {repo.stars > 0 ? (
          <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-[var(--text)]">
            ★ {repo.stars}
          </span>
        ) : null}
        {repo.topics.slice(0, 3).map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );

  return cardContent;
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.015] p-8 text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.06] px-3 py-1 font-mono text-xs uppercase tracking-wider text-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        not yet fetched
      </div>
      <p className="mx-auto mt-4 max-w-md text-sm text-[var(--text-muted)]">
        Set <span className="font-mono text-[var(--text)]">GITHUB_TOKEN</span>{" "}
        in <span className="font-mono text-[var(--text)]">.env.local</span> and
        run{" "}
        <span className="font-mono text-[var(--text)]">
          node scripts/fetch-github-activity.mjs
        </span>{" "}
        to populate this section.
      </p>
    </div>
  );
}
