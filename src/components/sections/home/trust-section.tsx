import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CmsIcon } from "@/cms/cms-icon";
import { Highlight } from "@/cms/highlight";
import { on, visible } from "@/cms/content";
import type { Section as CmsSection } from "@/cms/types";

/**
 * Our commitments to students and parents. Keep each line in sync with the
 * promises made elsewhere (FAQs, terms, scholarships, verify notice).
 * Content: Admin → Pages → Homepage → Our commitments (trust).
 */
const iconTones = ["bg-gradient-to-br from-sky to-primary", "bg-gradient-to-br from-primary to-primary-dark", "bg-gradient-to-br from-gold to-accent"];

export function TrustSection({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as { heading: string; description: string; items: unknown };
  const show = visible(section);
  return (
    <Section tone={tone}>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {on<{ icon: string; title: string; text: string }>(d.items).map((m, i) => (
            <li key={m._id}>
              <Reveal delay={(i % 3) * 0.06} className="h-full">
                <div className="h-full rounded-3xl border border-line bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
                  <span className={`grid size-12 place-items-center rounded-2xl text-white shadow-soft ${iconTones[i % iconTones.length]}`}>
                    <CmsIcon icon={m.icon} aria-hidden className="size-6" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{m.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink">{m.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
