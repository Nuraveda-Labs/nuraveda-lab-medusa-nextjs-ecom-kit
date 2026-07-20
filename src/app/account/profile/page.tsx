import { redirect } from "next/navigation";
import { AccountNav } from "@/components/account/account-nav";
import { ProfileForm } from "@/components/account/profile-form";
import { SiteHeader } from "@/components/site-header";
import { getCurrentCustomer } from "@/lib/medusa-customer";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/account/login");
  const displayName = [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email;

  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[0.3fr_0.7fr] lg:gap-10">
          <AccountNav activeHref="/account/profile" customerName={displayName} customerEmail={customer.email} />

          <div className="rounded-[1.8rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-olive)]">Profile</p>
            <h1 className="mt-5 font-display text-4xl leading-none text-[var(--color-forest)] sm:text-5xl">
              Your details.
            </h1>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              These will auto-fill at checkout so you don&rsquo;t have to type them every time.
            </p>
            <div className="mt-8">
              <ProfileForm customer={customer} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
