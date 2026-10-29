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
