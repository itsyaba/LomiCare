import { Mic, Sparkles, Coffee, UsersRound } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Check in by voice",
    body: "Speak naturally in Amharic or English. No forms, no judgment.",
  },
  {
    icon: Sparkles,
    title: "Selam listens",
    body: "Our AI gently extracts how you're really doing — mood, energy, what's heavy.",
  },
  {
    icon: Coffee,
    title: "A daily ritual",
    body: "Get one small, culturally grounded practice for today. Buna, walk, prayer, rest.",
  },
  {
    icon: UsersRound,
    title: "Stay close",
    body: "Nudge your trusted circle when you need them. No long messages required.",
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-border/60 bg-background py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary">
            How it works
          </p>
          <h2 className="font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Four small steps,
            <br />
            <span className="italic text-muted-foreground">every day.</span>
          </h2>
        </div>

        <ol className="grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex flex-col gap-4 bg-background p-8"
            >
              <span className="font-serif text-sm text-muted-foreground/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <step.icon className="size-6 text-primary" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
