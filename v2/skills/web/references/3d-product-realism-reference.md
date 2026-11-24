# Realistic 3D product (a can, a bottle, a box): expert reference

Learned from the Qurn Cola build (2026-11-03). The operator rejected the hero can at least six times ("blocky", "boxy top and bottom", "lid not detailed", "make it realistic", "fine detail when it stops"). Each round was a small tweak. The root cause: the first pass was built from primitives and the realism bar was never stated. Use this before writing the first line of product-model code. Pair with `3d-web-reference.md` (budgets) and `phone-and-first-load-reference.md` (performance tiers).

## Stop incremental tweaks
If the operator rejects the same object twice, stop adjusting numbers. Do a reference study (real dimensions and real photos of the object), rebuild the weak part from the real structure, and show a close-up still at rest before saying it is done.

## Build from real structure, not primitives
- Take real dimensions first (a 330 ml aluminium can: about 66 mm diameter, 115 mm tall, die-necked shoulder, a smaller lid diameter than the body, a domed base on a standing ring).
- Body: `LatheGeometry` from a smooth profile (centripetal Catmull-Rom through measured points), 256 or more radial segments on desktop and about 160 on the low tier. Never a cylinder with caps.
- Separate meshes for the lid and the dome so each gets its own material and planar UVs. Lid detail: double seam and rim curl, countersink panel, score line, tab with rivet and finger hole, embossed text. Base detail: standing ring, dome, ribs.
- Print wrap: label texture with a correct seam, no mirrored text on any face (check the lid and rim text specifically; a flipped UV was a real bug).

## Materials and light
- `MeshPhysicalMaterial` with clearcoat for print, a separate metal for aluminium. Metalness and roughness maps; a normal map generated from a height map for ribs and emboss.
- Studio lighting from a CC0 HDRI (Poly Haven) on a PMREM environment, plus strip lights and a black flag for crisp edges. Credit the HDRI. Rotate the environment dome, not just the object, so reflections move.
- Dew and fine grain are cheap texture detail that sells realism; keep them on the low tier but drop MSAA before dropping detail.

## Review the still frame
Viewers see fine detail when rotation stops. The review gate is a set of close-up stills at rest (front, three-quarter, top-down on the lid, underside), each at 2x zoom, compared with a real photo. A moving-only check misses boxy ends.

## Brand safety for a public demo
If the site will be public and the product mimics a real brand, replace the name, logo and recognisable trademarked marks before publishing, or get the operator's explicit decision to keep a shape. Ask once, record the decision, and keep the design identical when the operator says "same design, change the text only".
