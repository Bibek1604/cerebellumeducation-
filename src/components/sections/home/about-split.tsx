import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { CmsIcon } from "@/cms/cms-icon";
import { Highlight } from "@/cms/highlight";
import { hasImage, on, visible } from "@/cms/content";
import type { ImageValue, LinkValue, Section } from "@/cms/types";
import { cn } from "@/lib/utils";
import { AboutVideo } from "./about-video";

type AboutData = {
  video: { src: string; poster: ImageValue; caption: string; tag: string };
  photo: ImageValue;
  heading: string;
  description: string;
  points: unknown;
  button: LinkValue;
};

/** About: campus video + checklist. Content: Admin → Pages → Homepage → About (video & checklist). */
export function AboutSplit({ section }: { section: Section }) {
  const d = section.data as AboutData;
  const show = visible(section);
  const video = show("video") && d.video?.src ? d.video : null;
  const photo = show("photo") && hasImage(d.photo) ? d.photo : null;
  const media = Boolean(video || photo);

  return (
    <section className="bg-muted pt-16 pb-14 sm:pt-20 sm:pb-16 lg:pb-20">
      <Container>
        <div className={cn("grid items-center gap-12 lg:gap-16", media && "lg:grid-cols-2")}>
          {media && (
            <Reveal className="relative">
              {/* Offset tile behind the video, as in a framed media block */}
              <div aria-hidden className="absolute -top-4 -left-4 h-2/3 w-2/3 rounded-3xl bg-primary-light" />
              {video ? (
                <div className={cn("relative", photo && "sm:mr-16 sm:mb-10")}>
                  <AboutVideo
                    video={{ src: video.src, poster: hasImage(video.poster) ? video.poster.src : undefined, title: video.caption }}
                    tag={video.tag}
                  />
                </div>
              ) : (
                photo && (
                  <div className="relative overflow-hidden rounded-3xl shadow-lift">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={1600}
                      height={1067}
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="aspect-[4/3.1] w-full object-cover"
                      style={{ objectPosition: photo.position || undefined }}
                    />
                  </div>
                )
              )}
              {/* Overlapping second photo */}
              {video && photo && (
                <div className="absolute right-0 bottom-0 hidden w-[42%] overflow-hidden rounded-2xl border-[5px] border-white shadow-lift sm:block">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1600}
                    height={1067}
                    sizes="(min-width: 1024px) 18vw, 40vw"
                    className="aspect-[4/3.3] w-full object-cover"
                    style={{ objectPosition: photo.position || "70% 50%" }}
                  />
                </div>
              )}
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {on<{ icon: string; text: string }>(d.points).map((p) => (
                <li key={p._id} className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-soft">
                    <CmsIcon icon={p.icon} aria-hidden className="size-4.5" />
                  </span>
                  <span className="pt-1.5 text-[0.95rem] leading-snug font-medium text-navy">{p.text}</span>
                </li>
              ))}
            </ul>
            {show("button") && d.button?.label && d.button.href && (
              <ButtonLink href={d.button.href} variant="outline" className="mt-9">
                {d.button.label} <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
