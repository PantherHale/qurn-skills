# Web designer: scroll-scrubbed frame sequences, portal parallax, shader backgrounds, spotlight reveals

Surveyed from scrolltide.co (a template/prompt marketplace for AI-built sites — fetched 2026-10-06, both its product catalog and its Academy tutorials) because its whole catalog is a working taxonomy of exactly the techniques this specialist chooses between. Treat it as a technique and vocabulary source, never as a look to copy — the lesson here is the mechanism and the naming precision, not any one site's visual identity ([[bridgemind-functional-not-visual]], [[archify-workflow-reference]]: copy structure, not look). Complements `scroll-animation-reference.md` (CSS scroll-timelines and GSAP ScrollTrigger) and `3d-web-reference.md` (Three.js/glTF scenes) — this file covers the techniques neither one does: canvas frame-scrubbing, flat-layer portal parallax, fullscreen GPU shader backgrounds, and cursor-spotlight reveals.

## Canvas frame-scrubbing — the "video that scrolls" technique

A short clip (AI-generated or filmed) is exported as a numbered still-image sequence, and the scroll position selects which frame to draw. This is a *frame problem, not a video problem* — once every frame is decoded and in memory, playback cost is just drawing one image per scroll tick, with no video decoder in the loop at all.

**Exact mechanism:**
1. Export the clip to **zero-padded numbered stills** (`frame-001.webp` … `frame-192.webp`), never rely on filename-default sort order.
2. **Format: WebP, not JPEG/PNG** — it is the only common format giving PNG-grade edge quality at roughly JPEG-grade file size, which matters because every frame adds to the page's total weight.
3. **Frame count is chosen for the scroll distance, not left as an export default.** Pick the count so it divides cleanly into the pinned scroll range — "the last frame lands exactly as the pin releases." Baseline: **60–120 frames for a section-length scrub**; a full character/product sequence that needs to read as genuinely continuous can run to 300 frames (one surveyed build: a 10s/30fps source clip → 300 stills). Start low, add frames only if stepping is visible on scrub — don't default to the source video's native frame rate.
4. **Preload every frame before the section enters the viewport.** This is the one non-negotiable: scrubbing with frames still arriving over the network reads as broken, not slow.
5. **Draw to a `<canvas>`, never swap `src` on an `<img>`.** Swapping `img.src` re-triggers decode/layout cost per frame and shows visible flicker; a canvas `drawImage()` call per scroll tick does not.
6. **Pin the section** (GSAP `ScrollTrigger` `pin: true`, or an equivalent sticky-positioning setup) so the sequence plays out while the viewport holds still — "scroll is just an index into an array," and that only reads correctly if the array's visual target isn't also moving on its own.
7. Map scroll progress (0–1 within the pinned range) to an integer frame index, clamp, `drawImage()`. No animation library is required for the mapping itself — the complexity is in steps 1–4, "the code is almost an afterthought" once frames are ready.

**For a seamless *looping* source clip** (ambient background motion rather than a scroll-scrubbed narrative): generate the source video with **identical start and end frames** so the model's motion travels out and arrives back exactly where it began — "the loop is seamless by construction rather than by luck," with nothing to snap between because the first and last exported stills are literally the same file.

**When to reach for this vs. the techniques in `scroll-animation-reference.md`:** frame-scrubbing is for *content that only exists as footage* — a product demo, a character/garment turning, a generated motion clip — where GSAP/CSS timelines would be animating a DOM element, not stepping through pre-rendered frames. If the content is already a DOM element (text, a card, a layout block), use scroll-timelines/ScrollTrigger instead; don't render a frame sequence to fake what a `transform`/`opacity` keyframe could do directly.

## Flat-layer portal/parallax — fake depth without a 3D engine

A "3D portal" or walkthrough effect built from **ordinary 2D assets, not a WebGL scene**: separate the shot into depth layers as distinct image files (e.g. background environment, a transparent-PNG portal/door, foreground elements like clouds on transparency), then move/scale each layer at a different rate as the page scrolls. Depth is read purely from the *relative* motion between layers — "only possible if they are separate files," because a single flattened image has no layers left to move independently.

- Convention: nearest layer moves/scales **fastest**, the mid layer (the portal/door itself) **medium**, the furthest background **slowest**.
- Implementation is CSS `transform` (`scale`/`translate`) per layer driven by a scroll listener, not a 3D engine — reserve actual Three.js/R3F (per `3d-web-reference.md`) for scenes that need real camera movement or lighting, not a flat parallax illusion.
- **Expose the per-layer speed multipliers as tunable parameters**, not hardcoded magic numbers — trackpad and mouse-wheel scrolling produce very different scroll-delta profiles, and getting the depth illusion right means retuning per input device, which is only practical if the rates aren't buried in the math.
- The generation difficulty is in producing layers that agree with each other in perspective and lighting at the seams — same lesson as the spotlight technique below: the asset prep is the hard part, the transform code is simple once the layers are right.

## Spotlight/cursor-reveal — mask-driven, not two full re-renders

A circular "window" follows the cursor and reveals a second image underneath the first — used for before/after, X-ray/wireframe, or hidden-detail reveals.

**Exact mechanism:** two images stacked, pixel-identical in pose/lighting/framing (this alignment is the actual hard part — "slightly different is fatal here," since any mismatch in the two source images reads as a glitch, not a reveal). The top layer carries a CSS mask with a radial-gradient "hole" centered on live cursor coordinates (`mask-image: radial-gradient(...)`, updated on `pointermove`), exposing the layer beneath through the hole.

- **Starting values to tune from:** ~260px radius, fade beginning at ~40% of that radius inward (i.e. a solid core out to 40% of the radius, then a feathered falloff to the edge) — a soft-edged gradient "reads as light," a hard-edged circle reads as a cutout mask, which breaks the illusion.
- Track the cursor with a `pointermove` listener updating CSS custom properties consumed by the mask gradient — don't re-render React state on every pointer move (same main-thread-cost principle as `fluid-interaction-reference.md`'s gesture-physics guidance); mutate the custom property directly.
- Order of effort: get the two source images pixel-aligned first, then the mask/tracking code is close to trivial — don't spend build time on the CSS before the image pair actually agrees.

## Fullscreen GPU shader backgrounds — the taxonomy, so a build order can name one precisely

A distinct technique from both the Three.js scenes in `3d-web-reference.md` and the gradient/mesh backgrounds a designer might reach for by default: a **fullscreen fragment shader** rendered as a background layer, animated continuously on the GPU. Pitch, from the surveyed catalog: "these run on the GPU, loop seamlessly, and weigh nothing next to a video" — the performance case for a shader background over a looping MP4 is that it's procedural (no frame data to stream) rather than merely "prettier."

**Named categories worth knowing by name** (so a build order can specify one instead of "some kind of animated background"):
- **Gradient / gradient-mesh** — soft multi-color blend, slow drift, no hard edges.
- **Swirl** — rotating ribbon/stream patterns (a tide/vortex motif reads as motion with direction, not random noise).
- **Metal** — reflective-surface shaders (brushed, chrome, oil-slick) — reads as material, not color.
- **Halftone** — dotted print-style effect, often monochrome or duotone — reads as texture/print, deliberately low-fi against a clean UI.
- **Flame** — fire-like particle/noise motion — high-energy, warm-palette use only.
- **Aurora** — vertical light-curtain effect — soft, large-scale, slow.
- **Voronoi / cellular** — mosaic/cell-boundary patterns from a Voronoi noise function — reads as organic/biological or crystalline depending on palette.

**Delivery formats to choose between**, each with a different cost/flexibility tradeoff:
- **Live React/WebGL component** — real GPU shader, zero fixed asset weight, fully responsive to viewport size, but needs a WebGL context and the same `prefers-reduced-motion`/pause obligations as any other continuous motion (WCAG 2.2.2, already covered in `scroll-animation-reference.md`'s accessibility section — a shader background is motion like any other and isn't exempt).
- **Looping MP4** — simplest to drop in, fixed file weight, doesn't adapt to arbitrary viewport sizes without cropping.
- **Static still** — the reduced-motion fallback, or a social-preview/OG-image source — always generate one alongside the animated version rather than treating the fallback as an afterthought.

Pick the live component by default for anything that needs to resize fluidly or that's load-bearing for brand identity; fall back to MP4 only when a live WebGL context is a genuine constraint (e.g. a context budget already spent on a foreground 3D scene).

## Naming and description precision — the actual transferable lesson

Across the whole surveyed catalog, every item's one-line description names the *exact mechanism*, not a mood word: "registered CSS properties, with no per-frame JS" (a button), "canvas-based frame scrubbing" (a hero), "no animation library anywhere in the dependency list" (a template), "generative rather than literal — something forming rather than something finished" (a motion concept tied to a specific creative brief, not a generic adjective). Apply this to BUILD ORDERS: name the technique and the exact mechanism ("view-timeline with animation-range: entry, CSS mask radial-gradient tracking pointermove," not "a nice hover effect"). A build order that could describe three different implementations hasn't actually specified one.

## Where to read more (name, do not paste)
scrolltide.co/templates (the template catalog, naming conventions and one-line technique descriptions); scrolltide.co/shaders (the shader taxonomy above); scrolltide.co/academy (the tutorial set this file's frame-scrubbing, portal-parallax and spotlight mechanics were drawn from — lesson titles: "scroll-scrubbing video animation," "300-frame scroll character site," "perfect loop AI video scroll frames," "3D portal scroll effect," "spotlight hover-reveal effect"); this project's own `scroll-animation-reference.md` (CSS/GSAP scroll techniques this file deliberately doesn't repeat) and `3d-web-reference.md` (real 3D scenes vs. the flat-layer parallax fake above).
