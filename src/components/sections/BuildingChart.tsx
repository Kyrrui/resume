"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Repo = {
  name: string;
  language: { name: string; color: string | null } | null;
  commitsByDay: number[];
};

type ChartData = {
  windowDays: number;
  days: string[];
  totalByDay: number[];
};

// Curated palette — each line gets a distinct hue regardless of the repo's
// language (GitHub gives multiple TypeScript repos the same color, which
// would collapse into one indistinguishable line).
const LINE_COLORS = ["#a78bfa", "#22d3ee", "#f59e0b", "#34d399"];

export function BuildingChart({
  chart,
  repos,
}: {
  chart: ChartData;
  repos: Repo[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Scroll progress through the chart wrapper: 0 when the wrapper's TOP
  // touches the viewport's BOTTOM (just entering), 1 when the wrapper's
  // BOTTOM touches the viewport's TOP (just leaving).
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  // Map the middle portion of the scroll range to a 0→1 line-drawing
  // progress. Outside that window the lines stay at their endpoints.
  const drawProgress = useTransform(
    scrollYProgress,
    [0.15, 0.7],
    [0, 1],
    { clamp: true }
  );

  if (!chart || chart.days.length === 0) return null;

  // SVG geometry — viewBox space, not pixels. Tailwind sizes the wrapper.
  const W = 600;
  const H = 180;
  const padL = 36;
  const padR = 12;
  const padT = 12;
  const padB = 28;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const n = chart.days.length;
  const xAt = (i: number) =>
    n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW;

  // Y scaled to the global max across total + per-repo.
  const allValues = [
    ...chart.totalByDay,
    ...repos.flatMap((r) => r.commitsByDay),
  ];
  const rawMax = Math.max(1, ...allValues);
  const yMax = niceCeil(rawMax);
  const yAt = (v: number) => padT + plotH - (v / yMax) * plotH;

  const ticks = [0, Math.round(yMax / 2), yMax];

  const formatShortDate = (iso: string) => {
    const d = new Date(iso + "T00:00:00Z");
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };
  const xTicks = [
    { i: 0, label: formatShortDate(chart.days[0]) },
    {
      i: Math.floor((n - 1) / 2),
      label: formatShortDate(chart.days[Math.floor((n - 1) / 2)]),
    },
    { i: n - 1, label: formatShortDate(chart.days[n - 1]) },
  ];

  return (
    <motion.div
      ref={wrapperRef}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative mb-10 rounded-2xl border border-white/[0.07] bg-white/[0.015] p-5 md:p-7"
    >
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
            Commits per day · last 30 days
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            {chart.totalByDay.reduce((a, b) => a + b, 0)}{" "}
            <span className="text-[var(--text-muted)] font-normal text-lg">
              total
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {repos.map((r, i) => (
            <li
              key={r.name}
              className="flex items-center gap-1.5 text-[var(--text)]"
            >
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
              />
              <span className="font-mono text-[var(--text-muted)] truncate max-w-[140px]">
                {r.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Line chart of commits per day for the last ${chart.windowDays} days, with a separate line per repo and a total line.`}
      >
        {/* Y-axis gridlines + tick labels */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yAt(t)}
              y2={yAt(t)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <text
              x={padL - 8}
              y={yAt(t)}
              fill="rgba(255,255,255,0.35)"
              fontSize={10}
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              textAnchor="end"
              dominantBaseline="middle"
            >
              {t}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xTicks.map((t, i) => (
          <text
            key={i}
            x={xAt(t.i)}
            y={H - 8}
            fill="rgba(255,255,255,0.35)"
            fontSize={10}
            fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
            textAnchor={
              i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"
            }
          >
            {t.label}
          </text>
        ))}

        {/* Per-repo lines (total is shown as a number above, not as a line). */}
        {repos.map((r, i) => (
          <ScrollPath
            key={r.name}
            d={buildPath(r.commitsByDay, xAt, yAt)}
            stroke={LINE_COLORS[i % LINE_COLORS.length]}
            strokeWidth={1.75}
            opacity={1}
            pathLength={drawProgress}
          />
        ))}
      </svg>
    </motion.div>
  );
}

function ScrollPath({
  d,
  stroke,
  strokeWidth,
  opacity,
  pathLength,
}: {
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  pathLength: ReturnType<typeof useTransform<number, number>>;
}) {
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={opacity}
      style={{ pathLength }}
    />
  );
}

function buildPath(
  values: number[],
  xAt: (i: number) => number,
  yAt: (v: number) => number
): string {
  if (values.length === 0) return "";
  if (values.length === 1) {
    const x = xAt(0);
    const y = yAt(values[0]);
    return `M ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  return values
    .map((v, i) => {
      const cmd = i === 0 ? "M" : "L";
      return `${cmd} ${xAt(i).toFixed(2)} ${yAt(v).toFixed(2)}`;
    })
    .join(" ");
}

function niceCeil(n: number): number {
  if (n <= 1) return 1;
  if (n <= 2) return 2;
  if (n <= 5) return 5;
  if (n <= 10) return 10;
  return Math.ceil(n / 5) * 5;
}
