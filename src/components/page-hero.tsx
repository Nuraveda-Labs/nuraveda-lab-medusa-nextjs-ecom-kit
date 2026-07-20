import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  body,
  aside,
}: {
  eyebrow: string;
  title: string;
  body: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-[var(--color-line)] bg-[var(--color-paper)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[1fr_0.75fr] lg:px-10 lg:py-18">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[var(--color-olive)]">{eyebrow}</p>
          <h1 className="mt-5 max-w-4xl font-display text-6xl leading-[0.95] text-[var(--color-forest)] sm:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--color-muted)]">{body}</p>
        </div>
        {aside ? (
          <div className="rounded-[2rem] border border-[var(--color-line)] bg-white/70 p-7 shadow-[0_16px_40px_rgba(20,33,25,0.04)]">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
