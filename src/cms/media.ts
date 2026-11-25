import "server-only";
import { getSettings, hasImage, on, visible } from "./content";
import type { ImageValue } from "./types";
import type { SocialPlatform } from "@/config/site";
import { embedUrl, platformOf, thumbnailOf } from "@/lib/video";

/** Reels, videos and blog posts (Admin → Reels / Videos / Blog posts). */

export type Reel = { id: string; title: string; url: string; platform: SocialPlatform; embed: string | null; thumbnail: ImageValue | null };
export type Video = { id: string; title: string; url: string; embed: string | null; thumbnail: string | null; description: string | null };
export type PostBlock = { heading: string | null; text: string };
export type Post = {
  slug: string;
  title: string;
  date: string | null;
  author: string | null;
  excerpt: string;
  cover: ImageValue | null;
  blocks: PostBlock[];
};

export async function getReels(): Promise<Reel[]> {
  const s = await getSettings("settings:reels");
  const show = visible(s);
  return on<{ title: string; url: string; thumbnail: ImageValue }>(s.data.reels)
    .filter((r) => r.title && r.url)
    .map((r) => ({
      id: r._id,
      title: r.title,
      url: r.url,
      platform: platformOf(r.url),
      // Facebook's player is made for wide videos, so Facebook reels keep the cover that links out.
      embed: platformOf(r.url) === "facebook" ? null : embedUrl(r.url),
      thumbnail: show("reels.thumbnail") && hasImage(r.thumbnail) ? r.thumbnail : null,
    }));
}

export async function getVideos(): Promise<Video[]> {
  const s = await getSettings("settings:videos");
  const show = visible(s);
  return on<{ title: string; url: string; description: string }>(s.data.videos)
    .filter((v) => v.title && v.url)
    .map((v) => ({
      id: v._id,
      title: v.title,
      url: v.url,
      embed: embedUrl(v.url),
      thumbnail: thumbnailOf(v.url),
      description: show("videos.description") && v.description ? v.description : null,
    }));
}

/** Published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
  const s = await getSettings("settings:blog");
  const show = visible(s);
  return on<{ title: string; slug: string; date: string; author: string; excerpt: string; cover: ImageValue; blocks: unknown }>(s.data.posts)
    .filter((p) => p.title && p.slug)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date || null,
      author: show("posts.author") && p.author ? p.author : null,
      excerpt: p.excerpt,
      cover: show("posts.cover") && hasImage(p.cover) ? p.cover : null,
      blocks: on<{ heading: string; text: string }>(p.blocks)
        .filter((b) => b.text || b.heading)
        .map((b) => ({ heading: b.heading || null, text: b.text })),
    }))
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getPostBySlug(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug) ?? null;
}

export const formatPostDate = (d: string | null) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : null;
