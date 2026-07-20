"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Entry = { name: string; city: string | null; product: string; createdAt: string };

const SUPPRESSED_PATHS = ["/cart", "/account", "/checkout"];
const ROTATE_MS = 7000;
const VISIBLE_MS = 6500;

function relativeTime(iso: string) {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((Date.now() - then) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr ago`;
  return `${Math.floor(diffHr / 24)} d ago`;
}

export function OrderTicker() {
  const pathname = usePathname();
  const suppressed = useMemo(
    () => SUPPRESSED_PATHS.some((p) => pathname?.startsWith(p)),
    [pathname],
  );

  const [entries, setEntries] = useState<Entry[]>([]);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (suppressed) return;
    let cancelled = false;
    fetch("/api/order-ticker", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data?.entries)) setEntries(data.entries);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [suppressed]);

  useEffect(() => {
    if (suppressed || dismissed || entries.length === 0) return;
    let active = true;
    const cycle = () => {
      if (!active) return;
      setVisible(true);
      const hide = setTimeout(() => active && setVisible(false), VISIBLE_MS);
      const next = setTimeout(() => {
        if (!active) return;
        setIndex((i) => (i + 1) % entries.length);
      }, ROTATE_MS);
      return () => {
        clearTimeout(hide);
        clearTimeout(next);
      };
    };
    // First show after a small delay so the page settles
    const initial = setTimeout(cycle, 4000);
    const interval = setInterval(cycle, ROTATE_MS);
    return () => {
      active = false;
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [entries, dismissed, suppressed]);

  if (suppressed || dismissed || entries.length === 0) return null;
  const entry = entries[index];

  return (
    <div
      role="status"
      aria-live="polite"
      className={
        "pointer-events-none fixed bottom-4 left-4 z-40 max-w-[18rem] transition-all duration-500 sm:bottom-6 sm:left-6 " +
        (visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0")
      }
    >
      <div className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-[var(--color-line)] bg-[var(--color-paper)] px-4 py-3 shadow-[0_18px_44px_rgba(20,33,25,0.18)]">
        <span aria-hidden className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-forest)] text-base !text-white">
          🍃
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-5 text-[var(--color-forest)]">
            <strong className="font-semibold">{entry.name}</strong>
            {entry.city ? ` from ${entry.city}` : ""} just ordered
            <span className="block text-[var(--color-clay)]">{entry.product}</span>
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {relativeTime(entry.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="text-sm leading-none text-[var(--color-muted)] transition hover:text-[var(--color-forest)]"
        >
          ×
        </button>
      </div>
    </div>
  );
}
