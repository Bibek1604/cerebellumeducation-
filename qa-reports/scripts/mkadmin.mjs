import { randomBytes, scrypt as s } from "node:crypto"; import { promisify } from "node:util"; import { writeFile } from "node:fs/promises";
const scrypt = promisify(s);
const mk = async (email, name, pw) => { const salt = randomBytes(16); const h = await scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64*1024*1024 });
 return { id: randomBytes(10).toString("hex"), email, name, passwordHash: `scrypt$16384$8$1$${salt.toString("base64")}$${h.toString("base64")}`, createdAt: new Date().toISOString(), lastLoginAt: null }; };
await writeFile(process.argv[2], JSON.stringify([await mk("qa.admin@example.test","QA Admin","QaTestPass2026"), await mk("qa.second@example.test","QA Second","QaSecond2026x")], null, 2));
