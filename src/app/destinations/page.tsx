import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { DestinationCard } from "@/components/destinations/destination-card";
import { CtaBand } from "@/components/sections/cta-band";
import { destinations } from "@/data/destinations";
import { getProgramme } from "@/data/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Study Medicine Abroad: Destinations",
  description:
    "Compare destinations for studying MBBS and medicine abroad, including China, Bangladesh, India, Russia, Georgia, Kazakhstan and the Philippines.",
  path: "/destinations",
});

export default function DestinationsPage() {
  return (
    <>
      <PageHero
        title="Where could your medical journey take you?"
        description="Every country offers a different route into medicine. Explore each destination's programmes, entry requirements, language environment and recognition considerations."
        crumbs={[{ label: "Study Destinations", href: "/destinations" }]}
      />

      <Section>
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
      </Section>

      <Section tone="muted" className="pt-0 sm:pt-0 lg:pt-0">
        <Container className="pt-20 sm:pt-24">
          <Reveal>
            <SectionHeading
              title="Compare destinations side by side"
              description="A quick overview. Details change between universities and intakes, so treat this as a starting point for your conversation with a counsellor."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10 overflow-x-auto rounded-3xl border border-line bg-white">
            <table className="w-full min-w-[760px] text-left text-sm">
              <caption className="sr-only">Comparison of study destinations</caption>
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-6 py-4 font-display font-bold">Destination</th>
                  <th scope="col" className="px-6 py-4 font-display font-bold">Programmes</th>
                  <th scope="col" className="px-6 py-4 font-display font-bold">Typical duration</th>
                  <th scope="col" className="px-6 py-4 font-display font-bold">Language of instruction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {destinations.map((d) => (
                  <tr key={d.slug} className="align-top hover:bg-muted/60">
                    <th scope="row" className="px-6 py-5">
                      <Link href={`/destinations/${d.slug}`} className="font-bold text-primary hover:underline">
                        {d.name}
                      </Link>
                    </th>
                    <td className="px-6 py-5 text-ink">{d.programmes.map((p) => getProgramme(p)?.shortName ?? p).join(", ")}</td>
                    <td className="px-6 py-5 text-ink">{d.duration}</td>
                    <td className="px-6 py-5 text-ink">{d.medium}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </Container>
      </Section>

      <div className="pt-20 sm:pt-24 lg:pt-28">
        <CtaBand
          title="Not sure which country fits you best?"
          description="A counsellor will compare destinations against your grades, budget and long-term plans, for free."
        />
      </div>
    </>
  );
}
