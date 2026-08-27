import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("=== VERIFY API CALLED ===");

  try {
    const body = await request.json();

    console.log("Request body:", body);
    console.log("NOTES exists:", !!process.env.NOTES);
    console.log("NOTES length:", process.env.NOTES?.length ?? 0);

    return NextResponse.json({
      success: true,
      receivedKey: body.key,
      notesExists: !!process.env.NOTES,
      notesLength: process.env.NOTES?.length ?? 0,
      test: "imabiggertest",
      result: "VERCEL API IS WORKING",
    });
  } catch (error) {
    console.error("ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 }
    );
  }
}
