import { deliverEnquiry, verifySpamToken } from "@/lib/enquiry-delivery";
import { ANOTHER_COUNTRY, enquirySchema, NOT_SURE } from "@/lib/validations";
import { destinations } from "@/data/destinations";
import { destinationsForProgramme, programmes } from "@/data/programmes";

/** Server-side guard: the chosen country must offer the chosen programme. */
function isValidCombination(programme: string, country: string) {
  if (programme === NOT_SURE || country === NOT_SURE || country === ANOTHER_COUNTRY) return true;
  const prog = programmes.find((p) => p.name === programme);
  const dest = destinations.find((d) => d.name === country);
  if (!prog || !dest) return false;
  return destinationsForProgramme(prog.slug).some((d) => d.slug === dest.slug);
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

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return json(415, { ok: false, error: "unsupported_media_type" });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip");
  if (ip && rateLimited(ip)) {
    return json(429, { ok: false, error: "rate_limited" });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    return json(422, {
      ok: false,
      error: "validation_failed",
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  if (parsed.data.type === "counselling" && !isValidCombination(parsed.data.programme, parsed.data.country)) {
    return json(422, {
      ok: false,
      error: "validation_failed",
      issues: [{ path: "country", message: "This programme isn't offered in the selected country" }],
    });
  }

  if (parsed.data.website) {
    return json(400, { ok: false, error: "rejected" });
  }

  if (!(await verifySpamToken(parsed.data.captchaToken, ip ?? null))) {
    return json(400, { ok: false, error: "captcha_failed" });
  }

  const result = await deliverEnquiry(parsed.data, {
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent"),
    pageUrl: request.headers.get("referer"),
  });

  if (!result.ok) {
    return json(result.reason === "not_configured" ? 503 : 502, { ok: false, error: result.reason });
  }

  return json(200, { ok: true });
}
