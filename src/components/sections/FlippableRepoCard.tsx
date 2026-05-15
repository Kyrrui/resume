"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectDetails } from "@/data/projects";
import { relativeTime } from "@/lib/relative-time";
import { DeepDiveModal } from "@/components/sections/DeepDiveModal";

export type Repo = {
  name: string;
  fullName: string;
  description: string | null;
  isPrivate: boolean;
  pushedAt: string;
  url: string | null;
  stars: number;
  language: { name: string; color: string | null } | null;
  topics: string[];
  commits: { sha: string; message: string; date: string }[];
  /** Total commits in the chart window (last 30 days) */
  monthlyCommits?: number;
};

export function FlippableRepoCard({
  project,
  repo,
  flipped,
  onFlippedChange,
}: {
  project: ProjectDetails;
  repo: Repo;
  /** Controlled flip state. The parent tracks which card is flipped so the
   * chart can focus on the most-recently-flipped repo. */
  flipped: boolean;
  onFlippedChange: (flipped: boolean) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const toggle = () => onFlippedChange(!flipped);

  return (
    <>
      <div className="relative h-[400px] [perspective:1500px]">
        <div
          role="button"
          tabIndex={0}
          aria-label={`${project.title} — click to ${
            flipped ? "show project details" : "show commits"
          }`}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggle();
            }
          }}
          className="grid h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-700"
          style={{
            transform: flipped ? "rotateY(180deg)" : "rotateY(0)",
          }}
        >
          <ProjectFace
            project={project}
            monthlyCommits={repo.monthlyCommits ?? 0}
            onDeepDive={() => setModalOpen(true)}
          />
          <RepoFace repo={repo} />
        </div>
      </div>

      <DeepDiveModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        project={project}
      />
    </>
  );
}

function ProjectFace({
  project,
  monthlyCommits,
  onDeepDive,
}: {
  project: ProjectDetails;
  monthlyCommits: number;
  onDeepDive: () => void;
}) {
  const hasDive =
    (project.highlights && project.highlights.length > 0) ||
    (project.details && project.details.length > 0);

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 md:p-7 [grid-area:1/1] [backface-visibility:hidden] transition-colors hover:bg-white/[0.025]">
      {/* Logo + title row */}
      <div className="flex items-start gap-4">
        {project.logo && (
          <div
            className={`inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-white/[0.03] ${
              project.logoShape === "circle" ? "rounded-full" : "rounded-xl p-1.5"
            }`}
          >
            <Image
              src={project.logo}
              alt=""
              width={64}
              height={64}
              className={`h-full w-full ${
                project.logoShape === "circle"
                  ? "object-cover"
                  : "object-contain"
              }`}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
              {project.title}
            </h3>
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                onClick={stop}
                onKeyDown={stop}
                className="shrink-0 inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] transition hover:text-white hover:border-white/[0.2]"
              >
                Live <span>↗</span>
              </a>
            )}
          </div>
          {project.subtitle && (
            <p className="mt-0.5 font-mono text-xs text-[var(--text-faint)]">
              {project.subtitle}
            </p>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">
        {project.description}
      </p>

      <div className="flex-1" />

      {project.stack && project.stack.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/[0.05] pt-4">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-[var(--text)]"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {hasDive && (
            <button
              type="button"
              onClick={(e) => {
                stop(e);
                onDeepDive();
              }}
              onKeyDown={stop}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] transition hover:text-white hover:border-white/[0.2]"
              aria-haspopup="dialog"
            >
              <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
              deep dive
            </button>
          )}
          {monthlyCommits > 0 && (
            <span
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]"
              title="Commits in the last 30 days"
            >
              <span className="inline-block h-1 w-1 rounded-full bg-emerald-400" />
              {monthlyCommits} commit{monthlyCommits === 1 ? "" : "s"} / mo
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
          <span className="inline-block h-1 w-1 rounded-full bg-violet-400" />
          click to flip
        </span>
      </div>
    </article>
  );
}

function RepoFace({ repo }: { repo: Repo }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.015] p-6 md:p-7 [grid-area:1/1] [backface-visibility:hidden] [transform:rotateY(180deg)] transition-colors hover:bg-white/[0.025]">
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
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
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

      <div className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
        <span className="inline-block h-1 w-1 rounded-full bg-violet-400" />
        click to flip · back to project
      </div>
    </article>
  );
}
