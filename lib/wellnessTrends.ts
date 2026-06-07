import type { ICheckIn } from "@/models/CheckIn";
import { detectSafetyRisk } from "@/lib/safety";

export type TrendCheckIn = Pick<
  ICheckIn,
  "mood" | "energy" | "sleep" | "stress" | "note" | "date"
>;

export type BurnoutRiskResult = {
  score: number;
  risk: "low" | "medium" | "high";
  explanation: string;
  recommendedFocus: string;
};

function average(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function calculateWellnessScore(checkins: TrendCheckIn[]) {
  if (!checkins.length) {
    return 0;
  }

  const recent = checkins.slice(0, 7);
  const mood = average(recent.map((item) => item.mood));
  const energy = average(recent.map((item) => item.energy)) * 2;
  const sleep = average(recent.map((item) => Math.min(item.sleep, 8))) * 8;
  const stress = average(recent.map((item) => item.stress));
  const score = mood * 7 + energy * 8 + sleep * 4 - stress * 10;

  return Math.max(0, Math.min(100, Math.round(score / 2)));
}

export function calculateBurnoutRisk(
  checkins: TrendCheckIn[],
): BurnoutRiskResult {
  if (!checkins.length) {
    return {
      score: 0,
      risk: "low",
      explanation: "No check-ins yet, so Selam needs a little more rhythm data.",
      recommendedFocus: "Build a baseline with a few daily check-ins.",
    };
  }

  const recent = checkins.slice(0, 7);
  const moodValues = recent.map((item) => item.mood);
  const stressValues = recent.map((item) => item.stress);
  const energyValues = recent.map((item) => item.energy);
  const sleepValues = recent.map((item) => item.sleep);
  const notes = recent.map((item) => item.note ?? "").join(" ");

  const moodAvg = average(moodValues);
  const stressAvg = average(stressValues);
  const energyAvg = average(energyValues);
  const sleepAvg = average(sleepValues);
  const stressTrend = stressValues[0] - stressValues[stressValues.length - 1];
  const moodTrend = moodValues[0] - moodValues[moodValues.length - 1];
  const sleepPenalty = sleepAvg < 6 ? 18 : sleepAvg < 7 ? 8 : 0;
  const noteRisk = detectSafetyRisk(notes);

  let score =
    100 -
    stressAvg * 12 -
    (5 - energyAvg) * 12 -
    (10 - moodAvg) * 8 -
    sleepPenalty +
    (stressTrend > 0 ? 8 : 0) +
    (moodTrend > 0 ? 6 : 0);

  if (noteRisk.riskLevel === "medium") {
    score -= 8;
  } else if (noteRisk.riskLevel === "high") {
    score -= 25;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  const risk =
    score < 40 || stressAvg >= 4.2 || sleepAvg < 5.5
      ? "high"
      : score < 65 || stressAvg >= 3.3 || moodAvg < 5.5
        ? "medium"
        : "low";

  const explanation =
    risk === "high"
      ? "Stress is staying high, sleep is thin, or energy and mood are trending down."
      : risk === "medium"
        ? "There are a few warning signals, but small recovery steps should help."
        : "Your pattern looks relatively steady right now.";

  const recommendedFocus =
    sleepAvg < 6
      ? "sleep"
      : stressAvg >= 4
        ? "recovery"
        : moodAvg < 6
          ? "community"
          : energyAvg < 3
            ? "movement"
            : "balance";

  return {
    score,
    risk,
    explanation,
    recommendedFocus,
  };
}

export function findPatterns(checkins: TrendCheckIn[]) {
  const recent = checkins.slice(0, 7);
  const patterns: string[] = [];

  if (!recent.length) {
    return patterns;
  }

  const stressAvg = average(recent.map((item) => item.stress));
  const sleepAvg = average(recent.map((item) => item.sleep));
  const energyAvg = average(recent.map((item) => item.energy));
  const moodAvg = average(recent.map((item) => item.mood));

  if (stressAvg >= 3.5) {
    patterns.push("Your stress has been staying elevated.");
  }

  if (sleepAvg < 6.5) {
    patterns.push("Low sleep seems connected to lower mood or energy.");
  }

  if (energyAvg <= 2.5) {
    patterns.push("Energy looks depleted across several check-ins.");
  }

  if (moodAvg < 6) {
    patterns.push("Mood has been softer than usual lately.");
  }

  return patterns;
}

export function getRecommendedFocus(checkins: TrendCheckIn[]) {
  const burnout = calculateBurnoutRisk(checkins);

  switch (burnout.recommendedFocus) {
    case "sleep":
      return "sleep reset";
    case "recovery":
      return "recovery";
    case "community":
      return "community support";
    case "movement":
      return "gentle movement";
    default:
      return "balanced routine";
  }
}
