/**
 * Central business configuration.
 *
 * Every contact detail shown on the website comes from this file.
 * Anything left as `null` / empty is simply not rendered — never fill these
 * with guessed values.
 */

export type SocialPlatform = "facebook" | "instagram" | "youtube" | "tiktok" | "linkedin" | "x" | "other";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  href: string;
};

export type Address = {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: string;
};

export type CompanyDetails = {
  /** Registered legal name, if different from the brand name */
  legalName: string | null;
  /** Company registration number */
  registrationNo: string | null;
  /** Authority the company is registered with, e.g. "Office of the Company Registrar, Nepal" */
  registeredWith: string | null;
  /** PAN / VAT number */
  panNo: string | null;
  /** Any government approval/licence for education consultancy services, as written on the certificate */
  consultancyApproval: string | null;
  establishedYear: string | null;
};

export const siteConfig = {
  name: "Cerebellum Education Network",
  shortName: "Cerebellum",
  tagline: "International Medical Education Consultancy",
  description:
    "Cerebellum Education Network guides students and parents through studying medicine abroad, from counselling and university selection to applications, visas and pre-departure support.",

  /** Public URL, used for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  /** Content revision date shown on legal pages and used in the sitemap. Update when content changes. */
  lastUpdated: "2026-11-17",

  contact: {
    // TODO(owner): display format, e.g. "+977 1-234 5678"
    phone: null as string | null,
    // TODO(owner): dial format for tel: links, e.g. "+97712345678"
    phoneHref: null as string | null,
    // TODO(owner): WhatsApp number, international format without + or spaces, e.g. "9779800000000"
    whatsapp: null as string | null,
    // TODO(owner): public enquiry email
    email: null as string | null,
    // TODO(owner): office address
    address: null as Address | null,
    // TODO(owner): e.g. ["Sunday – Friday: 10:00 – 17:00", "Saturday: Closed"]
    officeHours: null as string[] | null,
    // TODO(owner): Google Maps "Embed a map" iframe src URL
    mapEmbedUrl: null as string | null,
    // TODO(owner): Google Maps share link for "Get directions"
    mapLink: null as string | null,
  },

  // TODO(owner): official social profiles, e.g. { platform: "facebook", label: "Facebook", href: "https://facebook.com/..." }
  social: [] as SocialLink[],

  // TODO(owner): company registration details exactly as on official certificates
  company: {
    legalName: null,
    registrationNo: null,
    registeredWith: null,
    panNo: null,
    consultancyApproval: null,
    establishedYear: null,
  } as CompanyDetails,
};

export const hasContactChannel =
  Boolean(siteConfig.contact.phone) ||
  Boolean(siteConfig.contact.whatsapp) ||
  Boolean(siteConfig.contact.email) ||
  Boolean(siteConfig.contact.address);

export const hasCompanyDetails = Object.values(siteConfig.company).some(Boolean);

export function phoneLink() {
  const { phone, phoneHref } = siteConfig.contact;
  return phone && phoneHref ? { label: phone, href: `tel:${phoneHref}` } : null;
}

export function whatsappLink(message?: string) {
  if (!siteConfig.contact.whatsapp) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${siteConfig.contact.whatsapp}${text}`;
}

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}
