"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// A faint wireframe that assembles as you scroll. Each box has a
// static "blueprint" outline (always faintly visible) plus a brighter
// stroke on top whose pathLength is driven by page scroll progress —
// so a line travels around and "builds" the box the further you scroll.
// Purely decorative; respects prefers-reduced-motion.

type Block = {
  x: number;
  y: number;
  w: number;
  h: number;
  /** [startProgress, endProgress] over total page scroll (0..1). */
  range: [number, number];
  accent?: boolean;
};

// viewBox is 1200x800, sliced to cover the viewport.
const BLOCKS: Block[] = [
  { x: 70, y: 60, w: 150, h: 110, range: [0.0, 0.16] },
  { x: 250, y: 90, w: 110, h: 90, range: [0.04, 0.2], accent: true },
  { x: 900, y: 70, w: 180, h: 130, range: [0.0, 0.18] },
  { x: 1010, y: 230, w: 90, h: 90, range: [0.1, 0.26] },
  { x: 130, y: 240, w: 120, h: 140, range: [0.12, 0.3], accent: true },
  { x: 470, y: 320, w: 200, h: 120, range: [0.2, 0.4] },
  { x: 760, y: 360, w: 130, h: 100, range: [0.26, 0.44] },
  { x: 60, y: 440, w: 160, h: 120, range: [0.34, 0.54] },
  { x: 980, y: 460, w: 150, h: 150, range: [0.36, 0.56], accent: true },
  { x: 320, y: 540, w: 110, h: 110, range: [0.46, 0.64] },
  { x: 600, y: 560, w: 180, h: 130, range: [0.5, 0.7] },
  { x: 840, y: 640, w: 120, h: 90, range: [0.58, 0.78] },
  { x: 150, y: 660, w: 140, h: 110, range: [0.62, 0.82], accent: true },
  { x: 470, y: 690, w: 160, h: 90, range: [0.72, 0.92] },
];

// Sharp rectangle as an explicit path — pathLength draw is rock solid
// on <path> in motion (unlike <rect rx=...>).
function rectPath(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${
    y + h
  } Z`;
}

export function BuildingBlocks() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {BLOCKS.map((b, i) => (
        <BlockRect
          key={i}
          block={b}
          reduce={!!reduce}
          progress={scrollYProgress}
        />
      ))}
    </svg>
  );
}

function BlockRect({
  block,
  reduce,
  progress,
}: {
  block: Block;
  reduce: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const { x, y, w, h, range, accent } = block;
  const d = rectPath(x, y, w, h);

  // Hooks always called; reduced-motion just swaps static values in.
  const drawn = useTransform(progress, range, [0, 1], { clamp: true });
  const cornerOpacity = useTransform(drawn, [0.85, 1], [0, 1]);

  const bright = accent
    ? "rgba(139,92,246,0.7)"
    : "rgba(255,255,255,0.3)";
  const ghost = accent
    ? "rgba(139,92,246,0.16)"
    : "rgba(255,255,255,0.08)";

  return (
    <g>
      {/* Always-visible blueprint outline */}
      <path d={d} stroke={ghost} strokeWidth={1.5} />

      {/* Scroll-built bright stroke on top */}
      <motion.path
        d={d}
        stroke={bright}
        strokeWidth={1.75}
        strokeLinecap="round"
        style={{ pathLength: reduce ? 1 : drawn }}
      />

      {accent && (
        <motion.circle
          cx={x + w}
          cy={y}
          r={3}
          fill="rgba(139,92,246,0.7)"
          style={{ opacity: reduce ? 0.7 : cornerOpacity }}
        />
      )}
    </g>
  );
}
