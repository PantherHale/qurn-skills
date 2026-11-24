# Style recipes

Operator, 2026-09-23: styles named in a goal (minimalism, maximalism, skeuomorphism, glassmorphism...) were named by the
web designer and then ignored by the build. A style is now a contract:

1. The design foundation writes ONE line near the top of `docs/design/DESIGN.md`: `Style: <name>` (at most two, e.g.
   `Style: glassmorphism + bento`). A style the operator named in the goal wins over any other choice.
2. The tokens table carries that style's tokens below, and the build uses them.
3. The board's `style-fidelity` tester scans the source (CSS and class strings, Tailwind included) for the style's
   signals. A missing required signal is a MAJOR finding; leaning on an avoided effect or skipping the accessibility
   fallback is minor. The signals live in `scripts/style-signals.mjs`.

Pick the style from the brief, not from habit. Every style still obeys the playbook: measured contrast, no horizontal
scroll, tokens only, reduced motion respected.

## Minimalism
- **Look:** few elements, a small palette, lots of space; type does the work.
- **Tokens:** 1 ground, 1 surface, 1 ink, 1 accent, 2 greys; spacing scale reaching 6-10rem between sections; one type family or a sans + mono pair.
- **CSS it needs:** section padding of 6rem or more; hairline 1px dividers instead of shadows.
- **Avoid:** a wide palette (14+ colours), gradients, stacked shadows, blend modes, texture.
- **Accessibility:** low-contrast greys are the classic failure: body text 4.5:1, UI boundaries 3:1.
- **Fits:** premium products, portfolios, tools. **Does not fit:** playful kids' brands, festivals.

## Maximalism
- **Look:** dense and loud: many colours, huge type, pattern, collage, blend modes.
- **Tokens:** 14+ colour tokens with named jobs; display type 4rem+ (clamp to 9rem); a pattern or texture asset.
- **CSS it needs:** display type, and at least one of gradient, texture image or `mix-blend-mode`.
- **Avoid:** randomness: every colour still has a role; the grid still holds.
- **Accessibility:** text over pattern needs a solid plate behind it; check contrast on every colour pair used for text.
- **Fits:** fashion, music, events, editorial. **Does not fit:** dashboards, forms-heavy apps.

## Skeuomorphism
- **Look:** real materials: bevels, gradients, inner highlights, textures (leather, wood, metal, paper).
- **Tokens:** material gradients (top light, bottom shade), a highlight white, a shadow stack (contact, key, ambient).
- **CSS it needs:** a gradient; an inset top highlight (`inset 0 1px 0 rgba(255,255,255,.8)`) or inset shadow; a texture image or a 3-layer shadow.
- **Avoid:** mixing flat and skeuomorphic controls on one screen.
- **Accessibility:** controls must still look like controls with focus rings; textures must not sit under body text.
- **Fits:** instruments, music gear, games, nostalgic tools.

## Neumorphism (soft UI)
- **Look:** shapes extruded from one base colour by paired light and dark shadows.
- **Tokens:** one base colour; dark shadow (base darkened ~15%); light shadow (white ~50-70% alpha); radius 12-24px.
- **CSS it needs:** `box-shadow: 9px 9px 16px <dark>, -9px -9px 16px <light>`; `inset` pairs for pressed and input states.
- **Avoid:** thick borders, a wide palette.
- **Accessibility:** its known weakness is contrast: add a real border or accent to every control, keep text at 4.5:1, never signal state by shadow alone.
- **Fits:** small dashboards, calculators, smart-home panels. Use sparingly.

## Glassmorphism
- **Look:** frosted translucent panels floating over colour.
- **Tokens:** glass fill `rgba(255,255,255,.08-.2)` (or dark `rgba(10,20,40,.4)`), blur 12-24px, border `1px solid rgba(255,255,255,.2)`, a colourful backdrop (gradient mesh or photo).
- **CSS it needs:** `backdrop-filter: blur()` (plus `-webkit-backdrop-filter`), a translucent background, a light hairline border or top highlight.
- **Avoid:** hard offset shadows; glass over a flat white page (there is nothing to frost).
- **Accessibility:** provide `@supports not (backdrop-filter: blur(1px))` or `prefers-reduced-transparency` with an opaque fill; check text contrast against the busiest part of the backdrop.
- **Fits:** overlays, nav bars, cards over imagery, media apps.

## Liquid glass
- **Look:** Apple's 2025 material: glass that refracts, with saturation, a specular edge and depth.
- **Tokens:** blur 16-24px + `saturate(160-200%)`, translucent fill, inset top highlight, soft depth shadow; optional SVG `feDisplacementMap` for refraction.
- **CSS it needs:** backdrop blur, `saturate()` or a displacement filter, `inset 0 1px 0` white highlight, a translucent fill.
- **Avoid:** hard offset shadows; using it for content surfaces (it is for controls and navigation layered over content).
- **Accessibility:** same fallback as glassmorphism; respect reduced transparency.
- **Fits:** toolbars, docks, media controls.

## Warm ambient glass
- **Look:** a dark, warm ambient backdrop (amber/brown/coffee gradient, never neutral grey) with frosted glass panels floating on it; pastel, rounded cards sit on a near-white surface *inside* the glass shell, not on the ambient colour itself -- the warmth and the pastel never touch directly. A restrained flat-illustrated mascot (not a photo, not a 3D render) is the one expressive element; everything else stays calm.
- **Tokens:** ambient backdrop as a warm radial/linear gradient (e.g. `#3a2317` to `#6b4226`, or brand-equivalent browns/ambers); glass fill `rgba(255,255,255,.06-.12)` with blur 16-20px for chrome (sidebar, search bar, nav); an inner "paper" surface near-white (`#fdfbf8`-ish) that holds content cards; 3-5 pastel tints (one per card/category, e.g. soft lavender, mint, peach, sky) each used as a full card background, not an accent; one saturated gradient (purple-to-violet or brand-equivalent) reserved for exactly one hero/featured card.
- **CSS it needs:** `backdrop-filter: blur(16-20px)` + translucent fill on the outer chrome only; `border-radius` large and consistent everywhere -- 20-28px on cards and the search bar, fully pill (`border-radius: 999px` / `9999px`) on buttons, tags and small icon badges; a light hairline border (`1px solid rgba(255,255,255,.15-.25)`) on glass chrome, not on the pastel cards (they're flat, no border needed since the near-white surface already separates them from the backdrop).
- **Typography and hierarchy:** one bold, large (2-2.5rem+) headline on the hero card only, everything else small and regular-weight -- the whole surface reads as low-text-density; section labels (e.g. a category name) are small, medium-weight, and paired with a single-line description under 8 words; no paragraph-length copy anywhere on this kind of surface.
- **Spacing and density:** generous gaps between cards (1-1.5rem) despite small individual card size -- density comes from many small cards, not tight packing; each card's internal padding stays roomy (1-1.5rem) so the rounded corners read as soft, not cramped.
- **Iconography and mascot:** one flat, simple, rounded-shape illustrated mascot used sparingly (hero + maybe one small corner callout, never repeated across every card); functional icons stay small, single-colour or duotone, inside circular pastel badges, never competing with the mascot for attention.
- **Avoid:** putting the ambient warm colour directly behind body text (contrast fails); hard offset drop shadows (this style floats on blur and soft colour, not shadow); more than one saturated gradient card per screen (it stops being "restrained" past that); a mascot rendered in a different style register (3D/photoreal) than the flat UI around it.
- **Accessibility:** verify body text inside each pastel card against that card's own background, not the ambient backdrop; provide the glassmorphism blur fallback (`@supports not (backdrop-filter: blur(1px))` / `prefers-reduced-transparency`) for the outer chrome; pill buttons need a visible focus ring since their shape alone doesn't signal interactivity as clearly as a rectangular one.
- **Fits:** consumer utility apps with a friendly/approachable brief (translation, voice, companion, wellness, kids' tools) that still need to look premium and calm rather than playful-loud. **Does not fit:** dense data tools, enterprise dashboards, anything that needs to read as serious/corporate.
- **Signals it reuses (scripts/style-signals.mjs):** `backdrop-blur`, `translucent-surface`, `hairline-light-border` on the outer chrome, same as Glassmorphism above -- this is a themed, warmer variant of glassmorphism, not a new signal set.

## Claymorphism
- **Look:** puffy, friendly 3D clay shapes.
- **Tokens:** radius 32px minimum (scale up for larger elements); outer shadow `8px 8px 16px rgba(0,0,0,.25)`; inset dark `-8px -8px 12px rgba(0,0,0,.25)`; inset light `8px 8px 12px rgba(255,255,255,.4)`; pastel-but-not-pink fills.
- **CSS it needs:** large radius, inset shadow, and an outer shadow paired with an opposite inset (or a soft large shadow).
- **Avoid:** square corners, hard offset shadows.
- **Accessibility:** pastel fills need dark text; check 4.5:1 against every pastel fill used, not just the darkest.
- **Fits:** onboarding, kids and education, playful apps.

## Brutalism / neo-brutalism
- **Look:** raw and loud: thick black borders, hard shadows, square corners, bold flat colour.
- **Tokens:** border 2-4px solid black; shadow `6px 6px 0 #000` (classic) or `6px 6px 0 <saturated-accent>` (neo — a solid non-black colour is still a valid hard shadow, the "neo" difference from classic black-only brutalism); radius 0 (or a single small value); 2-3 saturated flat colours; 24-32px whitespace margins so the loud palette doesn't read as chaotic; a grotesk or mono font.
- **CSS it needs:** thick solid borders; a hard offset shadow with zero blur or square corners.
- **Avoid:** soft blurred shadows, glass blur.
- **Accessibility:** the loudness must not hide focus: signal interactivity with an underline or colour shift distinct from the decorative hard shadow, and keep a visible focus style.
- **Fits:** indie tools, portfolios, zines, developer products.

## Flat
- **Look:** solid colour fills, no depth effects.
- **Tokens:** solid palette, small radius, spacing does the separating.
- **CSS it needs:** nothing special; it is judged by what it avoids.
- **Avoid (from 2 uses):** gradients, blurs, soft or stacked shadows, textures.
- **Accessibility:** without shadows, buttons need a clear shape and label; check 3:1 for control boundaries.

## Bento grid
- **Look:** a grid of rounded tiles of mixed sizes, one idea per tile.
- **Tokens:** gap 12-24px, radius 16-28px, tile surfaces from the palette.
- **CSS it needs:** CSS grid with tiles spanning 2 tracks (`grid-column: span 2`, `col-span-2` or `grid-template-areas`); rounded tiles.
- **Avoid:** every tile the same size (that is just a card grid).
- **Accessibility:** reading order in the DOM must match the visual order; collapse to one column at 390px.

## Spatial UI
- **Look:** layers in depth: perspective, z-translation, blur and deep shadows (visionOS-like).
- **Tokens:** perspective 800-1600px; z steps; depth shadows `0 30px 60px`; glass for near layers.
- **CSS it needs:** `perspective` / `translateZ` / `preserve-3d` (or a three.js scene); blur or deep shadows separating planes.
- **Avoid:** depth that moves for no reason.
- **Accessibility:** flatten under `prefers-reduced-motion`; keep text as real DOM.

## Swiss / international typographic
- **Look:** a strict grid, big tight sans type, asymmetry, flush-left text, no ornament.
- **Tokens:** 12-column grid; display type 4-9rem with negative tracking; one sans family; black, white, one signal colour.
- **CSS it needs:** CSS grid; display type.
- **Avoid:** gradients, textures, soft shadows, large radii.
- **Accessibility:** large type must reflow at 400% zoom; check the signal colour's contrast.
