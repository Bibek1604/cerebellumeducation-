import Image from "next/image";
import { ArrowUpRight, Play } from "lucide-react";
import { SocialIcon } from "@/components/brand/social-icon";
import type { Reel } from "@/cms/media";
import { platformName } from "@/lib/video";
import { AutoplayEmbed } from "./autoplay-embed";

/** A reel that plays by itself (TikTok / YouTube / Vimeo), otherwise a cover that opens it on its platform. */
export function ReelCard({ reel }: { reel: Reel }) {
  if (!reel.embed) return <ReelCover reel={reel} />;
  return (
    <AutoplayEmbed embed={reel.embed} title={reel.title} className="relative isolate aspect-[9/16] overflow-hidden rounded-3xl bg-navy shadow-soft">
      <ReelCover reel={reel} />
    </AutoplayEmbed>
  );
}

/** Portrait cover (or brand gradient), platform badge and title, linking to the reel. */
function ReelCover({ reel }: { reel: Reel }) {
  const where = platformName[reel.platform];
  return (
    <a
      href={reel.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${reel.title} (watch on ${where}, opens in a new tab)`}
      className="group relative isolate flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-3xl bg-hero-vivid p-4 text-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift sm:p-5"
    >
      {reel.thumbnail ? (
        <Image
          src={reel.thumbnail.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 33vw, 50vw"
          className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: reel.thumbnail.position || undefined }}
        />
      ) : null}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

      <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold ring-1 ring-white/35 backdrop-blur">
        <SocialIcon platform={reel.platform} className="size-3.5" /> {where}
      </span>
      <span aria-hidden className="absolute top-1/2 left-1/2 grid size-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 ring-1 ring-white/50 backdrop-blur transition-transform group-hover:scale-110">
        <Play className="size-6 translate-x-0.5 fill-white" />
      </span>

      <p className="line-clamp-3 text-base leading-snug font-bold text-white sm:text-lg">{reel.title}</p>
      <span className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-gold">
        Watch on {where} <ArrowUpRight aria-hidden className="size-4" />
      </span>
    </a>
  );
}
