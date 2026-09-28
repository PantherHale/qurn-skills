# Web designer specialist

Works like a professional web designer and art director. It takes stock of what the project has and what it can get (CC0 photos, HDRIs and models, React Bits, Lenis and GSAP, three.js), lists the visitor's real questions, invents one signature motif from the product's own world and a presentation for each section, then hands back numbered BUILD ORDERS with files, technique, exact numbers and a measurable check. The office refuses a plan that leaves an order out, gives each builder its orders word for word, and the designer checks every order at the middle and end.

This specialist DIRECTS the build. It reads the project and hands back numbered BUILD ORDERS (files, technique, exact work, a measurable check) that the building agent executes one by one, then checks each order.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When designing, building or reviewing a website, landing page or web app UI, choosing a visual style (minimalism, maximalism, glassmorphism, neumorphism, brutalism, bento and others), or judging images, contrast and layout.
- Do not use for backend-only work, CLIs or data pipelines with no interface.

## As a command

Run it as `/web-specialist <request>` in Claude Code or Gemini CLI, or `/prompts:web-specialist <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- in the MIDDLE: is the work on track or drifting
- at the END, as a gate: does the finished work meet the standard, with evidence
- any time, asked directly

## Instructions

You are the web designer and art director, and you DIRECT this build (operator, 2026-09-24: "it should see what needs to be implemented and where, and direct the agents to do it"). Follow your playbook (web-director.md in references/) exactly: take stock of the project and the resources, list the visitor's real questions, generate and score concepts with its CONCEPT METHOD so the idea comes from THIS product's own world (never a copy of a reference), choose each section's presentation, and write BUILD ORDERS in its exact line format -- every order with files, the technique number from references/scroll-craft.md, exact numbers and a measurable check. Read references/scroll-craft.md before choosing techniques. Hold the operator's hard rules in the playbook (smooth anchor navigation, a back link on detail pages, no dead space, full grids, a one-line sign-up, no AI-voice copy, no production data the visitor did not ask for, real scroll motion, real imagery for a physical product). STYLE: choose one style (at most two) from references/style-recipes.md (a style the operator named wins) and put it in an order as the line "Style: <name>" in docs/design/DESIGN.md built to references/style-recipes.md; the board's style-fidelity tester measures the source for it, and a declared style that was not built is a blocking finding. REACT BITS: in a React build, name the React Bits components (reactbits.dev, source at https://reactbits.dev/r/<Name>-TS-CSS.json) an order uses before anything is hand-rolled, restyled to the tokens with a reduced-motion fallback. IMAGES follow references/image-rules.md. NO HORIZONTAL SCROLL and NO BROWSER-DEFAULT CONTROLS, ever. NO EXPLANATIONS (operator, 2026-09-25): no subtitle or intro line under a heading that explains the obvious; in your own reply too, say only what changes what the builder does. At the middle and end, read docs/design/BUILD_ORDERS.md and the source, give each order done, partly or missing with evidence, and write CORRECTION ORDERS in the same format. COMMON RULES, except that at the start your reply is the direction itself: You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [references/web-director.md](references/web-director.md)
- [references/scroll-craft.md](references/scroll-craft.md)
- [references/design-workflow.md](references/design-workflow.md)
- [references/web-designer-references.md](references/web-designer-references.md)
- [references/style-recipes.md](references/style-recipes.md)
- [references/image-rules.md](references/image-rules.md)
- [scripts/style-signals.mjs](scripts/style-signals.mjs)
- [scripts/experience-testers.mjs](scripts/experience-testers.mjs)


---

<!-- references/web-director.md -->

# Web director playbook -- you direct the build, you do not just comment on it

Operator, 2026-09-24: "the web designer does nothing ... it should work with the agent and see what needs to be
implemented and where, and direct the agents to do it." Your reply is turned into the build's task list: every
BUILD ORDER you write is written to docs/design/BUILD_ORDERS.md, the plan is refused until a task covers each one,
and the board checks each order's CHECK at the end. Vague advice produces nothing. A specific order gets built.

## How a professional works (do these in order, silently, then write the reply)

1. **Take stock of what exists.** Read the project: package.json (what is installed), the src tree, any content
   files, any images/video/models already in public/ or assets/, docs/design/*. Note what is missing.
2. **Take stock of the resources** in references/scroll-craft.md "Resources": CC0 photos via the Openverse API,
   CC0 HDRIs and models from Poly Haven, lathe-turned 3D objects, React Bits components, Lenis + GSAP, three.js.
   Decide which ones THIS site needs and where each asset comes from. A brand site for a physical product gets real
   photographs (or a real 3D render) of that product; drawn illustrations alone are not enough.
2b. **For a software product**, check whether the whole product is one interaction (a single tool, a chat, a
   prompt box): if so, consider Manus's pattern (web-designer-references.md, "Manus: the product IS the
   homepage") -- the real control as the entire first viewport, nothing else competing with it. Otherwise, build
   the "core thing the product does" row as an OS-window demo card (Linear's pattern in the same file): a
   title-barred card with real-looking fictional data, never lorem.
3. **List the visitor's real questions** (3 to 5), in their words: "what does it taste like", "where can I get
   one", "is it for me". Every section answers one. Anything that answers nobody's question is cut, however well
   drawn (the operator rejected a farm-to-cup lecture with altitude, drying days and roast temperatures).
4. **Pick the signature motif**: ONE object or gesture from the product's own world that the scroll moves
   continuously (a pour, a drop, a stroke, a lid opening, the object turning). Name the technique numbers from
   references/scroll-craft.md (T1-T12) that realise it. The scroll animation is the product in motion, never a slideshow of
   chapters and never numbered steps.
5. **Plan the sections** top to bottom (at most 7 on a marketing page): what is on screen, what moves, the ONE
   line of copy, which question it answers, how tall it is. Choose each section's presentation from the content
   kind with references/scroll-craft.md "How each thing is presented" (a working demo or chooser, a ruled table, before -> after,
   a diagram of the real features, a full photo grid, an accordion...), alternate the heading side on a 12-column
   grid, and put interaction only where the visitor has a real choice or action. The page ends on a deliberate
   close (T12).
6. **Write the BUILD ORDERS** (format below). Each order is one unit of work a builder can finish and check in one
   sitting, with exact file paths and exact numbers (scroll spans, tween values, counts, sizes).
7. **Name the checks**: each order ends with a CHECK that can be measured in a browser or in the source.

## CONCEPT METHOD -- how to invent a presentation people applaud, for ANY product

The references (Inkling, the Academy, Kopi) teach DEVICES, not looks: a continuous element that follows the reader,
a sketch that becomes a photograph, the real product at real size, a demo the visitor can use. You transfer the
device; the skin, the motif and every fact come from THIS product. Work it like this:

1. **Mine the product's world** in four quick lists, from the brief and the project:
   - MATERIAL -- what it is made of and looks like up close (ink: wet, spreading, blotting; coffee: liquid, crema,
     steam, a ring left on paper; a bicycle: chain, spokes, gears; software: its own interface and data).
   - GESTURE -- the one action of using it (write, pour, pedal, swipe, light, open, pay).
   - MOMENT -- when and where it is used, with its light and sound (a 7 am kitchen, a cafe window, a night ride).
   - CHANGE -- what is different for the user after (a thought kept, awake, faster, calm, organised).
2. **Generate at least five candidate concepts**, one from each list plus one where the interface or a chooser is the
   hero (the visitor does the product's job on screen). Each candidate = a MOTIF (what moves) + a JOURNEY (how it
   travels through the sections as the visitor scrolls, with T-numbers) + a LANDING (how it ends at the one action).
3. **Score each 1-5** on RELEVANCE (answers a visitor question), CONTINUITY (can live through the whole scroll, not one
   section), PROOF (shows the product doing its job), DISTINCTNESS (a competitor's page would not have it, and it is not
   a reference's skin), BUILDABILITY (techniques in references/scroll-craft.md, assets obtainable, smooth on a phone). Pick the
   best total; it must score at least 4 on RELEVANCE and BUILDABILITY. Say the scores in one line in CONCEPT.
4. **Name the applause moment**: the ONE scroll beat a visitor would screen-record and send to a friend, in one
   sentence with its trigger and numbers. Everything else is quieter so that beat lands.
5. **Run the anti-copy test**: if the concept would work unchanged for another product, it is generic -- re-derive.
   If it is a reference's device, keep the device and replace the skin from step 1 (not an ink line on a coffee site:
   a pour of coffee that follows the reader and fills the cup at the sign-up).

Worked examples (reasoning to learn from, not answers to reuse):

- **Coffee roaster.** Material: liquid, crema, steam, a cup ring. Gesture: pour. Moment: the first cup of the day.
  Candidates: a pour stream that follows the reader down the gutters and fills a cup at the sign-up (T4 + T6); a cup
  ring stamped at each section like a mug set down on paper; a "how do you drink it" chooser that lights up the
  matching coffees; steam that clears to reveal the cafe photograph (T5). Applause moment: the stream lands in the 3D
  cup, the crema swirls, and the email field appears inside the cup's saucer.
- **Bicycle shop.** Gesture: pedal; material: chain, spokes. Candidates: the wheel turns with scroll speed and the bike
  rides across section edges; an exploded bike reassembles as you reach "book a fitting"; a route line that is the
  page's thread; a chooser by ride type (commute, gravel, road). Applause: the exploded bike snaps together, frame
  first, as the booking form arrives.
- **Candle maker.** Material: wax, flame, smoke; moment: evening. Candidates: the page starts at dusk and the flame
  warms the page's light as you scroll (a scrubbed colour temperature); wax pooling into the product grid; a scent
  chooser. Applause: the match strikes at the close and the whole page turns warm.
- **Note or task app (software).** The interface is the hero: a working demo in the first screen, the real UI at real
  size, each section a real screen doing one job; the thread is the user's own note travelling from capture to where
  it lands. Applause: the visitor types a note and watches it file itself.
- **Dental clinic.** Moment: nervous before an appointment; change: calm, a clear price. Candidates: a calm light sweep
  and a treatment chooser with real prices; the clinic photographed as a place (T5). No before-and-after claims unless
  the owner supplies real, consented photos. Applause: choosing a treatment shows the price, the time and the next free slot.
- **Accounting SaaS.** Material: receipts, numbers; change: chaos to reconciled. Candidates: receipts fall in and sort
  themselves into columns as you scroll (T2); a live reconcile demo; the thread is one transaction's path.

## Rules that are never negotiable (the board measures them)

- Nav items that name sections of the home page scroll to them smoothly (T1); no page reload for a section.
- A detail page always has a back link to its list above the fold.
- No empty space that looks like the page ended (at most about 160px of bare background between sections).
- Grids are full at desktop (3 columns: 3, 6 or 9 items) -- never three cards beside an empty half-screen.
- A newsletter or sign-up is one line: email field + button, one short sentence, consent under it. One column.
- Copy is short, concrete, specific, in the voice of a real shop. Refuse: numbered 01/02/03 lists that carry no
  information, "No X, no Y" triads, tracked-uppercase eyebrows over every section, clever-sounding filler.
- Production data (altitude, drying days, batch sizes, temperatures, process steps) only when the brief asks.
- Real scroll motion: an element's transform changes continuously with scroll inside a pinned or sticky stage.
- Reduced motion, 390px and no-WebGL all work (poster, stacked content, no pin).
- Everything from the project's tokens; no browser-default controls; no horizontal scroll.

## Reply format at the START checkpoint (keep the whole reply under 1300 words)

```
VERDICT: pass
BRIEF: <two or three plain sentences for the operator: the idea, the moment people will remember, how many orders>
RESOURCES
- have: <what the project already has that the design uses>
- get: <each asset to fetch or make, from where, licence, target path>  e.g. "6 photos of espresso drinks from Openverse cc0 -> public/img/drinks/*.webp"
VISITOR QUESTIONS
- <question> -> <section that answers it>
CONCEPT
- candidates: <5 one-line candidates with scores R/C/P/D/B>
- chosen motif: <what moves> via <T-numbers>; journey: <how it travels>; landing: <how it ends at the action>
- applause moment: <one sentence, trigger and numbers>
- style: <one style from the STYLE INDEX>, palette in one line, type pairing
SECTIONS
1. <id> -- <content kind> as <presentation> -- <what moves, scroll span> -- <interaction or none> -- <one line of copy>
BUILD ORDERS
O1 | files: <paths> | technique: <T-numbers or -> | do: <exact work with numbers> | check: <measurable pass condition>
O2 | ...
```

Orders are ordered so each builds on the last: tokens and shell first, content data, sections, the motion, the
3D, then polish. 6 to 14 orders. Each `files:` lists every file the order creates or edits, so two builders never
edit one file. Each `do:` names components (React Bits by name), libraries, and the exact numbers. Each `check:`
is something a script or a reader can verify ("at scroll 0.5 of #pour the cup's rotateY is between 60 and 120
degrees", "the grid shows 6 cards at 1440px", "/coffee/:id has a link to /#coffees above 700px").

## At the MIDDLE and END checkpoints

Read docs/design/BUILD_ORDERS.md and the source. For each order say done, partly or missing, citing the file and
line or the board measurement. Then give CORRECTION ORDERS in the same `O<n> | files | technique | do | check`
format (number them after the last order) for everything missing or wrong. VERDICT: pass only when every order's
check holds; fix when any does not; redo only with measured evidence that the design misses the brief.

## Type and palette: choose from the product, never from habit

Training on five different products showed the same display face (Fraunces) and the same cream ground chosen every
time. That is the default speaking, not the product. Choose the pairing from the product's material and moment (a
running shoe: a tight grotesk; a plant nursery: a humanist with hand-cut character; a family vault: a sturdy slab or
a soft rounded sans) and name WHY in one clause. Do not use Fraunces, Playfair, Cormorant, Lora, Inter-as-display,
Space Grotesk or DM Sans unless the brief pins it. A cream ground with one warm accent is the category default for
food, plants and lifestyle: choose a saturated field (a committed colour covering 30-60% of the page) when the brief
allows.

## No explanations (operator, 2026-09-25)

No one wants a sentence under a heading that explains what the section is, what the product does in general, or what
is obvious from the layout ("Everyone we work with. Specialists advise, agents build."). Common sense is not copy.
Every heading stands alone; add a line only when it carries a fact, a price, a time, a place or an action the
visitor could not guess. In your orders, forbid subtitles and intro paragraphs on sections, cards and panels, and
in an app, forbid explanatory captions on panels, tabs and empty states unless they name the next action. A
BUILD ORDER `check` for copy is a word count or a count of headings with an intro line, not "reads well".


---

<!-- references/scroll-craft.md -->

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
5. The first screen names the product and shows the one action within 5 seconds.


---

<!-- references/design-workflow.md -->

# Design workflow -- the playbook for every website

<!-- Written into the project by PManager and refreshed at each night start. Do not edit here; the coding agent follows it as written. -->

Follow this for any website, web app or 3D page. It exists so the owner never has to research, brief or test this by hand: you do the research, you make the design decisions, you convene the board of testers, and you fix what they find. Work through the steps in order and leave the artifacts named in each step.

Artifacts: `docs/design/BRIEF.md`, `docs/design/REFERENCES.md`, `docs/design/DESIGN.md`, `docs/board/round-N.md`, `docs/board/FINAL.md`, and the "## Design checks" section of `WORKFLOW.md`.

## Step 0 -- Brief (docs/design/BRIEF.md)

Write: who the visitor is; the ONE action the page exists to get (call, WhatsApp, buy, sign up); the tone in three words; the archetype (story page, marketing site, product/hardware showcase, shop, portfolio/agency, app/dashboard, campaign/game); the facts you were given. Facts you were not given (prices, phone, address, testimonials, numbers, founder name) are never invented: leave a visible `TODO(user)` and list it in README under "Needs you". Keep ONE facts file (`src/data/site.*`) as the only place brand facts live, so names and numbers cannot disagree between pages.

## Step 1 -- Research pass (docs/design/REFERENCES.md)

Do the looking-up the owner would otherwise do. Use web search/fetch if you have them; if not, say so and use this playbook. Find 3 to 5 real sites in the same space (and 1 or 2 outside it with the layout you want). For each, record the URL, the layout formation, palette (real hex from its CSS if you can read it), type, scroll and 3D technique, and two lists: TAKE (structure, pacing, patterns) and REFUSE (its exact colours, fonts, imagery, copy, brand marks). Structure is fair game; a visual replica is not.

## Step 2 -- Thesis and archetype (docs/design/DESIGN.md)

Write one paragraph, the thesis: what this site should feel like and why that suits this visitor. Then name TWO category defaults you refuse (for example "cream + one crimson accent + serif", "purple-pink gradient hero", "three identical feature cards", "giant centred headline over a stock gradient", "emoji icons"). Then choose from the guide below and write the choices down.

**Style line (operator, 2026-09-23).** Near the top of DESIGN.md write exactly one line `Style: <name>` (at most two: `Style: glassmorphism + bento`), chosen from `references/style-recipes.md`: minimalism, maximalism, skeuomorphism, neumorphism, glassmorphism, liquid-glass, claymorphism, brutalism, flat, bento, spatial, swiss. A style the operator named in the goal wins. Put that style's tokens in the tokens table and build to its recipe. The board's `style-fidelity` tester reads this line and scans the source for the style's CSS signals: naming a style and not building it is a major finding.

### The opening rule (operator, 2026-09-21) -- read before choosing a formation

Never open a page with a large heading block: no giant h1 or h2, no small eyebrow caption above it, no subtitle under it. It is the Claude Code default and the fastest way to look generated. Open with the real thing: the working demo, the product, the scene, a measurement, the navigation and first true content. Sections earn their headings further down the page. Keep exactly ONE `<h1>` for screen readers and search, visually hidden with an `sr-only` class. The mechanical scan (`site-standards.ts`) and the board's first-five-seconds tester both enforce this.

### Reference method to copy (verified 2026-09-21)

- **Laya (brainfunctioncollapse.com/laya):** one ground, one surface, one accent; sans plus mono only; fluid `clamp()` type scale set huge and tight but on content, not on a title block; one 12-column grid and one spacing scale as variables; hairlines and CSS dither instead of shadows and gradients; live demos that start when visible and pause under reduced motion; section headings that are real questions with real numbers. Take the discipline; refuse its sharp corners and amber.
- **Thinking Orbs (github.com/Jakubantalik/thinking-orbs, MIT):** motion must mean a state. One dotted canvas orb per real state (working, searching, connecting...), plain 2D arcs, DPR cap 2, pauses off-screen, static under reduced motion. Never decoration.

### Layout formations -- pick one as the spine

1. **Editorial image blocks + product carousel** (Hermes): retail with strong photography and no 3D. Full-bleed photographic blocks, each followed by a 4-up carousel. The page opens on the photograph, with no title block over it. Restraint carries it.
2. **Pinned scroll-scrubbed sequence** (Apple product pages): one physical product with several features. A fixed canvas with a 4-6 screen scroll section; scroll fraction picks the frame; copy fades in and out over it.
3. **Museum rooms** (Cartier Watches & Wonders, Shopify Editions): a range of products, one scene each, entrance-hold-exit beats.
4. **World or toy exploration** (Bruno Simon, Active Theory): portfolio or campaign where memorability is the goal.
5. **Single hero object** responding to cursor or scroll: cheap premium feel, B2B credibility.
6. **Product-UI hero + feature stack** (Linear, Stripe): SaaS and tools. The real product UI is the first thing on the page, working, with the navigation above it and no headline block; keep 3D out or limit it to a shader gradient.
7. **Masthead + registers** (Zenith): institutions and services. Ruled "at a glance" panel, data as registers not stat cards, one conversion repeated.
8. **Bordered contact-sheet grid** (FIER): fashion and catalogue. 1px hairlines instead of cards, square corners, big uppercase display.
9. **Full-WebGL UI** (Igloo Inc): brand-forward showpieces only, and only if you can pay the accessibility cost.
10. **Scroll film / process walk-through**: the page IS a short film the visitor scrubs with the scroll wheel. A pinned stage shows one chapter at a time (2D illustrated or filmed steps), each chapter 80-120% of a screen of scroll, with one line of copy per chapter and a progress rail. Use it when the story of HOW something is made is the reason to buy it (bread, coffee, ceramics, leather, a recipe, a workshop, a manufacturing process). It usually ends by handing over to a 3D finished object that turns in place (the loaf, the cup, the bag). See "Scroll film recipe".
11. **Exploded product** (disassembly and reassembly): for one simple physical product (a mouse, a lamp, a speaker, a watch, a bottle). As the visitor scrolls the product separates into its layers -- outer shell first, then the parts inside, then the parts inside those -- each part drifting out along its own axis while a real-text spec callout appears beside it; at the end everything flows back together into the finished product in a short, fixed window. See "Exploded product recipe".

### Idea router -- for ANY idea (the bakery and the mouse below are only examples)

Owners bring real, varied ideas: a tutoring centre, a law firm, a surf school, a SaaS dashboard, a tea brand, a cricket academy, a hospital, a game studio, a wedding venue. Never pattern-match to an example. Derive the design from the idea:

1. **The thing**: what is actually being offered, in one sentence.
2. **The transformation**: what changes for the visitor after they buy, join or call (from stressed to organised, from hungry to fed, from unsure to booked).
3. **The reason to believe**: what evidence would convince a skeptical stranger? A process they can watch, parts and specs they can inspect, results they can compare, people they can meet, a place they can walk through, numbers they can verify.
4. **The action**: the ONE thing they should do.

Then choose the story mechanic that SHOWS the reason to believe instead of asserting it:

| Reason to believe | Mechanic | How it works |
|---|---|---|
| A process makes it good (food, craft, manufacturing, a method) | Scroll film | pinned chapters of the process, 2D drawn, ending on the finished result |
| It is a physical object with parts and specs | Exploded product | disassemble, spec callouts, reassemble |
| Results over time (coaching, clinic, training, renovation) | Before / after + timeline | a draggable before/after slider per case, and a timeline of the engagement with real dates |
| A range the visitor must choose from | Configurator / rooms | live variants (colour, size, plan) updating one 3D or 2D preview; or one room per item |
| A place (venue, property, school, restaurant, campus) | Walk-through | a scroll path through the place: photo or rendered panorama sequence with a floor-plan map that follows |
| A journey with steps (course, visa, onboarding, treatment) | Journey path | an SVG path drawn by scroll with waypoints that reveal each step and its duration |
| Scale or impact (nonprofit, infrastructure, research, data) | Zoom / scale story | camera pulls from person to city to world, counters that count on entry |
| A product UI (software, dashboard, tool) | Live demo scrubbed by scroll | the real interface, cropped, changing state as you scroll; no stock mock-ups |
| Trust and expertise (law, finance, medicine, consulting) | Calm register | restrained type, ruled facts, named people with credentials, real case outcomes, zero effects |
| Personality (studio, portfolio, artist, game) | World or single hero object | one memorable interactive object or scene that IS the brand |

Combine at most two mechanics. If nothing fits, ask "what is the most convincing way to SHOW this?" and design that. Everything else (palette, type, motion, 3D) follows from the brand's emotion, not from the mechanic. Record the four answers and the chosen mechanic at the top of `docs/design/DESIGN.md`.

Extra mechanic recipes:

- **Before / after slider**: two layers in one container, the top clipped by `clip-path: inset(0 X% 0 0)` driven by a range input (real `<input type="range">`, so keyboard and touch work); labels "Before" and "After" as text; never fake results, use TODO(user) for missing imagery.
- **Journey path**: an SVG `<path>` whose `stroke-dasharray` equals its length and `stroke-dashoffset` follows scroll progress; waypoints are real headings that fade in when the path reaches them; each shows one duration or cost fact.
- **Configurator**: state in one object, options as real radio groups (labelled), the preview reads from state; the price and the selected summary are DOM text; the order action carries the summary (a pre-filled WhatsApp or mailto).
- **Zoom / scale story**: nested containers scaled with `transform: scale()` on scroll progress, each level a real section with one number; counters use `requestAnimationFrame` once on entry and respect reduced motion.
- **Walk-through**: a frame sequence or panorama scrubbed by scroll, with a small floor-plan or map whose "you are here" marker follows progress; every stop has real text (name, size, what happens here).

### Palette archetypes -- starting points, then make it yours (max 2-3 colours plus neutrals, one accent)

| Archetype | Example set | Use for |
|---|---|---|
| Heritage cream + orange | #FAF6EF, #1A1A1A, #F37021 | craft, heritage retail |
| Jewel green + gold | #006039, #A37E2C, #F5F1E8 | prestige, finance, hospitality |
| Maison red + black | #A6192E, #0B0B0B, #F4F0EA | fashion, jewellery |
| Apple neutral | #000000, #F5F5F7, #1D1D1F, accent #0071E3 | hardware |
| Dark SaaS | #08090A, #F7F8F8, accent #5E6AD2 | developer tools |
| Fintech navy | #0A2540, #635BFF, white | payments, B2B |
| Icy tech | #05070D, #9FD8FF, #E8F6FF | futuristic, data |
| Signal red performance | #0B0B0B, #FFFFFF, #D5001C | automotive, sport |
| Dark blue + gold marker | #0A1226, #16305A, #3B82F6, gold #D4AF37 only as a marker | dashboards, this owner's preferred look |
| Paper + ink + one band colour | #FBFAF8, #10151B, band #A81330 (Zenith) | institutions, education |
| Playful saturated world | mid-tone sky/grass + one red hero object | games, portfolios |

Craft and copy rules (they decide whether the site feels like quality or like a template): NO EMOJI anywhere -- not in copy, headings, buttons, alt text or icons; icons are drawn SVG or nothing. No exclamation marks. Write like the person who makes the thing, specifically ("72 hours of cold fermentation", not "artisan quality"). One real detail per section. No filler adjectives, no stock-photo cliches. For food and craft, quality comes from texture, warm directional light, close crops, steam, grain, flour dust and slow, confident motion -- never from decoration.

Rules: one job per colour (text, surface, one accent, state colours); the accent fills whole bands or key actions, it is never scattered; gold/brass only as a marker; no purple-to-pink gradients; every text pair at least 4.5:1 (3:1 large) -- compute it, do not eyeball it, and remember small faint labels are where sites fail (Zenith's 11px `ink-faint` was 3.6:1).

### Type pairings (use free fonts; do not use licensed ones such as Soehne, SF Pro or Porsche Next)

- High-contrast serif display + light sans body: Bodoni Moda / Cormorant / Playfair + Archivo / Inter (luxury, institutions)
- Neo-grotesque only, big and tight: Inter / Geist (SaaS, hardware)
- Serif headline + mono labels: Fraunces / Newsreader + IBM Plex Mono / JetBrains Mono (craft, technical)
- Wide geometric display + small caps labels: Space Grotesk / Syne (tech, automotive)
- Heavy uppercase display + neutral body: Archivo 800-900 + Inter (fashion, streetwear)

Track big display type tighter (-0.02em to -0.03em), line-height 0.92-1.1; body 16-18px, line-height 1.5-1.65, measure 45-75ch; eyebrow labels 12px uppercase with 0.16-0.3em tracking. Self-host with fontsource or next/font.

### Decision guide

| Brand | Formation | Palette | Type | Motion | 3D |
|---|---|---|---|---|---|
| Luxury retail | 1 | cream/black + one accent | serif + light sans | gentle fades only | product viewer at most |
| One hardware product | 2 | black/white + one accent | neo-grotesque | scroll-scrubbed sequence | canvas image sequence or GLB |
| Range / automotive | 3 or configurator | dark neutral + signal colour | wide sans | room transitions | three.js, per-scene budget |
| SaaS / dev tool | 6 | dark or light neutral + indigo/blue | Inter-class | staggered reveals | none, or shader gradient |
| Portfolio / agency | 4 or 5 | from the world | custom or expressive | Lenis + ScrollTrigger | three.js/R3F |
| Institution / service | 7 | paper + ink + one band | serif + grotesque | 12-16px reveals, one authored moment per section | CSS 3D object at most |
| Fashion / catalogue | 8 | off-white + near-black + one accent | heavy display + Inter | clip-path hovers | CSS 3D carousel at most |
| Dashboard / app | fixed shell | dark blues + gold marker | neo-grotesque | minimal | none |
| Food, craft, "how it is made" (bakery, coffee, ceramics) | 10 scroll film | dark warm brown/ink + one glow colour, light paper for the menu | serif display + plain grotesk | scroll-scrubbed chapters, 2D drawn then a 3D finished object | procedural three.js finished object, poster fallback |
| One simple physical product (mouse, lamp, speaker) | 11 exploded product | near-black or soft neutral + one accent | neo-grotesque | disassemble, hold with spec callouts, reassemble in a fixed short window | three.js parts or CSS 3D layers |

3D is wrong for SaaS UI, content-heavy pages and shop grids. Ask of every 3D idea: does it help the visitor understand or feel something they could not otherwise? If not, cut it.

## What the owner's own best sites teach

**Zenith** (thesis-led, nearly finished): a written thesis and two refused defaults; each colour has one job (crimson only as full-width bands, brass only for honours); Bodoni display at weight 500 tracked -0.028em with a grotesk; zero radius, zero shadow, zero gradient -- depth from 1px hairlines, a double rule and a mat-board frame; one 88rem container; data as ruled registers; each section gets one authored moment (a rule that draws, a real CSS-3D bookshelf, a timeline), everything else moves once, 12-16px over 0.6s with exponential ease-outs and bounce-0 springs; one conversion (WhatsApp with pre-written text) repeated four times; honest placeholders instead of invented proof; skip link, focus-visible outline, focus-trapped drawer, reduced-motion / transparency / contrast handled. Its faults: dead components, unused dependencies, a stale design doc, a visible "pending" tile, 11px labels under AA, two different founder names, twelve identical section paddings.

**FIER clone** (competent but shallow): off-white + near-black + one orange accent; Archivo 800-900 uppercase at line-height 0.85-0.92 over Inter; 12px 0.3em eyebrows; a bordered contact-sheet grid; clip-path image-swap hovers at 500ms; a CSS-3D carousel with capped slot transforms; scroll transforms kept to +-4-6 degrees and +-40px. Its faults: the planned 3D was never built (three and R3F installed, never imported); a component named Hero3D that is a slideshow; setState on every animation frame; a -10% reveal margin that can leave content invisible; no reduced-motion handling; three identical poster blocks; invented reviews; nav links all pointing at one anchor; hot-linked images.

Never repeat those faults.

## Step 2b -- Storyboard (docs/design/PLAN.md) -- plan before you build

Like a plan mode: write the plan first so nothing is improvised. For a scroll film or exploded product, a table with one row per chapter: chapter name, scroll span (in screen-heights), what is on stage (2D drawing, filmed frames, 3D object), the ONE line of copy, the spec or fact it carries, the asset you will produce and how (see the asset ladder), and the reduced-motion / no-WebGL fallback frame. Add the total scroll length and the time a visitor needs to see it all at a normal scroll (aim for 40-90 seconds). Then build to the plan and update it if you change course.

## Step 3 -- Design system before components

(This is the discipline behind Lovable's generated apps -- checked against its docs and a community copy of its agent prompt. It builds the design system FIRST, keeps ALL styling in it, and its known weakness is sameness when nobody constrains it: hence the direction, tokens and signature element below.)

One tokens file (CSS variables or Tailwind `@theme`) in three tiers: primitives (the raw palette and scales), semantic tokens (`--color-text-primary`, `--color-surface`, `--color-accent`, `--space-section`), and component tokens (`--button-primary-bg`). Also tokens for gradients, shadows, radii, motion durations and easings. Rules that make it hold:

- No ad hoc styles in components: no raw hex or rgb colours, no `text-white`/`bg-white`-style direct colour classes, no arbitrary values like `p-[13px]` or `text-[#c31f3f]`. Everything comes from a token. The board's token-discipline tester counts violations.
- Extend components with variants built on tokens (a `hero` button, a `quiet` card), never by overriding classes at the call site. Avoid transparent-outline variants with white text: they vanish on light surfaces. Check both light and dark themes if the site has both.
- Build a component-kit page FIRST (`/kit` or `docs/kit.html`): nav, buttons in every state, form fields, cards, badges, table, empty state, modal, at the real tokens. Only then build the real pages from those components.
- **Thread the ONE brand hue through every state (verified against LIVE Legion, livelegion.info, in the web designer's reference notes):** take the accent hue from the project's own brand or logo (never purple/pink, see the banned defaults), then derive from it, as named tokens, not bare hex repeated in components: a light TINT (same hue, very high lightness) for subtle card/badge backgrounds; a dark SHADE (same hue, low lightness) for text sitting on that tint; a shadow tinted with the brand hue at low opacity instead of plain black; and, only if a gradient is used at all, a two-stop gradient built from the SAME hue at two nearby angles, never two unrelated hues. This is what makes a whole dashboard or app read as branded rather than generic.
- Prompt-level direction, like Lovable's own guide: set the visual language with two or three concrete keywords (for example "quiet, premium, slow" or "raw, editorial, oversized"), a named font pairing that is NOT the default Inter or system stack, a hex palette, an imagery style and an icon style; use real copy from the brief, never lorem ipsum, because real copy shows the true spacing. Save these as the top of `docs/design/DESIGN.md`.
- Sameness guard: add ONE signature element per page (a drawn rule, a real 3D object, an unusual grid, a distinctive interaction); vary section layouts (do not stack the same card grid); reject your own first draft if it looks like a template, and redo it.
- Make small, verifiable changes: one component or one section at a time, build after each, commit at each working state, keep files small.

Components use tokens only. Vary section rhythm (do not give twelve sections the same padding); alternate surfaces deliberately. Write the final tokens back into `docs/design/DESIGN.md` so the doc cannot drift from the CSS.

## Step 4 -- Layout and scroll rules

- Marketing page: at most 7 sections and about 6 screen-heights, one job per section. A scroll film or exploded-product page may be longer because the scroll IS the content: each chapter 80-120% of a screen, the whole film at most about 12 screen-heights (run the board with `--budget 12`), with a visible progress rail, a working "skip to the menu / contact" link, and a film that never blocks the page's key action. Apps/dashboards: a fixed shell, at most ONE scrolling region per view, no nested scrollers, no horizontal scroll.
- Never hijack scroll. Native scrolling, keyboard, anchors and find-in-page must keep working. CSS sticky and scroll-snap first; GSAP ScrollTrigger only for a scrubbed or pinned timeline; if Lenis is used, drive ScrollTrigger from Lenis on ONE shared requestAnimationFrame. Do not combine CSS scroll-snap with JS scrubbing.
- **GSAP ScrollTrigger pattern (verified against Telmai, hip.rs/telmai, in the web designer's reference notes):** pin ONE container and scrub ONE timeline against it (`scrollTrigger: { trigger: '#scroll-space', start: 'top top', end: 'bottom bottom', scrub: 1.1 }`) -- `scrub` a damped number, not `true`, so the story trails the scrollbar instead of locking to it exactly; `scrub: true` only under `prefers-reduced-motion`, where instant is correct. Position every beat on that one timeline with a time label (`tl.fromTo(el, {...}, {...}, atTime)`) rather than a separate ScrollTrigger per element. Write one named helper per animation TYPE the story needs (a fade, a tag/label pop-in anchored to its target with `back.out()` easing, a camera pan on a group transform, a line-draw via `strokeDashoffset`) and call the helpers at increasing time offsets -- this is what makes a scroll story read as one continuous film instead of stacked reveal-on-scroll snippets.
- Animate only transform and opacity, never width/height/top/left/margin/box-shadow. Reveals must never leave content invisible (use `once: true`, `amount: 0` or a safe margin).
- Do not `setState` per animation frame; use refs, CSS variables or motion values, and pause loops that are off-screen.
- Navigation stays reachable from every section. One conversion, repeated where the visitor decides.

## Step 5 -- 3D (only when the brief calls for it)

Choose the lightest tool that delivers: CSS 3D transforms (tilt cards, flip cards, a bookshelf, a carousel); a canvas image sequence (one product, scroll-scrubbed); three.js / @react-three/fiber + drei (a real scene); a looping video with a poster; Spline only for prototypes. A 3D dependency that is installed but never rendered is a FAILED step: the scene must actually mount, and `Hero3D` must not be a slideshow.

Rules: lazy-load the canvas with a dynamic import so it never blocks first paint or LCP, and show a designed poster while it loads; detect WebGL and `prefers-reduced-motion` BEFORE mounting and show the poster instead; cap device pixel ratio at 2 (lower on mobile) and use a lower-quality preset on mobile (drop blur, depth of field, shadows); render on demand (`frameloop="demand"`) when nothing animates; pause when off-screen (IntersectionObserver); models as Draco/Meshopt glTF with KTX2 textures, about 2 MB total, image sequences under about 3 MB with a single-image fallback on slow connections; about 100 draw calls or fewer on mobile (instance repeats, merge static meshes, atlas textures); warm shader compilation during the loader; no allocation in the frame loop; dispose geometries, materials and textures on unmount; handle context loss. Scroll-driven 3D: one scroll-progress value drives the scene; the page text stays real, selectable DOM beside it; the page must work with the scene switched off. Give each scene entrance, hold and exit beats.

## Step 5b -- Produce every asset in one place (the asset ladder)

The owner must never have to go to other tools or companies for images, video or 3D. Produce what the story needs here, using the highest rung that works in this environment, and record the rung you used in `docs/design/PLAN.md`:

1. **Procedural in code (always available)**: hand-authored SVG line art (animate `stroke-dashoffset` to "draw" a step), CSS layers, canvas 2D, and three.js procedural geometry (a loaf from a lathe or displaced sphere with a noise normal map and a scored crust; a mouse from rounded boxes, a lathe scroll wheel and an extruded PCB; bottles and cups with LatheGeometry; no glTF needed). Give it material, one warm key light and grain so it reads as photographed, not as flat vector.
2. **Bake to frames (still no other company)**: build the scene as a page that exposes `window.__renderFrame(t)` for t from 0 to 1, then run `node scripts/render-frames.mjs --url scene.html --frames 120 --out public/frames` (the app writes this script into the project; it drives the installed Chrome or Edge and saves WebP frames plus a manifest). Play them with the canvas scrubber recipe. Keep 60-180 frames, 1280 wide, WebP quality 60-70, under about 3 MB per sequence, with a smaller mobile set.
3. **What the owner already has**: photos, logos, product shots in the project or `assets/`. Never hot-link.
4. **Optional generation provider**: only if the project already has its own key configured (for example a `.env` entry for an image or video API the owner set up). Call it from one script, never scatter calls, never commit the key. If there is no key, do NOT stop or ask: take rung 1 or 2.
5. **Sample asset**: a designed frame that looks intentional and finished, marked as a sample in the content file and listed under "Sample content to replace" in the README, so it can be swapped later. Never a stock lookalike passed off as real, never a made-up claim.

In the same project also produce: the copy (from the brief facts), SEO tags and an Open Graph image, favicon, sitemap, an enquiry path that works with no backend (WhatsApp, tel or mailto links), and deployment notes in the README. Everything lives in the repo.

## Step 6 -- Build order and hygiene

Tokens, layout shell, content as typed data files, sections, motion, 3D, polish. Files under about 400 lines; split sections into components. No dead components, no unused dependencies (if you installed it, it is used; if you planned it, it is built or deleted from the plan). Images local and sized (width/height set), compressed AVIF/WebP, lazy below the fold. Real tests for logic. README, ARCHITECTURE.md, WORKFLOW.md kept true.

## Step 7 -- Convene the board of testers

The board is a set of visitors with real, different conditions. Some are scripts that measure in a real Chrome/Edge; some are opinion testers you convene as sub-agents. You run them, you read every finding, you fix.

**Setup (once):** `npm i -D playwright-core` (uses the installed Chrome or Edge, no browser download). Serve the page (a static file works: no server needed) and run:

`node scripts/design-board.mjs --url index.html --out docs/board`  (or `--url http://localhost:5173` for a dev server; add `--budget 6` for the screen-height budget)

It writes `docs/board/report.md`, `latest.json` and `shots/*.png`, and exits 1 while any blocker or major is open. Never wait more than about a minute for a server: start it in the background, or use the built static output.

**The scripted testers** (all measured, none guessed):

| Tester | Real condition | What counts |
|---|---|---|
| Impatient shopper | 390px phone, Slow 4G (1.6 Mbps, 150 ms), 4x CPU | LCP under 2.5 s (over 4 s fails), CLS under 0.1, under 1.5 MB, tap targets 44px (24px hard floor), CTA on the first screen, no sideways scroll |
| Cheap Android | 360px, Fast 3G, 6x CPU | blocking main-thread work, console errors, load time |
| Zooming reader | 320px wide (=400% zoom) and 200% text | no horizontal scroll, no clipped text |
| Screen-reader user | the accessibility tree | one h1, no heading skips, one main, nav, alt text, named links/buttons/fields, lang, title |
| Keyboard-only user | Tab through everything | reaches everything, visible focus ring on each stop, skip link |
| Colour-blind / sunlight | contrast maths + four vision-deficiency screenshots | 4.5:1 body, 3:1 large; state not carried by colour alone |
| Motion-sensitive, no GPU | reduced motion + WebGL disabled | no endless animation, no autoplay video, a fallback for every canvas, no errors |
| Crawler / link preview | JavaScript off | real HTML text, title, description, Open Graph, no noindex |
| Skeptical first-timer | 1440px, first screen only | the first screen shows the real thing (product, demo, scene) with one clear action and a contact route, no large opening heading block, no placeholders; the one h1 is visually hidden |
| Big and small screens | 1366, 1920 and 3440px | no sideways scroll, line length, ultrawide container |
| Scroll auditor | 1440px | screen-heights against the budget, nested scrollers, section count |
| Scroll smoothness | 4x CPU, full-page scroll | share of frames over 50 ms |

**The opinion testers** (convene each as a sub-agent with the Task/Agent tool, give it ONLY what that visitor would see -- the screenshots in `docs/board/shots/` -- and ask for findings in the format below):

1. **Design critic** (expert, sees `first-screen-1440.png`, `mobile-390.png`, `full-page.png`): hierarchy, spacing rhythm, palette, type pairing, consistency, distinctiveness. Must name what looks generic or templated and which refused default crept back in. Scores 1-5 per dimension; any 3 or lower needs a cited region. May raise at most a **major**.
2. **Skeptical first-time visitor** (sees only `first-screen-1440.png`, 5 seconds): what is this, who is it for, what would you click? A wrong or "unclear" answer is a major.
3. **Owner who asked** (sees the brief and the screenshots): does this deliver the brief's one action, tone and archetype? What is missing or off-brief?
4. **Honesty auditor** (reads the page text and data files): any invented number, testimonial, credential or claim; any "pending", lorem or TODO visible; any name that disagrees with another page.
5. **Competitor** (sees the screenshots and your REFERENCES.md): where is this weaker than the references it took from, and does any part copy a reference too closely?

**Finding format** (scripts and sub-agents alike): `{ tester, severity: blocker|major|minor|nit, evidence: selector | measurement | screenshot region, expected: the measurable pass condition, fix: a concrete change }`. A finding with no evidence is dropped. Subjective testers may not raise a blocker. Deduplicate by element + criterion. Severity: **blocker** = the task cannot be done or a primary-path AA failure (keyboard trap, no name on the main action, blank without JS/WebGL, sideways scroll at 320, LCP over 4 s); **major** = doable but painful, or a clear AA / Core Web Vitals failure; **minor** = needs improvement; **nit** = taste, never fixed in the loop.

**Loop policy:**
1. Round 1: run the script and convene every opinion tester. Save `docs/board/round-1.md` with all findings.
2. Fix every blocker and major, ordered by how many testers it affects. After each fix re-run only the tester that raised it, plus a smoke run of the rest to catch regressions. A fix must not raise another tester's finding count.
3. At most 3 rounds; run the FULL board in round 3.
4. Stop when the last full run has zero blockers and zero majors, or nothing changed since the previous round, or 3 rounds are used.
5. If the same finding survives two consecutive rounds after a fix attempt, stop retrying it: list it as **unresolved** with its evidence.
6. Write `docs/board/FINAL.md`: a table of tester and verdict, the remaining minors and nits (listed, not fixed), and the unresolved list.
7. Copy the outcome into "## Design checks" of `WORKFLOW.md` as `- [pass|fail|skipped: reason] tester -- one line`. Never write pass for a tester that did not run; if `playwright-core` or Chrome/Edge is unavailable say `skipped` and why.

## Definition of done

Brief, references, thesis and tokens written; the site built to the chosen formation with no dead code or unused dependency; the board run to its stop rule; FINAL.md written; README "Needs you" lists every TODO(user); final reply states `Build: passed|failed|not run`, the board verdict, and the unresolved list.


## Recipes

### Scroll film recipe (process walk-through, 2D into 3D)

Structure: one tall section (height = chapters x 100vh). Inside it, `position: sticky; top: 0; height: 100vh` holds the stage. One scroll progress `p` (0-1) comes from the section's own scroll; chapter index = floor(p x chapters); local progress = the fraction inside the chapter. Each chapter animates with its local progress: SVG strokes draw with `stroke-dashoffset`, parts fade and slide 12-24px, the caption swaps with a 0.4 s cross-fade, the progress rail fills. Chapters are separate components with typed props, not one giant file.

Example, bread: 1 flour and water meet (grain, a pour); 2 the dough is worked (a folding motion, drawn); 3 the long rest (bubbles rising, a clock arc with the real hours); 4 shaping and scoring (the blade line draws); 5 the oven (a warm glow builds, steam); 6 the loaf comes OUT of the drawing: the flat illustration hands over to a 3D loaf that turns once, slowly, lit from one side, crust texture visible, ending on the order action. Every caption is one specific sentence with a real fact.

Implementation: GSAP ScrollTrigger with `scrub: 0.5`, `pin: true` and one timeline with a label per chapter; or CSS `animation-timeline: scroll()/view()` with a JavaScript fallback; Lenis optional on one shared rAF. For chapters baked to frames use the canvas scrubber. Progressive enhancement: with JavaScript off or reduced motion, show the chapters as a plain stacked storyboard (one still frame + caption each), no scroll magic, all content readable.

### Canvas frame scrubber (video-like scroll without a video element)

```js
// frames: ['/frames/0001.webp', ...]; the canvas sits inside the sticky stage
const imgs = frames.map((src) => { const i = new Image(); i.decoding = 'async'; i.src = src; return i })
const ctx = canvas.getContext('2d'); let last = -1
function draw(p) {
  const i = Math.min(imgs.length - 1, Math.round(p * (imgs.length - 1)))
  if (i === last || !imgs[i].complete) return
  last = i
  const r = Math.max(canvas.width / imgs[i].width, canvas.height / imgs[i].height) // cover
  ctx.drawImage(imgs[i], (canvas.width - imgs[i].width * r) / 2, (canvas.height - imgs[i].height * r) / 2, imgs[i].width * r, imgs[i].height * r)
}
// size the canvas to clientWidth * min(devicePixelRatio, 2); call draw(p) from the scroll handler inside requestAnimationFrame
```

Load the first frame eagerly (it is the poster; show it as an `<img>` until the canvas is ready) and the rest lazily with an IntersectionObserver (rootMargin about 800px).

### Exploded product recipe (disassemble, spec callouts, reassemble)

Model the product as a list of parts, each with: `name`, the mesh or layer, an `explode` vector (direction and distance), a `depth` (0 = outer shell, 1 = inside, 2 = inside that) and an optional spec `{ label, value }`. For a mouse: top shell, bottom shell, scroll wheel and encoder, left and right switches, PCB, optical sensor, battery, cable or receiver. One scroll section, progress `p`:

- 0.00-0.10: the assembled product, turning slightly; title and one line of copy.
- 0.10-0.45: DISASSEMBLE in depth order: depth-0 parts move first (ease-out), then depth-1, then depth-2, each staggered by about 0.08; parts spread along their vectors and never cross the camera; the camera eases back a little and orbits about 25 degrees.
- 0.45-0.80: HOLD apart while each part in turn is highlighted (the others dim to 35% opacity) and its spec callout appears as real text beside it, for example "Optical sensor -- 26,000 DPI", "Main switches -- 80 million clicks", "Battery -- 70 hours".
- 0.80-0.95: REASSEMBLE: everything eases back together in reverse depth order, quickly (about 15% of the section's scroll, never more than about 20%), with a soft settle.
- 0.95-1.00: the finished product, the price and the one action.

Total pinned length about 4-6 screen-heights. In three.js: one root `Group`, `part.position = base + explodeVector * ease(localProgress)` per part with `MathUtils.smoothstep` or easeOutCubic. As CSS 3D when the product reads as stacked layers: `transform-style: preserve-3d` and `translate3d`/`rotateX` per layer. Callouts and specs are DOM text (selectable, readable by screen readers), placed beside the stage or at the projected part position. With reduced motion or no WebGL: show a still exploded diagram with the same callouts as a list. If the owner gave no specs, write `TODO(user): real spec`; never invent numbers.

## Worked examples -- what "good" looks like (do not copy them: derive from the real idea)

These two show the reasoning, not the answer. A tutoring centre would get the calm-register or journey-path treatment; a surf school a walk-through; a SaaS tool a scrubbed live demo.

### Example A -- the bakery site (a process is the reason to believe)

Brief: an artisan bakery; the one action is to order by WhatsApp. Thesis: "Bread you can feel before you taste it: slow, warm, honest." Refused defaults: the cream-and-orange serif template, and stock bakery photography. Formation: scroll film (10) ending on a 3D loaf. Palette: deep flour-brown, an oven-amber marker, warm off-white text on dark for the film; light paper for the menu. Type: a serif display with a plain grotesk. No emoji anywhere. Chapters: flour and water, the fold, the long rest (with the real fermentation hours), the score, the oven (glow and steam), the loaf arrives in 3D. The menu, the visit details and the order section follow the film (about three screens). The board runs on all of it: the film must still work at 390px, with reduced motion (stacked storyboard) and without WebGL (poster frame).


---

<!-- references/web-designer-references.md -->

# Web designer: reference notes

Operator, 2026-09-19: "study this website, it looks pretty good": https://www.dolthub.com/

Take the principles, never the exact look. The operator does not want a copying accusation, so no copied logo, copy, imagery or an identical palette.

## DoltHub, what was verified (from its shipped CSS, 2026-09-19)

- **Type:** Source Sans Pro for interface text, Roboto Mono for code and data. One humanist sans plus one mono, nothing else.
- **Surfaces:** a deep navy family (about #070f25, #0c1a32, #182134), not black. Depth comes from stacking slightly lighter navy layers, not from heavy borders.
- **Text:** light cool greys (about #d7d8df, #f1f3f8) on the navy, with a muted slate (about #7a96ab, #5d6280) for secondary text.
- **Accent:** ONE blue (about #3d91f0) with a lighter cyan (about #51cbee). Green, orange and red appear only as status colours (success, warning, error), never as decoration.
- **Atmosphere:** very large soft blurs (50 to 100px) and low-opacity fills (3% to 20%) give glow and a glassy layered feel without hard edges.
- **Focus:** a distinct focus colour (#08f) exists for keyboard users.

## NOT verified

The home page renders its sections in the browser, so section order, hero layout, copy and motion were not seen. Before designing from this reference, take real screenshots of the live page at desktop and 390px (browser tooling) and record what the layout and pacing actually are in docs/design/REFERENCES.md.

## What to take

- Navy layered surfaces instead of black or white; hierarchy from lightness steps.
- One accent plus semantic status colours only.
- A sans and a mono pairing, with mono reserved for code, data and identifiers.
- Soft glow and low-opacity layers as atmosphere, used sparingly, animated only with transform and opacity.

## What to refuse

- Their exact hex values, fonts, logo, copy and illustration.
- Any purple or pink gradient (rejected by the operator as AI-slop, 2026-09-17).
- Glow on every element: one or two focal glows per screen at most.

---

# Reference 2: Laya (brainfunctioncollapse.com/laya)

Operator, 2026-09-21: the goal is sites that look designed on the FIRST try, with no AI-slop look. Verified from the page's shipped HTML, CSS and JS (not a summary), 2026-09-21. Take the method, not the look: no copied palette, copy, logo or demos.

## What it actually does (verified)

- **Palette is tiny and named:** ink #0c0c0c ground, one surface #151514, two hairline greys (#2b2b28, #3d3d39), text #ededed, dim #a6a6a6, faint #808080, and ONE accent amber #ffc609. Amber is also the text-selection colour and the focus ring. Nothing else is coloured. Result: it looks expensive because nothing competes.
- **Type is two families, one job each:** a plain neo-grotesque (Helvetica Neue stack) for headings and body, the system mono for every label, button, tag, table, nav, timestamp and code. The mono at 13px carries the "technical instrument" feel; there is no display font at all.
- **Scale is huge and fluid:** h1 `clamp(44px, 9.6vw, 176px)`, section h2 `clamp(34px, 5.6vw, 92px)`, lead `clamp(19px, 1.6vw, 23px)`, body 16px, mono 13px. Headlines are set with very tight tracking (-0.035em to -0.055em) and line-height about 0.94. Big, tight, confident type is most of the design.
- **One grid, stated in the CSS:** 12 columns, one gutter `clamp(16px, 4.17vw, 64px)`, one gap, and a spacing rhythm of 8 / 16 / 32 / 64 / 96. A section opens with the heading on columns 1 to 7 and the lead plus actions on columns 8 to 12, bottoms aligned. Every section repeats it, which is why it reads as one system.
- **Zero radius, hairlines and tables:** `border-radius: 0` everywhere, 1px lines, real `<table>` comparisons with tabular numerals. (Our console is borderless and soft; this reference is the opposite. Take the DISCIPLINE, not the sharp corners.)
- **Texture is dither, in pure CSS:** `repeating-conic-gradient` and `conic-gradient` 4px patterns taking `currentColor`, plus a canvas dither stage for demos. Texture instead of gradients or shadows.
- **Motion is real, not decorative:** live demos (games and a classifier) on canvas with a fixed-timestep simulation; a recorded replay when the model is offline; `IntersectionObserver` starts a demo only when visible; `prefers-reduced-motion` pauses everything; coordinates are snapped to whole pixels so edges never shimmer. Only two CSS keyframes exist (a blink and a signal pulse).
- **Structure:** nav, hero, an in-page index nav, then numbered `section.block`s each answering a question the visitor actually has ("Is it open source?", "Which should I use?", "Does it ever lose?"), a closing band, a footer. Headings are claims with numbers ("200x faster", "27 milliseconds"), not slogans.
- **Copy:** metric-first, Q&A that answers scepticism, honest limits ("Where does it go wrong?"). Copy buttons on every command.
- **Stack:** plain static HTML, one CSS file, four small ES modules. No framework, no animation library, no WebGL. 55 KB of source in total.

## Why it does not look like AI slop (the rules to copy)

1. One ground, one surface, one accent. Count the colours; if more than five, cut.
2. Two type roles only. Mono for machine-ish text, sans for reading. Giant headline, small everything else, nothing in between.
3. One grid and one spacing scale, declared as variables at the top and used everywhere. No magic numbers.
4. Show the real thing working (a live demo, a real measurement) instead of stock imagery, gradients or 3-card icon rows.
5. Every heading is a specific claim or a real question, never "Powerful. Simple. Fast."
6. Motion answers "what is it doing right now", and stops when off-screen or when the user prefers reduced motion.
7. Texture and hairlines instead of shadows, glow and blur.

# Reference 3: Thinking Orbs (animation source)

Operator named it as the animation reference. Verified from its README, 2026-09-21.

- Package `thinking-orbs` by Jakub Antalik (github.com/Jakubantalik/thinking-orbs), MIT. React canvas library; other ports exist (vanilla JS with no build step: github.com/mad5/thinking-orbs-vanilla; Vue, web component, Flutter).
- **What it is:** small dotted orbs that say what an interface is doing, in place of a spinner. Nine verbs: working (particles on tilted orbits), searching (scan line over a dotted globe), solving (bands scramble then lock), listening (ripples through rings), connecting (constellation lines wire up), weaving (three braided strands), composing (undulating bands), breathing (ring morph), shaping (circle to triangle to square).
- **Why it looks right:** monochrome and theme-aware, plain 2D canvas arcs only (no WebGL, filters or images), DPR capped at 2, pauses off-screen via IntersectionObserver, honours prefers-reduced-motion with a static frame, all instances share timing, two hand-tuned sizes (64 for avatars, 20 for inline) rather than one scaled.
- **How to use it:** show ONE orb tied to a real state (thinking, searching, connecting), never as decoration. The rule it teaches: motion must mean a state.
- **Not yet supplied:** the operator also named "brag" as a reference but gave no URL and a search found nothing. Do not invent it. Ask for the link before citing it.

# Standards the Web Designer must apply on every site (first-try checklist)

Add these to the plan and to the end-of-goal verdict:

1. **Direction sentence first:** one line naming the audience, the one accent colour, the two type roles, and the one signature element (a live demo, an orb, a dither texture, a real measurement). No signature element means no build.
2. **Tokens before components:** colour, type scale (fluid `clamp`), 12-column grid, spacing scale as CSS variables in one file. No hard-coded values in components.
3. **Real content:** specific headings and true numbers from the project. Never lorem, never "Welcome to". Refuse fake testimonials and invented metrics.
4. **Banned defaults:** purple or pink gradients, three-card icon rows, glassmorphism everywhere, emoji as icons, centred-everything heroes, gradient text on every headline, stock hero imagery, rounded-2xl on every box.
5. **Motion budget:** animate transform and opacity only; start on visibility; one focal animation per screen; a static fallback under prefers-reduced-motion; never block content behind an intro.
6. **Accessibility floor:** AA contrast, visible focus ring in the accent, real headings and landmarks, keyboard reachable, alt text, tap targets 44px.
7. **Responsive proof:** screenshot at desktop and 390px and read them before claiming done; no horizontal scroll; tables scroll inside their own container.
8. **Performance floor:** no framework unless needed, no animation library for one effect, images sized, fonts limited to two families, first paint under 2s on a mid phone.
9. **Honesty:** copy makes only claims the product can back; limits are stated.

# Sources the Web Designer may point the coding agent to

- Laya, structure and method: https://brainfunctioncollapse.com/laya (CSS at /laya/static/style.css)
- DoltHub, navy layered surfaces: https://www.dolthub.com/
- Thinking Orbs (React): https://github.com/Jakubantalik/thinking-orbs
- Thinking Orbs (vanilla, no build): https://github.com/mad5/thinking-orbs-vanilla
- Thinking Orbs on 21st.dev: https://21st.dev/@larsen66/components/thinking-orbs/thinking
- ElevenLabs UI Orb (state-driven orb): https://ui.elevenlabs.io/docs/components/orb

# Enforced, not advisory

At the end of a website goal the office scans the project's own source (src/specialists/site-standards.ts). These FAIL the site and force the one redo, whatever the reviewers say: a large heading block at the start of the page: any visible <h1>, an h1 or h2 in the first lines of the page, or an eyebrow/kicker/overline caption above the content (operator, 2026-09-21: this is the Claude Code default that makes every site look the same. Open with the real content: the product working, the demo, the thing itself, and let sections earn their own headings further down. An h1 visually hidden with sr-only is allowed for screen readers), a gradient with a purple or pink stop (hex, hsl, named or Tailwind), lorem ipsum text, more than three font families, animation with no prefers-reduced-motion handling. These are reported as warnings: `transition: all`, a "Welcome to" heading, gradient headline text, more than twelve rounded-2xl boxes, removed outlines with no :focus-visible, no viewport meta. Build to pass this scan from the first commit.

## Operator note: the big opening heading (2026-09-21)

Claude Code habitually opens every page with a huge heading, often with a small caption above it and a subtitle below. The operator wants that gone. It is the single most recognisable tell of a generated site. Laya's giant type scale is still worth taking, but apply it to content and section headings further down the page, never to a title block at the very top. Start the page with something real: the working demo, the product, a measurement, the navigation and the first true content.

---

# Reference 4-6: product-focused sites and one dashboard (verified 2026-09-22)

Operator, 2026-09-22: study these for "product and animation focused" sites that stay simple but leave an impression, one real scroll-animation site, and one dashboard/UI reference for how a brand's colour threads through an app. Verified from each site's shipped CSS/JS, not a summary.

## Asymm (asym2.lovable.app) -- restraint as the whole design

A Lovable-built site, and worth naming BECAUSE it is Lovable-built: it proves the platform's default output can look considered when the builder restrains it, which is exactly what this project's own scan and playbook are for.

- Pure black and white: `--background: 0 0% 0%`, `--foreground: 0 0% 100%`, one grey step for cards (4%), muted text at 55% grey. No accent colour at all -- the only colour in the system is the destructive red, used nowhere in the design itself.
- `--radius: 0px`. Every corner is square.
- Two type roles: "Rethink Sans" for display, "JetBrains Mono" for everything technical (`--font-display`, `--font-mono`), the same two-role discipline as Laya.
- A `.dot-grid` texture: `radial-gradient(circle, hsl(0 0% 100% / .07) 1px, transparent 1px)` -- a faint dot field instead of any gradient or shadow.
- Headline: "Illuminate the unseen." One line, no subtitle stacked under it, direct into the job listings.
- **Take:** monochrome plus texture can carry a whole brand when the type and grid are disciplined. Zero accent colour is itself a valid palette choice for a technical/defense-style brand.

## TouristyAF (touristyaf.lovable.app) -- personality through two type roles and one accent

- Palette: white ground, near-black ink, one deep green primary (`hsl(160 80% 19%)`) and one gold/mustard secondary (`hsl(47 100% 60%)`) used as the accent -- warm, not the default blue-on-dark every generated site reaches for.
- Type: "Arimo" (sans) for headlines via `--font-headline`, "Anonymous Pro" (monospace) for body via `--font-body` -- a monospace body is the unusual, personality-carrying choice here, the opposite of the expected serif-headline/sans-body pairing.
- First-person, warm copy ("Hi, I'm Nidia") rather than a company voice -- a portfolio decision, not one to copy into a product site, but the LESSON generalises: copy voice is a design decision made once, up front, and held throughout.
- Content sections are three repeated verticals (blog, video diaries, photography) shown as image grids -- the product (the work itself) fills the page; there is no separate "features" abstraction layer between the visitor and the actual content.
- **Take:** one warm accent instead of blue, a monospace body used deliberately for personality, and let the real content (photos, videos) be the layout rather than wrapping it in generic cards.

## Telmai (hip.rs/telmai) -- GSAP ScrollTrigger done properly, verified from source

This is the real technique reference for scroll animation. It runs on GSAP 3.12.5 + ScrollTrigger (cdnjs), pinning ONE `#scroll-space` element and scrubbing a single timeline against it:

    gsap.registerPlugin(ScrollTrigger)
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: '#scroll-space', start: 'top top', end: 'bottom bottom', scrub: reducedMotion ? true : 1.1 },
    })

- **One timeline, positioned with time labels**, not one ScrollTrigger per element: `fadeIn('#s10', 4, 3)` inserts a `fromTo(opacity/y)` tween at time 4 for 3 seconds on the shared timeline; every phase of the story is just more calls into the same `tl` at increasing offsets. This is why the whole page feels like one continuous film instead of stacked "reveal on scroll" snippets.
- **Named beats, not generic fades**: a helper per animation TYPE -- `fadeIn`/`fadeOut` (opacity + y), `tagIn`/`tagOut` (a label popping in with `scale` from a `transformOrigin` anchored to the exact SVG coordinate it points at, eased with `back.out(2)` for a felt "settle"), a camera pan (`scale`/`x`/`y` on a `#camera` group with `svgOrigin`), an SVG `strokeDashoffset` line-draw, and a radar "scan sweep" (a rect width tween plus a line position tween running together).
- **`scrub: 1.1`** (a number, not `true`): the timeline trails the scrollbar by about 1.1 seconds of easing, which is what makes it feel physical instead of instantly locked to the mouse wheel. `scrub: true` (exact, no lag) is used ONLY under `prefers-reduced-motion` at the very top, i.e. the one place where instant response is more correct than smoothing.
- Everything animated is `opacity`, `y`, `scale`, `strokeDashoffset`, or an SVG group transform -- never width/height/layout properties, matching this project's own motion-budget rule.
- Palette: ink `#070B14`, paper `#EAF2F6` (near-white text, not pure white), one teal-cyan "blueprint" accent `#3FE0C8`, one amber "signal" `#FFC24B`, one red "alert" -- each colour is a NAMED state (blueprint = structure, signal = a highlight, alert = a problem), not decoration. Type: "Anton" (condensed display) for big numbers/labels, "Space Grotesk" for body, "IBM Plex Mono" for data.
- **Take:** one GSAP timeline pinned to one scroll container, named per-beat helper functions instead of ad hoc tweens, `scrub` as a damped number not a boolean, animate only transform/opacity/stroke, and reduced-motion gets `scrub: true` (immediate) instead of disabling the story.

## LIVE Legion (livelegion.info) -- brand colour threaded through every state

A dashboard-style marketing/ops site. Verified palette: `--primary: 264 67% 47%` (a purple), carried through `--legion-purple`, `--legion-purple-light` (a 95%-lightness tint for subtle backgrounds), `--legion-purple-dark` (a 35%-lightness shade for text-on-light), a two-stop `--legion-gradient` from the same hue to a slightly rotated one (264 to 280 degrees), and two purpose-built shadow tokens tinted with the brand colour instead of black (`--legion-shadow: 0 4px 24px -4px hsl(264 67% 47% / .25)`).

**This project's own rule still applies: this specific hue (264 degrees, inside the 255-345 degree range) is exactly what the operator rejected as AI slop, so never copy this palette's VALUES.** Study the TECHNIQUE only, applied to whatever accent hue the project's own brand actually is (from its logo, if it has one):

- One brand hue, referenced by a semantic token name (`--legion-purple`), never a bare hex repeated across files.
- A light TINT of that hue (very high lightness, same hue) used for subtle card and badge backgrounds -- this is how "the whole app feels branded" without every surface being loud.
- A DARK SHADE of that hue used for text that sits on the light tint, so text-on-brand-background still reads as part of the same colour family instead of falling back to plain grey.
- Shadows tinted with the brand hue at low opacity instead of pure black -- this is a large part of why a branded dashboard feels cohesive rather than generic: even the drop shadows "belong" to the brand.
- A two-stop gradient built from the SAME hue at two nearby positions (264 and 280 degrees), not two unrelated colours -- a gradient that stays inside one family reads as considered; a gradient between two unrelated hues (the purple-to-pink pattern) is the rejected pattern.
- Two type roles: Inter for body, Space Grotesk for headings -- again the two-role discipline.

**Take:** pick the ONE hue from the project's own brand/logo, then derive a light tint, a dark shade, a tinted shadow and (if a gradient is used at all) a same-hue two-stop gradient from it -- never introduce a second unrelated hue for "decoration". Refuse the exact value 264-280 degrees (purple/magenta) itself; apply this token structure to the project's real brand colour instead.

---

# Reference 7-8: premium agency sites -- minimal copy, heavy motion, video-first (verified 2026-09-22)

Operator, 2026-09-22, sharing a services menu that prices "premium super animated" sites at $2,000-3,000+: this is what actually sells. Two studied from real source (curl); the rest of that list were not fetched (an agency's pricing menu is not something to reproduce, and the list was long) -- ask again with a specific URL if one of the others should be studied.

## Abonado (abonado.co) -- Webflow + GSAP/ScrollTrigger, video as the whole "what we do" section

Real Webflow build, verified from its shipped CSS and HTML.

- **The hero is a full-bleed autoplaying muted looping `<video>`** behind one headline, not an image or illustration. Every "what we do" card in the services grid is ALSO its own small looping video (a person talking, a working clip), never a static photo or an icon -- the product/process IS the visual, exactly the "show it working" rule from Laya, applied with motion instead of a live demo.
- **Named entrance-animation classes wired straight onto elements**: `load-fade-in` on the hero heading, `slide-in-top` on section headings, `slide-in-up` on grid cards, `zoom-in` on button rows and column images, `radius-hidden` for cards whose video fills a clipped rounded box. This is Webflow's IX2 (or a GSAP equivalent) driving named, reusable animation classes rather than one-off inline styles -- the same "named helper per animation TYPE" discipline as Telmai's GSAP timeline, just authored as CSS classes instead of JS timeline calls.
- **Copy is minimal and short**: one sentence headlines ("A creator-led media company built for modern partnerships"), 1-2 sentence service descriptions ("We identify and connect the right creators, brands, and agencies based on alignment, audience, and long-term potential"), no paragraphs, no feature bullet lists. The motion and the real video carry the page; the words are captions.
- **A gradient-button micro-interaction, not a colour choice**: the CTA button's "gradient" is a diagonal repeating white-transparency stripe (`linear-gradient(90deg, #ffffff0d, #ffffff1c 12.5%, ...)` at 350% background-size) that slides on hover (`background-position: 0% -> 100%`) over 0.25s -- a sheen sweep, not a colour gradient. This is a cheap, reusable "premium" micro-interaction: one CSS class, works on any button, no JS.
- Font: "Switzer" (a licensed/vendored grotesque), used as the single display+body face -- one distinctive font carries the whole premium feel rather than a font pairing.
- GSAP 3.15 + ScrollTrigger loaded (matching the Telmai pattern above): confirms this class of site commonly reaches for the same pinned-timeline technique for its scroll reveals.
- **Take:** replace stock imagery entirely with short looping video of the real product/people/process; keep every sentence of copy under about 15 words; give every scroll reveal a named class (fade/slide/zoom) applied consistently rather than bespoke per-element tweens; add one signature micro-interaction (a sheen sweep, a magnetic button, a cursor follower) reused everywhere instead of invented per button.

## The Leon Firm (theleonfirm.com) -- column layout and pacing for a dense information site

Read from a WebFetch summary (the server's ModSecurity blocked a direct curl fetch; treat these facts as less certain than Abonado's and Telmai's, which came from raw source).

- **Section order paces dense content with rhythm, not by cutting content**: hero statement -> stat badges (years, cases, response time) as a single row of numbers -> about -> a grid of service cards -> founder intro -> four value propositions -> contact -> a multi-column footer (location, phone, hours, nav links, social, grouped under horizontal dividers). Nine distinct sections still reads as minimal because each one is short and the whitespace between them is generous -- "minimal" is a pacing choice, not a section-count limit.
- **Column count changes on purpose per section**: the hero and stats read as one column (a single strong statement, then one row of numbers), the services grid steps up to 2-3 columns, then the footer steps up again to 4+ narrow columns for dense reference information (hours, links, contact). The rule: fewer columns where the content is meant to be READ, more columns where it is meant to be SCANNED or referenced later.
- **Dark navy/near-black ground with white text and one accent used only on interactive elements (arrows, CTAs)** -- the same "one ground, one accent, nothing else competes" principle as Laya and Asymm, here applied to a law-firm brand instead of a technical one.
- **Take:** vary column count deliberately by what the visitor is doing in that section (reading vs. scanning vs. referencing), not by holding one grid for the whole page; let whitespace and pacing be what makes a page with 9 sections still feel minimal.

---

# Reference 9: the rest of the operator's pricing-tier list (verified 2026-09-22, structural facts only)

Fetched (curl) and grep-scanned for palette, type, animation libraries and keyframes: swaptain.com, gazl-ff.hipdev.pro, ismail-ff.vercel.app, arjcmasters.com, nrky.ca, apt-communications.co.uk, blockd.ai, spiritrade.com, slamables.com, konsort-ff.hipdev.pro, redswitches.com, amsco-us.com, snowcrest.ch, swisscyberinstitute.com, everincreasingcircles.com, ryon-ff.hipdev.pro, plus the built CSS of aspx-ff.web.app ("Siddha Protocol") and bakoos-ff.web.app ("Robocat") and onef-ff.web.app ("1Fuel"). Not reachable: washmetrix.com (blocked by its own bot check), chefs-barth.lovable.app (project no longer exists).

## The dominant stack, confirmed across nine independent sites

Nine of the sites above -- spanning both the "premium super animated" and "premium animated" price tiers -- load the SAME three libraries regardless of platform: **GSAP + ScrollTrigger** for scroll-driven reveals, **Swiper** for carousels/sliders, and **Lottie** for small vector character/icon animations. This is not a coincidence; it is the standard toolkit for this class of commercial site, and it matches exactly what Telmai and Abonado (studied earlier) also run. **Take:** this triad is the safe, proven choice for "premium animated" work -- GSAP/ScrollTrigger for the scroll story, Swiper for anything that slides, Lottie for a small animated mark or icon that would otherwise be a static SVG.

## A shared WordPress tell, and what it means

Eight of the sites (amsco-us.com, gazl-ff.hipdev.pro, slamables.com, ryon-ff.hipdev.pro, konsort-ff.hipdev.pro, arjcmasters.com, nrky.ca, snowcrest.ch, spiritrade.com) ship the IDENTICAL default WordPress/Gutenberg colour palette (`#7a00df`, `#007cba`, `#000000`, `#ffffff`, `#f78da7`, `#cf2e2e`, `#ff6900`, `#fcb900`, `#7bdcb5`, `#00d084`, `#8ed1fc`) and the identical core keyframes (`lightbox-zoom-in`, `lightbox-zoom-out`, `turn-on-visibility`, `turn-off-visibility`) baked into WordPress core / a shared page-builder theme, NOT chosen by the designer -- these are infrastructure defaults sitting alongside the real, custom brand styling layered on top by GSAP and the theme's own CSS. **Take, and a warning for the scan:** do not mistake a page-builder's own default token dump for a site's real design system when studying a reference (these hex values are never the actual brand accent); and when building on WordPress, expect these same defaults to ship in the page unless explicitly overridden -- they are harmless dead CSS, not something to clean up, but also not evidence of intentional colour choices either way.

`turn-on-visibility`/`turn-off-visibility` is worth naming on its own: it is a proof that a scroll reveal does not need GSAP at all -- a single IntersectionObserver toggling one class, animating only `opacity`/`transform`, reproduces the same "fades and rises into place on scroll" effect these sites use for ordinary content blocks. Reserve GSAP/ScrollTrigger for an actually PINNED, scrubbed sequence (Telmai's radar story, a scroll film); use the cheap class-toggle approach for plain reveal-on-scroll everywhere else.

## RedSwitches (redswitches.com) -- real hardware-state micro-animations, the clearest answer to "small animations that represent things"

A server-hosting company, built on Astro (not WordPress), with hand-authored CSS animations that each represent one literal piece of hardware or network state rather than being decorative:

- `fan-spin` -- `transform: rotate(360deg)` looped: a cooling-fan icon that actually spins.
- `led-on` -- a colour swap to a "hint green" status token: an indicator light switching on.
- `buf-fill` / `head-fill` -- `transform: scaleX()` from a small value to near-full: a buffer/throughput gauge filling, like a horizontal meter.
- `feed-pulse` -- a `box-shadow` ring that expands and fades (a ping): a live-data feed pulsing to show it is receiving.
- `bar-rise` -- `transform: scaleY()` from near-zero to full: a bar-chart column growing in.
- `annScroll` -- a vertical ticker that steps between messages (`translateY` in fixed increments): an announcements strip.
- `marquee-scroll` -- an infinite horizontal `translate` loop: a logo/partner marquee.

Every one of these is transform-only (`scaleX`/`scaleY`/`translateY`/`rotate`) or a `box-shadow`/colour swap -- nothing animates width, height or layout. **Take, and this is the direct answer to "little animations to represent things":** for a technical or dashboard-style product, build ONE small looping CSS animation per real state the product actually has (a fan spinning, a light turning on, a meter filling, a feed pulsing) instead of one generic decorative loop reused everywhere -- each animation should be nameable by the fact it represents, the way `fan-spin` and `led-on` are.

## What to refuse from this batch

- **onef-ff.web.app ("1Fuel")**: its call-to-action borders animate through a `linear-gradient` cycling `#40FEF4 -> #EA95C0 -> #7BC9B0 -> #47A1D9` and a second cycling `#47A1D9 -> #FDCA47 -> #9E44F3 -> #ED63D4` -- a rotating rainbow border that passes directly through pink and purple. This is the exact "AI slop" pattern the operator has rejected repeatedly, here on a real shipped site, which confirms it is a real market tell to avoid, not just a stylistic preference. Never build a rainbow-cycling gradient border; if a border needs to draw attention, animate its opacity or a single-hue glow instead.
- Do not copy the WordPress default palette hex values listed above even though they appear on real, paying-client sites -- they are unintentional platform defaults, not a design choice worth repeating.

## Quick notes on the rest of the batch

- **Swaptain, Blockd.ai, Spiritrade, Apt Communications**: each layers Swiper (carousels) and, where present, GSAP/Lottie on a fairly ordinary section stack -- confirming the same "safe commercial triad" rather than anything structurally new.
- **Bakoos ("Robocat")**: a distinctive display font pairing (a bold display face for headlines, a separate mono/condensed face for labels) rather than a system stack -- consistent with the two-role type discipline in every reference so far.

---

# Standing checklist: performance, security, compliance, style vocabulary (operator, 2026-09-22)

Apply to EVERY project/app, not just web-designer builds. coding agent and every specialist must carry this list; add missing items to the plan before a goal is marked done.

## Performance (every app)

Cache API responses. Load balancer for scaled services. Index the databases. Compress images. Lazy-load below-fold screens with skeleton loaders (not blank/spinner). Cache expensive queries. No N+1 database queries. Debounce input handlers. Split code into chunks (route/component level). CDN for static assets. Server-side caching. Paginate large lists. Run Lighthouse audits before calling a page done. Compress API payloads (gzip/brotli). No unnecessary re-renders. Minify JS and CSS. Lazy-load images/media. Defer non-critical scripts. Remove unused dependencies. Database connection pooling.

## Security and account handling (every app with accounts/subscriptions)

- Cancel-subscription button: required, must actually cancel at the billing provider, not just flip a local flag.
- Delete-account button: must delete login credentials AND stored files/data, not just deactivate.
- Age check at signup.
- Marketing emails must include an unsubscribe link.
- Privacy policy is mandatory and must name where data actually goes (e.g. Claude/Anthropic, OpenAI, Supabase, any processor used) -- no vague "third parties" language.
- No API keys or secrets in client-side JS, ever.
- Server decides authorization and sensitive logic; never trust the browser to decide what a user can see or do.
- Row-level security (RLS) for logins and any per-user data.
- Real sign-out: invalidate the session server-side, not just delete the client cookie.
- Auth error messages must be generic ("email or password is incorrect" / "no user found") -- never specify which field was wrong.

These fold into the existing "Enforced, not advisory" mechanical gate philosophy above: treat cancel-subscription, delete-account, age-check, unsubscribe-link, and privacy-policy presence as things the reviewer must verify exist and work, the same weight as the site-standards.ts scan.

## Design vocabulary the Web Designer must know and can invoke by name

Skeuomorphism, neumorphism, glassmorphism, claymorphism, minimalism, maximalism, brutalism, liquid glass, bento grid, spatial UI. The Web Designer should recognise which of these fits a given brief and name it explicitly when briefing a Claude session, rather than defaulting to one look -- these are directions to choose between, not a style to always apply.

## Additional references to study/use

- Watermelon UI -- reference for landing pages and UI patterns.
- Motion Primitives -- animation/interaction primitives library.

## Anti-slop skills

If an anti-slop design skill is installed on this machine (it appears in the INSTALLED SKILLS list; examples elsewhere are `taste-skill`, `high-end-visual-design`, `impeccable`), name it for the build. Never depend on one: not every machine has the same skills, and this playbook, references/scroll-craft.md and the board of testers hold the standard on their own (operator, 2026-09-24).

# Two hard rules (operator, 2026-09-23)

- **No horizontal scroll, anywhere.** At every width from 390px to wide desktop the page and every panel inside it scroll vertically only. Long unbroken strings (paths, ids, URLs, code) wrap with `overflow-wrap: anywhere` or ellipsize; wide tables and code blocks scroll inside their own container, never the page; grids use `minmax(0, 1fr)` so a long child cannot widen its track; no fixed widths wider than the viewport. Check it by measuring `document.documentElement.scrollWidth <= innerWidth` at 390px and at desktop, not by looking. A page-level horizontal scrollbar is a blocking finding.
- **No browser-default controls.** Every dropdown is a designed component (its own trigger, chevron icon and animated menu), not a white native `<select>` box; checkboxes, radios, date fields, number fields, disclosure arrows (`<details>`), scrollbars, text selection, placeholders and focus rings are all styled in the project's own tokens. A control that still looks like the browser drew it is a finding.

## React Bits (operator, 2026-09-24)

reactbits.dev: 200+ animated React components under MIT + Commons Clause, in four variants each (JS-CSS, JS-TW,
TS-CSS, TS-TW). Use it for text animation (SplitText, BlurText, ScrollReveal, CountUp), micro-interactions and
backgrounds before hand-rolling an effect. Get one without any setup: `https://reactbits.dev/r/<Name>-TS-CSS.json`
returns the source in `files[].content` and its `dependencies` (often `gsap` or `motion`); or
`npx shadcn@latest add @react-bits/<Name>-TS-TW` in a shadcn project. TAKE: the motion craft. REFUSE: the demo
colours and default glow; restyle to the project's tokens, and give every animated component a reduced-motion state.

# Reference 10-11: Manus and Linear (verified 2026-09-28, real DOM and screenshots)

## Manus (manus.im) -- the product IS the homepage

Manus is an AI agent; its own homepage has no hero image, no marketing paragraph, no scroll at all above the
fold and barely any below it. The entire first (and almost only) viewport is: a serif headline ("What can I do
for you?"), directly under it the REAL prompt box the product runs on (a plain white card, a placeholder
"Assign", a `+` attach button, a round send button), and under that a row of pill chips naming what it can do
("Create slides", "Build website", "Design", "Create games", "More"). White background, black text, one
system/SF-Pro-style sans stack, a black pill "Sign in" button. No stat tiles, no testimonials, no feature grid
before this. TAKE: when the product's whole value is one interaction, put that real, working control as the
entire first viewport with nothing else competing for attention -- this is the extreme end of "the interface is
the hero" (references/scroll-craft.md's presentation table), not a header with a screenshot beside it. REFUSE: this only
works when the product truly is a single input; a multi-feature product that copies this looks empty, not
confident.

## Linear (linear.app) -- the OS-window demo card

Linear's whole marketing page is one content kind repeated: `getComputedStyle(document.body).backgroundColor`
is `rgb(8, 9, 10)` (near-black), Inter Variable throughout, no GSAP/Lenis/three globals (no heavy scroll
library at all -- the craft is in layout, type and restraint, not motion). Every feature section wraps its demo
in a card styled like a desktop app window: rounded corners, a thin border, a soft shadow, and in some cards a
literal macOS-style traffic-light row (three small dots) with the tool's own name and icon as a title bar
("Cursor", "Linear · Opus 5", "ChatPRD"). Inside, the content is never a generic mockup: real-looking ticket IDs
(`ENG-2088`, `MKT-1029`), real bug/feature titles ("TypeError: Cannot read properties", "Upgrade to Claude Opus
5"), real names and timestamps in a chat thread, an agent's "Thinking..." state mid-response. Between feature
sections sits a plain logo wall (OpenAI, Vercel, Salesforce, Figma, Cursor, Coinbase, Ramp) in flat white
wordmarks with one caption line ("Powering the companies building the future") -- no cards, no borders, just
logos and space. Each section gets a full screen-height of dark negative space around its one demo; nothing is
crowded. TAKE: for a software product, the "working demo" row of the presentation table is best built as an
OS-window card (title bar, real fictional data with plausible IDs/names/timestamps, never lorem) -- it reads as
a screenshot of the real product, not an illustration of one; multiple demo windows can overlap/stack (as
Linear does for its agent-chat section) to show several tools at once without a grid. REFUSE: Linear's exact
near-black palette and Inter -- the device (the windowed demo card, real fictional data, generous dark-field
negative space) is what transfers, not its colours or font.


---

<!-- references/style-recipes.md -->

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


---

<!-- references/image-rules.md -->

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
