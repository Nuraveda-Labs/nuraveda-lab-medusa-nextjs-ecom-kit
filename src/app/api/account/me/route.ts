import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/medusa-customer";

export async function GET() {
  const customer = await getCurrentCustomer();
  return NextResponse.json({ customer });
}
