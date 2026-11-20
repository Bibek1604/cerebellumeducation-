"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Horizontal scroll-snap carousel with ‹ › buttons. Two cards visible on larger screens. */
export function CounsellorCarousel({ children }: { children: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    const el = track.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  function scroll(dir: 1 | -1) {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? el.clientWidth) + 24), behavior: "smooth" });
  }

  return (
    <div className="mt-10">
      <div className="mb-5 flex justify-end gap-3">
        {([-1, 1] as const).map((d) => {
          const enabled = d < 0 ? canPrev : canNext;
          return (
            <button
              key={d}
              type="button"
              onClick={() => scroll(d)}
              disabled={!enabled}
              aria-label={d < 0 ? "Previous counsellors" : "Next counsellors"}
              className={cn(
                "grid size-12 place-items-center rounded-full border-2 transition-colors",
                enabled ? "border-primary text-primary hover:bg-primary hover:text-white" : "cursor-not-allowed border-line text-ink-soft/50",
              )}
            >
              {d < 0 ? <ChevronLeft className="size-5" /> : <ChevronRight className="size-5" />}
            </button>
          );
        })}
      </div>
      <ul
        ref={track}
        className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}
