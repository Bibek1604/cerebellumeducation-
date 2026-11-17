import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function LegalPage({ title, path, children }: { title: string; path: string; children: React.ReactNode }) {
  const updated = new Date(`${siteConfig.lastUpdated}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return (
    <>
      <PageHero title={title} description={`Last updated ${updated}`} crumbs={[{ label: title, href: path }]} />
      <Container className="py-16 sm:py-20">
        <article className="prose-brand mx-auto max-w-3xl text-ink">{children}</article>
      </Container>
    </>
  );
}
