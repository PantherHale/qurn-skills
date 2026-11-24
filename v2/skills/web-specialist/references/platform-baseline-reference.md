# Platform baseline -- what the browser can do now, with dates

Checked 2026-11-24 against MDN, Chrome's docs and the HTTP Archive Web Almanac. Anything marked (to verify) was not confirmed from a page we could read: check MDN's Baseline badge or caniuse on the day of the build, and put the check in the order. Engines move, so never copy a support claim from this file into a client deliverable without re-checking.

| Feature | Status found | Use it as |
|---|---|---|
| CSS scroll-driven animations (`animation-timeline: scroll()` / `view()`, `animation-range`) | MDN: Baseline 2026, newly available since October 2026 ("works across the latest devices and browser versions") | Primary technique for scroll-linked reveals and progress bars on current browsers. Still wrap in `@supports (animation-timeline: scroll())` with a static fallback for older ones. Firefox needed `animation-duration` set (for example `1ms`) for the animation to apply in MDN's example. Per-browser versions not extracted (to verify). A minifier folding `animation-timeline` into the `animation` shorthand makes browsers drop it: put it after the shorthand and check the built CSS. If the axis has no scrollbar the timeline is inactive. |
| View Transitions, same-document | Chrome 111+; Firefox 144 and Safari 18 listed as supported on Chrome's page | `document.startViewTransition(() => update())`, guarded with `if (!document.startViewTransition)`. Baseline label not extracted (to verify). |
| View Transitions, cross-document | Chrome 126+, Safari 18.2; Firefox not supported (Chrome's page) | `@view-transition { navigation: auto; }` on both pages, same origin. No JS call exists. Treat as progressive enhancement: a navigation with no transition must look finished. |
| `@starting-style` | MDN: Baseline 2024 | Entry animations from `display: none` or newly inserted nodes in CSS only. Pair with `transition-behavior: allow-discrete`. |
| `text-wrap: balance` | MDN: Baseline 2024; limited to about six lines in Chromium and ten in Firefox | Short headings only. Avoid on text that SplitText splits. |
| `calc-size()` / `interpolate-size` | MDN: `calc-size()` limited availability, experimental (interpolate-size not fetched) | Do not rely on it. Animate height-auto with `grid-template-rows: 0fr -> 1fr` and an `overflow: hidden; min-height: 0` child. |
| Container queries | status not extracted (to verify) | Prefer for components reused in different widths; confirm before relying. |
| `prefers-reduced-motion`, `prefers-reduced-transparency` | reduced-motion used on about half of pages (Web Almanac 2025) | Always provide the tiers in `motion-decision-reference.md`; transparency fallback for any glass surface. |

## Framework page transitions
- **Next.js App Router with Motion:** the old route unmounts almost immediately on navigation, so an exit only runs if the element stays mounted under a persistent `AnimatePresence`. Put `AnimatePresence mode="wait"` in `template.tsx` (which remounts per navigation, unlike `layout.tsx`), key the page wrapper by pathname, and freeze the router context for the exiting child (a snapshot via `useRef` of `LayoutRouterContext`, a Next internal whose import path can change between versions: pin the Next version and re-check on upgrade). Debug list: the wrapper stays mounted; the key changes per route; the exiting element is a direct child; one child under `mode="wait"`; `'use client'` on every file involved.
- **View Transitions in a framework:** `document.startViewTransition(() => router.push(href))` behind a feature check; style `::view-transition-old(root)` / `::view-transition-new(root)` with a short fade. Choose one transition behaviour for the whole site (instant swap or cinematic) and apply it to every link.
- A persistent WebGL canvas can stay mounted outside the router so the 3D scene survives navigation (used by a 2026 award case study); then route changes drive the camera, not a remount.

## Fonts, delivery and the real web (Web Almanac 2025)
Web fonts are on about 88% of sites; WOFF2 is about 65% of font requests; variable fonts about 40% of sites; `font-display: swap` is the most common value (about half). Ship WOFF2, preload only the one or two above-the-fold faces, set `font-display: swap` (or `optional` for non-critical faces), and give a metric-compatible fallback so the swap does not shift layout (CLS under 0.1).
