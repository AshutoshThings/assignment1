import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json(
        { message: "No audio file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const buffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(buffer).toString("base64");

    // Determine MIME type
    let mimeType = audioFile.type;
    if (!mimeType.startsWith("audio/")) {
      mimeType = "audio/mpeg";
    }

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Audio,
          mimeType: mimeType,
        },
      },
      "Transcribe this audio file. Provide only the transcription text, nothing else.",
    ]);

    const transcript =
      response.content.parts[0].type === "text"
        ? response.content.parts[0].text
        : "Transcription failed";

    // Get audio duration (approximate based on file size)
    const durationSeconds = Math.ceil(audioFile.size / 16000);

    // Save to database
    const savedTranscript = await prisma.transcript.create({
      data: {
        userId,
        audioFilename: audioFile.name,
        transcript,
        duration: durationSeconds,
      },
    });

    return NextResponse.json(
      {
        message: "Audio transcribed successfully",
        transcript: savedTranscript,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Failed to process audio" },
      { status: 500 }
    );
  }
}
