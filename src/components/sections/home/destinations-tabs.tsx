"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, MessageCircleQuestion } from "lucide-react";
import { DestinationArt } from "@/components/destinations/destination-art";
import type { Destination } from "@/types/content";
import { cn } from "@/lib/utils";

type Tab = { slug: string; label: string };

/** Programme tabs filter a clean grid of destination cards. */
export function DestinationsTabs({
  destinations,
  tabs,
  askCard,
}: {
  destinations: Destination[];
  tabs: Tab[];
  /** 'Another country in mind?' card; null hides it. */
  askCard: { title: string; text: string; label: string; href: string } | null;
}) {
  const [active, setActive] = useState("all");
  const shown = active === "all" ? destinations : destinations.filter((d) => d.programmes.includes(active));

  return (
    <>
      <div role="group" aria-label="Filter destinations by programme" className="mt-8 flex flex-wrap justify-center gap-2">
        {[{ slug: "all", label: "All countries" }, ...tabs].map((t) => (
          <button
            key={t.slug}
            type="button"
            aria-pressed={active === t.slug}
            onClick={() => setActive(t.slug)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors",
              active === t.slug ? "border-transparent bg-gradient-to-r from-primary to-sky text-white shadow-soft" : "border-line bg-white text-navy hover:border-primary hover:text-primary",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {shown.map((d) => (
          <li key={d.slug}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
              <DestinationArt destination={d} className="aspect-[16/11] overflow-hidden rounded-[1.1rem]" />
              <div className="flex flex-1 items-end justify-between gap-2 px-2 pt-3 pb-2 sm:gap-3 sm:px-3">
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold sm:text-lg">
                    <Link href={`/destinations/${d.slug}`} className="after:absolute after:inset-0">
                      {d.name}
                    </Link>
                  </h3>
                  <p className="mt-0.5 hidden text-sm text-ink-soft sm:line-clamp-2">{d.tagline}</p>
                </div>
                <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:size-9">
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </article>
          </li>
        ))}
        {active === "all" && askCard && shown.length % 4 !== 0 && (
          <li className={cn(shown.length % 2 === 1 ? "" : "col-span-2", "lg:col-span-1")}>
            <Link
              href={askCard.href}
              className="flex h-full min-h-44 flex-col justify-between rounded-3xl border-2 border-dashed border-gold/50 bg-cream p-5 transition-colors hover:border-gold sm:p-6"
            >
              <MessageCircleQuestion aria-hidden className="size-8 text-gold-dark" />
              <span>
                <span className="block text-base font-extrabold text-navy sm:text-lg">{askCard.title}</span>
                <span className="mt-1 hidden text-sm text-ink sm:block">{askCard.text}</span>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                  {askCard.label} <ArrowRight aria-hidden className="size-4" />
                </span>
              </span>
            </Link>
          </li>
        )}
      </ul>
    </>
  );
}
