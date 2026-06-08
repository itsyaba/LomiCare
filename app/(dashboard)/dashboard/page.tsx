import { headers } from "next/headers";

import {
  AmbientBackdrop,
  PageHeader,
  SectionHeading,
} from "@/components/dashboard/page-header";
import { InsightCard } from "@/components/dashboard/insight-card";
import { MoodHistoryChart } from "@/components/dashboard/mood-history-chart";
import { WellnessScoreCard } from "@/components/dashboard/wellness-score-card";
import { WellnessGarden } from "@/components/wellness-garden/WellnessGarden";
import { FastingPill } from "@/components/dashboard/fasting-pill";
import { TipCard } from "@/components/feed/tip-card";
import { WellnessTrendCard } from "@/components/dashboard/WellnessTrendCard";
import { DailyRitualCard } from "@/components/ritual/DailyRitualCard";
import { PeacePlanCard } from "@/components/peace-plan/PeacePlanCard";
import { SupportNudgeCard } from "@/components/trusted-circle/SupportNudgeCard";
import Ritual from "@/models/Ritual";
import { calculateBurnoutRisk } from "@/lib/wellnessTrends";
import { getFastingContextForDate } from "@/lib/fasting-calendar";
import {
  calculateStreak,
  endOfLocalDay,
  startOfLocalDay,
} from "@/lib/checkins";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { getCachedTips } from "@/lib/tipsCache";
import CheckIn from "@/models/CheckIn";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user.id;

  await dbConnect();

  const checkins = await CheckIn.find({ userId }).sort({ date: -1 }).limit(14);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const ritual = await Ritual.findOne({
    userId,
    createdAt: { $gte: startOfDay },
  }).sort({ createdAt: -1 });
  const burnoutRisk = calculateBurnoutRisk(checkins);
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
  const tips = await getCachedTips(
    userId,
    recentSeven.map((checkin) => ({
      date: checkin.date.toISOString(),
      mood: checkin.mood,
      energy: checkin.energy,
      sleep: checkin.sleep,
      stress: checkin.stress,
    })),
    "en",
  );

  const firstName = session?.user.name?.split(" ")[0] ?? "friend";
  const now = new Date();
  const hour = now.getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow={`ሰላም · ${now.toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}`}
        title={`${greeting}, ${firstName}.`}
        italicAccent="Breathe."
        sub="A quiet look at how you've been moving through the week — and a few gentle nudges for today."
        right={<FastingPill context={getFastingContextForDate()} />}
      />

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
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
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <InsightCard
              insight={checkins[0]?.aiInsight}
              proverbAm={checkins[0]?.proverbAm}
              proverbEn={checkins[0]?.proverbEn}
              proverbMeaning={checkins[0]?.proverbMeaning}
            />
            <WellnessGarden streak={calculateStreak(checkins)} />
          </div>
          {burnoutRisk.risk === "high" && <SupportNudgeCard />}
          <div className="grid gap-5 md:grid-cols-2">
            <WellnessTrendCard trends={burnoutRisk} />
            <PeacePlanCard />
          </div>
        </div>
        <aside className="space-y-5">
          {ritual ? (
            <DailyRitualCard ritual={JSON.parse(JSON.stringify(ritual))} />
          ) : (
            <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 p-6 text-center backdrop-blur">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Today&apos;s ritual
              </p>
              <p className="mt-3 font-serif text-lg text-foreground">
                Check in first — a ritual will appear here.
              </p>
            </div>
          )}
        </aside>
      </section>

      <section className="space-y-5">
        <SectionHeading eyebrow="for today" title="A few gentle ideas" />
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <TipCard key={`${tip.category}-${tip.title}`} tip={tip} />
          ))}
        </div>
      </section>
    </main>
  );
}
