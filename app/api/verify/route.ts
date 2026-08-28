import { NextResponse } from "next/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function genok(): string {
  return crypto.randomBytes(16).toString("hex");
}

async function genkey4thing(notename: string): Promise<string> {
  const key = genok();
  await redis.set(`tempkey:${key}`, notename);
  return key;
}

async function sendlogsNOW(message: string) {
  const webhook = process.env.webhook;
  if (!webhook) {
    console.warn("fuck u vercel");
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({ embeds: [{ description: message, color: 0x5c4a2e, }, ],
      }),
    });
  } catch (error) {
    console.error("WH er;", error);
  }
}

async function initkeys() {
  try {
    const notes = JSON.parse(process.env.NOTES || "{}");
    for (const notename of Object.keys(notes)) {
      const indexKey = `notekey:${notename}`;
      const existingKey = await redis.get<string>(indexKey);

      if (existingKey) {
        continue;
      }

      const key = await genkey4thing(notename);
      await redis.set(indexKey, key);

      await sendlogsNOW(
        `genned..\n` +
        `note: \`${notename}\`\n` +
        `key: \`${key}\``
      );
    }
  } catch (error) {
    console.error("key init err;", error);
  }
}

export async function POST(request: Request) {
  try {
    await initkeys();

    const body = await request.json();
    const key = body.key;

    if (typeof key !== "string") {
      return NextResponse.json(
        {
          success: false,
          result: "nothing",
        },
        { status: 400 }
      );
    }

    const notes = JSON.parse(process.env.NOTES || "{}");
    const notename = await redis.getdel<string>(`tempkey:${key}`);

    if (!notename) {
      return NextResponse.json({
        success: false,
        result: "nothing",
      });
    }

    const note = notes[notename];
    if (note === undefined) {
      return NextResponse.json({
        success: false,
        result: "nothing",
      });
    }

    const newkey = await genkey4thing(notename);
    await redis.set(`notekey:${notename}`, newkey);

    await sendlogsNOW(
      `key used\n` +
      `note: \`${notename}\`\n` +
      `old key: \`${key}\`\n` +
      `new key: \`${newkey}\``
    );

    return NextResponse.json({
      success: true,
      result: note,
      key: newkey,
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
