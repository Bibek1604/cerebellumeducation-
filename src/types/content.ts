export type ExternalSource = {
  label: string;
  href: string;
  /** Who publishes it, e.g. "Ministry of Education, PRC" */
  publisher?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type Destination = {
  slug: string;
  /**
   * Set to false to hide a destination everywhere (cards, menus, sitemap,
   * forms) until the consultancy confirms it actively supports it.
   */
  enabled: boolean;
  name: string;
  /** ISO 3166-1 alpha-2, used in the artwork */
  code: string;
  capital: string;
  coordinates: string;
  tagline: string;
  /** Meta description, 120–160 characters */
  seoDescription: string;
  summary: string;
  overview: string[];
  /** Programme slugs available through this destination */
  programmes: string[];
  medium: string;
  duration: string;
  eligibility: string[];
  academic: string[];
  language: string[];
  admissionNotes: string[];
  /**
   * Verified cost figures for the current intake. Leave null until the
   * consultancy has confirmed figures — the page then explains that costs
   * are shared during counselling instead of showing guessed numbers.
   */
  indicativeCosts: null | {
    /** Amounts as plain strings in `currency`, e.g. "4,500" or "4,000–6,000" */
    tuitionPerYear: string;
    hostelPerYear?: string;
    livingPerMonth?: string;
    currency: string;
    /** Where the figures come from, e.g. the university's official fee letter */
    source: string;
    /** ISO date the figures were verified */
    lastVerified: string;
    notes?: string;
  };
  recognition: string[];
  sources: ExternalSource[];
  faqs: FaqItem[];
  /** Optional licensed photograph; replaces the generated artwork */
  image?: ImageAsset;
  /** Artwork tint: two CSS colours for the gradient */
  art: [string, string];
};

export type Programme = {
  slug: string;
  enabled: boolean;
  name: string;
  shortName: string;
  /** Short tag shown on cards, e.g. "Medicine" */
  category: string;
  icon: "stethoscope" | "graduation" | "smile" | "heart" | "pill" | "microscope";
  /** Meta description, 120–160 characters */
  seoDescription: string;
  summary: string;
  intro: string;
  overview: string[];
  duration: string;
  eligibility: string[];
  academic: string[];
  considerations: string[];
  faqs: FaqItem[];
  image?: ImageAsset;
};

export type University = {
  slug: string;
  enabled: boolean;
  name: string;
  /** Short display code used on cards when there is no logo, e.g. "TSMU" */
  shortName: string;
  /** Destination slug */
  country: string;
  city: string;
  /** Programme slugs this institution is listed for on this site */
  programmes: string[];
  intro: string;
  /** Official university website */
  officialUrl: string;
  /** Direct link to the university's World Directory of Medical Schools entry, if verified */
  wdomsUrl?: string;
  /**
   * Only set true if a formal, written partnership/representation agreement
   * exists. Displays a "Partner institution" badge.
   */
  isPartner: boolean;
  /** Official logo (licensed / permitted use only) */
  logo?: ImageAsset;
  image?: ImageAsset;
  /** Verified details — leave undefined until confirmed with the university */
  mediumOfInstruction?: string;
  tuitionRange?: { amount: string; currency: string; per: "year" | "programme"; source: string; lastVerified: string };
  intakes?: string[];
  recognitionNotes?: string[];
};

export type Testimonial = {
  id: string;
  studentName: string;
  destination: string;
  university: string;
  programme: string;
  admissionYear: string;
  quote: string;
  photo?: ImageAsset;
  videoUrl?: string;
  /** Must be true — confirms written permission to publish */
  consentOnFile: true;
};

export type Scholarship = {
  id: string;
  name: string;
  provider: string;
  destination: string;
  summary: string;
  eligibility: string[];
  deadline: string;
  officialUrl: string;
  /** Date the details were last checked against the official source */
  verifiedOn: string;
};
