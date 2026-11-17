import Image from "next/image";
import type { Destination } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Visual for a destination. Uses the licensed photograph when one is
 * configured on the destination, otherwise a branded "travel label"
 * artwork built from the country code and capital coordinates.
 */
export function DestinationArt({
  destination,
  className,
  size = "card",
  priority,
}: {
  destination: Destination;
  className?: string;
  size?: "card" | "hero";
  priority?: boolean;
}) {
  const [from, to] = destination.art;

  if (destination.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={destination.image.src}
          alt={destination.image.alt}
          fill
          priority={priority}
          sizes={size === "hero" ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
        />
      </div>
    );
  }

  const id = `art-${destination.slug}-${size}`;
  return (
    <div
      role="img"
      aria-label={`${destination.name}, study destination`}
      className={cn("relative isolate overflow-hidden text-white", className)}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      <svg aria-hidden className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 400 260">
        <defs>
          <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#fff" strokeOpacity=".07" />
          </pattern>
        </defs>
        <rect width="400" height="260" fill={`url(#${id}-grid)`} />
        {/* meridians */}
        <g fill="none" stroke="#fff" strokeOpacity=".14">
          <ellipse cx="330" cy="130" rx="150" ry="150" />
          <ellipse cx="330" cy="130" rx="95" ry="150" />
          <ellipse cx="330" cy="130" rx="40" ry="150" />
          <path d="M180 130h300M195 70h270M195 190h270" />
        </g>
        {/* route arc */}
        <path d="M30 220 C 120 120, 220 90, 318 118" fill="none" stroke="var(--brand-secondary)" strokeWidth="2" strokeDasharray="5 7" strokeLinecap="round" />
        <circle cx="30" cy="220" r="4" fill="#fff" fillOpacity=".7" />
        <circle cx="320" cy="118" r="7" fill="var(--brand-secondary)" />
        <circle cx="320" cy="118" r="14" fill="none" stroke="var(--brand-secondary)" strokeOpacity=".5" />
      </svg>

      <span
        aria-hidden
        className={cn(
          "absolute -bottom-[0.18em] left-4 font-display leading-none font-extrabold tracking-tighter text-transparent select-none",
          size === "hero" ? "text-[10rem] sm:text-[13rem]" : "text-[7.5rem]",
        )}
        style={{ WebkitTextStroke: "1.5px rgba(255,255,255,.35)" }}
      >
        {destination.code}
      </span>

      <div className="absolute top-4 right-4 left-4 flex items-start justify-between gap-3 text-[0.68rem] font-semibold tracking-[0.16em] uppercase">
        <span className="rounded-full bg-white/12 px-2.5 py-1 ring-1 ring-white/20 backdrop-blur-sm">{destination.capital}</span>
        <span className="text-right text-white/70">{destination.coordinates}</span>
      </div>
    </div>
  );
}
