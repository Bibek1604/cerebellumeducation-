import { ArrowRight, Quote } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Shown until genuine, consented student stories are added to data/testimonials.ts. */
export function StoriesEmpty({ compact }: { compact?: boolean }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-white p-8 text-center shadow-soft sm:p-12">
      <Quote aria-hidden className="mx-auto size-12 text-gold" />
      <h3 className="mx-auto mt-5 max-w-xl text-2xl font-extrabold">Real stories, shared with permission</h3>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-ink">
        We only publish experiences from real students who have agreed to share them. Their stories will appear here soon.
        {!compact && " In the meantime, our counsellors are happy to answer any question about what studying abroad is really like."}
      </p>
      <ButtonLink href="/book-counselling" variant="outline" className="mt-8">
        Talk to a counsellor <ArrowRight aria-hidden className="size-4" />
      </ButtonLink>
    </div>
  );
}
