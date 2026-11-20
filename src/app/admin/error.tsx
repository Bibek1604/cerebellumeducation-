"use client";

import { ErrorPanel } from "@/components/ui/error-panel";

/** Shown when an Admin Panel screen fails. Unsaved edits on that screen may need re-entering. */
export default function AdminError({ error, retry }: { error: unknown; retry: () => void }) {
  return (
    <ErrorPanel
      error={error}
      retry={retry}
      title="The Admin Panel hit a problem"
      text="This screen couldn't be loaded. Your published website is not affected. If the problem continues, check that the database is reachable and look up the reference below in the server log."
      homeHref="/admin"
      homeLabel="Back to dashboard"
    />
  );
}
