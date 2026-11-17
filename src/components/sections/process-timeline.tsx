"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { ProcessStep } from "@/data/process";
import { cn, pad2 } from "@/lib/utils";

/**
 * Horizontal timeline on desktop, vertical on mobile.
 * The progress line draws in when scrolled into view; hovering/focusing a
 * step on desktop advances the highlight.
 */
export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const pct = steps.length > 1 ? (active / (steps.length - 1)) * 100 : 0;

  return (
    <div>
      {/* Desktop */}
      <div className="relative hidden lg:block">
        <div className="absolute top-7 right-[6.25%] left-[6.25%] h-[3px] rounded-full bg-line" aria-hidden>
          <motion.div
            className="h-full origin-left rounded-full bg-gradient-to-r from-primary to-gold"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-gold transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <ol className="relative grid grid-cols-8 gap-3">
          {steps.map((s, i) => {
            const done = i <= active;
            return (
              <li key={s.title}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={i === active ? "step" : undefined}
                  className="group flex w-full flex-col items-center text-center"
                >
                  <span
                    className={cn(
                      "relative grid size-14 place-items-center rounded-full border-[3px] font-display text-sm font-extrabold transition-all duration-300",
                      done ? "border-primary bg-primary text-white" : "border-primary/25 bg-white text-primary",
                      i === active && "scale-110 border-gold bg-gold text-navy shadow-[0_0_0_8px_var(--brand-secondary-light)]",
                    )}
                  >
                    {pad2(i + 1)}
                  </span>
                  <span className={cn("mt-5 text-[0.95rem] leading-snug font-bold", i === active ? "text-primary" : "text-navy")}>
                    {s.title}
                  </span>
                  <span className="mt-2 text-[0.82rem] leading-relaxed text-ink-soft">{s.short}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile / tablet */}
      <ol className="relative lg:hidden">
        <span aria-hidden className="absolute top-2 bottom-2 left-[1.375rem] w-[3px] rounded-full bg-line" />
        <motion.span
          aria-hidden
          className="absolute top-2 bottom-2 left-[1.375rem] w-[3px] origin-top rounded-full bg-gradient-to-b from-primary to-gold"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
        {steps.map((s, i) => (
          <li key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
            <span className="relative z-10 grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-white bg-primary font-display text-xs font-extrabold text-white shadow-soft">
              {pad2(i + 1)}
            </span>
            <div className="pt-1.5">
              <h3 className="text-lg font-bold">{s.title}</h3>
              <p className="mt-1 leading-relaxed text-ink">{s.short}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
