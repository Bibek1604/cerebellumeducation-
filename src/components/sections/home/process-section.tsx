import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { admissionSteps } from "@/data/process";

export function ProcessSection() {
  return (
    <Section tone="muted">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              title="Your Journey to Studying Medicine Abroad"
              description="Eight clear stages, with a counsellor beside you at each one. Timelines vary by country and intake, and we map yours out at the start."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/admission-process" variant="outline">
              See each step in detail <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
        <div className="mt-16">
          <ProcessTimeline steps={admissionSteps} />
        </div>
      </Container>
    </Section>
  );
}
