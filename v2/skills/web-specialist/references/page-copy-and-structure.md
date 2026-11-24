# Page structure and copy rules

Operator, 2026-10-01. Applies to every website the office builds. The board counts what it can (em dashes, paragraph length, CTA verbs); you judge the rest.

## How a converting page is built, top to bottom
1. **Nav.** Logo, 3 to 5 links, one CTA button. Nothing else.
2. **Hero (above the fold).** One specific headline (the outcome for one buyer), one line under it that backs the headline, one primary CTA, and proof beside it (a number, a logo strip, a rating, a short quote). The visitor can act without scrolling.
3. **Proof strip.** Logos, press or one number, right under the hero.
4. **Pain (optional).** Two sentences in the buyer's own words.
5. **Benefits or how it works.** Three steps or three cards, benefit first, one visual each.
6. **Deep proof.** Testimonial, case study, before and after, demo. Each claim sits beside its evidence.
7. **Objections.** Price clarity, guarantee, 4 to 6 real FAQs. Placed immediately before the final CTA.
8. **Final CTA.** Repeat the one primary action; remove risk ("no card needed", "cancel anytime") only if true.
9. **Footer.** Links, contact, legal, newsletter. No new pitches.

Order follows the visitor's questions: what is it, is it for me, does it work, what does it cost, what if I am wrong, how do I start. One idea and one job per section. One primary CTA, repeated, not five different ones. Vary the rhythm (full-bleed, split, grid, quote) so neighbours never look alike, and keep section padding consistent so there is no dead space.

## Copy rules (each one is checkable)
1. **No em dashes.** Zero in visible copy. Use a full stop or a comma.
2. **Cut false claims.** No "#1", "best", "trusted by thousands", invented counts, logos or testimonials. If it is not true and shown, delete it.
3. **Keep it scannable.** Short lines, one bold key phrase, lists over paragraphs.
4. **Specific headlines.** Name the outcome, the number or the buyer: "Book 30% more repeat orders" beats "Grow your business".
5. **Cut needless info.** If removing a sentence loses nothing, remove it.
6. **One idea per section.**
7. **Break up text blocks.** No paragraph over 3 lines.
8. **Support the headline.** The line under a headline proves or sharpens it, never restates it.
9. **Sell above the fold.** Value, proof and CTA are all visible at 1440x900 and at 390x844.
10. **1 to 3 points per section.** Four or more means split or cut.
11. **Punchy, not padded.** Cut "very", "really", "just", "in order to", "we are passionate about".
12. **CTAs are verb + outcome.** "Get my free quote", "Start the 7-day trial", "See pricing". Never "Submit", "Learn more" or "Click here".
13. **Benefits first.** Lead with what the buyer gets; the feature follows as the reason.
14. **Cut generic openers.** No "Welcome to", "In today's fast-paced world", "At [Brand], we".
15. **Write for lazy readers.** Plain words; every section is understood from its heading and first line.
16. **Cut antithesis.** No "not X, but Y" or "less X, more Y".
17. **Cut aphorisms.** No slogan wisdom ("Quality is never an accident"). State the fact.
18. **Talk to one buyer.** Say "you" and picture one person (the owner of a five-chair salon), not "everyone".
19. **Answer objections before the CTA.** Price, effort, risk, "will it work for me": one line each, with proof.
20. **Proof beside claims.** Every claim has a number, quote, photo or named customer within one screen of it.

## Structure rules added 2026-11-24 (from the public anti-slop skill study; each is checkable)
21. **A layout family appears once per page.** 3-column cards, full-width quote, split text-and-image: each family at most once. A page of eight sections uses at least four families.
22. **Zigzag cap.** At most two consecutive left-image/right-text then left-text/right-image sections. The third in a row is a fail; break it with a full-width section, a stacked section or a bento.
23. **Bento cells equal content.** Three items make three cells, five make five. No blank tile, no filler cell. A multi-cell grid has real variation in at least two or three cells (image, tint, pattern), not six white cards.
24. **No split header by default.** A big headline on the left with a small explainer paragraph floating on the right is out unless there is a compositional reason. Stack them: headline, then body at a 65ch maximum.
25. **Eyebrows.** At most one per three sections (the hero counts). The count is mechanical: tracked uppercase label styles above headlines must not exceed ceil(sections / 3). No version labels ("v2.0", "BETA", "early access") in a hero unless the brief is a launch. No section-number eyebrows ("01 / Process") unless the order itself carries meaning. No "01 / 4" counters on images or tiles.
26. **Hero stack.** At most four text elements: an optional eyebrow, the headline, the supporting line, the action(s) (one primary, at most one secondary). A tagline under the buttons, a trust strip, a pricing teaser, a feature list and an avatar row all move to their own section directly below. The hero headline stays within two lines on desktop; a four-line headline is a font-size error, not a copy error. Hero top padding is capped at about 6rem so the content does not float halfway down. Navigation is one line on desktop and at most 80 px tall (64-72 px by default).
27. **Honest sample data.** No "John Doe", "Jane Doe", "Acme", "Nexus"-style brand names, no `99.99%`, `50%` or `1234567`; use plausible, specific, locale-appropriate names and messy real numbers (`47.2%`). No avatar placeholders drawn as an egg or a user icon. No fake product UI built out of `<div>` rectangles standing in for a screenshot: use a real capture, a real image, or leave it out. Where data is synthetic and a visitor could mistake it for real, label it synthetic and hand over the list of what to replace.
28. **Greeting and shout copy.** No greeting headlines ("Welcome back, Sam!"), no exclamation marks in interface text, no trailing periods on labels, buttons or one-line headings, no hype verbs (supercharge, seamless, unlock, elevate, revolutionize, next-gen). A change states what it compares to ("+12% vs last month").
29. **Word budgets, reconciled.** Our Persuade rule is the stricter one: section heading 1-4 words and a homepage that can run on about 135 words. For other pages use these outer limits: hero headline 7 words or fewer (50 characters), supporting line 12 words or fewer, about 80 words in any 900 px window at 1440, about 450 visible words on a marketing page. State which budget the order uses, then COUNT the words of the real content in the order before fixing the number: a homepage of about 135 words has no room for a five-question FAQ, three chooser reasons and a care list, so either move that content to its own page, cut it, or state the larger budget and say why. A budget check that the content cannot pass forces cutting copy or fudging the counter.

## What the end gate checks
Em dashes in copy: 0. Longest paragraph: 3 lines. Points per section: 1 to 3. Every button starts with a verb. The first 900px hold a headline, a CTA and a proof element. Layout families repeated: 0. Zigzag run longer than 2: 0. Eyebrow styles over ceil(sections / 3): 0. Placeholder names and fake-perfect numbers: 0 (`scripts/slop-scan.mjs` reports `placeholder-copy`, `em-dash-copy`, `eyebrow-overuse`, `emoji-label`).
