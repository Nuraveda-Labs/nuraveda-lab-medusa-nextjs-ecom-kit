import { ShopClient } from "@/components/shop-client";
import { SiteHeader } from "@/components/site-header";
import { getCategories, getProducts } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <ShopClient products={products} categories={categories} />
    </main>
  );
}
