import { headers } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { auth } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import {
  buildDemoChat,
  buildDemoCheckIns,
  buildDemoRitual,
} from "@/lib/demoSeed";
import CheckIn from "@/models/CheckIn";
import ChatMessage from "@/models/ChatMessage";
import Ritual from "@/models/Ritual";

const DEMO_PASSWORD = "Selam2026Demo!";

export async function POST(request: Request) {
  let language: "en" | "am" = "en";
  try {
    const body = await request.json();
    if (body?.language === "am") language = "am";
  } catch {
    // body optional
  }

  const id = crypto.randomBytes(6).toString("hex");
  const email = `guest-${id}@selam.demo`;
  const name = "Selam Guest";

  // Sign up via better-auth; nextCookies() plugin will attach Set-Cookie
  // to the response if we return one from a route handler.
  const result = await auth.api.signUpEmail({
    body: {
      email,
      password: DEMO_PASSWORD,
      name,
    },
    headers: await headers(),
    asResponse: true,
  });

  // Re-read session from the cookie better-auth just set, to get the userId
  // we need for seeding. We read the set-cookie header from the response.
  const setCookie = result.headers.get("set-cookie");

  // Replay the cookie to read the session
  const sessionRes = await auth.api.getSession({
    headers: new Headers({
      cookie: setCookie ?? "",
    }),
  });

  const userId = sessionRes?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { error: "Could not start demo session." },
      { status: 500 },
    );
  }

  await dbConnect();

  // Seed 14-day check-in history
  const checkinDocs = buildDemoCheckIns(language).map((c) => ({
    ...c,
    userId,
  }));
  await CheckIn.insertMany(checkinDocs);

  // Seed today's ritual
  const ritual = buildDemoRitual(language);
  await Ritual.create({
    ...ritual,
    userId,
    completed: false,
  });

  // Seed a sample chat
  const sessionId = crypto.randomBytes(8).toString("hex");
  const messages = buildDemoChat(language).map((m, idx) => ({
    ...m,
    userId,
    sessionId,
    language,
    createdAt: new Date(Date.now() - (2 - idx) * 60_000),
  }));
  await ChatMessage.insertMany(messages);

  // Pass through the cookies the auth sign-up set
  const response = NextResponse.json({ success: true, redirect: "/dashboard" });
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }
  return response;
}
