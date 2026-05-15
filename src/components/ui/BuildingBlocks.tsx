"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// A faint wireframe that assembles as you scroll: each box's outline is
// a stroke whose pathLength is driven by page scroll progress, so a line
// travels out and closes into a box. Ranges are staggered down the page
// so the scene "builds" the further you scroll. Purely decorative.

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
  { x: 900, y: 70, w: 180, h: 130, range: [0.02, 0.18] },
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

  // All hooks are called unconditionally; reduced-motion just swaps in
  // static values when wiring up the style props.
  const drawn = useTransform(progress, range, [0, 1], { clamp: true });
  const drawnOpacity = useTransform(drawn, [0, 0.12, 1], [0, 1, 1]);
  const cornerOpacity = useTransform(drawn, [0.85, 1], [0, 1]);

  const stroke = accent
    ? "rgba(139,92,246,0.55)"
    : "rgba(255,255,255,0.22)";

  return (
    <g>
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        stroke={stroke}
        strokeWidth={1.75}
        style={{
          pathLength: reduce ? 1 : drawn,
          opacity: reduce ? 0.6 : drawnOpacity,
        }}
      />
      {/* Corner tick — a tiny blueprint accent that pops once the box
          is essentially complete. */}
      {accent && (
        <motion.circle
          cx={x + w}
          cy={y}
          r={2.5}
          fill="rgba(139,92,246,0.5)"
          style={{ opacity: reduce ? 0.5 : cornerOpacity }}
        />
      )}
    </g>
  );
}
