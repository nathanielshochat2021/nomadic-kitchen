import { formatPrice, BASE_PRICE } from "@/lib/configurator";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-forest-deep text-paper">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-xl">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-wood" />
              Nomadic Kitchen
            </div>
            <p className="mt-4 max-w-sm text-sm text-paper/70">
              Hand-built, wood-clad outdoor kitchen carts — made to order around
              how you cook and where you roam. Starting at {formatPrice(BASE_PRICE)}.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-paper/60">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li><a href="#features" className="hover:text-paper">The cart</a></li>
              <li><a href="#configurator" className="hover:text-paper">Build yours</a></li>
              <li><a href="#gallery" className="hover:text-paper">Gallery</a></li>
              <li><a href="#how" className="hover:text-paper">How it works</a></li>
              <li><a href="#faq" className="hover:text-paper">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-wide text-paper/60">Get started</h4>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li><a href="#quote" className="hover:text-paper">Request a quote</a></li>
              <li><a href="#configurator" className="hover:text-paper">Configure a build</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-paper/15 pt-6 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Nomadic Kitchen. Built to order.</p>
          <p>Hand-built in solid wood.</p>
        </div>
      </div>
    </footer>
  );
}
