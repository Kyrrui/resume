"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BuildingChart } from "@/components/sections/BuildingChart";
import { FlippableRepoCard } from "@/components/sections/FlippableRepoCard";
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

type RecentReposData = {
  generatedAt: string | null;
  user: string | null;
  chart?: {
    windowDays: number;
    days: string[];
    totalByDay: number[];
  };
  repos: Repo[];
};

const data = recentRepos as RecentReposData;

export function Building() {
  const repos = data.repos ?? [];

  // At most one repo is "active" at a time — its line is what the chart
  // focuses on. Clicking ANY card (flippable or plain) toggles whether
  // that repo is the active one. Acts like a radio: click again to clear.
  const [activeRepoName, setActiveRepoName] = useState<string | null>(null);

  const toggleActive = (name: string) => {
    setActiveRepoName((current) => (current === name ? null : name));
  };

  return (
    <section id="building" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="01 /"
          title="Currently Building"
          caption="Most recent commits across my public and private repos — pulled live from GitHub at build time."
          action={
            data.generatedAt && (
              <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
                refreshed {relativeTime(data.generatedAt)}
              </span>
            )
          }
        />

        {repos.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {data.chart && data.chart.days.length > 0 && (
              <BuildingChart
                chart={data.chart}
                repos={repos.map((r) => ({
                  name: r.name,
                  // Use the curated project title when this repo isn't
                  // the active one; the chart swaps to the repo name
                  // when it IS active (flippable cards have flipped to
                  // the repo face; plain cards have been selected).
                  displayTitle: projects[r.name]?.title ?? r.name,
                  language: r.language,
                  commitsByDay: r.commitsByDay ?? [],
                  isFlipped: activeRepoName === r.name,
                }))}
                activeRepoName={activeRepoName}
              />
            )}
            <div className="grid gap-5 md:grid-cols-2">
              {repos.map((repo, i) => {
                const project = projects[repo.name];
                const isActive = activeRepoName === repo.name;
                return (
                  <Reveal key={repo.fullName} delay={i * 0.05}>
                    {project ? (
                      <FlippableRepoCard
                        project={project}
                        repo={{
                          ...repo,
                          monthlyCommits: repo.totalCommits,
                        }}
                        flipped={isActive}
                        onFlippedChange={() => toggleActive(repo.name)}
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
          </>
        )}
      </div>
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
