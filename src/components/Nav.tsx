"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/resume";
import recentRepos from "@/data/recent-repos.json";

const items = [
  { id: "building", label: "Building" },
  { id: "hackathons", label: "Hackathons" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

// Sum the 30-day window's per-day series — same number the Building
// section's chart shows for "30 days". Single source of truth, computed
// at build time. Falls back to null if the JSON hasn't been populated
// yet (e.g. dev environment without GITHUB_TOKEN).
const monthlyCommits: number | null = (() => {
  const totals = (
    recentRepos as {
      windows?: Record<string, { totalByDay?: number[] }>;
    }
  ).windows?.["30"]?.totalByDay;
  if (!totals || totals.length === 0) return null;
  return totals.reduce((a, b) => a + b, 0);
})();

export function Nav() {
  const [active, setActive] = useState<string>("building");
  const [scrolled, setScrolled] = useState(false);
  // True once the user has scrolled past the hero name — drives the
  // cross-fade from the "Kyrrui · commits" brand to the persistent
  // identity (mini portrait + Kyle Bryant + role tagline). Keeps the
  // candidate's identity visible in the tab strip when someone tabs
  // back to the page after browsing others.
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setPastHero(y > 220);
    };
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
        {/* Brand slot — two overlapping items cross-faded on scroll.
            At top: the github handle + commit count. Past the hero: a
            persistent mini-identity (portrait + name + role) so the tab
            title always announces who this site belongs to. */}
        <div className="relative flex min-h-[40px] items-center">
          <a
            href="https://github.com/Kyrrui"
            target="_blank"
            rel="noreferrer"
            aria-hidden={pastHero}
            className={`flex items-center gap-2 font-mono text-sm tracking-tight text-[var(--text)] transition-opacity duration-500 hover:text-white ${
              pastHero ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
            {monthlyCommits !== null ? (
              <span
                className="text-[var(--text-muted)]"
                title="Commits over the last 30 days across the top recent repos (same source as the Currently Building chart)."
              >
                {monthlyCommits}{" "}
                <span className="text-[var(--text-faint)]">
                  recent commit{monthlyCommits === 1 ? "" : "s"}
                </span>
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">GitHub</span>
            )}
          </a>

          <a
            href="#top"
            aria-hidden={!pastHero}
            aria-label={`Back to top · ${profile.name}, ${profile.role}`}
            className={`absolute inset-y-0 left-0 flex items-center gap-4 transition-opacity duration-500 ${
              pastHero ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/[0.1] bg-white/[0.04]">
              <Image
                src="/prof_image_2.jpg"
                alt=""
                width={96}
                height={96}
                className="h-full w-full origin-[50%_28%] scale-[1.25] object-cover"
              />
            </span>
            <span className="flex flex-col leading-tight whitespace-nowrap">
              <span className="font-display text-base md:text-lg font-semibold tracking-tight text-[var(--text)]">
                {profile.name}
              </span>
              <span className="mt-0.5 font-mono text-[11px] md:text-xs uppercase tracking-[0.15em] text-[var(--text-muted)]">
                {/* Shortened tagline — drops "Builder ·" so the nav strip
                    isn't visually suffocated. Hero still uses profile.role
                    for the full version. */}
                {profile.role.replace(/^Builder · /, "")}
              </span>
            </span>
          </a>
        </div>

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
          className="group inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-4 py-1.5 text-sm text-white transition hover:bg-white/[0.06]"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-400" />
          Get in touch
        </a>
      </div>
    </nav>
  );
}
