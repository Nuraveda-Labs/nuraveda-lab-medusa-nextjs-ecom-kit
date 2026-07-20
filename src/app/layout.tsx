import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AnnouncementBar } from "@/components/announcement-bar";
import { CartDrawer } from "@/components/cart-drawer";
import { OrderProvider } from "@/components/order-provider";
import { OrderTicker } from "@/components/order-ticker";
import { PromoStrip } from "@/components/promo-strip";
import { RouteChrome } from "@/components/route-chrome";
import { JsonLd, organizationSchema, websiteSchema } from "@/components/seo/jsonld";
import { SiteAnalytics } from "@/components/site-analytics";
import { SiteFooter } from "@/components/site-footer";
import { brand, brandCssVars } from "@/config/brand";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const titleDefault = `${brand.name} · ${brand.shortDescription.replace(/\.$/, "")}`;
const ogImage = brand.ogImage || `${brand.siteUrl}${brand.logoSvg}`;

export const metadata: Metadata = {
  metadataBase: new URL(brand.siteUrl),
  title: {
    default: titleDefault,
    template: `%s · ${brand.shortName}`,
  },
  description: brand.description,
  keywords: [
    "online store",
    "e-commerce",
    `${brand.city} shopping`,
    "shop online",
    "Next.js storefront",
    "Medusa commerce",
  ],
  applicationName: brand.name,
  category: brand.category,
  alternates: { canonical: brand.siteUrl },
  openGraph: {
    title: titleDefault,
    description: brand.description,
    url: brand.siteUrl,
    siteName: brand.name,
    locale: brand.locale.replace("-", "_"),
    type: "website",
    images: [{ url: ogImage, width: 512, height: 512, alt: brand.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: titleDefault,
    description: brand.description,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: brand.logoSvg,
    shortcut: brand.logoSvg,
    apple: brand.logoSvg,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={brand.locale}
      className={`${manrope.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        {/* Brand-driven CSS variables — overrides whatever globals.css defines.
            New shop deployments swap palette by setting NEXT_PUBLIC_BRAND_COLOR_* env vars. */}
        <style dangerouslySetInnerHTML={{ __html: brandCssVars() }} />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SiteAnalytics />
        <RouteChrome>
          <PromoStrip />
          <AnnouncementBar />
        </RouteChrome>
        <OrderProvider>
          {children}
          <RouteChrome>
            <SiteFooter />
          </RouteChrome>
          <CartDrawer />
        </OrderProvider>
        <RouteChrome>
          <OrderTicker />
        </RouteChrome>
      </body>
    </html>
  );
}
