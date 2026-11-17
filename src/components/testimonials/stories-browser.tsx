"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { useState } from "react";
import type { Testimonial } from "@/types/content";
import { cn } from "@/lib/utils";

export function StoriesBrowser({
  testimonials,
  destinations,
}: {
  testimonials: Testimonial[];
  destinations: { slug: string; name: string }[];
}) {
  const [filter, setFilter] = useState("all");
  const names = Object.fromEntries(destinations.map((d) => [d.slug, d.name]));
  const used = destinations.filter((d) => testimonials.some((t) => t.destination === d.slug));
  const shown = filter === "all" ? testimonials : testimonials.filter((t) => t.destination === filter);

  return (
    <div>
      {used.length > 1 && (
        <div role="group" aria-label="Filter stories by destination" className="flex flex-wrap gap-2">
          {[{ slug: "all", name: "All destinations" }, ...used].map((d) => (
            <button
              key={d.slug}
              type="button"
              aria-pressed={filter === d.slug}
              onClick={() => setFilter(d.slug)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                filter === d.slug ? "bg-primary text-white" : "bg-muted text-navy hover:bg-primary-light",
              )}
            >
              {d.name}
            </button>
          ))}
        </div>
      )}
      <ul className="mt-10 columns-1 gap-6 md:columns-2 lg:columns-3">
        {shown.map((t) => (
          <li key={t.id} className="mb-6 break-inside-avoid rounded-3xl border border-line bg-white p-7 shadow-soft">
            {t.videoUrl && (
              <div className="relative mb-6 aspect-video overflow-hidden rounded-2xl bg-navy">
                <iframe src={t.videoUrl} title={`Video story from ${t.studentName}`} loading="lazy" allowFullScreen className="absolute inset-0 size-full" />
              </div>
            )}
            <Quote aria-hidden className="size-8 text-gold" />
            <blockquote className="mt-4 leading-relaxed text-navy">“{t.quote}”</blockquote>
            <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              {t.photo ? (
                <Image src={t.photo.src} alt={t.photo.alt} width={48} height={48} className="size-12 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-12 place-items-center rounded-full bg-primary-light font-bold text-primary">
                  {t.studentName.slice(0, 1)}
                </span>
              )}
              <div>
                <p className="font-bold text-navy">{t.studentName}</p>
                <p className="text-sm text-ink-soft">
                  {t.programme} · {t.university}, {names[t.destination] ?? t.destination} · {t.admissionYear}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
