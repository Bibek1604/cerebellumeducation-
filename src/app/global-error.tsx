"use client";

import { useEffect } from "react";
import { errorReference } from "@/components/ui/error-panel";

/**
 * Last-resort error page, used only if the root layout itself fails.
 * It replaces the whole document, so it carries its own minimal styling.
 */
export default function GlobalError({ error, retry }: { error: unknown; retry: () => void }) {
  const ref = errorReference(error);
  useEffect(() => console.error(error), [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", background: "#f3f8fd", color: "#123a6b" }}>
        <title>Something went wrong | Cerebellum Education Network</title>
        <main role="alert" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
          <div style={{ maxWidth: 520 }}>
            <h1 style={{ fontSize: 32, margin: "0 0 12px" }}>We&apos;ll be right back</h1>
            <p style={{ fontSize: 18, lineHeight: 1.6, color: "#3c5577", margin: "0 0 28px" }}>
              The website hit an unexpected problem. Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => retry()}
              style={{ background: "#f8820d", color: "#fff", border: 0, borderRadius: 999, padding: "12px 26px", fontSize: 16, fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
            {ref && (
              <p style={{ marginTop: 28, fontSize: 14, color: "#5d7491" }}>
                Reference: <code>{ref}</code>
              </p>
            )}
          </div>
        </main>
      </body>
    </html>
  );
}
