"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Repo = {
  /** GitHub repo name (used as the line's identity key) */
  name: string;
  /** Legend label — curated project title for enriched repos, else the
   * repo name. */
  displayTitle: string;
  language: { name: string; color: string | null } | null;
  commitsByDay: number[];
};

type ChartData = {
  windowDays: number;
  days: string[];
  totalByDay: number[];
  other?: {
    repoCount: number;
    totalCommits: number;
    byDay: number[];
  };
};

// Curated palette — each line gets a distinct hue regardless of the repo's
// language (GitHub gives multiple TypeScript repos the same color, which
// would collapse into one indistinguishable line).
const LINE_COLORS = [
  "#a78bfa", // violet
  "#22d3ee", // cyan
  "#f59e0b", // amber
  "#34d399", // mint
  "#f472b6", // pink
  "#60a5fa", // blue
  "#facc15", // yellow
  "#fb7185", // rose
];

export function BuildingChart({
  chart,
  repos,
  activeRepoName,
}: {
  chart: ChartData;
  repos: Repo[];
  /** When set, only this repo's line + total are rendered. */
  activeRepoName?: string | null;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "start start"],
  });

  const drawProgress = useTransform(
    scrollYProgress,
    [0.0, 0.5],
    [0, 1],
    { clamp: true }
  );

  if (!chart || chart.days.length === 0) return null;

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

  // Selecting a repo highlights its line — every line stays drawn, the
  // others just dim. The header total switches to the selected repo.
  const focused = activeRepoName
    ? repos.find((r) => r.name === activeRepoName) ?? null
    : null;

  // Y scaled across every line (always — all lines are always drawn).
  const allValues = [
    ...chart.totalByDay,
    ...repos.flatMap((r) => r.commitsByDay),
  ];
  const rawMax = Math.max(1, ...allValues);
  const yMax = niceCeil(rawMax);
  // Log scale keeps a 50-commit spike from flattening the rest of the
  // lines now that they're all on screen together.
  const yLogMax = Math.log10(yMax + 1);
  const yAt = (v: number) =>
    padT + plotH - (Math.log10(Math.max(0, v) + 1) / yLogMax) * plotH;

  // On a log scale sqrt(yMax+1)-1 sits at the visual midpoint.
  const midTick = Math.max(1, Math.round(Math.sqrt(yMax + 1) - 1));
  const ticks = [0, midTick, yMax];

  const windowLabel =
    chart.windowDays >= 360
      ? "last 12 months"
      : `last ${chart.windowDays} days`;

  // Short windows label each tick "Mon D"; long (year) windows just use
  // the month so a dozen labels don't collide.
  const longWindow = n > 90;
  const formatTick = (iso: string) => {
    const d = new Date(iso + "T00:00:00Z");
    return d.toLocaleString(undefined, {
      month: "short",
      ...(longWindow ? {} : { day: "numeric" }),
      timeZone: "UTC",
    });
  };
  // 3 ticks for short windows, 5 for the year so months read clearly.
  const tickCount = longWindow ? 5 : 3;
  const xTicks = Array.from({ length: tickCount }, (_, k) => {
    const i = Math.round((k / (tickCount - 1)) * (n - 1));
    return { i, label: formatTick(chart.days[i]) };
  });

  // Header total — the focused repo's count if a project is selected,
  // otherwise the window-wide total across all repos.
  const headerTotal = focused
    ? focused.commitsByDay.reduce((a, b) => a + b, 0)
    : chart.totalByDay.reduce((a, b) => a + b, 0);

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
            {focused
              ? `${focused.displayTitle} · ${windowLabel}`
              : `Commits per day · ${windowLabel}`}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            {headerTotal}{" "}
            <span className="text-[var(--text-muted)] font-normal text-lg">
              {focused ? "commits" : "total"}
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {repos.map((r, i) => {
            const dim = focused && focused.name !== r.name;
            return (
              <li
                key={r.name}
                className={`flex items-center gap-1.5 transition-opacity ${
                  dim ? "opacity-40" : "opacity-100"
                }`}
              >
                <span
                  className="h-0.5 w-4 rounded-full"
                  style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
                />
                <span className="font-mono text-[var(--text-muted)] truncate max-w-[200px]">
                  {r.displayTitle}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Line chart of commits per day for the last ${chart.windowDays} days.`}
      >
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

        {/* Non-focused lines first (dimmed), then the focused one on
            top at full strength so it reads clearly above the rest. */}
        {repos
          .map((r, i) => ({ r, i }))
          .sort((a, b) => {
            const af = focused?.name === a.r.name ? 1 : 0;
            const bf = focused?.name === b.r.name ? 1 : 0;
            return af - bf;
          })
          .map(({ r, i }) => {
            const isFocused = focused?.name === r.name;
            const dim = focused && !isFocused;
            return (
              <ScrollPath
                key={r.name}
                d={buildPath(r.commitsByDay, xAt, yAt)}
                stroke={LINE_COLORS[i % LINE_COLORS.length]}
                strokeWidth={isFocused ? 2.75 : 1.75}
                opacity={dim ? 0.18 : 1}
                pathLength={drawProgress}
              />
            );
          })}
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
  strokeDasharray,
}: {
  d: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  pathLength: ReturnType<typeof useTransform<number, number>>;
  strokeDasharray?: string;
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
      strokeDasharray={strokeDasharray}
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
