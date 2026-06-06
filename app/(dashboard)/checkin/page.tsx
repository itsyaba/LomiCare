import { headers } from "next/headers";

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
    <main className="mx-auto grid w-full max-w-5xl gap-6 px-4 md:grid-cols-[0.85fr_1.15fr] lg:px-6">
      <section>
        <div className="sticky top-20 rounded-lg border bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
            Daily rhythm
          </p>
          <h1 className="font-display mt-3 text-4xl font-bold leading-tight">
            How are you feeling today?
          </h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            A one-minute check-in helps Selam understand your energy, rest, and
            stress patterns before AI personalization is connected.
          </p>
          <div className="mt-5">
            <StreakBadge streak={streak} />
          </div>
        </div>
      </section>

      <section>
        {completed ? (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold">Today is complete</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You already checked in today. Come back tomorrow to keep the
              streak moving.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              <Metric label="Mood" value={`${completed.mood}/10`} />
              <Metric label="Energy" value={`${completed.energy}/5`} />
              <Metric label="Sleep" value={`${completed.sleep}h`} />
              <Metric label="Stress" value={`${completed.stress}/5`} />
            </div>
            <div className="mt-5 rounded-lg bg-muted/70 p-4">
              <p className="text-sm font-semibold">Selam insight</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {completed.aiInsight}
              </p>
            </div>
          </div>
        ) : (
          <CheckinForm />
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/70 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
