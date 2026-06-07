import { NextResponse } from "next/server";
import { extractCheckInFromTranscript } from "@/lib/mistral";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    const extracted = await extractCheckInFromTranscript(transcript, language || "en");

    if (!extracted) {
      return NextResponse.json({ error: "Failed to extract check-in" }, { status: 500 });
    }

    return NextResponse.json({ extracted });
  } catch (error: any) {
    console.error("Extraction route error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
