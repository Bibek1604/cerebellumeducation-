import Image from "next/image";
import { ArrowRight, CheckCircle2, CalendarCheck, Plane } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CmsIcon } from "@/cms/cms-icon";
import { getSiteSettings, hasImage, on, textsOf, visible } from "@/cms/content";
import type { ImageValue, LinkValue, Section } from "@/cms/types";
import { getDestinations, programmeOptions } from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";
import { intakeOptions } from "@/lib/validations";
import { CounsellingWidget } from "./counselling-widget";

type HeroData = {
  titleLine1: string;
  titleLine2: string;
  description: string;
  chips: unknown;
  primaryButton: LinkValue;
  secondaryButton: LinkValue;
  photo: ImageValue;
  badge: { title: string; text: string };
  bubbles: unknown;
  booking: { title: string; subtitle: string; buttonLabel: string; notes: unknown };
};

/**
 * White hero: the colour lives in the elements — a vivid cap-blue disc behind
 * the student, the logo's orange "C" arc, a plane on a dotted path and
 * floating cards. Content: Admin → Pages → Homepage → Hero & booking box.
 */
export async function HomeHero({ section }: { section: Section }) {
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  const d = section.data as HeroData;
  const show = visible(section);
  const { establishedYear, registrationNo } = (await getSiteSettings()).company;
  const chips = show("chips")
    ? [
        ...textsOf(d.chips),
        // Shown automatically once real certificate details are in Admin → Contact details & company.
        ...(registrationNo ? ["Registered education consultancy"] : []),
        ...(establishedYear ? [`Guiding students since ${establishedYear}`] : []),
      ]
    : [];
  const bubbles = show("bubbles") ? on<{ icon: string; value: string; label: string }>(d.bubbles).filter((b) => b.label).slice(0, 2) : [];
  const bubblePos = ["top-[30%] -left-16 xl:-left-24", "bottom-[24%] -left-12 xl:-left-20"];
  const photo = show("photo") && hasImage(d.photo) ? d.photo : null;
  const btn = (l: LinkValue | undefined) => Boolean(l?.label && l.href);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-white">
        {/* Large, very faint logo emblem behind the headline */}
        <Image
          src="/logos/cerebellum-emblem.png"
          alt=""
          width={242}
          height={242}
          className="pointer-events-none absolute top-1/2 left-[-6rem] -z-10 w-[34rem] -translate-y-1/2 opacity-[0.07] select-none lg:left-[-4rem] 2xl:left-[2%]"
        />
        {/* Very soft colour washes so the white still feels warm */}
        <div aria-hidden className="absolute -top-40 -left-40 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,var(--brand-sky-light),transparent_65%)]" />
        <div aria-hidden className="absolute top-1/3 right-[-12rem] -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--brand-secondary-light),transparent_65%)]" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(26_115_212/0.10)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" />

        <Container>
          <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className={show("booking") ? "pt-12 pb-36 sm:pt-16 lg:pt-20 lg:pb-44" : "pt-12 pb-16 sm:pt-16 lg:py-20"}>
              <h1 className="text-[2.4rem] leading-[1.08] font-extrabold sm:text-5xl xl:text-[3.5rem]">
                {d.titleLine1}
                {d.titleLine2 && (
                  <span className="relative mt-1 block w-fit">
                    <span className="text-brand-gradient">{d.titleLine2}</span>
                    <svg aria-hidden viewBox="0 0 300 14" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-3 w-[60%] text-gold">
                      <path d="M3 10 C 90 2, 200 2, 297 8" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  </span>
                )}
              </h1>
              {show("description") && d.description && <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink">{d.description}</p>}
              {chips.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2.5">
                  {chips.map((c) => (
                    <li key={c} className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1.5 text-sm font-semibold text-navy">
                      <CheckCircle2 aria-hidden className="size-4 text-gold" /> {c}
                    </li>
                  ))}
                </ul>
              )}
              {((show("primaryButton") && btn(d.primaryButton)) || (show("secondaryButton") && btn(d.secondaryButton))) && (
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  {show("primaryButton") && btn(d.primaryButton) && (
                    <ButtonLink href={d.primaryButton.href} size="lg" variant="secondary">
                      {d.primaryButton.label} <ArrowRight aria-hidden className="size-4" />
                    </ButtonLink>
                  )}
                  {show("secondaryButton") && btn(d.secondaryButton) && (
                    <ButtonLink href={d.secondaryButton.href} size="lg" variant="outline">
                      {d.secondaryButton.label}
                    </ButtonLink>
                  )}
                </div>
              )}
            </div>

            {photo && (
              <Reveal y={40} className="relative mx-auto hidden h-[34rem] w-full max-w-md self-end lg:block xl:h-[37rem]">
                {/* Vivid cap-blue disc behind the student */}
                <div aria-hidden className="bg-hero-vivid absolute bottom-[10%] left-1/2 size-[27rem] -translate-x-1/2 rounded-full shadow-[0_40px_80px_-30px_rgb(26_115_212/0.55)] xl:size-[29rem]" />
                <div aria-hidden className="absolute bottom-[10%] left-1/2 size-[27rem] -translate-x-1/2 rounded-full bg-[radial-gradient(rgb(255_255_255/0.22)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(circle_at_70%_25%,black,transparent_65%)] xl:size-[29rem]" />
                {/* The logo's orange "C" arc wrapping the disc */}
                <svg aria-hidden viewBox="0 0 400 400" className="absolute bottom-[4%] left-1/2 size-[31rem] -translate-x-1/2 -rotate-[30deg] xl:size-[33rem]">
                  <circle cx="200" cy="200" r="190" fill="none" stroke="var(--brand-secondary)" strokeWidth="9" strokeLinecap="round" strokeDasharray="640 1200" />
                </svg>
                {/* Plane on a dotted flight path */}
                <svg aria-hidden viewBox="0 0 200 110" className="absolute top-[6%] -left-28 w-44 text-primary/40">
                  <path d="M6 104 C 60 96, 120 64, 186 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="2 8" strokeLinecap="round" />
                </svg>
                <span aria-hidden className="animate-float absolute top-[2%] left-[2%] grid size-11 place-items-center rounded-full bg-white text-gold shadow-lift">
                  <Plane className="size-5" />
                </span>

                {show("logoSeal") && (
                  <div className="animate-float absolute -right-6 bottom-[36%] z-10 grid size-24 place-items-center rounded-full bg-white shadow-lift ring-4 ring-gold/30 [animation-delay:-2.5s] xl:-right-10">
                    <Image src="/logos/cerebellum-emblem.png" alt="Cerebellum Education Network emblem" width={242} height={242} className="w-16" />
                  </div>
                )}
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  width={573}
                  height={820}
                  priority
                  sizes="(min-width: 1024px) 36rem, 1px"
                  className="absolute bottom-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 drop-shadow-[0_24px_30px_rgb(18_58_107/0.25)]"
                  style={{ objectPosition: photo.position || undefined }}
                />

                {bubbles.map((b, i) => (
                  <div
                    key={b._id}
                    className={`animate-float absolute ${bubblePos[i]} flex items-center gap-2.5 rounded-2xl border border-line bg-white px-3.5 py-2.5 text-navy shadow-lift`}
                    style={{ animationDelay: `${-i * 1.8}s` }}
                  >
                    {b.value ? (
                      <span className="font-display text-xl leading-none font-bold text-primary">{b.value}</span>
                    ) : (
                      <span className={`grid size-8 place-items-center rounded-full ${i === 0 ? "bg-primary-light text-primary" : "bg-gold-light text-gold-dark"}`}>
                        <CmsIcon icon={b.icon} aria-hidden className="size-4" />
                      </span>
                    )}
                    <span className="text-sm font-semibold whitespace-nowrap">{b.label}</span>
                  </div>
                ))}
                {show("badge") && d.badge?.title && (
                  <div className="absolute top-[16%] -right-10 rounded-2xl border border-line bg-white p-4 pr-5 shadow-lift xl:-right-20">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
                        <CalendarCheck aria-hidden className="size-5" />
                      </span>
                      <div className="leading-tight">
                        <p className="font-display font-extrabold whitespace-nowrap text-navy">{d.badge.title}</p>
                        {d.badge.text && <p className="text-xs text-ink-soft">{d.badge.text}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* Booking box overlapping the hero edge */}
      {show("booking") && (
        <div className="relative z-10 -mt-24 bg-[linear-gradient(to_bottom,transparent_6rem,var(--brand-muted)_6rem)] lg:-mt-28 lg:bg-[linear-gradient(to_bottom,transparent_7rem,var(--brand-muted)_7rem)]">
          <Container>
            <Reveal delay={0.1}>
              <CounsellingWidget
                title={d.booking?.title}
                subtitle={d.booking?.subtitle}
                buttonLabel={d.booking?.buttonLabel || "Continue"}
                notes={textsOf(d.booking?.notes)}
                programmes={programmeOptions(programmes, destinations)}
                destinations={destinations.map((x) => ({ slug: x.slug, name: x.name }))}
                intakes={intakeOptions}
              />
            </Reveal>
          </Container>
        </div>
      )}
    </>
  );
}
