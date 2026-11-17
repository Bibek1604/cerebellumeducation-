import { ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container, Section } from "@/components/ui/container";
import { UniversityCard, UniversityDisclaimer } from "@/components/universities/university-card";
import { UniversityExplorer } from "@/components/universities/university-explorer";
import { OfficialSources } from "@/components/sections/official-sources";
import { CtaBand } from "@/components/sections/cta-band";
import { universities } from "@/data/universities";
import { destinations } from "@/data/destinations";
import { programmes } from "@/data/programmes";
import { globalSources } from "@/data/sources";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "International Medical Universities",
  description:
    "Search international medical universities by destination and programme. Find official websites and guidance on how to compare medical schools abroad.",
  path: "/universities",
});

const checks = [
  "Listed in the World Directory of Medical Schools",
  "Programme meets your home regulator's rules (duration, internship, language)",
  "Size and quality of affiliated teaching hospitals",
  "Language needed for clinical years",
  "Total cost including living expenses",
  "Support for international students",
];

export default function UniversitiesPage() {
  return (
    <>
      <PageHero
        title="Explore international medical universities"
        description="Search and filter institutions by destination and programme. Every listing links to the university's official website so you can verify details at the source."
        crumbs={[{ label: "Universities", href: "/universities" }]}
      />
      <Section>
        <Container>
          {universities.length > 0 ? (
            <UniversityExplorer
              universities={universities.map(({ slug, name, city, country, programmes }) => ({ slug, name, city, country, programmes }))}
              destinations={destinations.map((d) => ({ value: d.slug, label: d.name }))}
              programmes={programmes.map((p) => ({ value: p.slug, label: p.name }))}
              cards={Object.fromEntries(universities.map((u) => [u.slug, <UniversityCard key={u.slug} university={u} />]))}
            />
          ) : (
            <p className="rounded-3xl bg-muted p-10 text-center text-ink">Our university directory is being prepared. Please ask a counsellor about current options.</p>
          )}
          <UniversityDisclaimer className="mt-10 max-w-3xl text-sm leading-relaxed text-ink-soft" />
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">How to compare medical universities</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink">
                For a medical degree, rankings matter far less than whether the programme fits your goals and meets your home
                regulator&apos;s requirements. Use this checklist, and verify everything with official sources.
              </p>
              <div className="mt-8">
                <OfficialSources sources={[globalSources.wdoms, globalSources.wfme]} title="Useful directories" />
              </div>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {checks.map((c) => (
                <li key={c} className="flex gap-3 rounded-2xl border border-line bg-white p-5">
                  <ShieldCheck aria-hidden className="size-5 shrink-0 text-primary" />
                  <span className="font-semibold text-navy">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
      <div className="pt-20 sm:pt-24 lg:pt-28">
        <CtaBand title="Need help shortlisting universities?" description="We'll build a shortlist around your profile using official information, free of charge." />
      </div>
    </>
  );
}
