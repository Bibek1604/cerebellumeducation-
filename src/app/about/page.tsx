import Image from "next/image";
import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { FoliaArcs } from "@/components/brand/folia";
import { GenericSection, HeroSection, MUTED_KINDS, bandPadding } from "@/components/cms/sections";
import { Highlight } from "@/cms/highlight";
import { CmsIcon } from "@/cms/cms-icon";
import { getPage, getSiteSettings, getTeam, on, sectionsOf, textsOf, visible } from "@/cms/content";
import type { Section } from "@/cms/types";
import { memberAnchor } from "@/data/team";
import { pageMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Cerebellum Education Network is an international medical education consultancy offering honest, student-centred guidance for studying medicine abroad.",
  path: "/about",
});

/** Content is managed in Admin → Pages → About Us. */
export default async function AboutPage() {
  const page = await getPage("page:about");
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => {
        const prev = sections[i - 1];
        const prevWhite = Boolean(prev && !MUTED_KINDS.has(prev.kind));
        return <AboutSection key={s.id} section={s} prevWhite={prevWhite} />;
      })}
    </>
  );
}

async function AboutSection({ section, prevWhite }: { section: Section; prevWhite: boolean }) {
  const show = visible(section);
  const d = section.data as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} href="/about" />;

    case "intro":
      return (
        <Band>
          <Container>
            <div className="grid gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-5">
                <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">
                  <Highlight text={d.heading} />
                </h2>
              </Reveal>
              <Reveal delay={0.1} className="space-y-5 text-lg leading-relaxed text-ink lg:col-span-7">
                {textsOf(d.paragraphs).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </Reveal>
            </div>
          </Container>
        </Band>
      );

    case "missionVision": {
      const cards = on<{ icon: string; title: string; text: string; tone: string }>(d.cards);
      return (
        <section className={cn("bg-white", bandPadding(true, prevWhite))}>
          <Container>
            <div className={cn("grid gap-6", cards.length > 1 && "md:grid-cols-2")}>
              {cards.map((c, i) => {
                const navy = c.tone !== "primary";
                return (
                  <Reveal
                    key={c._id}
                    delay={i * 0.08}
                    className={cn("relative isolate overflow-hidden rounded-[2rem] p-8 sm:p-10", navy ? "bg-navy text-white/75" : "bg-primary text-white/85")}
                  >
                    <FoliaArcs className={cn("absolute -right-16 -bottom-6 -z-10 w-96", navy ? "text-gold/20" : "text-white/15")} />
                    {show("cards.icon") && <CmsIcon icon={c.icon} aria-hidden className="size-8 text-gold" />}
                    <h2 className="mt-5 text-2xl font-extrabold text-white">{c.title}</h2>
                    <p className="mt-3 text-lg leading-relaxed">{c.text}</p>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      );
    }

    case "values": {
      const values = on<{ icon: string; title: string; text: string }>(d.items);
      return (
        <Band tone="muted">
          <Container>
            <SectionHeading align="center" title={<Highlight text={d.heading} />} />
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((v, i) => {
                return (
                  <li key={v._id}>
                    <Reveal delay={i * 0.06} className="h-full rounded-3xl border border-line bg-white p-7">
                      {show("items.icon") && <CmsIcon icon={v.icon} aria-hidden className="size-7 text-primary" strokeWidth={1.75} />}
                      <h3 className="mt-5 text-lg font-extrabold">{v.title}</h3>
                      <p className="mt-2 leading-relaxed text-ink">{v.text}</p>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Band>
      );
    }

    case "approach": {
      const left = show("approach");
      const right = show("why");
      if (!left && !right) return null;
      return (
        <Band>
          <Container>
            <div className={cn("grid gap-12 lg:gap-20", left && right && "lg:grid-cols-2")}>
              {left && (
                <Reveal>
                  {show("approach.icon") && <CmsIcon icon={d.approach?.icon} aria-hidden className="size-8 text-gold-dark" />}
                  <h2 className="mt-5 text-3xl font-extrabold sm:text-4xl">
                    <Highlight text={d.approach?.heading ?? ""} />
                  </h2>
                  <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink">
                    {textsOf(d.approach?.paragraphs).map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </Reveal>
              )}
              {right && (
                <Reveal delay={0.1} className="rounded-[2rem] border border-line p-8 sm:p-10">
                  {show("why.icon") && <CmsIcon icon={d.why?.icon} aria-hidden className="size-8 text-primary" />}
                  <h2 className="mt-5 text-2xl font-extrabold">{d.why?.heading}</h2>
                  <CheckList items={textsOf(d.why?.items)} className="mt-6" />
                </Reveal>
              )}
            </div>
          </Container>
        </Band>
      );
    }

    case "team": {
      // Rendered only when real counsellors are listed (Admin → Team).
      const team = await getTeam();
      if (team.length === 0) return null;
      return (
        <Band tone="muted" id="team" className="scroll-mt-24">
          <Container>
            <SectionHeading align="center" title={<Highlight text={d.heading} />} />
            <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {team.map((m) => (
                <li key={m.name} id={memberAnchor(m.name)} className="scroll-mt-28 rounded-3xl border border-line bg-white p-6 text-center">
                  {m.photo ? (
                    <Image
                      src={m.photo.src}
                      alt={m.photo.alt}
                      width={160}
                      height={160}
                      className="mx-auto size-28 rounded-full object-cover"
                    />
                  ) : (
                    <span aria-hidden className="mx-auto grid size-28 place-items-center rounded-full bg-primary-light font-display text-3xl font-extrabold text-primary">
                      {m.name.slice(0, 1)}
                    </span>
                  )}
                  <h3 className="mt-5 text-lg font-extrabold">{m.name}</h3>
                  <p className="text-sm font-semibold text-primary">{m.role}</p>
                  {m.bio && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink">{m.bio}</p>}
                  {m.languages?.length ? <p className="mt-3 text-xs text-ink-soft">Speaks {m.languages.join(", ")}</p> : null}
                </li>
              ))}
            </ul>
          </Container>
        </Band>
      );
    }

    case "company": {
      // Rendered only when registration details are filled in (Admin → Contact details & company).
      const { company, hasCompanyDetails } = await getSiteSettings();
      if (!hasCompanyDetails) return null;
      const rows = (
        [
          ["Registered name", company.legalName],
          ["Registration number", company.registrationNo],
          ["Registered with", company.registeredWith],
          ["PAN / VAT", company.panNo],
          ["Consultancy approval", company.consultancyApproval],
          ["Established", company.establishedYear],
        ] as const
      ).filter(([, v]) => v);
      return (
        <section className={cn("bg-white", prevWhite ? "pb-20 sm:pb-24" : "py-20 sm:py-24")}>
          <Container>
            <div className="rounded-[2rem] border border-line p-8 sm:p-10">
              <h2 className="text-2xl font-extrabold">{d.heading}</h2>
              <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-bold tracking-wider text-ink-soft uppercase">{k}</dt>
                    <dd className="mt-1 font-semibold text-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>
      );
    }

    case "commitment":
      return (
        <section className={cn("bg-white", bandPadding(true, prevWhite))}>
          <Container>
            <Reveal className="rounded-[2rem] border-l-4 border-gold bg-gold-light p-8 sm:p-12">
              <p className="max-w-4xl font-display text-xl leading-relaxed font-semibold text-navy sm:text-2xl">{d.text}</p>
            </Reveal>
          </Container>
        </section>
      );

    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}
