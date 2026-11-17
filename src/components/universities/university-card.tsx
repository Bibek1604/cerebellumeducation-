import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ExternalLink, MapPin } from "lucide-react";
import type { University } from "@/types/content";
import { getDestination } from "@/data/destinations";
import { getProgramme } from "@/data/programmes";
import { Badge } from "@/components/ui/badge";

export function UniversityCard({ university }: { university: University }) {
  const destination = getDestination(university.country);

  return (
    <article id={university.slug} className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {university.image ? (
        <div className="relative aspect-[16/9]">
          <Image src={university.image.src} alt={university.image.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
        </div>
      ) : (
        <div
          className="relative flex aspect-[16/7] items-end overflow-hidden p-5"
          style={{ background: `linear-gradient(135deg, ${destination?.art[0] ?? "var(--brand-primary)"}, var(--brand-dark))` }}
        >
          {university.logo ? (
            <span className="rounded-xl bg-white p-2.5 shadow-soft">
              <Image src={university.logo.src} alt={university.logo.alt} width={120} height={48} className="h-10 w-auto" />
            </span>
          ) : (
            <span aria-hidden className="font-display text-4xl font-extrabold tracking-tight text-white/90">
              {university.shortName}
            </span>
          )}
          <span aria-hidden className="absolute top-4 right-5 text-[0.68rem] font-semibold tracking-[0.16em] text-white/70 uppercase">
            {destination?.code}
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          {university.isPartner && (
            <Badge tone="gold">
              <BadgeCheck aria-hidden className="size-3.5" /> Partner institution
            </Badge>
          )}
          {university.programmes.map((p) => (
            <Badge key={p} tone="blue">
              {getProgramme(p)?.shortName ?? p}
            </Badge>
          ))}
        </div>
        <h3 className="mt-4 text-lg leading-snug font-extrabold">
          <Link href={`/universities/${university.slug}`} className="hover:text-primary">
            {university.name}
          </Link>
        </h3>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-ink-soft">
          <MapPin aria-hidden className="size-4" />
          {university.city}, {destination?.name}
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{university.intro}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 text-sm font-bold">
          <Link href={`/universities/${university.slug}`} className="inline-flex min-h-6 items-center gap-1.5 text-primary hover:text-primary-dark">
            View details <ArrowRight aria-hidden className="size-3.5" />
            <span className="sr-only">about {university.name}</span>
          </Link>
          <a
            href={university.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-6 items-center gap-1.5 text-ink-soft hover:text-primary"
          >
            Official website
            <ExternalLink aria-hidden className="size-3.5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function UniversityDisclaimer({ className }: { className?: string }) {
  return (
    <p className={className}>
      Universities are listed for information. Listing does not imply an official partnership unless marked
      “Partner institution”. Always confirm programme details, fees and recognition on the university&apos;s official website
      and with the relevant regulators.
    </p>
  );
}
