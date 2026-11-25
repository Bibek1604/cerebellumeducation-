import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactChannels } from "@/components/sections/contact-channels";
import { OfficeSection } from "@/components/sections/home/office-section";
import { GenericSection, HeroSection, MUTED_KINDS } from "@/components/cms/sections";
import { getPage, sectionsOf, visible } from "@/cms/content";
import type { LinkValue, Section } from "@/cms/types";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Contact Our Kathmandu Office",
  description:
    "Contact Cerebellum Education Network in Kathmandu about MBBS, BDS or nursing. Send a message or book a free counselling session.",
  path: "/contact",
});

/** Content is managed in Admin → Pages → Contact (details under Contact details & company). */
export default async function ContactPage() {
  const page = await getPage("page:contact");
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        const prev = sections[i - 1];
        const prevWhite = Boolean(prev && !MUTED_KINDS.has(prev.kind));
        return <ContactSection key={s.id} section={s} prevWhite={prevWhite} />;
      })}
    </>
  );
}

type MainData = {
  channels: { heading: string; emptyText: string };
  planning: { heading: string; text: string; link: LinkValue };
  form: { heading: string; subtitle: string };
};

function ContactSection({ section, prevWhite }: { section: Section; prevWhite: boolean }) {
  const show = visible(section);

  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} href="/contact" />;

    case "contactMain": {
      const d = section.data as MainData;
      const aside = show("channels") || show("planning");
      const form = show("form");
      if (!aside && !form) return null;
      return (
        <section className="py-16 sm:py-20">
          <Container>
            <div className={cn("grid gap-10 lg:gap-14", aside && form && "lg:grid-cols-[0.7fr_1.3fr]")}>
              {aside && (
                <aside className="space-y-6">
                  {show("channels") && <ContactChannels heading={d.channels.heading} emptyText={d.channels.emptyText} />}
                  {show("planning") && (
                    <div className="rounded-3xl bg-gold-light p-7">
                      <h2 className="text-lg font-extrabold">{d.planning.heading}</h2>
                      <p className="mt-2 leading-relaxed text-ink">{d.planning.text}</p>
                      {d.planning.link?.label && d.planning.link.href && (
                        <Link href={d.planning.link.href} className="mt-4 inline-block font-bold text-primary underline underline-offset-4">
                          {d.planning.link.label}
                        </Link>
                      )}
                    </div>
                  )}
                </aside>
              )}
              {form && (
                <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
                  <h2 className="text-2xl font-extrabold">{d.form.heading}</h2>
                  {show("form.subtitle") && d.form.subtitle ? <p className="mt-2 mb-8 text-ink">{d.form.subtitle}</p> : <div className="mb-8" />}
                  <ContactForm />
                </div>
              )}
            </div>
          </Container>
        </section>
      );
    }

    case "office":
      return <OfficeSection section={section} />;

    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}

