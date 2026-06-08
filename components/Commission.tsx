import { Reveal } from "@/components/motion/Reveal";
import { Stamp } from "@/components/decor/Decor";

// Editable scarcity numbers (placeholders — set to your real annual capacity).
const BUILDS_PER_YEAR = 12;
const SEASON = "2026";
const EDITION_NO = "007";

export default function Commission() {
  return (
    <section id="commission" className="relative overflow-hidden bg-sand py-24 sm:py-32">
      {/* faint oversized numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 -translate-y-1/2 select-none font-display text-[18rem] leading-none text-wood/10 sm:text-[26rem]"
      >
        {BUILDS_PER_YEAR}
      </span>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal>
              <div className="mb-4 flex items-center gap-3 text-wood-deep">
                <span className="h-px w-10 bg-wood" />
                <Stamp>The Commission</Stamp>
              </div>
              <h2 className="max-w-xl font-display text-4xl leading-[1.05] text-ink sm:text-5xl">
                A run of just{" "}
                <span className="italic text-wood-deep">{BUILDS_PER_YEAR}</span> a year.
              </h2>
              <p className="mt-5 max-w-lg text-stone">
                Every Nomadic Kitchen is made to order, numbered, and signed by the
                maker — built in a small run each season. We take a limited number of
                commissions so each cart gets the bench time it deserves. When a
                season&rsquo;s slots are gone, they&rsquo;re gone.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Stamp className="text-stone">{SEASON} commissions open</Stamp>
                <span className="hidden h-1 w-1 rounded-full bg-mist sm:block" />
                <Stamp className="text-stone">Numbered brass plate</Stamp>
                <span className="hidden h-1 w-1 rounded-full bg-mist sm:block" />
                <Stamp className="text-stone">Reserve with a deposit</Stamp>
              </div>

              <a
                href="#quote"
                className="group relative mt-8 inline-flex overflow-hidden rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-paper"
              >
                <span className="relative z-10">Reserve your build →</span>
                <span className="absolute inset-0 -translate-x-full bg-wood-deep transition-transform duration-300 group-hover:translate-x-0" />
              </a>
            </Reveal>
          </div>

          {/* Numbered brass edition plate */}
          <Reveal delay={0.12}>
            <div className="flex justify-center lg:justify-end">
              <div
                className="w-full max-w-sm rotate-[-2deg] rounded-2xl p-7 shadow-[0_30px_60px_-20px_rgba(60,40,15,0.5)] ring-1 ring-black/10"
                style={{
                  background:
                    "linear-gradient(145deg,#e7cd92 0%,#c4a05a 38%,#9c7b3f 72%,#7c5f30 100%)",
                }}
              >
                <div className="rounded-xl border border-[#6f5325]/40 p-6 text-center">
                  <p
                    className="font-display text-lg tracking-[0.18em] text-[#3a2c10]"
                    style={{ textShadow: "0 1px 0 rgba(255,255,255,0.25)" }}
                  >
                    NOMADIC KITCHEN
                  </p>
                  <div className="my-4 flex items-center justify-center gap-3 text-[#3a2c10]/70">
                    <span className="h-px w-8 bg-[#3a2c10]/30" />
                    <span className="stamp">No. {EDITION_NO}</span>
                    <span className="h-px w-8 bg-[#3a2c10]/30" />
                  </div>
                  <p className="font-display text-4xl text-[#2c2008]" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.25)" }}>
                    Hand-built
                  </p>
                  <p className="mt-3 stamp text-[#3a2c10]/80">Bridgewater, VT · {SEASON}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
