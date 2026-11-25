/**
 * Study destinations: the country list, the /destinations page and the
 * shared template used by every country page. Defaults are copied from
 * data/destinations.ts, so nothing changes until an administrator saves.
 * Pure data — safe to import from client components.
 */
import { allDestinations } from "@/data/destinations";
import type { FieldSpec, PageContent, Section, SectionSpec, SettingsContent } from "./types";

let seq = 0;
const nid = (p: string) => `${p}-${++seq}`;
const items = <T extends Record<string, unknown>>(prefix: string, arr: T[]) => arr.map((v) => ({ _id: nid(prefix), enabled: true, ...v }));
const texts = (prefix: string, arr: string[]) => items(prefix, arr.map((text) => ({ text })));
const section = (kind: string, data: Record<string, unknown>): Section => ({ id: nid(kind), kind, enabled: true, hidden: [], data });

const textItem: FieldSpec[] = [{ type: "textarea", key: "text", label: "Text", maxLength: 600 }];
const textList = (key: string, label: string, max = 12): FieldSpec => ({ type: "list", key, label, itemLabel: "point", titleKey: "text", max, fields: textItem });

/* ───────────────────────────── Country list ───────────────────────────── */

export const destinationsSpec: FieldSpec[] = [
  {
    type: "list",
    key: "countries",
    label: "Countries",
    itemLabel: "country",
    titleKey: "name",
    max: 30,
    help: "Each country gets its own page at /destinations/<web address>. Untick a country to hide it everywhere: menus, footer, homepage, forms and the sitemap.",
    fields: [
      { type: "text", key: "name", label: "Country name", maxLength: 60 },
      { type: "text", key: "slug", label: "Web address (e.g. 'georgia' → /destinations/georgia)", format: "slug", maxLength: 60, help: "Lowercase letters, numbers and dashes. Changing it changes the page link." },
      { type: "text", key: "tagline", label: "Short line on the country card", maxLength: 160 },
      { type: "textarea", key: "summary", label: "Intro under the page headline", maxLength: 500 },
      { type: "image", key: "image", label: "Country photo (cards and page header)" },
      { type: "text", key: "capital", label: "Capital (shown on the photo)", maxLength: 60 },
      { type: "text", key: "code", label: "Country code (2 letters, used when there is no photo)", maxLength: 2 },
      { type: "text", key: "coordinates", label: "Coordinates (shown when there is no photo)", maxLength: 40 },
      { type: "text", key: "colorFrom", label: "Artwork colour 1 (when there is no photo)", format: "color", placeholder: "#1d5fb8", maxLength: 7 },
      { type: "text", key: "colorTo", label: "Artwork colour 2", format: "color", placeholder: "#123a6b", maxLength: 7 },
      {
        type: "list",
        key: "programmes",
        label: "Programmes offered",
        itemLabel: "programme",
        titleKey: "programme",
        max: 30,
        fields: [{ type: "select", key: "programme", label: "Programme", options: [], optionsFrom: "programmes" }],
      },
      { type: "text", key: "duration", label: "Duration", maxLength: 200 },
      { type: "text", key: "medium", label: "Language of instruction", maxLength: 200 },
      textList("overview", "Overview paragraphs", 8),
      textList("eligibility", "General eligibility"),
      textList("academic", "Academic qualifications"),
      textList("language", "Language requirements"),
      textList("admissionNotes", "Admission notes specific to this country"),
      {
        type: "object",
        key: "costs",
        label: "Verified costs",
        help: "Leave the tuition empty to show the 'costs shared during counselling' box instead. Only enter figures you have confirmed for the current intake.",
        fields: [
          { type: "text", key: "currency", label: "Currency", placeholder: "USD", maxLength: 10 },
          { type: "text", key: "tuitionPerYear", label: "Tuition per year", placeholder: "4,500", maxLength: 40 },
          { type: "text", key: "hostelPerYear", label: "Hostel per year", maxLength: 40 },
          { type: "text", key: "livingPerMonth", label: "Living expenses per month", maxLength: 40 },
          { type: "text", key: "source", label: "Source of the figures", placeholder: "University fee letter", maxLength: 160 },
          { type: "text", key: "lastVerified", label: "Verified on (YYYY-MM-DD)", format: "date", maxLength: 10 },
          { type: "textarea", key: "notes", label: "Notes", maxLength: 300 },
        ],
      },
      textList("recognition", "Recognition & licensing points", 8),
      {
        type: "list",
        key: "sources",
        label: "Official sources",
        itemLabel: "source",
        titleKey: "label",
        max: 10,
        fields: [
          { type: "text", key: "label", label: "Link text", maxLength: 120 },
          { type: "text", key: "href", label: "Link", format: "href", maxLength: 300 },
          { type: "text", key: "publisher", label: "Publisher", maxLength: 120 },
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
      { type: "text", key: "seoTitle", label: "Search engine title (up to 47 characters)", maxLength: 60, help: "The brand name is added after it. Leave empty for the standard title." },
      { type: "textarea", key: "seoDescription", label: "Search engine description (120–160 characters)", maxLength: 200 },
    ],
  },
];

export const destinationsDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    countries: allDestinations.map((d) => ({
      _id: nid("dest"),
      enabled: d.enabled,
      name: d.name,
      slug: d.slug,
      tagline: d.tagline,
      summary: d.summary,
      image: d.image ? { src: d.image.src, alt: d.image.alt } : { src: "", alt: "" },
      capital: d.capital,
      code: d.code,
      coordinates: d.coordinates,
      colorFrom: d.art[0],
      colorTo: d.art[1],
      programmes: items("dp", d.programmes.map((programme) => ({ programme }))),
      duration: d.duration,
      medium: d.medium,
      overview: texts("ov", d.overview),
      eligibility: texts("el", d.eligibility),
      academic: texts("ac", d.academic),
      language: texts("lg", d.language),
      admissionNotes: texts("an", d.admissionNotes),
      costs: {
        currency: d.indicativeCosts?.currency ?? "",
        tuitionPerYear: d.indicativeCosts?.tuitionPerYear ?? "",
        hostelPerYear: d.indicativeCosts?.hostelPerYear ?? "",
        livingPerMonth: d.indicativeCosts?.livingPerMonth ?? "",
        source: d.indicativeCosts?.source ?? "",
        lastVerified: d.indicativeCosts?.lastVerified ?? "",
        notes: d.indicativeCosts?.notes ?? "",
      },
      recognition: texts("rc", d.recognition),
      sources: items("src", d.sources.map((s) => ({ label: s.label, href: s.href, publisher: s.publisher ?? "" }))),
      faqs: items("fq", d.faqs.map((f) => ({ question: f.question, answer: f.answer }))),
      seoTitle: d.seoTitle,
      seoDescription: d.seoDescription,
    })),
  },
});

/* ─────────────────────────── Country page template ─────────────────────────── */

const block = (key: string, label: string, fields: FieldSpec[], help?: string): FieldSpec => ({ type: "object", key, label, hideable: true, fields, help });

export const destinationPageSpec: FieldSpec[] = [
  {
    type: "object",
    key: "hero",
    label: "Page header",
    help: "Write {country} where the country name should appear.",
    fields: [
      { type: "text", key: "titlePrefix", label: "Headline before the country name", maxLength: 60 },
      { type: "text", key: "durationLabel", label: "'Duration' card label", hideable: true, maxLength: 30 },
      { type: "text", key: "mediumLabel", label: "'Instruction' card label", hideable: true, maxLength: 30 },
      { type: "text", key: "primaryLabel", label: "Orange button text", maxLength: 60 },
      { type: "link", key: "secondaryButton", label: "Outline button", hideable: true },
    ],
  },
  { type: "text", key: "navLabel", label: "'On this page' menu title", hideable: true, maxLength: 40 },
  block("overview", "Overview", [{ type: "text", key: "heading", label: "Heading", maxLength: 120 }]),
  block("programmes", "Available programmes", [{ type: "text", key: "heading", label: "Heading", maxLength: 120 }]),
  block("eligibility", "Eligibility", [
    { type: "text", key: "heading", label: "Heading", maxLength: 120 },
    { type: "text", key: "generalTitle", label: "First card title", maxLength: 60 },
    { type: "text", key: "academicTitle", label: "Second card title", maxLength: 60 },
    { type: "text", key: "languageTitle", label: "Third card title", maxLength: 60 },
    { type: "textarea", key: "note", label: "Small note under the cards", hideable: true, maxLength: 300 },
  ]),
  block("admission", "Admission process", [
    { type: "text", key: "heading", label: "Heading", maxLength: 120 },
    { type: "text", key: "specificHeading", label: "Heading above the country-specific notes", maxLength: 120 },
  ], "The steps themselves come from Admission steps."),
  block("costs", "Costs", [
    { type: "text", key: "heading", label: "Heading", maxLength: 120 },
    { type: "text", key: "emptyTitle", label: "Box title when no verified figures", maxLength: 120 },
    { type: "textarea", key: "emptyText", label: "Box text when no verified figures", maxLength: 400 },
    { type: "text", key: "emptyLink", label: "Box link text", maxLength: 80 },
  ]),
  block("nepal", "Nepal requirements ('Before you apply' box)", [], "Its content is edited under Nepal & India guidance."),
  block("recognition", "Recognition & licensing", [
    { type: "text", key: "heading", label: "Heading", maxLength: 120 },
    { type: "textarea", key: "important", label: "'Important' note", hideable: true, maxLength: 400 },
    { type: "text", key: "regulatorsTitle", label: "Title above the home-country regulators", hideable: true, maxLength: 80 },
  ]),
  block("faqs", "FAQs", [{ type: "text", key: "heading", label: "Heading", maxLength: 120 }]),
];

export const destinationPageDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    hero: {
      titlePrefix: "Study Medicine in",
      durationLabel: "Duration",
      mediumLabel: "Instruction",
      primaryLabel: "Get advice on {country}",
      secondaryButton: { label: "Compare destinations", href: "/destinations" },
    },
    navLabel: "On this page",
    overview: { heading: "Medical education in {country}" },
    programmes: { heading: "Available medical programmes" },
    eligibility: {
      heading: "Eligibility, academics and language",
      generalTitle: "General eligibility",
      academicTitle: "Academic qualifications",
      languageTitle: "Language requirements",
      note: "Requirements are set by each university and can change between intakes. Your home regulator may add its own conditions.",
    },
    admission: { heading: "How admission to {country} works", specificHeading: "Specific to {country}" },
    costs: {
      heading: "Tuition fees and living expenses",
      emptyTitle: "Costs vary by university, city and intake.",
      emptyText:
        "Rather than publish estimates that may be out of date, we share current, university-confirmed tuition and living-cost figures during counselling, including hostel, insurance, visa and travel.",
      emptyLink: "Request current figures for {country}",
    },
    nepal: {},
    recognition: {
      heading: "Degree recognition and licensing",
      important:
        "No university or consultancy can guarantee a medical licence or employment. Check your home regulator's current rules for foreign medical graduates before you apply.",
      regulatorsTitle: "Examples of home-country regulators",
    },
    faqs: { heading: "Studying medicine in {country}: common questions" },
  },
});

/* ─────────────────────────── /destinations page ─────────────────────────── */

export const destinationsListSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  {
    ...heroSpec,
    description: "Breadcrumb, headline, intro, photo and the floating card. Write {count} in the card title for the number of countries.",
  },
  {
    kind: "destGrid",
    label: "Country cards",
    description: "The grid of country cards. The countries themselves are edited under Study destinations.",
    fields: [],
  },
  {
    kind: "destCompare",
    label: "Comparison table",
    description: "Side-by-side table of every country.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      {
        type: "object",
        key: "columns",
        label: "Column titles",
        fields: [
          { type: "text", key: "destination", label: "Column 1", maxLength: 40 },
          { type: "text", key: "programmes", label: "Column 2", maxLength: 40 },
          { type: "text", key: "duration", label: "Column 3", hideable: true, maxLength: 40 },
          { type: "text", key: "medium", label: "Column 4", hideable: true, maxLength: 40 },
        ],
      },
    ],
  },
];

export const destinationsListDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "Study Destinations",
      title: "Where could your *medical journey* take you?",
      description:
        "Every country offers a different route into medicine. Explore each destination's programmes, entry requirements, language environment and recognition considerations.",
      image: { src: "/images/destinations/russia.jpg", alt: "St Basil's Cathedral in Moscow, Russia" },
      badge: { title: "{count} countries", text: "Compared side by side" },
    }),
    section("destGrid", {}),
    section("destCompare", {
      heading: "Compare destinations side by side",
      description:
        "A quick overview. Details change between universities and intakes, so treat this as a starting point for your conversation with a counsellor.",
      columns: { destination: "Destination", programmes: "Programmes", duration: "Typical duration", medium: "Language of instruction" },
    }),
  ],
});
