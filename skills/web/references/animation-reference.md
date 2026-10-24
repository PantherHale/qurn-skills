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
