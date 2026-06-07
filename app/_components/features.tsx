import { Mic, Coffee, UsersRound, ShieldCheck, MapPin, Sparkles } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice-first Amharic",
    description:
      "Speak your check-in naturally. Selam transcribes and understands both Amharic and English.",
  },
  {
    icon: Sparkles,
    title: "Culturally aware AI",
    description:
      "Coaching that knows buna, fasting seasons, family expectations, and the rhythm of Ethiopian life.",
  },
  {
    icon: Coffee,
    title: "Daily ritual engine",
    description:
      "One small, grounded practice each day — tuned to how you actually feel right now.",
  },
  {
    icon: UsersRound,
    title: "Trusted circle",
    description:
      "Light-touch nudges to the family and friends who keep you well. No oversharing required.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-aware",
    description:
      "Selam quietly watches for crisis signals and points to professional help when it matters.",
  },
  {
    icon: MapPin,
    title: "Retreat mode",
    description:
      "A dedicated hospitality experience built with Kuriftu for guided in-resort wellness stays.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-border/60 bg-muted/40 py-24">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.22em] text-secondary">
              What's inside
            </p>
            <h2 className="font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
              Built for the way
              <br />
              <span className="italic">we actually live.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">
            Not another mindfulness app. Selam is shaped around language,
            faith, food, family and pace — the things that actually carry us.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.title}
              className="group rounded-2xl border border-border/60 bg-card p-7 transition hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(200,98,42,0.08)]"
            >
              <f.icon
                className="mb-6 size-7 text-primary transition group-hover:scale-110"
                strokeWidth={1.5}
              />
              <h3 className="font-serif text-xl text-foreground">{f.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {f.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
