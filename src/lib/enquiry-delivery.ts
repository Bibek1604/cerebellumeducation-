import "server-only";
import type { EnquiryValues } from "./validations";
import { logger } from "./logger";

const log = logger("enquiry");

/**
 * ─────────────────────────────────────────────────────────────
 *  ENQUIRY DELIVERY — INTEGRATION POINT
 * ─────────────────────────────────────────────────────────────
 *  Enquiries are validated in /api/enquiry and delivered by the first
 *  configured method (see .env.example):
 *
 *   1. Email via Resend        RESEND_API_KEY + CONTACT_TO_EMAIL
 *                              (+ CONTACT_FROM_EMAIL on a verified domain)
 *   2. Webhook                 ENQUIRY_WEBHOOK_URL (+ ENQUIRY_WEBHOOK_SECRET)
 *   3. Console log (dev only)  ENQUIRY_DELIVERY=log — ignored when
 *                              NODE_ENV === "production", so it can never
 *                              produce a false success on the live site.
 *
 *  If nothing is configured the visitor sees an honest error with
 *  alternative contact options — never a false success message.
 */

export type DeliveryResult = { ok: true; via: "email" | "webhook" | "log" } | { ok: false; reason: "not_configured" | "upstream_error" };

type Meta = { receivedAt: string; userAgent: string | null; pageUrl: string | null };

const LABELS: Record<string, string> = {
  type: "Enquiry type",
  fullName: "Full name",
  phone: "Phone",
  email: "Email",
  location: "Current location",
  qualification: "Qualification",
  programme: "Programme",
  country: "Preferred country",
  intake: "Expected intake",
  mode: "Counselling mode",
  subject: "Subject",
  message: "Message",
  consent: "Privacy consent",
  receivedAt: "Received",
  pageUrl: "Page",
};

function cleanPayload(enquiry: EnquiryValues) {
  // Never forward the honeypot or captcha token.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { website, captchaToken, ...payload } = enquiry;
  return payload;
}

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function rows(data: Record<string, unknown>) {
  return Object.entries(data)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [LABELS[k] ?? k, typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)] as const);
}

async function sendViaResend(enquiry: EnquiryValues, meta: Meta): Promise<DeliveryResult> {
  const data = { ...cleanPayload(enquiry), receivedAt: meta.receivedAt, pageUrl: meta.pageUrl };
  const list = rows(data);
  const subject =
    enquiry.type === "counselling"
      ? `New counselling request: ${enquiry.fullName} (${enquiry.programme}, ${enquiry.country})`
      : `New website message from ${enquiry.fullName}: ${enquiry.subject}`;
  const html = `<h2 style="font-family:sans-serif">${escapeHtml(subject)}</h2><table style="font-family:sans-serif;border-collapse:collapse">${list
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;border:1px solid #e1e8f2;font-weight:600;vertical-align:top">${escapeHtml(k)}</td><td style="padding:6px 12px;border:1px solid #e1e8f2;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
    )
    .join("")}</table>`;
  const text = list.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? "Cerebellum Website <onboarding@resend.dev>",
        to: process.env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
        reply_to: enquiry.email,
        subject,
        html,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      log.error("Email provider rejected the enquiry", { provider: "resend", status: res.status, response: (await res.text()).slice(0, 300) });
      return { ok: false, reason: "upstream_error" };
    }
    return { ok: true, via: "email" };
  } catch (err) {
    log.error("Could not reach the email provider", { provider: "resend", err });
    return { ok: false, reason: "upstream_error" };
  }
}

async function sendViaWebhook(enquiry: EnquiryValues, meta: Meta): Promise<DeliveryResult> {
  try {
    const res = await fetch(process.env.ENQUIRY_WEBHOOK_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.ENQUIRY_WEBHOOK_SECRET ? { "X-Enquiry-Secret": process.env.ENQUIRY_WEBHOOK_SECRET } : {}),
      },
      body: JSON.stringify({ ...cleanPayload(enquiry), ...meta, source: "website" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      log.error("Webhook rejected the enquiry", { status: res.status });
      return { ok: false, reason: "upstream_error" };
    }
    return { ok: true, via: "webhook" };
  } catch (err) {
    log.error("Could not reach the webhook", { err });
    return { ok: false, reason: "upstream_error" };
  }
}

export async function deliverEnquiry(enquiry: EnquiryValues, meta: Meta): Promise<DeliveryResult> {
  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) return sendViaResend(enquiry, meta);
  if (process.env.ENQUIRY_WEBHOOK_URL) return sendViaWebhook(enquiry, meta);
  if (process.env.ENQUIRY_DELIVERY === "log" && process.env.NODE_ENV !== "production") {
    console.info("[enquiry] (dev log delivery, not sent anywhere)\n" + rows({ ...cleanPayload(enquiry), ...meta }).map(([k, v]) => `  ${k}: ${v}`).join("\n"));
    return { ok: true, via: "log" };
  }
  return { ok: false, reason: "not_configured" };
}

/**
 * ─────────────────────────────────────────────────────────────
 *  SPAM PROTECTION — INTEGRATION POINT
 * ─────────────────────────────────────────────────────────────
 *  A honeypot field and basic rate limiting are always active.
 *  To add Cloudflare Turnstile:
 *    1. Set TURNSTILE_SECRET_KEY (server) and
 *       NEXT_PUBLIC_TURNSTILE_SITE_KEY (client).
 *    2. Render the Turnstile widget in the enquiry forms and put its
 *       token into the `captchaToken` field.
 *  When TURNSTILE_SECRET_KEY is set, requests without a valid token are
 *  rejected.
 */
export async function verifySpamToken(token: string | undefined, ip: string | null): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
