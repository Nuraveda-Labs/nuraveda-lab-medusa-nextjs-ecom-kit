import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/config/brand";

const support = brand.supportEmail;

const channels = [
  {
    title: "Order support",
    body: "Need help with an order, dispatch timing, or tracking? Reply to your order email or write directly and we'll sort it out fast.",
    action: `Email ${support}`,
    href: `mailto:${support}?subject=Order%20support`,
  },
  {
    title: "Product advice",
    body: "Not sure which option is right for you? Ask before you buy and we'll point you in the right direction without the upsell routine.",
    action: "Ask for a recommendation",
    href: `mailto:${support}?subject=Product%20question`,
  },
  {
    title: "Bulk and wholesale",
    body: "For larger orders or wholesale conversations, send the quantity, preferred category, and rough timing. We'll reply with options directly.",
    action: "Start a bulk order",
    href: `mailto:${support}?subject=Wholesale%20order`,
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <PageHero
        eyebrow="Contact"
        title="Questions answered by people who know the catalog."
        body={`Reach us at ${support} for order help, product recommendations, or bulk requests. We keep replies direct and useful.`}
        aside={
          <>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">Support hours</p>
            <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--color-muted)]">
              <p>{brand.hoursDisplay.weekday}</p>
              <p>{brand.hoursDisplay.saturday}</p>
              <p>{brand.hoursDisplay.sunday}</p>
              <p className="pt-2 text-[var(--color-forest)]">
                <a href={`mailto:${support}`} className="underline">
                  {support}
                </a>
              </p>
            </div>
          </>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-18">
        <div className="grid gap-5 md:grid-cols-3">
          {channels.map((channel) => (
            <article key={channel.title} className="flex flex-col rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--color-forest)]">{channel.title}</h2>
              <p className="mt-4 flex-1 text-sm leading-7 text-[var(--color-muted)]">{channel.body}</p>
              <a href={channel.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-clay)]">
                {channel.action} <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-forest)] p-8 text-white sm:p-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">Prefer to browse first?</p>
              <h2 className="mt-3 font-display text-4xl leading-none sm:text-5xl">The live catalog answers a lot.</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/72 sm:text-base">
                Product details, package sizes, and payment options are already on the storefront. If anything is still unclear, email us.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/shop" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-forest)]">
                Shop the catalog
              </Link>
              <Link href="/faq" className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                Read FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
