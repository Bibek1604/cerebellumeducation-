import { cn } from "@/lib/utils";

/**
 * The logo's open orange "C" sweep with its rising arrow — used as a large
 * decorative motif. Purely ornamental.
 */
export function BrandArc({ className, strokeWidth = 14 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 400 400" aria-hidden className={cn("pointer-events-none", className)} fill="none">
      {/* Open C: from top-right, around the left, to bottom-right */}
      <path
        d="M318 92 A160 160 0 1 0 330 300"
        stroke="var(--brand-secondary)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Rising arrow */}
      <path d="M150 250 C 200 230, 250 170, 300 70" stroke="var(--brand-secondary)" strokeWidth={strokeWidth / 3} strokeLinecap="round" strokeDasharray="2 14" />
      <path d="M282 72 L304 62 L306 86" stroke="var(--brand-secondary)" strokeWidth={strokeWidth / 3} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Decorative concentric arcs echoing the logo mark. Purely ornamental. */
export function FoliaArcs({ className, rings = 6, stroke = "currentColor" }: { className?: string; rings?: number; stroke?: string }) {
  return (
    <svg viewBox="0 0 400 220" aria-hidden className={cn("pointer-events-none", className)} fill="none">
      {Array.from({ length: rings }, (_, i) => {
        const r = 190 - i * (170 / rings);
        return <path key={i} d={`M${200 - r} 210a${r} ${r} 0 0 1 ${r * 2} 0`} stroke={stroke} strokeWidth="1.25" opacity={1 - i * 0.12} />;
      })}
    </svg>
  );
}
