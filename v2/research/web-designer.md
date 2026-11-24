# Web designer: research notes

2026-09-23 (deep refresh added 2026-10-29 — see that dated section and the expanded Distilled checklist/Open
questions below)

Scope: this file adds to and corrects `web-designer-references.md`, `style-recipes.md` and `style-signals.mjs` in
the project's existing files (read for context, not edited). It does not repeat facts already
recorded there (DoltHub navy surfaces, Laya's token discipline, the GSAP/Swiper/Lottie triad, the WordPress-default
palette tell, the two hard rules on horizontal scroll and native controls). Citations: a URL is only cited when it was
actually fetched (WebFetch) in this session and returned real body content. Facts drawn only from a search snippet, or
from a fetch that returned a bare title with no body, are marked **(to verify)**.

---

## Sources

| URL | Take | Refuse |
|---|---|---|
| https://arcteryx.com/us/en/ | Full-bleed hero video, Sanity-CDN `rect=` crop coordinates holding one aspect ratio (600×800, ~3:4) across every product card, `w=20&blur=10&q=20` LQIP placeholder swap | Nothing brand-specific; the crop-coordinate + blur-up pattern is the reusable part |
| https://www.dishoom.com/ | Poster-consistent warm colour grade across every photo, small-caps captions ("ABOVE: Brewing morning Chai, Bombay") under images, repeating carousel of process shots | Its exact palette/copy voice; the caption CONVENTION generalises, the Bombay-cinema styling does not |
| https://linear.app/ | Full-bleed screenshots with no browser-chrome frame, Cloudflare Images `f=auto` format negotiation, section-by-section scroll narrative | Its dark-only palette as a universal default |
| https://stripe.com/ | Gradient-mesh background assets kept separate from product-UI screenshots (UI stays crisp, only the backdrop is soft), imgix `?w=&q=90` responsive params, photography for enterprise trust sections instead of icons | The parallelogram brand motif itself |
| https://bruno-simon.com/ | A fully canvas/WebGL portfolio replacing photography entirely — the interaction IS the content, exactly the "show it working" rule already in this project's references, here applied to a personal portfolio instead of a live demo | Building a drivable 3D world for a client site where it isn't the point |
| https://www.pudding.cool/ | Framed (not full-bleed) horizontal story cards, landscape thumbnails, numbered issue identifiers, monochrome restraint so the data visualisations (not the chrome) carry colour | Nothing to refuse; strong reference for editorial/data journalism |
| https://www.apple.com/iphone/ | Full-bleed hero product renders on a flat neutral background, one headline + two CTAs per hero, resolution-specific filenames per breakpoint (`hero_iphone_18_pro__..._large.jpg`), zero decorative overlay | Nothing brand-specific; the "product alone on a plain field" restraint generalises |
| https://big.dk/ | Full-bleed contact-sheet grid of near-square project cards, base64 LQIP placeholders, caption (title + place) directly under each card, uniform documentary colour grading across unrelated projects | Nothing to refuse |
| https://www.pentagram.com/ | Asymmetric multi-column project grid (not a rigid uniform grid), imgix `rect=` recomposing the SAME photo differently per breakpoint, "Retrospective" thumbnail sub-galleries for serial work | Nothing to refuse |
| https://www.glossier.com/ | imgix `auto=compress,format&cs=srgb` — colour-space is pinned explicitly, not left to the browser; accessible carousel controls (`Play Slideshow`/`Pause Slideshow`, not just arrows) | Nothing to refuse |
| https://www.itsnicethat.com/ | Headlines sit BELOW images, never on top, in the feed view — preserves the photo, unlike the poster-overlap pattern; masonry feed vs. full-bleed single-story view is a deliberate two-mode split | Nothing to refuse |
| https://snohetta.com/ | Consistent landscape (~1.5:1) card ratio across the entire project index regardless of the source photo's real crop, caption = name + one-line description under every card | Nothing to refuse |
| https://www.aman.com/ | Exactly two aspect ratios used sitewide (16:9 landscape, 3:4 portrait) — a discipline, not an accident; inline solid-colour SVG data-URI placeholders (not a blurred photo) sized to the real image's intrinsic ratio | Nothing to refuse |
| https://web.dev/articles/serve-responsive-images | srcset width-descriptor + sizes syntax, "3–5 sizes" as a practical default | — |
| https://web.dev/articles/optimize-lcp | `fetchpriority="high"` on exactly one image, never lazy-load the LCP element, preload when the LCP image is CSS-referenced | — |
| https://web.dev/articles/cls | CLS ≤0.1 good / >0.25 poor, at the 75th percentile | — |
| https://web.dev/articles/browser-level-image-lazy-loading | Chrome's lazy-load distance thresholds (1250px on 4G, 2500px on slower) | — |
| https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images | Full srcset/sizes/picture syntax and the "don't combine media with sizes" rule | — |
| https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio | `aspect-ratio` is a no-op unless at least one dimension is `auto`; `aspect-ratio: 3/2 auto` as an image loading-state fallback | — |
| https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit | The five `object-fit` keywords and their exact cropping/letterboxing behaviour | — |
| https://www.nngroup.com/articles/neobrutalism/ | Concrete a11y fixes: 2–3 bold colours, chunky-sans + neutral-body pairing, 24–32px whitespace margins, underline/colour-shift to signal interactivity | Its example palette is illustrative, not prescriptive |
| https://www.nngroup.com/articles/aesthetic-minimalist-design/ | The signal-vs-noise framework: "communicate; don't decorate," progressive disclosure for uncommon tasks | — |
| https://www.smashingmagazine.com/2022/03/claymorphism-css-ui-design-trend/ | The exact three-layer claymorphism box-shadow recipe with real numbers | — |
| https://css-tricks.com/getting-clarity-on-apples-liquid-glass/ | Liquid Glass's three-part model (highlight/shadow/illumination), and its named accessibility failure modes (variable contrast over photos, visual noise for low-vision/dyslexic users, controls losing affordance) | — |
| https://developer.apple.com/design/human-interface-guidelines/materials | (fetched, but returned only the page title, no body — treat any HIG "materials" claim below as **(to verify)**) | — |
| https://m3.material.io/styles/elevation/applying-elevation | (fetched, but returned only the page title, no body — treat any Material 3 elevation claim below as **(to verify)**) | — |
| https://www.aesop.com/us/, https://www.rivian.com/, https://www.tesla.com/models, https://vercel.com/, https://www.nytimes.com/section/magazine | Attempted; blocked (403) or returned no extractable body. Not cited for facts — noted so nobody re-tries them expecting a different result without a headless-browser fallback | — |

---

## Image presentation rules

### What thirteen real sites actually do (2026-09-23, re-studied for image handling specifically)

Thirteen sites fetched directly (see Sources), spanning all seven briefed categories: retail/fashion (Arc'teryx,
Glossier), food/hospitality (Dishoom, Aman), SaaS (Linear, Stripe), portfolio/studio (Bruno Simon, Pentagram),
editorial (The Pudding, It's Nice That), product launch (Apple iPhone), architecture/real estate (BIG, Snøhetta).

**1. Full-bleed is the default for hero/narrative moments; framed contact-sheet grids are the default for indices.**
Every hero (Arc'teryx, Dishoom, Stripe, Aman, Apple) runs the image or video edge-to-edge with no border or card. Every
INDEX of many items (BIG, Snøhetta, Pentagram, The Pudding) frames each item in a card with visible edges and a
caption underneath. The pattern is: one full-bleed image commands attention once per section; many images sit in a
disciplined, evenly-spaced grid when the job is comparison or browsing. Mixing the two within one moment (a full-bleed
photo that is ALSO trying to be a comparison grid item) is what makes a page feel unplanned.

**2. Crop discipline beats crop variety.** Arc'teryx holds one card ratio (≈3:4, driven by explicit CDN `rect=`
coordinates) across every product photo regardless of the source photo's real proportions. Snøhetta holds one ratio
(≈1.5:1) across every project card. Aman uses exactly two ratios sitewide (16:9 landscape, 3:4 portrait) and nothing
else. **Rule: pick at most two aspect ratios for a whole site (one landscape, one portrait) and crop every photo into
one of them via `object-fit: cover` + `object-position`, rather than letting each image keep its native, inconsistent
proportions.** A grid where every third card is a different height is the single fastest way to make a layout look
un-designed.

**3. Crop the photo, don't just resize it — computed focal-point cropping.** Arc'teryx and Pentagram both drive crops
through CDN query parameters (`rect=x,y,w,h`) rather than serving one master image scaled down. This means the SAME
source photo is recomposed differently at each breakpoint or card size — a tight product crop for a small tile, a
wider composition for a hero — which is the practical, build-tool version of `<picture>` art direction (see engineering
rules below) without hand-authoring multiple `<source>` elements per image.

**4. Two placeholder techniques, pick by content type.** Arc'teryx uses a genuine blur-up LQIP: a real 20px-wide,
heavily blurred, low-quality copy of the actual photo (`w=20&blur=10&q=20`) swapped for the full image once loaded —
correct when the photo's colour and shape are part of the anticipation (fashion, food). Snøhetta and Aman instead use
an inline solid-colour SVG data URI sized to the image's real intrinsic dimensions as the placeholder — cheaper (no
extra network request, no photo-specific blur to generate), and reserves the exact layout box so CLS is zero either
way. **Use blur-up when the photo itself is the payoff; use a dimension-matched solid/SVG placeholder everywhere
else** — most cards, thumbnails and grid tiles don't need the extra blur asset.

**5. Colour-space is a stated parameter, not a browser default.** Glossier's imgix URLs explicitly pin `cs=srgb`
alongside `auto=compress,format`. On modern wide-gamut (P3) phone displays, an un-pinned colour space can shift hue
between a brand's marketing photography and its product screenshots. **Add an explicit colour-space parameter (or an
ICC-profile-stripped, sRGB-baked export) to the image pipeline rather than trusting default browser gamut mapping,**
especially when a brand palette is precisely tuned (see the operator's own DoltHub/Laya token work).

**6. Text sits ON photos in hero moments, BELOW photos in feed/index moments.** Arc'teryx, Dishoom and Aman all
absolute-position headline text directly over a photo with no card, no scrim box, no caption element — a poster
technique. It's Nice That and The Pudding do the opposite in their feed views: headline and byline sit in plain type
below a photo, so the photo stays intact and readable as an image rather than as a backdrop. **Decide once, per
template, which mode a photo is in — hero (text overlaps, needs a gradient scrim or a dark/light corner check for
contrast) or feed (text is separate, photo stays pure) — and never let a caption-style byline float on top of a photo
the way a hero headline does; it reads as a mistake, not a choice.**

**7. Captions are a small, consistent typographic voice, not decoration.** Dishoom's "ABOVE: Brewing morning Chai,
Bombay" and Snøhetta's name-plus-one-line-description are both small caps or small regular weight, always in the same
position relative to the image (directly under, left-aligned), always present when a caption exists at all. A caption
that appears on some cards and not others, or that changes size/position card to card, breaks the "one grid, one
system" property that makes Laya (already in the reference file) read as designed.

**8. Carousels need visible, labelled, pausable controls — not just chevrons.** Glossier's slideshow exposes "Previous
Slide," "Next Slide," "Play Slideshow," "Pause Slideshow" as real controls, not icon-only arrows with no state. Any
autoplaying carousel or looping video hero (Arc'teryx's autoplay video, Abonado's per-card looping videos already in
the reference file) needs an equivalent pause affordance to satisfy `prefers-reduced-motion` and WCAG 2.2.2
(Pause, Stop, Hide) — a moving carousel with no pause control is a contrast-independent accessibility failure the
existing motion-budget rule doesn't explicitly call out.

**9. A live/interactive canvas is a legitimate total replacement for photography, not just an addition to it.**
Bruno Simon's portfolio has no `<img>` tags carrying the actual work — the WebGL scene itself IS the content. This is
the same "show it working" principle already in the Laya reference, taken to its logical end for a
portfolio/studio brief specifically: when the work is inherently interactive or spatial, consider replacing the image
gallery with the real thing (a runnable demo, a drivable scene, a live canvas) rather than screenshotting it into a
static gallery.

**10. Asymmetric ≠ inconsistent.** Pentagram's project grid uses variable column spans per project (some full-width,
some half, some paired) rather than one rigid uniform grid — but every project still uses the SAME crop-recomposition
technique and the SAME caption typography. Asymmetry at the layout level is fine and often more interesting than a
uniform grid; asymmetry at the crop/caption/type level (the actual system) is what reads as unplanned.

### Image engineering, from primary docs (web.dev, MDN)

**Responsive images — resolution switching (`srcset` + `sizes`).**
```html
<img srcset="hero-480w.jpg 480w, hero-800w.jpg 800w, hero-1200w.jpg 1200w, hero-1600w.jpg 1600w"
     sizes="(width <= 600px) 100vw, (width <= 1200px) 50vw, 800px"
     src="hero-800w.jpg" alt="…">
```
- Width descriptors (`w`) are the image's real intrinsic width, not a display size; `sizes` is the DISPLAY width in the
  layout, in a real CSS length or `vw` — **never a percentage**.
- Ship 3–5 width variants for a normal content image; go up to 1600–2000w for a genuine full-bleed hero — anything
  wider is wasted for a viewport that tops out near 2560px logical pixels on a 2x/3x display.
  (web.dev/articles/serve-responsive-images)
- The browser evaluates `sizes` conditions top-to-bottom and stops at the first true one; always end with an
  unconditional fallback length. (MDN Responsive_images)
- Resolution-only switching (no layout-size change, e.g. a fixed 320px avatar that just needs 1x/2x/3x source files)
  uses x-descriptors instead and drops `sizes` entirely: `srcset="a.jpg 1x, a@2x.jpg 2x, a@3x.jpg 3x"`.

**Art direction (`<picture>`).** Use `<picture>` with `media` on each `<source>` only when the CROP or COMPOSITION
should genuinely change per breakpoint (a close portrait crop on mobile, a wide environmental shot on desktop) — not
merely to serve a smaller file, which is what `srcset`/`sizes` already does.
```html
<picture>
  <source media="(width < 800px)" srcset="portrait-close-480w.jpg">
  <source media="(width >= 800px)" srcset="wide-environment-1600w.jpg">
  <img src="wide-environment-1600w.jpg" alt="…">
</picture>
```
Never combine a `media` condition and a `sizes` attribute on the same `<source>` — they solve different problems and
the spec doesn't define the interaction. (MDN Responsive_images)

**Format negotiation (AVIF/WebP/JPEG).** Either author explicit `<source type="image/avif">` / `type="image/webp">`
fallbacks inside `<picture>`, or rely on a CDN's content-negotiation query param (`f=auto` on Cloudflare Images,
`auto=format` on imgix) as Linear and Arc'teryx/Glossier do — both are legitimate; the CDN param approach is less
markup and was what every real site fetched in this study actually used, over hand-authored `<picture>` sources.

**Aspect ratio + object-fit (avoiding pre-cropped masters).**
```css
.card img {
  aspect-ratio: 3 / 4;      /* the ONE ratio this template uses, see rule 2 above */
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center 30%;  /* nudge the focal point without re-exporting the file */
}
```
`aspect-ratio` only has an effect when at least one of width/height is `auto` — if both are hard pixel values it is
silently ignored. (MDN aspect-ratio) `object-fit: cover` crops to fill without distortion; `contain` letterboxes;
`fill` distorts (avoid for photography); `scale-down` behaves as `none` or `contain`, whichever is smaller. (MDN
object-fit) A useful fallback pattern for a real `<img>` before its intrinsic size is known: `aspect-ratio: 3/2 auto`
— `auto` takes over once the real image loads.

**CLS.** Target ≤0.1 (good), >0.25 is poor, measured at the 75th percentile of real page loads. (web.dev/articles/cls)
Every image and video needs a reserved box before its bytes arrive — either explicit `width`/`height` attributes (the
browser computes the aspect ratio from these even before CSS applies) or a CSS `aspect-ratio` on the element. A
site's LQIP/placeholder strategy (rule 4 above) only prevents CLS if the placeholder is sized to the REAL image's
final box, not to some average or `auto` box.

**LCP image priority.** Exactly one image per page should carry `fetchpriority="high"` — the actual LCP candidate,
almost always the hero. (web.dev/articles/optimize-lcp) "Setting a high priority on more than one or two images makes
priority setting unhelpful in reducing LCP" — the same over-marking failure as the "one focal glow per screen"
motion-budget rule already in the reference file: marking everything urgent marks nothing urgent. Never
`loading="lazy"` the LCP image. If it's only referenced from CSS (a `background-image` hero), add
`<link rel="preload" fetchpriority="high" as="image" href="…">` in `<head>`.

**Lazy loading below the fold.** `loading="lazy"` only on images outside the initial viewport; Chrome starts fetching
a lazy image 1250px before it enters view on a fast (4G) connection, 2500px on a slower one — generous enough that
users essentially never see a blank gap while scrolling normally. (web.dev/articles/browser-level-image-lazy-loading)
Never lazy-load anything that could be visible on first paint, including a below-the-fold-looking element that is
actually visible on short/wide viewports.

---

## Style recipes

Corrections and additions to `style-recipes.md`, one style at a time. Existing look/tokens/CSS/avoid/fits lines from
that file are not repeated here — only what's NEW or CORRECTED, plus the two required real examples per style.

**Minimalism.** New framing from NN/g: minimalism is a signal-to-noise ratio, not an absence of content — "maximize
signal, minimize noise," where signal is high-information elements (clear labels, high-resolution images, plain
language) and noise is decoration-only elements, cluttered/low-res images, and dual-purpose visual cues (e.g. giving
links and non-link text identical styling, which then reads as ambiguous rather than restrained).
(nngroup.com/articles/aesthetic-minimalist-design) Add a concrete review question: for every element on the page, can
you name the information it carries? If not, it's noise, not minimalism. Real examples: **Apple iPhone product pages**
(one headline, one image, two CTAs per hero); **The Pudding** (monochrome chrome so the actual data visualisation
carries all the colour).

**Maximalism.** Correction, not addition: the existing recipe's implicit colour-counting mechanism (see Detector
corrections #4) only sees hex literals. A maximalist build using the HSL-CSS-variable pattern this project's OWN
references repeatedly recommend (`--primary: 264 67% 47%`) will read as having almost no distinct colours even when
the palette is genuinely loud — so when briefing maximalism, either require literal hex tokens in the design file, or
manually verify the palette width rather than trusting the automated colour count. Real examples: fashion/festival
sites generally (no primary-source fetch this session cleared for a specific maximalist brand; treat any named
example as **(to verify)**).

**Skeuomorphism.** No correction to the existing recipe's CSS. Add one real example pairing: instrument/music-gear
UIs and game HUDs are the fit named already; **(to verify)** for two specific 2026 sites, since none in this session's
fetch set used it.

**Neumorphism.** Add the accessibility framing CSS-Tricks' own community consensus and this project's existing recipe
both converge on: neumorphism's contrast problem is structural, not incidental — it relies on the SAME hue at two
lightness steps, which is why WCAG non-text contrast (3:1) is hard to hit without breaking the look. The existing
recipe's fix ("add a real border or accent to every control") is correct and doesn't need amendment; add the point
that state (pressed/active) must ALSO change something other than shadow direction (a colour or icon change) since a
shadow-only state change fails for anyone who can't perceive the shadow at all. No new real example beyond what a
direct fetch verified this session; treat named examples as **(to verify)**.

**Glassmorphism / Liquid glass.** Real technical detail from CSS-Tricks (fetched): Apple's Liquid Glass is built from
three named layers — a **highlight** (light casting/movement), a **shadow** (depth separation from the layer below),
and an **illumination** (the material's own light response) — not just "blur + translucency." A flat `backdrop-filter:
blur()` panel is the crude version; the fuller version adds a moving specular highlight (the existing recipe's inset
white line is a static approximation of this) and treats the panel as reactive to what's under it, not to a fixed
gradient. CSS-Tricks names Liquid Glass's specific accessibility failure modes directly, which sharpens the existing
recipe's generic "respect reduced transparency" line into three distinct, testable fixes:
1. *Variable contrast over photos* — translucent text that passes contrast over one background patch fails over a
   busier one; fix by adding a solid or near-solid scrim behind text specifically, not just lowering blur.
2. *Visual noise from stacked translucent layers* — compounds for dyslexic/attention-disorder users; fix by capping
   stacked glass panels to one layer deep (a glass panel should not sit on another glass panel).
3. *Controls losing affordance* ("buttons become amorphous shapes floating behind glass") — fix by keeping an icon,
   label or hard edge on every interactive glass element, never relying on the glass effect alone to signal
   "clickable."
Two real examples of the base pattern predate Liquid Glass and remain valid references: iOS/macOS control-center
panels and Windows 11 Mica/Acrylic surfaces — both **(to verify)** as this session fetched no live site using them.

**Claymorphism.** Correction: the existing recipe's shadow guidance ("soft outer shadow `0 20px 40px`; two inset
shadows") is directionally right but Smashing Magazine's actual, load-bearing recipe (fetched) is more specific and
should replace it:
```css
.clay {
  border-radius: 32px;                 /* minimum that reads as "puffy"; scale up for larger elements */
  box-shadow:
    8px 8px 16px rgba(0, 0, 0, 0.25),                 /* outer: lifts the shape off the page */
    inset -8px -8px 12px rgba(0, 0, 0, 0.25),          /* inset dark: shade on the far corner */
    inset 8px 8px 12px rgba(255, 255, 255, 0.4);       /* inset light: highlight on the near corner */
}
```
Smashing's own accessibility note: keep strong accent colours and minimal typography specifically to counter clay's
tendency to read as childish/low-information at low contrast; verify 4.5:1 body text against every pastel fill used,
not just the darkest one. Real examples: onboarding flows and kids/education apps generally (fit already named in the
existing recipe); **(to verify)** for two specific named sites.

**Brutalism / neo-brutalism.** Add NN/g's concrete, load-bearing accessibility checklist (fetched, not previously in
the project's recipe file):
- Limit the palette to 2–3 bold colours total (their own example: black, one neon, one electric hue) — more than
  that stops reading as "bold" and starts reading as noise, the maximalism failure mode leaking into brutalism.
- Pair one chunky/decorative sans for headlines with one clean, neutral face (their example: Roboto) for body copy —
  brutalism's loudness should live in scale and weight, not in illegible body type.
- Generous whitespace (24–32px margins) is what keeps a loud palette from becoming chaotic; brutalism is not an
  excuse to also cram the layout.
- Signal every interactive element with something beyond the hard shadow alone — an underline or a colour shift on
  hover/focus — because the existing recipe is right that the visible focus ring must be distinct from the
  decorative hard shadow, and NN/g's specific mechanism for that distinction is colour/underline change, not just
  "keep a ring."
Real examples: NN/g's own article names the trend broadly rather than specific sites; treat any named example as
**(to verify)**. This project's own prior research (Reference 9 batch, already in `web-designer-references.md`) is a
better source of real neo-brutalist implementation detail than anything newly fetched this session.

**Flat.** No correction. No new real example fetched this session; **(to verify)**.

**Bento grid.** Addition, flagged as **(to verify)** since it comes from a search-synthesized summary rather than a
directly fetched Material page: bento tiles should stay near-flat, at most ONE shadow level for the whole grid, and
prefer a border or background-colour step over a shadow to separate tiles — reserving elevation/shadow for a single
tile that's genuinely being highlighted, not decorating every tile equally. This corrects a possible failure mode not
named in the existing recipe: a bento grid where every tile has its own drop shadow reads as a generic card grid with
rounded corners, not as a considered bento layout. Real examples: SaaS feature-grid sections generally (the SaaS
landing-page search summary above names bento-style feature grids as a 2026 norm); **(to verify)** for two specific
named sites.

**Spatial UI.** No correction to the CSS. Flag for the detector-corrections section below: the existing recipe's
`perspective`/`translateZ` requirement is stricter than how many real "spatial-feeling" web UIs actually achieve the
effect (blur + scale + z-index layering without literal 3D transforms also reads as spatial depth to a viewer, even
though it isn't "real" 3D). **(to verify)** for named examples; none fetched this session.

**Swiss / international typographic.** No correction. The project's own Laya reference (already documented) remains
the strongest real example on file; no new example fetched this session that improves on it.

---

## Detector corrections

Read directly from `style-signals.mjs` (not a summary — the regex source itself). These are gaps or bugs in the
CURRENT detector, described for whoever next edits that file; none of these were applied to the file, per the
read-only instruction for this task.

1. **`WHITE` regex false-positives on saturated colours, not just white.** `hsla?\([^)]*100%` matches ANY `hsla()`/
   `hsl()` call containing the LITERAL substring `100%` anywhere in its argument list — including the SATURATION
   argument, not just lightness. `hsla(210, 100%, 50%, .2)` is a vivid, fully-saturated blue, not white, but it
   currently satisfies both `hairline-light-border` and `specular-highlight`. Fix: anchor the match to the lightness
   position specifically (third comma-separated value), or require lightness ≥90% rather than an unanchored `100%`.

2. **The dither/repeating-conic-gradient texture technique is invisible to the `texture` signal.** This project's own
   most-praised reference (Laya, `web-designer-references.md`) implements its signature texture as
   `repeating-conic-gradient`/`conic-gradient` taking `currentColor` — not a `background-image: url(...)`, not
   `feTurbulence`, not a filename containing "grain"/"noise". The current `texture` regex only recognises those three
   forms, so a build that faithfully copies Laya's actual technique registers as having NO texture signal at all.
   Fix: add a dedicated pattern for `repeating-(?:conic|linear)-gradient` combined with `currentColor`, or a general
   `dither-texture` signal alongside the existing `texture` one.

3. **Specular highlights via `border-top` or a pseudo-element gradient aren't recognised.** `specular-highlight` only
   matches the literal `inset 0 1px 0 <white>` box-shadow form. A common, cheaper way to fake the same top-edge glass
   highlight — `border-top: 1px solid rgba(255,255,255,.4)` on a panel, or a `::before` with a linear-gradient fading
   to transparent — produces an identical visual result but scores zero on this signal, understating glassmorphism/
   liquid-glass fidelity for any build that chose the cheaper technique over the inset-shadow one.

4. **Colour counting is hex-only, which breaks in both directions for HSL-variable palettes.**
   `distinctColours()` only regex-matches `#rrggbb`/`#rgb` literals. This project's OWN references repeatedly praise
   sites (Asymm, TouristyAF, LIVE Legion — all in `web-designer-references.md`) that define their entire palette as
   HSL triplets in CSS custom properties (`--primary: 264 67% 47%`), never as hex. Consequence: (a) a genuinely
   maximalist build using this exact pattern will almost always fail maximalism's required `many-colours` signal
   (false negative), and (b) a genuinely loud HSL palette will never trip minimalism/flat's `avoid: many-colours`
   check either (false negative the other direction — the avoid-list simply never fires). Fix: extend colour
   detection to also parse and dedupe `hsl()`/`hsla()`/`rgb()`/`rgba()` triplets, not hex alone.

5. **Neo-brutalism's signature COLOURED hard shadow doesn't count as a hard shadow.** `hard-offset-shadow` requires
   the shadow's colour to be black-ish (`#000`/`#111`/`black`/`rgb(0…`) or a `var()`. Real neo-brutalism (per NN/g,
   fetched, and this project's own market research in Reference 9) very often uses a saturated NON-black hard shadow
   — `box-shadow: 6px 6px 0 #ff3366` — as its whole visual signature (that's the "neo" difference from classic
   brutalism's black-only shadow). As written, a textbook neo-brutalist build with a coloured hard shadow will be
   told it's MISSING brutalism's required signal. Fix: drop the colour restriction for a zero-blur, fixed-offset
   shadow entirely — any solid colour should count.

6. **`feTurbulence` double-counts across two unrelated styles.** The same `feTurbulence` pattern backs both `texture`
   (a skeuomorphic paper-grain filter) and `displacement-filter` (liquid-glass refraction). A skeuomorphic build with
   an SVG grain filter will therefore also silently satisfy liquid-glass's required displacement signal, and vice
   versa, if the two styles are ever compared or a build mixes both filters for unrelated reasons. Fix: keep
   `feDisplacementMap` alone as the displacement/refraction signal (it's the primitive that actually warps/lenses);
   drop `feTurbulence` from `displacement-filter` and leave it only under `texture`, where it belongs as a noise
   generator.

7. **`grid-span` misses line-based bento placement.** The regex requires the literal word `span` (CSS) or Tailwind's
   `col-span-`/`row-span-` classes. A bento tile placed by explicit grid line numbers instead —
   `grid-column: 1 / 3` or `grid-area: 1 / 1 / 3 / 3` — is an equally valid, equally common way to make a tile span
   two tracks, and currently scores zero. Fix: also match `grid-column(-end)?\s*:\s*\d+\s*/\s*\d+` (or the
   `grid-area` four-value shorthand) where the numeric span between the two line numbers is ≥2.

8. **`generous-spacing` under-detects fluid/clamp systems that never reach the 96px/6rem floor.** Laya's own rhythm
   (8/16/32/64/96, documented in `web-designer-references.md`) only clears the detector's bar because the literal
   value 96 appears somewhere in its scale. A similarly generous, similarly fluid system built as
   `clamp(2rem, 6vw, 5rem)` (maxing at 80px, but visually spacious at real desktop widths because the 6vw term
   dominates) never reaches the numeric threshold and fails minimalism/swiss's required signal even though it reads
   exactly as spacious in a browser. Fix: also credit a `clamp()` whose MIDDLE (preferred) argument is a `vw` value
   ≥4vw, regardless of the ceiling value, since large-viewport spacing in a fluid system is driven by that term.

9. **`hairline-light-border`'s CSS-variable branch is name-gated, not value-resolved (a known limitation, not a
   quick fix).** It only accepts `var(--*glass*|*highlight*|*edge*)` — a border token named anything else (e.g.
   `--border-subtle`, `--stroke-1`) that still resolves to a translucent white somewhere else in the stylesheet is
   invisible to a plain-regex detector, which can't follow the custom-property cascade. Rather than a regex fix
   (which would need real CSS parsing), the practical mitigation is to document the naming convention as a
   REQUIREMENT in `style-recipes.md` itself: glass/hairline border tokens must contain "glass," "highlight," or
   "edge" in their variable name for the automated check to see them at all.

---

## Anti-slop

Building on, not repeating, the tells already enforced in `web-designer-references.md` (the big opening heading, the
eyebrow/kicker caption, purple/pink gradients, lorem ipsum, 4+ font families, motion with no reduced-motion handling,
`transition: all`, "Welcome to" headings, gradient headline text, 12+ rounded-2xl boxes, no `:focus-visible`).
Additional 2025–2026 tells found in this session's search research (WebSearch synthesis; no single primary blog
fetched and verified verbatim, so treat specific phrasings as **(to verify)** even though the pattern itself is
corroborated across many independent sources):

1. **A grey 1px border around every card, no exceptions.** Multiple independent sources named this as the single
   most common "AI slop" tell for 2026 — every card gets the identical `border: 1px solid #e5e5e5` regardless of
   whether it needs visual separation from its neighbour. Fix: default cards to borderless, separated by spacing or a
   background-colour step; reserve a visible border for the one card that actually needs to stand out.
2. **Inter (or Roboto/Open Sans) as the DISPLAY headline face**, not just the body face. Using a default system-safe
   sans for body copy is fine; using it for the big headline too is what reads as "nobody chose a font." Pick one
   distinctive display face even if the body stays on a neutral sans (the same two-role discipline already
   established for Laya/Asymm/BIG in the reference file — apply it to headline-vs-body specifically, not just
   sans-vs-mono).
3. **Decorative monospace "eyebrow" labels even where the operator's existing h1/kicker ban doesn't technically
   apply** — a small monospace tag floating above a SECTION heading (not just the page's very top), styled purely for
   texture rather than to convey a real category or status. The existing rule bans the pattern at the very top of the
   page; the same pattern re-appears mid-page above every section and is just as recognisable there.
4. **A blurred colour-glow "orb" behind the hero as a generic SaaS-page default**, unconnected to any real state or
   brand meaning — distinct from the operator's already-banned purple/pink gradient in that the orb can be any hue
   and still read as slop, because the tell is the SHAPE and its purposelessness (compare to the RedSwitches pattern
   already in the reference file, where every animation represents a literal state — a glow orb representing nothing
   is the inverse of that rule).
5. **Three (or four) identical feature cards, each with a generic line-icon, a bolded three-word title, and one
   sentence of body copy, in a row** — the exact "three-card icon row" the reference file already bans, but worth
   re-stating with its full anatomy so it's recognisable even when varied slightly (four cards instead of three, a
   filled icon instead of outline): the tell is the FORMULA (icon + short title + one sentence, repeated identically
   N times), not the exact count.
6. **A "trusted by" logo strip of unrelated, generic company wordmarks** (often literally placeholder/fictional
   logos) used to imply social proof that doesn't exist yet. Fix: omit the section entirely until there are real
   logos to show, rather than filling the slot with a convincing-looking fake.
7. **Fake or generic testimonial quotes paired with a stock headshot and an invented name/title** — already implied
   by the reference file's "refuse fake testimonials" line under real-content standards, worth naming explicitly as
   a visual tell (a rounded stock photo + five-star row + italic quote block) since it's the VISUAL formula, not just
   the copy, that reads as generated.
8. **A cookie-cutter four-column footer** (Product/Company/Resources/Legal, each with 4–5 generic links) that is
   structurally identical across unrelated sites regardless of what the product actually offers. Fix: let the
   footer's structure follow what the site actually has (if there's no blog, there's no "Resources" column with a
   dead "Blog" link).
9. **Emoji used as functional icons** (✨ for "new," 🚀 for "fast," 🎯 for "focused") in place of a designed icon set
   — cheap to add, instantly recognisable as an unstyled default, and inaccessible (emoji render inconsistently
   across platforms and aren't meaningfully labelled for screen readers without extra work).

---

## Distilled checklist

1. Pick at most two aspect ratios for the whole site (one landscape, one portrait) and crop every photo into one of
   them with `object-fit: cover` + `object-position` — never let native, inconsistent photo proportions drive card
   heights.
2. Full-bleed for hero/narrative moments; framed, evenly-captioned cards for indices. Don't blend the two roles in
   one image.
3. Recompose (crop) the same source photo per breakpoint via CDN `rect=`/transform params or `<picture>` art
   direction — don't just scale one master crop down.
4. Use a genuine blurred LQIP only when the photo's own colour/shape is the anticipation payoff (fashion, food);
   otherwise use a solid-colour/SVG placeholder sized to the real image's intrinsic box.
5. Pin an explicit colour-space parameter (e.g. `cs=srgb`) in the image pipeline so hue doesn't shift on wide-gamut
   displays.
6. Decide per template whether text sits ON a photo (hero — needs a scrim or contrast check) or BELOW a photo
   (feed/index — photo stays untouched); never let a caption-weight byline float on top of a photo the way a hero
   headline does.
7. Keep caption typography (position, size, weight) identical everywhere a caption appears; a caption that varies
   card to card breaks the one-system read.
8. Any autoplaying carousel or looping video needs a real, labelled pause control, not just prev/next chevrons.
9. Consider replacing a photo gallery entirely with a live/interactive canvas when the work itself is inherently
   interactive (portfolio, product demo) — see Bruno Simon and the project's own Laya/live-demo rule.
10. Ship 3–5 `srcset` width variants for a normal image, up to 1600–2000w for a true full-bleed hero; `sizes` must be
    a real length or `vw`, never a percentage.
11. Use `<picture>` + `media` only when the CROP genuinely changes per breakpoint; use plain `srcset`/`sizes` when
    only the file SIZE should change.
12. Set `fetchpriority="high"` on exactly one image (the real LCP element) and never `loading="lazy"` it; preload it
    if it's only reachable via CSS.
13. `loading="lazy"` only below the fold; always pair with explicit `width`/`height` or a CSS `aspect-ratio` so the
    layout box is reserved before the bytes arrive.
14. `aspect-ratio` has no effect unless at least one of width/height is `auto` — check this when a reserved box isn't
    behaving as expected.
15. Target CLS ≤0.1; treat >0.25 as a build-blocking regression, not a style nit.
16. Serve AVIF → WebP → JPEG, either via `<picture type=…>` sources or a CDN's `f=auto`/`auto=format` content
    negotiation — either is legitimate; the CDN param was what every real site fetched in this study actually used.
17. Name a style explicitly (from the twelve-style vocabulary already catalogued) before building, and hold its
    required signals as a build gate — a style that is only named in prose and never implemented in CSS is a failed
    build, per the operator's own 2026-09-23 instruction already driving `style-recipes.md`.
18. For glassmorphism/liquid-glass: never stack a glass panel on top of another glass panel (caps visual noise at one
    layer); always keep an icon, label, or hard edge on an interactive glass control so it doesn't rely on the glass
    effect alone to signal "clickable."
19. For neumorphism: change something other than shadow direction (colour or icon) on a pressed/active state, since a
    shadow-only state change is invisible to anyone who can't perceive the shadow.
20. For neo-brutalism: cap the palette at 2–3 bold colours, pair one decorative display face with one neutral body
    face, keep 24–32px whitespace margins, and signal interactivity with an underline or colour shift distinct from
    the decorative hard shadow — a hard shadow in a saturated (non-black) colour is still a valid hard shadow.
21. For claymorphism: use the three-layer shadow recipe with real numbers (outer `8px 8px 16px rgba(0,0,0,.25)`,
    inset dark `-8px -8px 12px rgba(0,0,0,.25)`, inset light `8px 8px 12px rgba(255,255,255,.4)`) at ≥32px radius, and
    verify 4.5:1 body-text contrast against every pastel fill used, not just the darkest one.
22. Refuse: grey 1px borders on every card by default, a default system-sans as the DISPLAY headline face, decorative
    monospace eyebrows above mid-page sections, purposeless colour-glow orbs behind a hero, the icon+title+sentence
    feature-card formula repeated identically, fake "trusted by" logo strips, invented testimonials with stock
    headshots, an identical four-column footer regardless of what the site actually has, and emoji used as functional
    icons.
23. Before calling an image-heavy build done: count the distinct aspect ratios actually rendered (should be ≤2 per
    template), check that every carousel/video has a working pause control, and confirm the LCP image (only) carries
    `fetchpriority="high"` with no `loading="lazy"` anywhere above the fold.
24. Refuse (2026-10-29 additions): reflexive wide letter-spacing on every uppercase label regardless of whether it
    helps legibility there; a decorative pulsing "Live"/"New" badge on a feature that is neither; a thick, single-
    sided colored border on an otherwise-rounded card (named independently in 2026 as one of the single most
    recognizable AI-generation tells).
25. Name an exact radius SCALE per role (e.g. `--radius-card: 6px`, `--radius-pill: 999px` reserved for true pills)
    rather than one blanket border-radius value applied to cards, buttons, inputs, badges and images alike.
26. Design and show every build order's hero/feature work against REAL content and edge cases (a long name, an error
    string, an empty state, truncated text) before calling it done — a build that only looks right with placeholder
    text and avatars is the generic-AI-UI tell, not a finished build. Give onboarding, empty, error and loading
    states the same deliberate design attention as the hero.
27. Any new tappable control (icon button, carousel arrow, close "×") needs a minimum 24×24 CSS px hit area (WCAG 2.2
    §2.5.8 Target Size), and any drag-operated component (custom slider, drag-to-reorder, carousel-by-drag) needs a
    non-drag equivalent shipped in the same build order (§2.5.7 Dragging Movements).
28. A sign-up/login flow may not require a cognitive-function-test step (image-matching CAPTCHA, "copy this code")
    with no alternative path (§3.3.8 Accessible Authentication) — relevant every time the playbook's one-line
    sign-up rule is implemented.
29. A focused element must never be entirely hidden behind a sticky header/footer or other author content (§2.4.11
    Focus Not Obscured) — check this specifically on any sticky-nav build.
30. For simple scroll-reveal/progress effects, prefer native `view-timeline` + `animation-range` CSS over a JS
    scroll-listener, wrapped in `@supports(animation-timeline: scroll())` with a Lenis/GSAP fallback for
    non-supporting browsers; keep JS-driven scroll only for effects CSS can't express (canvas-synced lines, WebGL).
    Remember `animation-timeline` must be declared AFTER the `animation` shorthand or it gets silently reset.
31. Ship both light and dark palettes by default (`prefers-color-scheme`), not a light-only build with dark bolted on
    later — and re-verify contrast math independently for each, since a palette tuned for light mode often fails
    the same checks once merely inverted.
32. When a brief calls for kinetic/display type, prefer a variable font (one file, `font-variation-settings` driven)
    over multiple static weight files — it is the 2026 mainstream way to get motion-responsive headline type.

---

## Open questions

- Rivian, Tesla, Vercel and the NYT Magazine section could not be fetched this session (bot-blocked or JS-only
  shells with no server-rendered body). Product-launch and editorial categories rest on one directly-verified site
  each (Apple iPhone; The Pudding + It's Nice That); a follow-up session with a headless-browser-capable fetch tool
  (e.g. the chrome-devtools MCP tools available to other agents in this project) would strengthen those two
  categories and specifically confirm Rivian/Tesla's hero video/art-direction technique, which this file currently
  only infers from the Abonado reference already on file.
- Apple's own HIG "Materials" page and Material Design 3's "Applying elevation" page both returned bare titles with
  no body content on WebFetch (likely client-side-rendered with no server HTML fallback). The Liquid Glass and bento
  claims sourced from search-snippet synthesis in this file should be re-verified against those primary pages
  directly (via a screenshot/DOM-read tool, not WebFetch) before being treated as certain.
- No primary source was fetched for flat design, skeuomorphism, or spatial UI real-world examples this session;
  those three styles' "2 real examples" requirement is unmet and marked **(to verify)** rather than invented.
- The nine detector corrections were derived from reading `style-signals.mjs` directly, not from running the scanner
  against real built output — recommend a follow-up pass that runs `scanSignals()` against the actual CSS of the
  thirteen sites re-studied here (where legally fetchable/scrapeable) to confirm each predicted false positive/
  negative actually reproduces, rather than resting on regex inspection alone.
- (2026-10-29, RESOLVED 2026-10-30) shadcn/ui's unified-Radix-package claim and the Base UI CLI-flag claim were
  search-synthesized, not fetched directly. Now confirmed by direct fetch of ui.shadcn.com's own changelog — see the
  2026-10-30 section below; both claims were correct and are now cited.
- (2026-10-29, RESOLVED 2026-10-30) Firefox's `scroll-timeline`/`view-timeline` support was confirmed by a direct
  fetch of caniuse.com: Firefox shipped support at version 159, closing the gap this file had flagged as unresolved.
  See the 2026-10-30 section below.
- (2026-10-29, PARTIALLY RESOLVED 2026-10-30) Of the broader 2026 trend claims pulled only from search snippets,
  IONOS's accessibility-as-trend framing was directly fetched and confirmed 2026-10-30 (see below). Hostinger's
  "bold typography" claim and DesignRush's VUI/AR claims were not re-checked this pass and remain **(to verify)**.

## 2026-09-24/25: scroll craft, presentation and the director role

Studied in a real browser (DOM, computed styles, shipped JS), not from screenshots.

- **Inkling** (React, Vite, Lenis, two fixed WebGL canvases). The ink line: anchors in the markup
  (`data-ink-head`, `data-ink-mark`, `data-ink-pool`); the route is computed from their `getBoundingClientRect()` on
  mount, resize, ResizeObserver and `document.fonts.ready`; a fixed fraction of the viewport height sets the front, so
  the tip stays beside what you read; the ink deepens near the pool and the last section floods; SVG fallback.
  Take: one motif from the product's world that follows the reader and ends the page. Refuse: its blue ink skin.
- **The Academy** (Next.js, Mux video, 51 photos). Sticky `h-screen` in `h-[125vh]`; a line drawing revealed into an
  aerial photograph by a scrubbed `mask-image` (about -44% to 98%); one-line email sign-up. Take: real photos and
  video, mask reveal, one-line sign-up.
- **Kopi Koding** (vanilla three.js + glTF cup, real drink photos, full 3 x 2 menu). Take: a real 3D object of the
  product, photographs, full grids.
- **Presentation by content kind** (measured on Inkling, section by section): working demo, ruled table, before ->
  action -> after, feature diagram, generative visual, 4/8 column heading-and-list, plan toggle, sticky-heading FAQ,
  full-bleed close.
- **Director role.** The designer stops advising and directs: numbered build orders (files, technique, exact work,
  measurable check) that the office enforces. Concept method: mine material, gesture, moment and change; five scored
  candidates; an applause moment; an anti-copy test.
- **Training.** Five different products, graded on 19 checks (own harness). After fixing the grader's own bugs, all
  five passed; one weakness found and fixed in the playbook: the same display face and cream ground were chosen for
  unrelated products.
- **Operator rules that became board testers:** scroll motion, dead space, grid fill, back link, anchor navigation,
  one-line sign-up, real imagery, AI-voice copy. No explanatory subtitles (2026-09-25).
- **Asset sources:** Openverse API (`license=cc0,pdm`) for photos, Poly Haven (CC0) for models and HDRIs, Lenis 1.3
  (`anchors` confirmed in its types), GSAP 3.15, three 0.186, React Bits. Unsplash blocks automated browsers.

---

## 2026-10-29: deep refresh — trends, tooling, AI-slop tells, accessibility baseline, motion

Scope: this section fills the gap the operator flagged ("lacking, way behind"). Research done via live WebSearch +
WebFetch this session (2026-10-29), not from model memory. Citations below only for pages that returned real fetched
body content; synthesized-search-summary claims are marked **(to verify)**, matching this file's existing convention.

### Sources (new this session)

| URL | Fetched? | Take |
|---|---|---|
| https://www.figma.com/resource-library/web-design-trends/ | Yes (WebFetch, real body) | Bright/saturated "dopamine design" palettes back via Y2K nostalgia (cites Lush, Headspace, Starface); kinetic/variable-font headlines (cites Glossier, Samsung); scroll-based narratives with easing matched to brand tone; dark mode now a *standard* default with a toggle, not a novelty; Figma's own 2025 AI report: 51% of users building AI products are building agents (up from 21% the year before) |
| https://dev.to/olehvolos/users-can-tell-when-your-ui-was-ai-generated-and-they-dont-like-it-33kn | Yes (WebFetch, real body) | Names the exact generic-AI-UI tells and fixes (below) |
| https://noqta.tn/blog/ai-design-slop-overused-ui-patterns-fix-2026 | Yes (WebFetch, real body) | Five specific slop patterns with concrete token-level fixes (below) |
| https://www.w3.org/TR/WCAG22/ | Yes (WebFetch, real body, primary W3C spec) | The nine WCAG 2.2 success criteria verbatim (below) |
| https://developer.chrome.com/articles/scroll-driven-animations | Yes (WebFetch, real body, primary Chrome docs) | `scroll-timeline`/`view-timeline`/`animation-timeline`/`animation-range`/`timeline-scope` syntax and support notes (below) |
| https://www.ionos.com/digitalguide/websites/web-design/webdesign-trends/, designrush.com/trends, hostinger.com tutorials, firebrandagency.com | Search-snippet only, not individually fetched | 2026 trend chatter (bold typography, 3D/immersive, AI personalization, performance/sustainability framing) — directionally consistent with the Figma fetch above but **(to verify)** individually |
| Search synthesis on shadcn/ui, Radix, Base UI | Not fetched (no single authoritative page fetched this session) | Component-tooling state, below — treat specifics as **(to verify)** pending a direct fetch of ui.shadcn.com's own changelog |
| Search synthesis on variable fonts | Not fetched | Typography practice notes, below — **(to verify)** |

### Component libraries / design-engineering tooling (RESOLVED 2026-10-30 — see new dated section below for the
direct-fetch citations; original search-synthesized text kept below for the record, with each line's verdict noted)

- **shadcn/ui over Radix (or Base UI) is the 2026 default starting point** for new React builds, not a packaged
  dependency but a CLI that copies component source into the project — "ownership," not installation. **CONFIRMED
  (2026-10-30, direct fetch of ui.shadcn.com/docs)**, though the site itself never uses the literal word
  "ownership" — its own language is "shadcn/ui hands you the actual component code" and "This is not a component
  library. It is how you build your component library." This matters for this project's own build-orders
  discipline: a build order naming a shadcn component should expect the builder to get the SOURCE, not a black-box
  import, and can safely tell them to restyle it to tokens directly in that file.
- **Radix reportedly unified its per-component packages into one package around February 2026**, with a `shadcn
  migrate radix` CLI path off the old fragmented packages. **CONFIRMED (2026-10-30, direct fetch of
  ui.shadcn.com/docs/changelog/2026-02-radix-ui)** — exact and correct: the `new-york` style now imports from a
  single `radix-ui` package instead of per-component `@radix-ui/react-*` packages, and the exact migration command is
  `pnpm dlx shadcn@latest migrate radix` (npm/yarn/bun variants also given), optionally scoped to a path, e.g.
  `pnpm dlx shadcn@latest migrate radix src/components/custom`.
- **Base UI is now offered as an alternate primitive layer** to Radix inside the shadcn CLI (a `--base-ui` style
  flag). **CONFIRMED AND UPGRADED (2026-10-30, direct fetch of
  ui.shadcn.com/docs/changelog/2026-07-base-ui-default)** — as of July 2026, Base UI is the CLI's *default*, not
  merely an alternate option: `npx shadcn init` now selects Base UI by default; the flag to keep the old Radix
  behaviour is `-b radix` (e.g. `pnpm dlx shadcn init -b radix`), which the changelog explicitly recommends for CI/
  non-interactive scripts that expect Radix. The page states directly that Radix "is not being deprecated" and both
  libraries keep shipping new components going forward (except components that only exist in one).
- Practical takeaway for this file's existing React Bits guidance (SKILL.md already requires naming React Bits
  components before hand-rolling): shadcn/ui and React Bits are not competitors — shadcn covers structural/ARIA
  primitives (dialogs, selects, menus), React Bits covers decorative/motion components. A build order can legitimately
  cite both in the same section.

### AI-generated UI "tells" — what makes it look templated (fetched, not synthesized)

From the dev.to piece (fetched in full) — the generic-AI-UI anatomy:
- Default stack signature: Tailwind defaults + unmodified shadcn components, a blue-or-purple "vaguely familiar"
  primary color, a hero (headline/subheadline/CTA) + icon feature grid, rounded cards, soft shadows.
- The deeper tell isn't any one element — it's that "nobody made a decision here": every choice is the path of least
  resistance, not an intentional one.
- It breaks on REAL content: looks fine with dummy text/avatars, then breaks on a long username, an error string, an
  empty state, or truncated text — because it was only ever designed for placeholder data.
- Fixes given: change the primary color/radius/font before anything else; design against real content and edge cases
  early (not after); add one deliberately non-generated element (an unusual interaction, a characterful
  micro-animation, a layout choice that trades convention for identity); give onboarding/empty/error/loading states
  the SAME design attention as the hero, since these are exactly the states a generic build skips.

From noqta.tn (fetched in full) — five concrete, nameable slop patterns and their fixes:
1. **Oversized border-radius everywhere** (cards, buttons, inputs, badges, images all share one exaggerated radius,
   flattening hierarchy). Fix: a NAMED radius scale per role, e.g. `--radius-card: 6px` (restrained, not a blanket
   24px), `--radius-pill: 999px` reserved only for elements that are genuinely pill-shaped.
2. **Purposeless purple-to-blue glow gradients** on heroes/CTAs/backgrounds with no relationship to brand or state.
   Fix: a gradient must signal something specific (direction of attention, a real brand hue); use a real brand
   accent (example given: `oklch(62% 0.19 28)`) instead of a generic purple.
3. **Excessive letter-spacing applied reflexively** to every uppercase label/eyebrow regardless of whether it helps
   legibility at that size.
4. **Decorative "Live"/"New" badges with a pulsing dot** on features that are neither live nor new — a status
   indicator used as decoration, not as real status.
5. **A thick, single-sided colored border on an otherwise-rounded card** — named as one of the single most
   recognizable AI-generation signatures in 2026 output.
   Related: default Inter-everywhere typography (fix: one distinctive display face, e.g. Bricolage Grotesque, paired
   with a neutral body face — the same two-role discipline already established elsewhere in this file); vague
   "modern and clean"-style copy and briefs (fix: a design-token file with EXACT values, handed to any AI tool as
   context, rather than adjective-only direction).

**Synthesis with this file's existing Anti-slop section:** items 1 (radius), 2 (purple gradient — already partially
banned here as the "purposeless glow orb," now confirmed independently with a second, differently-worded source and
a concrete OKLCH alternative), and the Inter-as-display-face tell were ALREADY in this file from the 2026-09 pass;
items 3, 4 and 5 (excessive tracking on every label, decorative pulsing status badges, the thick one-sided card
border) are genuinely new and should be added to the Anti-slop numbered list (see Distilled checklist below).

### WCAG 2.2 — the nine new success criteria (fetched directly from the W3C spec; this is the actual current
accessibility baseline, not a vendor's restatement of it)

| # | Name | Level | What it requires |
|---|---|---|---|
| 2.4.11 | Focus Not Obscured (Minimum) | AA | A focused component must not be *entirely* hidden by other author-created content (e.g. a sticky header covering a focused input). |
| 2.4.12 | Focus Not Obscured (Enhanced) | AAA | No part of a focused component may be hidden by author-created content. |
| 2.4.13 | Focus Appearance | AAA | The keyboard focus indicator must meet a minimum size and contrast. |
| 2.5.7 | Dragging Movements | AA | Any function operated by dragging must also be operable without dragging (e.g. a slider needs click-to-set as well as drag). |
| 2.5.8 | Target Size (Minimum) | AA | Pointer targets must meet a minimum size, with defined exceptions (inline text links, essential small controls). |
| 3.2.6 | Consistent Help | A | A help mechanism present on multiple pages must appear in the same relative order/location each time. |
| 3.3.7 | Redundant Entry | A | Information the user already entered earlier in the same process should auto-populate or not be re-asked, unless re-entry is essential. |
| 3.3.8 | Accessible Authentication (Minimum) | AA | Login must not require a cognitive function test (e.g. solving a puzzle, memorizing/transcribing) unless an alternative method exists. |
| 3.3.9 | Accessible Authentication (Enhanced) | AAA | Same as above, with no exceptions allowed. |

(https://www.w3.org/TR/WCAG22/ — fetched directly; WCAG 2.2 became a W3C Recommendation in October 2023, so this is
now the CURRENT spec version, not a draft. Legal-mandate mapping (ADA Title II, EAA/EN 301 549) varies by
jurisdiction and several still reference 2.1 — but 2.2 AA is the responsible DEFAULT baseline for this project's own
builds regardless of which legal floor applies, since every 2.1 criterion is a strict subset of 2.2.)

**Practical build-order translation of the three most commonly missed new criteria:**
- **2.5.8 Target Size** — before this session's refresh, this file's pause-control and carousel-control rules (image
  rules section) didn't state a minimum hit-area number; treat **24×24 CSS px** as the practical minimum for any new
  tappable control (icon buttons, carousel arrows, close "×" buttons) unless it qualifies for an exception.
- **2.5.7 Dragging** — any custom slider, carousel-by-drag, or drag-to-reorder component built with React Bits/GSAP
  draggable needs a non-drag equivalent (buttons, keyboard arrows, or tap-to-select) shipped in the SAME build order,
  not as a follow-up.
- **3.3.8 Accessible Authentication** — a sign-up/login flow using a CAPTCHA-style puzzle, image-matching, or
  "copy this code" step needs a non-cognitive alternative (e.g. a passkey, email magic link, or object-recognition
  CAPTCHA with an audio/alternative path) — directly relevant to this project's own one-line-sign-up rule already in
  the playbook.

### Scroll-driven CSS animation — the native replacement for scroll-listener JS (fetched directly from Chrome's docs)

```css
/* Named scroll progress timeline on the scrolling container */
.scroller { scroll-timeline: --my-scroller inline; }

/* Named view progress timeline on the element being revealed */
.revealing-image {
  view-timeline-name: --revealing-image;
  view-timeline-axis: block;
}

/* Drive an animation from either timeline type */
.subject {
  animation: animate-it linear;
  animation-timeline: scroll(root block);   /* or view(axis), or a --named timeline */
  animation-range: entry 25% cover 50%;     /* valid names: cover, entry, exit, entry-crossing, exit-crossing, contain */
}

/* Hoist a named timeline up to an ancestor so non-descendant elements can use it */
.parent { timeline-scope: --tl; }
```
Critical gotcha (stated directly on the page): `animation-timeline` must be declared AFTER the `animation` shorthand
in source order, because the shorthand resets it — a build order that sets both needs to get the order right or the
timeline link silently breaks. For Scroll Progress Timelines, `animation-duration` should be `auto`.

**Support as stated on Chrome's own page:** Chrome/Edge 115+ fully supported; Safari 26 supported; Firefox listed as
"Technology Preview: supported" (independent search results disagreed on Firefox's exact stable-channel status —
some placed it still behind a flag as of mid-2026). **RESOLVED 2026-10-30 (direct fetch of caniuse.com's
`scroll-timeline` and `view-timeline` pages, not a search snippet): Firefox shipped stable support at version 159**
— both properties now show "not supported" for Firefox 2–158 and "supported" from 159 onward, matching Chrome/Edge
115+ and Safari 26+. See the 2026-10-30 section below for the full table; the `@supports(animation-timeline:
scroll())` + Lenis/GSAP fallback is no longer required for cross-browser coverage on current stable browsers — keep
it only as a courtesy for visitors on an older Firefox release, not as a load-bearing requirement. This directly
upgrades the existing Lenis/GSAP-driven scroll techniques already documented above (Inkling, The Academy) — for
simple reveal/progress effects (not the complex synced-canvas work those two sites do), native `view-timeline` +
`animation-range` is now a legitimate, lighter-weight alternative to a JS scroll-listener, with the JS version kept
only for effects timeline-driven CSS can't express (canvas-synced ink lines, WebGL scenes).

### Visual trends 2026 (Figma's own trend page, fetched directly — treat as one vendor's framing, but a primary fetch)

- **Saturated "dopamine design" is back**, displacing the muted/pastel minimalism that dominated 2023–2025 — driven
  by Y2K nostalgia and named explicitly as a reaction against years of beige/muted SaaS palettes. Relevant correction
  to this file's existing Maximalism recipe note: this is now a documented INDUSTRY swing, not just a style choice to
  flag as **(to verify)** per-site.
- **Kinetic/variable-type headlines**: hero type that responds to interaction/scroll via variable-font axes, not just
  a static display face — an upgrade path for this file's existing "pick one distinctive display face" rule: when
  the brief calls for it, a variable font (one file, many weights/widths via `font-variation-settings`) is now the
  mainstream way to get motion-responsive type without multiple font-weight downloads.
- **Dark mode is now a baseline expectation**, not a novelty toggle — ship both and default by `prefers-color-scheme`,
  consistent with this file's own existing colour-space-pinning rule (point 5, 2026-09-23 image section): a palette
  tuned once for light mode and merely inverted for dark will very often fail the same contrast math twice.
- **51% of people building AI products are now building agents** (Figma's own 2025 AI report, up from 21% the prior
  year) — relevant context for any build order that includes an AI chat/agent surface: expect the visitor's bar for
  "looks like a real agent, not a chatbot demo" to be higher in 2026 than it was even a year earlier.

---

## 2026-10-30: verifying the 2026-10-29 "to verify" flags, plus one new research pass

Scope: this session's job was narrower than a fresh trend sweep — go back through every item the 2026-10-29 section
marked **(to verify)** or flagged as unconfirmed/secondary-sourced, and actually fetch the primary source to settle
each one, then do one genuinely new pass. All corrections below were also applied inline at their original location
above (search for "RESOLVED 2026-10-30" or "CONFIRMED (2026-10-30"). This section is the detailed record of what was
checked and how.

### Sources (new this session)

| URL | Fetched? | Take |
|---|---|---|
| https://ui.shadcn.com/docs | Yes (WebFetch, real body) | shadcn/ui's own framing of the copy-source-not-install model |
| https://ui.shadcn.com/docs/changelog | Yes (WebFetch, real body) | Full Jan–Oct 2026 changelog index with every entry title and slug |
| https://ui.shadcn.com/docs/changelog/2026-02-radix-ui | Yes (WebFetch, real body) | The Radix package-unification change, with the exact migration CLI command |
| https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default | Yes (WebFetch, real body) | Base UI becoming the CLI's default, with the exact `-b radix` flag to opt back into Radix |
| https://caniuse.com/mdn-css_properties_scroll-timeline | Yes (WebFetch, real body) | Per-browser version ranges for `scroll-timeline` |
| https://caniuse.com/mdn-css_properties_view-timeline | Yes (WebFetch, real body) | Per-browser version ranges for `view-timeline` |
| https://www.ionos.com/digitalguide/websites/web-design/webdesign-trends/ | Yes (WebFetch, real body) | Confirms accessibility is framed as the #1 2026 trend, with ADA/WCAG AA detail |
| https://www.builder.io/blog/view-timeline | Yes (WebFetch, real body) | A real `view-timeline` tutorial (Steve Sewell, Builder.io, dated 2025-10-14) — see caveat below: this is NOT a shipped-product case study, correcting a search-snippet's implication that it was |
| https://caniuse.com/?search=scroll-timeline, https://developer.mozilla.org/.../animation-timeline | Attempted, returned no usable version table via WebFetch (sidebar/search-results content only, not the compat table) | Superseded by the two direct caniuse per-feature URLs above, which did return real tables |
| Search sweep for named flat-design, skeuomorphism, and spatial-UI shipped sites | WebSearch only, no single primary page settled a named example | Remains **(to verify)** — see below |

### shadcn/ui, Radix, Base UI — fully resolved, all three original claims correct

1. **"Ownership, not installation" model.** Confirmed by direct fetch of `ui.shadcn.com/docs`, though the site's own
   wording is "shadcn/ui hands you the actual component code" and "This is not a component library. It is how you
   build your component library" — not the literal word "ownership." The practical claim (CLI copies source into
   the project, not a package import) is correct.
2. **Radix package unification.** Confirmed by direct fetch of the dated changelog entry
   (`2026-02-radix-ui`): the `new-york` style now imports everything from one `radix-ui` package instead of many
   `@radix-ui/react-*` packages, and ships an exact migration command: `pnpm dlx shadcn@latest migrate radix` (with
   npm/yarn/bun equivalents), optionally scoped to a path like `src/components/custom`.
3. **Base UI CLI flag.** Confirmed AND upgraded by direct fetch of `2026-07-base-ui-default`: Base UI isn't merely
   "offered as an alternate" as the 10-29 text hedged — as of July 2026 it is the CLI's *default* (`npx shadcn init`
   picks it automatically). The flag is `-b radix` to keep the old Radix behaviour, which the changelog recommends
   explicitly for CI/non-interactive scripts. Radix is stated as "not being deprecated" — both primitive layers keep
   receiving new components.

**Build-order implication:** a build order can now say "run `npx shadcn init`" without naming a primitive layer and
get Base UI; a build order targeting an existing Radix-based codebase, or a CI script, needs the explicit `-b radix`
flag to avoid silently switching primitive layers mid-project.

### Firefox `scroll-timeline`/`view-timeline` support — resolved, the gap has closed

The 2026-10-29 section correctly flagged this as inconsistent across secondary sources. A direct fetch of caniuse.com's
own per-feature pages (not a search snippet, not the general search results page, which returned no usable table)
gives an unambiguous answer:

| Property | Chrome/Edge | Firefox | Safari (desktop + iOS) |
|---|---|---|---|
| `scroll-timeline` | supported since 115 | **supported since 159** (unsupported 2–158) | supported since 26.0 |
| `view-timeline` | supported since 115 | **supported since 159** (unsupported 2–158) | supported since 26.0 |

This means the file's own existing guidance to "wrap any production use in `@supports(animation-timeline:
scroll())` with a Lenis/GSAP ScrollTrigger JS fallback" is no longer a hard cross-browser requirement on current
stable releases of all four engines — it should be kept only as a courtesy for visitors on an older Firefox, the
same way any progressive-enhancement gate is kept for stragglers, not presented as mandatory. `skills/web/references/
scroll-animation-reference.md` (and its `skills/web-specialist/` mirror and `flatten/web.prompt.md`) previously
stated "Firefox: not supported" as of a 2026-10-06 check and have been corrected in this same session — see the
Sync section below.

**Caveat on the new research pass's own first attempt:** a WebSearch for a "shipped product using scroll-timeline"
surfaced a result titled "See how Frete cut frontend build time by 70%" linking to Builder.io's `/blog/view-timeline`
page. Fetching that URL directly showed the search snippet's framing was wrong — the page is a tutorial by Steve
Sewell (Builder.io), dated 2025-10-14, about building an Apple-style sticky-video scroll effect with `view-timeline`,
`timeline-scope`, and `view-timeline-inset`; it does not mention Frete or any named shipped product. This is flagged
here explicitly as a correction to a plausible-looking but wrong search-snippet claim, consistent with this file's
own "don't trust a snippet, fetch the page" discipline. A further WebSearch sweep for a genuinely named, shipped
production site using `scroll-timeline`/`view-timeline` with measurable results did not turn up one — treat "a
concrete current example of a shipped product using the scroll-timeline API" as **genuinely unverifiable this
session**, not just unconfirmed; every lead that looked like a case study turned out to be a tutorial, a syntax
reference, or an unnamed/generic claim on fetch.

### IONOS accessibility-as-trend claim — confirmed

Direct fetch of `ionos.com/digitalguide/websites/web-design/webdesign-trends/` confirms the 10-29 note: accessibility
is listed as the #1 of "15 web design trends" for 2026, framed partly as a legal necessity (ADA for US businesses
open to the public and government entities), with WCAG (particularly Level AA) named as the de facto standard. The
page also separately notes neumorphism's low-contrast problem is pushing that trend toward higher-contrast variants
— corroborating, from an independent source, this file's own existing neumorphism accessibility framing (CSS-Tricks
community consensus, 2026-10-29 section). Hostinger's "bold typography" claim and DesignRush's VUI/AR claims were
not re-checked this pass (time/scope) and remain **(to verify)**.

### Flat design, skeuomorphism, and spatial-UI real examples — still genuinely unverifiable

The 2026-10-29 section flagged these three styles as missing a real, directly-fetched example. This session ran a
further WebSearch sweep (not full fetches — these are generic listicle topics, not single authoritative pages) for
named 2026 examples:

- **Flat design:** Multiple agency/listicle roundups exist (My Codeless Website's 34–35 example list, Speckyboy's
  50-example list, Designmodo, DesignRush) but no single page functions as a primary source the way the Figma trend
  page or a vendor changelog does — these are marketing-content aggregations, and specific named sites rotate
  between them inconsistently. **Remains (to verify)** — genuinely unverifiable to a single confident citation
  without picking one listicle's picks as fact, which this file's own standard refuses to do.
- **Skeuomorphism:** A UX-design substack piece and a data point from superdesign.dev (208,000+ tracked design
  generations, Jan–Jun 2026: full visual realism under 0.1% of prompts) corroborate that skeuomorphism is rare but
  persists specifically in music-production software as "a few tactile touches on a flat base," not full realism.
  No specific *named, currently-shipped* app was confirmed by a direct fetch — commentary and Dribbble concept work
  are not the same as a verified shipped product. **Remains (to verify)** for a specific site/app name.
- **Spatial UI:** No new search or fetch run this session; still **(to verify)**, unchanged from 2026-09-23/29.

### New research pass: component-tooling adoption beyond shadcn/Base UI/Radix

Beyond re-verifying the 10-29 shadcn claims, a fresh WebSearch for what's newly gaining adoption (not covered in the
10-29 pass) surfaced:

- **Base UI's July 2026 promotion to shadcn's default** (confirmed above) is independently corroborated by a
  third-party guide (uxmagic.ai, updated August 2026) reporting the same change and that Radix remains supported —
  two independent sources now agree, beyond this session's own primary-source fetch.
- **Base UI's maintainer lineage** is relevant context for why shadcn trusted it enough to make it the default: it's
  built by the same team responsible for Radix, Floating UI, and Material UI (per Builder.io's 2026 React
  component-library roundup and Base UI's own Product Hunt listing) — continuity of the accessibility/primitives
  expertise, not a clean-slate newcomer.
- **No other single named library** surfaced across multiple independent sources as a comparably significant new
  adoption shift in the last 1–2 months (Sept–Oct 2026) beyond the shadcn/Base UI story already covered — Tailgrids
  3.0 was named in one roundup as a 2026 Tailwind-based React library with a CLI, but only one source named it, so
  it's noted here as a lead, not a confirmed trend, and not added to the Distilled checklist.

### Sync: what changed in `skills/web/references/` (and mirrors)

`skills/web/references/scroll-animation-reference.md`, its `skills/web-specialist/` mirror, and
`flatten/web.prompt.md` all previously stated a browser-support table row dated "confirmed 2026-10-06" saying
**"Firefox: not supported"** for native CSS scroll-driven animations, and a parallel sentence calling Firefox's
stable-channel status "inconsistent across sources even in 2026 (some place it still flag-gated)." Both were
corrected in all three files this session to state Firefox has shipped support since version 159 (confirmed via the
2026-10-30 caniuse.com fetch above), with the existing `@supports` + Lenis/GSAP fallback reframed as a courtesy for
stragglers rather than a load-bearing cross-browser requirement. The shadcn/Base UI/Radix findings were NOT added as
new content to `skills/web/references/` — no existing file there currently states the specific ownership/Radix-
unification/Base-UI-default claims this session verified, so there was nothing stale to correct; adding brand-new
tooling trivia to the skill files was judged out of scope for a verification pass (that's new-content work, better
suited to the next deep-refresh pass that already has a pattern for pulling research-note findings into the skill
files wholesale).

---

## 2026-10-31: AI-slop → professional conversion: the mechanics

Scope: a third, narrow pass answering one question only — HOW do working designers and design-adjacent practitioners
actually take an AI-generated/templated interface (Lovable/v0/Bolt/Cursor output) and convert it into something that
reads as deliberately, professionally designed? This does not repeat the existing Anti-slop section's TELLS (the
grey-border, eyebrow, purple-glow, three-card-row list already above and already in `anti-slop-checklist-reference.md`)
— it is the FIX mechanics, not the tell inventory. No single named design agency (Linear/Stripe/Vercel design-team
blog, a named studio) published a direct "how we de-sloppify AI output" case study that turned up in this session's
search — the primary sources here are 2026 practitioner/tooling write-ups that were each directly fetched and that
converge independently on the same handful of mechanical moves. Where a source gave a real number or exact value,
it's quoted; where it only gave a qualitative instruction, it's marked as such rather than invented. No before/after
agency case study with real screenshots was found or fetched this session — flagged as an open question below.

### Sources (new this session, all fetched in full)

| URL | Fetched? | Take |
|---|---|---|
| https://world.hey.com/kostac/spot-the-slop-a-ui-designer-s-guide-to-fixing-ai-defaults-4c448c9c | Yes (WebFetch, real body) | "Spot the Slop" (Kosta Canatselis, July 2026) — font-first sequencing, functional colour naming, deliberate hierarchy-breaking, voice-test for copy, unhappy-path design budget, process discipline |
| https://uimotionprompts.com/blog/how-to-fix-ai-slop-website | Yes (WebFetch, real body) | A timed, four-step fix recipe with an explicit third-party verification step and time budget |
| https://www.freeformsystems.ai/blog/anti-slop-design-system | Yes (WebFetch, real body) | 20 named AI tells across UI/photo/logo with the most specific numeric fixes found this session (max-widths, spacing deltas, weight counts, radius choices) |
| https://www.candede.com/articles/escaping-ai-slop-in-web-design/ | Yes (WebFetch, real body) | The "identity test" and "divergence" verification framing — the clearest *checkable-step* (not vibes) language found |
| https://www.925studios.co/blog/ai-slop-web-design-guide | Yes (WebFetch, real body) | Functional color-token naming convention, "sibling test," and real agency cost bands for a typography/color pass vs. a full rebrand |
| https://vibecodekit.dev/ai-slop-design | Attempted, DNS failure (`ENOTFOUND`) — not fetched, not cited for any claim | — |

Searches that did NOT surface a usable primary source this session (named here so a future pass doesn't re-try them
expecting a different result): a direct Linear/Stripe/Vercel design-team blog post specifically about fixing
AI-generated UI; a named design agency's public before/after case study of a Lovable/v0/Bolt redesign; the original
"AI slop design fix" Twitter/X thread the operator's brief referenced (searches found only secondary write-ups
plausibly describing the same territory, not the thread itself).

### The mechanics, synthesized across all five fetched sources (convergent points marked; single-source points flagged)

**1. Sequencing: fix the font before anything else, then color, then layout/motion last — this exact order is
independently stated by two sources.** Canatselis (Spot the Slop) calls font replacement "the single highest-leverage
move against slop" and sequences it first; uimotionprompts.com's four-step recipe puts "replace the visual language"
(type + color + radius + layout) in step 2, after locking copy, and motion explicitly last in step 3 — "motion on top
of generic visuals just makes generic visuals move" (uimotionprompts.com, restated independently in the WebSearch
synthesis above). **Mechanical rule: never spend the first fix pass on animation or micro-interactions; spend it on
the type face and the color tokens, because a motion layer added to an unfixed visual skeleton only moves the
genericness around.**

**2. Lock the copy before touching styling, so a redesign pass can't accidentally become a rewrite.**
uimotionprompts.com's actual Step 1 is to paste an instruction that freezes all user-visible text (headings, body,
button labels, testimonials, pricing) and permits changes only to tokens/component styling/layout/spacing — then,
after the pass, read every headline and button IN ORDER against the original and treat any unapproved text change as
a regression. This is a concrete, checkable step (diff the copy, not just "does it look better") distinct from every
other source's advice, which is purely visual.

**3. Rename color tokens by function, not by appearance — a mechanical, grep-able fix.** Two independently-fetched
sources give the identical technique with different example names: Canatselis says if tokens are named
`gradient-start`/`gradient-end`, rename them "for what they do" (primary action, warning, success); 925studios.co
gives the concrete before/after pair `--color-gradient-start` → `--color-action-primary` /
`--color-feedback-success`. **This is checkable**: grep the token file for any `-gradient-` or purely descriptive
(`-blue-`, `-purple-`) token name — if a color variable's NAME doesn't describe its JOB, the palette was picked
decoratively, not functionally, regardless of how the hex values look in isolation.

**4. Break uniform spacing/radius with a stated ratio, not a vibe.** freeformsystems.ai gives the most numerically
specific version found this session: section padding 80–120px (not the generic 40px default), heading margin
48–64px above, and "when you think you have enough whitespace, add 50% more." It gives a worked spacing-by-section
example: 120px below a hero, ~80px above and ~60px below a testimonial block — i.e. spacing is a DELTA between
sections' importance, not one constant gap repeated everywhere. Canatselis's parallel framing: the slop example is
"the same 16px radius and 24px padding" everywhere; the fix is to vary both BY IMPORTANCE — "make the primary thing
bigger, closer, heavier," "let the secondary things recede." uimotionprompts.com's radius fix: "a radius scale tied
to component size, not the same large radius on every element" (consistent with, and a second independent source
for, this file's and the checklist's existing named-radius-scale rule). **Mechanical check: pick any two adjacent
sections on the page and confirm their vertical gap and corner radius are NOT numerically identical to any other
same-level pair elsewhere on the page** — identical spacing between every section pair, measured, not eyeballed, is
the uniformity the sources are naming.

**5. Force asymmetry with a named ratio, not an adjective.** freeformsystems.ai: use 60/40 or 70/30 grids instead of
50/50; with four cards, make one 2x wide instead of four equal columns. uimotionprompts.com's parallel "layout
break" instruction: make the third section explicitly half-width, overlap an image into the next section, or drop a
heading — one deliberate structural break is enough, not a redesign of every section. **Mechanical check: state the
actual column-width ratio used in the riskiest/most-visible grid on the page — if it reduces to a round fraction like
50/50 or four equal columns, it hasn't been broken yet.**

**6. Typography: a named weight count and a named pairing, not "pick a nicer font."** freeformsystems.ai requires at
least THREE font weights used with distinct roles: 300 for display headings, 400 for body, 600 for uppercase labels
with letter-spacing — a single-weight page (usually 400 or 500 everywhere) is itself a named tell. Multiple sources
(925studios.co, Canatselis, uimotionprompts.com) converge on the same two-role fix: one display face for
personality/headlines + one separate, readable face for body — never Inter (or any single system-safe sans) doing
both jobs. 925studios.co's real example pairings: Playfair Display or Bricolage Grotesque for display, paired with a
plainer body face; JetBrains Mono named as a legitimate label/mono face in the same system. **Mechanical check: count
distinct font-weight values actually used in the rendered CSS — fewer than 3 with distinct roles is a fail, matching
this file's existing weight-discipline framing but now with the specific 300/400/600 role mapping.**

**7. Replace every stock/placeholder visual with the real thing — named as the single biggest credibility upgrade by
an independent WebSearch synthesis AND by 925studios.co's direct fetch.** "A real screenshot, even cropped tight, is
the single biggest credibility upgrade" (WebSearch synthesis, corroborating this file's own existing `images and
assets` priority order in the checklist file). 925studios.co: replace every stock photo with a real product
screenshot, a real team photo, or a custom illustration — not a generic AI-tell fix, a content-sourcing fix.
uimotionprompts.com's parallel hero-specific instruction: "one tight crop of a real product screenshot instead of
gradient blobs or illustrations" as one of only four manual edits in its entire recipe — i.e. of a short, prioritized
list, a real-content swap in the hero earns one of the few slots.

**8. Swap vague copy for one concrete, falsifiable detail — a repeatable, line-level edit.** uimotionprompts.com:
"replace each vague line with a number, a named customer, or an exact use case" as one of its four manual edits.
Canatselis: rewrite every line in a founder's actual voice, tested line-by-line with "would our founder actually say
this out loud?" — repeated until yes. 925studios.co gives the identical voice-test independently. **Mechanical check,
convergent across three sources: read each headline/subhead aloud as a sentence a specific named person would say —
if it's generic enough to belong to any competitor's page with the logo swapped, it fails (this is the same test as
the "identity test" below, applied at the copy-line level instead of the whole-page level).**

**9. One deliberate, non-generated "signature" element — not a redesign, one unexpected choice.** uimotionprompts.com
calls this out as its fourth manual edit, giving three interchangeable examples: a non-default accent color used
somewhere specific, a custom cursor on the main button, or a footer signature/easter egg. This corroborates, with
concrete named examples, this file's/the checklist's existing "add one deliberately non-generated element" framing
(2026-10-29 section, dev.to source) — now with specific, cheap candidate implementations rather than just the
instruction to add one.

**10. Motion: sequence and justify, don't decorate — and the justification itself must be a one-word category.**
Canatselis and 925studios.co converge on the same three legitimate reasons for any animation to exist: it signals a
state change, it directs attention, or it reinforces brand personality — anything else gets removed. Both name
starting the motion pass on the PRIMARY button and form inputs specifically (not the hero, not a scroll reveal) as
the correct first target. uimotionprompts.com's parallel step: define spring values per interaction TYPE (not
per-element), add stagger to lists, coordinate entrance/exit pairs, and always include a reduced-motion fallback —
though none of the three sources gave an actual numeric spring/duration value, so treat "define spring values" as a
process instruction, not a specific recipe (this file's existing Motion Rules section already has the concrete
numbers — enter/exit ratio ~60–70%, animate only transform/opacity/filter — and should stay the numeric source of
truth; these new sources only add the "justify by category" gate).

**11. Verification as a checkable step, not a vibe — three distinct, genuinely mechanical tests found.**
- **The stranger test (uimotionprompts.com, with a stated failure threshold):** show the site to three people who
  have not seen it, ask them whether it looks AI-generated, and have them literally circle generic elements. **If two
  of three say yes, the fix failed — return to the visual-language step.** This is the only source in this session
  that gives a numeric pass/fail bar (2-of-3) rather than a subjective "does it feel right."
- **The identity test (candede.com):** "could this page belong to ten unrelated startups after replacing the logo?"
  — paired with a second, sharper version: can you state the page's visual rules in ONE sentence? If the rules can't
  be stated that concisely, or the page would survive a logo swap unchanged, it hasn't actually committed to a
  direction yet.
- **The sibling test (925studios.co, implied by its own worked examples):** if the page could swap wholesale with a
  direct competitor's page, or with a page from an unrelated industry, with zero changes needed beyond the logo, it
  still reads as slop regardless of how polished any individual element is.
  **Practical synthesis for this project's own existing pre-flight check:** these three tests are the same test
  asked three ways (logo-swap, sibling-swap, stranger-judgment) — running any ONE of them as a literal, stated step
  before calling a build done is more rigorous than the existing checklist's implicit "does this look templated"
  framing, because each gives an actual yes/no output instead of a self-assessment.

**12. Build a small, named design system BEFORE scaling past one page — not a stylistic nicety, a repeatability
mechanism.** 925studios.co: build a brand-specific component library (a Figma library + a CSS variable sheet) that
overrides AI defaults at the SYSTEM level, so every new page starts from the corrected base rather than from the
tool's own un-themed default — and review every new page against that system before publishing. This matches, and
gives a second independent source for, this file's/the playbook's existing `docs/design/DESIGN.md` token-locking
discipline; the new detail is the explicit claim that skipping this step is why slop re-appears page-by-page even
after one page was fixed by hand.

**13. Cost/effort bands as a real-world calibration (925studios.co, directly fetched, treat as one agency's
pricing, not a universal number):** a typography-and-color-token overhaul (steps 3, 4, 6 above) runs roughly
$2,000–$5,000 with an agency; a full rebrand (components, real photography, copy) runs roughly $15,000–$50,000. Useful
context for this project's own build orders: the FIRST tier of fixes (fonts, token renaming, spacing deltas) is
explicitly the cheap, fast, high-leverage pass — consistent with point 1's sequencing finding that type+color should
come before any heavier investment in photography or a component system.

### What this corrects or sharpens in the existing Anti-slop material

- The existing checklist already bans "one blanket border-radius value" and requires a named radius SCALE — this
  session adds the specific weight-count mapping (300/400/600 by role) as the equivalent discipline for type weight,
  which the existing file did not state as a counted minimum.
- The existing checklist's "must not break on real content" rule is about EDGE CASES (long names, error strings);
  this session's point 7 is a narrower, additional claim specifically about HERO/PRIMARY imagery — a real screenshot
  in the hero is independently named, across two sources, as the single highest-leverage visual swap, which the
  existing file does not currently rank or prioritize among its several imagery rules.
- The existing checklist has no literal PASS/FAIL verification step for "does this look templated" — it has
  mechanical checks for specific tells (eyebrow count, em-dash count, etc.) but nothing analogous for the WHOLE-PAGE
  generic-read question. Point 11 (the three convergent tests) is new and belongs in the pre-flight check specifically
  because it gives a numeric bar (2-of-3 testers) rather than asking the builder to self-judge.
- The functional-token-naming rule (point 3) is genuinely new to this file — the existing OKLCH/color-selection
  material covers HOW to derive a palette, not how to NAME the resulting variables so a later reviewer can grep for
  decorative leftovers.

### Open questions

- No design agency's own published before/after case study (with real screenshots, not described in prose) of
  converting a specific Lovable/v0/Bolt/Cursor output into a shipped redesign was found or fetched this session.
  Every source found is a practitioner blog post or tooling vendor's write-up describing the METHOD, not a documented
  single project. Treat "a named, shipped before/after conversion case study" as **(to verify)** — a follow-up
  session with access to a headless-browser-capable fetch (for sites that block WebFetch, or for X/Twitter threads
  specifically, which this session's WebSearch could not locate the original of) would be needed to close this gap.
- `vibecodekit.dev/ai-slop-design` could not be fetched this session (DNS failure) despite surfacing in search
  results with specific-sounding claims (a palette cap, a font-pairing rule, a contrast-measurement script, DESIGN.md
  token locking). Nothing from that domain is cited above. Worth a retry in a future session rather than treating the
  WebSearch snippet summary as settled fact.
- None of the five fetched sources gave actual numeric spring/duration/easing values for the motion layer (point 10)
  — this file's own existing Motion Rules section (2026-10-18 material, already in the checklist) remains the only
  numerically specific source on file for that; a future pass specifically targeting motion-design blogs (not
  AI-slop-fix blogs) would likely do better there.

---

## 2026-10-31, pass 4: color and positioning — what users actually flag

Scope: triggered by real end-user feedback that a shipped product's "positioning, colors and UI chosen look bad."
This is narrower than the AI-slop passes above — it's not about spotting generator tells, it's about the two specific
complaint categories (color, layout/positioning) and turning each into a mechanical, checkable gate rather than a
taste judgment. Existing file material already covers palette *selection* (`color-selection-reference.md`'s
60-30-10, harmony schemes, OKLCH, color blindness) in depth — this pass does not re-derive that; it covers the
**contrast/legibility and semantic-mismatch failure modes that make a shipped palette draw complaints even when the
hue choices were reasonable**, plus layout/positioning research that had no prior pass in this file at all. Every
NN/g, WebAIM and W3C claim below was directly fetched this session, not pulled from a search snippet — numbers are
quoted exactly as the primary source states them.

### Sources (new this session, all fetched in full unless marked)

| URL | Fetched? | Take |
|---|---|---|
| https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/ | Yes (WebFetch) | The original 2006 eyetracking study: 232 users, thousands of pages, the three-part F shape, and the design implication (front-load information, don't fight the pattern) |
| https://www.nngroup.com/articles/ten-usability-heuristics/ | Yes (WebFetch) | Nielsen's 10 heuristics, exact current wording (reviewed Jan 2024) — Consistency and Standards, Aesthetic and Minimalist Design, Recognition Rather than Recall are the three most load-bearing for a "looks bad" complaint |
| https://www.nngroup.com/alertbox/banner-blindness.html / nngroup.com/articles/banner-blindness-old-and-new-findings/ | Partial (WebSearch summary of NN/g's own pages, not a full WebFetch) | Banner blindness mechanism and the three trigger signals (ad-specific placement, ad-like visual treatment, proximity to real ads/promotions) |
| https://webaim.org/projects/million/ | Yes (WebFetch) | The WebAIM Million report's current exact stats on low-contrast text and ranked failure types |
| https://polypane.app/blog/debug-your-visual-hierarchy-with-the-squint-test/ | Yes (WebFetch) | The squint test's exact mechanical steps, corroborating NN/g's own squint-test video page |
| https://www.nngroup.com/videos/squint-test/ | Found via search, not separately fetched (polypane's fetch covers the same method) | NN/g's own naming/endorsement of the squint test as a hierarchy-debugging tool |
| https://becoming-a-teacher.design-history.education.gov.uk/manage-teacher-training-applications/changing-the-way-we-use-red-warning-buttons | Yes (WebFetch) | A real, named GOV.UK product team's documented color-semantics mistake and fix — the clearest sourced case study found this session for "red used on a non-destructive action confuses users" |
| W3C WCAG 2.1 Understanding, SC 1.4.3 Contrast (Minimum) | Referenced via WebSearch synthesis of the W3C understanding doc, not separately WebFetched this session (the exact 4.5:1/20-40-vision rationale is stable, stated the same way across multiple fetches in prior passes) | Why 4.5:1/3:1 were chosen, not just that they exist |
| Meta Horizon design guidelines (developers.meta.com) / Wikimedia Phabricator T225518 / Tor Browser gitlab issue 41084 | Not directly fetched (WebSearch synthesis only) — treat as **(to verify)** for exact wording, but the pattern (three independent real projects separately flagging and fixing red-on-non-destructive-action) is itself the finding | Corroborating, lower-confidence evidence that the GOV.UK case isn't a one-off |

Searches that did not surface a usable primary source this session: a direct NN/g article specifically measuring
"UI looks bad" or "color looks off-brand" user complaints as a named study (NN/g's color coverage is folded into
broader visual-hierarchy/contrast articles, not a standalone "bad color" study); a controlled, peer-reviewed study
isolating button-color semantic mismatch as the sole variable (every source found is a real product team's
documented fix, not a controlled experiment — treat the *direction* as well-evidenced and any specific percentage
claim about it as unverified).

### (a) Color: why real users flag it, and the mechanical checks that catch it before they do

**1. Low-contrast text is not a rare mistake — it is the single most common accessibility failure on the production
web, measured at scale.** WebAIM's Million report (webaim.org/projects/million, directly fetched): low-contrast
text was detected on **83.9% of home pages** in its most recent run (up from 79.1% the year before), averaging **34
distinct low-contrast instances per page** — and low-contrast text is the single largest category in the **95.9% of
home pages** that have at least one detectable WCAG 2 failure. Four more categories (missing alt text 53.1%, missing
form labels 51%, empty links 46.3%, empty buttons 30.6%) round out six categories that account for 96% of all
detected errors. **Mechanical check, not a vibe:** run every body-text/background and button-text/background pair
through WebAIM's contrast checker (or an equivalent automated axe/Lighthouse contrast audit) before shipping — given
how common this failure is in real shipped sites, "I eyeballed it and it looked readable" is not a sufficient check,
because the baseline failure rate across the entire measured web is over 4 in 5 home pages.

**2. The 4.5:1/3:1 thresholds exist for a stated physiological reason, not an arbitrary round number — worth knowing
so a stakeholder pushback ("it looks fine to me") can be answered with the mechanism.** The W3C's own Understanding
document for SC 1.4.3 states the 4.5:1 ratio for normal text was chosen specifically to compensate for the contrast
sensitivity loss typical of someone with roughly 20/40 vision — i.e. the number is calibrated against a real,
common visual-acuity reduction, not picked for being round. Large text (18pt/24px regular, or 14pt/18.67px bold)
drops to 3:1 because larger glyphs remain legible at lower contrast. **Checkable rule: classify every text/background
pair by its actual rendered size and weight before picking a ratio to test against — a 14pt bold label still needs
to be checked as "large text" (3:1) but a 14pt *regular* label is normal text and needs the full 4.5:1, a distinction
worth stating explicitly because it's the single most common place a borderline pass/fail gets misjudged.**

**3. A color used for one semantic meaning somewhere on the page and a different, conflicting meaning somewhere else
is a real, documented, repeatedly-independently-fixed mistake — not a style nitpick.** The clearest sourced case:
GOV.UK's own teacher-training-applications team (directly fetched blog post) found they had used a **red warning
button for an action users were expected to perform regularly** (marking a condition "not met") while reserving red
elsewhere for genuinely destructive, non-undoable actions — inconsistent with their own design system's stated rule
that warning buttons are for destructive actions only. Their own stated diagnosis: "using warning buttons for
actions the user is expected to perform regularly may alarm users unnecessarily" and makes users *less* likely to
pause before a genuinely destructive click, because the color has been desensitized through overuse. Their fix was
narrow and specific — red reserved for exactly one action (removing a user from an organization, which is
non-undoable) and nothing else. Lower-confidence but convergent corroboration (not independently fetched, WebSearch
synthesis only, **(to verify)** for exact wording): Meta's Horizon design guidelines reportedly instruct against using
a destructive-styled button for a non-destructive action; a Wikimedia tracker ticket reportedly describes changing a
red "cancel" button to gray because canceling isn't destructive; a Tor Browser tracker issue reportedly flagged red
used on two actions that weren't actually dangerous. **Mechanical check: list every place a single color (especially
red, but the same check applies to green-for-success) is used in the live UI and write down, next to each instance,
the specific meaning it's communicating there — if the same color carries two different meanings anywhere on the
same product, or if it's used on an action the user is expected to take routinely, that's a fail, regardless of
whether the hex value itself is well-chosen.**

**4. Banner blindness means a color/placement combination that merely *resembles* an ad gets ignored even when it is
real, important content — a positioning-adjacent color failure.** NN/g's own banner-blindness material (summarized
via WebSearch of nngroup.com's own pages, not independently WebFetched this session but citing NN/g's named
"hot-potato phenomenon" from Nielsen & Pernice's *Eyetracking Web Usability*): the trigger signals are **ad-specific
placement** (top of page, right rail), **ad-like visual treatment** (bright color blocks, animation), and **proximity
to actual ads or promotions** — any one of these three is enough to get a real, non-ad element ignored. **Checkable
rule: if a genuinely important UI element (a real CTA, a real notice) sits in a top-banner or right-rail position AND
uses a bright, boxed, ad-styled visual treatment, treat that combination itself as the defect** — the fix is moving
the element out of the ad-shaped slot or changing its visual treatment so it reads as content, not promising "users
will probably still notice it."

**5. Practitioner color-system tooling, named for completeness (not independently re-verified this session, this
file's existing `color-selection-reference.md` already covers the underlying theory in more depth):** WebAIM's
contrast checker (webaim.org/resources/contrastchecker) for the pass/fail ratio math; Coolors and Realtime Colors are
widely-used practitioner tools for generating and live-previewing a palette against real UI before committing to it
— cited here as the concrete tool names a build order can point to, not as a substitute for running the actual WCAG
math.

### (b) Positioning/layout: why real users flag it, and the mechanical checks that catch it before they do

**6. Users scan in a predictable, non-random shape, and a layout that ignores it buries content that was placed in a
low-attention zone.** NN/g's original 2006 eyetracking study (directly fetched, 232 users, thousands of pages across
three page types — a corporate "about us" page, an e-commerce product page, and a search results page): the dominant
pattern is a horizontal sweep across the top, a shorter horizontal sweep lower down, and a vertical scan down the
left edge — forming a rough F (variants: a longer E-shape with a third horizontal sweep, or a single-sweep inverted
L). The article's own stated implication: most users skim rather than read word-for-word, so **the first two
paragraphs should carry the most important information, with more weight on the first, and subheads/paragraphs/bullets
should front-load the information-carrying word** because the eye reads the first word or two on a line far more
reliably than the third onward. The pattern also held in an NN/g-cited eleven-years-later follow-up and is reported
to mirror for right-to-left languages. **Checkable rule: for any content-heavy section (not a hero, not a card grid —
specifically body copy, long feature descriptions, article-style content), check that the single most important
sentence or value in each paragraph/bullet is its FIRST clause, not buried mid-sentence or at the end** — this is a
copy-structure check, not a visual one, and it is the direct, sourced reason "put the important thing first" is more
than a cliché.

**7. The squint test is a real, nameable, mechanical hierarchy check — not a subjective once-over.** NN/g has its own
named video on this technique; the exact mechanical steps (independently confirmed via a directly-fetched practitioner
writeup that cites the same method): blur your vision (physically squint, step back from the screen, or use a blur
filter) until fine detail disappears and only large shapes/colors remain, then check five things against what
*should* be true: (1) is there still one clear, recognizable focal point (the primary CTA or topic)? (2) do visually
related elements (a heading and its body text) still read as grouped, or does the spacing make them look unrelated?
(3) does anything gain prominence from contrast/color that *shouldn't* — a decorative divider or background
competing with the real focal point? (4) is the logo/brand still recognizable at this blur level? (5) are clickable
elements still visibly distinct from static text (an underline alone can vanish at this blur level — a color
difference is what survives)? **Checkable rule: run this literally — take an actual screenshot, blur it (CSS
`filter: blur(8px)` on a copy, or a real squint), and name out loud which single element is still the most visually
dominant. If it isn't the thing that should be most important on that screen, the hierarchy has a real, demonstrable
defect, not a matter of opinion.**

**8. Nielsen's own heuristics give three specific, nameable mechanisms for "feels off even when I can't say why."**
Directly fetched exact current wording (nngroup.com, reviewed Jan 2024): **Consistency and Standards** — "users
should not have to wonder whether different words, situations, or actions mean the same thing," and the design should
follow platform/industry conventions; this is the literal, named mechanism behind inconsistent spacing/alignment/radius
reading as "off" even when no single instance is wrong in isolation — the brain is cross-checking elements against
each other and flagging the mismatch, whether or not the viewer can articulate it. **Aesthetic and Minimalist
Design** — "interfaces should not contain information that is irrelevant or rarely needed," because every extra
element competes with the relevant content for attention; this is the named mechanism behind a page that's
individually fine section-by-section but overwhelming as a whole. **Recognition Rather than Recall** — minimize
memory load by keeping elements, actions and options visible rather than requiring the user to remember something
from elsewhere in the interface; this is the mechanism behind a CTA whose meaning depends on context scrolled past
earlier. **Checkable rule, Consistency specifically: pick any two same-level, same-role elements anywhere on the page
(two card paddings, two heading-to-body gaps, two button corner radii at the same hierarchy level) and confirm they
are numerically identical, not eyeballed-close** — this is the same mechanical check already in this knowledge base's
anti-slop checklist for spacing/radius variety BETWEEN different-importance elements, now sourced to a named
usability heuristic for WITHIN-same-importance elements, where the expectation flips: same-role elements should
match exactly, different-role elements should differ by a stated delta.

**9. Mobile touch-target overlap and cut-off elements are a measured, specified failure mode, not just "looks
cramped."** WCAG 2.2's own Target Size (Minimum) criterion (§2.5.8, already cited in this knowledge base's
`anti-slop-checklist-reference.md`) sets a 24×24 CSS px floor and specifically addresses overlap: a portion of one
tappable target that is covered by another target (so it can't actually receive the tap) does not count toward that
target's measured size — meaning two controls that visually abut or overlap can both fail the criterion even if each
one's own box is nominally large enough. Common real-world causes, consistent across multiple accessibility-audit
sources: absolutely-positioned layers stacking without reserved space, negative margins pulled tight enough to
overlap a neighboring control, and icon-only buttons with no padding around the visible glyph. **Checkable rule:
at the smallest supported viewport, for every pair of adjacent interactive controls, confirm their tap-target
boxes (not just their visible icons) do not overlap and each clears 24×24 CSS px independently of its neighbor** —
this is a layout-geometry check that can be scripted (query bounding rects in devtools) rather than eyeballed on a
single test device.

### What this adds to the existing checklist material

- `color-selection-reference.md` already has a thorough palette-construction and color-blindness section; it did not
  previously have the WebAIM Million prevalence numbers (point 1), the stated 20/40-vision rationale for the 4.5:1
  threshold (point 2), or a named real-product case study for semantic color-meaning mismatch (point 3) — all three
  are genuinely new, checkable additions rather than restating existing palette-taste guidance.
- `anti-slop-checklist-reference.md` already bans several individual AI-generated layout/color tells but had no
  sourced, general-purpose hierarchy-verification step comparable to its existing identity/sibling/stranger tests for
  "does this look templated" — the squint test (point 7) fills that gap specifically for visual hierarchy, and the
  F-pattern content-structuring rule (point 6) is new territory the checklist did not previously cover at all (it
  covers visual layout tells, not copy/information-ordering within a section).
- The existing checklist already has the WCAG 2.2 §2.5.8 24×24 target-size citation; this pass adds the specific
  overlap mechanic (point 9) as a sharper, more mechanically checkable version of the same rule.

### Open questions

- No controlled, peer-reviewed study isolating "button color semantically mismatched with its action" as the sole
  variable (vs. a confound like inconsistent sizing or copy) was found — every source for point 3 is a real product
  team's own documented decision, which is strong practical evidence but not a controlled experiment. Treat the
  *direction* (reserve a warning color for genuinely destructive/rare actions) as well-evidenced, and any specific
  claimed effect size (e.g. a percentage reduction in misclicks) as unverified if encountered in a future pass.
- The Meta Horizon / Wikimedia / Tor Browser corroboration for point 3 was sourced only via WebSearch synthesis, not
  independently WebFetched this session — flagged **(to verify)** for exact wording; the GOV.UK case study is the
  only one of the four directly fetched and should be treated as the primary citation if only one can be kept.
- NN/g's banner-blindness pages were read via WebSearch's own summary of nngroup.com content, not independently
  WebFetched in full this session (the search tool fetched and summarized nngroup.com's pages directly, which is a
  reasonable proxy, but a future pass should WebFetch `nngroup.com/alertbox/banner-blindness.html` directly to
  confirm exact wording before quoting it further).
- No source this session gave a dedicated, named study on "color scheme feels off-brand/random" as its own
  complaint category distinct from contrast failure or semantic mismatch — this may be a genuine gap in the
  published research (vs. buried inside broader "brand consistency" literature not searched this session) rather
  than something this pass simply missed; worth a dedicated follow-up search specifically on brand-consistency
  research orgs (e.g. a design-systems-specific source) rather than general UX research orgs.

---

---

## 2026-10-31, later pass (WebSearch only, landscape check — not a primary-source deep dive)

Operator asked for a general refresh before advancing the Marrow combined-site build. This pass was WebSearch
summaries only (no direct fetch of a primary source), so treat it as weaker-confidence landscape context, not a
citable fact like the GOV.UG/NN.g material above.

- **"Anti-AI" / human-touch framing is now common in 2026 trend coverage**, converging with what this file's
  anti-slop material already encodes from a different angle (banned-tells list, decisiveness floor): several
  vendor trend pieces independently frame 2026 landing-page taste as restraint (generous whitespace, one clear CTA)
  winning over maximalist AI-generated density. No controlled study found — treat as corroborating color, not new
  evidence.
- **A 3D hero that costs load time is explicitly named as a 2026 anti-pattern** by more than one trend source (a
  3D element adding ~3s load time is a net negative regardless of polish; one source cites 53% mobile abandonment
  past 3s, unverified against a named study). This directly supports this file's and `3d-web-reference.md`'s
  existing asset-budget tables — worth citing as market-side pressure for the budget, not just a technical ceiling.
- **Three.js WebGPU note, corroborating `3d-web-reference.md`'s existing claim:** a March-2026 Utsubo 100-tip guide
  (community source, not official docs) independently confirms Safari 26 (Sept 2025) completed the four-engine
  WebGPU rollout already stated in this file, and names TSL (Three.js Shading Language, compiles to WGSL or GLSL)
  as the now-standard way to write one shader for both renderers — **(to verify against the official three.js
  manual before citing TSL specifics in a build order)**.
- **Photogrammetry/reference-gathering:** no 2026 source was found that sets out an authoritative reference-capture
  checklist beyond what `3d-modelling-reference.md` already states from first principles (multiple angles, scale
  reference, material close-ups) — flagged as a genuine open gap in the published literature, not something this
  pass simply failed to find; the file's own guidance stands uncorroborated by an external source for now.

### Open question
No source in either this pass or prior passes gives a measured, controlled before/after conversion-rate number for
removing a big opening h1 (this file's own strongest-worded rule, from the 2026-09-21 operator note) — it remains
operator-stated taste, strongly corroborated by convergent trend coverage, not an experimentally measured claim.

---

## 2026-10-31, later pass 2 (WebSearch, how professionals actually spot design errors + pre-launch QA process)

- **Heuristic evaluation is the named, structured method professionals use** (not just "an experienced eye"):
  3-5 evaluators work INDEPENDENTLY against Nielsen's 10 heuristics (system status, error prevention/recovery,
  consistency, etc.), then findings are pooled — independent-then-pool is the mechanism, and it's the direct
  ancestor of this file's own "identity/sibling/stranger test" and squint test (a solo-practitioner's compressed
  substitute for a panel this project obviously can't staff). **Explicitly caveated by the sources themselves:
  one cited study found 43% of heuristic-flagged issues were not real errors** — flagged `(to verify against the
  original study)`, but the direction (heuristic review has a real false-positive rate and should be paired with
  real user/usage testing, never treated as sufficient alone) is worth stating plainly rather than implying a
  heuristic pass is equivalent to user testing.
- **Professional design QA is a staged, severity-tiered pipeline, not one pass:** developer self-review first,
  then a dedicated visual pass (built output diffed against the source mockup/spec), bugs filed with side-by-side
  screenshots, triaged into tiers (broken functionality / accessibility blockers / brand violations = must-fix
  before launch; visual discrepancies = high-priority-but-maybe-not-blocking; everything else = next sprint),
  then fix verification. This project's existing "mechanical pre-flight check" + "self-QA loop" in
  `anti-slop-checklist-reference.md` already follows this shape informally — worth naming the tiering explicitly
  next time that file is touched, since "every finding is a blocker" and "every finding is optional" are both
  wrong, and the file doesn't currently separate them by severity the way this sourced process does.
- **"Pixel-perfect" is explicitly named as unrealistic across browsers/devices** by more than one source — the
  goal is matching tokens/spec with visual-regression tooling for the mechanical parts, not literal pixel
  identity everywhere. Corroborates this file's own existing style-fidelity-measurement approach (compare
  declared tokens against actual rendered signal count) rather than an eyeballed "looks the same" check.
