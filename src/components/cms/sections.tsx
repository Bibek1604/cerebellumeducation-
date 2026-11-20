import { PageHero } from "@/components/sections/page-hero";
import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { Highlight, plainText } from "@/cms/highlight";
import { CmsIcon } from "@/cms/cms-icon";
import { hasImage, on, textsOf, visible } from "@/cms/content";
import type { ImageValue, Section } from "@/cms/types";
import { cn } from "@/lib/utils";

/**
 * Some sections were designed to sit directly under the previous white
 * section (only bottom padding). They keep that look when they follow a white
 * section, and get full padding when moved elsewhere.
 */
export function bandPadding(tight: boolean, prevWhite: boolean) {
  return tight && prevWhite ? "pb-14 sm:pb-16 lg:pb-20" : "py-14 sm:py-16 lg:py-20";
}

/** Page header (fixed first section on every managed page). */
export function HeroSection({ section, href }: { section: Section; href: string }) {
  const d = section.data as { crumbLabel: string; title: string; description: string; image: ImageValue; badge: { title: string; text: string } };
  const show = visible(section);
  return (
    <PageHero
      title={<Highlight text={d.title} />}
      description={show("description") && d.description ? d.description : undefined}
      crumbs={[{ label: d.crumbLabel || plainText(d.title), href }]}
      image={show("image") && hasImage(d.image) ? { src: d.image.src, alt: d.image.alt, position: d.image.position || undefined } : undefined}
      badge={show("badge") && d.badge?.title ? { title: d.badge.title, text: d.badge.text } : null}
    />
  );
}

/* ───────────────────── Sections administrators can add ───────────────────── */

export function TextBlockSection({ section }: { section: Section }) {
  const show = visible(section);
  const d = section.data as { heading: string; paragraphs: unknown };
  const paras = textsOf(d.paragraphs);
  return (
    <Band>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          {show("heading") && d.heading && (
            <Reveal className="lg:col-span-5">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                <Highlight text={d.heading} />
              </h2>
            </Reveal>
          )}
          <Reveal delay={0.1} className={cn("space-y-5 text-lg leading-relaxed text-ink", show("heading") && d.heading ? "lg:col-span-7" : "lg:col-span-12")}>
            {paras.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>
      </Container>
    </Band>
  );
}

export function CardsSection({ section }: { section: Section }) {
  const show = visible(section);
  const d = section.data as { heading: string; description: string };
  const cards = on<{ icon: string; title: string; text: string }>(section.data.items);
  return (
    <Band tone="muted">
      <Container>
        <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => {
            return (
              <li key={c._id}>
                <Reveal delay={i * 0.06} className="h-full rounded-3xl border border-line bg-white p-7">
                  {show("items.icon") && <CmsIcon icon={c.icon} aria-hidden className="size-7 text-primary" strokeWidth={1.75} />}
                  <h3 className="mt-5 text-lg font-extrabold">{c.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink">{c.text}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Band>
  );
}

export function ChecklistSection({ section }: { section: Section }) {
  const show = visible(section);
  const d = section.data as { heading: string; description: string };
  return (
    <Band>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
          <div className="rounded-3xl border border-line p-7">
            <CheckList items={textsOf(section.data.items)} />
          </div>
        </div>
      </Container>
    </Band>
  );
}

export function QuoteSection({ section, prevWhite }: { section: Section; prevWhite: boolean }) {
  return (
    <section className={cn("bg-white", bandPadding(true, prevWhite))}>
      <Container>
        <Reveal className="rounded-[2rem] border-l-4 border-gold bg-gold-light p-8 sm:p-12">
          <p className="max-w-4xl font-display text-xl leading-relaxed font-semibold text-navy sm:text-2xl">{String(section.data.text ?? "")}</p>
        </Reveal>
      </Container>
    </section>
  );
}

/** Renders an added generic section, or null when `kind` isn't generic. */
export function GenericSection({ section, prevWhite }: { section: Section; prevWhite: boolean }) {
  switch (section.kind) {
    case "textBlock":
      return <TextBlockSection section={section} />;
    case "cards":
      return <CardsSection section={section} />;
    case "checklist":
      return <ChecklistSection section={section} />;
    case "quote":
      return <QuoteSection section={section} prevWhite={prevWhite} />;
    default:
      return null;
  }
}

/** Background tone of each section kind, used to keep spacing right after reordering. */
export const MUTED_KINDS = new Set(["values", "team", "stages", "cards"]);
