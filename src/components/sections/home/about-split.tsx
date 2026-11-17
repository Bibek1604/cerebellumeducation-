import Image from "next/image";
import { ArrowRight, Check, Compass, Globe, HeartHandshake, UserCheck } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { BrandArc, FoliaArcs } from "@/components/brand/folia";
import { branding } from "@/config/branding";

const pillars = [
  { icon: UserCheck, title: "Personalised Guidance" },
  { icon: Globe, title: "International Opportunities" },
  { icon: Compass, title: "Admission Assistance" },
  { icon: HeartHandshake, title: "Student-Centred Support" },
];

const points = [
  "Advice built around your grades, goals, budget and family",
  "Requirements checked against official sources",
  "Clear explanation of recognition and licensing considerations",
  "One counsellor from first call to first day on campus",
];

export function AboutSplit() {
  return (
    <Section>
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Media block */}
          <Reveal className="relative">
            <div className="bg-brand-gradient relative isolate aspect-[5/4.4] overflow-hidden rounded-[2.5rem] p-8 shadow-lift sm:p-10">
              <FoliaArcs className="absolute -right-24 -bottom-8 -z-10 w-[36rem] text-white/10" rings={8} />
              <BrandArc className="absolute -top-20 -left-24 -z-10 w-96 opacity-60" strokeWidth={10} />
              {branding.logo.src && (
                <div className="inline-flex rounded-2xl bg-white px-5 py-3 shadow-soft">
                  <Image src={branding.logo.src} alt="" width={branding.logo.width} height={branding.logo.height} quality={100} className="h-12 w-auto" />
                </div>
              )}
              <ul className="absolute right-8 bottom-8 left-8 grid grid-cols-2 gap-3 sm:right-10 sm:bottom-10 sm:left-10">
                {pillars.map((p) => (
                  <li key={p.title} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 ring-1 ring-white/15 backdrop-blur-sm">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold text-navy">
                      <p.icon aria-hidden className="size-5" />
                    </span>
                    <span className="text-sm leading-tight font-semibold text-white">{p.title}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -right-3 -bottom-6 hidden rounded-2xl bg-white px-5 py-4 shadow-lift sm:block lg:-right-8">
              <p className="font-display text-2xl font-extrabold text-primary">Free</p>
              <p className="text-sm font-semibold text-navy">first consultation</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <SectionHeading
              title="Your Trusted Partner in International Medical Education"
              description="Choosing where to study medicine is one of the biggest decisions a family makes. We help you make it with clarity, explaining options honestly and guiding you through every step of the admission journey."
            />
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {points.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-2xl bg-muted p-4 text-[0.95rem] font-medium text-navy">
                  <Check aria-hidden className="mt-0.5 size-4.5 shrink-0 text-gold-dark" strokeWidth={3} />
                  {p}
                </li>
              ))}
            </ul>
            <ButtonLink href="/about" variant="outline" className="mt-9">
              More about us <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
