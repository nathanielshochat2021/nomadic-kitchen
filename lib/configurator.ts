// ─────────────────────────────────────────────────────────────────────────
// Nomadic Kitchen — Configurator: single source of truth
//
// Every price, option, group and preset lives here. The landing page,
// configurator UI, sticky summary, presets and the quote API all read from
// this file. Replace the placeholder prices below with your real costs and
// the entire site updates accordingly.
// ─────────────────────────────────────────────────────────────────────────

export const BASE_PRICE = 9950;

/** What every cart ships with, before any add-ons. */
export const BASE_INCLUDES: string[] = [
  "Solid-wood cabinet, hand-built to order",
  "Stainless 3-burner cooktop",
  "Stainless prep counter + sink",
  "Lower prep shelf",
  "Locking casters",
  "Natural matte protective seal",
];

export type GroupType = "single" | "multi";

export interface ConfigOption {
  id: string;
  label: string;
  /** Added to the base price when selected. First option in a group is $0 (included). */
  price: number;
  description?: string;
}

export interface ConfigGroup {
  id: string;
  name: string;
  type: GroupType;
  /** Short helper text shown under the group heading. */
  description: string;
  options: ConfigOption[];
}

// A configuration is keyed by group id. Single-choice groups hold exactly one
// option id; multi-select groups hold zero or more.
export type Selection = Record<string, string[]>;

export const GROUPS: ConfigGroup[] = [
  {
    id: "cooktop",
    name: "Cooktop & grill",
    type: "single",
    description: "Your primary cooking surface.",
    options: [
      { id: "cooktop-standard", label: "Standard 3-burner", price: 0, description: "Stainless 3-burner — the base build." },
      { id: "cooktop-pro", label: "Pro 4-burner", price: 700, description: "More surface, higher BTU output." },
      { id: "cooktop-grill", label: "Burner + grill / griddle", price: 900, description: "Open burners plus a grill/griddle station." },
    ],
  },
  {
    id: "refrigeration",
    name: "Refrigeration",
    type: "single",
    description: "Keep it cold, off-grid or plugged in.",
    options: [
      { id: "fridge-none", label: "None", price: 0, description: "Skip it, or bring your own cooler." },
      { id: "fridge-cooler", label: "Cooler slide", price: 350, description: "Insulated cooler on a full-extension slide." },
      { id: "fridge-single", label: "Single fridge drawer", price: 1400, description: "Stainless 12V fridge drawer." },
      { id: "fridge-dual", label: "Dual fridge drawers", price: 2400, description: "Two stainless 12V drawers — fridge + freezer." },
    ],
  },
  {
    id: "wood",
    name: "Wood species",
    type: "single",
    description: "The character and weathering of your cabinet.",
    options: [
      { id: "wood-pine", label: "Sealed pine", price: 0, description: "Warm, light, budget-friendly." },
      { id: "wood-cedar", label: "Western red cedar", price: 650, description: "Aromatic, naturally weather-resistant." },
      { id: "wood-oak", label: "White oak", price: 1250, description: "Dense, tight grain, heirloom-grade." },
    ],
  },
  {
    id: "finish",
    name: "Finish",
    type: "single",
    description: "How the wood is sealed and toned.",
    options: [
      { id: "finish-matte", label: "Natural matte", price: 0, description: "Clear matte protective seal." },
      { id: "finish-oil", label: "Hand-rubbed oil", price: 300, description: "Deep, hand-rubbed penetrating oil." },
      { id: "finish-stain", label: "Custom stain", price: 450, description: "Tone matched to your color." },
    ],
  },
  {
    id: "mobility",
    name: "Mobility & towing",
    type: "single",
    description: "Roll it across the patio, or tow it anywhere.",
    options: [
      { id: "mobility-casters", label: "Locking casters", price: 0, description: "Heavy-duty locking casters — the base build." },
      { id: "mobility-road", label: "Single-axle road trailer", price: 2200, description: "Registerable single-axle trailer." },
      { id: "mobility-offroad", label: "Off-road trailer package", price: 3400, description: "Lifted off-road trailer for overlanding." },
    ],
  },
  {
    id: "weather",
    name: "Weather protection",
    type: "multi",
    description: "Shield your build from the elements.",
    options: [
      { id: "weather-cover", label: "Fitted cover", price: 350, description: "Tailored all-weather cover." },
      { id: "weather-lid", label: "Hard roll-top lid", price: 900, description: "Lockable hard roll-top over the cooktop." },
      { id: "weather-windguard", label: "Stainless wind guard", price: 300, description: "Three-sided stainless wind guard." },
    ],
  },
  {
    id: "power",
    name: "Power & lighting",
    type: "multi",
    description: "Light it up and power your gear.",
    options: [
      { id: "power-led", label: "LED task + ambient", price: 300, description: "Dimmable task and ambient LED lighting." },
      { id: "power-solar", label: "Solar + battery + inverter", price: 1800, description: "Off-grid solar, battery bank and inverter." },
      { id: "power-shore", label: "Shore-power", price: 300, description: "Plug-in shore-power inlet + outlets." },
    ],
  },
  {
    id: "water",
    name: "Water",
    type: "multi",
    description: "Plumbing for real prep and cleanup.",
    options: [
      { id: "water-pressurized", label: "Pressurized water + tank", price: 650, description: "Pump-pressurized water with onboard tank." },
      { id: "water-hot", label: "Hot water on demand", price: 800, description: "On-demand hot water heater." },
    ],
  },
  {
    id: "comfort",
    name: "Comfort & extras",
    type: "multi",
    description: "The details that make it yours.",
    options: [
      { id: "comfort-speakers", label: "Marine Bluetooth speakers", price: 450, description: "Weatherproof marine-grade speakers." },
      { id: "comfort-drawers", label: "Storage drawers", price: 250, description: "Soft-close utensil & tool drawers." },
      { id: "comfort-board", label: "Cutting board + knife block", price: 180, description: "Integrated end-grain board and knife block." },
      { id: "comfort-trash", label: "Trash / recycling slide", price: 220, description: "Concealed dual trash & recycling slide." },
    ],
  },
  {
    id: "personalization",
    name: "Personalization",
    type: "multi",
    description: "Make it unmistakably yours.",
    options: [
      { id: "personal-engrave", label: "Laser-engraved name", price: 150, description: "Your name or mark, laser-engraved." },
      { id: "personal-hardware", label: "Custom hardware finish", price: 200, description: "Hardware finished to your spec." },
    ],
  },
];

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  selection: Selection;
}

export const PRESETS: Preset[] = [
  {
    id: "overlander",
    name: "The Overlander",
    tagline: "Off-grid and built to roam.",
    selection: {
      cooktop: ["cooktop-grill"],
      refrigeration: ["fridge-single"],
      wood: ["wood-cedar"],
      finish: ["finish-oil"],
      mobility: ["mobility-offroad"],
      weather: ["weather-cover"],
      power: ["power-led", "power-solar"],
      water: ["water-pressurized"],
      comfort: ["comfort-speakers"],
      personalization: [],
    },
  },
  {
    id: "estate",
    name: "The Estate",
    tagline: "The fully-appointed flagship.",
    selection: {
      cooktop: ["cooktop-pro"],
      refrigeration: ["fridge-dual"],
      wood: ["wood-oak"],
      finish: ["finish-stain"],
      mobility: ["mobility-casters"],
      weather: ["weather-lid", "weather-windguard"],
      power: ["power-led", "power-shore"],
      water: ["water-pressurized", "water-hot"],
      comfort: ["comfort-drawers", "comfort-board"],
      personalization: ["personal-engrave", "personal-hardware"],
    },
  },
  {
    id: "tailgater",
    name: "The Tailgater",
    tagline: "Game-day ready, road-legal.",
    selection: {
      cooktop: ["cooktop-grill"],
      refrigeration: ["fridge-single"],
      wood: ["wood-cedar"],
      finish: ["finish-matte"],
      mobility: ["mobility-road"],
      weather: ["weather-cover"],
      power: ["power-led"],
      water: [],
      comfort: ["comfort-speakers", "comfort-trash"],
      personalization: ["personal-engrave"],
    },
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const GROUP_BY_ID: Record<string, ConfigGroup> = Object.fromEntries(
  GROUPS.map((g) => [g.id, g])
);

const OPTION_BY_ID: Record<string, ConfigOption> = Object.fromEntries(
  GROUPS.flatMap((g) => g.options.map((o) => [o.id, o]))
);

export function getGroup(id: string): ConfigGroup | undefined {
  return GROUP_BY_ID[id];
}

export function getOption(id: string): ConfigOption | undefined {
  return OPTION_BY_ID[id];
}

/** Default configuration: first option of each single group, nothing for multi. */
export function defaultSelection(): Selection {
  const sel: Selection = {};
  for (const g of GROUPS) {
    sel[g.id] = g.type === "single" ? [g.options[0].id] : [];
  }
  return sel;
}

/** Sum of base price plus every selected option. */
export function totalPrice(selection: Selection): number {
  let total = BASE_PRICE;
  for (const ids of Object.values(selection)) {
    for (const id of ids) {
      total += OPTION_BY_ID[id]?.price ?? 0;
    }
  }
  return total;
}

export interface SummaryLine {
  groupId: string;
  groupName: string;
  optionId: string;
  optionLabel: string;
  price: number;
}

/** Flattened, ordered list of every chosen option — used by the summary + quote email. */
export function summaryLines(selection: Selection): SummaryLine[] {
  const lines: SummaryLine[] = [];
  for (const g of GROUPS) {
    for (const id of selection[g.id] ?? []) {
      const opt = OPTION_BY_ID[id];
      if (!opt) continue;
      lines.push({
        groupId: g.id,
        groupName: g.name,
        optionId: opt.id,
        optionLabel: opt.label,
        price: opt.price,
      });
    }
  }
  return lines;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

/** Plain-text spec block for the quote email / server log. */
export function specToText(selection: Selection): string {
  const lines = summaryLines(selection).map((l) => {
    const price = l.price > 0 ? `  (+${formatPrice(l.price)})` : "  (included)";
    return `  • ${l.groupName}: ${l.optionLabel}${price}`;
  });
  return [
    `Base build: ${formatPrice(BASE_PRICE)}`,
    ...lines,
    `\nTotal: ${formatPrice(totalPrice(selection))}`,
  ].join("\n");
}
