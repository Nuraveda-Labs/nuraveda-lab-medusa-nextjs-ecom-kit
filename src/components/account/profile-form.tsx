"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomerProfile } from "@/lib/medusa-customer";

const inputClass =
  "mt-3 w-full rounded-[1.1rem] border border-[var(--color-line)] bg-white px-4 py-3.5 text-[var(--color-forest)] outline-none transition focus:border-[var(--color-clay)]";
const labelClass = "text-[10px] uppercase tracking-[0.24em] text-[var(--color-muted)]";

export function ProfileForm({ customer }: { customer: CustomerProfile }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(customer.first_name ?? "");
  const [lastName, setLastName] = useState(customer.last_name ?? "");
  const [phone, setPhone] = useState(customer.phone ?? "");
  const [status, setStatus] = useState<{ tone: "ok" | "err"; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);
    setBusy(true);
    try {
      const response = await fetch("/api/account/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Unable to save profile.");
      setStatus({ tone: "ok", message: "Profile updated." });
      router.refresh();
    } catch (err) {
      setStatus({ tone: "err", message: err instanceof Error ? err.message : "Unable to save profile." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>First name</span>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Last name</span>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} />
        </label>
      </div>
      <label className="block">
        <span className={labelClass}>Email (can&rsquo;t change)</span>
        <input type="email" value={customer.email} disabled className={`${inputClass} opacity-60`} />
      </label>
      <label className="block">
        <span className={labelClass}>Phone</span>
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
      </label>
      {status ? (
        <p className={status.tone === "ok" ? "text-sm text-[var(--color-olive)]" : "text-sm text-red-700"}>
          {status.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center rounded-full bg-[var(--color-forest)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.22em] !text-white transition hover:bg-[var(--color-forest-deep)] disabled:opacity-60"
      >
        {busy ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
