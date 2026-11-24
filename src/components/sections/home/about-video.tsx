"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

/**
 * Looping, muted campus video with a pause/play control.
 * Starts paused for visitors who prefer reduced motion.
 */
export function AboutVideo({ video, tag = "Study medicine abroad" }: { video?: { src: string; poster?: string; title: string } | null; tag?: string }) {
  const isEmbed = Boolean(video?.src.includes("youtube.com/embed") || video?.src.includes("player.vimeo.com"));
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The file is several MB: download and play it only when visitors reach it.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      },
      { threshold: 0.35 },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-navy shadow-lift">
      {isEmbed && video ? (
        <iframe
          src={video.src}
          title={video.title}
          className="aspect-[4/3.1] w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <video
          ref={ref}
          className="aspect-[4/3.1] w-full object-cover"
          src={video?.src ?? "/videos/campus-hallway.mp4"}
          poster={video?.poster ?? "/images/campus-hallway-poster.jpg"}
          muted
          loop
          playsInline
          preload="none"
          aria-label={video?.title ?? "Students walking and talking in a university hallway"}
        />
      )}
      {!isEmbed && (
        <>
      {/* Caption over the footage */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
      <div className="pointer-events-none absolute right-6 bottom-6 left-6 sm:right-8 sm:bottom-8 sm:left-8">
        <p className="font-display text-3xl leading-tight font-bold text-white sm:text-4xl">{video ? video.title : "Life on campus"}</p>
        {tag && <p className="mt-2 inline-flex rounded-md bg-orange-fill px-2.5 py-1 text-sm font-bold text-white">{tag}</p>}
      </div>
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute top-4 left-4 grid size-10 place-items-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur transition-colors hover:bg-white/35"
      >
        {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
      </button>
        </>
      )}
    </div>
  );
}
