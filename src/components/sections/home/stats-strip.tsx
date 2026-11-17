import { Container } from "@/components/ui/container";
import { CountUp } from "@/components/ui/count-up";
import { FoliaArcs } from "@/components/brand/folia";
import { destinations } from "@/data/destinations";
import { programmes } from "@/data/programmes";
import { admissionSteps } from "@/data/process";

/**
 * Counters derived from the site's own data — never invented business
 * figures. Add verified figures (e.g. students guided) here only when the
 * consultancy can substantiate them.
 */
export function StatsStrip() {
  const stats = [
    { value: destinations.length, label: "Study destinations", note: "Compared side by side" },
    { value: programmes.length, label: "Healthcare programmes", note: "From MBBS to nursing" },
    { value: admissionSteps.length, label: "Guided admission steps", note: "Counselling to campus" },
    { value: 1, label: "Dedicated counsellor", note: "Throughout your journey" },
  ];
  return (
    <section className="bg-white pb-20 sm:pb-24">
      <Container>
        <div className="bg-brand-gradient relative isolate overflow-hidden rounded-[2.5rem] px-6 py-12 sm:px-12">
          <FoliaArcs className="absolute -right-20 -bottom-10 -z-10 w-[40rem] text-white/10" rings={8} />
          <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-white/15">
            {stats.map((s) => (
              <div key={s.label} className="px-2 text-center lg:px-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block font-display text-5xl font-extrabold text-gold sm:text-6xl">
                    <CountUp value={s.value} />
                  </span>
                  <span aria-hidden className="mt-2 block font-display text-base font-bold text-white sm:text-lg">{s.label}</span>
                  <span className="mt-1 block text-sm text-white/65">{s.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
