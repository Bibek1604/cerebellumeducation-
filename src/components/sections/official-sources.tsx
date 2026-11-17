import { ExternalLink } from "lucide-react";
import type { ExternalSource } from "@/types/content";

export function OfficialSources({ sources, title = "Official sources" }: { sources: ExternalSource[]; title?: string }) {
  if (sources.length === 0) return null;
  return (
    <div>
      <h3 className="text-sm font-bold tracking-[0.14em] text-ink-soft uppercase">{title}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {sources.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-line bg-white p-4 transition-colors hover:border-primary"
            >
              <span>
                <span className="block font-semibold text-navy group-hover:text-primary">{s.label}</span>
                {s.publisher && <span className="mt-0.5 block text-sm text-ink-soft">{s.publisher}</span>}
              </span>
              <ExternalLink aria-hidden className="mt-1 size-4 shrink-0 text-ink-soft group-hover:text-primary" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
