"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Languages, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export type QuizDestination = {
  slug: string;
  name: string;
  programmes: string[];
  /** True when clinical years involve a local language (from the destination's "medium" notes). */
  localLanguage: boolean;
  medium: string;
  duration: string;
  image?: { src: string; alt: string };
};
type Option = { value: string; label: string };

/**
 * "Find your best-fit country": two questions, then a shortlist built only
 * from the site's own destination data. A starting point for counselling,
 * not an eligibility decision.
 */
export function CountryQuiz({ destinations, programmes }: { destinations: QuizDestination[]; programmes: Option[] }) {
  const [programme, setProgramme] = useState<string | null>(null);
  const [language, setLanguage] = useState<"english" | "open" | null>(null);
  const step = programme === null ? 0 : language === null ? 1 : 2;

  const results = useMemo(() => {
    if (step < 2) return [];
    return destinations
      .filter((d) => programme === "any" || d.programmes.includes(programme!))
      .filter((d) => language === "open" || !d.localLanguage);
  }, [destinations, programme, language, step]);

  const reset = () => {
    setProgramme(null);
    setLanguage(null);
  };

  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-[2rem] border border-line bg-white p-5 shadow-lift sm:p-8 lg:p-10">
      {/* Progress */}
      <ol className="flex items-center gap-2 text-sm font-semibold" aria-label="Quiz progress">
        {["Programme", "Language", "Your shortlist"].map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                i < step ? "bg-primary text-white" : i === step ? "bg-orange-fill text-white" : "bg-muted text-ink-soft",
              )}
            >
              {i < step ? <Check className="size-3.5" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("hidden sm:inline", i === step ? "text-navy" : "text-ink-soft")}>{label}</span>
            {i < 2 && <span aria-hidden className={cn("h-0.5 flex-1 rounded-full", i < step ? "bg-primary" : "bg-line")} />}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.25 }}
          className="mt-8"
          aria-live="polite"
        >
          {step === 0 && (
            <fieldset>
              <legend className="font-display text-2xl font-bold text-navy">Which programme are you interested in?</legend>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {[...programmes, { value: "any", label: "Not sure yet" }].map((p) => (
                  <Choice key={p.value} onClick={() => setProgramme(p.value)}>
                    {p.label}
                  </Choice>
                ))}
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <fieldset>
              <legend className="font-display text-2xl font-bold text-navy">How do you feel about learning a new language?</legend>
              <p className="mt-2 text-ink">In some countries, clinical training with patients happens in the local language.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Choice onClick={() => setLanguage("english")}>
                  <span className="block font-bold">English only, please</span>
                  <span className="text-sm font-normal text-ink-soft">Show countries where study is in English</span>
                </Choice>
                <Choice onClick={() => setLanguage("open")}>
                  <span className="block font-bold">Happy to learn one</span>
                  <span className="text-sm font-normal text-ink-soft">Include Mandarin, Russian or Kazakh settings</span>
                </Choice>
              </div>
              <button type="button" onClick={() => setProgramme(null)} className="mt-5 text-sm font-semibold text-primary hover:underline">
                ← Back
              </button>
            </fieldset>
          )}

          {step === 2 && (
            <div>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="inline-flex items-center gap-2 font-display text-2xl font-bold text-navy">
                    <Sparkles aria-hidden className="size-6 text-gold" />
                    {results.length > 0 ? `Your starting shortlist: ${results.length} ${results.length === 1 ? "country" : "countries"}` : "No exact match"}
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Based only on programme and language. Eligibility, costs and recognition need a counsellor&apos;s check.
                  </p>
                </div>
                <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  <RotateCcw aria-hidden className="size-4" /> Start again
                </button>
              </div>

              {results.length > 0 ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {results.map((d) => (
                    <li key={d.slug}>
                      <Link href={`/destinations/${d.slug}`} className="group block h-full overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-lift">
                        {d.image && (
                          <Image src={d.image.src} alt={d.image.alt} width={600} height={360} sizes="(min-width: 1024px) 20vw, 50vw" className="aspect-[16/9] w-full object-cover" />
                        )}
                        <div className="p-4">
                          <p className="font-display text-lg font-bold text-navy">{d.name}</p>
                          <p className="mt-1 flex gap-1.5 text-sm text-ink">
                            <Languages aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                            <span className="line-clamp-2">{d.medium}</span>
                          </p>
                          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary">
                            Explore {d.name} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 rounded-2xl bg-muted p-5 text-ink">
                  None of our current destinations offers this combination. A counsellor can talk you through alternatives,
                  including whether learning a language could open more options.
                </p>
              )}

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/book-counselling?${new URLSearchParams({
                    ...(programme && programme !== "any" ? { programme } : {}),
                    ...(results.length === 1 ? { country: results[0]!.slug } : {}),
                  }).toString()}`}
                  className="inline-flex items-center gap-2 rounded-full bg-orange-fill px-6 py-3 font-bold text-white shadow-soft"
                >
                  Talk to a counsellor about this shortlist <ArrowRight aria-hidden className="size-4" />
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Choice({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border-2 border-line bg-white px-5 py-4 text-left font-semibold text-navy transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-primary-light focus-visible:border-primary"
    >
      {children}
    </button>
  );
}
