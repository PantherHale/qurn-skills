# Web designer: 3D asset modelling and reference sourcing

Pairs with `3d-web-reference.md`, which covers *delivery* (glTF, draw calls, WebGPU budgets) once an asset exists. This file covers the step before that: how a 3D asset for a hero/product scene gets modelled, and — the part most likely to go wrong — how to gather real reference material for it without ever inventing a source. Nothing in this file is a substitute for an actual modelling tool; it is what the Web designer needs to know to write a correct BUILD ORDER for a 3D asset and to judge whether a finished one is professional-grade or amateur-grade.

## The two honest sourcing paths — and the one banned shortcut

There are exactly two legitimate ways to get a 3D model into a build, plus one path that only looks legitimate:

1. **Use an existing, licensed asset.** CC0/public-domain sources (Poly Haven for HDRIs, textures and a growing model library; Khronos' own glTF sample-asset repo for test geometry; Sketchfab filtered to CC0/CC-BY with the license actually checked per-model, not assumed from the site's general reputation) or a licensed marketplace purchase. **Record the exact source URL and license in `docs/design/REFERENCES.md`** the same way `web-designer-references.md` already requires for 2D references — a 3D asset with no recorded source is exactly as unverifiable as a claimed stat with no citation, and gets the same treatment: flagged, not shipped.
2. **Model it from real reference.** Gather actual photographs, measured drawings, or a real physical object, then model to match. This is the only path for a bespoke brand object (a product, a mascot, an architectural feature specific to the brief) that no stock library will have.
3. **The banned shortcut: asking an LLM (including this one) to describe what an object "typically looks like" and modelling from that description with no real reference image checked against it.** An LLM's visual description of an object is a generalization from training data, not a verified fact about the one real object the brief is for — the same reason `research`'s anti-hallucination rules refuse an unchecked claim. A model built this way routinely gets proportions, mechanical details and material logic wrong in ways that read as "off" even to a non-expert, because it was never checked against anything real. If no real reference exists yet, that is itself a finding to report ("no reference photo of X was found or supplied — flagging before modelling, not guessing"), not a reason to proceed from a text description.

## Gathering reference properly (the part that most affects whether it reads as professional)

A professional modeller never works from one photo. The standard kit, and what is missing when a build looks "flat" or "wrong" in ways that are hard to name:

- **Multiple angles of the same subject**, minimum front/side/three-quarter, ideally a full turnaround — one hero shot alone hides exactly the surfaces (the back, the underside, how two forms meet) that a single-camera-angle render would later need to fake.
- **A scale reference in at least one shot** — a ruler, a hand, a known-size object in frame — so proportions are measured, not eyeballed from a photo with no sense of real-world scale.
- **Material and surface-detail close-ups separately from the form shots** — how a surface actually catches light (brushed metal vs. painted vs. frosted plastic) is a different piece of information from its silhouette, and conflating the two is why renders often get the right shape with the wrong finish.
- **Real environment/lighting reference for the shot the asset will appear in**, not just references for the object itself — an object modelled correctly but lit with a generic three-point studio setup still looks pasted-in next to photography or video lit by one specific real light source; match the light direction, temperature and softness of wherever the asset will actually sit.
- **A reference board assembled from these, with each image's source noted** (file name, URL, or "photographed by the operator on <date>") — the same discipline `web-designer-references.md` already applies to 2D site references, extended to 3D: never present an assembled moodboard as if its pieces came from nowhere.

## Verifying a reference image is real before building from it

Before treating any found image as ground truth for a model:

- Prefer an image you can trace to an identifiable source (a stock library with a license page, a manufacturer's own product photography, a museum/archive scan, a photo the operator supplied directly) over an unsourced image found via general image search with no attribution trail.
- Be alert to AI-generated images surfacing in ordinary image search results as of 2026 — a generated image of "a vintage camera" can look plausible while having physically inconsistent mechanical details (a lens mount that doesn't match the body, control dials with no function) that will propagate straight into the model and read as wrong to anyone who knows the real object. When a reference image's origin can't be confirmed and something about it looks mechanically implausible on close inspection, say so and ask for a better source rather than modelling from it anyway.
- For a brand's own product, the brand's own official photography or spec sheet is always the highest-confidence reference available — check for it before falling back to third-party photos of the same product.

## Modelling workflow (what to expect from a correct BUILD ORDER)

This is the shape of the pipeline a 3D artist or a tool like Blender actually follows — useful for writing a BUILD ORDER that names the right stage, and for judging whether a delivered asset skipped one:

1. **Blockout** — rough primitive forms at correct scale and proportion, checked against the reference board's scale shots before any detail work starts. Catching a proportion error here costs minutes; catching it after full detail and texturing costs a redo.
2. **Base mesh / high-poly detail** — the actual form and surface detail, built to match the reference photos' silhouette and surface features, not approximated from memory.
3. **Retopology** — a clean, animation/deformation-friendly low-poly mesh built over the high-detail version, with topology that follows the form's natural flow (edge loops around joints, eyes, mechanical hinges) rather than an arbitrary decimation of the high-poly mesh — decimation alone produces a mesh that deforms badly and often looks subtly wrong even static, from uneven triangle density.
4. **UV unwrapping** — seams placed in natural hidden edges (behind an ear, inside a fold, along a real seam line on the reference object) so texture stretching and visible seam lines don't appear on a prominent surface.
5. **Texturing/materials** — built from the reference's close-up material shots, not a generic preset; see the shared asset-budget table in `3d-web-reference.md` for the resolution ceiling once this heads to the web.
6. **Rig/animation (if needed)** — only after the mesh is finalized; a rig built on a mesh that still changes upstream is wasted work.
7. **Export to glTF 2.0** per `3d-web-reference.md`'s delivery rules — Draco mesh compression, KTX2/Basis textures, LODs via `THREE.LOD` if the asset appears at multiple distances.

A BUILD ORDER for a 3D asset should name which of these stages it is asking for and what reference it is to be checked against at each stage — "model the product" with no named reference and no stage breakdown is not a gradable order.

## Where to read more (name, do not paste)

polyhaven.com (CC0 HDRIs, textures and models, license stated per-asset); github.com/KhronosGroup/glTF-Sample-Assets (Khronos' own test/reference geometry); sketchfab.com filtered to CC0/CC-BY (check the license tab per model, never assume from the platform); blender.org's own manual for the modelling/retopology/UV workflow terminology used above (the authoritative source for the pipeline stage names, regardless of which tool is actually used to execute them).
