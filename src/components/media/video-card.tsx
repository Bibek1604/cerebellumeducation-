import { ArrowUpRight, Play } from "lucide-react";
import type { Video } from "@/cms/media";
import { AutoplayEmbed } from "./autoplay-embed";

/** A 16:9 video that plays by itself (YouTube / Vimeo / Facebook / TikTok), otherwise a link out. */
export function VideoCard({ video }: { video: Video }) {
  const cover = (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-hero-vivid grid aspect-video w-full place-items-center text-white"
      aria-label={`Watch ${video.title} (opens in a new tab)`}
    >
      <span className="grid size-16 place-items-center rounded-full bg-white/25 ring-1 ring-white/50">
        <Play aria-hidden className="size-7 translate-x-0.5 fill-white" />
      </span>
    </a>
  );
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {video.embed ? (
        <AutoplayEmbed embed={video.embed} title={video.title} className="relative aspect-video w-full overflow-hidden bg-navy">
          {cover}
        </AutoplayEmbed>
      ) : (
        cover
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug font-bold">{video.title}</h3>
        {video.description && <p className="mt-2 text-sm leading-relaxed text-ink">{video.description}</p>}
        {!video.embed && (
          <a href={video.url} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-primary">
            Watch video <ArrowUpRight aria-hidden className="size-4" />
          </a>
        )}
      </div>
    </article>
  );
}
