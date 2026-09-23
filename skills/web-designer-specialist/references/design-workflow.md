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
