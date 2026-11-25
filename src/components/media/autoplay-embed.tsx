"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { autoplayUrl, playerCommands } from "@/lib/video";

/**
 * An embedded player that starts by itself, without sound, when visitors
 * scroll to it, and pauses when they scroll away. Browsers block autoplay with
 * sound; visitors turn it on with the player's own button.
 * With "reduce motion" switched on the player loads but waits for a click.
 * `children` is the cover shown until then.
 */
export function AutoplayEmbed({ embed, title, className, children }: { embed: string; title: string; className?: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { origin } = new URL(embed);
    const commands = playerCommands(embed);
    let inView = false;
    let started = false;

    const send = (messages: unknown[] | undefined) => messages?.forEach((m) => frame.current?.contentWindow?.postMessage(m, origin));

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry && entry.isIntersecting && entry.intersectionRatio >= 0.4);
        if (inView && !started) {
          started = true;
          setSrc(still ? embed : autoplayUrl(embed));
        } else if (started && !still) {
          send(inView ? commands?.play : commands?.pause);
        }
      },
      { threshold: [0, 0.4] },
    );
    observer.observe(el);

    // TikTok does not document its "muted" link option, so also mute it as soon as it is ready.
    function onMessage(e: MessageEvent) {
      if (still || !commands?.start || e.origin !== origin || e.source !== frame.current?.contentWindow) return;
      if ((e.data as { type?: unknown } | null)?.type === "onPlayerReady") send(inView ? commands.start : commands.pause);
    }
    window.addEventListener("message", onMessage);

    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [embed]);

  return (
    <div ref={box} className={className}>
      {src ? (
        <iframe
          ref={frame}
          src={src}
          title={title}
          className="absolute inset-0 size-full bg-navy"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      ) : (
        children
      )}
    </div>
  );
}
