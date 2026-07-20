// PLACEHOLDER PAYMENT — no real charge; wire a real provider before taking money.
//
// This route finalizes an order that was created via /api/orders using the
// same Medusa admin helpers the order-status webhook relies on: it locates the
// storefront draft order, converts it to a real order, marks it paid, and tags
// it with the placeholder payment method. Swap this out for a real payment
// provider (verify the charge server-side) before going live.
import { NextResponse } from "next/server";
import {
  convertDraftToOrder,
  ensureOrderMarkedPaid,
  findDraftByStorefrontOrderId,
  findOrderByStorefrontOrderId,
  isAdminConfigured,
  tagOrderMetadata,
} from "@/lib/medusa-admin";

function normalizeOrderId(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  return /^ord_[a-z0-9]{8}$/i.test(raw) ? raw.toLowerCase() : null;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const storefrontOrderId = normalizeOrderId(body?.storefrontOrderId);

  if (!storefrontOrderId) {
    return NextResponse.json({ error: "A valid storefrontOrderId is required." }, { status: 400 });
  }

  // Without admin credentials we can't touch Medusa — treat the demo checkout
  // as accepted so the starter still runs out of the box.
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: true, storefrontOrderId, finalized: false, reason: "admin not configured" });
  }

  try {
    let order = await findOrderByStorefrontOrderId(storefrontOrderId);

    if (!order) {
      const draft = await findDraftByStorefrontOrderId(storefrontOrderId);
      if (!draft) {
        return NextResponse.json(
          { error: "Order not found for the supplied storefrontOrderId.", storefrontOrderId },
          { status: 404 },
        );
      }
      await convertDraftToOrder(draft.id);
      order = (await findOrderByStorefrontOrderId(storefrontOrderId)) ?? draft;
    }

    const paid = await ensureOrderMarkedPaid(order.id);
    await tagOrderMetadata(order.id, {
      payment_method: "placeholder",
      payment_reference: storefrontOrderId,
    });

    return NextResponse.json({
      ok: true,
      storefrontOrderId,
      finalized: true,
      orderId: order.id,
      paymentStatus: paid.updated ? paid.paymentStatus : paid.reason,
    });
  } catch (error) {
    console.error(`[payments/placeholder] error for ${storefrontOrderId}`, error);
    return NextResponse.json(
      { error: "Unable to finalize placeholder payment.", storefrontOrderId },
      { status: 502 },
    );
  }
}
