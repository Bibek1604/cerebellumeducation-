import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Highlight } from "@/cms/highlight";
import { visible } from "@/cms/content";
import type { Section as CmsSection } from "@/cms/types";
import { getProgrammes } from "@/cms/programmes";
import { destinationsOffering, getDestinations } from "@/cms/destinations";
import { CountryQuiz, type QuizDestination } from "./country-quiz";

/** Content: Admin → Pages → Homepage → Country-match quiz. */
export async function QuizSection({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const d = section.data as { heading: string; description: string };
  const show = visible(section);
  const quizDestinations: QuizDestination[] = destinations.map((d) => ({
    slug: d.slug,
    name: d.name,
    programmes: d.programmes,
    // Clinical years in a local language whenever the teaching-language note isn't plain "English".
    localLanguage: d.medium.trim() !== "English",
    medium: d.medium,
    duration: d.duration,
    image: d.image,
  }));
  const options = programmes
    .filter((p) => destinationsOffering(destinations, p.slug).length > 0)
    .map((p) => ({ value: p.slug, label: p.name }));

  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>
        <CountryQuiz destinations={quizDestinations} programmes={options} />
      </Container>
    </Section>
  );
}
