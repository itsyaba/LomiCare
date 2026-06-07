import {
  AmbientBackdrop,
  PageHeader,
  SectionHeading,
} from "@/components/dashboard/page-header";
import { TipCard } from "@/components/feed/tip-card";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { getCachedTips } from "@/lib/tipsCache";
import CheckIn from "@/models/CheckIn";
import { headers } from "next/headers";

const curated = [
  {
    category: "Nutrition",
    title: "Teff for steady energy",
    body: "Injera made with teff brings fiber and slow-release energy. Pair it with lighter portions when stress is already high.",
    emoji: "🌾",
  },
  {
    category: "Mindfulness",
    title: "Use buna as a pause",
    body: "Let one coffee or tea break be phone-free. Treat the smell, sound, and conversation as a reset.",
    emoji: "☕",
  },
  {
    category: "Movement",
    title: "Urban-friendly movement",
    body: "A short walk around the block or stairs after work can shift your mood without needing a gym plan.",
    emoji: "🌿",
  },
];

export default async function FeedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await dbConnect();

  const recent = await CheckIn.find({ userId: session?.user.id })
    .sort({ date: -1 })
    .limit(7);
  const tips = await getCachedTips(
    session?.user.id,
    recent.map((checkin) => ({
      date: checkin.date.toISOString(),
      mood: checkin.mood,
      energy: checkin.energy,
      sleep: checkin.sleep,
      stress: checkin.stress,
    })),
    "en",
  );

  return (
    <main className="relative isolate space-y-10 px-4 pb-12 lg:px-6">
      <AmbientBackdrop variant="warm" />

      <PageHeader
        eyebrow="wellness feed"
        title="Practical ideas,"
        italicAccent="gently chosen."
        sub="A small library of nudges — some tailored to your recent check-ins, some curated for life in Ethiopia."
      />

      <section className="space-y-5">
        <SectionHeading eyebrow="for you" title="Personalised tips" />
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <TipCard key={`${tip.category}-${tip.title}`} tip={tip} />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <SectionHeading eyebrow="curated" title="Selam notes" />
        <div className="grid gap-4 md:grid-cols-3">
          {curated.map((tip) => (
            <TipCard key={tip.title} tip={tip} />
          ))}
        </div>
      </section>
    </main>
  );
}
