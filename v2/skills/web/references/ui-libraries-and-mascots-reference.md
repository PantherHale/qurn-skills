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
