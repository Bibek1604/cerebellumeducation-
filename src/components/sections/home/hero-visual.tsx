import Image from "next/image";
import { branding } from "@/config/branding";
import { destinations } from "@/data/destinations";

/** Approximate, stylised positions on an abstract map (not geographic accuracy). */
const PIN_POS: Record<string, [number, number]> = {
  russia: [318, 112],
  kazakhstan: [250, 176],
  georgia: [128, 196],
  china: [372, 236],
  india: [196, 330],
  bangladesh: [300, 318],
  philippines: [420, 392],
};
const ORIGIN: [number, number] = [246, 282];

export function HeroVisual() {
  const pins = destinations.filter((d) => PIN_POS[d.slug]);

  return (
    <div className="relative aspect-[5/5.6] w-full overflow-hidden rounded-[2.5rem] bg-brand-gradient shadow-lift">
      {branding.heroImage ? (
        <Image
          src={branding.heroImage.src}
          alt={branding.heroImage.alt}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      ) : (
        <svg viewBox="0 0 500 560" className="absolute inset-0 size-full" role="img" aria-label="Illustration of routes from your home to international medical study destinations">
          <defs>
            <radialGradient id="hero-glow" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity=".55" />
              <stop offset="100%" stopColor="var(--brand-dark)" stopOpacity="0" />
            </radialGradient>
            <pattern id="hero-dots" width="14" height="14" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1.1" fill="#fff" fillOpacity=".1" />
            </pattern>
          </defs>
          <rect width="500" height="560" fill="url(#hero-dots)" />
          <rect width="500" height="560" fill="url(#hero-glow)" />

          {/* Globe meridians & parallels */}
          <g fill="none" stroke="#fff" strokeOpacity=".09">
            <circle cx="250" cy="270" r="230" />
            <ellipse cx="250" cy="270" rx="150" ry="230" />
            <ellipse cx="250" cy="270" rx="70" ry="230" />
            <ellipse cx="250" cy="270" rx="230" ry="80" />
            <ellipse cx="250" cy="270" rx="230" ry="160" />
            <path d="M20 270h460" />
          </g>

          {/* Routes */}
          <g fill="none" strokeLinecap="round">
            {pins.map((d) => {
              const [x, y] = PIN_POS[d.slug];
              const cx = (ORIGIN[0] + x) / 2;
              const cy = Math.min(ORIGIN[1], y) - 60;
              return (
                <path
                  key={d.slug}
                  d={`M${ORIGIN[0]} ${ORIGIN[1]} Q${cx} ${cy} ${x} ${y}`}
                  stroke="var(--brand-secondary)"
                  strokeOpacity=".75"
                  strokeWidth="1.6"
                  strokeDasharray="4 6"
                />
              );
            })}
          </g>

          {/* Destination pins */}
          {pins.map((d) => {
            const [x, y] = PIN_POS[d.slug];
            return (
              <g key={d.slug}>
                <circle cx={x} cy={y} r="11" fill="var(--brand-secondary)" fillOpacity=".18" />
                <circle cx={x} cy={y} r="4.5" fill="var(--brand-secondary)" />
                <text x={x + 10} y={y - 10} fill="#fff" fontSize="12.5" fontWeight="700" fontFamily="var(--font-manrope)">
                  {d.name}
                </text>
              </g>
            );
          })}

          {/* Origin */}
          <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r="20" fill="#fff" fillOpacity=".1" />
          <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r="7" fill="#fff" />
          <circle cx={ORIGIN[0]} cy={ORIGIN[1]} r="3" fill="var(--brand-primary)" />
        </svg>
      )}
    </div>
  );
}
