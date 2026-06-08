import { NextResponse } from "next/server";
import { getFastingContextForDate } from "@/lib/fasting-calendar";

/**
 * Read-only: today's Ethiopian fasting context, so the chat companion can
 * greet the user in a fasting-aware way (e.g. a "ጾም · fasting day" pill).
 */
export async function GET() {
  const ctx = getFastingContextForDate();
  return NextResponse.json({
    isFasting: ctx.isFasting,
    fastName: ctx.fastName,
    fastNameAm: ctx.fastNameAm,
    tradition: ctx.tradition,
    guidance: ctx.guidance,
    guidanceAm: ctx.guidanceAm,
  });
}
