import { cache } from "react";

import { dbConnect } from "@/lib/db";
import { generateTips, type Language, type WellnessTip } from "@/lib/mistral";
import TipsCache from "@/models/TipsCache";

type CheckInSummary = {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
};

const TTL_MS = 30 * 60 * 1000; // 30 min

const inflightGlobal = globalThis as unknown as {
  __tipsInflight?: Map<string, Promise<WellnessTip[]>>;
};
const inflight =
  inflightGlobal.__tipsInflight ??
  (inflightGlobal.__tipsInflight = new Map());

const FALLBACK_LANG_TIPS: Record<Language, WellnessTip[]> = {
  en: [
    {
      category: "Movement",
      title: "Take a short walk",
      body: "A 10-minute walk after lunch can steady your energy without making the day feel heavier.",
      emoji: "🌿",
    },
    {
      category: "Community",
      title: "Reconnect briefly",
      body: "A short check-in with family or a trusted friend can soften the pressure of the day.",
      emoji: "☕",
    },
    {
      category: "Sleep",
      title: "Keep the evening simple",
      body: "Reduce screen time before bed and make space for a simple tea or quiet routine.",
      emoji: "🌙",
    },
  ],
  am: [
    {
      category: "Movement",
      title: "አጭር መራመድ",
      body: "ከምሳ በኋላ 10 ደቂቃ መራመድ ኃይልዎን ሊያስተካክል ይችላል።",
      emoji: "🌿",
    },
    {
      category: "Community",
      title: "ከሰው ጋር ይገናኙ",
      body: "ከቤተሰብ ወይም ጓደኛ ጋር አጭር ውይይት የቀኑን ጫና ሊቀንስ ይችላል።",
      emoji: "☕",
    },
    {
      category: "Sleep",
      title: "ምሽቱን ያቀሉ",
      body: "ከመኝታ በፊት ስክሪን ይቀንሱ እና ቀላል መጠጥ ይውሰዱ።",
      emoji: "🌙",
    },
  ],
};

export const getCachedTips = cache(
  async (
    userId: string | undefined,
    recent: CheckInSummary[],
    language: Language,
  ): Promise<WellnessTip[]> => {
    if (!userId) return FALLBACK_LANG_TIPS[language];

    await dbConnect();
    const now = new Date();
    const key = `${userId}|${language}`;

    const existing = await TipsCache.findOne({ userId, language });
    if (existing && existing.expiresAt > now && existing.tips.length > 0) {
      return existing.tips as WellnessTip[];
    }

    const pending = inflight.get(key);
    if (pending) return pending;

    const work = (async () => {
      try {
        const tips = await generateTips(recent, language);
        const expiresAt = new Date(Date.now() + TTL_MS);
        try {
          await TipsCache.findOneAndUpdate(
            { userId, language },
            { tips, expiresAt, updatedAt: new Date() },
            { upsert: true, new: true },
          );
        } catch (err) {
          console.warn("TipsCache upsert failed", err);
        }
        return tips;
      } finally {
        inflight.delete(key);
      }
    })();

    inflight.set(key, work);
    return work;
  },
);
