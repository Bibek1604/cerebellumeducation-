import { ExternalLink, ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { visible } from "@/cms/content";
import type { LinkValue, Section } from "@/cms/types";

/** Trust/safety notice. Content: Admin → Pages → Homepage → 'Verify the university' notice. */
export function VerifyStrip({ section }: { section: Section }) {
  const d = section.data as { heading: string; text: string; button: LinkValue };
  const show = visible(section);
  const external = /^https?:\/\//.test(d.button?.href ?? "");
  return (
    <section className="bg-white py-14">
      <Container>
        <div className="flex flex-col gap-5 rounded-[1.75rem] border border-gold/40 bg-cream p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-orange-fill text-white">
              <ShieldAlert aria-hidden className="size-6" />
            </span>
            <div>
              <h2 className="text-lg font-extrabold">{d.heading}</h2>
              {d.text && <p className="mt-1 max-w-2xl leading-relaxed text-ink">{d.text}</p>}
            </div>
          </div>
          {show("button") && d.button?.label && d.button.href && (
            <a
              href={d.button.href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary"
            >
              {d.button.label} {external && <ExternalLink aria-hidden className="size-4" />}
              {external && <span className="sr-only">(opens in a new tab)</span>}
            </a>
          )}
        </div>
      </Container>
    </section>
  );
}
