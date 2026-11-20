import Link from "next/link";
import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "@/components/destinations/destination-card";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { Highlight } from "@/cms/highlight";
import { getPage, sectionsOf, visible } from "@/cms/content";
import { getDestinations } from "@/cms/destinations";
import type { Section } from "@/cms/types";
import type { Destination } from "@/types/content";
import { getProgrammes } from "@/cms/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Study Medicine Abroad: Destinations",
  description:
    "Compare destinations for studying MBBS and medicine abroad, including China, Bangladesh, India, Russia, Georgia, Kazakhstan and the Philippines.",
  path: "/destinations",
});

/** Content: Admin → Pages → Study Destinations. Countries: Admin → Countries. */
export default async function DestinationsPage() {
  const [page, destinations, programmes] = await Promise.all([getPage("page:destinations"), getDestinations(), getProgrammes()]);
  const shortName = Object.fromEntries(programmes.map((p) => [p.slug, p.shortName]));
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        const prev = sections[i - 1];
        const prevWhite = Boolean(prev && prev.kind !== "destCompare");
        return <DestinationsBlock key={s.id} section={s} destinations={destinations} shortName={shortName} prevWhite={prevWhite} />;
      })}
    </>
  );
}

function DestinationsBlock({
  section,
  destinations,
  shortName,
  prevWhite,
}: {
  section: Section;
  destinations: Destination[];
  shortName: Record<string, string>;
  prevWhite: boolean;
}) {
  switch (section.kind) {
    case "hero": {
      const badge = (section.data.badge ?? {}) as { title?: string; text?: string };
      const data = { ...section.data, badge: { ...badge, title: String(badge.title ?? "").replaceAll("{count}", String(destinations.length)) } };
      return <HeroSection section={{ ...section, data }} href="/destinations" />;
    }

    case "destGrid":
      if (destinations.length === 0) return null;
      return (
        <Band>
          <Container>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d, i) => (
                <li key={d.slug}>
                  <Reveal delay={(i % 3) * 0.06} className="h-full">
                    <DestinationCard destination={d} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </Band>
      );

    case "destCompare": {
      if (destinations.length === 0) return null;
      const show = visible(section);
      const d = section.data as { heading: string; description: string; columns: Record<string, string> };
      const cols = d.columns ?? {};
      const showDuration = show("columns.duration");
      const showMedium = show("columns.medium");
      return (
        <Band tone="muted">
          <Container>
            <Reveal>
              <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
            </Reveal>
            <Reveal delay={0.1} className="mt-10 overflow-x-auto rounded-3xl border border-line bg-white">
              <table className="w-full min-w-[760px] text-left text-sm">
                <caption className="sr-only">Comparison of study destinations</caption>
                <thead className="bg-navy text-white">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-sans font-bold">{cols.destination}</th>
                    <th scope="col" className="px-6 py-4 font-sans font-bold">{cols.programmes}</th>
                    {showDuration && <th scope="col" className="px-6 py-4 font-sans font-bold">{cols.duration}</th>}
                    {showMedium && <th scope="col" className="px-6 py-4 font-sans font-bold">{cols.medium}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {destinations.map((x) => (
                    <tr key={x.slug} className="align-top hover:bg-muted/60">
                      <th scope="row" className="px-6 py-5">
                        <Link href={`/destinations/${x.slug}`} className="font-bold text-primary hover:underline">
                          {x.name}
                        </Link>
                      </th>
                      <td className="px-6 py-5 text-ink">{x.programmes.map((p) => shortName[p] ?? p).join(", ")}</td>
                      {showDuration && <td className="px-6 py-5 text-ink">{x.duration}</td>}
                      {showMedium && <td className="px-6 py-5 text-ink">{x.medium}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </Container>
        </Band>
      );
    }

    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}
