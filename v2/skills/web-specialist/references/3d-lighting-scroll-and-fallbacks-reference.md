# Web designer: 3D lighting and materials, scroll-driven 3D, fallbacks

Researched 2026-11-07. Tags as in the other 3D references: **[spec]** primary docs, **[practice]** several practitioner sources agree, **[to verify]** one source, vendor claim, or unresolved. Sources here are mostly forum threads and tutorials; confirm against the official Three.js docs before quoting.

## 1. Pre-rendered frames or real-time 3D? Decide first

[practice, secondary] Apple-style product scroll pages are reported to be a **canvas flipbook of preloaded image frames** with scroll progress mapped to a frame index, not a WebGL scene and not a playing video (the "no video" detail comes from one blog; Apple publishes nothing, so [to verify]). A sprite-sheet variant moves one image with a CSS variable.

| | Frame sequence | Real-time 3D |
|---|---|---|
| Look | Any quality you can render offline (Blender/Cycles) | Limited by phone GPU |
| Weight | Many images (preload cost) | One GLB |
| Interaction | Scroll only, fixed camera path | Free rotation, configurator, AR |
| Mobile risk | Bandwidth, memory for frames | GPU, iOS context loss |

Rule: if the brief is "the product turns as you scroll" and nothing else, price the frame sequence first (WebP/AVIF frames, preload before the scene starts, cap frame count and resolution on phones). Use real-time 3D when the visitor must rotate freely, change options, or enter AR. Say which and why in the BUILD ORDER.

## 2. Materials

- [spec, Three.js docs] `MeshPhysicalMaterial` costs more per pixel than the other materials; its extra effects are off until enabled and each adds cost. Use `MeshStandardMaterial` when clearcoat, transmission, sheen or iridescence are not needed, and always set an environment map or reflections look dead.
- [spec] When `transmission` is non-zero, set `opacity` to 0 (docs); a transparent-looking glass that renders wrong is usually this.
- [practice] Glass and clear plastic: small roughness (about 0.05 to 0.15) softens aliasing; tutorials report the best results at roughness near 0 to 0.15 or above 0.65, with the middle looking muddy [to verify].
- [practice] Car-paint style coat: metalness high, base roughness mid, `clearcoat` 1, `clearcoatRoughness` about 0.1.
- [practice] Transmission renders the scene behind it into an offscreen buffer, so it is expensive and softens what is seen through it; budget one or two transmissive objects, not a scene of them. Lower the transmission resolution on the low tier.

## 3. Colour accuracy: tone mapping

- [practice, secondary] Khronos PBR Neutral (`NeutralToneMapping` in Three.js) is designed to keep a product's base colour, hue and saturation accurate under neutral lighting while compressing highlights; it is reported as adopted in Three.js, Blender, Filament and Babylon.js. It is the right first choice when the product's brand colour must read true (a can, a bottle, a garment).
- [practice] `ACESFilmicToneMapping` is a stylised cinematic look and users report washed-out or low-contrast results; `AgXToneMapping` is less saturated by design. Choose them for mood, not for colour fidelity.
- [to verify] No rigorous side-by-side test was found. The proof is yours: render the product under each, compare to a photo or a colour chart at the stills gate, and record the winner. Switching the operator's page from one to another changes every colour on it, so decide once, early.
- Set output colour space correctly (sRGB) and mark colour textures sRGB and data textures (normal, roughness) linear, or everything shifts.

## 4. Grounding the object

- [practice] A floating object looks fake. Ground with a shadow: drei `AccumulativeShadows` with `RandomizedLight` gives soft physically plausible shadow by accumulating over many frames; `ContactShadows` is cheaper and gives a tight contact line; `BakeShadows` removes the per-frame cost for static scenes. `Stage` wraps these (`shadows` accepts contact, accumulative or true).
- Accumulate on load or when the object stops, not every frame. On the low tier use contact shadows only.
- Check current prop names in the drei docs before writing the order [to verify].

## 5. Scroll-driven 3D

- [practice] Wiring: feed Lenis scroll into ScrollTrigger and drive Lenis from the GSAP ticker; turn off GSAP lag smoothing for scroll-linked animation; use the `lenis` package, not the deprecated `@studio-freight/lenis`.
- [practice, community] Lag on phones with Lenis, ScrollTrigger and R3F together is usually the 3D scene's cost, not the scroll library. A maintainer guessed this; no confirmed fix was found [to verify]. So profile the scene first (`renderer.info`, throttled CPU and GPU), then cut: pixel ratio cap, fewer lights, smaller textures, no post-processing on phones.
- [practice] Animate only `transform` and `opacity` in the DOM layer; scrub with a small smoothing value; call `ScrollTrigger.refresh()` after dynamic content loads.
- Drive the camera or the object from scroll **progress**, mutate refs inside the render loop, never React state (see `3d-web-reference.md`).
- Not found: camera-path design and touch-input tuning. Follow `scroll-craft.md` and `phone-and-first-load-reference.md`, and treat touch as its own composition (no scroll sway on touch).

## 6. Fallback ladder and accessibility

[practice unless marked]
- Build the fallback first, then enhance: poster image immediately, heavy assets lazy-load, pixel ratio capped.
- Three tiers: full; reduced (gentler motion, no post-processing) when `prefers-reduced-motion` or a weak GPU; static image. Reduced must not look broken.
- Trigger heavy 3D by user action where the brief allows, instead of autoplay.
- Handle context loss and resize; dispose on route changes (see `3d-formats-viewers-and-ios-reference.md`).
- A canvas is opaque to assistive tech. `@react-three/a11y` overlays semantic DOM elements and a polite live region; otherwise provide a text alternative and real buttons for any control.
- [to verify] `navigator.deviceMemory` is HTTPS-only and MDN marks it not Baseline (unsupported in some widely used browsers, table not seen); `navigator.connection.saveData` support is unconfirmed. **Never rely on either as the only tier switch.** Use a measured signal instead: a short benchmark of the first frames, or a GPU-tier library, with the poster as the default.

## 7. Exemplar sites: what I could and could not confirm

I could not confirm an official Awwwards "Site of the Year 2025" list, so no winner is named here. Awwwards inspiration pages exist for WebGL product views and WebGL navigation (for example Wedze, Acoustic Garage, Adidas Originals), but the results gave titles only, no technique detail. Madar (a logistics site with scenes that follow the product's own data) is reported as a Site of the Day with a Developer Award, from one agency page [to verify].

Do not treat any of these as a source to copy. The method stays in `web-director.md`: study references for the technique, invent the concept from this product's own world. To use an exemplar, open it, record the URL and what you measured in `docs/design/REFERENCES.md`, and check its performance on a phone yourself.

## 8. BUILD ORDER additions

- `Method: <frame sequence | real-time>` with the reason from section 1.
- `Tone mapping: <Neutral | AgX | ACES>`, with a still compared to the reference photo.
- `Ground: <contact | accumulative | baked>`, low-tier variant named.
- `Tiers: full / reduced / static`, switch signal named, poster shown first.
- `A11y: text alternative, reduced-motion behaviour, controls as real buttons`.

## Sources

Consulted 2026-11-07 (secondary): threejs.org MeshPhysicalMaterial docs; discourse.threejs.org threads on transmission, tone mapping and AgX; tympanus.net/codrops glass and plastic tutorial; drei Stage and AccumulativeShadows docs via tessl.io; github.com/darkroomengineering/lenis discussion 431; gsap.com forum; css-tricks, setproduct.com, multizone.cz and geyer.dev on image-sequence scroll; mejba.me; MDN Navigator.deviceMemory; w3.org Device Memory spec; Blender issue 118824 on Khronos PBR Neutral; awwwards.com inspiration pages; videinfra.com Madar case. Primary sources to confirm: threejs.org docs, khronos.org, MDN, gsap.com docs.
