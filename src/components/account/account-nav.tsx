import Link from "next/link";
import { LogoutButton } from "@/components/account/logout-button";

const links = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
];

export function AccountNav({
  activeHref,
  customerName,
  customerEmail,
}: {
  activeHref: string;
  customerName: string;
  customerEmail: string;
}) {
  return (
    <aside className="rounded-[1.8rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 sm:p-8">
      <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-olive)]">Signed in</p>
      <p className="mt-3 font-display text-2xl leading-none text-[var(--color-forest)]">{customerName}</p>
      <p className="mt-2 text-sm text-[var(--color-muted)]">{customerEmail}</p>
      <nav className="mt-6 flex flex-col gap-1">
        {links.map((link) => {
          const active = activeHref === link.href || (link.href === "/account/orders" && activeHref.startsWith("/account/orders"));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "rounded-full bg-[var(--color-forest)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] !text-white"
                  : "rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-forest)] hover:bg-white/60"
              }
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-6 border-t border-[var(--color-line)] pt-5">
        <LogoutButton />
      </div>
    </aside>
  );
}
