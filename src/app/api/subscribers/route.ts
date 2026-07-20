import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID, createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/mailer";

const STORAGE_DIR = process.env.SUBSCRIBER_STORAGE_DIR || "/srv/shared/storefront/subscribers";

function hashEmail(email: string) {
  return createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 16);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  const phone = String(body.phone ?? "").trim();
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const id = `sub_${randomUUID().slice(0, 8)}`;
  const createdAt = new Date().toISOString();
  const record = {
    id,
    emailHash: hashEmail(email),
    email,
    phone,
    createdAt,
    source: "homepage",
  };

  await mkdir(STORAGE_DIR, { recursive: true });
  await writeFile(`${STORAGE_DIR}/${id}.json`, JSON.stringify(record, null, 2));

  sendWelcomeEmail({ email })
    .then((result) => {
      if (!result.sent) console.warn(`[subscribers] welcome skipped for ${id}: ${result.reason}`);
    })
    .catch((error) => console.error(`[subscribers] welcome failed for ${id}`, error));

  return NextResponse.json({ ok: true, id });
}
