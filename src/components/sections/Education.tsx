import { education } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

export function Education() {
  return (
    <section id="education" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="05 /"
          title="Education"
          caption="Where the foundations got built."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          {education.map((e, i) => (
            <Reveal key={e.school + i} delay={i * 0.05}>
              <div className="bg-[var(--bg)] p-6 md:p-7">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl font-semibold tracking-tight">
                    {e.school}
                  </h3>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {e.period}
                  </span>
                </div>

                <p className="mt-2 text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
                  {e.degree}
                  {e.notes && (
                    <span className="text-[var(--text-faint)]"> · {e.notes}</span>
                  )}
                </p>

                {e.honors && e.honors.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-1.5">
                    {e.honors.map((h) => (
                      <li
                        key={h}
                        className="rounded-md border border-amber-300/15 bg-amber-300/[0.04] px-2.5 py-1 text-xs text-amber-100/90"
                      >
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
