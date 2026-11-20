import { Container, Section as Band } from "@/components/ui/container";
import { StoriesBrowser } from "@/components/testimonials/stories-browser";
import { StoriesEmpty } from "@/components/testimonials/stories-empty";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { getPage, hasImage, on, sectionsOf } from "@/cms/content";
import { getDestinations } from "@/cms/destinations";
import type { ImageValue } from "@/cms/types";
import type { Testimonial } from "@/types/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Student Success Stories",
  description:
    "Stories from students who studied medicine abroad with guidance from Cerebellum Education Network, shared in their own words with permission.",
  path: "/success-stories",
});

type Row = {
  consent: string;
  studentName: string;
  destination: string;
  university: string;
  programme: string;
  admissionYear: string;
  quote: string;
  photo: ImageValue;
  videoUrl: string;
};

/** Content: Admin → Pages → Success Stories. Only stories marked "permission on file" are shown. */
export default async function SuccessStoriesPage() {
  const [page, destinations] = await Promise.all([getPage("page:success-stories"), getDestinations()]);
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        if (s.kind === "hero") return <HeroSection key={s.id} section={s} href="/success-stories" />;
        if (s.kind !== "storyList") return <GenericSection key={s.id} section={s} prevWhite={i > 0} />;
        const stories: Testimonial[] = on<Row>(s.data.stories)
          .filter((r) => r.consent === "yes" && r.studentName && r.quote)
          .map((r) => ({
            id: r._id,
            studentName: r.studentName,
            destination: r.destination,
            university: r.university,
            programme: r.programme,
            admissionYear: r.admissionYear,
            quote: r.quote,
            photo: hasImage(r.photo) ? { src: r.photo.src, alt: r.photo.alt || r.studentName } : undefined,
            videoUrl: r.videoUrl || undefined,
            consentOnFile: true,
          }));
        return (
          <Band key={s.id}>
            <Container>
              {stories.length > 0 ? (
                <StoriesBrowser testimonials={stories} destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))} />
              ) : (
                <div className="mx-auto max-w-3xl">
                  <StoriesEmpty />
                </div>
              )}
            </Container>
          </Band>
        );
      })}
    </>
  );
}
