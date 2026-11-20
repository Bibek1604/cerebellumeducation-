/**
 * Server logger.
 *
 * - Production: one JSON object per line (time, level, scope, msg, …), ready
 *   for PM2, systemd/journald, Docker or any log collector.
 * - Development: short readable lines.
 * - Secrets are never written: keys such as password, token, secret, cookie
 *   and authorization are replaced with "[redacted]", and personal contact
 *   details are masked.
 *
 * Level is set with LOG_LEVEL (debug | info | warn | error), default "info".
 */

type Level = "debug" | "info" | "warn" | "error";
const ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function threshold(): number {
  const v = (process.env.LOG_LEVEL ?? "").toLowerCase() as Level;
  return ORDER[v] ?? ORDER.info;
}

const SECRET_KEY = /pass(word)?|secret|token|authorization|cookie|api[-_]?key|session|hash/i;
const MASK_KEY = /^(email|phone|fullname|name)$/i;

function mask(v: string) {
  if (v.includes("@")) {
    const [u, d] = v.split("@");
    return `${u!.slice(0, 2)}***@${d}`;
  }
  return v.length <= 4 ? "***" : `${v.slice(0, 2)}***${v.slice(-2)}`;
}

/** Turns errors into plain objects and removes secrets, recursively. */
export function serialize(value: unknown, depth = 0): unknown {
  if (depth > 5) return "[…]";
  if (value instanceof Error) {
    const e = value as Error & { code?: unknown; digest?: unknown; cause?: unknown };
    return {
      name: e.name,
      message: e.message,
      ...(e.code !== undefined ? { code: e.code } : {}),
      ...(e.digest !== undefined ? { digest: e.digest } : {}),
      ...(e.stack ? { stack: e.stack.split("\n").slice(0, 12).join("\n") } : {}),
      ...(e.cause !== undefined ? { cause: serialize(e.cause, depth + 1) } : {}),
    };
  }
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => serialize(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      if (SECRET_KEY.test(k)) out[k] = "[redacted]";
      else if (MASK_KEY.test(k) && typeof v === "string") out[k] = mask(v);
      else out[k] = serialize(v, depth + 1);
    }
    return out;
  }
  if (typeof value === "string" && value.length > 2000) return `${value.slice(0, 2000)}…`;
  return value;
}

function write(level: Level, scope: string, msg: string, data?: Record<string, unknown>) {
  if (ORDER[level] < threshold()) return;
  const clean = data ? (serialize(data) as Record<string, unknown>) : undefined;
  const stream = level === "error" ? console.error : level === "warn" ? console.warn : console.log;

  if (process.env.NODE_ENV === "production") {
    stream(JSON.stringify({ time: new Date().toISOString(), level, scope, msg, ...clean }));
    return;
  }
  const extra = clean && Object.keys(clean).length ? ` ${JSON.stringify(clean, null, 0)}` : "";
  stream(`[${level}] [${scope}] ${msg}${extra}`);
}

export type Logger = {
  debug: (msg: string, data?: Record<string, unknown>) => void;
  info: (msg: string, data?: Record<string, unknown>) => void;
  warn: (msg: string, data?: Record<string, unknown>) => void;
  error: (msg: string, data?: Record<string, unknown>) => void;
  child: (extra: Record<string, unknown>) => Logger;
};

/** `const log = logger("enquiry"); log.error("delivery failed", { err })` */
export function logger(scope: string, base: Record<string, unknown> = {}): Logger {
  const at = (level: Level) => (msg: string, data?: Record<string, unknown>) => write(level, scope, msg, { ...base, ...data });
  return {
    debug: at("debug"),
    info: at("info"),
    warn: at("warn"),
    error: at("error"),
    child: (extra) => logger(scope, { ...base, ...extra }),
  };
}

/** Security-relevant admin events (sign-ins, saves, uploads, user changes). */
export const audit = logger("audit");
