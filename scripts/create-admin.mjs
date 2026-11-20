#!/usr/bin/env node
/**
 * Create an Admin Panel account.
 *
 *   npm run admin:create
 *
 * Uses PostgreSQL when DATABASE_URL is set (from .env.local / .env), otherwise
 * the local .data/admins.json file — the same storage the website uses.
 * The password is typed hidden and stored only as a scrypt hash.
 */
import { randomBytes, scrypt as scryptCb } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (hidden) {
      rl._writeToOutput = (s) => {
        if (s.includes(question)) rl.output.write(s);
        else rl.output.write("*".repeat(s.length));
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      if (hidden) process.stdout.write("\n");
      resolve(answer.trim());
    });
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const email = (process.argv[2] || (await ask("Email: "))).toLowerCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Please enter a valid email address.");
  process.exit(1);
}
const name = process.argv[3] || (await ask("Name: ")) || email;
const password = await ask("Password (min 10 chars, letters + numbers): ", { hidden: true });
if (password.length < 10 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
  console.error("Password must be at least 10 characters and include letters and numbers.");
  process.exit(1);
}
const confirm = await ask("Repeat password: ", { hidden: true });
if (confirm !== password) {
  console.error("Passwords don't match.");
  process.exit(1);
}

const record = {
  id: randomBytes(10).toString("hex"),
  email,
  name: name.slice(0, 80),
  passwordHash: await hashPassword(password),
  createdAt: new Date().toISOString(),
  lastLoginAt: null,
};

if (process.env.DATABASE_URL) {
  const { default: pg } = await import("pg");
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
  });
  await client.connect();
  await client.query(`CREATE TABLE IF NOT EXISTS cms_admins (
    id text PRIMARY KEY, email text UNIQUE NOT NULL, name text NOT NULL, password_hash text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(), last_login_at timestamptz)`);
  const exists = await client.query("SELECT 1 FROM cms_admins WHERE email = $1", [email]);
  if (exists.rowCount) {
    console.error(`An admin with ${email} already exists.`);
    await client.end();
    process.exit(1);
  }
  await client.query("INSERT INTO cms_admins (id, email, name, password_hash) VALUES ($1,$2,$3,$4)", [record.id, record.email, record.name, record.passwordHash]);
  await client.end();
  console.log(`✓ Admin ${email} created in PostgreSQL.`);
} else {
  const file = path.join(process.cwd(), ".data", "admins.json");
  let all = [];
  try {
    all = JSON.parse(await readFile(file, "utf8"));
  } catch {}
  if (all.some((a) => a.email === email)) {
    console.error(`An admin with ${email} already exists.`);
    process.exit(1);
  }
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${randomBytes(4).toString("hex")}.tmp`;
  await writeFile(tmp, JSON.stringify([...all, record], null, 2));
  await rename(tmp, file);
  console.log(`✓ Admin ${email} created in .data/admins.json.`);
}
console.log("Sign in at /admin/login");
