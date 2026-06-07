"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { BASE_PRICE, formatPrice } from "@/lib/configurator";
import { TopoBackground, Stamp, SITE_COORD } from "@/components/decor/Decor";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-[100svh] items-end overflow-hidden bg-night">
      <Image
        src="/images/hero-defender.jpg"
        alt="A wood-clad Nomadic Kitchen cart on its trailer behind a Land Rover Defender at a barn"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/35" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,rgba(17,19,13,0.85),transparent)]" />

      {/* decorative topo, top-right */}
      <TopoBackground
        className="pointer-events-none absolute -right-24 -top-24 h-[34rem] w-[34rem] text-ember/15 drift"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-5 flex items-center gap-3 text-paper/80"
        >
          <span className="h-px w-10 bg-ember" />
          <Stamp className="text-ember-soft">Built to order · No. 001</Stamp>
        </motion.div>

        <h1 className="max-w-4xl font-display text-[2.7rem] leading-[1.02] text-paper sm:text-7xl md:text-[5.2rem]">
          {["The kitchen that", "follows you"].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.12 }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="block italic text-ember-soft"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
          >
            outside.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.5 }}
          className="mt-6 max-w-xl text-base text-paper/85 sm:text-lg"
        >
          A hand-built, wood-clad outdoor kitchen — engineered around how you cook
          and where you roam. From the back patio to the far trailhead.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease, delay: 0.62 }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#configurator"
            className="group relative overflow-hidden rounded-full bg-ember px-7 py-3.5 text-center text-sm font-semibold text-white"
          >
            <span className="relative z-10">Build yours →</span>
            <span className="absolute inset-0 -translate-x-full bg-wood-deep transition-transform duration-300 group-hover:translate-x-0" />
          </a>
          <a
            href="#quote"
            className="rounded-full border border-paper/40 px-7 py-3.5 text-center text-sm font-semibold text-paper backdrop-blur-sm transition-colors hover:bg-paper/10"
          >
            Request a quote
          </a>
          <span className="mt-1 sm:ml-4 sm:mt-0">
            <Stamp className="text-paper/70">Starting at {formatPrice(BASE_PRICE)}</Stamp>
          </span>
        </motion.div>
      </div>

      {/* bottom coordinate bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 hidden border-t border-white/10 bg-night/40 backdrop-blur-sm sm:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-3 text-paper/60">
          <Stamp>{SITE_COORD}</Stamp>
          <Stamp className="hidden md:block">Solid wood · Stainless · Off-grid ready</Stamp>
          <Stamp className="animate-pulse">Scroll to explore ↓</Stamp>
        </div>
      </div>
    </section>
  );
}
