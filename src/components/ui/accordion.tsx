"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import type { FaqItem } from "@/types/content";
import { cn } from "@/lib/utils";

export function Accordion({
  items,
  defaultOpen = 0,
  className,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  defaultOpen?: number | null;
  className?: string;
  headingLevel?: "h2" | "h3" | "h4";
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const Heading = headingLevel;

  return (
    <div className={cn("divide-y divide-line rounded-3xl border border-line bg-white", className)}>
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${baseId}-btn-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        return (
          <div key={item.question}>
            <Heading className="text-base sm:text-lg">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-6 px-5 py-5 text-left font-bold text-navy transition-colors hover:text-primary sm:px-7 sm:py-6"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border transition-all duration-300",
                    isOpen ? "rotate-45 border-gold bg-gold text-navy" : "border-line text-primary group-hover:border-primary",
                  )}
                >
                  <Plus className="size-4" />
                </span>
              </button>
            </Heading>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-6 leading-relaxed text-ink sm:px-7 sm:pr-20">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
