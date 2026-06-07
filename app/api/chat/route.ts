import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { generateChatReply } from "@/lib/mistral";
import { detectSafetyRisk } from "@/lib/safety";
import ChatMessage from "@/models/ChatMessage";
import SafetyEvent from "@/models/SafetyEvent";

const ChatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  sessionId: z.string().optional(),
  language: z.enum(["en", "am"]).optional().default("en"),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .optional()
    .default([]),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ChatRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  await dbConnect();

  const { message, language, history: clientHistory } = parsed.data;
  const sessionId = parsed.data.sessionId || randomUUID();

  // ── Safety detection ────────────────────────────────────────────────────────
  const safetyResult = detectSafetyRisk(message);

  if (safetyResult.shouldBlockNormalAI) {
    // Log privately (excerpt only)
    try {
      await SafetyEvent.create({
        userId: session.user.id,
        source: "chat",
        riskLevel: safetyResult.riskLevel,
        categories: safetyResult.categories,
        excerpt: message.slice(0, 80),
      });
    } catch {
      // non-blocking – don't crash if logging fails
    }

    const safetyReply =
      language === "am"
        ? "እዚህ ነኝ። ያነሱት ነገር ከባድ ይሰማል። እባክዎ አሁን ለምትወዱት ሰው ይደውሉ ወይም ቅርብ ወዳጅ ያናግሩ። ሰላም የሕክምና ባለሙያ ምትክ አይደለም — ነገር ግን አብሮዎ ነን።"
        : "I hear you, and I'm here with you. What you're sharing sounds very heavy. Please reach out to someone you trust right now — a close friend, a family member, or a professional. Selam is not a replacement for real human support, but we care about your safety.";

    return NextResponse.json({
      reply: safetyReply,
      sessionId,
      safetyRisk: safetyResult.riskLevel,
    });
  }
  // ────────────────────────────────────────────────────────────────────────────

  const savedHistory = await ChatMessage.find({
    userId: session.user.id,
    sessionId,
  })
    .sort({ createdAt: 1 })
    .limit(20);

  const history = [
    ...savedHistory.map((msg) => ({ role: msg.role, content: msg.content })),
    ...clientHistory,
  ];

  const reply = await generateChatReply({ message, history, language });

  await ChatMessage.create([
    {
      userId: session.user.id,
      sessionId,
      role: "user",
      content: message,
      language,
    },
    {
      userId: session.user.id,
      sessionId,
      role: "assistant",
      content: reply,
      language,
    },
  ]);

  return NextResponse.json({ reply, sessionId });
}
