import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircleQuestion } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DestinationArt } from "@/components/destinations/destination-art";
import { destinations } from "@/data/destinations";
import { getProgramme } from "@/data/programmes";
import { cn } from "@/lib/utils";

const lgSpan: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };

/** Columns the closing "ask us" tile spans on desktop so the last row is always full. */
function askSpanLg(restCount: number) {
  if (restCount < 4) return 2 - (restCount % 2) || 2; // still beside the 2×2 feature
  const r = (restCount - 4) % 4;
  return 4 - r;
}

/** Bento grid: the first destination is featured large, the rest are compact tiles. */
export function DestinationsBento() {
  const [featured, ...rest] = destinations;
  if (!featured) return null;

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              title="Explore Your Medical Education Destinations"
              description={`${destinations.length} countries, each with its own entry route, programme length and language environment.`}
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/destinations" variant="outline">
              Compare all destinations <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="mt-14 grid auto-rows-[minmax(15rem,auto)] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li className="sm:col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <Tile slug={featured.slug} large />
            </Reveal>
          </li>
          {rest.map((d, i) => (
            <li key={d.slug}>
              <Reveal delay={(i % 4) * 0.05} className="h-full">
                <Tile slug={d.slug} />
              </Reveal>
            </li>
          ))}
          <li className={cn(rest.length % 2 === 1 ? "sm:col-span-1" : "sm:col-span-2", lgSpan[askSpanLg(rest.length)])}>
            <Reveal delay={0.1} className="h-full">
              <div className="flex h-full flex-col justify-between rounded-[1.75rem] border-2 border-dashed border-gold/50 bg-cream p-6">
                <MessageCircleQuestion aria-hidden className="size-8 text-gold-dark" />
                <div>
                  <h3 className="mt-4 text-lg font-extrabold">Another country in mind?</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink">Tell us and we&apos;ll say honestly whether we can help.</p>
                  <Link href="/book-counselling" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Ask a counsellor <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </li>
        </ul>
      </Container>
    </Section>
  );
}

function Tile({ slug, large }: { slug: string; large?: boolean }) {
  const d = destinations.find((x) => x.slug === slug)!;
  return (
    <article className="group relative isolate flex h-full min-h-60 flex-col justify-end overflow-hidden rounded-[1.75rem] text-white shadow-soft">
      <DestinationArt destination={d} size={large ? "hero" : "card"} className="absolute inset-0 -z-10 transition-transform duration-700 group-hover:scale-105" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
      <div className={cn("p-6", large && "sm:p-9")}>
        {large && (
          <div className="mb-4 flex flex-wrap gap-2">
            {d.programmes.map((p) => (
              <Badge key={p} tone="light">
                {getProgramme(p)?.shortName ?? p}
              </Badge>
            ))}
          </div>
        )}
        <h3 className={cn("font-extrabold text-white", large ? "text-3xl sm:text-4xl" : "text-xl")}>
          <Link href={`/destinations/${d.slug}`} className="after:absolute after:inset-0">
            {large ? `Study Medicine in ${d.name}` : d.name}
          </Link>
        </h3>
        <p className={cn("mt-2 text-white/80", large ? "max-w-md text-base leading-relaxed" : "line-clamp-2 text-sm")}>{d.tagline}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-gold">
          Explore destination
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}
