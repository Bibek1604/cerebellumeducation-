import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { siteConfig, type Address, type SocialLink } from "@/config/site";
import type { ProcessStep } from "@/data/process";
import type { GuidanceBlock } from "@/data/nepal-guidance";
import type { TeamMember } from "@/data/team";
import { sanitizePage, sanitizeSettings } from "./sanitize";
import { getEntry, type PageEntry, type SettingsEntry } from "./schema";
import { readContent } from "./store";
import { logger } from "@/lib/logger";

const log = logger("cms");
import type { ContentKey, ImageValue, ListItem, PageContent, Section, SettingsContent } from "./types";

/**
 * Public read access to admin-managed content.
 * Cached and tagged per key; saving in the Admin Panel calls updateTag so the
 * change appears on the next request. If storage is unavailable, the last
 * content that was read is used, else the built-in defaults, so the website
 * never breaks.
 */

export const contentTag = (key: ContentKey) => `cms:${key}`;

/**
 * Tags only live in the memory of the server process that handled the save, so
 * they miss restarts, redeploys and other processes (PM2 cluster, cPanel).
 * These short times make every page check storage again by itself:
 *  - stale: an open browser tab reuses a page for 30 s (the minimum)
 *  - revalidate: the server refreshes a visited page after 5 s
 *  - expire: a page nobody visited for an hour is rebuilt before it is shown
 */
const CONTENT_LIFE = { stale: 30, revalidate: 5, expire: 3600 };

/** Last content read per key in this process, for when storage is briefly unreachable. */
const lastGood = new Map<ContentKey, unknown>();

async function load(key: ContentKey) {
  "use cache";
  cacheTag(contentTag(key));
  cacheLife(CONTENT_LIFE);
  try {
    const data = (await readContent(key))?.data ?? null;
    lastGood.set(key, data);
    return data;
  } catch (e) {
    const known = lastGood.has(key);
    log.error(known ? "Could not read content, showing the last known version" : "Could not read content, showing built-in defaults", { key, err: e });
    return known ? lastGood.get(key) : null;
  }
}

export async function getPage(key: ContentKey): Promise<PageContent> {
  const entry = getEntry(key) as PageEntry;
  const raw = await load(key);
  return raw ? sanitizePage(entry, raw) : entry.defaults();
}

export async function getSettings(key: ContentKey): Promise<SettingsContent> {
  const entry = getEntry(key) as SettingsEntry;
  const raw = await load(key);
  return raw ? sanitizeSettings(entry, raw) : entry.defaults();
}

/* ─────────────────────────── Render helpers ─────────────────────────── */

/** Visibility helper for a section's (or setting's) hideable elements. */
export function visible(owner: { hidden: string[] }) {
  return (key: string) => !owner.hidden.includes(key);
}

/** Enabled list items only. */
export function on<T>(list: unknown): ListItem<T>[] {
  return Array.isArray(list) ? (list as ListItem<T>[]).filter((i) => i.enabled !== false) : [];
}

export const textsOf = (list: unknown) => on<{ text: string }>(list).map((i) => i.text).filter(Boolean);

export function sectionsOf(page: PageContent): Section[] {
  return page.sections.filter((s) => s.enabled);
}

export const hasImage = (img: unknown): img is ImageValue => Boolean(img && typeof img === "object" && (img as ImageValue).src);

/* ─────────────────────────── Typed settings ─────────────────────────── */

export type SiteContact = {
  phone: string | null;
  phoneHref: string | null;
  whatsapp: string | null;
  email: string | null;
  address: Address | null;
  officeHours: string[] | null;
  mapEmbedUrl: string | null;
  mapLink: string | null;
};
export type SiteSettings = {
  contact: SiteContact;
  social: SocialLink[];
  company: typeof siteConfig.company;
  hasContactChannel: boolean;
  hasCompanyDetails: boolean;
};

const nz = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

/** Contact details, social links and company registration (Admin → Contact details & company). */
export async function getSiteSettings(): Promise<SiteSettings> {
  const { data } = await getSettings("settings:site");
  const c = (data.contact ?? {}) as Record<string, unknown>;
  const a = (c.address ?? {}) as Record<string, unknown>;
  const address: Address | null = nz(a.line1)
    ? { line1: nz(a.line1)!, line2: nz(a.line2) ?? undefined, city: nz(a.city) ?? "", region: nz(a.region) ?? undefined, postalCode: nz(a.postalCode) ?? undefined, country: nz(a.country) ?? "" }
    : null;
  const hours = textsOf(c.officeHours);
  const contact: SiteContact = {
    phone: nz(c.phone),
    phoneHref: nz(c.phoneHref),
    whatsapp: nz(c.whatsapp),
    email: nz(c.email),
    address,
    officeHours: hours.length ? hours : null,
    mapEmbedUrl: nz(c.mapEmbedUrl),
    mapLink: nz(c.mapLink),
  };
  const social = on<{ platform: SocialLink["platform"]; label: string; href: string }>(data.social)
    .filter((s) => s.href)
    .map((s) => ({ platform: s.platform, label: s.label || s.platform, href: s.href }));
  const comp = (data.company ?? {}) as Record<string, unknown>;
  const company = {
    legalName: nz(comp.legalName),
    registrationNo: nz(comp.registrationNo),
    registeredWith: nz(comp.registeredWith),
    panNo: nz(comp.panNo),
    consultancyApproval: nz(comp.consultancyApproval),
    establishedYear: nz(comp.establishedYear),
  };
  return {
    contact,
    social,
    company,
    hasContactChannel: Boolean(contact.phone || contact.whatsapp || contact.email || contact.address),
    hasCompanyDetails: Object.values(company).some(Boolean),
  };
}

export function phoneLinkFrom(c: SiteContact) {
  return c.phone && c.phoneHref ? { label: c.phone, href: `tel:${c.phoneHref}` } : null;
}

export function whatsappLinkFrom(c: SiteContact, message?: string) {
  if (!c.whatsapp) return null;
  return `https://wa.me/${c.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}

/** Counsellors (Admin → Team). */
export async function getTeam(): Promise<TeamMember[]> {
  const s = await getSettings("settings:team");
  const show = visible(s);
  return on<{ name: string; role: string; focus: string; experience: string; languages: string; bio: string; photo: ImageValue }>(s.data.members)
    .filter((m) => m.name)
    .map((m) => ({
      name: m.name,
      role: m.role,
      focus: show("members.focus") ? m.focus || undefined : undefined,
      experience: show("members.experience") ? m.experience || undefined : undefined,
      languages: show("members.languages") && m.languages ? m.languages.split(",").map((l) => l.trim()).filter(Boolean) : undefined,
      bio: show("members.bio") ? m.bio || undefined : undefined,
      photo: show("members.photo") && hasImage(m.photo) ? { src: m.photo.src, alt: m.photo.alt || m.name } : undefined,
    }));
}

/** Admission steps (Admin → Admission steps). */
export async function getSteps(): Promise<ProcessStep[]> {
  const s = await getSettings("settings:steps");
  return on<{ title: string; short: string; detail: string; youProvide: unknown }>(s.data.steps)
    .filter((st) => st.title)
    .map((st) => ({ title: st.title, short: st.short, detail: st.detail, youProvide: textsOf(st.youProvide) }));
}

/** Nepal & India guidance (Admin → Nepal & India guidance). */
export async function getGuidance(): Promise<{ nepal: GuidanceBlock; india: GuidanceBlock | null; showNepalChecked: boolean }> {
  const s = await getSettings("settings:guidance");
  const show = visible(s);
  const block = (id: "nepal" | "india", audience: string): GuidanceBlock => {
    const b = (s.data[id] ?? {}) as Record<string, unknown>;
    return {
      id,
      title: String(b.title ?? ""),
      audience,
      points: textsOf(b.points),
      sources: on<{ label: string; href: string }>(b.sources)
        .filter((x) => x.href)
        .map((x) => ({ label: x.label || x.href, href: x.href, publisher: "" })),
      lastChecked: nz(b.lastChecked),
    };
  };
  return {
    nepal: block("nepal", "Nepali citizens"),
    india: show("india") ? block("india", "Indian citizens") : null,
    showNepalChecked: show("nepal.lastChecked"),
  };
}
