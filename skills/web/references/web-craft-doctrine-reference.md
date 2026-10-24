# Web designer: studio doctrine, with measured commercial palettes

Distilled 2026-10-08 from three installed sources read in full or by section: impeccable 4.0.2 (SKILL.md, new-work.md, craft-floor.md, overdrive.md, colorize.md), taste-skill (sections 4.8, 5, 10) and ui-ux-pro-max (its 192-row palette CSV, inspected and mostly REJECTED, see 3). Colour numbers in 3 are computed styles read from the live pages, not remembered. Where a source rule conflicts with an operator rule already in `web-director.md`, the conflict is named instead of silently picked.

## 0. Why this file exists
The operator's complaint (2026-10-06 and 2026-10-08): coffee-brand pages came out as lectures (a graph, a simple fade, no product, no colour). Root cause found by reading the references: `web-designer-behavior.md` (scan patterns, Hick's law, "marketese", banner blindness) is research for pages people OPERATE or READ. It was being applied to pages people are PERSUADED by. Decide the mode first (1); only then pick which rules govern.

## 1. Visitor mode: choose one, write it in CONCEPT
- **Persuade**: the visitor decides and acts, design is the product (landing page, campaign, product or brand site, pricing). Governed by `commercial-product-presentation-reference.md` and this file. Colour: Committed, Full palette or Drenched. The UX laws in `web-designer-behavior.md` become CHECKS (contrast, hit areas, Core Web Vitals, reduced motion), never reasons to cut the product shot, mute the colour or add explanatory copy.
- **Operate**: the visitor completes a task (app UI, dashboard, editor, settings). Scanability, consistency and native expectations outrank expression. Restrained colour is correct here.
- **Read**: the visitor understands something (docs, articles, changelog). Structure for comprehension first.
- **Experience**: the visitor is inside the work (portfolio, gallery, showcase). The artifact leads from the first viewport.
Mode follows the SURFACE, not the product: a tool's landing page is Persuade, a fashion house's docs are Read.

## 2. Colour: pick a strategy before any hex
**Restrained** (neutrals plus one accent; right for Operate and Read) / **Committed** (one saturated colour owns 30 to 60% of the page) / **Full palette** (3 or 4 named roles) / **Drenched** (the surface IS the colour). A Persuade surface is never Restrained unless the brief pins it. Colour commits at page scale: fields that own whole regions, not accents on a neutral ground.
- Derive neutrals and secondary text from the surface hue; never washed-out generic grey on a coloured field.
- Light or dark is never a category default. Write one sentence of physical scene (who, where, under what light) and let it decide.
- New palettes in OKLCH; lower chroma near white and black. Roles, not swatches: canvas, text, action, border, status, data.
- A flat committed pink, magenta or purple field is legitimate (poppi, 3). What `site-standards.ts` blocks is a purple-to-pink GRADIENT, the AI cliche. Keep the two apart.

## 3. Measured commercial palettes (live pages, 2026-10-06 and 2026-10-08)
Method: `elementFromPoint` on a 20x16 grid over the first 1440x900 screen, walking up to the first opaque background; photo, video and canvas counted as MEDIA. Image-based fields (Taco Bell's green pattern) are not captured as hex. Cookie banners distort some pages (Skittles).
| Brand | Committed colour and ground | Accent and CTA | Type | First screen |
|---|---|---|---|---|
| Burger King | cream ground (seen, hex not sampled) | headline `#502314`, CTA `#D62300` full pill (radius 9999px) | Flame-Bold 60px, 4-word headline | one burger photo, 135 words on the whole page |
| Coca-Cola scroll concept (Sitasys, Webflow) | Drenched `#ED1C16` plus a white ribbon | white headline | Montserrat 64px | red field, 2 images, 195 words |
| Jupiter soda concept (Sitasys) | ground `#1C1A1B`, solid type `#943C20` | cream outline type `rgb(238,227,211)` | outline display 168px at 1px stroke, solid 156px | bottle over giant type, 131 words |
| poppi | charcoal `#38383F` 25%, magenta `#EC008C` 13%, yellow `#FFF200` 6% | yellow pill with magenta text; lime `#BCFF00` pill with `#3E8549` text; coral `#F26B6B` with `#8E0011` | display face, 999px pills | 56% photography |
| M&M'S | peach `#FFD0B1` 51% | brown `#5A1F06`, yellow `#FFD200` | rounded display | 24% photography |
| Skittles | orange `#F15922` field | purple `#5C2D91` buttons, radius 2 to 8px | white 64px headline | orange field with product |
| Taco Bell | saturated green pattern field | CTA `#4F1B95`, radius 2px, white text | BrandonGrotesque-Black 42px uppercase white | large cut-out product over the field |
What they share, and what to copy as method (never as a skin): the first screen is a quarter to over half product media; ONE committed colour field with ONE complementary action colour (green and purple, magenta and yellow, red and cream); CTA shape is a brand decision (pill at BK and poppi, near-square at Taco Bell), never the library default; headlines are 2 to 5 words in a heavy or custom face; no chart, no process story, no paragraph above the fold.

## 4. Concept discipline (impeccable new-work, adapted)
- Name the product's one mechanism, the audience's real scene, and the **rut**: the page this category always ships and its predictable opposite. Exclude both before generating candidates. Coffee's rut is dark brown, cream, a serif display face and tracked mono labels.
- List seven candidate worlds from the audience's whole visual culture (packaging, signage, menus, posters, screen traditions), spanning at least three material families. When more than three share one family, you stopped at the obvious artifact.
- Calibration: unprompted, AI output clusters into (a) warm cream ground, high-contrast serif, terracotta or red accent; (b) near-black with one neon accent and glowing edges; (c) editorial hairlines, italic serif, small tracked mono. Landing in one of them on a free brief means the self-check failed. Test: if someone could guess your look from the category alone, rework.
- A pinned brief wins over all of this.

## 5. Contract before code
Write it as an HTML comment in the emitted markup, at most 150 words, five blocks: THESIS (the one idea and the default it refuses), OWN-WORLD (palette and components, recognisable with the content removed), STORY (what the visitor understands, believes and does), FIRST VIEWPORT (exact composition, scale, where the action sits), FORM (the chosen device and the seed or reasoning). The end review audits the render against it. A block that reads like a mood is not decided.

## 6. Craft floor additions (not in `anti-slop-checklist-reference.md`)
- Refuse as page structure: same-size icon plus heading plus text cards; the hero-metric template (big number, small label, supporting stats); nested cards; gradient text; a coloured `border-left` or `border-right` over 1px on cards or callouts; glass or blur as decoration; sparklines and progress rings standing in for content; monospace as a costume for "technical" (use it for code, data and measurement only); section numbers; an eyebrow over every section.
- Type: body 65 to 75ch, tracking floor -0.04em, balanced headings. impeccable caps display at 6rem. CONFLICT, resolved: giant type is a deliberate Persuade device (Jupiter 168px, Nopal) and is allowed as the page's ONE authored moment, measured at every breakpoint; ordinary headings obey the cap.
- Shadows carry offset and soft blur; a zero-offset coloured halo is decoration.
- Motion: one authored moment, not the same entrance on every section; exponential ease-out from a visible default. impeccable also allows blur, backdrop-filter, clip-path and mask. CONFLICT, resolved: scroll-SCRUBBED motion stays transform and opacity only (`web-director.md` T22); clip-path or mask reveals are allowed for one-shot entrances when they hold 60fps.
- Replace nothing with chrome: gradients, glass and icon tiles where an authored asset belongs are the gap showing.

## 7. Assets: the order, and what is never allowed
1. An image or video generation tool when the environment has one (for example fal.ai media via MCP: Nano Banana images, Seedance, Kling or Veo video). Generate at the section's real aspect ratio. Visualise the locked direction first when a tool exists: three compositions, pick one.
2. A real, verified photograph: Openverse CC0 first. Search for the physical object, not the category. One decisive photo beats five mediocre ones. Fetch every URL once to confirm it resolves; some CDNs need a browser User-Agent and Referer.
3. A live render with real geometry, real materials and at least two lights (`web-director.md`, no-photography section).
4. A clearly labelled placeholder slot and a replacement list in the final message.
NEVER: a flat vector illustration standing in for the product (the weakest element of the 2026-10-08 coffee demo was an SVG mug), or div-built fake screenshots.
Truth binds CLAIMS, not demonstrations. Author synthetic demonstration content at full fidelity and label it. Never invent prices, customers, benchmarks, certifications or provenance ("single origin", "roasted on site", "est. 2019") for a real brand; on a fictional demo mark them as placeholders and list them.

## 8. Verify in bounded passes
Build completely, then ONE batched screenshot round with desktop and mobile together, fix everything it shows, and at most one more round. Per-tweak screenshots burn money without raising the bar. The reviewer is a separate pass from the builder. Unattended work never stops to ask: choose, and write the assumptions into the contract.

## 9. Technique toolkit when the page must feel extraordinary (impeccable overdrive)
View Transitions API (same-document in all browsers; cross-document not in Firefox), `@starting-style`, `@property` for animating gradients and colours, scroll-driven animations behind `@supports` with a static fallback, Web Animations API, SVG filter chains, OffscreenCanvas and WebGL (OGL for light builds, three.js for scenes), spring physics (motion or GSAP). Every one degrades to a page that still looks good. Pause off-screen rendering, initialise heavy contexts only near the viewport, test on a mid-range phone. Four checks before shipping: the wow test (someone unprimed reacts), the removal test (does anyone notice it gone), the device test, the context test (right for THIS brand).
