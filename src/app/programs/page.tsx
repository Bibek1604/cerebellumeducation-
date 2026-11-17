import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { CtaBand } from "@/components/sections/cta-band";
import { programmes } from "@/data/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Medical & Healthcare Programmes Abroad",
  description:
    "Explore MBBS, MD, dentistry, nursing, pharmacy and biomedical sciences programmes abroad: entry requirements, duration and what to check before applying.",
  path: "/programs",
});

export default function ProgrammesPage() {
  return (
    <>
      <PageHero
        title="Find the right healthcare programme for you"
        description="Medicine is our focus, alongside related healthcare degrees. Each programme page explains eligibility, typical duration, where it's available and what to consider."
        crumbs={[{ label: "Programmes", href: "/programs" }]}
      />
      <Section>
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programmes.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <ProgrammeCard programme={p} index={i} />
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand
        title="Unsure which programme suits you?"
        description="Talk to a counsellor about your interests, grades and career goals. We'll help you weigh your options."
      />
    </>
  );
}
