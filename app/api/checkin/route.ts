import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import {
  buildHardcodedInsight,
  calculateStreak,
  endOfLocalDay,
  serializeCheckIn,
  startOfLocalDay,
} from "@/lib/checkins";
import { generateCheckInInsight } from "@/lib/mistral";
import { pickProverbFor } from "@/lib/proverbs";
import CheckIn from "@/models/CheckIn";

const CheckInSchema = z.object({
  mood: z.number().int().min(1).max(10),
  energy: z.number().int().min(1).max(5),
  sleep: z.number().min(0).max(12),
  stress: z.number().int().min(1).max(5),
  note: z.string().max(500).optional().default(""),
  language: z.enum(["en", "am"]).optional().default("en"),
});

async function getUserId() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user?.id;
}

export async function POST(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = CheckInSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid check-in", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  await dbConnect();

  const today = startOfLocalDay();
  const tomorrow = endOfLocalDay();
  const existing = await CheckIn.findOne({
    userId,
    date: { $gte: today, $lt: tomorrow },
  });

  if (existing) {
    return NextResponse.json(
      {
        error: "You already checked in today",
        checkin: serializeCheckIn(existing),
      },
      { status: 409 },
    );
  }

  const aiInsight = await generateCheckInInsight(
    parsed.data,
    parsed.data.language,
    buildHardcodedInsight(parsed.data),
  );
  const proverb = pickProverbFor(parsed.data.mood, parsed.data.stress);
  const checkin = await CheckIn.create({
    ...parsed.data,
    userId,
    note: parsed.data.note ?? "",
    aiInsight,
    proverbAm: proverb.am,
    proverbEn: proverb.en,
    proverbMeaning: proverb.meaning ?? "",
  });
  const recent = await CheckIn.find({ userId }).sort({ date: -1 }).limit(60);

  return NextResponse.json({
    success: true,
    checkin: serializeCheckIn(checkin),
    insight: aiInsight,
    streak: calculateStreak(recent),
  });
}

export async function GET(request: Request) {
  const userId = await getUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 30), 90);
  const checkins = await CheckIn.find({ userId }).sort({ date: -1 }).limit(limit);
  const averageMood =
    checkins.length > 0
      ? checkins.reduce((total, checkin) => total + checkin.mood, 0) /
        checkins.length
      : 0;

  return NextResponse.json({
    checkins: checkins.map(serializeCheckIn),
    streak: calculateStreak(checkins),
    averageMood: Number(averageMood.toFixed(1)),
  });
}
