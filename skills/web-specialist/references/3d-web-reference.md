# Web designer: 3D on the web (Three.js, WebGL/WebGPU, glTF)

Checked against primary sources (Khronos Group, Three.js/R3F ecosystem docs, Chrome Developers) 2026-10-06. This is for deciding *whether and how* to add real 3D content (a hero model, an interactive product viewer, a WebGL background scene) — not a 3D-modeling tutorial. Pair with `fluid-interaction-reference.md` for the motion-feel principles that still apply once something is 3D, and `performance-checklist.md` for the general perf budget this extends.

## The stack, confirmed current as of this check

**glTF 2.0** (ISO/IEC 12113:2022, maintained by Khronos) is the standard *delivery* format for 3D on the web — purpose-built to minimize both file size and runtime unpacking cost for WebGL/WebGPU/OpenGL-family renderers. If a 3D asset isn't already in `.gltf`/`.glb`, convert it rather than loading a native DCC format (`.fbx`, `.blend`, `.obj`) directly in the browser.

**Three.js** is the dominant JS 3D library; **React Three Fiber (R3F)** is the React-idiomatic wrapper around it (with the `@react-three/drei` helper library alongside it) — use R3F on a React project rather than hand-rolling imperative Three.js inside `useEffect`, since R3F's whole value is making the scene graph declarative and React-lifecycle-aware.

**WebGPU vs. WebGL, confirmed current support:** WebGPU ships by default in Chrome/Edge (from v113, May 2023), Firefox (v141+ Windows, v145+ macOS), and Safari (v26+, Sept 2025) — meaning as of this check it's supported by default across all four major engines, not experimental. Three.js ships a WebGPU renderer (`three/webgpu`) with automatic WebGL2 fallback; migrating an existing Three.js app is close to a one-line renderer swap. Reported gains: 30-50% improvement on dense scenes, lower CPU overhead, and compute-shader access for particle/effect work WebGL can't do efficiently. **Default recommendation:** build new work WebGPU-first with the automatic WebGL fallback, rather than targeting WebGL alone, for anything with a multi-year expected lifespan — the fallback costs nothing and the ceiling is meaningfully higher.

## Asset budgets — concrete numbers, by target device (compiled from Three.js/WebGL optimization guides; treat as industry-common practice, not a single ratified spec)

| Target | Max total polygons | Max texture size | Max total file size |
|---|---|---|---|
| Mobile web | ~50,000 triangles | 1024×1024 | ~2 MB |
| Desktop web | ~200,000 triangles | 2048×2048 | ~5 MB |
| Desktop application (not browser-constrained) | ~500,000 triangles | higher | ~20 MB |

For genuinely broad compatibility (older/low-end Android devices specifically), a much tighter figure of ~7,000 triangles for the whole visible scene is cited — treat the table above as the common web target, this as the floor for "must work everywhere." **Draw calls, not polygon count, are usually the actual bottleneck:** aim under 100 draw calls per frame for a comfortable margin, with ~500 cited as the outer edge of stable 60fps on desktop WebGL (lower on mobile). This is why **instancing** (`THREE.InstancedMesh`) matters more than polygon reduction for scenes with many repeated objects — a documented example cuts 19,600 individual objects down to a single draw call.

## The optimization pipeline, in order of impact
1. **Draw-call reduction first** — instancing and batching for repeated geometry; this is the highest-leverage single change (can cut draw calls 90%+ in the right scene).
2. **Mesh compression** — Draco (Khronos) compresses the geometry/mesh data itself.
3. **Texture compression** — **KTX2 with Basis Universal supercompression** (ratified by Khronos, April 2021, via the `KHR_texture_basisu` glTF extension) is the standard here: 3-5x smaller file size than JPG/PNG, and critically, **it stays compressed on the GPU** rather than decompressing to raw RGBA in memory the way JPG/PNG do — sometimes 10x less GPU memory for the same visible texture. Three.js, Babylon.js and the Gestaltor viewer already support it natively. Draco (mesh) and KTX2 (texture) are complementary, not alternatives — use both.
4. **LOD (Level of Detail)** via `THREE.LOD` — swap to a lower-poly mesh as camera distance increases; cited as improving perceived frame-rate smoothness without a visible quality loss at the distances where it switches.
5. **Frustum culling** — on by default in Three.js (`object.frustumCulled = true`); skips rendering anything outside the camera's view volume, reported to cut rendering workload by roughly 30% in typical scenes. Verify it isn't accidentally disabled on custom objects rather than trying to reimplement it.
6. **Dispose what you don't need** — geometries, materials, textures and render targets all need explicit `.dispose()` when removed; Three.js does not garbage-collect GPU resources just because the JS reference is gone. This is the WebGL equivalent of a memory leak and the most common cause of a 3D page that slows down the longer it's open.
7. **Profile before optimizing** — `renderer.info` (built into Three.js) for a live draw-call/triangle count, `stats-gl` for an FPS/memory overlay, Spector.js for a full frame capture. Don't guess at the bottleneck.

## React Three Fiber-specific rules (confirmed via the R3F ecosystem's own documented best-practice set)
- **Never call `setState` inside `useFrame`** — `useFrame` runs every rendered frame (up to 60+ times/second); routing that through React state forces a re-render on the same cadence. Mutate refs/object properties directly inside `useFrame` instead, and only touch React state for changes that genuinely need to re-render the component tree (rare, e.g. a UI overlay reacting to a milestone).
- Isolate components that need React state from the ones that only need per-frame mutation, so a frequent state update doesn't force the whole scene subtree to re-render.
- Target the browser's actual frame budget: **16.67ms per frame for 60fps** — treat this as the hard ceiling when profiling, same number as the general "long task" threshold already used in `web-designer-behavior.md`'s Core Web Vitals section (just applied to a render loop instead of a main-thread task).
- Use `@react-three/drei`'s helpers (`<Instances>`, `<Detailed>` for LOD, loaders with Suspense) rather than reimplementing Three.js patterns by hand inside R3F — it exists specifically to cover the common cases idiomatically.

## When 3D is the right call, and the accessibility obligations that come with it
3D adds real value for product visualization (rotate-to-inspect), spatial/architectural walkthroughs, and a genuinely differentiated hero moment — it's expensive in both build time and runtime budget, so it should be reserved for places where "see it from every angle" or "feel the depth" is actually the point, not added as decoration on a page that doesn't need it (the same restraint principle as `ui-libraries-and-mascots-reference.md`'s mascot-overuse guidance, applied to a much more expensive technique).

**Accessibility, same WCAG criteria as scroll/motion generally, now with higher stakes because 3D motion is often continuous and full-viewport:** gate any auto-rotating or continuously-animating 3D scene behind `prefers-reduced-motion` with a static-frame fallback, never a spinning scene with no pause control (WCAG 2.2.2 applies directly — a 3D viewer that auto-rotates forever and can't be stopped fails the same criterion a looping carousel would). A 3D canvas is opaque to screen readers by default — provide a real text alternative describing what the model is and its key inspectable states, don't rely on the canvas alone to communicate anything load-bearing. Full WebXR-specific accessibility guidance was not found as a mature, separate spec as of this check — treat general motion/WCAG guidance (reduced motion, no unstoppable auto-motion, text alternatives) as the current best available bar for a WebXR/3D feature rather than assuming a dedicated WebXR accessibility spec exists to defer to.

## Where to read more (name, do not paste)
khronos.org/gltf (the glTF 2.0 spec, sample assets, and validator — the primary source for the format itself); khronos.org/ktx (KTX 2.0 container spec and the Basis Universal supercompression press materials); threejs.org's own docs and `renderer.info`/LOD/InstancedMesh API references; the `@react-three/fiber` and `@react-three/drei` documentation for the React-specific patterns; discourse.threejs.org (the project's own community forum, useful for confirming current-version specifics since the library moves fast); developer.chrome.com's WebGPU documentation for current browser-support tables (re-check before quoting a specific version number, this space moves quickly).
