"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Floating "Get Free Counselling" pill. Appears once the visitor has scrolled
 * past the first screen; hidden on the booking page itself.
 * `besideFab` shifts it left so it never covers the WhatsApp/call buttons.
 */
export function StickyCta({ besideFab }: { besideFab: boolean }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/book-counselling")) return null;

  return (
    <Link
      href="/book-counselling"
      aria-hidden={!show}
      tabIndex={show ? undefined : -1}
      className={cn(
        "fixed bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 inline-flex items-center gap-2 rounded-full bg-orange-fill px-5 py-3.5 text-sm font-bold text-white shadow-lift transition-all duration-300 sm:bottom-6",
        besideFab ? "right-[5.5rem] sm:right-[6.5rem]" : "right-4 sm:right-6",
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <CalendarCheck aria-hidden className="size-4.5" /> Get Free Counselling
    </Link>
  );
}
