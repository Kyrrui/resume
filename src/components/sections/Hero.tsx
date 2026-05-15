"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/resume";

// Coin geometry — front/back faces sit at ±COIN_HALF_THICKNESS, rim layers stack between.
// 18px total thickness on a 256px disc ≈ 7% ratio (real silver-dollar proportions).
const COIN_HALF_THICKNESS = 9; // px
// Each rim layer uses a CSS border (cheap to paint) instead of a masked
// gradient (very expensive on mobile GPUs). With cheaper paint we can
// drop the layer count without losing visual smoothness on the cylinder
// side. 10 layers across 18px ≈ 2px per layer — still dense enough to
// read as a solid cylinder when the coin is tilted.
const RIM_LAYERS = 10;

// Halo size while the coin is showing (mid-flip, at rest on the coin
// face, or hovered into the coin face): kept tight so the spinning coin
// doesn't drag a giant bloom around with it. Bloomed back to (1, 1)
// when the portrait is revealed — that's the moment the halo gets to
// breathe.
const SMALL_HALO_SCALE = 0.6;
const SMALL_HALO_OPACITY = 0.4;

export function Hero() {
  const reduce = useReducedMotion();
  // Front-face state. Starts with the silver coin shown so the page
  // loads on the coin face; a short beat later the spin kicks in and
  // eventually dissolves into the real portrait when it settles.
  const [isFlipping, setIsFlipping] = useState(true);

  // Tracked rotation (drives the coin spin via style={{ rotateY }}).
  const rotateY = useMotionValue(0);

  // Halo motion values. Start small/dim — the page loads on the coin
  // face, where the halo should be tight. The halo only blooms to full
  // size when the portrait is revealed at the end of the spin.
  const haloScale = useMotionValue(SMALL_HALO_SCALE);
  const haloOpacity = useMotionValue(SMALL_HALO_OPACITY);

  // Rim opacity: 1 while the coin is flipping (silver edge visible at
  // tilted angles), fades to 0 alongside the coin → portrait dissolve so
  // the rim and the coin face disappear together — leaving a clean
  // portrait, not a portrait-inside-a-silver-rim.
  const rimOpacity = useMotionValue(1);

  // Front-face cross-fade is now motion-driven so durations can vary by
  // transition reason: instant when a flip starts, 2.5s when the spin
  // dissolves to portrait, 500ms for hover toggles at rest.
  const coinOpacity = useMotionValue(1);
  const profileOpacity = useMotionValue(0);

  // Hover state + ref. The ref is read inside flip() so we know whether
  // the user is currently hovering when the spin ends (and therefore
  // whether to skip the slow dissolve).
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const setHover = (v: boolean) => {
    isHoveredRef.current = v;
    setIsHovered(v);
  };

  const flip = async () => {
    setIsFlipping(true);
    // Snap to the coin face (no fade) for the start of the spin.
    rimOpacity.set(1);
    coinOpacity.set(1);
    profileOpacity.set(0);
    // Tuck the halo down as the spin begins — same gentle glide as the
    // bloom on settle, but in reverse. Makes click-to-reflip feel as
    // deliberate as the original landing.
    animate(haloScale, SMALL_HALO_SCALE, { duration: 1.25, ease: "easeOut" });
    animate(haloOpacity, SMALL_HALO_OPACITY, { duration: 1.25, ease: "easeOut" });

    if (reduce) {
      rotateY.set(0);
      setIsFlipping(false);
      if (!isHoveredRef.current) {
        rimOpacity.set(0);
        coinOpacity.set(0);
        profileOpacity.set(1);
        haloScale.set(1);
        haloOpacity.set(1);
      }
      return;
    }
    // Single deliberate rotation at constant velocity. ~180°/sec, so
    // the back face (ETH) gets its moment in the middle of the flip
    // before the coin lands on the front face again.
    rotateY.set(360);
    await animate(rotateY, 0, {
      duration: 2,
      ease: "linear",
    });
    setIsFlipping(false);
    // If the user is hovering when the spin lands, keep the coin face
    // visible (and the halo tight). Otherwise dissolve to portrait AND
    // bloom the halo to full size in lockstep — the moment of reveal.
    // Keep the landing dissolve graceful even though the spin is now
    // fast — snappy flip, deliberate reveal into the real portrait.
    if (!isHoveredRef.current) {
      animate(rimOpacity, 0, { duration: 2.5, ease: "easeOut" });
      animate(coinOpacity, 0, { duration: 2.5, ease: "easeOut" });
      animate(profileOpacity, 1, { duration: 2.5, ease: "easeOut" });
      animate(haloScale, 1, { duration: 2.5, ease: "easeOut" });
      animate(haloOpacity, 1, { duration: 2.5, ease: "easeOut" });
    }
  };

  // Hover at rest: cross-fade between the coin face and the portrait. Only
  // active when not currently flipping (during a flip the coin face is
  // pinned visible by flip()).
  useEffect(() => {
    if (isFlipping) return;
    // Hover toggles the front face only — the halo stays at its
    // settled (full) size; it just isn't a hover-state cue.
    const d = { duration: 0.25, ease: "easeOut" as const };
    if (isHovered) {
      animate(coinOpacity, 1, d);
      animate(profileOpacity, 0, d);
      animate(rimOpacity, 1, d);
    } else {
      animate(coinOpacity, 0, d);
      animate(profileOpacity, 1, d);
      animate(rimOpacity, 0, d);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered]);

  // Wait for the three coin images to finish decoding before starting the
  // initial flip — otherwise the spin can fire while the front face is
  // still blank. onError also counts so a failed load can't hang the
  // animation forever.
  const TOTAL_COIN_IMAGES = 3;
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const allImagesLoaded = imagesLoaded >= TOTAL_COIN_IMAGES;
  const handleImageReady = () => setImagesLoaded((c) => c + 1);

  useEffect(() => {
    if (!allImagesLoaded) return;
    // Show the front face for half a second once everything's painted,
    // then kick off the initial flip — reads as someone tossing the coin.
    const t = setTimeout(() => {
      flip();
    }, 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allImagesLoaded]);

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
        <div className="grid items-center gap-10 md:gap-12 md:grid-cols-[1fr_auto]">
          <div>
            {/* Name + role */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="font-display text-5xl md:text-7xl font-semibold tracking-tight leading-[1.05]"
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
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.02] px-5 py-2.5 text-sm text-[var(--text)] transition hover:bg-white/[0.05]"
              >
                <span className="font-mono text-[var(--text-muted)]">$</span>
                <span>get in touch</span>
                <span className="cursor-blink text-[var(--text-muted)]">▌</span>
              </a>
            </motion.div>
          </div>

          {/* Profile token — 3D coin: photo on the front, Ethereum logo on the back */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative order-first justify-self-center md:order-none md:justify-self-end [perspective:1200px]"
          >
            {/* Soft gradient halo — acts as the coin's shadow. Scale and
                opacity are driven by the rotation's instantaneous velocity,
                so it grows when the coin spins fast (token "high in the
                air") and shrinks to a tight pool when the spin settles
                ("low to the ground"). */}
            <motion.div
              aria-hidden
              style={{ scale: haloScale, opacity: haloOpacity }}
              className="pointer-events-none absolute -inset-6 rounded-full bg-gradient-to-br from-violet-500/30 via-cyan-400/20 to-indigo-500/20 blur-2xl"
            />

            {/* Clickable, motion-controlled rotator. rotateY is driven by a
                motion value so its velocity is observable for the halo. */}
            <motion.button
              type="button"
              onClick={flip}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              style={{ rotateY }}
              aria-label={`${profile.name} — flip the token`}
              className="coin-spin relative size-40 md:size-64 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60"
            >
              {/* Rim — stacked silver rings along Z. The visible ring is
                  inset 2px from each layer's outer edge so the face always
                  has margin to fully cover the rim when viewed head-on
                  (front OR back). Head-on the rim is invisible; only when
                  the coin tilts does the cylinder side appear. Wrapped in
                  a motion.div so the whole rim can dissolve alongside the
                  coin → portrait cross-fade. */}
              <motion.div
                aria-hidden
                style={{ opacity: rimOpacity }}
                className="pointer-events-none absolute inset-0 [transform-style:preserve-3d]"
              >
                {Array.from({ length: RIM_LAYERS }).map((_, i) => {
                  const z =
                    -COIN_HALF_THICKNESS +
                    (i * (COIN_HALF_THICKNESS * 2)) / (RIM_LAYERS - 1);
                  // Each rim layer is a transparent disc with a thick
                  // silver border — the border IS the visible cylinder
                  // edge. inset-[2px] tucks the outer edge of the ring
                  // 2px inside the face so the rim never peeks past
                  // the face head-on. With box-sizing: border-box (the
                  // Tailwind default) the 10px border draws inward, so
                  // visible ring radius matches the old mask version.
                  return (
                    <div
                      key={i}
                      aria-hidden
                      className="pointer-events-none absolute inset-[2px] rounded-full border-[10px] border-[#cbd5e1]"
                      style={{ transform: `translateZ(${z}px)` }}
                    />
                  );
                })}
              </motion.div>

              {/* Front face — two stacked images whose opacities are driven
                  by motion values so we can use different durations for
                  different triggers: instant at the start of a flip,
                  2.5s on the spin-landing dissolve, and 500ms for hover
                  toggles at rest. */}
              <div
                className="absolute inset-0 overflow-hidden rounded-full [backface-visibility:hidden] shadow-[0_20px_60px_-15px_rgba(139,92,246,0.45)]"
                style={{ transform: `translateZ(${COIN_HALF_THICKNESS}px)` }}
              >
                <motion.div
                  style={{ opacity: coinOpacity }}
                  className="pointer-events-none absolute inset-0"
                >
                  <Image
                    src="/COIN_PROF_NO_BACKGROUND.png"
                    alt={`${profile.name} — coin design`}
                    width={320}
                    height={320}
                    priority
                    onLoad={handleImageReady}
                    onError={handleImageReady}
                    className="size-full scale-[1.05] rounded-full object-cover"
                  />
                </motion.div>
                <motion.div
                  style={{ opacity: profileOpacity }}
                  className="pointer-events-none absolute inset-0"
                >
                  <Image
                    src="/prof_image_2.jpg"
                    alt={`${profile.name} — profile photo`}
                    width={320}
                    height={320}
                    priority
                    onLoad={handleImageReady}
                    onError={handleImageReady}
                    // Zoom + anchor the scale at the face so the portrait
                    // composition matches the coin design (head + upper
                    // shoulders filling the disc, no skyline at the edges).
                    className="size-full origin-[50%_28%] scale-[1.25] rounded-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Back face — Ethereum token artwork. No decorative ring; image fills edge-to-edge. */}
              <div
                className="absolute inset-0 overflow-hidden rounded-full [backface-visibility:hidden] shadow-[0_20px_60px_-15px_rgba(139,92,246,0.45)]"
                style={{
                  transform: `translateZ(${-COIN_HALF_THICKNESS}px) rotateY(180deg)`,
                }}
              >
                <Image
                  src="/ETH_TOKEN_NO_BACKGROUND.png"
                  alt="Ethereum token"
                  width={320}
                  height={320}
                  priority
                  onLoad={handleImageReady}
                  onError={handleImageReady}
                  // Slight upscale: the source PNG has transparent margins
                  // around the silver disc; scaling up pushes the disc edge
                  // out to the full rounded-full crop so the rim behind is
                  // never visible head-on.
                  className="pointer-events-none size-full scale-[1.06] rounded-full object-cover"
                />
              </div>
            </motion.button>
          </motion.div>
        </div>

        {/* Meta strip — handle, location, links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015]"
        >
          <MetaCell label="Web3 since" value={profile.since} mono />
          <MetaCell label="Based" value={profile.location} />
          <MetaCell label="Currently" value={profile.currently} />
          <MetaCell
            label="LinkedIn"
            value="@kyle-c-bryant"
            href={profile.links.linkedin}
            mono
          />
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
