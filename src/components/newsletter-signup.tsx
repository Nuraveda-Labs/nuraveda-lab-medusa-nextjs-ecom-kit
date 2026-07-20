"use client";

import { useState } from "react";
import { brand } from "@/config/brand";

const WELCOME_CODE = process.env.NEXT_PUBLIC_WELCOME_CODE ?? "WELCOME15";
const WELCOME_DISCOUNT = process.env.NEXT_PUBLIC_WELCOME_DISCOUNT ?? "$15 off";
const WELCOME_MIN = process.env.NEXT_PUBLIC_WELCOME_MIN_SUBTOTAL ?? "$80";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<{ tone: "ok" | "err"; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setBusy(true);
    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not save your details.");
      setStatus({
        tone: "ok",
        message: `Welcome aboard. Check your inbox for the code.`,
      });
      setEmail("");
      setPhone("");
    } catch (err) {
      setStatus({ tone: "err", message: err instanceof Error ? err.message : "Something went wrong." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-forest)] !text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-10 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-white/60 sm:tracking-[0.4em]">
              Insider list
            </p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] !text-white sm:mt-5 sm:text-5xl lg:text-6xl">
              Get {WELCOME_DISCOUNT} off your first order.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              New drops, restock alerts, and members-only deals — straight to your inbox. We email a couple times a
              month, never spam, and you can unsubscribe in one click.
            </p>
            <ul className="mt-6 grid gap-2 text-xs text-white/64 sm:text-sm">
              <li>· Code <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-white">{WELCOME_CODE}</code> emailed instantly</li>
              <li>· Valid on orders over {WELCOME_MIN}</li>
            </ul>
          </div>

          <form
            onSubmit={submit}
            className="rounded-[1.6rem] bg-white p-6 text-[var(--color-forest)] sm:rounded-[2rem] sm:p-8"
          >
            <label className="block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-muted)]">Email address</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="mt-2 w-full rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3.5 outline-none transition focus:border-[var(--color-clay)]"
                placeholder="you@example.com"
              />
            </label>
            <label className="mt-4 block">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Phone (optional — for SMS-only deals)
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                className="mt-2 w-full rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3.5 outline-none transition focus:border-[var(--color-clay)]"
                placeholder="+1 (___) ___-____"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-forest)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.22em] !text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-60"
            >
              {busy ? "Sending the code…" : `Send my ${WELCOME_DISCOUNT} code`}
            </button>
            {status ? (
              <p
                className={
                  status.tone === "ok"
                    ? "mt-4 text-sm text-[var(--color-olive)]"
                    : "mt-4 text-sm text-red-700"
                }
              >
                {status.message}
              </p>
            ) : null}
            <p className="mt-3 text-[10px] leading-5 text-[var(--color-muted)]">
              By submitting you agree to receive marketing email and (optional) SMS from {brand.name}.
              Reply STOP to opt out at any time.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
