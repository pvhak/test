import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = body.key;
    if (typeof key !== "string") {
      return NextResponse.json({
          success: false,
          result: "nothing",
        },
        { status: 400 }
      );
    }

    const notes = JSON.parse(process.env.NOTES || "{}");
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
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    return NextResponse.json({
        success: false,
        result: "nothing",
      },
      { status: 500 }
    );
  }
}
