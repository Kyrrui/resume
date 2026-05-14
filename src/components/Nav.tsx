"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "builds", label: "Builds" },
  { id: "hackathons", label: "Hackathons" },
  { id: "work", label: "Work" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState<string>("builds");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[var(--bg)]/70 border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2 font-mono text-sm tracking-tight text-[var(--text)]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          <span className="text-[var(--text-muted)]">0x</span>
          <span>kyrrui</span>
          <span className="text-[var(--text-faint)]">.eth</span>
        </a>

        <ul className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.02] p-1">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`relative inline-block rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  active === item.id
                    ? "text-white"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                {active === item.id && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.08] to-transparent border border-white/[0.08]" />
                )}
                <span className="relative">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          className="group hidden md:inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-sm text-white transition hover:bg-white/[0.06]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
          Get in touch
        </a>
      </div>
    </nav>
  );
}
