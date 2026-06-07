import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Ritual from "@/models/Ritual";
import { dbConnect } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const ritual = await Ritual.findOne({
      userId: session.user.id,
      createdAt: { $gte: startOfDay },
    }).sort({ createdAt: -1 });

    return NextResponse.json({ ritual });
  } catch (error: any) {
    console.error("Ritual GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
