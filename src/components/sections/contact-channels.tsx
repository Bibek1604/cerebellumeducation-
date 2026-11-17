import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { SocialIcon } from "@/components/brand/social-icon";
import { hasContactChannel, phoneLink, siteConfig, whatsappLink } from "@/config/site";

/** Lists only the contact channels configured in src/config/site.ts. */
export function ContactChannels({ heading = "Reach us directly" }: { heading?: string }) {
  const { contact, social } = siteConfig;
  const wa = whatsappLink("Hello Cerebellum, I'd like to know more about studying medicine abroad.");

  if (!hasContactChannel) {
    return (
      <div className="rounded-3xl border border-line bg-white p-7">
        <h2 className="text-lg font-extrabold">{heading}</h2>
        <p className="mt-2 leading-relaxed text-ink">
          Our direct contact details are being updated. Please use the form and a counsellor will get back to you.
        </p>
      </div>
    );
  }

  const rows: { icon: typeof Phone; label: string; value: React.ReactNode; href?: string; external?: boolean }[] = [];
  const phone = phoneLink();
  if (phone) rows.push({ icon: Phone, label: "Call us", value: phone.label, href: phone.href });
  if (wa) rows.push({ icon: MessageCircle, label: "WhatsApp", value: "Chat with a counsellor", href: wa, external: true });
  if (contact.email) rows.push({ icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` });
  if (contact.address)
    rows.push({
      icon: MapPin,
      label: "Office",
      value: (
        <address className="not-italic">
          {contact.address.line1}
          {contact.address.line2 && <>, {contact.address.line2}</>}
          <br />
          {contact.address.city}
          {contact.address.postalCode && ` ${contact.address.postalCode}`}, {contact.address.country}
        </address>
      ),
      href: contact.mapLink ?? undefined,
      external: true,
    });
  if (contact.officeHours)
    rows.push({ icon: Clock, label: "Office hours", value: contact.officeHours.map((h) => <span key={h} className="block">{h}</span>) });

  return (
    <div className="rounded-3xl border border-line bg-white p-7">
      <h2 className="text-lg font-extrabold">{heading}</h2>
      <ul className="mt-5 space-y-5">
        {rows.map((r) => {
          const content = (
            <>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary-light text-primary">
                <r.icon aria-hidden className="size-5" />
              </span>
              <span>
                <span className="block text-xs font-bold tracking-wider text-ink-soft uppercase">{r.label}</span>
                <span className="mt-0.5 block font-semibold text-navy">{r.value}</span>
              </span>
            </>
          );
          return (
            <li key={r.label}>
              {r.href ? (
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex gap-4 transition-colors hover:text-primary"
                >
                  {content}
                </a>
              ) : (
                <div className="flex gap-4">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
      {social.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6" aria-label="Social media">
          {social.map((s) => (
            <li key={s.href}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-muted px-3.5 py-2 text-sm font-semibold text-navy hover:bg-primary hover:text-white">
                <SocialIcon platform={s.platform} className="size-4" /> {s.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
