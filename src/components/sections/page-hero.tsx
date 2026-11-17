import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import { FoliaArcs } from "@/components/brand/folia";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function PageHero({
  title,
  description,
  crumbs,
  children,
  aside,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line bg-brand-gradient-soft", className)}>
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="bg-dot-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <FoliaArcs className="absolute -right-20 -bottom-8 w-[44rem] text-primary/10" rings={7} />
        <div className="absolute -top-32 -left-24 size-96 rounded-full bg-primary-light blur-3xl" />
      </div>
      <Container className="py-14 sm:py-16 lg:py-20">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-10 grid gap-12", aside && "lg:grid-cols-[1.15fr_0.85fr] lg:items-center")}>
          <div>
            <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.5rem]">{title}</h1>
            {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">{description}</p>}
            {children}
          </div>
          {aside && <div>{aside}</div>}
        </div>
      </Container>
    </section>
  );
}
