/**
 * Inline JSON-LD helper for Server Components.
 *
 * AI search engines (Google AI Overviews, Perplexity, ChatGPT search,
 * Claude, Bing Chat) parse schema.org JSON-LD heavily when deciding what
 * to cite — much more aggressively than traditional crawlers. We emit
 * rich, layered schemas: Organization + WebSite sitewide, LocalBusiness
 * on home, Product on detail pages, FAQPage on /faq, BreadcrumbList on
 * shop pages.
 */
import { brand } from "@/config/brand";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  const payload = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // dangerouslySetInnerHTML is the canonical pattern for inline JSON-LD
      // in React/Next; the payload is escaped above.
      dangerouslySetInnerHTML={{ __html: payload }}
    />
  );
}

const SITE_URL = brand.siteUrl;
const BRAND = brand.name;
const SUPPORT_EMAIL = brand.supportEmail;
const PHONE = brand.phone;
const CITY = brand.city;
const PROVINCE = brand.province;
const COUNTRY = brand.country;

export function organizationSchema() {
  const sameAs = [
    brand.socials.instagram,
    brand.socials.twitter,
    brand.socials.telegram,
    brand.socials.facebook,
  ].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: BRAND,
    url: SITE_URL,
    logo: `${SITE_URL}${brand.logoSvg}`,
    email: SUPPORT_EMAIL,
    ...(PHONE ? { telephone: PHONE } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    url: SITE_URL,
    name: BRAND,
    description: brand.shortDescription,
    inLanguage: brand.locale,
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Store", "LocalBusiness"],
    "@id": `${SITE_URL}#localbusiness`,
    name: BRAND,
    description: brand.description,
    url: SITE_URL,
    image: `${SITE_URL}${brand.logoSvg}`,
    email: SUPPORT_EMAIL,
    ...(PHONE ? { telephone: PHONE } : {}),
    priceRange: "$$",
    currenciesAccepted: brand.currencyCode,
    paymentAccepted: "Bank Transfer, Credit Card",
    address: {
      "@type": "PostalAddress",
      addressLocality: CITY,
      addressRegion: PROVINCE,
      addressCountry: COUNTRY,
      ...(brand.streetAddress ? { streetAddress: brand.streetAddress } : {}),
      ...(brand.postalCode ? { postalCode: brand.postalCode } : {}),
    },
    areaServed: [
      { "@type": "Country", name: brand.countryName },
      { "@type": "City", name: CITY },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "10:00",
        closes: "20:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "12:00",
        closes: "18:00",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "2400",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function breadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

type ProductForSchema = {
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  badge?: string;
  stock?: number;
};

export function productSchema(product: ProductForSchema, imagePath: string) {
  const url = `${SITE_URL}/shop/${product.slug}`;
  const additionalProperty = [
    product.badge ? { "@type": "PropertyValue", name: "Highlight", value: product.badge } : null,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": url,
    name: product.name,
    description: product.description,
    sku: product.slug,
    image: `${SITE_URL}${imagePath}`,
    brand: { "@type": "Brand", name: BRAND },
    category: product.category,
    url,
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: brand.currencyCode,
      price: product.price.toFixed(2),
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": `${SITE_URL}#organization` },
    },
  };
}

export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
