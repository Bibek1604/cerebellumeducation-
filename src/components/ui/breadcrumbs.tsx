import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { breadcrumbJsonLd, type Crumb } from "@/lib/seo";
import { JsonLd } from "./json-ld";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, onDark, className }: { items: Crumb[]; onDark?: boolean; className?: string }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(all)} />
      <nav aria-label="Breadcrumb" className={className}>
        <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", onDark ? "text-white/60" : "text-ink-soft")}>
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {last ? (
                  <span aria-current="page" className={cn("font-medium", onDark ? "text-white" : "text-navy")}>
                    {c.label}
                  </span>
                ) : (
                  <>
                    <Link href={c.href} className={cn("transition-colors", onDark ? "hover:text-gold" : "hover:text-primary")}>
                      {c.label}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5 opacity-60" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
