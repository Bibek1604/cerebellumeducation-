import { CalendarClock, ExternalLink, Info, Wallet } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { Badge } from "@/components/ui/badge";
import { CtaBand } from "@/components/sections/cta-band";
import { scholarships, scholarshipTypes } from "@/data/scholarships";
import { getDestination } from "@/data/destinations";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Scholarships for Studying Medicine Abroad",
  description:
    "Scholarship options for studying medicine abroad: government schemes, university merit awards, eligibility, application steps and financial planning.",
  path: "/scholarships",
});

const steps = [
  "Check eligibility on the official scholarship page, nationality, programme, grades and age limits",
  "Note the application window; many schemes open months before the intake",
  "Prepare documents such as transcripts, a study plan, recommendation letters and a medical form",
  "Apply through the official channel stated by the provider",
  "Plan your finances assuming you may not receive the award",
];

const financial = [
  "Budget for the full programme, not just the first year",
  "Include hostel, food, insurance, visa renewals, books and travel",
  "Allow for currency movements and annual fee changes",
  "Pay fees directly to the university through official channels",
  "Keep receipts and official fee letters for every payment",
];

export default function ScholarshipsPage() {
  return (
    <>
      <PageHero
        title="Scholarships & financial planning"
        description="Scholarships can reduce the cost of studying medicine abroad, but they are competitive and never guaranteed. Here's how they work and how to plan responsibly."
        crumbs={[{ label: "Scholarships", href: "/scholarships" }]}
      />

      <Section>
        <Container>
          <SectionHeading title="Types of scholarships" description="General categories you may come across. Availability depends on your nationality, programme and the year." />
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {scholarshipTypes.map((t, i) => (
              <li key={t.title}>
                <Reveal delay={(i % 2) * 0.06} className="h-full rounded-3xl border border-line p-7">
                  <h3 className="text-xl font-extrabold">{t.title}</h3>
                  <p className="mt-3 leading-relaxed text-ink">{t.description}</p>
                  {t.href && (
                    <a href={t.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                      {t.linkLabel} <ExternalLink aria-hidden className="size-3.5" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading title="Verified scholarship openings" />
          {scholarships.length > 0 ? (
            <ul className="mt-12 grid gap-6 md:grid-cols-2">
              {scholarships.map((s) => (
                <li key={s.id} className="rounded-3xl border border-line bg-white p-7">
                  <Badge tone="blue">{getDestination(s.destination)?.name ?? s.destination}</Badge>
                  <h3 className="mt-4 text-xl font-extrabold">{s.name}</h3>
                  <p className="text-sm text-ink-soft">{s.provider}</p>
                  <p className="mt-3 leading-relaxed text-ink">{s.summary}</p>
                  <CheckList items={s.eligibility} className="mt-4 text-[0.95rem]" />
                  <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-navy">
                    <CalendarClock aria-hidden className="size-4 text-primary" /> Deadline: {s.deadline}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold text-primary">
                      Official details <ExternalLink aria-hidden className="size-3.5" />
                    </a>
                    <span className="text-ink-soft">Checked {s.verifiedOn}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 flex max-w-3xl gap-4 rounded-3xl bg-white p-7">
              <Info aria-hidden className="mt-0.5 size-6 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-navy">No specific openings are listed right now.</p>
                <p className="mt-2 leading-relaxed text-ink">
                  We only list scholarships once we&apos;ve verified them for the current cycle. Ask a counsellor which
                  options may apply to your nationality, programme and intake.
                </p>
              </div>
            </div>
          )}
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-line p-7">
              <h2 className="text-xl font-extrabold">Typical eligibility</h2>
              <CheckList
                className="mt-5"
                items={[
                  "Strong academic results, especially in science subjects",
                  "Nationality and age criteria set by the provider",
                  "Admission (or eligibility for admission) to an approved programme",
                  "Health and character requirements for some schemes",
                ]}
              />
            </div>
            <div className="rounded-3xl border border-line p-7">
              <h2 className="text-xl font-extrabold">Application process</h2>
              <CheckList items={steps} className="mt-5" />
            </div>
            <div className="rounded-3xl bg-navy p-7 text-white/75">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
                <Wallet aria-hidden className="size-5 text-gold" /> Financial guidance
              </h2>
              <ul className="mt-5 space-y-3">
                {financial.map((f) => (
                  <li key={f} className="flex gap-3 leading-relaxed">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 rounded-2xl border-l-4 border-gold bg-gold-light p-5 leading-relaxed text-ink">
            <strong className="text-navy">Important deadlines:</strong> scholarship windows differ by provider and often close
            months before the academic year begins. Always confirm dates on the official website. We&apos;ll help you build a
            calendar once you&apos;ve chosen your destination.
          </div>
        </Container>
      </Section>

      <CtaBand title="Plan your finances with confidence" description="Talk to a counsellor about realistic costs and any scholarship routes open to you." />
    </>
  );
}
