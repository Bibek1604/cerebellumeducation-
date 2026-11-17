import { ArrowRight, CalendarCheck, MonitorSmartphone, PhoneCall, Send } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ButtonLink } from "@/components/ui/button";
import { BrandArc } from "@/components/brand/folia";

const steps = [
  { icon: Send, title: "Request", text: "Share your details and preferred time using our short form." },
  { icon: CalendarCheck, title: "Confirm", text: "A counsellor contacts you to confirm a convenient time." },
  { icon: PhoneCall, title: "Consult", text: "Talk by video or phone, parents are welcome to join." },
];

export function OnlineCounselling() {
  return (
    <section className="bg-white pb-20 sm:pb-24 lg:pb-28">
      <Container>
        <div className="grid overflow-hidden rounded-[2.5rem] bg-cream lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-brand-gradient relative isolate flex min-h-72 items-center justify-center overflow-hidden p-10">
            <BrandArc className="absolute -right-10 -bottom-16 -z-10 w-[26rem] opacity-70" strokeWidth={10} />
            <div className="relative w-full max-w-xs rounded-3xl bg-white/10 p-6 ring-1 ring-white/20 backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold text-navy">
                  <MonitorSmartphone aria-hidden className="size-6" />
                </span>
                <div>
                  <p className="font-display font-extrabold text-white">Online counselling</p>
                  <p className="text-sm text-white/70">Wherever you are</p>
                </div>
              </div>
              <div className="mt-6 space-y-2.5" aria-hidden>
                <div className="h-2.5 w-4/5 rounded-full bg-white/25" />
                <div className="h-2.5 w-3/5 rounded-full bg-white/15" />
                <div className="h-2.5 w-2/3 rounded-full bg-white/15" />
              </div>
              <div className="mt-6 flex -space-x-2" aria-hidden>
                {["S", "P", "C"].map((l, i) => (
                  <span key={l} className={`grid size-9 place-items-center rounded-full text-xs font-bold ring-2 ring-white/40 ${i === 2 ? "bg-gold text-navy" : "bg-white text-primary"}`}>
                    {l}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs text-white/70">Student · Parent · Counsellor</p>
            </div>
          </div>

          <div className="p-8 sm:p-12 lg:p-14">
            <Reveal>
              <h2 className="text-3xl leading-tight font-extrabold sm:text-4xl">Can&apos;t visit our office? Talk to us online.</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                Get the same personalised guidance by video or phone, ideal for students outside the city and for parents
                who want to join from work.
              </p>
            </Reveal>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <Reveal delay={i * 0.06} className="h-full rounded-2xl bg-white p-5 shadow-soft">
                    <span className="flex items-center gap-2">
                      <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-extrabold text-white">{i + 1}</span>
                      <s.icon aria-hidden className="size-5 text-gold-dark" />
                    </span>
                    <h3 className="mt-4 font-extrabold">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink">{s.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/book-counselling?mode=online">
                Book online counselling <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href="/admission-process" variant="outline">
                How the process works
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
