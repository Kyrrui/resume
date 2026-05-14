import { skills, skillsFlat } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="04 /"
          title="Stack"
          caption="What I reach for. Roughly grouped — strong opinions, loosely held."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(skills).map(([group, items], i) => (
            <Reveal key={group} delay={i * 0.04}>
              <div className="bg-[var(--bg)] p-6 transition-colors hover:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                    {group}
                  </h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <li
                      key={s}
                      className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-xs text-[var(--text)] transition hover:border-violet-400/30 hover:bg-violet-400/[0.06]"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Ticker */}
        <div className="mt-12 overflow-hidden border-y border-white/[0.05] py-5">
          <div className="flex w-max gap-10 scroll-x">
            {[...skillsFlat, ...skillsFlat].map((s, i) => (
              <span
                key={`${s}-${i}`}
                className="font-mono text-sm uppercase tracking-[0.25em] text-[var(--text-faint)]"
              >
                {s} <span className="text-[var(--violet)]/40">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
