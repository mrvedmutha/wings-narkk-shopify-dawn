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
| 14 | 2026-06-12 | Philosophy | Text Rich — Heading | Changed to sentence case: set `uppercase: false` in JSON and added `text-transform: none` to base CSS rule to override global `h1–h6` uppercase | `templates/page.page-philosophy.json`, `assets/narkk-pages-text-rich.css` |
| 15 | 2026-06-12 | Philosophy | Founder Letter — Heading | Changed to title case ("A Letter from Our Founder"): set `uppercase: false` in JSON and added `text-transform: none` to base CSS rule | `templates/page.page-philosophy.json`, `assets/narkk-pages-founder-letter.css` |
| 16 | 2026-06-12 | Philosophy | Mission Statement — Background | Replaced background image with solid teal (`#9db8ba`) by making `__bg` div conditional on `bg_image` being set and clearing the image from JSON | `sections/narkk-pages-mission.liquid`, `templates/page.page-philosophy.json` |
| 17 | 2026-06-12 | Philosophy | Mission Statement — Heading | Changed to sentence case by replacing `text-transform: uppercase` with `text-transform: none` on `.narkk-mission__heading` | `assets/narkk-pages-mission.css` |
| 18 | 2026-06-12 | Philosophy | Re-Manifesto — Left heading | Changed to sentence case (`text-transform: none` on `.narkk-re-manifesto__heading`) | `assets/narkk-pages-re-manifesto.css` |
| 19 | 2026-06-12 | Philosophy | Re-Manifesto — Narrow desktop (1025–1350px) | Scaled down card dimensions (30/28rem wide, 46rem tall), tighter padding, smaller font sizes to prevent cramped layout | `assets/narkk-pages-re-manifesto.css` |
| 20 | 2026-06-12 | Philosophy | Re-Manifesto — Small viewport height (≤780px) | Added height breakpoint: section uses `100dvh`, left panel `align-self: flex-end` with bottom padding to clear sticky header, cards bottom-aligned with `dvh`-relative image heights | `assets/narkk-pages-re-manifesto.css` |
| 21 | 2026-06-12 | Trade | Text Rich — Heading | Changed to sentence case (`uppercase: false` in JSON; `text-transform: none` already in CSS from philosophy fix) | `templates/page.page-trade.json` |
| 22 | 2026-06-12 | Trade | Text Rich — Line height | Increased line-height clamp from `(3.2rem, 6.2vw, 6.5rem)` to `(3.8rem, 6.8vw, 7.1rem)` to prevent "g" descender clipping during split-text animation | `assets/narkk-pages-text-rich.css` |
| 23 | 2026-06-12 | Trade | Join Program CTA — Button width | Added `min-width: 30.9rem` to `[data-program-cta] .button` so the CTA button is consistently wide | `assets/narkk-pages-program-img-cta.css` |
| 24 | 2026-06-12 | Trade | What You Get — Section heading | Changed to title case by removing `text-transform: uppercase` (heading stored as "What You Get" already) | `assets/narkk-pages-what-you-get.css` |
| 25 | 2026-06-12 | Trade | What You Get — Card headings | Changed to sentence case by removing `text-transform: uppercase` from `.narkk-what-you-get__card-heading` | `assets/narkk-pages-what-you-get.css` |
| 26 | 2026-06-12 | All (Image Banner) | Hero Heading — Font size setting | Added `font_size` number input to heading block schema; outputs `--ibanner-heading-fs` CSS variable so the desktop heading size is editable from the theme editor (overrides the S/M/L preset) | `sections/narkk-image-banner.liquid`, `assets/narkk-image-banner.css` |
| 27 | 2026-06-12 | All (Image Banner) | Hero Heading — Responsive | Added `≤768px` breakpoint with tighter clamp values; updated `≤480px` breakpoint to include heading sizes — heading no longer overshoots on mobile viewports | `assets/narkk-image-banner.css` |
