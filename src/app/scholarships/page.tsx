import { CalendarClock, ExternalLink, Info, Wallet } from "lucide-react";
import { Container, Section as Band } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { CheckList } from "@/components/ui/check-list";
import { Badge } from "@/components/ui/badge";
import { GenericSection, HeroSection } from "@/components/cms/sections";
import { Highlight } from "@/cms/highlight";
import { getPage, on, sectionsOf, textsOf, visible } from "@/cms/content";
import { getDestinations } from "@/cms/destinations";
import type { LinkValue, Section } from "@/cms/types";
import type { Destination } from "@/types/content";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Scholarships for Studying Medicine Abroad",
  description:
    "Scholarship options for studying medicine abroad: government schemes, university merit awards, eligibility, application steps and financial planning.",
  path: "/scholarships",
});

/** Content: Admin → Pages → Scholarships. */
export default async function ScholarshipsPage() {
  const [page, destinations] = await Promise.all([getPage("page:scholarships"), getDestinations()]);
  const sections = sectionsOf(page);
  return (
    <>
      {sections.map((s, i) => (
        <ScholarshipBlock key={s.id} section={s} destinations={destinations} prevWhite={i > 0 && sections[i - 1]!.kind !== "schOpenings"} />
      ))}
    </>
  );
}

function ScholarshipBlock({ section, destinations, prevWhite }: { section: Section; destinations: Destination[]; prevWhite: boolean }) {
  const show = visible(section);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d = section.data as Record<string, any>;

  switch (section.kind) {
    case "hero":
      return <HeroSection section={section} href="/scholarships" />;

    case "schTypes": {
      const types = on<{ title: string; text: string; link: LinkValue }>(d.items);
      return (
        <Band>
          <Container>
            <SectionHeading title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
            {types.length > 0 && (
              <ul className="mt-12 grid gap-6 md:grid-cols-2">
                {types.map((t, i) => (
                  <li key={t._id}>
                    <Reveal delay={(i % 2) * 0.06} className="h-full rounded-3xl border border-line p-7">
                      <h3 className="text-xl font-extrabold">{t.title}</h3>
                      {t.text && <p className="mt-3 leading-relaxed text-ink">{t.text}</p>}
                      {show("items.link") && t.link?.label && t.link.href && (
                        <a href={t.link.href} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                          {t.link.label} <ExternalLink aria-hidden className="size-3.5" />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      )}
                    </Reveal>
                  </li>
                ))}
              </ul>
            )}
          </Container>
        </Band>
      );
    }

    case "schOpenings": {
      const openings = on<{
        name: string;
        provider: string;
        destination: string;
        summary: string;
        eligibility: unknown;
        deadline: string;
        officialUrl: string;
        verifiedOn: string;
      }>(d.openings).filter((o) => o.name);
      const labels = d.labels ?? {};
      return (
        <Band tone="muted">
          <Container>
            <SectionHeading title={<Highlight text={d.heading} />} />
            {openings.length > 0 ? (
              <ul className="mt-12 grid gap-6 md:grid-cols-2">
                {openings.map((s) => (
                  <li key={s._id} className="rounded-3xl border border-line bg-white p-7">
                    {s.destination && <Badge tone="blue">{destinations.find((x) => x.slug === s.destination)?.name ?? s.destination}</Badge>}
                    <h3 className="mt-4 text-xl font-extrabold">{s.name}</h3>
                    {s.provider && <p className="text-sm text-ink-soft">{s.provider}</p>}
                    {s.summary && <p className="mt-3 leading-relaxed text-ink">{s.summary}</p>}
                    <CheckList items={textsOf(s.eligibility)} className="mt-4 text-[0.95rem]" />
                    {s.deadline && (
                      <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-navy">
                        <CalendarClock aria-hidden className="size-4 text-primary" /> {labels.deadline} {s.deadline}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      {s.officialUrl && (
                        <a href={s.officialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-bold text-primary">
                          {labels.details} <ExternalLink aria-hidden className="size-3.5" />
                        </a>
                      )}
                      {s.verifiedOn && (
                        <span className="text-ink-soft">
                          {labels.checked} {s.verifiedOn}
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-10 flex max-w-3xl gap-4 rounded-3xl bg-white p-7">
                <Info aria-hidden className="mt-0.5 size-6 shrink-0 text-primary" />
                <div>
                  <p className="font-semibold text-navy">{d.empty?.title}</p>
                  {d.empty?.text && <p className="mt-2 leading-relaxed text-ink">{d.empty.text}</p>}
                </div>
              </div>
            )}
          </Container>
        </Band>
      );
    }

    case "schGuide": {
      const card = (key: string) => (show(key) && d[key]?.title ? { title: d[key].title as string, items: textsOf(d[key].items) } : null);
      const elig = card("eligibility");
      const proc = card("process");
      const fin = card("financial");
      const count = [elig, proc, fin].filter(Boolean).length;
      return (
        <Band>
          <Container>
            {count > 0 && (
              <div className={count === 3 ? "grid gap-6 lg:grid-cols-3" : "grid gap-6 md:grid-cols-2"}>
                {elig && (
                  <div className="rounded-3xl border border-line p-7">
                    <h2 className="text-xl font-extrabold">{elig.title}</h2>
                    <CheckList className="mt-5" items={elig.items} />
                  </div>
                )}
                {proc && (
                  <div className="rounded-3xl border border-line p-7">
                    <h2 className="text-xl font-extrabold">{proc.title}</h2>
                    <CheckList items={proc.items} className="mt-5" />
                  </div>
                )}
                {fin && (
                  <div className="rounded-3xl bg-navy p-7 text-white/75">
                    <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
                      <Wallet aria-hidden className="size-5 text-gold" /> {fin.title}
                    </h2>
                    <ul className="mt-5 space-y-3">
                      {fin.items.map((f) => (
                        <li key={f} className="flex gap-3 leading-relaxed">
                          <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            {show("note") && d.note?.text && (
              <div className={count > 0 ? "mt-8 rounded-2xl border-l-4 border-gold bg-gold-light p-5 leading-relaxed text-ink" : "rounded-2xl border-l-4 border-gold bg-gold-light p-5 leading-relaxed text-ink"}>
                {d.note.label && <strong className="text-navy">{d.note.label}</strong>} {d.note.text}
              </div>
            )}
          </Container>
        </Band>
      );
    }

    default:
      return <GenericSection section={section} prevWhite={prevWhite} />;
  }
}
