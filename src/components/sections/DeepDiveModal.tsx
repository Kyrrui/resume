"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { ProjectDetails } from "@/data/projects";
import { urlLabel } from "@/lib/url-label";

export function DeepDiveModal({
  open,
  onClose,
  project,
}: {
  open: boolean;
  onClose: () => void;
  project: ProjectDetails;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-md md:px-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — deep dive`}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/[0.1] bg-[var(--bg-elev)] shadow-[0_30px_120px_-20px_rgba(139,92,246,0.35)]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.06] bg-[var(--bg-elev)]/95 px-6 py-5 backdrop-blur md:px-8">
              <div className="flex items-start gap-4 min-w-0">
                {project.logo && (
                  <div
                    className={`hidden sm:inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-white/[0.03] ${
                      project.logoShape === "circle"
                        ? "rounded-full"
                        : "rounded-xl p-1.5"
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
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-semibold tracking-tight text-[var(--text)] md:text-2xl">
                    {project.title}
                  </h3>
                  {project.subtitle && (
                    <p className="mt-0.5 font-mono text-xs text-[var(--text-faint)]">
                      {project.subtitle}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] transition hover:text-white hover:border-white/[0.2]"
                  >
                    {urlLabel(project.url)} <span>↗</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] text-[var(--text-muted)] transition hover:text-white hover:border-white/[0.2]"
                  aria-label="Close deep dive"
                >
                  <span aria-hidden className="text-base leading-none">×</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-6 py-6 md:px-8 md:py-7">
              <p className="text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                {project.description}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <section className="mt-7">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                    Key wins
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {project.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2.5 text-sm leading-snug text-[var(--text)] md:text-[15px]"
                      >
                        <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.details && project.details.length > 0 && (
                <section className="mt-7">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                    Deep dive
                  </h4>
                  <ul className="mt-3 space-y-2 border-l border-cyan-400/30 pl-4">
                    {project.details.map((d) => (
                      <li
                        key={d}
                        className="text-sm leading-snug text-[var(--text-muted)]"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {project.stack && project.stack.length > 0 && (
                <section className="mt-7 border-t border-white/[0.05] pt-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                    Stack
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-xs text-[var(--text)]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
