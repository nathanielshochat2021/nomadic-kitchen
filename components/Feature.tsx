import Image from "next/image";
import { BASE_INCLUDES, BASE_PRICE, formatPrice } from "@/lib/configurator";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Stamp } from "@/components/decor/Decor";

const PILLARS = [
  {
    n: "01",
    title: "Hand-built in solid wood",
    body: "Joined and clad by hand. Not flat-pack, not a wrap. Built to weather decades outside.",
  },
  {
    n: "02",
    title: "A real kitchen",
    body: "Stainless cooktop, prep, sink and storage in a footprint that actually cooks.",
  },
  {
    n: "03",
    title: "Patio to trailhead",
    body: "Rolls on its own wheels, tows lengthwise, and drops hydraulic legs to sit level anywhere.",
  },
];

export default function Feature() {
  return (
    <section id="features" className="relative bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-line">
              <Image
                src="/images/cart-front.jpg"
                alt="Front view of a Nomadic Kitchen cart: stainless cooktop, prep area, and fridge drawers in solid wood"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 rounded-full bg-night/70 px-3 py-1.5 backdrop-blur-sm">
                <Stamp className="text-paper/90">Field unit · solid pine</Stamp>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <div className="mb-4 flex items-center gap-3 text-wood-deep">
                <span className="h-px w-10 bg-wood" />
                <Stamp>The Cart</Stamp>
              </div>
              <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
                One cart.<br />
                <span className="italic text-wood-deep">Endlessly</span> yours.
              </h2>
              <p className="mt-5 max-w-md text-stone">
                One considered base build — then exactly what you need.
                Refrigeration, power, water, towing, finish, and grade.
              </p>
            </Reveal>

            <Stagger className="mt-10 space-y-6">
              {PILLARS.map((p) => (
                <StaggerItem key={p.n}>
                  <div className="flex gap-5">
                    <span className="stamp pt-1 text-ember">{p.n}</span>
                    <div className="border-l border-line pl-5">
                      <h3 className="font-display text-xl text-ink">{p.title}</h3>
                      <p className="mt-1.5 text-sm text-stone">{p.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>

        {/* base build spec sheet */}
        <Reveal>
          <div className="mt-16 overflow-hidden rounded-3xl border border-line bg-night text-paper">
            <div className="flex flex-col gap-2 border-b border-white/10 px-7 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-10">
              <div>
                <Stamp className="text-ember-soft">Standard issue</Stamp>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl">The base build includes</h3>
              </div>
              <p className="text-paper/70">
                Starting at{" "}
                <span className="font-display text-2xl text-paper">{formatPrice(BASE_PRICE)}</span>
              </p>
            </div>
            <Stagger className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3" gap={0.05}>
              {BASE_INCLUDES.map((item, i) => (
                <StaggerItem key={item}>
                  <div className="flex h-full items-start gap-3 bg-night px-7 py-5 sm:px-10">
                    <span className="stamp text-ember/80">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm text-paper/90">{item}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
