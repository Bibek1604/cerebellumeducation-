import { ArrowLeft } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { FoliaArcs } from "@/components/brand/folia";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="relative isolate overflow-hidden py-28 text-center sm:py-36">
      <FoliaArcs className="absolute bottom-0 left-1/2 -z-10 w-[56rem] -translate-x-1/2 text-primary/10" rings={8} />
      <Container>
        <p className="font-display text-7xl font-extrabold text-primary sm:text-8xl">404</p>
        <h1 className="mt-6 text-3xl font-extrabold sm:text-4xl">This page has moved on</h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink">The page you&apos;re looking for doesn&apos;t exist or may have been moved.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">
            <ArrowLeft aria-hidden className="size-4" /> Back to home
          </ButtonLink>
          <ButtonLink href="/destinations" variant="outline">
            Explore destinations
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
