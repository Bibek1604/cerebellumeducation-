import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Pool as PgPool } from "pg";
import { logger } from "@/lib/logger";

const log = logger("db");

/**
 * Storage for admin-managed content, uploaded images and admin accounts.
 *
 *  • DATABASE_URL set  → PostgreSQL (tables are created automatically).
 *  • otherwise         → JSON files and images in ./.data (fine on a VPS with
 *                        a persistent disk; ignored by git).
 *
 * Switching to PostgreSQL later needs no code changes: set DATABASE_URL and
 * re-save anything you edited while on file storage (or copy it across).
 */

export const usingDatabase = Boolean(process.env.DATABASE_URL);
const DATA_DIR = path.join(process.cwd(), ".data");

/* ───────────────────────────── PostgreSQL ───────────────────────────── */

let pool: PgPool | null = null;
let ready: Promise<void> | null = null;

async function db(): Promise<PgPool> {
  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
      // Fail fast instead of hanging when the database is unreachable or slow.
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 30_000,
      query_timeout: 15_000,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
    });
    // An idle connection dropping (database restart, network blip) must not crash the server.
    pool.on("error", (err) => log.error("Idle database connection failed", { err }));
  }
  ready ??= pool
    .query(
      `CREATE TABLE IF NOT EXISTS cms_content (
         key text PRIMARY KEY,
         data jsonb NOT NULL,
         updated_at timestamptz NOT NULL DEFAULT now(),
         updated_by text
       );
       CREATE TABLE IF NOT EXISTS cms_media (
         id text PRIMARY KEY,
         mime text NOT NULL,
         bytes bytea NOT NULL,
         original_name text,
         size integer NOT NULL,
         created_at timestamptz NOT NULL DEFAULT now(),
         created_by text
       );
       CREATE TABLE IF NOT EXISTS cms_admins (
         id text PRIMARY KEY,
         email text UNIQUE NOT NULL,
         name text NOT NULL,
         password_hash text NOT NULL,
         created_at timestamptz NOT NULL DEFAULT now(),
         last_login_at timestamptz
       );`,
    )
    .then(() => undefined)
    .catch((e) => {
      ready = null;
      log.error("Could not connect to the database or create tables", { err: e });
      throw e;
    });
  await ready;
  return pool;
}

/* ─────────────────────────────── Files ─────────────────────────────── */

async function writeAtomic(file: string, contents: string | Buffer) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
  await writeFile(tmp, contents);
  await rename(tmp, file);
}

async function readJson<T>(file: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as T;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

const contentFile = (key: string) => path.join(DATA_DIR, "content", `${key.replace(/[^a-z0-9-]/gi, "_")}.json`);

/* ─────────────────────────────── Content ─────────────────────────────── */

export type StoredContent = { data: unknown; updatedAt: string; updatedBy: string | null };

export async function readContent(key: string): Promise<StoredContent | null> {
  if (usingDatabase) {
    const r = await (await db()).query("SELECT data, updated_at, updated_by FROM cms_content WHERE key = $1", [key]);
    const row = r.rows[0];
    return row ? { data: row.data, updatedAt: new Date(row.updated_at).toISOString(), updatedBy: row.updated_by } : null;
  }
  return readJson<StoredContent>(contentFile(key));
}

export async function writeContent(key: string, data: unknown, updatedBy: string) {
  if (usingDatabase) {
    await (await db()).query(
      `INSERT INTO cms_content (key, data, updated_at, updated_by) VALUES ($1, $2, now(), $3)
       ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = now(), updated_by = EXCLUDED.updated_by`,
      [key, JSON.stringify(data), updatedBy],
    );
    return;
  }
  const record: StoredContent = { data, updatedAt: new Date().toISOString(), updatedBy };
  await writeAtomic(contentFile(key), JSON.stringify(record, null, 2));
}

export async function deleteContent(key: string) {
  if (usingDatabase) {
    await (await db()).query("DELETE FROM cms_content WHERE key = $1", [key]);
    return;
  }
  await rm(contentFile(key), { force: true });
}

/* ─────────────────────────────── Media ─────────────────────────────── */

export const MEDIA_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
};

const mediaDir = path.join(DATA_DIR, "media");

export async function saveMedia(bytes: Buffer, mime: string, originalName: string, by: string): Promise<string> {
  const ext = MEDIA_TYPES[mime];
  if (!ext) throw new Error("Unsupported image type");
  const id = `${randomBytes(12).toString("hex")}.${ext}`;
  if (usingDatabase) {
    await (await db()).query("INSERT INTO cms_media (id, mime, bytes, original_name, size, created_by) VALUES ($1,$2,$3,$4,$5,$6)", [
      id,
      mime,
      bytes,
      originalName.slice(0, 200),
      bytes.length,
      by,
    ]);
  } else {
    await writeAtomic(path.join(mediaDir, id), bytes);
  }
  return id;
}

export async function readMedia(id: string): Promise<{ bytes: Buffer; mime: string } | null> {
  if (!/^[a-f0-9]{24}\.(jpg|png|webp|avif|gif)$/.test(id)) return null;
  if (usingDatabase) {
    const r = await (await db()).query("SELECT bytes, mime FROM cms_media WHERE id = $1", [id]);
    return r.rows[0] ? { bytes: r.rows[0].bytes, mime: r.rows[0].mime } : null;
  }
  try {
    const ext = id.split(".").pop()!;
    const mime = Object.entries(MEDIA_TYPES).find(([, e]) => e === ext)?.[0] ?? "application/octet-stream";
    return { bytes: await readFile(path.join(mediaDir, id)), mime };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}

/* ─────────────────────────────── Admins ─────────────────────────────── */

export type AdminRecord = { id: string; email: string; name: string; passwordHash: string; createdAt: string; lastLoginAt: string | null };
const adminsFile = path.join(DATA_DIR, "admins.json");

export async function listAdmins(): Promise<AdminRecord[]> {
  if (usingDatabase) {
    const r = await (await db()).query("SELECT id, email, name, password_hash, created_at, last_login_at FROM cms_admins ORDER BY created_at");
    return r.rows.map((x) => ({
      id: x.id,
      email: x.email,
      name: x.name,
      passwordHash: x.password_hash,
      createdAt: new Date(x.created_at).toISOString(),
      lastLoginAt: x.last_login_at ? new Date(x.last_login_at).toISOString() : null,
    }));
  }
  return (await readJson<AdminRecord[]>(adminsFile)) ?? [];
}

export async function findAdmin(by: { id?: string; email?: string }) {
  const all = await listAdmins();
  return all.find((a) => (by.id ? a.id === by.id : a.email === by.email?.toLowerCase())) ?? null;
}

export async function insertAdmin(a: { email: string; name: string; passwordHash: string }) {
  const rec: AdminRecord = {
    id: randomBytes(10).toString("hex"),
    email: a.email.toLowerCase(),
    name: a.name,
    passwordHash: a.passwordHash,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  if (usingDatabase) {
    await (await db()).query("INSERT INTO cms_admins (id, email, name, password_hash) VALUES ($1,$2,$3,$4)", [rec.id, rec.email, rec.name, rec.passwordHash]);
  } else {
    const all = await listAdmins();
    if (all.some((x) => x.email === rec.email)) throw new Error("An admin with this email already exists");
    await writeAtomic(adminsFile, JSON.stringify([...all, rec], null, 2));
  }
  return rec;
}

export async function updateAdmin(id: string, patch: Partial<Pick<AdminRecord, "passwordHash" | "name" | "lastLoginAt">>) {
  if (usingDatabase) {
    const sets: string[] = [];
    const vals: unknown[] = [];
    const add = (col: string, v: unknown) => {
      vals.push(v);
      sets.push(`${col} = $${vals.length}`);
    };
    if (patch.passwordHash) add("password_hash", patch.passwordHash);
    if (patch.name) add("name", patch.name);
    if (patch.lastLoginAt) add("last_login_at", patch.lastLoginAt);
    if (!sets.length) return;
    vals.push(id);
    await (await db()).query(`UPDATE cms_admins SET ${sets.join(", ")} WHERE id = $${vals.length}`, vals);
    return;
  }
  const all = await listAdmins();
  await writeAtomic(adminsFile, JSON.stringify(all.map((a) => (a.id === id ? { ...a, ...patch } : a)), null, 2));
}

export async function removeAdmin(id: string) {
  if (usingDatabase) {
    await (await db()).query("DELETE FROM cms_admins WHERE id = $1", [id]);
    return;
  }
  const all = await listAdmins();
  await writeAtomic(adminsFile, JSON.stringify(all.filter((a) => a.id !== id), null, 2));
}
