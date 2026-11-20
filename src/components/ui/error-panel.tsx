"use client";

import Link from "next/link";
import { useEffect } from "react";
import { House, RotateCw } from "lucide-react";

/** Reference shown to visitors so a report can be matched with the server log. */
export function errorReference(error: unknown): string | null {
  return error && typeof error === "object" && "digest" in error && typeof error.digest === "string" ? error.digest : null;
}

/** Friendly error screen used by the error boundaries. Never shows technical details. */
export function ErrorPanel({
  error,
  retry,
  title,
  text,
  homeHref = "/",
  homeLabel = "Back to home",
}: {
  error: unknown;
  retry: () => void;
  title: string;
  text: string;
  homeHref?: string;
  homeLabel?: string;
}) {
  const ref = errorReference(error);

  useEffect(() => {
    // Visible in the browser console for debugging; the server has already logged the full error.
    console.error(error);
  }, [error]);

  return (
    <section role="alert" className="py-24 text-center sm:py-32">
      <div className="mx-auto max-w-xl px-4">
        <p className="font-display text-6xl font-extrabold text-primary">Oops</p>
        <h1 className="mt-5 text-3xl font-extrabold sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-ink">{text}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => retry()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-fill px-6 py-3 font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            <RotateCw aria-hidden className="size-4" /> Try again
          </button>
          <Link
            href={homeHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white px-6 py-3 font-semibold text-navy transition hover:border-primary hover:text-primary"
          >
            <House aria-hidden className="size-4" /> {homeLabel}
          </Link>
        </div>
        {ref && (
          <p className="mt-8 text-sm text-ink-soft">
            If this keeps happening, please tell us this reference: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-navy">{ref}</code>
          </p>
        )}
      </div>
    </section>
  );
}
