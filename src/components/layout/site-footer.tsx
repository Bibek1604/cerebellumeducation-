import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { FoliaArcs } from "@/components/brand/folia";
import { SocialIcon } from "@/components/brand/social-icon";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/config/navigation";
import { hasContactChannel, phoneLink, siteConfig, whatsappLink } from "@/config/site";
import { destinations } from "@/data/destinations";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-sm font-bold tracking-[0.14em] text-white uppercase">{children}</h2>;
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-block py-0.5 text-[0.95rem] text-white/70 transition-colors hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactColumn() {
  const { contact } = siteConfig;
  const phone = phoneLink();
  const wa = whatsappLink("Hello Cerebellum, I'd like to know more about studying medicine abroad.");

  return (
    <div>
      <ColumnTitle>Contact</ColumnTitle>
      {hasContactChannel ? (
        <ul className="mt-5 space-y-3.5 text-[0.95rem]">
          {phone && (
            <li>
              <a href={phone.href} className="flex items-center gap-3 hover:text-gold">
                <Phone aria-hidden className="size-4 shrink-0 text-gold" /> {phone.label}
              </a>
            </li>
          )}
          {wa && (
            <li>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold">
                <MessageCircle aria-hidden className="size-4 shrink-0 text-gold" /> WhatsApp us
              </a>
            </li>
          )}
          {contact.email && (
            <li>
              <a href={`mailto:${contact.email}`} className="flex items-center gap-3 break-all hover:text-gold">
                <Mail aria-hidden className="size-4 shrink-0 text-gold" /> {contact.email}
              </a>
            </li>
          )}
          {contact.address && (
            <li className="flex gap-3">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-gold" />
              <address className="not-italic">
                {contact.address.line1}
                {contact.address.line2 && <>, {contact.address.line2}</>}
                <br />
                {contact.address.city}, {contact.address.country}
              </address>
            </li>
          )}
          {contact.officeHours && (
            <li className="flex gap-3">
              <Clock aria-hidden className="mt-1 size-4 shrink-0 text-gold" />
              <span>
                {contact.officeHours.map((h) => (
                  <span key={h} className="block">
                    {h}
                  </span>
                ))}
              </span>
            </li>
          )}
        </ul>
      ) : (
        <div className="mt-5 space-y-3 text-[0.95rem]">
          <p>Contact details are being updated.</p>
          <Link href="/book-counselling" className="inline-flex items-center gap-1.5 font-semibold text-gold hover:underline">
            Request a call back <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export function SiteFooter() {
  const { social } = siteConfig;

  return (
    <footer className="relative overflow-hidden bg-navy text-white/70">
      <FoliaArcs className="absolute -right-24 -bottom-10 w-[38rem] text-white/[0.05]" rings={8} />
      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-3">
            <Logo onDark />
            <p className="mt-6 max-w-sm leading-relaxed">
              Independent guidance for students and families planning to study medicine and healthcare abroad.
            </p>
            {social.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Social media">
                {social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-gold hover:text-navy"
                    >
                      <SocialIcon platform={s.platform} className="size-[1.1rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-9 lg:pl-6">
            <FooterLinks title="Explore" links={footerNav.explore} />
            <FooterLinks title="Support" links={footerNav.support} />
            <FooterLinks
              title="Destinations"
              links={destinations.map((d) => ({ label: `Study in ${d.name}`, href: `/destinations/${d.slug}` }))}
            />
            <ContactColumn />
          </div>
        </div>

        <div className="border-t border-white/10 py-8 text-sm">
          <p className="max-w-4xl leading-relaxed text-white/55">
            {siteConfig.name} is an independent education consultancy. Universities named on this website are listed
            for information and are not official partners unless stated. Admission, visa and medical-licensing decisions
            are made by universities, governments and regulators. We do not guarantee outcomes.
          </p>
          {siteConfig.company.registrationNo && (
            <p className="mt-3 text-white/55">
              Company registration no. {siteConfig.company.registrationNo}
              {siteConfig.company.registeredWith && ` · ${siteConfig.company.registeredWith}`}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {siteConfig.name}. All rights reserved.
            </p>
            <ul className="flex gap-6">
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1 hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  );
}
