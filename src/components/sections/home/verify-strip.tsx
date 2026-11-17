import { ExternalLink, ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { globalSources } from "@/data/sources";

/** Trust/safety notice — the education-consultancy equivalent of a clinic's emergency strip. */
export function VerifyStrip() {
  return (
    <section className="bg-white pb-12">
      <Container>
        <div className="flex flex-col gap-5 rounded-[1.75rem] border border-gold/40 bg-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold text-navy">
              <ShieldAlert aria-hidden className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">Before you pay any fees, verify the university.</h2>
              <p className="mt-1 max-w-2xl leading-relaxed text-ink">
                Check its listing in the World Directory of Medical Schools and your home regulator&apos;s rules. Be wary of
                anyone who guarantees admission, a visa or a licence.
              </p>
            </div>
          </div>
          <a
            href={globalSources.wdoms.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
          >
            Search WDOMS <ExternalLink aria-hidden className="size-4" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </div>
      </Container>
    </section>
  );
}
