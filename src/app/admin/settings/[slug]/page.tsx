import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";
import { SettingsEditor } from "@/components/admin/content-editor";
import { requireAdmin } from "@/cms/auth";
import { sanitizeSettings } from "@/cms/sanitize";
import { getEntry, type SettingsEntry } from "@/cms/schema";
import { readContent } from "@/cms/store";
import { runtimeOptions } from "@/cms/options";

export const metadata = { title: "Edit shared content" };

export default function EditSettings({ params }: PageProps<"/admin/settings/[slug]">) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-ink-soft">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/settings/[slug]">["params"] }) {
  const admin = await requireAdmin();
  const { slug } = await params;
  const entry = getEntry(`settings:${slug}`);
  if (!entry || entry.type !== "settings") notFound();
  const stored = await readContent(entry.key).catch(() => null);
  const initial = stored ? sanitizeSettings(entry as SettingsEntry, stored.data) : entry.defaults();
  return (
    <AdminShell admin={admin} active={entry.key}>
      <SettingsEditor contentKey={entry.key} initial={initial} options={await runtimeOptions()} />
    </AdminShell>
  );
}
