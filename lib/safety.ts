export type SafetyRiskLevel = "none" | "low" | "medium" | "high";

export type SafetyRiskResult = {
  riskLevel: SafetyRiskLevel;
  categories: string[];
  recommendedAction: string;
  shouldBlockNormalAI: boolean;
};

const HIGH_RISK_PATTERNS = [
  { phrase: "i want to die", category: "suicidal ideation" },
  { phrase: "want to die", category: "suicidal ideation" },
  { phrase: "kill myself", category: "self-harm intent" },
  { phrase: "hurt myself", category: "self-harm intent" },
  { phrase: "i will hurt myself", category: "self-harm intent" },
  { phrase: "not safe", category: "immediate danger" },
  { phrase: "can't continue", category: "hopelessness" },
  { phrase: "cannot continue", category: "hopelessness" },
  { phrase: "end it all", category: "self-harm intent" },
  { phrase: "better off dead", category: "suicidal ideation" },
  { phrase: "abuse", category: "abuse or violence" },
  { phrase: "someone is hurting me", category: "immediate danger" },
];

const MEDIUM_RISK_PATTERNS = [
  { phrase: "overwhelmed", category: "acute distress" },
  { phrase: "panic", category: "acute distress" },
  { phrase: "unsafe", category: "safety concern" },
  { phrase: "abusive", category: "abuse or violence" },
  { phrase: "can't cope", category: "acute distress" },
  { phrase: "can not cope", category: "acute distress" },
];

const LOW_RISK_PATTERNS = [
  { phrase: "stressed", category: "stress" },
  { phrase: "anxious", category: "stress" },
  { phrase: "tired", category: "low energy" },
  { phrase: "sleepy", category: "sleep pressure" },
];

export function detectSafetyRisk(text: string): SafetyRiskResult {
  const lower = text.toLowerCase();
  const categories = new Set<string>();

  for (const pattern of HIGH_RISK_PATTERNS) {
    if (lower.includes(pattern.phrase)) {
      categories.add(pattern.category);
    }
  }

  if (categories.size > 0) {
    return {
      riskLevel: "high",
      categories: [...categories],
      recommendedAction:
        "Pause normal AI support and encourage the user to contact someone trusted right now and seek immediate local emergency or professional help if they are in danger.",
      shouldBlockNormalAI: true,
    };
  }

  for (const pattern of MEDIUM_RISK_PATTERNS) {
    if (lower.includes(pattern.phrase)) {
      categories.add(pattern.category);
    }
  }

  if (categories.size > 0) {
    return {
      riskLevel: "medium",
      categories: [...categories],
      recommendedAction:
        "Offer grounding, encourage a trusted contact, and suggest professional help if the situation feels unsafe or is getting worse.",
      shouldBlockNormalAI: false,
    };
  }

  for (const pattern of LOW_RISK_PATTERNS) {
    if (lower.includes(pattern.phrase)) {
      categories.add(pattern.category);
    }
  }

  if (categories.size > 0) {
    return {
      riskLevel: "low",
      categories: [...categories],
      recommendedAction:
        "Offer a gentle reset, one small action, and a reminder that rest and support matter.",
      shouldBlockNormalAI: false,
    };
  }

  return {
    riskLevel: "none",
    categories: [],
    recommendedAction: "Continue with normal wellness support.",
    shouldBlockNormalAI: false,
  };
}
