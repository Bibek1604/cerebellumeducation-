/**
 * Homepage: section specs and defaults (copied word-for-word from the live homepage).
 * Pure data — safe to import from client components.
 */
import { branding } from "@/config/branding";
import { homeFaqs } from "@/data/faqs";
import { services } from "@/data/process";
import { globalSources } from "@/data/sources";
import { homeMediaDefaults, homeMediaSpecs } from "./schema-media";
import type { FieldSpec, PageContent, Section, SectionSpec } from "./types";

let seq = 0;
const nid = (p: string) => `${p}-h${++seq}`;
const items = <T extends Record<string, unknown>>(prefix: string, arr: T[]) => arr.map((v) => ({ _id: nid(prefix), enabled: true, ...v }));
const texts = (prefix: string, arr: string[]) => items(prefix, arr.map((text) => ({ text })));
const section = (kind: string, data: Record<string, unknown>): Section => ({ id: nid(kind), kind, enabled: true, hidden: [], data });
const img = (src: string, alt: string, position = "") => ({ src, alt, position });

const linkField = (key: string, label: string, hideable = true): FieldSpec => ({ type: "link", key, label, hideable });
const headingFields = (): FieldSpec[] => [
  { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 160 },
  { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 500 },
];
const iconTextItem: FieldSpec[] = [
  { type: "icon", key: "icon", label: "Icon" },
  { type: "text", key: "title", label: "Title", maxLength: 100 },
  { type: "textarea", key: "text", label: "Text", maxLength: 400 },
];

export const homeSpecs: SectionSpec[] = [
  {
    kind: "homeHero",
    label: "Hero & booking box",
    description: "Headline, intro, chips, buttons, the student photo with its floating cards, and the booking box below.",
    fixed: true,
    fields: [
      { type: "text", key: "titleLine1", label: "Headline, first line", maxLength: 80 },
      { type: "text", key: "titleLine2", label: "Headline, second line (blue, underlined)", maxLength: 80 },
      { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 400 },
      {
        type: "list",
        key: "chips",
        label: "Ticked chips",
        itemLabel: "chip",
        titleKey: "text",
        hideable: true,
        max: 6,
        fields: [{ type: "text", key: "text", label: "Text", maxLength: 60 }],
      },
      linkField("primaryButton", "Orange button"),
      linkField("secondaryButton", "Outline button"),
      { type: "image", key: "photo", label: "Student photo (transparent PNG works best)", hideable: true },
      {
        type: "object",
        key: "badge",
        label: "'Free first consultation' card",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Card title", maxLength: 60 },
          { type: "text", key: "text", label: "Card text", maxLength: 80 },
        ],
      },
      {
        type: "list",
        key: "bubbles",
        label: "Floating bubbles beside the photo",
        itemLabel: "bubble",
        titleKey: "label",
        hideable: true,
        max: 2,
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "value", label: "Number instead of icon (optional, e.g. 350+)", maxLength: 12 },
          { type: "text", key: "label", label: "Label", maxLength: 40 },
        ],
      },
      { type: "object", key: "logoSeal", label: "Logo seal on the blue circle", hideable: true, fields: [] },
      {
        type: "object",
        key: "booking",
        label: "Booking box (overlapping the hero)",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 80 },
          { type: "text", key: "subtitle", label: "Subtitle", maxLength: 140 },
          { type: "text", key: "buttonLabel", label: "Button text", maxLength: 30 },
          {
            type: "list",
            key: "notes",
            label: "Ticked notes under the form",
            itemLabel: "note",
            titleKey: "text",
            max: 5,
            fields: [{ type: "text", key: "text", label: "Text", maxLength: 60 }],
          },
        ],
      },
    ],
  },
  {
    kind: "homeAbout",
    label: "About (video & checklist)",
    description: "Campus video with an overlapping photo, the 'Trusted Partner' text, ticked points and a button.",
    fields: [
      {
        type: "object",
        key: "video",
        label: "Video",
        hideable: true,
        fields: [
          { type: "text", key: "src", label: "Video (a /videos/… file or a YouTube embed link)", format: "video", maxLength: 300 },
          { type: "image", key: "poster", label: "Still image shown before the video plays" },
          { type: "text", key: "caption", label: "Caption on the video", maxLength: 60 },
          { type: "text", key: "tag", label: "Orange label on the video", maxLength: 40 },
        ],
      },
      { type: "image", key: "photo", label: "Small overlapping photo", hideable: true },
      ...headingFields(),
      {
        type: "list",
        key: "points",
        label: "Ticked points",
        itemLabel: "point",
        titleKey: "text",
        max: 8,
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "text", label: "Text", maxLength: 120 },
        ],
      },
      linkField("button", "Button"),
    ],
  },
  {
    kind: "homeProgrammes",
    label: "Programmes showcase",
    description: "Programme tabs with a photo and detail card. Programme details come from the programme pages.",
    fields: [
      ...headingFields(),
      {
        type: "object",
        key: "photos",
        label: "Photo for each programme",
        fields: [
          { type: "image", key: "mbbs", label: "MBBS / General Medicine" },
          { type: "image", key: "md", label: "Doctor of Medicine (MD)" },
          { type: "image", key: "dentistry", label: "Dentistry" },
          { type: "image", key: "nursing", label: "Nursing" },
          { type: "image", key: "pharmacy", label: "Pharmacy" },
          { type: "image", key: "biomedical-sciences", label: "Biomedical Sciences" },
        ],
      },
      { type: "text", key: "bookLabel", label: "Card button text", maxLength: 30 },
      { type: "text", key: "learnLabel", label: "Card link text", maxLength: 30 },
      linkField("button", "Button below"),
    ],
  },
  {
    kind: "homeDestinations",
    label: "Destinations",
    description: "Filter buttons and country cards. Country details come from the destination pages.",
    fields: [
      ...headingFields(),
      {
        type: "object",
        key: "askCard",
        label: "'Another country in mind?' card",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 60 },
          { type: "text", key: "text", label: "Text", maxLength: 120 },
          linkField("link", "Link", false),
        ],
      },
      linkField("button", "Button below"),
    ],
  },
  {
    kind: "homeQuiz",
    label: "Country-match quiz",
    description: "'Find your best-fit country': two questions and a shortlist.",
    fields: headingFields(),
  },
  {
    kind: "homeOnline",
    label: "Online counselling band",
    description: "Blue band with three steps, two buttons and the video-call card.",
    fields: [
      { type: "text", key: "heading", label: "Heading", maxLength: 120 },
      { type: "textarea", key: "description", label: "Text", hideable: true, maxLength: 400 },
      {
        type: "list",
        key: "steps",
        label: "Steps",
        itemLabel: "step",
        titleKey: "title",
        hideable: true,
        max: 4,
        fields: [
          { type: "icon", key: "icon", label: "Icon" },
          { type: "text", key: "label", label: "Small label", maxLength: 20 },
          { type: "text", key: "title", label: "Title", maxLength: 50 },
        ],
      },
      linkField("primaryButton", "Orange button"),
      linkField("secondaryButton", "Outline button"),
      {
        type: "object",
        key: "card",
        label: "Video-call card",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Card title", maxLength: 40 },
          { type: "text", key: "liveLabel", label: "Badge text", maxLength: 12 },
        ],
      },
    ],
  },
  {
    kind: "homeWhy",
    label: "Why Cerebellum",
    description: "Fixed text on the left; photo cards stack on the right as you scroll.",
    fields: [
      ...headingFields(),
      {
        type: "list",
        key: "services",
        label: "Ticked services",
        itemLabel: "service",
        titleKey: "text",
        hideable: true,
        max: 12,
        fields: [{ type: "text", key: "text", label: "Text", maxLength: 60 }],
      },
      linkField("primaryButton", "Orange button"),
      linkField("secondaryButton", "Outline button"),
      {
        type: "list",
        key: "cards",
        label: "Photo cards",
        itemLabel: "card",
        titleKey: "title",
        max: 5,
        fields: [{ type: "image", key: "image", label: "Photo" }, ...iconTextItem],
      },
    ],
  },
  {
    kind: "homeTrust",
    label: "Our commitments (trust)",
    description: "'Why students and parents trust us' with commitment cards.",
    fields: [...headingFields(), { type: "list", key: "items", label: "Commitments", itemLabel: "commitment", titleKey: "title", max: 9, fields: iconTextItem }],
  },
  {
    kind: "homeProcess",
    label: "Your journey (steps)",
    description: "The step timeline. Steps are edited under Admission steps.",
    fields: [...headingFields(), linkField("button", "Button below")],
  },
  {
    kind: "homeTeam",
    label: "Meet your counsellors",
    description: "Counsellor cards. Shown only when counsellors are added under Team.",
    fields: headingFields(),
  },
  ...homeMediaSpecs,
  {
    kind: "homeFaq",
    label: "FAQs",
    description: "Questions with answers, and the 'Still have a question?' card.",
    fields: [
      ...headingFields(),
      {
        type: "object",
        key: "helpCard",
        label: "'Still have a question?' card",
        hideable: true,
        fields: [
          { type: "text", key: "title", label: "Title", maxLength: 60 },
          { type: "textarea", key: "text", label: "Text", maxLength: 200 },
          linkField("button", "Button", false),
        ],
      },
      {
        type: "list",
        key: "faqs",
        label: "Questions",
        itemLabel: "question",
        titleKey: "question",
        max: 15,
        fields: [
          { type: "text", key: "question", label: "Question", maxLength: 200 },
          { type: "textarea", key: "answer", label: "Answer", maxLength: 1500 },
        ],
      },
      linkField("seeAll", "Link below the questions"),
    ],
  },
  {
    kind: "homeVerify",
    label: "'Verify the university' notice",
    description: "Orange-edged safety notice with an outside link.",
    fields: [
      { type: "text", key: "heading", label: "Heading", maxLength: 120 },
      { type: "textarea", key: "text", label: "Text", maxLength: 400 },
      linkField("button", "Button"),
    ],
  },
];

export const homeDefaults = (): PageContent => ({
  version: 1,
  sections: [
    section("homeHero", {
      titleLine1: "Your Medical Dreams.",
      titleLine2: "A World of Opportunities.",
      description:
        "Personalised counselling for MBBS and medical degrees abroad: choosing the right country and university, preparing your application and getting you to campus.",
      chips: texts("chip", ["MBBS & medical degrees", "Admission & visa guidance", "Support until you reach campus"]),
      primaryButton: { label: "Book Free Counselling", href: "/book-counselling" },
      secondaryButton: { label: "Explore destinations", href: "/destinations" },
      photo: img(branding.heroImage?.src ?? "", branding.heroImage?.alt ?? ""),
      badge: { title: "Free first consultation", text: "In person, online or by phone" },
      bubbles: items("bub", [
        { icon: "user-round", value: "", label: "Your own counsellor" },
        { icon: "users", value: "", label: "Parents welcome" },
      ]),
      logoSeal: {},
      booking: {
        title: "Book your free counselling",
        subtitle: "Three quick choices so we can prepare for your conversation.",
        buttonLabel: "Continue",
        notes: texts("note", ["First consultation is free", "Parents welcome to join", "No documents needed at this stage"]),
      },
    }),
    section("homeAbout", {
      video: {
        src: "/videos/campus-hallway.mp4",
        poster: img("/images/campus-hallway-poster.jpg", "Students walking and talking in a university hallway"),
        caption: "Life on campus",
        tag: "Study medicine abroad",
      },
      photo: img(branding.aboutImage.src, branding.aboutImage.alt, "70% 50%"),
      heading: "Your Trusted Partner in *Medical Education Abroad*",
      description:
        "Choosing where to study medicine is one of the biggest decisions a family makes. We help you make it with clarity, explaining options honestly and guiding you through every step of admission.",
      points: items("pt", [
        { icon: "user-check", text: "Advice built around your grades, goals, budget and family" },
        { icon: "badge-check", text: "Requirements checked against official sources" },
        { icon: "scale", text: "Recognition and licensing explained clearly" },
        { icon: "heart-handshake", text: "One counsellor from first call to campus" },
      ]),
      button: { label: "More about us", href: "/about" },
    }),
    section("homeProgrammes", {
      heading: "Discover Your Future in *Healthcare*",
      description:
        "Medicine is our focus, alongside related healthcare degrees. Choose a programme to see its duration, destinations and entry requirements.",
      photos: {
        mbbs: img("/images/programme-mbbs.jpg", "Medical students in white coats reviewing notes in a hallway"),
        md: img("/images/programme-lab.jpg", "Medical students in white coats in a teaching laboratory"),
        dentistry: img("/images/programme-lab.jpg", "Students in white coats in a teaching laboratory"),
        nursing: img("/images/programme-mbbs.jpg", "Healthcare students in white coats talking in a hallway"),
        pharmacy: img("/images/programme-microscope.jpg", "Students working at microscopes in a laboratory"),
        "biomedical-sciences": img("/images/programme-microscope.jpg", "Students working at microscopes in a laboratory"),
      },
      bookLabel: "Book counselling",
      learnLabel: "Learn more",
      button: { label: "View all programmes", href: "/programs" },
    }),
    section("homeDestinations", {
      heading: "Top Destinations to *Study Medicine*",
      description: "Each country has its own entry route, programme length and language environment. Filter by programme to compare.",
      askCard: {
        title: "Another country in mind?",
        text: "Tell us and we'll say honestly whether we can help.",
        link: { label: "Ask a counsellor", href: "/book-counselling" },
      },
      button: { label: "Compare all destinations", href: "/destinations" },
    }),
    section("homeQuiz", {
      heading: "Not Sure Where to Start? *Find Your Best-Fit Country*",
      description: "Answer two quick questions and get a starting shortlist of destinations to discuss with a counsellor.",
    }),
    section("homeOnline", {
      heading: "Can't visit our office? Talk to us online.",
      description:
        "The same personalised guidance by video or phone, ideal for students outside the city and for parents who want to join from work.",
      steps: items("os", [
        { icon: "calendar", label: "Step 1", title: "Request a session" },
        { icon: "messages", label: "Step 2", title: "Confirm a time" },
        { icon: "video", label: "Step 3", title: "Talk to a counsellor" },
      ]),
      primaryButton: { label: "Book online counselling", href: "/book-counselling?mode=online" },
      secondaryButton: { label: "How it works", href: "/admission-process" },
      card: { title: "Online counselling", liveLabel: "Live" },
    }),
    section("homeWhy", {
      heading: "More Than Admissions. *Guidance for Your Future.*",
      description:
        "An offer letter is only the beginning. We guide every stage with care, because the right decision now shapes the next decade of your life.",
      services: texts("svc", services.map((x) => x.title)),
      primaryButton: { label: "Book Free Counselling", href: "/book-counselling" },
      secondaryButton: { label: "How we work", href: "/about" },
      cards: items("wc", [
        {
          image: img("/images/why-counselling.jpg", "A counsellor talking one-to-one with a student"),
          icon: "messages",
          title: "One-to-one counselling",
          text: "Advice shaped around your grades, goals, budget and family priorities, never sales targets.",
        },
        {
          image: img("/images/why-parents.jpg", "A counsellor meeting a student and a family member"),
          icon: "users",
          title: "Parents included at every step",
          text: "Families can join any session, in person or online, so everyone understands the decision.",
        },
        {
          image: img("/images/why-graduate.jpg", "A smiling graduate in cap and gown holding her certificate"),
          icon: "graduation-cap",
          title: "Focused on your long-term goal",
          text: "Recognition, licensing and internship rules are checked early, so your degree works for your future.",
        },
      ]),
    }),
    section("homeTrust", {
      heading: "Why Students and Parents *Trust Us*",
      description:
        "Studying abroad is a big investment of money, time and hope. These are the commitments we make to every student, from the first conversation onwards.",
      items: items("tr", [
        {
          icon: "message-heart",
          title: "Honest advice, even when it's “not this one”",
          text: "If a country, university or programme doesn't fit your grades, budget or goals, we tell you plainly.",
        },
        {
          icon: "search",
          title: "Checked against official sources",
          text: "Universities are checked against official listings, such as the World Directory of Medical Schools, and your home regulator's rules.",
        },
        {
          icon: "landmark",
          title: "Tuition paid directly to the university",
          text: "Fees go to the university through its own official channels, and we explain the fee schedule before you accept.",
        },
        {
          icon: "clipboard",
          title: "A written checklist and timeline",
          text: "You get a document checklist and timeline for your chosen university, so nothing is left to memory.",
        },
        {
          icon: "users",
          title: "Parents in every conversation",
          text: "Families can join any session, in person or online, and every decision is explained to them too.",
        },
        {
          icon: "shield-check",
          title: "No false guarantees",
          text: "Admission, visas and licences are decided by universities, governments and regulators. We'll never promise otherwise.",
        },
      ]),
    }),
    section("homeProcess", {
      heading: "Your Journey to *Studying Medicine Abroad*",
      description:
        "Eight clear stages, with a counsellor beside you at each one. Timelines vary by country and intake, and we map yours out at the start.",
      button: { label: "See each step in detail", href: "/admission-process" },
    }),
    section("homeTeam", {
      heading: "Meet Your *Counsellors*",
      description: "The people who will guide you, from your first conversation to your first day on campus.",
    }),
    section("homeReels", structuredClone(homeMediaDefaults.homeReels!)),
    section("homeVideos", structuredClone(homeMediaDefaults.homeVideos!)),
    section("homeBlog", structuredClone(homeMediaDefaults.homeBlog!)),
    section("homeFaq", {
      heading: "Questions families *ask us most*",
      description: "Requirements differ between countries, universities and home-country regulators. These answers explain the general picture.",
      helpCard: {
        title: "Still have a question?",
        text: "A counsellor will answer it for your specific situation, free of charge.",
        button: { label: "Ask a counsellor", href: "/book-counselling" },
      },
      faqs: items("faq", homeFaqs.map((f) => ({ question: f.question, answer: f.answer }))),
      seeAll: { label: "See all FAQs", href: "/faqs" },
    }),
    section("homeVerify", {
      heading: "Before you pay any fees, verify the university.",
      text: "Check its listing in the World Directory of Medical Schools and your home regulator's rules. Be wary of anyone who guarantees admission, a visa or a licence.",
      button: { label: "Search WDOMS", href: globalSources.wdoms.href },
    }),
  ],
});
