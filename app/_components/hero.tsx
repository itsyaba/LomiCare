import Link from "next/link";
import { HeartPulse, Languages, Sprout } from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: HeartPulse,
    title: "Daily check-ins",
    description: "Track mood, energy, sleep, and stress in a rhythm you can keep.",
  },
  {
    icon: Languages,
    title: "English and Amharic",
    description: "Get guidance in the language that feels most natural that day.",
  },
  {
    icon: Sprout,
    title: "Rooted in Ethiopia",
    description: "Wellness prompts shaped by coffee culture, fasting, food, and community.",
  },
];

export default function HeroSection() {
  return (
    <main className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[radial-gradient(circle_at_20%_20%,rgba(232,184,75,0.32),transparent_28%),linear-gradient(135deg,#faf7f2_0%,#f4eadc_48%,#e7d7bf_100%)]">
      <div className="absolute inset-x-0 top-0 h-3 bg-[repeating-linear-gradient(90deg,#c8622a_0_36px,#e8b84b_36px_72px,#4a7c59_72px_108px,#1a1208_108px_144px)] opacity-90" />
      <section className="container grid min-h-[calc(100svh-4rem)] items-center gap-10 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-secondary">
            Selam wellness
          </p>
          <h1 className="font-display text-5xl font-bold leading-[0.95] text-foreground sm:text-6xl lg:text-7xl">
            Selam is your Ethiopian wellness companion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Daily check-ins, culturally aware AI coaching, and personal insights
            for Ethiopians who want care that understands their language,
            food, faith, family, and pace of life.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-md px-6"
            >
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card/90 p-5 shadow-[0_24px_80px_rgba(74,52,24,0.16)] backdrop-blur">
          <div className="rounded-md bg-muted p-5">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <h2 className="font-display text-3xl font-semibold">
                  Peace starts within.
                </h2>
              </div>
              <div className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                ሰላም
              </div>
            </div>
            <div className="space-y-3">
              <div className="rounded-md bg-card p-4 shadow-sm">
                <p className="text-sm font-medium">Mood</p>
                <div className="mt-3 h-3 rounded-full bg-gradient-to-r from-red-400 via-accent to-secondary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  7/10 - steady, but tired
                </p>
              </div>
              <div className="rounded-md bg-card p-4 shadow-sm">
                <p className="text-sm font-medium">Selam insight</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Take a short walk before dinner, then let your evening slow
                  down around buna or tea with someone you trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid gap-4 pb-16 md:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="rounded-lg border border-border bg-card p-5 shadow-sm"
          >
            <feature.icon className="mb-4 size-6 text-primary" />
            <h3 className="text-base font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {feature.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
