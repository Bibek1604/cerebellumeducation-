"use client";

import { useEffect, useRef, type ComponentProps } from "react";

type RevealProps = ComponentProps<"div"> & {
  delay?: number;
  y?: number;
};

/**
 * Gentle fade + slide-up when the element scrolls into view.
 * The server HTML is always visible, so nothing waits for JavaScript: only
 * elements still below the screen are hidden, and only until they are reached.
 */
export function Reveal({ delay = 0, y = 24, children, ...props }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.opacity = "0";
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        el.style.opacity = "";
        el.animate(
          [
            { opacity: 0, transform: `translateY(${y}px)` },
            { opacity: 1, transform: "none" },
          ],
          { duration: 600, delay: delay * 1000, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        );
      },
      // Huge top margin: anything already scrolled past also counts as "in view",
      // so a fast flick can never leave content stuck invisible.
      { rootMargin: "100000px 0px -80px 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.style.opacity = "";
    };
  }, [delay, y]);

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}
