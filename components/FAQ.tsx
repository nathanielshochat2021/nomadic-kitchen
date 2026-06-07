"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "Is this a camper or a food truck?",
    a: "Neither. Nomadic Kitchen is a hand-built, wood-clad outdoor kitchen cart. It’s a real cooking station you can roll across a patio or tow behind your vehicle — not a vehicle itself.",
  },
  {
    q: "How long does a build take?",
    a: "Lead time depends on configuration and current queue, but most builds run several weeks from deposit to delivery. We confirm an exact timeline on your quote before you reserve.",
  },
  {
    q: "What does the deposit cover?",
    a: "A 50% deposit reserves your build slot, locks your configuration and lets us order materials. The remaining balance is due on completion, before delivery or pickup.",
  },
  {
    q: "Can I tow it off-road?",
    a: "Yes — choose the off-road trailer package in the configurator. For pavement and registration, the single-axle road trailer is the way to go. For patio-only use, locking casters are included in the base build.",
  },
  {
    q: "Can it run off-grid?",
    a: "Absolutely. Add the solar + battery + inverter package for power, a pressurized water tank, and 12V fridge drawers, and your kitchen runs completely independent of shore hookups.",
  },
  {
    q: "Are the prices final?",
    a: "Configurator prices are estimates to help you plan. We confirm final pricing on your written quote based on your exact spec, finish choices and delivery.",
  },
  {
    q: "Do you deliver?",
    a: "Local pickup is always available. We can also arrange delivery — share your location in the quote request and we’ll include options and cost.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-wood-deep">FAQ</p>
        <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
          Questions, answered
        </h2>

        <div className="mt-10 divide-y divide-line border-y border-line">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg text-ink">{item.q}</span>
                  <span
                    className={`shrink-0 text-2xl leading-none text-wood transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="text-stone">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
