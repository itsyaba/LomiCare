import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Ritual from "@/models/Ritual";
import { dbConnect } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();

    await dbConnect();

    const ritual = await Ritual.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: { completed: body.completed } },
      { new: true }
    );

    if (!ritual) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ritual });
  } catch (error: any) {
    console.error("Ritual update error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
