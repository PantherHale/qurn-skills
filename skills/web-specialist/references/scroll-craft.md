# Scroll craft -- how the scroll becomes part of the product

Read this before building any scroll animation. The web designer's BUILD ORDERS name techniques from this file by
their number (T1 to T22); build them the way they are written here. Written 2026-09-24 from four reference sites (a fourth, Driftwood by Manus, added 2026-09-28)
studied in a real browser (DOM, computed styles and scripts inspected, not guessed), after the operator rejected a
site whose "scroll animation" was eight drawn slides of how coffee is farmed.

## The rule the operator set

A scroll animation is not a slideshow and not a lecture. The visitor scrolls and **the product itself moves**: it is
poured, opened, written with, lit, turned, filled. The motion is continuous (scrubbed to the scrollbar), it has one
signature object or motif that stays with the visitor across sections, and every section it touches still carries
real content the visitor came for. Ask of every beat: "would a visitor miss this if it were gone?" If the honest
answer is no, cut it.

**Content relevance.** Show what the visitor cares about: what it is, what it tastes/feels/does like, why this one,
where and how to get it. Production data (altitude, drying days, batch size, roast temperatures, process steps) is NOT
shown unless the brief asks for it or the visitor is an expert buyer. Never teach the supply chain in the hero.

## What the three references actually do (verified 2026-09-24)

**Inkling (inklingjournals.vercel.app), a journaling app.** Stack: React + Vite, Lenis smooth scroll (`html.lenis`),
two fixed full-screen WebGL canvases behind the page (a paper/ink "wash" and an intro scene, react-three-fiber, each
lazy-loaded as its own chunk). The signature motif is the ink drop: the logo is a drop, scroll bursts it into a blot,
then a single ink stroke threads down the whole page connecting every section -- an SVG path with `pathLength="1"`,
`stroke-dasharray: 1` and `stroke-dashoffset` scrubbed from 1 to 0. Headings "write themselves" with an animated
`mask-image: linear-gradient(110deg, #000 X%, transparent Y%)`. The nib is a droplet `clip-path: url(#clip)`.
Handwritten margin notes beside the real UI. The product's real interface is shown working (typed demo, the day
view, the mind-map), not described. Sections are sticky panels (`position: sticky`) so content arrives rather than
scrolling past. TAKE: one motif from the product's own world, drawn continuously; real UI shown working. REFUSE: its
blue ink palette, its fonts, its copy.

**The Academy (theacademysf.com).** Stack: Next.js, real video (Mux stream for the hero, short MP4 loops in cards),
51 real photographs, sticky sections of `h-screen` inside `h-[125vh]` parents. Signature moments: a calendar heat-map
that fills as you scroll; "Live in San Francisco" -- a line drawing of the city is a `mask-image` over a solid
layer, then the aerial photograph is revealed by a `mask-image: linear-gradient(#000 P%, transparent)` whose P is
scrubbed from about -44% to 98% (a wipe from sketch to photograph); the closing CTA floats tag words around a
photo. The newsletter is ONE line: email field plus arrow button, a consent sentence under it. TAKE: real photos and
video carry the emotion; sketch-to-photo mask reveal; a one-line sign-up. REFUSE: its red accent, its logos.

**Kopi Koding (coffee-3d-website).** Stack: vanilla three.js from a CDN, GLTFLoader with a real glTF cup
(`coffee/scene.gltf`) behind the hero, OrbitControls. Real coffee photographs in a full 3 x 2 menu grid (six items,
no empty slot), warm espresso-brown and cream, tight section spacing, a fixed dark header. TAKE: a real 3D object
of the product; photographs of the actual drinks; full grids. REFUSE: the boxed hero card and the generic font.

**Driftwood candles (built by Manus 1.6 Lite, one hour, 2026-09-28; source and handoff guide read in full, the
build watched frame by frame).** Stack: Vite + React + TypeScript + Tailwind; one hand-written stylesheet does the
work, no animation library at all. The opening is the scroll story: `.hero` is 205 viewport-heights tall (230 on
phones), one `position: sticky; height: 100svh` stage inside it. At scroll 0 the first screen is WORDLESS: no header,
no title, no button, no scroll hint; only a full-bleed photograph of a lit candle standing in a meadow, with four
transparent flower cut-outs planted along the bottom edge. As the visitor scrolls, one rAF-throttled passive listener
turns scroll into a single number `progress` (0-1) and writes it, and a handful of derived values, into CSS custom
properties on the hero; the stylesheet does everything else. The four stems slide outward (52px) and fall (68px) at
their own depths, the backdrop drifts 12px, and copy arrives in STAGES: title, line and link fade in at 0.18, the
wordmark and nav at 0.48, a hairline progress bar appears after 0.02. Hidden stages are `aria-hidden` and `inert`
until shown. The candle never moves on its own; it stays part of the photograph. Below: three cards revealed once
each by IntersectionObserver with a 70ms stagger and a 3-degree rotateX settle, a sage band, a dark sign-up band with
one pill-shaped email field. TAKE: the wordless photographic opening, layered cut-outs, staged reveals, the single
progress variable, one primary action, and above all the PROCESS (see "How Manus made it" below). REFUSE: what the
operator found lacking in its result: the candle is a still photograph (no flame, no glow, no smoke), and after the
hero there are almost no scroll effects (cards fade up once, nothing else). Fixing both is T15 and T16.

**How Manus made it (read from the screen recording; this is the working method to copy).**
1. It states a plan of three named steps with a counter ("Create original candle photography 1/3", "Build the
   responsive one-page site 2/3", "Check desktop and mobile rendering 3/3") and works them in that order.
2. It makes the pictures FIRST. Original images, generated with an image model, in one consistent warm editorial
   light: three product shots, then, when asked for depth, a full garden scene photograph plus four SEPARATE
   transparent cut-outs (daisy, cosmos, aster, buttercups), each trimmed of empty alpha padding for accurate scaling.
   It asked for "matching, photographic alpha layers" and then a "more faithful transparent" second pass.
3. It writes the page from a design decision stated in one sentence ("editorial, coastal apothecary: warm cream,
   ink green, a rust accent, real candle still-life rather than generic stock imagery").
4. It verifies in a real browser before it hands over: desktop and 375px phone, and reads
   `document.documentElement.scrollWidth <= clientWidth`; the first check caught a real bug (asset paths not
   resolving) and it fixed that before continuing. It scrubs the hero at about 50% and 90% of its travel.
5. It takes feedback as small numbered changes and keeps ONE spectacle: when it added a second pinned scene, it later
   removed it so the page had one main scroll moment, not two competing ones.
6. It ends with a written handoff guide (`DRIFTWOOD_AGENT_GUIDE.md`) that another agent can extend without breaking
   the design: product brief, file table, design decisions with the numbers, the scroll parameters, accessibility
   and responsive rules, validation commands, and the list of things that are still sample content (T18).
7. It answers "how much time more" honestly with a range and what it is doing now, and finishes with "Next steps".

## Resources a web designer has (take stock BEFORE designing)

| Need | Source (licence) | How |
|---|---|---|
| Photographs | Openverse API, `license=cc0,pdm` (CC0 / public domain; rawpixel, Wikimedia, Flickr) | `curl "https://api.openverse.org/v1/images/?q=latte%20art&license=cc0,pdm&size=large&page_size=20"`; download the `url`, resize to WebP 1600/800 wide into `public/img/`, record title, source and licence in `public/img/CREDITS.md`. Never hot-link. |
| Photographs (more choice) | Unsplash / Pexels licence (free, no attribution required) | Blocks bots: only the owner can download by hand. Put the wanted shot list in README "Photos to replace". |
| Lighting for 3D | Poly Haven HDRIs (CC0) | `curl https://api.polyhaven.com/files/<id>` gives 1k/2k .hdr URLs; use 1k for the web; `RGBELoader` + `PMREMGenerator`. |
| 3D models | Poly Haven models (CC0, glTF), Kenney (CC0), Sketchfab (CC-BY, needs a login) | `https://api.polyhaven.com/assets?t=models`. When no model exists, turn one: `LatheGeometry` for anything round (cup, bottle, jar, vase), `ExtrudeGeometry` for flat shapes, `TubeGeometry` for handles and cables. |
| Video | Pexels / Coverr (free) by hand; or render frames here (T8) | A muted, looping, `playsinline` MP4 under 4 MB with a poster image; never autoplay with sound. |
| Fonts | Fontsource (`npm i @fontsource-variable/<name>`) | Self-hosted, OFL. |
| Motion and UI components | React Bits (reactbits.dev), Motion Primitives | `https://reactbits.dev/r/<Name>-TS-CSS.json` (files[].content). |
| Scroll engine | `gsap` 3.15 + `ScrollTrigger` (free), `lenis` 1.3 | See T1. |
| 3D engine | `three` 0.186, `@react-three/fiber` 9 + `@react-three/drei` 10 (React 19) | See T6. |

## The techniques (the BUILD ORDERS cite these numbers)

**T1. Smooth scroll with Lenis driving ScrollTrigger, and anchor navigation.** One Lenis instance, one ticker:

```ts
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -72 } }) // anchors: in-page links scroll smoothly
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((t) => lenis.raf(t * 1000))
gsap.ticker.lagSmoothing(0)
// a nav item that points at a section: <a href="/#coffees" onClick={(e) => { if (onHome) { e.preventDefault(); lenis.scrollTo('#coffees', { offset: -72 }) } }}>
```

Skip Lenis entirely under `prefers-reduced-motion: reduce` (native scroll, `scroll-behavior: auto`). On a single
brand page the nav items are SECTIONS of one page, not separate routes: clicking one scrolls there. From another
route, navigate to `/#section` and scroll after mount.

**T2. The pinned stage (sticky, no JS needed for the pin).** A section `height: N00vh`; inside it a child
`position: sticky; top: 0; height: 100vh`. Progress p = how far the section has scrolled (0-1). Drive everything from
one GSAP timeline with `scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 }`.
Keep N between 2 and 4 for one idea; every 100vh must change something the visitor can see.

**T3. The signature object that travels.** One object from the product (a cup, a drop, a bag, a phone) is
`position: fixed` (or lives in a fixed canvas) and moves BETWEEN sections: hero centre -> beside the coffees list ->
into the cafe photo -> the close. Each section's ScrollTrigger tweens its x/y/scale/rotation to that section's
"seat". This is what makes the page feel like one continuous product film instead of stacked blocks.

**T4. The line that follows the reader down the page and ends at the bottom (Inkling, read from its shipped code
2026-09-24).** This is the strongest scroll device of the three references. How Inkling does it:

1. *Anchors in the markup.* The start element carries `data-ink-head` (the logo drop), elements in each section
   carry `data-ink-mark="<name>"` (the demo page, a keyboard key, the mind-map, a headline), and the last section
   carries `data-ink-pool` with a child `data-ink="pool"` (the closing call to action, a drop icon marked `end`).
2. *The route is measured from the real layout.* On mount, on `ResizeObserver` of the page, on `resize` and on
   `document.fonts.ready`, it reads every anchor's `getBoundingClientRect()` relative to the page and a hand-written
   route function turns them into points: out of the head, down the GAP beside the demo (`x = min(nib.right + 22,
   page.left - 14)`), past the right edge of the next section, into the key, around the headline, into the pool.
   Each point also has a width, a darkness and a wetness, so the stroke swells and thins like a brush. The line
   never crosses text: it travels in the gutters the layout leaves for it.
3. *The front follows you.* On every scroll it computes `frontY = viewportHeight * k - pageTop` (a fixed fraction k
   of the viewport, converted to page coordinates) and draws the line from the head down to frontY. So the tip of
   the ink is always at the same height on your screen, right beside what you are reading, and everything above
   it stays drawn. Scroll back up and it retracts.
4. *It ends by pooling.* It also tracks `remaining` (distance to the page bottom). Near the pool's top the ink
   deepens (`deepenFrom = poolTop - 60`, `deepenTo = poolTop + 120`) and the pool elements get `data-inked`, which
   CSS turns into the final section flooding with the ink colour. The page ends in the motif, not in a footer.
5. *Rendering.* A fixed full-screen WebGL canvas (a ribbon mesh plus a paper-wash shader, lazy-loaded) paints it;
   an SVG with the same paths (`.ink-line-fallback`) is the no-WebGL and reduced-motion fallback.

How to build it without a shader (SVG, good enough and robust): one absolute `<svg>` covering `main` (its height =
the page height, `pointer-events: none`, behind the text). Measure the anchors (step 2) into points; draw a smooth
path through them (Catmull-Rom to cubic Bezier). Give it `pathLength="1"`, `stroke-dasharray: 1`. On scroll, find
the path length at `frontY` (precompute 256 samples of `getPointAtLength` -> y, then look up y -> length) and set
`stroke-dashoffset = 1 - lengthAt(frontY)`. Put a small tip element (a drop, a coffee drip, a nib) at
`getPointAtLength(lengthAt(frontY))` so the head visibly leads. Give the stroke a second, wider, low-opacity copy
underneath for the wet halo. At the pool, add a class that fills the last section from the line's end point
(`clip-path: circle(r at x y)` with r scrubbed from 0 to 150%). Recompute the route on resize and font load; with
reduced motion draw the whole line at once. The path is the product's own motif: an ink stroke, a pour of coffee, a
thread, a route on a map. It connects the sections, so the page reads as one piece.

**T5. Mask reveal (Academy).** Two stacked layers: the "before" (a sketch, a line drawing, a silhouette, an empty cup)
and the "after" (the photograph). Scrub the after layer's `mask-image: linear-gradient(to bottom, #000 P%,
transparent P+20%)` with P from -20 to 100 (use a CSS variable `--p` set by the timeline). Or `clip-path:
inset(100% 0 0 0)` -> `inset(0)`. Masks animate on the compositor in Chromium; keep the layer under 2 screen areas.

**T6. A real 3D object, scroll-driven (Kopi, Inkling).** three.js (or R3F) in a fixed canvas behind the DOM text.
One scroll progress drives the scene (rotation, camera dolly, a fill level, a lid). A turned object from
`LatheGeometry` with `MeshPhysicalMaterial` (ceramic: `roughness 0.35, clearcoat 0.6`), lit by a 1k Poly Haven HDRI,
with a soft contact shadow, reads as a photograph. Liquid: a disc at a scrubbed height with a radial-gradient
texture (crema ring). Steam: 3-5 alpha-textured planes drifting up, facing the camera. Rules: lazy import, poster
first, `dpr` capped at 2, render only while visible, dispose on unmount, reduced motion shows the poster.

**T7. Text that writes or fills as you read (Inkling, React Bits ScrollReveal).** Headings reveal with a scrubbed
`mask-image: linear-gradient(110deg, #000 X%, transparent X+15%)` or word-by-word opacity (React Bits ScrollReveal /
SplitText). Use on at most two headings per page; the rest simply appear.

**T8. Image sequence (a filmed or rendered turn).** When the object must turn or open with real lighting: render 90-150
WebP frames (references/design-workflow.md "Canvas frame scrubber") and scrub them in the T2 stage.

**T9. Horizontal track.** A pinned T2 stage whose inner row translates x from 0 to -(rowWidth - 100vw). For a menu or
a range the visitor browses; every card is a real item, and the row still works with a keyboard (focusable cards).

**T10. Depth layers (parallax with a reason).** 2-4 layers moving at different y speeds only where depth is the
point (steam over a cup, beans falling past a bag). Never on text blocks.

**T11. Sticky media swap.** A sticky photo/video column on one side while short text blocks scroll past on the other;
each block's `onEnter` swaps or cross-fades the media. For "what you get" stories.

**T12. The close.** The motif lands: the line ends in the cup, the drop becomes the button, the object settles next
to the one action. The page must END deliberately, not stop.

**T13. The wordless opening (image first, copy in stages).** For a product that is photographed (a candle, a shoe,
a plant, a room) the first screen is the photograph and nothing else. Build: `.hero { height: 205svh }` (230svh under
700px), child `.hero-sticky { position: sticky; top: 0; height: 100svh; overflow: hidden }`. One function reads
`progress = clamp(-hero.getBoundingClientRect().top / (hero.offsetHeight - stage.offsetHeight), 0, 1)` inside a
single `requestAnimationFrame` scheduled from a `passive` scroll listener (skip if a frame is already pending) and sets
`--progress` plus derived CSS variables on the hero. Copy appears in stages by threshold, not all at once:
`>= 0.18` title, one line and the one action; `>= 0.48` wordmark and navigation; `> 0.02` a 2px progress hairline.
Each hidden stage has `visibility: hidden; opacity: 0; pointer-events: none; transition: ... visibility 0s linear
<duration>` and gets `aria-hidden` and `inert` until visible, so an invisible link is never a keyboard stop. The
title lives on a dark glass panel at bottom left (`backdrop-filter: blur(11px)`) so it reads over any photograph.
Use it only when the photograph carries the product; for software use the product-is-the-homepage pattern instead.

**T14. Layered cut-outs (real depth from photographs).** One full-bleed scene photograph plus 3 to 5 SEPARATE
transparent PNG/WebP cut-outs of things that stand in front of it (stems, leaves, grass, steam, ribbon, fruit).
Generate the scene and every cut-out in the same light and colour (one prompt prefix reused), then trim empty alpha
padding so `width`/`height` are true. Stack with `z-index` by depth; give each layer its own travel: side layers
slide 52px outward (22px on phones), all fall 68px (40px on phones), the backdrop drifts only 12px (5px on phones)
and scales 1.08 so its edges never show, deeper layers get a larger `translateZ` and a softer drop shadow
(`drop-shadow(0 12px 16px rgba(14,25,17,.27))`). The hero object itself belongs to the scene photograph: it must
NEVER tilt or move by itself, or it looks pasted on. Clip the stage (`overflow: hidden`) so nothing scrolls sideways,
and re-crop with `object-position` at 375px so the object stays centred. Give every layer `alt=""` and
`aria-hidden`, and one `role="img"` label on the group.

**T15. The living object (ambient motion that never stops, and reacts to scroll).** A photograph of a lit, running or
steaming product must not be static. Add a small overlay on the exact spot (positioned in percent of the scene
box so it survives any crop) whose life is CSS keyframes, and let the scroll change its intensity:
- Flame: an SVG teardrop with a radial gradient (core `#fff6d8`, mid `#ffb347`, edge transparent), `transform-origin:
  50% 100%`, animated by `flicker` keyframes at 2.4-3.6s, `ease-in-out`, infinite, with an irregular sequence of
  `scale(1, .92-1.08)`, `skewX(-2deg..2deg)`, `translateX(-.5px..1px)` and opacity .88-1; a second copy at 60% size
  offset by a negative `animation-delay` so the flame never looks like one looping clip. A `radial-gradient` halo with
  `mix-blend-mode: screen` behind it "breathes" (`scale .96-1.06`, opacity .55-.8, 5s). Two to four small ember or
  smoke wisps rise (`translateY(0 -> -90px)`, `opacity .5 -> 0`, `blur 0 -> 6px`, 6-9s, staggered delays).
- Scroll link: `--progress` raises the halo (`opacity: calc(.55 + var(--progress) * .35)`) and warms the page light, so
  scrolling literally turns the lights up; at the close the halo is at its strongest beside the sign-up.
- Other products: steam over a cup, a slow lens flare across glass, dust in a beam, a kettle's shimmer, a screen's
  cursor blink. One living detail, never a particle storm.
- Every ambient loop stops under `prefers-reduced-motion` (leave the first frame) and pauses when off screen
  (`IntersectionObserver` toggles `animation-play-state`). Animate only `transform` and `opacity`.

**T16. Scroll beats after the hero (the page keeps moving, once each, in order).** A page with one opening effect and
then static blocks feels unfinished. After the hero add four to six small beats, each tied to a real section and
each measured, none of them a second pinned scene:
- Card reveal: `IntersectionObserver` (`threshold: .14`, `rootMargin: 0 0 -6% 0`), `translate3d(0, 23px, 0)
  rotateX(3deg)` to none over 650ms `cubic-bezier(.23, 1, .32, 1)`, stagger 70ms, once only.
- Photo settle: the image inside a card scales `1.12 -> 1` while its frame is revealed (a mask/clip-path
  `inset(8% 8% 8% 8%) -> inset(0)`), and on hover `scale(1.035)` over 500ms.
- Heading write-on: split a heading into words, each word rises `0.6em -> 0` and fades in with a 45ms stagger when the
  heading enters (T7 scrubs it; use this once-only version for short headings).
- Scrubbed parallax on ONE image per section (10-14% travel) and a horizontal drift on a section's oversized ghost
  word or ornament (about 8% of width across the section), never on body text.
- Count-up for a real number (hours of light, hours burned, litres) from 0 over 1.2s when it enters, with tabular
  figures so the layout does not jitter.
- Light shift: the page background between sections eases between two tokens (`--paper` to `--evening`) as the story
  moves toward the close, `background-color` on the section, not a fixed overlay.
- Magnetic pill button: the primary action follows the pointer within 8px, scales `.97` on press, its arrow moves
  `2px, -2px` on hover. Pointer devices only.
- Close: the halo of T15 peaks, the form field lifts 6px into focus and the button pulses once when the section is 60%
  visible. The page ENDS (T12).
Rule: one main spectacle (the T13 opening) plus quiet beats. If two scenes compete, delete the weaker.

**T17. Small interface details that make it feel built (the "little components").** Where a control, list or panel
exists, give it these, they are what separates a template from a product:
- Icon buttons 32-36px with a `title`/tooltip, `:active` scale `.97`, visible focus ring, and the same hit area on touch.
- Status pills with a dot (a live dot pulses 1.6s; done is still), counters that animate when they change.
- A live timer on any running task ("Working for 3m 18s") and a completed summary line ("Ran 102 commands, edited 8
  files") that replaces it.
- Stat tiles in a 2x2 grid (label, big number, a quiet pictogram behind) for usage or results.
- Collapsible step rows: "Read 4 files · Ran 1 command · Edited 2 files ›", opening to the detail.
- A file card (icon, name, type and size, open/download) for anything the work produced; a "next steps" list of two
  or three concrete follow-ups as buttons; keyboard-shortcut chips (`kbd`) where a shortcut exists.
- Empty, loading and error states each with the one next action, never a blank panel.

**T18. The handoff guide (`docs/design/AGENT_GUIDE.md`, written last, updated with every change).** Manus wrote a
guide so a later agent could extend the page without breaking it; every web build now ends with one. Sections, in
this order: (1) product brief: what it is, who, the ONE primary action, what is deliberately absent; (2) file table:
file and its single responsibility; (3) design decisions: palette, type pairing, style, and WHY in a clause each;
(4) the opening and every scroll beat with their numbers (heights, thresholds, pixel travel, durations, easings);
(5) motion, accessibility and responsive rules (breakpoints, reduced-motion behaviour, what is inert and when);
(6) validation: the exact build/check commands and the manual checks (375px, 50% and 90% of the hero, reduced
motion, `scrollWidth <= clientWidth`); (7) sample content still to replace before launch, named one by one. The guide
states what is a decision and what is a placeholder; it never claims a feature that does not exist (Manus's guide is
explicit that the sign-up form stores nothing).

**T19. Ink-grade micro-choreography (Inkling's own numbers, read from its shipped CSS and script, 2026-09-28).**
Inkling's polish is not one big effect; it is a small vocabulary applied everywhere, all on ONE easing. Copy the
vocabulary and the numbers, with your own product's motif:
- **One house easing** (`--ease-ink`, about `cubic-bezier(.22, .61, .36, 1)`) on every reveal, so the page feels
  like one hand. A springier `cubic-bezier(.34, 1.56, .64, 1)` only for things that land (a drop, a button).
- **`.arrive`**: `opacity 0 -> 1` and `translate: 0 .5rem -> 0` over `.76s`, `animation-fill-mode: forwards`,
  staggered by a per-element `--d` (0.28s steps for a group such as a fan of cards). It plays when the element gets
  `data-inview` from an `IntersectionObserver` (`threshold: .12`, once). The `.arrive` start state is the only thing
  hidden before it plays, and a whole intro can sit at `animation-play-state: paused` until it finishes.
- **Write-on text**: a heading is drawn by animating `mask-position` of a hard-edged gradient
  (`mask-image: linear-gradient(110deg, #000 0 42%, #0000 58% 100%)`, `mask-size: 250% 100%`, from `100% 0` to
  `0 0`, keyframes `write-on`, 1.5s for a short line). Handwriting lines use `clip-path: inset(0 100% -.3em 0)`
  opening to `inset(0 -2% -.3em 0)` with a small blurred pen dot running the same length on `linear` timing.
- **The landing drop** (`ink-land`): `0%` `translateY(-1.6em) scale(.82, 1.22)` and `opacity 0`; `55%`
  `translateY(0) scale(1.08, .94)`; `100%` no transform. Squash and stretch make a dropped thing feel heavy. It
  sends a ripple (`scale .2 -> 2.6`, `opacity .6 -> 0`) from the point of impact.
- **Living idle**: the pen nib "breathes" (`scale 1 -> 1.045` at the 50% keyframe) and its halo pulses (`opacity
  .72 -> 1`, `scale .96 -> 1.07`); use the same 2-3s ease-in-out loop for any object's idle life (T15 is the flame).
- **Fragments arrive out of focus**: `opacity 0`, `blur(4px)`, `translate: 0 14px` to sharp and settled, staggered;
  the same trick makes scattered notes, cards or specs assemble as they enter.
- **The scrubbed line** (T4): `stroke-dasharray: 1; stroke-dashoffset: 1 -> 0` on a path with `pathLength="1"`,
  measured from real anchors (`data-ink-head`, `data-ink-mark`, `data-ink-pool`), rebuilt on resize and fonts ready.
- **Smooth scroll** with Lenis at its default `lerp: 0.1`; a full-viewport fixed background (`position: fixed;
  inset: 0`, a WebGL wash with an SVG fallback) sits behind everything; `prefers-reduced-motion` and
  `prefers-reduced-transparency` each have a plain fallback.
Use this vocabulary on every section of any page that has a motif: the page then has a texture of tiny, consistent
arrivals under the one big scroll device.

**T20. The exploded product (electronics and anything assembled from parts).** The visitor scrolls and the device
comes apart into its real layers, every part labelled with one true fact, then goes back together at the buy button.
It is the product doing its job on screen, so for a phone, earbuds, laptop, keyboard, watch, router, camera or
headphones it is the DEFAULT scroll story unless the brief says otherwise. Pick the tier by what you can obtain:
1. **Layered plates (no model needed, works everywhere, cheapest).** 5 to 8 stacked inline SVG or PNG plates in real
   order and real proportions (phone: glass, display, frame, battery, main board, camera module, back panel; earbud:
   grille, driver, battery, board, shell). Stage: `perspective: 1600px`; the stack `transform-style: preserve-3d;
   transform: rotateX(58deg) rotateZ(-36deg)`. Each plate `transform: translateZ(calc(var(--i) * var(--gap)))`, and
   the scroll sets `--gap` from `0px` to `70px` (56px under 700px wide). Each plate casts a soft shadow onto the one
   below whose blur and offset grow with the gap; rim-light the edges with a 1px lighter border.
2. **Image sequence (best looks, Apple's method).** Render 120 to 150 frames from a real model in Blender (Cycles,
   1600x900, WebP 60-90 KB each, plus a half-size set for phones). One `<canvas>` inside a sticky stage (`section {
   height: 400vh }`, stage `position: sticky; top: 0; height: 100svh`). `frame = Math.min(n - 1, Math.floor(progress *
   n))`; preload every frame into `Image` objects (the first 20 first, the rest in idle time), never set `img.src`
   inside the scroll handler, and redraw only when the frame index changes.
3. **Real 3D (react-three-fiber, when a glTF exists or the device is simple enough to build).** Load a glTF with
   each part a separate mesh whose origin is its own centre of mass (fix this in Blender before export, or the offsets
   are wrong). Explosion: `dir = part.position.clone().sub(centre).normalize()`, then `target = position + dir *
   distance(part, centre) * factor`, `factor` about 0.8; bias the direction 70% along the device's depth axis and 30%
   radial so it reads as layers, not shrapnel. Drive it from scroll progress (`scrub: 1.5` in GSAP, or `lerp =
   min(dt * 6, 1)` per frame), stagger each part by layer order (0.06 of the timeline apart), a 35 degree perspective
   camera at `[0, 0, 3.2]`, an HDRI plus low ambient light (0.4), and orbit the camera 20-25 degrees across the
   explosion. Budget: Draco-compressed glTF under 2.5 MB, compressed textures, one canvas.
The choreography, whichever tier (progress p of a 400vh sticky stage):
- `0 - 0.12` the closed product at rest, alive (T15); the headline names it.
- `0.12 - 0.55` the parts peel apart in assembly order, outer layer first, each starting 0.06 after the last; the
  camera drifts and slowly turns; the shadows deepen.
- `0.55 - 0.85` hold. One part at a time is called out: it stays bright, the others dim to `opacity .35`; an SVG
  leader line draws to it (T4 dashoffset) and a label gives the part's real name and one true fact ("4,800 mAh
  cell", "8-core chip", "hot-swappable switch"). Text on one side, sticky product on the other (T11).
- `0.85 - 1` the parts snap back together in reverse order, the product closes, and the price and the one action
  arrive beside it (T12).
Rules: the facts come from the brief or the maker's spec sheet, never invented; part names are real; under 700px the
labels move under the stage and there are at most 6 parts; under `prefers-reduced-motion` show ONE static exploded
figure with all labels; keyboard users can step through parts with a "Next part" button (`aria-live` announces it).
Refuse: a generic gradient blob standing in for a chip; parts flying in random directions; labels with no fact; an
explosion that never closes again. Sources studied 2026-09-28: the CSS-Tricks Apple canvas sequence, Adam Naili's
R3F exploded view, Luchocrat's explode-scroll demo (300vh sticky, glb with 7 CAD parts), the Codrops explosion.

**T21. Decide the scroll story yourself (the visitor never has to ask).** Do not wait for a brief to say "add scroll
animation". Every marketing or product page gets, by default: an opening device, one signature motif, quiet beats
(T16 and the T19 vocabulary), and a deliberate close (T12). Choose the opening device from the product with this
router; say the choice and the reason in one line in CONCEPT, and skip it only when the brief forbids motion:

| The product is | Default device |
|---|---|
| electronics, hardware, anything with parts | T20 exploded product |
| a photographed object (candle, shoe, plant, food, room) | T13 + T14 + T15 |
| something poured, brewed, written, drawn | T4 line or T6 real 3D pour/turn |
| software, an app, a tool | the real interface as the hero + T4 thread + T11 sticky screens |
| a service, a place, a clinic, a studio | T5 mask reveal (sketch to photograph) + T11 |
| apparel, bags, things worn | T8 turnaround image sequence |
| a range of items | T9 horizontal track, or T16 card beats |
| a story, an idea, a report | T7 write-on text + T4 line |

A page with none of these moving is unfinished, not minimal. The exception is a page the operator wants still (a
legal page, a form, a dense docs page): it gets only the T19 arrivals.

**T22. The smoothness budget (every effect above must fit inside it; a laggy page has failed, however pretty).**
Target: 60 fps on a mid-range laptop and a mid-range phone, which means under 16 ms per frame. The board scrolls the
whole page at a 4x CPU slowdown and counts slow frames, and it measures the items below. Build to these rules from the
first line, not as a fix at the end:
1. **Animate only `transform` and `opacity`.** Never animate `width`, `height`, `top`, `left`, `margin`, `padding`,
   `font-size`, `box-shadow`, `filter` or `backdrop-filter` (each forces layout or a repaint every frame). Fake a
   growing shadow with an extra element whose `opacity` changes; fake a size change with `scale`. `clip-path` and
   `mask-position` are acceptable on one or two elements at a time (T19 write-on), never on a grid.
2. **One scroll listener, passive, one rAF.** `addEventListener('scroll', fn, { passive: true })`; `fn` only records
   `scrollY` and schedules one `requestAnimationFrame`; all reads (`getBoundingClientRect`, `offsetHeight`) happen
   first in that frame and all writes after, never interleaved (no layout thrash). Cache measurements and refresh them
   on `ResizeObserver`, not on every scroll. Write progress into CSS variables and let CSS do the rest (T13).
   Never call `setState` per scroll or animation frame.
3. **Use `IntersectionObserver` for reveals** (once, then `unobserve`), never a scroll handler measuring every card.
4. **Pause what is off screen.** Ambient loops (T15), video, canvases and WebGL loops stop when their box leaves the
   viewport (`IntersectionObserver` toggles `animation-play-state`, `video.pause()`, or stops the render loop).
   Render WebGL on demand when nothing moves (`frameloop="demand"` in react-three-fiber).
5. **Budget the expensive things, and count them.** At most 2 elements with `backdrop-filter` in view at once (one
   glass panel, not a wall of them; use a plain translucent fill elsewhere); at most 12 elements with `will-change`,
   added just before an animation and removed after (never on everything); at most 1 canvas; at most 5 layers of
   stacked full-screen images; blurred shadows only on the few hero layers; a page under about 1500 DOM nodes.
6. **Images and frames are the biggest cost.** WebP/AVIF, sized for the display (never a 4000px image in a 400px box),
   `width`/`height` set, `loading="lazy"` below the fold, `fetchpriority="high"` on exactly one hero image, `decoding=
   "async"`. Hero scene at most 1920 wide and 250 KB; cut-outs at most 900 wide and 120 KB; the whole first screen
   under 1.2 MB. Image sequences (T8, T20): 60-90 KB frames, a half-size set for phones, first 20 frames first, the rest
   in `requestIdleCallback`, never more than 150 frames, and draw only when the frame index changes.
7. **3D on a budget.** Draco-compressed glTF under 2.5 MB, textures under 2048px, `dpr` capped at `[1, 1.5]`, no
   real-time shadows on phones, antialias off on phones, a static poster while the model loads, and no WebGL at all
   under `prefers-reduced-motion` or `saveData` (show the poster).
8. **Fonts and scripts stay small.** At most 2 font families, `font-display: swap`, subset; no scroll library the page
   does not use; `gsap` and `three` loaded only on the pages that need them (dynamic `import()`), never on every route.
9. **Smooth-scroll libraries are optional cost.** Lenis is off under reduced motion and on touch devices (`syncTouch:
   false`, the default), and it shares GSAP's ticker so there is one animation loop, not two.
10. **Measure, then cut.** After each scroll effect, run the board (`scroll-smoothness`, `perf-budget`) or a Chrome
    Performance trace at 4x CPU; if more than 8% of frames pass 50 ms, remove the most expensive effect first (blurs,
    then shadows, then extra layers), never the content. Keep the effect and drop its cost when you can.

## How each thing is presented (the presentation method)

A professional does not put every section in the same container. They ask what KIND of content it is, and each kind
has a presentation that proves it best. Measured section by section on Inkling (2026-09-24: layout, columns,
interactive elements, media), plus the Academy and Kopi:

| Content kind | Presentation | Interaction | Seen on |
|---|---|---|---|
| The whole product is one interaction | Put that real control as the entire first viewport -- headline, the control, nothing else (no hero image, no feature grid above it) | the control itself | Manus (manus.im): "What can I do for you?" and the real prompt box are the whole homepage |
| The core thing the product does (software) | An OS-window demo card: rounded corners, a thin border, a soft shadow, a title bar (name + icon, optionally traffic-light dots); real-looking fictional data inside (plausible IDs, names, timestamps), never lorem or generic labels; one demo per screen of dark negative space, several can overlap to show tools working together | input, tabs, a reset | Inkling #1 (type in the box, Enter, it files into Today); Linear (a ticket board, an agent chat mid-"Thinking...", stacked tool windows) |
| Why the alternatives fail | A ruled 3-column table (category / examples / why it fails), text only, hairline rows, no cards | none | Inkling #2 |
| How it works | Before -> action -> after: two real mocks joined by an arrow labelled with the action | none, or scrubbed | Inkling #3 (box -> "Enter" -> the day page) |
| Depth of features | A diagram made of the real features (mind-map, flow), each node a real sentence | none | Inkling #4 |
| Scale, "everything together" | A generative visual (graph, map, heat-map) with a legend | hover | Inkling #5, Academy calendar |
| Promises, trust, policy | Heading in 4 of 12 columns, a 2-column ruled list in the other 8 | none | Inkling #6 |
| Price or plans | Two plans side by side, a period toggle, one "best value" tag | toggle | Inkling #7 |
| Objections | FAQ accordion, heading sticky on the left, questions on the right | accordion | Inkling #8 |
| People | Photo grid, one name and one role line under each, black-and-white or one treatment | hover | Academy |
| A place | Sketch -> photograph mask reveal (T5), full-bleed | scrubbed | Academy "Live in SF" |
| Stories, testimonials (real only) | Horizontal row of short muted video loops or photos with one line each | swipe / arrows | Academy |
| A menu, a range of products | A FULL grid of real photographs, name, one line, price or link; or a T9 horizontal track | a filter that changes the grid | Kopi menu |
| Sign-up | One line: email + button, consent under it | form | Academy footer |
| The close | The motif lands (T4 pool, T12), full-bleed colour, one heading and one button | button | Inkling #9 |

Composition rules taken from the same pages:

- **Alternate the heading side.** On a 12-column grid, a section puts its heading left in 4-5 columns and its content
  right; the next one reverses or runs full width. Centre only the hero, the price and the close.
- **The motif threads the sections** (T4): the line runs in the gutter the alternating layout leaves, so layout and
  motion are designed together.
- **One voice device, used sparingly.** Inkling writes short handwritten margin notes ("what if the box just came to
  me") beside the real UI; they carry the brand's personality instead of adjectives in the copy.
- **Every section proves something with the real thing**: a demo, a real table, a real diagram, a real photo. No
  section is only an icon, a heading and a paragraph.
- **Interaction only where there is a choice or an action**: a demo, a toggle between real options, an accordion
  for many short answers, a filter on a range. Nothing clickable for decoration.
- **For a physical product the "working demo" is a chooser**: the visitor says how they use it (for coffee: espresso,
  filter, with milk; for bread: toast, sandwich, table) and the matching products light up with a reason. That is the
  product doing its job on screen.

## Layout rules the operator's feedback made hard rules (the board measures these)

- **No dead space.** Between two sections there is never more than about 160px of empty background; a gap that
  looks like the page ended is a major finding (board: `dead-space`).
- **Full grids.** A grid shows a count that fills its rows at desktop (3 columns: 3, 6, 9 items), or the last row is
  deliberately centred/featured; never three cards and an empty half-screen (board: `grid-fill`).
- **Every detail page has a way back** above the fold: a back link to the list it came from (board: `back-link`).
- **Nav items that name sections scroll to them smoothly** on the home page instead of loading a new page
  (board: `anchor-nav`).
- **Sign-up is one line**: email + button, one short sentence, consent under it. Never a two-column block of
  explanation, never numbered steps (board: `signup-form`).
- **Real imagery on a brand page**: a Persuade page for a physical product shows photographs, video or a real 3D
  render of it, not only flat drawings (board: `real-imagery`).
- **No AI-voice copy.** Refuse: numbered 01/02/03 step lists that carry no information, "No X, no Y, no Z" triads,
  "whatever just arrived", "one click to leave" style cleverness, a tracked-uppercase eyebrow over every section,
  sentences listing three abstract nouns. Write what a real shop would print: short, concrete, specific
  (board: `ai-copy`).
- **Scroll motion is real**: at least one element's transform changes continuously with scroll inside a pinned
  or sticky stage, measured at several scroll positions (board: `scroll-motion`).

## Acceptance checks for a scroll story

1. Scroll the page at 1440px in ten equal steps: something the visitor cares about moves or transforms in at least
   eight of them, and the signature object/motif is visible in at least half.
2. Reduced motion: every section's content is visible and in order, nothing pinned, no smooth-scroll.
3. 390px: the stage fits, text never sits on the object, nothing scrolls sideways.
4. The whole page is at most about 10 screen-heights at 1440px.
5. The first screen names the product and shows the one action within 5 seconds. (Exception: a T13 wordless opening,
   whose copy and action must be present and reachable by scroll progress 0.18 and by keyboard once shown.)
6. T13/T14 heroes: at progress 0 the viewport has no text; at 0.5 and 0.9 the layers have moved by different amounts;
   the hero object has not moved relative to its scene; all hero images return 200; at 320, 375 and 768px
   `document.documentElement.scrollWidth <= clientWidth`.
7. T15: an element with a CSS animation is running on the object (computed `animation-name` not `none`), and its halo
   opacity differs between scroll 0 and scroll 1; under reduced motion no animation runs.
8. T16: after the hero, at least four separate beats fire (measure by scrolling in ten steps and counting elements
   whose transform, opacity or clip changed); no second pinned scene exists.
9. T18: `docs/design/AGENT_GUIDE.md` exists with all seven sections and lists the sample content by name.
10. T20: at progress 0 the parts overlap (bounding boxes within about 2%); at 0.6 at least five separate parts sit at
    least 40px apart and each has a label with a real fact; at 1 they close again; under reduced motion one static
    exploded figure carries every label.
11. T21: CONCEPT names the opening device from the router and why; a page with no scroll motion at all is a finding.
12. T22: the board's `scroll-smoothness` (under 8% of frames over 50 ms at 4x CPU) and `perf-budget` (only transform and opacity animate, at most 3 backdrop-filter elements, images under 2 MB before the first beat and 3.5 MB after a full scroll, one canvas) both pass.
