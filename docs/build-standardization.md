# Build Standardization — for the builder

The goal: turn "how you like building them" into a **repeatable system** so every
cart is consistent, quotable, and matches what customers pick on the website.

There are three building blocks. Fill in the bracketed `[ … ]` parts with the
builder. Everything here maps 1:1 to the website's configurator
(`lib/configurator.ts`) — change it there and the site + 3D preview update.

---

## 1. The Base Build (the fixed starting point)

Every cart starts identical. This is what's included before any add-on.

| Spec | Standard (fill in real values) |
| --- | --- |
| Overall size (W × D × H) | `[ e.g. 78" × 26" × 36" ]` |
| Cabinet material | Solid wood (species chosen by customer) |
| Countertop | Stainless prep counter + sink |
| Cooktop | Stainless 3-burner |
| Storage | Lower prep shelf |
| Mobility | Locking casters |
| Finish | Natural matte seal |
| Build time (base) | `[ e.g. 3 weeks ]` |
| Base materials cost | `[ $ ]` |
| Base labor (shop hours) | `[ hrs → $ ]` |
| **Base sell price** | **$9,950 (placeholder)** |

> Rule of thumb: the base build should be a complete, usable kitchen on its own.
> Everything else is an upgrade.

---

## 2. How additions work (modules)

Every add-on is a **module** in a **category**. A customer picks modules; each
adds to the price and (where it makes sense) shows up on the 3D cart.

Categories on the site today:

| Category | Choose | Modules |
| --- | --- | --- |
| Cooktop & grill | one | 3-burner · Pro 4-burner · Burner + grill/griddle |
| Refrigeration | one | None · Cooler slide · Single drawer · Dual drawers |
| Wood species | one | Pine · Cedar · White oak |
| Finish | one | Matte · Hand-rubbed oil · Custom stain |
| Mobility & towing | one | Casters · Road trailer · Off-road trailer |
| Weather protection | any | Cover · Roll-top lid · Wind guard |
| Power & lighting | any | LED · Solar+battery · Shore-power |
| Water | any | Pressurized + tank · Hot water |
| Comfort & extras | any | Speakers · Drawers · Board+knife · Trash slide |
| Personalization | any | Engraved name/title · Custom hardware |

**For each module, the builder should be able to state:**
- What it physically is (parts / brand / model)
- Added materials cost + added shop hours
- Whether it changes lead time
- Any modules it requires or conflicts with (e.g. hot water needs pressurized water)

---

## 3. Tiers / grades (good → better → best)

Some modules come in **grades**. Same component, different quality/brand. On the
site this is the "type, then tier" model: the customer picks (e.g.) a 4-burner,
then a grade.

Current graded modules (fill in real brands + costs):

| Module | Standard | Premium | Pro / brand-class |
| --- | --- | --- | --- |
| Pro 4-burner cooktop | `[ brand/model ]` +$0 | `[ brand/model ]` +$600 | `[ Viking-class ]` +$1,800 |
| Burner + grill/griddle | `[ … ]` +$0 | `[ … ]` +$700 | `[ … ]` +$1,900 |
| Single fridge drawer | `[ … ]` +$0 | `[ … ]` +$500 | — |
| Dual fridge drawers | `[ … ]` +$0 | `[ … ]` +$800 | — |

**To add a grade to any module:** give it a name, a price delta, and a one-line
description. Three grades max keeps it clean. Adding grades to more modules
(e.g. faucets, speakers, hardware) is just more rows here → then mirrored in
`lib/configurator.ts`.

---

## 4. Presets (curated rigs)

Presets are pre-filled builds that show customers what "good" looks like and
anchor pricing. Keep ~3, each with a clear personality:

| Preset | Who it's for | Notable spec |
| --- | --- | --- |
| The Overlander | Off-grid adventurers | Grill, single fridge, cedar/oil, off-road trailer, solar, water |
| The Estate | Premium home/patio | Pro-grade 4-burner, dual fridge, white oak, lid, full power+water |
| The Tailgater | Events / road | Grill, single fridge, cedar, road trailer, speakers |

When you change real components or pricing, revisit these so they stay flagship.

---

## 5. Keeping it in sync

- **Single source of truth:** `lib/configurator.ts`. Base price, every module,
  every grade, every preset, and the 3D appearance mapping (`lib/cart3d.ts`) all
  read from it.
- **Workflow:** builder defines real specs/costs here → update
  `lib/configurator.ts` → the website, configurator, 3D preview, sticky summary,
  and quote emails all update automatically.
- **Quote → build:** every quote email contains the exact module + grade list and
  any engraving text, so the builder can build straight from it.
