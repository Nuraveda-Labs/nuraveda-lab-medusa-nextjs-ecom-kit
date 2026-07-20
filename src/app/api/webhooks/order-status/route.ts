import { NextResponse } from "next/server";
import {
  sendDeliveredEmail,
  sendOrderCanceledEmail,
  sendPaymentReceivedEmail,
  sendShippedEmail,
} from "@/lib/mailer";

type Stage = "paid" | "shipped" | "delivered" | "canceled";

type WebhookBody = {
  stage: Stage;
  orderId?: string;
  orderDisplayId?: number | string;
  customerEmail: string;
  customerName?: string;
  orderTotal?: number;
  currencyCode?: string;
  trackingNumber?: string | null;
  trackingCompany?: string | null;
  trackingUrl?: string | null;
  reason?: string | null;
};

export async function POST(request: Request) {
  const secret = process.env.ORDER_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "webhook not configured" }, { status: 500 });

  const provided = request.headers.get("x-webhook-secret");
  if (provided !== secret) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => null)) as WebhookBody | null;
  if (!body || !body.stage || !body.customerEmail) {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const base = {
    customerEmail: body.customerEmail,
    customerName: body.customerName || body.customerEmail.split("@")[0],
    orderId: body.orderId,
    orderDisplayId: body.orderDisplayId,
    orderTotal: body.orderTotal,
    currencyCode: body.currencyCode,
  };

  let result;
  switch (body.stage) {
    case "paid":
      result = await sendPaymentReceivedEmail(base);
      break;
    case "shipped":
      result = await sendShippedEmail({
        ...base,
        trackingNumber: body.trackingNumber,
        trackingCompany: body.trackingCompany,
        trackingUrl: body.trackingUrl,
      });
      break;
    case "delivered":
      result = await sendDeliveredEmail(base);
      break;
    case "canceled":
      result = await sendOrderCanceledEmail({ ...base, reason: body.reason ?? undefined });
      break;
    default:
      return NextResponse.json({ error: "unknown stage" }, { status: 400 });
  }

  if (!result.sent) {
    return NextResponse.json({ ok: false, stage: body.stage, reason: result.reason }, { status: 500 });
  }
  return NextResponse.json({ ok: true, stage: body.stage });
}
