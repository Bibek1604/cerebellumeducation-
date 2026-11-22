/**
 * Helpers for links that administrators paste in (reels, videos).
 * Pure functions — safe to import anywhere.
 */
import type { SocialPlatform } from "@/config/site";

function parse(url: string): URL | null {
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u : null;
  } catch {
    return null;
  }
}

const host = (u: URL) => u.hostname.replace(/^(www\.|m\.|web\.)/, "");

/** Which social network a pasted link belongs to. */
export function platformOf(url: string): SocialPlatform {
  const u = parse(url);
  if (!u) return "other";
  const h = host(u);
  if (h.endsWith("facebook.com") || h === "fb.watch" || h === "fb.com") return "facebook";
  if (h.endsWith("tiktok.com")) return "tiktok";
  if (h.endsWith("instagram.com")) return "instagram";
  if (h.endsWith("youtube.com") || h === "youtu.be") return "youtube";
  return "other";
}

export const platformName: Record<SocialPlatform, string> = {
  facebook: "Facebook",
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  other: "the web",
};

/**
 * Turns a normal YouTube, Vimeo or Facebook video link into an embeddable
 * player URL. Returns null when the link can't be embedded (it is then shown
 * as a "watch" link instead).
 */
export function embedUrl(url: string): string | null {
  const u = parse(url);
  if (!u) return null;
  const h = host(u);
  const id = (s: string | null | undefined) => (s && /^[\w-]{6,20}$/.test(s) ? s : null);

  if (h === "youtube.com" || h === "youtube-nocookie.com") {
    const parts = u.pathname.split("/").filter(Boolean);
    const v = id(u.searchParams.get("v")) ?? (["embed", "shorts", "live"].includes(parts[0] ?? "") ? id(parts[1]) : null);
    return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (h === "youtu.be") {
    const v = id(u.pathname.slice(1));
    return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
  }
  if (h === "vimeo.com" || h === "player.vimeo.com") {
    const v = u.pathname.match(/(\d{6,12})/)?.[1];
    return v ? `https://player.vimeo.com/video/${v}` : null;
  }
  if (h.endsWith("facebook.com") || h === "fb.watch") {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return null;
}

/** YouTube thumbnail for a link, when one is available without an API call. */
export function thumbnailOf(url: string): string | null {
  const e = embedUrl(url);
  const m = e?.match(/youtube-nocookie\.com\/embed\/([\w-]+)/);
  return m ? `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` : null;
}
