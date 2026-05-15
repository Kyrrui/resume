"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

type Repo = {
  /** GitHub repo name (used as the line's identity key) */
  name: string;
  /** Curated project title — shown in the legend when this repo's card is
   * on the front (project) face. Defaults to the repo name. */
  displayTitle: string;
  language: { name: string; color: string | null } | null;
  commitsByDay: number[];
  /** True when this repo's card is currently flipped to the repo face.
   * When true, the legend label switches from displayTitle → name. */
  isFlipped: boolean;
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
const LINE_COLORS = ["#a78bfa", "#22d3ee", "#f59e0b", "#34d399"];
const OTHER_COLOR = "#9ca3af"; // muted gray for the aggregated "Other" line

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

  // Resolve the focused repo (if any). When set, the chart shows only its
  // line; other repos and the aggregated "Other" series are hidden, and
  // the header total switches to this repo's monthly total.
  const focused = activeRepoName
    ? repos.find((r) => r.name === activeRepoName) ?? null
    : null;

  const hasOther =
    !focused && !!chart.other && chart.other.totalCommits > 0;

  // Y scaled to the relevant values (linear scale — no log/sqrt).
  const allValues = focused
    ? focused.commitsByDay
    : [
        ...chart.totalByDay,
        ...repos.flatMap((r) => r.commitsByDay),
        ...(hasOther && chart.other ? chart.other.byDay : []),
      ];
  const rawMax = Math.max(1, ...allValues);
  const yMax = niceCeil(rawMax);
  // Log scale for the all-repos view compresses spikes so a 50-commit
  // day doesn't flatten the rest of the lines. When focused on a single
  // repo we use linear — you want the true shape of that one project,
  // not a compressed approximation.
  const useLogScale = !focused;
  const yLogMax = useLogScale ? Math.log10(yMax + 1) : 1;
  const yAt = (v: number) => {
    const clamped = Math.max(0, v);
    if (useLogScale) {
      return padT + plotH - (Math.log10(clamped + 1) / yLogMax) * plotH;
    }
    return padT + plotH - (clamped / yMax) * plotH;
  };

  // Middle tick value: on log, sqrt(yMax+1)-1 sits at the visual midpoint;
  // on linear, it's just yMax/2.
  const midTick = useLogScale
    ? Math.max(1, Math.round(Math.sqrt(yMax + 1) - 1))
    : Math.round(yMax / 2);
  const ticks = [0, midTick, yMax];

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

  // Total to display in the header — focused repo's monthly count if a
  // card is flipped, otherwise the overall total.
  const headerTotal = focused
    ? focused.commitsByDay.reduce((a, b) => a + b, 0)
    : chart.totalByDay.reduce((a, b) => a + b, 0);

  // Repos to render lines for: just the focused one if set, otherwise all.
  const repoIndexFor = (r: Repo) =>
    repos.findIndex((x) => x.name === r.name);
  const visibleRepos = focused ? [focused] : repos;

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
              ? `${focused.isFlipped ? focused.name : focused.displayTitle} · last 30 days`
              : "Commits per day · last 30 days"}
          </div>
          <div className="mt-1 font-display text-2xl font-semibold tracking-tight text-[var(--text)]">
            {headerTotal}{" "}
            <span className="text-[var(--text-muted)] font-normal text-lg">
              {focused ? "commits" : "total"}
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
          {visibleRepos.map((r) => {
            const i = repoIndexFor(r);
            const label = r.isFlipped ? r.name : r.displayTitle;
            return (
              <li
                key={r.name}
                className="flex items-center gap-1.5 text-[var(--text)]"
              >
                <span
                  className="h-0.5 w-4 rounded-full"
                  style={{ background: LINE_COLORS[i % LINE_COLORS.length] }}
                />
                <span className="font-mono text-[var(--text-muted)] truncate max-w-[200px]">
                  {label}
                </span>
              </li>
            );
          })}
          {hasOther && chart.other && (
            <li className="flex items-center gap-1.5 text-[var(--text)]">
              <span
                className="h-0.5 w-4 rounded-full"
                style={{ background: OTHER_COLOR }}
              />
              <span className="font-mono text-[var(--text-muted)]">
                other ({chart.other.repoCount})
              </span>
            </li>
          )}
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

        {visibleRepos.map((r) => (
          <ScrollPath
            key={r.name}
            d={buildPath(r.commitsByDay, xAt, yAt)}
            stroke={LINE_COLORS[repoIndexFor(r) % LINE_COLORS.length]}
            strokeWidth={1.75}
            opacity={1}
            pathLength={drawProgress}
          />
        ))}

        {hasOther && chart.other && (
          <ScrollPath
            d={buildPath(chart.other.byDay, xAt, yAt)}
            stroke={OTHER_COLOR}
            strokeWidth={1.5}
            opacity={0.85}
            strokeDasharray="4 4"
            pathLength={drawProgress}
          />
        )}
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
