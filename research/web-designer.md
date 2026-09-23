# Web designer: research notes

2026-09-23

Scope: this file adds to and corrects `web-designer-references.md`, `style-recipes.md` and `style-signals.mjs` in
PManagerProject (read for context, not edited — those stay owned by that project). It does not repeat facts already
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
