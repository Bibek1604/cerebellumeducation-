import Image from "next/image";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CmsIcon } from "@/cms/cms-icon";
import { Highlight } from "@/cms/highlight";
import { hasImage, on, textsOf, visible } from "@/cms/content";
import type { ImageValue, LinkValue, Section as CmsSection } from "@/cms/types";

type WhyData = {
  heading: string;
  description: string;
  services: unknown;
  primaryButton: LinkValue;
  secondaryButton: LinkValue;
  cards: unknown;
};

/** "Why us": sticky text on the left, photo cards stacking on the right. Content: Admin → Pages → Homepage → Why Cerebellum. */
export function WhyCerebellum({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as WhyData;
  const show = visible(section);
  const services = show("services") ? textsOf(d.services) : [];
  const cards = on<{ image: ImageValue; icon: string; title: string; text: string }>(d.cards).filter((c) => hasImage(c.image));
  const ok = (l: LinkValue | undefined) => Boolean(l?.label && l.href);

  return (
    <Section tone={tone}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
              {services.length > 0 && (
                <ul className="mt-7 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {services.map((s) => (
                    <li key={s} className="flex gap-2 text-[0.95rem] font-medium text-navy">
                      <Check aria-hidden className="mt-1 size-4 shrink-0 text-gold" strokeWidth={3} />
                      {s}
                    </li>
                  ))}
                </ul>
              )}
              {((show("primaryButton") && ok(d.primaryButton)) || (show("secondaryButton") && ok(d.secondaryButton))) && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {show("primaryButton") && ok(d.primaryButton) && (
                    <ButtonLink href={d.primaryButton.href} variant="secondary">
                      {d.primaryButton.label} <ArrowRight aria-hidden className="size-4" />
                    </ButtonLink>
                  )}
                  {show("secondaryButton") && ok(d.secondaryButton) && (
                    <ButtonLink href={d.secondaryButton.href} variant="outline">
                      {d.secondaryButton.label}
                    </ButtonLink>
                  )}
                </div>
              )}
            </Reveal>
          </div>

          <ul className="space-y-8">
            {cards.map((c, i) => (
              <li key={c._id} className="lg:sticky" style={{ top: `${7 + i * 1.5}rem` }}>
                <article className="rounded-3xl bg-primary-light p-2.5 shadow-soft">
                  <div className="relative overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={c.image.src}
                      alt={c.image.alt}
                      width={1600}
                      height={1200}
                      unoptimized={c.image.src.startsWith("/media/")}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="aspect-[16/10] w-full object-cover"
                      style={{ objectPosition: c.image.position || undefined }}
                    />
                    <div className="absolute right-4 bottom-4 left-4 flex items-start gap-3 rounded-2xl bg-white/95 p-4 shadow-lift backdrop-blur sm:right-6 sm:bottom-6 sm:left-6">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
                        <CmsIcon icon={c.icon} aria-hidden className="size-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-bold">{c.title}</h3>
                        <p className="mt-0.5 text-sm leading-relaxed text-ink">{c.text}</p>
                      </div>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
