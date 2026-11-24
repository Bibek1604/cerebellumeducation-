import Image from "next/image";
import { Building2, Clock, Image as ImageIcon, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container, Section } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaceholderFrame } from "@/components/ui/placeholder-frame";
import { Highlight } from "@/cms/highlight";
import { getSiteSettings, hasImage, on, phoneLinkFrom, visible, whatsappLinkFrom } from "@/cms/content";
import type { ImageValue, LinkValue, Section as CmsSection } from "@/cms/types";
import { showPlaceholders } from "@/data/showcase";

type OfficeData = {
  heading: string;
  description: string;
  photos: unknown;
  labels: { address: string; hours: string; phone: string; email: string };
  bookButton: LinkValue;
  directionsLabel: string;
  whatsappLabel: string;
};

/**
 * "Visit us": office photos, address, hours, map and contact.
 * Text and photos: Admin → Pages → Contact → Visit us / office.
 * Contact values: Admin → Contact details & company.
 * Hidden on the live site until there is something real to show.
 */
export async function OfficeSection({ section }: { section: CmsSection }) {
  const d = section.data as OfficeData;
  const show = visible(section);
  const { contact: c } = await getSiteSettings();
  const phone = phoneLinkFrom(c);
  const wa = whatsappLinkFrom(c, "Hello Cerebellum, I'd like to visit your office.");
  const photos = on<{ image: ImageValue; caption: string }>(d.photos).filter((p) => hasImage(p.image));
  const hasDetails = Boolean(c.address || phone || wa || c.email);
  if (photos.length === 0 && !hasDetails && !showPlaceholders) return null;

  const [main, ...rest] = photos;
  const address = c.address && [c.address.line1, c.address.line2, c.address.city, c.address.country].filter(Boolean).join(", ");

  return (
    <Section>
      <Container>
        <Reveal>
          <SectionHeading align="center" title={<Highlight text={d.heading} />} description={show("description") && d.description ? d.description : undefined} />
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Office photos */}
          <Reveal>
            {main ? (
              <div className="grid h-full grid-cols-2 gap-4">
                <figure className="relative col-span-2 overflow-hidden rounded-3xl shadow-soft">
                  <Image
                    src={main.image.src}
                    alt={main.image.alt}
                    width={1600}
                    height={1000}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="aspect-[16/9] w-full object-cover"
                    style={{ objectPosition: main.image.position || undefined }}
                  />
                  {show("photos.caption") && main.caption && (
                    <figcaption className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy">{main.caption}</figcaption>
                  )}
                </figure>
                {rest.slice(0, 2).map((p) => (
                  <figure key={p._id} className="overflow-hidden rounded-3xl shadow-soft">
                    <Image
                      src={p.image.src}
                      alt={p.image.alt}
                      width={800}
                      height={600}
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="aspect-[4/3] w-full object-cover"
                      style={{ objectPosition: p.image.position || undefined }}
                    />
                  </figure>
                ))}
              </div>
            ) : (
              showPlaceholders && (
                <div className="grid h-full grid-cols-2 gap-4">
                  <PlaceholderFrame icon={Building2} title="Your office front, with your logo" hint="Add office photos in Admin → Pages → Contact → Visit us / office." className="col-span-2 aspect-[16/9]" />
                  <PlaceholderFrame icon={ImageIcon} title="Reception / waiting area" hint="A bright, tidy photo works best." className="aspect-[4/3]" />
                  <PlaceholderFrame icon={ImageIcon} title="A counselling session" hint="Counsellor with a student and parent." className="aspect-[4/3]" />
                </div>
              )
            )}
          </Reveal>

          {/* Contact card */}
          <Reveal delay={0.08}>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-6 shadow-soft sm:p-8">
              <ul className="space-y-5">
                <ContactRow icon={MapPin} label={d.labels?.address} value={address} placeholder="Add your address in Admin → Contact details & company" />
                <ContactRow icon={Clock} label={d.labels?.hours} value={c.officeHours?.join(" · ")} placeholder="Add opening hours in Admin → Contact details & company" />
                <ContactRow icon={Phone} label={d.labels?.phone} value={phone?.label} href={phone?.href} placeholder="Add your phone number in Admin → Contact details & company" />
                <ContactRow icon={Mail} label={d.labels?.email} value={c.email} href={c.email ? `mailto:${c.email}` : undefined} placeholder="Add your email in Admin → Contact details & company" />
              </ul>

              {show("map") &&
                (c.mapEmbedUrl ? (
                  <iframe
                    src={c.mapEmbedUrl}
                    title="Map showing our office location"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="mt-6 aspect-[16/9] w-full rounded-2xl border border-line"
                  />
                ) : (
                  showPlaceholders && (
                    <PlaceholderFrame icon={MapPin} title="Google Map" hint="Add the map embed link in Admin → Contact details & company." className="mt-6 aspect-[16/9]" />
                  )
                ))}

              <div className="mt-auto flex flex-wrap gap-3 pt-6">
                {show("bookButton") && d.bookButton?.label && d.bookButton.href && (
                  <ButtonLink href={d.bookButton.href} variant="secondary">
                    {d.bookButton.label}
                  </ButtonLink>
                )}
                {show("directionsLabel") && c.mapLink && (
                  <ButtonLink href={c.mapLink} variant="outline" external>
                    <Navigation aria-hidden className="size-4" /> {d.directionsLabel}
                  </ButtonLink>
                )}
                {show("whatsappLabel") && wa && (
                  <ButtonLink href={wa} variant="outline" external>
                    <MessageCircle aria-hidden className="size-4" /> {d.whatsappLabel}
                  </ButtonLink>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  placeholder,
}: {
  icon: typeof MapPin;
  label?: string;
  value?: string | null;
  href?: string;
  placeholder: string;
}) {
  if (!value && !showPlaceholders) return null;
  return (
    <li className="flex gap-4">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-light text-primary">
        <Icon aria-hidden className="size-5" />
      </span>
      <div>
        {label && <p className="text-sm font-semibold text-ink-soft">{label}</p>}
        {value ? (
          href ? (
            <a href={href} className="font-semibold text-navy hover:text-primary">
              {value}
            </a>
          ) : (
            <p className="font-semibold text-navy">{value}</p>
          )
        ) : (
          <p className="text-sm text-gold-dark italic">{placeholder}</p>
        )}
      </div>
    </li>
  );
}
