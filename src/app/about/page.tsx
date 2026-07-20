import { PageHero } from "@/components/page-hero";
import { SiteHeader } from "@/components/site-header";
import { brand } from "@/config/brand";

const values = [
  {
    title: "Curated catalog",
    body: "We keep the catalog tight on purpose. Better products and picks that are easy to understand beat a bloated catalog every time.",
  },
  {
    title: "Simple ordering",
    body: "Checkout is built to be quick and clear: fast card checkout and no unnecessary friction between selecting the product and getting it to your door.",
  },
  {
    title: "Straight support",
    body: "Need a recommendation, shipping update, or a bulk quote? You reach a real person who knows the catalog, not a generic help queue.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen text-[var(--foreground)]">
      <SiteHeader />
      <PageHero
        eyebrow="About"
        title="A cleaner way to shop online."
        body={`${brand.name} was built to feel more considered than a typical online store: easier to browse, easier to trust, and easier to order from without losing the premium side of the experience.`}
        aside={
          <>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-muted)]">What we care about</p>
            <p className="mt-4 font-display text-4xl leading-none text-[var(--color-forest)]">
              Quality first. Noise cut out.
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
              The goal is simple: a catalog that feels selective, a checkout that feels effortless, and support that actually answers.
            </p>
          </>
        }
      />
      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-18">
        <div className="grid gap-5 md:grid-cols-3">
          {values.map((value) => (
            <article key={value.title} className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-paper)] p-7">
              <h2 className="font-display text-4xl leading-none text-[var(--color-forest)]">{value.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{value.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
