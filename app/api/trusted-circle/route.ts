import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import TrustedContact from "@/models/TrustedContact";
import { dbConnect } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const contacts = await TrustedContact.find({ userId: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json({ contacts });
  } catch (error) {
    console.error("Trusted circle GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, relationship, phone, email, preferredMethod } = body;

    if (!name || !relationship) {
      return NextResponse.json({ error: "Name and relationship are required" }, { status: 400 });
    }

    await dbConnect();
    const contact = await TrustedContact.create({
      userId: session.user.id,
      name,
      relationship,
      phone,
      email,
      preferredMethod: preferredMethod || "copy",
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("Trusted circle POST error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
