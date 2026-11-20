import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Dashed "add your content here" frame. Only rendered in development
 * (see `showPlaceholders` in data/showcase.ts), never on the live site.
 */
export function PlaceholderFrame({
  icon: Icon,
  title,
  hint,
  className,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-primary/30 bg-primary-light/50 p-6 text-center",
        className,
      )}
    >
      <span className="absolute top-3 right-3 rounded-full bg-gold-light px-2 py-0.5 text-[0.65rem] font-bold text-gold-dark">
        Only visible on your computer
      </span>
      <span className="grid size-12 place-items-center rounded-full bg-white text-primary shadow-soft">
        <Icon aria-hidden className="size-6" />
      </span>
      <p className="font-semibold text-navy">{title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-ink-soft">{hint}</p>
    </div>
  );
}
