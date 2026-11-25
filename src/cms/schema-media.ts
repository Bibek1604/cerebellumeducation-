/**
 * Reels, videos and blog posts: field specs and defaults.
 * Nothing is invented: reels and videos start empty, the blog starts with the sourced articles in data/posts.ts.
 * Pure data — safe to import from client components.
 */
import { seedPosts } from "@/data/posts";
import type { FieldSpec, SettingsContent } from "./types";

const empty = (key: string) => (): SettingsContent => ({ version: 1, hidden: [], data: { [key]: [] } });

export const reelsSpec: FieldSpec[] = [
  {
    type: "list",
    key: "reels",
    label: "Reels",
    itemLabel: "reel",
    titleKey: "title",
    max: 24,
    help: "Short videos posted on Facebook, TikTok, Instagram or YouTube Shorts. Paste the link to the reel; visitors open it on that platform. The platform icon is picked automatically from the link.",
    fields: [
      { type: "text", key: "title", label: "Reel title", maxLength: 100, placeholder: "A day in the life of an MBBS student in Georgia" },
      { type: "text", key: "url", label: "Link to the reel (https://…)", format: "https", maxLength: 500, placeholder: "https://www.tiktok.com/@cerebellum/video/…" },
      { type: "image", key: "thumbnail", label: "Cover picture (portrait works best, optional)", hideable: true },
    ],
  },
];
export const reelsDefaults = empty("reels");

export const videosSpec: FieldSpec[] = [
  {
    type: "list",
    key: "videos",
    label: "Videos",
    itemLabel: "video",
    titleKey: "title",
    max: 30,
    help: "Paste a normal YouTube, Vimeo or Facebook video link. YouTube and Vimeo play right on the website; other links open in a new tab.",
    fields: [
      { type: "text", key: "title", label: "Video title", maxLength: 120 },
      { type: "text", key: "url", label: "Video link (https://…)", format: "https", maxLength: 500, placeholder: "https://www.youtube.com/watch?v=…" },
      { type: "textarea", key: "description", label: "Short description", hideable: true, maxLength: 400 },
    ],
  },
];
export const videosDefaults = empty("videos");

export const blogSpec: FieldSpec[] = [
  {
    type: "list",
    key: "posts",
    label: "Blog posts",
    itemLabel: "post",
    titleKey: "title",
    max: 100,
    help: "Each post gets its own page at /blog/web-address. The newest date is shown first. Untick a post to hide it without deleting it. In paragraphs, leave an empty line between paragraphs, start lines with \"- \" for a list, and write [text](/contact) or [text](https://…) for a link.",
    fields: [
      { type: "text", key: "title", label: "Title", maxLength: 140 },
      { type: "text", key: "slug", label: "Web address (leave empty to make one from the title)", format: "slug", maxLength: 80, placeholder: "mbbs-in-georgia-guide" },
      { type: "text", key: "date", label: "Published date (YYYY-MM-DD)", format: "date", maxLength: 10 },
      { type: "text", key: "author", label: "Author", hideable: true, maxLength: 80 },
      { type: "textarea", key: "excerpt", label: "Summary (shown on cards and in Google)", maxLength: 300 },
      { type: "image", key: "cover", label: "Cover image", hideable: true },
      {
        type: "list",
        key: "blocks",
        label: "Article body",
        itemLabel: "paragraph",
        titleKey: "text",
        max: 60,
        fields: [
          { type: "text", key: "heading", label: "Sub-heading above this paragraph (optional)", maxLength: 140 },
          { type: "textarea", key: "text", label: "Paragraph", maxLength: 4000 },
        ],
      },
    ],
  },
];
export const blogDefaults = (): SettingsContent => ({
  version: 1,
  hidden: [],
  data: {
    posts: seedPosts.map((p) => ({
      _id: `post-${p.slug}`,
      enabled: true,
      title: p.title,
      slug: p.slug,
      date: p.date,
      author: "",
      excerpt: p.excerpt,
      cover: { ...p.cover, position: "" },
      blocks: p.blocks.map((b, i) => ({ _id: `post-${p.slug}-${i}`, enabled: true, ...b })),
    })),
  },
});

/* ───────────── Homepage sections that show the lists above ───────────── */

const headingFields = (): FieldSpec[] => [
  { type: "text", key: "heading", label: "Heading", highlight: true, maxLength: 160 },
  { type: "textarea", key: "description", label: "Intro text", hideable: true, maxLength: 500 },
];

export const homeMediaSpecs = [
  {
    kind: "homeReels",
    label: "Reels (Facebook / TikTok)",
    description: "Reel cards linking to Facebook, TikTok or Instagram. Reels themselves: Admin → Reels.",
    fields: [
      ...headingFields(),
      { type: "select", key: "count", label: "How many to show", options: ["4", "6", "8", "12"].map((v) => ({ value: v, label: v })) },
      { type: "link", key: "followButton", label: "Follow button (e.g. your TikTok profile)", hideable: true },
    ],
  },
  {
    kind: "homeVideos",
    label: "Videos",
    description: "The latest videos, playable on the page. Videos themselves: Admin → Videos.",
    fields: [
      ...headingFields(),
      { type: "select", key: "count", label: "How many to show", options: ["2", "3", "4", "6"].map((v) => ({ value: v, label: v })) },
      { type: "link", key: "button", label: "'See all videos' button", hideable: true },
    ],
  },
  {
    kind: "homeBlog",
    label: "Latest blog posts",
    description: "The newest blog posts. Posts themselves: Admin → Blog posts.",
    fields: [
      ...headingFields(),
      { type: "select", key: "count", label: "How many to show", options: ["3", "6"].map((v) => ({ value: v, label: v })) },
      { type: "link", key: "button", label: "'Read the blog' button", hideable: true },
    ],
  },
] satisfies { kind: string; label: string; description: string; fields: FieldSpec[] }[];

export const homeMediaDefaults: Record<string, Record<string, unknown>> = {
  homeReels: {
    heading: "Watch our *latest reels*",
    description: "Quick tips, student life and campus tours, shared on our social channels.",
    count: "8",
    followButton: { label: "", href: "" },
  },
  homeVideos: {
    heading: "Videos from *Cerebellum*",
    description: "Counselling sessions, university walkthroughs and answers to common questions.",
    count: "3",
    button: { label: "See all videos", href: "/videos" },
  },
  homeBlog: {
    heading: "From our *blog*",
    description: "Guides and updates on studying medicine abroad.",
    count: "3",
    button: { label: "Read the blog", href: "/blog" },
  },
};
