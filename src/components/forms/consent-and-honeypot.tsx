import Link from "next/link";
import type { UseFormRegisterReturn } from "react-hook-form";

export function Honeypot({ registration }: { registration: UseFormRegisterReturn }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Leave this field empty
        <input type="text" tabIndex={-1} autoComplete="off" {...registration} />
      </label>
    </div>
  );
}

export function ConsentField({ id, registration, error }: { id: string; registration: UseFormRegisterReturn; error?: string }) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 size-5 shrink-0 cursor-pointer rounded border-line accent-[var(--brand-primary)]"
          {...registration}
        />
        <label htmlFor={id} className="cursor-pointer text-sm leading-relaxed text-ink">
          I agree that Cerebellum Education Network may store my details and contact me about my enquiry, as described in
          the{" "}
          <Link href="/privacy-policy" target="_blank" className="font-semibold text-primary underline underline-offset-2">
            privacy policy
          </Link>
          .<span aria-hidden className="ml-0.5 text-accent">*</span>
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 ml-8 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
