"use client";

import { motion, useReducedMotion } from "motion/react";
import { profile } from "@/data/resume";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative pt-28 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Animated gradient orbs anchored to hero */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[680px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent)",
            filter: "blur(40px)",
          }}
          animate={
            reduce ? undefined : { y: [0, 20, 0], opacity: [0.85, 1, 0.85] }
          }
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-20 right-[-10%] h-[360px] w-[460px] rounded-full"
          style={{
            background:
              "radial-gradient(closest-side, rgba(34,211,238,0.25), transparent)",
            filter: "blur(40px)",
          }}
          animate={
            reduce ? undefined : { y: [0, -16, 0], opacity: [0.7, 1, 0.7] }
          }
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Status pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/[0.06] px-3 py-1 text-xs font-mono uppercase tracking-wider text-emerald-300"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
          {profile.status}
        </motion.div>

        {/* Name + role */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          <span className="text-[var(--text)]">{profile.name}</span>
          <br />
          <span className="text-gradient">{profile.role}</span>
        </motion.h1>

        {/* Blurb */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-[var(--text-muted)]"
        >
          {profile.blurb}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <a
            href="#builds"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium transition hover:bg-white/90"
          >
            <span>Selected builds</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-5 py-2.5 text-sm text-[var(--text)] transition hover:bg-white/[0.05]"
          >
            <span className="font-mono text-[var(--text-muted)]">$</span>
            <span>get in touch</span>
            <span className="cursor-blink text-[var(--text-muted)]">▌</span>
          </a>
        </motion.div>

        {/* Meta strip — handle, location, links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]"
        >
          <MetaCell label="Handle" value={profile.handle} mono />
          <MetaCell label="Based" value={profile.location} />
          <MetaCell label="Github" value="@Kyrrui" href={profile.links.github} mono />
          <MetaCell label="Farcaster" value="@kyrrui" href={profile.links.farcaster} mono />
        </motion.div>
      </div>
    </section>
  );
}

function MetaCell({
  label,
  value,
  href,
  mono,
}: {
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  const content = (
    <div className="bg-[var(--bg)] px-5 py-4 transition-colors hover:bg-white/[0.02]">
      <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-faint)]">
        {label}
      </div>
      <div
        className={`mt-1 text-sm ${
          mono ? "font-mono" : ""
        } text-[var(--text)] truncate`}
      >
        {value}
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="group block">
        {content}
      </a>
    );
  }
  return content;
}
