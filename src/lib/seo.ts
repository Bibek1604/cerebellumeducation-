import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { FaqItem } from "@/types/content";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Use the brand title alone (homepage) */
  absoluteTitle?: boolean;
  noIndex?: boolean;
};

/** Shared, generated social image (src/app/opengraph-image.tsx). */
const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: `${siteConfig.name} | International Medical Education Consultancy` };

export function pageMetadata({ title, description, path, absoluteTitle, noIndex }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
      locale: "en_GB",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage.url],
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

export function organizationJsonLd() {
  const { contact, social } = siteConfig;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["Organization", "EducationalOrganization"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    knowsAbout: ["Medical education abroad", "MBBS admissions", "International university admissions counselling"],
  };
  if (contact.email) data.email = contact.email;
  if (contact.phone) data.telephone = contact.phone;
  if (contact.address) {
    data.address = {
      "@type": "PostalAddress",
      streetAddress: [contact.address.line1, contact.address.line2].filter(Boolean).join(", "),
      addressLocality: contact.address.city,
      addressRegion: contact.address.region,
      postalCode: contact.address.postalCode,
      addressCountry: contact.address.country,
    };
  }
  if (social.length) data.sameAs = social.map((s) => s.href);
  if (siteConfig.company.legalName) data.legalName = siteConfig.company.legalName;
  if (siteConfig.company.registrationNo) data.identifier = siteConfig.company.registrationNo;
  if (siteConfig.company.establishedYear) data.foundingDate = siteConfig.company.establishedYear;
  if (contact.officeHours) data.openingHours = contact.officeHours;
  data.logo = `${siteConfig.url}/logos/cerebellum-logo.png`;
  return data;
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export type Crumb = { label: string; href: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: absoluteUrl(c.href),
    })),
  };
}

/** Only use on pages where the Q&A is visible on the page itself. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
