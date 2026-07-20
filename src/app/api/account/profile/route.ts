import { NextResponse } from "next/server";
import { updateCustomer } from "@/lib/medusa-customer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { firstName?: string; lastName?: string; phone?: string };
    await updateCustomer({
      ...(body.firstName ? { first_name: body.firstName.trim() } : {}),
      ...(body.lastName !== undefined ? { last_name: body.lastName.trim() } : {}),
      ...(body.phone !== undefined ? { phone: body.phone.trim() } : {}),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update profile." },
      { status: 400 },
    );
  }
}
