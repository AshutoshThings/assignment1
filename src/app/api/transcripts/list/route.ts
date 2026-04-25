import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const transcripts = await prisma.transcript.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ transcripts }, { status: 200 });
  } catch (error) {
    console.error("List transcripts error:", error);
    return NextResponse.json(
      { message: "Failed to fetch transcripts" },
      { status: 500 }
    );
  }
}
