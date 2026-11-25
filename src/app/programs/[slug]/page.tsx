import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, TriangleAlert } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { CheckList } from "@/components/ui/check-list";
import { Accordion } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/ui/section-heading";
import { JsonLd } from "@/components/ui/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { PageHero } from "@/components/sections/page-hero";
import { DestinationCard } from "@/components/destinations/destination-card";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import { CmsIcon } from "@/cms/cms-icon";
import { getSteps } from "@/cms/content";
import { destinationsOffering, getDestinations } from "@/cms/destinations";
import { getProgrammeBySlug, getProgrammeTemplate, getProgrammes, withProgramme } from "@/cms/programmes";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getProgrammes()).map((p) => ({ slug: p.slug }));
}

/**
 * Every slug is prerendered via generateStaticParams, so reading `params`
 * at the top of the page is intentional. Opt out of instant-navigation
 * validation instead of streaming the whole page behind <Suspense>.
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const p = await getProgrammeBySlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: p.seoTitle,
    description: p.seoDescription,
    path: `/programs/${p.slug}`,
  });
}

/** Content: Admin → Programme list (this programme) and Admin → Programme page layout (shared headings). */
export default async function ProgrammePage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const p = await getProgrammeBySlug(slug);
  if (!p) notFound();
  const [admissionSteps, destinations, { t, show }] = await Promise.all([getSteps(), getDestinations(), getProgrammeTemplate()]);
  const c = (v: unknown) => withProgramme(v, p.shortName);
  const card = t.card ?? {};

  const dests = destinationsOffering(destinations, p.slug);
  const counsellingHref = `/book-counselling?programme=${p.slug}`;
  const showConsiderations = show("considerations") && p.considerations.length > 0;
  const showRequirements = show("requirements") && p.eligibility.length + p.academic.length > 0;
  const showJourney = show("journey") && admissionSteps.length > 0;
  const showFaqs = show("faqs") && p.faqs.length > 0;

  return (
    <>
      {showFaqs && <JsonLd data={faqJsonLd(p.faqs)} />}
      <PageHero
        title={
          <>
            <span className="text-brand-gradient">{p.name}</span> for Nepali students
          </>
        }
        description={p.intro || undefined}
        crumbs={[{ label: "Programmes", href: "/programs" }, { label: p.shortName, href: `/programs/${p.slug}` }]}
        aside={
          <div className="bg-hero-vivid relative overflow-hidden rounded-[2rem] p-8 text-white/85 shadow-lift">
            <span className="grid size-16 place-items-center rounded-2xl bg-orange-fill text-white">
              <CmsIcon icon={p.icon} aria-hidden className="size-8" strokeWidth={1.75} />
            </span>
            <dl className="mt-8 space-y-5">
              {p.duration && (
                <div>
                  <dt className="flex items-center gap-2 text-xs font-bold tracking-wider text-gold uppercase">
                    <Clock aria-hidden className="size-4" /> {c(card.durationLabel)}
                  </dt>
                  <dd className="mt-1.5 font-semibold text-white">{p.duration}</dd>
                </div>
              )}
              {show("card.availableLabel") && (
                <div>
                  <dt className="text-xs font-bold tracking-wider text-gold uppercase">{c(card.availableLabel)}</dt>
                  <dd className="mt-1.5 font-semibold text-white">{dests.length > 0 ? dests.map((d) => d.name).join(", ") : c(card.availableEmpty)}</dd>
                </div>
              )}
            </dl>
            <ButtonLink href={counsellingHref} variant="secondary" className="mt-8 w-full">
              {c(card.buttonLabel) || `Ask about ${p.shortName}`} <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        }
      />

      {(p.overview.length > 0 || showConsiderations || showRequirements) && (
        <Section>
          <Container>
            {(p.overview.length > 0 || showConsiderations) && (
              <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
                <Reveal>
                  {p.overview.length > 0 && (
                    <>
                      <SectionHeading title={c(t.overviewHeading)} />
                      <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink">
                        {p.overview.map((para) => (
                          <p key={para}>{para}</p>
                        ))}
                      </div>
                    </>
                  )}
                </Reveal>
                {showConsiderations && (
                  <Reveal delay={0.1} className="rounded-3xl bg-gold-light p-7">
                    <h2 className="flex items-center gap-2 text-lg font-extrabold">
                      <TriangleAlert aria-hidden className="size-5 text-gold-dark" /> {c(t.considerations?.heading)}
                    </h2>
                    <CheckList items={p.considerations} className="mt-5" />
                  </Reveal>
                )}
              </div>
            )}

            {showRequirements && (
              <>
                <div className="mt-16 grid gap-6 md:grid-cols-2">
                  {p.eligibility.length > 0 && (
                    <Reveal className="rounded-3xl border border-line p-7">
                      <h2 className="text-xl font-extrabold">{c(t.requirements?.eligibilityHeading)}</h2>
                      <CheckList items={p.eligibility} className="mt-5" />
                    </Reveal>
                  )}
                  {p.academic.length > 0 && (
                    <Reveal delay={0.08} className="rounded-3xl border border-line p-7">
                      <h2 className="text-xl font-extrabold">{c(t.requirements?.academicHeading)}</h2>
                      <CheckList items={p.academic} className="mt-5" />
                    </Reveal>
                  )}
                </div>
                {show("requirements.note") && t.requirements?.note && <p className="mt-5 text-sm text-ink-soft">{c(t.requirements.note)}</p>}
              </>
            )}
          </Container>
        </Section>
      )}

      {show("destinations") && dests.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading title={c(t.destinations?.heading)} />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dests.map((d) => (
                <li key={d.slug}>
                  <DestinationCard destination={d} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {show("nepal") && p.showNepalRules && (
        <section className="bg-white pb-20 sm:pb-24">
          <Container>
            <BeforeYouApply />
          </Container>
        </section>
      )}

      {(showJourney || showFaqs) && (
        <Section tone="white">
          <Container>
            <div className={showJourney && showFaqs ? "grid gap-12 lg:grid-cols-2 lg:gap-16" : "max-w-3xl"}>
              {showJourney && (
                <div>
                  <SectionHeading title={c(t.journey?.heading)} />
                  <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                    {admissionSteps.map((s, i) => (
                      <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-white p-4">
                        <span className="font-sans text-sm font-extrabold text-primary tabular-nums">{pad2(i + 1)}</span>
                        <span className="font-semibold text-navy">{s.title}</span>
                      </li>
                    ))}
                  </ol>
                  {show("journey.link") && t.journey?.link?.label && t.journey.link.href && (
                    <Link href={t.journey.link.href} className="mt-6 inline-flex items-center gap-1.5 font-bold text-primary">
                      {c(t.journey.link.label)} <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  )}
                </div>
              )}
              {showFaqs && (
                <div>
                  <SectionHeading title={c(t.faqs?.heading)} />
                  <Accordion items={p.faqs} className="mt-8" />
                </div>
              )}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
