import Link from "next/link";
import { destinations } from "@/data/destinations";

/** Scrolling strip of destinations. Pauses on hover; static under reduced motion. */
export function DestinationMarquee() {
  const items = [...destinations, ...destinations];
  return (
    <section aria-label="Study destinations" className="group relative overflow-hidden border-y border-line bg-white py-5 mt-16 lg:mt-24">
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
      <ul className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
        {items.map((d, i) => (
          <li key={`${d.slug}-${i}`} aria-hidden={i >= destinations.length ? true : undefined}>
            <Link
              href={`/destinations/${d.slug}`}
              tabIndex={i >= destinations.length ? -1 : undefined}
              className="flex items-center gap-3 rounded-full border border-line bg-muted py-2 pr-5 pl-2 transition-colors hover:border-primary hover:bg-primary-light"
            >
              <span
                className="grid size-9 place-items-center rounded-full font-display text-xs font-extrabold text-white"
                style={{ background: `linear-gradient(135deg, ${d.art[0]}, ${d.art[1]})` }}
              >
                {d.code}
              </span>
              <span className="font-display font-bold whitespace-nowrap text-navy">Study in {d.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
