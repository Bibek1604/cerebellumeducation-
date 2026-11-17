import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgeCheck, CalendarDays, ExternalLink, Languages, MapPin, Wallet } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckList } from "@/components/ui/check-list";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { UniversityDisclaimer } from "@/components/universities/university-card";
import { OfficialSources } from "@/components/sections/official-sources";
import { CtaBand } from "@/components/sections/cta-band";
import { getUniversity, universities } from "@/data/universities";
import { getDestination } from "@/data/destinations";
import { getProgramme } from "@/data/programmes";
import { globalSources } from "@/data/sources";
import { pageMetadata } from "@/lib/seo";
import type { ExternalSource } from "@/types/content";

export function generateStaticParams() {
  return universities.map((u) => ({ slug: u.slug }));
}

/** All slugs are prerendered; reading params at the top level is intentional. */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/universities/[slug]">) {
  const { slug } = await params;
  const u = getUniversity(slug);
  if (!u) return {};
  const country = getDestination(u.country)?.name ?? "";
  const desc = `${u.name} in ${u.city}, ${country}: programmes, official links and what to check before applying. Free counselling available.`;
  return pageMetadata({
    title: `${u.shortName}: ${u.name}`.slice(0, 70),
    description: desc.length > 160 ? `${desc.slice(0, 157).trimEnd()}…` : desc,
    path: `/universities/${u.slug}`,
  });
}

export default async function UniversityPage({ params }: PageProps<"/universities/[slug]">) {
  const { slug } = await params;
  const u = getUniversity(slug);
  if (!u) notFound();

  const dest = getDestination(u.country);
  const progs = u.programmes.map(getProgramme).filter((p) => p !== undefined);
  const counsellingHref = `/book-counselling?country=${u.country}${u.programmes[0] ? `&programme=${u.programmes[0]}` : ""}`;
  const links: ExternalSource[] = [
    { label: `${u.shortName} official website`, href: u.officialUrl, publisher: u.name },
    u.wdomsUrl
      ? { label: "World Directory of Medical Schools entry", href: u.wdomsUrl, publisher: globalSources.wdoms.publisher }
      : { ...globalSources.wdoms, label: "Search the World Directory of Medical Schools" },
  ];

  const facts = [
    { icon: MapPin, label: "Location", value: `${u.city}, ${dest?.name ?? ""}` },
    u.mediumOfInstruction && { icon: Languages, label: "Medium of instruction", value: u.mediumOfInstruction },
    u.intakes?.length && { icon: CalendarDays, label: "Intakes", value: u.intakes.join(", ") },
    u.tuitionRange && {
      icon: Wallet,
      label: `Tuition (per ${u.tuitionRange.per})`,
      value: `${u.tuitionRange.currency} ${u.tuitionRange.amount}, verified ${u.tuitionRange.lastVerified}`,
    },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <>
      <PageHero
        title={u.name}
        description={u.intro}
        crumbs={[
          { label: "Universities", href: "/universities" },
          { label: u.shortName, href: `/universities/${u.slug}` },
        ]}
        aside={
          <div className="rounded-[2rem] border border-line bg-white p-7 shadow-soft">
            <div className="flex flex-wrap gap-2">
              {u.isPartner && (
                <Badge tone="gold">
                  <BadgeCheck aria-hidden className="size-3.5" /> Partner institution
                </Badge>
              )}
              {progs.map((p) => (
                <Badge key={p.slug}>{p.shortName}</Badge>
              ))}
            </div>
            <dl className="mt-6 space-y-4">
              {facts.map((f) => (
                <div key={f.label} className="flex gap-3">
                  <f.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">{f.label}</dt>
                    <dd className="mt-0.5 font-semibold text-navy">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-7 flex flex-col gap-3">
              <ButtonLink href={counsellingHref}>
                Ask about {u.shortName} <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href={u.officialUrl} external variant="outline">
                Official website <ExternalLink aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </div>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <h2 className="text-2xl font-extrabold sm:text-3xl">Programmes listed for {u.shortName}</h2>
              <ul className="mt-8 grid gap-5 sm:grid-cols-2">
                {progs.map((p) => (
                  <li key={p.slug}>
                    <ProgrammeCard programme={p} />
                  </li>
                ))}
              </ul>
              {u.recognitionNotes?.length ? (
                <>
                  <h2 className="mt-12 text-2xl font-extrabold">Recognition notes</h2>
                  <CheckList items={u.recognitionNotes} className="mt-5" />
                </>
              ) : null}
            </div>
            <aside className="space-y-8">
              <OfficialSources sources={links} title="Verify at the source" />
              {dest && (
                <div className="rounded-3xl bg-muted p-6">
                  <h2 className="text-lg font-extrabold">Studying in {dest.name}</h2>
                  <p className="mt-2 leading-relaxed text-ink">{dest.summary}</p>
                  <Link href={`/destinations/${dest.slug}`} className="mt-4 inline-flex min-h-6 items-center gap-1.5 font-bold text-primary">
                    {dest.name} destination guide <ArrowRight aria-hidden className="size-4" />
                  </Link>
                </div>
              )}
              <UniversityDisclaimer className="text-sm leading-relaxed text-ink-soft" />
            </aside>
          </div>
        </Container>
      </Section>

      <CtaBand
        title={`Interested in ${u.shortName}?`}
        description="A counsellor will check your eligibility and explain the current admission requirements."
        primary={{ label: "Book Free Counselling", href: counsellingHref }}
      />
    </>
  );
}
