import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Highlight } from "@/cms/highlight";
import { getTeam, visible } from "@/cms/content";
import type { Section as CmsSection } from "@/cms/types";
import type { TeamMember } from "@/data/team";
import { showPlaceholders } from "@/data/showcase";
import { CounsellorCard } from "./counsellor-card";
import { CounsellorCarousel } from "./counsellor-carousel";

/** Sample cards shown on your computer only, so you can see the layout before adding real profiles. */
const sample: TeamMember = {
  name: "Counsellor Name",
  role: "Senior Counsellor",
  focus: "e.g. MBBS admissions: China & Bangladesh",
  experience: "e.g. 5+ years",
  languages: ["Nepali", "English"],
};

/** Whether the counsellor section has anything to show (real profiles, or placeholders on your computer). */
export async function teamWillRender() {
  return (await getTeam()).length > 0 || showPlaceholders;
}

/** "Meet your counsellors" carousel. Heading: Admin → Pages → Homepage. Counsellors: Admin → Team. */
export async function TeamSection({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as { heading: string; description: string };
  const show = visible(section);
  const team = await getTeam();
  if (team.length === 0 && !showPlaceholders) return null;
  const members =
    team.length > 0
      ? team
      : [
          sample,
          { ...sample, name: "Second Counsellor", role: "Admissions Counsellor" },
          { ...sample, name: "Third Counsellor", role: "Visa & Documentation Advisor" },
        ];

  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>
        <CounsellorCarousel>
          {members.map((m) => (
            <li key={m.name} className="w-[88%] shrink-0 snap-start sm:w-[calc(50%-0.75rem)]">
              <CounsellorCard member={m} placeholder={team.length === 0} />
            </li>
          ))}
        </CounsellorCarousel>
      </Container>
    </Section>
  );
}
