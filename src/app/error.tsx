"use client";

import { ErrorPanel } from "@/components/ui/error-panel";

/** Shown when a public page fails to load. The header and footer stay in place. */
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="This page didn't load properly"
      text="Something went wrong on our side. Please try again in a moment. If you need help now, you can still reach us by phone or WhatsApp."
    />
  );
}
