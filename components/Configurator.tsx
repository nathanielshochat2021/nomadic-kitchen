"use client";

import { useBuild } from "@/components/BuildProvider";
import {
  BASE_PRICE,
  formatPrice,
  GROUPS,
  PRESETS,
  summaryLines,
} from "@/lib/configurator";

export default function Configurator() {
  const { selection, total, toggleOption, isSelected, applyPreset, activePreset, reset } =
    useBuild();

  const lines = summaryLines(selection);

  return (
    <section id="configurator" className="bg-canvas py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-wood-deep">
            Build yours
          </p>
          <h2 className="font-display text-3xl leading-tight text-ink sm:text-4xl">
            Configure your kitchen
          </h2>
          <p className="mt-4 text-stone">
            Start from a preset or build from the base up. Your running total
            updates as you go — then carry the exact spec into a quote request.
          </p>
        </div>

        {/* Presets */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`rounded-xl border p-4 text-left transition-colors ${
                activePreset === p.id
                  ? "border-wood bg-wood/10"
                  : "border-line bg-paper hover:border-wood/60"
              }`}
            >
              <span className="block font-display text-lg text-ink">{p.name}</span>
              <span className="mt-1 block text-sm text-stone">{p.tagline}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Option groups */}
          <div className="space-y-10">
            {GROUPS.map((group) => (
              <fieldset key={group.id}>
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <legend className="font-display text-xl text-ink">{group.name}</legend>
                  <span className="text-xs uppercase tracking-wide text-mist">
                    {group.type === "single" ? "Choose one" : "Choose any"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone">{group.description}</p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.options.map((opt) => {
                    const active = isSelected(group.id, opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggleOption(group.id, opt.id)}
                        className={`flex flex-col rounded-xl border p-4 text-left transition-colors ${
                          active
                            ? "border-wood bg-wood/10 ring-1 ring-wood"
                            : "border-line bg-paper hover:border-wood/50"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span className="font-medium text-ink">{opt.label}</span>
                          <span
                            className={`shrink-0 text-sm ${
                              opt.price > 0 ? "text-wood-deep" : "text-mist"
                            }`}
                          >
                            {opt.price > 0 ? `+${formatPrice(opt.price)}` : "Included"}
                          </span>
                        </span>
                        {opt.description && (
                          <span className="mt-1 text-sm text-stone">{opt.description}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>

          {/* Sticky summary */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-paper p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl text-ink">Your build</h3>
                <button
                  onClick={reset}
                  className="text-xs uppercase tracking-wide text-mist underline-offset-4 hover:text-stone hover:underline"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between text-stone">
                  <span>Base build</span>
                  <span>{formatPrice(BASE_PRICE)}</span>
                </div>
                {lines
                  .filter((l) => l.price > 0)
                  .map((l) => (
                    <div key={l.optionId} className="flex justify-between text-charcoal">
                      <span className="pr-3">{l.optionLabel}</span>
                      <span className="shrink-0">+{formatPrice(l.price)}</span>
                    </div>
                  ))}
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-line pt-4">
                <span className="text-sm uppercase tracking-wide text-stone">Total</span>
                <span className="font-display text-2xl text-ink">{formatPrice(total)}</span>
              </div>

              <a
                href="#quote"
                className="mt-5 block rounded-full bg-ink px-5 py-3 text-center text-sm font-semibold text-paper transition-colors hover:bg-charcoal"
              >
                Get a quote for this build
              </a>
              <p className="mt-3 text-xs leading-relaxed text-mist">
                Prices are estimates for configuration. Final pricing is confirmed
                on your quote. A deposit reserves your build slot.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
