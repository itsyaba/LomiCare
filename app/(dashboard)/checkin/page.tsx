import { headers } from "next/headers";

import {
  AmbientBackdrop,
  PageHeader,
} from "@/components/dashboard/page-header";
import { CheckinForm } from "@/components/checkin/checkin-form";
import { StreakBadge } from "@/components/checkin/streak-badge";
import {
  calculateStreak,
  endOfLocalDay,
  serializeCheckIn,
  startOfLocalDay,
} from "@/lib/checkins";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import CheckIn from "@/models/CheckIn";

export default async function CheckinPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await dbConnect();

  const userId = session?.user.id;
  const today = await CheckIn.findOne({
    userId,
    date: { $gte: startOfLocalDay(), $lt: endOfLocalDay() },
  });
  const recent = await CheckIn.find({ userId }).sort({ date: -1 }).limit(60);
  const streak = calculateStreak(recent);
  const completed = today ? serializeCheckIn(today) : null;

  return (
    <main className="relative isolate space-y-8 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="cool" />

      <PageHeader
        eyebrow="daily rhythm"
        title="How are you"
        italicAccent="today?"
        sub="A one-minute pause. Selam listens to your energy, sleep, and stress so the rituals stay close to where you are."
        right={<StreakBadge streak={streak} />}
      />

      <section className="grid w-full gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-5">
          <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Why we ask
            </p>
            <p className="mt-3 font-serif text-lg leading-7 text-foreground">
              Small daily readings let your patterns become visible — without
              long journaling.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                "Mood — how light or heavy the day feels",
                "Energy — what your body has to give",
                "Sleep — how restful the night was",
                "Stress — what's pressing on you",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section>
          {completed ? (
            <div className="rounded-2xl border border-border/60 bg-card/70 p-6 backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Done for today
              </p>
              <h2 className="mt-3 font-serif text-2xl font-medium text-foreground">
                Today is complete. <span className="italic text-primary">Rest.</span>
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Come back tomorrow to keep the streak moving.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                <Metric label="Mood" value={`${completed.mood}/10`} />
                <Metric label="Energy" value={`${completed.energy}/5`} />
                <Metric label="Sleep" value={`${completed.sleep}h`} />
                <Metric label="Stress" value={`${completed.stress}/5`} />
              </div>
              <div className="mt-6 rounded-xl border border-border/60 bg-background/60 p-5">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Selam insight
                </p>
                <p className="mt-2 font-serif text-base leading-7 text-foreground">
                  {completed.aiInsight}
                </p>
              </div>
            </div>
          ) : (
            <CheckinForm />
          )}
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/60 p-3">
      <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-serif text-lg text-foreground">{value}</p>
    </div>
  );
}
