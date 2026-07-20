"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { useOrder } from "@/components/order-provider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

type AccountSummary = { firstName: string; email: string } | null;

export function SiteHeader() {
  const { itemCount, lastAddSignal, setCartDrawerOpen } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [account, setAccount] = useState<AccountSummary>(null);
  const cartBadgeRef = useRef<HTMLSpanElement | null>(null);
  const checkoutBadgeRef = useRef<HTMLSpanElement | null>(null);

  // Pulse the cart badge whenever an item is freshly added.
  useEffect(() => {
    if (!lastAddSignal) return;
    const targets = [cartBadgeRef.current, checkoutBadgeRef.current].filter(Boolean);
    targets.forEach((el) => {
      if (!el) return;
      el.classList.remove("cart-pulse");
      // Force reflow so the animation can replay
      void el.offsetWidth;
      el.classList.add("cart-pulse");
    });
  }, [lastAddSignal]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.customer) return;
        setAccount({
          firstName:
            data.customer.first_name ||
            (data.customer.email ? data.customer.email.split("@")[0] : "Account"),
          email: data.customer.email,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--color-line)] bg-[rgba(251,247,240,0.92)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-6 sm:px-6 sm:py-4 lg:px-10">
          <div className="min-w-0 flex-1 lg:flex-none">
            <BrandMark compact />
          </div>

          <nav className="hidden items-center gap-6 text-sm text-[var(--color-muted)] lg:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={account ? "/account" : "/account/login"}
              className="hidden min-h-11 items-center gap-2 rounded-full border border-[var(--color-line)] bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-forest)] transition hover:bg-white sm:inline-flex"
            >
              {account ? (
                <>
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-forest)] text-[10px] font-bold !text-white"
                  >
                    {account.firstName.charAt(0).toUpperCase()}
                  </span>
                  {account.firstName}
                </>
              ) : (
                "Sign in"
              )}
            </Link>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[rgba(20,33,25,0.08)] bg-[var(--color-forest)] px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] !text-white shadow-[0_10px_24px_rgba(20,33,25,0.12)] transition hover:bg-[var(--color-forest-deep)] sm:gap-2 sm:px-4 sm:tracking-[0.22em] lg:hidden"
              aria-label="Open cart drawer"
            >
              <span className="hidden min-[380px]:inline">Cart</span>
              <span aria-hidden className="text-base leading-none min-[380px]:hidden">🛍</span>
              <span
                ref={cartBadgeRef}
                className="rounded-full border border-white/20 bg-white/8 px-1.5 py-0.5 text-[10px] leading-none !text-white"
              >
                {itemCount}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              className="hidden min-h-11 items-center gap-3 rounded-full border border-[rgba(20,33,25,0.08)] bg-[var(--color-forest)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] !text-white shadow-[0_10px_24px_rgba(20,33,25,0.12)] transition hover:bg-[var(--color-forest-deep)] lg:inline-flex"
              aria-label="Open cart drawer"
            >
              Checkout
              <span
                ref={checkoutBadgeRef}
                className="rounded-full border border-white/20 bg-white/8 px-2 py-1 text-[10px] leading-none !text-white"
              >
                {itemCount}
              </span>
            </button>
            <button
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-line)] bg-white/70 text-[var(--color-forest)] transition hover:bg-white lg:hidden"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-5 bg-current transition ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[7px] h-[1.5px] w-5 bg-current transition ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`absolute left-0 top-[14px] h-[1.5px] w-5 bg-current transition ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[var(--color-line)] bg-[rgba(251,247,240,0.98)] lg:hidden" id="mobile-menu">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
              <nav className="grid gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-[1.25rem] border border-[rgba(24,32,23,0.08)] bg-white/70 px-4 py-3 text-sm text-[var(--color-forest)]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={account ? "/account" : "/account/login"}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-[1.25rem] border border-[var(--color-forest)] bg-[var(--color-forest)] px-4 py-3 text-sm font-semibold !text-white"
                >
                  {account ? `Account (${account.firstName})` : "Sign in / Create account"}
                </Link>
              </nav>
              <div className="mt-4 rounded-[1.4rem] bg-[var(--color-panel)] px-4 py-4 text-sm text-[var(--color-muted)]">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-olive)]">Store access</p>
                <p className="mt-2">Catalog availability is reviewed before fulfillment.</p>
              </div>
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}
