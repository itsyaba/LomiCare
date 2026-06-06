import { TipCard } from "@/components/feed/tip-card";
import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { generateTips } from "@/lib/mistral";
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
  const tips = await generateTips(
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
    <main className="space-y-6 px-4 lg:px-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
          Wellness feed
        </p>
        <h1 className="font-display mt-2 text-4xl font-bold">
          Practical ideas for today
        </h1>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Personalized tips</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tips.map((tip) => (
            <TipCard key={`${tip.category}-${tip.title}`} tip={tip} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Curated Selam notes</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {curated.map((tip) => (
            <TipCard key={tip.title} tip={tip} />
          ))}
        </div>
      </section>
    </main>
  );
}
