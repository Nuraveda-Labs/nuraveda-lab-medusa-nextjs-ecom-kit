/**
 * Shipping helpers shared between client (cart drawer / checkout) and server
 * (order API, mailer, Medusa draft order). Threshold + base fee are
 * env-driven so they can be retuned without code changes.
 */

const RAW_THRESHOLD = process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD;
const RAW_FEE = process.env.NEXT_PUBLIC_BASE_SHIPPING_FEE;

export function getFreeShippingThreshold(): number {
  const value = Number(RAW_THRESHOLD ?? "100");
  return Number.isFinite(value) && value > 0 ? value : 0;
}

export function getBaseShippingFee(): number {
  const value = Number(RAW_FEE ?? "15");
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

export function computeShippingFee(subtotal: number): number {
  const threshold = getFreeShippingThreshold();
  const fee = getBaseShippingFee();
  if (!fee) return 0;
  if (threshold && subtotal >= threshold) return 0;
  return fee;
}

export function isFreeShipping(subtotal: number): boolean {
  return computeShippingFee(subtotal) === 0;
}
