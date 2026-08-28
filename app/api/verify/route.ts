import { NextResponse } from "next/server";
import crypto from "crypto";

const tempkeys = new Map<string, string>();

function genok(): string {
  return crypto.randomBytes(16).toString("hex");
}

function genkey4thing(notename: string): string {
  let key = genok();
  while (tempkeys.has(key)) { key = genok(); }
  tempkeys.set(key, notename);
  return key;
}

async function sendlogsNOW(message: string) {
  const webhook = process.env.webhook;
  if (!webhook) {
    console.warn("? fat fuck i hate u");
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ content: message, }),
    });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
  }
}

function initkeys() {
  if (tempkeys.size > 0) {
    return;
  }

  try {
    const notes = JSON.parse(process.env.NOTES || "{}");
    for (const notename of Object.keys(notes)) {
      genkey4thing(notename);
    }

    console.log(`genned ${tempkeys.size} temps`);

    for (const [key, notename] of tempkeys) {
      sendlogsNOW(`genned..\nnote: \`${notename}\`\nkey: \`${key}\``);
    }
  } catch (error) {
    console.error("key init err;", error);
  }
}

initkeys();

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
    const notename = tempkeys.get(key);

    if (!notename) {
      return NextResponse.json({
        success: false,
        result: "nothing",
      });
    }

    const note = notes[notename];
    if (note === undefined) {
      tempkeys.delete(key);
      return NextResponse.json({
        success: false,
        result: "nothing",
      });
    }

    tempkeys.delete(key);
    const newKey = genkey4thing(notename);
    
    await sendlogsNOW(
      `key used\n` +
      `note: \`${notename}\`\n` +
      `old key: \`${key}\`\n` +
      `new key: \`${newKey}\``
    );

    return NextResponse.json({
      success: true,
      result: note,
      key: newKey,
    });
  } catch (error) {
    console.error("verif err;", error);
    return NextResponse.json({
        success: false,
        result: "nothing",
      },
      { status: 500 }
    );
  }
}
