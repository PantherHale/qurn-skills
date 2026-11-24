# GSAP and Lenis engineering -- how to build the scroll without leaks, jitter or broken pins

Read this when an order uses GSAP, ScrollTrigger, SplitText, Flip or Lenis. `scroll-craft.md` says WHICH technique to use; this file says how to build it so it still works after a route change, a font load, a phone rotation and React's double mount. Written 2026-11-24 from the official GSAP docs and skills, the Lenis docs, and public skill packs (studied in `research/web/`). Numbers marked (SV) are starting values from third-party skills, not standards: measure them on the build.

## 0. Licence and install
- `npm i gsap` (React also needs `npm i @gsap/react` for the `useGSAP` hook). Since 3.13 every plugin (ScrollTrigger, SplitText, MorphSVG, Flip, DrawSVG) ships in the public package. GSAP is under Webflow's "Standard No Charge" licence (NOT MIT). Commercial sites are fine. One restriction: do not build a tool that lets people animate visually without code if it competes with Webflow's animation builder without written consent. If the product is that kind of tool, stop and ask the operator.
- Register every plugin once before use: `gsap.registerPlugin(ScrollTrigger, SplitText, Flip)`. An unregistered plugin fails silently.
- Lenis package is `lenis` (the old `@studio-freight/lenis` is deprecated). Import `lenis/dist/lenis.css`. Check the current version on npm before pinning.

## 1. One clock
There is exactly one animation loop. Lenis plus ScrollTrigger:
```js
const lenis = new Lenis({ autoRaf: false })
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000)) // gsap time is seconds, lenis wants ms
gsap.ticker.lagSmoothing(0)
```
- Never `autoRaf: true` together with the ticker line, and never a separate `requestAnimationFrame` loop for Lenis.
- Lenis scrolls the real document, so ScrollTrigger needs no `scrollerProxy`. Use `scrollerProxy` (plus `pinType: "transform"`) only for transform-based scrollers such as Locomotive.
- One Lenis instance per scroll container. On unmount: `gsap.ticker.remove(fn)` and `lenis.destroy()`. Keep the ticker callback in a named variable (`const tick = (t) => lenis.raf(t * 1000)`) so the same reference is added and removed; an inline arrow cannot be removed.
- If Lenis or GSAP start asynchronously (after `document.fonts.ready`, or from a dynamic `import()`), guard the start with a cancelled flag set in the cleanup (`let cancelled = false; ... if (cancelled) return`). Otherwise React StrictMode's mount-unmount-mount, or a fast route change, leaves an orphan instance and a ticker callback that is never removed.
- Never let CSS and GSAP animate the same property on the same element (a CSS keyframe loop on `opacity` overrides GSAP's inline `opacity`, and the scroll-driven value never shows). Give GSAP a wrapper element and let the CSS loop run on the child, or drive the loop from GSAP too.
- A JS-enhanced start state (a lid that starts closed, a headline that starts hidden) must be applied before first paint, not after hydration: put a class on `<html>` from an inline script or set it in `useLayoutEffect`, and make the no-JS state the finished, readable one. Setting it in a late effect flashes the final state first.
- Use one smooth-scroll engine per site. Never Lenis and Locomotive together.
- Keep `respectReducedMotion` on (the default). Do not push smoothing past `lerp 0.05-0.15` or `duration 1-1.5s`; heavier feels laggy. (SV: `lerp 0.08`, `wheelMultiplier 0.9` for a cinematic page.)

## 2. Symptom table (Lenis with ScrollTrigger)
| Symptom | Cause | Fix |
|---|---|---|
| Jitter or double-speed | A second rAF loop, or `autoRaf` plus ticker | Keep only the ticker line; `lagSmoothing(0)` |
| Markers drift, triggers fire early or late | `ScrollTrigger.update` not wired to `lenis.on('scroll')` | Add the listener |
| Pins break or jump | `scrollerProxy` set on a native-document scroller, or an ancestor with `transform`/`will-change` | Remove the proxy; take the transform off the ancestor (`pinReparent` is a last resort) |
| Scroll stuck, inverted or far too fast | `time * 1000` missing, or loops started in the wrong order | Fix the unit; start Lenis before creating triggers |
| Positions wrong after load | Triggers measured before fonts or images settled | `ScrollTrigger.refresh()` after `document.fonts.ready` and after images decode |
| Anchor links dead | Lenis blocks them while smoothing | `anchors: true` (options object for offset) |
| Cannot scroll inside a modal, chat or list | Lenis captured the wheel | `data-lenis-prevent` on the element, or `allowNestedScroll` (perf cost), or `prevent: (node) => ...` |
| CSS `scroll-snap` ignored | Does not work with Lenis | Use `lenis/snap` |
| Works once, breaks after navigating back | Instance or ticker callback not removed | Cleanup (section 3) |

Other recipes: lock scroll under a modal with `lenis.stop()` / `start()`; on route change `lenis.scrollTo(0, { immediate: true })`; fixed header offset `scrollTo(el, { offset: -80 })`; set `syncTouch` only if you must (flaky before iOS 16). Known limits: Safari is capped near 60 fps (30 in low-power mode), smoothing stops over iframes, `position: fixed` can lag on pre-M1 macOS Safari. State these limits in the report instead of promising otherwise.

## 3. Cleanup in every framework
- **React:** `useGSAP(() => { ... }, { scope: containerRef })` from `@gsap/react` (it wraps `gsap.context()` and reverts on unmount). Handlers created after mount (clicks) must be wrapped with `contextSafe`, or they are not cleaned up. Default dependencies are empty; pass `dependencies` and `revertOnUpdate` only when you mean it. StrictMode runs effects twice in development: cleanup is what keeps it from duplicating. Next.js App Router needs `'use client'`. Never run GSAP during SSR.
- **Without the hook:** `const ctx = gsap.context(() => { ... }, containerRef); return () => ctx.revert()`.
- **Vue/Nuxt/Svelte:** create inside `onMounted`/`onMount` (the DOM must exist), scope selectors to the component root, revert on unmount, call `refresh()` after the next tick. In Nuxt lazy-import plugins so SSR stays safe.
- Always scope selectors (`gsap.context(fn, scope)` or `useGSAP({scope})`); a bare `.card` selector will hit other components.
- **matchMedia:** `gsap.matchMedia()` creates its own context and reverts the handler's animations when the query stops matching. Do NOT call `context.revert()` inside it and do not nest a `gsap.context()` in it. Return a function only for things GSAP does not own (event listeners).

## 4. ScrollTrigger rules
Do:
- Put the `scrollTrigger` on the timeline (or a top-level tween), never on a child tween of that timeline.
- Animate the pinned element's children, not the pinned element itself. `pinSpacing` stays on unless you replace the space.
- Pick `scrub: true` for 1:1 or a number (seconds of catch-up, about 1) for smoothing. Do not combine `scrub` with `toggleActions`; scrub wins.
- Create triggers in page order, or set `refreshPriority` for triggers built asynchronously.
- For many similar reveals use `ScrollTrigger.batch()` (do not pass `trigger`, `animation`, `scrub`, `snap` or `toggleActions` into it).
- Horizontal scroll sections: animate `xPercent` of an inner element with `ease: "none"` and pin the wrapper; sibling triggers use `containerAnimation`. Triggers that use `containerAnimation` cannot pin or snap, and their tweens must use `ease: "none"`.
- `end: "clamp(bottom top)"` (3.12+) stops a trigger from ending past the page bottom. Function values need `invalidateOnRefresh: true`.
- Remove `markers: true` before shipping (grep for it).
Do not:
- Animate layout properties (`width`, `height`, `top`, `left`, margins). Animate transforms and opacity; `filter` and `boxShadow` cost CPU.
- Put `content-visibility` on measured content.
- Leave triggers alive across routes: kill them (`ScrollTrigger.getById('id')?.kill()`, or let `gsap.context` revert them).

## 5. Refresh timing
Positions are measured once. Call `ScrollTrigger.refresh()` after anything that changes layout: web fonts (`document.fonts.ready`), images, an accordion or tab opening, dynamic content. Resize refreshes automatically (debounced). Debounce your own calls; refresh is not free.

## 6. Reduced motion and breakpoints
```js
const mm = gsap.matchMedia()
mm.add({
  motionOk: '(prefers-reduced-motion: no-preference)',
  isDesktop: '(min-width: 900px)',
}, (ctx) => {
  const { motionOk, isDesktop } = ctx.conditions
  if (!motionOk) return                 // final states stay visible, nothing pinned or scrubbed
  /* build the pinned, scrubbed version, simplified when !isDesktop */
})
```
Reduced motion keeps opacity, colour and focus feedback and removes pins, scrubbed parallax, large slides, 3D spin and smooth-scroll hijacking (full tiers in `motion-decision-reference.md`). Do not create the Lenis instance when reduced motion is on.

## 7. SplitText (3.13+)
- `SplitText.create(el, { type: 'lines,words', mask: 'lines', autoSplit: true, onSplit: (self) => gsap.from(self.lines, {...}) })`. Return the animation from `onSplit` so it is reverted and re-timed on re-split. Split only what you animate (chars cost the most).
- Wait for fonts: `document.fonts.ready.then(...)` or `autoSplit: true`. Revert after animating when the text will be reflowed.
- Keep `aria: "auto"` so screen readers and search see the whole string. Avoid `text-wrap: balance` on split text. SVG `<text>` is not supported.
- A headline revealed by lines needs `overflow: hidden` (or `mask`) on each line wrapper and enough line-height that descenders are not clipped.

## 8. Flip
`const state = Flip.getState(items); /* change the DOM */ Flip.from(state, { duration: 0.6, ease: 'power2.inOut', absolute: true })`. `getState` changes nothing. In frameworks wait for the render before `from`, pass `targets` explicitly because re-rendered nodes are new, set transforms through GSAP (not CSS) so its cache stays right, keep `box-sizing: border-box`. 3D transforms are not supported.

## 9. Performance
- Transforms and opacity only; `will-change: transform` only on elements that animate right now, removed after. Batch DOM reads before writes.
- `gsap.quickTo(el, 'x', { duration: 0.4 })` for pointer followers; call it inside the handler, do not create tweens per mousemove.
- Use `stagger` instead of dozens of delayed tweens. Pin only what must pin. Pause or kill off-screen animation. Do not create hundreds of overlapping tweens or triggers without a low-end test.
- Do not mix a second animation system on the same element (GSAP and Motion fighting over `transform`).

## 10. Starting values for scroll devices (SV, measure on the build)
| Device | Starting value |
|---|---|
| Hero scrub span | 2.2-3.0 viewports (under 1.8 flies past, over 3.5 feels broken) |
| Pinned section span | at least about 1.2 viewports |
| Horizontal pan | about 1 viewport per item plus 1 |
| Story beat weight | 0.7-1.8 viewports per beat, 5-7 beats, one CTA |
| Reveal trigger | `start: 'top 82%'` (or `top 85%`), `once: true` |
| Reveal motion | y 24-48, blur 4-10px, 0.8-1.1s, enter ease `power3.out` or `power4.out` |
| Stagger | words 0.035-0.07s, lines 0.08-0.14s, cards 0.06-0.1s |
| Scrub smoothing | `scrub: 1`-1.1; `anticipatePin: 1` |
| Count-up | 1.2-1.8s, once, only real numbers |
| Parallax factor | 0.3-1.5 for layers, 1-2 for a full-bleed bed; never behind body copy |
| Pointer tilt / magnet | tilt 5-9 degrees; magnet 0.2-0.35, primary CTA only, fine pointers only |
| Scrubbed video encode | `-g 8 -keyint_min 8 -sc_threshold 0 -crf 20 -preset slow`, no audio, hero video at most about 2 MB |
| Canvas sequence | `progress = clamp((viewportTop - sectionTop) / (sectionHeight - viewportHeight))`, clamp the frame index, cap DPR at 2 |

One progress value should drive every layer of a scrubbed scene so it stays reversible; never spawn objects from scroll events. Verify beginning, middle, arrival, a fast jump and a reverse scroll at desktop and phone width.

## 11. CHECK lines to put in the order
- `grep -n "autoRaf: *true"` returns nothing in any file that also has `gsap.ticker.add`.
- Navigate to another route and back three times (on a one-page site, mount and unmount the scene component instead), then `ScrollTrigger.getAll().length` equals the first count and the number of live Lenis instances is 1 (no leaked triggers or tickers). In React dev mode, confirm no duplicated animation after the StrictMode double mount.
- No property is written by both a CSS animation and GSAP: grep the animated selectors for `animation:` or `@keyframes` on the same property.
- On first paint with JS enabled there is no flash of the finished state before the start state appears (capture frame 1 of a throttled reload).
- Reload with the cache disabled: every pinned start position equals the position after `document.fonts.ready` plus `refresh()`.
- Emulate `prefers-reduced-motion: reduce`: no pin, no scrub, content visible at rest.
- `grep -n "markers"` returns nothing in production code.
- Phone width: no scrubbed text overlaps its object, and the page is usable with the scene switched off.
