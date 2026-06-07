import { BASE_PRICE, formatPrice } from "@/lib/configurator";
import { Stamp, SITE_COORD } from "@/components/decor/Decor";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-night text-paper">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="absolute inset-0 rounded-full border border-ember/70" />
                <span className="h-1.5 w-1.5 rounded-full bg-ember" />
              </span>
              <span className="font-display text-xl">Nomadic Kitchen</span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-paper/65">
              Hand-built, wood-clad outdoor kitchen carts — made to order around how
              you cook and where you roam. Starting at {formatPrice(BASE_PRICE)}.
            </p>
            <div className="mt-5">
              <Stamp className="text-paper/40">{SITE_COORD}</Stamp>
            </div>
          </div>

          <div>
            <Stamp className="text-paper/45">Explore</Stamp>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li><a href="#features" className="link-underline">The Cart</a></li>
              <li><a href="#configurator" className="link-underline">Build yours</a></li>
              <li><a href="#gallery" className="link-underline">Field Notes</a></li>
              <li><a href="#how" className="link-underline">Process</a></li>
              <li><a href="#faq" className="link-underline">FAQ</a></li>
            </ul>
          </div>

          <div>
            <Stamp className="text-paper/45">Get started</Stamp>
            <ul className="mt-4 space-y-2 text-sm text-paper/80">
              <li><a href="#quote" className="link-underline">Request a quote</a></li>
              <li><a href="#configurator" className="link-underline">Configure a build</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Stamp className="text-paper/40">© {year} Nomadic Kitchen · Built to order</Stamp>
          <Stamp className="text-paper/40">Hand-built in solid wood</Stamp>
        </div>
      </div>
    </footer>
  );
}
