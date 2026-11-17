import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3 leading-relaxed text-ink">
          <span aria-hidden className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary-light text-primary">
            <Check className="size-3.5" strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
