# Image presentation rules

Origin: research 2026-09-23, sources in specialist-skills/research/web-designer.md.

## Treatments
- **Full-bleed:** edge-to-edge, no border/card; one hero/narrative moment per section. Apple iPhone product pages.
- **Framed:** bordered card, caption underneath; browsing/comparison indices. Snøhetta project index.
- **Contact-sheet grid:** uniform grid of small framed cards, one caption line each; many-item portfolios. BIG.
- **Editorial overlap:** headline text absolute-positioned ON the photo, poster style; hero moments only. Dishoom.
- **Gallery/carousel:** sliding image/video set; needs visible, labelled Play/Pause + Previous/Next controls. Glossier.
- **Lightbox:** click-to-enlarge overlay from a grid item; editorial/photo-dense indices where detail matters.

Never blend treatments in one moment — a full-bleed hero photo doubling as a comparison-grid tile reads as unplanned.

## Crops and ratios
- At most two aspect ratios sitewide (one landscape, one portrait — e.g. 16:9 + 3:4, Aman). Never let native photo proportions drive card height.
- Crop with `object-fit: cover` + `object-position` to nudge focal point without re-exporting.
- Recompose the SAME source photo per breakpoint via CDN `rect=`/transform params, or `<picture>` art direction only when the CROP itself must change:
```html
<picture>
  <source media="(width < 800px)" srcset="portrait-close-480w.jpg">
  <source media="(width >= 800px)" srcset="wide-environment-1600w.jpg">
  <img src="wide-environment-1600w.jpg" alt="…">
</picture>
```
- Never combine `media` and `sizes` on the same `<source>`.

## Engineering
- `srcset` width descriptors + `sizes` (a real length or `vw`, never a percentage): 3-5 variants for a normal image, up to 1600-2000w for a full-bleed hero.
- Fixed-display-size images (avatars): x-descriptors instead (`1x, 2x, 3x`), no `sizes`.
- Serve AVIF → WebP → JPEG via `<picture type=…>` sources, or a CDN's `f=auto`/`auto=format` param — the CDN param is what every real site studied actually used.
- Reserve the layout box before bytes arrive: explicit `width`/`height`, or CSS `aspect-ratio` (no effect unless width or height is `auto`). Target CLS ≤0.1; treat >0.25 as build-blocking.
- Exactly ONE `fetchpriority="high"` per page, on the real LCP image; never `loading="lazy"` it. If it's a CSS `background-image`, add `<link rel="preload" fetchpriority="high" as="image" href="…">` in `<head>`.
- `loading="lazy"` only below the fold — browsers prefetch ~1250-2500px ahead, so this rarely shows a gap.
- LQIP: genuine blurred low-res swap only when the photo's own colour/shape IS the payoff (fashion, food) — Arc'teryx `w=20&blur=10&q=20`. Otherwise a solid-colour/SVG placeholder sized to the real intrinsic box — Aman, Snøhetta.
- Pin an explicit colour-space param (`cs=srgb`) so hue doesn't shift on wide-gamut displays — Glossier.

## Captions and grading
- Caption = one small, consistent typographic voice (small-caps or small regular), same position every time (directly under, left-aligned) — Dishoom, Snøhetta. Never vary size/position card to card.
- Decide per template: hero mode (text ON photo, needs a scrim/contrast check) or feed mode (text BELOW photo, photo stays pure) — It's Nice That splits these deliberately. Never let a caption-weight byline float on top of a photo the way a hero headline does.
- Apply one consistent colour grade across every photo in a set, even mixed sources — Dishoom, BIG.

## What looks generated — refuse
1. Inconsistent crop ratios mixed in the SAME grid (every third card a different height) instead of a stated two-ratio rule.
2. Stock photography standing in for the real product/work when a live demo, screenshot, or real photo is possible — Bruno Simon replaces photography entirely with the real interactive scene.
3. An autoplaying carousel or looping hero video with no pause control — icon-only chevrons, no labelled Play/Pause, fails WCAG 2.2.2.
4. A caption-weight byline floating on top of a photo outside a hero moment — reads as a mistake, not a choice.
5. No reserved image box (missing width/height/aspect-ratio), producing visible layout jump as photos load.
