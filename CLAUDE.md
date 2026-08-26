# CLAUDE.md — Jachtbus website

## Project

Static website for Jachtbus, built with Astro and the Lumos framework by
Timothy Ricks. The site will later be edited visually with Stacki, so
components must be written in a way Stacki can turn into settings.

## Project facts

- **Domain**: `https://jachtbusfoodtruck.nl` (set as `site` in the
  Astro config — canonical URLs and sitemap derive from it).
- **Face of the brand**: Peer Wagenaar ("Peer" on the site).
- **Images**: placeholders for now; the owner supplies optimized photos
  later. Build components so swapping a placeholder for a real photo
  never changes the component API.
- **Reviews**: will be collected on Google — none exist yet. **Never
  show invented scores or counts.** The "4,9 uit 27" in the blueprints
  is aspirational; omit trust numbers until real ones exist (tone rule:
  no superlatives without proof).
- **Request form**: mail via **Resend**. Resend needs a server-side
  secret, so the form posts to a small endpoint outside the site code
  (edge function — infra, like the Bunny rule). Until that endpoint
  exists, the form UI is built but wired to an endpoint URL from an
  env var; no Resend key ever appears in this repo.

- **Legal entity** (from KvK, supplied 2026-08-26): Jachtbus Foodtruck
  & Catering B.V., KVK 96772174, Julianalaan 54, 9462 PH Gasselte.
  The site must **not** say "onderdeel van Brasserie Jachtlust" any
  more; the Jachtbus is being split off. The old Steenbergen address
  from the old site is superseded.

## Content reference (old site)

The Jachtbus previously lived as one page on the Brasserie Jachtlust
site: <https://www.brasseriejachtlust.nl/jachtbus-foodtruck>. Facts
from that page (verify before reusing — the new site may supersede
them):

- Regions: Drenthe, Groningen, Friesland. Named places: Groningen,
  Assen, Leeuwarden, Rolde, Emmen, Meppel, Drachten, Hoogeveen.
- Offer: walking dinner (7 seasonal courses, min. 30 people), wedding
  packages (incl. staff, styling, planning help), corporate events,
  BBQ smoker (meats, salads, house-made sauces). Pricing on request.
- Location requirements: 6.5 × 2.5 m space, firm level ground (grass or
  gravel OK), accessible for a 3.5-ton vehicle, 230V/16A within 25 m.
- Contact: +31 592 656363, info@brasseriejachtlust.nl, Hoofdweg 22,
  9307 PB Steenbergen.
- Page-layout blueprints (home, catering, wedding) exist as PDF
  sketches ("Roth '21") — ask the owner if they're not at hand.

## Stack

- **Astro**, fully static output (`output: 'static'`) — no SSR, no islands
  unless explicitly decided.
- **TypeScript strict** (`"strict": true`), also in `.astro` frontmatter.
- **Lumos framework** for class naming and component structure (see
  Lumos conventions below).
- **Vanilla CSS with custom properties** for all styling.
- **No Tailwind. No UI framework** (no React/Vue/Svelte component
  libraries, no shadcn, no daisyUI, etc.).

## Site structure

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/catering` | Catering overview |
| `/catering/bruiloft` | Wedding |
| `/catering/bedrijfsfeest` | Company party |
| `/catering/evenement` | Event |
| `/catering/bbq-smoker` | BBQ smoker |
| `/referenties` | References |
| `/over-ons` | About |
| `/contact` | Contact |
| `/aanvraag` | Request form as its own page |
| `/privacy`, `/voorwaarden`, `/cookies` | Legal |

**Location pages are shallow** — at the root, *not* nested under
`/catering`:

- `/foodtruck-huren-assen`
- `/bruiloftscatering-drenthe`
- `/foodtruck-bedrijfsfeest-groningen`
- `/bbq-catering-friesland`
- `/foodtruck-huren-roden`

The final set of location pages follows from keyword research — treat
the list above as provisional examples, not a fixed set. For that
research and other SEO work, use the **claude-seo plugin**
([AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo))
if it is installed (`/plugin marketplace add AgriciDaniel/claude-seo`).

## Lumos conventions

The full Lumos reference lives in
`.claude/skills/lumos-skill/SKILL.md` (from
[lumosframework/skill](https://github.com/lumosframework/skill)) and is
**the authority** on class naming, structure, layout, theming,
responsive behavior, and the trigger/state system. Read it before
writing any markup or CSS. Summary of the core rules:

### Class naming

- Component class first, then utilities:
  `<h2 class="hero_title u-text-style-h2">`.
- Underscores separate parts: `[component]_[type]_[element]`, broadest
  first (`card_testimonial_title`). Max 3 underscores; deeper nesting
  starts a new subcomponent.
- `_wrap` marks a component or subcomponent root; any element with
  component-classed children ends in `_wrap`.
- Preferred names: `_title` (not `_heading`), `_text` (not
  `_paragraph`), `_img` (not `_image`).
- Hyphens only inside multi-word parts: `tabs_link_wrap`.
- Utilities: `u-` prefix. State/combo classes: `.is-active`, `.is-1`,
  `.is-reversed` — always scoped (`.hero_card_wrap.is-reversed`), never
  bare.
- Every element gets a component class — no bare tags with only a
  utility class.

### Structure

Every section follows the wrap → contain → layout skeleton:

```html
<section class="[name]_wrap u-section">
  <div class="[name]_contain u-container">
    <div class="[name]_layout">...</div>
  </div>
</section>
```

- Never put layout (grid/flex) on `u-container` — always on the child
  `_layout` div.
- Class-only selectors: no tag names, IDs, or descendant selectors.
- No `px` — `rem` for sizes, `ch` for text max-widths, `em` for
  container query breakpoints.
- No `@media` — use Lumos responsive variables
  (`var(--flex-medium, grid)` etc.); `@container` only when variables
  can't express the change.
- Hover/focus via the trigger system (`data-trigger`,
  `--_trigger---on/off`), state via `--_state---true/false` — never
  `:hover` or `.is-active` selectors in CSS.
- Colors only via `--_theme---*` variables; themes (`u-theme-light`,
  `u-theme-dark`, `u-theme-brand`) switch them per section.

### Component vs. class

**The rule is reusability.** Something becomes an Astro component when
it will be used in more than one place (across pages or repeated within
a page): buttons, cards, section headers, the request form, nav,
footer. A one-off section stays inline in the page as Lumos-classed
markup. Utilities are always classes, never components.

### Astro adaptations

The skill targets Webflow; in this Astro project these rules differ:

- CSS lives in the `.astro` component's `<style>` block (Astro-scoped),
  not in a `<style>` tag inside `_wrap`. Keep class-only selectors
  anyway.
- Webflow-only workarounds do **not** apply: no `padding: 0` on empty
  divs, no `_hidden` placeholder divs to survive class purging (Astro
  doesn't purge), no `.w--current`/`.w--open` states.
- The Lumos variable and utility layer (`u-*` classes, `--_theme---*`,
  `--_spacing---*`, `--_responsive---*`, trigger/state vars) is not
  provided by Webflow here — it is defined once in `src/styles/` and
  imported globally. That layer is the only place utilities are
  defined; components never redefine `u-*` classes.
- Component scripts follow Astro idiom (`<script>` in the component),
  but keep the Lumos JS rules: scope queries to the component root,
  target by class/data-attribute (never `id`), `.is-active` as the only
  toggle class, no `innerHTML`/`createElement` for visual structure.

## Components & props (Stacki compatibility)

Stacki generates its settings panels from component props, so every
component follows these rules:

- All props are **typed** via an exported/declared `Props` interface in
  the frontmatter.
- **Variants are union types**, never free-form strings:
  `variant?: 'primary' | 'secondary'`, not `variant?: string`.
- **Every optional prop has a default** in the destructuring:
  `const { variant = 'primary' } = Astro.props;`
- **Every prop has a docblock** directly above it describing what it
  does; Stacki uses this as the setting's description.

```astro
---
interface Props {
  /** Visual style of the button. */
  variant?: 'primary' | 'secondary';
  /** Text shown inside the button. */
  label?: string;
}
const { variant = 'primary', label = 'Lees meer' } = Astro.props;
---
```

## Design tokens

- All colors, spacing, sizes, radii, etc. live as CSS custom properties
  (tokens), defined once in `src/styles/` (the Lumos variable layer).
- **Never use hex codes or loose rem values outside the token
  definitions.** The token definition file is the *only* place a hex
  code may appear. Component CSS references `--_theme---*` and
  `--_spacing---*` variables only.
- Adding a new value means adding a token first, then using it.

### Color palette

| Scale | Values (light → dark) |
| --- | --- |
| Marigold (gold) | `#f8f3ea` `#f1e8d5` `#d0af6c` `#bc8e2d` `#8a6820` `#4b3812` `#382a0d` |
| Camarone (green) | `#e5ede8` `#ccdcd1` `#4c845f` `#00501b` `#004015` `#00200a` `#001808` |
| Neutral | `#ffffff` `#cccccc` `#666666` `#4c4c4c` |

Fixed assignments (do not deviate):

- `#00501b` is the **brand color**: background of dark (brand-themed)
  sections and the **focus ring** color.
- `#00200a` is the **main text color** (green-black, on-brand) — not
  pure black.
- `#8a6820` is the **button color on all themes** (white text on it)
  and the gold **text color on light backgrounds**. Deliberately
  adjusted from `#967124`, which hit only 4.48:1 with white — just
  under the WCAG 4.5:1 minimum. The visual difference is imperceptible;
  never "fix" it back.
- `#bc8e2d` is a **decorative gold accent only** — never a button
  color and **never with white text** (only ~2.9:1 contrast). Owner's
  decision 2026-08-26: one button gold site-wide with white text; on
  dark sections the hover state gets a light gold border (`#d0af6c`)
  so the button visibly reacts against the green.
- `#4c845f` is **too light for text** — decorative use only.
- `#f8f3ea` is the **background everywhere outside the green sections**
  (owner's decision 2026-08-27, confirmed twice); `#f1e8d5` is the
  foreground layer on it (cards, pills, badges). No white sections:
  `u-theme-soft` is identical to light and only kept for markup
  compatibility.

### Typography

- **Asap** for headings.
- **Open Sans** for body text.
- **Nothing You Could Do** for handwritten accents — sparingly (e.g.
  Peer's quotes), never for functional text.

## Accessibility — WCAG 2.2 AA (hard requirement)

- Exactly **one `h1` per page**; headings in order without skipping
  levels (`h2` → `h3`, never `h2` → `h4`).
- **Visible focus** on every interactive element — never remove outlines
  without an at-least-as-visible replacement.
- **Color is never the only signal** (add icons, text, or underlines).
- Interactive **target areas at least 44×44px**. Documented exception
  (owner's call, 2026-08-26): footer link lists use 2rem-high targets
  for tighter spacing, still above the WCAG 2.2 AA minimum of 24px.
- **Decorative icons get `aria-hidden="true"`** (and empty `alt` for
  decorative images).
- Respect **`prefers-reduced-motion`**: wrap non-essential animation and
  transitions in a `@media (prefers-reduced-motion: no-preference)`
  query or disable them under `reduce`.

## Images

- Always via **`astro:assets`** (`<Image />` / `<Picture />`) with
  sources in **`src/assets/`**.
- **Never put images in `public/`.**
- `alt` text is required (empty `alt=""` only for purely decorative
  images).

## Language & tone of voice

- **All visible text is Dutch and informal** (jij/jou, never u — also
  in form confirmations and error messages).
- **Code, comments, prop names, and commit messages are English.**

Tone: enthusiastic but not loud, down-to-earth Drents, spontaneous, an
occasional joke. Plain everyday speech, no stiff catering-brochure
language.

- **Active and short**: "wij regelen het", not "het wordt door ons
  verzorgd".
- **Exclamation marks sparingly** — at most one per section.
- **Headings may be questions.**
- **No superlatives without proof** (numbers, reviews, named events).
- **Banned phrases**: "culinaire beleving", "vrijblijvend informeren",
  "uw wensen inventariseren", and English marketing jargon in general.
- **Never use an em dash (—), anywhere** (owner's rule, 2026-08-26):
  not in site copy, not in code comments. Use a comma, colon, period,
  or parentheses instead.

## Deployment

- **No Bunny-specific code in the project itself** — no Bunny URLs, SDK
  calls, or config in `src/` or `astro.config.*`.
- Bunny specifics live **only in the deploy workflow** (CI/deploy
  scripts).
