import { Mistral } from "@mistralai/mistralai";

import type { CheckInInput } from "@/lib/checkins";

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

const MISTRAL_MODEL = process.env.MISTRAL_MODEL ?? "mistral-medium-latest";

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

async function completeWithMistral(
  messages: MistralMessage[],
  fallback: string,
  logContext: string,
) {
  const client = getMistralClient();

  if (!client) {
    return fallback;
  }

  try {
    const result = await client.chat.complete({
      model: MISTRAL_MODEL,
      messages,
      temperature: 0.4,
    });
    return extractText(result.choices[0]?.message?.content) || fallback;
  } catch (error) {
    console.error(`Mistral ${logContext} failed`, error);
    return fallback;
  }
}

export function buildCheckInPrompt(data: CheckInInput, language: Language) {
  const langInstruction =
    language === "am" ? "Respond ONLY in Amharic." : "Respond in English.";

  return `
You are Selam, a warm and culturally aware Ethiopian wellness companion.
${langInstruction}

A user just completed their daily wellness check-in:
- Mood: ${data.mood}/10
- Energy: ${data.energy}/5
- Sleep: ${data.sleep} hours
- Stress level: ${data.stress}/5
- Their note: "${data.note || "None"}"

Generate a short, warm, practical insight in 2-3 sentences.
- Be empathetic, not clinical
- Reference Ethiopian cultural context where relevant
- Give one specific, actionable suggestion for today
- Do not sound like a generic health app
`;
}

export function buildChatSystemPrompt(language: Language) {
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

Avoid diagnosis and medical advice. Keep responses concise, usually 3-5 sentences.
`;
}

export function buildTipsPrompt(
  recentCheckins: CheckInSummary[],
  language: Language,
) {
  const langInstruction =
    language === "am" ? "Respond in Amharic." : "Respond in English.";

  return `
You are Selam, an Ethiopian wellness companion. ${langInstruction}

Based on this user's recent wellness data:
${JSON.stringify(recentCheckins)}

Generate exactly 3 personalized wellness tips in valid JSON format:
[
  { "category": "string", "title": "string", "body": "string", "emoji": "string" }
]

Categories: Nutrition, Movement, Mental Wellness, Sleep, Community, Mindfulness.
Ground tips in Ethiopian context. Return ONLY the JSON array.
`;
}

export async function generateCheckInInsight(
  data: CheckInInput,
  language: Language,
  fallback: string,
) {
  return completeWithMistral(
    [{ role: "user", content: buildCheckInPrompt(data, language) }],
    fallback,
    "check-in insight",
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
  const messages: MistralMessage[] = [
    { role: "system", content: buildChatSystemPrompt(language) },
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

  try {
    return JSON.parse(reply) as WellnessTip[];
  } catch (error) {
    console.error("Mistral tips JSON parsing failed", error);
    return fallback;
  }
}
