import { headers } from "next/headers";

import { InsightCard } from "@/components/dashboard/insight-card";
import { MoodHistoryChart } from "@/components/dashboard/mood-history-chart";
import { WellnessScoreCard } from "@/components/dashboard/wellness-score-card";
import { TipCard } from "@/components/feed/tip-card";
import {
  calculateStreak,
  endOfLocalDay,
  startOfLocalDay,
} from "@/lib/checkins";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { generateTips } from "@/lib/mistral";
import CheckIn from "@/models/CheckIn";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user.id;

  await dbConnect();

  const checkins = await CheckIn.find({ userId }).sort({ date: -1 }).limit(14);
  const today = await CheckIn.findOne({
    userId,
    date: { $gte: startOfLocalDay(), $lt: endOfLocalDay() },
  });
  const recentSeven = checkins.slice(0, 7);
  const averageMood =
    recentSeven.length > 0
      ? recentSeven.reduce((total, checkin) => total + checkin.mood, 0) /
        recentSeven.length
      : 0;
  const score = Math.round((averageMood / 10) * 100);
  const tips = await generateTips(
    recentSeven.map((checkin) => ({
      date: checkin.date.toISOString(),
      mood: checkin.mood,
      energy: checkin.energy,
      sleep: checkin.sleep,
      stress: checkin.stress,
    })),
    "en",
  );

  return (
    <main className="space-y-6 px-4 lg:px-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
          Selam dashboard
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold">
          Good to see you, {session?.user.name?.split(" ")[0] ?? "friend"}.
        </h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <WellnessScoreCard
          score={score}
          streak={calculateStreak(checkins)}
          checkedInToday={Boolean(today)}
        />
        <MoodHistoryChart
          data={checkins
            .slice()
            .reverse()
            .map((checkin) => ({
              date: checkin.date.toLocaleDateString("en", {
                month: "short",
                day: "numeric",
              }),
              mood: checkin.mood,
            }))}
        />
      </div>

      <InsightCard insight={checkins[0]?.aiInsight} />

      <section>
        <h2 className="mb-3 text-lg font-semibold">Today&apos;s tips</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <TipCard key={`${tip.category}-${tip.title}`} tip={tip} />
          ))}
        </div>
      </section>
    </main>
  );
}
