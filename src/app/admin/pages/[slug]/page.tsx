import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";
import { PageEditor } from "@/components/admin/content-editor";
import { requireAdmin } from "@/cms/auth";
import { sanitizePage } from "@/cms/sanitize";
import { getEntry, type PageEntry } from "@/cms/schema";
import { readContent } from "@/cms/store";
import { runtimeOptions } from "@/cms/options";

export const metadata = { title: "Edit page" };

export default function EditPage({ params }: PageProps<"/admin/pages/[slug]">) {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-ink-soft">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}

async function Editor({ params }: { params: PageProps<"/admin/pages/[slug]">["params"] }) {
  const admin = await requireAdmin();
  const { slug } = await params;
  const entry = getEntry(`page:${slug}`);
  if (!entry || entry.type !== "page") notFound();
  // Read straight from storage (not the public cache) so editors always see the latest save.
  const stored = await readContent(entry.key).catch(() => null);
  const initial = stored ? sanitizePage(entry as PageEntry, stored.data) : entry.defaults();
  return (
    <AdminShell admin={admin} active={entry.key}>
      <PageEditor contentKey={entry.key} initial={initial} options={await runtimeOptions()} />
    </AdminShell>
  );
}
