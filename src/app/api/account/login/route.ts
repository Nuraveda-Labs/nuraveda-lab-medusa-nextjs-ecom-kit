import { NextResponse } from "next/server";
import { loginCustomer, setCustomerToken } from "@/lib/medusa-customer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }
    const token = await loginCustomer(email, password);
    await setCustomerToken(token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    return NextResponse.json({ error: message.includes("401") ? "Invalid email or password." : message }, { status: 400 });
  }
}
