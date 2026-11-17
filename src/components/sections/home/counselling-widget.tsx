"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, MonitorSmartphone, Phone, Users } from "lucide-react";
import { useId, useMemo, useState } from "react";
import type { counsellingModes } from "@/lib/validations";
import { cn } from "@/lib/utils";

type Option = { slug: string; name: string };
type ProgrammeOption = Option & { destinations: string[] };
type Mode = (typeof counsellingModes)[number]["value"];

const modes = [
  { v: "in-person", label: "In person", icon: Users },
  { v: "online", label: "Online", icon: MonitorSmartphone },
  { v: "phone", label: "Phone", icon: Phone },
] as const satisfies readonly { v: Mode; label: string; icon: unknown }[];

/**
 * Hero quick-start: three choices, then hands off to /book-counselling with
 * the selections pre-filled. Nothing is submitted from here.
 */
export function CounsellingWidget({
  programmes,
  destinations,
  intakes,
}: {
  programmes: ProgrammeOption[];
  destinations: Option[];
  intakes: readonly string[];
}) {
  const router = useRouter();
  const id = useId();
  const [mode, setMode] = useState<Mode>("in-person");
  const [programme, setProgramme] = useState("");
  const [country, setCountry] = useState("");

  // Only offer destinations where the chosen programme is available.
  const destinationOptions = useMemo(() => {
    const prog = programmes.find((p) => p.slug === programme);
    return prog ? destinations.filter((d) => prog.destinations.includes(d.slug)) : destinations;
  }, [programmes, destinations, programme]);

  const chooseProgramme = (slug: string) => {
    setProgramme(slug);
    const prog = programmes.find((p) => p.slug === slug);
    if (prog && country && !prog.destinations.includes(country)) setCountry("");
  };
  const [intake, setIntake] = useState("");

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (programme) q.set("programme", programme);
    if (country) q.set("country", country);
    if (intake) q.set("intake", intake);
    q.set("mode", mode);
    router.push(`/book-counselling?${q.toString()}`);
  };

  const selectCls =
    "h-12 w-full appearance-none rounded-xl border border-line bg-white pr-10 pl-4 text-[0.95rem] text-navy focus:border-primary focus:ring-4 focus:ring-primary/15 focus:outline-none";

  const steps = [
    { label: "Programme", value: programme, set: chooseProgramme, options: programmes, placeholder: "Choose a programme" },
    { label: "Destination", value: country, set: setCountry, options: destinationOptions, placeholder: "Any / not sure", optional: true },
    {
      label: "Intake",
      value: intake,
      set: setIntake,
      options: intakes.map((t) => ({ slug: t, name: t })),
      placeholder: "When do you plan to start?",
    },
  ];

  return (
    <form onSubmit={go} className="rounded-[1.75rem] border border-line bg-white p-5 shadow-lift sm:p-7" aria-labelledby={`${id}-title`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id={`${id}-title`} className="text-xl font-extrabold">
            Book your free counselling
          </h2>
          <p className="mt-1 text-sm text-ink-soft">Three quick choices so we can prepare for your conversation.</p>
        </div>
        <fieldset className="inline-flex rounded-full bg-muted p-1">
          <legend className="sr-only">Counselling mode</legend>
          {modes.map((m) => (
            <label key={m.v} className="relative cursor-pointer">
              <input
                type="radio"
                name={`${id}-mode`}
                value={m.v}
                checked={mode === m.v}
                onChange={() => setMode(m.v)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-all peer-focus-visible:ring-2 peer-focus-visible:ring-primary",
                  mode === m.v ? "bg-primary text-white shadow-soft" : "text-navy hover:text-primary",
                )}
              >
                <m.icon aria-hidden className="size-4" /> {m.label}
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
        {steps.map((s, i) => (
          <label key={s.label} className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-navy">
              <span className="grid size-6 place-items-center rounded-full bg-gold text-xs font-extrabold text-navy">{i + 1}</span>
              {s.label}
              {s.optional && <span className="text-xs font-normal text-ink-soft">(optional)</span>}
            </span>
            <span className="relative block">
              <select value={s.value} onChange={(e) => s.set(e.target.value)} className={selectCls}>
                <option value="">{s.placeholder}</option>
                {s.options.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.name}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-ink-soft" />
            </span>
          </label>
        ))}
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 font-semibold text-white shadow-[0_8px_20px_-8px_var(--brand-primary)] transition-colors hover:bg-primary-dark"
        >
          Continue <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>

      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-xs text-ink-soft">
        <li>✓ First consultation is free</li>
        <li>✓ Parents welcome to join</li>
        <li>✓ No documents needed at this stage</li>
      </ul>
    </form>
  );
}
