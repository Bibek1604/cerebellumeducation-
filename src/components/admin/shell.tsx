import Image from "next/image";
import Link from "next/link";
import { FileText, LogOut, Settings2 } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { pages, settings } from "@/cms/schema";

export const slugOf = (key: string) => key.split(":")[1]!;

/** Admin Panel frame: sidebar navigation + content area. */
export function AdminShell({ active, children }: { active: string; children: React.ReactNode }) {
  const item = (href: string, label: string, isActive: boolean) => (
    <li key={href}>
      <Link
        href={href}
        aria-current={isActive ? "page" : undefined}
        className={`block rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-primary text-white" : "text-navy hover:bg-primary-light"}`}
      >
        {label}
      </Link>
    </li>
  );

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16rem_1fr]">
      <aside className="border-b border-line bg-white lg:sticky lg:top-0 lg:h-dvh lg:overflow-y-auto lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3 p-4 lg:block">
          <Link href="/admin" className="flex items-center gap-2">
            <Image src="/logos/cerebellum-emblem.png" alt="" width={36} height={36} />
            <span className="leading-tight">
              <span className="block font-display font-bold text-navy">Cerebellum</span>
              <span className="block text-xs font-semibold text-ink-soft">Admin Panel</span>
            </span>
          </Link>
          <form action={logoutAction} className="lg:hidden">
            <button className="rounded-full px-3 py-1.5 text-sm font-semibold text-ink-soft hover:bg-muted">Log out</button>
          </form>
        </div>
        <nav aria-label="Admin" className="space-y-5 px-3 pb-4">
          <ul>{item("/admin", "Dashboard", active === "dashboard")}</ul>
          <div>
            <p className="mb-1 flex items-center gap-1.5 px-3 text-xs font-bold text-ink-soft">
              <FileText className="size-3.5" /> Pages
            </p>
            <ul className="space-y-0.5">{pages.map((p) => item(`/admin/pages/${slugOf(p.key)}`, p.title, active === p.key))}</ul>
          </div>
          <div>
            <p className="mb-1 flex items-center gap-1.5 px-3 text-xs font-bold text-ink-soft">
              <Settings2 className="size-3.5" /> Shared content
            </p>
            <ul className="space-y-0.5">{settings.map((s) => item(`/admin/settings/${slugOf(s.key)}`, s.title, active === s.key))}</ul>
          </div>
          <ul className="space-y-0.5 border-t border-line pt-4">
            {item("/admin/users", "Admin users", active === "users")}
          </ul>
        </nav>
        <div className="hidden border-t border-line p-4 lg:block">
          <form action={logoutAction}>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-semibold text-navy hover:bg-muted">
              <LogOut className="size-4" /> Log out
            </button>
          </form>
        </div>
      </aside>
      <main id="admin-main" className="min-w-0 px-4 py-6 sm:px-8">
        {children}
      </main>
    </div>
  );
}

