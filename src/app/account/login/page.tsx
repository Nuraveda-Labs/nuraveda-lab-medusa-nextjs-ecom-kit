import { redirect } from "next/navigation";
import { LoginForm } from "@/components/account/auth-forms";
import { SiteHeader } from "@/components/site-header";
import { getCurrentCustomer } from "@/lib/medusa-customer";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/account");
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <section className="mx-auto max-w-md px-6 py-14 lg:py-20">
        <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-8 lg:p-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[var(--color-olive)]">Sign in</p>
          <h1 className="mt-5 font-display text-4xl leading-none text-[var(--color-forest)] sm:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
            Access your orders, tracking, and saved details.
          </p>
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </section>
    </main>
  );
}
