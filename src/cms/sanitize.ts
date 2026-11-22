import { iconRegistry } from "./icons";
import { getEntry, specFor, type PageEntry, type SettingsEntry } from "./schema";
import type { FieldSpec, PageContent, Section, SettingsContent } from "./types";

/**
 * Cleans untrusted editor input against the field specs before it is stored.
 * Unknown keys are dropped, strings trimmed and capped, links and image paths
 * validated. Anything invalid becomes empty rather than being saved as-is.
 */

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.replace(/\u0000/g, "").trim().slice(0, max) : "");

export function safeHref(v: unknown): string {
  const s = str(v, 500);
  if (!s) return "";
  if (s.startsWith("/") && !s.startsWith("//")) return s;
  if (s.startsWith("#")) return s;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(s)) {
    try {
      const u = new URL(s);
      return ["http:", "https:", "mailto:", "tel:"].includes(u.protocol) ? s : "";
    } catch {
      return "";
    }
  }
  return "";
}

function safeHttps(v: unknown, max: number): string {
  const s = str(v, max);
  if (!s) return "";
  try {
    return new URL(s).protocol === "https:" ? s : "";
  } catch {
    return "";
  }
}

/** Local images only: bundled /images or /logos, or uploads served from /media. */
export function safeImageSrc(v: unknown): string {
  const s = str(v, 300);
  if (!s || s.includes("..") || s.includes("\\")) return "";
  return /^\/(images|logos)\/[\w\-./]+\.(jpe?g|png|webp|avif|gif|svg)$/i.test(s) || /^\/media\/[a-f0-9]{24}\.(jpe?g|png|webp|avif|gif)$/i.test(s) ? s : "";
}

const safePosition = (v: unknown) => {
  const s = str(v, 30);
  return /^(center|top|bottom|left|right|\d{1,3}% \d{1,3}%)$/.test(s) ? s : "";
};

function formatText(spec: Extract<FieldSpec, { type: "text" | "textarea" }>, v: unknown): string {
  const max = spec.maxLength ?? (spec.type === "textarea" ? 2000 : 300);
  switch (spec.format) {
    case "href":
      return safeHref(v);
    case "https":
      return safeHttps(v, max);
    case "phone": {
      const s = str(v, max).replace(/[\s-()]/g, "");
      return /^\+?\d{6,16}$/.test(s) ? s : "";
    }
    case "digits": {
      const s = str(v, max).replace(/\D/g, "");
      return s;
    }
    case "email": {
      const s = str(v, max);
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) ? s : "";
    }
    case "video": {
      // A local /videos file, or a YouTube / Vimeo embed link.
      const s = str(v, max);
      if (/^\/videos\/[\w\-./]+\.(mp4|webm)$/i.test(s) && !s.includes("..")) return s;
      return /^https:\/\/(www\.youtube(-nocookie)?\.com\/embed\/|player\.vimeo\.com\/video\/)[\w\-?=&]+$/.test(s) ? s : "";
    }
    case "slug":
      return str(v, max).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    case "color": {
      const s = str(v, 7);
      return /^#[0-9a-f]{6}$/i.test(s) ? s.toLowerCase() : "";
    }
    case "date": {
      const s = str(v, 10);
      return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s)) ? s : "";
    }
    default:
      return str(v, max);
  }
}

function cleanFields(fields: FieldSpec[], input: unknown): Record<string, unknown> {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const v = src[f.key];
    switch (f.type) {
      case "text":
      case "textarea":
        out[f.key] = formatText(f, v);
        break;
      case "image": {
        const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
        out[f.key] = { src: safeImageSrc(o.src), alt: str(o.alt, 200), position: safePosition(o.position) };
        break;
      }
      case "icon":
        out[f.key] = typeof v === "string" && iconRegistry[v] ? v : "sparkles";
        break;
      case "link": {
        const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
        out[f.key] = { label: str(o.label, 80), href: safeHref(o.href) };
        break;
      }
      case "select":
        // Runtime options (programmes / countries) are checked when the content is read.
        if (f.optionsFrom) out[f.key] = str(v, 60).toLowerCase().replace(/[^a-z0-9-]/g, "");
        else out[f.key] = f.options.some((o) => o.value === v) ? v : f.options[0]?.value;
        break;
      case "object":
        out[f.key] = cleanFields(f.fields, v);
        break;
      case "list": {
        const arr = Array.isArray(v) ? v.slice(0, f.max ?? 50) : [];
        out[f.key] = arr.map((item, i) => {
          const o = (item && typeof item === "object" ? item : {}) as Record<string, unknown>;
          const id = typeof o._id === "string" && /^[\w-]{1,40}$/.test(o._id) ? o._id : `item-${i}-${Math.random().toString(36).slice(2, 8)}`;
          return { _id: id, enabled: o.enabled !== false, ...cleanFields(f.fields, o) };
        });
        break;
      }
    }
  }
  return out;
}

/** All hideable element paths a spec allows, e.g. "badge", "approach", "approach.icon". */
function hideablePaths(fields: FieldSpec[], prefix = ""): string[] {
  const paths: string[] = [];
  for (const f of fields) {
    const p = prefix + f.key;
    if (f.hideable) paths.push(p);
    if (f.type === "object") paths.push(...hideablePaths(f.fields, `${p}.`));
    // List-item fields are hidden per field across all items, e.g. "items.icon".
    if (f.type === "list") paths.push(...hideablePaths(f.fields, `${p}.`));
  }
  return paths;
}

function cleanHidden(fields: FieldSpec[], hidden: unknown): string[] {
  const allowed = new Set(hideablePaths(fields));
  return Array.isArray(hidden) ? [...new Set(hidden.filter((h): h is string => typeof h === "string" && allowed.has(h)))] : [];
}

export function sanitizePage(entry: PageEntry, input: unknown): PageContent {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const list = Array.isArray(raw.sections) ? raw.sections.slice(0, 40) : [];
  const sections: Section[] = [];
  const seen = new Set<string>();
  for (const s of list) {
    const o = (s && typeof s === "object" ? s : {}) as Record<string, unknown>;
    const kind = typeof o.kind === "string" ? o.kind : "";
    const spec = specFor(entry, kind);
    if (!spec) continue;
    let id = typeof o.id === "string" && /^[\w-]{1,40}$/.test(o.id) ? o.id : `${kind}-${sections.length}`;
    while (seen.has(id)) id = `${id}-x`;
    seen.add(id);
    sections.push({
      id,
      kind,
      enabled: o.enabled !== false,
      hidden: cleanHidden(spec.fields, o.hidden),
      data: cleanFields(spec.fields, o.data),
    });
  }
  // The page's fixed header section (e.g. "hero", "homeHero") always exists, once, and stays first.
  const fixedKind = entry.specs.find((s) => s.fixed)?.kind;
  if (fixedKind) {
    const firstIdx = sections.findIndex((s) => s.kind === fixedKind);
    const header = firstIdx === -1 ? entry.defaults().sections.find((s) => s.kind === fixedKind)! : sections[firstIdx]!;
    const rest = sections.filter((s) => s.kind !== fixedKind);
    return { version: 1, sections: [header, ...rest] };
  }
  return { version: 1, sections };
}

export function sanitizeSettings(entry: SettingsEntry, input: unknown): SettingsContent {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const data = cleanFields(entry.fields, raw.data);
  if (entry.key === "settings:destinations") uniqueSlugs(data.countries);
  if (entry.key === "settings:programmes") uniqueSlugs(data.list);
  if (entry.key === "settings:blog") uniqueSlugs(data.posts, "title", "post");
  return { version: 1, hidden: cleanHidden(entry.fields, raw.hidden), data };
}

/** Every country needs its own web address: fill empty ones from the name and de-duplicate. */
function uniqueSlugs(list: unknown, nameKey = "name", fallback = "country") {
  if (!Array.isArray(list)) return;
  const seen = new Set<string>();
  for (const c of list as Record<string, string>[]) {
    let base = c.slug || String(c[nameKey] ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || fallback;
    base = base.slice(0, 60);
    let slug = base;
    for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
    seen.add(slug);
    c.slug = slug;
  }
}

export function sanitizeFor(key: string, input: unknown) {
  const entry = getEntry(key);
  if (!entry) throw new Error("Unknown content key");
  return entry.type === "page" ? sanitizePage(entry, input) : sanitizeSettings(entry, input);
}
