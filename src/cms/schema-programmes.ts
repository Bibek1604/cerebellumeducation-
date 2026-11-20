/**
 * Programmes: the programme list, the /programs page and the shared layout of
 * every programme page. Defaults are copied from data/programmes.ts.
 * Pure data — safe to import from client components.
 */
import { allProgrammes } from "@/data/programmes";
import type { FieldSpec, PageContent, Section, SectionSpec, SettingsContent } from "./types";

let seq = 0;
const nid = (p: string) => `${p}-${++seq}`;
const items = <T extends Record<string, unknown>>(prefix: string, arr: T[]) => arr.map((v) => ({ _id: nid(prefix), enabled: true, ...v }));
const texts = (prefix: string, arr: string[]) => items(prefix, arr.map((text) => ({ text })));
const section = (kind: string, data: Record<string, unknown>): Section => ({ id: nid(kind), kind, enabled: true, hidden: [], data });

const textItem: FieldSpec[] = [{ type: "textarea", key: "text", label: "Text", maxLength: 600 }];
const textList = (key: string, label: string, max = 12): FieldSpec => ({ type: "list", key, label, itemLabel: "point", titleKey: "text", max, fields: textItem });

/** Old icon names in data/programmes.ts → Admin Panel icon names. */
const legacyIcon: Record<string, string> = { graduation: "graduation-cap", heart: "heart-pulse" };
const MEDICAL_DEGREES = ["mbbs", "md", "dentistry"];

/* ───────────────────────────── Programme list ───────────────────────────── */

export const programmesSpec: FieldSpec[] = [
  {
    type: "list",
    key: "list",
    label: "Programmes",
    itemLabel: "programme",
    titleKey: "name",
    max: 30,
    help: "Each programme gets its own page at /programs/<web address>. Untick one to hide it everywhere: menus, homepage, forms and the sitemap. Which countries offer it is set under Countries.",
    fields: [
      { type: "text", key: "name", label: "Full name", maxLength: 80 },
      { type: "text", key: "shortName", label: "Short name (used in buttons and headings)", maxLength: 30 },
      { type: "text", key: "slug", label: "Web address (e.g. 'mbbs' → /programs/mbbs)", format: "slug", maxLength: 60, help: "Changing it changes the page link and the countries' programme choices." },
      { type: "text", key: "category", label: "Category tag on cards", placeholder: "Medicine", maxLength: 30 },
      { type: "icon", key: "icon", label: "Icon" },
      { type: "image", key: "image", label: "Photo (homepage programmes showcase)" },
      { type: "textarea", key: "summary", label: "Short summary (cards and menu)", maxLength: 300 },
      { type: "textarea", key: "intro", label: "Intro under the page headline", maxLength: 500 },
      { type: "text", key: "duration", label: "Typical duration", maxLength: 200 },
      textList("overview", "Overview paragraphs", 8),
      textList("considerations", "Important considerations"),
      textList("eligibility", "Eligibility"),
      textList("academic", "Academic requirements"),
      {
        type: "select",
        key: "showNepalRules",
        label: "Show the Nepal 'Before you apply' rules box",
        options: [
          { value: "yes", label: "Yes (medical degrees covered by MEC rules)" },
          { value: "no", label: "No" },
        ],
      },
      {
        type: "list",
        key: "faqs",
        label: "Questions & answers",
        itemLabel: "question",
        titleKey: "question",
        max: 20,
        fields: [
          { type: "text", key: "question", label: "Question", maxLength: 200 },
          { type: "textarea", key: "answer", label: "Answer", maxLength: 1200 },
        ],
      },
      { type: "textarea", key: "seoDescription", label: "Search engine description (120–160 characters)", maxLength: 200 },
    ],
  },
];

export const programmesDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    list: allProgrammes.map((p) => ({
      _id: nid("prog"),
      enabled: p.enabled,
      name: p.name,
      shortName: p.shortName,
      slug: p.slug,
      category: p.category,
      icon: legacyIcon[p.icon] ?? p.icon,
      image: p.image ? { src: p.image.src, alt: p.image.alt } : { src: "", alt: "" },
      summary: p.summary,
      intro: p.intro,
      duration: p.duration,
      overview: texts("pov", p.overview),
      considerations: texts("pcn", p.considerations),
      eligibility: texts("pel", p.eligibility),
      academic: texts("pac", p.academic),
      showNepalRules: MEDICAL_DEGREES.includes(p.slug) ? "yes" : "no",
      faqs: items("pfq", p.faqs.map((f) => ({ question: f.question, answer: f.answer }))),
      seoDescription: p.seoDescription,
    })),
  },
});

/* ─────────────────────────── Programme page layout ─────────────────────────── */

const block = (key: string, label: string, fields: FieldSpec[], help?: string): FieldSpec => ({ type: "object", key, label, hideable: true, fields, help });

export const programmePageSpec: FieldSpec[] = [
  {
    type: "object",
    key: "card",
    label: "Blue card in the page header",
    help: "Write {programme} where the programme's short name should appear.",
    fields: [
      { type: "text", key: "durationLabel", label: "'Typical duration' label", maxLength: 40 },
      { type: "text", key: "availableLabel", label: "'Available in' label", hideable: true, maxLength: 40 },
      { type: "text", key: "availableEmpty", label: "Text when no country offers it", maxLength: 100 },
      { type: "text", key: "buttonLabel", label: "Button text", maxLength: 60 },
    ],
  },
  { type: "text", key: "overviewHeading", label: "Overview heading", maxLength: 120 },
  block("considerations", "Important considerations box", [{ type: "text", key: "heading", label: "Heading", maxLength: 80 }]),
  block("requirements", "Eligibility & academic cards", [
    { type: "text", key: "eligibilityHeading", label: "First card heading", maxLength: 80 },
    { type: "text", key: "academicHeading", label: "Second card heading", maxLength: 80 },
    { type: "textarea", key: "note", label: "Small note under the cards", hideable: true, maxLength: 300 },
  ]),
  block("destinations", "Countries offering it", [{ type: "text", key: "heading", label: "Heading", maxLength: 120 }]),
  block("nepal", "Nepal 'Before you apply' box", [], "Shown only on programmes set to show it. Its content is edited under Nepal & India guidance."),
  block("journey", "Admission steps", [
    { type: "text", key: "heading", label: "Heading", maxLength: 120 },
    { type: "link", key: "link", label: "Link under the steps", hideable: true },
  ], "The steps come from Admission steps."),
  block("faqs", "Questions", [{ type: "text", key: "heading", label: "Heading", maxLength: 120 }]),
];

export const programmePageDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    card: {
      durationLabel: "Typical duration",
      availableLabel: "Available in",
      availableEmpty: "Ask a counsellor about current options",
      buttonLabel: "Ask about {programme}",
    },
    overviewHeading: "What studying {programme} involves",
    considerations: { heading: "Important considerations" },
    requirements: {
      eligibilityHeading: "Eligibility",
      academicHeading: "Academic requirements",
      note: "Exact requirements are set by each university and may be affected by your home-country regulator's rules.",
    },
    destinations: { heading: "Where you can study {programme}" },
    nepal: {},
    journey: { heading: "From first conversation to campus", link: { label: "Read the full admission guide", href: "/admission-process" } },
    faqs: { heading: "{programme} questions" },
  },
});

/* ─────────────────────────────── /programs page ─────────────────────────────── */

export const programmesListSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  { ...heroSpec, description: "Breadcrumb, headline, intro, photo and the floating card. Write {count} in the card title for the number of programmes." },
  { kind: "progGrid", label: "Programme cards", description: "The grid of programme cards. The programmes themselves are edited under Programmes (shared content).", fields: [] },
];

export const programmesListDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "Programmes",
      title: "Find the right *healthcare programme* for you",
      description:
        "Medicine is our focus, alongside related healthcare degrees. Each programme page explains eligibility, typical duration, where it's available and what to consider.",
      image: { src: "/images/programme-mbbs.jpg", alt: "Medical students in white coats reviewing notes", position: "40% 50%" },
      badge: { title: "{count} programmes", text: "From MBBS to nursing" },
    }),
    section("progGrid", {}),
  ],
});
