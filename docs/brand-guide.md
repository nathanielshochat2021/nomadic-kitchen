# Brand Guide

## Essence

**Nomadic Kitchen** — a hand-built, wood-clad outdoor kitchen cart that follows
you outside. Premium, editorial, mobile-first. Warm craft meets the open road.

Not a camper. Not a food truck. A real kitchen, built by hand, made to go.

## Voice & tone

- **Confident, not loud.** Let the craft and photography carry the premium.
- **Plainspoken.** Short sentences. Concrete nouns (wood, stainless, casters).
- **Warm.** Invitational — "build yours," "let's build your kitchen."
- **Honest.** Made-to-order and deposits framed as features, never apologized for.

**Do:** "Hand-built in solid wood." **Don't:** "Revolutionary cooking solution."

## Color palette

Defined as Tailwind v4 `@theme` tokens in `app/globals.css`.

| Token | Hex | Use |
| --- | --- | --- |
| `canvas` | `#f4efe6` | Page background (warm paper) |
| `paper` | `#fbf9f4` | Cards, light surfaces |
| `ink` | `#1b1915` | Primary text |
| `charcoal` | `#2a2620` | Secondary text / hovers |
| `stone` | `#6c6358` | Body copy, muted |
| `mist` | `#9a9286` | Captions, hints |
| `line` | `#e2dacc` | Borders, rules |
| `wood` | `#b07a4a` | Primary accent (warm wood) |
| `wood-deep` | `#8a5c34` | Accent text, prices |
| `forest` | `#39433a` | Deep section (How it works) |
| `forest-deep` | `#2a322b` | Footer, deepest ground |

## Typography

- **Display / headlines:** **Fraunces** (`--font-fraunces`) — editorial serif
  with character.
- **Body / UI:** **Inter** (`--font-inter`) — clean, legible sans.
- Loaded via `next/font/google` in `app/layout.tsx`.

Scale: large, confident headlines; generous line-height on body; uppercase
letter-spaced eyebrows (`tracking-[0.2em]`) for section labels.

## Photography

- **Real, in-the-field.** Natural light, real settings (barn, patio, trail).
- **Warm and grounded** — earthy greens, wood tones, soft shadows.
- Hero is full-bleed with a legibility gradient; gallery favors close craft
  detail.
- Always landscape, high-res; replace `public/images/*` to update.

## Logo lockup

Wordmark "Nomadic Kitchen" in Fraunces, preceded by a small wood-colored dot.
Keep clear space; never stretch.

## Layout principles

- Mobile-first; generous whitespace; thin hairline rules (`line`).
- Rounded-2xl cards on warm paper.
- One accent (`wood`) for emphasis — used sparingly.
