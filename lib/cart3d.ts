// ─────────────────────────────────────────────────────────────────────────
// Maps a configurator Selection -> visual parameters for the 3D cart + UI
// swatches. Keyed off the option ids in lib/configurator.ts. Pricing stays in
// configurator.ts; this file owns *appearance* only.
// ─────────────────────────────────────────────────────────────────────────

import type { Selection } from "@/lib/configurator";

export interface WoodLook {
  hex: string;
  label: string;
}

// Wood species -> base color
export const WOOD_LOOK: Record<string, WoodLook> = {
  "wood-pine": { hex: "#e2c499", label: "Sealed pine" },
  "wood-cedar": { hex: "#a8643c", label: "Western red cedar" },
  "wood-oak": { hex: "#cdae7d", label: "White oak" },
};

// Finish -> how the wood reads (roughness + tone shift + sheen)
export interface FinishLook {
  roughness: number;
  clearcoat: number;
  darken: number; // 0..1 multiply toward darker
  swatch: string;
  label: string;
}

export const FINISH_LOOK: Record<string, FinishLook> = {
  "finish-matte": { roughness: 0.9, clearcoat: 0.0, darken: 0.0, swatch: "#d8c3a0", label: "Natural matte" },
  "finish-oil": { roughness: 0.55, clearcoat: 0.25, darken: 0.14, swatch: "#a9764a", label: "Hand-rubbed oil" },
  "finish-stain": { roughness: 0.5, clearcoat: 0.35, darken: 0.34, swatch: "#6f4a2c", label: "Custom stain" },
};

export type CooktopKind = "standard" | "pro" | "grill";
export type MobilityKind = "casters" | "road" | "offroad";

export interface CartParams {
  woodHex: string;
  finishRoughness: number;
  finishClearcoat: number;
  woodDarken: number;
  cooktop: CooktopKind;
  fridgeDrawers: number; // 0,1,2
  cooler: boolean;
  mobility: MobilityKind;
  lid: boolean;
  windGuard: boolean;
  led: boolean;
  solar: boolean;
  waterTank: boolean;
  speakers: boolean;
  extraDrawers: boolean;
  cuttingBoard: boolean;
  nameplate: boolean;
  hardwareBrass: boolean;
}

function has(sel: Selection, group: string, id: string): boolean {
  return (sel[group] ?? []).includes(id);
}

function darkenHex(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * (1 - amount));
  const g = Math.round(((n >> 8) & 255) * (1 - amount));
  const b = Math.round((n & 255) * (1 - amount));
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

export function cartParams(sel: Selection): CartParams {
  const woodId = (sel["wood"] ?? ["wood-pine"])[0];
  const finishId = (sel["finish"] ?? ["finish-matte"])[0];
  const wood = WOOD_LOOK[woodId] ?? WOOD_LOOK["wood-pine"];
  const finish = FINISH_LOOK[finishId] ?? FINISH_LOOK["finish-matte"];

  const cooktopId = (sel["cooktop"] ?? ["cooktop-standard"])[0];
  const cooktop: CooktopKind =
    cooktopId === "cooktop-pro" ? "pro" : cooktopId === "cooktop-grill" ? "grill" : "standard";

  const fridgeId = (sel["refrigeration"] ?? ["fridge-none"])[0];
  const fridgeDrawers = fridgeId === "fridge-dual" ? 2 : fridgeId === "fridge-single" ? 1 : 0;
  const cooler = fridgeId === "fridge-cooler";

  const mobilityId = (sel["mobility"] ?? ["mobility-casters"])[0];
  const mobility: MobilityKind =
    mobilityId === "mobility-road" ? "road" : mobilityId === "mobility-offroad" ? "offroad" : "casters";

  return {
    woodHex: darkenHex(wood.hex, finish.darken),
    finishRoughness: finish.roughness,
    finishClearcoat: finish.clearcoat,
    woodDarken: finish.darken,
    cooktop,
    fridgeDrawers,
    cooler,
    mobility,
    lid: has(sel, "weather", "weather-lid"),
    windGuard: has(sel, "weather", "weather-windguard"),
    led: has(sel, "power", "power-led"),
    solar: has(sel, "power", "power-solar"),
    waterTank: has(sel, "water", "water-pressurized") || has(sel, "water", "water-hot"),
    speakers: has(sel, "comfort", "comfort-speakers"),
    extraDrawers: has(sel, "comfort", "comfort-drawers"),
    cuttingBoard: has(sel, "comfort", "comfort-board"),
    nameplate: has(sel, "personalization", "personal-engrave"),
    hardwareBrass: has(sel, "personalization", "personal-hardware"),
  };
}
