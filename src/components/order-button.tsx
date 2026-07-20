"use client";

import { useEffect, useState } from "react";
import { useOrder } from "@/components/order-provider";
import type { Product } from "@/data/products";
import type { PackageSelection } from "@/lib/product-packaging";

export function OrderButton({
  product,
  packageSelection,
  label = "Add to cart",
  className,
}: {
  product: Product;
  packageSelection?: PackageSelection | null;
  label?: string;
  className: string;
}) {
  const { addItem } = useOrder();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-clear the inline error after 6 s
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 6000);
    return () => clearTimeout(id);
  }, [error]);

  async function onClick() {
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await addItem(product, { packageSelection });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("[add-to-cart] failed", err);
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => void onClick()}
        disabled={busy}
        className={className}
        aria-busy={busy}
      >
        {busy ? "Adding…" : label}
      </button>
      {error ? (
        <p className="mt-2 text-xs leading-5 text-red-700" role="alert">
          Couldn&apos;t add to cart: {error}
        </p>
      ) : null}
    </>
  );
}
