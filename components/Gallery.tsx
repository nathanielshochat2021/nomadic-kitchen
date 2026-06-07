import Image from "next/image";

const SHOTS = [
  {
    src: "/images/cart-front.jpg",
    alt: "Front view of a Nomadic Kitchen cart — stainless cooktop, prep counter and fridge drawers in a solid-wood cabinet",
    caption: "Stainless cooktop, prep counter and fridge drawers in solid wood.",
    span: "sm:col-span-2",
  },
  {
    src: "/images/hero-defender.jpg",
    alt: "A Nomadic Kitchen cart on its trailer, towed behind a Land Rover Defender",
    caption: "Trailer-ready — from the patio to the trailhead.",
    span: "",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-wood-deep">Gallery</p>
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Built, photographed, real
        </h2>
        <p className="mt-4 max-w-xl text-stone">
          Every cart is one of a kind. Here&rsquo;s a recent build in the field.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {SHOTS.map((shot) => (
            <figure
              key={shot.src + shot.caption}
              className={`group relative overflow-hidden rounded-2xl border border-line ${shot.span}`}
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-4 text-sm text-paper">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
