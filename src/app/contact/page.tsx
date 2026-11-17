import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactChannels } from "@/components/sections/contact-channels";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Cerebellum Education Network about studying medicine abroad. Send us a message or reach our counselling team directly.",
  path: "/contact",
});

export default function ContactPage() {
  const { mapEmbedUrl, address } = siteConfig.contact;
  return (
    <>
      <PageHero
        title="We're here to help"
        description="Questions about destinations, eligibility or the admission process? Send us a message and our team will get back to you."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
            <aside className="space-y-6">
              <ContactChannels />
              <div className="rounded-3xl bg-gold-light p-7">
                <h2 className="text-lg font-extrabold">Planning to study medicine abroad?</h2>
                <p className="mt-2 leading-relaxed text-ink">
                  For detailed guidance, our counselling form helps us prepare for your conversation.
                </p>
                <Link href="/book-counselling" className="mt-4 inline-block font-bold text-primary underline underline-offset-4">
                  Book free counselling
                </Link>
              </div>
            </aside>
            <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft sm:p-10">
              <h2 className="text-2xl font-extrabold">Send us a message</h2>
              <p className="mt-2 mb-8 text-ink">Fields marked * are required.</p>
              <ContactForm />
            </div>
          </div>

          {mapEmbedUrl && (
            <div className="mt-14 overflow-hidden rounded-[2rem] border border-line">
              <iframe
                src={mapEmbedUrl}
                title={`Map showing the ${siteConfig.name} office${address ? ` in ${address.city}` : ""}`}
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          {!mapEmbedUrl && address && (
            <p className="mt-10 flex items-center gap-2 text-ink">
              <MapPin aria-hidden className="size-4 text-primary" /> {address.line1}, {address.city}, {address.country}
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
