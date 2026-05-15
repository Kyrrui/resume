"use client";

import { useEffect, useState } from "react";

const items = [
  { id: "building", label: "Building" },
  { id: "builds", label: "Builds" },
  { id: "hackathons", label: "Hackathons" },
  { id: "work", label: "Work" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const GITHUB_USER = "Kyrrui";

export function Nav() {
  const [active, setActive] = useState<string>("building");
  const [scrolled, setScrolled] = useState(false);
  const monthlyContributions = useMonthlyContributions(GITHUB_USER);

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
          href="https://github.com/Kyrrui"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 font-mono text-sm tracking-tight text-[var(--text)] transition-colors hover:text-white"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          <span>Kyrrui</span>
          {monthlyContributions !== null && (
            <>
              <span className="text-[var(--text-faint)]">·</span>
              <span
                className="text-[var(--text-muted)]"
                title="GitHub contributions (mostly commits, also PRs / issues / reviews) in the last 30 days"
              >
                {monthlyContributions}{" "}
                <span className="text-[var(--text-faint)]">
                  recent commit{monthlyContributions === 1 ? "" : "s"}
                </span>
              </span>
            </>
          )}
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

// Sums GitHub "contributions" (commits, PRs, issues opened, reviews) over the last 30 days.
// Source: github-contributions-api.jogruber.de — unofficial mirror of the contributions graph.
// Cached in localStorage for 1h to be a good citizen. If the request fails, the nav silently
// falls back to just the name.
const CACHE_KEY = "gh-monthly-contributions";
const CACHE_TTL_MS = 60 * 60 * 1000;
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

type ContributionsResponse = {
  contributions: { date: string; count: number }[];
};

async function fetchMonthlyContributions(username: string): Promise<number> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`
  );
  if (!res.ok) throw new Error(`Contributions API ${res.status}`);
  const data: ContributionsResponse = await res.json();
  const cutoff = Date.now() - MONTH_MS;
  return (data.contributions || [])
    .filter((d) => new Date(d.date).getTime() >= cutoff)
    .reduce((sum, d) => sum + (d.count || 0), 0);
}

function useMonthlyContributions(username: string): number | null {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    try {
      const raw = localStorage.getItem(`${CACHE_KEY}:${username}`);
      if (raw) {
        const cached = JSON.parse(raw) as { count: number; fetchedAt: number };
        if (Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
          setCount(cached.count);
          return;
        }
      }
    } catch {
      // ignore cache parse errors
    }

    fetchMonthlyContributions(username)
      .then((n) => {
        if (cancelled) return;
        setCount(n);
        try {
          localStorage.setItem(
            `${CACHE_KEY}:${username}`,
            JSON.stringify({ count: n, fetchedAt: Date.now() })
          );
        } catch {
          // ignore storage errors
        }
      })
      .catch(() => {
        // leave count as null — nav just shows the name
      });

    return () => {
      cancelled = true;
    };
  }, [username]);

  return count;
}
