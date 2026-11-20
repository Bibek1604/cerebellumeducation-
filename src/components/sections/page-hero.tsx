import Image from "next/image";
import { CalendarCheck, Plane } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";
import type { Crumb } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Inner-page hero, matching the homepage: white with soft colour washes and a
 * faint logo-emblem watermark; on the right a vivid cap-blue disc holding a
 * photo, the logo's orange arc, a plane, the logo seal and a floating card.
 * Pages with their own visual pass `aside` instead of `image`.
 */
export function PageHero({
  title,
  description,
  crumbs,
  children,
  aside,
  image,
  badge = { title: "Free first consultation", text: "In person, online or by phone" },
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs: Crumb[];
  children?: React.ReactNode;
  aside?: React.ReactNode;
  /** Photo shown in the blue disc on the right */
  image?: { src: string; alt: string; position?: string };
  /** Floating card beside the disc */
  badge?: { title: string; text: string } | null;
  className?: string;
}) {
  const visual = aside ?? (image ? <HeroDisc image={image} badge={badge} /> : null);

  return (
    <section className={cn("relative isolate overflow-hidden border-b border-line bg-white", className)}>
      {/* Faint emblem watermark, soft washes and dots, as on the homepage */}
      <Image
        src="/logos/cerebellum-emblem.png"
        alt=""
        width={242}
        height={242}
        className="pointer-events-none absolute top-1/2 left-[-7rem] -z-10 w-[30rem] -translate-y-1/2 opacity-[0.06] select-none 2xl:left-[2%]"
      />
      <div aria-hidden className="absolute -top-40 -left-40 -z-10 size-[34rem] rounded-full bg-[radial-gradient(circle,var(--brand-sky-light),transparent_65%)]" />
      <div aria-hidden className="absolute top-1/4 right-[-12rem] -z-10 size-[32rem] rounded-full bg-[radial-gradient(circle,var(--brand-secondary-light),transparent_65%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(26_115_212/0.09)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_60%)]" />

      <Container className="py-12 sm:py-14 lg:py-16">
        <Breadcrumbs items={crumbs} />
        <div className={cn("mt-8 grid gap-12", visual && "lg:grid-cols-[1.1fr_0.9fr] lg:items-center")}>
          <div>
            <h1 className="max-w-3xl text-4xl leading-[1.08] font-extrabold sm:text-5xl lg:text-[3.4rem]">{title}</h1>
            <span aria-hidden className="mt-5 block h-1 w-20 rounded-full bg-gradient-to-r from-gold to-accent" />
            {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink sm:text-xl">{description}</p>}
            {children}
          </div>
          {visual && <div>{visual}</div>}
        </div>
      </Container>
    </section>
  );
}

function HeroDisc({ image, badge }: { image: NonNullable<Parameters<typeof PageHero>[0]["image"]>; badge: { title: string; text: string } | null }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[24rem] lg:max-w-[26rem]">
      {/* Orange "C" arc */}
      <svg aria-hidden viewBox="0 0 400 400" className="absolute inset-[-6%] size-[112%] -rotate-[30deg]">
        <circle cx="200" cy="200" r="190" fill="none" stroke="var(--brand-secondary)" strokeWidth="8" strokeLinecap="round" strokeDasharray="640 1200" />
      </svg>
      {/* Vivid blue ring holding the photo */}
      <div className="bg-hero-vivid absolute inset-0 rounded-full p-2.5 shadow-[0_40px_80px_-30px_rgb(26_115_212/0.55)]">
        <div className="relative size-full overflow-hidden rounded-full">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 1024px) 26rem, 80vw"
            unoptimized={image.src.startsWith("/media/")}
            className="object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </div>
      </div>
      {/* Plane */}
      <span aria-hidden className="animate-float absolute -top-2 left-[8%] grid size-11 place-items-center rounded-full bg-white text-gold shadow-lift">
        <Plane className="size-5" />
      </span>
      {/* Logo seal */}
      <div className="animate-float absolute -right-3 bottom-[12%] grid size-20 place-items-center rounded-full bg-white shadow-lift ring-4 ring-gold/30 [animation-delay:-2.5s]">
        <Image src="/logos/cerebellum-emblem.png" alt="Cerebellum Education Network emblem" width={242} height={242} className="w-14" />
      </div>
      {/* Floating card */}
      {badge && (
        <div className="absolute bottom-[4%] -left-6 rounded-2xl border border-line bg-white p-3.5 pr-4 shadow-lift sm:-left-10">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
              <CalendarCheck aria-hidden className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="font-display font-bold whitespace-nowrap text-navy">{badge.title}</p>
              <p className="text-xs text-ink-soft">{badge.text}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
