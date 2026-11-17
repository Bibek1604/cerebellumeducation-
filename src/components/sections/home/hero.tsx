import { ArrowRight, CalendarCheck, Check, GraduationCap, Route } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BrandArc } from "@/components/brand/folia";
import { destinations } from "@/data/destinations";
import { destinationsForProgramme, programmes } from "@/data/programmes";
import { admissionSteps } from "@/data/process";
import { intakeOptions } from "@/lib/validations";
import { HeroVisual } from "./hero-visual";
import { CounsellingWidget } from "./counselling-widget";

const bullets = [
  "Personalised guidance for students and parents",
  "Honest comparisons using official university and regulator sources",
  "Support from first conversation to arrival on campus",
];

export function HomeHero() {
  return (
    <>
      <section className="bg-brand-gradient-soft relative isolate overflow-hidden pt-10 pb-36 sm:pt-14 lg:pt-16 lg:pb-40">
        <div aria-hidden className="bg-dot-grid absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]" />

        <Container>
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 py-1.5 pr-4 pl-1.5 text-sm font-semibold text-navy shadow-soft backdrop-blur">
                  <span className="inline-flex items-center gap-1 rounded-full bg-navy px-2.5 py-0.5 text-xs font-bold text-white">
                    <GraduationCap aria-hidden className="size-3.5 text-gold" /> Education consultancy
                  </span>
                  MBBS &amp; medical study abroad
                </p>
                <h1 className="mt-7 text-[2.6rem] leading-[1.04] font-extrabold sm:text-6xl lg:text-[4.1rem]">
                  <span className="text-brand-gradient">Your Medical Dreams.</span>{" "}
                  <span className="relative whitespace-nowrap">
                    A World
                    <svg aria-hidden viewBox="0 0 300 18" className="absolute -bottom-2 left-0 h-3 w-full text-gold" preserveAspectRatio="none">
                      <path d="M3 13 C 80 3, 200 3, 297 11" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                    </svg>
                  </span>{" "}
                  of Opportunities.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink sm:text-xl">
                  Take the next step towards your medical career with personalised guidance, international university
                  opportunities and dedicated admission support.
                </p>
                <ul className="mt-7 space-y-3">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-3 text-navy">
                      <span aria-hidden className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold-light text-gold-dark">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/destinations" size="lg">
                    Explore Study Destinations <ArrowRight aria-hidden className="size-4" />
                  </ButtonLink>
                  <ButtonLink href="/book-counselling" size="lg" variant="secondary">
                    Book Free Counselling
                  </ButtonLink>
                </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <BrandArc className="absolute -top-[9%] -left-[14%] -z-10 hidden w-[120%] opacity-90 sm:block" strokeWidth={12} />
              <HeroVisual />

              {/* Overlay info card */}
              <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-lift backdrop-blur sm:right-auto sm:-left-8 sm:w-[20rem]">
                <div className="flex items-center gap-3">
                  <span className="bg-brand-gradient grid size-11 place-items-center rounded-xl text-white">
                    <Route aria-hidden className="size-5" />
                  </span>
                  <div>
                    <p className="font-display font-extrabold text-navy">{admissionSteps.length}-step guided journey</p>
                    <p className="text-xs text-ink-soft">Counselling → campus, with one counsellor</p>
                  </div>
                </div>
                <ol className="mt-4 flex gap-1.5" aria-label="Admission journey steps">
                  {admissionSteps.map((s, i) => (
                    <li key={s.title} className="flex-1" title={s.title}>
                      <span className={`block h-1.5 rounded-full ${i === 0 ? "bg-gold" : "bg-primary/15"}`} />
                      <span className="sr-only">{s.title}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="absolute -top-4 right-4 hidden rounded-2xl bg-white px-4 py-3 shadow-lift sm:block lg:-right-5">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                  <CalendarCheck aria-hidden className="size-4 text-primary" /> First consultation
                </p>
                <p className="font-display text-lg font-extrabold text-navy">Free · In person or online</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Booking-style widget overlapping the hero edge */}
      <div className="relative z-10 -mt-24 lg:-mt-28">
        <Container>
          <Reveal delay={0.15}>
            <CounsellingWidget
              programmes={programmes.map((p) => ({ slug: p.slug, name: p.name, destinations: destinationsForProgramme(p.slug).map((d) => d.slug) }))}
              destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
              intakes={intakeOptions}
            />
          </Reveal>
        </Container>
      </div>
    </>
  );
}
