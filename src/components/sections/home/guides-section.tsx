import Link from "next/link";
import { ArrowRight, BookOpen, Clock, FileCheck2, Landmark, Wallet } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

/** Admission guides — each links to an existing, in-depth page on this site. */
const guides = [
  {
    icon: FileCheck2,
    tag: "Admissions",
    title: "The 8-step admission process, explained",
    text: "What happens from first counselling to departure, and what you'll need at each stage.",
    href: "/admission-process",
    minutes: 5,
  },
  {
    icon: Landmark,
    tag: "Universities",
    title: "How to compare medical universities",
    text: "Why recognition, teaching hospitals and language matter more than rankings.",
    href: "/universities",
    minutes: 3,
  },
  {
    icon: Wallet,
    tag: "Finance",
    title: "Scholarships and financial planning",
    text: "Government schemes, merit awards and budgeting for the full programme.",
    href: "/scholarships",
    minutes: 4,
  },
];

export function GuidesSection() {
  return (
    <Section tone="muted">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              title="Admission guides for students & parents"
              description="Straightforward explainers to help your family plan with confidence."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/faqs" className="inline-flex items-center gap-1.5 font-bold text-primary">
              <BookOpen aria-hidden className="size-4" /> Browse all FAQs
            </Link>
          </Reveal>
        </div>
        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {guides.map((g, i) => (
            <li key={g.href}>
              <Reveal delay={i * 0.06} className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <div className="bg-brand-gradient relative flex aspect-[16/8] items-end overflow-hidden p-6">
                    <g.icon aria-hidden className="absolute -top-4 -right-4 size-40 text-white/10 transition-transform duration-500 group-hover:scale-110" strokeWidth={1} />
                    <span className="rounded-full bg-gold px-3 py-1 text-[0.7rem] font-bold tracking-[0.12em] text-navy uppercase">{g.tag}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
                      <Clock aria-hidden className="size-3.5" /> {g.minutes} min read
                    </p>
                    <h3 className="mt-3 text-lg leading-snug font-extrabold">
                      <Link href={g.href} className="after:absolute after:inset-0">
                        {g.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink">{g.text}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-primary">
                      Read guide <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
