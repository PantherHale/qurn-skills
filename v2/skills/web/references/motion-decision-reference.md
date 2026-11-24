# Motion decision -- should it move, how long, which curve, and when to take it out

`animation-reference.md` and `fluid-interaction-reference.md` cover how motion should feel. This file decides WHETHER and HOW MUCH, and gives the review and removal rules. Written 2026-11-24 from Emil Kowalski's public skills, ibelick's motion-performance and accessibility skills, iart's reduced-motion skill and public linter thresholds (studied in `research/web/`). Numbers are widely used starting values, not standards.

## 0. Which rules apply to which surface
The visitor modes in `web-craft-doctrine-reference.md` decide:
- **Operate and Read** (apps, dashboards, docs): the frequency rules below are strict. Motion explains state and feedback and stays under 300 ms.
- **Persuade and Experience** (landing, campaign, portfolio): one authored focal sequence may run long (500-800 ms entrances, scrubbed scenes). The rules about purpose, GPU-only properties, interruptibility and reduced motion still apply. Do not add perpetual micro-motion everywhere: one skill pack asks for it and another keeps UI under 300 ms; pick by mode, not by habit.

## 1. The four questions (ask in order, stop at the first "no")
1. **Frequency.** How often will one person trigger this? 100+ times a day (keyboard shortcuts, command palette, list navigation) = no animation, ever. Tens a day = remove or cut to a fade of 150 ms or less. Occasional (modal, toast, drawer) = standard. Rare or first-time (onboarding, a celebration) = delight is allowed. Anything started from the keyboard is never animated.
2. **Purpose.** Name one: spatial consistency (where did it come from), state change, explanation, feedback, or preventing a jarring jump. "It looks nice" is not a purpose on Operate surfaces.
3. **Budget.** UI motion stays under 300 ms. Exceptions: modals, drawers, sheets and toasts (200-500 ms), a deliberately authored focal entrance (500-800 ms), marketing scenes.
4. **Function.** Does the thing still work if the animation is skipped? Nothing waits on `animationend`, and no start state is left hidden.

## 2. Tool ladder (cheapest that works)
CSS transition -> `@starting-style` for entry -> CSS keyframes -> Web Animations API -> Motion/GSAP (springs, layout, exit, scroll scenes). CSS transitions are interruptible and retarget from the live value; keyframes are not, so do not use keyframes for anything a user can trigger quickly twice. Do not add a library for what the stack already does.

## 3. Easing and duration
| Use | Curve | Duration |
|---|---|---|
| Entering or exiting | ease-out: `cubic-bezier(0.23, 1, 0.32, 1)` | enter 200-300 ms, exit about 20% shorter |
| Moving on screen | ease-in-out: `cubic-bezier(0.77, 0, 0.175, 1)` | 200-300 ms |
| Drawer or sheet | `cubic-bezier(0.32, 0.72, 0, 1)` | 200-500 ms (a small floating drawer 200 ms) |
| Hover, colour | `ease` | 100-150 ms |
| Constant (progress, marquee) | `linear` | as needed |
| Press feedback | ease-out | 100-160 ms, `scale(0.95-0.98)`, on pointer-down |
| Tooltip, small popover | ease-out | 125-200 ms; after the first opens, siblings open instantly |
| Dropdown, select | ease-out | 150-250 ms |
| Modal | ease-out | 200-500 ms |
Never `ease-in` on UI (it feels late). Never `transition: all`. Never animate from `scale(0)`: start at `0.95` with `opacity: 0`. A popover scales from its trigger (`transform-origin`), a modal from the centre. Blur used to hide a crossfade stays at 2-5 px (never above 8 px if it animates, never above 20 px at all).
Springs: critically damped for most UI (no bounce); bounce 0.1-0.3 only when a gesture carried momentum (flick, throw, release). In Motion `{ type: "spring", duration: 0.5, bounce: 0.2 }`. Note Motion's `spring()` takes `duration` in milliseconds when called directly but seconds inside transitions. Use `visualDuration` when interruptions must keep velocity.

## 4. Choreography
- Roles: Lead (the thing the eye follows), Support, Decoration (fade only), Static. One entrance per container; never every card flying in from a different side.
- Stagger 30-80 ms per item, total under about 300 ms, only the first handful of items in a long list, and never uniform on a high-frequency list. Marketing steps 100-150 ms on 0.5-0.6 s entrances.
- Exits run together and mirror the entry direction; leaving items use `AnimatePresence mode="popLayout"` (or absolute positioning) so siblings close the gap while the exit plays.
- Duration by distance: `clamp(0.15s, deltaHeight / 500, 0.27s)`.
- Attention loops start about 2.5 s in, repeat about every 6 s and stop during interaction.
- Asymmetric timing for destructive holds: hold-to-delete 2 s linear while held, 200 ms ease-out snap-back on release.

## 5. Gestures
Two phases: **track** (position follows the pointer 1:1, no spring, no easing, no React state per move) and **release** (physics seeded with the release velocity). Rubber-band past the edge (`dragElastic` about 0.2). Dismiss at about 40-50% of travel or on velocity (distance / elapsed ms above about 0.11). Bounce only on drag release, none on a button-closed element, less for larger elements. Touch targets 44 px or more. Formulas for momentum projection and rubber-banding are in `fluid-interaction-reference.md`.

## 6. Performance rules for motion
- Frame budget 16.7 ms (8 ms at 120 Hz); design for a mid-range phone.
- Property tiers: composite-only (`transform`, `opacity`); paint (`box-shadow`, `border-radius`, `color`); layout (`width`, `height`, `padding`, `margin`, `top`, `left`). Stay in the first tier. Swap an animated `box-shadow` for an `opacity` change on a pseudo-element, or `filter: drop-shadow()`; swap growing `width`/`height` for `transform: scale()` plus FLIP; animate height-auto with `grid-template-rows: 0fr -> 1fr` (or `interpolate-size` where supported, see `platform-baseline-reference.md`).
- Never interleave layout reads and writes in one frame. Never drive animation from `scrollTop`, `scrollY` or scroll events (use ScrollTrigger, IntersectionObserver or `animation-timeline`). Every `requestAnimationFrame` loop has a stop condition and pauses off-screen.
- Do not animate CSS variables on a parent to move children (it re-resolves the subtree each frame); set `element.style.transform` directly or animate the child. `will-change` only while animating, and only after a measured problem.
- rAF-driven libraries (GSAP, Motion layout) run on the main thread; CSS and WAAPI can be accelerated. Motion's `x`/`y`/`scale` shorthand is accelerated only from 14.2.
- Diagnostic order when frames drop: which properties animate, is the page busy, is React re-rendering per frame, CSS-variable inheritance, blur over 20 px, `will-change`.
- Scrubbing `mask-image`, `clip-path` or a CSS custom property that feeds a gradient over a large image repaints every frame on the main thread; it is not compositor-only. For a reveal on a phone use a transform-only version (a clipped container with an inner `translate`, or a two-image crossfade), or give the paint-heavy version a low-tier fallback and a frame-time check on that section.
- Prefer downgrading the technique to deleting the motion (a blur becomes an opacity fade).

## 7. Reduced motion, in tiers (not "turn everything off")
| Tier | What | Under `prefers-reduced-motion: reduce` |
|---|---|---|
| 1 remove | parallax, large slides, big scale, 3D spin, auto-advancing carousels, smooth-scroll hijacking, scroll-jacked pins, motion paths, shader loops | removed; show the final state |
| 2 soften | entrances and crossfades | opacity-only, 200 ms or less, small distance |
| 3 keep | opacity and colour change, focus rings, spinners, essential motion | unchanged |
- A global safety net uses `0.01ms` (not `0s`) so `animationend`/`transitionend` still fire: `animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important`. Layer the tier rules over it.
- JS motion needs its own gate (GSAP `matchMedia`, Motion `useReducedMotion`/`MotionConfig`, do not start Lenis). OS settings can change at runtime: listen for the media query `change` event.
- Auto-playing motion longer than 5 s needs a pause control (WCAG 2.2.2). Related: WCAG 2.3.3 (animation from interactions) and technique C39. Also honour `prefers-reduced-transparency` with a solid panel, and gate hover effects with `@media (hover: hover) and (pointer: fine)`.

## 8. Reviewing motion (use this format when an order or a diff is reviewed)
One table, columns **Before | After | Why**, one row per issue; never a prose list. Escalate (block) when you see: `transition: all`, `scale(0)` entrances, `ease-in` on UI, animation on keyboard or high-frequency actions, UI over 300 ms with no reason, a popover scaling from its centre, keyframes on a rapidly retriggered element, layout-property animation, a parent CSS variable driving child transforms, ungated hover effects, symmetric hold timing. Fix in this order: delete, reduce, fix easing, fix origin, make interruptible, move to the GPU, asymmetric timing, polish, accessibility.

## 9. Removing motion (when the answer to section 1 is no)
Delete: anything triggered from the keyboard, anything 100+ times a day, charts and numbers that do not show a real value change, spinners and skeletons for operations under 300 ms. Reduce: hover to a 150 ms colour change; slide or scale entrance to opacity-only 150 ms; over 300 ms to 200-250 ms; stagger capped at 30 ms per item; infinite loop to a single run. Hazards when removing: a hidden start state (`opacity: 0`) left behind, code waiting on `onAnimationEnd`/`transitionend`/`setTimeout`, exits that held the unmount, layout animation that was masking a jump, focus moved after the motion.

## 10. Finding where motion is missing (cap the answer)
Propose at most 5-7 additions per surface, each passing the four questions, plus up to 5 rejected candidates with the question that killed each. Typical keepers: press feedback on primary controls, a popover from its trigger, a toast, a sheet, a number tween, a list reorder (Flip/layout).

## 11. CHECK lines
- `node scripts/slop-scan.mjs <src>` has no FAIL for `transition-all`, `raw-scroll-listener`, `autoplay-sound`.
- Every duration and easing in the source is one of the named tokens in the order (grep for stray `cubic-bezier(`).
- With reduced motion emulated, no tier-1 motion plays and nothing is hidden at rest.
- Chrome Performance panel over the scroll or the animation: no per-frame Layout or Paint, only Composite.
