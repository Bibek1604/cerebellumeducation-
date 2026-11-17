import { cn } from "@/lib/utils";

export function SectionHeading({
  title,
  description,
  align = "left",
  as: Tag = "h2",
  onDark,
  className,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  onDark?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Tag
        className={cn(
          "text-3xl leading-[1.12] font-extrabold sm:text-4xl lg:text-[2.75rem]",
          onDark && "text-white",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p className={cn("mt-5 text-base leading-relaxed sm:text-lg", onDark ? "text-white/75" : "text-ink")}>
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
