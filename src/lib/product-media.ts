type ProductMediaInput = {
  slug: string;
  category: string;
};

/**
 * Neutral category placeholder images. Replace the files in
 * `public/images/catalog/` (or wire per-product images below) with your own.
 */
function categoryFallback(category: string) {
  switch (category) {
    case "Apparel":
      return "/images/catalog/apparel.jpg";
    case "Accessories":
      return "/images/catalog/accessories.jpg";
    case "Home":
      return "/images/catalog/home.jpg";
    case "Stationery":
      return "/images/catalog/stationery.jpg";
    default:
      return "/images/catalog/placeholder.jpg";
  }
}

export function getProductImage(product: ProductMediaInput) {
  // Out of the box we render a category placeholder so every product has an
  // image. To use per-product art, drop `<slug>.jpg` files into
  // `public/images/products/` and return `/images/products/${product.slug}.jpg`.
  return categoryFallback(product.category);
}
