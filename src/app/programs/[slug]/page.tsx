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
import { programmeIcons } from "@/components/ui/icons";
import { PageHero } from "@/components/sections/page-hero";
import { DestinationCard } from "@/components/destinations/destination-card";
import { UniversityCard, UniversityDisclaimer } from "@/components/universities/university-card";
import { CtaBand } from "@/components/sections/cta-band";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import { destinationsForProgramme, getProgramme, programmes } from "@/data/programmes";
import { universitiesForProgramme } from "@/data/universities";
import { admissionSteps } from "@/data/process";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

/** Programmes covered by MEC eligibility rules for Nepali students. */
const MEDICAL_DEGREES = ["mbbs", "md", "dentistry"];

export function generateStaticParams() {
  return programmes.map((p) => ({ slug: p.slug }));
}

/**
 * Every slug is prerendered via generateStaticParams, so reading `params`
 * at the top of the page is intentional. Opt out of instant-navigation
 * validation instead of streaming the whole page behind <Suspense>.
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) return {};
  return pageMetadata({
    title: `Study ${p.name} Abroad`,
    description: p.seoDescription,
    path: `/programs/${p.slug}`,
  });
}

export default async function ProgrammePage({ params }: PageProps<"/programs/[slug]">) {
  const { slug } = await params;
  const p = getProgramme(slug);
  if (!p) notFound();

  const Icon = programmeIcons[p.icon];
  const dests = destinationsForProgramme(p.slug);
  const unis = universitiesForProgramme(p.slug);
  const counsellingHref = `/book-counselling?programme=${p.slug}`;

  return (
    <>
      <JsonLd data={faqJsonLd(p.faqs)} />
      <PageHero
        title={p.name}
        description={p.intro}
        crumbs={[{ label: "Programmes", href: "/programs" }, { label: p.shortName, href: `/programs/${p.slug}` }]}
        aside={
          <div className="relative overflow-hidden rounded-[2rem] bg-navy p-8 text-white/75 shadow-lift">
            <span className="grid size-16 place-items-center rounded-2xl bg-gold text-navy">
              <Icon aria-hidden className="size-8" strokeWidth={1.75} />
            </span>
            <dl className="mt-8 space-y-5">
              <div>
                <dt className="flex items-center gap-2 text-xs font-bold tracking-wider text-gold uppercase">
                  <Clock aria-hidden className="size-4" /> Typical duration
                </dt>
                <dd className="mt-1.5 font-semibold text-white">{p.duration}</dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wider text-gold uppercase">Available in</dt>
                <dd className="mt-1.5 font-semibold text-white">
                  {dests.length > 0 ? dests.map((d) => d.name).join(", ") : "Ask a counsellor about current options"}
                </dd>
              </div>
            </dl>
            <ButtonLink href={counsellingHref} variant="secondary" className="mt-8 w-full">
              Ask about {p.shortName} <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </div>
        }
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <Reveal>
              <SectionHeading title={`What studying ${p.shortName} involves`} />
              <div className="mt-6 space-y-5 text-lg leading-relaxed text-ink">
                {p.overview.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.1} className="rounded-3xl bg-gold-light p-7">
              <h2 className="flex items-center gap-2 text-lg font-extrabold">
                <TriangleAlert aria-hidden className="size-5 text-gold-dark" /> Important considerations
              </h2>
              <CheckList items={p.considerations} className="mt-5" />
            </Reveal>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <Reveal className="rounded-3xl border border-line p-7">
              <h2 className="text-xl font-extrabold">Eligibility</h2>
              <CheckList items={p.eligibility} className="mt-5" />
            </Reveal>
            <Reveal delay={0.08} className="rounded-3xl border border-line p-7">
              <h2 className="text-xl font-extrabold">Academic requirements</h2>
              <CheckList items={p.academic} className="mt-5" />
            </Reveal>
          </div>
          <p className="mt-5 text-sm text-ink-soft">
            Exact requirements are set by each university and may be affected by your home-country regulator&apos;s rules.
          </p>
        </Container>
      </Section>

      {dests.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading title={`Where you can study ${p.shortName}`} />
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

      {unis.length > 0 && (
        <Section>
          <Container>
            <SectionHeading title={`Universities offering ${p.shortName}`} />
            <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {unis.map((u) => (
                <li key={u.slug}>
                  <UniversityCard university={u} />
                </li>
              ))}
            </ul>
            <UniversityDisclaimer className="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft" />
          </Container>
        </Section>
      )}

      {MEDICAL_DEGREES.includes(p.slug) && (
        <section className="bg-white pb-20 sm:pb-24">
          <Container>
            <BeforeYouApply />
          </Container>
        </section>
      )}

      <Section tone={unis.length > 0 ? "muted" : "white"}>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading title="From first conversation to campus" />
              <ol className="mt-8 grid gap-3 sm:grid-cols-2">
                {admissionSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl border border-line bg-white p-4">
                    <span className="font-display text-sm font-extrabold text-primary tabular-nums">{pad2(i + 1)}</span>
                    <span className="font-semibold text-navy">{s.title}</span>
                  </li>
                ))}
              </ol>
              <Link href="/admission-process" className="mt-6 inline-flex items-center gap-1.5 font-bold text-primary">
                Read the full admission guide <ArrowRight aria-hidden className="size-4" />
              </Link>
            </div>
            <div>
              <SectionHeading title={`${p.shortName} questions`} />
              <Accordion items={p.faqs} className="mt-8" />
            </div>
          </div>
        </Container>
      </Section>

      <div className="pt-20 sm:pt-24 lg:pt-28">
        <CtaBand
          title={`Ready to explore ${p.shortName} abroad?`}
          description="Book a free session to check your eligibility and compare destinations for this programme."
          primary={{ label: "Book Free Counselling", href: counsellingHref }}
        />
      </div>
    </>
  );
}
