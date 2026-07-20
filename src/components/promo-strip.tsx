"use client";

import { useEffect, useState } from "react";

const PROMO_TEXT = process.env.NEXT_PUBLIC_PROMO_TEXT;
const PROMO_CODE = process.env.NEXT_PUBLIC_PROMO_CODE;
const PROMO_EXPIRES_AT = process.env.NEXT_PUBLIC_PROMO_EXPIRES_AT;
const PROMO_LINK = process.env.NEXT_PUBLIC_PROMO_LINK ?? "/shop";

const dismissKey = (code?: string) => `promo-dismissed-${code ?? "default"}`;

export function PromoStrip() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    let saved = "0";
    try {
      saved = window.localStorage.getItem(dismissKey(PROMO_CODE)) ?? "0";
    } catch {}
    setDismissed(saved === "1");
    setMounted(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!PROMO_TEXT || !mounted || dismissed) return null;

  if (PROMO_EXPIRES_AT) {
    const expires = new Date(PROMO_EXPIRES_AT).getTime();
    if (Number.isFinite(expires) && Date.now() > expires) return null;
  }

  function dismiss() {
    try {
      window.localStorage.setItem(dismissKey(PROMO_CODE), "1");
    } catch {}
    setDismissed(true);
  }

  return (
    <div className="relative bg-[var(--color-clay)] !text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2.5 text-center sm:px-6 lg:px-10">
        <a
          href={PROMO_LINK}
          className="text-[11px] font-semibold uppercase tracking-[0.22em] !text-white sm:text-xs sm:tracking-[0.26em]"
        >
          {PROMO_TEXT}
          {PROMO_CODE ? (
            <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] tracking-[0.18em] !text-white">
              {PROMO_CODE}
            </span>
          ) : null}
        </a>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss promo"
        className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 hover:text-white sm:right-4"
      >
        <span aria-hidden className="text-base leading-none">×</span>
      </button>
    </div>
  );
}
