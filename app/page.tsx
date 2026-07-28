import Link from "next/link";

const capabilities = [
  [
    "01",
    "Upload your products",
    "Single products, full catalogues, and combo packs.",
  ],
  [
    "02",
    "Choose your visual direction",
    "Model shoots, flat lays, hanger shots, lifestyle, or tabletop.",
  ],
  [
    "03",
    "List everywhere",
    "Quality-checked images and marketplace-ready listing exports.",
  ],
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          seller<span className="text-primary">os</span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <a
            href="#workflow"
            className="hidden text-muted-foreground transition hover:text-foreground sm:block"
          >
            How it works
          </a>
          <Link
            href="/auth"
            className="rounded-xl bg-primary px-4 py-2.5 text-primary-foreground transition hover:bg-primary/90"
          >
            Sign in
          </Link>
        </div>
      </nav>

      <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 lg:px-10 lg:pb-28 lg:pt-24">
        <div className="absolute right-[-12%] top-0 z-0 h-120 w-120 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative max-w-4xl">
          <p className="mb-6 inline-flex rounded-full border border-border bg-muted px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            AI operating system for Indian sellers
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.045em] sm:text-6xl lg:text-8xl">
            From product photos to marketplace-ready listings.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
            SellerOS generates consistent catalogue images, builds combo shoots,
            checks image quality, and helps you prepare listings for Meesho,
            Amazon, and Flipkart.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="rounded-xl bg-primary px-5 py-3.5 text-sm font-bold text-primary-foreground transition hover:bg-primary/90"
            >
              Start with 10 free credits
            </Link>
            <a
              href="#workflow"
              className="rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-bold transition hover:bg-muted"
            >
              Explore the workflow
            </a>
          </div>
        </div>

        <div className="relative mt-14 grid gap-4 md:grid-cols-3">
          <PreviewCard
            title="Catalogue consistency"
            description="Same model, pose, lighting, crop, and background across every SKU."
            tone="bg-primary text-primry-foreground"
          />
          <PreviewCard
            title="Combo generator"
            description="Turn individual products into pack shots, stacks, flat lays, and model images."
            tone="bg-secondary"
          />
          <PreviewCard
            title="Marketplace intelligence"
            description="AI quality signals for Meesho, Amazon, and Flipkart before you publish."
            tone="bg-card"
          />
        </div>
      </section>

      <section
        id="workflow"
        className="border-y border-border bg-card px-6 py-20 lg:px-10"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">
            One seller workflow
          </p>
          <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-xl text-4xl font-semibold tracking-tight">
              Create a catalogue that looks like a professional brand shoot.
            </h2>
            <p className="max-w-sm text-muted-foreground">
              One workspace from upload to a downloadable image and Excel
              package.
            </p>
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {capabilities.map(([number, title, description]) => (
              <article key={number} className="border-t border-border pt-5">
                <span className="text-sm font-bold text-primary">{number}</span>
                <h3 className="mt-10 text-xl font-semibold">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewCard({
  title,
  description,
  tone,
}: {
  title: string;
  description: string;
  tone: string;
}) {
  return (
    <article
      className={`min-h-52 rounded-2xl border border-border p-6 shadow-sm ${tone}`}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background/20 text-sm font-bold">
        ✦
      </div>
      <h2 className="mt-12 text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-6 opacity-75">{description}</p>
    </article>
  );
}
