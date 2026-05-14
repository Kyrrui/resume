import type { ReactNode } from "react";

const toneStyles: Record<string, string> = {
  violet: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  cyan: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  mint: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  pink: "border-pink-400/30 bg-pink-400/10 text-pink-200",
  neutral: "border-white/10 bg-white/[0.03] text-[var(--text-muted)]",
};

export function Pill({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof toneStyles;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono uppercase tracking-wider ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
