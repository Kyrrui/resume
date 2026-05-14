import { work } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Reveal } from "@/components/ui/Reveal";

export function Work() {
  return (
    <section id="work" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="03 /"
          title="Work History"
          caption="Where I've spent my full-time hours."
        />

        <ol className="relative">
          {/* vertical rail */}
          <div
            aria-hidden
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-400/40 via-white/10 to-transparent"
          />

          {work.map((role, i) => (
            <Reveal key={role.company} delay={i * 0.06} as="li">
              <li className="relative pl-10 pb-12 last:pb-0">
                {/* node */}
                <div className="absolute left-0 top-1.5 flex h-4 w-4 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-violet-400/20 blur-md" />
                  <div className="relative h-2.5 w-2.5 rounded-full bg-[var(--bg)] ring-2 ring-violet-400/70" />
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {role.title}{" "}
                    <span className="text-[var(--text-muted)] font-normal">
                      @ {role.company}
                    </span>
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {role.period} · {role.location}
                  </span>
                </div>

                <p className="mt-3 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                  {role.blurb}
                </p>

                <ul className="mt-4 space-y-2">
                  {role.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-[var(--text)]"
                    >
                      <span className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-cyan-400/70" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 flex flex-wrap gap-1.5">
                  {role.stack.map((s) => (
                    <Pill key={s}>{s}</Pill>
                  ))}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
