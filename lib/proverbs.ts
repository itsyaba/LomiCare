/**
 * Ethiopian proverbs (ምሳሌ) — curated, bilingual Amharic+English.
 *
 * Tagged by mood so the AI insight system can surface one relevant to the
 * user's check-in. These are emotional anchors no generic wellness app has —
 * they shift Selam from "another mood tracker" to "something that knows me".
 */

export type ProverbMood =
  | "calm"
  | "stress"
  | "grief"
  | "joy"
  | "growth"
  | "community"
  | "resilience"
  | "rest";

export type Proverb = {
  am: string;
  en: string;
  /** Loose, poetic English meaning, used when the literal translation lacks context */
  meaning?: string;
  moods: ProverbMood[];
};

export const PROVERBS: Proverb[] = [
  {
    am: "ቀስ በቀስ እንቁላል በእግሩ ይሄዳል።",
    en: "Slowly, slowly the egg learns to walk.",
    meaning: "Patience does what force cannot.",
    moods: ["growth", "stress", "rest"],
  },
  {
    am: "ድር ቢያብር አንበሳ ያስር።",
    en: "When spiders unite, they can tie down a lion.",
    meaning: "Small things, together, become strength.",
    moods: ["community", "resilience"],
  },
  {
    am: "የመከራ ጓደኛ የነገ ወንድም ነው።",
    en: "A friend in hard times is tomorrow's family.",
    moods: ["community", "grief", "resilience"],
  },
  {
    am: "ሰው ለሰው መድኃኒቱ ነው።",
    en: "A person is medicine for another person.",
    moods: ["community", "grief"],
  },
  {
    am: "የእናት እጅ ለልጅ ቅባት ናት።",
    en: "A mother's hand is balm for her child.",
    moods: ["community", "grief", "rest"],
  },
  {
    am: "ጤና ካለ ሁሉም አለ።",
    en: "If there is health, there is everything.",
    moods: ["calm", "growth"],
  },
  {
    am: "ዝምታ ወርቅ ነው።",
    en: "Silence is gold.",
    moods: ["rest", "calm", "stress"],
  },
  {
    am: "ቡና ሲጠጡ ቤት ይታያል።",
    en: "Over coffee, the home reveals itself.",
    meaning: "Slow rituals make space for what matters.",
    moods: ["calm", "community", "rest"],
  },
  {
    am: "የብርሃን ቀን ዘላለማዊ አይደለም፣ የጨለማ ቀንም እንዲሁ።",
    en: "No day of light is forever — and neither is any night.",
    moods: ["grief", "resilience", "stress"],
  },
  {
    am: "ጅረት ያለች ቦታ ሣር አለ።",
    en: "Where a stream runs, grass grows.",
    moods: ["growth", "joy"],
  },
  {
    am: "ምንም ቢቀር ተስፋ ይቀራል።",
    en: "When nothing remains, hope remains.",
    moods: ["grief", "resilience"],
  },
  {
    am: "ጤናማ ሥራ የተኛ አካል ይፈልጋል።",
    en: "Healthy work needs a rested body.",
    moods: ["rest", "stress"],
  },
  {
    am: "የቆየ ውሃ ፍሰት ይቀንሳል።",
    en: "Water that has waited too long forgets how to flow.",
    meaning: "Move, even gently, before stillness becomes stuck.",
    moods: ["stress", "growth"],
  },
  {
    am: "ቤት ሲቃጠል በር አታጥፋ።",
    en: "Don't shut the door when the house is on fire.",
    meaning: "Don't isolate when you most need others.",
    moods: ["stress", "grief", "community"],
  },
  {
    am: "ቸኳይ የበላው አይጠግብም።",
    en: "What is eaten in haste does not nourish.",
    moods: ["stress", "rest"],
  },
  {
    am: "ጥርስ ቢመታ ምላሰው ይታከማል።",
    en: "When the tooth strikes, the tongue still tends to it.",
    meaning: "We can be hurt by what we still love.",
    moods: ["grief", "community"],
  },
  {
    am: "ምሳር ቆዳ ቢጠብቅ ቆዳ ቆዳ ይተወዋል።",
    en: "If you keep watch over leather, you stay leather yourself.",
    meaning: "What you tend to shapes what you become.",
    moods: ["growth"],
  },
  {
    am: "በፀጥታ የተጣለ ድንጋይ ይጎዳል።",
    en: "A stone thrown in silence still lands.",
    meaning: "What you don't say still has weight.",
    moods: ["stress", "grief"],
  },
  {
    am: "የጠረጴዛ ላይ ቡና ጓደኝነት ይፈጥራል።",
    en: "Coffee on the table makes friendship.",
    moods: ["community", "joy", "calm"],
  },
  {
    am: "ብርሃን ከትንሽ ጨረር ይጀምራል።",
    en: "Light begins with a single thread.",
    moods: ["growth", "resilience", "joy"],
  },
  {
    am: "ዘር ቢቀብር አይሞትም።",
    en: "A buried seed does not die — it begins.",
    moods: ["growth", "grief", "resilience"],
  },
  {
    am: "የበቆሎ ሥር በታችኛው አፈር ላይ ነው።",
    en: "The root of the maize lives in the lower soil.",
    meaning: "Strength comes from what is hidden.",
    moods: ["resilience", "growth"],
  },
  {
    am: "ብርቱ ነፋስ የተተከለ ዛፍ ያጠናክራል።",
    en: "Strong wind strengthens the planted tree.",
    moods: ["resilience", "stress"],
  },
  {
    am: "ጸሎት እና ስራ ጓዶች ናቸው።",
    en: "Prayer and work are companions.",
    moods: ["calm", "growth"],
  },
  {
    am: "በቤት ውስጥ ሰላም ካለ በውጭ ሰላም አለ።",
    en: "If there is peace in the home, there is peace outside.",
    moods: ["calm", "community"],
  },
  {
    am: "ድካምን በእንቅልፍ መለኪያ ይታወቃል።",
    en: "Tiredness is measured by sleep.",
    moods: ["rest"],
  },
  {
    am: "የእንቁላል ቅርፊት እንቁላልን ይጠብቃል።",
    en: "The shell protects what it carries.",
    meaning: "Boundaries are a kind of love.",
    moods: ["rest", "stress"],
  },
  {
    am: "የሚቸኩል ሁሉ ፈጥኖ አይደርስም።",
    en: "Not everything that hurries arrives soonest.",
    moods: ["stress", "rest", "growth"],
  },
  {
    am: "ቤት ብቻ ቤት አይደለም፣ ሰው ቤት ነው።",
    en: "A house is not a home — people are home.",
    moods: ["community", "grief"],
  },
  {
    am: "የጠዋት ቡና ቀኑን ያቀልላል።",
    en: "Morning coffee softens the day.",
    moods: ["calm", "joy", "rest"],
  },
  {
    am: "ትንሽ ምሳ ብዙ ጭንቀት ይቀንሳል።",
    en: "A small lunch eases big worry.",
    moods: ["stress", "rest"],
  },
  {
    am: "ሰው ሲወድቅ የተወደቀ ቦታው ይነሳል።",
    en: "When a person falls, they rise from the place they fell.",
    meaning: "You don't have to escape — only stand up where you are.",
    moods: ["grief", "resilience", "growth"],
  },
  {
    am: "የእኛ ድካም የውሃ ጠብታ ነው፣ ሁሉም ይሰበስባል።",
    en: "Our tiredness is a drop of water — together it becomes rain.",
    moods: ["community", "resilience"],
  },
  {
    am: "ምድር ብርቱ ናት፣ ግን ለስላሳ ናት።",
    en: "The earth is strong, yet she is gentle.",
    moods: ["calm", "resilience", "rest"],
  },
  {
    am: "ቀዝቃዛ ምሽት ሙቅ ጠረጴዛ ይፈልጋል።",
    en: "A cold evening asks for a warm table.",
    moods: ["community", "rest"],
  },
  {
    am: "የስኳር ሕይወት ጣፋጭ ናት፣ ግን አጭር ናት።",
    en: "A sugared life is sweet — but short.",
    moods: ["growth"],
  },
  {
    am: "ብርቱ ልብ የተሰበሰበ ልብ ነው።",
    en: "A strong heart is a gathered heart.",
    moods: ["resilience", "rest", "calm"],
  },
  {
    am: "ጊዜ ብርቱ መድኃኒት ነው።",
    en: "Time is a stubborn medicine.",
    moods: ["grief", "rest"],
  },
  {
    am: "ፀሐይ ለሁሉም ትወጣለች።",
    en: "The sun rises for everyone.",
    moods: ["joy", "resilience"],
  },
  {
    am: "ብርሃን ጨለማን ይታገሣል።",
    en: "Light has patience for the dark.",
    moods: ["grief", "resilience"],
  },
];

export function pickProverbFor(
  moodScore: number,
  stressScore: number,
): Proverb {
  let primary: ProverbMood;
  if (stressScore >= 4) primary = "stress";
  else if (moodScore <= 4) primary = "grief";
  else if (moodScore >= 8) primary = "joy";
  else if (moodScore <= 6) primary = "rest";
  else primary = "calm";

  const matched = PROVERBS.filter((p) => p.moods.includes(primary));
  const pool = matched.length > 0 ? matched : PROVERBS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickProverbByMood(mood: ProverbMood): Proverb {
  const matched = PROVERBS.filter((p) => p.moods.includes(mood));
  const pool = matched.length > 0 ? matched : PROVERBS;
  return pool[Math.floor(Math.random() * pool.length)];
}
