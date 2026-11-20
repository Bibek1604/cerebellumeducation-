import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ProgrammeCard } from "@/components/programmes/programme-card";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { getPage, sectionsOf } from "@/cms/content";
import { getProgrammes } from "@/cms/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Medical & Healthcare Programmes Abroad",
  description:
    "Explore MBBS, MD, dentistry, nursing, pharmacy and biomedical sciences programmes abroad: entry requirements, duration and what to check before applying.",
  path: "/programs",
});

/** Content: Admin → Pages → Programmes. Programmes: Admin → Programme list. */
export default async function ProgrammesPage() {
  const [page, programmes] = await Promise.all([getPage("page:programmes"), getProgrammes()]);
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        switch (s.kind) {
          case "hero": {
            const badge = (s.data.badge ?? {}) as { title?: string; text?: string };
            const data = { ...s.data, badge: { ...badge, title: String(badge.title ?? "").replaceAll("{count}", String(programmes.length)) } };
            return <HeroSection key={s.id} section={{ ...s, data }} href="/programs" />;
          }
          case "progGrid":
            return programmes.length === 0 ? null : (
              <Band key={s.id}>
                <Container>
                  <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {programmes.map((p, j) => (
                      <li key={p.slug}>
                        <Reveal delay={(j % 3) * 0.06} className="h-full">
                          <ProgrammeCard programme={p} index={j} />
                        </Reveal>
                      </li>
                    ))}
                  </ul>
                </Container>
              </Band>
            );
          default:
            return <GenericSection key={s.id} section={s} prevWhite={i > 0} />;
        }
      })}
    </>
  );
}
