import { ExternalLink, ShieldCheck } from "lucide-react";
import { formatChecked, indiaGuidance, nepalGuidance } from "@/data/nepal-guidance";
import { cn } from "@/lib/utils";

/**
 * "Before you apply (Nepal)" — home-country requirements for Nepali students,
 * with a short note for Indian students. Used on /admission-process,
 * medical programme pages and every destination page.
 */
export function BeforeYouApply({ className, showIndia = true }: { className?: string; showIndia?: boolean }) {
  const checked = formatChecked(nepalGuidance.lastChecked);
  return (
    <section aria-labelledby="before-you-apply-title" className={cn("rounded-[2rem] border border-gold/40 bg-cream p-6 sm:p-9", className)}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid size-11 place-items-center rounded-xl bg-navy font-display text-sm font-extrabold text-gold">NP</span>
        <h2 id="before-you-apply-title" className="text-xl font-extrabold sm:text-2xl">
          {nepalGuidance.title}
        </h2>
      </div>
      <ol className="mt-6 space-y-3">
        {nepalGuidance.points.map((p, i) => (
          <li key={p} className="flex gap-3 leading-relaxed text-ink">
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-gold text-xs font-extrabold text-navy">{i + 1}</span>
            {p}
          </li>
        ))}
      </ol>

      <ul className="mt-6 flex flex-wrap gap-2">
        {nepalGuidance.sources.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-sm font-semibold text-navy ring-1 ring-line hover:text-primary hover:ring-primary"
            >
              {s.label} <ExternalLink aria-hidden className="size-3.5" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-soft">
        <ShieldCheck aria-hidden className="size-3.5" />
        {checked ? `Last checked against official sources on ${checked}.` : "Pending verification against official sources."} Rules can
        change, so always confirm on the official websites.
      </p>

      {showIndia && (
        <div className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-line">
          <h3 className="font-bold">{indiaGuidance.title}</h3>
          {indiaGuidance.points.map((p) => (
            <p key={p} className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">
              {p}{" "}
              {indiaGuidance.sources.map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">
                  {s.label}
                </a>
              ))}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
