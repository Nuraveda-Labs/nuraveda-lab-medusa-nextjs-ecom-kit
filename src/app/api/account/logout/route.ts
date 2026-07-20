import { NextResponse } from "next/server";
import { clearCustomerToken } from "@/lib/medusa-customer";

export async function POST() {
  await clearCustomerToken();
  return NextResponse.json({ ok: true });
}
