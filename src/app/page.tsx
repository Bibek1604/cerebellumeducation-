import { HomeHero } from "@/components/sections/home/hero";
import { DestinationMarquee } from "@/components/sections/home/destination-marquee";
import { AboutSplit } from "@/components/sections/home/about-split";
import { StatsStrip } from "@/components/sections/home/stats-strip";
import { ProgrammesShowcase } from "@/components/sections/home/programmes-showcase";
import { DestinationsBento } from "@/components/sections/home/destinations-bento";
import { OnlineCounselling } from "@/components/sections/home/online-counselling";
import { WhyCerebellum } from "@/components/sections/home/why-cerebellum";
import { ProcessSection } from "@/components/sections/home/process-section";
import { FeaturedUniversities } from "@/components/sections/home/featured-universities";
import { StoriesSection } from "@/components/sections/home/stories-section";
import { GuidesSection } from "@/components/sections/home/guides-section";
import { FaqPreview } from "@/components/sections/home/faq-preview";
import { VerifyStrip } from "@/components/sections/home/verify-strip";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: `Study Medicine Abroad: MBBS Admission Counselling | ${siteConfig.name}`,
  description:
    "Personalised guidance for studying MBBS and medicine abroad: compare destinations and universities, with step-by-step admission and visa support.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DestinationMarquee />
      <AboutSplit />
      <StatsStrip />
      <ProgrammesShowcase />
      <DestinationsBento />
      <OnlineCounselling />
      <WhyCerebellum />
      <ProcessSection />
      <FeaturedUniversities />
      <StoriesSection />
      <GuidesSection />
      <FaqPreview />
      <VerifyStrip />
      <CtaBand />
    </>
  );
}
