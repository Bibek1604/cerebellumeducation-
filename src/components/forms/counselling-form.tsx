"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, MonitorSmartphone, Phone, Send, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  ANOTHER_COUNTRY,
  counsellingModes,
  counsellingSchema,
  intakeOptions,
  NOT_SURE,
  qualificationOptions,
  type CounsellingInput,
  type CounsellingValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import { FieldShell, SelectInput, TextArea, TextInput } from "./fields";
import { ConsentField, Honeypot } from "./consent-and-honeypot";
import { FormError, FormSuccess, postEnquiry, type SubmitState } from "./form-status";

/** `value` is the submitted label; `slug` matches URL params; `destinations` are country slugs offering it. */
export type ProgrammeOption = { value: string; slug: string; destinations: string[] };
export type CountryOption = { value: string; slug: string };

const modeIcons = { "in-person": Users, online: MonitorSmartphone, phone: Phone } as const;

const defaults: CounsellingInput = {
  type: "counselling",
  fullName: "",
  phone: "",
  email: "",
  location: "",
  qualification: "",
  programme: "",
  country: "",
  intake: "",
  mode: "" as CounsellingInput["mode"],
  message: "",
  consent: false,
  website: "",
};

const ALWAYS_ALLOWED = [ANOTHER_COUNTRY, NOT_SURE];

export function CounsellingForm({ programmes, countries }: { programmes: ProgrammeOption[]; countries: CountryOption[] }) {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<CounsellingInput, unknown, CounsellingValues>({
    resolver: zodResolver(counsellingSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const selectedProgramme = useWatch({ control, name: "programme" });

  /** Countries valid for the chosen programme (all countries until one is chosen). */
  const countryOptions = useMemo(() => {
    const prog = programmes.find((p) => p.value === selectedProgramme);
    const list = prog ? countries.filter((c) => prog.destinations.includes(c.slug)) : countries;
    return [...list.map((c) => c.value), ...ALWAYS_ALLOWED];
  }, [programmes, countries, selectedProgramme]);

  // Clear the destination when it is no longer offered for the chosen programme.
  useEffect(() => {
    const current = getValues("country");
    if (current && !countryOptions.includes(current)) setValue("country", "", { shouldValidate: false });
  }, [countryOptions, getValues, setValue]);

  // Pre-fill from ?programme=md&country=georgia&intake=…&mode=online (e.g. the homepage widget).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = programmes.find((o) => o.slug === params.get("programme"));
    const c = countries.find((o) => o.slug === params.get("country"));
    const intake = intakeOptions.find((o) => o === params.get("intake"));
    const mode = counsellingModes.find((m) => m.value === params.get("mode"));
    if (p) setValue("programme", p.value);
    if (c && (!p || p.destinations.includes(c.slug))) setValue("country", c.value);
    if (intake) setValue("intake", intake);
    if (mode) setValue("mode", mode.label);
  }, [programmes, countries, setValue]);

  const onSubmit = async (values: CounsellingValues) => {
    setState({ status: "idle" });
    const result = await postEnquiry(values);
    setState(result);
    if (result.status === "success") reset(defaults);
  };

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Thank you, we've received your enquiry"
        body="A counsellor will contact you using the details you provided. Please keep your phone and email handy."
        onReset={() => setState({ status: "idle" })}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative space-y-6" aria-describedby="form-required-note">
      <p id="form-required-note" className="text-sm text-ink-soft">
        Fields marked <span className="text-accent">*</span> are required. We&apos;ll never ask for documents at this stage.
      </p>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-bold text-navy">About you</legend>
        <FieldShell id="fullName" label="Full name" required error={errors.fullName?.message} className="sm:col-span-2">
          <TextInput id="fullName" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
        </FieldShell>
        <FieldShell id="phone" label="Phone number" required error={errors.phone?.message} hint="Include your country code, e.g. +977">
          <TextInput
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+977 98XXXXXXXX"
            error={errors.phone?.message}
            hint="Include your country code, e.g. +977"
            {...register("phone")}
          />
        </FieldShell>
        <FieldShell id="email" label="Email address" required error={errors.email?.message}>
          <TextInput id="email" type="email" inputMode="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
        </FieldShell>
        <FieldShell id="location" label="Current location" required error={errors.location?.message} hint="City and country">
          <TextInput id="location" autoComplete="address-level2" placeholder="e.g. Kathmandu, Nepal" error={errors.location?.message} hint="City and country" {...register("location")} />
        </FieldShell>
        <FieldShell id="qualification" label="Current academic qualification" required error={errors.qualification?.message}>
          <SelectInput id="qualification" placeholder="Select qualification" options={qualificationOptions} error={errors.qualification?.message} {...register("qualification")} />
        </FieldShell>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-4 font-display text-lg font-bold text-navy">Your study plans</legend>
        <FieldShell id="programme" label="Interested programme" required error={errors.programme?.message}>
          <Controller
            control={control}
            name="programme"
            render={({ field }) => (
              <SelectInput
                id="programme"
                placeholder="Select programme"
                options={[...programmes.map((p) => p.value), NOT_SURE]}
                error={errors.programme?.message}
                {...field}
              />
            )}
          />
        </FieldShell>
        <FieldShell
          id="country"
          label="Preferred country"
          required
          error={errors.country?.message}
          hint={selectedProgramme && selectedProgramme !== NOT_SURE ? "Showing countries where this programme is available" : undefined}
        >
          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <SelectInput id="country" placeholder="Select country" options={countryOptions} error={errors.country?.message} {...field} />
            )}
          />
        </FieldShell>
        <FieldShell id="intake" label="Expected intake" required error={errors.intake?.message} className="sm:col-span-2">
          <SelectInput id="intake" placeholder="Select expected intake" options={intakeOptions} error={errors.intake?.message} {...register("intake")} />
        </FieldShell>

        <fieldset className="sm:col-span-2" aria-describedby={errors.mode ? "mode-error" : undefined}>
          <legend className="mb-2 block text-sm font-semibold text-navy">
            Counselling mode<span aria-hidden className="ml-0.5 text-accent">*</span>
          </legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {counsellingModes.map((m) => {
              const Icon = modeIcons[m.value];
              return (
                <label key={m.value} className="relative cursor-pointer">
                  <input type="radio" value={m.label} className="peer sr-only" {...register("mode")} />
                  <span
                    className={cn(
                      "flex h-12 items-center justify-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold text-navy transition-all",
                      "peer-checked:border-primary peer-checked:bg-primary-light peer-checked:text-primary-dark",
                      "peer-focus-visible:ring-4 peer-focus-visible:ring-primary/20",
                      errors.mode ? "border-red-500" : "border-line hover:border-primary/50",
                    )}
                  >
                    <Icon aria-hidden className="size-4" /> {m.label}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.mode && (
            <p id="mode-error" role="alert" className="mt-1.5 text-sm font-medium text-red-600">
              {errors.mode.message}
            </p>
          )}
        </fieldset>

        <FieldShell id="message" label="Message" error={errors.message?.message} className="sm:col-span-2">
          <TextArea id="message" rows={4} placeholder="Anything you'd like us to know, questions, budget, concerns…" error={errors.message?.message} {...register("message")} />
        </FieldShell>
      </fieldset>

      <Honeypot registration={register("website")} />
      {/* Spam protection: render a Turnstile widget here and set `captchaToken` — see src/lib/enquiry-delivery.ts */}

      <ConsentField id="consent" registration={register("consent")} error={errors.consent?.message} />

      <FormError state={state} />

      <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <LoaderCircle aria-hidden className="size-5 animate-spin" /> Sending…
          </>
        ) : (
          <>
            Request free counselling <Send aria-hidden className="size-4" />
          </>
        )}
      </Button>
    </form>
  );
}
