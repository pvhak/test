import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const key = body.key;

    if (key === "test") {
      return NextResponse.json({
        success: true,
        result: "hi",
      });
    }

    return NextResponse.json({
      success: false,
      result: "no",
    });
  } catch {
    return NextResponse.json({
      success: false,
      result: "no",
    });
  }
}
