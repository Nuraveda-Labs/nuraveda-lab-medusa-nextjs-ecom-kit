import type { Product } from "@/data/products";

/**
 * Generic pack-size selector. Most products in the starter catalog are
 * single-unit items with no size/quantity options, so this returns an empty
 * list by default. Extend PACKAGE_OPTIONS_BY_CATEGORY (or read from product
 * metadata) if a shop needs per-category options such as "Pack of 3" /
 * "Pack of 6".
 */
export type PackageSelection = {
  label: string;
  units: number;
  multiplier: number;
};

const PACKAGE_OPTIONS_BY_CATEGORY: Record<string, PackageSelection[]> = {};

export function hasWeightOptions(product: Pick<Product, "category">) {
  return Boolean(PACKAGE_OPTIONS_BY_CATEGORY[product.category]?.length);
}

export function getPackageOptions(product: Pick<Product, "category">) {
  return PACKAGE_OPTIONS_BY_CATEGORY[product.category] ?? [];
}

export function getDefaultPackageOption(product: Pick<Product, "category">) {
  return getPackageOptions(product)[0] ?? null;
}

export function getPackagePrice(product: Pick<Product, "price">, selection: PackageSelection | null) {
  return product.price * (selection?.multiplier ?? 1);
}
