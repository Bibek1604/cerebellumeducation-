import { ArrowUpRight, Play } from "lucide-react";
import type { Video } from "@/cms/media";

/** A 16:9 video: an embedded player for YouTube / Vimeo / Facebook, otherwise a link out. */
export function VideoCard({ video }: { video: Video }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {video.embed ? (
        <iframe
          src={video.embed}
          title={video.title}
          className="aspect-video w-full bg-navy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
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
