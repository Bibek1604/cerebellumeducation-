import { Container, Section as Band } from "@/components/ui/container";
import { Accordion } from "@/components/ui/accordion";
import { JsonLd } from "@/components/ui/json-ld";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { getPage, on, sectionsOf } from "@/cms/content";
import type { Section } from "@/cms/types";
import { faqJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "MBBS & MEC Questions for Nepali Students",
  description:
    "Answers for Nepali students and parents on CEE (MECEE-BL), the MEC eligibility letter, documents, costs, recognition and medical licensing.",
  path: "/faqs",
});

type Category = { id: string; title: string; items: { question: string; answer: string }[] };

function categoriesOf(section: Section): Category[] {
  return on<{ title: string; anchor: string; items: unknown }>(section.data.categories)
    .map((c, i) => ({
      id: c.anchor || `topic-${i + 1}`,
      title: c.title,
      items: on<{ question: string; answer: string }>(c.items).filter((q) => q.question && q.answer),
    }))
    .filter((c) => c.title && c.items.length > 0);
}

/** Content: Admin → Pages → FAQs. */
export default async function FaqsPage() {
  const sections = sectionsOf(await getPage("page:faqs"));
  const all = sections.filter((s) => s.kind === "faqList").flatMap((s) => categoriesOf(s).flatMap((c) => c.items));
  return (
    <>
      {all.length > 0 && <JsonLd data={faqJsonLd(all)} />}
      {sections.map((s, i) => {
        if (s.kind === "hero") return <HeroSection key={s.id} section={s} href="/faqs" />;
        if (s.kind !== "faqList") return <GenericSection key={s.id} section={s} prevWhite={i > 0} />;
        const categories = categoriesOf(s);
        if (categories.length === 0) return null;
        return (
          <Band key={s.id}>
            <Container>
              <div className="grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-16">
                <nav aria-label="FAQ categories" className="hidden lg:block">
                  <ul className="sticky top-28 space-y-1">
                    {categories.map((c) => (
                      <li key={c.id}>
                        <a href={`#${c.id}`} className="block rounded-xl px-4 py-2.5 text-sm font-semibold text-navy hover:bg-muted hover:text-primary">
                          {c.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="space-y-14">
                  {categories.map((c) => (
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
          </Band>
        );
      })}
    </>
  );
}
