"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import type { Hackathon } from "@/data/resume";

const toneText: Record<Hackathon["tone"], string> = {
  gold: "text-amber-200",
  silver: "text-slate-200",
  bronze: "text-orange-200",
  finalist: "text-violet-200",
};
const toneDot: Record<Hackathon["tone"], string> = {
  gold: "bg-amber-300",
  silver: "bg-slate-200",
  bronze: "bg-orange-300",
  finalist: "bg-violet-300",
};

export function HackathonModal({
  open,
  onClose,
  hackathon,
}: {
  open: boolean;
  onClose: () => void;
  hackathon: Hackathon | null;
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
      {open && hackathon && (
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
          aria-label={`${hackathon.event} — ${hackathon.project}`}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 12 }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.1] bg-[var(--bg-elev)] shadow-[0_30px_120px_-20px_rgba(139,92,246,0.35)]"
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.06] bg-[var(--bg-elev)]/95 px-6 py-5 backdrop-blur md:px-8">
              <div className="flex min-w-0 items-start gap-4">
                {hackathon.image && (
                  <div className="relative hidden h-12 w-20 shrink-0 sm:block">
                    <Image
                      src={hackathon.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-contain object-left"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {hackathon.event} · {hackathon.location} · {hackathon.date}
                  </div>
                  <h3 className="mt-1 font-display text-xl font-semibold tracking-tight text-[var(--text)] md:text-2xl">
                    {hackathon.project}
                  </h3>
                  <span
                    className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${toneText[hackathon.tone]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${toneDot[hackathon.tone]}`}
                    />
                    {hackathon.result}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {hackathon.url && (
                  <a
                    href={hackathon.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    <span>View project</span>
                    <span className="transition-transform group-hover:translate-x-0.5">
                      ↗
                    </span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.02] text-[var(--text-muted)] transition hover:border-white/[0.2] hover:text-white"
                  aria-label="Close"
                >
                  <span aria-hidden className="text-base leading-none">
                    ×
                  </span>
                </button>
              </div>
            </div>

            <div className="px-6 py-6 md:px-8 md:py-7">
              {hackathon.description && (
                <p className="text-sm leading-relaxed text-[var(--text-muted)] md:text-base">
                  {hackathon.description}
                </p>
              )}

              {hackathon.sponsors.length > 0 && (
                <section className="mt-7 border-t border-white/[0.05] pt-5">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                    Built with
                  </h4>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hackathon.sponsors.map((s) => (
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
