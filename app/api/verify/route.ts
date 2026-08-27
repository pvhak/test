import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = body.key;

    if (typeof key !== "string") {
      return NextResponse.json(
        {
          success: false,
          result: "nothing",
          error: "Key is missing or is not a string",
        },
        { status: 400 }
      );
    }

    const rawNotes = process.env.NOTES;
    if (!rawNotes) {
      return NextResponse.json(
        {
          success: false,
          result: "nothing",
          error: "NOTES environment variable is not set",
        },
        { status: 500 }
      );
    }

    let notes;
    try {
      notes = JSON.parse(rawNotes);
    } catch (error) {
      console.error("NOTES JSON PARSE ERROR:", error);

      return NextResponse.json(
        {
          success: false,
          result: "nothing",
          error: "NOTES environment variable contains invalid JSON",
        },
        { status: 500 }
      );
    }

    const note = notes[key];
    if (note !== undefined) {
      return NextResponse.json({
        success: true,
        result: note,
      });
    }

    return NextResponse.json({
      success: false,
      result: "nothing",
      error: `Key "${key}" was not found`,
    });
  } catch (error) {
    console.error("VERIFY API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        result: "nothing",
        error: String(error),
      },
      { status: 500 }
    );
  }
}
