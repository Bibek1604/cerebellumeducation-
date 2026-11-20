import { ArrowRight, MessageCircle, MessagesSquare, Phone } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { FoliaArcs } from "@/components/brand/folia";
import { Highlight } from "@/cms/highlight";
import { getSiteSettings, on, visible, whatsappLinkFrom } from "@/cms/content";
import type { LinkValue, Section as CmsSection } from "@/cms/types";
import { cn } from "@/lib/utils";

type FaqData = {
  heading: string;
  description: string;
  helpCard: { title: string; text: string; button: LinkValue };
  faqs: unknown;
  seeAll: LinkValue;
};

/** Content: Admin → Pages → Homepage → FAQs (call/WhatsApp come from Contact details). */
export async function FaqPreview({ section, tone }: { section: CmsSection; tone: "white" | "muted" }) {
  const d = section.data as FaqData;
  const show = visible(section);
  const { contact } = await getSiteSettings();
  const { phone, phoneHref } = contact;
  const wa = whatsappLinkFrom(contact, "Hello Cerebellum, I have a question about studying medicine abroad.");
  const faqs = on<{ question: string; answer: string }>(d.faqs).filter((f) => f.question && f.answer);
  const card = show("helpCard") && d.helpCard?.title;

  return (
    <Section tone={tone}>
      <Container>
        <div className={cn("grid gap-10 lg:gap-14", faqs.length > 0 && "lg:grid-cols-[0.8fr_1.2fr]")}>
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
            </Reveal>
            {card && (
              <Reveal delay={0.08}>
                <div className="bg-hero-vivid relative isolate mt-8 overflow-hidden rounded-3xl p-7 text-white/85">
                  <FoliaArcs className="absolute -right-24 -bottom-6 -z-10 w-96 text-white/15" rings={6} />
                  <MessagesSquare aria-hidden className="size-8 text-gold" />
                  <h3 className="mt-4 text-xl font-extrabold text-white">{d.helpCard.title}</h3>
                  {d.helpCard.text && <p className="mt-2 leading-relaxed">{d.helpCard.text}</p>}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {d.helpCard.button?.label && d.helpCard.button.href && (
                      <ButtonLink href={d.helpCard.button.href} variant="secondary" size="sm">
                        {d.helpCard.button.label} <ArrowRight aria-hidden className="size-4" />
                      </ButtonLink>
                    )}
                    {phone && phoneHref && (
                      <ButtonLink href={`tel:${phoneHref}`} variant="outline-light" size="sm" external={false}>
                        <Phone aria-hidden className="size-4" /> Call
                      </ButtonLink>
                    )}
                    {wa && (
                      <ButtonLink href={wa} variant="outline-light" size="sm" external>
                        <MessageCircle aria-hidden className="size-4" /> WhatsApp
                      </ButtonLink>
                    )}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
          {faqs.length > 0 && (
            <Reveal delay={0.1}>
              <Accordion items={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
              {show("seeAll") && d.seeAll?.label && d.seeAll.href && (
                <ButtonLink href={d.seeAll.href} variant="ghost" className="mt-5">
                  {d.seeAll.label} <ArrowRight aria-hidden className="size-4" />
                </ButtonLink>
              )}
            </Reveal>
          )}
        </div>
      </Container>
    </Section>
  );
}
