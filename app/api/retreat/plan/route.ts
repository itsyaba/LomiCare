import { NextResponse } from "next/server";
import { generateRetreatPlan } from "@/lib/mistral";
import RetreatSession from "@/models/RetreatSession";
import { dbConnect } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { mood, stress, energy, intention, language } = await req.json();

    const plan = await generateRetreatPlan({ mood, stress, energy, intention }, language || "en");

    await dbConnect();
    
    // Create anonymous session
    const session = await RetreatSession.create({
      anonymousSessionId: Math.random().toString(36).substring(7),
      arrivalMood: mood,
      arrivalStress: stress,
      arrivalEnergy: energy,
      intention,
      plan,
    });

    return NextResponse.json({ plan, sessionId: session.anonymousSessionId });
  } catch (error: any) {
    console.error("Retreat plan error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
