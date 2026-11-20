import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowRight, CalendarCheck, ChevronRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SocialIcon } from "@/components/brand/social-icon";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { getSiteSettings, phoneLinkFrom, whatsappLinkFrom, type SiteSettings } from "@/cms/content";
import { getDestinations } from "@/cms/destinations";
import { BackToTop } from "./back-to-top";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/** Column title: serif heading with a short orange underline. */
function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-lg font-bold text-white">
      {children}
      <span aria-hidden className="mt-2 block h-0.5 w-8 rounded-full bg-gold" />
    </h2>
  );
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-1.5 py-0.5 text-[0.95rem] text-white/75 transition-colors hover:text-white">
              <ChevronRight aria-hidden className="size-3.5 text-gold transition-transform group-hover:translate-x-0.5" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactItem({ icon: Icon, children }: { icon: typeof Phone; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-gold ring-1 ring-white/15">
        <Icon aria-hidden className="size-4" />
      </span>
      <span className="pt-1.5">{children}</span>
    </li>
  );
}

function ContactColumn({ settings }: { settings: SiteSettings }) {
  const { contact, hasContactChannel } = settings;
  const phone = phoneLinkFrom(contact);
  const wa = whatsappLinkFrom(contact, "Hello Cerebellum, I'd like to know more about studying medicine abroad.");

  return (
    <div>
      <ColumnTitle>Get in touch</ColumnTitle>
      {hasContactChannel ? (
        <ul className="mt-5 space-y-3.5 text-[0.95rem] text-white/80">
          {phone && (
            <ContactItem icon={Phone}>
              <a href={phone.href} className="hover:text-white">
                {phone.label}
              </a>
            </ContactItem>
          )}
          {wa && (
            <ContactItem icon={MessageCircle}>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp us
              </a>
            </ContactItem>
          )}
          {contact.email && (
            <ContactItem icon={Mail}>
              <a href={`mailto:${contact.email}`} className="break-all hover:text-white">
                {contact.email}
              </a>
            </ContactItem>
          )}
          {contact.address && (
            <ContactItem icon={MapPin}>
              <address className="not-italic">
                {contact.address.line1}
                {contact.address.line2 && <>, {contact.address.line2}</>}, {contact.address.city}
              </address>
            </ContactItem>
          )}
          {contact.officeHours && (
            <ContactItem icon={Clock}>
              {contact.officeHours.map((h) => (
                <span key={h} className="block">
                  {h}
                </span>
              ))}
            </ContactItem>
          )}
        </ul>
      ) : (
        <div className="mt-5 space-y-3 text-[0.95rem] text-white/80">
          <p>Talk to a counsellor about your plans. We&apos;ll call you back.</p>
          <Link href="/book-counselling" className="inline-flex items-center gap-1.5 font-semibold text-gold hover:text-white">
            Request a call back <ArrowRight aria-hidden className="size-4" />
          </Link>
          <Link href="/contact" className="flex items-center gap-1.5 font-semibold text-white/80 hover:text-white">
            Contact page <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

export async function SiteFooter() {
  const destinations = await getDestinations();
  const settings = await getSiteSettings();
  const { social, company } = settings;

  return (
    <footer className="relative isolate overflow-hidden bg-[linear-gradient(160deg,var(--brand-primary-dark)_0%,var(--brand-dark)_70%)] text-white/75">
      {/* Faint logo-emblem watermark and a soft light glow */}
      <Image
        src="/logos/cerebellum-emblem.png"
        alt=""
        width={242}
        height={242}
        className="pointer-events-none absolute -right-16 -bottom-16 -z-10 w-[26rem] opacity-[0.07] brightness-0 invert"
      />
      <div aria-hidden className="absolute -top-40 left-1/3 -z-10 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(60_180_248/0.18),transparent_65%)]" />

      <Container className="relative">
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-20">
          {/* Brand column */}
          <div className="lg:col-span-4">
            <Logo onDark />
            <p className="mt-6 max-w-sm leading-relaxed">
              Independent guidance for students and families planning to study medicine and healthcare abroad, from the
              first conversation to the first day on campus.
            </p>

            <div className="mt-7 max-w-sm rounded-2xl bg-white/[0.07] p-5 ring-1 ring-white/15 backdrop-blur-sm">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <CalendarCheck aria-hidden className="size-5 text-gold" /> Free first consultation
              </p>
              <p className="mt-1 text-sm">In person, online or by phone. Parents are always welcome.</p>
              <ButtonLink href="/book-counselling" variant="secondary" size="sm" className="mt-4">
                Book Free Counselling <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
            </div>

            {social.length > 0 && (
              <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Social media">
                {social.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} (opens in a new tab)`}
                      className="grid size-10 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition-colors hover:bg-orange-fill"
                    >
                      <SocialIcon platform={s.platform} className="size-[1.1rem]" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <FooterLinks title="Explore" links={footerNav.explore} />
            <FooterLinks title="Support" links={footerNav.support} />
            <FooterLinks title="Destinations" links={destinations.map((d) => ({ label: d.name, href: `/destinations/${d.slug}` }))} />
            <ContactColumn settings={settings} />
          </div>
        </div>

        <div className="border-t border-white/15 py-8 text-sm">
          <p className="max-w-4xl leading-relaxed text-white/60">
            {siteConfig.name} is an independent education consultancy. Universities named on this website are listed
            for information and are not official partners unless stated. Admission, visa and medical-licensing decisions
            are made by universities, governments and regulators. We do not guarantee outcomes.
          </p>
          {company.registrationNo && (
            <p className="mt-3 text-white/60">
              Company registration no. {company.registrationNo}
              {company.registeredWith && ` · ${company.registeredWith}`}
              {company.panNo && ` · PAN ${company.panNo}`}
            </p>
          )}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © <CopyrightYear /> {siteConfig.name}. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <ul className="flex gap-6">
                {footerNav.legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="inline-block py-1 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <BackToTop />
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
