import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Highlight } from "@/cms/highlight";
import { hasImage, visible } from "@/cms/content";
import type { ImageValue, LinkValue, Section as CmsSection } from "@/cms/types";
import { getProgrammes } from "@/cms/programmes";
import { destinationsOffering, getDestinations } from "@/cms/destinations";
import { ProgrammesTabs, type ProgrammeTab } from "./programmes-tabs";

const fallback = { src: "/images/programme-microscope.jpg", alt: "Students working at microscopes in a laboratory" };

/** Content: Admin → Pages → Homepage → Programmes showcase. Programme details: Admin → Programme list. */
export async function ProgrammesShowcase({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as { heading: string; description: string; photos: Record<string, ImageValue>; bookLabel: string; learnLabel: string; button: LinkValue };
  const show = visible(section);
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const items: ProgrammeTab[] = programmes.map((p) => {
    const dests = destinationsOffering(destinations, p.slug);
    const photo = d.photos?.[p.slug];
    return {
      slug: p.slug,
      name: p.name,
      shortName: p.shortName,
      category: p.category,
      icon: p.icon,
      summary: p.summary,
      points: [
        p.duration.split(",")[0],
        dests.length ? `Available in ${dests.map((x) => x.name).join(", ")}` : "Destinations on request",
        ...p.eligibility.slice(0, 2),
      ],
      photo: hasImage(photo) ? { src: photo.src, alt: photo.alt } : (p.image ?? fallback),
    };
  });

  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>
        <ProgrammesTabs items={items} bookLabel={d.bookLabel || "Book counselling"} learnLabel={d.learnLabel || "Learn more"} />
        {show("button") && d.button?.label && d.button.href && (
          <div className="mt-12 text-center">
            <ButtonLink href={d.button.href} variant="outline">
              {d.button.label} <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        )}
      </Container>
    </Section>
  );
}
