"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
import type { Testimonial } from "@/types/content";
import { cn } from "@/lib/utils";

export function TestimonialSlider({
  testimonials,
  destinationNames,
}: {
  testimonials: Testimonial[];
  destinationNames: Record<string, string>;
}) {
  const [index, setIndex] = useState(0);
  const count = testimonials.length;
  const t = testimonials[index];
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count);

  return (
    <div
      className="relative rounded-[2rem] border border-line bg-white p-8 shadow-soft sm:p-12"
      role="region"
      aria-roledescription="carousel"
      aria-label="Student success stories"
    >
      <Quote aria-hidden className="size-12 text-gold" />
      <div aria-live="polite" className="min-h-56">
        <AnimatePresence mode="wait">
          <motion.figure
            key={t.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35 }}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${count}`}
          >
            <blockquote className="mt-6 font-display text-xl leading-relaxed font-semibold text-navy sm:text-2xl">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-8 flex items-center gap-4">
              {t.photo ? (
                <Image src={t.photo.src} alt={t.photo.alt} width={56} height={56} className="size-14 rounded-full object-cover" />
              ) : (
                <span aria-hidden className="grid size-14 place-items-center rounded-full bg-primary-light font-display font-bold text-primary">
                  {t.studentName.slice(0, 1)}
                </span>
              )}
              <div>
                <p className="font-bold text-navy">{t.studentName}</p>
                <p className="text-sm text-ink-soft">
                  {t.programme} · {t.university}, {destinationNames[t.destination] ?? t.destination} · {t.admissionYear}
                </p>
              </div>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2">
            {testimonials.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show story ${i + 1}`}
                aria-current={i === index}
                className={cn("h-2 rounded-full transition-all", i === index ? "w-8 bg-primary" : "w-2 bg-line hover:bg-primary/40")}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => go(-1)} aria-label="Previous story" className="grid size-11 place-items-center rounded-full border border-line hover:border-primary hover:text-primary">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next story" className="grid size-11 place-items-center rounded-full border border-line hover:border-primary hover:text-primary">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
