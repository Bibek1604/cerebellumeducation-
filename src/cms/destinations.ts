import "server-only";
import type { Destination } from "@/types/content";
import type { Programme } from "@/types/content";
import { getProgrammes } from "./programmes";
import { getSettings, hasImage, on, textsOf, visible } from "./content";
import type { ImageValue } from "./types";

/**
 * Study destinations as edited in Admin → Countries. Every page, menu, form
 * and the sitemap reads from here, so ticking a country off hides it everywhere.
 */

type Row = {
  name: string;
  slug: string;
  tagline: string;
  summary: string;
  image: ImageValue;
  capital: string;
  code: string;
  coordinates: string;
  colorFrom: string;
  colorTo: string;
  programmes: unknown;
  duration: string;
  medium: string;
  overview: unknown;
  eligibility: unknown;
  academic: unknown;
  language: unknown;
  admissionNotes: unknown;
  costs: Record<string, string>;
  recognition: unknown;
  sources: unknown;
  faqs: unknown;
  seoDescription: string;
};

export async function getDestinations(): Promise<Destination[]> {
  const [s, programmes] = await Promise.all([getSettings("settings:destinations"), getProgrammes()]);
  const known = new Set(programmes.map((p) => p.slug));
  const seen = new Set<string>();
  const out: Destination[] = [];
  for (const r of on<Row>(s.data.countries)) {
    if (!r.name || !r.slug || seen.has(r.slug)) continue;
    seen.add(r.slug);
    const c = r.costs ?? {};
    out.push({
      slug: r.slug,
      enabled: true,
      name: r.name,
      code: (r.code || r.name.slice(0, 2)).toUpperCase(),
      capital: r.capital,
      coordinates: r.coordinates,
      tagline: r.tagline,
      seoDescription: r.seoDescription || r.summary,
      summary: r.summary,
      overview: textsOf(r.overview),
      programmes: [...new Set(on<{ programme: string }>(r.programmes).map((p) => p.programme))].filter((p) => known.has(p)),
      medium: r.medium,
      duration: r.duration,
      eligibility: textsOf(r.eligibility),
      academic: textsOf(r.academic),
      language: textsOf(r.language),
      admissionNotes: textsOf(r.admissionNotes),
      indicativeCosts: c.tuitionPerYear
        ? {
            tuitionPerYear: c.tuitionPerYear,
            hostelPerYear: c.hostelPerYear || undefined,
            livingPerMonth: c.livingPerMonth || undefined,
            currency: c.currency || "USD",
            source: c.source || "University fee information",
            lastVerified: c.lastVerified || "",
            notes: c.notes || undefined,
          }
        : null,
      recognition: textsOf(r.recognition),
      sources: on<{ label: string; href: string; publisher: string }>(r.sources)
        .filter((x) => x.href)
        .map((x) => ({ label: x.label || x.href, href: x.href, publisher: x.publisher || undefined })),
      faqs: on<{ question: string; answer: string }>(r.faqs).filter((f) => f.question && f.answer),
      image: hasImage(r.image) ? { src: r.image.src, alt: r.image.alt || r.name } : undefined,
      art: [r.colorFrom || "#1d5fb8", r.colorTo || "#123a6b"],
    });
  }
  return out;
}

export async function getDestinationBySlug(slug: string) {
  return (await getDestinations()).find((d) => d.slug === slug);
}

/** Countries offering a programme, from an already-loaded list. */
export function destinationsOffering(list: Destination[], programmeSlug: string) {
  return list.filter((d) => d.programmes.includes(programmeSlug));
}

/** Programmes with their destination slugs, for the counselling forms. */
export function programmeOptions(programmes: Programme[], list: Destination[]) {
  return programmes.map((p) => ({ slug: p.slug, name: p.name, destinations: destinationsOffering(list, p.slug).map((d) => d.slug) }));
}

/* ─────────────────────── Country page template ─────────────────────── */

export async function getDestinationTemplate() {
  const s = await getSettings("settings:destination-page");
  const show = visible(s);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { t: s.data as Record<string, any>, show };
}

/** Replaces {country} in a template string. */
export const withCountry = (text: unknown, country: string) => String(text ?? "").replaceAll("{country}", country);
