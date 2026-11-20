import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Highlight } from "@/cms/highlight";
import { visible } from "@/cms/content";
import type { LinkValue, Section as CmsSection } from "@/cms/types";
import { getProgrammes } from "@/cms/programmes";
import { destinationsOffering, getDestinations } from "@/cms/destinations";
import { DestinationsTabs } from "./destinations-tabs";

/** Content: Admin → Pages → Homepage → Destinations. Country cards come from data/destinations. */
export async function DestinationsSection({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as { heading: string; description: string; askCard: { title: string; text: string; link: LinkValue }; button: LinkValue };
  const show = visible(section);
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const tabs = programmes
    .filter((p) => destinationsOffering(destinations, p.slug).length > 1)
    .map((p) => ({ slug: p.slug, label: p.shortName }));
  const ask =
    show("askCard") && d.askCard?.title
      ? { title: d.askCard.title, text: d.askCard.text, label: d.askCard.link?.label || "Ask a counsellor", href: d.askCard.link?.href || "/book-counselling" }
      : null;

  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>
        <DestinationsTabs destinations={destinations} tabs={tabs} askCard={ask} />
        {show("button") && d.button?.label && d.button.href && (
          <div className="mt-10 text-center">
            <ButtonLink href={d.button.href} variant="outline">
              {d.button.label} <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}
