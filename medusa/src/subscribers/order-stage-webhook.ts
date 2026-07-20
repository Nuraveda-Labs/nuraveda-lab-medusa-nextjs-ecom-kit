import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

type Stage = "paid" | "shipped" | "delivered" | "canceled";

type OrderSnapshot = {
  id: string;
  display_id: number;
  email: string;
  total: number;
  currency_code: string;
  metadata?: Record<string, unknown> | null;
  customer?: { first_name?: string | null; last_name?: string | null } | null;
};

async function postStage(stage: Stage, order: OrderSnapshot, extra: Record<string, unknown> = {}) {
  const secret = process.env.ORDER_WEBHOOK_SECRET;
  const url = process.env.ORDER_WEBHOOK_URL || "http://127.0.0.1:3000/api/webhooks/order-status";
  if (!secret || !order?.email) return;
  const customerName = [order.customer?.first_name, order.customer?.last_name].filter(Boolean).join(" ").trim();
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-webhook-secret": secret },
      body: JSON.stringify({
        stage,
        orderId: order.id,
        orderDisplayId: order.display_id,
        customerEmail: order.email,
        customerName: customerName || order.email.split("@")[0],
        orderTotal: order.total,
        currencyCode: order.currency_code,
        ...extra,
      }),
    });
  } catch (error) {
    console.warn(`[order-stage-webhook] ${stage} delivery failed`, error);
  }
}

async function loadOrder(container: SubscriberArgs["container"], id: string): Promise<OrderSnapshot | null> {
  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);
    const { data } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "email",
        "total",
        "currency_code",
        "metadata",
        "customer.first_name",
        "customer.last_name",
      ],
      filters: { id },
    });
    return (data?.[0] ?? null) as OrderSnapshot | null;
  } catch {
    return null;
  }
}

async function tagOrderMetadata(container: SubscriberArgs["container"], orderId: string, patch: Record<string, unknown>) {
  try {
    const orderModule = container.resolve(Modules.ORDER);
    await orderModule.updateOrders([{ id: orderId, metadata: patch }]);
  } catch (error) {
    console.warn("[order-stage-webhook] metadata tag failed", error);
  }
}

async function tryLoadTracking(container: SubscriberArgs["container"], fulfillmentId: string) {
  try {
    const fulfillment = container.resolve(Modules.FULFILLMENT);
    const ff = (await fulfillment.retrieveFulfillment(fulfillmentId, {
      relations: ["labels"],
    })) as { labels?: Array<{ tracking_number?: string; tracking_url?: string }> };
    const label = ff.labels?.[0];
    return {
      trackingNumber: label?.tracking_number ?? null,
      trackingUrl: label?.tracking_url ?? null,
    };
  } catch {
    return { trackingNumber: null, trackingUrl: null };
  }
}

// Idempotency: on order.placed AND payment.captured we want the same "paid"
// email to land at most once. We mark order.metadata.paid_email_sent_at and
// short-circuit later events.
async function sendPaidOnce(container: SubscriberArgs["container"], orderId: string) {
  const order = await loadOrder(container, orderId);
  if (!order) return;
  const meta = (order.metadata ?? {}) as Record<string, unknown>;
  if (meta.paid_email_sent_at) return;
  // Mark first, send second. If two events fire near-simultaneously, the
  // second observation of metadata will already see the flag. Worst case on
  // a metadata-write failure: no flag set, no email — admin can resend
  // manually. Better than double-mailing the customer.
  await tagOrderMetadata(container, order.id, {
    ...meta,
    paid_email_sent_at: new Date().toISOString(),
  });
  await postStage("paid", order);
}

export default async function orderStageDispatcher(
  args: SubscriberArgs<{ id: string; order_id?: string }>,
) {
  const { event, container } = args;
  const orderId = event.data.order_id ?? event.data.id;

  switch (event.name) {
    case "order.placed":
    case "payment.captured": {
      // Both events are valid signals that the customer has paid. The first
      // one to fire sends the email; the second one no-ops via the metadata
      // flag.
      await sendPaidOnce(container, orderId);
      return;
    }
    case "order.canceled": {
      const order = await loadOrder(container, orderId);
      if (order) await postStage("canceled", order, { reason: "Order canceled." });
      return;
    }
    case "shipment.created": {
      const order = await loadOrder(container, orderId);
      if (!order) return;
      const tracking = await tryLoadTracking(container, event.data.id);
      await postStage("shipped", order, tracking);
      return;
    }
    case "delivery.created": {
      const order = await loadOrder(container, orderId);
      if (order) await postStage("delivered", order);
      return;
    }
    default:
      return;
  }
}

export const config: SubscriberConfig = {
  event: [
    "order.placed",
    "payment.captured",
    "order.canceled",
    "shipment.created",
    "delivery.created",
  ],
};
