import { MessageCircle, Phone } from "lucide-react";
import { getSiteSettings, phoneLinkFrom, whatsappLinkFrom } from "@/cms/content";

/**
 * Floating contact buttons. WhatsApp shows on all screen sizes; the call
 * button is mobile-only. Each renders only when its number is configured.
 */
export async function WhatsAppFab() {
  const { contact } = await getSiteSettings();
  const wa = whatsappLinkFrom(contact, "Hello Cerebellum, I'd like to know more about studying medicine abroad.");
  const phone = phoneLinkFrom(contact);
  if (!wa && !phone) return null;

  return (
    <div className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      {phone && (
        <a
          href={phone.href}
          aria-label={`Call us on ${phone.label}`}
          className="grid size-14 place-items-center rounded-full bg-primary text-white shadow-lift transition-transform hover:scale-105 md:hidden"
        >
          <Phone className="size-6" />
        </a>
      )}
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp (opens in a new tab)"
          className="grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-lift transition-transform hover:scale-105"
        >
          <MessageCircle className="size-6" />
        </a>
      )}
    </div>
  );
}
