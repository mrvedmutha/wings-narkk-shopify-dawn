# Narkk Theme — Client Feedback Changelog

> Log of all feedback-driven changes. Each entry has a date, the page/component affected, what was changed, and the files touched.

---

## Format

| # | Date | Page | Component | Change | Files |
|---|------|------|-----------|--------|-------|
| ... | ... | ... | ... | ... | ... |

---

## Changes

| # | Date | Page | Component | Change | Files |
|---|------|------|-----------|--------|-------|
| 1 | 2026-06-12 | All pages | Header | Contact link on right nav is settings-driven (not hardcoded) — URL set via theme editor under Header → Contact page URL | `sections/narkk-header.liquid` |
| 2 | 2026-06-12 | All pages | Body / Header | Set page background to beige (`#f9f4f0`) so the header nav wrapper margin gap no longer shows white. Done via `body.gradient` override to avoid Dawn's white gradient default | `assets/narkk-brand.css` |
| 3 | 2026-06-12 | Homepage | Product Collage — Heading | Changed heading from uppercase to sentence case by removing `text-transform: uppercase` on `.narkk-collage__heading` | `assets/narkk-homepage-product-collage.css` |
| 4 | 2026-06-12 | Homepage | Featured Products — Heading | Changed section heading to title case (`text-transform: capitalize`) | `assets/narkk-homepage-featured-products.css` |
| 5 | 2026-06-12 | Homepage | Featured Products — Vendor | Added `text-transform: uppercase` to `.narkk-pcard__vendor` | `assets/narkk-homepage-featured-products.css` |
| 6 | 2026-06-12 | Homepage | Featured Products — Title | Added `text-transform: capitalize` to `.narkk-pcard__title` | `assets/narkk-homepage-featured-products.css` |
| 7 | 2026-06-12 | Homepage | Collections — Captions | Swapped captions between THOGAI ("Modular sofa and it's accessories.") and TULAI ("pegboard and accessories.") which were entered incorrectly | `templates/index.json` |
| 8 | 2026-06-12 | Homepage | Collections — Heading | Changed heading text to "Narkk Collections" in JSON and removed `text-transform: uppercase` from CSS | `templates/index.json`, `assets/narkk-homepage-collections.css` |
| 9 | 2026-06-12 | Homepage | Manifesto — Logo & Circle | Changed logo SVG fills/strokes and circle stroke from orange (`#BE5832`) to teal/aqua (`#9db8ba` — `--narkk-teal`). Eyebrow "The Re-Manifesto" stays orange | `assets/narkk-chair-logo-primary.svg`, `sections/narkk-homepage-manifesto.liquid`, `assets/narkk-homepage-manifesto.css` |
| 10 | 2026-06-12 | Homepage | Starter Bundle — Heading | Removed `text-transform: uppercase` from `.narkk-bundle__heading` — "Starter Bundle" now renders in title case | `assets/narkk-homepage-starter-bundle.css` |
| 11 | 2026-06-12 | Homepage | Loop Circle CTA — Animation | Fixed CTA button not appearing on some devices: lowered IntersectionObserver threshold from 0.1 → 0, added fallback timeout to force all animated elements visible if the observer never fires | `assets/narkk-homepage-community-cta.js` |
| 12 | 2026-06-12 | Homepage | Product Launch — Heading | Changed heading to title case in JSON and removed `text-transform: uppercase` from CSS | `templates/index.json`, `assets/narkk-homepage-product-launch.css` |
| 13 | 2026-06-12 | Homepage | Featured Products & Starter Bundle | Hidden both sections by removing from the `order` array in JSON (data preserved, not deleted) | `templates/index.json` |
