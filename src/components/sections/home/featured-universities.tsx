import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { UniversityCard, UniversityDisclaimer } from "@/components/universities/university-card";
import { universities } from "@/data/universities";

export function FeaturedUniversities() {
  if (universities.length === 0) return null;
  const featured = universities.slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              title="Explore International University Opportunities"
              description="We help you research institutions using official information: teaching hospitals, programme structure, language and recognition."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/universities" variant="outline">
              Browse all universities <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((u, i) => (
            <li key={u.slug}>
              <Reveal delay={i * 0.06} className="h-full">
                <UniversityCard university={u} />
              </Reveal>
            </li>
          ))}
        </ul>
        <UniversityDisclaimer className="mt-8 max-w-3xl text-sm leading-relaxed text-ink-soft" />
      </Container>
    </Section>
  );
}
