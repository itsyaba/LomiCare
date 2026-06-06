import type { ICheckIn } from "@/models/CheckIn";

export type CheckInInput = {
  mood: number;
  energy: number;
  sleep: number;
  stress: number;
  note?: string;
};

export function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function endOfLocalDay(date = new Date()) {
  const end = startOfLocalDay(date);
  end.setDate(end.getDate() + 1);
  return end;
}

export function buildHardcodedInsight(data: CheckInInput) {
  const stressLine =
    data.stress >= 4
      ? "Your stress is running high, so keep today's goal small and concrete."
      : "Your stress looks manageable today, which is a good window for a steady routine.";
  const restLine =
    data.sleep < 6
      ? "If you can, make room for an earlier evening and a calm tea or buna break."
      : "Protect that rest with a short walk, simple meal, and a slower evening.";

  return `${stressLine} ${restLine}`;
}

export function calculateStreak(checkins: Pick<ICheckIn, "date">[]) {
  const days = new Set(
    checkins.map((checkin) => startOfLocalDay(checkin.date).getTime()),
  );
  let cursor = startOfLocalDay();
  let streak = 0;

  while (days.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

export function serializeCheckIn(checkin: ICheckIn) {
  return {
    id: checkin.id,
    date: checkin.date.toISOString(),
    mood: checkin.mood,
    energy: checkin.energy,
    sleep: checkin.sleep,
    stress: checkin.stress,
    note: checkin.note,
    aiInsight: checkin.aiInsight,
    language: checkin.language,
  };
}
