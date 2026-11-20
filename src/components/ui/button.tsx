import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "light" | "outline-light";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white shadow-[0_8px_20px_-8px_var(--brand-primary)] hover:bg-primary-dark hover:shadow-[0_12px_28px_-10px_var(--brand-primary)]",
  secondary: "bg-orange-fill text-white shadow-[0_8px_20px_-10px_var(--brand-secondary-dark)] hover:text-white",
  outline: "border border-line bg-white text-navy hover:border-primary hover:text-primary",
  ghost: "text-primary hover:bg-primary-light",
  light: "bg-white text-navy hover:bg-gold-light",
  "outline-light": "border border-white/30 text-white hover:border-white hover:bg-white/10",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-all duration-200 ease-out",
    "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-60",
    "active:translate-y-px",
    variants[variant],
    sizes[size],
    className,
  );
}

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<React.ComponentProps<"a">, "href" | "className">) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses(variant, size, className)} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  children,
  ...rest
}: CommonProps & Omit<React.ComponentProps<"button">, "className">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
    </button>
  );
}
