import Link from "next/link";
import { Clock, GraduationCap, Mail, MessageCircle, Phone } from "lucide-react";
import { getSiteSettings, whatsappLinkFrom } from "@/cms/content";

/** Slim brand bar above the header. Shows only configured contact details. */
export async function TopBar() {
  const { contact } = await getSiteSettings();
  const { phone, phoneHref, email, officeHours } = contact;
  const wa = whatsappLinkFrom(contact, "Hello Cerebellum, I'd like free counselling about studying medicine abroad.");

  return (
    <div className="bg-brand-gradient hidden text-[0.8rem] text-white/80 md:block">
      <div className="mx-auto flex h-10 max-w-7xl 2xl:max-w-[88rem] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          <GraduationCap aria-hidden className="size-4 text-gold" />
          Free counselling for MBBS &amp; medical study abroad
          <Link href="/book-counselling" className="ml-1 font-semibold text-gold underline-offset-4 hover:underline">
            Book now →
          </Link>
        </p>
        <ul className="flex items-center gap-5">
          {officeHours?.[0] && (
            <li className="hidden items-center gap-1.5 lg:flex">
              <Clock aria-hidden className="size-3.5 text-gold" /> {officeHours[0]}
            </li>
          )}
          {phone && phoneHref && (
            <li>
              <a href={`tel:${phoneHref}`} className="flex items-center gap-1.5 hover:text-white">
                <Phone aria-hidden className="size-3.5 text-gold" /> {phone}
              </a>
            </li>
          )}
          {email && (
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-white">
                <Mail aria-hidden className="size-3.5 text-gold" /> {email}
              </a>
            </li>
          )}
          {wa && (
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white">
                <MessageCircle aria-hidden className="size-3.5 text-gold" /> WhatsApp
              </a>
            </li>
          )}
          {!phone && !email && !wa && (
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact our team
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
