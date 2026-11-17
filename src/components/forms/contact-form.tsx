"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { contactSchema, type ContactInput, type ContactValues } from "@/lib/validations";
import { FieldShell, TextArea, TextInput } from "./fields";
import { ConsentField, Honeypot } from "./consent-and-honeypot";
import { FormError, FormSuccess, postEnquiry, type SubmitState } from "./form-status";

const defaults: ContactInput = {
  type: "contact",
  fullName: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
  consent: false,
  website: "",
};

export function ContactForm() {
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput, unknown, ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaults,
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactValues) => {
    setState({ status: "idle" });
    const result = await postEnquiry(values);
    setState(result);
    if (result.status === "success") reset(defaults);
  };

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Message received"
        body="Thank you for getting in touch. A member of our team will reply as soon as possible."
        onReset={() => setState({ status: "idle" })}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="relative grid gap-5 sm:grid-cols-2">
      <FieldShell id="c-fullName" label="Full name" required error={errors.fullName?.message} className="sm:col-span-2">
        <TextInput id="c-fullName" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
      </FieldShell>
      <FieldShell id="c-phone" label="Phone number" required error={errors.phone?.message}>
        <TextInput id="c-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+977 98XXXXXXXX" error={errors.phone?.message} {...register("phone")} />
      </FieldShell>
      <FieldShell id="c-email" label="Email address" required error={errors.email?.message}>
        <TextInput id="c-email" type="email" inputMode="email" autoComplete="email" error={errors.email?.message} {...register("email")} />
      </FieldShell>
      <FieldShell id="c-subject" label="Subject" required error={errors.subject?.message} className="sm:col-span-2">
        <TextInput id="c-subject" error={errors.subject?.message} {...register("subject")} />
      </FieldShell>
      <FieldShell id="c-message" label="Message" required error={errors.message?.message} className="sm:col-span-2">
        <TextArea id="c-message" rows={5} error={errors.message?.message} {...register("message")} />
      </FieldShell>

      <Honeypot registration={register("website")} />

      <div className="sm:col-span-2">
        <ConsentField id="c-consent" registration={register("consent")} error={errors.consent?.message} />
      </div>
      <div className="sm:col-span-2">
        <FormError state={state} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <Send aria-hidden className="size-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
