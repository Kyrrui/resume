"use client";

import { useState } from "react";
import Image from "next/image";
import { hackathons, type Hackathon } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";
import { HackathonModal } from "@/components/sections/HackathonModal";

const toneRing: Record<Hackathon["tone"], string> = {
  gold: "from-amber-300/40 via-amber-500/20 to-transparent",
  silver: "from-slate-300/30 via-slate-400/15 to-transparent",
  bronze: "from-orange-400/35 via-orange-500/15 to-transparent",
  finalist: "from-violet-400/30 via-violet-500/15 to-transparent",
};

const toneDot: Record<Hackathon["tone"], string> = {
  gold: "bg-amber-300",
  silver: "bg-slate-200",
  bronze: "bg-orange-300",
  finalist: "bg-violet-300",
};

const toneLabel: Record<Hackathon["tone"], string> = {
  gold: "text-amber-200",
  silver: "text-slate-200",
  bronze: "text-orange-200",
  finalist: "text-violet-200",
};

export function Hackathons() {
  const [selected, setSelected] = useState<Hackathon | null>(null);

  return (
    <section id="hackathons" className="relative py-24 md:py-32 bg-hex">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="02 /"
          title="Hackathons"
          caption="A few weekends I'm proud of. Real teams, tight deadlines, deployed contracts."
          action={
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
              {hackathons.length} events
            </span>
          }
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] md:grid-cols-2">
          {hackathons.map((h, i) => {
            const clickable = Boolean(h.description || h.url);
            return (
              <Reveal
                key={`${h.event}-${h.location}-${i}`}
                delay={i * 0.04}
                as="article"
                className="h-full"
              >
                <article
                  {...(clickable
                    ? {
                        role: "button",
                        tabIndex: 0,
                        onClick: () => setSelected(h),
                        onKeyDown: (e: React.KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelected(h);
                          }
                        },
                        "aria-label": `${h.event} — ${h.project}, view details`,
                      }
                    : {})}
                  className={`group relative flex h-full flex-col bg-[var(--bg)] p-6 transition-colors hover:bg-white/[0.02] focus:outline-none ${
                    clickable
                      ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-400/60"
                      : ""
                  }`}
                >
                  {/* corner glow strip */}
                  <div
                    className={`pointer-events-none absolute -top-px -left-px h-24 w-24 bg-gradient-to-br ${toneRing[h.tone]} opacity-60 transition-opacity group-hover:opacity-100`}
                    style={{
                      maskImage:
                        "radial-gradient(closest-side, black, transparent)",
                      WebkitMaskImage:
                        "radial-gradient(closest-side, black, transparent)",
                    }}
                  />

                  {/* Logo + hackathon name lockup; result badge right */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-4">
                      {h.image && (
                        <div className="relative h-14 w-28 shrink-0">
                          <Image
                            src={h.image}
                            alt=""
                            fill
                            sizes="112px"
                            className="object-contain object-left"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-display text-lg font-semibold tracking-tight text-[var(--text)]">
                          {h.event}
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[var(--text-faint)]">
                          {h.location} · {h.date}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${toneLabel[h.tone]}`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${toneDot[h.tone]}`}
                      />
                      {h.tone === "finalist" ? "Finalist" : "Winner"}
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="text-sm font-medium text-[var(--text)]">
                      {h.project}
                    </div>
                    {h.summary && (
                      <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-muted)]">
                        {h.summary}
                      </p>
                    )}
                  </div>

                  {/* Single-row footer pinned to the card bottom so the
                      award chip lands at the same place on every card. */}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-6">
                    <span className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs">
                      <span className="font-mono text-[var(--text-faint)]">
                        ↳
                      </span>
                      <span className={`${toneLabel[h.tone]}`}>{h.result}</span>
                    </span>
                    {clickable && (
                      <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-[var(--text-faint)] transition-colors group-hover:text-[var(--text-muted)]">
                        View details
                        <span className="transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </span>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <HackathonModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        hackathon={selected}
      />
    </section>
  );
}
