# Domaine Product Card Assessment

## Project Overview

This repository contains a custom Shopify theme implementation for the Domaine take-home assessment. The work adds a reusable product card component built from scratch with Liquid, TailwindCSS, and lightweight JavaScript inside the existing Shopify Skeleton Theme.

The demo card is configured for the product handle `classic-cotton-tee` and can also be pointed at another product through the Shopify Theme Editor.

## Live Prototype Placeholder

Add the final Shopify preview link here after pushing the theme:

`TODO: Shopify preview URL`

## GitHub Repository Placeholder

Add the submitted repository URL here:

`TODO: GitHub repository URL`

## Tech Stack

- Shopify Skeleton Theme
- Shopify Liquid and JSON templates
- TailwindCSS CLI
- Vanilla JavaScript
- Shopify CLI and Theme Check

## Implemented Requirements

- Sale badge based on variant-level `compare_at_price > price`
- Current price and compare-at markdown price
- Product title, vendor, and price row
- Color swatches generated from the product color option
- Swatch click updates image, hover image, price, compare-at price, sale badge, and active state
- Desktop hover image transition for the selected variant/color
- Product picker in the demo section
- Fallback product handle: `classic-cotton-tee`
- Accessible swatch buttons with labels, `aria-pressed`, keyboard focus states, and no empty controls
- Responsive card layout with stable image aspect ratio

## Local Setup Instructions

Install dependencies:

```bash
npm install
```

Build Tailwind:

```bash
npm run build:css
```

Run Tailwind in watch mode while editing:

```bash
npm run dev:css
```

Run Theme Check:

```bash
npm run check
```

## Shopify Preview Instructions

Start the local Shopify theme server:

```bash
npm run dev:shopify
```

Or run the equivalent command directly:

```bash
shopify theme dev --store domain-take-home-challenge.myshopify.com
```

Demo product:

`https://domain-take-home-challenge.myshopify.com/products/classic-cotton-tee`

Demo page template:

1. In Shopify Admin, create or open a page for the assessment.
2. Assign the page template `page.domaine-assessment`.
3. Open the page preview from the theme preview URL.
4. In the Theme Editor, select the Domaine product card demo section and optionally choose a product.

For a shareable prototype link, push an unpublished theme:

```bash
shopify theme push --unpublished
```

Then open Shopify Admin > Online Store > Themes and copy the preview link for the unpublished theme.

## Technical Decisions

The product card is a snippet because it is the reusable unit. It can be rendered from a demo section now and reused later in grids, recommendations, featured product modules, or collection templates.

The demo is a section because Shopify merchants can configure it in the Theme Editor. The section exposes a product picker and falls back to `all_products['classic-cotton-tee']` when no product is selected.

Tailwind is compiled into `assets/domaine.css` and loaded globally from `layout/theme.liquid`. The component still keeps a `domaine-scope` class around the new UI so the new styling stays easy to identify and maintain.

JavaScript is intentionally small and presentation-focused. Liquid renders the product data and per-swatch metadata; JavaScript only switches the active swatch, images, prices, and sale visibility.

## Product, Variant, And Image Logic

Initial variant selection uses `product.selected_or_first_available_variant`, with the product featured media as the image fallback.

Swatches are generated from the first product option whose name contains `color` or `colour`. Each color swatch uses the first matching available variant where possible, then falls back to the first variant with that color.

Primary imagery prefers the selected variant featured media. If the variant does not have featured media, the card uses the product featured media or featured image.

Secondary hover imagery first looks for another product image whose alt text contains the selected color value. If no color-matched secondary image exists, it falls back to the first different product image. If there is no second image, it uses the primary image so the card never renders a broken hover image.

Sale pricing is variant-specific. A variant is treated as on sale when `compare_at_price` is greater than `price`; otherwise the sale badge and compare-at price are hidden.

## QA Checklist

- [x] Tailwind builds into `assets/domaine.css`
- [x] Shopify Theme Check passes
- [ ] Product card matches the intended premium ecommerce direction in browser
- [ ] Product title is visible
- [ ] Brand/vendor is visible
- [ ] Price is visible
- [ ] Compare-at price is visible for sale variants
- [ ] Sale badge appears only for sale variants
- [ ] Swatches are clickable
- [ ] Active swatch state is visible
- [ ] Primary image changes after swatch click
- [ ] Secondary image appears on desktop hover
- [ ] Secondary image matches selected color when Shopify image alt text supports it
- [ ] Mobile layout looks good without relying on hover
- [ ] Browser console has no JavaScript errors
- [ ] Working Shopify preview link opens

## Known Limitations

- Secondary hover image matching depends on Shopify product media quality. For best results, image alt text should include the color value, for example `Classic Cotton Tee - Navy - alternate`.
- Swatch colors use the option value as a CSS color when possible. Values like `Black`, `White`, `Navy`, or `Red` work directly. More branded color names may need a future color-map setting or metafield.
- The component updates the card presentation only. It does not add cart behavior or update the product URL query parameter because those were outside the product-card assignment scope.

## Future Improvements

- Add a swatch color metafield or theme setting map for non-CSS color names.
- Add optional quick-add behavior.
- Add unit-level JavaScript tests for variant switching.
- Extend the snippet to support collection-grid density variants.
- Add richer image matching if product media alt text follows a stricter naming convention.
