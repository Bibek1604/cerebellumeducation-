import { FileText, Info } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { CtaBand } from "@/components/sections/cta-band";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import { admissionSteps } from "@/data/process";
import { pageMetadata } from "@/lib/seo";
import { pad2 } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "MBBS Abroad Admission Process: Step by Step",
  description:
    "How admission to study medicine abroad works: counselling, eligibility assessment, university selection, application, admission letter, visa and pre-departure.",
  path: "/admission-process",
});

const documents = [
  "Valid passport (with sufficient validity for your course start)",
  "Grade 10 and Grade 12 (or equivalent) certificates and marksheets",
  "Passport-size photographs to the specified format",
  "Entrance-exam results, where required by your home regulator or the university",
  "Medical fitness certificate (typically at visa stage)",
  "Police clearance certificate (typically at visa stage)",
  "Attestation, apostille or ministry recognition of documents, where required",
  "Financial documents, if required for the visa",
];

export default function AdmissionProcessPage() {
  return (
    <>
      <PageHero
        title="Your step-by-step path to studying medicine abroad"
        description="Eight stages, one counsellor beside you throughout. Here's what happens at each step, and what you'll need to prepare."
        crumbs={[{ label: "Admission Process", href: "/admission-process" }]}
      />

      <Section>
        <Container>
          <ProcessTimeline steps={admissionSteps} />
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <SectionHeading title="What happens at each stage" />
          <ol className="mt-12 space-y-4">
            {admissionSteps.map((s, i) => (
              <li key={s.title}>
                <Reveal className="grid gap-6 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[5rem_1.3fr_1fr] lg:gap-10">
                  <span className="font-display text-4xl font-extrabold text-primary/20 tabular-nums lg:text-5xl">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="text-xl font-extrabold">{s.title}</h3>
                    <p className="mt-3 leading-relaxed text-ink">{s.detail}</p>
                  </div>
                  <div className="rounded-2xl bg-muted p-5">
                    <p className="text-xs font-bold tracking-[0.14em] text-ink-soft uppercase">What you&apos;ll provide</p>
                    <CheckList items={s.youProvide} className="mt-3 text-[0.95rem]" />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <SectionHeading
                title="Documents generally required"
                description="This is a general list. The exact requirements depend on the country and university, we give you a precise checklist once you've chosen."
              />
              <p className="mt-6 flex gap-2 text-sm text-ink-soft">
                <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                We never ask for original documents or sensitive files through our website enquiry forms.
              </p>
            </div>
            <div className="rounded-3xl border border-line p-7">
              <FileText aria-hidden className="size-7 text-primary" />
              <CheckList items={documents} className="mt-5" />
            </div>
          </div>
        </Container>
      </Section>

      <section className="bg-white pb-20 sm:pb-24">
        <Container>
          <BeforeYouApply />
        </Container>
      </section>

      <CtaBand title="Start with step one. It's free." description="Book your initial counselling session and we'll map out your personal timeline." />
    </>
  );
}
