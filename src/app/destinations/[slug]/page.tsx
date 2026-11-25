import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  BookOpenCheck,
  Clock,
  Info,
  Languages,
  Scale,
  Wallet,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { CheckList } from "@/components/ui/check-list";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { DestinationArt } from "@/components/destinations/destination-art";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { OfficialSources } from "@/components/sections/official-sources";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import {
  getDestinationBySlug,
  getDestinationTemplate,
  getDestinations,
  withCountry,
} from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";
import { getSteps } from "@/cms/content";
import { homeRegulators } from "@/data/sources";
import { faqJsonLd, pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export async function generateStaticParams() {
  return (await getDestinations()).map((d) => ({ slug: d.slug }));
}

/**
 * Every slug is prerendered via generateStaticParams, so reading `params`
 * at the top of the page is intentional. Opt out of instant-navigation
 * validation instead of streaming the whole page behind <Suspense>.
 */
export const instant = false;

export async function generateMetadata({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) return {};
  return pageMetadata({
    title: d.seoTitle,
    description: d.seoDescription,
    path: `/destinations/${d.slug}`,
  });
}

const blocks = [
  { id: "overview", label: "Overview" },
  { id: "programmes", label: "Programmes" },
  { id: "eligibility", label: "Eligibility" },
  { id: "admission", label: "Admission process" },
  { id: "costs", label: "Costs" },
  { id: "nepal", label: "Nepal requirements" },
  { id: "recognition", label: "Recognition & licensing" },
  { id: "faqs", label: "FAQs" },
];

function Block({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 border-t border-line pt-14 first:border-t-0 first:pt-0"
    >
      <h2 id={`${id}-title`} className="text-2xl font-extrabold sm:text-3xl">
        {title}
      </h2>
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default async function DestinationPage({
  params,
}: PageProps<"/destinations/[slug]">) {
  const { slug } = await params;
  const d = await getDestinationBySlug(slug);
  if (!d) notFound();
  const [admissionSteps, { t, show }] = await Promise.all([
    getSteps(),
    getDestinationTemplate(),
  ]);
  const c = (v: unknown) => withCountry(v, d.name);
  const hero = t.hero ?? {};

  // A block shows when it is ticked on in Admin → Country page layout and has something to show.
  const hasContent: Record<string, boolean> = {
    overview: d.overview.length > 0,
    programmes: d.programmes.length > 0,
    eligibility:
      d.eligibility.length + d.academic.length + d.language.length > 0,
    admission: admissionSteps.length + d.admissionNotes.length > 0,
    costs: true,
    nepal: true,
    recognition:
      d.recognition.length + d.sources.length > 0 ||
      show("recognition.important") ||
      show("recognition.regulatorsTitle"),
    faqs: d.faqs.length > 0,
  };
  const sections = blocks.filter((b) => show(b.id) && hasContent[b.id]);
  const on = (id: string) => sections.some((b) => b.id === id);

  const allProgs = await getProgrammes();
  const progs = d.programmes.map((s) => allProgs.find((p) => p.slug === s)).filter((p) => p !== undefined);
  const counsellingHref = `/book-counselling?country=${d.slug}`;

  return (
    <>
      {on("faqs") && <JsonLd data={faqJsonLd(d.faqs)} />}

      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-line bg-white">
        <Image
          src="/logos/cerebellum-emblem.png"
          alt=""
          width={242}
          height={242}
          className="pointer-events-none absolute top-1/2 left-[-7rem] -z-10 w-[30rem] -translate-y-1/2 opacity-[0.06] select-none 2xl:left-[2%]"
        />
        <div
          aria-hidden
          className="absolute -top-40 -left-40 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--brand-sky-light),transparent_65%)]"
        />
        <div
          aria-hidden
          className="absolute top-1/4 right-[-12rem] -z-10 size-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-secondary-light),transparent_65%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(26_115_212/0.09)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]"
        />
        <Container className="py-12 sm:py-16 lg:py-20">
          <Breadcrumbs
            items={[
              { label: "Study Destinations", href: "/destinations" },
              { label: d.name, href: `/destinations/${d.slug}` },
            ]}
          />
          <div className="mt-10 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <h1 className="text-4xl leading-[1.06] font-extrabold sm:text-5xl lg:text-[3.6rem]">
                {hero.titlePrefix ? `${c(hero.titlePrefix)} ` : null}
                <span className="text-brand-gradient">{d.name}</span>
              </h1>
              <span
                aria-hidden
                className="mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-gold to-accent"
              />
              {d.summary && (
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink">
                  {d.summary}
                </p>
              )}
              <dl className="mt-8 grid max-w-xl gap-4 sm:grid-cols-2">
                {show("hero.durationLabel") && d.duration && (
                  <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <Clock
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-primary"
                    />
                    <div>
                      <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">
                        {hero.durationLabel}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-navy">
                        {d.duration}
                      </dd>
                    </div>
                  </div>
                )}
                {show("hero.mediumLabel") && d.medium && (
                  <div className="flex gap-3 rounded-2xl bg-white p-4 shadow-soft">
                    <Languages
                      aria-hidden
                      className="mt-0.5 size-5 shrink-0 text-primary"
                    />
                    <div>
                      <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">
                        {hero.mediumLabel}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-navy">
                        {d.medium}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href={counsellingHref}
                  size="lg"
                  variant="secondary"
                >
                  {c(hero.primaryLabel) || `Get advice on ${d.name}`}{" "}
                  <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
                {show("hero.secondaryButton") &&
                  hero.secondaryButton?.label &&
                  hero.secondaryButton.href && (
                    <ButtonLink
                      href={hero.secondaryButton.href}
                      size="lg"
                      variant="outline"
                    >
                      {c(hero.secondaryButton.label)}
                    </ButtonLink>
                  )}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              {/* Photo framed with the orange and blue corner brackets, plus the logo seal */}
              <span
                aria-hidden
                className="absolute -top-4 -left-4 h-2/3 w-2/3 rounded-tl-[2rem] border-t-4 border-l-4 border-gold"
              />
              <span
                aria-hidden
                className="absolute -right-4 -bottom-4 h-2/3 w-2/3 rounded-br-[2rem] border-r-4 border-b-4 border-primary"
              />
              <DestinationArt
                destination={d}
                size="hero"
                priority
                className="relative aspect-[4/3.4] rounded-[2rem] shadow-lift"
              />
              <div className="animate-float absolute -bottom-6 -left-6 grid size-20 place-items-center rounded-full bg-white shadow-lift ring-4 ring-gold/30">
                <Image
                  src="/logos/cerebellum-emblem.png"
                  alt="Cerebellum Education Network emblem"
                  width={242}
                  height={242}
                  className="w-14"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[14rem_1fr] lg:gap-16">
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28">
              {show("navLabel") && t.navLabel && (
                <p className="text-xs font-bold tracking-[0.16em] text-ink-soft uppercase">
                  {t.navLabel}
                </p>
              )}
              <ul className="mt-4 space-y-1 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l-2 border-transparent py-1.5 pl-4 text-sm font-medium text-ink hover:border-primary hover:text-primary"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="min-w-0 space-y-14">
            {on("overview") && (
              <Block id="overview" title={c(t.overview?.heading)}>
                <div className="max-w-3xl space-y-5 text-lg leading-relaxed text-ink">
                  {d.overview.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Block>
            )}

            {on("programmes") && (
              <Block id="programmes" title={c(t.programmes?.heading)}>
                <ul className="grid gap-5 sm:grid-cols-2">
                  {progs.map((p) => (
                    <li key={p.slug}>
                      <ProgrammeCard programme={p} />
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {on("eligibility") && (
              <Block id="eligibility" title={c(t.eligibility?.heading)}>
                <div className="grid gap-5 xl:grid-cols-3">
                  {[
                    {
                      icon: BookOpenCheck,
                      title: c(t.eligibility?.generalTitle),
                      items: d.eligibility,
                    },
                    {
                      icon: Scale,
                      title: c(t.eligibility?.academicTitle),
                      items: d.academic,
                    },
                    {
                      icon: Languages,
                      title: c(t.eligibility?.languageTitle),
                      items: d.language,
                    },
                  ]
                    .filter((g) => g.items.length > 0)
                    .map((g) => (
                      <div
                        key={g.title}
                        className="rounded-3xl border border-line bg-white p-6"
                      >
                        <g.icon aria-hidden className="size-6 text-primary" />
                        <h3 className="mt-4 text-lg font-bold">{g.title}</h3>
                        <CheckList
                          items={g.items}
                          className="mt-4 text-[0.95rem]"
                        />
                      </div>
                    ))}
                </div>
                {show("eligibility.note") && t.eligibility?.note && (
                  <p className="mt-5 flex gap-2 text-sm text-ink-soft">
                    <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {c(t.eligibility.note)}
                  </p>
                )}
              </Block>
            )}

            {on("admission") && (
              <Block id="admission" title={c(t.admission?.heading)}>
                <ol className="grid gap-3 sm:grid-cols-2">
                  {admissionSteps.map((s, i) => (
                    <li
                      key={s.title}
                      className="flex gap-4 rounded-2xl bg-muted p-4"
                    >
                      <span className="font-sans text-sm font-extrabold text-primary tabular-nums">
                        {pad2(i + 1)}
                      </span>
                      <span className="font-semibold text-navy">{s.title}</span>
                    </li>
                  ))}
                </ol>
                {d.admissionNotes.length > 0 && (
                  <>
                    <h3 className="mt-8 text-lg font-bold">
                      {c(t.admission?.specificHeading)}
                    </h3>
                    <CheckList items={d.admissionNotes} className="mt-4" />
                  </>
                )}
              </Block>
            )}

            {on("costs") && (
              <Block id="costs" title={c(t.costs?.heading)}>
                {d.indicativeCosts ? (
                  <div className="max-w-3xl">
                    <div className="overflow-x-auto rounded-3xl border border-line">
                      <table className="w-full text-left text-[0.95rem]">
                        <caption className="sr-only">
                          Indicative costs in {d.name}
                        </caption>
                        <thead className="bg-muted text-navy">
                          <tr>
                            <th
                              scope="col"
                              className="px-5 py-3 font-sans font-bold"
                            >
                              Item
                            </th>
                            <th
                              scope="col"
                              className="px-5 py-3 font-sans font-bold"
                            >
                              Indicative amount ({d.indicativeCosts.currency})
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {[
                            [
                              "Tuition (per year)",
                              d.indicativeCosts.tuitionPerYear,
                            ],
                            [
                              "Hostel (per year)",
                              d.indicativeCosts.hostelPerYear,
                            ],
                            [
                              "Living expenses (per month)",
                              d.indicativeCosts.livingPerMonth,
                            ],
                          ]
                            .filter(([, v]) => v)
                            .map(([k, v]) => (
                              <tr key={k}>
                                <th
                                  scope="row"
                                  className="px-5 py-3 font-semibold text-navy"
                                >
                                  {k}
                                </th>
                                <td className="px-5 py-3 text-ink">{v}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-sm text-ink-soft">
                      Source: {d.indicativeCosts.source}.
                      {d.indicativeCosts.lastVerified &&
                        ` Verified ${d.indicativeCosts.lastVerified}.`}{" "}
                      Figures vary by university and change each year.{" "}
                      {d.indicativeCosts.notes}
                    </p>
                  </div>
                ) : (
                  <div className="flex max-w-3xl gap-4 rounded-3xl bg-gold-light p-6">
                    <Wallet
                      aria-hidden
                      className="mt-0.5 size-6 shrink-0 text-gold-dark"
                    />
                    <div>
                      <p className="font-semibold text-navy">
                        {c(t.costs?.emptyTitle)}
                      </p>
                      {t.costs?.emptyText && (
                        <p className="mt-2 leading-relaxed text-ink">
                          {c(t.costs.emptyText)}
                        </p>
                      )}
                      {t.costs?.emptyLink && (
                        <Link
                          href={counsellingHref}
                          className="mt-3 inline-block font-bold text-primary underline underline-offset-4"
                        >
                          {c(t.costs.emptyLink)}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </Block>
            )}

            {on("nepal") && (
              <div
                id="nepal"
                className="scroll-mt-28 border-t border-line pt-14"
              >
                <BeforeYouApply />
              </div>
            )}

            {on("recognition") && (
              <Block id="recognition" title={c(t.recognition?.heading)}>
                {d.recognition.length > 0 && (
                  <CheckList items={d.recognition} className="max-w-3xl" />
                )}
                {show("recognition.important") && t.recognition?.important && (
                  <div className="mt-6 max-w-3xl rounded-2xl border-l-4 border-gold bg-muted p-5 text-[0.95rem] leading-relaxed text-ink">
                    <strong className="text-navy">Important:</strong>{" "}
                    {c(t.recognition.important)}
                  </div>
                )}
                <div className="mt-8 space-y-8">
                  {d.sources.length > 0 && (
                    <OfficialSources sources={d.sources} />
                  )}
                  {show("recognition.regulatorsTitle") && (
                    <OfficialSources
                      sources={homeRegulators}
                      title={c(t.recognition?.regulatorsTitle)}
                    />
                  )}
                </div>
              </Block>
            )}

            {on("faqs") && (
              <Block id="faqs" title={c(t.faqs?.heading)}>
                <Accordion items={d.faqs} />
              </Block>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
