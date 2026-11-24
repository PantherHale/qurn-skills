# Web designer: presenting a product like a commercial, not a lecture

Operator, 2026-10-06, after a coffee-brand build put a graph on the page, a simple fade-in, no picture of the
coffee, and a page that read: "I want websites to be like... commercials. See Burger King, McDonald's, Starbucks,
Coca-Cola, Pepsi... people do not want to read that much... they want to see a product that is presented." This
file is measured evidence, not opinion: real pages and real ad frames read today (2026-10-06) with devtools and a
frame grab, so the numbers and mechanisms below are facts about how these brands actually build, not a style
guess. Pair with `web-director.md` (the CONCEPT METHOD and build-order process already requires a live or
photographed product centerpiece); this file gives that requirement its concrete technique and its evidence.

## What was actually measured, today, on the real pages

- **bk.com** (desktop, 1440px): the entire visible homepage before the fold is one product photograph (a Whopper
  filling the right half of the screen) plus a 4-word headline and two buttons. Whole-page word count: **135**.
  Headline: `color: rgb(80, 35, 20)` (#502314), `font: Flame-Bold`, `60px`. Primary button: `background:
  rgb(214, 35, 0)` (#D62300), `border-radius: 9999px` (a full pill), 50px tall. Zero charts, zero process
  diagrams, zero "our story" copy above the fold.
- **The Whopper TV ad** (frame-grabbed at 16 points across 30s): the entire ad is the product. Shot order: an
  empty flame grill (1s) -> wordmark "WHOPPER" over a tray of burgers (3s) -> a rotating triple burger inside
  outlined display type (5s) -> raw patties on the grill in close-up (7s) -> a slow-motion cheese pull (8-18s,
  roughly a third of the whole ad) -> lettuce, pickle, tomato, onion each dropped into frame in extreme macro
  (10-22s) -> a person reacting (24s) -> "HOME OF THE WHOPPER" wordmark and the menu tray (25-27s) -> logo
  flame-out (29s). No narration-carried facts, no process explanation, no on-screen stats. The product's own
  material (melting cheese, charring meat, crisp lettuce) **is** the content, shown at macro scale, not described.
- **coca-cola.com** (the real, current corporate site): 1,031 words on the homepage, a campaign carousel, no
  single hero product. This is the *weak* model (a corporate portal), included here as the contrast: it is NOT
  what "commercial-grade" means, and should not be copied. The Coca-Cola *concept piece* below is the strong
  model instead.
- **Coca-Cola 3D scroll concept** (Sitasys, a Webflow-built concept site, read live, not a screenshot): opens on
  a full-bleed Coca-Cola red screen with a white ribbon shape and a 64px white headline — no product yet. Scroll
  reveals a bottle (an SVG/Lottie render, not a plain `<img>`, found inside a `position: sticky` container class
  `coke-3d-sticky` that is pinned for 732px of viewport while its parent wrapper (`coke-3d-container`) is 2928px
  tall) that **rotates and tilts continuously as the page scrolls**, tied to scroll fraction through the Lenis
  smooth-scroll library (confirmed in the page's own inline script, `lerp: 0.1, wheelMultiplier: 0.7`). A second
  headline (`Taste That Brings Joy`, 56px, Coca-Cola red `rgb(237,28,22)`) sits **directly behind the bottle at
  the moment it's mid-rotation**, measured at `opacity: 0` in its resting state and animated to visible as the
  bottle turns past it — text and product occupy the same screen space at different depths, not stacked above
  and below each other. Below the hero, a vertical timeline (1886 to 1971) uses the real product years as its
  content, each entry one sentence, never a paragraph.
- **The Jupiter sparkling-wine concept** (Sitasys again, tagged `lenisscroll`, `textmasking`, `bottle`,
  `clippingmask`): the product bottle is fixed (`position: fixed`, class `jupiter-bottle-lottie` — a Lottie
  animation, not a static image) and tilts/rotates continuously while giant **outline-only** display type (168px,
  `-webkit-text-stroke: 1px`, fill `transparent`) sits behind it reading "EUROPA", "MADE ON EARTH, TASTES LIKE
  HEAVEN." — the type is bigger than the viewport and the bottle crosses in front of it. Solid-fill headlines
  (156px, a single burnt-orange `rgb(148,60,32)`) appear only at section changes, each one three words or fewer
  ("bubbly goodness", "cosmic flavours", "all good vibes"). Copy under each heading is capped at one sentence.
  Dust/grain texture and a rough stone/rock image are layered behind the product for atmosphere, never for data.
- **Liquid Death**: real photography of a real person holding the real product, high-contrast dark background,
  the product can is always in frame at natural size next to a human hand or face for scale, headline copy is a
  joke or a dare, never a claim about ingredients or process.

## The one mechanism behind every example above (name it, build it)

None of these sites explain the product. They **show it, large, in motion, tied to scroll, with text sharing its
depth instead of sitting in a box above or below it.** Concretely, the repeatable technique is:

1. **Get or render the product at hero scale.** A real photograph (Liquid Death, Burger King) or a 3D
   render/Lottie/live canvas scene (Coca-Cola concept, Jupiter) — never a stock-photo-sized thumbnail and never a
   flat icon standing in for the product.
2. **Pin it.** `position: sticky` or `position: fixed` for the duration of a scroll span (the Coca-Cola concept
   pins for 732px while its wrapper runs 2928px — roughly a 4:1 ratio of scroll distance to pinned screen time).
3. **Drive one continuous property from scroll fraction**, not from a fixed keyframe list: rotation (both
   examples), a camera-feel tilt, a fill level, a reveal mask. This is `web-director.md`'s T13-T15 family — this
   file is the proof those techniques are what real commercial sites do, not an invented house style.
4. **Put headline type at the SAME depth as the product, not above or below it**: either genuinely behind it
   (Coca-Cola's low-opacity headline, the Jupiter outline type), so the product physically overlaps the letters
   as it turns, or masked by the product's own shape (the `textmasking`/`clippingmask` tags on the Jupiter
   build). A heading sitting in its own padded box above a separate product photo is the pattern being replaced,
   not a variant of it.
5. **Cap every line of copy at what a commercial's voiceover would say.** Measured ceilings from the real pages:
   a homepage can run on 135 words total (bk.com); a section heading is 1-4 words (Jupiter); a line of supporting
   copy is one sentence, never a paragraph (Coca-Cola concept's timeline, Jupiter's hero copy). A chart, a process
   diagram, a table of production numbers, or a multi-sentence explanation of how the product is made is the
   specific failure the operator flagged — it has no match anywhere in any of these five real or concept builds.
   Save that content for a dedicated "about" or "process" page if the brief truly needs it; it never belongs in
   the hero or the first scroll act.

## Second confirmed mechanism: the "product dossier" hero (Scrolltide's Nopal template, live preview video read frame-by-frame)

Read live (the template's own preview video, not a screenshot) on 2026-10-06. This is a *paid template's actual
motion*, not a marketing screenshot, and it is the device to reach for when the product is something that
photographs beautifully up close (a drink, food, a crafted object) rather than something that needs a 3D render:

- **A real macro photograph fills the entire first screen** (a glass of prickly-pear soda with ice, dragon fruit
  and condensation, shot studio-close) — never a flat vector icon or a flat-fill illustration standing in for the
  product. A live-rendered SVG/canvas product (this file's earlier "no real photography available" fallback) is
  still acceptable when truly no photo can be sourced, but **a real CC0 photograph (Openverse, per
  `web-director.md`'s resource list) beats a live-rendered vector substitute every time it's available** — the
  render fallback is a last resort, not a style choice, because it reads visibly flatter and cheaper than real
  photography or a true 3D render even when the motion is identical.
- **The background is never flat.** A warm radial glow (magenta in Nopal's case) blooms from behind the product
  against a near-black field, plus real material framing the edges (cactus leaves, flowers — the product's own
  MATERIAL list from the CONCEPT METHOD). A single flat brand-colour background reads noticeably cheaper by
  direct comparison.
- **Annotation callouts**: small bordered label boxes ("COLD-PRESSED PEAR", "SUN-PICKED AT DAWN") connected to a
  point on the product by a thin leader line, appearing and drawing in (stroke-dashoffset from full to 0) as the
  user scrolls — a product-spec/dossier device, not a tooltip. 2-4 words per label, never a sentence.
- **Monospace micro-typography in the corners** (a tiny timestamp-like readout, coordinates, a catalogue number)
  running the whole time — pure atmosphere/texture, never fake urgency (a countdown timer implying false scarcity
  is a deceptive pattern per `web-designer-behavior.md` and must not be copied from a reference that happens to
  use one).
- **The headline splits and wraps around the product** (half the word left of it, half right, or behind it at
  low opacity as in the Coca-Cola concept above) rather than sitting in its own banner above the photo.
- **A slow Ken-Burns scale on the photo itself** (1.0 to roughly 1.15-1.2 over the pinned scroll span) is the
  continuous scroll-driven property here, in place of the 3D rotation used when the product is a rendered object —
  pick whichever continuous property fits what you actually have (a photo: scale/pan; a 3D render: rotate/tilt).

Build-order line for this variant: pin the hero photo at full-bleed, drive `transform: scale()` (and a small
`translateY` for parallax) from scroll fraction across the pinned span, add 2 callouts with their leader-line
stroke-dashoffset tied to the same scroll fraction (offset so they draw in sequentially, not together), and keep
copy to a kicker + one sentence, same ceiling as the rest of this file.

## Third and fourth confirmed examples (live sites, reverse-engineered via devtools 2026-10-23, not just read)
**Kestrel K1** (kestral-beryl.vercel.app, an EV concept-car hero): confirms this file's own mechanism on a physical-product hero — a top-down product render pinned at hero scale (1441×732 WebGL canvas, not a flat image) inside a faint concentric-circle backdrop, a floating glass pill nav (`backdrop-filter`, rounded-full), and a commercial-voiceover stat row ("920 km. 2.1 s. Silent.") as the actual headline instead of a sentence — three numbers and one word, exactly the "a heading is 1-4 words" ceiling this file already states. Confirmed via devtools: zero native CSS `animation-timeline` and zero continuously-changing transforms across 10 sampled scroll positions — its "scroll animations" are discrete reveal-on-enter transitions that settle before the next section comes into view, not a continuously-scrubbed timeline. **Don't assume a goated-feeling site is scroll-scrubbed just because it reads as polished — check for settled-vs-scrubbed before claiming either technique in a BUILD ORDER.**
**KivU** (kivuforyou.vercel.app, a journaling-app landing page): the same pinned-centerpiece mechanism applied to *software*, not a physical product — proof the doctrine isn't product-category-bound. Confirms the CONCEPT METHOD in `web-director.md`: every visual device on the page is literally the product's own metaphor (a tilted "journal card" mockup, a "SIDE A / 001" cassette-style label, a top ticker bar reading like a product version string, vertical edge copy reading "THOUGHTS ON LOOP"). Two techniques here that extend, not duplicate, this file's existing stroke-text entry (the Jupiter example above already covers *giant outline type behind a product*):
- **Mixed stroke-and-fill within one headline block, not page-wide.** KivU's hero headline runs four words across four lines ("GET IT / OUT OF / YOUR / HEAD.") — the first two lines are outline-only (`-webkit-text-stroke`, transparent fill), the last two are solid fill (one in the brand accent color, one in the base text color). The outline-vs-fill split itself carries the emphasis hierarchy, doing the job color alone usually does, without needing a third color. Use this when a headline has one clear "landing" word or phrase and the rest is setup — stroke the setup, fill the landing.
- **A persistent rotated vertical-edge label as a decorative motif**, not a utility RTL concern (`internationalization-reference.md` covers `writing-mode` for actual RTL layout; this is the same CSS property reused as pure decoration) — a short phrase in the product's own voice, rotated 90deg and pinned to the hero's edge, reinforcing the concept (here: "THOUGHTS ON LOOP / LET THEM OUT" next to a journaling app) the way a pull-quote or a spine label would in print. Keep it short (under ~6 words), in the accent color, and tie its wording to the product's own metaphor — not a generic "scroll to explore."
Also confirms the 1-2-font rule has a documented exception worth naming: KivU runs a deliberate 3-font system (Space Grotesk for the bold display headline, DM Mono for UI/meta labels like the ticker and section tags, DM Serif Display italic for one emotional accent phrase breaking the grid) — three families read as intentional here because each one has a distinct, consistent JOB (display vs. UI-label vs. emotional-accent), not because they're decorative variety. The 1-2-font default in `web-craft-doctrine-reference.md`/`style-recipes.md` still holds as the default; this is the named exception shape (a monospace UI-label voice is the most common legitimate third font), not a loophole to reach for casually.

## What this replaces in a build order

Where `web-director.md`'s worked example for a coffee roaster already names "a pour stream that follows the
reader... fills a cup at the sign-up" — that is this exact mechanism (pin + scroll-driven fill + text at the
product's depth). The failure the operator saw was not a missing rule, it was the build defaulting to a safer,
more legible, more "designed" pattern (a card grid, a stat, a fade-in) instead of actually building the pinned,
scroll-driven, text-behind-product centerpiece the rule already calls for. When writing BUILD ORDERS: name the
pinned element's CSS position, the scroll span in px or vh, the exact property being driven (rotateY degrees,
mask reveal %, fill level %) across that span, and where the headline sits in z-order relative to the product —
not just "add a scroll animation."

## Anti-patterns confirmed absent from every real/strong example above

A bar chart, line graph, or statistic grid on a consumer product page. A multi-paragraph "our process" or "our
journey" section before the product has been shown once at hero scale. A headline in its own full-width band with
the product confined to a separate, smaller image below or beside it (the box-and-caption pattern) when the brief
is a single physical product with a strong visual — reserve that layout for multi-product catalog or B2B
software pages, where it is the Starbucks/McDonald's promo-card pattern instead, which is still product-photo-led
and copy-light (1-2 sentences per card, confirmed on starbucks.com), never chart-led.

## Where to read more (name, do not paste)

bk.com and the official Burger King YouTube channel (home of the Whopper); the Jones Knowles Ritchie 2021 Burger
King rebrand write-ups (palette: "BBQ Brown," "Fiery Red," "Flamin' Orange," the custom "Flame" typeface); the
Sitasys Webflow profile (webflow.com/made-in-webflow, search "Coca Cola 3D Website" and "Sitasys Interactions")
for the live, inspectable source of both scroll mechanics described above; liquiddeath.com for photography-led,
copy-light product presentation; scrolltide.co/templates (the Nopal template's own preview video shows the
callout/glow/Ken-Burns mechanism frame by frame) for the product-dossier hero; Awwwards' food-drink inspiration
category for current award-winning examples; api.openverse.org for sourcing the real CC0 photograph this
mechanism needs.
