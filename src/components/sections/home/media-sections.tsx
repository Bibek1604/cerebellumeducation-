import { ArrowRight } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { ReelCard } from "@/components/media/reel-card";
import { VideoCard } from "@/components/media/video-card";
import { PostCard } from "@/components/media/post-card";
import { Highlight } from "@/cms/highlight";
import { visible } from "@/cms/content";
import { getPosts, getReels, getVideos } from "@/cms/media";
import type { LinkValue, Section as CmsSection } from "@/cms/types";

type Data = { heading: string; description: string; count: string; button?: LinkValue; followButton?: LinkValue };
type Tone = "white" | "muted";

const countOf = (d: Data, fallback: number) => Number(d.count) || fallback;
const isExternal = (href: string) => /^https?:\/\//.test(href);

/** Whether a reels / videos / blog section has anything to show (so the white/grey rhythm stays right). */
export async function mediaWillRender(kind: string) {
  if (kind === "homeReels") return (await getReels()).length > 0;
  if (kind === "homeVideos") return (await getVideos()).length > 0;
  if (kind === "homeBlog") return (await getPosts()).length > 0;
  return true;
}

function Header({ section, linkKey }: { section: CmsSection; linkKey: "button" | "followButton" }) {
  const d = section.data as Data;
  const show = visible(section);
  const link = d[linkKey];
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <Reveal>
        <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
      </Reveal>
      {link && show(linkKey) && link.label && link.href && (
        <ButtonLink href={link.href} variant="outline" external={isExternal(link.href)}>
          {link.label} <ArrowRight aria-hidden className="size-4" />
        </ButtonLink>
      )}
    </div>
  );
}

/** Reels. Heading: Admin → Pages → Homepage. Reels: Admin → Reels. */
export async function ReelsSection({ section, tone }: { section: CmsSection; tone: Tone }) {
  const d = section.data as Data;
  const reels = (await getReels()).slice(0, countOf(d, 8));
  if (!reels.length) return null;
  return (
    <Section tone={tone}>
      <Container>
        <Header section={section} linkKey="followButton" />
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {reels.map((r, i) => (
            <li key={r.id}>
              <Reveal delay={Math.min(i, 6) * 0.05}>
                <ReelCard reel={r} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Videos. Heading: Admin → Pages → Homepage. Videos: Admin → Videos. */
export async function VideosSection({ section, tone }: { section: CmsSection; tone: Tone }) {
  const d = section.data as Data;
  const videos = (await getVideos()).slice(0, countOf(d, 3));
  if (!videos.length) return null;
  return (
    <Section tone={tone}>
      <Container>
        <Header section={section} linkKey="button" />
        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((v, i) => (
            <li key={v.id}>
              <Reveal delay={Math.min(i, 6) * 0.05} className="h-full">
                <VideoCard video={v} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Latest blog posts. Heading: Admin → Pages → Homepage. Posts: Admin → Blog posts. */
export async function BlogSection({ section, tone }: { section: CmsSection; tone: Tone }) {
  const d = section.data as Data;
  const posts = (await getPosts()).slice(0, countOf(d, 3));
  if (!posts.length) return null;
  return (
    <Section tone={tone}>
      <Container>
        <Header section={section} linkKey="button" />
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Reveal delay={Math.min(i, 6) * 0.05} className="h-full">
                <PostCard post={p} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
