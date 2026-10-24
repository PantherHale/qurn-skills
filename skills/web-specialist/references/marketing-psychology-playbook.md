# Marketing psychology playbook

A condensed, actionable distillation of 12 research rounds on why people actually buy on websites.
Full depth (every citation, caveat, and vertical-specific deep-dive) lives in
`marketing-psychology-reference.md` through `marketing-psychology-reference-12.md` and
`startup-launch-channels-reference.md` in this same folder -- read one of those directly when a
decision needs the underlying study, not just the rule. This file is the rule set; those are the
evidence.

## 1. Core mechanisms (cite these by name when reviewing copy)

- **Fogg B=MAP**: Behavior = Motivation x Ability x Prompt. A weak CTA is usually an ability
  problem (too much friction) or a missing prompt (no clear next step), not a motivation problem --
  fix the right one.
- **Cialdini's 7**: reciprocity, commitment/consistency, social proof, authority, liking, scarcity,
  unity. Each needs a concrete, TRUE instantiation on the page (a real review count, a real
  deadline) -- a fabricated one is a dark pattern, not a tactic.
- **Pricing psychology**: left-digit effect (.99 pricing), anchoring (show the reference price
  first), the decoy effect (a deliberately-inferior middle tier makes the target tier look good),
  mental accounting (bundle framing changes perceived value). "Pennies-a-day" reframing works for
  low daily-equivalent prices but backfires above roughly $4-11.50/day-equivalent -- it starts
  reading as evasive.
- **Social proof / trust**: works hardest where the buyer has the LEAST other information
  (independent/unfamiliar sellers, not big brands). Baymard's checkout research: average cart
  abandonment is ~70%, and fixing checkout UX alone recovers roughly a third of it -- this is the
  single highest-leverage, best-evidenced number in the whole knowledge base.
- **Cognitive biases**: loss aversion, endowment effect, paradox of choice (real only for
  comparable, high-stakes, low-expertise choices -- not a blanket "fewer options always win"),
  default effects (powerful, but pre-checked opt-outs are exactly what dark-pattern law targets).
- **Intention-behavior gap**: what people say they'll do and what they actually do diverge
  reliably -- trust behavioral/A-B data over stated intent or survey results.

## 2. Page-design rules

- **Attention**: most visitors scan in an F or Z pattern; ~35% never scroll past the first screen,
  but scrollers drive the large majority of engagement -- the fold is not the whole page, but it is
  the gate.
- **Copywriting**: specificity beats vague superlatives; benefit framing beats feature lists; a
  curiosity gap only works when the reader already has SOME prior context to feel the gap.
- **Onboarding**: find this product's own real activation milestone through its own data -- do not
  borrow another company's "magic number" (e.g. Facebook's "7 friends in 10 days" is unverifiable
  folklore, not a transferable rule).
- **Forms**: every field costs conversion; average forms carry 11-14 fields when 7-8 would do.
  Autofill-friendly input types measurably cut abandonment.
- **Visual hierarchy**: distinctiveness/contrast is what draws the eye, not a specific hue --
  "red buttons convert better" and "blue signals trust" are both folklore; no controlled research
  supports a universal color-to-conversion or color-to-emotion mapping.
- **Retention/gamification**: variable rewards and progress bars work, but badly-designed extrinsic
  rewards can crowd out intrinsic motivation (Deci & Ryan) -- do not gamify something the user
  already wanted to do for its own sake.
- **Guarantees**: risk-reversal framing taps loss aversion; it is a theory-extension, not an
  independently-proven conversion lever on its own -- do not promise a specific lift number to a
  client.

## 3. Category-specific notes

- **B2B**: 6-10 stakeholders typically touch a purchase decision (Gartner); de-risk for a
  committee (case studies, ROI calculators, references), not just for an individual buyer.
- **SaaS**: free-trial-length "optimal number" claims are mostly contradictory vendor folklore; the
  one large randomized field experiment found no significant conversion difference between 3- and
  7-day trials.
- **E-commerce**: impulse-buying research (Rook 1987) is real; checkout-cost-reveal timing and
  forced account creation are proven abandonment drivers.
- **Marketplaces**: two-sided trust (buyer trusts an unfamiliar seller) leans harder on ratings and
  photos than on raw review volume.
- **Subscriptions**: the FTC's "click-to-cancel" rule was vacated by the 8th Circuit in July 2025 --
  do NOT cite it as current law; check its live status before relying on it. State-level
  auto-renewal laws may still apply independently.
- **Donations/nonprofits**: a single named, identifiable beneficiary outperforms statistics
  (identifiable victim effect) -- urgency here should be about the beneficiary's real stakes, not a
  fabricated donor-side deadline.
- **High-stakes/infrequent purchases (real estate, enterprise)**: urgency tactics carry real legal
  risk (Fair Housing Act implications for targeted urgency marketing) and should generally be
  replaced with confidence-building (virtual tours, detailed specifics) over pressure.
- **Gaming/loot-box monetization**: the SAME mechanic is legally gambling in Belgium, was
  litigated/reversed in the Netherlands, and is only voluntarily self-regulated in the UK -- this
  cannot be treated as a generic tactic; it needs a per-jurisdiction legal check.

## 4. Hard legal/ethical lines (treat these as blockers, not style notes)

- **Fake reviews/testimonials**: the FTC's 2024 final rule (16 CFR Part 465) bans AI-generated or
  non-existent-person reviews, paid positive reviews, and review suppression. Never generate a
  synthetic "customer testimonial."
- **Influencer/affiliate disclosure**: the FTC's 2023-revised Endorsement Guides (16 CFR Part 255)
  require disclosure to be functionally unavoidable -- small font, buried captions, and brief
  on-screen text all fail the current standard.
- **Fabricated urgency/pricing**: a fake "was $X" price or a countdown timer that resets is an FTC
  violation, not just an aggressive tactic (see the 2024 Williams-Sonoma consent order).
- **Regulated verticals (health, finance, legal)**: health claims need the FTC's "competent and
  reliable scientific evidence" standard (RCTs, not anecdotes); financial marketing is bound by
  CFPB/TILA disclosure rules. Urgency/scarcity tactics compound legal risk here.
- **Privacy/consent**: GDPR requires consent to be "freely given" (Art. 4(11)/7) -- asymmetric
  accept/reject button design and pre-checked categories are documented dark patterns, not
  acceptable UX variance. CCPA/CPRA requires specific opt-out link language, not GDPR-style opt-in.
- **Dark patterns generally**: use the formal nudge/sludge distinction (Thaler 2018) -- a nudge
  makes the better choice easier; a sludge makes the worse choice merely less obviously hard to
  avoid. A 9-step cancellation flow is sludge regardless of whether a specific statute names it.

## 5. When NOT to use these tactics

- Urgency/scarcity: never fabricate it; avoid it almost entirely in real estate, finance, and
  donation asks where it reads as manipulative or carries legal risk.
- Social proof: thin or fake social proof (inflated counters, generic "join 10,000+ others") is
  often worse than none.
- Gamification: don't bolt it onto a task the user is already intrinsically motivated to finish.
- Personalization: can trigger reactance ("this feels like surveillance") -- more data-driven
  personalization is not always better.
- Scarcity/hype drops: fine for consumer culture goods, legally fraught for loot-box-style game
  monetization, and reputation-risky if resale-market signals contradict the primary-market story.
- Any tactic from this file applied in a regulated vertical (health/finance/legal/gambling-adjacent):
  default to caution and flag for the security specialist's legal-compliance review.

## 6. Launch-channel quick lookup

Full categorized list with live-status notes: `startup-launch-channels-reference.md`. Quick picks:

- **SaaS/B2B tool**: Product Hunt, Indie Hackers, SaaSHub, G2 Crowd, Capterra, r/SaaS, r/microsaas.
- **Indie/solo side project**: r/sideproject, r/buildinpublic, r/indiehackers, Starter Story.
- **Landing-page or visual design work**: Land-book, Postmake, r/design_critiques.
- **Pre-launch beta/waitlist**: Betabound, BetaTesting, r/alphaandbetausers.
- **Mobile app**: appPicker; verify app-submission directories before using -- several in the source
  list (appvita.com, ebool.com, startuptabs.com) were found dead or repurposed; re-check before
  recommending any site not in regular use.
