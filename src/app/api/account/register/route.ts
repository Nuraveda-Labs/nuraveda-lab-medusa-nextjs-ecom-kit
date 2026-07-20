import { NextResponse } from "next/server";
import { registerCustomer, setCustomerToken } from "@/lib/medusa-customer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
    };
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (!email || !password || !firstName) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const token = await registerCustomer({ email, password, firstName, lastName, phone });
    await setCustomerToken(token);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    const clean = message.toLowerCase().includes("identity") || message.toLowerCase().includes("already")
      ? "An account with this email already exists."
      : message;
    return NextResponse.json({ error: clean }, { status: 400 });
  }
}
