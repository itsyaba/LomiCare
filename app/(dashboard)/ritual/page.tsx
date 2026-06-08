import Link from "next/link";
import { headers } from "next/headers";
import { Coffee, Flame, Sparkles } from "lucide-react";

import {
  AmbientBackdrop,
  PageHeader,
  SectionHeading,
} from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { DailyRitualCard } from "@/components/ritual/DailyRitualCard";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Ritual from "@/models/Ritual";

export default async function RitualPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  await dbConnect();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const todaysRitual = await Ritual.findOne({
    userId: session?.user.id,
    createdAt: { $gte: startOfDay },
  }).sort({ createdAt: -1 });

  const recentBuna = await Ritual.find({
    userId: session?.user.id,
    culturalTag: "buna ceremony",
  })
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow="ritual"
        title="A small daily practice,"
        italicAccent="rooted in buna."
        sub="One culturally grounded ritual a day — or the full six-stage Ethiopian coffee ceremony when you have a few quiet minutes."
      />

      {/* Buna ceremony hero */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a1208] via-[#3a2517] to-[#5a3320] p-8 text-[#faf7f2]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-[radial-gradient(circle,rgba(232,184,75,0.4),transparent_70%)] blur-2xl"
        />
        <div className="relative grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#e8b84b]">
              the centrepiece ritual
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light leading-tight">
              The Buna ceremony,
              <span className="block italic text-[#e8b84b]">
                guided in six stages.
              </span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#faf7f2]/80">
              Incense, roasting, grinding, brewing, the first pour (abol), and a
              quiet sit. Breathing cues guide every stage. Around three minutes.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 gap-2 bg-[#c8622a] text-[#faf7f2] hover:bg-[#c8622a]/90"
            >
              <Link href="/ritual/buna">
                <Flame className="size-4" />
                Begin the ritual
              </Link>
            </Button>
          </div>
          <div className="flex justify-center">
            <Coffee
              strokeWidth={1}
              className="size-40 text-[#e8b84b] opacity-50"
            />
          </div>
        </div>
      </section>

      {/* Today's AI-generated ritual */}
      <section className="space-y-4">
        <SectionHeading eyebrow="today" title="Selam's nudge for today" />
        {todaysRitual ? (
          <DailyRitualCard ritual={JSON.parse(JSON.stringify(todaysRitual))} />
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 bg-card/60 p-8 text-center backdrop-blur">
            <Sparkles className="mx-auto size-6 text-primary" />
            <p className="mt-3 font-serif text-xl text-foreground">
              Check in first.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Selam will shape a ritual that fits your day once you record how
              you&apos;re feeling.
            </p>
            <Button asChild className="mt-5">
              <Link href="/checkin">Open daily check-in</Link>
            </Button>
          </div>
        )}
      </section>

      {/* Recent buna history */}
      {recentBuna.length > 0 && (
        <section className="space-y-4">
          <SectionHeading
            eyebrow="recent ceremonies"
            title="Your last buna sittings"
          />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentBuna.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString("en", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <p className="mt-2 font-serif text-lg text-foreground">
                  {r.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {r.durationMinutes} min · {r.culturalTag}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
