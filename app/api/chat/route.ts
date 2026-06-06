import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { generateChatReply } from "@/lib/mistral";
import ChatMessage from "@/models/ChatMessage";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = ChatRequestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  await dbConnect();

  const sessionId = parsed.data.sessionId || randomUUID();
  const savedHistory = await ChatMessage.find({
    userId: session.user.id,
    sessionId,
  })
    .sort({ createdAt: 1 })
    .limit(20);
  const history = [
    ...savedHistory.map((message) => ({
      role: message.role,
      content: message.content,
    })),
    ...parsed.data.history,
  ];
  const reply = await generateChatReply({
    message: parsed.data.message,
    history,
    language: parsed.data.language,
  });

  await ChatMessage.create([
    {
      userId: session.user.id,
      sessionId,
      role: "user",
      content: parsed.data.message,
      language: parsed.data.language,
    },
    {
      userId: session.user.id,
      sessionId,
      role: "assistant",
      content: reply,
      language: parsed.data.language,
    },
  ]);

  return NextResponse.json({ reply, sessionId });
}
