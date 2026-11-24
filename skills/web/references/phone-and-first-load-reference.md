# Phone composition and first-load: expert reference

Learned from the Qurn Cola build (2026-11-03): a scroll-animated 3D site that looked right on a laptop and was rejected on a phone three times ("very bad", "too fast and congested", "darker", "tag too large"), and lagged on first visit on an integrated GPU. Use with `scroll-craft.md` (its closing 390px checks), `3d-web-reference.md` and `3d-product-realism-reference.md`.

## 1. A phone is its own composition, not a shrunken desktop
- Design the phone layout as a separate order for EVERY page, not only the home page. The failures were on the secondary pages (a timeline page and a product picker) because the desktop layout had been "made responsive" by letting a full-viewport 3D or SVG object stay fixed behind the text.
- Rule: on a 390x844 screen the object and the text never share pixels. Give each its own zone: object in the top half or in a small corner meter (about 78x208px), text below or beside it. A faded object behind text is still a fail.
- A phone viewport is short, so each pinned scene needs about 1.4x to 1.5x the desktop scroll distance, and reveal transitions about 1.0 to 1.2 s instead of 0.6 to 0.8 s. "Too fast and congested" is the symptom of desktop scene heights on a thumb flick.
- Floating widgets (a name tag, a chat bubble, a cookie pill) stay under the nav in z-index, at most about 70px wide, and never over a nav link. Do not drive them with scroll sway on coarse pointers (`matchMedia("(pointer: coarse)")`); a thumb flick flings them over the nav.
- Fixed overlays that appear late (a finale banner, a toast) get a solid background on phone, sit in a free zone, and never overlap a headline or the corner object.

## 2. Forced dark mode on phones
Mobile browsers (Chrome Android auto-dark, some in-app browsers) recolour a light site, so the phone looks darker than the laptop, including badges and buttons. For a brand-saturated or drenched page that owns its palette, declare it: `:root { color-scheme: only light; }` plus `<meta name="color-scheme" content="only light">`. This is the explicit exception to the "ship both palettes" line in `anti-slop-checklist-reference.md`: ship both only when the design has two real palettes; otherwise pin the one you built. Check by emulating `prefers-color-scheme: dark` and `forced-colors`, then compare screenshots with the desktop.

## 3. First visit on a weak GPU
Symptoms seen live: a 1.5 s freeze on first scroll (shader compile on Intel/D3D), then steady low frame rate. Fixes that worked, in order:
1. A loading screen that covers the real work: generate textures, create every material and variant, compile, do one synchronous warm render, then lift. Dispatch the "ready" event directly after the render, never after a double requestAnimationFrame (background tabs throttle it and the loader waits for its fallback timeout). Keep a 6 s fallback.
2. One environment map, one shared material program for similar metals, `renderer.debug.checkShaderErrors = false` in production.
3. A GPU tier: detect integrated GPUs (renderer string matching intel/iris/uhd, or `hardwareConcurrency <= 4`). On the low tier: no MSAA, device-pixel-ratio cap about 1.25 on laptops (keep 2 on small screens, they are sharp and cheap), lighter geometry, grain overlays off.
4. Render only when needed: half rate when idle, adaptive DPR only while active, no `backdrop-filter` on the nav over a canvas.
5. Canvas readbacks use `getContext("2d", { willReadFrequently: true })`; dispose a texture before refilling it (immutable storage errors otherwise); build heavy procedural textures in deferred jobs, not in one frame.
6. Smooth-scroll (Lenis) stays stopped until the loader lifts.

## 4. What you may and may not claim
- You can claim layout, overlap, scroll width and that a loader lifts. You cannot claim real frame rate from a throttled devtools browser, a background tab, or a machine with other WebGL tabs open. Say "fps not measurable here" and give the measured proxies (draw calls, triangles, DPR, long tasks).
- Test the deployed URL cold (fresh profile, cache disabled) after every push. The operator found the lag on the live site first.
