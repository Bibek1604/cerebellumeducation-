import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock, MessageCircle, Mic, Phone, PhoneOff, Video } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CmsIcon } from "@/cms/cms-icon";
import { getSiteSettings, hasImage, on, phoneLinkFrom, textsOf, visible, whatsappLinkFrom } from "@/cms/content";
import { Highlight } from "@/cms/highlight";
import type { ImageValue, LinkValue, Section } from "@/cms/types";
import { cn } from "@/lib/utils";

type OnlineData = {
  heading: string;
  description: string;
  points?: unknown;
  steps: unknown;
  primaryButton: LinkValue;
  secondaryButton: LinkValue;
  card: { title: string; liveLabel: string; image?: ImageValue };
};

const ok = (l: LinkValue | undefined) => Boolean(l?.label && l.href);

/**
 * Full-width blue band for online counselling.
 * Text: Admin → Pages → Homepage → Online counselling band.
 * Phone, WhatsApp and hours: Admin → Contact details & company.
 */
export async function OnlineBand({ section }: { section: Section }) {
  const d = section.data as OnlineData;
  const show = visible(section);
  const { contact } = await getSiteSettings();
  const phone = phoneLinkFrom(contact);
  const whatsapp = whatsappLinkFrom(contact, "Hello Cerebellum, I'd like an online counselling session.");
  const hours = contact.officeHours?.[0];

  const points = show("points") ? textsOf(d.points) : [];
  const steps = show("steps") ? on<{ icon: string; label: string; title: string; text?: string }>(d.steps) : [];
  const showCard = show("card");
  const primary = show("primaryButton") && ok(d.primaryButton);
  const secondary = show("secondaryButton") && ok(d.secondaryButton);

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(115deg,#0b3a8f_0%,#135ca6_55%,#1a73d4_100%)] py-16 sm:py-24">
      <div aria-hidden className="absolute -top-40 -right-32 -z-10 size-[34rem] rounded-full bg-sky/25 blur-3xl" />
      <div aria-hidden className="absolute -bottom-48 -left-32 -z-10 size-[28rem] rounded-full bg-gold/15 blur-3xl" />

      <Container>
        <div className={cn("grid items-center gap-12", showCard && "lg:grid-cols-[1.1fr_0.9fr]")}>
          <Reveal className="max-w-2xl min-w-0">
            <h2 className="text-3xl leading-[1.12] font-extrabold text-balance text-white sm:text-4xl lg:text-5xl">
              <Highlight text={d.heading} className="text-[#ffbd73]" />
            </h2>
            {show("description") && d.description && <p className="mt-5 text-lg leading-relaxed text-white/90">{d.description}</p>}

            {points.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-center gap-2 font-semibold text-white">
                    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/25">
                      <Check aria-hidden className="size-3.5" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            )}

            {(primary || whatsapp) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                {primary && (
                  <ButtonLink href={d.primaryButton.href} variant="secondary" size="lg">
                    {d.primaryButton.label} <ArrowRight aria-hidden className="size-4" />
                  </ButtonLink>
                )}
                {whatsapp && (
                  <ButtonLink href={whatsapp} variant="outline-light" size="lg" external>
                    <MessageCircle aria-hidden className="size-5" /> Chat on WhatsApp
                    <span className="sr-only"> (opens in a new tab)</span>
                  </ButtonLink>
                )}
              </div>
            )}

            {(phone || hours || secondary) && (
              <div className="mt-6 flex flex-col items-start gap-x-6 gap-y-3 text-white/90 sm:flex-row sm:flex-wrap sm:items-center">
                {phone && (
                  <a href={phone.href} className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline-offset-4 hover:underline">
                    <Phone aria-hidden className="size-4" /> {phone.label}
                  </a>
                )}
                {hours && (
                  <span className="inline-flex items-center gap-2">
                    <Clock aria-hidden className="size-4" /> {hours}
                  </span>
                )}
                {secondary && (
                  <Link href={d.secondaryButton.href} className="inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4 hover:no-underline">
                    {d.secondaryButton.label}
                  </Link>
                )}
              </div>
            )}
          </Reveal>

          {showCard && (
            <Reveal delay={0.1} className="min-w-0">
              <VideoCall card={d.card} />
            </Reveal>
          )}
        </div>

        {steps.length > 0 && (
          <ol className={cn("mt-12 grid gap-4 sm:mt-16", steps.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2", steps.length === 4 && "md:grid-cols-2 lg:grid-cols-4")}>
            {steps.map((s, i) => (
              <li key={s._id} className="min-w-0">
                <Reveal delay={i * 0.08} className="flex h-full gap-4 rounded-3xl bg-white p-6 shadow-lift">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange-fill text-white">
                    <CmsIcon icon={s.icon} aria-hidden className="size-5.5" />
                  </span>
                  <div className="min-w-0">
                    {s.label && <p className="text-sm font-bold text-primary-dark">{s.label}</p>}
                    <p className="text-lg leading-snug font-extrabold text-navy">{s.title}</p>
                    {s.text && <p className="mt-1.5 leading-relaxed text-ink">{s.text}</p>}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        )}
      </Container>
    </section>
  );
}

/** Decorative picture of a video call; hidden from screen readers. */
function VideoCall({ card }: { card: OnlineData["card"] | undefined }) {
  const own = hasImage(card?.image) ? card.image : null;
  return (
    <div aria-hidden className="relative mx-auto max-w-lg">
      <div className="overflow-hidden rounded-[2rem] bg-navy p-3 shadow-lift ring-1 ring-white/20">
        <div className="flex items-center justify-between gap-3 px-3 pt-1 pb-3">
          <p className="font-display font-extrabold text-white">{card?.title}</p>
          {card?.liveLabel && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
              <span className="size-2 rounded-full bg-gold motion-safe:animate-pulse" /> {card.liveLabel}
            </span>
          )}
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          {own ? (
            <Image src={own.src} alt="" fill sizes="(min-width: 1024px) 32rem, 92vw" className="object-cover" style={{ objectPosition: own.position || "50% 50%" }} />
          ) : (
            // Cropped close to the counsellor, so it reads as one person on a call.
            <Image src="/images/why-counselling.jpg" alt="" fill sizes="(min-width: 1024px) 64rem, 184vw" className="object-cover" style={{ objectPosition: "0% 50%", transform: "scale(2.1)", transformOrigin: "26% 10%" }} />
          )}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-navy/80 to-transparent" />
          <span className="absolute bottom-4 left-4 rounded-full bg-navy/80 px-3 py-1 text-xs font-semibold text-white">Counsellor</span>
          <div className="absolute right-4 bottom-4 aspect-[4/5] w-[26%] overflow-hidden rounded-2xl ring-2 ring-white">
            <Image src="/images/about-student.jpg" alt="" fill sizes="9rem" className="object-cover" style={{ objectPosition: "72% 50%" }} />
            <span className="absolute bottom-1.5 left-1.5 rounded-full bg-navy/80 px-2 py-0.5 text-[0.6875rem] font-semibold text-white">You</span>
          </div>
        </div>

        <div className="flex justify-center gap-3 pt-4 pb-2">
          {[Mic, Video, PhoneOff].map((Icon, k) => (
            <span key={k} className={cn("grid size-11 place-items-center rounded-full text-white", k === 2 ? "bg-red-600" : "bg-white/15")}>
              <Icon className="size-5" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
