"use client";

import Image from "next/image";
import type { ProjectDetails } from "@/data/projects";
import { urlLabel } from "@/lib/url-label";

// Curated project card. No flip — clicking the card selects the project
// (focuses the chart) and opens its deep-dive modal. The modal carries
// all the long-form content + the live/GitHub button.
export function ProjectCard({
  project,
  monthlyCommits,
  isActive,
  onOpen,
}: {
  project: ProjectDetails;
  monthlyCommits: number;
  isActive: boolean;
  onOpen: () => void;
}) {
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <article
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`${project.title} — open deep dive`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`relative flex h-[400px] cursor-pointer flex-col overflow-hidden rounded-2xl border bg-white/[0.015] p-6 md:p-7 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 ${
        isActive
          ? "border-violet-400/40 ring-1 ring-violet-400/30"
          : "border-white/[0.07] hover:bg-white/[0.025]"
      }`}
    >
      {/* Logo + title row */}
      <div className="flex items-start gap-4">
        {project.logo &&
          (project.logoShape === "circle" ? (
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/[0.03]">
              <Image
                src={project.logo}
                alt=""
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </span>
          ) : (
            <Image
              src={project.logo}
              alt=""
              width={112}
              height={112}
              className="h-14 w-14 shrink-0 object-contain"
            />
          ))}
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
                {urlLabel(project.url)} <span>↗</span>
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
        <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span className="inline-block h-1 w-1 rounded-full bg-cyan-400" />
          deep dive →
        </span>
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
    </article>
  );
}
