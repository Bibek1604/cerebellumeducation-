import { Fragment } from "react";

/**
 * Renders "Guiding future doctors *with clarity and care*": text wrapped in
 * *asterisks* gets the brand gradient, exactly like the original headings.
 */
export function Highlight({ text, className = "text-brand-gradient" }: { text: string; className?: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") && p.length > 2 ? (
          <span key={i} className={className}>
            {p.slice(1, -1)}
          </span>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Same text without the markers, for places that can't show styling. */
export function plainText(text: string) {
  return text.replace(/\*([^*]+)\*/g, "$1");
}
