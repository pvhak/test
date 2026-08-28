import { NextResponse } from "next/server";
import crypto from "crypto";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

function genok(): string {
  return crypto.randomBytes(32).toString("hex");
}

async function genkey4thing(notename: string): Promise<string> {
  const key = genok();
  await redis.set(`tempkey:${key}`, notename);
  return key;
}

async function sendlogsNOW(title: string, fields: { name: string; value: string; inline?: boolean }[]) {
  const webhook = process.env.webhook;
  if (!webhook) {
    console.warn("fuck u vercel");
    return;
  }

  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json", },
      body: JSON.stringify({
        embeds: [{ title, description: `-# ${new Date().toLocaleString()}`, color: 0x5c4a2e, fields,},],
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

      await sendlogsNOW("key generated", [{
          name: "parent",
          value: `\`\`\`${notename}\`\`\``,
        },{
          name: "key",
          value: `\`\`\`${key}\`\`\``,
        },
      ]);
      
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
      return NextResponse.json({
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

    await sendlogsNOW("key used", [{
        name: "parent",
        value: `\`\`\`${notename}\`\`\``,
      },{
        name: "old key",
        value: `\`\`\`${key}\`\`\``,
      },{
        name: "new key",
        value: `\`\`\`${newkey}\`\`\``,
      },
    ]);

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
