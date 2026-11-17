import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  tone = "white",
  ...props
}: React.ComponentProps<"section"> & { tone?: "white" | "muted" | "navy" }) {
  return (
    <section
      className={cn(
        "relative py-20 sm:py-24 lg:py-28",
        tone === "muted" && "bg-muted",
        tone === "navy" && "bg-navy text-white/80",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
