# Nomadic Kitchen

Marketing site for **Nomadic Kitchen** — a hand-built, wood-clad outdoor
kitchen cart sold built-to-order (a base cart plus paid add-ons).

Editorial, premium, mobile-first. A single landing page with an interactive
configurator and a lead-capture quote form.

## Stack

- **Next.js 16** (App Router, Turbopack) + **TypeScript**
- **Tailwind CSS v4** (configured via `@theme` in `app/globals.css` — no `tailwind.config.ts`)
- **Resend** for quote-email delivery
- Fonts: **Fraunces** (display) + **Inter** (body) via `next/font/google`

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Configurator

`lib/configurator.ts` is the **single source of truth** for the base price,
included features, every option group, prices and the three presets. Change a
price there and it propagates to the configurator, the sticky summary, the
quote form and the quote email. All prices are placeholders — replace with real
costs.

The configured spec is shared across the page via a React context
(`components/BuildProvider.tsx`) so the quote form can attach the exact build.

## Quote form & email

`app/api/quote/route.ts` accepts the lead + configured spec and emails it via
Resend. It includes a honeypot field and recomputes the total server-side.

Set these env vars (see `.env.example`) in Vercel to receive emails:

- `RESEND_API_KEY`
- `QUOTE_TO_EMAIL`
- `QUOTE_FROM_EMAIL`

**If they're missing, the API still returns success and logs the lead to the
server console** — so the form works in any environment.

## Images

`public/images/hero-defender.jpg` and `public/images/cart-front.jpg`. Replace
those two files (same names) to swap photography. See `public/images/README.md`.

## Docs

Business + launch documentation lives in [`docs/`](./docs).

## Deploy

Connected to Vercel; pushing to `main` auto-deploys.
