import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Database, FileText, HardDrive, Settings2 } from "lucide-react";
import { AdminShell, slugOf } from "@/components/admin/shell";
import { requireAdmin } from "@/cms/auth";
import { pages, settings } from "@/cms/schema";
import { readContent, usingDatabase } from "@/cms/store";

export const metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-ink-soft">Loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function lastSaved(key: string) {
  try {
    const r = await readContent(key);
    return r ? `Edited ${new Date(r.updatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}${r.updatedBy ? ` by ${r.updatedBy}` : ""}` : "Original content";
  } catch {
    return "Status unavailable";
  }
}

async function Dashboard() {
  const admin = await requireAdmin();
  const [pageStatus, settingStatus] = await Promise.all([Promise.all(pages.map((p) => lastSaved(p.key))), Promise.all(settings.map((s) => lastSaved(s.key)))]);

  const card = (href: string, title: string, desc: string, status: string) => (
    <li key={href}>
      <Link href={href} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lift">
        <span className="font-bold text-navy">{title}</span>
        <span className="mt-1 text-sm text-ink">{desc}</span>
        <span className="mt-auto flex items-center justify-between pt-4 text-xs text-ink-soft">
          {status}
          <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </li>
  );

  return (
    <AdminShell admin={admin} active="dashboard">
      <h1 className="text-2xl font-bold sm:text-3xl">Welcome, {admin.name.split(" ")[0]}</h1>
      <p className="mt-1 text-ink">Edit page content, show or hide sections, and manage shared details used across the website.</p>

      <div className={`mt-5 flex items-start gap-3 rounded-2xl p-4 text-sm ${usingDatabase ? "bg-primary-light text-navy" : "bg-gold-light text-navy"}`}>
        {usingDatabase ? <Database className="mt-0.5 size-5 shrink-0 text-primary" /> : <HardDrive className="mt-0.5 size-5 shrink-0 text-gold-dark" />}
        <p>
          {usingDatabase ? (
            <>Content is saved in your <strong>PostgreSQL</strong> database.</>
          ) : (
            <>
              Content is saved in <strong>local files</strong> on this server (<code>.data</code> folder). Add <code>DATABASE_URL</code> to switch to
              PostgreSQL.
            </>
          )}
        </p>
      </div>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
        <FileText className="size-5 text-primary" /> Pages
      </h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((p, i) => card(`/admin/pages/${slugOf(p.key)}`, p.title, `Sections, text, images and visibility for ${p.path}.`, pageStatus[i]!))}
      </ul>

      <h2 className="mt-8 flex items-center gap-2 text-lg font-bold">
        <Settings2 className="size-5 text-primary" /> Shared content
      </h2>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {settings.map((s, i) => card(`/admin/settings/${slugOf(s.key)}`, s.title, s.description, settingStatus[i]!))}
      </ul>
    </AdminShell>
  );
}
