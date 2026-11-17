import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { CtaBand } from "@/components/sections/cta-band";
import { allFaqs, faqCategories } from "@/data/faqs";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQs: Studying Medicine Abroad",
  description:
    "Answers to common questions about MBBS abroad: eligibility, entrance exams, documents, comparing universities, costs and medical licensing after graduation.",
  path: "/faqs",
});

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(allFaqs)} />
      <PageHero
        title="Frequently asked questions"
        description="Clear answers to the questions students and parents ask most. Where rules differ by country, university or home regulator, we say so."
        crumbs={[{ label: "FAQs", href: "/faqs" }]}
      />
      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
            <nav aria-label="FAQ categories" className="hidden lg:block">
              <ul className="sticky top-28 space-y-1">
                {faqCategories.map((c) => (
                  <li key={c.id}>
                    <a href={`#${c.id}`} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-navy hover:bg-muted hover:text-primary">
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-14">
              {faqCategories.map((c) => (
                <section key={c.id} id={c.id} aria-labelledby={`${c.id}-title`} className="scroll-mt-28">
                  <h2 id={`${c.id}-title`} className="text-2xl font-extrabold">
                    {c.title}
                  </h2>
                  <Accordion items={c.items} defaultOpen={null} className="mt-6" />
                </section>
              ))}
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand title="Still have questions?" description="Our counsellors will answer them for your specific situation, free of charge." />
    </>
  );
}
