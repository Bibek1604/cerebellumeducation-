import { ArrowRight, MessageCircle, MessagesSquare, Phone } from "lucide-react";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { BrandArc } from "@/components/brand/folia";
import { homeFaqs } from "@/data/faqs";
import { siteConfig, whatsappLink } from "@/config/site";

export function FaqPreview() {
  const { phone, phoneHref } = siteConfig.contact;
  const wa = whatsappLink("Hello Cerebellum, I have a question about studying medicine abroad.");

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal>
              <SectionHeading
                title="Questions families ask us most"
                description="Requirements differ between countries, universities and home-country regulators. These answers explain the general picture."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="bg-brand-gradient relative isolate mt-8 overflow-hidden rounded-[1.75rem] p-7 text-white/80">
                <BrandArc className="absolute -right-16 -bottom-20 -z-10 w-72 opacity-60" strokeWidth={10} />
                <MessagesSquare aria-hidden className="size-8 text-gold" />
                <h3 className="mt-4 text-xl font-extrabold text-white">Still have a question?</h3>
                <p className="mt-2 leading-relaxed">A counsellor will answer it for your specific situation, free of charge.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <ButtonLink href="/book-counselling" variant="secondary" size="sm">
                    Ask a counsellor <ArrowRight aria-hidden className="size-4" />
                  </ButtonLink>
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
          </div>
          <Reveal delay={0.1}>
            <Accordion items={homeFaqs} />
            <ButtonLink href="/faqs" variant="ghost" className="mt-5">
              See all FAQs <ArrowRight aria-hidden className="size-4" />
            </ButtonLink>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
