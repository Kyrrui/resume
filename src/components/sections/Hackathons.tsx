import { hackathons, type Hackathon } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

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

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
          {hackathons.map((h, i) => (
            <Reveal
              key={`${h.event}-${h.location}-${i}`}
              delay={i * 0.04}
              as="article"
            >
              <article className="group relative h-full bg-[var(--bg)] p-6 transition-colors hover:bg-white/[0.02]">
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

                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {h.date}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider ${toneLabel[h.tone]}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${toneDot[h.tone]}`}
                    />
                    {h.tone === "finalist" ? "Finalist" : "Winner"}
                  </span>
                </div>

                <div className="mt-5">
                  <div className="font-display text-lg font-semibold tracking-tight">
                    {h.event}{" "}
                    <span className="text-[var(--text-muted)] font-normal">
                      · {h.location}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-[var(--text-muted)]">
                    {h.project}
                  </div>
                  {h.description && (
                    <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-muted)]">
                      {h.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-xs">
                  <span className="font-mono text-[var(--text-faint)]">↳</span>
                  <span className={`${toneLabel[h.tone]}`}>{h.result}</span>
                </div>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {h.sponsors.map((s) => (
                    <span
                      key={s}
                      className="rounded border border-white/[0.06] bg-white/[0.015] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
