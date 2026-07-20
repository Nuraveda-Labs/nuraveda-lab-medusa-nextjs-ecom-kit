"use client";

import { useEffect, useState } from "react";

const FLASH_EXPIRES_AT = process.env.NEXT_PUBLIC_FLASH_DEAL_EXPIRES_AT;

function formatRemaining(ms: number) {
  if (ms <= 0) return null;
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

export function FlashDealCountdown() {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!FLASH_EXPIRES_AT) return null;
  const expires = new Date(FLASH_EXPIRES_AT).getTime();
  if (!Number.isFinite(expires)) return null;

  const remaining = formatRemaining(expires - now);
  if (!remaining) return null;

  const allBlocks: Array<[number, string]> = [
    [remaining.days, "d"],
    [remaining.hours, "h"],
    [remaining.minutes, "m"],
    [remaining.seconds, "s"],
  ];
  const blocks = allBlocks.filter(([value], index) => index > 0 || value > 0);

  return (
    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] !text-white">
      <span aria-hidden>⏱</span>
      <span>Ends in</span>
      <span className="font-mono tracking-[0.16em]">
        {blocks.map(([v, unit]) => `${String(v).padStart(2, "0")}${unit}`).join(" ")}
      </span>
    </div>
  );
}
