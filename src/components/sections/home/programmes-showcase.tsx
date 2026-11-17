import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { programmeIcons } from "@/components/ui/icons";
import { programmes, destinationsForProgramme } from "@/data/programmes";
import { cn } from "@/lib/utils";

export function ProgrammesShowcase() {
  return (
    <Section tone="muted">
      <Container>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              title="Discover Your Future in Healthcare"
              description="Medicine is our focus, alongside related healthcare degrees. Compare entry requirements, duration and destinations for each."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ButtonLink href="/programs" variant="outline">
              View all programmes <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programmes.map((p, i) => {
            const Icon = programmeIcons[p.icon];
            const dests = destinationsForProgramme(p.slug);
            const featured = i === 0;
            return (
              <li key={p.slug}>
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                  <article
                    className={cn(
                      "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border transition-all duration-300 hover:-translate-y-1 hover:shadow-lift",
                      featured ? "bg-brand-gradient border-transparent text-white/80" : "border-line bg-white",
                    )}
                  >
                    <div className="flex items-start justify-between p-7 pb-0">
                      <span
                        className={cn(
                          "grid size-14 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6",
                          featured ? "bg-gold text-navy" : "bg-primary-light text-primary",
                        )}
                      >
                        <Icon aria-hidden className="size-7" strokeWidth={1.75} />
                      </span>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-[0.7rem] font-bold tracking-[0.12em] uppercase",
                          featured ? "bg-white/15 text-white" : "bg-gold-light text-navy",
                        )}
                      >
                        {p.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-7">
                      <h3 className={cn("text-xl font-extrabold", featured && "text-white")}>{p.name}</h3>
                      <p className="mt-2.5 leading-relaxed">{p.summary}</p>
                      <ul className="mt-5 space-y-2 text-sm">
                        {[p.duration.split(",")[0], dests.length ? `Available in ${dests.map((d) => d.name).join(", ")}` : "Destinations on request"].map((b) => (
                          <li key={b} className="flex gap-2.5">
                            <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", featured ? "text-gold" : "text-primary")} strokeWidth={3} />
                            <span className={featured ? "text-white/85" : "text-ink"}>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-auto flex flex-wrap items-center gap-4 pt-7">
                        <ButtonLink href={`/book-counselling?programme=${p.slug}`} variant={featured ? "secondary" : "primary"} size="sm">
                          Get advice
                        </ButtonLink>
                        <Link
                          href={`/programs/${p.slug}`}
                          className={cn("inline-flex items-center gap-1 text-sm font-bold", featured ? "text-white hover:text-gold" : "text-primary")}
                        >
                          Learn more <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                          <span className="sr-only">about {p.name}</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
