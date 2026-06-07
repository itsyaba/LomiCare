import { Mistral } from "@mistralai/mistralai";
import { z } from "zod";

import type { CheckInInput } from "@/lib/checkins";
import { retrieveCulturalContext } from "@/lib/culturalKnowledge";
import { safeParseJson } from "@/lib/json";

export type Language = "en" | "am";

type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

type CheckInSummary = {
  date: string;
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
};

type MistralMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type WellnessTip = {
  category: string;
  title: string;
  body: string;
  emoji: string;
};

export type CheckInExtraction = {
  mood: number;
  energy: number;
  stress: number;
  sleepHours: number | null;
  cleanedNote: string;
  summary?: string;
};

export type DailyRitualDraft = {
  title: string;
  explanation: string;
  durationMinutes: number;
  steps: string[];
  culturalTag: string;
  language: Language;
};

export type RetreatPlanDraft = {
  arrivalReset: string;
  activity: string;
  foodReminder: string;
  reflectionPrompt: string;
  eveningCheckIn: string;
};

export type RetreatReflectionDraft = {
  aiSummary: string;
};

export type PeacePlanDraft = {
  title: string;
  days: {
    dayNumber: number;
    theme: string;
    action: string;
    reflectionPrompt: string;
  }[];
};

export type TrustedCircleNudgeDraft = {
  subject: string;
  message: string;
};

const MISTRAL_MODEL = process.env.MISTRAL_MODEL ?? "mistral-medium-latest";

const checkInExtractionSchema = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(5),
  stress: z.number().int().min(1).max(5),
  sleepHours: z.number().min(0).max(12).nullable().optional(),
  cleanedNote: z.string().max(500),
  summary: z.string().max(220).optional(),
});

const ritualSchema = z.object({
  title: z.string().min(3).max(80),
  explanation: z.string().min(8).max(240),
  durationMinutes: z.number().int().min(5).max(90),
  steps: z.array(z.string().min(3).max(160)).min(3).max(3),
  culturalTag: z.string().min(2).max(40),
  language: z.enum(["en", "am"]),
});

const retreatPlanSchema = z.object({
  arrivalReset: z.string().min(4).max(220),
  activity: z.string().min(4).max(220),
  foodReminder: z.string().min(4).max(220),
  reflectionPrompt: z.string().min(4).max(220),
  eveningCheckIn: z.string().min(4).max(220),
});

const retreatReflectionSchema = z.object({
  aiSummary: z.string().min(10).max(280),
});

const peacePlanSchema = z.object({
  title: z.string().min(3).max(80),
  days: z
    .array(
      z.object({
        dayNumber: z.number().int().min(1).max(7),
        theme: z.string().min(3).max(80),
        action: z.string().min(4).max(220),
        reflectionPrompt: z.string().min(4).max(220),
      }),
    )
    .length(7),
});

const trustedCircleNudgeSchema = z.object({
  subject: z.string().min(3).max(80),
  message: z.string().min(8).max(240),
});

function getMistralClient() {
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Mistral({ apiKey });
}

function extractText(content: unknown) {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((chunk) => {
        if (
          chunk &&
          typeof chunk === "object" &&
          "text" in chunk &&
          typeof chunk.text === "string"
        ) {
          return chunk.text;
        }

        return "";
      })
      .join("")
      .trim();
  }

  return "";
}

// Shared rate-limit cooldown — when Mistral returns 429, every caller
// short-circuits to fallback until the cooldown expires. Prevents a single
// re-render storm from sending dozens of doomed requests. Pinned to globalThis
// so dev HMR module reloads don't reset the cooldown.
const COOLDOWN_MS = 60 * 1000;
const cooldownGlobal = globalThis as unknown as { __mistralCooldownUntil?: number };
function getCooldownUntil() {
  return cooldownGlobal.__mistralCooldownUntil ?? 0;
}
function setCooldownUntil(ts: number) {
  cooldownGlobal.__mistralCooldownUntil = ts;
}

async function completeWithMistral(
  messages: MistralMessage[],
  fallback: string,
  logContext: string,
) {
  const client = getMistralClient();

  if (!client) {
    return fallback;
  }

  if (Date.now() < getCooldownUntil()) {
    return fallback;
  }

  try {
    const result = await client.chat.complete({
      model: MISTRAL_MODEL,
      messages,
      temperature: 0.35,
    });
    return extractText(result.choices[0]?.message?.content) || fallback;
  } catch (error) {
    const status = (error as { statusCode?: number })?.statusCode;
    if (status === 429) {
      setCooldownUntil(Date.now() + COOLDOWN_MS);
      console.warn(`Mistral ${logContext} rate-limited; cooling down for ${COOLDOWN_MS / 1000}s`);
    } else {
      console.error(`Mistral ${logContext} failed`, error);
    }
    return fallback;
  }
}

async function completeJsonWithMistral<T>(
  messages: MistralMessage[],
  fallback: T,
  schema: z.ZodType<T>,
  logContext: string,
) {
  const raw = await completeWithMistral(messages, JSON.stringify(fallback), logContext);
  const parsed = safeParseJson<unknown>(raw);

  if (!parsed) {
    return fallback;
  }

  const validated = schema.safeParse(parsed);
  if (!validated.success) {
    console.error(`Mistral ${logContext} validation failed`, validated.error.flatten());
    return fallback;
  }

  return validated.data;
}

function getFallbackCheckInInsight(data: CheckInInput, language: Language) {
  if (language === "am") {
    return data.stress >= 4
      ? "የዛሬ ጭንቀትዎ ከፍ ያለ ይመስላል። አንድ ትንሽ እረፍት፣ ውሃ እና ቀላል ቡና ማቆሚያ ይሞክሩ።"
      : "ዛሬ በትንሽ እርምጃ መቆየት ይበቃል፤ አንድ ቀላል ተግባር ምረጡ እና ዕለቱን በጸጥ ይቀጥሉ።";
  }

  return data.stress >= 4
    ? "Your stress is running high, so keep today's goal small and concrete. Make room for water, a short pause, and one grounding step."
    : "Your day looks steadier, so protect it with one calm habit, one simple meal, and a short pause before the evening gets busy.";
}

export function buildCheckInPrompt(data: CheckInInput, language: Language) {
  const langInstruction =
    language === "am" ? "Respond ONLY in Amharic." : "Respond in English.";
  const context = retrieveCulturalContext(
    `${data.note ?? ""} mood stress sleep energy work family fasting coffee buna`,
    language,
    4,
  );

  return `
You are Selam, a warm and culturally aware Ethiopian wellness companion.
${langInstruction}

Important style rules:
- Be empathetic and practical, not clinical
- Do not diagnose or sound like therapy
- Keep it to 2-3 sentences
- Ground the reply in Ethiopian daily life when useful

Recent cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

A user just completed their daily wellness check-in:
- Mood: ${data.mood}/10
- Energy: ${data.energy}/5
- Sleep: ${data.sleep} hours
- Stress level: ${data.stress}/5
- Their note: "${data.note || "None"}"

Generate one short, warm, practical insight and one action for today.
`;
}

export function buildChatSystemPrompt(language: Language, context: string[] = []) {
  const langInstruction =
    language === "am"
      ? "Always respond in Amharic. You may use English words where no natural Amharic equivalent exists."
      : "Respond in clear, warm English.";

  return `
You are Selam, an AI wellness companion built specifically for Ethiopian users.
${langInstruction}

Your personality:
- Warm, calm, and supportive
- Culturally grounded in Ethiopian community, resilience, spirituality, and balance
- Familiar with fasting traditions, coffee culture, local foods, family structures, and urban work pressure
- Not a replacement for professional mental health care

Safety:
- If someone seems in danger, prioritize safety and encourage trusted human support
- Do not provide diagnosis or emergency services as if you are one

Helpful context:
${context.length ? context.map((item) => `- ${item}`).join("\n") : "- Use culturally grounded wellness guidance."}

Keep responses concise, usually 3-5 sentences.
`;
}

export function buildTipsPrompt(
  recentCheckins: CheckInSummary[],
  language: Language,
) {
  const langInstruction =
    language === "am" ? "Respond in Amharic." : "Respond in English.";
  const context = retrieveCulturalContext(
    recentCheckins
      .map((checkin) => `${checkin.mood} ${checkin.energy} ${checkin.sleep} ${checkin.stress}`)
      .join(" "),
    language,
    5,
  );

  return `
You are Selam, an Ethiopian wellness companion. ${langInstruction}

Use this recent wellness data:
${JSON.stringify(recentCheckins)}

Cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Generate exactly 3 personalized wellness tips in valid JSON format:
[
  { "category": "string", "title": "string", "body": "string", "emoji": "string" }
]

Categories: Nutrition, Movement, Mental Wellness, Sleep, Community, Mindfulness.
Return ONLY the JSON array.
`;
}

function buildExtractionPrompt(transcript: string, language: Language) {
  const context = retrieveCulturalContext(transcript, language, 4);
  const languageLine =
    language === "am"
      ? "Reply in English JSON keys only, but cleanedNote should stay in Amharic if the transcript is Amharic."
      : "Reply in English JSON keys only, and keep cleanedNote in the same language as the transcript.";

  return `
You are extracting a wellness check-in from speech for Selam.
${languageLine}

Transcript:
"${transcript}"

Relevant cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Return valid JSON only with exactly this shape:
{
  "mood": 1,
  "energy": 1,
  "stress": 1,
  "sleepHours": 7.5,
  "cleanedNote": "short cleaned note",
  "summary": "very short summary"
}

Rules:
- mood is 1-10
- energy is 1-5
- stress is 1-5
- sleepHours can be null if not mentioned
- cleanedNote should be concise and preserve the user's meaning
- Do not add markdown or commentary
`;
}

function buildRitualPrompt(
  checkIn: CheckInInput & { note?: string },
  language: Language,
) {
  const context = retrieveCulturalContext(
    `${checkIn.note ?? ""} coffee buna fasting teff family walk sunlight reflection`,
    language,
    5,
  );

  return `
You are Selam, generating a culturally grounded Ethiopian wellness ritual.
${language === "am" ? "Respond in Amharic." : "Respond in English."}

Check-in:
- Mood: ${checkIn.mood}/10
- Energy: ${checkIn.energy}/5
- Sleep: ${checkIn.sleep} hours
- Stress: ${checkIn.stress}/5
- Note: "${checkIn.note ?? ""}"

Relevant cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Create a daily ritual that feels practical, calm, and Ethiopian.
Return valid JSON only:
{
  "title": "string",
  "explanation": "string",
  "durationMinutes": 10,
  "steps": ["step 1", "step 2", "step 3"],
  "culturalTag": "string",
  "language": "en"
}

Requirements:
- include a cultural grounding tag such as buna pause, fasting-friendly reset, family/community check-in, sunlight walk, quiet reflection, or hydration and teff-based meal
- avoid medical claims and therapy language
- keep it warm and action-oriented
`;
}

function buildRetreatPlanPrompt(
  arrival: {
    mood: number;
    stress: number;
    energy: number;
    intention: string;
  },
  language: Language,
) {
  const context = retrieveCulturalContext(
    `${arrival.intention} retreat resort hydration coffee walk reflection`,
    language,
    5,
  );

  return `
You are Selam creating a retreat plan for Ethiopian guests.
${language === "am" ? "Respond in Amharic." : "Respond in English."}

Guest arrival:
- Mood: ${arrival.mood}/10
- Stress: ${arrival.stress}/5
- Energy: ${arrival.energy}/5
- Intention: ${arrival.intention}

Relevant cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Return valid JSON only:
{
  "arrivalReset": "string",
  "activity": "string",
  "foodReminder": "string",
  "reflectionPrompt": "string",
  "eveningCheckIn": "string"
}

Keep the tone premium, calm, and hospitality-ready.
`;
}

function buildRetreatReflectionPrompt(
  reflection: {
    mood: number;
    stress: number;
    reflection: string;
  },
  language: Language,
) {
  const context = retrieveCulturalContext(
    `${reflection.reflection} retreat reflection calm reset`,
    language,
    4,
  );

  return `
You are Selam summarizing a retreat reflection.
${language === "am" ? "Respond in Amharic." : "Respond in English."}

End-of-day reflection:
- Mood now: ${reflection.mood}/10
- Stress now: ${reflection.stress}/5
- Reflection: ${reflection.reflection}

Relevant cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Return valid JSON only:
{
  "aiSummary": "string"
}

Keep it short, warm, and supportive.
`;
}

function buildPeacePlanPrompt(
  recentCheckins: CheckInSummary[],
  language: Language,
) {
  const context = retrieveCulturalContext(
    recentCheckins
      .map((checkin) => `${checkin.mood} ${checkin.energy} ${checkin.sleep} ${checkin.stress}`)
      .join(" "),
    language,
    6,
  );

  return `
You are Selam creating a 7-day Peace Plan for Ethiopian wellness.
${language === "am" ? "Respond in Amharic." : "Respond in English."}

Recent check-ins:
${JSON.stringify(recentCheckins)}

Cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Return valid JSON only:
{
  "title": "string",
  "days": [
    {
      "dayNumber": 1,
      "theme": "string",
      "action": "string",
      "reflectionPrompt": "string"
    }
  ]
}

Rules:
- exactly 7 days
- include themes like sleep reset, buna pause, fasting-friendly nutrition, gentle movement, community check-in, reflection, weekly review
- adapt to stress, sleep, and energy patterns
- avoid medical diagnosis and overly clinical language
`;
}

function buildTrustedCirclePrompt(
  input: {
    contactName?: string;
    relationship?: string;
    template: string;
  },
  language: Language,
) {
  const context = retrieveCulturalContext(
    `${input.template} trusted contact family support community`,
    language,
    4,
  );

  return `
You are Selam drafting a short supportive trusted-circle nudge.
${language === "am" ? "Respond in Amharic." : "Respond in English."}

Contact:
- Name: ${input.contactName ?? "trusted contact"}
- Relationship: ${input.relationship ?? "trusted person"}

Selected message direction:
${input.template}

Cultural context:
${context.map((item) => `- ${item.category}: ${item.content}`).join("\n")}

Return valid JSON only:
{
  "subject": "string",
  "message": "string"
}

Rules:
- keep it short, kind, and non-private
- do not include private journal details
- make it feel like a human check-in, not a crisis alert
`;
}

export async function generateCheckInInsight(
  data: CheckInInput,
  language: Language,
  fallback: string,
) {
  const context = retrieveCulturalContext(
    `${data.note ?? ""} mood stress sleep energy`,
    language,
    4,
  );

  return completeWithMistral(
    [
      {
        role: "system",
        content: buildChatSystemPrompt(language, context.map((item) => item.content)),
      },
      { role: "user", content: buildCheckInPrompt(data, language) },
    ],
    fallback,
    "check-in insight",
  );
}

export async function extractCheckInFromTranscript(
  transcript: string,
  language: Language,
): Promise<CheckInExtraction | null> {
  const fallback: CheckInExtraction = {
    mood: 6,
    energy: 3,
    stress: 3,
    sleepHours: null,
    cleanedNote: transcript.trim().slice(0, 500),
    summary: transcript.trim().slice(0, 180),
  };

  return completeJsonWithMistral(
    [{ role: "user", content: buildExtractionPrompt(transcript, language) }],
    fallback,
    checkInExtractionSchema,
    "check-in extraction",
  );
}

export async function generateDailyRitual(
  checkIn: CheckInInput & { note?: string },
  language: Language,
): Promise<DailyRitualDraft> {
  const fallback: DailyRitualDraft = {
    title:
      language === "am" ? "የቡና እረፍት" : "A small buna pause",
    explanation:
      language === "am"
        ? "አጭር ቆይታ እና ጸጥ ያለ እረፍት ለዛሬ ጫና ማቅለል ይችላል።"
        : "A short pause can soften the pressure of the day without asking for much energy.",
    durationMinutes: 10,
    steps:
      language === "am"
        ? [
            "አንድ ብርጭቆ ውሃ ይጠጡ።",
            "ከቡና ወይም ሻይ ጋር 3 ደቂቃ ተቀምጡ።",
            "አንድ ቀጣይ ቀላል እርምጃ ይምረጡ።",
          ]
        : [
            "Drink a glass of water.",
            "Sit with coffee or tea for 3 minutes without rushing.",
            "Choose one easy next step for the rest of the day.",
          ],
    culturalTag: "buna pause",
    language,
  };

  const result = await completeJsonWithMistral(
    [{ role: "user", content: buildRitualPrompt(checkIn, language) }],
    fallback,
    ritualSchema,
    "daily ritual",
  );

  return result;
}

export async function generateRetreatPlan(
  arrival: {
    mood: number;
    stress: number;
    energy: number;
    intention: string;
  },
  language: Language,
): Promise<RetreatPlanDraft> {
  const fallback: RetreatPlanDraft = {
    arrivalReset:
      language === "am"
        ? "በረጋ እረፍት ይጀምሩ፣ ውሃ ይጠጡ እና ሰውነትዎን ያሳርፉ።"
        : "Start with a calm pause, hydrate, and let your body slow down.",
    activity:
      language === "am"
        ? "አጭር መራመድ ወይም ዝም ብለው ውጭ መቀመጥ ይሞክሩ።"
        : "Try a short walk or a few quiet minutes outside.",
    foodReminder:
      language === "am"
        ? "ቀላል ምግብ እና በቂ ውሃ ይውሰዱ።"
        : "Keep meals simple and stay well hydrated.",
    reflectionPrompt:
      language === "am"
        ? "አሁን በቀላሉ ምን ይሰማዎታል?"
        : "What feels lighter now?",
    eveningCheckIn:
      language === "am"
        ? "ምሽቱን በጸጥ ይጨርሱ፣ ከዚያ እንዴት እንደሚሰማዎት ይመዝግቡ።"
        : "Close the day quietly, then note how you feel.",
  };

  return completeJsonWithMistral(
    [{ role: "user", content: buildRetreatPlanPrompt(arrival, language) }],
    fallback,
    retreatPlanSchema,
    "retreat plan",
  );
}

export async function generateRetreatReflection(
  reflection: {
    mood: number;
    stress: number;
    reflection: string;
  },
  language: Language,
): Promise<RetreatReflectionDraft> {
  const fallback: RetreatReflectionDraft = {
    aiSummary:
      language === "am"
        ? "ዛሬ ያገኙት ጸጥ እና ትንሽ እርምጃ ነገ ለመቀጠል ጥሩ መሠረት ነው።"
        : "Today’s calmer moments and small steps created a steady base to continue from tomorrow.",
  };

  return completeJsonWithMistral(
    [{ role: "user", content: buildRetreatReflectionPrompt(reflection, language) }],
    fallback,
    retreatReflectionSchema,
    "retreat reflection",
  );
}

export async function generatePeacePlan(
  recentCheckins: CheckInSummary[],
  language: Language,
): Promise<PeacePlanDraft> {
  const fallback: PeacePlanDraft = {
    title: language === "am" ? "የሰላም 7 ቀን እቅድ" : "7-Day Peace Plan",
    days: Array.from({ length: 7 }).map((_, index) => ({
      dayNumber: index + 1,
      theme:
        index === 0
          ? language === "am"
            ? "የእንቅልፍ መጀመሪያ"
            : "Sleep reset"
          : index === 1
            ? language === "am"
              ? "የቡና እረፍት"
              : "Buna pause"
            : index === 2
              ? language === "am"
                ? "ምግብ እና እረፍት"
                : "Nutrition and rest"
              : index === 3
                ? language === "am"
                  ? "ቀላል እንቅስቃሴ"
                  : "Gentle movement"
                : index === 4
                  ? language === "am"
                    ? "ከሰው ጋር መገናኘት"
                    : "Community check-in"
                  : index === 5
                    ? language === "am"
                      ? "ማሰላሰል"
                      : "Reflection"
                    : language === "am"
                      ? "ሳምንታዊ ግምገማ"
                      : "Weekly review",
      action:
        language === "am"
          ? "ዛሬ አንድ ትንሽ እርምጃ ይፈጽሙ።"
          : "Complete one small step today.",
      reflectionPrompt:
        language === "am"
          ? "ይህ ቀን ምን አስተማረዎት?"
          : "What did this day teach you?",
      completed: false,
    })),
  };

  const result = await completeJsonWithMistral(
    [{ role: "user", content: buildPeacePlanPrompt(recentCheckins, language) }],
    fallback,
    peacePlanSchema,
    "peace plan",
  );

  return result;
}

export async function generateTrustedCircleNudge(
  input: {
    contactName?: string;
    relationship?: string;
    template: string;
  },
  language: Language,
): Promise<TrustedCircleNudgeDraft> {
  const fallback: TrustedCircleNudgeDraft = {
    subject: language === "am" ? "አጭር መልእክት" : "Quick check-in",
    message:
      language === "am"
        ? "ሰላም፣ ዛሬ ትንሽ ጭንቀት አለኝ። ከእኔ ጋር አጭር ብቻ ሊገናኙኝ ይችላሉ?"
        : "Hey, I’m having a stressful day and could use a quick check-in. Are you free to connect for a minute?",
  };

  return completeJsonWithMistral(
    [{ role: "user", content: buildTrustedCirclePrompt(input, language) }],
    fallback,
    trustedCircleNudgeSchema,
    "trusted circle nudge",
  );
}



export async function generateChatReply({
  message,
  history,
  language,
}: {
  message: string;
  history: ChatTurn[];
  language: Language;
}) {
  const fallback =
    language === "am"
      ? "እዚህ ነኝ። ዛሬ የሚከብድዎትን ነገር በትንሹ ይለዩ፣ ከዚያ አንድ ቀላል እርምጃ እንጀምር።"
      : "I am here with you. Name the one thing that feels heaviest today, then choose one small next step you can actually do.";
  const context = retrieveCulturalContext(
    `${message} ${history.map((turn) => turn.content).join(" ")}`,
    language,
    5,
  );
  const messages: MistralMessage[] = [
    {
      role: "system",
      content: buildChatSystemPrompt(
        language,
        context.map((item) => `${item.category}: ${item.content}`),
      ),
    },
    ...history.slice(-10).map((turn) => ({
      role: turn.role,
      content: turn.content,
    })),
    { role: "user", content: message },
  ];

  return completeWithMistral(messages, fallback, "chat");
}

export async function generateTips(
  recentCheckins: CheckInSummary[],
  language: Language,
): Promise<WellnessTip[]> {
  const fallback = [
    {
      category: "Movement",
      title: language === "am" ? "አጭር መራመድ" : "Take a short walk",
      body:
        language === "am"
          ? "ከምሳ በኋላ 10 ደቂቃ መራመድ ኃይልዎን ሊያስተካክል ይችላል።"
          : "A 10-minute walk after lunch can steady your energy without making the day feel heavier.",
      emoji: "🌿",
    },
    {
      category: "Community",
      title: language === "am" ? "ከሰው ጋር ይገናኙ" : "Reconnect briefly",
      body:
        language === "am"
          ? "ከቤተሰብ ወይም ጓደኛ ጋር አጭር ውይይት የቀኑን ጫና ሊቀንስ ይችላል።"
          : "A short check-in with family or a trusted friend can soften the pressure of the day.",
      emoji: "☕",
    },
    {
      category: "Sleep",
      title: language === "am" ? "ምሽቱን ያቀሉ" : "Keep the evening simple",
      body:
        language === "am"
          ? "ከመኝታ በፊት ስክሪን ይቀንሱ እና ቀላል መጠጥ ይውሰዱ።"
          : "Reduce screen time before bed and make space for a simple tea or quiet routine.",
      emoji: "🌙",
    },
  ];
  const reply = await completeWithMistral(
    [{ role: "user", content: buildTipsPrompt(recentCheckins, language) }],
    JSON.stringify(fallback),
    "tips",
  );

  const parsed = safeParseJson<WellnessTip[]>(reply);
  if (!parsed) {
    return fallback;
  }

  return parsed;
}
