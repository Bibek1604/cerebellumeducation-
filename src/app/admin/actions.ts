"use server";

import { updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearLoginFailures,
  createSession,
  destroySession,
  envAdminLogin,
  getCurrentAdmin,
  hashPassword,
  isEnvAdminId,
  loginBlocked,
  passwordProblem,
  recordLoginFailure,
  requireAdmin,
  verifyPassword,
} from "@/cms/auth";
import { contentTag } from "@/cms/content";
import { sanitizeFor } from "@/cms/sanitize";
import { getEntry } from "@/cms/schema";
import { deleteContent, findAdmin, insertAdmin, listAdmins, readContent, removeAdmin, updateAdmin, writeContent } from "@/cms/store";
import type { ContentKey } from "@/cms/types";
import { audit, logger } from "@/lib/logger";

const log = logger("admin");

/** Shown whenever storage fails; the technical details go to the server log only. */
const STORAGE_ERROR = "The content database could not be reached. Please try again shortly. If it keeps happening, check the server log.";

/* ─────────────────────────────── Login ─────────────────────────────── */

export type LoginState = { error?: string };

export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "").slice(0, 200);
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}|${email}`;

  if (loginBlocked(key)) {
    audit.warn("Sign-in blocked after repeated failures", { admin: email, ip });
    return { error: "Too many attempts. Please wait 15 minutes and try again." };
  }
  if (!email || !password) return { error: "Enter your email and password." };

  // The admin set in ADMIN_EMAIL / ADMIN_PASSWORD signs in without touching the database.
  const envAdmin = envAdminLogin(email, password);
  if (envAdmin !== undefined) {
    if (!envAdmin) {
      recordLoginFailure(key);
      audit.warn("Sign-in failed: wrong email or password", { admin: email, ip });
      return { error: "Incorrect email or password." };
    }
    clearLoginFailures(key);
    try {
      await createSession(envAdmin.id);
    } catch (err) {
      log.error("Sign-in failed: could not create a session (check SESSION_SECRET)", { err });
      return { error: "Sign-in is not set up correctly on the server. Please ask your website administrator to check the SESSION_SECRET setting." };
    }
    audit.info("Signed in (environment admin)", { admin: envAdmin.email, ip });
    redirect("/admin");
  }

  let admin;
  try {
    admin = await findAdmin({ email });
  } catch (err) {
    log.error("Sign-in failed: could not read admin accounts", { err });
    return { error: STORAGE_ERROR };
  }
  const ok = admin ? await verifyPassword(password, admin.passwordHash) : await verifyPassword(password, DUMMY_HASH).then(() => false);
  if (!admin || !ok) {
    recordLoginFailure(key);
    audit.warn("Sign-in failed: wrong email or password", { admin: email, ip });
    return { error: "Incorrect email or password." };
  }
  clearLoginFailures(key);
  try {
    await createSession(admin.id);
  } catch (err) {
    log.error("Sign-in failed: could not create a session (check SESSION_SECRET)", { err });
    return { error: "Sign-in is not set up correctly on the server. Please ask your website administrator to check the SESSION_SECRET setting." };
  }
  // Not critical: a failure here must not block the sign-in.
  await updateAdmin(admin.id, { lastLoginAt: new Date().toISOString() }).catch((err) => log.warn("Could not record last sign-in time", { err }));
  audit.info("Signed in", { admin: admin.email, ip });
  redirect("/admin");
}

/** Spends the same time as a real check when the email doesn't exist. */
const DUMMY_HASH = "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==";

export async function logoutAction() {
  const me = await getCurrentAdmin().catch(() => null);
  await destroySession();
  if (me) audit.info("Signed out", { admin: me.email });
  redirect("/admin/login");
}

/* ─────────────────────────────── Content ─────────────────────────────── */

export type SaveResult = { ok: true; content: unknown; updatedAt: string } | { ok: false; error: string };

function assertKey(key: string): ContentKey | null {
  return getEntry(key) ? (key as ContentKey) : null;
}

export async function saveContentAction(key: string, json: string): Promise<SaveResult> {
  const admin = await requireAdmin();
  const k = assertKey(key);
  if (!k) return { ok: false, error: "This content type doesn't exist. Please reload the page." };
  if (json.length > 2_000_000) return { ok: false, error: "This page has too much content to save in one go. Remove some items and try again." };

  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, error: "The changes could not be read. Please reload the page and try again." };
  }

  try {
    const clean = sanitizeFor(k, parsed);
    await writeContent(k, clean, admin.email);
    updateTag(contentTag(k));
    audit.info("Content saved", { by: admin.email, key: k });
    return { ok: true, content: clean, updatedAt: new Date().toISOString() };
  } catch (err) {
    log.error("Save failed", { by: admin.email, key: k, err });
    return { ok: false, error: `Your changes were not saved. ${STORAGE_ERROR}` };
  }
}

export async function resetContentAction(key: string): Promise<SaveResult> {
  const admin = await requireAdmin();
  const k = assertKey(key);
  if (!k) return { ok: false, error: "This content type doesn't exist. Please reload the page." };
  try {
    await deleteContent(k);
    updateTag(contentTag(k));
    audit.info("Content restored to original", { by: admin.email, key: k });
    return { ok: true, content: getEntry(k)!.defaults(), updatedAt: "" };
  } catch (err) {
    log.error("Restore failed", { by: admin.email, key: k, err });
    return { ok: false, error: `The original content was not restored. ${STORAGE_ERROR}` };
  }
}

/** Last-saved info for the dashboard. */
export async function contentStatus(key: string) {
  await requireAdmin();
  const k = assertKey(key);
  if (!k) return null;
  try {
    const r = await readContent(k);
    return r ? { updatedAt: r.updatedAt, updatedBy: r.updatedBy } : null;
  } catch (err) {
    log.warn("Could not read content status", { key: k, err });
    return null;
  }
}

/* ───────────────────────────── Admin users ───────────────────────────── */

export type UserFormState = { error?: string; success?: string };

export async function createAdminAction(_: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await requireAdmin();
  const name = String(form.get("name") ?? "").trim().slice(0, 80);
  const email = String(form.get("email") ?? "").trim().toLowerCase().slice(0, 200);
  const password = String(form.get("password") ?? "");
  if (!name) return { error: "Enter a name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email address." };
  const problem = passwordProblem(password);
  if (problem) return { error: problem };
  try {
    if (await findAdmin({ email })) return { error: "An admin with this email already exists." };
    await insertAdmin({ email, name, passwordHash: await hashPassword(password) });
  } catch (err) {
    log.error("Could not create admin", { by: me.email, err });
    return { error: `The admin was not added. ${STORAGE_ERROR}` };
  }
  audit.info("Admin account created", { by: me.email, newAdmin: email });
  return { success: `${name} can now sign in.` };
}

export async function deleteAdminAction(id: string): Promise<UserFormState> {
  const me = await requireAdmin();
  if (id === me.id) return { error: "You can't remove your own account." };
  try {
    const all = await listAdmins();
    if (all.length <= 1) return { error: "At least one admin must remain." };
    const target = all.find((a) => a.id === id);
    if (!target) return { error: "This admin no longer exists. Reload the page." };
    await removeAdmin(id);
    audit.info("Admin account removed", { by: me.email, removedAdmin: target.email });
  } catch (err) {
    log.error("Could not remove admin", { by: me.email, err });
    return { error: `The admin was not removed. ${STORAGE_ERROR}` };
  }
  return { success: "Admin removed." };
}

export async function changePasswordAction(_: UserFormState, form: FormData): Promise<UserFormState> {
  const me = await getCurrentAdmin();
  if (!me) redirect("/admin/login");
  if (isEnvAdminId(me.id)) {
    return { error: "This account's password is set by ADMIN_PASSWORD in the server's environment (.env). Change it there and restart the website." };
  }
  const current = String(form.get("current") ?? "");
  const next = String(form.get("next") ?? "");
  try {
    const record = await findAdmin({ id: me.id });
    if (!record || !(await verifyPassword(current, record.passwordHash))) {
      audit.warn("Password change refused: wrong current password", { admin: me.email });
      return { error: "Your current password is incorrect." };
    }
    const problem = passwordProblem(next);
    if (problem) return { error: problem };
    await updateAdmin(me.id, { passwordHash: await hashPassword(next) });
  } catch (err) {
    log.error("Could not change password", { admin: me.email, err });
    return { error: `Your password was not changed. ${STORAGE_ERROR}` };
  }
  audit.info("Password changed", { admin: me.email });
  return { success: "Password changed." };
}
