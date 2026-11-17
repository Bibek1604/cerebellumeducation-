import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BookOpenCheck, Clock, Info, Languages, Scale, Wallet } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckList } from "@/components/ui/check-list";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { DestinationArt } from "@/components/destinations/destination-art";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { UniversityCard, UniversityDisclaimer } from "@/components/universities/university-card";
import { OfficialSources } from "@/components/sections/official-sources";
import { CtaBand } from "@/components/sections/cta-band";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import { destinations, getDestination } from "@/data/destinations";
import { getProgramme } from "@/data/programmes";
import { universitiesForDestination } from "@/data/universities";
import { admissionSteps } from "@/data/process";
import { homeRegulators } from "@/data/sources";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}


/**
 * Every slug is prerendered via generateStaticParams, so reading `params`
 * at the top of the page is intentional. Opt out of instant-navigation
 * validation instead of streaming the whole page behind <Suspense>.
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) return {};
  return pageMetadata({
    title: `Study Medicine in ${d.name}: ${d.programmes.map((p) => getProgramme(p)?.shortName).filter(Boolean).join(", ")}`,
    description: d.seoDescription,
    path: `/destinations/${d.slug}`,
  });
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "programmes", label: "Programmes" },
  { id: "universities", label: "Universities" },
  { id: "eligibility", label: "Eligibility" },
  { id: "admission", label: "Admission process" },
  { id: "costs", label: "Costs" },
  { id: "nepal", label: "Nepal requirements" },
  { id: "recognition", label: "Recognition & licensing" },
  { id: "faqs", label: "FAQs" },
];

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-28 border-t border-line pt-14 first:border-t-0 first:pt-0">
      <h2 id={`${id}-title`} className="text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default async function DestinationPage({ params }: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = getDestination(slug);
  if (!d) notFound();

  const progs = d.programmes.map(getProgramme).filter((p) => p !== undefined);
  const unis = universitiesForDestination(d.slug);
  const counsellingHref = `/book-counselling?country=${d.slug}`;

  return (
    <>
      <JsonLd data={faqJsonLd(d.faqs)} />

      {/* Hero */}
      <section className="bg-brand-gradient-soft relative isolate overflow-hidden border-b border-line">
        <div aria-hidden className="bg-dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <Container className="py-12 sm:py-16 lg:py-20">
          <Breadcrumbs items={[{ label: "Study Destinations", href: "/destinations" }, { label: d.name, href: `/destinations/${d.slug}` }]} />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-4xl leading-[1.06] font-extrabold sm:text-5xl lg:text-[3.6rem]">
                Study Medicine in <span className="text-primary">{d.name}</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">{d.summary}</p>
              <dl className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft">
                  <Clock aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">Duration</dt>
                    <dd className="mt-1 text-sm font-semibold text-navy">{d.duration}</dd>
                  </div>
                </div>
                <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft">
                  <Languages aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">Instruction</dt>
                    <dd className="mt-1 text-sm font-semibold text-navy">{d.medium}</dd>
                  </div>
                </div>
              </dl>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={counsellingHref} size="lg">
                  Get advice on {d.name} <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
                <ButtonLink href="/destinations" size="lg" variant="outline">
                  Compare destinations
                </ButtonLink>
              </div>
            </div>
            <div>
              <DestinationArt destination={d} size="hero" priority className="aspect-[4/3.4] rounded-[2.5rem] shadow-lift" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              <p className="text-xs font-bold tracking-[0.16em] text-ink-soft uppercase">On this page</p>
              <ul className="mt-4 space-y-1 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium text-ink hover:border-primary hover:text-primary">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 space-y-14">
            <Block id="overview" title={`Medical education in ${d.name}`}>
              <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-ink">
                {d.overview.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Block>

            <Block id="programmes" title="Available medical programmes">
              <ul className="grid gap-5 sm:grid-cols-2">
                {progs.map((p) => (
                  <li key={p.slug}>
                    <ProgrammeCard programme={p} />
                  </li>
                ))}
              </ul>
            </Block>

            <Block id="universities" title={`Universities in ${d.name}`}>
              {unis.length > 0 ? (
                <>
                  <ul className="grid gap-5 sm:grid-cols-2">
                    {unis.map((u) => (
                      <li key={u.slug}>
                        <UniversityCard university={u} />
                      </li>
                    ))}
                  </ul>
                  <UniversityDisclaimer className="mt-6 text-sm leading-relaxed text-ink-soft" />
                </>
              ) : (
                <p className="max-w-2xl rounded-2xl bg-muted p-6 leading-relaxed text-ink">
                  We&apos;re preparing our university list for {d.name}. A counsellor can talk you through current options.{" "}
                  <Link href={counsellingHref} className="font-semibold text-primary underline underline-offset-4">
                    Ask about universities in {d.name}
                  </Link>
                  .
                </p>
              )}
            </Block>

            <Block id="eligibility" title="Eligibility, academics and language">
              <div className="grid gap-5 xl:grid-cols-3">
                {[
                  { icon: BookOpenCheck, title: "General eligibility", items: d.eligibility },
                  { icon: Scale, title: "Academic qualifications", items: d.academic },
                  { icon: Languages, title: "Language requirements", items: d.language },
                ].map((g) => (
                  <div key={g.title} className="rounded-3xl border border-line bg-white p-6">
                    <g.icon aria-hidden className="size-6 text-primary" />
                    <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
                    <CheckList items={g.items} className="mt-4 text-[0.95rem]" />
                  </div>
                ))}
              </div>
              <p className="mt-5 flex gap-2 text-sm text-ink-soft">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                Requirements are set by each university and can change between intakes. Your home regulator may add its own conditions.
              </p>
            </Block>

            <Block id="admission" title={`How admission to ${d.name} works`}>
              <ol className="grid gap-3 sm:grid-cols-2">
                {admissionSteps.map((s, i) => (
                  <li key={s.title} className="flex gap-4 rounded-2xl bg-muted p-4">
                    <span className="font-display text-sm font-extrabold text-primary tabular-nums">{pad2(i + 1)}</span>
                    <span className="font-semibold text-navy">{s.title}</span>
                  </li>
                ))}
              </ol>
              <h3 className="mt-8 text-lg font-bold">Specific to {d.name}</h3>
              <CheckList items={d.admissionNotes} className="mt-4" />
            </Block>

            <Block id="costs" title="Tuition fees and living expenses">
              {d.indicativeCosts ? (
                <div className="max-w-3xl">
                  <div className="overflow-x-auto rounded-3xl border border-line">
                    <table className="w-full text-left text-[0.95rem]">
                      <caption className="sr-only">Indicative costs in {d.name}</caption>
                      <thead className="bg-muted text-navy">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-display font-bold">Item</th>
                          <th scope="col" className="px-5 py-3 font-display font-bold">Indicative amount ({d.indicativeCosts.currency})</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line">
                        {[
                          ["Tuition (per year)", d.indicativeCosts.tuitionPerYear],
                          ["Hostel (per year)", d.indicativeCosts.hostelPerYear],
                          ["Living expenses (per month)", d.indicativeCosts.livingPerMonth],
                        ]
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <tr key={k}>
                              <th scope="row" className="px-5 py-3 font-semibold text-navy">{k}</th>
                              <td className="px-5 py-3 text-ink">{v}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">
                    Source: {d.indicativeCosts.source}. Verified {d.indicativeCosts.lastVerified}. Figures vary by university and
                    change each year. {d.indicativeCosts.notes}
                  </p>
                </div>
              ) : (
                <div className="flex max-w-3xl gap-4 rounded-3xl bg-gold-light p-6">
                  <Wallet aria-hidden className="mt-0.5 size-6 shrink-0 text-gold-dark" />
                  <div>
                    <p className="font-semibold text-navy">Costs vary by university, city and intake.</p>
                    <p className="mt-2 leading-relaxed text-ink">
                      Rather than publish estimates that may be out of date, we share current, university-confirmed tuition and
                      living-cost figures during counselling, including hostel, insurance, visa and travel.
                    </p>
                    <Link href={counsellingHref} className="mt-3 inline-block font-bold text-primary underline underline-offset-4">
                      Request current figures for {d.name}
                    </Link>
                  </div>
                </div>
              )}
            </Block>

            <div id="nepal" className="scroll-mt-28 border-t border-line pt-14">
              <BeforeYouApply />
            </div>

            <Block id="recognition" title="Degree recognition and licensing">
              <CheckList items={d.recognition} className="max-w-3xl" />
              <div className="mt-6 max-w-3xl rounded-2xl border-l-4 border-gold bg-muted p-5 text-[0.95rem] leading-relaxed text-ink">
                <strong className="text-navy">Important:</strong> no university or consultancy can guarantee a medical licence or
                employment. Check your home regulator&apos;s current rules for foreign medical graduates before you apply.
              </div>
              <div className="mt-8 space-y-8">
                <OfficialSources sources={d.sources} />
                <OfficialSources sources={homeRegulators} title="Examples of home-country regulators" />
              </div>
            </Block>

            <Block id="faqs" title={`Studying medicine in ${d.name}: common questions`}>
              <Accordion items={d.faqs} />
            </Block>
          </div>
        </div>
      </Container>

      <CtaBand
        title={`Thinking about ${d.name}?`}
        description="Talk it through with a counsellor. We'll check your eligibility and explain your options honestly."
        primary={{ label: "Book Free Counselling", href: counsellingHref }}
      />
    </>
  );
}
