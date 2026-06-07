import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { Stamp } from "@/components/decor/Decor";

const SHOTS = [
  {
    src: "/images/hero-defender.jpg",
    alt: "A Nomadic Kitchen cart on its trailer, towed behind a Land Rover Defender",
    log: "Log 002",
    caption: "Trailer-ready. Hitched to a Defender, headed past the barn.",
    span: "sm:col-span-2",
  },
  {
    src: "/images/cart-front.jpg",
    alt: "Front view of a Nomadic Kitchen cart with stainless cooktop and fridge drawers",
    log: "Log 001",
    caption: "Stainless cooktop, prep, and fridge drawers in solid wood.",
    span: "",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-4 flex items-center gap-3 text-wood-deep">
            <span className="h-px w-10 bg-wood" />
            <Stamp>Field Notes</Stamp>
          </div>
          <h2 className="max-w-2xl font-display text-4xl leading-tight text-ink sm:text-5xl">
            Built, photographed, <span className="italic text-wood-deep">in the field.</span>
          </h2>
          <p className="mt-4 max-w-xl text-stone">
            Every cart is one of a kind. Here&rsquo;s a recent build, out where it belongs.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {SHOTS.map((shot) => (
            <Reveal key={shot.src + shot.log} className={shot.span}>
              <figure className="group relative overflow-hidden rounded-3xl border border-line">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-transparent to-transparent" />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-5">
                  <Stamp className="text-ember-soft">{shot.log}</Stamp>
                  <p className="mt-1 text-sm text-paper">{shot.caption}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
