import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="min-h-screen bg-[var(--color-paper)] text-[var(--foreground)]">
      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-24">
        <div className="rounded-[2.4rem] border border-[var(--color-line)] bg-white p-8 text-center lg:p-12">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-olive)]">Checkout cancelled</p>
          <h1 className="mt-6 font-display text-5xl leading-none text-[var(--color-forest)] sm:text-6xl">
            No payment was completed.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)]">
            Your cart is still waiting. You can change quantities or pick a payment method again whenever you’re ready.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link href="/cart" className="rounded-full bg-[var(--color-forest)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] !text-white">
              Return to checkout
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
