import Image from "next/image";
import { formatPrice, BASE_PRICE } from "@/lib/configurator";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden">
      <Image
        src="/images/hero-defender.jpg"
        alt="A wood-clad Nomadic Kitchen cart towed behind a Land Rover Defender in front of a barn"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Legibility gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-ink/40" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-28 sm:px-8 sm:pb-24">
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-paper/80">
          Hand-built · Made to order
        </p>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] text-paper sm:text-6xl md:text-7xl">
          The kitchen that follows you outside
        </h1>
        <p className="mt-5 max-w-xl text-base text-paper/85 sm:text-lg">
          A wood-clad outdoor kitchen cart, built to order around how you cook —
          from the patio to the trailhead.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href="#configurator"
            className="rounded-full bg-paper px-6 py-3 text-center text-sm font-semibold text-ink transition-colors hover:bg-canvas"
          >
            Build yours
          </a>
          <a
            href="#quote"
            className="rounded-full border border-paper/60 px-6 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-paper/10"
          >
            Request a quote
          </a>
          <span className="mt-1 text-sm text-paper/80 sm:ml-3 sm:mt-0">
            Starting at {formatPrice(BASE_PRICE)}
          </span>
        </div>
      </div>
    </section>
  );
}
