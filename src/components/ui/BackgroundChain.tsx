"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// A muted "blockchain" that constructs itself down the entire page as
// you scroll. Numbered square blocks, linked by elbow connectors,
// snaking left<->right all the way down. Nothing is drawn at the very
// top — the first block only starts appearing once you begin to
// scroll. Lives in page flow (full document height) behind all
// content. Decorative; respects prefers-reduced-motion.

// Horizontal rows of blocks. Within a row the chain runs straight
// left<->right (lines only connect adjacent blocks, no bends). At a
// row end it drops straight down to the row below — the *block* is
// the corner, so direction only ever changes at a block, and only
// at row ends (not at every block).
const PER_ROW = 4;
const ROWS = 12;
const N = PER_ROW * ROWS;

// Columns span the full page width.
const COLS = [12, 36.67, 61.33, 86];
// First row sits right below the hero/profile card.
const START_Y = 13;
const END_Y = 95;
const ROW_GAP = (END_Y - START_Y) / (ROWS - 1);

// Boustrophedon: even rows go left->right, odd rows right->left, so
// the end of one row sits directly above the start of the next and
// the connecting drop is a single straight vertical.
function nodeAt(i: number) {
  const row = Math.floor(i / PER_ROW);
  const k = i % PER_ROW;
  const col = row % 2 === 0 ? k : PER_ROW - 1 - k;
  return { x: COLS[col], y: START_Y + row * ROW_GAP };
}

// Scroll-progress window the whole chain builds across. Starts > 0 so
// the chain is invisible while you're at the very top of the page.
const REVEAL_START = 0.03;
const REVEAL_SPAN = 0.92;
const SEG_DUR = 0.04;
const BLK_DUR = 0.035;

const BASE_BLOCK = 34124;

type Node = {
  x: number;
  y: number;
  label: string;
  accent: boolean;
  /** Scroll progress at which this node begins to reveal. */
  at: number;
};

const NODES: Node[] = Array.from({ length: N }, (_, i) => {
  const { x, y } = nodeAt(i);
  return {
    x,
    y,
    label: `#${BASE_BLOCK - i}`,
    accent: i % 5 === 2,
    at: REVEAL_START + (i / N) * REVEAL_SPAN,
  };
});

export function BackgroundChain() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Connectors. preserveAspectRatio=none lets % coords map to the
          full layer; only straight axis-aligned lines, so the stretch
          is irrelevant. non-scaling-stroke keeps them hairline. */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        {NODES.map((node, i) =>
          i === 0 ? null : (
            <Segment
              key={i}
              from={NODES[i - 1]}
              to={node}
              reduce={!!reduce}
              progress={scrollYProgress}
            />
          )
        )}
      </svg>

      {NODES.map((node, i) => (
        <Block
          key={i}
          node={node}
          reduce={!!reduce}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function Segment({
  from,
  to,
  reduce,
  progress,
}: {
  from: Node;
  to: Node;
  reduce: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  // Single straight segment: horizontal within a row, vertical at a
  // row turn (consecutive nodes always share either y or x).
  const d = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  // Solid line that fades in just before its destination block lands
  // (opacity, not pathLength — pathLength under the heavy non-uniform
  // viewBox scaling renders as a dashed artifact).
  const opacity = useTransform(
    progress,
    [to.at - SEG_DUR, to.at],
    [0, 1],
    { clamp: true }
  );
  return (
    <motion.path
      d={d}
      stroke={
        to.accent ? "rgba(167,139,250,0.16)" : "rgba(255,255,255,0.08)"
      }
      strokeWidth={1}
      vectorEffect="non-scaling-stroke"
      style={{ opacity: reduce ? 1 : opacity }}
    />
  );
}

function Block({
  node,
  reduce,
  progress,
}: {
  node: Node;
  reduce: boolean;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(
    progress,
    [node.at, node.at + BLK_DUR],
    [0, 1],
    { clamp: true }
  );
  const ty = useTransform(progress, [node.at, node.at + BLK_DUR], [14, 0], {
    clamp: true,
  });
  const scale = useTransform(
    progress,
    [node.at, node.at + BLK_DUR],
    [0.92, 1],
    { clamp: true }
  );

  return (
    <div
      className="absolute"
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        className="grid place-items-center"
        style={{
          width: "clamp(64px, 8.5vw, 110px)",
          height: "clamp(64px, 8.5vw, 110px)",
          y: reduce ? 0 : ty,
          scale: reduce ? 1 : scale,
          opacity: reduce ? 1 : opacity,
          border: `1px solid ${
            node.accent
              ? "rgba(167,139,250,0.22)"
              : "rgba(255,255,255,0.10)"
          }`,
          background: node.accent
            ? "rgba(167,139,250,0.022)"
            : "rgba(255,255,255,0.014)",
        }}
      >
        <span
          className="font-mono"
          style={{
            fontSize: "clamp(9px, 1.1vw, 13px)",
            letterSpacing: "0.04em",
            color: node.accent
              ? "rgba(167,139,250,0.34)"
              : "rgba(255,255,255,0.16)",
          }}
        >
          {node.label}
        </span>
      </motion.div>
    </div>
  );
}
