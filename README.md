# Medusa + Next.js E-commerce Kit

An open-source, production-shaped e-commerce starter: a **Next.js 16** storefront
on top of a **Medusa 2.x** backend. Cart, checkout, customer accounts, order
history, product catalog, transactional email hooks, and analytics wiring — all
already assembled, so you start from a working store instead of a blank page.

> This template ships neutral placeholder branding and products for you to
> replace with your own.

---

## What's inside

**Storefront (`/` — Next.js 16, App Router, React 19)**
- Product catalog + product detail pages (`/shop`, `/shop/[slug]`)
- Cart and checkout flow (`/cart`, `/checkout`)
- Customer accounts: register / login / profile / order history (`/account/*`)
- Content pages: home, about, FAQ, policies, contact
- SEO baked in: metadata, JSON-LD, sitemap, `robots.txt`, `llms.txt`
- Env-driven branding (name, colours, currency, socials) via `src/config/brand.ts`
- Optional analytics: Google Analytics + Meta Pixel / Conversions API

**Backend (`/medusa` — Medusa 2.x)**
- Product / variant / pricing / inventory modules
- Region + currency configuration
- A seed script with generic placeholder products to get you running
- Admin dashboard (Medusa Admin) out of the box

**Payments**
- Ships with a **placeholder** payment step so checkout works immediately.
- Swap in your own provider (Stripe, PayPal, etc.) — see
  [Payments](#payments) below.

---

## Quick start

**Prerequisites:** Node 20+, a PostgreSQL database, and (optionally) Redis.

```bash
# 1. Backend (Medusa)
cd medusa
cp .env.template .env         # fill in DATABASE_URL etc.
npm install
npx medusa db:migrate
npm run seed                  # loads the placeholder catalog
npm run dev                   # Medusa on http://localhost:9000 (admin at /app)

# 2. Storefront (Next.js) — in a second terminal, from the repo root
cp .env.example .env.local    # set MEDUSA_* keys from your Medusa instance
npm install
npm run dev                   # storefront on http://localhost:3000
```

Get `MEDUSA_PUBLISHABLE_KEY` and `MEDUSA_REGION_ID` from the Medusa admin
(Settings → Publishable API Keys, and Settings → Regions) and paste them into
`.env.local`.

---

## Make it yours

| To change… | Edit |
|---|---|
| Store name, tagline, colours, currency, socials | `.env.local` / `.env` (see `src/config/brand.ts`) |
| Products | Medusa admin, or `medusa/src/scripts/seed.ts` |
| Home / about / FAQ / policies copy | `src/app/*/page.tsx` |
| Logo & imagery | `public/` |
| Payment provider | `src/app/api/payments/` (see below) |

Branding is intentionally env-driven — for most cosmetic changes you only touch
`.env`, no code.

## Payments

The kit ships with a **placeholder gateway** so the checkout flow is complete
and runnable without signing up for anything. It creates the order and marks
payment as a stub — **do not use it to take real money.**

To go live, replace the placeholder in `src/app/api/payments/` with your
provider of choice. Medusa has first-party support for Stripe and others; wire
the provider server-side and point the checkout's payment step at it. Search the
code for `PAYMENT_PROVIDER` and the `placeholder` payment route for the seams.

---

## Project structure

```
.
├── src/                  # Next.js storefront (App Router)
│   ├── app/              # routes: shop, cart, checkout, account, content pages, api/
│   ├── components/       # UI components
│   ├── config/brand.ts   # env-driven brand config
│   ├── data/             # product fetch/shape helpers
│   └── lib/              # medusa client, mailer, helpers
├── medusa/               # Medusa 2.x backend
│   └── src/scripts/seed.ts  # placeholder catalog seed
├── public/               # static assets / images
└── .env.example          # storefront env template
```

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · Medusa 2.13 · PostgreSQL

## License

[MIT](./LICENSE) © Nuraveda Labs. Use it, fork it, ship your store.

---

*Built from a real, live storefront and opened up as a starting point. If it
saved you time, a ⭐ is appreciated.*
