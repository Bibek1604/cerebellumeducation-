import { HomeHero } from "@/components/sections/home/hero";
import { AboutSplit } from "@/components/sections/home/about-split";
import { ProgrammesShowcase } from "@/components/sections/home/programmes-showcase";
import { DestinationsSection } from "@/components/sections/home/destinations-section";
import { QuizSection } from "@/components/sections/home/quiz-section";
import { OnlineBand } from "@/components/sections/home/online-band";
import { WhyCerebellum } from "@/components/sections/home/why-cerebellum";
import { TrustSection } from "@/components/sections/home/trust-section";
import { ProcessSection } from "@/components/sections/home/process-section";
import { TeamSection, teamWillRender } from "@/components/sections/home/team-section";
import { FaqPreview } from "@/components/sections/home/faq-preview";
import { VerifyStrip } from "@/components/sections/home/verify-strip";
import { GenericSection } from "@/components/cms/sections";
import { getPage, getSteps, sectionsOf } from "@/cms/content";
import type { Section } from "@/cms/types";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: `Study Medicine Abroad: MBBS Admission Counselling | ${siteConfig.name}`,
  description:
    "Personalised guidance for studying MBBS and medicine abroad: compare destinations and universities, with step-by-step admission and visa support.",
  path: "/",
  absoluteTitle: true,
});

type Tone = "white" | "muted";

/** Sections with their own fixed background; everything else alternates white / grey. */
const FIXED_BG: Record<string, Tone | "blue"> = {
  homeHero: "white",
  homeAbout: "muted",
  homeOnline: "blue",
  homeVerify: "white",
  cards: "muted",
  textBlock: "white",
  checklist: "white",
  quote: "white",
};

/** Content is managed in Admin → Pages → Homepage. */
export default async function HomePage() {
  const page = await getPage("page:home");
  const [hasTeam, steps] = await Promise.all([teamWillRender(), getSteps()]);

  // Skip sections that would render nothing, so the white/grey rhythm stays correct.
  const sections = sectionsOf(page).filter((s) => (s.kind === "homeTeam" ? hasTeam : s.kind === "homeProcess" ? steps.length > 0 : true));

  const plan = planTones(sections);
  return (
    <>
      {plan.map(({ section, tone, prevWhite }) => (
        <HomeSection key={section.id} section={section} tone={tone} prevWhite={prevWhite} />
      ))}
    </>
  );
}

/** Works out each section's background so white and grey keep alternating in any order. */
function planTones(sections: Section[]) {
  const out: { section: Section; tone: Tone; prevWhite: boolean }[] = [];
  let prev: Tone | "blue" = "white";
  for (const s of sections) {
    const fixed = FIXED_BG[s.kind];
    const tone: Tone = fixed === "muted" || fixed === "white" ? fixed : prev === "white" ? "muted" : "white";
    out.push({ section: s, tone, prevWhite: prev === "white" });
    prev = fixed ?? tone;
  }
  return out;
}

function HomeSection({ section, tone, prevWhite }: { section: Section; tone: Tone; prevWhite: boolean }) {
  switch (section.kind) {
    case "homeHero":
      return <HomeHero section={section} />;
    case "homeAbout":
      return <AboutSplit section={section} />;
    case "homeProgrammes":
      return <ProgrammesShowcase section={section} tone={tone} />;
    case "homeDestinations":
      return <DestinationsSection section={section} tone={tone} />;
    case "homeQuiz":
      return <QuizSection section={section} tone={tone} />;
    case "homeOnline":
      return <OnlineBand section={section} />;
    case "homeWhy":
      return <WhyCerebellum section={section} tone={tone} />;
    case "homeTrust":
      return <TrustSection section={section} tone={tone} />;
    case "homeProcess":
      return <ProcessSection section={section} tone={tone} />;
    case "homeTeam":
      return <TeamSection section={section} tone={tone} />;
    case "homeFaq":
      return <FaqPreview section={section} tone={tone} />;
    case "homeVerify":
      return <VerifyStrip section={section} />;
    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}
