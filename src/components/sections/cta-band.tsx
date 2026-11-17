import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { BrandArc, FoliaArcs } from "@/components/brand/folia";

export function CtaBand({
  title = "Let's Build Your Medical Future Together.",
  description = "Speak with our education counsellors and explore the opportunities that match your academic goals.",
  primary = { label: "Book Free Counselling", href: "/book-counselling" },
  secondary = { label: "Contact Our Team", href: "/contact" },
}: {
  title?: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <section className="bg-white pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[2.5rem] bg-brand-gradient px-6 py-16 text-center sm:px-12 lg:py-20">
            <FoliaArcs className="absolute -bottom-6 left-1/2 -z-10 w-[64rem] -translate-x-1/2 text-white/15" rings={8} />
            <BrandArc className="absolute -top-16 -right-20 -z-10 w-80 opacity-80 sm:w-96" strokeWidth={10} />
            <BrandArc className="absolute -bottom-40 -left-24 -z-10 hidden w-96 rotate-180 opacity-40 lg:block" strokeWidth={10} />
            <h2 className="mx-auto max-w-3xl text-3xl leading-tight font-extrabold text-white sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">{description}</p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <ButtonLink href={primary.href} variant="secondary" size="lg">
                {primary.label} <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="outline-light" size="lg">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
