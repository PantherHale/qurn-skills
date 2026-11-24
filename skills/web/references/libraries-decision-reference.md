# Libraries decision table -- pick the lightest tool that does the job

Checked 2026-11-24 from official docs and repos. "(to verify)" marks facts the fetch did not reach. Check the current version and licence on the day of the build.

| Need | Reach for | Why / limits |
|---|---|---|
| Scroll scenes, pinning, scrubbed timelines, text splitting | GSAP + ScrollTrigger (+ SplitText, Flip) | The default for page-scale scroll stories. See `gsap-and-lenis-engineering-reference.md`. Licence: Standard No Charge (not MIT). |
| Smooth/inertial scroll | Lenis | One engine per site; wraps native scroll. |
| UI state, springs, layout and exit animation in React | Motion (`motion/react`) | v14: `whileInView` + `viewport`, `layout`/`layoutId`, `AnimatePresence`, `useScroll`. Mini `animate()` is about 3.2 kb (HTML/SVG only); the layout feature is about 12 kb; LazyMotion bundle sizes (to verify). |
| Simple scroll-linked reveals or progress | CSS `animation-timeline` | No JS. See `platform-baseline-reference.md`. |
| Declarative entry animation | `@starting-style` | CSS only. |
| Designer-authored, state-driven vector animation (hover, toggles, data-bound values) | Rive (`@rive-app/webgl2`, `canvas-lite` for the smallest build) | Name the `stateMachine` or only the first linear animation plays; call `resizeDrawingSurfaceToCanvas()` on load and resize or it is blurry on high-DPI; call `cleanup()` or C++ objects leak. Size vs Lottie not verified. |
| Plain playback of a designer's After Effects animation | dotLottie (`@lottiefiles/dotlottie-web` / `-react`) | `.lottie` is a zipped container, usually 60-80% smaller than `.json` (vendor claim, to verify). Prefer it over `lottie-web`. Lazy-load, pause off-screen, drive scroll with `setFrame`. |
| Line drawing, morphing, motion along a path | CSS `stroke-dashoffset` / GSAP DrawSVG, MorphSVG, MotionPath / CSS `offset-path` | Draw-on needs a real stroke (`fill: none`). Morphing needs matching path structure unless MorphSVG or Flubber is used; call `convertToPath()` for primitives. Keep the `viewBox` through SVGO. Inline the SVG, not `<img>`. |
| 3D scenes in React | react-three-fiber v9 (React 19; v8 for React 18) + drei (MIT) | `frameloop="demand"` + `invalidate()` for mostly static scenes; draw calls a few hundred or less (never over 1000); never `setState` in `useFrame`; no vector allocation in `useFrame`; share geometry and materials; `PerformanceMonitor`/`AdaptiveDpr` for adaptive quality; Draco + KTX2 + glTF Transform for assets. v10 (WebGPU) is alpha. |
| Lightweight 3D without React | OGL or three.js | OGL for a single effect; three.js for scenes. Lazy-import so it never blocks LCP. |
| Timeline editor for a 3D/HTML scene | Theatre.js | Last release v0.7.0 on 2023-08-10 and docs last edited 2024-02-01: treat as slow-moving, verify before adopting. |
| Component primitives you own | shadcn/ui (source copied into the repo) | "Not a component library." Theme through CSS variables (`:root`, `.dark`, `@theme inline`, `--radius`). The default look is the Neutral palette, so override tokens and edit the component source; changing the CSS-variables setting later means reinstalling components. |
| Decorative landing-page effects | React Bits (see `ui-libraries-and-mascots-reference.md`), Magic UI (150+ free animated components, Pro blocks paid), Aceternity UI (118+ free components; blocks and templates paid) | Each has a recognisable look. Restyle to the tokens, add a reduced-motion fallback, and do not stack several. Licence pages not read (to verify). |
| Toasts, drawers, command palette, OTP, number tween, charts | Sonner, Vaul, cmdk, input-otp, NumberFlow, recharts (Liveline for live charts) | A shortlist from Emil Kowalski's pick-ui-library; check `package.json` first and do not churn existing dependencies. |

Rules
- One animation system per element. Never let GSAP and Motion drive the same `transform`.
- Lazy-load anything below the fold or behind interaction; load `three` and `gsap` only on the pages that use them.
- A library is justified by a named job. "It is popular" is not one.
- When a scene or effect rests on a framework, put the measurable check in the order: bundle size added, LCP before and after, mobile frame rate, reduced-motion behaviour.

## What award-site builds actually fight (six 2026 Awwwards case studies, stated by the studios)
Asset weight and phone memory, not animation code. Typical stack: Lenis + GSAP, with Three.js or R3F for 3D, Nuxt or Next on top. Techniques they report: Draco geometry + KTX2 textures + glTF Transform + Meshopt; baking high-poly sculpts to low-poly (high-poly models "crashed mobile browsers instantly"); keeping only the active model in memory; caching shadow maps and stopping the render loop when the scene is still; an adaptive-quality system that lowers shadow resolution or grain density when frame rate drops; a persistent canvas outside the router; packing several masks into one texture's channels instead of shipping video; cutting scope (weather, birds, day-night cycles) to protect the phone. One studio said flawless 60 fps on every mid-range phone is "nearly impossible" with its setup. Plan the low-GPU tier and the cut list at the start, not at the end.
