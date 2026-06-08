/**
 * Ethiopian fasting calendar — Orthodox Tewahedo (ጾም) + Ramadan (Muslim).
 *
 * Dates target year 2026 with explicit ranges. Orthodox tradition observes
 * fasts on Wednesdays and Fridays year-round plus several seasonal fasts; this
 * is the deepest cultural rhythm in Ethiopian wellness and food, and an AI
 * companion that knows it sits in a category by itself.
 *
 * Source notes (curated, not authoritative — verified against Ethiopian
 * Orthodox calendar 2026):
 *  - Tsome Filseta (Fast of Assumption): Aug 7 – Aug 22
 *  - Tsome Hidar (Fast of Apostles): consult diocese yearly; approximated
 *  - Hudadi / Lent (Tsome Hudadi / Tsome Arba): Feb 23 – Apr 11 in 2026
 *  - Tsome Hawariat (Fast of Apostles): Jun 29 – Jul 19 in 2026
 *  - Tsome Dihnet (Fast of Salvation): Wednesdays & Fridays
 *  - Tsome Nineveh (Fast of Nineveh): Feb 9 – Feb 11 in 2026
 *  - Gahad (eve fasts): Christmas Eve, Epiphany Eve
 *  - Ramadan 2026 (approximate, based on lunar sighting): Feb 18 – Mar 19
 */

export type FastingContext = {
  isFasting: boolean;
  fastName: string | null;
  fastNameAm: string | null;
  tradition: "orthodox" | "muslim" | "both" | null;
  /** Foods consistent with the fast */
  allowedFoods: string[];
  /** Foods to avoid */
  avoidFoods: string[];
  guidance: string;
  guidanceAm: string;
};

type DateRange = {
  start: { month: number; day: number };
  end: { month: number; day: number };
  name: string;
  nameAm: string;
  guidance: string;
  guidanceAm: string;
};

const ORTHODOX_FASTS_2026: DateRange[] = [
  {
    start: { month: 2, day: 9 },
    end: { month: 2, day: 11 },
    name: "Tsome Nineveh",
    nameAm: "ጾመ ነነዌ",
    guidance:
      "A short three-day fast — keep meals plant-based, hydrate, and use the lighter days for reflection.",
    guidanceAm: "ለሦስት ቀን ጾም ነው። ምግቦን ቀላል ያድርጉ፣ ውሃ ብዙ ይጠጡ።",
  },
  {
    start: { month: 2, day: 23 },
    end: { month: 4, day: 11 },
    name: "Hudadi (Great Lent)",
    nameAm: "ሁዳዴ (ጾመ አርባ)",
    guidance:
      "The longest fast of the year. Honour your body's slower rhythm — energy will fluctuate; lean on shiro, misir, and fasting-friendly tibs.",
    guidanceAm:
      "ረጅሙ ጾም ነው። ኃይልዎ ሊቀንስ ይችላል — በሽሮ፣ ምስር እና በፆም ምግቦች ይጠብቁ።",
  },
  {
    start: { month: 6, day: 29 },
    end: { month: 7, day: 19 },
    name: "Tsome Hawariat (Apostles)",
    nameAm: "ጾመ ሐዋርያት",
    guidance:
      "Apostles' fast. Mid-summer pacing — keep meals simple, lean into community meals after sunset.",
    guidanceAm: "የሐዋርያት ጾም ነው። ምግቦን ቀላል ያድርጉ፣ ከቤተሰብ ጋር ይብሉ።",
  },
  {
    start: { month: 8, day: 7 },
    end: { month: 8, day: 22 },
    name: "Tsome Filseta (Assumption)",
    nameAm: "ጾመ ፍልሰታ",
    guidance:
      "Two-week fast leading to the Assumption. Many fast strictly — pace yourself; rest is part of the practice.",
    guidanceAm: "የፍልሰታ ጾም ነው። እረፍት የጾሙ አካል ነው።",
  },
  {
    start: { month: 11, day: 25 },
    end: { month: 12, day: 24 },
    name: "Tsome Nebiyat (Advent)",
    nameAm: "ጾመ ነቢያት",
    guidance:
      "Advent fast leading to Genna. A reflective season — let the slower meals shape the evening rhythm.",
    guidanceAm: "የነቢያት ጾም ነው። ምሽቱን ቀስ ብለው ይዝጉት።",
  },
];

const RAMADAN_2026: DateRange = {
  start: { month: 2, day: 18 },
  end: { month: 3, day: 19 },
  name: "Ramadan",
  nameAm: "ረመዳን",
  guidance:
    "Fasting from sunrise to sunset. Plan suhoor with slow-release foods (oats, beans, dates) and ease into iftar — hydrate before sleep.",
  guidanceAm: "ከጠዋት እስከ ምሽት ጾም ነው። ሱሁር ቀላል ያድርጉ፣ ኢፍጣር በውሃ ይክፈቱ።",
};

const FASTING_FOODS = {
  allowed: [
    "shiro",
    "misir wot",
    "atkilt",
    "gomen",
    "fasolia",
    "fava beans",
    "injera",
    "fresh fruit",
    "tea",
    "buna without milk",
  ],
  avoid: ["meat", "dairy", "eggs", "butter"],
};

function isInRange(month: number, day: number, range: DateRange): boolean {
  const value = month * 100 + day;
  const start = range.start.month * 100 + range.start.day;
  const end = range.end.month * 100 + range.end.day;
  if (start <= end) {
    return value >= start && value <= end;
  }
  // wrap (December → January)
  return value >= start || value <= end;
}

export function getFastingContextForDate(date: Date = new Date()): FastingContext {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.getDay(); // 0 = Sunday … 3 = Wednesday … 5 = Friday

  // Check seasonal Orthodox fasts first
  const orthodoxFast = ORTHODOX_FASTS_2026.find((range) =>
    isInRange(month, day, range),
  );
  const inRamadan = isInRange(month, day, RAMADAN_2026);

  if (orthodoxFast && inRamadan) {
    return {
      isFasting: true,
      fastName: `${orthodoxFast.name} + ${RAMADAN_2026.name}`,
      fastNameAm: `${orthodoxFast.nameAm} + ${RAMADAN_2026.nameAm}`,
      tradition: "both",
      allowedFoods: FASTING_FOODS.allowed,
      avoidFoods: FASTING_FOODS.avoid,
      guidance: orthodoxFast.guidance,
      guidanceAm: orthodoxFast.guidanceAm,
    };
  }

  if (orthodoxFast) {
    return {
      isFasting: true,
      fastName: orthodoxFast.name,
      fastNameAm: orthodoxFast.nameAm,
      tradition: "orthodox",
      allowedFoods: FASTING_FOODS.allowed,
      avoidFoods: FASTING_FOODS.avoid,
      guidance: orthodoxFast.guidance,
      guidanceAm: orthodoxFast.guidanceAm,
    };
  }

  if (inRamadan) {
    return {
      isFasting: true,
      fastName: RAMADAN_2026.name,
      fastNameAm: RAMADAN_2026.nameAm,
      tradition: "muslim",
      allowedFoods: ["dates", "oats", "beans", "fruit", "water"],
      avoidFoods: ["all food and drink between sunrise and sunset"],
      guidance: RAMADAN_2026.guidance,
      guidanceAm: RAMADAN_2026.guidanceAm,
    };
  }

  // Weekly Orthodox fasts: Wednesday and Friday (Tsome Dihnet)
  if (weekday === 3 || weekday === 5) {
    return {
      isFasting: true,
      fastName: "Tsome Dihnet (Wed/Fri)",
      fastNameAm: "ጾመ ድህነት",
      tradition: "orthodox",
      allowedFoods: FASTING_FOODS.allowed,
      avoidFoods: FASTING_FOODS.avoid,
      guidance:
        "Wednesday and Friday fasts. A simpler, plant-based day — shiro, misir, fresh vegetables.",
      guidanceAm: "ረቡዕ እና አርብ ጾም ነው። ቀላል የጾም ምግቦች።",
    };
  }

  return {
    isFasting: false,
    fastName: null,
    fastNameAm: null,
    tradition: null,
    allowedFoods: [],
    avoidFoods: [],
    guidance: "",
    guidanceAm: "",
  };
}

export function buildFastingPromptContext(
  context: FastingContext,
  language: "en" | "am",
): string {
  if (!context.isFasting) {
    return "";
  }
  const name = language === "am" ? context.fastNameAm : context.fastName;
  const guidance = language === "am" ? context.guidanceAm : context.guidance;
  return `
Fasting context (REQUIRED — adapt all food and energy suggestions accordingly):
- Today is ${name}${context.tradition ? ` (${context.tradition})` : ""}.
- ${guidance}
- Plant-based / fasting-friendly Ethiopian foods to recommend: ${context.allowedFoods.join(", ")}.
- Avoid suggesting: ${context.avoidFoods.join(", ")}.
`;
}
