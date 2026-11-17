import { CalendarCheck, Clock, FileX, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { CounsellingForm } from "@/components/forms/counselling-form";
import { ContactChannels } from "@/components/sections/contact-channels";
import { destinations } from "@/data/destinations";
import { destinationsForProgramme, programmes } from "@/data/programmes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book Free Medical Admission Counselling",
  description:
    "Book a free, no-obligation counselling session about studying MBBS abroad. Get advice on eligibility, destinations, universities and admissions.",
  path: "/book-counselling",
});

const expectations = [
  { icon: CalendarCheck, title: "Free & no obligation", text: "Your first consultation costs nothing and commits you to nothing." },
  { icon: Clock, title: "A real conversation", text: "We listen first: your goals, results, budget and concerns." },
  { icon: ShieldCheck, title: "Honest advice", text: "We'll tell you plainly if a route isn't right for you." },
  { icon: FileX, title: "No documents yet", text: "We don't ask for passports or certificates at this stage." },
];

export default function BookCounsellingPage() {
  return (
    <>
      <PageHero
        title="Let's talk about your medical future"
        description="Share a few details and a counsellor will contact you to arrange a free session, in person, by phone or online."
        crumbs={[{ label: "Book Free Counselling", href: "/book-counselling" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
              <CounsellingForm
                programmes={programmes.map((p) => ({
                  value: p.name,
                  slug: p.slug,
                  destinations: destinationsForProgramme(p.slug).map((d) => d.slug),
                }))}
                countries={destinations.map((d) => ({ value: d.name, slug: d.slug }))}
              />
            </div>
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-3xl bg-navy p-7 text-white/75">
                <h2 className="text-lg font-extrabold text-white">What to expect</h2>
                <ul className="mt-5 space-y-5">
                  {expectations.map((e) => (
                    <li key={e.title} className="flex gap-4">
                      <e.icon aria-hidden className="mt-0.5 size-5 shrink-0 text-gold" />
                      <div>
                        <p className="font-semibold text-white">{e.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed">{e.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <ContactChannels heading="Prefer to talk now?" />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
