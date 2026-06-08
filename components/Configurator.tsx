"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import type { ViewMode } from "@/components/three/CartModel";
import { useBuild } from "@/components/BuildProvider";
import {
  BASE_PRICE,
  formatPrice,
  getOption,
  GROUPS,
  PRESETS,
  summaryLines,
  type ConfigOption,
} from "@/lib/configurator";
import { cartParams, WOOD_LOOK, FINISH_LOOK } from "@/lib/cart3d";
import AnimatedPrice from "@/components/motion/AnimatedPrice";
import { Reveal } from "@/components/motion/Reveal";
import { Stamp, Crosshair } from "@/components/decor/Decor";

const CartViewer = dynamic(() => import("@/components/three/CartViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <span className="stamp animate-pulse text-paper/60">Assembling preview…</span>
    </div>
  ),
});

function swatchFor(groupId: string, optionId: string): string | null {
  if (groupId === "wood") return WOOD_LOOK[optionId]?.hex ?? null;
  if (groupId === "finish") return FINISH_LOOK[optionId]?.swatch ?? null;
  return null;
}

export default function Configurator() {
  const {
    selection,
    tiers,
    engraving,
    total,
    toggleOption,
    isSelected,
    setTier,
    tierFor,
    setEngraving,
    applyPreset,
    activePreset,
    reset,
  } = useBuild();

  const [mode, setMode] = useState<ViewMode>("parked");
  const [openGroup, setOpenGroup] = useState<string>(GROUPS[0].id);
  const params = useMemo(() => cartParams(selection, tiers, engraving), [selection, tiers, engraving]);
  const lines = summaryLines(selection, tiers);
  const addOnCount = lines.filter((l) => l.price > 0).length;

  // Short summary of a group's current selection, shown in the accordion header.
  const summarize = (groupId: string): string => {
    const sel = (selection[groupId] ?? []).map((id) => getOption(id)).filter(Boolean) as ConfigOption[];
    if (groupId === "personalization") {
      const parts = sel.map((o) => o.label);
      if (engraving.trim()) parts.push(`“${engraving.trim()}”`);
      return parts.length ? parts.join(", ") : "None";
    }
    if (!sel.length) return "None";
    return sel
      .map((o) => {
        const t = o.tiers?.find((x) => x.id === tierFor(o.id));
        const up = t && o.tiers && o.tiers[0].id !== t.id ? ` · ${t.label}` : "";
        return `${o.label}${up}`;
      })
      .join(", ");
  };

  return (
    <section id="configurator" className="relative bg-forest-deep py-24 text-paper sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_0%,rgba(210,98,46,0.12),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-3 flex items-center gap-3 text-ember-soft">
            <span className="h-px w-10 bg-ember" />
            <Stamp>Configurator</Stamp>
          </div>
          <h2 className="font-display text-4xl leading-tight sm:text-5xl">
            Build it. Spin it. <span className="italic text-ember-soft">Make it yours.</span>
          </h2>
          <p className="mt-3 max-w-md text-paper/70">
            Drag to spin. Every choice reshapes the cart — live.
          </p>
        </Reveal>

        {/* Presets */}
        <div className="mt-8 flex flex-wrap gap-3">
          <Stamp className="mr-1 self-center text-paper/50">Start from a rig:</Stamp>
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p.id)}
              className={`rounded-full border px-4 py-2 text-sm transition-all ${
                activePreset === p.id
                  ? "border-ember bg-ember text-white"
                  : "border-white/15 bg-white/5 text-paper/85 hover:border-ember/60 hover:bg-white/10"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={reset}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-paper/50 transition-colors hover:text-paper/80"
          >
            Reset
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8">
          {/* ── 3D viewer (sticky on every screen size) ────── */}
          <div className="sticky top-[4.5rem] z-20 self-start lg:top-24">
            <div className="relative h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(120%_120%_at_50%_15%,#2b362b,#161c16_70%)] sm:h-[460px] lg:h-[560px]">
              <CartViewer params={params} mode={mode} />
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-night/50 px-3 py-1.5 backdrop-blur-sm">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ember" />
                  <Stamp className="text-paper/80">Live preview</Stamp>
                </div>
                <div className="absolute right-4 top-4 flex items-center gap-1.5 text-paper/60">
                  <Crosshair className="h-4 w-4" />
                  <Stamp>Drag to rotate</Stamp>
                </div>
              </div>
              {/* Travel / Parked toggle */}
              <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-0.5 rounded-full border border-white/15 bg-night/55 p-0.5 backdrop-blur-sm">
                {(["parked", "travel"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors ${
                      mode === m ? "bg-ember text-white" : "text-paper/70 hover:text-paper"
                    }`}
                  >
                    {m === "parked" ? "Parked · legs" : "Travel · wheels"}
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute inset-x-3 bottom-3">
                <div className="pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-night/70 px-4 py-3 backdrop-blur-md">
                  <div>
                    <Stamp className="text-paper/50">
                      Your build · {addOnCount} add-on{addOnCount === 1 ? "" : "s"}
                    </Stamp>
                    <AnimatedPrice value={total} className="block font-display text-2xl text-paper" />
                  </div>
                  <a
                    href="#quote"
                    className="group relative overflow-hidden whitespace-nowrap rounded-full bg-ember px-5 py-2.5 text-sm font-semibold text-white"
                  >
                    <span className="relative z-10">Get a quote →</span>
                    <span className="absolute inset-0 -translate-x-full bg-wood-deep transition-transform duration-300 group-hover:translate-x-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ── Option groups (accordion) ──────────────────── */}
          <div className="space-y-3">
            {GROUPS.map((group) => {
              const selectedInGroup = (selection[group.id] ?? []).map((id) => getOption(id)).filter(Boolean);
              const tierable = selectedInGroup.find((o) => o!.tiers && o!.tiers.length);
              const isOpen = openGroup === group.id;
              return (
                <div key={group.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenGroup(isOpen ? "" : group.id)}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-display text-lg text-paper">{group.name}</span>
                      <span className="mt-0.5 block truncate text-xs text-paper/55">{summarize(group.id)}</span>
                    </span>
                    <span className="hidden shrink-0 text-xs text-paper/40 sm:block">
                      {group.type === "single" ? "Pick one" : "Pick any"}
                    </span>
                    <svg
                      viewBox="0 0 12 12"
                      className={`h-3.5 w-3.5 shrink-0 text-paper/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      aria-hidden
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" />
                    </svg>
                  </button>

                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="px-4 pb-4">
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {group.options.map((opt) => {
                      const active = isSelected(group.id, opt.id);
                      const swatch = swatchFor(group.id, opt.id);
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          aria-pressed={active}
                          onClick={() => toggleOption(group.id, opt.id)}
                          className={`group flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all ${
                            active
                              ? "border-ember bg-ember/15 ring-1 ring-ember/60"
                              : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]"
                          }`}
                        >
                          {swatch && (
                            <span
                              className="h-7 w-7 shrink-0 rounded-full border border-white/20 shadow-inner"
                              style={{ background: swatch }}
                            />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between gap-2">
                              <span className="truncate font-medium text-paper">
                                {opt.label}
                                {opt.tiers && <span className="ml-1 text-ember-soft">▴</span>}
                              </span>
                              <span className={`shrink-0 text-sm ${opt.price > 0 ? "text-ember-soft" : "text-paper/40"}`}>
                                {opt.price > 0 ? `+${formatPrice(opt.price)}` : "Incl."}
                              </span>
                            </span>
                            {opt.description && <span className="mt-0.5 block text-xs text-paper/55">{opt.description}</span>}
                          </span>
                          <span
                            className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[10px] transition-colors ${
                              active ? "border-ember bg-ember text-white" : "border-white/25 text-transparent"
                            }`}
                          >
                            ✓
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Tier / grade selector for the chosen option */}
                  {tierable?.tiers && (
                    <div className="mt-3 rounded-xl border border-ember/25 bg-ember/[0.06] p-3">
                      <div className="mb-2 flex items-center gap-2">
                        <Stamp className="text-ember-soft">Grade · {tierable.label}</Stamp>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tierable.tiers.map((t) => {
                          const on = tierFor(tierable.id) === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setTier(tierable.id, t.id)}
                              className={`rounded-full border px-3.5 py-1.5 text-sm transition-all ${
                                on ? "border-ember bg-ember text-white" : "border-white/15 bg-white/5 text-paper/80 hover:border-ember/50"
                              }`}
                              title={t.description}
                            >
                              {t.label}
                              {t.price > 0 && <span className={`ml-1.5 ${on ? "text-white/85" : "text-ember-soft"}`}>+{formatPrice(t.price)}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Engraving input lives under Personalization */}
                  {group.id === "personalization" && (
                    <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                      <label htmlFor="engrave" className="mb-1.5 block">
                        <Stamp className="text-paper/60">Engraving — name or title</Stamp>
                      </label>
                      <input
                        id="engrave"
                        value={engraving}
                        onChange={(e) => setEngraving(e.target.value)}
                        maxLength={20}
                        placeholder="e.g. The Wanderer"
                        className="focusable w-full rounded-lg border border-white/15 bg-night/40 px-3.5 py-2.5 text-paper placeholder:text-paper/35 outline-none transition focus:border-ember"
                      />
                      <p className="mt-1.5 text-xs text-paper/45">
                        Appears engraved on the cart&rsquo;s nameplate in the preview. Adds the engraving option.
                      </p>
                    </div>
                  )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <p className="text-xs leading-relaxed text-paper/40">
              Estimates only (Base build {formatPrice(BASE_PRICE)}). Final pricing is confirmed on your
              written quote; a deposit reserves your build slot.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
