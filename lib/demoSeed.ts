import { subDays } from "date-fns";

import { startOfLocalDay } from "@/lib/checkins";

type SeedCheckIn = {
  date: Date;
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
  note: string;
  aiInsight: string;
  language: "en" | "am";
};

const ENGLISH_INSIGHTS = [
  "Your stress is running high, so keep today's goal small and concrete. Sit with a cup of buna before the day pulls you in another direction.",
  "Energy is recovering — protect it with one steady habit and a calm evening rather than catching up on everything at once.",
  "Sleep has been thin this week. Choose one early-evening cue (low light, no screen) and treat it as non-negotiable tonight.",
  "Mood is softer today. Let one small kindness — a check-in with family, a quiet meal — be enough for the afternoon.",
  "A grounded day. Anchor it with movement: a short walk after lunch is enough to keep the steadiness through the week.",
  "Stress is steady but underneath the surface. A 5-minute pause with shai or buna can be the reset the body is asking for.",
  "Your patterns are settling. Tonight, simplify dinner — injera, shiro, a little water — and let the evening stay slow.",
];

const AMHARIC_INSIGHTS = [
  "ዛሬ ጭንቀትዎ ከፍ ያለ ይመስላል። የቡና ብርጭቆ ይዘዙ፣ ትንሽ ያረጋጉ።",
  "ኃይልዎ እያገገመ ነው። አንድ ቀላል ልምድ ይምረጡ።",
  "እንቅልፍዎ አጭር ነበር። ምሽቱን ቀላል ያድርጉ።",
  "ዛሬ ስሜትዎ ይለቅቃል። ከቤተሰብ ጋር አጭር ጊዜ ያጠፉ።",
  "የተረጋጋ ቀን ነው። ከምሳ በኋላ ትንሽ ይራመዱ።",
  "ጭንቀት በውስጥዎ ይታያል። የቡና እረፍት ያድርጉ።",
  "ቅኝቶዎ እየተስተካከሉ ናቸው። ምሳዎን ቀላል ያድርጉ።",
];

const NOTES = [
  "Long day at work, didn't have time to eat well.",
  "Had a coffee ceremony with family — felt grounded.",
  "Couldn't sleep past 3am. Thinking about tomorrow's deadline.",
  "Walked along the river in the morning. Felt clear.",
  "Skipped breakfast. Buna helped.",
  "Family stopped by — good but tiring.",
  "Fasting today — feeling lighter than I expected.",
  "",
  "Bad traffic in Addis. Came home wired.",
  "Tried a short pause between meetings. It helped.",
  "Mom called. Cried a little but felt held.",
  "",
  "Good shiro dinner. Quiet evening.",
  "Tried to journal. Wrote two lines.",
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function buildDemoCheckIns(language: "en" | "am" = "en"): SeedCheckIn[] {
  const today = startOfLocalDay();
  const checkins: SeedCheckIn[] = [];

  // Realistic 14-day arc: starts rough, gradually improves with a wobble
  const moodCurve = [4, 5, 4, 6, 5, 6, 7, 6, 7, 8, 7, 8, 7, 8];
  const stressCurve = [5, 4, 5, 3, 4, 3, 3, 4, 2, 2, 3, 2, 3, 2];
  const sleepCurve = [5, 5.5, 6, 6, 5, 6.5, 7, 7, 7.5, 7, 7, 7.5, 8, 7.5];
  const energyCurve = [2, 3, 2, 3, 3, 4, 4, 3, 4, 5, 4, 4, 4, 5];

  // Seed 13 days ending YESTERDAY — leave today empty so judges can do the
  // voice check-in themselves and watch the streak grow + new insight arrive.
  for (let i = 13; i >= 1; i--) {
    const date = subDays(today, i);
    const idx = 13 - i;
    const noteIdx = idx % NOTES.length;
    const insightIdx = idx % ENGLISH_INSIGHTS.length;
    const aiInsight =
      language === "am"
        ? AMHARIC_INSIGHTS[insightIdx % AMHARIC_INSIGHTS.length]
        : ENGLISH_INSIGHTS[insightIdx];

    checkins.push({
      date,
      mood: clamp(moodCurve[idx] ?? 6, 1, 10),
      energy: clamp(energyCurve[idx] ?? 3, 1, 5),
      sleep: clamp(sleepCurve[idx] ?? 7, 0, 12),
      stress: clamp(stressCurve[idx] ?? 3, 1, 5),
      note: NOTES[noteIdx],
      aiInsight,
      language,
    });
  }

  return checkins;
}

export function buildDemoChat(language: "en" | "am") {
  if (language === "am") {
    return [
      {
        role: "user" as const,
        content: "ዛሬ ጭንቀት ይሰማኛል። ምን ላድርግ?",
      },
      {
        role: "assistant" as const,
        content:
          "እዚህ ነኝ። መጀመሪያ አንድ ብርጭቆ ውሃ ይጠጡ፣ ከዚያ 4 ደቂቃ ቡና ይዘዙ — ምንም ሌላ ሳያስቡ። ከዚያ ዛሬ የሚሠራ አንድ ቀላል እርምጃ ይምረጡ።",
      },
    ];
  }
  return [
    {
      role: "user" as const,
      content: "I've been feeling stretched thin this week. Any thoughts?",
    },
    {
      role: "assistant" as const,
      content:
        "I hear that. Before any plans, try this: drink a glass of water, then sit with buna or tea for 4 minutes without doing anything else. Then pick just one small thing for today — not the whole list. The week will still be there.",
    },
  ];
}

export function buildDemoRitual(language: "en" | "am") {
  if (language === "am") {
    return {
      title: "የቡና እረፍት",
      explanation: "አጭር የቡና ጊዜ የዛሬን ጫና ሊቀንስ ይችላል።",
      durationMinutes: 10,
      steps: [
        "አንድ ብርጭቆ ውሃ ይጠጡ።",
        "ቡና ይዘዙ እና 4 ደቂቃ ተቀምጡ።",
        "አንድ ቀላል እርምጃ ይምረጡ።",
      ],
      culturalTag: "buna pause",
      language: "am" as const,
    };
  }
  return {
    title: "A small buna pause",
    explanation: "A short coffee pause can soften the pressure of the day.",
    durationMinutes: 10,
    steps: [
      "Drink a glass of water.",
      "Sit with buna for 4 minutes without rushing.",
      "Choose one easy next step.",
    ],
    culturalTag: "buna pause",
    language: "en" as const,
  };
}
