import { Info } from "lucide-react";
import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { ProcessTimeline } from "@/components/sections/process-timeline";
import { BeforeYouApply } from "@/components/sections/before-you-apply";
import { GenericSection, HeroSection, MUTED_KINDS } from "@/components/cms/sections";
import { Highlight } from "@/cms/highlight";
import { CmsIcon } from "@/cms/cms-icon";
import { getPage, getSteps, sectionsOf, textsOf, visible } from "@/cms/content";
import type { Section } from "@/cms/types";
import { pageMetadata } from "@/lib/seo";
import { cn, pad2 } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "MBBS Abroad Admission Process: Step by Step",
  description:
    "How admission to study medicine abroad works: counselling, eligibility assessment, university selection, application, admission letter, visa and pre-departure.",
  path: "/admission-process",
});

/** Content is managed in Admin → Pages → Admission Process (steps under Admission steps). */
export default async function AdmissionProcessPage() {
  const page = await getPage("page:admission-process");
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        const prev = sections[i - 1];
        const prevWhite = Boolean(prev && !MUTED_KINDS.has(prev.kind));
        return <AdmissionSection key={s.id} section={s} prevWhite={prevWhite} />;
      })}
    </>
  );
}

async function AdmissionSection({ section, prevWhite }: { section: Section; prevWhite: boolean }) {
  const show = visible(section);
  const d = section.data as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} href="/admission-process" />;

    case "timeline": {
      const steps = await getSteps();
      if (steps.length === 0) return null;
      return (
        <Band>
          <Container>
            <ProcessTimeline steps={steps} />
          </Container>
        </Band>
      );
    }

    case "stages": {
      const steps = await getSteps();
      if (steps.length === 0) return null;
      return (
        <Band tone="muted">
          <Container>
            <SectionHeading title={<Highlight text={d.heading} />} />
            <ol className="mt-12 space-y-4">
              {steps.map((s, i) => (
                <li key={`${s.title}-${i}`}>
                  <Reveal className="grid gap-6 rounded-3xl border border-line bg-white p-6 sm:p-8 lg:grid-cols-[5rem_1.3fr_1fr] lg:gap-10">
                    <span className="font-display text-4xl font-extrabold text-primary/20 tabular-nums lg:text-5xl">{pad2(i + 1)}</span>
                    <div>
                      <h3 className="text-xl font-extrabold">{s.title}</h3>
                      <p className="mt-3 leading-relaxed text-ink">{s.detail}</p>
                    </div>
                    {s.youProvide.length > 0 && (
                      <div className="rounded-2xl bg-muted p-5">
                        {show("provideLabel") && d.provideLabel && (
                          <p className="text-xs font-bold tracking-[0.14em] text-ink-soft uppercase">{d.provideLabel}</p>
                        )}
                        <CheckList items={s.youProvide} className="mt-3 text-[0.95rem]" />
                      </div>
                    )}
                  </Reveal>
                </li>
              ))}
            </ol>
          </Container>
        </Band>
      );
    }

    case "documents": {
      return (
        <Band>
          <Container>
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
                {show("note") && d.note && (
                  <p className="mt-6 flex gap-2 text-sm text-ink-soft">
                    <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {d.note}
                  </p>
                )}
              </div>
              <div className="rounded-3xl border border-line p-7">
                {show("icon") && <CmsIcon icon={d.icon} aria-hidden className="size-7 text-primary" />}
                <CheckList items={textsOf(d.items)} className={cn(show("icon") && "mt-5")} />
              </div>
            </div>
          </Container>
        </Band>
      );
    }

    case "beforeYouApply":
      return (
        <section className={cn("bg-white", prevWhite ? "pb-20 sm:pb-24" : "py-20 sm:py-24")}>
          <Container>
            <BeforeYouApply />
          </Container>
        </section>
      );

    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}
