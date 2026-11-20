import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getDestinations } from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const lastModified = siteConfig.lastUpdated;
  const staticRoutes: [string, number][] = [
    ["/", 1],
    ["/destinations", 0.9],
    ["/programs", 0.9],
    ["/book-counselling", 0.9],
    ["/admission-process", 0.8],
    ["/about", 0.7],
    ["/scholarships", 0.7],
    ["/faqs", 0.7],
    ["/contact", 0.7],
    ["/success-stories", 0.5],
    ["/privacy-policy", 0.2],
    ["/terms-and-conditions", 0.2],
  ];

  return [
    ...staticRoutes.map(([path, priority]) => ({ url: absoluteUrl(path), lastModified, priority })),
    ...destinations.map((d) => ({ url: absoluteUrl(`/destinations/${d.slug}`), lastModified, priority: 0.8 })),
    ...programmes.map((p) => ({ url: absoluteUrl(`/programs/${p.slug}`), lastModified, priority: 0.8 })),
  ];
}
