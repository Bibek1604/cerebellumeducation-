import { Container, Section } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { VideoCard } from "@/components/media/video-card";
import { ReelCard } from "@/components/media/reel-card";
import { getReels, getVideos } from "@/cms/media";
import { pageMetadata } from "@/lib/seo";

/** Hidden from search engines while the page is still empty. */
export async function generateMetadata() {
  const [videos, reels] = await Promise.all([getVideos(), getReels()]);
  const hasContent = videos.length + reels.length > 0;
  return pageMetadata({
    title: "Medical Study Videos & Reels",
    description:
      "Videos and reels from Cerebellum Education Network: student life, university walkthroughs and answers for Nepali medical students.",
    path: "/videos",
    noIndex: !hasContent,
  });
}

/** Videos: Admin → Videos. Reels: Admin → Reels. */
export default async function VideosPage() {
  const [videos, reels] = await Promise.all([getVideos(), getReels()]);
  return (
    <>
      <PageHero
        title={<span className="text-brand-gradient">Videos & Reels</span>}
        description="Student life, university walkthroughs and answers to the questions families ask us most."
        crumbs={[{ label: "Videos", href: "/videos" }]}
        badge={null}
      />
      {videos.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Videos</h2>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {videos.map((v) => (
                <li key={v.id}>
                  <VideoCard video={v} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      {reels.length > 0 && (
        <Section tone={videos.length ? "muted" : "white"}>
          <Container>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Reels</h2>
            <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {reels.map((r) => (
                <li key={r.id}>
                  <ReelCard reel={r} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
      {!videos.length && !reels.length && (
        <Section>
          <Container>
            <p className="text-center text-ink">New videos are on their way. Please check back soon.</p>
          </Container>
        </Section>
      )}
    </>
  );
}
