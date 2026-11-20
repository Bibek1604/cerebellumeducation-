"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { CmsIcon } from "@/cms/cms-icon";
import type { Programme } from "@/types/content";
import { cn } from "@/lib/utils";

export type ProgrammeTab = {
  slug: string;
  name: string;
  category: string;
  icon: Programme["icon"];
  summary: string;
  points: string[];
  photo: { src: string; alt: string };
};

/** Services-style showcase: photo panel + overlapping detail card, with a vertical tab list. */
export function ProgrammesTabs({
  items,
  bookLabel = "Book counselling",
  learnLabel = "Learn more",
}: {
  items: ProgrammeTab[];
  bookLabel?: string;
  learnLabel?: string;
}) {
  const [active, setActive] = useState(items[0]?.slug);
  const p = items.find((i) => i.slug === active) ?? items[0];
  if (!p) return null;

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_17rem] lg:items-center lg:gap-10">
      {/* Showcase */}
      <div className="relative">
        <div aria-hidden className="absolute inset-y-6 -left-4 w-2/3 rounded-3xl bg-primary-light sm:-left-8" />
        <AnimatePresence mode="wait">
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid items-center gap-0 md:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="overflow-hidden rounded-3xl shadow-lift">
              <Image src={p.photo.src} alt={p.photo.alt} width={1600} height={1067} unoptimized={p.photo.src.startsWith("/media/")} sizes="(min-width: 1024px) 30vw, 100vw" className="aspect-[4/4.2] w-full object-cover" />
            </div>
            <div className="relative -mt-16 mx-4 rounded-3xl border border-line bg-white p-6 shadow-lift sm:p-8 md:mx-0 md:mt-0 md:-ml-16">
              <span className="inline-flex rounded-md bg-primary-light px-2.5 py-1 text-[0.7rem] font-bold tracking-[0.12em] text-primary uppercase">{p.category}</span>
              <h3 className="mt-4 text-3xl leading-tight font-bold sm:text-[2.1rem]">{p.name}</h3>
              <p className="mt-3 leading-relaxed text-ink">{p.summary}</p>
              <ul className="mt-5 grid gap-2.5 text-sm sm:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2 text-ink">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href={`/book-counselling?programme=${p.slug}`} variant="secondary">
                  {bookLabel}
                </ButtonLink>
                <ButtonLink href={`/programs/${p.slug}`} variant="outline">
                  {learnLabel} <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Vertical tab list */}
      <div role="tablist" aria-label="Programmes" aria-orientation="vertical" className="order-first flex gap-2 lg:order-none overflow-x-auto pb-1 [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible">
        {items.map((i) => {
          const on = i.slug === p.slug;
          return (
            <button
              key={i.slug}
              role="tab"
              type="button"
              aria-selected={on}
              onClick={() => setActive(i.slug)}
              className={cn(
                "group relative flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-left text-sm font-semibold transition-colors lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-1 lg:py-4",
                on ? "border-primary bg-primary text-white lg:bg-transparent lg:text-primary" : "border-line bg-white text-navy hover:text-primary lg:bg-transparent",
              )}
            >
              <CmsIcon icon={i.icon} aria-hidden className={cn("size-5 shrink-0", on ? "lg:text-gold" : "text-primary")} />
              <span className="whitespace-nowrap lg:whitespace-normal">{i.name}</span>
              {on && <span aria-hidden className="absolute bottom-[-1px] left-0 hidden h-0.5 w-12 bg-gold lg:block" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
