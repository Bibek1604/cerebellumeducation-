import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Programme } from "@/types/content";
import { programmeIcons } from "@/components/ui/icons";

export function ProgrammeCard({ programme, index }: { programme: Programme; index?: number }) {
  const Icon = programmeIcons[programme.icon];
  return (
    <article className="group relative flex h-full flex-col rounded-3xl border border-line bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift">
      <div className="flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl bg-primary-light text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
          <Icon aria-hidden className="size-7" strokeWidth={1.75} />
        </span>
        {typeof index === "number" && (
          <span aria-hidden className="font-display text-sm font-bold text-ink-soft/60">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="mt-6 text-xl font-extrabold">
        <Link href={`/programs/${programme.slug}`} className="after:absolute after:inset-0">
          {programme.name}
        </Link>
      </h3>
      <p className="mt-2.5 leading-relaxed text-ink">{programme.summary}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-bold text-primary">
        Learn more
        <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
