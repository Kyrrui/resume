import { BuildingBlocks } from "@/components/ui/BuildingBlocks";

// Decorative background — fixed full-viewport gradient orbs + grid +
// noise + scroll-built gutter towers. Server component (the
// scroll-driven towers are an isolated client child).
export function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div className="absolute inset-0 bg-[var(--bg)]" />

      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-60" />

      {/* Top radial fade so grid recedes at the bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,92,246,0.10) 0%, transparent 50%), radial-gradient(ellipse 60% 50% at 90% 20%, rgba(34,211,238,0.08) 0%, transparent 50%), radial-gradient(ellipse 70% 50% at 0% 60%, rgba(99,102,241,0.06) 0%, transparent 50%)",
        }}
      />

      {/* Vignette to deepen edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(6,7,11,0.6) 100%)",
        }}
      />

      {/* Noise */}
      <div className="noise" />

      {/* Side-gutter towers that construct on scroll — rendered last
          so vignette/noise don't wash them out, still inside the
          -z-10 fixed layer so they stay behind all page content. */}
      <BuildingBlocks />
    </div>
  );
}
