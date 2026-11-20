import Image from "next/image";
import Link from "next/link";
import { branding } from "@/config/branding";
import { cn } from "@/lib/utils";

/**
 * Placeholder mark — concentric "folia" arcs inspired by the cerebellum.
 * Replaced automatically when `branding.logo.src` is set.
 */
export function CerebellumMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <circle cx="24" cy="24" r="24" fill="var(--brand-primary)" />
      <g fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="2.4">
        <path d="M11 29a13 13 0 0 1 26 0" />
        <path d="M15.5 29a8.5 8.5 0 0 1 17 0" opacity=".85" />
        <path d="M20 29a4 4 0 0 1 8 0" opacity=".7" />
      </g>
      <circle cx="35.5" cy="14" r="3.6" fill="var(--brand-secondary)" />
      <path d="M11 33.5h26" stroke="var(--brand-secondary)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ onDark, className, priority }: { onDark?: boolean; className?: string; priority?: boolean }) {
  const src = onDark ? (branding.logo.srcOnDark ?? branding.logo.src) : branding.logo.src;
  // Without a dedicated dark-background version, show the logo on a white plate.
  const plate = onDark && !branding.logo.srcOnDark;

  return (
    <Link href="/" aria-label={`${branding.logo.alt}, home`} className={cn("inline-flex shrink-0 items-center", className)}>
      {src ? (
        <span className={cn("inline-flex", plate && "rounded-2xl bg-white px-4 py-2.5 shadow-soft")}>
          <Image
            src={src}
            alt={branding.logo.alt}
            width={branding.logo.width}
            height={branding.logo.height}
            priority={priority}
            quality={100}
            className={cn("w-auto", plate ? "h-14" : "h-14 sm:h-16 xl:h-14 2xl:h-16")}
          />
        </span>
      ) : (
        <span className="flex items-center gap-2.5">
          <CerebellumMark className="size-10 sm:size-11" />
          <span className="flex flex-col leading-none">
            <span className={cn("font-display text-[1.2rem] font-extrabold tracking-tight sm:text-[1.3rem]", onDark ? "text-white" : "text-navy")}>
              Cerebellum
            </span>
            <span className={cn("mt-1 text-[0.6rem] font-bold tracking-[0.22em] uppercase", onDark ? "text-gold" : "text-ink-soft")}>
              Education Network
            </span>
          </span>
        </span>
      )}
    </Link>
  );
}
