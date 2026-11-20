import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { Highlight } from "@/cms/highlight";
import { getSteps, visible } from "@/cms/content";
import type { LinkValue, Section as CmsSection } from "@/cms/types";

/** Content: Admin → Pages → Homepage → Your journey. Steps: Admin → Admission steps. */
export async function ProcessSection({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as { heading: string; description: string; button: LinkValue };
  const show = visible(section);
  const admissionSteps = await getSteps();
  if (admissionSteps.length === 0) return null;
  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>
        <div className="mt-14">
          <ProcessTimeline steps={admissionSteps} />
        </div>
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
