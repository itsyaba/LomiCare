import { NextResponse } from "next/server";
import { PROVERBS } from "@/lib/proverbs";

/**
 * Read-only: a random Ethiopian proverb (ምሳሌ), shown as a quiet cultural
 * touch in the chat empty state.
 */
export async function GET() {
  const p = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
  return NextResponse.json({ am: p.am, en: p.en, meaning: p.meaning ?? null });
}
