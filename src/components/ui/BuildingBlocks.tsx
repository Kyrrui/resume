"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// Two "towers" that construct themselves upward as you scroll. Each
// block's outline draws (lines -> box) and then a faint face settles
// in. The towers live in the page side-gutters (outside the centered
// content column) so they never sit behind body text, stay very low
// contrast, and are desktop-only. Purely decorative; respects
// prefers-reduced-motion (renders the finished state statically).

type Tower = {
  /** Left edge + column width in viewBox units (0..1200). */
  x: number;
  w: number;
  /** Block heights, bottom -> top. */
  heights: number[];
  /** Index (in heights) of the one violet accent block. */
  accent: number;
};

const BASE_Y = 782; // ground line; towers grow upward from here
const GAP = 9;

// viewBox is 1200x800 (slice). Left tower hugs x<210, right hugs
// x>990 — both clear of a centered max-w-6xl content column on the
// large screens where this is shown.
const TOWERS: Tower[] = [
  { x: 64, w: 132, heights: [72, 52, 92, 44, 66, 50], accent: 2 },
  { x: 1004, w: 140, heights: [58, 86, 46, 74, 56, 42], accent: 3 },
];

type Block = {
  x: number;
  y: number;
  w: number;
  h: number;
  accent: boolean;
  /** Build sequence position (0 = first). */
  order: number;
};

// Flatten towers into stacked blocks; build order rises row-by-row so
// both towers grow together rather than one finishing before the other.
const BLOCKS: Block[] = (() => {
  const rows = Math.max(...TOWERS.map((t) => t.heights.length));
  const out: Block[] = [];
  for (let r = 0; r < rows; r++) {
    TOWERS.forEach((t, ti) => {
      if (r >= t.heights.length) return;
      let bottom = BASE_Y;
      for (let k = 0; k < r; k++) bottom -= t.heights[k] + GAP;
      const h = t.heights[r];
      out.push({
        x: t.x,
        y: bottom - h,
        w: t.w,
        h,
        accent: r === t.accent,
        order: r * TOWERS.length + ti,
      });
    });
  }
  return out;
})();

const N = BLOCKS.length;

// Sharp rectangle as an explicit path — pathLength draw is rock solid
// on <path> in motion.
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
      className="absolute inset-0 hidden h-full w-full lg:block"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      <line
        x1={40}
        y1={BASE_Y + 1}
        x2={420}
        y2={BASE_Y + 1}
        stroke="rgba(255,255,255,0.05)"
      />
      <line
        x1={980}
        y1={BASE_Y + 1}
        x2={1170}
        y2={BASE_Y + 1}
        stroke="rgba(255,255,255,0.05)"
      />
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
  const { x, y, w, h, accent, order } = block;
  const d = rectPath(x, y, w, h);

  // Each block draws within a scroll window; windows march up the
  // towers across most of the page scroll, with slight overlap so the
  // construction flows rather than ticking block-by-block.
  const start = 0.05 + (order / N) * 0.74;
  const drawn = useTransform(progress, [start, start + 0.16], [0, 1], {
    clamp: true,
  });
  // Face settles in only once the outline is nearly closed.
  const faceMax = accent ? 0.05 : 0.022;
  const face = useTransform(drawn, [0.65, 1], [0, faceMax]);

  const stroke = accent
    ? "rgba(167,139,250,0.26)"
    : "rgba(255,255,255,0.11)";
  const ghost = accent
    ? "rgba(167,139,250,0.07)"
    : "rgba(255,255,255,0.04)";

  return (
    <g>
      {/* Faint always-on blueprint outline */}
      <path d={d} stroke={ghost} strokeWidth={1.25} />

      {/* Face fill that settles in after the outline closes */}
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "rgb(139,92,246)" : "rgb(255,255,255)"}
        style={{ opacity: reduce ? faceMax : face }}
      />

      {/* Scroll-built outline on top */}
      <motion.path
        d={d}
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        style={{ pathLength: reduce ? 1 : drawn }}
      />
    </g>
  );
}
