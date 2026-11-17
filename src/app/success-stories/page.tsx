import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { StoriesBrowser } from "@/components/testimonials/stories-browser";
import { StoriesEmpty } from "@/components/testimonials/stories-empty";
import { CtaBand } from "@/components/sections/cta-band";
import { testimonials } from "@/data/testimonials";
import { destinations } from "@/data/destinations";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Student Success Stories",
  description:
    "Stories from students who studied medicine abroad with guidance from Cerebellum Education Network, shared in their own words with permission.",
  path: "/success-stories",
});

export default function SuccessStoriesPage() {
  return (
    <>
      <PageHero
        title="Every journey begins with a dream"
        description={
          testimonials.length > 0
            ? "Real experiences from students and families we've guided, shared with their permission and in their own words."
            : "Student stories will be shared here with each student's permission."
        }
        crumbs={[{ label: "Success Stories", href: "/success-stories" }]}
      />
      <Section>
        <Container>
          {testimonials.length > 0 ? (
            <StoriesBrowser testimonials={testimonials} destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))} />
          ) : (
            <div className="mx-auto max-w-3xl">
              <StoriesEmpty />
            </div>
          )}
        </Container>
      </Section>
      <CtaBand title="Your story could be next." description="Start with a free conversation about your goals." />
    </>
  );
}
