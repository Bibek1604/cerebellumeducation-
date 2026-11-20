/**
 * FAQs, Scholarships, Book Counselling, Success Stories and the legal pages.
 * Defaults are copied word-for-word from the live pages.
 * Pure data — safe to import from client components.
 */
import { siteConfig } from "@/config/site";
import { faqCategories } from "@/data/faqs";
import { scholarshipTypes, scholarships } from "@/data/scholarships";
import { testimonials } from "@/data/testimonials";
import type { FieldSpec, PageContent, Section, SectionSpec } from "./types";

let seq = 0;
const nid = (p: string) => `${p}-${++seq}`;
const items = <T extends Record<string, unknown>>(prefix: string, arr: T[]) => arr.map((v) => ({ _id: nid(prefix), enabled: true, ...v }));
const texts = (prefix: string, arr: string[]) => items(prefix, arr.map((text) => ({ text })));
const section = (kind: string, data: Record<string, unknown>, hidden: string[] = []): Section => ({ id: nid(kind), kind, enabled: true, hidden, data });

const textItem: FieldSpec[] = [{ type: "textarea", key: "text", label: "Text", maxLength: 600 }];
const textList = (key: string, label: string, max = 12): FieldSpec => ({ type: "list", key, label, itemLabel: "point", titleKey: "text", max, fields: textItem });
const qaFields: FieldSpec[] = [
  { type: "text", key: "question", label: "Question", maxLength: 200 },
  { type: "textarea", key: "answer", label: "Answer", maxLength: 1500 },
];

/* ─────────────────────────────────── FAQs ─────────────────────────────────── */

export const faqsSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  heroSpec,
  {
    kind: "faqList",
    label: "Questions by topic",
    description: "Topics in the left menu, each with its questions and answers.",
    fields: [
      {
        type: "list",
        key: "categories",
        label: "Topics",
        itemLabel: "topic",
        titleKey: "title",
        max: 20,
        fields: [
          { type: "text", key: "title", label: "Topic title", maxLength: 100 },
          { type: "text", key: "anchor", label: "Link name (e.g. 'eligibility' → /faqs#eligibility)", format: "slug", maxLength: 40 },
          { type: "list", key: "items", label: "Questions", itemLabel: "question", titleKey: "question", max: 40, fields: qaFields },
        ],
      },
    ],
  },
];

export const faqsDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "FAQs",
      title: "Frequently asked *questions*",
      description: "Clear answers to the questions students and parents ask most. Where rules differ by country, university or home regulator, we say so.",
      image: { src: "/images/campus-hallway-poster.jpg", alt: "Students talking in a university hallway" },
      badge: { title: "Still unsure?", text: "Ask a counsellor, free of charge" },
    }),
    section("faqList", {
      categories: items(
        "fc",
        faqCategories.map((c) => ({ title: c.title, anchor: c.id, items: items("fq", c.items.map((q) => ({ question: q.question, answer: q.answer }))) })),
      ),
    }),
  ],
});

/* ─────────────────────────────── Scholarships ─────────────────────────────── */

const titledList = (key: string, label: string): FieldSpec => ({
  type: "object",
  key,
  label,
  hideable: true,
  fields: [{ type: "text", key: "title", label: "Title", maxLength: 80 }, textList("items", "Points")],
});

export const scholarshipsSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  heroSpec,
  {
    kind: "schTypes",
    label: "Types of scholarships",
    description: "General categories, each with an optional official link.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      {
        type: "list",
        key: "items",
        label: "Types",
        itemLabel: "type",
        titleKey: "title",
        max: 12,
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 80 },
          { type: "textarea", key: "text", label: "Description", maxLength: 600 },
          { type: "link", key: "link", label: "Official link (opens in a new tab)", hideable: true },
        ],
      },
    ],
  },
  {
    kind: "schOpenings",
    label: "Verified scholarship openings",
    description: "Only list scholarships you have checked on the official website for the current cycle. When the list is empty, the 'none right now' box shows.",
    fields: [
      { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 120 },
      {
        type: "list",
        key: "openings",
        label: "Openings",
        itemLabel: "scholarship",
        titleKey: "name",
        max: 30,
        fields: [
          { type: "text", key: "name", label: "Scholarship name", maxLength: 120 },
          { type: "text", key: "provider", label: "Provider", maxLength: 120 },
          { type: "select", key: "destination", label: "Country", options: [], optionsFrom: "destinations" },
          { type: "textarea", key: "summary", label: "Summary", maxLength: 500 },
          textList("eligibility", "Eligibility", 10),
          { type: "text", key: "deadline", label: "Deadline (as shown)", placeholder: "31 March 2027", maxLength: 60 },
          { type: "text", key: "officialUrl", label: "Official page link", format: "https", maxLength: 300 },
          { type: "text", key: "verifiedOn", label: "Checked on (YYYY-MM-DD)", format: "date", maxLength: 10 },
        ],
      },
      {
        type: "object",
        key: "labels",
        label: "Card labels",
        fields: [
          { type: "text", key: "deadline", label: "'Deadline' label", maxLength: 30 },
          { type: "text", key: "details", label: "Link text", maxLength: 40 },
          { type: "text", key: "checked", label: "'Checked' label", maxLength: 30 },
        ],
      },
      {
        type: "object",
        key: "empty",
        label: "Box shown when there are no openings",
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 120 },
          { type: "textarea", key: "text", label: "Text", maxLength: 400 },
        ],
      },
    ],
  },
  {
    kind: "schGuide",
    label: "Eligibility, process & financial guidance",
    description: "Three cards and the deadline note.",
    fields: [
      titledList("eligibility", "First card"),
      titledList("process", "Second card"),
      titledList("financial", "Dark card (financial guidance)"),
      {
        type: "object",
        key: "note",
        label: "Note under the cards",
        hideable: true,
        fields: [
          { type: "text", key: "label", label: "Bold start", maxLength: 40 },
          { type: "textarea", key: "text", label: "Text", maxLength: 500 },
        ],
      },
    ],
  },
];

export const scholarshipsDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("hero", {
      crumbLabel: "Scholarships",
      title: "Scholarships & *financial planning*",
      description:
        "Scholarships can reduce the cost of studying medicine abroad, but they are competitive and never guaranteed. Here's how they work and how to plan responsibly.",
      image: { src: "/images/why-graduate.jpg", alt: "A smiling graduate in cap and gown holding her certificate", position: "50% 30%" },
      badge: { title: "Plan with confidence", text: "Costs explained honestly" },
    }),
    section("schTypes", {
      heading: "Types of scholarships",
      description: "General categories you may come across. Availability depends on your nationality, programme and the year.",
      items: items(
        "st",
        scholarshipTypes.map((t) => ({ title: t.title, text: t.description, link: { label: t.linkLabel ?? "", href: t.href ?? "" } })),
      ),
    }),
    section("schOpenings", {
      heading: "Verified scholarship openings",
      openings: items(
        "so",
        scholarships.map((s) => ({
          name: s.name,
          provider: s.provider,
          destination: s.destination,
          summary: s.summary,
          eligibility: texts("se", s.eligibility),
          deadline: s.deadline,
          officialUrl: s.officialUrl,
          verifiedOn: s.verifiedOn,
        })),
      ),
      labels: { deadline: "Deadline:", details: "Official details", checked: "Checked" },
      empty: {
        title: "No specific openings are listed right now.",
        text: "We only list scholarships once we've verified them for the current cycle. Ask a counsellor which options may apply to your nationality, programme and intake.",
      },
    }),
    section("schGuide", {
      eligibility: {
        title: "Typical eligibility",
        items: texts("sg", [
          "Strong academic results, especially in science subjects",
          "Nationality and age criteria set by the provider",
          "Admission (or eligibility for admission) to an approved programme",
          "Health and character requirements for some schemes",
        ]),
      },
      process: {
        title: "Application process",
        items: texts("sp", [
          "Check eligibility on the official scholarship page, nationality, programme, grades and age limits",
          "Note the application window; many schemes open months before the intake",
          "Prepare documents such as transcripts, a study plan, recommendation letters and a medical form",
          "Apply through the official channel stated by the provider",
          "Plan your finances assuming you may not receive the award",
        ]),
      },
      financial: {
        title: "Financial guidance",
        items: texts("sf", [
          "Budget for the full programme, not just the first year",
          "Include hostel, food, insurance, visa renewals, books and travel",
          "Allow for currency movements and annual fee changes",
          "Pay fees directly to the university through official channels",
          "Keep receipts and official fee letters for every payment",
        ]),
      },
      note: {
        label: "Important deadlines:",
        text: "scholarship windows differ by provider and often close months before the academic year begins. Always confirm dates on the official website. We'll help you build a calendar once you've chosen your destination.",
      },
    }),
  ],
});

/* ───────────────────────────── Book counselling ───────────────────────────── */

export const bookingSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  heroSpec,
  {
    kind: "bookMain",
    label: "Form & 'What to expect'",
    description: "The counselling form with the dark 'What to expect' card and contact options beside it.",
    fields: [
      {
        type: "object",
        key: "expect",
        label: "'What to expect' card",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 60 },
          {
            type: "list",
            key: "items",
            label: "Points",
            itemLabel: "point",
            titleKey: "title",
            max: 8,
            fields: [
              { type: "icon", key: "icon", label: "Icon" },
              { type: "text", key: "title", label: "Title", maxLength: 60 },
              { type: "textarea", key: "text", label: "Text", maxLength: 200 },
            ],
          },
        ],
      },
      { type: "text", key: "channelsHeading", label: "Heading above the call / WhatsApp / email options", hideable: true, maxLength: 60 },
    ],
  },
];

export const bookingDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section(
      "hero",
      {
        crumbLabel: "Book Free Counselling",
        title: "Let's talk about *your medical future*",
        description: "Share a few details and a counsellor will contact you to arrange a free session, in person, by phone or online.",
        image: { src: "/images/hero-student.png", alt: "Smiling university student holding a stack of books", position: "50% 15%" },
        badge: { title: "Free first consultation", text: "In person, online or by phone" },
      },
    ),
    section("bookMain", {
      expect: {
        title: "What to expect",
        items: items("bx", [
          { icon: "calendar", title: "Free & no obligation", text: "Your first consultation costs nothing and commits you to nothing." },
          { icon: "clock", title: "A real conversation", text: "We listen first: your goals, results, budget and concerns." },
          { icon: "shield-check", title: "Honest advice", text: "We'll tell you plainly if a route isn't right for you." },
          { icon: "file-x", title: "No documents yet", text: "We don't ask for passports or certificates at this stage." },
        ]),
      },
      channelsHeading: "Prefer to talk now?",
    }),
  ],
});

/* ───────────────────────────── Success stories ───────────────────────────── */

export const storiesSpecs = (heroSpec: SectionSpec): SectionSpec[] => [
  { ...heroSpec, description: "Breadcrumb, headline, intro and photo. Update the intro once real stories are published." },
  {
    kind: "storyList",
    label: "Student stories",
    description: "Only publish genuine stories from real students who have given written permission. Never write a review on a student's behalf.",
    fields: [
      {
        type: "list",
        key: "stories",
        label: "Stories",
        itemLabel: "story",
        titleKey: "studentName",
        max: 60,
        fields: [
          {
            type: "select",
            key: "consent",
            label: "Written permission to publish",
            options: [
              { value: "no", label: "Not yet: keep hidden" },
              { value: "yes", label: "Yes, permission is on file" },
            ],
            help: "A story only appears on the website when this says yes.",
          },
          { type: "text", key: "studentName", label: "Student name", maxLength: 80 },
          { type: "select", key: "destination", label: "Country", options: [], optionsFrom: "destinations" },
          { type: "text", key: "university", label: "University", maxLength: 120 },
          { type: "text", key: "programme", label: "Programme", placeholder: "MBBS", maxLength: 60 },
          { type: "text", key: "admissionYear", label: "Admission year", format: "digits", maxLength: 4 },
          { type: "textarea", key: "quote", label: "The student's own words", maxLength: 1200 },
          { type: "image", key: "photo", label: "Photo" },
          { type: "text", key: "videoUrl", label: "Video (YouTube / Vimeo embed link)", format: "video", maxLength: 300 },
        ],
      },
    ],
  },
];

export const storiesDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section(
      "hero",
      {
        crumbLabel: "Success Stories",
        title: "Every journey begins *with a dream*",
        description:
          testimonials.length > 0
            ? "Real experiences from students and families we've guided, shared with their permission and in their own words."
            : "Student stories will be shared here with each student's permission.",
        image: { src: "/images/programme-lab.jpg", alt: "Medical students in white coats in a teaching laboratory", position: "60% 50%" },
        badge: { title: "Free first consultation", text: "In person, online or by phone" },
      },
    ),
    section("storyList", {
      stories: items(
        "story",
        testimonials.map((t) => ({
          consent: "yes",
          studentName: t.studentName,
          destination: t.destination,
          university: t.university,
          programme: t.programme,
          admissionYear: t.admissionYear,
          quote: t.quote,
          photo: t.photo ? { src: t.photo.src, alt: t.photo.alt } : { src: "", alt: "" },
          videoUrl: t.videoUrl ?? "",
        })),
      ),
    }),
  ],
});

/* ───────────────────────────────── Legal pages ───────────────────────────────── */

export const legalHeroSpec: SectionSpec = {
  kind: "legalHero",
  label: "Page header",
  description: "Title and the 'Last updated' date.",
  fixed: true,
  fields: [
    { type: "text", key: "title", label: "Title", maxLength: 80 },
    { type: "text", key: "updated", label: "Last updated (YYYY-MM-DD)", format: "date", hideable: true, maxLength: 10 },
  ],
};

export const legalSpecs: SectionSpec[] = [
  legalHeroSpec,
  {
    kind: "legalText",
    label: "Text section",
    description: "A heading with paragraphs and bullet points. Links: [link text](/contact). Write {contact} for your email link (or the Contact page), {company} for the company name.",
    fields: [
      { type: "text", key: "heading", label: "Heading (leave empty for an opening paragraph)", maxLength: 120 },
      {
        type: "list",
        key: "blocks",
        label: "Paragraphs & bullet points",
        itemLabel: "paragraph or bullet",
        titleKey: "text",
        max: 40,
        fields: [
          {
            type: "select",
            key: "style",
            label: "Type",
            options: [
              { value: "p", label: "Paragraph" },
              { value: "li", label: "Bullet point" },
            ],
          },
          { type: "textarea", key: "text", label: "Text", maxLength: 1500 },
        ],
      },
    ],
  },
];

type Block = ["p" | "li", string];
const legal = (title: string, parts: { heading: string; blocks: Block[] }[]): PageContent => ({
  version: 1,
  sections: [
    section("legalHero", { title, updated: siteConfig.lastUpdated }),
    ...parts.map((p) => section("legalText", { heading: p.heading, blocks: items("lb", p.blocks.map(([style, text]) => ({ style, text }))) })),
  ],
});

export const privacyDefaults = () =>
  legal("Privacy Policy", [
    { heading: "", blocks: [["p", "This policy explains how {company} (“we”, “us”) handles personal information you share with us through this website."]] },
    {
      heading: "Information we collect",
      blocks: [
        ["p", "When you submit an enquiry or counselling request, we collect the details you choose to provide, such as:"],
        ["li", "Your name, phone number and email address"],
        ["li", "Your current location and academic qualification"],
        ["li", "Your programme, destination and intake preferences"],
        ["li", "Any message you write to us"],
        ["p", "We do not ask for passports, certificates or other sensitive documents through website forms. Our web server may also record basic technical information such as your browser type and the page you submitted from."],
      ],
    },
    {
      heading: "How we use your information",
      blocks: [
        ["li", "To respond to your enquiry and arrange counselling"],
        ["li", "To provide guidance relevant to your study plans"],
        ["li", "To keep records of our communication with you"],
        ["li", "To protect our website from spam and misuse"],
        ["p", "We do not sell your personal information."],
      ],
    },
    {
      heading: "Legal basis and consent",
      blocks: [["p", "We process enquiry information on the basis of your consent, which you give when submitting a form, and our legitimate interest in responding to you. You may withdraw consent at any time."]],
    },
    {
      heading: "Sharing your information",
      blocks: [["p", "We share your information only where needed to provide our service, for example, with service providers that host our website or manage our enquiries. Information is shared with universities only when you ask us to help you apply, and only what is required for that application."]],
    },
    {
      heading: "How long we keep it",
      blocks: [["p", "We keep enquiry information only as long as needed for the purposes above or as required by law, after which it is deleted or anonymised."]],
    },
    {
      heading: "Your rights",
      blocks: [["p", "Depending on where you live, you may have the right to access, correct or delete your personal information, or to object to how it is used. To make a request, please {contact}."]],
    },
    {
      heading: "Cookies",
      blocks: [["p", "This website does not use advertising or analytics cookies. If that changes, we will update this policy and ask for consent where required."]],
    },
    { heading: "Changes to this policy", blocks: [["p", "We may update this policy from time to time. The “last updated” date above shows when it last changed."]] },
  ]);

export const termsDefaults = () =>
  legal("Terms & Conditions", [
    { heading: "", blocks: [["p", "By using this website you agree to these terms. If you do not agree, please do not use the website."]] },
    {
      heading: "About the information on this website",
      blocks: [["p", "Content on this website is general information about studying medicine and healthcare abroad. It is not legal, immigration or regulatory advice. Entry requirements, programme details, fees, visa rules and licensing regulations are set by universities, governments and regulators and can change at any time. Always confirm details with the relevant official source before making decisions."]],
    },
    {
      heading: "No guarantee of outcomes",
      blocks: [
        ["li", "Admission decisions are made solely by universities."],
        ["li", "Visa decisions are made solely by the relevant government authorities."],
        ["li", "Recognition of degrees and eligibility for medical licensing are decided by medical regulators."],
        ["li", "Scholarships are awarded at the discretion of their providers."],
        ["p", "{company} does not guarantee admission, visas, scholarships, licensing or employment."],
      ],
    },
    { heading: "External links", blocks: [["p", "We link to official and third-party websites for your convenience. We are not responsible for their content or availability."]] },
    { heading: "Use of this website", blocks: [["p", "You agree not to misuse the website, submit false information, attempt to disrupt its operation or use automated means to submit forms."]] },
    { heading: "Intellectual property", blocks: [["p", "The content, design and branding of this website belong to {company} unless otherwise stated, and may not be reproduced without permission."]] },
    { heading: "Privacy", blocks: [["p", "How we handle personal information is explained in our [Privacy Policy](/privacy-policy)."]] },
    { heading: "Changes", blocks: [["p", "We may update these terms. The “last updated” date above shows when they last changed."]] },
  ]);
