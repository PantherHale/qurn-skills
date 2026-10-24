# Web designer specialist

Works like a professional web designer and art director. It takes stock of what the project has and what it can get (CC0 photos, HDRIs and models, React Bits, Lenis and GSAP, three.js), lists the visitor's real questions, invents one signature motif from the product's own world and a presentation for each section, then hands back numbered BUILD ORDERS with files, technique, exact numbers and a measurable check. The office refuses a plan that leaves an order out, gives each builder its orders word for word, and the designer checks every order at the middle and end.

This specialist DIRECTS the build. It reads the project and hands back numbered BUILD ORDERS (files, technique, exact work, a measurable check) that the building agent executes one by one, then checks each order.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When designing, building or reviewing a website, landing page or web app UI, choosing a visual style (minimalism, maximalism, glassmorphism, neumorphism, brutalism, bento and others), or judging images, contrast and layout.
- Do not use for backend-only work, CLIs or data pipelines with no interface.

## As a command

Run it as `/web <request>` in Claude Code or Gemini CLI, or `/prompts:web <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- in the MIDDLE: is the work on track or drifting
- at the END, as a gate: does the finished work meet the standard, with evidence
- any time, asked directly

## Instructions

You are the web designer and art director, and you DIRECT this build. FIRST name the visitor MODE of the surface (Persuade, Operate, Read or Experience) and, for Persuade, the colour strategy (Committed, Full palette or Drenched) -- web-craft-doctrine-reference.md: the UX-research rules are checks for Operate and Read, never a reason to mute a product page. (Operator, 2026-09-24: "it should see what needs to be implemented and where, and direct the agents to do it"). Follow your playbook (web-director.md in references/) exactly: take stock of the project and the resources, list the visitor's real questions, generate and score concepts with its CONCEPT METHOD so the idea comes from THIS product's own world (never a copy of a reference), choose each section's presentation, and write BUILD ORDERS in its exact line format -- every order with files, the technique number from references/scroll-craft.md, exact numbers and a measurable check. Read references/scroll-craft.md before choosing techniques. Hold the operator's hard rules in the playbook (smooth anchor navigation, a back link on detail pages, no dead space, full grids, a one-line sign-up, no AI-voice copy, no production data the visitor did not ask for, real scroll motion, real imagery for a physical product). STYLE: choose one style (at most two) from references/style-recipes.md (a style the operator named wins) and put it in an order as the line "Style: <name>" in docs/design/DESIGN.md built to references/style-recipes.md; the board's style-fidelity tester measures the source for it, and a declared style that was not built is a blocking finding. REACT BITS: in a React build, name the React Bits components (reactbits.dev, source at https://reactbits.dev/r/<Name>-TS-CSS.json) an order uses before anything is hand-rolled, restyled to the tokens with a reduced-motion fallback. IMAGES follow references/image-rules.md. PAGE STRUCTURE AND COPY follow references/page-copy-and-structure.md (hero sells above the fold, one idea per section, no em dashes, verb+outcome CTAs, proof beside claims); write copy orders to it. PERSUASION: use marketing-reference.md and marketing-psychology-playbook.md for the psychology of why people buy, including the dark-patterns and regulated-vertical lines, which are hard blockers, not style notes. WHERE TO LAUNCH: when asked for marketing or launch advice and not just persuasion psychology, also use startup-launch-channels-reference.md to name specific launch URLs (Product Hunt, Hacker News, relevant subreddits, directories) matched to this product's actual type and field, flagging any site the file marks dead or lower-confidence. COMMERCIAL-GRADE (operator, 2026-10-06: wants sites that look like a Burger King/Coca-Cola/Starbucks commercial, not a lecture): follow commercial-product-presentation-reference.md -- the product pinned at hero scale with one property driven continuously by scroll fraction, headline type at the SAME depth as the product (behind it or masked by it, never boxed above or beside it), copy capped at a commercial's voiceover (135 words can be a whole homepage; a heading is 1-4 words; a supporting line is one sentence). A chart, graph, statistic grid or multi-paragraph process story in the hero or first scroll act is a redo, not a style choice -- it belongs on its own page only if the brief asks for it. IMMERSIVE HERO (operator, 2026-10-18: wants immersive landing pages, correct colour composition, full custom, no slop): when the mode calls for it, use immersive-hero-motion-reference.md's layered-video/canvas z-index stack, two-tier glass surface, staged word-stagger text entrance and named colour-composition direction -- pick ONE whole direction and substitute this product's own colours, type and copy, never a reference's exact values. NO HORIZONTAL SCROLL and NO BROWSER-DEFAULT CONTROLS, ever. NO EXPLANATIONS (operator, 2026-09-25): no subtitle or intro line under a heading that explains the obvious; in your own reply too, say only what changes what the builder does. At the middle and end, read docs/design/BUILD_ORDERS.md and the source, give each order done, partly or missing with evidence, and write CORRECTION ORDERS in the same format. SOLUTION MODE (operator, 2026-10-02). You are given a PROJECT PROFILE of measured numbers. At EVERY checkpoint where any site files exist, even a placeholder (score it low with the evidence; never skip the evaluation because there is little to judge, and when you also write BUILD ORDERS the evaluation comes first), after the VERDICT and BRIEF lines write: 1) EVALUATION: score each of these 1 to 5 with the evidence (a file, a measured number, or what you read): first-screen message and call to action, visual hierarchy, spacing and dead space, typography, colour and contrast, imagery, motion and scroll, copy, responsive behaviour, accessibility, load speed. 2) For every score below 4 a FIX with: THE PROBLEM (file and selector or component), THE SOLUTION in exact values (font sizes as a clamp() scale, spacing tokens, hex colours with their contrast ratio, the easing and duration, the component and the React Bits or library piece to use), and the WORDING: the exact headline, supporting line, button labels, section titles and microcopy for THIS product, written in its own voice from its spec, ready to paste. 3) SECTION PLAN: for each section in order, what the visitor must feel, the layout, the exact copy and the measurable check. A finding that only says "add rate limiting" or "improve the hero" is NOT acceptable: every finding carries its full solution. Name this project's real files, routes, libraries and product words; never write generic text a different project could reuse unchanged. COMMON RULES, except that at the start your reply is the direction itself and at the middle and end the SOLUTION MODE blocks are your BLOCKERS and ADVICE: You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next.

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
- [references/page-copy-and-structure.md](references/page-copy-and-structure.md)
- [references/web-designer-behavior.md](references/web-designer-behavior.md)
- [references/marketing-reference.md](references/marketing-reference.md)
- [references/marketing-psychology-playbook.md](references/marketing-psychology-playbook.md)
- [references/startup-launch-channels-reference.md](references/startup-launch-channels-reference.md)
- [references/design-systems-reference.md](references/design-systems-reference.md)
- [references/animation-reference.md](references/animation-reference.md)
- [references/brand-identity-reference.md](references/brand-identity-reference.md)
- [references/fluid-interaction-reference.md](references/fluid-interaction-reference.md)
- [references/anti-slop-checklist-reference.md](references/anti-slop-checklist-reference.md)
- [references/ui-libraries-and-mascots-reference.md](references/ui-libraries-and-mascots-reference.md)
- [references/scroll-animation-reference.md](references/scroll-animation-reference.md)
- [references/3d-web-reference.md](references/3d-web-reference.md)
- [references/color-selection-reference.md](references/color-selection-reference.md)
- [references/vibrant-color-patterns-reference.md](references/vibrant-color-patterns-reference.md)
- [references/scroll-scrub-and-shader-reference.md](references/scroll-scrub-and-shader-reference.md)
- [references/commercial-product-presentation-reference.md](references/commercial-product-presentation-reference.md)
- [references/web-craft-doctrine-reference.md](references/web-craft-doctrine-reference.md)
- [references/design-formats-positioning-reference.md](references/design-formats-positioning-reference.md)
- [references/immersive-hero-motion-reference.md](references/immersive-hero-motion-reference.md)
- [references/mass-adoption-mechanics-reference.md](references/mass-adoption-mechanics-reference.md)
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
   references/scroll-craft.md (T1-T22) that realise it. The scroll animation is the product in motion, never a slideshow of
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
- **Candle maker.** Material: wax, flame, smoke; moment: evening. Candidates: dusk that warms as you scroll; wax
  pooling into the grid; a scent chooser. Applause: the match strikes at the close and the page turns warm.
- **Note or task app (software).** The interface is the hero: a working demo in the first screen, the real UI at real
  size, each section a real screen doing one job; the thread is the user's own note travelling from capture to where
  it lands. Applause: the visitor types a note and watches it file itself.

## Decide the scroll story yourself (T21)

Never wait to be told "add scroll animation". Every marketing or product page gets an opening device, one motif, quiet
beats and a close. Route by product (SCROLL_CRAFT T21): electronics or anything with parts -> T20 exploded view;
photographed objects -> T13-T15; software -> the real interface plus T4; a written or drawn thing -> T4/T7. Put the
Inkling vocabulary of small arrivals (T19) under everything. Name the choice and why in CONCEPT. A page with nothing
moving is unfinished.

## Photographed products: the wordless opening (Driftwood study, 2026-09-28)

For a physical product that photographs well, open with the picture, no headline: T13 (pinned, wordless first screen,
copy at progress 0.18, nav at 0.48) over T14 (scene photo plus 3-5 transparent cut-outs at different depths), T15 (a
living detail: flame, steam, shimmer; the halo brightens with scroll), then T16 (four to six quiet beats after the
hero). One main spectacle. Build order: pictures first, then the page, then a measured check at desktop and 375px,
then `docs/design/AGENT_GUIDE.md` (T18), always your last order; a guide that claims a feature the code lacks is MAJOR.

## The product is the content, not a chart or a lecture (operator, 2026-10-06)

A build that gave a coffee brand a graph, a simple fade-in and no picture of the coffee failed the operator's
actual ask, even though it followed every citation in this file. Read `commercial-product-presentation-reference.md`
before CONCEPT: it is measured, today, from bk.com, the Whopper TV ad, and the live Coca-Cola/Jupiter scroll
concepts, and it names the exact mechanism those builds use (product pinned at hero scale, one property driven
continuously by scroll fraction, headline type at the SAME depth as the product -- genuinely behind it or masked
by it, never boxed above or beside it) plus the real word-count ceilings (135 words for a whole homepage, one
sentence per section, 1-4 word headings). A bar chart, line graph, statistic grid, or multi-paragraph process
explanation on a consumer product's hero or first scroll act is the specific failure mode -- it has no match in
any real or strong concept example in that file. If the brief truly needs production data or a journey, it goes
on its own page, never in the opening act.

## No real photography available: build the centerpiece live, never fall back to flat cards

ORDER OF PREFERENCE (2026-10-08, web-craft-doctrine-reference.md section 7): (1) a generated image or video when a tool exists, (2) a verified real photograph (Openverse CC0; the 2026-10-08 coffee demo got a real latte photo this way and it beat every vector version), (3) the live render below, (4) a labelled placeholder. A flat vector drawing standing in for the product is never acceptable. This section applies only when steps 1 and 2 truly fail.

Operator, 2026-10-06: a build that could not fetch real photos (no internet in the build environment, Openverse/Poly
Haven unreachable, licence unclear) defaulted to a text-and-card grid with no living element, and it read as
templated and lifeless even though every copy rule and law-of-UX citation was followed. Citing the right research is
not the same as having a signature visual. When no real photograph or video can be sourced, the motif is still
mandatory -- it is simply rendered instead of photographed:

- Build the product (or its gesture) as a live scene in three.js or a 2D canvas: real geometry (a lathe profile for a
  vessel, primitives for a tool), real materials (roughness/metalness, not a flat fill), at least two lights, and the
  one gesture from the CONCEPT METHOD acted out by the scene itself (coffee rising and crema forming as the visitor
  scrolls, not a static render).
- Drive it from scroll like T13-T15: pin the canvas, tie rotation/fill/camera to the scroll fraction of its own
  wrapper (one passive scroll listener or one rAF loop, paused via IntersectionObserver when the canvas is off
  screen), and respect `prefers-reduced-motion` with a static final pose instead of removing the scene.
- This live render is a first-class substitute for T14's photograph, not a downgrade from it -- use it with the same
  confidence, and still write its T15 living detail (steam, shimmer, a liquid surface) and T16 quiet beats.
- A build that has no real photo AND no live rendered scene -- cards, text and icons only -- fails the signature-motif
  requirement outright. The test-board's style-fidelity check treats a page with zero living or moving centerpiece as
  a blocking finding requiring redo, same as a missing BUILD ORDER.

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
- Four or more scroll beats after the hero (T16); a lit or steaming object is alive (T15).
- No lag (T22): only transform and opacity animate, one passive scroll listener, images sized and compressed, off-screen loops paused; the board measures it.
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
- mode: <Persuade|Operate|Read|Experience>; colour strategy: <Restrained|Committed|Full palette|Drenched> and why; the rut (what this category always ships) and that you left it
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

## Verify visually before claiming a CSS fix worked (operator, 2026-10-18)

A fix described from reading the CSS alone ("this is proven elsewhere in the file, so it's low-risk") was not good
enough for the operator — they explicitly pushed back and asked for a real screenshot. Rules:
- Any visual bug report ("this looks cutout", "this looks AI slop") gets a live screenshot taken BEFORE describing
  the fix and AFTER applying it, not a confidence claim based on re-reading the stylesheet.
- If the devtools browser tool reports "already running for `<profile>`", that is almost always THIS SAME TOOL's own
  orphaned instance from earlier in the session (automation flags in the command line, e.g.
  `--enable-automation --remote-debugging-pipe`, confirm with `Get-CimInstance Win32_Process` filtered on the
  profile path) — not another project's process. Kill that PID, delete the profile's `lockfile`/`SingletonLock`,
  and retry; do not give up on screenshots and fall back to describing code.
- A full-page screenshot can show false "blank gaps" where a scroll-pinned/ScrollTrigger section hasn't fired yet —
  always re-check a reported blank section by scrolling the live viewport to that scroll position before treating it
  as a bug.
- When the operator says "the problem is not X, it's Y," drop the X theory immediately and re-screenshot the actual
  element Y names — don't keep defending the original diagnosis.
- After any filter/overlay tuning pass, screenshot BOTH the extreme you were fixing and the opposite extreme in the
  same set (darkest and brightest image, tightest and loosest layout) — a fix tuned on one case silently broke the
  other case twice in this session before that habit was added.

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

Apply to EVERY project/app, not just web-designer builds. Qurn and every specialist must carry this list; add missing items to the plan before a goal is marked done.

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

# Operator note: equal, fast transition timing (2026-10-08)

Operator, on Kothi Mela (Dubai real-estate inventory app): "make the transition between the transitions a little faster and equal at all times." Audited that project's two stylesheets and found 10+ distinct duration values in use for conceptually equivalent motion (70/80/120/160/200/240/320/360/480/700ms) with web and desktop app not matching each other. The operator's complaint was not about any one animation being wrong, it was that the RHYTHM felt inconsistent -- the eye notices when sibling interactions (hover vs. press vs. panel-open vs. dialog-open) don't share a cadence, even if no single one looks slow in isolation.

**Take:** collapse the duration scale to 2-3 tokens maximum (e.g. an instant ~100-120ms for hover/press/focus feedback, a base ~150-180ms for enters/opens/dialogs), and apply the SAME token to every instance of that category everywhere in the product, including across a web and a desktop-app surface of the same product -- never let one surface's "panel slide" be 160ms while another surface's "dialog open" is 480ms for no reason. When auditing motion on any project, grep for every ms value used in transition/animation declarations first and flag the count of distinct values as a finding on its own, before judging any individual animation.


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

## The "sticker cutout" failure (operator, 2026-10-18, fitness-brand demo) — diagnose and fix
Operator flagged a product grid as looking "completely cutout." Root causes, in the order they actually showed up, and the fix for each:
1. **`object-fit: contain` + padding + `drop-shadow` on a real (non-studio) photo.** This isolates the photo as a floating rectangle with a shadow outline on a flat card background — reads as a pasted sticker, not a photographed product. Studio brands (Bala) can use `contain` because their photography is shot on a seamless backdrop that already matches the card colour; stock photography with a real background cannot. Fix: `object-fit: cover`, no padding, no drop-shadow — the image fills the card edge-to-edge, same treatment as a full-bleed hero.
2. **A section-wide solid-colour background block on a max-width/centered section** (e.g. a "Philosophy" or FAQ block given `background: var(--sage)` while the section itself is bound to the content column, not the viewport). Because the colour doesn't bleed to the viewport edge, it reads as a rectangle pasted onto the page rather than a zone of it. Fix: either make the background genuinely full-bleed (edge to edge) or drop the section-wide block entirely and give each individual card/item its own small pastel tint instead — never a bounded, centered color block.
3. **Mismatched stock photography in the same grid** (one photo moody/dark-wood, another bright-white flat-lay, another on hardwood floor). No crop or shadow fix solves this — different light temperature and background per photo is what makes a grid look assembled rather than shot. Fix with a per-image colour-wash recipe: a `::after` or gradient overlay in the card's own pastel tone at low opacity (soft-light blend) plus a mild `filter: brightness()/saturate()` nudge, tuned PER photo (dark photos need lift, bright photos need none) — never apply one blanket filter value to the whole set, or already-bright photos blow out to washed-white (confirmed by overcorrecting once in this session: `brightness(1.18)` stacked with a 0.75-opacity overlay nuked detail in the two brightest cards). Check the brightest and darkest image in the set after any such change, not just the one you were tuning.

## What looks generated — refuse
1. Inconsistent crop ratios mixed in the SAME grid (every third card a different height) instead of a stated two-ratio rule.
2. Stock photography standing in for the real product/work when a live demo, screenshot, or real photo is possible — Bruno Simon replaces photography entirely with the real interactive scene.
3. An autoplaying carousel or looping hero video with no pause control — icon-only chevrons, no labelled Play/Pause, fails WCAG 2.2.2.
4. A caption-weight byline floating on top of a photo outside a hero moment — reads as a mistake, not a choice.
5. No reserved image box (missing width/height/aspect-ratio), producing visible layout jump as photos load.
6. `object-fit: contain` with padding and a drop-shadow on non-studio photography — the "sticker cutout" look (see above).
7. A full-section solid-colour background applied to a width-bound/centered section rather than a true full-bleed zone — reads as a pasted rectangle, not a themed area of the page.
8. Multiple product/grid photos with visibly different light temperature or background with no shared colour-grade pass — the set reads as assembled, not shot.


---

<!-- references/page-copy-and-structure.md -->

# Page structure and copy rules

Operator, 2026-10-01. Applies to every website the office builds. The board counts what it can (em dashes, paragraph length, CTA verbs); you judge the rest.

## How a converting page is built, top to bottom
1. **Nav.** Logo, 3 to 5 links, one CTA button. Nothing else.
2. **Hero (above the fold).** One specific headline (the outcome for one buyer), one line under it that backs the headline, one primary CTA, and proof beside it (a number, a logo strip, a rating, a short quote). The visitor can act without scrolling.
3. **Proof strip.** Logos, press or one number, right under the hero.
4. **Pain (optional).** Two sentences in the buyer's own words.
5. **Benefits or how it works.** Three steps or three cards, benefit first, one visual each.
6. **Deep proof.** Testimonial, case study, before and after, demo. Each claim sits beside its evidence.
7. **Objections.** Price clarity, guarantee, 4 to 6 real FAQs. Placed immediately before the final CTA.
8. **Final CTA.** Repeat the one primary action; remove risk ("no card needed", "cancel anytime") only if true.
9. **Footer.** Links, contact, legal, newsletter. No new pitches.

Order follows the visitor's questions: what is it, is it for me, does it work, what does it cost, what if I am wrong, how do I start. One idea and one job per section. One primary CTA, repeated, not five different ones. Vary the rhythm (full-bleed, split, grid, quote) so neighbours never look alike, and keep section padding consistent so there is no dead space.

## Copy rules (each one is checkable)
1. **No em dashes.** Zero in visible copy. Use a full stop or a comma.
2. **Cut false claims.** No "#1", "best", "trusted by thousands", invented counts, logos or testimonials. If it is not true and shown, delete it.
3. **Keep it scannable.** Short lines, one bold key phrase, lists over paragraphs.
4. **Specific headlines.** Name the outcome, the number or the buyer: "Book 30% more repeat orders" beats "Grow your business".
5. **Cut needless info.** If removing a sentence loses nothing, remove it.
6. **One idea per section.**
7. **Break up text blocks.** No paragraph over 3 lines.
8. **Support the headline.** The line under a headline proves or sharpens it, never restates it.
9. **Sell above the fold.** Value, proof and CTA are all visible at 1440x900 and at 390x844.
10. **1 to 3 points per section.** Four or more means split or cut.
11. **Punchy, not padded.** Cut "very", "really", "just", "in order to", "we are passionate about".
12. **CTAs are verb + outcome.** "Get my free quote", "Start the 7-day trial", "See pricing". Never "Submit", "Learn more" or "Click here".
13. **Benefits first.** Lead with what the buyer gets; the feature follows as the reason.
14. **Cut generic openers.** No "Welcome to", "In today's fast-paced world", "At [Brand], we".
15. **Write for lazy readers.** Plain words; every section is understood from its heading and first line.
16. **Cut antithesis.** No "not X, but Y" or "less X, more Y".
17. **Cut aphorisms.** No slogan wisdom ("Quality is never an accident"). State the fact.
18. **Talk to one buyer.** Say "you" and picture one person (the owner of a five-chair salon), not "everyone".
19. **Answer objections before the CTA.** Price, effort, risk, "will it work for me": one line each, with proof.
20. **Proof beside claims.** Every claim has a number, quote, photo or named customer within one screen of it.

## What the end gate checks
Em dashes in copy: 0. Longest paragraph: 3 lines. Points per section: 1 to 3. Every button starts with a verb. The first 900px hold a headline, a CTA and a proof element.


---

<!-- references/web-designer-behavior.md -->

# Web designer: how people behave, and what that demands

Use these as reasons behind a BUILD ORDER ("one primary action per screen because Hick's law"), never as decoration. Checked against primary sources 2026-10-05 (NN/g, Baymard, W3C, web.dev, Google, FTC, Stanford). Items still marked UNVERIFIED were not confirmed against a primary page.

## How people read a page
- 79% of users always scan a new page, 16% read word by word (NN/g). Concise + scannable + objective writing together measured 124% better usability than any one alone (58%/47%/27% separately).
- F-pattern: a 2006 NN/g study of 232 users found the dominant scan shape resembles an F (varies by content, can look like an E or inverted-L). Start subheads, paragraphs and bullets with the information-carrying word. (The "2009 layer-cake/spotted/commitment/zigzag" follow-up study is UNVERIFIED — drop it unless separately confirmed.)
- Scrolling: 57% of viewing time falls above the fold (down from 80% in 2010), 74% in the first two screenfuls, with a sharp drop after the fold. Put the primary CTA and key content in the top 20% of the page (over 42% of viewing time) and essential content in the top 40% (over 65%). Use a cut-off element or an edge of the next section as a scroll cue, never a hard floor.
- Users detest boastful "marketese"; plain facts with outbound links build more credibility than confident claims alone.
- Banner blindness: users ignore ad-styled zones and sometimes abandon a whole section after meeting an ad-like block (NN/g, studies 1997–2018). Never style real content like an ad, and never put key information where ads usually sit (top banner, right rail).
- Reading mechanics: 45–75 characters a line, 1.4–1.6 line height, 16px minimum body (18px for long reading), ragged-right left-aligned paragraphs of 2–4 lines.

## Decision and attention laws (named so the builder can look them up)
- **Hick's law:** more choices, slower decisions — cite this for "one primary action", not for a specific nav-item count (the "5 to 7 items" figure has no primary source; see Navigation below for the actual evidence).
- **Fitts's law:** big, close targets are faster to hit; keep primary buttons large and reachable, keep destructive actions away from primary ones.
- **Miller's law (7±2):** about short-term memory, not menu length — lawsofux itself warns against using it to justify a design limit. Use chunking for grouping, not as a hard cap.
- **Jakob's law:** people expect your site to work like the ones they already use — be novel in content and motif, conventional in controls (logo links home, cart top-right, links look like links).
- **Doherty threshold:** credited to Doherty and Thadani (IBM Systems Journal, 1982) — response under ~400ms feels instant, worth showing a cue sooner than that. This is a *separate* claim from Nielsen's 0.1s/1s/10s response-time limits (0.1s feels instant, 1s keeps the user's flow, 10s loses attention and needs a progress indicator with a percentage) — cite the right one, don't merge them.
- **Von Restorff (isolation) effect, serial position/peak-end, Zeigarnik/goal-gradient, Tesler's law, Postel's law, aesthetic-usability effect:** one-line definitions per lawsofux.com — use to justify an isolated CTA, a strong opening/closing, a visible progress step, moving complexity to the system rather than the visitor, lenient input/clean output, and that attractive UI is forgiven more (it does not fix a broken flow).
- **Choice overload is contested, not settled.** Scheibehenne et al. 2010 (meta-analysis, 50 experiments, 63 conditions, N=5,036) found the average effect is essentially zero with large variance. Chernev, Böckenholt & Goodman 2015 (99 observations, N=7,202) found the effect is real specifically when choice-set complexity is high, the decision task is hard, preferences are uncertain, or the goal is to minimise effort. Use "reduce and recommend when the task is hard or the set is complex," not a blanket "offer three options."
- **Deceptive patterns** (Brignull, 2010 — NN/g now prefers this term over "dark patterns," use both): obstruction, visual/wording tricks, nagging, emotional manipulation (shame/guilt/fear), sneaking, preselection. Found on 10%+ of major e-commerce sites and ~95% of a sampled set of trending mobile apps. Run a cognitive walkthrough: could a user spend more than intended, or misread a choice?

## Nielsen's 10 usability heuristics (the review checklist, unchanged since 1994, last reviewed Jan 2024)
1. Visibility of system status. 2. Match with the real world. 3. User control and freedom. 4. Consistency and standards. 5. Error prevention. 6. Recognition over recall. 7. Flexibility and efficiency. 8. Aesthetic and minimalist design. 9. Help recognise/diagnose/recover from errors. 10. Help and documentation. (The old "5 testers find 85% of problems" figure is not in NN/g's current article — it's a qualitative heuristic with diminishing returns, and a review of 83 case studies found only weak correlation between tester count and problems found. Don't quote 85%.) Current NN/g guidance by method: qualitative 5 per distinct audience (3–4 per group when several audiences), quantitative 20+, card sorting 15+, eyetracking 39.

## Navigation and progressive disclosure
- Keep navigation visible on desktop: hiding it behind a hamburger cut usage (27% vs 48–50%), cut content discoverability over 20%, and slowed desktop tasks 39% (mobile 15%) in a 179-participant, 6-site NN/g study.
- On mobile, show 4 or fewer nav links visibly; hide more only when space truly forces it. (There is no NN/g evidence for a specific "5 to 7 top-level items" rule — don't cite one.)
- Limit progressive disclosure to 2 levels, with a clearly labelled, visible control to reveal more.

## Forms and checkout
- Cart abandonment is about 70% (Baymard's long-run average; cite "about 70%" rather than a specific decimal, since different Baymard pages currently show 70.19% and 70.22%). Top reasons: extra costs 40%, slow delivery 20%, payment security concerns 19%, forced account creation 18%, checkout too long/complicated 17%, site errors 17%.
- Field counts: keep "fields" and "elements" distinct and don't mix them. Baymard's 2024 checkout-field study: the average checkout shows 5.1 steps and 11.3 form fields when only 8 are actually needed. An older figure (23.48 elements vs 12–14 ideal) is still quoted elsewhere — use the 2024 figures. A well-designed checkout can gain ~35% conversion (Baymard's modelled estimate, large sites) — state it as modelled, not measured.
- Concrete field-reduction moves, each with the share of sites that get it wrong: merge first/last name into one field (89% of sites needlessly split it), hide Address Line 2 behind a link (75% show it by default), hide the coupon code field (35% show it prominently, inviting cart abandonment to go find one), default billing to shipping address (24% show separate fields anyway), delay account creation until after order confirmation (84% prompt for it during checkout).
- Labels: place outside the field and keep always visible — placeholders disappear on focus, strain memory, can look pre-filled, and often fail contrast/screen-reader requirements. Floating labels are an acceptable fallback, not the first choice.
- Inline validation: 31% of e-commerce checkouts lack it and 4% get it wrong. Trigger on blur (or after enough characters for a fixed format, never on first keystroke), clear the error the moment the input becomes valid, and show positive confirmation too.
- Error messages: visible, near the source, plain language, specific, constructive, never blaming ("invalid" is not a message), and never clear the user's typed input.
- Don't re-ask for information already given in the same process — this is WCAG 3.3.7 Redundant Entry, **Level A** (not AA). A "same as shipping" checkbox satisfies it.
- Show every cost early — extra costs are the single biggest abandonment reason (40%).

## Accessibility is design, not a patch
- **WCAG 2.2** (W3C Recommendation, 5 Oct 2023 — reconfirm the date if it matters). Get the levels right: **Level A** additions are Redundant Entry (3.3.7) and Consistent Help (3.2.6, keep help links in the same relative order on every page). **Level AA** additions are Dragging Movements (2.5.7, give every drag interaction a single-pointer alternative unless dragging is essential), Target Size Minimum (2.5.8, 24×24 CSS px — but note the five exceptions: spacing, inline, equivalent control available, user-agent-controlled, essential to the function — so inline text links and a spaced cluster of small controls can legitimately pass below 24px), Focus Not Obscured Minimum (2.4.11 — this only fails when the focused element is **entirely** hidden; partial overlap by a sticky header passes at AA; "none obscured" is the AAA-level 2.4.12), and Accessible Authentication Minimum (3.3.8 — no cognitive test like remembering/transcribing; password managers, paste, WebAuthn, OAuth, email-link and device auth are all accepted alternatives; object-recognition and personal-content CAPTCHAs are exempt).
- Treat Focus Appearance (2.4.13, 2px perimeter, 3:1 contrast change) as **AAA**, but ship it anyway — it's cheap and visibly better.
- Contrast: 4.5:1 body text, 3:1 large text (24px, or 19px bold) and meaningful UI components. Don't rely on colour alone. Test both themes.
- Keyboard: every control reachable and operable, logical tab order, visible `:focus-visible` ring, skip link, no trap, Escape closes dialogs with focus returned to the trigger.
- Semantics first: real `button`, `a`, `nav`, `main`, `label`, ordered headings, one `h1`. Treat an ARIA role as a promise to implement its full keyboard behaviour — "no ARIA is better than bad ARIA" (W3C APG). The APG explicitly does not specify mobile/touch support for every pattern, so test real assistive tech, not just the spec.
- Touch targets: NN/g recommends 1cm × 1cm (about 0.4in) physically, spaced ~2mm, larger still for primary CTAs, for moving-target use, and for children/seniors. (Apple's 44×44pt and Material's 48dp figures are commonly cited but this session's fetch of the primary pages was thin — confirm on developer.apple.com/design or m3.material.io before quoting a platform-specific number as fact.)
- Motion: respect `prefers-reduced-motion`; nothing flashes more than 3×/second; auto-playing motion over 5s needs a pause control. Zoom to 200% and reflow at 320px without horizontal scroll.
- Legal pressure: the European Accessibility Act **applies from 28 June 2025** to products/services placed or provided after that date (not simply "in force since"); covered services include e-commerce, banking, e-books, passenger transport ticketing, electronic communications; microenterprises (under 10 staff, turnover or balance sheet ≤ €2m) are exempt for services (confirm exemption scope against EUR-Lex 2019/882 before relying on it for a specific client). Automated tools catch a minority of problems — Deque's own 2021 study found axe-detectable issues were 57% of issue *volume* in real audits, versus an industry-accepted 20–30% of WCAG *criteria* coverage; always add a keyboard-only and a screen-reader pass on key flows.

## Performance as experience (Core Web Vitals, confirmed)
- Good at the 75th percentile of real users: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. INP replaced FID on 12 March 2024. Poor: LCP > 4s, INP > 500ms, CLS > 0.25.
- LCP budget by subpart: TTFB ~40%, resource load delay <10%, resource load duration ~40%, render delay <10%. Set `fetchpriority="high"` on the LCP image (never combine with `loading="lazy"`); `preload` is for resources the HTML can't reveal in time (background-image CSS, fonts), not a substitute for `fetchpriority` on an `<img>`.
- INP: do minimal work in event callbacks, yield long tasks (the current recommended API is `scheduler.yield()`, not `requestIdleCallback`/`setTimeout(0)`; a "long task" is over 50ms), shrink the DOM, use `content-visibility`, avoid layout thrashing — and diagnose from real field data, not lab guesses.
- CLS: set `width`/`height` or `aspect-ratio` on every image/embed (the single most common cause), reserve space for ads with `min-height`, animate only `transform`/`opacity` (never `top`/`left`/`box-shadow`), and keep pages bfcache-eligible. For fonts, `font-display: optional` with a size-matched fallback (plus preload) avoids the shift that `swap` can still cause; `swap` is allowed but riskier for CLS.
- Budgets: ~170KB compressed JS for a content page on mid-range mobile; hero image under 200KB; AVIF/WebP via `srcset`/`sizes`/`<picture>` with a JPEG/PNG fallback; 2 font families max, WOFF2, subset, cached with a long max-age (never store fonts in localStorage/IndexedDB).
- A scroll story must stay 60fps: `transform`/`opacity` only, sparing `will-change`, passive scroll listeners, IntersectionObserver for reveals.

## Layout, type, colour, motion: concrete defaults
Spacing from a 4 or 8px scale, more space between groups than within them, max content width ~1200px, text column ~65ch. Type scale ratio 1.2–1.333, 2 families max, weights 400/500/600/700, `text-wrap: balance` on headings and `pretty` on paragraphs. One brand colour plus neutrals plus a status set used only for state; build the neutral ramp first and check contrast on real backgrounds; dark mode raises surface elevation by lightness, not shadow, and lowers saturation — it is not inverted light. Motion: 100–200ms feedback, 200–400ms transitions, up to ~600ms entrances; ease-out entering, ease-in leaving; motion explains cause and effect or gets cut; always a reduced-motion fallback. Hit areas 44px minimum on touch, 8px apart; hover-only information is invisible on touch. Design empty, loading, error and partial states on purpose. Mobile-first, content breakpoints not device breakpoints, container queries for components; test 320/375/768/1024/1440 and landscape.

## Two modern CSS features worth reaching for before a JS library (checked 2026-10-23)
**CSS anchor positioning** (`anchor-name`/`position-anchor`/`anchor()`/`anchor-size()`) ties one element's position to another's edge purely in CSS — a tooltip, popover, or dropdown that tracks its trigger without a JS positioning library (Floating UI/Popper) or manual `getBoundingClientRect()` math. MDN lists `anchor-scope`, `anchor()` and `anchor-size()` as Baseline 2026 (newly available across the latest browser versions since January 2026); treat it as safe for a popover/tooltip/dropdown's primary positioning with a static-position CSS fallback for anything older, not yet safe for cross-shadow-DOM anchoring (reported as still inconsistent). **`@scope`** scopes a block of CSS to a subtree without a build step or a hand-written class prefix (`@scope (.card) { h3 { ... } }` only touches `h3` inside `.card`) — useful for a component library or design-system build where Tailwind/CSS Modules aren't the chosen system. Support claims for `@scope` versions by browser were not independently verified this session — confirm against MDN's own compatibility table before citing a specific version number in a BUILD ORDER.

## Classical composition and object placement (checked against named sources 2026-10-05)
- **Müller-Brockmann's Swiss grid system** ("Grid Systems in Graphic Design," 1961): named construction elements are margins, columns, gutters, rows, and **flowlines** (horizontal alignment bands that break the page into zones). "The grid system is an aid, not a guarantee... one must learn how to use the grid." Define a fixed column/gutter/margin structure and align every element — text, images, nav — to column edges and shared flowlines, never freehand-positioned.
- **Vignelli's syntactics** ("The Vignelli Canon"): relate the grid to the dominant image aspect ratio to minimize cropping; restrict the page to **no more than 2 type sizes**, with roughly a 2x jump between them for hierarchy. Pick one grid, two sizes, apply both with no exceptions across the whole site.
- **Tschichold's asymmetric layout** ("The New Typography," 1928): reject centered/symmetrical composition in favor of off-axis placement, flush-left ragged-right text, and white space as an active compositional element, not leftover space. "Asymmetry is the rhythmic expression of functional design... its complete appearance is far more optically effective than symmetry."
- **Rule of thirds and the golden ratio — use carefully, much of the popular claim around them is unverified.** The rule of thirds traces to John Thomas Smith's 1797 "Remarks on Rural Scenery" — a painting/photography heuristic, not a law. The golden ratio (~1.618) is a real, exact geometric construction from Greek/Renaissance geometry. **But there is no proven link between the two** — the common claim that "the rule of thirds is a simplified golden ratio" is a retrofitted coincidence, not a derivation, and the broader claim that the golden ratio is "universally pleasing to the human eye" has no controlled-study backing found — treat both as popular design-blog mythology. What IS legitimate: use rule-of-thirds as a simple off-center placement heuristic for a hero focal point, and golden-ratio proportions as one valid option for a column-split ratio — never cite either as scientifically-proven superior aesthetics.
- **Visual weight and balance:** size, saturation/warmth (red carries more weight than desaturated cool colors, which recede), texture/detail, and **isolation** (an element surrounded by negative space gains weight because it's the only thing in that zone) all increase an element's visual weight. To make a CTA dominant, combine size + a saturated warm accent + isolating whitespace — not size alone.
- **Tufte's data-ink and layering, applied beyond charts:** maximize the proportion of "ink" devoted to actual content; erase decoration that carries no information (heavy borders, boxes, redundant rules). When two elements sit close together they create an unintended third visual effect (noise) — manage it with a light-gray hairline or whitespace, not a heavy decorative border.
- **Z-pattern vs. F-pattern — a real distinction, not duplicate advice.** The F-pattern (already covered above, NN/g 2006) is specifically for **text-dense** pages: full scan across the top, drop down the left edge, shorter scans where something catches interest. The **Z-pattern** is the separate, composition-level scan path for **low-text, visually-led** pages (landing pages, homepages): top-left → top-right → diagonal to bottom-left → bottom-right, tracing logo/nav → headline → supporting visual → CTA. Use Z-pattern placement (logo top-left, CTA bottom-right, hero visual on the diagonal) for landing pages; use F-pattern-aware placement (key info top and left-aligned) for content-heavy pages — picking the wrong one for the page type is a common mistake.
- **The 8pt grid is the digital-era descendant of the classical grid-and-gutter discipline above**, not an unrelated modern invention: spacing, padding and component sizing kept to multiples of 8px (with a 4px half-step for fine adjustment) is the same "fixed modular units" idea Müller-Brockmann and Vignelli applied to print columns, now applied to screen pixels — which is why it's the default nudge/snap increment in Figma, Sketch and Adobe XD.

## Trust and credibility (Stanford Web Credibility guidelines, 10 topics)
Make accuracy easy to verify; show the real organisation; show expertise; show honest and trustworthy people; make contact easy; look professional; be easy to use and useful; update often or show a recent review date; use restraint with promotion; avoid every error, however small. Specific beats vague: "1,284 orders shipped since March" beats "thousands of happy customers." (The "~50ms first-impression" finding (Lindgaard, Fernandes, Dudek, Brown 2006) is a real study; whether it has been independently replicated is UNVERIFIED this session — cite the original, don't claim "replicated" without checking.)

## Information architecture and navigation
Card sorting and tree testing decide the menu, not the org chart; labels use the visitor's words. Breadcrumbs on deep sites, a persistent way home, search for 50+ items. Back button always works (no history hijacking). The 5-second test (can a first-time visitor say what this is, who it's for, what to do next) is a well-known UX technique — its exact NN/g attribution is UNVERIFIED this session; use the technique without over-citing a single source.

## Research methods the designer can order from the test board
5-second test, first-click test, usability test (5 users per distinct audience, 20+ for quantitative), tree test (15+), card sort (15+), eyetracking (39), heuristic review, session replay review, A/B test with a pre-set sample size and run length (never stop on a peek), System Usability Scale, task success rate and time on task, Jobs To Be Done interviews.

## Named frameworks from the specialists themselves (verified 2026-10-05)
- **Krug's "trunk test":** show a stranger the homepage for about 5 seconds (walking from the car trunk to the door) and ask: what is this, what can I do here, where do I start? If the answer isn't instant, simplify. Run it on every new homepage or landing draft.
- **Norman's Seven Stages of Action:** Goal → Plan → Specify → Perform → Perceive → Interpret → Compare, plus the five primitives affordance/signifier/mapping/feedback/conceptual model. Audit a UI action against the seven stages to find exactly where a user gets stuck (a missing signifier means a button doesn't look clickable).
- **Dieter Rams' 10 principles** (the exact list — use as a final-pass checklist, especially #5 and #10): 1 Innovative, 2 Useful, 3 Aesthetic, 4 Understandable, 5 Unobtrusive, 6 Honest, 7 Long-lasting, 8 Thorough down to the last detail, 9 Environmentally friendly, 10 As little design as possible.
- **Jared Spool's "information scent":** visitors follow a scent trail of link/label words toward what they want; losing the scent forces backtracking. Label nav and links in the visitor's own search words, never internal jargon.
- **Tufte's data-ink ratio and chartjunk:** maximise the share of ink that encodes data, strip gridlines/shadows/3D/gradients until only data-carrying marks remain.
- **Cialdini's 7th principle, Unity** (added in "Pre-Suasion," 2016, alongside the original six — reciprocity, commitment/consistency, social proof, authority, liking, scarcity): shared identity ("join fellow [X]") persuades beyond mere similarity or social proof.
- **Joanna Wiebe's "Seven Sweeps":** mine exact customer phrases from reviews, interviews and support tickets before writing hero or CTA copy — voice-of-customer first, invented marketing language last.
- **April Dunford's positioning is 5 (+1) components, not a 5-step process:** competitive alternatives, unique attributes, the value they give, who cares most (target market), the market category that makes the value obvious, plus an optional 6th — a supporting trend. Run new copy through these components, in this order, before writing the hero.

## Where to read more (name, do not paste)
"Don't Make Me Think" (Krug); "The Design of Everyday Things" (Norman); "Refactoring UI" (Wathan, Schoger); "Laws of UX" (Yablonski, lawsofux.com); "About Face" (Cooper); "Form Design Patterns" (Adam Silver); "Thinking, Fast and Slow" (Kahneman); "Nudge" (Thaler, Sunstein); nngroup.com articles (search by exact title — "F-Shaped Pattern," "Scrolling and Attention," "Hamburger Menus," "Deceptive Patterns," "Response Times: 3 Important Limits," "How Many Test Users"); baymard.com research (checkout, cart abandonment, inline validation); web.dev (vitals, optimize-lcp/inp/cls); W3C WCAG 2.2 Understanding docs and the ARIA Authoring Practices Guide; credibility.stanford.edu; Material 3 and Apple HIG as worked design systems (verify platform-specific numbers on the primary page before quoting).


---

<!-- references/marketing-reference.md -->

# Web designer: marketing and copy reference

Marketing frameworks are lenses, not laws; few have controlled evidence. Use them to ask better questions, then check the result against the real product and visitor. Never invent a statistic, a testimonial, a customer count or a deadline. Checked against primary sources 2026-10-05 where noted.

## Positioning first (before any headline)
- **Positioning (Dunford, "Obviously Awesome"):** competitive alternatives, unique attributes, the value those attributes give, who cares most, the market category that makes the value obvious. Write the hero from this.
- **Jobs To Be Done (Christensen, Moesta):** people hire a product to make progress in a situation. Copy states the situation, the struggle, and the progress. Ask "what were they using before and why did they switch."
- **Awareness stages (Schwartz, "Breakthrough Advertising"):** unaware, problem-aware, solution-aware, product-aware, most aware. Start the headline where the visitor is.
- **Value proposition test:** can a stranger say what you sell, to whom, and why it's better, from the hero alone in 5 seconds.

## Copy structure that holds up
- **Headline:** the outcome for the visitor, concrete, in their words. Specific beats clever. Test: would a competitor be able to use it unchanged? If yes, rewrite.
- **StoryBrand (Miller):** the customer is the hero, the product is the guide (empathy plus authority), give a plan in three steps, a direct call to action, show success and what failure costs.
- **PAS, AIDA, Before-After-Bridge, Feature-Advantage-Benefit:** an order of ideas for a section, not a template to fill.
- **CTA:** verb plus outcome ("Get my free audit," not "Submit"); one primary per view; a true reason beside it (price, time, no card needed); a true friction reducer under it (cancel anytime) only if accurate.

## Persuasion, used honestly (Cialdini, "Influence")
Reciprocity, commitment and consistency, social proof, authority, liking, scarcity (only if real), unity. Fake scarcity, fake countdowns, invented reviews and unverified "X people are viewing this" claims are deceptive and increasingly regulated — see Law and ethics below.

## Proof, in order of strength
Measured result with method and date → named customer quote with a photo (with permission) → case study with numbers → third-party review count with source → press mention → certification → logos with permission → your own claim. Put proof beside the claim it supports.

## Pricing and offer
Anchor with a reference price; three tiers with the middle one recommended; annual discount stated as months free; price shown early; what is and isn't included; a plain refund/cancel statement; per-unit framing only if accurate.

## Funnel and measurement
AARRR (acquisition, activation, retention, revenue, referral — McClure); North Star metric plus input metrics; one hypothesis and a pre-calculated sample size per experiment, run a whole number of weeks, don't stop early. UTM-tag every link; privacy-friendly analytics; honour consent and Global Privacy Control.

## Email and lifecycle
Welcome email within minutes; one job per email; benefit-stated subject under 50 characters; real reply-to address; one-click unsubscribe. Gmail and Yahoo's 2024 bulk-sender rules require SPF, DKIM, DMARC and one-click unsubscribe for bulk senders. Double opt-in for a newsletter in the EU.

## SEO as part of design (checked against Google's own docs)
- **No hard character limits on `title` or meta description.** Google states there is no fixed title length limit — titles can be truncated based on device width, and Google may rewrite the title shown in search results regardless of what's in the markup. There is no stated meta description length limit either. Reword any rule as "keep it short and unique; roughly 60 characters for the title tends to avoid truncation, as a heuristic, not a hard limit."
- Write one `h1` that matches search intent; descriptive URLs; internal links with descriptive anchor text; `alt` text; sitemap and `robots.txt`; canonical URLs; mobile friendly; passing Core Web Vitals; HTTPS.
- **E-E-A-T / helpful content (Google's own framing):** write people-first content with original information, clear sourcing, visible author credentials, no errors. Trust is the most important element. For health, finance and safety topics, align with expert consensus. Answer Who (visible byline), How (disclose automation or AI use), Why (serve people first — not written primarily to rank). Never alter publication dates artificially, mass-produce unrelated content, or fabricate author profiles.
- **Keyword meta tags, keyword stuffing, exact-match domains and minimum word counts are explicitly not priorities** per Google's current guidance — don't recommend them.
- **Do not add FAQPage structured data for a search-ranking benefit.** Google removed the FAQ rich result from search results (feature stopped showing from 7 May 2026, docs removed 15 June 2026); even before that it had been restricted to a narrow set of government/health sites since Sept 2023. If a page has genuine FAQ content, write it as plain content, not as JSON-LD aimed at a rich result that no longer exists.
- Other structured data (Organization, Product, Article, BreadcrumbList) in JSON-LD is still Google's preferred format — mark up only content visible on the page, validate with the Rich Results Test, monitor in Search Console.
- Local business: Google Business Profile, NAP consistency, `LocalBusiness` schema.

## Brand and voice
A voice has 3 traits with a "this, not that" for each, one reading level (aim ~grade 8), a banned-words list, and a good/bad example sentence. No AI-voice tells: "elevate," "seamless," "unlock," "in today's fast-paced world," "game-changer," triplet lists, rhetorical-question openers, em dashes. Short sentences, concrete nouns, active verbs. Operator rule still applies: no explanatory subtitles under headings.

## Conversion psychology, with real sources separated from popular-book anecdotes (checked 2026-10-05)
- **Fogg's Behavior Model: B = MAP.** Behavior only happens when Motivation, Ability and a Prompt converge at the same moment — multiplicatively, not additively: if any one is near zero, the behavior doesn't happen no matter how high the others are. **Ability beats motivation as a design lever** — making the action easier (less time, money, effort, better routine-fit) is more reliable and more durable than trying to pump up motivation, which fluctuates and is hard to engineer from outside. When a CTA isn't converting, diagnose which of M/A/P is the actual bottleneck before changing copy: a low-motivation visitor needs an easier next step, not a louder headline; a high-motivation visitor with no clear next step just needs a better-timed, more visible prompt. Fogg's "Tiny Habits" recipe for onboarding: anchor a new action to a step the user already does, shrink the first ask to near-zero effort, and give immediate positive feedback.
- **Loss aversion (Kahneman & Tversky, "Prospect Theory," Econometrica 1979):** people evaluate outcomes relative to a reference point, and losses from that point are felt more strongly than equivalent gains — the commonly cited coefficient is roughly 2x, though that's a later empirical estimate, not a figure in the original paper, and its universality is itself debated in replication literature (treat "roughly 2x" as a common estimate, not a settled constant). Application: frame the cost of inaction as a loss from a real, salient reference point ("stop losing 3 hours a week"), not a gain from nothing — this works for retention/renewal/cancel-flow copy where the status quo is already felt, and reads as manipulative threat-copy when forced onto acquisition copy with no real pre-existing reference point.
- **Anchoring (Tversky & Kahneman, "Judgment under Uncertainty," Science 1974):** a first-seen number shifts a later judgment even when it's arbitrary (their wheel-of-fortune and multiplication-order experiments). **Important nuance: the original study never tested pricing** — showing a crossed-out "original" price before the sale price is a later, widely-used extrapolation of the anchoring mechanism, not something the 1974 paper measured. Cite the mechanism, not a pricing-specific finding. Never invent a reference price — a fabricated "original" price is the FTC's fictitious-former-price problem, i.e. illegal, not just unverified.
- **The decoy effect / asymmetric dominance — real source vs. popular misattribution.** The actual peer-reviewed origin is Huber, Payne & Puto, *Journal of Consumer Research* 1982. **The famous "Economist subscription" story is not that paper** — it's Dan Ariely's own informal classroom demonstration with about 100 students, first published as a popular-book anecdote in "Predictably Irrational" (2008), never in a peer-reviewed journal. Cite it as "Ariely's widely-reported classroom demonstration," never as "a study proves." Two 2014 replication efforts found the effect weakens or disappears with more realistic stimuli and samples — it's real in controlled lab conditions, not a guaranteed field lift. Application: a genuinely purchasable, honestly-priced third tier that's asymmetrically worse on a dimension visitors care about can nudge the middle tier without removing a real option — never a fabricated strawman tier built only to manipulate.
- **Paradox of choice, specifically on pricing pages (Schwartz):** pricing decisions combine the two conditions that actually produce choice overload per the Chernev 2015 meta-analysis — high decision difficulty (money, commitment, hard to reverse) and no clearly dominant option (every tier trades price against features). That combination is worse than a low-stakes catalog choice, so a pricing page is a legitimate place to cap visible tiers (3-4) and visually emphasize one recommended option — even though "fewer options always convert better" isn't a general law.
- **Honest vs. deceptive urgency — the FTC's actual dividing line** ("Bringing Dark Patterns to Light," Sept 2022): the violation is a false or unsubstantiated claim, not urgency messaging itself. Deceptive: countdown timers that reset with no new offer behind them, low-stock numbers not tied to real inventory, fake "X people viewing this" notifications. Honest: a stock count that reads live from the actual inventory system and changes/disappears with real stock; a countdown tied to a real fixed external deadline that never reappears with the same offer after; disclosing the basis when it's not obvious ("3 left at this price," not just "3 left" when only some units qualify). Rule for a spec: before shipping any urgency element, name the actual data source backing the number or date — no data source, don't ship it.
- **Social proof specificity — real finding, narrower than the marketing-blog version.** Jerez-Fernandez, Angulo & Oppenheimer, "Show Me the Numbers: Precision as a Cue to Confidence," *Psychological Science* 2014: a precise figure reads as more credible than an equally-accurate rounded one, because precision signals the number was measured, not guessed. **What's not verified:** the specific "X% conversion lift" claims attached to this finding in marketing blogs — the original study measured perceived credibility in a lab setting, not purchase conversion. Use the real count when you have it ("1,284 customers," not "thousands") as a plausible credibility cue, not as a proven conversion-rate fact — and never fabricate false precision beyond what the claim could plausibly have been measured to (a customer count can be exact; a percentage lift to four decimal places reads as fabricated, not credible).

## Law and ethics of claims — verify before citing a specific rule
- **FTC fake/deceptive reviews rule:** the FTC issued a final rule in 2024 (effective law) banning fake and AI-generated reviews, paid sentiment manipulation, undisclosed insider reviews, fake independent-review sites, review suppression, and buying fake social-media indicators, with a "knew or should have known" standard. The exact issue/effective dates and penalty figures circulating are from secondary summaries in this session (law-firm write-ups, not ftc.gov directly) — confirm the current effective date and penalty amount against the Federal Register or ftc.gov before quoting a specific number to a client.
- **"Click-to-cancel" is not settled federal law right now.** The FTC's 2024 Negative Option Rule amendments (which would have required cancellation to be as easy as sign-up) were vacated in full by the Eighth Circuit in mid-2025 on procedural grounds. Don't tell a builder "federal law requires one-click cancel." The underlying obligations that still apply are ROSCA (Restore Online Shoppers' Confidence Act) and FTC Act Section 5 (no deceptive or unfair practices), plus state-level auto-renewal laws — and "make cancellation at least as easy as sign-up" remains the right practical target even without that specific rule in force.
- **FTC's 2022 dark-patterns report** named categories worth specifically avoiding in any spec: disguised ads, fake countdown timers, hard-to-cancel flows, buried terms and hidden fees (including behind tooltips), and steering users toward privacy-invasive defaults.
- Substantiate every claim before publishing; disclose affiliate and sponsored content; no health or income claims without evidence and required disclaimers; comparative claims must be true and fair; collect consent for tracking; keep testimonials genuine and typical, or disclose that results vary.

## Where to read more (name, do not paste)
"Obviously Awesome" (Dunford); "Building a StoryBrand" (Miller); "Influence" (Cialdini); "Breakthrough Advertising" (Schwartz); "Made to Stick" (Heath); "Contagious" (Berger); "Competing Against Luck" (Christensen); "The Mom Test" (Fitzpatrick); "Everybody Writes" (Handley); CXL and Baymard research; developers.google.com/search/docs (fundamentals/creating-helpful-content, fundamentals/seo-starter-guide, appearance/structured-data) as the primary source for any SEO claim — not a blog summary.


---

<!-- references/marketing-psychology-playbook.md -->

# Marketing psychology playbook

A condensed, actionable distillation of 12 research rounds on why people actually buy on websites.
Full depth (every citation, caveat, and vertical-specific deep-dive) lives in
`marketing-psychology-reference.md` through `marketing-psychology-reference-12.md` and
`startup-launch-channels-reference.md` in this same folder -- read one of those directly when a
decision needs the underlying study, not just the rule. This file is the rule set; those are the
evidence.

## 1. Core mechanisms (cite these by name when reviewing copy)

- **Fogg B=MAP**: Behavior = Motivation x Ability x Prompt. A weak CTA is usually an ability
  problem (too much friction) or a missing prompt (no clear next step), not a motivation problem --
  fix the right one.
- **Cialdini's 7**: reciprocity, commitment/consistency, social proof, authority, liking, scarcity,
  unity. Each needs a concrete, TRUE instantiation on the page (a real review count, a real
  deadline) -- a fabricated one is a dark pattern, not a tactic.
- **Pricing psychology**: left-digit effect (.99 pricing), anchoring (show the reference price
  first), the decoy effect (a deliberately-inferior middle tier makes the target tier look good),
  mental accounting (bundle framing changes perceived value). "Pennies-a-day" reframing works for
  low daily-equivalent prices but backfires above roughly $4-11.50/day-equivalent -- it starts
  reading as evasive.
- **Social proof / trust**: works hardest where the buyer has the LEAST other information
  (independent/unfamiliar sellers, not big brands). Baymard's checkout research: average cart
  abandonment is ~70%, and fixing checkout UX alone recovers roughly a third of it -- this is the
  single highest-leverage, best-evidenced number in the whole knowledge base.
- **Cognitive biases**: loss aversion, endowment effect, paradox of choice (real only for
  comparable, high-stakes, low-expertise choices -- not a blanket "fewer options always win"),
  default effects (powerful, but pre-checked opt-outs are exactly what dark-pattern law targets).
- **Intention-behavior gap**: what people say they'll do and what they actually do diverge
  reliably -- trust behavioral/A-B data over stated intent or survey results.

## 2. Page-design rules

- **Attention**: most visitors scan in an F or Z pattern; ~35% never scroll past the first screen,
  but scrollers drive the large majority of engagement -- the fold is not the whole page, but it is
  the gate.
- **Copywriting**: specificity beats vague superlatives; benefit framing beats feature lists; a
  curiosity gap only works when the reader already has SOME prior context to feel the gap.
- **Onboarding**: find this product's own real activation milestone through its own data -- do not
  borrow another company's "magic number" (e.g. Facebook's "7 friends in 10 days" is unverifiable
  folklore, not a transferable rule).
- **Forms**: every field costs conversion; average forms carry 11-14 fields when 7-8 would do.
  Autofill-friendly input types measurably cut abandonment.
- **Visual hierarchy**: distinctiveness/contrast is what draws the eye, not a specific hue --
  "red buttons convert better" and "blue signals trust" are both folklore; no controlled research
  supports a universal color-to-conversion or color-to-emotion mapping.
- **Retention/gamification**: variable rewards and progress bars work, but badly-designed extrinsic
  rewards can crowd out intrinsic motivation (Deci & Ryan) -- do not gamify something the user
  already wanted to do for its own sake.
- **Guarantees**: risk-reversal framing taps loss aversion; it is a theory-extension, not an
  independently-proven conversion lever on its own -- do not promise a specific lift number to a
  client.

## 3. Category-specific notes

- **B2B**: 6-10 stakeholders typically touch a purchase decision (Gartner); de-risk for a
  committee (case studies, ROI calculators, references), not just for an individual buyer.
- **SaaS**: free-trial-length "optimal number" claims are mostly contradictory vendor folklore; the
  one large randomized field experiment found no significant conversion difference between 3- and
  7-day trials.
- **E-commerce**: impulse-buying research (Rook 1987) is real; checkout-cost-reveal timing and
  forced account creation are proven abandonment drivers.
- **Marketplaces**: two-sided trust (buyer trusts an unfamiliar seller) leans harder on ratings and
  photos than on raw review volume.
- **Subscriptions**: the FTC's "click-to-cancel" rule was vacated by the 8th Circuit in July 2025 --
  do NOT cite it as current law; check its live status before relying on it. State-level
  auto-renewal laws may still apply independently.
- **Donations/nonprofits**: a single named, identifiable beneficiary outperforms statistics
  (identifiable victim effect) -- urgency here should be about the beneficiary's real stakes, not a
  fabricated donor-side deadline.
- **High-stakes/infrequent purchases (real estate, enterprise)**: urgency tactics carry real legal
  risk (Fair Housing Act implications for targeted urgency marketing) and should generally be
  replaced with confidence-building (virtual tours, detailed specifics) over pressure.
- **Gaming/loot-box monetization**: the SAME mechanic is legally gambling in Belgium, was
  litigated/reversed in the Netherlands, and is only voluntarily self-regulated in the UK -- this
  cannot be treated as a generic tactic; it needs a per-jurisdiction legal check.

## 4. Hard legal/ethical lines (treat these as blockers, not style notes)

- **Fake reviews/testimonials**: the FTC's 2024 final rule (16 CFR Part 465) bans AI-generated or
  non-existent-person reviews, paid positive reviews, and review suppression. Never generate a
  synthetic "customer testimonial."
- **Influencer/affiliate disclosure**: the FTC's 2023-revised Endorsement Guides (16 CFR Part 255)
  require disclosure to be functionally unavoidable -- small font, buried captions, and brief
  on-screen text all fail the current standard.
- **Fabricated urgency/pricing**: a fake "was $X" price or a countdown timer that resets is an FTC
  violation, not just an aggressive tactic (see the 2024 Williams-Sonoma consent order).
- **Regulated verticals (health, finance, legal)**: health claims need the FTC's "competent and
  reliable scientific evidence" standard (RCTs, not anecdotes); financial marketing is bound by
  CFPB/TILA disclosure rules. Urgency/scarcity tactics compound legal risk here.
- **Privacy/consent**: GDPR requires consent to be "freely given" (Art. 4(11)/7) -- asymmetric
  accept/reject button design and pre-checked categories are documented dark patterns, not
  acceptable UX variance. CCPA/CPRA requires specific opt-out link language, not GDPR-style opt-in.
- **Dark patterns generally**: use the formal nudge/sludge distinction (Thaler 2018) -- a nudge
  makes the better choice easier; a sludge makes the worse choice merely less obviously hard to
  avoid. A 9-step cancellation flow is sludge regardless of whether a specific statute names it.

## 5. When NOT to use these tactics

- Urgency/scarcity: never fabricate it; avoid it almost entirely in real estate, finance, and
  donation asks where it reads as manipulative or carries legal risk.
- Social proof: thin or fake social proof (inflated counters, generic "join 10,000+ others") is
  often worse than none.
- Gamification: don't bolt it onto a task the user is already intrinsically motivated to finish.
- Personalization: can trigger reactance ("this feels like surveillance") -- more data-driven
  personalization is not always better.
- Scarcity/hype drops: fine for consumer culture goods, legally fraught for loot-box-style game
  monetization, and reputation-risky if resale-market signals contradict the primary-market story.
- Any tactic from this file applied in a regulated vertical (health/finance/legal/gambling-adjacent):
  default to caution and flag for the security specialist's legal-compliance review.

## 6. Launch-channel quick lookup

Full categorized list with live-status notes: `startup-launch-channels-reference.md`. Quick picks:

- **SaaS/B2B tool**: Product Hunt, Indie Hackers, SaaSHub, G2 Crowd, Capterra, r/SaaS, r/microsaas.
- **Indie/solo side project**: r/sideproject, r/buildinpublic, r/indiehackers, Starter Story.
- **Landing-page or visual design work**: Land-book, Postmake, r/design_critiques.
- **Pre-launch beta/waitlist**: Betabound, BetaTesting, r/alphaandbetausers.
- **Mobile app**: appPicker; verify app-submission directories before using -- several in the source
  list (appvita.com, ebool.com, startuptabs.com) were found dead or repurposed; re-check before
  recommending any site not in regular use.


---

<!-- references/startup-launch-channels-reference.md -->

# Marketing specialist: where to launch — channel directory by product type

Source list: github.com/mmccaff/PlacesToPostYourStartup. Checked and spot-verified 2026-10-16. **This list rots.** Submission-directory sites churn fast — domains get sold, repurposed as affiliate/spam content, or just stop updating. Dead/parked/repurposed sites found during this research are flagged explicitly below with VERIFIED DEAD. Everything else was either fetched live this session (marked VERIFIED LIVE, with the date) or categorized from established knowledge without a fresh fetch (marked LOWER CONFIDENCE — re-verify before recommending to a client, especially if this file is more than a few months old relative to when it's read). Never tell a user a listing is free, fast, or guaranteed traffic without checking the site's own current submission page — directories add paid tiers constantly.

## How to use this file

Given a project's product type and field, pick the matching row(s) below, then cross-check the flat reference table for live-status and submission mechanism before recommending a specific URL. Always name 3-6 channels, not the whole list — a shotgun list is worse advice than a short targeted one. Lead with the channel(s) that fit the narrowest matching field (e.g. a women-founded D2C brand → r/ladybusiness before the generic r/entrepreneur), then round out with 1-2 high-traffic generalist channels (Product Hunt, Hacker News, relevant subreddit).

## 1. Lookup by product type / field

### SaaS / B2B software tool
Product Hunt, Indie Hackers (site + r/indiehackers), SaaSHub, SaaSRow, G2, Capterra, GetApp, StackShare (if it's dev-infra/tooling), r/SaaS, r/microsaas, r/EntrepreneurRideAlong. For enterprise-grade B2B specifically, also Crunchbase (company profile, not a launch channel) and vendor.crozdesk.com.

### Micro-SaaS / solo-built small tool
r/microsaas, r/sideproject, r/buildinpublic, Indie Hackers, SaaSHub, SaaSRow, 10words.io, microsaasexamples.com (gallery, not a submission channel — good for inspiration/benchmarking, not traffic).

### Indie / solo side project (any type)
r/sideproject, r/buildinpublic, r/indiehackers, Indie Hackers (site), Starter Story (editorial — pitch for an interview, don't expect self-submit), r/SaaS if it's software, Postmake (curated maker directory), Startup Stash.

### Pre-launch / beta / waitlist
BetaList, Betabound, BetaTesting, PreApps (note: PreApps has shifted to a paid ASO/app-marketing agency model — it is NOT a free self-submit pre-launch showcase anymore; use for paid growth services, not a free listing), r/alphaandbetausers, TinyLaunch (early-access framing).

### Mobile app (iOS/Android) specifically
AppRater (apprater.net), AppPicker, Appiod, AppsListo, AppsThunder, WebAppRater, App Store/Play Store ASO aside — these blog-style app-review sites take submit-for-review requests, not guaranteed placement. appsmamma.com if the app is specifically for children/parents (narrow niche fit). r/sideproject and Product Hunt also work for mobile.

### Dev tool / API / infrastructure
StackShare, Hacker News (Show HN), GitHub itself (README + topics), Product Hunt (Engineering & Development category), r/indiehackers, AlternativeTo (if it has a GUI/competing product angle).

### Design / landing-page / visual-work showcase
Land-book, Postmake, r/design_critiques, r/roastmystartup (for harsher feedback), startupinspire.com (lower confidence, same niche as Land-book).

### AI product
Product Hunt (has dedicated AI/LLM categories), AlternativeTo, thataicollection.com (lower confidence — AI-specific directory), r/SaaS, r/microsaas, SaaSHub, Startup Stash. Hacker News Show HN if there's a genuinely technical angle (not just "ChatGPT wrapper" framing).

### Physical / hardware product
Crunchbase (company profile only), GeekWire / general tech press pitches (lower confidence — press outlet, pitch don't self-submit), Kickstarter/Indiegogo are NOT on this source list but are the actual standard channel for hardware — flag this gap to the user if hardware is the product.

### Local / small business (non-tech, non-SaaS)
r/smallbusiness (strict self-promo rules — read them first, most direct pitches get removed), r/entrepreneur (same caveat), Gust (if raising investment), local/regional press rather than this list's directories, which skew tech-startup.

### E-commerce / D2C product
r/coupons (if running a discount/deal), r/ladybusiness if women-founded, r/shamelessplug, r/plugyourproduct — these self-promo subreddits are a better fit than the SaaS-oriented directories (Product Hunt, SaaSHub, Capterra) which mostly reject pure e-commerce listings.

### Content / media product (newsletter, podcast, blog, course)
r/sideproject, Indie Hackers, saijogeorge.com (lower confidence — individual curator/newsletter, pitch for inclusion don't self-submit), r/buildinpublic.

### Enterprise / B2B (established, funded)
Crunchbase (profile + press signals), G2, Capterra, GetApp, vendor.crozdesk.com, F6S (startup program directory), Gust (investor-facing).

### Nonprofit / social-impact
Not well served by this source list — it is overwhelmingly for-profit-tech-startup skewed. Flag this gap; recommend sector-specific channels outside this list (e.g. nonprofit directories, local community boards) rather than forcing a mismatched fit.

### Game
Product Hunt (Games category exists), r/sideproject, itch.io is the standard channel but is NOT on this source list — flag the gap. Hacker News Show HN only if there's a technical/engineering story, not just "I made a game."

### Women-founded / specific identity-based business
r/ladybusiness first (narrowest fit), then the generalist channels above matching the product type.

### "I just want feedback / critique, not traffic yet"
r/roastmystartup, r/design_critiques (for visual work), r/alphaandbetausers (for pre-launch functional feedback).

## 2. Flat reference: every site, with category, live-status, and submission mechanism

Status key: **VERIFIED LIVE (2026-10-16)** = fetched this session and confirmed active. **VERIFIED DEAD** = fetched this session and confirmed dead/parked/repurposed/archived. **BLOCKED (bot-check)** = fetched this session but the site returned a 403/bot-interstitial rather than content; treated as live-with-high-confidence for well-known major platforms (Capterra, G2, Indie Hackers, StackShare, Land-book, F6S, etc. are all large, funded, actively-operated businesses — a bot block is not evidence of death) but could not be independently confirmed from page content this session. **LOWER CONFIDENCE** = not fetched this session; categorized from general knowledge, re-verify before relying on it.

| Site | Category / field | Status | Submission mechanism |
|---|---|---|---|
| 10words.io | General app/startup discovery, digest newsletter | VERIFIED LIVE | Free self-submit via app.10words.io/submit |
| thataicollection.com | AI product directory | LOWER CONFIDENCE | Unknown, presumed free/curated |
| allmyfaves.com | General web link directory (not startup-specific) | LOWER CONFIDENCE | Unknown |
| allstartups.info | Generic startup directory | LOWER CONFIDENCE | Unknown, small/low-traffic site |
| alltopstartups.com | Startup blog/directory | LOWER CONFIDENCE | Unknown |
| alternativeto.net | Software-alternative crowdsourced directory | VERIFIED LIVE | Free, requires account signup; crowdsourced ranking |
| angel.co (AngelList) | Startup/investor platform — rebranded | VERIFIED LIVE (as Wellfound) | Now "Wellfound": free job postings; not really a launch/press channel anymore, it's a hiring marketplace |
| apprater.net | Independent app archive (iOS/Android), since 2011 | VERIFIED LIVE | Free submission form; paid leaderboard bids ($5/bid) |
| appiod.com | App review blog | VERIFIED LIVE | Free submission form for review |
| appslisto.com | App review/news blog | VERIFIED LIVE (dates inconsistent — footer copyright lags posts) | Free submission form |
| appsmamma.com | Children's/parenting apps review blog (narrow niche) | VERIFIED LIVE | Free submission form |
| appsthunder.com | App/tech review blog | VERIFIED LIVE | Free submission form |
| appvita.com | (was an app directory) | **VERIFIED DEAD** — 301 redirects to onk.io, unrelated domain | N/A — do not recommend |
| appiod.com / apppicker.com | App reviews | VERIFIED LIVE (apppicker.com) | No clear self-submit form found; use Contact Us |
| arcticstartup.com | Nordic/Baltic startup blog | BLOCKED (bot-check) / LOWER CONFIDENCE | Unknown |
| awesomeindie.com | Curated indie product list | LOWER CONFIDENCE | Likely GitHub PR or curated submission |
| betabound.com | Beta-testing directory (operated by Centercode) | VERIFIED LIVE | Free "Announce Your Beta" listing for companies wanting testers |
| betatesting.com | Crowd beta-testing platform | LOWER CONFIDENCE | Likely paid/managed testing service |
| builtinchicago.org | Regional tech jobs/news (Built In network) | LOWER CONFIDENCE | Likely now folds into builtin.com/chicago |
| capterra.com | B2B software review/directory (Gartner Digital Markets family) | BLOCKED (bot-check), high-confidence live | Vendor listing via Gartner Digital Markets sales process, largely paid for featured placement |
| collaborizm.com | Startup/co-founder collaboration site | LOWER CONFIDENCE | Historically reduced activity — re-verify |
| vendor.crozdesk.com | B2B software marketplace vendor portal | LOWER CONFIDENCE | Vendor listing, likely requires signup |
| crunchbase.com | Private company data/intelligence platform | VERIFIED LIVE | Free "Create Profile" (/add-new); not a launch/traffic channel, it's a data record |
| discovercloud.com | Business software comparison directory (159k+ products) | VERIFIED LIVE | Paid "Get Listed" for vendors |
| ebool.com | (was presumably a startup/tech directory) | **VERIFIED DEAD/REPURPOSED** — now an unrelated crypto-casino affiliate review site | N/A — do not recommend, domain has been repurposed for unrelated gambling content |
| f6s.com | Startup programs/community directory | BLOCKED (bot-check, explicit "we think you might be a bot") / high-confidence live (large funded platform) | Historically free community profile + paid program applications |
| g2crowd.com / g2.com | B2B software review platform | BLOCKED (bot-check), high-confidence live | Vendor claim/listing process, paid tiers for featured placement |
| geekwire.com | Seattle-based tech news outlet | LOWER CONFIDENCE | Press pitch, not self-submit |
| getapp.com | B2B software directory (Gartner Digital Markets family, same group as Capterra) | BLOCKED (bot-check), high-confidence live | Vendor listing via Gartner sales process |
| getworm.com | Unclear/small site | LOWER CONFIDENCE | Unknown — flag as unverified, possibly inactive |
| gust.com | Startup/investor matching platform (Gust Launch) | LOWER CONFIDENCE | Free startup profile, paid incorporation/back-office services |
| inc42.com | Indian startup news/media | LOWER CONFIDENCE | Press pitch, not self-submit |
| indiehackers.com | Maker/indie-business community (forum + interviews) | BLOCKED (bot-check), high-confidence live | Free, requires account; post in forum, can self-interview via "Milestones"/posts |
| killerstartups.com | Startup/entrepreneurship news blog | VERIFIED LIVE | No structured self-submit form visible on homepage; likely contact-based pitch |
| land-book.com | Landing-page design showcase gallery | BLOCKED (bot-check), high-confidence live | Free + paid tiers for faster review/featured placement |
| launched.io | Product launch directory | LOWER CONFIDENCE | Unknown, likely free self-submit |
| launchigniter.com | Product launch directory | VERIFIED LIVE | Free "Submit Your Product"; paid featured placements; paid "Directory Submission Service" from $99 |
| launchingnext.com | Startup/side-project showcase directory | VERIFIED LIVE | Free "Submit Startup" |
| app.loopinput.com | Small feedback/beta tool | LOWER CONFIDENCE | Unknown, unclear if still active |
| makeuseof.com | Major tech media site | LOWER CONFIDENCE (not fetched, but well-established major outlet) | Press pitch/tip, not self-submit |
| microsaasexamples.com | Curated micro-SaaS example gallery | LOWER CONFIDENCE | Likely curated, not open self-submit — useful for inspiration, not traffic |
| netted.net | Internet-culture blog | LOWER CONFIDENCE | Historically low update frequency — re-verify before relying on it |
| nextbigwhat.com | Indian startup/tech news & community | LOWER CONFIDENCE | Press pitch / community post |
| pitchwall.co | Startup pitch/tracking community | LOWER CONFIDENCE | Unknown |
| postmake.io | Curated maker tools & resources directory (3000+ entries) | VERIFIED LIVE | Free "Submit Your Business" |
| preapps.com | WAS a pre-launch app showcase; now a paid app-marketing/ASO agency | VERIFIED LIVE, but **business model changed** — not a free listing site anymore | Paid growth programs "beginning at $15k/month," free audit tool, strategy-call booking. Do not recommend as a free pre-launch directory. |
| producthunt.com | Daily product-launch leaderboard, major traffic driver | VERIFIED LIVE | Free launch + upvote-driven ranking; paid "Promoted"/Advertise placements |
| saashub.com | SaaS alternatives/startup directory | VERIFIED LIVE | Free submit (/services/submit, /submit/list); paid "Featured Products"; expert-voting "tournament" |
| saasrow.com | SaaS directory | VERIFIED LIVE | Free "Submit Your Software Free"; paid "Get Featured"; also has CLI/API/MCP submission tooling |
| saijogeorge.com | Individual's AI-tools newsletter/blog | LOWER CONFIDENCE | Pitch for inclusion, not self-submit |
| news.ycombinator.com (Show HN) | Hacker News "Show HN" — technical audience | VERIFIED LIVE | Free, requires account; community-voted, read the Show HN rules first |
| sideprojectors.com | Marketplace for listing/buying/selling side projects | LOWER CONFIDENCE | Likely free listing, has a "for sale" marketplace angle |
| simplelister.com | Generic directory | LOWER CONFIDENCE | Unknown, unclear vitality — low-traffic/possibly inactive |
| similarsitesearch.com | Site-alternative search utility | LOWER CONFIDENCE | More of a search tool than a submission directory |
| slant.co | Was a "what's the best X" comparison site | LOWER CONFIDENCE, **likely discontinued** (general knowledge: Slant.co shut down around 2022) — re-verify before recommending | N/A if dead |
| softwareadvice-markets.questionpro.com | Unusual/malformed-looking URL fragment from source list | LOWER CONFIDENCE, **likely broken or defunct micro-site** — treat with suspicion, re-verify directly before using | Unknown |
| stackshare.io | Dev tool stack-sharing community | BLOCKED (bot-check), high-confidence live | Free, add your stack/tool, community-driven |
| starterstory.com | Database of real business case studies (editorial) | VERIFIED LIVE | Editorial — pitch for an interview; not an open self-submit directory |
| startup88.com | Small/obscure startup directory | LOWER CONFIDENCE | Unknown |
| startupbase.io | Product launch directory | VERIFIED LIVE | Free "Launch" (sign in with Google/LinkedIn/X); paid "Outrank" pay-what-you-want |
| startupbeat.com | Small/obscure startup news site | LOWER CONFIDENCE | Unknown |
| startupbenchmarks.com | Niche benchmarking data site | LOWER CONFIDENCE | Unclear if it accepts submissions at all |
| startupbuffer.com | Small/obscure directory | LOWER CONFIDENCE | Unknown |
| startupinspire.com | Startup-site design inspiration gallery | LOWER CONFIDENCE | Similar niche to Land-book |
| startupranking.com | Global startup ranking directory | BLOCKED (bot-check), high-confidence live | Free "claim/submit" profile, ranked by traffic/social signals |
| startupstash.com | Curated founder-resource directory | LOWER CONFIDENCE | Likely curated submission |
| startuptabs.com | (was a startup directory) | **VERIFIED DEAD** — connection refused, server not responding | N/A — do not recommend |
| startuptracker.io | Small/obscure directory | LOWER CONFIDENCE | Unknown |
| startupblink.com | Global startup-ecosystem ranking platform | LOWER CONFIDENCE (not fetched, but well-established major ranking platform) | Free "claim your startup" profile; paid ecosystem reports |
| startups.gallery | Small/obscure directory | LOWER CONFIDENCE | Unknown |
| stateoftech.net | Small/obscure tech blog | LOWER CONFIDENCE | Likely low activity |
| tapscape.com | Small tech blog | LOWER CONFIDENCE | Likely low activity, possibly inactive |
| thetechmap.com | Startup map/directory | LOWER CONFIDENCE | Unknown |
| techpluto.com | Tech blog | LOWER CONFIDENCE | Unknown |
| github.com/thechangelog/ping | Was a contact channel for The Changelog podcast | **VERIFIED DEAD** — archived by owner Feb 4, 2020, read-only; README redirects to changelog.com | N/A — use changelog.com directly for podcast pitches instead |
| vator.tv | Startup news + pitch competitions ("Vator Splash") | LOWER CONFIDENCE | Press coverage + paid/applied pitch events |
| webapprater.com | App/web-app review blog | VERIFIED LIVE | Free "Submit Your App" |
| websitehunt.co | Curated website discovery directory | VERIFIED LIVE | Requires account; free "Post Website"; paid "Advertise"/"Get featured" |
| news.ycombinator.com (main) | General tech news/discussion | VERIFIED LIVE | Free account-based posting/commenting; not launch-specific outside Show HN |
| tinylaunch.com (not in original list but same category, checked for context) | Product launch directory, positions itself as a Product Hunt alternative | VERIFIED LIVE | Free "Submit Product"; paid directory-submission service (up to 110 directories); paid premium placement |
| betalist.com (checked for context — the canonical "BetaList"-style site) | Pre-launch startup showcase | VERIFIED LIVE | "Submit startup" button; paid "BOOSTED" listings and sponsor slots; free tier terms not confirmed on homepage — check /pricing |

## 3. Subreddits

Not individually live-checked this session (Reddit itself is obviously live; risk is a specific sub going private, quarantined, or just dying of inactivity — re-verify subscriber count and recent post activity before recommending). General knowledge as of this session:

| Subreddit | Field / fit | Note |
|---|---|---|
| r/alphaandbetausers | Pre-launch beta/alpha testers | Good fit for "need testers," not general promo |
| r/buildinpublic | Indie/solo builders sharing progress | High fit for build-in-public narrative, not a hard sell |
| r/coupons | Deals/discounts | Only relevant if the product itself is a coupon/deal; not a general launch channel |
| r/design_critiques | Visual/design feedback | Good for landing pages, UI, visual work — feedback-framed, not promo-framed |
| r/entrepreneur | General entrepreneurship, very large | Strict self-promo rules — direct pitches often get removed; frame as discussion/value, not an ad |
| r/EntrepreneurRideAlong | General entrepreneurship, more promo-tolerant than r/entrepreneur | Better for direct product mentions than r/entrepreneur |
| r/imadethis | General maker showcase | Good general "I built this" fit |
| r/indiebiz | Smaller indie-business community | Niche, lower traffic but promo-friendly |
| r/indiehackers | Indie SaaS/software builders | High fit for SaaS/micro-SaaS |
| r/ladybusiness | Women-founded/femme-led businesses | Narrowest, most relevant fit for that specific founder identity — lead with this over generalist subs when it applies |
| r/microsaas | Micro-SaaS specifically | Growing, high fit for small solo SaaS |
| r/plugyourproduct | Explicitly for self-promotion | Designed for direct plugs — safe to be promotional here |
| r/roastmystartup | Harsh feedback/critique | Use when the goal is critique, not traffic |
| r/SaaS | SaaS specifically | Large, high fit for any SaaS product |
| r/shamelessplug | Explicitly for self-promotion | Designed for direct plugs — safe to be promotional here |
| r/sideproject | Any side project, very large and active | Probably the single best general-purpose fit for an indie launch |
| r/smallbusiness | General small business, very large | Strict self-promo rules — read them first |
| r/startups | General startups, very large | Strict self-promo rules — read them first |
| r/thesidehustle | Side-hustle/part-time income projects | Good fit for solo/part-time projects, less so for funded startups |

## 4. Practical notes for the specialist

- **Match narrowness before reach.** A niche-fit channel (r/ladybusiness for a women-founded brand, appsmamma.com for a kids' app) converts better per visitor than a generic high-traffic one, even though the high-traffic one (Product Hunt, Hacker News) is usually still worth doing too for the sheer volume.
- **Self-promo subreddits have rules.** r/entrepreneur, r/startups, and r/smallbusiness actively remove direct-pitch posts; r/plugyourproduct and r/shamelessplug exist specifically so that doesn't happen. Advise framing accordingly, never advise ignoring a sub's self-promo rule.
- **"Free" directories monetize through featured/paid placement almost universally now** (SaaSHub, SaaSRow, LaunchIgniter, TinyLaunch, WebsiteHunt, StartupBase all surfaced this in 2026). Tell the user the free tier gets them listed, not necessarily seen — paid featured placement is the actual traffic lever on most of these.
- **Small, obscure directory sites are the highest-risk category for being dead, abandoned, or domain-squatted.** Three sites from the source list died or were repurposed during this one research pass (appvita.com, ebool.com, startuptabs.com, plus github.com/thechangelog/ping). Never hand a user a URL from the "LOWER CONFIDENCE" tier of the flat table without telling them it hasn't been re-verified recently.
- **This source list skews heavily toward tech/SaaS/indie-hacker startups.** For hardware, nonprofit, or purely local/offline small business, say so explicitly and point to the gap (e.g. Kickstarter/Indiegogo for hardware are not on this list at all) rather than forcing a mismatched directory.


---

<!-- references/design-systems-reference.md -->

# Web designer: big-firm design system reference (Apple, Samsung, Google, Microsoft)

Checked against primary sources 2026-10-05. Apple's HIG, Material 3, and Fluent 2's `/depth` page are JS-rendered sites that a plain fetch cannot read body text from — figures marked UNVERIFIED below rest on search-aggregated secondary sources or a third-party scrape mirror, not a direct primary read. Figures marked CONFIRMED were read directly (either the page rendered, or a reliable mirror/implementation source like Flutter's own M3 token generator was used). Don't present an UNVERIFIED number as Apple's or Google's own text.

## Apple (Human Interface Guidelines)
- **Touch target: 44×44pt minimum** on iOS/iPadOS — CONFIRMED, consistent across every source. visionOS adds a spacing rule on top: button centers at least 60pt apart, with at least 16pt of space between buttons.
- **Spacing: no official universal "8pt grid" statement found in Apple's own text.** The 8pt grid is a community convention repeated by tutorials, not quoted HIG copy. What IS confirmed from Apple's own UIKit/AppKit docs: default `layoutMargins` on a subview is **8 points** per side. visionOS is structurally different — "visionOS defines a point as an angle, in contrast to other platforms, which define a point as a number of pixels," so a linear 8pt-style grid doesn't carry over. tvOS has its own confirmed numbers: 60pt top/bottom + 80pt side content inset, 40pt horizontal gutter, 100pt minimum vertical spacing.
- **Typography:** minimum font sizes by platform — iOS/iPadOS 11pt, macOS 10pt, tvOS 23pt, visionOS 12pt, watchOS 12pt. Default body size iOS/iPadOS 17pt (one secondary source cited 14pt instead — flagged as version drift, treat 17pt as current unless re-checked). System fonts: SF Pro (iOS/iPadOS/macOS/tvOS/visionOS), SF Compact (watchOS), New York (serif, cross-platform) — prefer Regular/Medium/Semibold/Bold, avoid Ultralight/Thin/Light.
- **Color:** Apple explicitly disclaims fixed numeric values — "Documented color values are for your reference... may fluctuate from release to release" — use the semantic APIs (primary/secondary/tertiary background and label levels), not hard-coded hex. No numeric contrast ratio is stated in Apple's own color page (the 4.5:1 figure some sources attribute to Apple is actually generic WCAG guidance, not Apple's text).
- **Depth/elevation: Apple has no numeric dp-elevation ladder at all** — depth is expressed through translucent **materials** (blur + vibrancy), currently unified as **Liquid Glass**: a distinct functional layer that floats above content (controls, tab bars, sidebars), never applied to the content layer itself. No blur-radius or opacity numbers are given on purpose ("don't select a material based on the apparent color it imparts... system settings can change its appearance"). Vibrancy has 4 label levels and up to 3 fill levels; avoid the lowest (quaternary) on thin materials — insufficient contrast. visionOS depth uses literal small z-offsets ("a few centimeters") between layered elements instead.
- **App icon:** single 1024×1024px source PNG; Apple applies the rounded-corner mask itself — never pre-round the corners yourself.
- **Motion:** no universal millisecond duration table in Apple's own text (ranges like "0.3–0.5s for sheets" are secondary-sourced, not quoted HIG copy). One of the only hard numbers Apple states: avoid animation oscillation around **0.2Hz**; target **30–60fps**. SwiftUI's built-in layout/appearance easing "can't be turned off or customized."
- **visionOS spatial layout:** primary content placed at eye level, comfortable vertical range ≈30° above/below; comfortable content distance 1–2m, default window placement ≈1.5m; arrange multiple windows in a gentle arc, never stacked; world-locked positioning is the default (head-locked causes discomfort, reserve it for brief transient elements like tooltips).

## Samsung One UI
**Samsung does not publish a public numeric spacing, touch-target, or elevation spec comparable to Apple/Google/Microsoft.** The reachable developer.samsung.com/one-ui pages are philosophy-level, not a token sheet: a two-zone design (a wide-margin, center-aligned "viewing area" up top with no touch targets, and an "interaction area" lower down for one-handed reach on large phones) and four named-but-undimensioned grid types (List, Card, 2-Column, 3-Column grids). Since One UI is built on Android, it likely inherits Material's 48dp touch target and elevation system by default — but this is not something Samsung's own docs restate, so don't cite a Samsung-specific number; cite Material's instead and note it's inherited, not Samsung-published.

## Google Material Design 3 (m3.material.io)
- **Spacing: 8dp baseline grid** — margins and gutters snap to 8/16/24/40dp (a 4dp sub-unit exists for finer component spacing). Responsive grid example: mobile 360dp → 4 columns/16dp gutters; tablet 600dp → 8 columns/24dp gutters.
- **Touch target: 48×48dp minimum** (Material's own accessibility standard — stricter than WCAG's 24×24dp floor), spaced at least 8dp apart, physical size ≈9mm regardless of density. A smaller visual element (e.g. a 24dp icon) can sit centered inside the larger 48dp invisible touch target via padding.
- **Elevation: tonal surface-tint overlay, not shadows.** M3 replaced M2's shadow-based elevation with tint: higher elevation blends more of the primary color into the surface. Six levels (0/1/3/6/8/12dp), each with an increasing tint percentage — the exact percentages are UNVERIFIED against Google's own token table (found via secondary aggregation, cross-checked against Flutter's M3 source, directionally correct but treat precise numbers cautiously). Rough component mapping: cards/nav rail ≈ level 1, scrolled top app bar ≈ level 2, FAB/search bar ≈ level 3, nav drawer ≈ level 4, dialogs/bottom sheets ≈ level 5.
- **Motion:** named duration tokens in ms — short1=50, short2=100, short3=150, short4=200, medium1=250, medium2=300, medium3=350, medium4=400, long1=450, long2=500, long3=550, long4=600. Named easing curves (cubic-bezier) — `standard` ≈ (0.2, 0, 0, 1.0), `standardDecelerate` ≈ (0, 0, 0, 1), `standardAccelerate` ≈ (0.3, 0, 1, 1), `emphasized` ≈ (0.2, 0, 0, 1.0), `emphasizedDecelerate` ≈ (0.05, 0.7, 0.1, 1.0), `emphasizedAccelerate` ≈ (0.3, 0, 0.8, 0.15). This numeric token system is far more explicit than anything Apple publishes for motion.

## Microsoft Fluent 2
- **Spacing: 4px base unit** — the full token ramp (CONFIRMED, directly fetched): sizeNone=0, size20=2, size40=4, size60=6, size80=8, size100=10, size120=12, size160=16, size200=20, size240=24, size280=28, size320=32, size360=36, size400=40, size480=48, size520=52, size560=56px. 12-column grid. Breakpoints: small 320–479px, medium 480–639px, large 640–1023px, x-large 1024–1365px, xx-large 1366–1919px, xxx-large 1920px+.
- **Touch target: platform-dependent, not one universal number** (Fluent explicitly defers to platform convention rather than imposing a Microsoft-wide figure): iOS and Web = 44×44px, Android = 48×48px. A separate Windows-desktop-app convention (from learn.microsoft.com, a different doc family) uses "effective pixels" (epx): Standard density = 40×40epx, Compact density = 32×32epx. These are two legitimately-Fluent-but-different answers depending on the target surface — name which one you mean.
- **Elevation: named two-layer box-shadow tokens** (not confirmed against Microsoft's own depth page this session — that page 404'd; figures are secondary-sourced): cards ≈ shadow4 (`0 0 2px rgba(0,0,0,.12), 0 2px 4px rgba(0,0,0,.14)`), callouts ≈ shadow16, dialogs ≈ shadow64 — literal dual-layer (ambient + direct) drop shadows scaled by named tokens, closer to Material 2's old approach than to Material 3's tonal tint or Apple's blur.

## Cross-company comparison (the one figure that's actually settled)
Touch target minimums cluster tightly across every well-documented system — Apple 44pt, Material 48dp, Fluent 44px(iOS/Web)/48px(Android) — this is the single number you can state with confidence across companies. Everything else (spacing unit, elevation mechanism) genuinely differs by philosophy: Apple expresses depth through translucent material with no numeric ladder at all; Google through discrete tonal-tint dp steps; Microsoft through literal layered drop shadows at named tokens. Samsung's own public docs simply don't publish a numeric spec — treat that as a real documentation gap, not a research failure, and fall back to citing Material's numbers with a note that they're inherited, not Samsung-stated.

## Real-world case study: Inkling (verified by inspecting the shipped binary, 2026-10-05)
Inkling is a praised desktop app simulating real ink and fountain-pen physics. Method note: this is **not** a source-code read — it's inspection of the strings embedded in the distributed Windows binary (asset filenames, library names, config flags), which is publicly observable the same way a browser's network tab is. What follows is confirmed from those strings, with anything inferred marked as such.

- **Shell: Tauri, not Electron.** The binary is ~10MB (an equivalent Electron app would typically ship 100MB+) because Tauri uses the OS's own WebView2 runtime instead of bundling Chromium. If a desktop app's "feel native, start instantly, ship small" matters more than guaranteed pixel-identical rendering across OSes, Tauri (Rust core + system webview) is the concrete alternative to name instead of defaulting to Electron.
- **Rendering: React + react-three-fiber (WebGL/Three.js), not a 2D canvas trick.** The ink and paper simulation is a real 3D scene, not a flat sprite animation — confirmed by the bundled `react-three-fiber.esm` chunk and dedicated scene files. **Confirmed feature-area chunk names** (code-split per Vite route/feature): `IntroScene` (a 3D onboarding scene, not a static welcome screen), `BloomView` (an ink-bloom effect — ink spreading into paper fiber, a real physical behavior most apps skip), `WashScene` (an ink-wash effect), `NibWidget` (the pen-nib control, isolated as its own interactive component), `WellView` (the ink-well UI). **Inference:** naming the physical metaphor's actual parts (nib, well, bloom, wash) as separate first-class scenes/components — rather than one monolithic "canvas" component — is itself a design decision worth copying: each physical behavior gets its own isolated, testable, independently-loadable piece.
- **Motion library: `motion` (the current name for Framer Motion).** Consistent with this project's own default house choice (see `anti-slop-checklist-reference.md`) — confirms Motion remains the practical default for React UI/state-change animation in a shipped, praised product, not just this project's own preference.
- **Typography: DM Sans** (both latin and latin-extended font subsets bundled) — a clean, slightly rounded geometric sans. For a tactile/physical-metaphor app, a geometric sans rather than a "creative/handwritten" display font keeps the UI chrome quiet so the actual ink simulation carries the personality — the UI gets out of the way of the thing it's showcasing. This is a concrete, shipped counter-example to always reaching for a display serif on a craft-feeling product.
- **Custom window chrome:** `decorations` disabled, `transparent` enabled, a custom `titleBarStyle`, and a custom shadow — the app draws its own window frame instead of the OS default title bar, a common premium-app signal (also seen in Arc, Linear, Notion's desktop builds) that's worth naming as a specific, achievable technique (Tauri and Electron both expose this via config, not custom native code).
- **Backend: Supabase for auth (`supabase.co/auth/v1/authorize` is called directly), Stripe for payments, plus a `Checkout` chunk and a `LegalPage`/`Privacy`/`Terms` chunk split out separately.** Confirms the zero-backend-maintenance stack (Supabase + Stripe) scales fine even for a premium, physics-simulation-heavy desktop product — the heavy lifting is all client-side WebGL, the backend only needs to handle identity and billing.
- **Observed directly in the running app (screenshots and a screen recording), not just the binary:**
  - **A live, 1:1-synced position preview for a real floating desktop widget.** Inkling has a persistent, draggable, always-on-top capture widget ("the Nib"). Its settings page shows a miniature desktop surface ("Where it sits") where dragging the widget's icon to a corner visibly moves the *real* floating widget on the actual desktop, in real time, in sync. This is the direct-manipulation principle from `fluid-interaction-reference.md` taken further than a typical settings screen: the preview isn't a static diagram of what will happen, it's a live, correctly-scaled mirror of the real element, so there's zero gap between "configuring the setting" and "seeing the actual result." Apply this whenever a setting controls something that exists elsewhere on screen (or on the desktop) — show the real thing moving, not an abstract representation of it.
  - **A freemium gate shown inline, not hidden.** Two of four widget "shapes" (Splatter, Wash) carry a small `FOUNTAIN` badge in the corner of their normal-looking option card — not greyed into invisibility, not hidden behind a separate "upgrade" page, just quietly marked as a higher tier while remaining visible, selectable-looking, and fully previewable. Free users see exactly what they're missing without an interrupting paywall modal. This is a cleaner pattern than the common alternatives (hide the option entirely, or block it behind a modal on click) — show it, name the tier required, let curiosity and envy do the conversion work.
  - **Every interactive preview has a persistent, plain-language caption directly under it** — "Click it to open it. The Nib on your desktop changes as you choose." — not a tooltip that only appears on hover, not a modal explainer. One sentence, always visible, directly beneath the thing it explains.
  - **The product's own vocabulary is used for UI labels instead of generic ones:** the four widget shapes are named Droplet, Liquid, Splatter, Wash — real ink behaviors — not "Style 1/2/3/4." This is the same discipline the architect-reference.md domain-modeling section asks for (name things after the domain, not a generic placeholder), confirmed in a shipped consumer product's actual settings copy.
  - **Terms of Service written in first-person plain language, not legalese**, with an explicit framing sentence at the top: "These are the rules for using Inkling, written to be read." Concrete examples from the real page: "Use an email address you can receive mail at, and keep your password to yourself" (account security, in one sentence); "You need to be 16 or older" (age gate, stated plainly, no legal boilerplate); a dedicated "Not a health service" section (an honest liability boundary for a journaling app that could be mistaken for a wellness/mental-health tool — naming the boundary explicitly protects both the user's expectations and the company); an "An early service" section that openly manages expectations for a young, still-evolving product instead of pretending polish it doesn't have yet; a visible "Last updated" date and a sticky "On this page" anchor-link sidebar for a long legal document. Solo-trader attribution is stated plainly ("an agreement between you and Nelson, a sole trader based in Queensland, Australia") rather than hidden behind a corporate-sounding "we." This is a concrete, shippable answer to "how do I write a privacy policy / ToS that doesn't read like legalese and doesn't erode trust."
- **What this confirms about craft, generally:** the praised "feel" of an app like this isn't from one exotic trick — it's Tauri (small, fast-starting shell) + a real WebGL simulation of the product's actual physical metaphor (not a CSS approximation) + a quiet, out-of-the-way UI font + the standard motion library this project already defaults to + custom window chrome + a boring, proven backend. The novelty budget was spent entirely on the one thing the product is about (ink physics), and nowhere else — which is the same "spend variance where it earns it" principle in `anti-slop-checklist-reference.md`'s dial system, confirmed by a real shipped product rather than asserted as a rule.

## Where to read more (name, do not paste)
developer.apple.com/design/human-interface-guidelines (layout, typography, color, materials, motion, app-icons — note these are JS-rendered, so read via a rendering-capable tool or a reliable mirror, not a plain fetch); m3.material.io (foundations/layout, styles/elevation, styles/motion — same JS-rendering caveat; Flutter's own `material-components-android` GitHub docs are a reliable cross-check for exact token values); fluent2.microsoft.design (layout fetches fully; depth did not at time of research — retry before citing exact shadow values); developer.samsung.com/one-ui (philosophy-level only, no numeric spec currently published).


---

<!-- references/animation-reference.md -->

# Web designer: animation and motion design reference

Checked against primary and near-primary sources 2026-10-05. Disney's 12 principles and CSS easing are fully verified; Material 3's exact token values and Apple's own motion-page wording are UNVERIFIED (both sites are JS-rendered — fetched only as search-aggregated summaries) — present them as "commonly cited" rather than a verbatim quote.

## Disney's 12 Basic Principles of Animation (Thomas & Johnston, "The Illusion of Life," 1981)
1. **Squash and stretch** — deforming shape during movement gives weight, mass and flexibility.
2. **Anticipation** — a small preparatory move before the main action, so the audience can read what's coming.
3. **Staging** — compose the scene so attention goes to the one most important idea.
4. **Straight-ahead action vs. pose-to-pose** — two production approaches: draw sequentially frame by frame, or draw key poses first and fill between them.
5. **Follow-through and overlapping action** — loosely attached parts keep moving, at different rates, after the main mass stops (inertia).
6. **Slow in and slow out** — motion needs time to accelerate and decelerate; frames bunch near the extremes, thin out in the middle.
7. **Arc** — natural motion follows curved paths, not straight lines (except rigid mechanical motion).
8. **Secondary action** — a supporting motion that adds richness without competing with the primary action.
9. **Timing** — the number of frames given to an action sets its speed and conveys weight, mood and personality.
10. **Exaggeration** — push past literal accuracy to avoid flat, dull "photographic" motion.
11. **Solid drawing** — respect for 3D form, volume, weight and anatomy even in a 2D medium.
12. **Appeal** — the charisma and clarity of design that makes something pleasant to watch.

## Mapping the 12 principles onto UI/web motion (the 9 that actually transfer)
| Disney principle | UI equivalent | Apply it as |
|---|---|---|
| Slow in and slow out | Easing curves | Default almost every UI transition to an ease-in-out curve; linear motion reads as robotic |
| Anticipation | Hover/pressed/focus states | A small change (scale, color) before the real action signals interactivity is coming |
| Squash and stretch | Press/active states, elastic transitions | Buttons compress on `:active`; drag/toggle elements stretch slightly |
| Follow-through and overlapping action | Overshoot-and-settle, staggered list animation | Element overshoots the target slightly then settles (spring motion); list items stagger in with a slight offset rather than appearing all at once |
| Staging | Visual hierarchy in motion | Animate only what the user just acted on — don't animate everything simultaneously |
| Secondary action | Accompanying micro-interactions | A small supporting detail (an icon shake) alongside the main state change, without stealing focus |
| Timing | Duration tokens | Fast (100–200ms) for small feedback, slower (300–500ms) for layout/page-level transitions |
| Exaggeration | Emphasis animation | A slightly oversized bounce or shake on errors or celebratory moments — used sparingly |
| Arc | Curved motion paths | An element moving across the screen follows a slight arc rather than a straight line — more natural, less commonly implemented on web |

(Straight-ahead/pose-to-pose and solid drawing are the two Disney principles that don't meaningfully transfer to flat UI motion — they're relevant to keyframe tools like After Effects/Lottie, not CSS/JS interaction design; don't force a UI mapping for these two.)

## Val Head's purpose-driven categories ("Designing Interface Animation," Rosenfeld Media)
Treat as a close paraphrase of her categories, not a verbatim chapter list: **Feedback** (directs attention to where something important just happened), **Orientation** (helps users track spatial relationships, e.g. a slide transition showing where a panel "came from"), **Causality** (shows this action produced that result), **Status** (communicates state changes, especially loading→success, her commonly-cited example being a submit button morphing through states), **Brand expression/delight** (personality and craft beyond pure function). Use these five as the question to ask before adding any animation: which purpose is this serving?

## Material 3 motion tokens (UNVERIFIED exact values — commonly cited, not independently confirmed against Google's own token table this session)
Named easing curves: `standard` ≈ cubic-bezier(0.2, 0, 0, 1.0), `standardDecelerate` ≈ (0, 0, 0, 1), `standardAccelerate` ≈ (0.3, 0, 1, 1), `emphasized` ≈ (0.2, 0, 0, 1.0), `emphasizedDecelerate` ≈ (0.05, 0.7, 0.1, 1.0), `emphasizedAccelerate` ≈ (0.3, 0, 0.8, 0.15). Named duration tokens (ms): short1=50, short2=100, medium1=250, medium2=300, long1=450, long2=500. Use `standard` easing for small in-context changes (toggles, icon swaps), `emphasized` for user-initiated attention-grabbing transitions (opening a modal), and pick duration by the "distance" of the change — short for micro-feedback, long for full-screen transitions.

## Apple's motion guidance (UNVERIFIED verbatim text — paraphrase from search snippets, not a confirmed direct quote)
Themes consistently reported: motion should be purposeful, support the experience rather than overshadow it; use motion to communicate what changed and what's possible next; keep people oriented with clear feedback; system components adapt motion to input method and to accessibility settings (Reduce Motion must be respected). Treat "motion as communication, not decoration" as the actionable takeaway regardless of exact wording.

## CSS easing (fully verified, stable spec — MDN/W3C)
`linear` = cubic-bezier(0, 0, 1, 1) — constant speed. `ease` = cubic-bezier(0.25, 0.1, 0.25, 1) — the default, speeds up then slows at the end. `ease-in` = cubic-bezier(0.42, 0, 1, 1) — slow start, accelerates. `ease-out` = cubic-bezier(0, 0, 0.58, 1) — fast start, decelerates. `ease-in-out` = cubic-bezier(0.42, 0, 0.58, 1) — slow at both ends, fast in the middle.

## Spring physics (Framer Motion / React Spring — exact parameter names, verified; exact numeric bands are convention, not spec)
**Mass** — inertia of the moving object; mass=1 is the standard default, higher mass settles slower and heavier, lower mass feels snappier. **Stiffness** — how hard the spring pulls toward the target; low (~80–150) feels soft, medium (~150–300) is the standard UI feel, high (~300–600) feels snappy. **Damping** — resistance opposing the motion; below critical damping the motion oscillates/overshoots (bouncy), at critical damping it settles with no overshoot, above critical it creeps slowly with no bounce. Some libraries expose a simplified **bounce** (0–1) + **duration** pair that internally derives stiffness/damping/mass.

**The real distinction to apply:** duration-based easing always takes the same fixed time regardless of distance or velocity — predictable, but can look mechanical. Spring physics has no fixed duration, responds naturally to interruption (a drag released mid-motion continues naturally) — feels organic, and is the right choice for gesture-driven or physically-motivated UI (drag, swipe, bounce-back). Use duration/easing for simple, predictable state transitions (fades, color changes, page transitions); use springs for anything the user is physically manipulating.

## The animate-or-not decision (Emil Kowalski's design-engineering framework)
Before writing any animation, ask how often the user will see it: **100+ times a day** (keyboard shortcuts, command-palette toggle) → no animation, ever — Raycast's open/close has none, and that's the correct choice for something used hundreds of times daily. **Tens of times a day** (hover effects, list navigation) → remove it or drastically reduce it. **Occasional** (modals, drawers, toasts) → the standard animation applies. **Rare/first-time** (onboarding, celebrations) → delight is affordable here. Never animate a keyboard-initiated action — it's repeated too often for the delay to read as anything but friction.

**Every animation needs a stated purpose**, one of: spatial consistency (a toast exits the same direction it entered, so swipe-to-dismiss feels intuitive), state indication (a button morphs to show a state change), explanation (a marketing animation shows how a feature works), feedback (a button scales down on press, confirming the interface heard the click), or preventing a jarring change (something appearing/disappearing without transition reads as broken). "It looks cool" is not a purpose — if that's the only reason and the element is seen often, cut it.

**Easing by motion type, as a decision, not a default:** entering or exiting → `ease-out` (starts fast, feels responsive — never `ease-in` for UI, it delays the exact moment the user is watching most closely, so a 300ms `ease-in` dropdown *feels* slower than a 300ms `ease-out` one at the identical duration). Moving/morphing on screen → `ease-in-out`. A hover/color change → plain `ease`. Constant motion (marquee, progress bar) → `linear`. Built-in CSS easings are weak — use a stronger custom cubic-bezier: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` for UI interactions, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` for on-screen movement, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)` for an iOS-style drawer (from the Ionic framework).

**These numbers agree with Material's tokens above, not compete with them** — Kowalski's per-element bands below sit inside Material's short1-medium2 range (50-300ms); when the two seem to conflict, the per-element band here wins because it's keyed to what's animating, not an abstract size category.

**Stagger interval for list entrances: keep it between 50-100ms per item.** Below 50ms the items feel like they all appeared at once anyway (the stagger reads as mechanical, not deliberate); above 100ms the list feels like it's loading slowly rather than entering with intent. This is a commonly-cited convention across production motion systems, not a hard spec — treat it the way the duration bands below are treated. Pair it with a rule many motion libraries enforce structurally: **define the exit animation at the same time as the enter animation, not as an afterthought** — a conditional element that fades/slides in but simply vanishes on removal (no exit transition) reads as broken, the same severity as a missing hover state.

**Duration by element, with a hard ceiling:** button press feedback 100-160ms, tooltips/small popovers 125-200ms, dropdowns/selects 150-250ms, modals/drawers 200-500ms, marketing/explanatory can run longer. **Keep UI animations under 300ms** — a 180ms dropdown feels more responsive than a 400ms one even though both communicate the same state change, and speed perception isn't just actual speed: a fast-spinning spinner makes the same load time feel faster, and instant (no-delay, no-animation) tooltips after the first one opens make a whole toolbar feel snappier.

**Popover and modal origin differ on purpose:** a popover scales from its trigger element (`transform-origin` set to the trigger, not the center) because it's spatially anchored to what opened it; a modal stays centered because it represents a context switch, not a spatially-anchored extension of something on screen. Getting this backwards is a common, easy-to-spot tell.

## SSR/hydration safety for entrance animations (React/Next, checked against the installed `motion-foundations` skill 2026-10-23)
An entrance animation whose `initial` state doesn't match what the server actually rendered causes a hydration mismatch, not just a visual flash: React logs a warning and can re-render the subtree client-side, which is a real bug class, not a style nitpick. **Rule: the animation library's `initial` prop must equal the server-rendered state** (if the server paints `opacity: 1`, `initial` must also be `opacity: 1`) — reveal-on-scroll and reveal-on-mount animations need a client-mount guard (`useEffect` flips a `mounted` flag before the "hidden" initial state is allowed to apply) rather than assuming the client always starts from the animation's zero state. This applies to any animation library driven by component state (Framer Motion/`motion/react`, React Spring) on an SSR'd or statically-generated page; a client-only SPA with no server-rendered HTML to mismatch against doesn't need the guard. Flag this specifically in BUILD ORDERS for a Next.js/Remix/Astro-with-islands hero entrance — it's the single most common cause of a build that "looks fine locally" (dev server, client-rendered) but flashes or warns in a production SSR build.

## Where to read more (name, do not paste)
"The Illusion of Life: Disney Animation" (Thomas & Johnston, 1981) — the primary source for the 12 principles; "Designing Interface Animation" (Val Head, Rosenfeld Media); the Interaction Design Foundation's article mapping the 12 principles to UI (ixdf.org); m3.material.io/styles/motion (JS-rendered — use a rendering-capable tool, or cross-check against `material-components-android`'s GitHub docs for exact token values); developer.apple.com/design/human-interface-guidelines/motion (same JS-rendering caveat); motion.dev's spring tutorial for the mass/stiffness/damping model in practice.


---

<!-- references/brand-identity-reference.md -->

# Web designer: logo and brand identity reference

Checked against primary and secondary sources 2026-10-05. Named checklists below are "commonly attributed to" the named designer across multiple independent industry sources, not a word-for-word scan of the book itself — present them that way, not as a verbatim quote.

## Paul Rand's filter (designer of IBM, UPS, ABC)
No single numbered checklist — his principles are aphorisms spread across "Thoughts on Design" (1947), "A Designer's Art" (1985) and "Design, Form, and Chaos" (1993/94). The practical three-word filter commonly attributed to him: a logo must be **distinctive, memorable, and clear** — reject a concept that fails any one of the three. His deeper point, repeated across his writing: a mark's meaning doesn't come from clever symbolism in a vacuum, it comes from the quality of the thing it stands for, built up through consistent repeated association over time (IBM's mark didn't become trusted because of its stripes — the stripes became trusted because of IBM). Also commonly quoted: "Simplicity is not the goal. It is the by-product of a good idea and modest expectations."

## David Airey's 5-point rubric ("Logo Design Love")
The most widely cited pass/fail checklist in the industry — use it before any client presentation:
- **Simplicity** — simple and legible enough to be instantly recognisable.
- **Memorability** — distinct enough to be recalled after brief exposure.
- **Timelessness** — avoids dated trend elements so it doesn't need a redesign in 3 years.
- **Versatility/scalability** — works at any size and across every medium (print, favicon, embroidery, a single-color stamp).
- **Appropriateness** — fits the target audience and industry context — a children's brand mark is not a law-firm mark.

## Michael Bierut / Pentagram — no numbered framework, but a real pattern worth naming
Bierut's "How to" is a monograph of 40+ case studies, not a rule set — there's no "Bierut Principle" to cite the way there's an Airey checklist. What IS a genuinely useful, nameable pattern from his work: the **generative/flexible identity system** — a logo that is a *set of rules* producing many valid variants, rather than one fixed mark. His MIT Media Lab identity (dozens of generated logo variants from one system) is the reference example to cite when a client needs a flexible identity rather than a single static logo.

## Technical production rules (confirmed as standard industry practice; no single universal number — each brand sets its own)
- **Minimum clear space:** defined as a multiple of an "X" unit taken from the logo's own geometry (often the wordmark's x-height, or a distinct mark element's height) — e.g. "clear space = X on all sides." Every brand guideline defines its own X; there is no universal fixed number across all logos.
- **Minimum reproduction size:** typically a print minimum (commonly around 1 inch / 25–26mm width) and a separate digital minimum (commonly around 70px wide) — again, brand-specific, not universal.
- **Monochrome/reversed/grayscale test:** every logo needs a 100%-black version, a reversed (white-on-dark/knockout) version, and often a single spot-color version, to confirm it holds up without color.
- **Favicon/app-icon scaling test:** render the mark at every real-world size it will actually appear at — 16×16 and 32×32 (favicon), the platform's app-icon safe zone (see below), and 1024×1024 (store listing). If it loses its distinguishing shape or becomes illegible at 16–32px, it needs a simplified mark-only variant for small formats, not just a scaled-down version of the full lockup.
- **Construction grid:** publish the exact geometric construction (often circles/squares keyed to the logo's own proportions) so the mark can be redrawn identically by any third party.

## Platform app-icon specs (verify against the live page before treating as exact — see caveat below)
- **Android adaptive icons (confirmed first-party):** 108×108dp full container; a 66×66dp safe zone centered inside it that's never clipped by any OEM mask shape; foreground logo content between 48×48dp minimum and 66×66dp maximum; the outer 18dp margin on each side is reserved for mask/parallax/pulse effects and must be treated as droppable.
- **Apple app icons (partially verified — the live HIG page is JS-rendered, figures below are secondary-sourced, re-check before citing as exact):** App Store listing 1024×1024px; iPhone home screen 180×180px (60pt@3x) and 120×120px (60pt@2x); iPad Pro 167×167px (83.5pt@2x); iPad 152×152px (76pt@2x); Spotlight/Settings use smaller scaled variants (120/80/58/40/29px). Apple applies the rounded-corner mask itself — design the source icon as a full square, never pre-rounded. A specific "80% safe zone" figure circulates in secondary sources but is not confirmed as Apple's own stated number — don't cite it as a first-party Apple figure.
- **Practical export rule:** design the core mark to sit inside Android's 66dp safe zone and keep roughly the central 60–65% of the canvas clear of critical detail for iOS's auto-masked corners, then actually render and check it at 16px, 32px, 48dp/120px, and 1024px before calling the icon done.

## Color psychology — flag folk wisdom as folk wisdom, not fact
**"Blue means trust, red means urgency" style claims have no peer-reviewed backing for a universal, context-independent mapping.** Academic color-in-context research generally finds color meaning is culturally and contextually dependent — the same color signals different things in different markets and industries. Treat any generic "color X means Y" claim as unverified unless a specific peer-reviewed citation is given.

**The "color increases brand recognition by up to 80%" statistic is very likely a zombie statistic — do not cite it as fact.** It's almost always attributed to "a University of Loyola, Maryland study" that cannot be located in any academic database; no sample size, methodology or publication year accompanies the claim anywhere it's repeated. This is the textbook pattern of a number that spreads because it sounds authoritative, not because anyone can trace it.

**What's more defensible, though still survey-based and not a controlled experiment:** a Reboot consumer survey (n=2,648) found 78% of respondents could recall a logo's primary color versus only 43% who could recall the company's name — a real, if single-study, data point suggesting color recall often beats name recall. That's the claim to use if you need one; not the 80% figure.

## Where to read more (name, do not paste)
"Logo Design Love" (David Airey); "Thoughts on Design," "A Designer's Art," "Design, Form, and Chaos" (Paul Rand); "How to: Use Graphic Design to..." (Michael Bierut / Pentagram) — read for the case studies, not a rule set; developer.android.com/develop/ui/views/launch/icon_design_adaptive (first-party, reliable); developer.apple.com/design/human-interface-guidelines/app-icons (JS-rendered — use a rendering-capable tool before citing exact pixel figures); any real brand style-guide PDF (most organizations publish theirs) as a working example of clear-space and construction-grid conventions in practice.


---

<!-- references/fluid-interaction-reference.md -->

# Web designer: fluid interaction physics (Apple's WWDC design talks)

Distilled from Apple's "Designing Fluid Interfaces" (WWDC 2018), "Designing Audio-Haptic Experiences," "The Details of UI Typography" (WWDC 2020), and "Principles of Great Design." This goes deeper than the general animation-reference.md: these are the exact mechanics that make a web interaction feel like a physical object instead of a slideshow. The through-line: **motion starts from the current on-screen value, inherits the user's velocity, projects momentum forward, and can be grabbed and reversed at any instant.**

## Response — kill latency first (everything else is built on this)
Respond on pointer-DOWN, never on release — highlight the instant it's pressed, not on `click`/touch-up. Feedback must be continuous *during* a drag, slider or drawer, updating 1:1 with the pointer the whole way through, never only animating once the gesture completes. Audit every debounce, timer and transition-wait on the input path; anything non-essential there is a regression.

## Direct manipulation — 1:1 tracking that respects the grab point
When dragging, the element must stay glued to the finger/cursor and respect the **offset from where it was grabbed** — snapping to the element's center on grab breaks the illusion immediately. Use Pointer Events with `setPointerCapture` so tracking continues even when the pointer leaves the element's bounds. Track a short velocity/position history (the last few `pointermove` events, not just the current point) — you need the velocity at release.

## Interruptibility — the single most important principle
"The thought and the gesture happen in parallel": every animation must be grabbable and reversible mid-flight without waiting for it to finish. **Never lock out input during a transition.** Critically: **always animate from the live on-screen (presentation) value, never the logical target value** — on interrupt, read the element's current transform and start the new animation from there, or you get a visible jump. Avoid CSS `transition`/`@keyframes` for anything gesture-driven — they can't be smoothly grabbed and reversed. A spring that carries velocity through a re-target avoids a "brick wall" velocity discontinuity when a gesture reverses (this is what iOS's additive animations do natively — on the web, pick a spring library that re-targets from current velocity, not a fresh one). Decompose 2D motion into independent X and Y springs — a single spring on a 2D distance desyncs when the two axes have different velocities.

## Springs over fixed-duration animation
A pre-scripted animation can't respond to new input; a spring can — new input just changes the target, motion stays continuous. Apple deliberately uses two designer-friendly parameters instead of raw physics (mass/stiffness/damping):
- **Damping ratio:** `1.0` = critically damped, no bounce, smooth settle. `<1.0` = overshoots and oscillates; lower is bouncier.
- **Response:** how quickly the value reaches the target, in seconds — not a fixed "duration," since a spring's settle time emerges from the parameters.

**Default most UI to damping `1.0` (critically damped)** — graceful, non-distracting. **Add bounce (damping ~`0.8`) only when the gesture itself carried momentum** (a flick, a throw, a drag release). Overshoot on a menu that just faded in feels wrong; overshoot on a card you flicked feels right. Apple's shipped values: move/reposition (e.g. picture-in-picture) = damping 1.0, response 0.4; rotation = damping 0.8, response 0.4; drawer/sheet = damping 0.8, response 0.3. In Motion/Framer Motion, the `bounce` + `duration` spring API maps closely — house default `bounce: 0`, reserve bounce for momentum-driven interactions.

## Velocity handoff — the seam between drag and animation
When a gesture ends, the animation must continue at the exact release velocity, so there's no visible seam between dragging and animating. Some spring APIs want *relative* velocity, normalized by the remaining distance: `relativeVelocity = gestureVelocity / (targetValue − currentValue)`. Example: element at y=50, target y=150 (100px to go), finger moving 50px/s → initial spring velocity = 50/100 = 0.5. Motion/Framer Motion take absolute px/s velocity directly via the `velocity` option.

## Momentum projection — animate to where the gesture is *going*, not where it stopped
Don't snap to the nearest boundary from the release point — project the resting position using velocity (exactly like scroll deceleration), then snap to the target nearest that projected point. This is what makes a flick feel like it throws the element. Apple's exact projection function (from the WWDC sample code — note this is NOT the physics-textbook `v²/(2·decel)` form):
```
function project(initialVelocity, decelerationRate = 0.998) {
  return (initialVelocity / 1000) * decelerationRate / (1 - decelerationRate);
}
projectedEndpoint = currentPosition + project(releaseVelocity);
target = nearestSnapPoint(projectedEndpoint);
animateSpringTo(target, { velocity: releaseVelocity }); // then hand off velocity
```
`decelerationRate ≈ 0.998` for normal scroll feel, `0.99` for snappier. This is the standard behavior behind good bottom-sheets and carousels (Vaul, Embla).

## Spatial consistency — symmetric paths, anchored origins
Enter and exit along the same path — a panel that slides in from the right must dismiss to the right; in-from-right/out-the-bottom feels disconnected. Anchor a menu, popover or sheet's `transform-origin` to the element that triggered it, not to its own center, so the spatial relationship is obvious. Mirror the easing curve on reversible transitions (inverse cubic-bezier control points for the two directions) so the outbound path matches the return path.

## Hint at the destination; use soft boundaries
Intermediate motion should telegraph where things are going, not just interpolate blindly — make in-between frames point at the outcome. At an edge, resist progressively instead of stopping hard — a hard stop reads as frozen, continuous resistance reads as responsive. Apple's rubber-band formula: `rubberband(overshoot, dimension, constant=0.55) = (overshoot * dimension * constant) / (dimension + constant * |overshoot|)` — the further past the boundary, the less the element follows.

## Gesture design details
Tap: highlight on touch-down (instant), commit on touch-up, with ~10px hysteresis/hit padding and a cancel-by-dragging-away path. Drag/swipe: require a small movement threshold (~10px) before committing to a direction, then track 1:1. Detect all plausible gestures in parallel from the first move, then cancel the losers once intent is clear — avoid recognizers that only report a final state (generic `swipeleft`-type events), since they throw away the continuous tracking needed for feedback. Minimize disambiguation delays (double-tap detection unavoidably delays single-tap response — only pay that cost where double-tap genuinely exists).

## Frame-level smoothness
Keep per-frame positional change below the perception threshold to avoid strobing. For very fast motion, a subtle motion blur/stretch encodes speed better than a hard sharp streak. Use `requestAnimationFrame` (the web's display-synced clock) and animate only compositor-friendly properties — `transform` and `opacity` — hinting `will-change` only where motion is imminent, never globally.

## Materials and depth — translucency as hierarchy, not decoration
Build nav/toolbars/sheets as translucent layers (`backdrop-filter: blur()` + semi-transparent background) with content scrolling underneath, not opaque bars consuming a fixed strip. Material weight encodes hierarchy: darker/heavier materials separate structural regions (sidebars), lighter materials draw attention to interactive elements — **never stack a light translucent surface on another**, legibility collapses. Bigger surfaces should read as thicker (stronger blur + deeper shadow than small chips). Dim-to-focus for a modal task (scrim + push background back); separate-to-keep-flow for a parallel non-blocking panel (translucency + offset, no scrim). Vibrancy keeps text legible over changing backgrounds — use higher contrast, slightly heavier weight and a small letter-spacing bump over blurred surfaces, never flat gray text; put color on a solid layer, not the translucent foreground. Prefer a scroll edge fade/blur mask over a hard 1px divider where floating chrome overlaps content. Animate blur radius and scale together on enter/exit so a glass surface reads as materializing, not just fading.

## Multimodal feedback (motion + sound + haptics) — three rules
**Causality:** trigger feedback on the actual causal event, matched to the action's physicality. **Harmony:** visual, sound and haptic must fire on the same frame — any latency between them destroys the illusion; don't let a CSS transition lag behind an audio/haptic trigger. **Utility:** add feedback only where it earns its place — reserve it for meaningful moments (success, error, commit, snap); over-feedback trains users to ignore all of it.

## Reduced motion is a gentler equivalent, not silence
Respond to three independent signals: `prefers-reduced-motion: reduce` → replace slides/springs/parallax with short opacity cross-fades, drop elastic/overshoot, keep comprehension-aiding opacity/color changes. `prefers-reduced-transparency: reduce` → raise background opacity and drop blur on translucent surfaces. `prefers-contrast: more` → near-solid backgrounds with a defined contrasting border. Also avoid full-viewport moving backgrounds, slow looping oscillations near 0.2Hz (one cycle per 5s), and abrupt brightness jumps on theme change — ease dark/light transitions, and fade large repositioning objects out and back in rather than letting them streak across the whole viewport.

## Typography: optical sizing, tracking, leading (size-specific, never fixed)
Tracking (letter-spacing) is size-specific — large display text wants negative tracking (letters read too far apart as they grow), small text wants slightly positive tracking for legibility; a single fixed `letter-spacing` value is wrong somewhere in the scale. Leading (line-height) tracks size inversely — tight on large headings, looser on body copy. Build hierarchy from weight + size + leading together, not size alone; weight adds presence without taking more space. Respect the user's text-size setting (Dynamic Type equivalent): scale layout with the text using `rem`/`em`, not fixed px. Default to the platform's system font before a custom face — it already ships optical-sizing, tracking tables and legibility tuning; override only with a reason.

## Apple's eight design principles (the vocabulary to reason with, not just motion craft)
**Purpose** (decide what not to build — every feature spends the user's time/attention/trust). **Agency** (keep people in control, back it with forgiveness — easy undo for slips, a confirmation dialog only for genuinely destructive irreversible actions, used sparingly or it trains click-through). **Responsibility** (privacy asked for at the right moment and transparently; anticipate AI misuse — an allergy-aware recipe app must never suggest a harmful ingredient). **Familiarity** (build on known metaphors that aren't too literal or abstract; consistency means things that look the same behave the same and live in the same place; only break a familiar pattern with proof, not assumption). **Flexibility** (adapt to platform and context; design inclusively; let people personalize when no single layout fits everyone). **Simplicity, not minimalism** (strip the unnecessary so purpose shines; be concise and clear with real hierarchy; sometimes *adding* context simplifies — a scrubber showing time remaining; show the common path first, advanced options one level deeper). **Craft** (every spacing/timing/alignment value is a deliberate, defensible choice — jittery scroll and misaligned icons read as carelessness). **Delight** (the result of the other seven done right, not confetti tacked on top).

## Process
Prototype interactively — an interactive demo discovers the interface in a way static mockups can't, and sets a concrete bar that prevents a mediocre final build. Design interaction and visuals together, not motion as a layer added after the pixels. Review motion in slow motion or frame-by-frame — problems invisible at full speed show up immediately.

## Quick reference
| Need | Value |
|---|---|
| Default UI spring | damping 1.0 (critically damped), response 0.3-0.4 |
| Momentum/flick spring | damping ~0.8, response 0.3-0.4 |
| Velocity handoff (normalized) | `gestureVelocity / (target - current)` |
| Flick landing point | `current + (v/1000)·d/(1-d)`, d ≈ 0.998 |
| Interrupt cleanly | start from the live on-screen value, never the target |
| Reversible transition | mirror the easing curve (inverse cubic-bezier) |
| 1:1 drag | Pointer Events + `setPointerCapture`, respect the grab offset |
| Boundary | rubber-band, never hard-stop |
| Oscillation to avoid | near 0.2Hz |

## Where to read more (name, do not paste)
"Designing Fluid Interfaces" (WWDC 2018) and "Designing Audio-Haptic Experiences" (WWDC) — Apple's own developer videos, the primary source for everything above; "The Details of UI Typography" (WWDC 2020); "Principles of Great Design" (WWDC 2026, for the eight-principle framework); Motion/Framer Motion's spring documentation for implementing damping/response on the web; Vaul and Embla's source for a working implementation of momentum projection and snap points.


---

<!-- references/anti-slop-checklist-reference.md -->

# Web designer: the anti-slop production checklist

Distilled from the house design skills already running on this machine (ui-ux-pro-max, taste-skill, make-interfaces-feel-better, frontend-design-direction) — these are the concrete, mechanical checks that separate a build that looks deliberately designed from one that reads as AI-templated. Use this as a pre-delivery gate, not inspiration reading.

## The dial system — set a direction before writing any code
Before generating anything, infer and state one line: *"Reading this as: [page kind] for [audience], with a [vibe] language, leaning toward [design system or aesthetic family]."* Then set three dials (1-10): **Variance** (1=perfect symmetry, 10=artsy chaos), **Motion** (1=static, 10=cinematic/physics), **Density** (1=art-gallery airy, 10=cockpit/dashboard packed). A SaaS dashboard wants low variance/motion, high density. A premium consumer landing page wants high variance/motion, low density. If the brief is genuinely ambiguous, ask exactly one clarifying question — never a multi-question dump; if you can confidently infer, don't ask.

## The decisiveness floor — checked against a real, unremarkable, small-business site that still clears it (2026-10-23)
"Generic" and "no contrast" are usually not a missing-technique problem — they're what happens when a build hedges instead of commits. `elevatefitnessgym.in` (a real small-business gym site, reverse-engineered via devtools: Barlow Condensed + Montserrat, 1 CSS file, zero canvas/WebGL, 5 sections) proves the floor for "not generic" doesn't require fancy tech: it's **one confident accent color used everywhere it matters and nowhere it doesn't** (a single gold, not a muted multi-tone palette), **display type at a size and weight that commits** (a bold condensed uppercase headline filling real width, not a timid `text-4xl` default), and **one real, specific environmental photograph doing the work** (actual gym interior with a red-carpet leading line pulling the eye into depth — not a stock photo that could be any gym). None of that needs three.js or GSAP. A build that still comes out generic after reading every color/type/motion reference in this knowledge base is very likely **hedging at the value-picking step, not missing information** — picking a washed-out safe accent instead of the one the palette math actually produced, or shipping the default type scale instead of the clamp() values the brief called for.
**Make this a measurable gate, not an intention.** Before calling a build done: state the ONE accent hex value and grep the rendered CSS for it — if it appears fewer than ~3 times across distinct components, the "one confident accent" wasn't actually built, it was only decided. Compare `docs/design/DESIGN.md`'s declared palette/type tokens against `scripts/style-signals.mjs`'s actual signal count in the shipped source, the same way the style-fidelity tester already does for a named style — a declared accent color that isn't measurably dominant in the output is a redo, same severity as a declared style that wasn't built.

## Reach for a real design system when the brief names one
Microsoft/enterprise → Fluent UI. Google/Material-flavored → Material Web + M3 tokens. IBM-style B2B → Carbon. Shopify admin → Polaris. Atlassian-style → Atlaskit. GitHub-style devtool → Primer. UK public-sector → GOV.UK Frontend. US public-sector → USWDS. A fast local-business MVP → Bootstrap. A modern SaaS you want to own the components for → shadcn/ui, never shipped in its default unthemed state. **One system per project** — never mix Fluent components with Carbon, never import shadcn into a Material 3 app. When the brief is an aesthetic rather than a system (glassmorphism, bento, brutalism, editorial), build with native CSS/Tailwind and say in a code comment what's borrowed inspiration versus official material — there is no official "liquid-glass.css," web approximations of Apple's Liquid Glass are approximations, label them as such.

## The hard-banned AI tells (fail the build if present)
- **Zero em-dashes, anywhere visible** — headlines, eyebrows, pills, body, quotes, attribution, captions, buttons, alt text. Not "sparingly." Zero. Use a period, comma, colon, or regular hyphen instead.
- **No eyebrow on every section.** An eyebrow (small uppercase tracked label above a headline) on every single section is the single most-violated AI tell. Cap at 1 eyebrow per 3 sections; if section A has one, the next 2 can't.
- **No section-number labels** (`00/INDEX`, `001 · Capabilities`, `Stage 1/2/3`, `Phase 01/02/03`). Name the topic in plain language instead of enumerating it.
- **No version/status labels in the hero** (`V0.6`, `BETA`, `EARLY ACCESS`) unless the brief is explicitly about a launch.
- **No div-based fake product screenshots** (fake task lists, fake terminals, fake dashboards built from styled `<div>`s) — the single most common LLM-design tell. Use a real screenshot, a generated image, a real component preview, or skip the preview.
- **No "Jane Doe" content:** generic names (John Doe, Sarah Chan), generic egg/user-icon avatars, startup-slop brand names (Acme, Nexus, SmartFlow), fake-perfect numbers (`99.99%`, round thousands) — use organic, specific-looking data instead (`47.2%`, a real-looking phone format).
- **No filler verbs:** "elevate," "seamless," "unleash," "revolutionize," "next-gen." Use concrete verbs.
- **No decorative colored status dots** on every nav item/badge/list row — reserve a dot for genuine semantic state (a real live indicator), used sparingly.
- **No "Quietly trusted by" / "Field notes" / performative-craftsman labels.** Use plain functional labels ("Testimonials," "Latest writing") or skip the label.
- **No locale/time/weather strips** ("Lisbon 14:23 · 18°C") unless the brand is genuinely a distributed studio or travel product.
- **No "Scroll to explore" cues.** If the user hasn't scrolled, they're looking at the hero — they know what scrolling is.
- **No pure black (`#000000`)** — off-black/zinc-950/charcoal. No neon outer glows. No oversaturated accents — desaturate to blend with neutrals.
- **Banned default fonts:** Inter, Roboto, Arial, Open Sans, Helvetica as a reflexive default (Inter is fine when the brief explicitly wants neutral/standard/Linear-style, or for public-sector/accessibility-first sites). **Serif is discouraged as default** — "feels creative/premium" is not a reason; use serif only when the brief literally names one or the aesthetic is genuinely editorial/luxury/heritage and you can say why. The two most AI-tell serifs to never default to: Fraunces and Instrument Serif.
- **No 3-equal-column feature-card rows** as the default section shape — use a 2-column zigzag, asymmetric grid, or scroll-pinned layout instead. Cap zigzag (alternating image-left/text-right then reversed) at 2 sections in a row; a 3rd consecutive one is a fail.

## Hero discipline (the section most likely to be wrong)
Must fit in the initial viewport: headline max 2 lines desktop, subtext max 20 words and 3-4 lines, CTAs visible without scrolling. Max 4 text elements total: one eyebrow OR brand strip (pick zero or one), the headline, the subtext, and 1 primary + max 1 secondary CTA — no tiny tagline below the CTAs, no trust micro-strip, no pricing teaser, no feature bullets in the hero itself; all of those move to a dedicated section directly below. A "Trusted by" logo wall belongs under the hero, never crammed into it. Plan font size and asset size together — a long headline doesn't start at `text-7xl`. Hero top padding caps around `pt-24` at desktop; more than that reads as a layout bug, not intentional space.

## CTA and button rules
One label per intent across the whole page — "Get in touch," "Contact us," and "Let's talk" on the same page is a fail; pick one. CTA text must fit on one line at desktop (3 words max, ideally 1-2) — a wrapped button is broken, fix the label or widen the button, never shrink it. Verify text contrast against the button background before shipping (white-on-white, transparent-over-photo-with-no-scrim are banned). No duplicate CTA intent anywhere on one page.

## Layout mechanics worth checking every time
Never `h-screen` for a full-height hero — use `min-h-[100dvh]` to avoid iOS Safari's address-bar jump. Grid over flexbox percentage math for multi-column layouts. A bento grid has exactly as many cells as there is content — no empty filler tile. Once a layout family (3-column cards, full-width quote, split text-image) is used for one section, it shouldn't repeat identically elsewhere on the same page — an 8-section landing page needs at least 4 different layout families. A split-header pattern (giant headline left, small explainer paragraph floating in the top-right) is banned by default — stack headline and body vertically instead unless the right column genuinely carries a visual element. **Watch for selector-specificity collisions silently cancelling spacing** (checked against Anthropic's own `frontend-design` skill, 2026-10-23) — a type selector (`.section { padding-block: 4rem }`) and an element- or utility-based selector on the same element (`.cta { padding-block: 0 }`) resolve by specificity and source order, not by which one "looks more specific" in the authored intent; this is the single most common reason a spacing value in the design tokens doesn't actually appear in the rendered page. When a spacing/padding/margin value looks right in the CSS file but wrong on screen, check computed styles for which rule actually won before assuming the token is wrong.

## Concentric radius and optical alignment (the detail-level polish pass)
For nested rounded surfaces: `outer radius = inner radius + padding`, so curves read as concentric rather than fighting each other. Geometric centering isn't always visual centering — icon buttons, play triangles, arrows and asymmetric icons often need a small manual offset; fix the SVG itself when possible. Pick ONE corner-radius scale for the whole page (all-sharp, all-soft-12-16px, or all-pill-for-interactive) and apply it everywhere, unless there's a documented per-component rule that's followed consistently.

## Motion rules that compound
`transition: all` is banned — specify the exact properties changing. Animate only `transform`, `opacity`, and `filter`; never `width`/`height`/`top`/`left` (forces layout, kills mobile frame rate). Enter animations combine opacity + a small `translateY` (+ optionally blur); exit is shorter and quieter than enter (~150ms, roughly 60-70% of the enter duration). Icon swaps cross-fade (opacity+scale+blur) rather than instantly toggling visibility. Every animation needs a one-sentence justification — hierarchy, storytelling, feedback, or state transition; "it looked cool" means drop it. Use `IntersectionObserver`/`whileInView` for scroll-reveal, never a raw `scroll` event listener (causes continuous reflows, kills mobile performance). Max one marquee per page.

## Text and numbers (the fit-and-finish layer)
`text-wrap: balance` on headings, `text-wrap: pretty` on body/captions, neither on long prose or code. `font-variant-numeric: tabular-nums` on any counter, timer, price or table column so digits don't shift the layout as they change. A testimonial quote caps at 3 lines of body — cut the original if it's longer; attribution is name + role (+ company), never a name alone.

## Hit areas and interaction states
Interactive controls need at least a 40×40px hit area, ideally 44×44px — expand with a pseudo-element when the visible icon is smaller, without letting expanded hit areas overlap each other. Tactile press feedback (`scale(0.96)`-ish) on buttons, with an escape hatch to disable it when it would distract. Images want a subtle 1px inset outline (neutral black/white alpha, never brand-tinted) so edges don't blur into the background surface.

## Theme and color locks
The page has one theme — if it's dark, every section is dark; no light "warm paper" section sandwiched between dark ones (the one exception: a deliberate, singular theme-switch-on-scroll device, used once). Once an accent color is picked for a page, it's used everywhere — no blue CTA appearing in section 7 of an otherwise warm-grey site. Max one accent color, saturation under 80% by default, unless the brand brief explicitly asks for something louder.

## Images and assets
A text-only page with no imagery is not minimalism — it's incomplete. Even a restrained editorial site needs 2-3 real images. Priority order: an actual image-generation tool first, real stock/brand URLs second, a live rendered centerpiece third, and only as a last resort a clearly-labeled placeholder with a note to the user about what's missing — never a hand-rolled `<div>`-based fake screenshot or fake dashboard. A "Trusted by" logo wall uses real SVG brand logos (Simple Icons, devicon), not styled text spans, and never prints a category label under each logo.

**Vet a stock-photo set for cohesion BEFORE placing it, not after the user flags it (operator, 2026-10-18).** When sourcing 4+ product/grid photos from mixed stock sources, check background type (seamless studio vs. real environment), light temperature (warm/cool), and background color/brightness across the whole set before writing any card markup. A set that mixes seamless-studio shots with real-background stock photos cannot use `object-fit: contain` + padding + drop-shadow (see image-rules.md's "sticker cutout" section) — it must use full-bleed `cover`, and if light temperature clearly clashes (one near-black, one blown-white), plan the per-card colour-wash overlay as part of the FIRST build, not a correction round after the fact.

**When neither an image tool nor real stock is reachable (no internet in the build environment, licence unclear), the third option is not a placeholder — it's a live rendered centerpiece.** Build the product's own motif as a real three.js or canvas scene (real geometry and materials, not a flat div), tied to scroll so it rotates, fills or reveals as the visitor scrolls (see web-director.md's "no real photography available" rule). A page with zero living or moving element — cards, text and icons only, nothing rendered or photographed — fails the pre-flight check below outright, same severity as a div-based fake screenshot.

## Detail states (loading, empty, 404) — where AI builds visibly cut corners first
A site that never shows these states hasn't actually been designed, just happy-pathed. Each needs its own real pass, not a generic spinner bolted on afterward:
- **Loading/skeleton:** a skeleton screen matching the real layout's shape (card outlines, text-line bars at the real line-height), not a centered spinner on a blank page. Shimmer sweep: `background: linear-gradient(100deg, transparent 30%, rgba(255,255,255,.06) 50%, transparent 70%)` animated across the element with `animation-duration` around 1.5s, `linear`, infinite. Freeze to a static mid-tone fill (no animation) under `prefers-reduced-motion: reduce` — a moving shimmer is exactly the kind of motion that rule exists to stop.
- **Empty state:** a short sentence naming what's missing and the one action that fills it ("No projects yet — create your first one"), never a bare icon with no copy, and never the loading skeleton left on screen with no data arriving.
- **404 / not-found:** matches the site's own voice and visual system (same type, same spacing scale, same one accent color) — never the framework's unstyled default page. One line naming what happened, one link back (home or the nearest working parent page), no generic "Oops!" filler copy.
- **Page/route transition:** decide once whether navigation feels instant (no transition, content swaps) or cinematic (a brief shared-element or fade/wipe via the View Transitions API) — pick one and apply it everywhere; a site that transitions on some links and snaps instantly on others reads as unfinished, same severity as inconsistent content treatment above.
Add "designed loading, empty and 404 states exist and match the site's visual system" to the mechanical pre-flight check below — a build with only the happy path fails this line even if every other check passes.

## The redesign-specific rule (don't skip the audit) — and the refinement-vs-redesign fork that comes before it
**Decide which of two modes this is before touching anything** (checked against a production design skill's own framing, 2026-10-23): **refinement** keeps the incumbent identity, behavior, copy and everything outside scope, and improves it in place — typography, spacing and color recalibration, not a new visual world. **Redesign** treats the old look as evidence and an anti-reference, not a starting point — it keeps the product truth (what it does, its real content, its constraints) but replaces the visual world and the declared style/token file wholesale. **Never split the difference**: a build that keeps half the old palette "just in case" while bolting on new type and new motion lands exactly on the generic, uncommitted middle the decisiveness-floor section above warns about — pick one mode, say which one out loud in the BRIEF, and commit to it fully. A missing or absent `docs/design/DESIGN.md` is not by itself proof the project is greenfield — read the actual shipped CSS/components as the incumbent world before deciding preserve, expand, or replace.
Before touching an existing site under either mode, audit and document: brand tokens (colors, type, radii), information architecture, which content blocks are doing real work versus filler, and what patterns to preserve versus retire. Never silently change URL slugs, primary nav labels, form field names (breaks analytics and autofill), or the logo without explicit approval.

## Two more from a coding agent release review (operator, 2026-10-18)
- **A fixed/sticky nav always needs its own opaque or blurred background, never transparent-by-default.** One built this session had no nav background at all; it looked fine over the dark hero photo and then became illegible the moment any section heading scrolled to the top of the viewport underneath it, mid-page. A fixed nav sits over EVERYTHING that will ever scroll past it, not just the first screen it was designed against — test it scrolled to at least 3 different points, not just at rest.
- **After ANY bulk find-and-replace across a file (renaming a font, a class, a variable), re-check the console before trusting a visual screenshot.** A plain-text rename of a font family name (`Inter` → a new font) also matched the substring inside `setInterval`/`clearInterval` in the same file's `<script>` block, corrupting them into invalid identifiers and throwing an uncaught `SyntaxError` that killed every script on the page — scroll pin, the signature motif, the FAQ accordion, the signup handler, all silently dead. The visual screenshot taken right after looked fine because CSS still loaded; only a console check or an actual interaction (click the FAQ, confirm the motif moves) caught it. A full-page screenshot proves CSS painted; it proves nothing about whether JS is still alive. Treat any bulk rename as a reason to re-run the FULL self-QA loop above (console + a real interaction), not just a glance at the result.

## The mechanical pre-flight check (run every box before calling it done)
Zero em-dashes anywhere. Eyebrow count ≤ ceil(section count / 3). No wrapped CTA text at desktop. No duplicate CTA intent. Button text passes contrast against its background. Form inputs/placeholders/errors pass WCAG AA contrast. Hero fits the initial viewport with ≤4 text elements. No 3-in-a-row identical layout family. No div-based fake screenshots. Mobile collapse declared explicitly per multi-column section. Dark/light theme is locked, not mixed mid-scroll. **One living or moving signature centerpiece exists** (a real photo, a real video, or a live three.js/canvas scene tied to scroll) — a page with only static cards, text and icons fails this check. Designed loading, empty and 404 states exist and match the site's visual system — a build with only the happy path fails this line even if every other check passes.

## Self-QA loop before reporting "done" (operator, 2026-10-18 — "the skills aren't ready, this needs too much hand-holding")
The fitness-brand demo took 6+ correction rounds for problems ("cutout" cards, a pasted-looking color block, mismatched stock photos) that were all visible in a single full-page screenshot — the builder had reported "verified working, no console errors" without actually looking at the rendered page against this checklist. A clean console is necessary, not sufficient. Before telling the user a visual build is done, or before moving to the next BUILD ORDER:
1. **Take a real screenshot of every section** (full-page plus the live viewport scrolled to any pinned/animated section — a full-page capture can show a pinned section as a false blank gap, so confirm those separately) — never report "looks good" from reading source code alone.
2. **Run the screenshot against this file's banned-tells list and the image-rules.md "sticker cutout" section as if you were a hostile reviewer**, not the author: would a stranger call any card, block or image "pasted," "cut out," or "assembled from different shoots"? If a reference site was named (e.g. "make it like shopbala.com"), open it too and diff structure-by-structure (card treatment, background bleed, type scale) rather than asserting a match from memory.
3. **If a correction is a tuning value (brightness, opacity, filter strength), re-screenshot BOTH the extreme that prompted the fix and the opposite extreme in the same set** before calling it fixed — a value tuned on one case can blow out or under-correct the other (confirmed: a brightness fix tuned on the darkest card in a 6-photo grid washed out the two brightest cards until caught).
4. **Only after that self-review passes** report the result, and lead with what you checked, not just what you changed — "checked all 6 cards, hero, and FAQ at desktop + 375px; here's the screenshot" is the bar, not "should be fixed now."
5. If the devtools/screenshot tool is genuinely unavailable (not just a stale lock — see web-director.md), say so explicitly and name it as an unverified claim rather than reporting success.
6. **Check content-treatment consistency across sections, not just each section alone (operator, 2026-10-18 — "the end image is shit").** A coffee-site close section shipped as a bare CSS-drawn icon (a hand-coded outline-and-gradient "cup" shape) floating in empty space, while every other section on the same page used a real photograph — each section passed its OWN review in isolation, but the inconsistency itself was the defect, and it took the operator pointing at the screenshot to catch it. Before reporting done: scan the full-page screenshot section by section and ask "does every section use the SAME kind of content (real photo vs. drawn icon vs. live render) as the others, or does one suddenly downgrade to a placeholder-grade treatment?" A site that is real-photography-led everywhere else cannot have one section fall back to an abstract CSS shape standing in for a real thing — treat that exact mismatch as a blocking finding, same severity as a missing signature centerpiece.

## Ship checklist: the metadata that only shows up off the page itself (operator, 2026-10-23: "add whatever you need to in my skill")
A site can pass every check above and still be invisible or wrong everywhere it's *shared* or *indexed*, because none of this lives in the rendered page a screenshot would catch — it has to be a named BUILD ORDER of its own, not an assumption. Before a build counts as shippable:
- **Favicon set, not just a logo file dropped in root.** `favicon.ico` (legacy fallback), a 32×32 and 16×16 PNG, an `apple-touch-icon.png` (180×180), and for a PWA-capable build a 192×192 and 512×512 icon plus `manifest.json` referencing them. Test at actual browser-tab size (16-32px) — a detailed logo often needs the simplified mark-only variant from `brand-identity-reference.md`'s favicon-scaling test, not a shrunk full lockup.
- **A real `og:image`, not a missing one that falls back to a random screenshot or nothing.** 1200×630px (the universal safe size across Facebook/LinkedIn/Slack/Discord previews), under ~1MB, with `og:title`, `og:description`, `og:url`, `og:type` and the Twitter-card equivalents (`twitter:card` = `summary_large_image`, `twitter:image`) all set per-page, not just once globally for the homepage then silently reused (wrong) on every inner page. Verify by actually pasting the live URL into a link-unfurling test (a Slack DM to yourself, or a social-preview debugger), not by reading the meta tags and assuming they render correctly.
- **`sitemap.xml` and `robots.txt`, both actually reachable at their root URLs**, not just present in the repo — `/sitemap.xml` returns valid XML listing real pages (auto-generated from routes, not hand-maintained and stale), `/robots.txt` references the sitemap and doesn't accidentally `Disallow: /` a production build (a staging-config leftover blocking the live site from being indexed is a real, recurring, easy-to-miss failure mode).
- **Canonical URL tag on every page** (`<link rel="canonical">`), especially one with both a `www` and non-`www` or a trailing-slash/no-trailing-slash variant reachable — without it, search engines can split ranking signal across duplicate URLs for the same page.
This is a named line item at the END checkpoint, same severity class as the mechanical pre-flight check above — "the site looks right in a screenshot" and "the site is ready to actually ship and be shared" are different claims, and a build order that covers only the first one is incomplete.

## Where to read more (name, do not paste)
The installed skills these rules were distilled from — `ui-ux-pro-max` (searchable style/color/typography/chart database with 67 styles and 161 palettes), `taste-skill` (the full AI-tells list and block-library vocabulary), `make-interfaces-feel-better` (concentric radius, optical alignment, transition scoping), `frontend-design-direction` — read the live skill files for the full depth and any newer additions, rather than treating this distillation as the ceiling.


---

<!-- references/ui-libraries-and-mascots-reference.md -->

# Web designer: component libraries, page mascots, and cursor-following motion

Checked against primary sources (project sites, GitHub, docs, tutorials) 2026-10-06, deepened with direct GitHub-repo and brand-page fetches 2026-10-06. These are sources to copy/adapt technique from, not brands to imitate visually — port the construction, never the exact look (see `brand-identity-reference.md`'s "no copying" rule and `anti-slop-checklist-reference.md`).

## Component libraries worth pulling technique from

All five below are **copy-the-source-into-your-project** libraries (shadcn-style), not npm runtime dependencies — this matters: it means the component's CSS/animation code lands directly in the codebase where it can be read, trimmed and restyled, instead of being a black-box import. Prefer this model when a build needs one of these effects.

| Library | What it actually is | Stack | Install model | Pull from it for |
|---|---|---|---|---|
| **VengeanceUI** (Ashutoshx7, github.com/Ashutoshx7/VengeanceUI) | Animated landing-page component set: hero sections, nav bars, feature/testimonial blocks, portfolio sections | React, TypeScript, Tailwind, Framer Motion, Next.js, Vite | copy-paste source | Full landing-page section scaffolding with motion already wired in — a faster starting point than building a hero section's entrance animation from scratch |
| **Animate UI** (animate-ui.com, imskyleen) | Open-source animated component distribution built *on top of* Radix UI, Base UI and Headless UI primitives, plus its own motion layer | React, TypeScript, Tailwind, Motion (Framer Motion's successor), Radix/Base/Headless UI | `shadcn` CLI (`npx shadcn add <url>`) | A `Cursor` component (see below), a library of **Backgrounds** (Bubble, Fireworks, Gradient, Gravity Stars, Hexagon, Hole, Stars), button micro-interactions (Flip, Liquid, Ripple, Theme Toggler), and a **Radial Menu/Nav/Intro** family for circular, non-grid navigation |
| **Uiverse.io** (uiverse.io) | The largest community CSS/Tailwind snippet library — not a cohesive design system, pure copy-paste single-component CSS | Plain CSS and Tailwind, MIT-licensed, community-submitted | copy raw CSS/HTML directly | Volume and variety of **micro-component** treatments: ~1,200 buttons, ~720 cards, ~720 loaders, 260 toggle-switches, 226 inputs, 180 forms, 171 checkboxes, 103 patterns, 102 radio-buttons, 62 tooltips, 23 notifications. Quality is uneven (community-submitted) — treat as a sketchbook of CSS techniques to study and rebuild cleanly, not a trusted drop-in source |
| **ForgeUI / FORGE.labs** (AmanShakya0018, confirmed via direct repo fetch: github.com/AmanShakya0018/forgeui, forgeui.in — 209 stars, 18 forks, 231 commits; separate from Tyler Forge and Refinitiv/LSEG Forge, unrelated enterprise design systems of the same name) | Animation-first React component library: animated forms, OTP inputs, shimmer text, motion-enhanced cards. Explicitly a solo maintainer's "personal lab," not a community project — expect slow issue turnaround, no roadmap commitment | Next.js, TypeScript, Tailwind, shadcn/ui, Framer Motion | copy from forgeui.in's live previews | **License caveat (confirmed, overrides the prior session's "UNVERIFIED" note): ForgeUI ships under a custom restrictive license — usable/modifiable for personal or commercial projects, but redistribution, resale, or claiming its components as your own work is explicitly forbidden.** Fine for studying technique or prototyping; do **not** copy its component files verbatim into a codebase that gets delivered to a client as their own product — that is the one library in this table that isn't MIT, and the only one where "copy-paste the source in" needs a license check first |
| **Uilora** (uilora.com) | 700+ component premium/freemium library spanning web + React Native, including WebGL-based sliders/effects, 3D hover components, and dedicated "cursor and micro-interaction" components | Next.js, React, TypeScript, Tailwind, Framer Motion, Radix, shadcn/ui (web); React Native, Expo, Reanimated (mobile) | `npx uilora@latest add [component-name]` | The explicit **cursor-and-micro-interaction** and **3D/WebGL hover** categories are the most directly relevant to mascot/cursor-follower work — study the installed source for its pointer-tracking math before reusing it. Its own pricing-tier names ("Crazy Components," "Ultimate") are vendor marketing copy, unverified independently — confirm current tiers on uilora.com before quoting them to a client |
| **Cuberto `mouse-follower`** (github.com/Cuberto/mouse-follower, npm `mouse-follower`) | Not a shadcn-style kit — a real, long-established npm/CDN **cursor-replacement library**, the most-cited vanilla option for this effect | Vanilla JS, GSAP (peer dependency) | `npm install gsap mouse-follower`, then `MouseFollower.registerGSAP(gsap)` | Cursor skewing on fast movement, swapping the cursor for text/icon/image/video depending on what's under the pointer, a **CSS-class-driven state system** (different hovered elements → different cursor states), and a **sticky/magnetic** mode that snaps the cursor to a fixed target. Default easing `expo.out`. Its own docs warn against attaching state-detection to deep/complex CSS selectors (event-delegation cost) — scope state selectors narrowly. Ships with zero accessibility affordances; reduced-motion and touch fallback are the implementer's job, same as the manual techniques below |

**"UI Lora" clarification:** no design-adjacent tool by that exact name was found. Two real things share the string: (1) **Uilora** (uilora.com) above — a legitimate component library, likely what was meant; (2) **LoRA** (Low-Rank Adaptation) — an unrelated Stable-Diffusion fine-tuning technique for image generation, not a UI library. Don't conflate them in advice to the team.

**Why copy-paste-source beats npm-install for this category:** every one of these libraries (except Uiverse, which is copy-paste by nature, and `mouse-follower`, a genuine runtime dependency) could ship as an npm package but deliberately doesn't — Animate UI, Uilora and ForGE.labs all use a CLI-that-writes-local-files model. The reason stated across their docs is consistent: full control, no version lock-in, and the component is "owned code like any other file in your codebase" — meaning it can be trimmed, re-themed and have unused variants deleted rather than carried as dead weight in a bundle. When recommending one of these to a build, recommend the specific component file, not the whole library as a dependency.

**Uiverse also has an MCP server** (confirmed, exposed by third parties against its public component catalogue) — an MCP-connected agent can search/pull any of its 3,800+ components live ("ask for a 'glass card' or 'neon button', get HTML+CSS back") instead of relying on this file's static category counts. Worth adding to the project's MCP config if live component lookup during a build becomes a recurring need; not configured in this project today.

## Page mascots — when they help and the mechanics that make them work

**Evidence for using one:** mascots measurably raise brand recall (cited figure: 37% higher recall vs. no mascot) and, combined with the rest of a gamified system, correlate with higher engagement (Gartner-cited figure: ~48% engagement lift for gamified apps generally — not isolated to the mascot alone, so don't claim the mascot alone causes 48%). Treat both figures as industry-cited, not independently re-derived this session.

**The strongest reference found — GitHub's own public brand guidelines for Mona (the Octocat):** confirmed via direct fetch of brand.github.com/graphic-elements/mascots, a real company's internal mascot-use rules made public — more falsifiable than the generic engagement-stat consensus. **Use Mona for:** community events, merchandise, internal tools (Slack, email), milestone/celebration moments, inspiration/entertainment aimed at the developer community specifically — explicitly framed as a *cultural icon for developers*, not a mainstream consumer character. **Never use Mona for:** the identity of a sub-team, product, app, or co-branded partnership (she represents the whole company, not a feature); sales, customer support, or training contexts; interrupting a user's workflow or explaining how something works (i.e., not an onboarding/tutorial device); anything alongside serious subject matter — money, security, sales, enterprise, apologies, politics, crises. The explicit restraint principle, quoted directly from the source: **"less is more... overuse or use of mascots as space fillers can be distracting and annoying"** — framed internally as "preserving the magic" through scarcity. Use this "never" list as a direct checklist against any build that's adding a mascot — it's a stronger test than the recall/engagement percentages above, which only argue *for* a mascot and say nothing about *overusing* one.

**The two softer reference cases, and what to take from each:**
- **Duolingo's Duo (owl):** the mascot is woven through the *entire* user journey, not bolted onto a landing page — lesson navigation, streak reminders, push notifications and emails all route through the same character and voice. The lesson: a mascot's value compounds when it appears consistently across touchpoints, not just once on the homepage.
- **Mailchimp's Freddie:** originally static (brand's own retrospective: "the only motion we ever had was Freddie's wink"). The 2018 rebrand (studio DIA) built a full kinetic system by deconstructing Freddie's own logo shapes and the brand typeface's curves into reusable motion primitives, so every animation — however small — visually traces back to the mascot's own silhouette rather than using generic transitions borrowed from elsewhere. The lesson: derive a mascot's motion vocabulary from its own shape, not from a stock easing/transition library, so the animation reads as *that* character and not an animated sticker.

**Design principles to apply, synthesized from both cases:**
1. Keep the mascot visually identical everywhere it appears (same silhouette, colors, proportions) — recognition depends entirely on repetition, and a mascot redrawn slightly differently per page breaks that.
2. Give it a small, finite set of expressions/poses (idle, success, error, thinking/loading, celebrate) rather than one static pose — the expression set should map 1:1 onto real UI state changes (see `animation-reference.md`'s Val Head "Status" purpose).
3. Route feedback and empty/error/loading states through the mascot where natural (a mascot reacting to a form error reads as guidance, not a nag) — this is the same "status communication" job a plain progress indicator does, with warmth attached.
4. Reserve big, elaborate mascot animation for rare moments (first run, task completion, celebration) and use small idle/ambient motion (blink, subtle sway, cursor-follow) for the common case — directly the same "100+ times a day → no/minimal animation" rule from `animation-reference.md`'s Kowalski framework. A mascot that does a 2-second bounce every single page load becomes the thing users learn to ignore or resent.
5. Respect `prefers-reduced-motion` on the mascot exactly as any other animation — swap idle motion/eye-tracking for a static pose, never silence the mascot's function (status/feedback) entirely.
6. **Mark a purely decorative mascot `aria-hidden="true"`** (standard ARIA practice: assistive tech should skip decoration), but never let that be the only way a status/feedback message reaches the user — if the mascot's expression *carries meaning* (celebrating success, flagging an error), that meaning needs real accessible text alongside it. The mascot is decoration layered on top of a message, never the sole carrier of it.

## Cursor-following and eye-tracking mechanics (how the "character looks at you" effect is actually built)

Two different techniques are commonly conflated — pick deliberately, they solve different problems.

### Technique A: percentage-clamp (fast, works for simple circular/oval eyes only)
Map the raw mouse position to a percentage of the viewport, then clamp it to a safe inner range so the pupil never visually escapes the eye shape:
```js
const { pageX, pageY } = e
const { innerWidth, innerHeight } = window
let left = (pageX / innerWidth) * 100
let top = (pageY / innerHeight) * 100
left = Math.min(75, Math.max(25, left))   // keep pupil within the eye's visible band
top = Math.min(75, Math.max(25, top))
pupil.style.left = `${left}%`
pupil.style.top = `${top}%`
```
Cheap and good enough for a simple two-dot cartoon eye, but it's a hack: the clamp band (25–75%) is arbitrary and the pupil's travel doesn't correspond to any real geometry, so it looks wrong the moment the eye shape isn't a near-circle or the eye is large relative to viewport.

### Technique B: angle + radius (correct general case, works for any eye shape/size)
Compute the real angle from the eye's center to the cursor with `atan2`, then move the pupil along that angle but **clamp the travel distance to a fixed radius** (the eye socket's visible radius minus the pupil's own radius) so it mathematically cannot leave the socket regardless of how far or fast the cursor moves:
```js
const eyeRect = eye.getBoundingClientRect()
const eyeCenterX = eyeRect.left + eyeRect.width / 2
const eyeCenterY = eyeRect.top + eyeRect.height / 2
const angle = Math.atan2(cursorY - eyeCenterY, cursorX - eyeCenterX)
const maxRadius = eyeRect.width / 2 - pupilRadius
const distance = Math.min(maxRadius, Math.hypot(cursorX - eyeCenterX, cursorY - eyeCenterY))
pupil.style.transform =
  `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`
```
Use this for anything beyond a toy demo — a real mascot's eyes, oval or asymmetric eye shapes, or eyes at varying sizes across breakpoints.

### Technique C: smooth cursor-followers (blobs, custom cursors, trailing shapes — not eyes)
For an element that *chases* the cursor (a glow blob, a custom replacement cursor, a trailing dot), don't snap the element directly to `clientX`/`clientY` on every `mousemove` — that reads as jittery. Two accepted approaches:
- **requestAnimationFrame + linear interpolation (lerp):** on each frame, move the follower a fraction of the remaining distance toward the latest cursor position (`pos += (target - pos) * factor`, factor ≈ 0.1–0.2) — framework-free, works anywhere.
- **GSAP `quickTo()`:** GSAP's own documented best practice for this exact case. A plain `gsap.to()` called inside a `mousemove` handler creates a brand-new tween on every single event (dozens per second) and re-does unit conversion/plugin parsing each time; `quickTo()` creates the tween once per property (`const xTo = gsap.quickTo(el, 'x', { duration: 0.2, ease: 'power2' })`) and every subsequent call just pipes a new number into the existing tween — this is GSAP's stated performance guidance for exactly this scenario, not a generic tip.
```js
const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power2.out' })
const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power2.out' })
window.addEventListener('mousemove', (e) => { xTo(e.clientX); yTo(e.clientY) })
```
For a multi-element *trailing chain* (a string of dots following one after another), stagger each element's own duration slightly (`duration: 0.2 + index * 0.05`) so later elements lag more — this produces the "tail" effect without extra position math.

### Technique D: spring-based follow in React (Motion, not GSAP)
Animate UI's shipped `Cursor`/`CursorFollow` pair (confirmed via direct fetch of animate-ui.com/docs/components/cursor) is a concrete reference for doing the same job with Motion's spring values instead of GSAP's duration/ease model:
```jsx
<CursorProvider>
  <Cursor />
  <CursorFollow side="bottom" sideOffset={15} align="end" alignOffset={5}>
    Designer
  </CursorFollow>
</CursorProvider>
```
Its default transition is **`{ stiffness: 500, damping: 50, bounce: 0 }`** — a tight, near-critically-damped spring. This is a useful literal default to reach for when implementing a custom spring-based follower directly in Motion/Framer Motion (rather than GSAP's `quickTo`), consistent with `fluid-interaction-reference.md`'s "default most UI to damping ~1.0, no bounce" guidance already in this knowledge base — Animate UI's shipped numbers are a concrete instance of that same rule, not a contradiction of it.

### Rules that apply to all four techniques
- Always `pointer-events: none` on a purely decorative follower/cursor element — otherwise it steals clicks from whatever is underneath it.
- Only animate `transform` (translate/scale/rotate), never `top`/`left`/`margin` for the moving element — this is the same CLS/compositor rule as `animation-reference.md` and `fluid-interaction-reference.md`'s "frame-level smoothness" section; it also keeps a 60fps mascot animation cheap.
- Gate the entire effect behind `prefers-reduced-motion` and behind a pointer-type check (`matchMedia('(pointer: fine)')` or feature-detecting `mousemove`) — a touch device has no persistent cursor position, so a cursor-follower should fall back to a static pose, not run dead code waiting for an event that never fires.
- A mascot's eye-tracking is "ambient, high-frequency" motion in Kowalski's framework (`animation-reference.md`) — keep it subtle (small travel radius, soft easing) precisely because the user sees it continuously; save any large/exaggerated mascot motion for discrete rare events (celebration, error), never the idle cursor-follow itself.

## Where to read more (name, do not paste)
github.com/Ashutoshx7/VengeanceUI; github.com/AmanShakya0018/forgeui (README, license file); animate-ui.com/docs (component categories: Backgrounds, Buttons, Radial family, Cursor/CursorFollow); uiverse.io (buttons/cards/loaders/etc. category pages) and its MCP server listing; uilora.com (cursor and micro-interaction, 3D/WebGL hover categories); github.com/Cuberto/mouse-follower (README — skew/sticky/state-system features); gsap.com/docs/v3/GSAP/gsap.quickTo() (the primary source for the quickTo performance guidance); learnersbucket.com's eye-follow-cursor tutorial (percentage-clamp technique, Technique A above); dev.to's SVG/mouse-tracking-eye articles (general atan2 technique, Technique B); brand.github.com/graphic-elements/mascots (GitHub's own Mona usage rules, the strongest mascot source in this file); the Mailchimp/DIA rebrand case study (creativereview.co.uk, the-brandidentity.com) for the "motion derived from the mascot's own shape" principle; uxdesign.cc and uxplanet.org's Duolingo-mascot essays for the cross-touchpoint consistency principle.


---

<!-- references/scroll-animation-reference.md -->

# Web designer: scroll-triggered and scroll-driven animation

Checked against primary sources (MDN, Chrome Developers, GSAP docs, W3C, NN/g-adjacent academic studies) 2026-10-06. Complements `animation-reference.md` (general motion principles) and `fluid-interaction-reference.md` (gesture physics) — this file is specifically about motion that is *driven by scroll position*, which is a distinct problem: the "input" is the scrollbar, not a pointer or a timer.

## Two fundamentally different techniques — pick by what you need, not by preference

| | Native CSS scroll-driven animations | JS libraries (GSAP ScrollTrigger, etc.) |
|---|---|---|
| Runs on | Compositor thread — doesn't block on JS/main-thread work | Main thread, synced to `requestAnimationFrame` |
| Browser support (confirmed 2026-10-06) | Chrome/Edge: shipped since Chrome 115 (July 2023); Safari: shipped in Safari 26 (Sept 2025), threaded in 26.4+; **Firefox: not supported** as of this check — the one browser gap that currently rules out CSS-only for a cross-browser requirement | Works identically in every browser — the library handles the cross-browser math itself |
| Can pin/hold a section in place | No native pinning primitive | Yes — `pin: true` (GSAP), the dominant use case for "sticky section" scrollytelling |
| Complexity for a simple reveal-on-scroll | A few lines of CSS, no JS at all | Requires the library, a mount/cleanup lifecycle, and `ScrollTrigger.refresh()` discipline |
| Right choice when | The effect is a straightforward fade/slide-in per element, Firefox support isn't a hard requirement, and zero added JS is valuable for performance/bundle size | The effect needs **pinning**, precise scrubbing tied to a complex timeline, or Firefox must work identically — today, that still means JS |

**Practical rule:** default to native CSS scroll-driven animations for simple per-element reveals (the common case). Reach for GSAP ScrollTrigger specifically when the build needs pinning, a scrubbed multi-step sequence, or guaranteed Firefox parity — not as a default for every scroll effect.

## Native CSS scroll-driven animations — stable, shipped syntax (confirmed via MDN)
Two timeline types, both named with a custom-ident (`--my-timeline`):
- **`scroll-timeline`** (shorthand for `scroll-timeline-name` + `scroll-timeline-axis`): progress maps to how far a *scroll container* has scrolled. Use for a document-wide reading-progress bar or any animation driven by overall page position.
- **`view-timeline`** (shorthand for `view-timeline-name` + `view-timeline-axis`): progress maps to a *subject element's* intersection with its scrollport. Use for "reveal as this specific element scrolls into view," independent of how far down the page it happens to sit.

```css
/* Document-wide scroll progress bar */
body { scroll-timeline: --page-scroll vertical; }
.progress-bar {
  position: fixed; top: 0; left: 0; height: 4px;
  animation: grow linear forwards;
  animation-timeline: --page-scroll;
}
@keyframes grow { from { width: 0%; } to { width: 100%; } }

/* Per-element reveal, independent of page position */
.card {
  view-timeline: --card-view;
  animation: reveal linear;
  animation-timeline: --card-view;
  animation-range: entry 0% cover 30%; /* only animate during the entry phase */
}
@keyframes reveal {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}
```
`animation-range` keywords: `cover` (the whole time any part of the element is in the scrollport, the default), `contain` (only while the element is *fully* inside), `entry`/`exit` (just the entering/leaving transition). Always set `animation-fill-mode` appropriately (`both` for a reveal that should hold its end state) and gate the whole thing behind `@supports (animation-timeline: works)` with a static fallback for Firefox, matching the general progressive-enhancement rule already in `web-designer-behavior.md`'s performance section.

**The 2026 extension (not yet broadly shipped, watch before relying on it):** `timeline-trigger`/`animation-trigger`/`trigger-scope` land in Chrome 145 (2026) and add a *discrete* trigger model — a trigger fires once a scroll/view threshold is crossed and plays an animation to completion, rather than continuously driving progress. Useful for "play this animation once when the user reaches here" vs. the continuous-progress model above. Treat this as forward-looking, not yet a safe default — confirm current support before using it as a load-bearing technique.

## GSAP ScrollTrigger — the JS fallback/upgrade path (confirmed via GSAP's own docs)
Core concepts: `scrub` ties animation progress directly to scroll position — `scrub: true` is 1:1, `scrub: 1` adds a 1-second catch-up smoothing (prefer a small numeric scrub value over `true` for anything that shouldn't feel mechanically tied to the scrollbar). `pin: true` takes the element out of flow and locks it during its active range, automatically inserting a spacer element sized to the pin's scroll duration — **this spacer is the single most commonly misunderstood mechanic**: get the pin's `end` value wrong and the page either jumps or leaves dead scroll space. `start`/`end` use an intuitive `"<element-edge> <viewport-edge>"` syntax (e.g. `"top center"`) or relative offsets (`"+=300px"`).

```js
gsap.registerPlugin(ScrollTrigger)
gsap.to('.box', {
  scrollTrigger: { trigger: '.box', start: 'top center', end: 'bottom center', scrub: 1, pin: true },
  rotation: 360,
})
```

**Nested pins stack spacers** — build and measure the innermost pinned sequence's total scroll distance *first*, then set the outer pin's `end` to be at least that long, or the outer section releases before the inner sequence finishes. Call `ScrollTrigger.refresh()` only when layout actually changed (content loaded, viewport resized past a breakpoint) — never on every resize event, debounce it. Use `markers: true` during development only, strip before shipping. Create triggers in page order (top to bottom) — GSAP's own docs note this avoids a class of ordering bugs. For many similar triggers (e.g. a staggered card-reveal list), use `ScrollTrigger.batch()` rather than one trigger per card.

## Scroll-jacking — the UX line between "guided" and "broken"
Scroll-jacking (intercepting the user's scroll input and replacing default continuous scroll with scripted motion — snapping, slowed/sped scroll, forced steps) breaks what is effectively a decades-old muscle-memory contract: the user scrolls, the page moves, now, at the rate they chose. Breaking that reads as the page fighting the user, not guiding them.

**When it's defensible, confirmed by both industry writing and peer-reviewed studies:** short, linear, single-purpose narratives — a product tour, a portfolio piece, a campaign microsite, an interactive timeline — where the user already expects a guided, presentation-like experience rather than an information page they intend to scan and navigate freely. **When it isn't:** any content-heavy page, anything the user needs to scan, search within, or return to (back button / mid-page bookmark expectations), or anything that could be a destination for deep-linking.

**Actual research, not just advocacy:** a Purdue University study (2015) found users rated a parallax-scrolling site as more *fun*, but two participants experienced genuine motion sickness severe enough to raise an ethical concern for researchers running the study — a real, not hypothetical, harm. A separate eye-tracking study (2018) found parallax improved engagement specifically for storytelling content and helped users locate objects of interest in an online shop roughly twice as fast. A Norwegian university study (2021) found no significant difference in task completion time, error rate, or stated preference between parallax and non-parallax versions of the same site. **Read together: parallax/scrollytelling can measurably help engagement and task speed in visually-led, exploratory contexts, carries a real (if small-sample) motion-sickness risk, and shows no benefit for plain task-completion content** — so the decision should be "is this page a story/showcase or a task," not a blanket style preference.

## Accessibility requirements that apply to every scroll animation (confirmed via WCAG)
- **WCAG 2.2.2 (Pause, Stop, Hide), Level A:** any automatic motion lasting more than 5 seconds, or running alongside other content, must be user-controllable (pausable/stoppable). A long scroll-driven background animation that never stops needs an escape hatch.
- **WCAG 2.3.1 (Three Flashes), Level A:** content must never flash more than 3 times/second — applies to any rapid scroll-triggered strobe effect.
- **WCAG 2.3.3 (Animation from Interactions), Level AAA — ship anyway:** motion triggered by a user's own interaction (including scrolling) should be disable-able unless essential to the function. This is the formal backing for respecting `prefers-reduced-motion` on scroll effects specifically, not just on load animations.
- Motion more likely to cause real discomfort, named explicitly in accessibility guidance: parallax scrolling, large/fast/multi-directional movement, full-screen motion, motion running behind text the user is trying to read, and looping animation with no user control — treat these five as the first things to gate behind `prefers-reduced-motion` or cut outright, not as the house style to reach for by default.
- Screen readers and keyboard navigation can struggle with scroll-jacked or heavily parallaxed structures specifically because the visual reading order stops matching the DOM/tab order — verify with an actual keyboard-only and screen-reader pass on any scrollytelling section, not just a visual review.

## Performance rules specific to scroll animation (extends `animation-reference.md`'s general compositor-only rule)
- IntersectionObserver is the correct primitive for any JS-based reveal-on-scroll: it runs off the main thread and fires only on actual visibility change — never fall back to a `scroll` listener + `getBoundingClientRect()` polling loop, which runs continuously and is the classic cause of scroll jank.
- Still only animate `transform`/`opacity` even inside a scroll-driven animation — the compositor-thread benefit of native CSS scroll-timelines is lost the moment the keyframes touch a layout property.
- Call `unobserve()`/`disconnect()` once a one-time reveal has fired — don't leave observers watching elements that will never need to re-trigger.
- Debounce any expensive work inside an intersection callback; the callback firing is cheap, but what you do inside it might not be.

## Where to read more (name, do not paste)
developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations (the stable `scroll-timeline`/`view-timeline`/`animation-range` syntax); developer.chrome.com/blog/scroll-triggered-animations (the 2026 `timeline-trigger` extension, forward-looking); gsap.com/docs/v3/Plugins/ScrollTrigger (scrub/pin/start-end semantics, authoritative for GSAP); the Purdue University 2015 parallax usability dissertation and the 2018 eye-tracking parallax study (search by title, both are the primary academic sources behind the engagement-vs-motion-sickness tradeoff above); W3C WCAG 2.2.2/2.3.1/2.3.3 Understanding docs (already the primary accessibility reference used elsewhere in this knowledge base).


---

<!-- references/3d-web-reference.md -->

# Web designer: 3D on the web (Three.js, WebGL/WebGPU, glTF)

Checked against primary sources (Khronos Group, Three.js/R3F ecosystem docs, Chrome Developers) 2026-10-06. This is for deciding *whether and how* to add real 3D content (a hero model, an interactive product viewer, a WebGL background scene) — not a 3D-modeling tutorial. Pair with `fluid-interaction-reference.md` for the motion-feel principles that still apply once something is 3D, and `performance-checklist.md` for the general perf budget this extends.

## The stack, confirmed current as of this check

**glTF 2.0** (ISO/IEC 12113:2022, maintained by Khronos) is the standard *delivery* format for 3D on the web — purpose-built to minimize both file size and runtime unpacking cost for WebGL/WebGPU/OpenGL-family renderers. If a 3D asset isn't already in `.gltf`/`.glb`, convert it rather than loading a native DCC format (`.fbx`, `.blend`, `.obj`) directly in the browser.

**Three.js** is the dominant JS 3D library; **React Three Fiber (R3F)** is the React-idiomatic wrapper around it (with the `@react-three/drei` helper library alongside it) — use R3F on a React project rather than hand-rolling imperative Three.js inside `useEffect`, since R3F's whole value is making the scene graph declarative and React-lifecycle-aware.

**WebGPU vs. WebGL, confirmed current support:** WebGPU ships by default in Chrome/Edge (from v113, May 2023), Firefox (v141+ Windows, v145+ macOS), and Safari (v26+, Sept 2025) — meaning as of this check it's supported by default across all four major engines, not experimental. Three.js ships a WebGPU renderer (`three/webgpu`) with automatic WebGL2 fallback; migrating an existing Three.js app is close to a one-line renderer swap. Reported gains: 30-50% improvement on dense scenes, lower CPU overhead, and compute-shader access for particle/effect work WebGL can't do efficiently. **Default recommendation:** build new work WebGPU-first with the automatic WebGL fallback, rather than targeting WebGL alone, for anything with a multi-year expected lifespan — the fallback costs nothing and the ceiling is meaningfully higher.

## Asset budgets — concrete numbers, by target device (compiled from Three.js/WebGL optimization guides; treat as industry-common practice, not a single ratified spec)

| Target | Max total polygons | Max texture size | Max total file size |
|---|---|---|---|
| Mobile web | ~50,000 triangles | 1024×1024 | ~2 MB |
| Desktop web | ~200,000 triangles | 2048×2048 | ~5 MB |
| Desktop application (not browser-constrained) | ~500,000 triangles | higher | ~20 MB |

For genuinely broad compatibility (older/low-end Android devices specifically), a much tighter figure of ~7,000 triangles for the whole visible scene is cited — treat the table above as the common web target, this as the floor for "must work everywhere." **Draw calls, not polygon count, are usually the actual bottleneck:** aim under 100 draw calls per frame for a comfortable margin, with ~500 cited as the outer edge of stable 60fps on desktop WebGL (lower on mobile). This is why **instancing** (`THREE.InstancedMesh`) matters more than polygon reduction for scenes with many repeated objects — a documented example cuts 19,600 individual objects down to a single draw call.

## The optimization pipeline, in order of impact
1. **Draw-call reduction first** — instancing and batching for repeated geometry; this is the highest-leverage single change (can cut draw calls 90%+ in the right scene).
2. **Mesh compression** — Draco (Khronos) compresses the geometry/mesh data itself.
3. **Texture compression** — **KTX2 with Basis Universal supercompression** (ratified by Khronos, April 2021, via the `KHR_texture_basisu` glTF extension) is the standard here: 3-5x smaller file size than JPG/PNG, and critically, **it stays compressed on the GPU** rather than decompressing to raw RGBA in memory the way JPG/PNG do — sometimes 10x less GPU memory for the same visible texture. Three.js, Babylon.js and the Gestaltor viewer already support it natively. Draco (mesh) and KTX2 (texture) are complementary, not alternatives — use both.
4. **LOD (Level of Detail)** via `THREE.LOD` — swap to a lower-poly mesh as camera distance increases; cited as improving perceived frame-rate smoothness without a visible quality loss at the distances where it switches.
5. **Frustum culling** — on by default in Three.js (`object.frustumCulled = true`); skips rendering anything outside the camera's view volume, reported to cut rendering workload by roughly 30% in typical scenes. Verify it isn't accidentally disabled on custom objects rather than trying to reimplement it.
6. **Dispose what you don't need** — geometries, materials, textures and render targets all need explicit `.dispose()` when removed; Three.js does not garbage-collect GPU resources just because the JS reference is gone. This is the WebGL equivalent of a memory leak and the most common cause of a 3D page that slows down the longer it's open.
7. **Profile before optimizing** — `renderer.info` (built into Three.js) for a live draw-call/triangle count, `stats-gl` for an FPS/memory overlay, Spector.js for a full frame capture. Don't guess at the bottleneck.

## React Three Fiber-specific rules (confirmed via the R3F ecosystem's own documented best-practice set)
- **Never call `setState` inside `useFrame`** — `useFrame` runs every rendered frame (up to 60+ times/second); routing that through React state forces a re-render on the same cadence. Mutate refs/object properties directly inside `useFrame` instead, and only touch React state for changes that genuinely need to re-render the component tree (rare, e.g. a UI overlay reacting to a milestone).
- Isolate components that need React state from the ones that only need per-frame mutation, so a frequent state update doesn't force the whole scene subtree to re-render.
- Target the browser's actual frame budget: **16.67ms per frame for 60fps** — treat this as the hard ceiling when profiling, same number as the general "long task" threshold already used in `web-designer-behavior.md`'s Core Web Vitals section (just applied to a render loop instead of a main-thread task).
- Use `@react-three/drei`'s helpers (`<Instances>`, `<Detailed>` for LOD, loaders with Suspense) rather than reimplementing Three.js patterns by hand inside R3F — it exists specifically to cover the common cases idiomatically.

## When 3D is the right call, and the accessibility obligations that come with it
3D adds real value for product visualization (rotate-to-inspect), spatial/architectural walkthroughs, and a genuinely differentiated hero moment — it's expensive in both build time and runtime budget, so it should be reserved for places where "see it from every angle" or "feel the depth" is actually the point, not added as decoration on a page that doesn't need it (the same restraint principle as `ui-libraries-and-mascots-reference.md`'s mascot-overuse guidance, applied to a much more expensive technique).

**Accessibility, same WCAG criteria as scroll/motion generally, now with higher stakes because 3D motion is often continuous and full-viewport:** gate any auto-rotating or continuously-animating 3D scene behind `prefers-reduced-motion` with a static-frame fallback, never a spinning scene with no pause control (WCAG 2.2.2 applies directly — a 3D viewer that auto-rotates forever and can't be stopped fails the same criterion a looping carousel would). A 3D canvas is opaque to screen readers by default — provide a real text alternative describing what the model is and its key inspectable states, don't rely on the canvas alone to communicate anything load-bearing. Full WebXR-specific accessibility guidance was not found as a mature, separate spec as of this check — treat general motion/WCAG guidance (reduced motion, no unstoppable auto-motion, text alternatives) as the current best available bar for a WebXR/3D feature rather than assuming a dedicated WebXR accessibility spec exists to defer to.

## Where to read more (name, do not paste)
khronos.org/gltf (the glTF 2.0 spec, sample assets, and validator — the primary source for the format itself); khronos.org/ktx (KTX 2.0 container spec and the Basis Universal supercompression press materials); threejs.org's own docs and `renderer.info`/LOD/InstancedMesh API references; the `@react-three/fiber` and `@react-three/drei` documentation for the React-specific patterns; discourse.threejs.org (the project's own community forum, useful for confirming current-version specifics since the library moves fast); developer.chrome.com's WebGPU documentation for current browser-support tables (re-check before quoting a specific version number, this space moves quickly).


---

<!-- references/color-selection-reference.md -->

# Web designer: color selection rules

Checked against primary sources (W3C, Khronos/WebKit/Chrome docs, Google's Material Color Utilities, accessibility research) 2026-10-06, deepened the same day against design-critique sources, a peer-reviewed replication meta-analysis, and Anthony Hobday's published design-rules set. `web-designer-behavior.md` already covers the baseline WCAG 2.2 contrast numbers (4.5:1 body, 3:1 large text) — this file goes deeper: *how* to pick a palette in the first place, which attention/psychology claims actually survive scrutiny, concrete clash/clean/premium rules, the modern CSS color spaces that changed what's possible, and the contrast-model debate the field hasn't actually settled yet. Don't repeat the WCAG basics here; extend them.

## Palette structure: the 60-30-10 rule, and why it's a starting ratio not a law
Distribute a palette as roughly **60% dominant color** (the backdrop, sets the overall tone), **30% secondary color** (supports the dominant, adds distinction without competing), **10% accent color** (used sparingly, draws the eye to the one thing that matters — a primary CTA, a key stat). This is a print/interior-design-origin heuristic, not a derived law — treat it the same way this knowledge base already treats the rule of thirds and golden ratio in `web-designer-behavior.md`: a usable starting ratio for a first pass, not a number to defend as scientifically optimal. The *mechanism* it encodes is real and worth keeping even if the exact 60/30/10 split isn't: a page needs one color doing most of the work, one doing noticeably less, and the rarest color concentrated on the highest-value target — which is the same "isolation increases visual weight" principle already in this knowledge base's composition section, applied to color instead of whitespace.

## Color harmony schemes — pick by the feeling the page needs, not by taste alone
- **Complementary** (opposite hues on the wheel — red/green, blue/orange, yellow/purple): the highest-contrast pairing, reads as vibrant and dynamic. Best for a page that wants energy or a single element that must visually dominate (use the complement as the 10% accent against a dominant base, not as two competing 50% fields).
- **Analogous** (adjacent hues — blue, blue-green, green): low contrast, reads as calm and cohesive. Pick the *middle* hue of the three as the dominant color, with the two flanking hues as support — this ordering is what keeps an analogous palette from reading as flat or muddy.
- The underlying logic in both cases: hue relationships set the *emotional register* (harmony vs. energy), while the 60-30-10 ratio sets *which* color actually carries that register at full strength. Choose the scheme first from the brand's emotional target, then apply the ratio — not the reverse.

## Attention and urgency — what's actually supported vs. popular mythology
Deepened 2026-10-06 against marketing research, a critical meta-analysis, and the specific academic literature on one famous color-psychology claim. **Read this section before the one below it** — it sets how much weight to put on any color-psychology claim, including the ones already in this file.

**What's real:** red reliably draws the eye fastest against neutral/cool backgrounds — this is a genuine perceptual/contrast effect (red sits at one extreme of visible hue and commonly carries high saturation), not a myth. CTA-color testing consistently finds red effective specifically for *time-pressured* actions (flash sales, countdowns, limited-time offers) — but the same research is equally consistent that red reads as aggressive or stressful against a brand that wants to communicate calm, trust, or luxury, so "red converts better" is not a universal rule, it's a match to a specific emotional register (urgency), the same way the complementary color scheme above is a match to "energy" rather than an objectively superior choice.

**What's overstated, and the cautionary tale worth knowing by name:** the popular "color psychology" infographic claiming fixed universal meanings (red=urgency, blue=trust, green=calm, purple=luxury) strips findings from context and significantly overgeneralizes. The clearest documented case: Elliot & Niesta's widely-cited 2008-2010 "red-romance" studies claimed a red border/shirt substantially increased perceived attractiveness. **Multiple later replication attempts failed to reproduce the effect at the claimed size** — a 2019 multi-site replication project (nine student replications, combined n=640) found *no* effect of red on attractiveness ratings for women rating men; a broader meta-analysis found only a small effect for men rating women and a very small, unreliable effect for women rating men, with evidence of upward bias in the original estimate. **Why this matters for a design decision:** a famous, specific, widely-repeated color-psychology claim did not hold up under replication — treat any single color-psychology claim (including the red-urgency one above) as a *directionally plausible* input, backed by a real perceptual mechanism when one is cited, never as a settled law to justify a client-facing decision on its own. Personal history, culture, and context measurably confound color-emotion associations, which is exactly why the effect sizes above are small and inconsistent across studies.

**Practical rule:** when choosing an attention/urgency color, prefer the version of the claim that has a stated *mechanism* (red's wavelength + high-saturation contrast genuinely pulls the eye; that's optics, not psychology) over the version that claims a universal *emotional meaning* (red = romance, universally) — the first kind of claim is the kind that survives scrutiny, the second kind is the kind that's been directly tested and failed to replicate.

## Color combinations that reliably look wrong, and why
Confirmed across multiple design-critique sources as the recurring offenders, with the mechanism behind each:
- **Red + green together** (not just as a status pair, as a design choice): fails for red-green color-blind users (the most common form of color blindness, see below), and independently reads as visually unsettling even for full-color vision — don't use this pairing for anything beyond a deliberately retro/holiday context.
- **Neon green + hot pink, or any two colors both at very high saturation and similar brightness:** colors clash specifically when both have high saturation *and* similar brightness/lightness — there's no third value (lightness or saturation) left to separate them, so they visually fight for the same role. The fix is not "pick different hues," it's "make sure any two saturated colors differ in lightness."
- **Mustard yellow + olive green, or any two muted/desaturated tones that are also close in hue and lightness:** the opposite failure — not enough contrast anywhere (hue, saturation, or lightness), so the pairing reads as muddy and the eye can't find an edge to rest on.
- **Brown + orange, or any two colors that are both mid-to-dark and close in hue:** low brightness contrast between them makes text/edges hard to resolve, independent of any color-blindness consideration.
**The general diagnostic, extracted from all four cases above:** a combination clashes when it fails on *all three* of hue-difference, saturation-difference, and lightness-difference simultaneously (too similar, chaotic equal-intensity, or too low-contrast) — any one strong difference (usually lightness) is normally enough to rescue an otherwise-risky hue pairing. This is the same diagnostic Anthony Hobday's "distinct brightness values" rule below formalizes.

## What makes a palette read as "clean," "minimal," or "premium" — not vague taste, a consistent recipe
Pulled from multiple independent sources describing the same underlying recipe: **3-5 total colors**, built as one primary/brand hue, one or two secondary/supporting hues, and a neutral range (grays) with enough steps to carry the actual hierarchy — most of a "clean" page's color work is done by the neutral ramp, not by the brand color. **Muted, desaturated tones read as premium and calm; save full saturation for the smallest, highest-value elements** (the accent role in the 60-30-10 structure above) — a palette that's saturated everywhere reads as loud/cheap regardless of which hues are chosen, because saturation itself is what the eye reads as "intensity," independent of hue. The underlying three principles, consistent across sources: **simplicity** (few colors, each with one clear job — this is the direct color-domain application of Hick's Law already cited elsewhere in this knowledge base: more competing hues slows the eye the same way more menu choices slows a decision), **harmony** (the chosen colors feel like they belong to the same family — this is what the warm/cool and brightness-distinctness rules below actually enforce), and **balance** (enough contrast between surface, text, and action colors that hierarchy is legible without needing high saturation to create it). "Minimal" is not "plain" — it's load-bearing restraint: every remaining color choice has to work harder because there are fewer of them.

## Twelve color-specific rules that generalize safely (Anthony Hobday's "Visual Design Rules," color-relevant subset, confirmed via direct fetch)
This is a named, concrete rule set (not vague principles) worth citing directly rather than paraphrasing loosely:
1. **Use near-black and near-white, never pure `#000`/`#FFF`.** Pure black creates uncomfortably harsh contrast against real content; pure white is too bright. (Independently confirmed elsewhere: pure black turns OLED pixels fully off, causing a "wake-up" smear on scroll; Material Design's dark-theme surface is `#121212`, not `#000000`, specifically so there's still room below it to show elevation via lightening — a pure-black base has nowhere lower to go and every shadow disappears against it.)
2. **Saturate your neutrals slightly** (under ~5% in HSB) rather than using literal gray — a touch of hue in "black," "white" and "gray" reads as more coherent with the rest of the palette than a flat, hue-less gray does.
3. **If you saturate your neutrals, pick warm or cool, not both** — mixing a warm-tinted gray with a cool-tinted gray in the same UI breaks the coherence the saturated-neutral trick was supposed to buy.
4. **Colors in a palette need distinct brightness values** — if two palette colors sit at similar lightness, they compete rather than cooperate, exactly the clash mechanism described above.
5. **Keep container background colors within a brightness band relative to each other:** roughly within 12% (in dark UI) or 7% (in light UI) HSB brightness of neighboring surfaces — close enough to feel like the same surface family, not so close that edges disappear and not so far that elevation reads as disconnected.
6. **Container borders must contrast with *both* the container's own fill and the background behind it** — a border that matches either side disappears exactly where it's needed to define the edge.
7. **Reserve high contrast for what actually needs attention** (buttons, key content, the 10% accent) — structural/decorative elements can run at much lower contrast; spending high contrast everywhere cancels the hierarchy it's supposed to create.
8. **Don't use shadows on dark interfaces** — shadows render poorly against a dark base (there's no light background for them to read against); use a lighter surface fill to indicate elevation instead, consistent with `web-designer-behavior.md`'s existing dark-mode-is-lightness-not-shadow rule.
9. **Lower the contrast/opacity of an icon when it's paired with text** — an icon at full contrast next to text competes with the text for attention; de-emphasizing it slightly lets the text carry the hierarchy.
10. **Pair simple with complex** — a simple flat color under complex text, or a complex background with simple, restrained text treatment; two complex or two competing-for-attention elements in the same spot is the failure mode.
11. **Don't put two hard color/background transitions next to each other** — stacking dividers or abrupt background changes back-to-back reads as visual clutter even when each individual transition is well-executed alone.
12. **Everything in the palette should be deliberate** — every color choice should have a stated reason (semantic role, brand requirement, contrast need); an un-justifiable color in the palette is a sign the palette grew by accretion rather than design.

## Warm/cool and saturation as spatial and emphasis tools, not just mood
Warm, high-saturation, high-brightness colors visually **advance** (appear to come forward); cool, desaturated, lower-brightness colors visually **recede** — this is a real perceptual effect independent of any actual depth in the layout, and it's the mechanism behind the "small warm accent in a cool/neutral field pulls the eye immediately" effect already implied by the 60-30-10 and semantic-token sections above. **Practical application beyond a CTA button:** a predominantly cool/muted/desaturated palette (the "clean/premium" recipe above) is precisely what makes a single warm, saturated accent color read as unmissable — the advancing/receding contrast *is* the attention mechanism, not a separate trick. This also explains why a palette that's saturated and warm *everywhere* has no accent left that can advance any further than its neighbors — "make everything stand out" and "nothing stands out" are the same failure, arrived at from the opposite direction of the clash problem above.

## Yellow's specific accessibility trap — worth naming on its own
Yellow deserves a dedicated callout because its failure mode is different from ordinary low-contrast text: yellow's high light reflectance means it achieves a *genuinely terrible* contrast ratio against light backgrounds specifically — yellow-on-white measures around 1.07:1, nowhere close to passing any WCAG text threshold, and this isn't a borderline case that careful shade-picking fixes, it's close to a hard ceiling for that pairing. Yellow also cannot carry large fill areas or body text without visual fatigue, and struggles to build a hierarchy on its own (every tint/shade of yellow tends to still read as "yellow," with less of the perceptual lightness range other hues get). **What yellow is actually good for:** a small accent/highlight against a *dark* background, where black-on-yellow is one of the highest-measured readability pairings available — treat yellow as a warning/highlight accent used sparingly against dark surfaces, never as a background behind light text or as a dominant 60% color.

## Semantic color tokens — name roles, not values (confirmed across multiple production design-system docs)
Name color tokens by what they *mean*, not by their current hex value — `danger`, `success`, `warning`, `surface`, `border`, never `red-500` used directly in component code. The consistent pattern across production design systems: a base token combines **role + where it's applied** (`danger-surface`, `success-text`, `primary-border`), with **modifiers for state** (`default`, `subtle`, `muted`, `hover`, `selected`, `inverse`). This is what makes a palette swap (rebrand, dark-mode variant, white-label client build) a token-remapping exercise instead of a find-and-replace across every component. Standard semantic categories to cover at minimum: `primary` (brand identity, used sparingly — it is not the dominant 60%, it's closer to the 10% accent role applied to interactive/brand moments), status/feedback (`success`/`warning`/`danger`/`neutral`, shared meaning across alerts, validation, badges), and a `surface` ramp (`background` for the page canvas, `surface` for standard containers, `surface-raised` for anything needing visual separation like an overlay or modal). This directly operationalizes `web-designer-behavior.md`'s existing "build the neutral ramp first" guidance — the neutral ramp *is* the surface tokens.

## Modern CSS color spaces — what actually changed, and when it matters

**OKLCH (Lightness, Chroma, Hue), part of CSS Color Module Level 5:** the practical reason to care is *perceptual uniformity* — unlike HSL, where the same lightness value looks visibly different in brightness depending on hue (e.g. yellow at `hsl(60 100% 50%)` looks much brighter than blue at the same L value), OKLCH's lightness channel tracks actual perceived brightness consistently across all hues. This is what makes **relative color syntax** genuinely useful rather than a syntax curiosity:
```css
--brand: oklch(55% 0.15 260);
--brand-light: oklch(from var(--brand) calc(l + 0.2) c h);  /* lighter, same hue/chroma */
--brand-gray: oklch(from var(--brand) l 0 h);                /* same lightness, desaturated to gray */
```
Confirmed browser support: Chrome 119+, Firefox 128+, Safari 16.4+ for relative color syntax specifically — broad enough to use as a primary technique, not an experimental one. **Practical rule: generate a palette's light/dark/muted variants from OKLCH math on a single seed color instead of hand-picking each step** — it's the CSS-native version of what Material's HCT tonal-palette system (below) does programmatically.

**`color-mix()`:** blends two colors in a specified interpolation color space — the space chosen changes the visible result, especially for colors far apart on the wheel (mixing in OKLCH avoids the muddy/gray midpoint that mixing in sRGB often produces for complementary pairs).

**Display-P3 (wide gamut):** roughly 50% more colors than sRGB; most displays sold since ~2020 can show it. Syntax: `color: color(display-p3 1 0.5 0)`, feature-detect with `@media (color-gamut: p3)`. **When it matters:** a brand color that's meant to feel genuinely vivid/saturated (not just "bright-looking" via contrast tricks) — sRGB physically cannot represent some saturated oranges/reds/greens that P3 can. **When it doesn't:** most UI work, where sRGB's gamut was never the limiting factor. Use progressive enhancement (`@supports`/`@media` checks with an sRGB fallback) rather than assuming P3 support, and don't reach for it by default — it's a tool for a specific "this brand color needs to feel more saturated than sRGB allows" problem, not a general upgrade.

## Material Design 3's color system — the most rigorous *programmatic* palette-generation approach found
Material 3 generates an entire accessible, coherent color scheme from a **single seed color** via **HCT (Hue, Chroma, Tone)** — Google's own perceptually uniform color space, combining CAM16's hue/chroma with CIELAB's L* as the tone axis. The property that makes this useful beyond Material's own product: **HCT guarantees that the same tone value (e.g. tone 40) produces the same perceived brightness at any hue** — exactly the uniformity problem OKLCH also solves, but HCT's pipeline is a complete, battle-tested *system*, not just a color space. The generative pipeline: seed color → HCT decomposition → 5 tonal palettes (Primary, Secondary, Tertiary, Neutral, Neutral Variant) → 13 tones per palette (0,10,20,30,40,50,60,70,80,90,95,99,100) → 29 semantic color roles mapped to specific palette+tone pairs. **Takeaway even without adopting Material wholesale:** this tone-ladder structure (a fixed set of lightness steps per hue, consistent across every color in the palette) is the right mental model for building any brand's own tonal ramps — pick the same tone-step scheme for every brand hue so `primary-40` and `danger-40` are always equally dark relative to their own hue, which is exactly the property HSL alone does not give you.

## Contrast: WCAG 2.x is still the only thing to design against today — APCA is not a safe primary metric
This genuinely surprised this research pass and is worth stating plainly: **APCA (the Accessible Perceptual Contrast Algorithm) was proposed as WCAG 3's replacement contrast model, removed from the WCAG 3 working draft in July 2023 after failing to gain working-group consensus, and remains experimental research — not an adopted standard — as of this check (confirmed via a dated April-2026 analysis).** WCAG 3 itself has no finalized contrast algorithm yet and is targeted for completion no earlier than 2030. **Practical guidance: keep designing against WCAG 2.x's 4.5:1/3:1 ratios as the compliance baseline.** APCA is better-motivated science (it accounts for font weight/size and handles dark-mode/light-text-on-dark contrast more sensibly than WCAG 2.x's flat ratio, which is known to fail hardest specifically for dark color combinations) — it's reasonable to *additionally* check a dark-mode palette against APCA for a genuinely better signal, but never as a *replacement* for the WCAG 2.x number a legal/compliance review will actually check against. If a palette only passes APCA and not WCAG 2.x, that's a real risk to flag, not a reason to argue APCA is "more correct."

## Color blindness — concrete design rules, not just "add contrast"
Confirmed prevalence: ~8% of men and ~0.5% of women have some form of color vision deficiency — common enough that "most users won't have this" is not a safe design assumption for anything with real traffic. **Deuteranopia** (green-blind, the most common single form, ~5% of men): greens shift toward blue/purple, reds appear gray. **Protanopia** (red-blind): reds and greens both shift toward yellow/gray, purples shift toward blue. The actionable rules, consistent with WCAG 1.4.1 (Use of Color, Level A — already a named criterion, this file adds the practical tactics):
1. **Never encode meaning in color alone** — pair every color-coded meaning with a second channel: shape, icon, text label, or pattern. A red/green status dot with no icon or label fails for a meaningful fraction of real users, not a hypothetical edge case.
2. **Prefer blue/orange over red/green for a two-state contrast pair** (error/success, on/off) — blue and orange remain distinguishable across protanopia and deuteranopia, where red and green specifically collapse toward each other.
3. **Check contrast in grayscale, not just in color** — if two adjacent UI elements rely on hue alone to separate (no lightness/contrast difference), they will merge for a user who can't perceive that hue difference at all. A quick desaturation pass of any palette or mockup is a fast, concrete test — this is a different check from the numeric contrast ratio and should be run in addition to it, not instead of it.
4. Design against an actual simulator (deuteranopia/protanopia/tritanopia modes) for any palette decision that leans on color to separate meaning — don't rely on intuition about "which colors are probably fine."

## Dark mode — extends `web-designer-behavior.md`'s existing rule, doesn't replace it
The existing guidance ("dark mode raises surface elevation by lightness, not shadow, and lowers saturation — it is not inverted light") is correct and stays the baseline. Add from this pass: **WCAG 2.x's flat contrast ratio is known to be least reliable specifically for dark-mode color combinations** (per the APCA-motivation research above) — meaning a dark palette that just barely clears 4.5:1 on paper is more likely to still look wrong in practice than a light-mode palette at the same ratio. Build extra visual margin above the minimum ratio for dark-mode text, rather than treating "passes 4.5:1" as equally safe in both themes.

## Where to read more (name, do not paste)
w3.org/TR (CSS Color Module Level 5 working draft — oklch/color-mix/relative color syntax, the primary spec source); webkit.org/blog (the original Display-P3-in-CSS announcement); developer.chrome.com/docs/css-ui/migrate-hd-color (practical P3 migration guidance); github.com/material-foundation/material-color-utilities and m3.material.io (the HCT/tonal-palette system, canonical source); adrianroselli.com's dated WCAG3/APCA status posts (check for a more recent one before repeating the "APCA removed, WCAG3 undetermined" claim — this is an actively moving situation); WCAG 1.4.1 (Use of Color) Understanding doc; any maintained color-blindness simulator (for an actual visual check, not just reading about the three types); anthonyhobday.com/sideprojects/saferules (the full "Visual Design Rules You Can Safely Follow Every Time" list — this file quoted only the color-relevant subset, the rest covers spacing/typography/layout and is worth a separate read); the Elliot & Niesta (2008/2010) red-romance studies alongside their later replication meta-analyses (search by author name — the clearest documented case of a popular color-psychology claim failing replication, worth knowing by name when a client cites "color psychology" as justification); noissue.co's and similar critical pieces on color-psychology-in-marketing (for the broader "popular claims strip findings from context" caveat).


---

<!-- references/vibrant-color-patterns-reference.md -->

# Web designer: creating vibrant color patterns

Checked against primary/near-primary sources (MDN, design-trend reporting, brand-identity write-ups, generator-tool docs) 2026-10-06. `color-selection-reference.md` already covers palette *selection* rules, including when muted/restrained is the right call — this file is the companion for when the brief calls for the opposite: bold, saturated, attention-grabbing color used as a deliberate strategy, plus the concrete techniques (with working code) to build it. Port the technique, never a specific brand's exact gradient/mascot/mark (same rule as `ui-libraries-and-mascots-reference.md` and `anti-slop-checklist-reference.md`).

## When vibrant is the right call, not just a preference
The 2026 trend reporting names this "dopamine design": high-saturation hues (electric blues, neon greens, hot pinks, sunset oranges) used deliberately rather than as decoration, on the premise that saturated color triggers a stronger emotional/attention response than muted color. **The condition that makes it work, repeated across every source checked:** vibrant color has to be paired with the *same* UX fundamentals a restrained palette needs — accessibility standards, clear visual hierarchy, real brand positioning — or it just reads as noise. "Maximalist minimalism" is the named pattern for how the best current sites do this: bold, expressive color/type/gradients layered on top of a clean, functional structure (clear grid, legible hierarchy, obvious primary action) rather than bold color replacing structure. **Practical rule: vibrant is a strategy for lifestyle/beauty/youth/consumer-energy brands and attention-grabbing moments (hero sections, campaign pages, a single standout CTA) — it is not a substitute for the hierarchy and restraint work; it's an amplifier on top of it.** This is the same relationship the "isolation increases visual weight" and 60-30-10 principles already in `color-selection-reference.md` describe — vibrant design just pushes the accent's intensity further, it doesn't remove the need for a dominant/secondary/accent structure underneath it.

## Technique 1: mesh gradients — the current signature "premium vibrant" background
A mesh gradient blends several colors across a 2D plane in soft, organic transitions, rather than the single-direction fade of a linear/radial gradient — this is the technique behind the fluid, aurora-like backgrounds on sites like Stripe and Linear. **There is no shipped native CSS `mesh-gradient()` function yet** (it's proposed in CSS Images Module Level 4, not implemented anywhere as of this check) — the real-world technique is to **stack several `radial-gradient()` calls, each anchored at a different position and faded to transparent**, over a solid base color:
```css
/* Soft mesh: pink, peach, lilac */
background:
  radial-gradient(at 20% 20%, #fbcfe8 0px, transparent 50%),
  radial-gradient(at 80% 0%,  #fde68a 0px, transparent 50%),
  radial-gradient(at 0% 80%,  #c4b5fd 0px, transparent 50%),
  #fff7ed;

/* Aurora mesh: cyan, indigo, magenta on a dark base */
background:
  radial-gradient(at 10% 10%, #06b6d4 0px, transparent 50%),
  radial-gradient(at 90% 30%, #6366f1 0px, transparent 50%),
  radial-gradient(at 50% 90%, #ec4899 0px, transparent 50%),
  #0f172a;
```
Each `radial-gradient(at X% Y%, color 0px, transparent 50%)` is one "paint blob"; 3-4 of these layered at different positions is enough to read as a mesh rather than a simple gradient. **Chrome 138 (Feb 2026) enabled OKLCH color interpolation for gradients by default** — this specifically removes the muddy gray midtones that made earlier (sRGB-interpolated) mesh gradients look cheap; prefer `oklch()` color values in the stops when targeting browsers that support it, falling back to the hex/rgb values above otherwise. A documented real-world result: one SaaS analytics client's mesh-gradient hero outperformed a flat-color hero by 22% on demo signups — treat this as one case study's number, not a guaranteed lift, but directionally consistent with the "vibrant color as attention strategy" premise above.

## Technique 2: grain/noise overlay — what keeps a vibrant gradient from looking like a cheap PNG
A smooth, large-area gradient commonly shows visible color banding on real (8-bit) displays — distinct bands instead of a smooth blend. A thin layer of noise "dithers" those bands invisible, the same trick used in film and game rendering, and is also what separates a 2026 "grainy gradient" from the flatter, more plastic-looking gradients of a few years ago. Pure CSS/SVG, no image request:
```css
.grainy {
  position: relative;
  isolation: isolate; /* keeps the blend mode scoped to this element */
  background: linear-gradient(120deg, #f4d7fb, #efae8f); /* or a mesh gradient */
}
.grainy::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  pointer-events: none; /* never block clicks on real content underneath */
}
```
The `feTurbulence` SVG filter generates the fractal noise; `mix-blend-mode: overlay` is what makes it read as texture on the gradient rather than a visible gray rectangle on top of it. **Tune by feel, not by a fixed number:** opacity in the 0.03-0.12 range is the common working band — the grain should be visible as texture on close inspection and essentially invisible as individual dots at normal reading distance; 0.35 (as in the snippet above) is on the strong/stylized end, dial it down for a subtler effect. Always set `pointer-events: none` on the grain layer — it's decoration stacked on top of real content, never meant to intercept input.

## Technique 3: duotone — two colors, one strong statement, from a single photo or illustration
Duotone maps an image's existing tonal range (shadows → highlights) onto exactly two chosen colors — traces back to print, now achievable in pure CSS via `mix-blend-mode`/`filter` with no image-editing step. **The color-pair rule that actually determines whether it looks vibrant/intentional vs. muddy: use two colors far apart on the wheel, one noticeably darker (mapped to shadows) and one noticeably lighter (mapped to highlights)** — documented strong pairs: navy + peach, deep purple + neon green, crimson + cream. Converting the source image to grayscale first (so the duotone colors only ever blend with neutral tonal values, never fighting an existing hue in the photo) is what keeps the result clean and vivid rather than muddy. Good fit for: a single hero image/illustration that needs to lock into the rest of a vibrant palette exactly, campaign/social graphics, anywhere visual cohesion across many different source photos matters more than preserving each photo's original color.

## Technique 4: organic blob shapes — the soft, non-geometric background shape vibrant/dopamine design pairs with
Vibrant mesh gradients and flat geometric grids read as two different design languages — blob shapes (smooth, randomized, non-polygonal) are the shape vocabulary that actually pairs with the organic feel of a mesh gradient, and the common way to add depth/visual interest to a hero or section background without photography. Generated algorithmically (randomized points around a circle connected with smooth curves — more "complexity" = more curve points, more "randomness" = wilder point placement), **exported as SVG or a CSS `clip-path`** so it stays resolution-independent and editable, never as a raster PNG cutout. Use a generator for the base shape (named tools exist for this — see Where to read more) rather than hand-drawing bezier paths; fill the blob with a mesh gradient from Technique 1 for the signature current "soft organic color field" look, or a flat saturated color for a punchier, more graphic effect.

## Keeping a vibrant palette accessible — vibrant and accessible are not in tension if built in this order
1. **Pick the vibrant colors for mood/brand first, then test each against both white and black text** on a contrast checker — a saturated color that fails 4.5:1 against both isn't usable for text-bearing surfaces at all and needs a lightness adjustment (not a hue change) before it goes further into the palette.
2. **Desaturate your "neutrals" slightly toward the brand hue rather than using flat gray** (the same saturate-your-neutrals rule from `color-selection-reference.md`'s Hobday-rules section) — this is what keeps a vibrant palette's supporting grays/surfaces feeling like part of the same system instead of a generic UI gray dropped onto a bold brand.
3. **Reserve the single most saturated, highest-contrast color for the one thing that must convert** (the primary CTA) — vibrant design still needs a 60-30-10-style hierarchy underneath it; "everything is equally loud" is the same failure mode `color-selection-reference.md` already names for a maximally-saturated palette, dopamine design doesn't repeal it.
4. **Balance saturated hues with real neutral space** (white/black/gray fields between the vibrant elements) — the vibrancy reads as more intentional, not less, when it has visual room around it; wall-to-wall saturation everywhere reads as noisy rather than bold.
5. Run the full color-blindness check from `color-selection-reference.md` (grayscale pass, simulator check, never color-alone meaning) — vibrant palettes often lean on multiple adjacent saturated hues for different roles, which is exactly the situation where a color-blind user is most likely to lose a distinction a fully-sighted designer can see clearly.

## Tools that actually generate palettes algorithmically, confirmed how each works
- **Coolors:** traditional color-wheel-rule generation (not AI/ML) with an extremely fast spacebar-driven workflow — the right tool for quickly generating many harmonious candidate palettes to react to.
- **Khroma:** trains a small neural net on 50 colors you pick as a starting preference, then generates combinations predicted to match your taste, with built-in accessibility ratings per combination — useful when a client has a vague "I like these colors" starting point rather than a brand spec.
- **Huemint:** ML-generated palettes specifically optimized for brand/web/graphic contexts, previewed directly on mockup templates so the palette is judged in context rather than as isolated swatches — closer to the right tool when the deliverable is a brand palette, not just an aesthetic exploration.
None of these replace the rules above (contrast checking, semantic tokens, the 60-30-10 structure) — they generate *candidates* faster; the review and accessibility pass is still a manual step after.

## Named references for the technique, not the look (per this knowledge base's standing no-copying rule)
**Stripe's** diagonal, animated mesh gradient (orange → pink → magenta → violet → blue) sweeping behind a hero, against a clean white canvas with a single saturated purple brand anchor — study this as a worked example of Technique 1 plus the "vibrant accent on a mostly-neutral canvas" accessibility rule above, never copy its exact hue sequence or animation. **Spotify's** 2014-2015 rebrand deliberately chose one balanced, mid-saturation green (#1DB954) as a single consistent brand anchor rather than a shifting multi-color gradient — the lesson to take is the opposite pairing strategy: one confidently saturated signature color, used everywhere, rather than a varying mesh — pick whichever of the two strategies (Stripe's shifting mesh vs. Spotify's single fixed hue) fits the brand's actual personality, don't default to one because it's trendier.

## Where to read more (name, do not paste)
instantgradient.com's grainy-gradients writeup (the feTurbulence/data-URI technique, Technique 2 above); MDN's "Using CSS gradients" doc (the `radial-gradient()`/`linear-gradient()` primitives underlying Techniques 1); w3.org CSS Images Module Level 4 draft (for checking whether native `mesh-gradient()` has shipped since this check); the MagicPattern, Haikei, and CodeShack SVG blob generators (Technique 4, tool docs — read for current export options, not technique theory); img.ly and webdesign.tutsplus.com's duotone writeups (Technique 3, blend-mode specifics); coolors.co, khroma.co, huemint.com (the three palette generators, read each tool's own "how it works" page before recommending one for a specific brief); techwyse.com's and similar 2026 "dopamine design" trend pieces (for checking whether this is still the live trend by the time this file is read — trend pieces age fast, re-verify before treating any specific year's trend claim as current).


---

<!-- references/scroll-scrub-and-shader-reference.md -->

# Web designer: scroll-scrubbed frame sequences, portal parallax, shader backgrounds, spotlight reveals

Surveyed from scrolltide.co (a template/prompt marketplace for AI-built sites — fetched 2026-10-06, both its product catalog and its Academy tutorials) because its whole catalog is a working taxonomy of exactly the techniques this specialist chooses between. Treat it as a technique and vocabulary source, never as a look to copy — the lesson here is the mechanism and the naming precision, not any one site's visual identity ([[bridgemind-functional-not-visual]], [[archify-workflow-reference]]: copy structure, not look). Complements `scroll-animation-reference.md` (CSS scroll-timelines and GSAP ScrollTrigger) and `3d-web-reference.md` (Three.js/glTF scenes) — this file covers the techniques neither one does: canvas frame-scrubbing, flat-layer portal parallax, fullscreen GPU shader backgrounds, and cursor-spotlight reveals.

## Canvas frame-scrubbing — the "video that scrolls" technique

A short clip (AI-generated or filmed) is exported as a numbered still-image sequence, and the scroll position selects which frame to draw. This is a *frame problem, not a video problem* — once every frame is decoded and in memory, playback cost is just drawing one image per scroll tick, with no video decoder in the loop at all.

**Exact mechanism:**
1. Export the clip to **zero-padded numbered stills** (`frame-001.webp` … `frame-192.webp`), never rely on filename-default sort order.
2. **Format: WebP, not JPEG/PNG** — it is the only common format giving PNG-grade edge quality at roughly JPEG-grade file size, which matters because every frame adds to the page's total weight.
3. **Frame count is chosen for the scroll distance, not left as an export default.** Pick the count so it divides cleanly into the pinned scroll range — "the last frame lands exactly as the pin releases." Baseline: **60–120 frames for a section-length scrub**; a full character/product sequence that needs to read as genuinely continuous can run to 300 frames (one surveyed build: a 10s/30fps source clip → 300 stills). Start low, add frames only if stepping is visible on scrub — don't default to the source video's native frame rate.
4. **Preload every frame before the section enters the viewport.** This is the one non-negotiable: scrubbing with frames still arriving over the network reads as broken, not slow.
5. **Draw to a `<canvas>`, never swap `src` on an `<img>`.** Swapping `img.src` re-triggers decode/layout cost per frame and shows visible flicker; a canvas `drawImage()` call per scroll tick does not.
6. **Pin the section** (GSAP `ScrollTrigger` `pin: true`, or an equivalent sticky-positioning setup) so the sequence plays out while the viewport holds still — "scroll is just an index into an array," and that only reads correctly if the array's visual target isn't also moving on its own.
7. Map scroll progress (0–1 within the pinned range) to an integer frame index, clamp, `drawImage()`. No animation library is required for the mapping itself — the complexity is in steps 1–4, "the code is almost an afterthought" once frames are ready.

**For a seamless *looping* source clip** (ambient background motion rather than a scroll-scrubbed narrative): generate the source video with **identical start and end frames** so the model's motion travels out and arrives back exactly where it began — "the loop is seamless by construction rather than by luck," with nothing to snap between because the first and last exported stills are literally the same file.

**When to reach for this vs. the techniques in `scroll-animation-reference.md`:** frame-scrubbing is for *content that only exists as footage* — a product demo, a character/garment turning, a generated motion clip — where GSAP/CSS timelines would be animating a DOM element, not stepping through pre-rendered frames. If the content is already a DOM element (text, a card, a layout block), use scroll-timelines/ScrollTrigger instead; don't render a frame sequence to fake what a `transform`/`opacity` keyframe could do directly.

## Flat-layer portal/parallax — fake depth without a 3D engine

A "3D portal" or walkthrough effect built from **ordinary 2D assets, not a WebGL scene**: separate the shot into depth layers as distinct image files (e.g. background environment, a transparent-PNG portal/door, foreground elements like clouds on transparency), then move/scale each layer at a different rate as the page scrolls. Depth is read purely from the *relative* motion between layers — "only possible if they are separate files," because a single flattened image has no layers left to move independently.

- Convention: nearest layer moves/scales **fastest**, the mid layer (the portal/door itself) **medium**, the furthest background **slowest**.
- Implementation is CSS `transform` (`scale`/`translate`) per layer driven by a scroll listener, not a 3D engine — reserve actual Three.js/R3F (per `3d-web-reference.md`) for scenes that need real camera movement or lighting, not a flat parallax illusion.
- **Expose the per-layer speed multipliers as tunable parameters**, not hardcoded magic numbers — trackpad and mouse-wheel scrolling produce very different scroll-delta profiles, and getting the depth illusion right means retuning per input device, which is only practical if the rates aren't buried in the math.
- The generation difficulty is in producing layers that agree with each other in perspective and lighting at the seams — same lesson as the spotlight technique below: the asset prep is the hard part, the transform code is simple once the layers are right.

## Spotlight/cursor-reveal — mask-driven, not two full re-renders

A circular "window" follows the cursor and reveals a second image underneath the first — used for before/after, X-ray/wireframe, or hidden-detail reveals.

**Exact mechanism:** two images stacked, pixel-identical in pose/lighting/framing (this alignment is the actual hard part — "slightly different is fatal here," since any mismatch in the two source images reads as a glitch, not a reveal). The top layer carries a CSS mask with a radial-gradient "hole" centered on live cursor coordinates (`mask-image: radial-gradient(...)`, updated on `pointermove`), exposing the layer beneath through the hole.

- **Starting values to tune from:** ~260px radius, fade beginning at ~40% of that radius inward (i.e. a solid core out to 40% of the radius, then a feathered falloff to the edge) — a soft-edged gradient "reads as light," a hard-edged circle reads as a cutout mask, which breaks the illusion.
- Track the cursor with a `pointermove` listener updating CSS custom properties consumed by the mask gradient — don't re-render React state on every pointer move (same main-thread-cost principle as `fluid-interaction-reference.md`'s gesture-physics guidance); mutate the custom property directly.
- Order of effort: get the two source images pixel-aligned first, then the mask/tracking code is close to trivial — don't spend build time on the CSS before the image pair actually agrees.

## Fullscreen GPU shader backgrounds — the taxonomy, so a build order can name one precisely

A distinct technique from both the Three.js scenes in `3d-web-reference.md` and the gradient/mesh backgrounds a designer might reach for by default: a **fullscreen fragment shader** rendered as a background layer, animated continuously on the GPU. Pitch, from the surveyed catalog: "these run on the GPU, loop seamlessly, and weigh nothing next to a video" — the performance case for a shader background over a looping MP4 is that it's procedural (no frame data to stream) rather than merely "prettier."

**Named categories worth knowing by name** (so a build order can specify one instead of "some kind of animated background"):
- **Gradient / gradient-mesh** — soft multi-color blend, slow drift, no hard edges.
- **Swirl** — rotating ribbon/stream patterns (a tide/vortex motif reads as motion with direction, not random noise).
- **Metal** — reflective-surface shaders (brushed, chrome, oil-slick) — reads as material, not color.
- **Halftone** — dotted print-style effect, often monochrome or duotone — reads as texture/print, deliberately low-fi against a clean UI.
- **Flame** — fire-like particle/noise motion — high-energy, warm-palette use only.
- **Aurora** — vertical light-curtain effect — soft, large-scale, slow.
- **Voronoi / cellular** — mosaic/cell-boundary patterns from a Voronoi noise function — reads as organic/biological or crystalline depending on palette.

**Delivery formats to choose between**, each with a different cost/flexibility tradeoff:
- **Live React/WebGL component** — real GPU shader, zero fixed asset weight, fully responsive to viewport size, but needs a WebGL context and the same `prefers-reduced-motion`/pause obligations as any other continuous motion (WCAG 2.2.2, already covered in `scroll-animation-reference.md`'s accessibility section — a shader background is motion like any other and isn't exempt).
- **Looping MP4** — simplest to drop in, fixed file weight, doesn't adapt to arbitrary viewport sizes without cropping.
- **Static still** — the reduced-motion fallback, or a social-preview/OG-image source — always generate one alongside the animated version rather than treating the fallback as an afterthought.

Pick the live component by default for anything that needs to resize fluidly or that's load-bearing for brand identity; fall back to MP4 only when a live WebGL context is a genuine constraint (e.g. a context budget already spent on a foreground 3D scene).

## Naming and description precision — the actual transferable lesson

Across the whole surveyed catalog, every item's one-line description names the *exact mechanism*, not a mood word: "registered CSS properties, with no per-frame JS" (a button), "canvas-based frame scrubbing" (a hero), "no animation library anywhere in the dependency list" (a template), "generative rather than literal — something forming rather than something finished" (a motion concept tied to a specific creative brief, not a generic adjective). Apply this to BUILD ORDERS: name the technique and the exact mechanism ("view-timeline with animation-range: entry, CSS mask radial-gradient tracking pointermove," not "a nice hover effect"). A build order that could describe three different implementations hasn't actually specified one.

## Where to read more (name, do not paste)
scrolltide.co/templates (the template catalog, naming conventions and one-line technique descriptions); scrolltide.co/shaders (the shader taxonomy above); scrolltide.co/academy (the tutorial set this file's frame-scrubbing, portal-parallax and spotlight mechanics were drawn from — lesson titles: "scroll-scrubbing video animation," "300-frame scroll character site," "perfect loop AI video scroll frames," "3D portal scroll effect," "spotlight hover-reveal effect"); this project's own `scroll-animation-reference.md` (CSS/GSAP scroll techniques this file deliberately doesn't repeat) and `3d-web-reference.md` (real 3D scenes vs. the flat-layer parallax fake above).


---

<!-- references/commercial-product-presentation-reference.md -->

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


---

<!-- references/web-craft-doctrine-reference.md -->

# Web designer: studio doctrine, with measured commercial palettes

Distilled 2026-10-08 from three installed sources read in full or by section: impeccable 4.0.2 (SKILL.md, new-work.md, craft-floor.md, overdrive.md, colorize.md), taste-skill (sections 4.8, 5, 10) and ui-ux-pro-max (its 192-row palette CSV, inspected and mostly REJECTED, see 3). Colour numbers in 3 are computed styles read from the live pages, not remembered. Where a source rule conflicts with an operator rule already in `web-director.md`, the conflict is named instead of silently picked.

## 0. Why this file exists
The operator's complaint (2026-10-06 and 2026-10-08): coffee-brand pages came out as lectures (a graph, a simple fade, no product, no colour). Root cause found by reading the references: `web-designer-behavior.md` (scan patterns, Hick's law, "marketese", banner blindness) is research for pages people OPERATE or READ. It was being applied to pages people are PERSUADED by. Decide the mode first (1); only then pick which rules govern.

## 1. Visitor mode: choose one, write it in CONCEPT
- **Persuade**: the visitor decides and acts, design is the product (landing page, campaign, product or brand site, pricing). Governed by `commercial-product-presentation-reference.md` and this file. Colour: Committed, Full palette or Drenched. The UX laws in `web-designer-behavior.md` become CHECKS (contrast, hit areas, Core Web Vitals, reduced motion), never reasons to cut the product shot, mute the colour or add explanatory copy.
- **Operate**: the visitor completes a task (app UI, dashboard, editor, settings). Scanability, consistency and native expectations outrank expression. Restrained colour is correct here.
- **Read**: the visitor understands something (docs, articles, changelog). Structure for comprehension first.
- **Experience**: the visitor is inside the work (portfolio, gallery, showcase). The artifact leads from the first viewport.
Mode follows the SURFACE, not the product: a tool's landing page is Persuade, a fashion house's docs are Read.

## 2. Colour: pick a strategy before any hex
**Restrained** (neutrals plus one accent; right for Operate and Read) / **Committed** (one saturated colour owns 30 to 60% of the page) / **Full palette** (3 or 4 named roles) / **Drenched** (the surface IS the colour). A Persuade surface is never Restrained unless the brief pins it. Colour commits at page scale: fields that own whole regions, not accents on a neutral ground.
- Derive neutrals and secondary text from the surface hue; never washed-out generic grey on a coloured field.
- Light or dark is never a category default. Write one sentence of physical scene (who, where, under what light) and let it decide.
- New palettes in OKLCH; lower chroma near white and black. Roles, not swatches: canvas, text, action, border, status, data.
- A flat committed pink, magenta or purple field is legitimate (poppi, 3). What `site-standards.ts` blocks is a purple-to-pink GRADIENT, the AI cliche. Keep the two apart.

## 3. Measured commercial palettes (live pages, 2026-10-06 and 2026-10-08)
Method: `elementFromPoint` on a 20x16 grid over the first 1440x900 screen, walking up to the first opaque background; photo, video and canvas counted as MEDIA. Image-based fields (Taco Bell's green pattern) are not captured as hex. Cookie banners distort some pages (Skittles).
| Brand | Committed colour and ground | Accent and CTA | Type | First screen |
|---|---|---|---|---|
| Burger King | cream ground (seen, hex not sampled) | headline `#502314`, CTA `#D62300` full pill (radius 9999px) | Flame-Bold 60px, 4-word headline | one burger photo, 135 words on the whole page |
| Coca-Cola scroll concept (Sitasys, Webflow) | Drenched `#ED1C16` plus a white ribbon | white headline | Montserrat 64px | red field, 2 images, 195 words |
| Jupiter soda concept (Sitasys) | ground `#1C1A1B`, solid type `#943C20` | cream outline type `rgb(238,227,211)` | outline display 168px at 1px stroke, solid 156px | bottle over giant type, 131 words |
| poppi | charcoal `#38383F` 25%, magenta `#EC008C` 13%, yellow `#FFF200` 6% | yellow pill with magenta text; lime `#BCFF00` pill with `#3E8549` text; coral `#F26B6B` with `#8E0011` | display face, 999px pills | 56% photography |
| M&M'S | peach `#FFD0B1` 51% | brown `#5A1F06`, yellow `#FFD200` | rounded display | 24% photography |
| Skittles | orange `#F15922` field | purple `#5C2D91` buttons, radius 2 to 8px | white 64px headline | orange field with product |
| Taco Bell | saturated green pattern field | CTA `#4F1B95`, radius 2px, white text | BrandonGrotesque-Black 42px uppercase white | large cut-out product over the field |
What they share, and what to copy as method (never as a skin): the first screen is a quarter to over half product media; ONE committed colour field with ONE complementary action colour (green and purple, magenta and yellow, red and cream); CTA shape is a brand decision (pill at BK and poppi, near-square at Taco Bell), never the library default; headlines are 2 to 5 words in a heavy or custom face; no chart, no process story, no paragraph above the fold.

## 4. Concept discipline (impeccable new-work, adapted)
- Name the product's one mechanism, the audience's real scene, and the **rut**: the page this category always ships and its predictable opposite. Exclude both before generating candidates. Coffee's rut is dark brown, cream, a serif display face and tracked mono labels.
- List seven candidate worlds from the audience's whole visual culture (packaging, signage, menus, posters, screen traditions), spanning at least three material families. When more than three share one family, you stopped at the obvious artifact.
- Calibration: unprompted, AI output clusters into (a) warm cream ground, high-contrast serif, terracotta or red accent; (b) near-black with one neon accent and glowing edges; (c) editorial hairlines, italic serif, small tracked mono. Landing in one of them on a free brief means the self-check failed. Test: if someone could guess your look from the category alone, rework.
- A pinned brief wins over all of this.

## 5. Contract before code
Write it as an HTML comment in the emitted markup, at most 150 words, five blocks: THESIS (the one idea and the default it refuses), OWN-WORLD (palette and components, recognisable with the content removed), STORY (what the visitor understands, believes and does), FIRST VIEWPORT (exact composition, scale, where the action sits), FORM (the chosen device and the seed or reasoning). The end review audits the render against it. A block that reads like a mood is not decided.

## 6. Craft floor additions (not in `anti-slop-checklist-reference.md`)
- Refuse as page structure: same-size icon plus heading plus text cards; the hero-metric template (big number, small label, supporting stats); nested cards; gradient text; a coloured `border-left` or `border-right` over 1px on cards or callouts; glass or blur as decoration; sparklines and progress rings standing in for content; monospace as a costume for "technical" (use it for code, data and measurement only); section numbers; an eyebrow over every section.
- Type: body 65 to 75ch, tracking floor -0.04em, balanced headings. impeccable caps display at 6rem. CONFLICT, resolved: giant type is a deliberate Persuade device (Jupiter 168px, Nopal) and is allowed as the page's ONE authored moment, measured at every breakpoint; ordinary headings obey the cap.
- Shadows carry offset and soft blur; a zero-offset coloured halo is decoration.
- Motion: one authored moment, not the same entrance on every section; exponential ease-out from a visible default. impeccable also allows blur, backdrop-filter, clip-path and mask. CONFLICT, resolved: scroll-SCRUBBED motion stays transform and opacity only (`web-director.md` T22); clip-path or mask reveals are allowed for one-shot entrances when they hold 60fps.
- Replace nothing with chrome: gradients, glass and icon tiles where an authored asset belongs are the gap showing.

## 7. Assets: the order, and what is never allowed
1. An image or video generation tool when the environment has one (for example fal.ai media via MCP: Nano Banana images, Seedance, Kling or Veo video). Generate at the section's real aspect ratio. Visualise the locked direction first when a tool exists: three compositions, pick one.
2. A real, verified photograph: Openverse CC0 first. Search for the physical object, not the category. One decisive photo beats five mediocre ones. Fetch every URL once to confirm it resolves; some CDNs need a browser User-Agent and Referer.
3. A live render with real geometry, real materials and at least two lights (`web-director.md`, no-photography section).
4. A clearly labelled placeholder slot and a replacement list in the final message.
NEVER: a flat vector illustration standing in for the product (the weakest element of the 2026-10-08 coffee demo was an SVG mug), or div-built fake screenshots.
Truth binds CLAIMS, not demonstrations. Author synthetic demonstration content at full fidelity and label it. Never invent prices, customers, benchmarks, certifications or provenance ("single origin", "roasted on site", "est. 2019") for a real brand; on a fictional demo mark them as placeholders and list them.

## 8. Verify in bounded passes
Build completely, then ONE batched screenshot round with desktop and mobile together, fix everything it shows, and at most one more round. Per-tweak screenshots burn money without raising the bar. The reviewer is a separate pass from the builder. Unattended work never stops to ask: choose, and write the assumptions into the contract.

## 9. Technique toolkit when the page must feel extraordinary (impeccable overdrive)
View Transitions API (same-document in all browsers; cross-document not in Firefox), `@starting-style`, `@property` for animating gradients and colours, scroll-driven animations behind `@supports` with a static fallback, Web Animations API, SVG filter chains, OffscreenCanvas and WebGL (OGL for light builds, three.js for scenes), spring physics (motion or GSAP). Every one degrades to a page that still looks good. Pause off-screen rendering, initialise heavy contexts only near the viewport, test on a mid-range phone. Four checks before shipping: the wow test (someone unprimed reacts), the removal test (does anyone notice it gone), the device test, the context test (right for THIS brand).


---

<!-- references/design-formats-positioning-reference.md -->

# Web designer: layout formats, element positioning and the behaviour behind them

Checked 2026-10-09 against pages read that day: Interaction Design Foundation's Gestalt principles article, NN/g on proximity and on preattentive processing (via a mirror citing Colin Ware's *Information Visualization*), Cialdini's own influenceatwork.com, BJ Fogg's behaviormodel.org (and its /ability and /prompts pages), Wikipedia's peak-end rule entry (citing Kahneman, Fredrickson, Schreiber & Redelmeier 1993), and a web search surfacing Singh's color-marketing review and the Gutenberg diagram (Edmond Arnold). This complements, and does not repeat, `web-designer-behavior.md` (NN/g scanning and heuristics), `web-craft-doctrine-reference.md` (visitor mode and colour strategy) and `color-selection-reference.md`.

## 1. Gestalt grouping: why a layout reads as "sections" before anyone reads a word
A visitor groups elements before they process meaning. Six laws, each with a direct layout use:
- **Proximity**: "items close together are likely to be perceived as part of the same group" (NN/g). This is the actual mechanism behind every "more space between sections than within them" rule already in this project. NN/g's own fix for a long form: break 12 fields into three groups of 4 — it reads as less effort even though it is the same 12 fields.
- **Similarity**: elements sharing a visual trait (colour, shape, size) read as one kind of thing. Every button styled identically is why visitors recognise the next one as clickable without being told.
- **Continuity**: the eye follows a line or curve and expects it to continue; an aligned grid is readable for this reason, not just because it looks tidy.
- **Closure**: the eye completes a gapped shape into a whole (the IBM and WWF logos are the standard examples) — a partial shape can imply a logo or icon without the cost of drawing it in full.
- **Figure-ground**: the eye separates a foreground subject from its background unless the image is deliberately ambiguous; light text on a dark photo works because the contrast resolves which is which.
- **Common region**: a shared boundary (a card, a panel) groups whatever is inside it, stronger than proximity alone — this is the real reason a "card" reads as one unit even when its internal spacing is loose.
- **Prägnanz** (the summarising law): the eye resolves ambiguous or complex forms into the simplest, most orderly interpretation available — a centred, symmetrical layout reads as "intentional" partly because it is the simplest resolution.
Use: before adding a border, a background tint or a rule to show "these belong together," check whether proximity or common region already does it for free — the extra chrome `anti-slop-checklist-reference.md` already warns against (a colour side-stripe, a nested card) is frequently a Gestalt grouping problem solved the expensive way.

## 2. Preattentive attributes: what the eye catches before it is "looking"
Colin Ware (*Information Visualization: Perception for Design*) names the visual properties the eye and brain process in under 500 milliseconds, before conscious attention — colour (hue, intensity), form (size, shape, length, orientation, curvature, grouping), movement (flicker, motion) and spatial position (2D position, depth, concave/convex). A hierarchy built from these reads instantly; a hierarchy built only from font-weight differences (not preattentive on its own at reading distance) makes the visitor work for it. Practical order of strength for "what gets seen first" on a page: a moving element, then a strong size or colour-saturation jump, then position (top-left/centre), then everything else. This is the mechanism behind the "one strong colour, everything else restrained" rule in `web-craft-doctrine-reference.md`: a page with five saturated colours competing has no preattentive winner, so nothing gets seen first.

## 3. Gutenberg diagram: where the eye travels on a sparse, visually-led page
Named by newspaper designer Edmond Arnold. On a page with no strong text column (the Z-pattern case already in `web-designer-behavior.md`, not duplicated here), the eye's default path across evenly-distributed content is four quadrants: **primary optical area** (top-left, where the eye starts), **strong fallow area** (top-right, seen but weakly), **weak fallow area** (bottom-left, often missed entirely unless something pulls the eye back to it), **terminal area** (bottom-right, where the eye settles and the "final action" belongs). The path from primary to terminal is called **reading gravity**. Template rule: the logo or opening claim goes in the primary optical area, the primary CTA in the terminal area; the weak fallow area (bottom-left) is the wrong default spot for anything that must be seen — if something important must sit there, give it independent visual weight (size, colour, isolation) to pull the eye off the gravity path. This is the print-design ancestor of "CTA bottom-right" conventions in modern hero layouts, and it is a *default*, not a rule for text-dense pages — those follow the F-pattern instead.

## 4. The Fogg Behavior Model: why a call to action does or doesn't get clicked
`B = MAP`: "Behavior happens when Motivation, Ability, and a Prompt come together at the same time" (BJ Fogg, behaviormodel.org). When a wanted action doesn't happen, exactly one of the three is missing — diagnose which one before changing the design:
- **Motivation** is low: the page hasn't yet made the visitor want the outcome. Fix with the persuasion devices in section 5, not with a bigger button.
- **Ability** is low: the action costs too much of the visitor's scarcest resource right now. Fogg: "simplicity is a function of your scarcest resource at that moment" — commonly cited as six factors (time, money, physical effort, mental effort, social deviance from habit, how well it fits the visitor's routine; this session confirmed time and money by Fogg's own wording, the other four are the widely-cited remainder of his model, not independently re-verified here). Fix with a shorter form, fewer fields, a recognisable pattern, not a louder CTA.
- **Prompt** is missing or badly timed: the model names three kinds (confirmed by name at behaviormodel.org/prompts: Facilitator, Signal, Spark), illustrated there by a highly visible "sign in" button acting as a **Facilitator** — a prompt for someone who already has motivation and ability, placed where it removes the last friction. (Signal and Spark are the model's other two prompt types, for low-ability and low-motivation visitors respectively, by the model's own naming convention; their exact definitions were not independently confirmed this session.)
Template application: a hero CTA is a Facilitator prompt and only works when motivation and ability are already high (a returning or informed visitor); a cold visitor on a Persuade page needs the motivation built first (the proof and the demonstration `commercial-product-presentation-reference.md` already calls for) before the same button will convert.

## 5. Cialdini's seven principles of persuasion
From Cialdini's own organisation (influenceatwork.com), confirmed by name and one-line definition: **Reciprocity** (people return what they receive — a free sample, a free tier), **Scarcity** ("people want more of those things they can have less of" — a real stock count or a real deadline, never an invented one; `web-designer-behavior.md`'s deceptive-patterns section already bans a fake one), **Authority** (people follow credible, knowledgeable experts — a named credential beside a claim, not a generic "expert-approved" badge), **Consistency** (people act in line with what they already said or did — a visitor who filled in step 1 is more likely to finish step 2 to stay consistent with themselves), **Liking** (people say yes to people they like — real photos and a real voice over a generic corporate one), **Social proof** / **consensus** ("especially when uncertain, people look to the actions and behaviours of others" — a specific, verifiable number beats a vague one, already the house rule for proof), **Unity** (added later: shared identity, "join fellow [X]," persuades beyond mere similarity). Template use: match the page's proof elements to a named principle instead of adding review stars by default — a B2B tool wants Authority and Social proof, a limited drop wants real Scarcity, a community product wants Unity.

## 6. Peak-end rule: what a visitor actually remembers afterward
Kahneman, Fredrickson, Schreiber & Redelmeier (1993): people judge a finished experience mainly by its most intense moment (the peak) and how it ended, not by the average of every moment in it — demonstrated with a cold-water experiment where subjects preferred a longer, overall-more-painful trial because it ended on a less painful note. For a page or flow: design one deliberate peak (the applause moment this project's `web-director.md` already asks for in a scroll story) and a deliberate close — a flat, evenly-paced page with no peak and a page that just stops are both leaving memorability on the table, independent of how good the middle was.

## 7. Colour and behaviour: what is supported and what is folklore
Singh's widely-cited marketing review (itself a review of retail environmental-psychology studies, not a single new experiment) reports that people form a judgement within about 90 seconds of first seeing a person or product, and that 62-90% of that snap judgement is attributable to colour alone, and separately that "functional" colours (black, grey, green, blue) read as more appropriate for functional products while "sensory" colours (red, yellow, pink, purple) read as more appropriate for sensory/experiential ones. Treat the 90-second/62-90% figures as a widely-repeated secondary citation, not an independently re-verified primary result this session. What this does NOT support: specific claims like "blue always means trust" or "red always increases appetite" as culturally universal facts — colour meaning is strongly context- and culture-dependent, which is why `web-craft-doctrine-reference.md` already derives colour from the product's own world and a written scene rather than a fixed colour-to-emotion table. Use Singh's functional-vs-sensory split as one input to the colour-strategy decision already required in that file, not as a standalone rule.

## Where to read more (name, do not paste)
ixdf.org's Gestalt principles and preattentive-properties articles; Colin Ware, *Information Visualization: Perception for Design* (the primary source for preattentive attributes); nngroup.com's proximity article; behaviormodel.org (Motivation, Ability, Prompts pages) and BJ Fogg's *Tiny Habits*; influenceatwork.com's 7 principles page (Cialdini); the 1993 Kahneman/Fredrickson/Schreiber/Redelmeier cold-water study ("When More Pain Is Preferred to Less: Adding a Better End," Psychological Science); Edmond Arnold's Gutenberg diagram (search "Gutenberg diagram reading gravity" for worked layout examples); Singh, "Impact of color on marketing" (Management Decision, 2006) for the colour-judgement figures, read as a review rather than a single experiment.


---

<!-- references/immersive-hero-motion-reference.md -->

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


---

<!-- references/mass-adoption-mechanics-reference.md -->

# What products with millions of users actually do -- reverse-engineered, dated 2026-10-18

Operator: "reverse engineer many things and websites that attract millions of people and see how they do it."
Researched against named products (Duolingo, Linear, Stripe, TikTok, Airbnb) rather than generic trend pieces.
Source quality is mixed by design of the research itself -- most of what's public on these products is blog/agency
commentary, not controlled studies, so every claim below says how solid it is. Use the solid mechanisms as real
technique; use the anecdotal ones as plausible direction to verify, not as fact to cite to the operator as settled.

## The one finding that overrides all the others
Duolingo's own retention lead (Jackson Shuttleworth, interviewed on Lenny's Newsletter) said it directly: **if people
don't already find inherent value in the product, a streak or any other engagement mechanic will not create that
value -- it only amplifies value that's already there.** Every mechanic below is an amplifier, not a substitute for
the product actually doing its job. A build that copies TikTok's variable-reward feed or Duolingo's streak UI onto a
product nobody independently wants yet is cargo-culting the amplifier without the thing it amplifies.

## Mechanism 1: habit loops reward ONE simple action, not a point system (solid -- named source)
Duolingo initially tied streaks to an XP threshold and it confused users; simplifying to "complete one lesson today"
made the mechanic work. **Rule for a build:** if you add a daily/return mechanic, gate it on the single action that
IS the product's core value (one lesson, one check-in, one send), never a composite score the user has to calculate
in their head to know if they're "on track."

## Mechanism 2: loss aversion beats gain framing (solid, well-established psychology; Duolingo's own copy test is named)
Duolingo found that changing a button's label from "Continue" to "Commit to my goal" measurably increased retention
-- framing the action as a commitment the user would LOSE by skipping, not a neutral "next step." Streak Freezes
(preserving a streak through one missed day) work the same way: forgiveness mechanics make the loss-aversion hook
sustainable instead of punishing, which keeps people from abandoning the whole habit the first time they slip.
**Rule for a build:** where a return mechanic exists, phrase the CTA as protecting/continuing something the user
already has, not just "do the next thing" -- and pair any streak/count mechanic with an explicit forgiveness path.

## Mechanism 3: a visible identity marker turns a private habit into a status signal (plausible, named example)
Duolingo gives a distinct app icon at a 30-day streak -- the mechanic becomes something OTHERS can see (on a home
screen), not just an internal counter. This is the same principle as a public leaderboard, a visible badge, or a
shareable streak graphic: a habit mechanic compounds faster once it has a visible, external form.

## Mechanism 4: variable reward + no stopping cue (solid psychology, contested specific-platform causation)
TikTok's feed (and infinite-scroll feeds generally) run on variable-ratio reinforcement -- the same schedule B.F.
Skinner found most persistent: the user can't predict which scroll will be the good one, so the behavior (scrolling)
keeps getting reinforced intermittently rather than every time. Removing an explicit "end of list" or "load more"
click removes the natural decision point where a user would otherwise ask "should I stop?" **Caution, not just a
technique to copy:** the EU's preliminary findings (ongoing investigation, not final) describe this combination as
designed to fuel "compulsive behaviour and reduce users' self-control" -- this is the single mechanism in this file
with the most direct ethical weight. Use variable-reward content ordering (mixing predictable and surprising results
in a feed) for genuine engagement; do NOT remove natural stopping cues (session-end screens, "you're caught up"
markers) on a product where unbounded engagement isn't actually good for the user -- that crosses from persuasive
design into a dark pattern, which the anti-slop and marketing-psychology knowledge in this project already treats
as a hard block.

## Mechanism 5: trust is carried by ONE photo more than by review volume (solid -- peer-reviewed, counter-intuitive)
Ert, Fleischer & Magen's published study on Airbnb found a host's PHOTO shaped guests' sense of trustworthiness and
booking/price far more than review scores did -- the peer-reviewed result found review scores had no measurable
effect on price or booking likelihood, which cuts against the common "show lots of reviews" advice repeated in
marketing blogs. Airbnb's own early growth move was replacing bad listing photos with professional photography,
reportedly doubling bookings in some markets within weeks (anecdotal, not peer-reviewed, but directionally
consistent with the photo-trust finding). **Rule for a build:** when a product's trust problem is "will a stranger
believe this is real/safe," invest in ONE excellent, real, human-containing photo before investing in a review
carousel -- this directly reinforces image-rules.md's existing ban on stock photography standing in for the real
thing: a real face/place photographed well is doing measurable trust work that a review-count badge is not.

## Mechanism 6: checkout/payment trust is visual simplicity + reassurance cues, not persuasion copy (vendor-sourced, directionally consistent with established checkout research elsewhere in this knowledge base)
Stripe's own guidance (vendor content, so read as informed opinion, not independent study) names exactly two levers
at the payment step: visual simplicity and trust cues (SSL/TLS badges, card-network logos, short reassurance copy,
a visible "secure checkout" signal), explicitly because by the time someone reaches payment, the job is removing
final doubt, not persuading further. This matches (does not contradict) the Baymard checkout-abandonment data
already in web-designer-behavior.md: extra costs and security concerns are top abandonment reasons, so the fix at
this specific step is REMOVING friction and doubt, not adding a sales pitch.

## Mechanism 7: category-defining aesthetic + organic network spread, not ad spend (mostly anecdotal/commentary -- treat as direction, not fact)
Linear is repeatedly cited (design blogs, a public case study claiming ~$35k lifetime marketing spend -- unverified
by this research, treat skeptically) as growing through people adopting it individually, then inviting their whole
team -- the same network-effect spread as Figma or Loom, where the product's VALUE is multiplayer, so one happy user
structurally creates the next ten. Its onboarding is described as deliberately calm (no celebratory flourishes, no
confetti) -- confidence signaled through restraint, consistent with this project's own anti-slop stance against
generic celebratory/gamified UI. **Caution:** several sources argue Linear's specific dark+purple, keyboard-first
aesthetic is now OVERSATURATED as every B2B tool copies it -- this is a argument for NOT defaulting to it (ties
directly to web-director.md's "Training on five different products showed the same... chosen every time" warning).
The transferable lesson is the MECHANISM (invite-driven spread from genuine multiplayer value, restrained onboarding
copy), not the Linear look itself.

## What this changes about how a build gets planned
Before CONCEPT in web-director.md, when the brief is for a product meant to retain or spread (not a one-time
brochure site), ask explicitly: (1) what is the ONE simple action this product wants repeated, (2) is there a
genuine multiplayer/network reason for one user to bring in the next, (3) what is the single highest-trust real
photo this product can show, and (4) where is the natural stopping point a user should be allowed to reach without
the product fighting it. A landing page can borrow the VISUAL vocabulary from mass-adoption products (restraint,
one real photo, one clear commitment-framed CTA); it should not borrow the retention mechanics (streaks, variable
reward, no stopping cues) unless the brief is actually building a retained-use product, and even then mechanism 4's
ethical caution applies.

## Sourcing note
Duolingo: Lenny's Newsletter interview with Group PM Jackson Shuttleworth (named, most authoritative source found).
Airbnb: Ert, Fleischer & Magen, "Trust and reputation in the sharing economy" (peer-reviewed); photo-doubling-bookings
claims are anecdotal secondary sources. Stripe: Stripe's own published checkout-design guidance (vendor content).
TikTok/infinite scroll: established behavioral-psychology literature on variable-ratio reinforcement, applied by
secondary UX commentary to TikTok specifically (platform-specific causation is asserted, not independently proven);
EU Commission preliminary findings are explicitly preliminary. Linear: design-blog case studies and commentary, no
primary financial or growth data independently confirmed.
