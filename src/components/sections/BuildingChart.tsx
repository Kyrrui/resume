"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";

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
  onSelectRepo,
}: {
  chart: ChartData;
  repos: Repo[];
  /** When set, that repo's line is highlighted and the rest dim. */
  activeRepoName?: string | null;
  /** Click a legend entry to select/deselect that repo. */
  onSelectRepo?: (name: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Day index under the cursor (null = not hovering the plot).
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

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
  // Year window is bucketed weekly upstream; shorter windows are daily.
  const perUnit = chart.windowDays >= 360 ? "week" : "day";

  // Short windows label each tick "Mon D"; long (year) windows just use
  // the month so a dozen labels don't collide.
  // Year window is weekly (~52 pts) but should still read long:
  // month-only x labels, more ticks, year in the tooltip.
  const longWindow = chart.windowDays >= 360 || n > 90;
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

  // Map a pointer position to the nearest day index in the plot.
  const idxFromEvent = (clientX: number): number | null => {
    const el = svgRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    if (r.width === 0) return null;
    const xVb = ((clientX - r.left) / r.width) * W; // → viewBox x
    const t = (xVb - padL) / plotW; // 0..1 across the plot
    const idx = Math.round(t * (n - 1));
    return Math.max(0, Math.min(n - 1, idx));
  };

  // Tooltip contents for the hovered day: per-repo counts (nonzero,
  // desc) + the day total. null when not hovering.
  const hover =
    hoverIdx === null
      ? null
      : (() => {
          const date = new Date(chart.days[hoverIdx] + "T00:00:00Z");
          const label = date.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: longWindow ? "numeric" : undefined,
            timeZone: "UTC",
          });
          const rows = repos
            .map((r, i) => ({
              name: r.name,
              title: r.displayTitle,
              color: LINE_COLORS[i % LINE_COLORS.length],
              count: r.commitsByDay[hoverIdx] ?? 0,
            }))
            .filter((row) => row.count > 0)
            .sort((a, b) => b.count - a.count);
          const total = chart.totalByDay[hoverIdx] ?? 0;
          return { x: xAt(hoverIdx), label, rows, total };
        })();

  // Tooltip box geometry — flips to the left of the crosshair near the
  // right edge so it never clips out of the viewBox.
  const tipLineH = 13;
  const tipPadX = 8;
  const tipPadY = 7;
  const tipW = 150;
  const tipRows = hover ? hover.rows.length + 2 : 0; // date + rows + total
  const tipH = tipRows * tipLineH + tipPadY * 2;
  const tipFlip = hover ? hover.x + 12 + tipW > W - padR : false;
  const tipX = hover ? (tipFlip ? hover.x - 12 - tipW : hover.x + 12) : 0;
  const tipY = padT;

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
              : `Commits per ${perUnit} · ${windowLabel}`}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            {headerTotal}{" "}
            <span className="text-[var(--text-muted)] font-normal text-lg">
              {focused ? "commits" : "total"}
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs">
          {repos.map((r, i) => {
            const isSel = focused?.name === r.name;
            const dim = focused && !isSel;
            return (
              <li key={r.name}>
                <button
                  type="button"
                  onClick={() => onSelectRepo?.(r.name)}
                  aria-pressed={isSel}
                  className={`flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-opacity hover:bg-white/[0.04] ${
                    dim ? "opacity-40 hover:opacity-100" : "opacity-100"
                  }`}
                >
                  <span
                    className="h-0.5 w-4 rounded-full"
                    style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
                  />
                  <span
                    className={`font-mono truncate max-w-[200px] ${
                      isSel ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                    }`}
                  >
                    {r.displayTitle}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Line chart of commits per ${perUnit}, ${windowLabel}.`}
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

        {/* Hover crosshair + per-repo dots + tooltip */}
        {hover && (
          <g pointerEvents="none">
            <line
              x1={hover.x}
              x2={hover.x}
              y1={padT}
              y2={padT + plotH}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {repos.map((r, i) => {
              const v = r.commitsByDay[hoverIdx as number] ?? 0;
              if (v === 0) return null;
              const isFocused = focused?.name === r.name;
              const dim = focused && !isFocused;
              return (
                <circle
                  key={r.name}
                  cx={hover.x}
                  cy={yAt(v)}
                  r={isFocused ? 3.5 : 2.75}
                  fill={LINE_COLORS[i % LINE_COLORS.length]}
                  opacity={dim ? 0.25 : 1}
                />
              );
            })}

            <g transform={`translate(${tipX} ${tipY})`}>
              <rect
                width={tipW}
                height={tipH}
                rx={8}
                fill="rgba(11,13,20,0.95)"
                stroke="rgba(255,255,255,0.12)"
                strokeWidth={1}
              />
              <text
                x={tipPadX}
                y={tipPadY + tipLineH - 3}
                fill="rgba(255,255,255,0.6)"
                fontSize={10}
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              >
                {hover.label}
              </text>
              {hover.rows.map((row, ri) => (
                <g
                  key={row.name}
                  transform={`translate(0 ${(ri + 1) * tipLineH})`}
                >
                  <circle
                    cx={tipPadX + 3}
                    cy={tipPadY + tipLineH - 7}
                    r={3}
                    fill={row.color}
                  />
                  <text
                    x={tipPadX + 12}
                    y={tipPadY + tipLineH - 3}
                    fill="rgba(255,255,255,0.85)"
                    fontSize={10}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  >
                    {row.title.length > 16
                      ? row.title.slice(0, 15) + "…"
                      : row.title}
                  </text>
                  <text
                    x={tipW - tipPadX}
                    y={tipPadY + tipLineH - 3}
                    fill="rgba(255,255,255,0.85)"
                    fontSize={10}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    textAnchor="end"
                  >
                    {row.count}
                  </text>
                </g>
              ))}
              <g transform={`translate(0 ${(hover.rows.length + 1) * tipLineH})`}>
                <text
                  x={tipPadX}
                  y={tipPadY + tipLineH - 3}
                  fill="rgba(255,255,255,0.55)"
                  fontSize={10}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                >
                  total
                </text>
                <text
                  x={tipW - tipPadX}
                  y={tipPadY + tipLineH - 3}
                  fill="rgba(255,255,255,0.9)"
                  fontSize={10}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  textAnchor="end"
                >
                  {hover.total}
                </text>
              </g>
            </g>
          </g>
        )}

        {/* Transparent capture layer — topmost so mousemove is reliable
            across the whole plot regardless of the painted lines. */}
        <rect
          x={padL}
          y={padT}
          width={plotW}
          height={plotH}
          fill="transparent"
          style={{ cursor: "crosshair" }}
          onMouseMove={(e) => setHoverIdx(idxFromEvent(e.clientX))}
          onMouseLeave={() => setHoverIdx(null)}
        />
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
