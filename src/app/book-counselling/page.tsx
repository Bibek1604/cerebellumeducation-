import { Container } from "@/components/ui/container";
import { CounsellingForm } from "@/components/forms/counselling-form";
import { ContactChannels } from "@/components/sections/contact-channels";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { CmsIcon } from "@/cms/cms-icon";
import { getPage, on, sectionsOf, visible } from "@/cms/content";
import { getDestinations, programmeOptions } from "@/cms/destinations";
import { getProgrammes } from "@/cms/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Medical Counselling in Kathmandu",
  description:
    "Book a free session in person, online or by phone. Get advice on MBBS, BDS or nursing after your CEE result, with no obligation.",
  path: "/book-counselling",
});

/** Content: Admin → Pages → Book Counselling. */
export default async function BookCounsellingPage() {
  const [page, destinations, programmes] = await Promise.all([getPage("page:book-counselling"), getDestinations(), getProgrammes()]);
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        if (s.kind === "hero") return <HeroSection key={s.id} section={s} href="/book-counselling" />;
        if (s.kind !== "bookMain") return <GenericSection key={s.id} section={s} prevWhite={i > 0} />;
        const show = visible(s);
        const expect = (s.data.expect ?? {}) as { title?: string; items?: unknown };
        const points = on<{ icon: string; title: string; text: string }>(expect.items);
        const heading = s.data.channelsHeading as string;
        return (
          <section key={s.id} className="py-16 sm:py-20">
            <Container>
              <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
                <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
                  <CounsellingForm
                    programmes={programmeOptions(programmes, destinations).map((p) => ({ value: p.name, slug: p.slug, destinations: p.destinations }))}
                    countries={destinations.map((d) => ({ value: d.name, slug: d.slug }))}
                  />
                </div>
                <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
                  {show("expect") && (expect.title || points.length > 0) && (
                    <div className="rounded-3xl bg-navy p-7 text-white/75">
                      {expect.title && <h2 className="text-lg font-extrabold text-white">{expect.title}</h2>}
                      <ul className="mt-5 space-y-5">
                        {points.map((e) => (
                          <li key={e._id} className="flex gap-4">
                            <CmsIcon icon={e.icon} aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                            <div>
                              <p className="font-semibold text-white">{e.title}</p>
                              {e.text && <p className="mt-0.5 text-sm leading-relaxed">{e.text}</p>}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {show("channelsHeading") && <ContactChannels heading={heading || "Prefer to talk now?"} />}
                </aside>
              </div>
            </Container>
          </section>
        );
      })}
    </>
  );
}
