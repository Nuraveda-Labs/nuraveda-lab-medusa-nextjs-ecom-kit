"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function logout() {
    setBusy(true);
    await fetch("/api/account/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className={className ?? "text-xs uppercase tracking-[0.22em] text-[var(--color-muted)] hover:text-[var(--color-forest)]"}
    >
      {busy ? "Signing out…" : "Sign out"}
    </button>
  );
}
