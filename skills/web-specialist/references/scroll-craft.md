# Scroll craft -- how the scroll becomes part of the product

Read this before building any scroll animation. The web designer's BUILD ORDERS name techniques from this file by
their number (T1 to T12); build them the way they are written here. Written 2026-09-24 from three reference sites
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

## How each thing is presented (the presentation method)

A professional does not put every section in the same container. They ask what KIND of content it is, and each kind
has a presentation that proves it best. Measured section by section on Inkling (2026-09-24: layout, columns,
interactive elements, media), plus the Academy and Kopi:

| Content kind | Presentation | Interaction | Seen on |
|---|---|---|---|
| The core thing the product does | A working mini-demo of it, at real size: the visitor does the action and sees the result | input, tabs, a reset | Inkling #1: type in the box, Enter, it files into Today |
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
5. The first screen names the product and shows the one action within 5 seconds.
