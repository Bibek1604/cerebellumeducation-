import { deliverEnquiry, verifySpamToken } from "@/lib/enquiry-delivery";
import { ANOTHER_COUNTRY, enquirySchema, NOT_SURE } from "@/lib/validations";
import { getProgrammes } from "@/cms/programmes";
import { destinationsOffering, getDestinations } from "@/cms/destinations";
import { logger } from "@/lib/logger";

const baseLog = logger("enquiry");

/** Server-side guard: the chosen country must offer the chosen programme. */
async function isValidCombination(programme: string, country: string) {
  const [destinations, programmes] = await Promise.all([getDestinations(), getProgrammes()]);
  if (programme === NOT_SURE || country === NOT_SURE || country === ANOTHER_COUNTRY) return true;
  const prog = programmes.find((p) => p.name === programme);
  const dest = destinations.find((d) => d.name === country);
  if (!prog || !dest) return false;
  return destinationsOffering(destinations, prog.slug).some((d) => d.slug === dest.slug);
}

/** Simple best-effort, per-instance rate limit: 5 submissions / 10 minutes / IP. */
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

function json(status: number, body: Record<string, unknown>, requestId: string) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Request-Id": requestId } });
}

export async function POST(request: Request) {
  const requestId = crypto.randomUUID();
  const log = baseLog.child({ requestId });
  try {
    return await handle(request, requestId, log);
  } catch (err) {
    // Anything unexpected still gets a JSON answer the form understands ("server" error message).
    log.error("Unexpected error while handling an enquiry", { err });
    return json(500, { ok: false, error: "server_error", requestId }, requestId);
  }
}

async function handle(request: Request, requestId: string, log: ReturnType<typeof logger>) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(415, { ok: false, error: "unsupported_media_type" }, requestId);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
  if (ip && rateLimited(ip)) {
    return json(429, { ok: false, error: "rate_limited" }, requestId);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" }, requestId);
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return json(422, {
      ok: false,
      error: "validation_failed",
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    }, requestId);
  }

  if (parsed.data.type === "counselling" && !(await isValidCombination(parsed.data.programme, parsed.data.country))) {
    return json(422, {
      ok: false,
      error: "validation_failed",
      issues: [{ path: "country", message: "This programme isn't offered in the selected country" }],
    }, requestId);
  }

  if (parsed.data.website) {
    log.warn("Rejected: spam honeypot filled");
    return json(400, { ok: false, error: "rejected" }, requestId);
  }

  if (!(await verifySpamToken(parsed.data.captchaToken, ip ?? null))) {
    log.warn("Rejected: spam check failed");
    return json(400, { ok: false, error: "captcha_failed" }, requestId);
  }

  const result = await deliverEnquiry(parsed.data, {
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent"),
    pageUrl: request.headers.get("referer"),
  });

  if (!result.ok) {
    if (result.reason === "not_configured") log.warn("Enquiry not sent: no delivery method is configured", { type: parsed.data.type });
    else log.error("Enquiry not delivered", { type: parsed.data.type, reason: result.reason });
    return json(result.reason === "not_configured" ? 503 : 502, { ok: false, error: result.reason, requestId }, requestId);
  }

  log.info("Enquiry delivered", { type: parsed.data.type, via: result.via });
  return json(200, { ok: true }, requestId);
}
