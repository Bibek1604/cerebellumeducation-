/**
 * Admin-editable content: section/field specs and default values.
 *
 * Defaults are copied word-for-word from the live pages, so the website looks
 * exactly the same until an administrator saves a change.
 * Pure data — safe to import from client components.
 */
import { siteConfig } from "@/config/site";
import { admissionSteps } from "@/data/process";
import { homeDefaults, homeSpecs } from "./schema-home";
import { programmePageDefaults, programmePageSpec, programmesDefaults, programmesListDefaults, programmesListSpecs, programmesSpec } from "./schema-programmes";
import {
  bookingDefaults,
  bookingSpecs,
  faqsDefaults,
  faqsSpecs,
  legalSpecs,
  privacyDefaults,
  scholarshipsDefaults,
  scholarshipsSpecs,
  storiesDefaults,
  storiesSpecs,
  termsDefaults,
} from "./schema-pages";
import { destinationPageDefaults, destinationPageSpec, destinationsDefaults, destinationsListDefaults, destinationsListSpecs, destinationsSpec } from "./schema-destinations";
import { team } from "@/data/team";
import { indiaGuidance, nepalGuidance } from "@/data/nepal-guidance";
import { blogDefaults, blogSpec, reelsDefaults, reelsSpec, videosDefaults, videosSpec } from "./schema-media";
import type { ContentKey, FieldSpec, PageContent, Section, SectionSpec, SettingsContent } from "./types";

let seq = 0;
const nid = (p: string) => `${p}-${++seq}`;
/** List items with an id and a visibility tick. */
export function items<T extends Record<string, unknown>>(prefix: string, arr: T[]) {
  return arr.map((v) => ({ _id: nid(prefix), enabled: true, ...v }));
}
const texts = (prefix: string, arr: string[]) => items(prefix, arr.map((text) => ({ text })));
const section = (kind: string, data: Record<string, unknown>, hidden: string[] = []): Section => ({ id: nid(kind), kind, enabled: true, hidden, data });

/* ───────────────────────── Shared section types ───────────────────────── */

const textItem: FieldSpec[] = [{ type: "textarea", key: "text", label: "Text", maxLength: 600 }];

export const heroSpec: SectionSpec = {
  kind: "hero",
  label: "Page header",
  description: "Breadcrumb, headline, intro, photo in the blue circle and the floating card.",
  fixed: true,
  fields: [
    { type: "text", key: "crumbLabel", label: "Breadcrumb label", maxLength: 60 },
    { type: "text", key: "title", label: "Headline", highlight: true, maxLength: 140 },
    { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 500 },
    { type: "image", key: "image", label: "Photo in the blue circle", hideable: true },
    {
      type: "object",
      key: "badge",
      label: "Floating card",
      hideable: true,
      fields: [
        { type: "text", key: "title", label: "Card title", maxLength: 60 },
        { type: "text", key: "text", label: "Card text", maxLength: 80 },
      ],
    },
  ],
};

/** Extra section types administrators can add to any of the three pages. */
export const genericSpecs: SectionSpec[] = [
  {
    kind: "textBlock",
    label: "Text block",
    description: "A heading with one or more paragraphs.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, hideable: true, maxLength: 140 },
      { type: "list", key: "paragraphs", label: "Paragraphs", itemLabel: "paragraph", titleKey: "text", fields: textItem, max: 12 },
    ],
  },
  {
    kind: "cards",
    label: "Icon cards",
    description: "A heading with a grid of icon cards.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 140 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      {
        type: "list",
        key: "items",
        label: "Cards",
        itemLabel: "card",
        titleKey: "title",
        max: 12,
        fields: [
          { type: "icon", key: "icon", label: "Icon", hideable: true },
          { type: "text", key: "title", label: "Title", maxLength: 80 },
          { type: "textarea", key: "text", label: "Text", maxLength: 400 },
        ],
      },
    ],
  },
  {
    kind: "checklist",
    label: "Checklist",
    description: "A heading with a list of ticked points.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 140 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      { type: "list", key: "items", label: "Points", itemLabel: "point", titleKey: "text", fields: textItem, max: 20 },
    ],
  },
  {
    kind: "quote",
    label: "Highlighted statement",
    description: "A large statement in an orange-edged panel.",
    fields: [{ type: "textarea", key: "text", label: "Statement", maxLength: 600 }],
  },
];

export const genericDefaults: Record<string, () => Record<string, unknown>> = {
  textBlock: () => ({ heading: "New section", paragraphs: texts("p", ["Write your text here."]) }),
  cards: () => ({
    heading: "New section",
    description: "",
    items: items("card", [{ icon: "star", title: "Card title", text: "Card text." }]),
  }),
  checklist: () => ({ heading: "New section", description: "", items: texts("pt", ["First point"]) }),
  quote: () => ({ text: "Your statement here." }),
};

/* ───────────────────────────── About Us ───────────────────────────── */

const aboutSpecs: SectionSpec[] = [
  heroSpec,
  {
    kind: "intro",
    label: "Introduction",
    description: "Heading on the left, paragraphs on the right.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 160 },
      { type: "list", key: "paragraphs", label: "Paragraphs", itemLabel: "paragraph", titleKey: "text", fields: textItem, max: 8 },
    ],
  },
  {
    kind: "missionVision",
    label: "Mission & vision",
    description: "Two coloured cards side by side.",
    fields: [
      {
        type: "list",
        key: "cards",
        label: "Cards",
        itemLabel: "card",
        titleKey: "title",
        max: 4,
        fields: [
          { type: "icon", key: "icon", label: "Icon", hideable: true },
          { type: "text", key: "title", label: "Title", maxLength: 60 },
          { type: "textarea", key: "text", label: "Text", maxLength: 500 },
          {
            type: "select",
            key: "tone",
            label: "Card colour",
            options: [
              { value: "navy", label: "Dark navy" },
              { value: "primary", label: "Brand blue" },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: "values",
    label: "Our values",
    description: "Heading and a row of value cards.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      {
        type: "list",
        key: "items",
        label: "Values",
        itemLabel: "value",
        titleKey: "title",
        max: 8,
        fields: [
          { type: "icon", key: "icon", label: "Icon", hideable: true },
          { type: "text", key: "title", label: "Title", maxLength: 60 },
          { type: "textarea", key: "text", label: "Text", maxLength: 300 },
        ],
      },
    ],
  },
  {
    kind: "approach",
    label: "Approach & why choose us",
    description: "Our approach on the left, the 'Why choose us?' checklist on the right.",
    fields: [
      {
        type: "object",
        key: "approach",
        label: "Our approach (left)",
        hideable: true,
        fields: [
          { type: "icon", key: "icon", label: "Icon", hideable: true },
          { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
          { type: "list", key: "paragraphs", label: "Paragraphs", itemLabel: "paragraph", titleKey: "text", fields: textItem, max: 6 },
        ],
      },
      {
        type: "object",
        key: "why",
        label: "Why choose us (right)",
        hideable: true,
        fields: [
          { type: "icon", key: "icon", label: "Icon", hideable: true },
          { type: "text", key: "heading", label: "Heading", maxLength: 120 },
          { type: "list", key: "items", label: "Points", itemLabel: "point", titleKey: "text", fields: textItem, max: 12 },
        ],
      },
    ],
  },
  {
    kind: "team",
    label: "Team",
    description: "Counsellor profiles. Shown only when at least one counsellor is listed under Team.",
    fields: [{ type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120, help: "Counsellors themselves are edited under Team." }],
  },
  {
    kind: "company",
    label: "Company details",
    description: "Registration details. Shown only when they are filled in under Contact details & company.",
    fields: [{ type: "text", key: "heading", label: "Heading", maxLength: 80, help: "The values are edited under Contact details & company." }],
  },
  {
    kind: "commitment",
    label: "Commitment statement",
    description: "The large statement in the orange-edged panel.",
    fields: [{ type: "textarea", key: "text", label: "Statement", maxLength: 600 }],
  },
];

const aboutDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "About Us",
      title: "Guiding future doctors *with clarity and care*",
      description: `${siteConfig.name} is an international medical education consultancy. We help students and parents understand their options, choose with confidence and navigate admission to medical programmes abroad.`,
      image: { src: "/images/about-student.jpg", alt: "Smiling student reading a book between library shelves", position: "70% 50%" },
      badge: { title: "Parents always welcome", text: "In every conversation" },
    }),
    section("intro", {
      heading: "Built on a simple belief: families deserve honest advice.",
      paragraphs: texts("p", [
        "Choosing to study medicine abroad means weighing countries, universities, languages, costs and, most importantly, what happens after graduation. Too often, students make that choice with incomplete or overly optimistic information.",
        `${siteConfig.name} exists to change that. Like the cerebellum, which coordinates movement and balance, we help bring the many moving parts of an international medical admission into balance, so students can move forward with confidence.`,
      ]),
    }),
    section("missionVision", {
      cards: items("mv", [
        {
          icon: "target",
          title: "Our mission",
          text: "To give every aspiring medical student honest, personalised and well-researched guidance, from the first question to their first day on campus.",
          tone: "navy",
        },
        {
          icon: "eye",
          title: "Our vision",
          text: "A world where talented students can pursue medicine wherever the right opportunity is, making informed choices that serve their careers and their communities.",
          tone: "primary",
        },
      ]),
    }),
    section("values", {
      heading: "What guides our work",
      items: items("val", [
        { icon: "shield-check", title: "Honesty", text: "We explain the real picture, including the challenges, and never promise outcomes we can't control." },
        { icon: "users", title: "Student first", text: "Recommendations are based on what suits you, not on what is easiest to sell." },
        { icon: "scale", title: "Accuracy", text: "We check requirements against official sources and tell you when something needs confirming." },
        { icon: "hand-heart", title: "Care", text: "Moving abroad to study medicine is a family decision. We treat it with the seriousness it deserves." },
      ]),
    }),
    section("approach", {
      approach: {
        icon: "compass",
        heading: "Our student-centred approach",
        paragraphs: texts("p", [
          "Every student starts with a conversation, not a brochure. We learn about your grades, interests, budget, family priorities and where you hope to practise in future.",
          "From there we compare realistic options, explain the trade-offs and help you decide. Parents are welcome in every conversation. This is a decision you make together.",
        ]),
      },
      why: {
        icon: "lightbulb",
        heading: "Why choose us?",
        items: texts("why", [
          "Guidance focused specifically on medical and healthcare education",
          "Advice grounded in official university and regulator information",
          "Clear explanations of recognition and licensing considerations",
          "Support that continues from first conversation to arrival",
          "Transparency about what we can and cannot guarantee",
        ]),
      },
    }),
    section("team", { heading: "The people who will guide you" }),
    section("company", { heading: "Company details" }),
    section("commitment", {
      text: "We will always tell you what we know, what we don't, and where to verify it. Admission, visa and licensing decisions belong to universities, governments and regulators. Our job is to help you prepare for them as thoroughly and honestly as possible.",
    }),
  ],
});

/* ───────────────────────── Admission Process ───────────────────────── */

const admissionSpecs: SectionSpec[] = [
  heroSpec,
  {
    kind: "timeline",
    label: "Step timeline",
    description: "The 8-step interactive timeline. Steps are edited under Admission steps.",
    fields: [],
  },
  {
    kind: "stages",
    label: "What happens at each stage",
    description: "A card per step with its details and 'What you'll provide' list. Steps are edited under Admission steps.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      { type: "text", key: "provideLabel", label: "Label above each 'provide' list", hideable: true, maxLength: 40 },
    ],
  },
  {
    kind: "documents",
    label: "Documents generally required",
    description: "Heading and note on the left, document checklist on the right.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      { type: "textarea", key: "note", label: "Small note (with info icon)", hideable: true, maxLength: 300 },
      { type: "icon", key: "icon", label: "Checklist icon", hideable: true },
      { type: "list", key: "items", label: "Documents", itemLabel: "document", titleKey: "text", fields: textItem, max: 30 },
    ],
  },
  {
    kind: "beforeYouApply",
    label: "Before you apply (Nepal / India)",
    description: "Home-country rules box. Its content is edited under Nepal & India guidance (also shown on programme and destination pages).",
    fields: [],
  },
];

const admissionDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "Admission Process",
      title: "Your step-by-step path to *studying medicine abroad*",
      description: "Eight stages, one counsellor beside you throughout. Here's what happens at each step, and what you'll need to prepare.",
      image: { src: "/images/why-counselling.jpg", alt: "A counsellor talking one-to-one with a student", position: "40% 50%" },
      badge: { title: "8 guided steps", text: "From counselling to campus" },
    }),
    section("timeline", {}),
    section("stages", { heading: "What happens at each stage", provideLabel: "What you'll provide" }),
    section("documents", {
      heading: "Documents generally required",
      description:
        "This is a general list. The exact requirements depend on the country and university, we give you a precise checklist once you've chosen.",
      note: "We never ask for original documents or sensitive files through our website enquiry forms.",
      icon: "file-text",
      items: texts("doc", [
        "Valid passport (with sufficient validity for your course start)",
        "Grade 10 and Grade 12 (or equivalent) certificates and marksheets",
        "Passport-size photographs to the specified format",
        "Entrance-exam results, where required by your home regulator or the university",
        "Medical fitness certificate (typically at visa stage)",
        "Police clearance certificate (typically at visa stage)",
        "Attestation, apostille or ministry recognition of documents, where required",
        "Financial documents, if required for the visa",
      ]),
    }),
    section("beforeYouApply", {}),
  ],
});

/* ──────────────────────────────── Contact ──────────────────────────────── */

const contactSpecs: SectionSpec[] = [
  heroSpec,
  {
    kind: "contactMain",
    label: "Contact details & message form",
    description: "Left: 'Reach us directly' and the counselling card. Right: the message form.",
    fields: [
      {
        type: "object",
        key: "channels",
        label: "'Reach us directly' card",
        hideable: true,
        help: "Phone, WhatsApp, email, address and hours are edited under Contact details & company.",
        fields: [
          { type: "text", key: "heading", label: "Heading", maxLength: 60 },
          { type: "textarea", key: "emptyText", label: "Text shown when no contact details are set", maxLength: 300 },
        ],
      },
      {
        type: "object",
        key: "planning",
        label: "Counselling card",
        hideable: true,
        fields: [
          { type: "text", key: "heading", label: "Heading", maxLength: 80 },
          { type: "textarea", key: "text", label: "Text", maxLength: 300 },
          { type: "link", key: "link", label: "Link" },
        ],
      },
      {
        type: "object",
        key: "form",
        label: "Message form card",
        hideable: true,
        fields: [
          { type: "text", key: "heading", label: "Heading", maxLength: 60 },
          { type: "text", key: "subtitle", label: "Note under the heading", hideable: true, maxLength: 120 },
        ],
      },
    ],
  },
  {
    kind: "office",
    label: "Visit us / office",
    description: "Office photos, address, hours, phone, email, map and buttons.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 300 },
      {
        type: "list",
        key: "photos",
        label: "Office photos",
        itemLabel: "photo",
        titleKey: "caption",
        max: 3,
        help: "The first photo is shown large; up to two more appear below it.",
        fields: [
          { type: "image", key: "image", label: "Photo" },
          { type: "text", key: "caption", label: "Caption", hideable: true, maxLength: 80 },
        ],
      },
      {
        type: "object",
        key: "labels",
        label: "Contact card labels",
        fields: [
          { type: "text", key: "address", label: "Address label", maxLength: 40 },
          { type: "text", key: "hours", label: "Hours label", maxLength: 40 },
          { type: "text", key: "phone", label: "Phone label", maxLength: 40 },
          { type: "text", key: "email", label: "Email label", maxLength: 40 },
        ],
      },
      { type: "object", key: "map", label: "Google map", hideable: true, fields: [], help: "The map link itself is set under Contact details & company." },
      { type: "link", key: "bookButton", label: "Main button", hideable: true },
      { type: "text", key: "directionsLabel", label: "'Get directions' button text", hideable: true, maxLength: 40 },
      { type: "text", key: "whatsappLabel", label: "WhatsApp button text", hideable: true, maxLength: 40 },
    ],
  },
];

const contactDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "Contact",
      title: "We're *here to help*",
      description: "Questions about destinations, eligibility or the admission process? Send us a message and our team will get back to you.",
      image: { src: "/images/why-parents.jpg", alt: "A counsellor meeting a student and a family member", position: "60% 40%" },
      badge: { title: "Talk to a counsellor", text: "In person, online or by phone" },
    }),
    section("contactMain", {
      channels: {
        heading: "Reach us directly",
        emptyText: "Send us a message or book a free session, and a counsellor will get back to you.",
      },
      planning: {
        heading: "Planning to study medicine abroad?",
        text: "For detailed guidance, our counselling form helps us prepare for your conversation.",
        link: { label: "Book free counselling", href: "/book-counselling" },
      },
      form: { heading: "Send us a message", subtitle: "Fields marked * are required." },
    }),
    section("office", {
      heading: "Visit Us, *Meet Your Counsellor*",
      description: "Come to our office with your family, bring your documents and questions, and talk face to face.",
      photos: [],
      labels: { address: "Office address", hours: "Opening hours", phone: "Phone", email: "Email" },
      map: {},
      bookButton: { label: "Book a visit", href: "/book-counselling" },
      directionsLabel: "Get directions",
      whatsappLabel: "WhatsApp",
    }),
  ],
});

/* ─────────────────────────────── Settings ─────────────────────────────── */

const siteSpec: FieldSpec[] = [
  {
    type: "object",
    key: "contact",
    label: "Contact details",
    help: "Used across the whole website: top bar, header, footer, Contact page and the WhatsApp button. Leave a field empty to hide it.",
    fields: [
      { type: "text", key: "phone", label: "Phone (as displayed)", placeholder: "+977 1-234 5678", maxLength: 40 },
      { type: "text", key: "phoneHref", label: "Phone (for dialling, digits with +)", placeholder: "+97712345678", format: "phone", maxLength: 20 },
      { type: "text", key: "whatsapp", label: "WhatsApp number (digits only, with country code)", placeholder: "9779800000000", format: "digits", maxLength: 20 },
      { type: "text", key: "email", label: "Email", placeholder: "info@your-domain.com", format: "email", maxLength: 120 },
      {
        type: "object",
        key: "address",
        label: "Office address",
        fields: [
          { type: "text", key: "line1", label: "Address line 1", maxLength: 120 },
          { type: "text", key: "line2", label: "Address line 2", maxLength: 120 },
          { type: "text", key: "city", label: "City", maxLength: 60 },
          { type: "text", key: "region", label: "Province / region", maxLength: 60 },
          { type: "text", key: "postalCode", label: "Postal code", maxLength: 20 },
          { type: "text", key: "country", label: "Country", maxLength: 60 },
        ],
      },
      { type: "list", key: "officeHours", label: "Opening hours", itemLabel: "line", titleKey: "text", max: 7, fields: [{ type: "text", key: "text", label: "Line", placeholder: "Sunday – Friday: 10:00 – 17:00", maxLength: 80 }] },
      { type: "text", key: "mapEmbedUrl", label: "Google Maps embed link (from Share → Embed a map → src)", format: "https", maxLength: 1000 },
      { type: "text", key: "mapLink", label: "Google Maps link for 'Get directions'", format: "https", maxLength: 500 },
    ],
  },
  {
    type: "list",
    key: "social",
    label: "Social media profiles",
    itemLabel: "profile",
    titleKey: "label",
    max: 8,
    fields: [
      {
        type: "select",
        key: "platform",
        label: "Platform",
        options: ["facebook", "instagram", "youtube", "tiktok", "linkedin", "x", "other"].map((v) => ({ value: v, label: v === "x" ? "X (Twitter)" : v[0]!.toUpperCase() + v.slice(1) })),
      },
      { type: "text", key: "label", label: "Label", maxLength: 40 },
      { type: "text", key: "href", label: "Profile link", format: "https", maxLength: 300 },
    ],
  },
  {
    type: "object",
    key: "company",
    label: "Company registration",
    help: "Exactly as written on your official certificates. Shown on the About page and in the footer.",
    fields: [
      { type: "text", key: "legalName", label: "Registered name", maxLength: 120 },
      { type: "text", key: "registrationNo", label: "Registration number", maxLength: 60 },
      { type: "text", key: "registeredWith", label: "Registered with", maxLength: 120 },
      { type: "text", key: "panNo", label: "PAN / VAT", maxLength: 40 },
      { type: "text", key: "consultancyApproval", label: "Consultancy approval", maxLength: 160 },
      { type: "text", key: "establishedYear", label: "Established (year)", format: "digits", maxLength: 4 },
    ],
  },
];

const c = siteConfig.contact;
const siteDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    contact: {
      phone: c.phone ?? "",
      phoneHref: c.phoneHref ?? "",
      whatsapp: c.whatsapp ?? "",
      email: c.email ?? "",
      address: {
        line1: c.address?.line1 ?? "",
        line2: c.address?.line2 ?? "",
        city: c.address?.city ?? "",
        region: c.address?.region ?? "",
        postalCode: c.address?.postalCode ?? "",
        country: c.address?.country ?? "",
      },
      officeHours: texts("hrs", c.officeHours ?? []),
      mapEmbedUrl: c.mapEmbedUrl ?? "",
      mapLink: c.mapLink ?? "",
    },
    social: items("soc", siteConfig.social.map((s) => ({ platform: s.platform, label: s.label, href: s.href }))),
    company: Object.fromEntries(Object.entries(siteConfig.company).map(([k, v]) => [k, v ?? ""])),
  },
});

const teamSpec: FieldSpec[] = [
  {
    type: "list",
    key: "members",
    label: "Counsellors",
    itemLabel: "counsellor",
    titleKey: "name",
    max: 30,
    help: "Shown on the homepage ('Meet your counsellors') and the About page. Only publish people who have agreed to it.",
    fields: [
      { type: "text", key: "name", label: "Full name", maxLength: 80 },
      { type: "text", key: "role", label: "Role", placeholder: "Senior Counsellor", maxLength: 80 },
      { type: "text", key: "focus", label: "Focus", placeholder: "MBBS admissions: China & Bangladesh", hideable: true, maxLength: 120 },
      { type: "text", key: "experience", label: "Experience", placeholder: "5+ years", hideable: true, maxLength: 40 },
      { type: "text", key: "languages", label: "Languages (comma separated)", placeholder: "Nepali, English", hideable: true, maxLength: 120 },
      { type: "textarea", key: "bio", label: "Short bio", hideable: true, maxLength: 500 },
      { type: "image", key: "photo", label: "Photo (square works best)", hideable: true },
    ],
  },
];

const teamDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    members: items(
      "tm",
      team.map((m) => ({
        name: m.name,
        role: m.role,
        focus: m.focus ?? "",
        experience: m.experience ?? "",
        languages: (m.languages ?? []).join(", "),
        bio: m.bio ?? "",
        photo: m.photo ? { src: m.photo.src, alt: m.photo.alt } : { src: "", alt: "" },
      })),
    ),
  },
});

const stepsSpec: FieldSpec[] = [
  {
    type: "list",
    key: "steps",
    label: "Admission steps",
    itemLabel: "step",
    titleKey: "title",
    max: 12,
    help: "Used by the timeline and stage cards on the Admission Process page and the 'Your journey' section on the homepage.",
    fields: [
      { type: "text", key: "title", label: "Step title", maxLength: 60 },
      { type: "text", key: "short", label: "Short line (under the timeline)", maxLength: 100 },
      { type: "textarea", key: "detail", label: "Full description", maxLength: 600 },
      { type: "list", key: "youProvide", label: "What you'll provide", itemLabel: "item", titleKey: "text", max: 10, fields: textItem },
    ],
  },
];

const stepsDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    steps: items(
      "step",
      admissionSteps.map((s) => ({ title: s.title, short: s.short, detail: s.detail, youProvide: texts("yp", s.youProvide) })),
    ),
  },
});

const guidanceBlock = (label: string, hideable: boolean): FieldSpec => ({
  type: "object",
  key: label === "Nepal" ? "nepal" : "india",
  label: label === "Nepal" ? "Rules for Nepali students" : "Note for Indian students",
  hideable,
  fields: [
    { type: "text", key: "title", label: "Title", maxLength: 120 },
    { type: "list", key: "points", label: "Points", itemLabel: "point", titleKey: "text", max: 12, fields: textItem },
    {
      type: "list",
      key: "sources",
      label: "Official source links",
      itemLabel: "source",
      titleKey: "label",
      max: 8,
      fields: [
        { type: "text", key: "label", label: "Link text", maxLength: 80 },
        { type: "text", key: "href", label: "Link", format: "href", maxLength: 300 },
      ],
    },
    { type: "text", key: "lastChecked", label: "Last checked against official sources (YYYY-MM-DD)", format: "date", maxLength: 10, hideable: label === "Nepal" },
  ],
});

const guidanceSpec: FieldSpec[] = [guidanceBlock("Nepal", false), guidanceBlock("India", true)];

const guidanceDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    nepal: {
      title: nepalGuidance.title,
      points: texts("np", nepalGuidance.points),
      sources: items("nps", nepalGuidance.sources.map((s) => ({ label: s.label, href: s.href }))),
      lastChecked: nepalGuidance.lastChecked ?? "",
    },
    india: {
      title: indiaGuidance.title,
      points: texts("ip", indiaGuidance.points),
      sources: items("ips", indiaGuidance.sources.map((s) => ({ label: s.label, href: s.href }))),
      lastChecked: indiaGuidance.lastChecked ?? "",
    },
  },
});

/* ─────────────────────────────── Registry ─────────────────────────────── */

export type PageEntry = {
  type: "page";
  key: ContentKey;
  title: string;
  path: string;
  specs: SectionSpec[];
  defaults: () => PageContent;
};
export type SettingsEntry = {
  type: "settings";
  key: ContentKey;
  title: string;
  description: string;
  fields: FieldSpec[];
  defaults: () => SettingsContent;
};

export const pages: PageEntry[] = [
  { type: "page", key: "page:home", title: "Homepage", path: "/", specs: homeSpecs, defaults: homeDefaults },
  { type: "page", key: "page:about", title: "About Us", path: "/about", specs: aboutSpecs, defaults: aboutDefaults },
  { type: "page", key: "page:admission-process", title: "Admission Process", path: "/admission-process", specs: admissionSpecs, defaults: admissionDefaults },
  { type: "page", key: "page:destinations", title: "Study Destinations", path: "/destinations", specs: destinationsListSpecs(heroSpec), defaults: destinationsListDefaults },
  { type: "page", key: "page:programmes", title: "Programmes", path: "/programs", specs: programmesListSpecs(heroSpec), defaults: programmesListDefaults },
  { type: "page", key: "page:scholarships", title: "Scholarships", path: "/scholarships", specs: scholarshipsSpecs(heroSpec), defaults: scholarshipsDefaults },
  { type: "page", key: "page:faqs", title: "FAQs", path: "/faqs", specs: faqsSpecs(heroSpec), defaults: faqsDefaults },
  { type: "page", key: "page:success-stories", title: "Success Stories", path: "/success-stories", specs: storiesSpecs(heroSpec), defaults: storiesDefaults },
  { type: "page", key: "page:contact", title: "Contact", path: "/contact", specs: contactSpecs, defaults: contactDefaults },
  { type: "page", key: "page:book-counselling", title: "Book Counselling", path: "/book-counselling", specs: bookingSpecs(heroSpec), defaults: bookingDefaults },
  { type: "page", key: "page:privacy-policy", title: "Privacy Policy", path: "/privacy-policy", specs: legalSpecs, defaults: privacyDefaults },
  { type: "page", key: "page:terms-and-conditions", title: "Terms & Conditions", path: "/terms-and-conditions", specs: legalSpecs, defaults: termsDefaults },
];

export const settings: SettingsEntry[] = [
  {
    type: "settings",
    key: "settings:destinations",
    title: "Countries",
    description: "Every study destination: its card, its own page, and where it appears in menus, the footer, the homepage and the forms.",
    fields: destinationsSpec,
    defaults: destinationsDefaults,
  },
  {
    type: "settings",
    key: "settings:destination-page",
    title: "Country page layout",
    description: "Headings, buttons and blocks shared by every country page (/destinations/…). Tick a block off to hide it on all of them.",
    fields: destinationPageSpec,
    defaults: destinationPageDefaults,
  },
  {
    type: "settings",
    key: "settings:programmes",
    title: "Programme list",
    description: "Every programme: its card, its own page, and where it appears in menus, the homepage and the forms.",
    fields: programmesSpec,
    defaults: programmesDefaults,
  },
  {
    type: "settings",
    key: "settings:programme-page",
    title: "Programme page layout",
    description: "Headings, labels and blocks shared by every programme page (/programs/…). Tick a block off to hide it on all of them.",
    fields: programmePageSpec,
    defaults: programmePageDefaults,
  },
  {
    type: "settings",
    key: "settings:site",
    title: "Contact details & company",
    description: "Phone, WhatsApp, email, address, opening hours, map, social profiles and company registration.",
    fields: siteSpec,
    defaults: siteDefaults,
  },
  { type: "settings", key: "settings:team", title: "Team", description: "Counsellor profiles for the homepage and About page.", fields: teamSpec, defaults: teamDefaults },
  { type: "settings", key: "settings:steps", title: "Admission steps", description: "The 8 steps used on the Admission Process page and homepage.", fields: stepsSpec, defaults: stepsDefaults },
  {
    type: "settings",
    key: "settings:guidance",
    title: "Nepal & India guidance",
    description: "'Before you apply' rules box on the Admission Process, programme and destination pages.",
    fields: guidanceSpec,
    defaults: guidanceDefaults,
  },
  {
    type: "settings",
    key: "settings:reels",
    title: "Reels",
    description: "Facebook, TikTok and Instagram reels: a title and a link for each, shown on the homepage.",
    fields: reelsSpec,
    defaults: reelsDefaults,
  },
  {
    type: "settings",
    key: "settings:videos",
    title: "Videos",
    description: "YouTube, Vimeo or Facebook videos for the homepage and the /videos page.",
    fields: videosSpec,
    defaults: videosDefaults,
  },
  {
    type: "settings",
    key: "settings:blog",
    title: "Blog posts",
    description: "Articles for the /blog page and the 'From our blog' section on the homepage.",
    fields: blogSpec,
    defaults: blogDefaults,
  },
];

export function getEntry(key: string): PageEntry | SettingsEntry | undefined {
  return [...pages, ...settings].find((e) => e.key === key);
}

/** Section types an administrator may add to a page (its own types + generic ones). */
export function addableSpecs(entry: PageEntry): SectionSpec[] {
  return [...entry.specs.filter((s) => !s.fixed), ...genericSpecs];
}

export function specFor(entry: PageEntry, kind: string): SectionSpec | undefined {
  return entry.specs.find((s) => s.kind === kind) ?? genericSpecs.find((s) => s.kind === kind);
}

/** Default data for a newly added section of `kind`. */
export function newSectionData(entry: PageEntry, kind: string): Record<string, unknown> {
  if (genericDefaults[kind]) return genericDefaults[kind]();
  const fromDefaults = entry.defaults().sections.find((s) => s.kind === kind);
  return fromDefaults ? structuredClone(fromDefaults.data) : {};
}
