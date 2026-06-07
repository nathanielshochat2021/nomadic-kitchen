import Image from "next/image";
import { BASE_INCLUDES, BASE_PRICE, formatPrice } from "@/lib/configurator";

const PILLARS = [
  {
    title: "Hand-built in solid wood",
    body: "Each cart is joined and clad by hand in solid wood — not a flat-pack, not a wrap. Built one at a time, to last decades outdoors.",
  },
  {
    title: "A real kitchen, not a gimmick",
    body: "Stainless cooktop, prep counter, sink and storage in a footprint that actually works. Cook for two or for a crowd.",
  },
  {
    title: "Built around how you live",
    body: "Casters for the patio or a road / off-road trailer for everywhere else. Configure power, water, refrigeration and finish to match.",
  },
];

export default function Feature() {
  return (
    <section id="features" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line">
            <Image
              src="/images/cart-front.jpg"
              alt="Front view of a Nomadic Kitchen cart showing the stainless cooktop, prep area and fridge drawers"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-wood-deep">
              The cart
            </p>
            <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
              One cart. Endlessly yours.
            </h2>
            <p className="mt-4 max-w-lg text-stone">
              Nomadic Kitchen starts from a single, considered base build and
              becomes exactly what you need through paid add-ons — refrigeration,
              power, water, towing and finish.
            </p>

            <div className="mt-8 space-y-6">
              {PILLARS.map((p) => (
                <div key={p.title} className="border-l-2 border-wood pl-4">
                  <h3 className="font-display text-lg text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm text-stone">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Base build includes panel */}
        <div className="mt-14 rounded-2xl border border-line bg-canvas p-7 sm:p-9">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h3 className="font-display text-2xl text-ink">The base build includes</h3>
            <p className="text-sm text-stone">
              Starting at{" "}
              <span className="font-semibold text-ink">{formatPrice(BASE_PRICE)}</span>
            </p>
          </div>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {BASE_INCLUDES.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-charcoal">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-wood" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
