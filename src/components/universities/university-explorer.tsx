"use client";

import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { University } from "@/types/content";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

/**
 * Client-side search/filter over the university list. Cards are rendered on
 * the server and passed in keyed by slug, so this component only toggles
 * visibility — keeping client JS small.
 */
export function UniversityExplorer({
  universities,
  destinations,
  programmes,
  cards,
}: {
  universities: Pick<University, "slug" | "name" | "city" | "country" | "programmes">[];
  destinations: Option[];
  programmes: Option[];
  cards: Record<string, React.ReactNode>;
}) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [programme, setProgramme] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return universities.filter(
      (u) =>
        (!q || u.name.toLowerCase().includes(q) || u.city.toLowerCase().includes(q)) &&
        (!country || u.country === country) &&
        (!programme || u.programmes.includes(programme)),
    );
  }, [universities, query, country, programme]);

  const active = Boolean(query || country || programme);
  const selectCls =
    "h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 text-navy focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none";

  return (
    <div>
      <div role="search" className="grid gap-3 rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
        <label className="relative">
          <span className="sr-only">Search by university name or city</span>
          <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-ink-soft" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search university or city…"
            className={cn(selectCls, "pl-12")}
          />
        </label>
        <label>
          <span className="sr-only">Filter by destination</span>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
            <option value="">All destinations</option>
            {destinations.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filter by programme</span>
          <select value={programme} onChange={(e) => setProgramme(e.target.value)} className={selectCls}>
            <option value="">All programmes</option>
            {programmes.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!active}
          onClick={() => {
            setQuery("");
            setCountry("");
            setProgramme("");
          }}
          className="inline-flex h-12 items-center justify-center gap-1.5 rounded-xl px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary-light disabled:text-ink-soft disabled:hover:bg-transparent"
        >
          <X aria-hidden className="size-4" /> Clear
        </button>
      </div>

      <p aria-live="polite" className="mt-6 flex items-center gap-2 text-sm text-ink-soft">
        <SlidersHorizontal aria-hidden className="size-4" />
        Showing {results.length} of {universities.length} universities
      </p>

      {results.length === 0 && country && !query ? (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border-2 border-dashed border-gold/50 bg-cream p-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <MessageCircleQuestion aria-hidden className="size-8 shrink-0 text-gold-dark" />
            <div>
              <p className="font-display text-lg font-bold text-navy">
                Ask a counsellor about universities in {destinations.find((d) => d.value === country)?.label}
              </p>
              <p className="mt-1 text-ink">
                We haven&apos;t listed institutions here yet{programme ? " for this programme" : ""}. A counsellor can talk you through current options.
              </p>
            </div>
          </div>
          <Link
            href={`/book-counselling?country=${country}${programme ? `&programme=${programme}` : ""}`}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-5 font-semibold text-white hover:bg-primary-dark"
          >
            Ask a counsellor <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      ) : results.length > 0 ? (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {results.map((u) => (
            <li key={u.slug}>{cards[u.slug]}</li>
          ))}
        </ul>
      ) : (
        <div className="mt-6 rounded-3xl border-2 border-dashed border-line p-10 text-center">
          <p className="font-display text-lg font-bold text-navy">No universities match your filters</p>
          <p className="mt-2 text-ink">Try clearing a filter, or ask a counsellor about institutions we haven&apos;t listed yet.</p>
        </div>
      )}
    </div>
  );
}
