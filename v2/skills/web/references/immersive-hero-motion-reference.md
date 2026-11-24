# Immersive hero and motion patterns — a technique library, not a skin to copy

Operator, 2026-10-18: "I want immersive landing pages, with correct colour composition, right to the style, no
simple AI slop, full custom. Also research motion prompt and hero prompts." Researched against the real "motion
prompt" / "hero prompt" libraries that sell exactly this (motionsites.ai's public prompt mirror, the AI-prompt
hero-section genre more broadly) plus 2026 landing-page trend coverage. These are concrete, numbered techniques
real builds ship with — treat every number below as a starting point to tune to THIS product, never as a template
to reproduce unchanged. **The CONCEPT METHOD in web-director.md still governs**: pick the technique whose mood
matches this product's MATERIAL/GESTURE/MOMENT, then substitute this product's own colours, type and copy. Reusing
a recipe's exact hex values, fonts AND wording together is the "reference's skin," which the anti-copy test bans.

## Why these read as "immersive" and a text/card page does not
Every real immersive hero combines at least three of these layers at once — a single layer (just a gradient, just
a fade-in) is what reads as slop. The layers, generalized from real specs:
1. **A moving or living background** (video, canvas/WebGL scene, or an animated gradient) — never a static photo alone.
2. **Depth via z-index layering and overlap** — content sits ON TOP of or BEHIND the moving layer, not beside it in its own box.
3. **A glass or light-catching surface** for floating UI (nav, badges, CTAs) so they read as part of the same lit world as the background, not a flat card dropped on it.
4. **A staged text entrance** (blur-in, word-stagger, a counter/loader ritual) instead of text simply being present on load.
5. **Ambient colour** — ONE accent gradient or a small set of glow blobs, used consistently across nav, buttons and background, never a rainbow of unrelated accents.

## Technique: layered video/canvas hero (the base of nearly every immersive hero seen)
- Stack, back to front: moving background (`z-0`) → a gradient/dark overlay for text contrast (`z-[1]`) → content (`z-10`) → fixed/floating nav (`z-50`). Never let content and the moving layer share a z-index — fighting layers is the #1 cause of a hero looking broken rather than deep.
- Video: `autoPlay muted loop playsInline`, `object-cover` (or `object-contain` with a fixed aspect when the footage must not crop), a `poster` image for the paint-before-decode frame, and `<link rel="preload" as="video">` in `<head>` for the hero's own clip only (this is the one exception to "preload is for resources HTML can't reveal in time" in web-designer-behavior.md — a hero video genuinely needs it). For adaptive streaming, HLS via `hls.js` with an MP4 `<video src>` fallback for browsers with native HLS (Safari) — don't reach for a heavy player library when a native `<video>` + `hls.js` hook does the job.
- Overlay recipes actually used: a flat low-opacity dark layer (`bg-black/5` to `bg-black/20`) when the footage is already graded, OR a bottom-anchored fade (`linear-gradient(to top, var(--bg) 0%, transparent 40%)`, roughly 150-300px tall) so the video dissolves into the next section instead of hard-cutting.
- When no real video/footage exists, this is exactly web-director.md's "no real photography available" case — substitute a live three.js/canvas scene in the same z-0 slot, tied to scroll the same way, rather than dropping to a static image.

## Technique: two-tier glass surface (for nav, badges, floating CTAs over a moving background)
A real, working recipe (not the approximated "liquid-glass.css" — label it as a web approximation of a physical material, per web-craft-doctrine-reference.md/anti-slop rules on borrowed systems):
```css
.glass {
  background: rgba(255,255,255,0.01);
  background-blend-mode: luminosity;
  backdrop-filter: blur(4px);
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
  position: relative; overflow: hidden;
}
.glass::before {
  content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1.4px;
  background: linear-gradient(180deg, rgba(255,255,255,.45) 0%, rgba(255,255,255,.15) 20%,
    rgba(255,255,255,0) 40%, rgba(255,255,255,0) 60%, rgba(255,255,255,.15) 80%, rgba(255,255,255,.45) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude; pointer-events: none;
}
```
A `.glass-strong` variant (heavier `blur(50px)`, stronger `box-shadow`, gradient-border alphas raised to `.5`/`.2`) is for the one or two elements that should read as the thickest glass in the scene (usually the primary CTA or a modal), never applied uniformly — mixing weights is what makes the glass feel like it has real thickness. The `::before` gradient-border trick (a padding-box mask with `mask-composite: exclude`) is the actual mechanism behind a light-catching rim; a plain `border: 1px solid rgba(255,255,255,.1)` does not read as glass.

## Technique: staged text entrance (word-stagger blur-in)
Split the headline into words; animate each with `motion.span` (or an equivalent) from `{filter: blur(10px), opacity: 0, y: 50}` through `{filter: blur(5px), opacity: .5, y: -5}` to `{filter: blur(0), opacity: 1, y: 0}`, triggered by `IntersectionObserver`, staggered ~80-120ms per word, total duration ~0.35s per word. This reads as considered; a plain `fade-in` on the whole headline at once is the generic default. Pair with a subhead that blur-fades in ~0.6-0.8s AFTER the headline starts (not simultaneously) so the eye has one thing to track at a time. An optional loader ritual (a counter `000 → 100` over ~2-3s, or 2-3 words cross-fading before the real headline appears) works as a deliberate first-moment device for a portfolio/agency mood — skip it for a utility/SaaS mood where speed-to-content matters more (ties to the MODE dial in web-craft-doctrine-reference.md: an entrance ritual belongs to Persuade/Experience, not Operate).

## Technique: ambient glow blobs (colour without a busy palette)
Large blurred colour shapes placed behind content, not patterns or textures: 2-3 blobs, 300-600px, `filter: blur(80px)`, `mix-blend-mode: screen`, `opacity: .5-.6`, in ONE accent colour family (not 3 different hues). This is how a single accent reads as atmosphere rather than a flat tinted rectangle — the blend mode and blur are what separate "glow" from "a circle." Combine with a very low-opacity (`0.06-0.1`), heavily blurred (`blur(4px)+`), oversized brand-word or mark in the far background for scale/depth, never legible, never competing with the real headline.

## Technique: a CSS-mask image break (depth without a photoshoot)
When a portrait/product photo needs to feel like it's breaking out of its rectangle and overlapping the headline (not sitting beside it in a card), apply a CSS `mask-image` with an irregular/brush-stroke shape instead of a straight crop, set the image `pointer-events-none`, and place it at a HIGHER z-index than the headline text so it visually overlaps — this is a deliberate overlap device, distinct from (and the opposite of) the "sticker cutout" failure in image-rules.md, which is an UNINTENTIONAL isolation from a mismatched background. The difference is intent and integration: a mask-break photo is staged to overlap and interact with type; a sticker cutout is a product photo accidentally floating alone on a flat card.

## Technique: scroll-pinned parallax gallery
For a secondary "gallery of work" or "explorations" section (not the hero): pin a heading/intro column (`ScrollTrigger.create({ pin: el, pinSpacing: false })`) while 2+ columns of items scroll past it at different rates (split items into 2+ columns, offset their scroll-driven `y` transform by different multipliers). This is T20/T13-class motion already named in references/scroll-craft.md — the specific addition here is using it for a GRID of items (not just one hero object), which is how a portfolio/work section stays alive without becoming another static grid.

## Technique: rotating word / cycling role text
A single word or short phrase cycles every ~2s (`AnimatePresence mode="wait"`, `y: 20 → 0 → -20`, opacity cross-fade) inside an otherwise static sentence ("A [Creative/Fullstack/Founder] lives in Chicago"). Cheap, reads as alive, and keeps the headline SHORT (one slot changes, not the whole sentence) — compatible with the "no explanations" and word-count discipline elsewhere in this knowledge base, unlike a rotating full-sentence carousel which usually invites more words than the page needs.

## Named colour-composition directions (pick ONE whole direction, not pieces of several)
Real distinct directions seen across working builds — use color-selection-reference.md and vibrant-color-patterns-reference.md for the underlying theory, this is the "which whole look" layer on top of it:
- **Committed warm gradient:** vertical gradient between two adjacent warm hues (e.g. red-orange to orange), all type and icons pure white, matching warm glow blobs behind content. Reads energetic/bold — portfolio, youth/lifestyle brand.
- **Dark + single saturated diagonal accent:** near-black (`#010101`-class) base, ONE diagonal gradient (e.g. violet-to-magenta) used only for headline text-fill, icon glows and button accents — never as a background fill. Reads premium/agency/SaaS.
- **Muted cool base + pure white, glass-forward:** a single muted mid-tone (sky blue, sage, slate) as the only background hue, white text and glass surfaces doing all the "decoration," zero additional accent color. Reads calm/premium — travel, aerospace, wellness.
- **Near-black monochrome editorial:** a tight HSL neutral ramp (background/surface/text/muted/stroke all at 0% saturation, 4-96% lightness) plus exactly ONE cool accent gradient reserved for rings, progress bars and hover borders ONLY (never fields or large areas). Reads restrained/editorial — portfolio, studio.
- **Pure black/white brutalist, zero radius:** `--radius: 0`, one typeface, true black/white only, no accent color at all — every emphasis comes from scale and weight, not color. Reads industrial/technical — aerospace, engineering, data-heavy B2B.
- **Dark hero containing a bright "product island":** a dark/near-black hero frame around one bright, light-mode UI mockup (dashboard, app screen) as the literal focal point — the contrast between the dark frame and the bright product IS the composition. Reads SaaS/product-led.

2026 trend research (moburst.com, zoho.com, abmatic.ai) splits on restrained-vs-saturated palettes — both directions above are legitimate; the deciding factor is the product's own MATERIAL/MOMENT from the CONCEPT METHOD, not a trend-of-the-year default. Oversized/kinetic type is also trending as a focal-point alternative to a hero image — valid when the product's name/word IS the motif (a wordmark-led brand), not a default to reach for otherwise.

## Hard rule carried over from this corpus
None of these techniques replace the signature-motif requirement in web-director.md — a glass nav, a glow blob and a blur-in headline around a GENERIC stock photo is still generic. The living/moving layer (the video, canvas scene, or parallax grid) has to be doing THIS product's own gesture, not an abstract background loop with no connection to what's being sold.

## Sourcing note
Distilled from motionsites.ai's public prompt-library mirror (real, shipped AI-builder prompts for hero/landing sections across portfolio, SaaS, agency and aerospace-style brands) and 2026 landing-page trend coverage (moburst.com, zoho.com, abmatic.ai, Binus graphic-design program). These are commercial AI-prompt products, not academic sources — treat the named techniques as real and worth learning from, and the specific brand names/wording in their example prompts as off-limits to reuse verbatim.
