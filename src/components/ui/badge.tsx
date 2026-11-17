import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "blue",
  className,
}: {
  children: React.ReactNode;
  tone?: "blue" | "gold" | "neutral" | "light";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        tone === "blue" && "bg-primary-light text-primary-dark",
        tone === "gold" && "bg-gold-light text-navy",
        tone === "neutral" && "bg-muted text-ink",
        tone === "light" && "bg-white/10 text-white ring-1 ring-white/20",
        className,
      )}
    >
      {children}
    </span>
  );
}
