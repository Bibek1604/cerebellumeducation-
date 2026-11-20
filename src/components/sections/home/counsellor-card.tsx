import Image from "next/image";
import { Briefcase, CalendarCheck, Languages } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import type { TeamMember } from "@/data/team";
import { memberAnchor } from "@/data/team";
import { initials, cn } from "@/lib/utils";

/** Counsellor profile card: brand label, name, role, details, framed photo, Book + Profile. */
export function CounsellorCard({ member: m, placeholder }: { member: TeamMember; placeholder?: boolean }) {
  return (
    <article
      className={cn(
        "relative isolate flex h-full flex-col overflow-hidden rounded-3xl border bg-white p-6 shadow-soft sm:p-8",
        placeholder ? "border-2 border-dashed border-primary/30" : "border-line",
      )}
    >
      {/* Soft corner circle */}
      <span aria-hidden className="absolute -top-20 -right-20 -z-10 size-56 rounded-full bg-primary-light" />
      {placeholder && (
        <span className="absolute top-0 left-8 rounded-b-lg bg-gold-light px-2.5 py-0.5 text-[0.65rem] font-bold whitespace-nowrap text-gold-dark">
          Sample · only visible on your computer
        </span>
      )}

      <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.14em] text-primary uppercase">
            <Image src="/logos/cerebellum-emblem.png" alt="" width={20} height={20} className="size-5" />
            Cerebellum Education Network
          </p>
          <h3 className="mt-4 text-2xl leading-tight font-bold sm:text-[1.9rem]">{m.name}</h3>
          <p className="mt-2 font-semibold text-primary">{m.role}</p>
          <span aria-hidden className="mt-2 block h-0.5 w-12 rounded-full bg-gold" />
          {m.focus && <p className="mt-3 text-ink">{m.focus}</p>}

          <ul className="mt-5 space-y-3">
            {m.experience && <Detail icon={Briefcase} label="Experience" value={m.experience} />}
            {m.languages && m.languages.length > 0 && <Detail icon={Languages} label="Speaks" value={m.languages.join(", ")} />}
          </ul>
        </div>

        {/* Photo with orange and blue corner brackets */}
        <div className="relative mx-auto size-44 shrink-0 sm:mx-0 sm:size-48">
          <span aria-hidden className="absolute -top-3 -left-3 h-3/4 w-3/4 rounded-tl-2xl border-t-4 border-l-4 border-gold" />
          <span aria-hidden className="absolute -right-3 -bottom-3 h-3/4 w-3/4 rounded-br-2xl border-r-4 border-b-4 border-primary" />
          {m.photo ? (
            <Image src={m.photo.src} alt={m.photo.alt} width={384} height={384} unoptimized={m.photo.src.startsWith("/media/")} className="relative size-full rounded-2xl bg-white object-cover shadow-lift" />
          ) : (
            <span className="relative grid size-full place-items-center rounded-2xl bg-gradient-to-br from-primary-light to-sky-light font-display text-4xl font-bold text-primary shadow-lift">
              {initials(m.name)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-3 pt-7"><span aria-hidden className="col-span-2 -mt-1 mb-3 block h-px bg-line" />
        <ButtonLink href="/book-counselling" variant="secondary" className="w-full">
          <CalendarCheck aria-hidden className="size-4" /> Book
        </ButtonLink>
        <ButtonLink href={`/about#${memberAnchor(m.name)}`} variant="outline" className="w-full border-primary text-primary">
          Profile
        </ButtonLink>
      </div>
    </article>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Briefcase; label: string; value: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-primary/70 text-primary">
        <Icon aria-hidden className="size-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-xs text-ink-soft">{label}</span>
        <span className="font-semibold text-navy">{value}</span>
      </span>
    </li>
  );
}
