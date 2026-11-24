# Web designer: choosing the 3D approach (viewer, splats, scans, AR) and the iOS limits

Researched 2026-11-07. Same confidence tags as `3d-pipeline-and-ai-assets-reference.md`: **[spec]** primary docs, **[practice]** several practitioner sources agree, **[to verify]** single source, vendor claim, or conflicting. Most sources here are vendor and community posts; confirm any number against official docs before quoting it.

## 1. Pick the tool by the job, not by habit

| Job | Use | Why |
|---|---|---|
| Show one GLB product, rotate, AR button | `<model-viewer>` [practice] | No scene setup; handles AR modes. Display only, no custom logic or physics |
| Custom configurator, scroll-driven hero, React app | Three.js with React Three Fiber [practice] | Largest ecosystem; HTML/CSS integration; full control |
| Game-like scene, physics, XR | Babylon.js [practice] | Full engine, heavier (sources cite ~1.4 MB vs ~168 kB core for Three.js [to verify]) |
| Designers and non-engineers edit the scene | PlayCanvas [practice] | Cloud editor; poor fit for one developer adding a viewer to a shop |

Default for this repo's product pages: `<model-viewer>` when the brief is only "show the product", Three.js/R3F when scroll, custom shaders or a configurator are in the brief. Say which and why in the BUILD ORDER; "use Three.js" with no reason is not gradable.

## 2. AR on a product page

- [practice] Pattern: GLB for Android and WebXR, USDZ for iOS Quick Look. In `<model-viewer>` this is `ar-modes="webxr scene-viewer quick-look"`.
- [practice] `<model-viewer>` 1.7 and later can auto-generate a USDZ on tap, so a separate iOS file is optional; ship a hand-made USDZ when materials must be exact.
- [practice] WebXR AR runs in Chrome on Android (83+). [to verify] I found no confirmation of WebXR AR on iPhone or iPad; assume iOS means Quick Look only, and test on a real device.
- AR needs real-world scale. Export the model in metres at true size, or the object appears giant or tiny in the room.

## 3. Gaussian splats (scanned, photoreal scenes)

- [practice] Splats suit capturing a real object or place with photographic detail that meshes struggle to match (fine fur, glass, foliage). They are weak for anything that must be relit, animated, or edited like a mesh.
- [to verify] Three.js has merged a native splat renderer for WebGPU (one source says r186, with r185 then current); Spark (World Labs) is a third-party renderer that mixes splats with meshes and is reported to run on low-power phones. Check the current Three.js release notes before relying on either.
- [to verify] SPZ is the compressed format (version 4 announced May 2026 by Niantic, who claim much faster loading). One guide benchmarks a 1M-splat scene at 236 MB as PLY versus about 24 MB as SPZ, suggests under 20 MB for mobile and 50 MB for desktop, and warns that beyond about 1M splats mobile devices hit memory failures. One guide, so test it.
- **Rule:** a splat viewer is lazy-loaded, has a poster image, a hard size cap and a mesh or video fallback. Same record-the-source rule as any asset: a scan of a real object the operator owns, with capture date, in `REFERENCES.md`.

## 4. Photogrammetry and scans to a clean web mesh

- [practice] The pipeline is capture, solve, retopologise, bake, texture. Raw scans are millions of triangles with baked-in lighting; they are never shipped as-is.
- [practice] Retopology options: automatic (ZRemesher, Instant Meshes, tool-built quad remesh) then manual cleanup, or a low-poly cage shrink-wrapped to the scan. Bake the high-poly detail into a normal map on the low-poly, in Blender's bake panel with both meshes aligned.
- [practice] Bake maps before moving or reshaping geometry.
- [practice] Scans carry no real-world scale unless the capture included a scale reference. Measure one dimension on the real object and scale to it (this is why `3d-modelling-reference.md` demands a scale shot).
- [practice] Remove baked-in lighting from the colour texture, or the model is lit twice and looks wrong under the page's own lights.

## 5. Blender to glTF without losing the material

All [spec] from Blender's own glTF manual unless marked:
- Pack **ambient occlusion in red, roughness in green, metalness in blue** in one texture; set that image's colour space to **Non-Color**. The exporter copies it through untouched when wired this way.
- Normal maps: tangent space only (the only type glTF supports), Non-Color.
- glTF textures are PNG or JPEG on export; compress to KTX2 or WebP afterwards (see `3d-pipeline-and-ai-assets-reference.md`).
- [practice, community] Do not bake lighting into roughness or metalness; bake albedo, roughness and metalness as separate maps, then pack.
- **Not found:** I found no source on Khronos PBR Neutral tone mapping, so it is unconfirmed here. If a brief needs colour-accurate product rendering, check the Khronos 3D Commerce and glTF Sample Viewer docs and test the tone-mapping setting against a real photo.

## 6. iOS Safari is the tier that breaks

All [practice, community and WebKit bug reports; Apple publishes no exact limits]:
- iOS has a hard memory ceiling for WebGL. Exceed it and Safari kills and reloads the tab, sometimes in a loop (WebKit bug reports, Oct 2025).
- A viewer that is unmounted keeps geometry and textures in the context until disposed. Dispose geometries, materials, textures and render targets on teardown.
- Navigating between two WebGL pages can start the second with a lost context; handle `webglcontextlost` and `webglcontextrestored`, and show the poster image instead of a blank canvas.
- Context loss was reported on specific iOS releases (18.2 and 18.3) on some devices; iframes appear stricter on memory.
- **Test list:** an older iPhone (XR, XS or SE class) on the newest iOS, cold load on the live URL, 10 minutes idle, then navigate to another page and back. Record what could not be measured.

## 7. BUILD ORDER additions

- `Approach: <model-viewer | Three.js/R3F | splat | mesh>` plus a one-line reason from section 1.
- `AR: <none | Quick Look + Scene Viewer + WebXR>`, real-world scale stated in metres.
- `iOS: dispose on teardown, context-loss handler, poster fallback, tested on <device>`.
- For a scan or splat: `Capture: <date, device, who>`, size cap, and the fallback.

## Sources

Consulted 2026-11-07 (secondary): radiancefields.com on the Three.js splat renderer; github.com/sparkjsdev/spark; nianticspatial.com SPZ 4 post; polyvia3d guides; docs.blender.org glTF 2.0 manual (4.1 and 4.3); discourse.threejs.org texture thread; utsubo.com, pkgpulse.com and cloud.needle.tools library comparisons; modelviewer.dev AR examples; Khronos news on model-viewer 1.7; WebKit Bugzilla 289601, 290623, 300782; community.cesium.com iOS 18.2/18.3 thread. Primary sources to confirm against: khronos.org/gltf, docs.blender.org, modelviewer.dev, threejs.org release notes, webkit.org.
