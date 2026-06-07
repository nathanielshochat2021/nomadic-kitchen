"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Reveal } from "@/components/motion/Reveal";
import { Stamp } from "@/components/decor/Decor";

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
    q: "How does it move and park?",
    a: "Every cart rides on its own single-axle wheels (on the long sides) and tows lengthwise behind your vehicle. When you arrive, hydraulic legs drop to lift it off the wheels and sit it dead level — even on uneven ground. Toggle Parked / Travel in the 3D preview to see it.",
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
    <section id="faq" className="bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-4 flex items-center gap-3 text-wood-deep">
            <span className="h-px w-10 bg-wood" />
            <Stamp>FAQ</Stamp>
          </div>
          <h2 className="font-display text-4xl leading-tight text-ink sm:text-5xl">
            Questions, <span className="italic text-wood-deep">answered.</span>
          </h2>
        </Reveal>

        <div className="mt-12 divide-y divide-line border-y border-line">
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
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-lg text-ember transition-transform duration-300 ${
                      isOpen ? "rotate-45 bg-ember text-white" : ""
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-10 text-stone">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
