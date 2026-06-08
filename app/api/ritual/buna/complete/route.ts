import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Ritual from "@/models/Ritual";

const BodySchema = z.object({
  language: z.enum(["en", "am"]).optional().default("en"),
  durationSec: z.number().int().min(1).max(60 * 60).optional(),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = BodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body" },
      { status: 400 },
    );
  }

  await dbConnect();

  const ritual = await Ritual.create({
    userId: session.user.id,
    title: parsed.data.language === "am" ? "የቡና ሥነ ሥርዓት" : "Buna ceremony",
    explanation:
      parsed.data.language === "am"
        ? "ስድስት ደረጃ ያለው የቡና ሥነ ሥርዓት ጨርሰዋል።"
        : "Completed a six-stage Ethiopian coffee ceremony.",
    durationMinutes: Math.max(
      1,
      Math.round((parsed.data.durationSec ?? 215) / 60),
    ),
    steps: ["incense", "roast", "grind", "brew", "pour", "reflect"],
    culturalTag: "buna ceremony",
    language: parsed.data.language,
    completed: true,
  });

  return NextResponse.json({
    success: true,
    ritual: JSON.parse(JSON.stringify(ritual)),
  });
}
