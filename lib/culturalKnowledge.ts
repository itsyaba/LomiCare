import type { Language } from "@/lib/mistral";

export type CulturalKnowledgeItem = {
  id: string;
  category: string;
  keywords: string[];
  contentEn: string;
  contentAm?: string;
  safetyNotes?: string;
};

const KNOWLEDGE_BASE: CulturalKnowledgeItem[] = [
  {
    id: "buna-pause",
    category: "Coffee ceremony / buna pause",
    keywords: ["buna", "coffee", "ceremony", "coffee ceremony", "tea"],
    contentEn:
      "A calm buna pause can create a natural break between work pressure and the rest of the day.",
    contentAm:
      "የቡና ሰአት ከስራ ጫና ወደ ዕለቱ ማረፊያ ለመቀየር ጸጥ ያለ እረፍት ሊሆን ይችላል።",
  },
  {
    id: "fasting-friendly-fuel",
    category: "Fasting-friendly wellness",
    keywords: ["fasting", "tsom", "tsome", "veg", "vegetarian"],
    contentEn:
      "During fasting periods, lighter meals, hydration, and steady timing can help keep energy more even.",
    contentAm:
      "በጾም ቀናት ቀላል ምግብ፣ ውሃ እና መደበኛ ጊዜ ኃይልን ይበልጥ ወጥ ሊያደርጉ ይችላሉ።",
  },
  {
    id: "injera-teff",
    category: "Ethiopian foods",
    keywords: ["teff", "injera", "shiro", "misir", "food"],
    contentEn:
      "Teff-based meals can support steadier energy when paired with vegetables, legumes, and enough water.",
    contentAm:
      "ከተፍ የተሰራ እንጀራ ከአትክልትና በቆሎ ወይም ሌጉም ጋር ሲመጣ ኃይል በተረጋጋ መንገድ ሊያስተካክል ይችላል።",
  },
  {
    id: "sunlight-walk",
    category: "Movement",
    keywords: ["walk", "walking", "sunlight", "outside", "movement"],
    contentEn:
      "A short sunlight walk, even around the block or compound, can help reset the body after sitting too long.",
    contentAm:
      "አጭር የፀሐይ መራመድ እንኳን ሰውነቱን ከረጅም መቀመጥ በኋላ ሊያሳድስ ይችላል።",
  },
  {
    id: "family-checkin",
    category: "Community support",
    keywords: ["family", "friend", "trusted", "support", "community"],
    contentEn:
      "Ethiopian wellness is often shared; a short check-in with family or a trusted friend can lower stress intensity.",
    contentAm:
      "በኢትዮጵያ የጤና ደህንነት ብዙ ጊዜ በማህበረሰብ ይታገዛል፤ ከቤተሰብ ወይም ከታመነ ጓደኛ ጋር አጭር ውይይት ጫናን ሊቀንስ ይችላል።",
  },
  {
    id: "sleep-rhythm",
    category: "Sleep",
    keywords: ["sleep", "bed", "night", "rest", "tired"],
    contentEn:
      "A simple evening rhythm works better than a perfect routine: dim the screen, drink water, and slow the room down.",
  },
  {
    id: "hydration-reminder",
    category: "Hydration",
    keywords: ["water", "hydration", "drink", "thirst", "dry"],
    contentEn:
      "Hydration is easier when it is attached to daily moments like breakfast, coffee, and midday breaks.",
    contentAm:
      "ውሃ መጠጣት ከቁርስ፣ ከቡና እና ከመካከለኛ እረፍት ጋር ሲያያዝ ቀላል ይሆናል።",
  },
  {
    id: "urban-pressure",
    category: "Modern urban life",
    keywords: ["addis", "traffic", "work", "school", "deadline", "city"],
    contentEn:
      "Addis work and school pressure often asks for smaller plans, not bigger ones.",
    contentAm:
      "የአዲስ አበባ ስራና ትምህርት ጫና ብዙ ጊዜ ትንሽ እቅድ ይጠይቃል እንጂ ትልቅ አይደለም።",
  },
  {
    id: "quiet-reflection",
    category: "Quiet reflection",
    keywords: ["reflect", "reflection", "prayer", "quiet", "stillness"],
    contentEn:
      "Quiet reflection can be short and practical: one breath, one intention, one next step.",
    contentAm:
      "ጸጥ ያለ ማሰላሰል አጭር ሊሆን ይችላል፤ አንድ እስትንፋስ፣ አንድ ዓላማ፣ አንድ ቀጣይ እርምጃ።",
  },
  {
    id: "ritual-grounding",
    category: "Ritual grounding",
    keywords: ["ritual", "habit", "routine", "pause"],
    contentEn:
      "A wellness ritual should feel like a gentle pause in everyday Ethiopian life, not another task to complete.",
  },
  {
    id: "movement-break",
    category: "Movement",
    keywords: ["stretch", "movement break", "stand", "walk"],
    contentEn:
      "Two minutes of stretching between tasks can reduce the sense of mental congestion.",
  },
  {
    id: "work-break",
    category: "Modern urban life",
    keywords: ["break", "meeting", "workday", "office"],
    contentEn:
      "A real break means stepping away from screens, even if only for five minutes.",
  },
  {
    id: "gentle-food",
    category: "Ethiopian foods",
    keywords: ["food", "meal", "breakfast", "lunch", "dinner"],
    contentEn:
      "A steady meal with familiar foods can be more calming than forcing a big change on a stressful day.",
  },
  {
    id: "community-support-2",
    category: "Community support",
    keywords: ["call", "text", "message", "talk", "check in"],
    contentEn:
      "A short message to a trusted person can be enough to shift the day from isolated to supported.",
  },
  {
    id: "sleep-light",
    category: "Sleep",
    keywords: ["screen", "light", "bedtime"],
    contentEn:
      "Lowering light before bed tells the body that the day is ending.",
  },
  {
    id: "retreat-ritual",
    category: "Retreat wellness",
    keywords: ["retreat", "resort", "hospitality", "guest"],
    contentEn:
      "Retreat experiences work best when arrival, hydration, movement, and reflection are simple and clearly sequenced.",
  },
  {
    id: "stress-slow-down",
    category: "Stress",
    keywords: ["stress", "overwhelmed", "pressure", "anxious"],
    contentEn:
      "When stress is high, Selam should suggest one stabilizing action instead of many options.",
    safetyNotes: "If the note mentions self-harm or immediate danger, escalate to safety.",
  },
  {
    id: "buna-community",
    category: "Coffee ceremony / buna pause",
    keywords: ["coffee ceremony", "buna", "cup", "share"],
    contentEn:
      "Sharing buna can be a social pause, so keep the conversation light and grounding.",
  },
  {
    id: "fasting-timing",
    category: "Fasting-friendly wellness",
    keywords: ["iftar", "tsom", "fasting", "meal timing"],
    contentEn:
      "During fasting periods, predictable timing and hydration outside fasting hours can prevent the day from feeling scattered.",
  },
  {
    id: "nature-reset",
    category: "Movement",
    keywords: ["nature", "tree", "green", "sun", "outside"],
    contentEn:
      "Even a small view of nature can lower the feeling of being boxed in.",
  },
  {
    id: "sleep-and-mood",
    category: "Sleep",
    keywords: ["sleep", "mood", "rest", "energy"],
    contentEn:
      "Low sleep often shows up as lower mood and energy the next day, so rest is a core wellness lever.",
  },
  {
    id: "family-ritual",
    category: "Community support",
    keywords: ["family", "home", "together"],
    contentEn:
      "Small family rituals, even a shared meal or check-in, can make recovery feel less lonely.",
  },
  {
    id: "retreat-reflection",
    category: "Retreat wellness",
    keywords: ["reflection", "retreat", "review"],
    contentEn:
      "End-of-day reflection should ask what helped most, what felt heavy, and what can be repeated tomorrow.",
  },
  {
    id: "grounding-breath",
    category: "Quiet reflection",
    keywords: ["breathe", "breathing", "grounding", "calm"],
    contentEn:
      "A few slow breaths can create enough space to make the next decision without rushing.",
  },
  {
    id: "community-ritual",
    category: "Community support",
    keywords: ["community", "neighbor", "friend", "group"],
    contentEn:
      "Wellness in Ethiopia often becomes easier when it is shared in a trusted circle.",
  },
];

export function retrieveCulturalContext(
  query: string,
  language: Language,
  limit = 4,
) {
  const terms = query
    .toLowerCase()
    .split(/[^a-zA-Z0-9\u1200-\u137F]+/)
    .filter(Boolean);

  return KNOWLEDGE_BASE.map((item) => {
    const haystack = `${item.category} ${item.keywords.join(" ")} ${item.contentEn} ${
      item.contentAm ?? ""
    }`.toLowerCase();
    const score = terms.reduce((total, term) => {
      if (haystack.includes(term)) {
        return total + 2;
      }
      return total;
    }, 0);

    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => ({
      id: item.id,
      category: item.category,
      content: language === "am" && item.contentAm ? item.contentAm : item.contentEn,
      safetyNotes: item.safetyNotes,
    }));
}

export const culturalKnowledge = KNOWLEDGE_BASE;
