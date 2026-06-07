import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateTrustedCircleNudge } from "@/lib/mistral";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { contactName, relationship, template, language } = body;

    const nudge = await generateTrustedCircleNudge({ contactName, relationship, template }, language || "en");

    return NextResponse.json({ nudge });
  } catch (error: any) {
    console.error("Trusted circle nudge error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
