import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { FoliaArcs } from "@/components/brand/folia";
import { services } from "@/data/process";
import { pad2 } from "@/lib/utils";

export function WhyCerebellum() {
  return (
    <section className="relative bg-white pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid overflow-hidden rounded-[2.5rem] bg-brand-gradient lg:grid-cols-[0.85fr_1.15fr]">
          {/* Left — statement panel */}
          <div className="relative isolate overflow-hidden p-8 sm:p-12 lg:p-14">
            <FoliaArcs className="absolute -bottom-4 -left-24 -z-10 w-[36rem] text-gold/20" rings={7} />
            <div className="lg:sticky lg:top-32">
              <h2 className="text-3xl leading-[1.1] font-extrabold text-white sm:text-4xl lg:text-[2.85rem]">
                More Than Admissions. <span className="text-gold">Guidance for Your Future.</span>
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75">
                An offer letter is only the beginning. We guide every stage with care, because the right decision now
                shapes the next decade of your life.
              </p>
              <ButtonLink href="/about" variant="secondary" className="mt-9">
                How we work <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>
          </div>

          {/* Right — numbered service ledger */}
          <ol className="divide-y divide-white/10 border-t border-white/10 bg-navy/40 lg:border-t-0 lg:border-l">
            {services.map((s, i) => (
              <li key={s.title}>
                <Reveal delay={i * 0.04} className="group flex gap-6 px-8 py-6 transition-colors hover:bg-white/[0.04] sm:px-12 lg:py-7">
                  <span className="font-display text-sm font-extrabold text-gold tabular-nums">{pad2(i + 1)}</span>
                  <div>
                    <h3 className="text-lg font-bold text-white sm:text-xl">{s.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-white/65">{s.description}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
