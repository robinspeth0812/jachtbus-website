# Jachtbus website

Static website for the Jachtbus foodtruck (Drenthe, Groningen,
Friesland), built with [Astro](https://astro.build) and the Lumos
framework conventions by Timothy Ricks. Visual editing via Stacki.

See `CLAUDE.md` for all project conventions (stack, Lumos rules, design
tokens, accessibility requirements, tone of voice).

## Commands

| Command | Action |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the dev server |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run check` | Type-check the project |

## Deployment

Pushes to `main` build and deploy to Bunny via
`.github/workflows/deploy.yml`. All Bunny-specific logic lives in that
workflow only.
