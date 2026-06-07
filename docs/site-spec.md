# Site Specification

The marketing site is a single landing page (Next.js 16 App Router) with an
interactive configurator and a lead-capture quote form.

## Stack

- Next.js 16 (App Router, Turbopack), TypeScript
- Tailwind CSS v4 (`@theme` tokens in `app/globals.css`; no `tailwind.config.ts`)
- Resend for quote email
- Fonts: Fraunces (display) + Inter (body) via `next/font/google`

## Page structure (in order)

1. **Nav** — fixed; transparent over the hero, turns solid (paper + blur) after
   24px scroll. Mobile menu. Anchors to each section + "Request a quote".
2. **Hero** — full-bleed `hero-defender.jpg`, headline *"The kitchen that follows
   you outside,"* dual CTA (**Build yours** / **Request a quote**), "Starting at
   $9,950."
3. **Feature** — `cart-front.jpg` + 3 pillars + "base build includes" panel.
4. **Configurator** *(centerpiece)* — presets, option groups, live running total,
   sticky summary, "Get a quote for this build."
5. **Gallery** — the two real photos with captions.
6. **How it works** — 4 steps, deposit model (forest section).
7. **FAQ** — accordion.
8. **Quote form** — contact fields + auto-attached build spec + honeypot.
9. **Footer** — nav, summary, copyright.

## Configurator architecture

- **`lib/configurator.ts`** is the single source of truth: `BASE_PRICE`,
  `BASE_INCLUDES`, `GROUPS` (single & multi), `PRESETS`, and helpers
  (`defaultSelection`, `totalPrice`, `summaryLines`, `formatPrice`, `specToText`).
- **`components/BuildProvider.tsx`** — React context holding the live selection;
  exposes `toggleOption`, `isSelected`, `applyPreset`, `total`, `reset`.
- The **quote form** reads the same context, so the submitted spec always matches
  what the user built. "Get a quote for this build" scrolls to `#quote`.

### Option groups

- **Single-choice** (first option included/$0): Cooktop & grill, Refrigeration,
  Wood species, Finish, Mobility & towing.
- **Multi-select:** Weather protection, Power & lighting, Water, Comfort &
  extras, Personalization.
- **Presets:** The Overlander, The Estate, The Tailgater.

## Quote API — `app/api/quote/route.ts`

- `POST` JSON: contact fields + `selection` + `total`.
- Recomputes the total **server-side** (never trusts the client).
- **Honeypot** (`company`) field → silently accepted, ignored.
- Emails via Resend using `RESEND_API_KEY`, `QUOTE_TO_EMAIL`, `QUOTE_FROM_EMAIL`.
- **If env vars are missing**, logs the lead to the server console and still
  returns success — works undeployed and in preview.

## Design tokens

See `docs/brand-guide.md`. Colors are Tailwind `@theme` variables; fonts are CSS
variables `--font-fraunces` / `--font-inter`.

## Images

`public/images/hero-defender.jpg` and `public/images/cart-front.jpg`. Replace
the files (same names) to update; the site builds with or without changes.

## Accessibility & UX

- Honeypot is off-screen and `tabIndex={-1}`.
- Buttons use `aria-pressed` / `aria-expanded`; respects
  `prefers-reduced-motion`.
- Mobile-first layout throughout.
