import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/account/auth-forms";
import { SiteHeader } from "@/components/site-header";
import { getCurrentCustomer } from "@/lib/medusa-customer";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-14 lg:py-20">
        <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-olive)]">Create account</p>
          <h1 className="mt-5 font-display text-4xl leading-none text-[var(--color-forest)] sm:text-5xl">
            Save your info for next time.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            An account lets you track orders, reorder favourites, and skip the checkout form next time.
          </p>
          <div className="mt-8">
            <RegisterForm />
          </div>
        </div>
      </section>
    </main>
  );
}
