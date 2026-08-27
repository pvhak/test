import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = body.key;

    const rawNotes = process.env.NOTES;

    return NextResponse.json({
      success: true,
      receivedKey: key,

      notesExists: !!rawNotes,
      notesLength: rawNotes?.length ?? 0,

      notesPreview: rawNotes
        ? rawNotes.substring(0, 200)
        : "NOTES IS NOT SET",

      result: "TEST",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
