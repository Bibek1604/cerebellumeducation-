import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { GenericSection } from "@/components/cms/sections";
import { getPage, getSiteSettings, on, sectionsOf, visible } from "@/cms/content";
import { safeHref } from "@/cms/sanitize";
import type { ContentKey, Section } from "@/cms/types";
import { siteConfig } from "@/config/site";

/**
 * Renders an admin-managed legal page (Privacy Policy, Terms & Conditions).
 * Text supports [link text](/path), {contact} (email link, or the Contact page
 * when no email is set) and {company} (the website name).
 */
export async function ManagedLegalPage({ contentKey, path }: { contentKey: ContentKey; path: string }) {
  const [page, { contact }] = await Promise.all([getPage(contentKey), getSiteSettings()]);
  const sections = sectionsOf(page);
  const hero = sections.find((s) => s.kind === "legalHero");
  const title = String(hero?.data.title ?? "");
  const updated = hero && visible(hero)("updated") && hero.data.updated ? formatDate(String(hero.data.updated)) : null;
  const rich = (text: string) => <RichText text={text} email={contact.email} />;

  return (
    <>
      <PageHero title={title} description={updated ? `Last updated ${updated}` : undefined} crumbs={[{ label: title, href: path }]} />
      <Container className="py-16 sm:py-20">
        <article className="prose-brand mx-auto max-w-3xl text-ink">
          {sections
            .filter((s) => s.kind === "legalText")
            .map((s) => (
              <LegalBlock key={s.id} section={s} rich={rich} />
            ))}
        </article>
      </Container>
      {sections
        .filter((s) => s.kind !== "legalText" && s.kind !== "legalHero")
        .map((s) => (
          <GenericSection key={s.id} section={s} prevWhite />
        ))}
    </>
  );
}

function LegalBlock({ section, rich }: { section: Section; rich: (t: string) => React.ReactNode }) {
  const blocks = on<{ style: string; text: string }>(section.data.blocks).filter((b) => b.text);
  // Group consecutive bullet points into one list.
  const groups: { style: "p" | "li"; texts: string[] }[] = [];
  for (const b of blocks) {
    const style = b.style === "li" ? "li" : "p";
    const last = groups.at(-1);
    if (style === "li" && last?.style === "li") last.texts.push(b.text);
    else groups.push({ style, texts: [b.text] });
  }
  const heading = String(section.data.heading ?? "");
  return (
    <>
      {heading && <h2>{heading}</h2>}
      {groups.map((g, i) =>
        g.style === "li" ? (
          <ul key={i}>
            {g.texts.map((t, j) => (
              <li key={j}>{rich(t)}</li>
            ))}
          </ul>
        ) : (
          <p key={i}>{rich(g.texts[0]!)}</p>
        ),
      )}
    </>
  );
}

function RichText({ text, email }: { text: string; email: string | null }) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\)|\{contact\}|\{company\})/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part === "{company}") return siteConfig.name;
        if (part === "{contact}")
          return email ? (
            <a key={i} href={`mailto:${email}`}>
              email us at {email}
            </a>
          ) : (
            <Link key={i} href="/contact">
              contact us
            </Link>
          );
        const m = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
        if (m) {
          const href = safeHref(m[2]);
          if (!href) return m[1];
          return href.startsWith("/") ? (
            <Link key={i} href={href}>
              {m[1]}
            </Link>
          ) : (
            <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
              {m[1]}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
