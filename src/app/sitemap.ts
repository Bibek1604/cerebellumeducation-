import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";
import { getDestinations } from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";
import { getPage } from "@/cms/content";
import { getPosts, getReels, getVideos } from "@/cms/media";
import { storiesOf } from "@/cms/stories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [destinations, programmes, posts, videos, reels, storiesPage] = await Promise.all([
    getDestinations(),
    getProgrammes(),
    getPosts(),
    getVideos(),
    getReels(),
    getPage("page:success-stories"),
  ]);
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
    // Empty pages are hidden from search engines (see their generateMetadata), so they are not listed either.
    ...(storiesOf(storiesPage).length ? ([["/success-stories", 0.5]] as [string, number][]) : []),
    ...(posts.length ? ([["/blog", 0.6]] as [string, number][]) : []),
    ...(videos.length + reels.length ? ([["/videos", 0.5]] as [string, number][]) : []),
    ["/privacy-policy", 0.2],
    ["/terms-and-conditions", 0.2],
  ];

  return [
    ...staticRoutes.map(([path, priority]) => ({ url: absoluteUrl(path), lastModified, priority })),
    ...destinations.map((d) => ({ url: absoluteUrl(`/destinations/${d.slug}`), lastModified, priority: 0.8 })),
    ...programmes.map((p) => ({ url: absoluteUrl(`/programs/${p.slug}`), lastModified, priority: 0.8 })),
    ...posts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: p.date ?? lastModified, priority: 0.6 })),
  ];
}
