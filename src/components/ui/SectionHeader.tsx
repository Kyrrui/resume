import type { ReactNode } from "react";

export function SectionHeader({
  index,
  title,
  caption,
  action,
}: {
  index: string;
  title: string;
  caption?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <header className="mb-10 md:mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <span className="text-[var(--violet)]">{index}</span>
          <span className="h-px w-12 bg-gradient-to-r from-[var(--violet)]/60 to-transparent" />
          <span>section</span>
        </div>
        <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h2>
        {caption && (
          <p className="max-w-2xl text-sm md:text-base text-[var(--text-muted)] leading-relaxed">
            {caption}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}
