import "server-only";
import { getProgramme } from "@/data/programmes";
import type { Programme } from "@/types/content";
import { getSettings, hasImage, on, textsOf, visible } from "./content";
import type { ImageValue } from "./types";

/** Programmes as edited in Admin → Programme list. Ticking one off hides it everywhere. */

type Row = {
  name: string;
  shortName: string;
  slug: string;
  category: string;
  icon: string;
  image: ImageValue;
  summary: string;
  intro: string;
  duration: string;
  overview: unknown;
  considerations: unknown;
  eligibility: unknown;
  academic: unknown;
  showNepalRules: string;
  faqs: unknown;
  seoTitle?: string;
  seoDescription: string;
};

export async function getProgrammes(): Promise<Programme[]> {
  const s = await getSettings("settings:programmes");
  const seen = new Set<string>();
  const out: Programme[] = [];
  for (const r of on<Row>(s.data.list)) {
    if (!r.name || !r.slug || seen.has(r.slug)) continue;
    seen.add(r.slug);
    out.push({
      slug: r.slug,
      enabled: true,
      name: r.name,
      shortName: r.shortName || r.name,
      category: r.category,
      icon: r.icon,
      // Content saved before this field existed falls back to the built-in title.
      seoTitle: r.seoTitle || getProgramme(r.slug)?.seoTitle || `${r.name} for Nepali Students`,
      seoDescription: r.seoDescription || r.summary,
      summary: r.summary,
      intro: r.intro,
      overview: textsOf(r.overview),
      duration: r.duration,
      eligibility: textsOf(r.eligibility),
      academic: textsOf(r.academic),
      considerations: textsOf(r.considerations),
      faqs: on<{ question: string; answer: string }>(r.faqs).filter((f) => f.question && f.answer),
      image: hasImage(r.image) ? { src: r.image.src, alt: r.image.alt || r.name } : undefined,
      showNepalRules: r.showNepalRules === "yes",
    });
  }
  return out;
}

export async function getProgrammeBySlug(slug: string) {
  return (await getProgrammes()).find((p) => p.slug === slug);
}

export async function getProgrammeTemplate() {
  const s = await getSettings("settings:programme-page");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { t: s.data as Record<string, any>, show: visible(s) };
}

/** Replaces {programme} in a template string. */
export const withProgramme = (text: unknown, name: string) => String(text ?? "").replaceAll("{programme}", name);
