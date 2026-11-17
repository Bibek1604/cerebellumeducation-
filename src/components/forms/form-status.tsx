import Link from "next/link";
import { CircleAlert, CircleCheck, Mail, MessageCircle, Phone } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";

export type SubmitState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; reason: "not_configured" | "rate_limited" | "validation" | "network" | "server" };

const messages: Record<Extract<SubmitState, { status: "error" }>["reason"], string> = {
  not_configured:
    "Our online enquiry system isn't connected yet, so your message was not sent. Please contact us directly using the options below.",
  rate_limited: "You've sent several enquiries in a short time. Please wait a few minutes and try again.",
  validation: "Some details need attention. Please check the highlighted fields and try again.",
  network: "We couldn't reach our server. Please check your connection and try again.",
  server: "Something went wrong on our side and your message was not sent. Please try again or contact us directly.",
};

export function DirectContactOptions() {
  const { phone, phoneHref, email } = siteConfig.contact;
  const wa = whatsappLink("Hello Cerebellum, I'd like to book a counselling session.");
  if (!phone && !email && !wa) {
    return (
      <p className="mt-2 text-sm">
        Please try again later, or visit our <Link href="/contact" className="font-semibold underline">contact page</Link>.
      </p>
    );
  }
  return (
    <ul className="mt-3 flex flex-wrap gap-2">
      {phone && phoneHref && (
        <li>
          <a href={`tel:${phoneHref}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy ring-1 ring-line">
            <Phone aria-hidden className="size-4" /> Call {phone}
          </a>
        </li>
      )}
      {wa && (
        <li>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy ring-1 ring-line">
            <MessageCircle aria-hidden className="size-4" /> WhatsApp
          </a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-navy ring-1 ring-line">
            <Mail aria-hidden className="size-4" /> {email}
          </a>
        </li>
      )}
    </ul>
  );
}

export function FormError({ state }: { state: SubmitState }) {
  if (state.status !== "error") return null;
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
      <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-medium">{messages[state.reason]}</p>
        {(state.reason === "not_configured" || state.reason === "server") && <DirectContactOptions />}
      </div>
    </div>
  );
}

export function FormSuccess({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <div role="status" className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center sm:p-10">
      <CircleCheck aria-hidden className="mx-auto size-12 text-emerald-600" />
      <h2 className="mt-4 text-2xl font-extrabold">{title}</h2>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-ink">{body}</p>
      <button type="button" onClick={onReset} className="mt-6 text-sm font-semibold text-primary underline underline-offset-4">
        Send another enquiry
      </button>
    </div>
  );
}

export async function postEnquiry(payload: unknown): Promise<SubmitState> {
  try {
    const res = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = (await res.json().catch(() => null)) as { ok?: boolean } | null;
      return data?.ok ? { status: "success" } : { status: "error", reason: "server" };
    }
    if (res.status === 503) return { status: "error", reason: "not_configured" };
    if (res.status === 429) return { status: "error", reason: "rate_limited" };
    if (res.status === 422) return { status: "error", reason: "validation" };
    return { status: "error", reason: "server" };
  } catch {
    return { status: "error", reason: "network" };
  }
}
