// ─────────────────────────────────────────────────────────────────────────
// Nomadic Kitchen — Configurator: single source of truth
//
// Every price, option, tier and preset lives here. The landing page,
// configurator UI, 3D cart, sticky summary, presets and the quote API all read
// from this file. Replace placeholder prices with real costs and the entire
// site (and the 3D builder) updates accordingly.
//
// MODEL
//   Group        — a category (single- or multi-select)
//   Option       — a choice inside a group (first single-choice option is $0)
//   Tier         — an optional quality/brand grade ON an option
//                  (e.g. a 4-burner cooktop in Standard / Premium / Pro-class)
// ─────────────────────────────────────────────────────────────────────────

export const BASE_PRICE = 9950;

export const BASE_INCLUDES: string[] = [
  "Solid-wood cabinet, hand-built to order",
  "Stainless 3-burner cooktop",
  "Stainless prep counter + sink",
  "Lower prep shelf",
  "Single-axle chassis — long-side wheels + hydraulic leveling legs",
  "Natural matte protective seal",
];

export type GroupType = "single" | "multi";

export interface Tier {
  id: string;
  label: string;
  /** Added on top of the option's own price. First tier = $0 (standard grade). */
  price: number;
  description?: string;
}

export interface ConfigOption {
  id: string;
  label: string;
  price: number;
  description?: string;
  /** Optional quality/brand grades. When set, a tier selector appears once chosen. */
  tiers?: Tier[];
}

export interface ConfigGroup {
  id: string;
  name: string;
  type: GroupType;
  description: string;
  options: ConfigOption[];
}

export type Selection = Record<string, string[]>;
/** optionId -> chosen tierId (only for options that have tiers) */
export type TierSelection = Record<string, string>;

// Reusable tier ladder for two-grade modules (fridge)
const TWO_TIERS = (premium: number): Tier[] => [
  { id: "std", label: "Standard", price: 0, description: "Our standard stainless spec." },
  { id: "prem", label: "Premium", price: premium, description: "Premium brand-class unit." },
];

// Cooktop appliance grades (applied to every burner layout)
const COOKTOP_TIERS: Tier[] = [
  { id: "std", label: "Hibachi flat-top", price: 0, description: "Flat cast-steel griddle surface — sear, smash-burgers, teppanyaki. Simple and rugged." },
  { id: "prem", label: "Gas burners", price: 600, description: "Open stainless gas burners on cast grates — fast, high heat, pots and pans." },
  { id: "pro", label: "Pro rangetop", price: 1800, description: "Pro-grade rangetop: sealed burners in a continuous heavy grate, premium fit and BTU." },
];

export const GROUPS: ConfigGroup[] = [
  {
    id: "cooktop",
    name: "Cooktop & grill",
    type: "single",
    description: "Pick your burner layout, then the appliance grade.",
    options: [
      { id: "cooktop-standard", label: "3-burner", price: 0, description: "Three cooking zones — the base layout.", tiers: COOKTOP_TIERS },
      { id: "cooktop-pro", label: "4-burner", price: 700, description: "A fourth zone and more surface.", tiers: COOKTOP_TIERS },
      { id: "cooktop-grill", label: "Burner + griddle", price: 900, description: "Open burners plus a flat griddle station.", tiers: COOKTOP_TIERS },
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
      {
        id: "fridge-single",
        label: "Single fridge drawer",
        price: 1400,
        description: "Stainless 12V fridge drawer.",
        tiers: TWO_TIERS(500),
      },
      {
        id: "fridge-dual",
        label: "Dual fridge drawers",
        price: 2400,
        description: "Two stainless 12V drawers — fridge + freezer.",
        tiers: TWO_TIERS(800),
      },
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
      { id: "personal-engrave", label: "Laser-engraved name", price: 150, description: "Your name or title, engraved on a nameplate." },
      { id: "personal-hardware", label: "Custom hardware finish", price: 200, description: "Hardware finished to your spec (e.g. brass)." },
    ],
  },
];

export interface Preset {
  id: string;
  name: string;
  tagline: string;
  selection: Selection;
  tiers?: TierSelection;
  engraving?: string;
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
      weather: ["weather-cover"],
      power: ["power-led", "power-solar"],
      water: ["water-pressurized"],
      comfort: ["comfort-speakers"],
      personalization: ["personal-engrave"],
    },
    tiers: { "cooktop-grill": "prem", "fridge-single": "std" },
    engraving: "The Overlander",
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
      weather: ["weather-lid", "weather-windguard"],
      power: ["power-led", "power-shore"],
      water: ["water-pressurized", "water-hot"],
      comfort: ["comfort-drawers", "comfort-board"],
      personalization: ["personal-engrave", "personal-hardware"],
    },
    tiers: { "cooktop-pro": "pro", "fridge-dual": "prem" },
    engraving: "The Estate",
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
      weather: ["weather-cover"],
      power: ["power-led"],
      water: [],
      comfort: ["comfort-speakers", "comfort-trash"],
      personalization: ["personal-engrave"],
    },
    tiers: { "cooktop-grill": "std", "fridge-single": "std" },
    engraving: "The Tailgater",
  },
];

// ── Lookups ──────────────────────────────────────────────────────────────

const GROUP_BY_ID: Record<string, ConfigGroup> = Object.fromEntries(GROUPS.map((g) => [g.id, g]));
const OPTION_BY_ID: Record<string, ConfigOption> = Object.fromEntries(
  GROUPS.flatMap((g) => g.options.map((o) => [o.id, o]))
);

export function getGroup(id: string): ConfigGroup | undefined {
  return GROUP_BY_ID[id];
}
export function getOption(id: string): ConfigOption | undefined {
  return OPTION_BY_ID[id];
}

export function defaultSelection(): Selection {
  const sel: Selection = {};
  for (const g of GROUPS) sel[g.id] = g.type === "single" ? [g.options[0].id] : [];
  return sel;
}

/** Every option that has tiers, defaulted to its first (standard) tier. */
export function defaultTiers(): TierSelection {
  const t: TierSelection = {};
  for (const o of Object.values(OPTION_BY_ID)) {
    if (o.tiers && o.tiers.length) t[o.id] = o.tiers[0].id;
  }
  return t;
}

function tierOf(optionId: string, tiers: TierSelection): Tier | null {
  const opt = OPTION_BY_ID[optionId];
  if (!opt?.tiers) return null;
  const tid = tiers[optionId] ?? opt.tiers[0].id;
  return opt.tiers.find((t) => t.id === tid) ?? opt.tiers[0];
}

/** Extra cost from the chosen tier of a selected option (0 if standard / no tiers). */
export function tierPrice(optionId: string, tiers: TierSelection): number {
  return tierOf(optionId, tiers)?.price ?? 0;
}

export function totalPrice(selection: Selection, tiers: TierSelection = {}): number {
  let total = BASE_PRICE;
  for (const ids of Object.values(selection)) {
    for (const id of ids) {
      total += OPTION_BY_ID[id]?.price ?? 0;
      total += tierPrice(id, tiers);
    }
  }
  return total;
}

export interface SummaryLine {
  groupId: string;
  groupName: string;
  optionId: string;
  optionLabel: string;
  tierLabel?: string;
  price: number;
}

export function summaryLines(selection: Selection, tiers: TierSelection = {}): SummaryLine[] {
  const lines: SummaryLine[] = [];
  for (const g of GROUPS) {
    for (const id of selection[g.id] ?? []) {
      const opt = OPTION_BY_ID[id];
      if (!opt) continue;
      const tier = tierOf(id, tiers);
      const isUpgradedTier = tier && opt.tiers && opt.tiers[0].id !== tier.id;
      lines.push({
        groupId: g.id,
        groupName: g.name,
        optionId: opt.id,
        optionLabel: opt.label,
        tierLabel: isUpgradedTier ? tier!.label : undefined,
        price: opt.price + (tier?.price ?? 0),
      });
    }
  }
  return lines;
}

export function formatPrice(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function specToText(selection: Selection, tiers: TierSelection = {}, engraving = ""): string {
  const lines = summaryLines(selection, tiers).map((l) => {
    const name = l.tierLabel ? `${l.optionLabel} · ${l.tierLabel}` : l.optionLabel;
    const price = l.price > 0 ? `  (+${formatPrice(l.price)})` : "  (included)";
    return `  • ${l.groupName}: ${name}${price}`;
  });
  return [
    `Base build: ${formatPrice(BASE_PRICE)}`,
    ...lines,
    engraving.trim() ? `  • Engraving text: "${engraving.trim()}"` : "",
    `\nTotal: ${formatPrice(totalPrice(selection, tiers))}`,
  ]
    .filter(Boolean)
    .join("\n");
}
