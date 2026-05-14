import { profile } from "@/data/resume";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function Contact() {
  const links = [
    { label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { label: "GitHub", value: "@Kyrrui", href: profile.links.github },
    { label: "Twitter", value: "@kyrrui", href: profile.links.twitter },
    { label: "Farcaster", value: "@kyrrui", href: profile.links.farcaster },
  ];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <SectionHeader
          index="05 /"
          title="Let's build something"
          caption="Best reached by email or DM. I'm especially interested in agentic infra, novel cryptographic UX, and anything where the on-chain and AI sides actually need each other."
        />

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noreferrer"
              className="group bg-[var(--bg)] p-6 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                  {l.label}
                </div>
                <span className="text-[var(--text-muted)] transition group-hover:translate-x-0.5 group-hover:text-white">
                  ↗
                </span>
              </div>
              <div className="mt-3 font-mono text-base text-[var(--text)]">
                {l.value}
              </div>
            </a>
          ))}
        </div>

        <footer className="mt-20 flex flex-col gap-3 border-t border-white/[0.05] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--text-faint)]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
            <span>
              Block <span className="text-[var(--text-muted)]">#latest</span> ·
              built with Next.js, Tailwind, and motion
            </span>
          </div>
          <div className="font-mono text-xs text-[var(--text-faint)]">
            © {new Date().getFullYear()} {profile.name}
          </div>
        </footer>
      </div>
    </section>
  );
}
