import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl 2xl:max-w-[88rem] px-4 sm:px-6 lg:px-8", className)} {...props}>
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
        "relative py-14 sm:py-16 lg:py-20",
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
