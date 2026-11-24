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
