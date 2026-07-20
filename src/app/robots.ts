import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

const SITE_URL = brand.siteUrl;

// AI crawlers we explicitly want to allow so the brand is citable in
// AI Overviews, ChatGPT search, Perplexity, Claude, Bing Copilot, etc.
// Each is allow-listed with the same disallow tail as the catch-all.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "GoogleOther",
  "Applebot",
  "Applebot-Extended",
  "Bingbot",
  "DuckAssistBot",
  "YouBot",
  "Amazonbot",
  "cohere-ai",
  "Bytespider",
  "Meta-ExternalAgent",
  "Meta-ExternalFetcher",
  "FacebookBot",
];

const PRIVATE_PATHS = ["/api/", "/account/", "/cart", "/checkout/"];

export default function robots(): MetadataRoute.Robots {
  const aiRules: MetadataRoute.Robots["rules"] = AI_BOTS.map((bot) => ({
    userAgent: bot,
    allow: ["/"],
    disallow: PRIVATE_PATHS,
  }));

  return {
    rules: [
      ...aiRules,
      {
        userAgent: "*",
        allow: ["/"],
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
