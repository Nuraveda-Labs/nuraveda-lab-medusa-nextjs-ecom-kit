import { CheckoutPageClient } from "@/components/checkout-page-client";
import { SiteHeader } from "@/components/site-header";

export default function CartPage() {
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <CheckoutPageClient />
    </main>
  );
}
