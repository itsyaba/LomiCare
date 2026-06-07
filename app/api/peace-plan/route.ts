import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import PeacePlan from "@/models/PeacePlan";
import CheckIn from "@/models/CheckIn";
import { dbConnect } from "@/lib/db";
import { generatePeacePlan } from "@/lib/mistral";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { language } = await req.json().catch(() => ({ language: "en" }));

    await dbConnect();
    
    // Get recent check-ins
    const recentCheckIns = await CheckIn.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(7)
      .lean();
      
    const formattedCheckIns = recentCheckIns.map(c => ({
      mood: c.mood,
      energy: c.energy,
      sleep: c.sleep,
      stress: c.stress
    }));

    const planData = await generatePeacePlan(formattedCheckIns, language || "en");

    const peacePlan = await PeacePlan.create({
      userId: session.user.id,
      title: planData.title,
      days: planData.days,
      language: language || "en",
    });

    return NextResponse.json({ peacePlan });
  } catch (error: any) {
    console.error("Peace plan creation error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const peacePlan = await PeacePlan.findOne({
      userId: session.user.id,
    }).sort({ createdAt: -1 });

    return NextResponse.json({ peacePlan });
  } catch (error: any) {
    console.error("Peace plan GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
