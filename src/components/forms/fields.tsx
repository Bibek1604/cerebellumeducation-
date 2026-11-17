import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "block w-full rounded-xl border bg-white px-4 text-base text-navy placeholder:text-ink-soft/70 transition-colors focus:outline-none focus:ring-4";
const ok = "border-line focus:border-primary focus:ring-primary/15";
const bad = "border-red-500 focus:border-red-600 focus:ring-red-500/15";

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function FieldShell({ id, label, error, hint, required, className, children }: FieldShellProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-navy">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-accent">
            *
          </span>
        ) : (
          <span className="ml-1.5 text-xs font-normal text-ink-soft">(optional)</span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  return error ? `${id}-error` : hint ? `${id}-hint` : undefined;
}

type InputProps = React.ComponentProps<"input"> & { id: string; error?: string; hint?: string };

export const TextInput = forwardRef<HTMLInputElement, InputProps>(function TextInput({ id, error, hint, className, ...props }, ref) {
  return (
    <input
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(control, "h-12", error ? bad : ok, className)}
      {...props}
    />
  );
});

type SelectProps = React.ComponentProps<"select"> & { id: string; error?: string; options: readonly string[]; placeholder: string };

export const SelectInput = forwardRef<HTMLSelectElement, SelectProps>(function SelectInput(
  { id, error, options, placeholder, className, ...props },
  ref,
) {
  return (
    <div className="relative">
      <select
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error)}
        className={cn(control, "h-12 appearance-none pr-11", error ? bad : ok, className)}
        defaultValue={props.value === undefined ? "" : undefined}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-ink-soft" />
    </div>
  );
});

type TextareaProps = React.ComponentProps<"textarea"> & { id: string; error?: string; hint?: string };

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextArea({ id, error, hint, className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      id={id}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy(id, error, hint)}
      className={cn(control, "min-h-32 py-3", error ? bad : ok, className)}
      {...props}
    />
  );
});
