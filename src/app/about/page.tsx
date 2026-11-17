import { Compass, Eye, HandHeart, Lightbulb, Scale, ShieldCheck, Target, Users } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { FoliaArcs } from "@/components/brand/folia";
import { CtaBand } from "@/components/sections/cta-band";
import Image from "next/image";
import { hasCompanyDetails, siteConfig } from "@/config/site";
import { team } from "@/data/team";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Cerebellum Education Network is an international medical education consultancy offering honest, student-centred guidance for studying medicine abroad.",
  path: "/about",
});

const values = [
  { icon: ShieldCheck, title: "Honesty", text: "We explain the real picture, including the challenges, and never promise outcomes we can't control." },
  { icon: Users, title: "Student first", text: "Recommendations are based on what suits you, not on what is easiest to sell." },
  { icon: Scale, title: "Accuracy", text: "We check requirements against official sources and tell you when something needs confirming." },
  { icon: HandHeart, title: "Care", text: "Moving abroad to study medicine is a family decision. We treat it with the seriousness it deserves." },
];

const whyChoose = [
  "Guidance focused specifically on medical and healthcare education",
  "Advice grounded in official university and regulator information",
  "Clear explanations of recognition and licensing considerations",
  "Support that continues from first conversation to arrival",
  "Transparency about what we can and cannot guarantee",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Guiding future doctors <span className="text-primary">with clarity and care</span>
          </>
        }
        description={`${siteConfig.name} is an international medical education consultancy. We help students and parents understand their options, choose with confidence and navigate admission to medical programmes abroad.`}
        crumbs={[{ label: "About Us", href: "/about" }]}
      />

      {/* Editorial intro */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                Built on a simple belief: families deserve honest advice.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-ink lg:col-span-7">
              <p>
                Choosing to study medicine abroad means weighing countries, universities, languages, costs and, most
                importantly, what happens after graduation. Too often, students make that choice with incomplete or
                overly optimistic information.
              </p>
              <p>
                {siteConfig.name} exists to change that. Like the cerebellum, which coordinates movement and balance, we
                help bring the many moving parts of an international medical admission into balance, so students can move
                forward with confidence.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Mission & vision */}
      <section className="bg-white pb-20 sm:pb-24 lg:pb-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal className="relative isolate overflow-hidden rounded-[2rem] bg-navy p-8 text-white/75 sm:p-10">
              <FoliaArcs className="absolute -right-16 -bottom-6 -z-10 w-96 text-gold/20" />
              <Target aria-hidden className="size-8 text-gold" />
              <h2 className="mt-5 text-2xl font-extrabold text-white">Our mission</h2>
              <p className="mt-3 text-lg leading-relaxed">
                To give every aspiring medical student honest, personalised and well-researched guidance, from the first
                question to their first day on campus.
              </p>
            </Reveal>
            <Reveal delay={0.08} className="relative isolate overflow-hidden rounded-[2rem] bg-primary p-8 text-white/85 sm:p-10">
              <FoliaArcs className="absolute -right-16 -bottom-6 -z-10 w-96 text-white/15" />
              <Eye aria-hidden className="size-8 text-gold" />
              <h2 className="mt-5 text-2xl font-extrabold text-white">Our vision</h2>
              <p className="mt-3 text-lg leading-relaxed">
                A world where talented students can pursue medicine wherever the right opportunity is, making informed
                choices that serve their careers and their communities.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Values */}
      <Section tone="muted">
        <Container>
          <SectionHeading align="center" title="What guides our work" />
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <li key={v.title}>
                <Reveal delay={i * 0.06} className="h-full rounded-3xl border border-line bg-white p-7">
                  <v.icon aria-hidden className="size-7 text-primary" strokeWidth={1.75} />
                  <h3 className="mt-5 text-lg font-extrabold">{v.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink">{v.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Approach + why choose */}
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <Reveal>
              <Compass aria-hidden className="size-8 text-gold-dark" />
              <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">Our student-centred approach</h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink">
                <p>
                  Every student starts with a conversation, not a brochure. We learn about your grades, interests, budget,
                  family priorities and where you hope to practise in future.
                </p>
                <p>
                  From there we compare realistic options, explain the trade-offs and help you decide. Parents are welcome in
                  every conversation. This is a decision you make together.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="rounded-[2rem] border border-line p-8 sm:p-10">
              <Lightbulb aria-hidden className="size-8 text-primary" />
              <h2 className="mt-5 text-2xl font-extrabold">Why choose us?</h2>
              <CheckList items={whyChoose} className="mt-6" />
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Team — rendered only when real team members are listed in data/team.ts */}
      {team.length > 0 && (
        <Section tone="muted">
          <Container>
            <SectionHeading align="center" title="The people who will guide you" />
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <li key={m.name} className="rounded-3xl border border-line bg-white p-6 text-center">
                  {m.photo ? (
                    <Image src={m.photo.src} alt={m.photo.alt} width={160} height={160} className="mx-auto size-28 rounded-full object-cover" />
                  ) : (
                    <span aria-hidden className="mx-auto grid size-28 place-items-center rounded-full bg-primary-light font-display text-3xl font-extrabold text-primary">
                      {m.name.slice(0, 1)}
                    </span>
                  )}
                  <h3 className="mt-5 text-lg font-extrabold">{m.name}</h3>
                  <p className="text-sm font-semibold text-primary">{m.role}</p>
                  {m.bio && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{m.bio}</p>}
                  {m.languages?.length ? <p className="mt-3 text-xs text-ink-soft">Speaks {m.languages.join(", ")}</p> : null}
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Company details — rendered only when filled in src/config/site.ts */}
      {hasCompanyDetails && (
        <section className="bg-white pb-20 sm:pb-24">
          <Container>
            <div className="rounded-[2rem] border border-line p-8 sm:p-10">
              <h2 className="text-2xl font-extrabold">Company details</h2>
              <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {(
                  [
                    ["Registered name", siteConfig.company.legalName],
                    ["Registration number", siteConfig.company.registrationNo],
                    ["Registered with", siteConfig.company.registeredWith],
                    ["PAN / VAT", siteConfig.company.panNo],
                    ["Consultancy approval", siteConfig.company.consultancyApproval],
                    ["Established", siteConfig.company.establishedYear],
                  ] as const
                )
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">{k}</dt>
                      <dd className="mt-1 font-semibold text-navy">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>
          </Container>
        </section>
      )}

      {/* Commitment */}
      <section className="bg-white pb-20 sm:pb-24 lg:pb-28">
        <Container>
          <Reveal className="rounded-[2rem] border-l-4 border-gold bg-gold-light p-8 sm:p-12">
            <p className="max-w-4xl font-display text-xl leading-relaxed font-semibold text-navy sm:text-2xl">
              We will always tell you what we know, what we don&apos;t, and where to verify it. Admission, visa and licensing
              decisions belong to universities, governments and regulators. Our job is to help you prepare for them as
              thoroughly and honestly as possible.
            </p>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
