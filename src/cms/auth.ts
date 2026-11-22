import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { findAdmin } from "./store";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number, opts: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;

export const SESSION_COOKIE = "cen_admin";
const SESSION_HOURS = 8;

/* ───────────────────────────── Passwords ───────────────────────────── */

const N = 16384, R = 8, P = 1, KEYLEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, KEYLEN, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 });
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [alg, n, r, p, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64");
  const actual = await scrypt(password, Buffer.from(saltB64, "base64"), expected.length, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Minimum password policy for admin accounts. */
export function passwordProblem(pw: string): string | null {
  if (pw.length < 10) return "Use at least 10 characters.";
  if (pw.length > 200) return "Password is too long.";
  if (!/[a-zA-Z]/.test(pw) || !/\d/.test(pw)) return "Use a mix of letters and numbers.";
  return null;
}

/* ───────────────────────────── Sessions ───────────────────────────── */

let devSecret: string | null = null;

async function secret(): Promise<string> {
  const env = process.env.SESSION_SECRET;
  if (env && env.length >= 32) return env;
  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET must be set (at least 32 characters) to use the Admin Panel in production.");
  }
  // Development: a random secret kept in .data so sessions survive restarts.
  if (devSecret) return devSecret;
  const file = path.join(process.cwd(), ".data", "dev-session-secret");
  try {
    devSecret = (await readFile(file, "utf8")).trim();
  } catch {
    devSecret = randomBytes(32).toString("hex");
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, devSecret);
  }
  return devSecret;
}

const b64 = (s: string) => Buffer.from(s).toString("base64url");

async function sign(payload: string) {
  return createHmac("sha256", await secret()).update(payload).digest("base64url");
}

export async function createSession(adminId: string) {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  const payload = b64(JSON.stringify({ uid: adminId, exp }));
  const token = `${payload}.${await sign(payload)}`;
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.ADMIN_INSECURE_COOKIE !== "true",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_HOURS * 3600,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

async function readSession(): Promise<{ uid: string } | null> {
  // Sessions are checked per request (expiry compares with the current time).
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(await sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { uid: string; exp: number };
    return data.exp > Date.now() ? { uid: data.uid } : null;
  } catch {
    return null;
  }
}

export type CurrentAdmin = { id: string; email: string; name: string };

/* ──────────────────── Admin account from environment ──────────────────── */
// ADMIN_EMAIL + ADMIN_PASSWORD (in .env or the host's environment variables)
// give one admin login that needs no database. Its session id carries a
// fingerprint of the password, so changing ADMIN_PASSWORD signs it out everywhere.

const ENV_PREFIX = "env:";

function envAdminConfig() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  const fingerprint = createHmac("sha256", "cen-env-admin").update(`${email}\n${password}`).digest("base64url").slice(0, 16);
  return { id: `${ENV_PREFIX}${fingerprint}`, email, name: process.env.ADMIN_NAME?.trim() || "Administrator", password };
}

export const isEnvAdminId = (id: string) => id.startsWith(ENV_PREFIX);

/** The env admin if this email is ADMIN_EMAIL, else undefined (use the stored accounts). */
export function envAdminLogin(email: string, password: string): CurrentAdmin | null | undefined {
  const cfg = envAdminConfig();
  if (!cfg || cfg.email !== email) return undefined;
  const digest = (s: string) => createHmac("sha256", cfg.id).update(s).digest();
  const ok = timingSafeEqual(digest(password), digest(cfg.password));
  return ok ? { id: cfg.id, email: cfg.email, name: cfg.name } : null;
}

/** The env admin shown on the Admin users page, if one is configured. */
export function envAdminInfo(): CurrentAdmin | null {
  const cfg = envAdminConfig();
  return cfg ? { id: cfg.id, email: cfg.email, name: cfg.name } : null;
}

/** The signed-in admin, or null. Re-checks the account still exists. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const s = await readSession();
  if (!s) return null;
  if (isEnvAdminId(s.uid)) {
    const env = envAdminInfo();
    return env && env.id === s.uid ? env : null;
  }
  const a = await findAdmin({ id: s.uid });
  return a ? { id: a.id, email: a.email, name: a.name } : null;
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const a = await getCurrentAdmin();
  if (!a) redirect("/admin/login");
  return a;
}

/* ───────────────────────── Login rate limiting ───────────────────────── */

const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60_000;
const LIMIT = 6;

export function loginBlocked(key: string): boolean {
  const a = attempts.get(key);
  return Boolean(a && a.count >= LIMIT && a.until > Date.now());
}

export function recordLoginFailure(key: string) {
  const a = attempts.get(key);
  if (!a || a.until < Date.now()) attempts.set(key, { count: 1, until: Date.now() + WINDOW });
  else a.count += 1;
}

export function clearLoginFailures(key: string) {
  attempts.delete(key);
}
