# Web designer: logo and brand identity reference

Checked against primary and secondary sources 2026-10-05. Named checklists below are "commonly attributed to" the named designer across multiple independent industry sources, not a word-for-word scan of the book itself — present them that way, not as a verbatim quote.

## Paul Rand's filter (designer of IBM, UPS, ABC)
No single numbered checklist — his principles are aphorisms spread across "Thoughts on Design" (1947), "A Designer's Art" (1985) and "Design, Form, and Chaos" (1993/94). The practical three-word filter commonly attributed to him: a logo must be **distinctive, memorable, and clear** — reject a concept that fails any one of the three. His deeper point, repeated across his writing: a mark's meaning doesn't come from clever symbolism in a vacuum, it comes from the quality of the thing it stands for, built up through consistent repeated association over time (IBM's mark didn't become trusted because of its stripes — the stripes became trusted because of IBM). Also commonly quoted: "Simplicity is not the goal. It is the by-product of a good idea and modest expectations."

## David Airey's 5-point rubric ("Logo Design Love")
The most widely cited pass/fail checklist in the industry — use it before any client presentation:
- **Simplicity** — simple and legible enough to be instantly recognisable.
- **Memorability** — distinct enough to be recalled after brief exposure.
- **Timelessness** — avoids dated trend elements so it doesn't need a redesign in 3 years.
- **Versatility/scalability** — works at any size and across every medium (print, favicon, embroidery, a single-color stamp).
- **Appropriateness** — fits the target audience and industry context — a children's brand mark is not a law-firm mark.

## Michael Bierut / Pentagram — no numbered framework, but a real pattern worth naming
Bierut's "How to" is a monograph of 40+ case studies, not a rule set — there's no "Bierut Principle" to cite the way there's an Airey checklist. What IS a genuinely useful, nameable pattern from his work: the **generative/flexible identity system** — a logo that is a *set of rules* producing many valid variants, rather than one fixed mark. His MIT Media Lab identity (dozens of generated logo variants from one system) is the reference example to cite when a client needs a flexible identity rather than a single static logo.

## Technical production rules (confirmed as standard industry practice; no single universal number — each brand sets its own)
- **Minimum clear space:** defined as a multiple of an "X" unit taken from the logo's own geometry (often the wordmark's x-height, or a distinct mark element's height) — e.g. "clear space = X on all sides." Every brand guideline defines its own X; there is no universal fixed number across all logos.
- **Minimum reproduction size:** typically a print minimum (commonly around 1 inch / 25–26mm width) and a separate digital minimum (commonly around 70px wide) — again, brand-specific, not universal.
- **Monochrome/reversed/grayscale test:** every logo needs a 100%-black version, a reversed (white-on-dark/knockout) version, and often a single spot-color version, to confirm it holds up without color.
- **Favicon/app-icon scaling test:** render the mark at every real-world size it will actually appear at — 16×16 and 32×32 (favicon), the platform's app-icon safe zone (see below), and 1024×1024 (store listing). If it loses its distinguishing shape or becomes illegible at 16–32px, it needs a simplified mark-only variant for small formats, not just a scaled-down version of the full lockup.
- **Construction grid:** publish the exact geometric construction (often circles/squares keyed to the logo's own proportions) so the mark can be redrawn identically by any third party.

## Platform app-icon specs (verify against the live page before treating as exact — see caveat below)
- **Android adaptive icons (confirmed first-party):** 108×108dp full container; a 66×66dp safe zone centered inside it that's never clipped by any OEM mask shape; foreground logo content between 48×48dp minimum and 66×66dp maximum; the outer 18dp margin on each side is reserved for mask/parallax/pulse effects and must be treated as droppable.
- **Apple app icons (partially verified — the live HIG page is JS-rendered, figures below are secondary-sourced, re-check before citing as exact):** App Store listing 1024×1024px; iPhone home screen 180×180px (60pt@3x) and 120×120px (60pt@2x); iPad Pro 167×167px (83.5pt@2x); iPad 152×152px (76pt@2x); Spotlight/Settings use smaller scaled variants (120/80/58/40/29px). Apple applies the rounded-corner mask itself — design the source icon as a full square, never pre-rounded. A specific "80% safe zone" figure circulates in secondary sources but is not confirmed as Apple's own stated number — don't cite it as a first-party Apple figure.
- **Practical export rule:** design the core mark to sit inside Android's 66dp safe zone and keep roughly the central 60–65% of the canvas clear of critical detail for iOS's auto-masked corners, then actually render and check it at 16px, 32px, 48dp/120px, and 1024px before calling the icon done.

## Color psychology — flag folk wisdom as folk wisdom, not fact
**"Blue means trust, red means urgency" style claims have no peer-reviewed backing for a universal, context-independent mapping.** Academic color-in-context research generally finds color meaning is culturally and contextually dependent — the same color signals different things in different markets and industries. Treat any generic "color X means Y" claim as unverified unless a specific peer-reviewed citation is given.

**The "color increases brand recognition by up to 80%" statistic is very likely a zombie statistic — do not cite it as fact.** It's almost always attributed to "a University of Loyola, Maryland study" that cannot be located in any academic database; no sample size, methodology or publication year accompanies the claim anywhere it's repeated. This is the textbook pattern of a number that spreads because it sounds authoritative, not because anyone can trace it.

**What's more defensible, though still survey-based and not a controlled experiment:** a Reboot consumer survey (n=2,648) found 78% of respondents could recall a logo's primary color versus only 43% who could recall the company's name — a real, if single-study, data point suggesting color recall often beats name recall. That's the claim to use if you need one; not the 80% figure.

## Where to read more (name, do not paste)
"Logo Design Love" (David Airey); "Thoughts on Design," "A Designer's Art," "Design, Form, and Chaos" (Paul Rand); "How to: Use Graphic Design to..." (Michael Bierut / Pentagram) — read for the case studies, not a rule set; developer.android.com/develop/ui/views/launch/icon_design_adaptive (first-party, reliable); developer.apple.com/design/human-interface-guidelines/app-icons (JS-rendered — use a rendering-capable tool before citing exact pixel figures); any real brand style-guide PDF (most organizations publish theirs) as a working example of clear-space and construction-grid conventions in practice.
