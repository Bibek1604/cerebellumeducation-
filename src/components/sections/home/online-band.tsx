import { ArrowRight, Mic, Phone, Video } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CmsIcon } from "@/cms/cms-icon";
import { on, visible } from "@/cms/content";
import type { LinkValue, Section } from "@/cms/types";
import { cn } from "@/lib/utils";

type OnlineData = {
  heading: string;
  description: string;
  steps: unknown;
  primaryButton: LinkValue;
  secondaryButton: LinkValue;
  card: { title: string; liveLabel: string };
};

/** Full-width blue band for online counselling. Content: Admin → Pages → Homepage → Online counselling band. */
export function OnlineBand({ section }: { section: Section }) {
  const d = section.data as OnlineData;
  const show = visible(section);
  const steps = show("steps") ? on<{ icon: string; label: string; title: string }>(d.steps) : [];
  const showCard = show("card");
  const ok = (l: LinkValue | undefined) => Boolean(l?.label && l.href);

  return (
    <section className="bg-hero-vivid relative isolate overflow-hidden py-16 sm:py-20">
      <Container className={cn("grid items-center gap-12", showCard && "lg:grid-cols-[1.2fr_0.8fr]")}>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl leading-tight font-extrabold text-white sm:text-4xl">{d.heading}</h2>
          {show("description") && d.description && <p className="mt-4 text-lg leading-relaxed text-white/85">{d.description}</p>}
          {steps.length > 0 && (
            <ul className={cn("mt-8 grid gap-3", steps.length >= 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
              {steps.map((s) => (
                <li key={s._id} className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur-sm">
                  <span className="grid size-9 place-items-center rounded-full bg-orange-fill text-white">
                    <CmsIcon icon={s.icon} aria-hidden className="size-4.5" />
                  </span>
                  {s.label && <p className="mt-3 text-xs text-white/70">{s.label}</p>}
                  <p className={cn("font-semibold text-white", !s.label && "mt-3")}>{s.title}</p>
                </li>
              ))}
            </ul>
          )}
          {((show("primaryButton") && ok(d.primaryButton)) || (show("secondaryButton") && ok(d.secondaryButton))) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {show("primaryButton") && ok(d.primaryButton) && (
                <ButtonLink href={d.primaryButton.href} variant="secondary" size="lg">
                  {d.primaryButton.label} <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
              )}
              {show("secondaryButton") && ok(d.secondaryButton) && (
                <ButtonLink href={d.secondaryButton.href} variant="outline-light" size="lg">
                  {d.secondaryButton.label}
                </ButtonLink>
              )}
            </div>
          )}
        </Reveal>

        {/* Illustrative online session card */}
        {showCard && (
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="mx-auto max-w-sm rounded-3xl bg-white p-5 shadow-lift">
              <div className="flex items-center justify-between">
                <p className="font-display font-extrabold text-navy">{d.card?.title}</p>
                {d.card?.liveLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-light px-2.5 py-1 text-xs font-bold text-gold-dark">
                    <span className="size-1.5 rounded-full bg-gold" /> {d.card.liveLabel}
                  </span>
                )}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { i: "S", l: "Student", c: "bg-primary" },
                  { i: "P", l: "Parent", c: "bg-sky" },
                  { i: "C", l: "Counsellor", c: "bg-gold" },
                ].map((p) => (
                  <div key={p.l} className="flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-2xl bg-muted">
                    <span className={`grid size-11 place-items-center rounded-full font-sans font-extrabold text-white ${p.c}`}>{p.i}</span>
                    <span className="text-xs font-semibold text-ink">{p.l}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {[Mic, Video, Phone].map((Icon, k) => (
                  <span key={k} className={`grid size-10 place-items-center rounded-full ${k === 2 ? "bg-gold text-white" : "bg-muted text-navy"}`}>
                    <Icon aria-hidden className="size-4.5" />
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
