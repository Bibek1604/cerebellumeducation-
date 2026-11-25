import { Suspense } from "react";
import { AdminShell } from "@/components/admin/shell";
import { envAdminInfo, requireAdmin } from "@/cms/auth";
import { listAdmins } from "@/cms/store";
import { AddAdminForm, ChangePasswordForm, RemoveAdminButton } from "./user-forms";

export const metadata = { title: "Admin users" };

export default function UsersPage() {
  return (
    <Suspense fallback={<p className="p-8 text-sm text-ink-soft">Loading…</p>}>
      <Users />
    </Suspense>
  );
}

async function Users() {
  const me = await requireAdmin();
  const admins = await listAdmins();
  const envAdmin = envAdminInfo();
  const fmt = (iso: string | null) => (iso ? new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "Never");

  return (
    <AdminShell active="users">
      <h1 className="text-2xl font-bold sm:text-3xl">Admin users</h1>
      <p className="mt-1 text-ink">People who can sign in and edit the website.</p>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white shadow-soft">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="border-b border-line bg-muted/50 text-xs text-ink-soft">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Name</th>
              <th scope="col" className="px-4 py-3 font-semibold">Email</th>
              <th scope="col" className="px-4 py-3 font-semibold">Last sign-in</th>
              <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {envAdmin && (
              <tr>
                <td className="px-4 py-3 font-semibold text-navy">
                  {envAdmin.name} {envAdmin.id === me.id && <span className="ml-1 rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary">You</span>}
                </td>
                <td className="px-4 py-3 text-ink">{envAdmin.email}</td>
                <td className="px-4 py-3 text-ink-soft" colSpan={2}>Set in the server&apos;s .env (ADMIN_EMAIL / ADMIN_PASSWORD)</td>
              </tr>
            )}
            {admins.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold text-navy">
                  {a.name} {a.id === me.id && <span className="ml-1 rounded-full bg-primary-light px-2 py-0.5 text-xs text-primary">You</span>}
                </td>
                <td className="px-4 py-3 text-ink">{a.email}</td>
                <td className="px-4 py-3 text-ink-soft">{fmt(a.lastLoginAt)}</td>
                <td className="px-4 py-3 text-right">{a.id !== me.id && <RemoveAdminButton id={a.id} name={a.name} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold">Add an admin</h2>
          <AddAdminForm />
        </section>
        <section className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
          <h2 className="text-lg font-bold">Change your password</h2>
          <ChangePasswordForm />
        </section>
      </div>
    </AdminShell>
  );
}
