import type { SiteSettings } from "@/cms/content";
import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import type { FaqItem } from "@/types/content";
import { mapCoordinates, openingHoursSpec } from "@/lib/local-business";

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
  const fullTitle = absoluteTitle ? title : `${title} | ${siteConfig.shortName}`;
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

export function organizationJsonLd(settings: SiteSettings) {
  const { contact, social, company } = settings;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    // LocalBusiness needs a real address, so it is only claimed once one is set in the Admin Panel.
    "@type": contact.address ? ["EducationalOrganization", "LocalBusiness"] : ["Organization", "EducationalOrganization"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    alternateName: siteConfig.shortName,
    areaServed: { "@type": "Country", name: "Nepal" },
    knowsAbout: ["Medical education abroad", "MBBS admissions", "Medical career counselling in Nepal", "MECEE-BL (CEE)", "MEC Eligibility Letter"],
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
  if (company.legalName) data.legalName = company.legalName;
  if (company.registrationNo) data.identifier = company.registrationNo;
  if (company.establishedYear) data.foundingDate = company.establishedYear;
  // openingHoursSpecification, hasMap and geo belong to places, so they need the address as well.
  if (contact.address) {
    const hours = openingHoursSpec(contact.officeHours ?? []);
    if (hours.length) data.openingHoursSpecification = hours;
    if (contact.mapLink) data.hasMap = contact.mapLink;
    const geo = mapCoordinates(contact.mapEmbedUrl);
    if (geo) data.geo = { "@type": "GeoCoordinates", ...geo };
    data.image = `${siteConfig.url}/opengraph-image`;
  }
  data.logo = `${siteConfig.url}/logos/cerebellum-logo-full.png`;
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
