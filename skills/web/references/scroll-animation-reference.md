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
