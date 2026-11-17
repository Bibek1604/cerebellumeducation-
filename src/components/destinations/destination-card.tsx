import Link from "next/link";
import { ArrowUpRight, Clock, Languages } from "lucide-react";
import type { Destination } from "@/types/content";
import { DestinationArt } from "./destination-art";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="overflow-hidden">
        <DestinationArt destination={destination} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.04]" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-extrabold">
          <Link href={`/destinations/${destination.slug}`} className="after:absolute after:inset-0">
            {destination.name}
          </Link>
        </h3>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{destination.tagline}</p>
        <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
          <div className="flex gap-2.5">
            <dt className="sr-only">Typical duration</dt>
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd className="text-ink">{destination.duration.split(". ")[0].split(", confirm")[0]}</dd>
          </div>
          <div className="flex gap-2.5">
            <dt className="sr-only">Language of instruction</dt>
            <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
            <dd className="text-ink">{destination.medium.split(";")[0]}</dd>
          </div>
        </dl>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-primary">
          Explore destination
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
