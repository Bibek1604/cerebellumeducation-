import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { TestimonialSlider } from "@/components/testimonials/testimonial-slider";
import { testimonials } from "@/data/testimonials";
import { destinations } from "@/data/destinations";

export function StoriesSection() {
  // Hidden entirely until genuine, consented stories exist in data/testimonials.ts.
  if (testimonials.length === 0) return null;
  const names = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
  return (
    <Section tone="muted">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-16">
          <Reveal>
            <SectionHeading
              title="Every Journey Begins With a Dream"
              description="Behind every application is a student and a family taking a big step. These are their experiences, in their own words."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <TestimonialSlider testimonials={testimonials} destinationNames={names} />
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
