import { featuredBuilds } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedBuilds() {
  return (
    <section id="builds" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="01 /"
          title="Selected Builds"
          caption="Personal projects and hackathon winners. The work that best represents how I think and what I ship."
          action={
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-faint)]">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              {featuredBuilds.length} highlighted
            </span>
          }
        />

        <div className="grid gap-5 md:grid-cols-2">
          {featuredBuilds.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.05} as="article">
              <article className="card-lift gradient-border h-full">
                <div className="relative p-6 md:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[var(--text-faint)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="h-px w-6 bg-white/10" />
                      <span className="font-mono text-xs text-[var(--text-muted)]">
                        {b.year}
                      </span>
                    </div>
                    {b.badge && <Pill tone={b.badge.tone}>{b.badge.label}</Pill>}
                  </div>

                  <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm font-mono text-[var(--cyan)]">
                    {b.tagline}
                  </p>

                  <p className="mt-5 text-sm leading-relaxed text-[var(--text-muted)]">
                    {b.description}
                  </p>

                  <ul className="mt-5 space-y-1.5">
                    {b.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-start gap-2 text-sm text-[var(--text)]"
                      >
                        <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-gradient-to-r from-violet-400 to-cyan-400" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-1.5 border-t border-white/[0.06] pt-5">
                    {b.stack.map((s) => (
                      <Pill key={s}>{s}</Pill>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
