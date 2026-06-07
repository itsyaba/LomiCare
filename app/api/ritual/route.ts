import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Ritual from "@/models/Ritual";
import CheckIn from "@/models/CheckIn";
import { dbConnect } from "@/lib/db";
import { generateDailyRitual } from "@/lib/mistral";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    
    // Get latest check-in
    const latestCheckIn = await CheckIn.findOne({ userId: session.user.id }).sort({ createdAt: -1 });
    
    const { language } = await req.json().catch(() => ({ language: "en" }));

    const checkInData = latestCheckIn ? {
      mood: latestCheckIn.mood,
      energy: latestCheckIn.energy,
      stress: latestCheckIn.stress,
      sleep: latestCheckIn.sleep,
      note: latestCheckIn.note,
    } : { mood: 5, energy: 3, stress: 3, sleep: 7, note: "" };

    const ritualData = await generateDailyRitual(checkInData, language || "en");

    const ritual = await Ritual.create({
      userId: session.user.id,
      checkInId: latestCheckIn?._id,
      ...ritualData,
      completed: false,
    });

    return NextResponse.json({ ritual });
  } catch (error: any) {
    console.error("Ritual creation error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
