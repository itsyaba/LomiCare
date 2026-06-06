import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { generateTips, type Language } from "@/lib/mistral";
import CheckIn from "@/models/CheckIn";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const { searchParams } = new URL(request.url);
  const language = (searchParams.get("language") === "am" ? "am" : "en") satisfies Language;
  const recent = await CheckIn.find({ userId: session.user.id })
    .sort({ date: -1 })
    .limit(7);
  const tips = await generateTips(
    recent.map((checkin) => ({
      date: checkin.date.toISOString(),
      mood: checkin.mood,
      energy: checkin.energy,
      sleep: checkin.sleep,
      stress: checkin.stress,
    })),
    language,
  );

  return NextResponse.json({ tips });
}
