# Web designer: 3D pipeline update and AI-generated assets

Researched 2026-11-07 by the research specialist's rules. Sources are mostly vendor and practitioner blogs, not specs, so each claim carries a confidence tag: **[spec]** from Khronos/primary docs already cited in `3d-web-reference.md`, **[practice]** agreed by several practitioner sources, **[to verify]** single-source or conflicting. Re-check any version number or benchmark against the official docs before quoting it to an operator. This file refines `3d-web-reference.md` (delivery) and `3d-modelling-reference.md` (sourcing); where they differ, this file is newer.

## 1. Corrections to the delivery advice

- **Draco is not the default for everything.** [practice] Meshopt is the usual pick for animated or morph-target content, because it also compresses animation keyframes and morph targets, which Draco leaves untouched. Draco tends to give a somewhat smaller static mesh but decodes slower and ships a much larger decoder. Rule: static hero prop where download size matters most = Draco; anything animated or with morph targets = Meshopt. Never both on the same mesh.
- **Compression runs last.** [practice] Every glTF-Transform command that rewrites a model decodes Draco/Meshopt geometry when it reads it, so Draco or Meshopt must be the final step in a chain. A BUILD ORDER lists the steps in this order: dedupe/prune, resize textures, texture compress (KTX2 or WebP), geometry compress.
- **KTX2 is for GPU memory, WebP is the simple fallback.** [practice] KTX2/Basis keeps the texture in a GPU block format into VRAM (sources cite 4-8x less memory than raw RGBA; exact ratio varies by texture [to verify]). WebP is acceptable when the toolchain cannot do KTX2, but it decompresses to full size in memory.
- **Wire the loaders to match the output.** Draco output needs a `DRACOLoader`, Meshopt needs the meshopt decoder, KTX2 needs a `KTX2Loader` with the transcoder path set. A compressed file with a missing loader fails silently as a blank model; the check is a cold load on the live URL.
- **Validate before shipping.** [practice] Run every `.glb` through the Khronos glTF Validator and fix errors, not just warnings. Record the result in the ledger.
- **Measure sizes, do not trust the percentages in blog posts.** [to verify] Size-reduction figures vary widely between sources. The proof is the before and after byte count of the actual file.

## 2. WebGPU status, with the honest caveat

- [practice] WebGPU is available by default in Chrome/Edge, Firefox and Safari as of 2026, with remaining gaps on Linux Firefox and older iPhones. One source says it reached Baseline in January 2026 [to verify].
- [to verify] Sources disagree on whether Three.js marks its WebGPU renderer stable. One says it became the recommended renderer from r171 (September 2025); another still calls it experimental and expects stable by end of 2026. One source claims an "r160 in February 2026" release that contradicts the others; ignore it.
- **Rule:** build WebGPU-first with automatic WebGL 2 fallback for new work, `await renderer.init()` before first render (initialisation is asynchronous), and read the current Three.js release notes for the stable status before telling an operator which it is. Test the WebGL 2 fallback path on purpose; the tier that breaks is the one nobody opened.

## 3. A third sourcing path: AI-generated 3D (new)

`3d-modelling-reference.md` lists two honest paths and one banned shortcut. Image-to-3D and text-to-3D tools are a real third option now, allowed under these conditions:

1. **Start from a real reference photo or the operator's own image, not a text description.** The banned shortcut (modelling from an LLM's idea of what the object looks like) applies equally to a text prompt fed to a generator. Image-to-3D from a verified reference is acceptable; text-to-3D of a bespoke brand object is not.
2. **Treat the output as a blockout, not a finished asset.** [practice] No source calls AI output fully production-ready. Expect to decimate or retopologise, fix UVs, and rebuild materials. Complex articulated objects and mechanical assemblies remain the weak spot and need an artist.
3. **Check the licence of the output per tool and per plan.** [to verify] One guide says a hosted tool's free tier publishes models under CC BY 4.0; terms differ by plan. Record tool, plan, date and licence in `docs/design/REFERENCES.md`; an unrecorded licence is a blocking finding, same as an unsourced asset.
4. **Compare against the reference at the stills gate.** Same close-up stills at rest as `3d-product-realism-reference.md`; the generated mesh must match the real object's proportions, not just look plausible.

Tool landscape, directional only [to verify, rankings disagree and the leaderboards have unclear methodology]: Meshy and Tripo are described as the most production-oriented hosted options (cleaner topology, PBR output, remeshing); Hunyuan3D and Microsoft's TRELLIS are strong open-weight options for raw geometry (TRELLIS reported as MIT-licensed) but produce dense meshes that need a remesh pass; Rodin is positioned for detail-heavy hero assets at a higher price. **No head-to-head polycount benchmarks were found.** The only valid choice method is to run the operator's own reference image through two candidates and compare the stills.

## 4. BUILD ORDER additions for any 3D asset

Add these lines to the order, after the stage breakdown from `3d-modelling-reference.md`:

- `Source: <licensed asset | modelled from reference | image-to-3D from reference>` and the REFERENCES.md entry.
- `Budget: <tier from 3d-web-reference.md table>`, measured with `renderer.info` on a throttled run.
- `Compression: <Meshopt or Draco> + <KTX2 or WebP>, last step` and the loader wiring file.
- `Validated: glTF Validator, 0 errors` with the output pasted into the ledger.
- `Fallback: WebGL 2 tested, reduced-motion static frame, text alternative for the canvas`.

## Sources

Search results consulted 2026-11-07 (secondary, treat as directional): utsubo.com WebGPU/Three.js guides; vr.org WebGPU baseline article; svilenkovic.com glTF best practices; app.cinevva.com guides (optimise GLB, AI 3D generators); krea.ai and 3daistudio.com AI generator comparisons; the glTF-Transform project pages. Primary sources to confirm against: khronos.org/gltf, the glTF-Transform docs, threejs.org release notes, developer.chrome.com WebGPU.
