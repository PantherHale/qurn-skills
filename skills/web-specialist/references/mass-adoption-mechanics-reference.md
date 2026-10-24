# What products with millions of users actually do -- reverse-engineered, dated 2026-10-18

Operator: "reverse engineer many things and websites that attract millions of people and see how they do it."
Researched against named products (Duolingo, Linear, Stripe, TikTok, Airbnb) rather than generic trend pieces.
Source quality is mixed by design of the research itself -- most of what's public on these products is blog/agency
commentary, not controlled studies, so every claim below says how solid it is. Use the solid mechanisms as real
technique; use the anecdotal ones as plausible direction to verify, not as fact to cite to the operator as settled.

## The one finding that overrides all the others
Duolingo's own retention lead (Jackson Shuttleworth, interviewed on Lenny's Newsletter) said it directly: **if people
don't already find inherent value in the product, a streak or any other engagement mechanic will not create that
value -- it only amplifies value that's already there.** Every mechanic below is an amplifier, not a substitute for
the product actually doing its job. A build that copies TikTok's variable-reward feed or Duolingo's streak UI onto a
product nobody independently wants yet is cargo-culting the amplifier without the thing it amplifies.

## Mechanism 1: habit loops reward ONE simple action, not a point system (solid -- named source)
Duolingo initially tied streaks to an XP threshold and it confused users; simplifying to "complete one lesson today"
made the mechanic work. **Rule for a build:** if you add a daily/return mechanic, gate it on the single action that
IS the product's core value (one lesson, one check-in, one send), never a composite score the user has to calculate
in their head to know if they're "on track."

## Mechanism 2: loss aversion beats gain framing (solid, well-established psychology; Duolingo's own copy test is named)
Duolingo found that changing a button's label from "Continue" to "Commit to my goal" measurably increased retention
-- framing the action as a commitment the user would LOSE by skipping, not a neutral "next step." Streak Freezes
(preserving a streak through one missed day) work the same way: forgiveness mechanics make the loss-aversion hook
sustainable instead of punishing, which keeps people from abandoning the whole habit the first time they slip.
**Rule for a build:** where a return mechanic exists, phrase the CTA as protecting/continuing something the user
already has, not just "do the next thing" -- and pair any streak/count mechanic with an explicit forgiveness path.

## Mechanism 3: a visible identity marker turns a private habit into a status signal (plausible, named example)
Duolingo gives a distinct app icon at a 30-day streak -- the mechanic becomes something OTHERS can see (on a home
screen), not just an internal counter. This is the same principle as a public leaderboard, a visible badge, or a
shareable streak graphic: a habit mechanic compounds faster once it has a visible, external form.

## Mechanism 4: variable reward + no stopping cue (solid psychology, contested specific-platform causation)
TikTok's feed (and infinite-scroll feeds generally) run on variable-ratio reinforcement -- the same schedule B.F.
Skinner found most persistent: the user can't predict which scroll will be the good one, so the behavior (scrolling)
keeps getting reinforced intermittently rather than every time. Removing an explicit "end of list" or "load more"
click removes the natural decision point where a user would otherwise ask "should I stop?" **Caution, not just a
technique to copy:** the EU's preliminary findings (ongoing investigation, not final) describe this combination as
designed to fuel "compulsive behaviour and reduce users' self-control" -- this is the single mechanism in this file
with the most direct ethical weight. Use variable-reward content ordering (mixing predictable and surprising results
in a feed) for genuine engagement; do NOT remove natural stopping cues (session-end screens, "you're caught up"
markers) on a product where unbounded engagement isn't actually good for the user -- that crosses from persuasive
design into a dark pattern, which the anti-slop and marketing-psychology knowledge in this project already treats
as a hard block.

## Mechanism 5: trust is carried by ONE photo more than by review volume (solid -- peer-reviewed, counter-intuitive)
Ert, Fleischer & Magen's published study on Airbnb found a host's PHOTO shaped guests' sense of trustworthiness and
booking/price far more than review scores did -- the peer-reviewed result found review scores had no measurable
effect on price or booking likelihood, which cuts against the common "show lots of reviews" advice repeated in
marketing blogs. Airbnb's own early growth move was replacing bad listing photos with professional photography,
reportedly doubling bookings in some markets within weeks (anecdotal, not peer-reviewed, but directionally
consistent with the photo-trust finding). **Rule for a build:** when a product's trust problem is "will a stranger
believe this is real/safe," invest in ONE excellent, real, human-containing photo before investing in a review
carousel -- this directly reinforces image-rules.md's existing ban on stock photography standing in for the real
thing: a real face/place photographed well is doing measurable trust work that a review-count badge is not.

## Mechanism 6: checkout/payment trust is visual simplicity + reassurance cues, not persuasion copy (vendor-sourced, directionally consistent with established checkout research elsewhere in this knowledge base)
Stripe's own guidance (vendor content, so read as informed opinion, not independent study) names exactly two levers
at the payment step: visual simplicity and trust cues (SSL/TLS badges, card-network logos, short reassurance copy,
a visible "secure checkout" signal), explicitly because by the time someone reaches payment, the job is removing
final doubt, not persuading further. This matches (does not contradict) the Baymard checkout-abandonment data
already in web-designer-behavior.md: extra costs and security concerns are top abandonment reasons, so the fix at
this specific step is REMOVING friction and doubt, not adding a sales pitch.

## Mechanism 7: category-defining aesthetic + organic network spread, not ad spend (mostly anecdotal/commentary -- treat as direction, not fact)
Linear is repeatedly cited (design blogs, a public case study claiming ~$35k lifetime marketing spend -- unverified
by this research, treat skeptically) as growing through people adopting it individually, then inviting their whole
team -- the same network-effect spread as Figma or Loom, where the product's VALUE is multiplayer, so one happy user
structurally creates the next ten. Its onboarding is described as deliberately calm (no celebratory flourishes, no
confetti) -- confidence signaled through restraint, consistent with this project's own anti-slop stance against
generic celebratory/gamified UI. **Caution:** several sources argue Linear's specific dark+purple, keyboard-first
aesthetic is now OVERSATURATED as every B2B tool copies it -- this is a argument for NOT defaulting to it (ties
directly to web-director.md's "Training on five different products showed the same... chosen every time" warning).
The transferable lesson is the MECHANISM (invite-driven spread from genuine multiplayer value, restrained onboarding
copy), not the Linear look itself.

## What this changes about how a build gets planned
Before CONCEPT in web-director.md, when the brief is for a product meant to retain or spread (not a one-time
brochure site), ask explicitly: (1) what is the ONE simple action this product wants repeated, (2) is there a
genuine multiplayer/network reason for one user to bring in the next, (3) what is the single highest-trust real
photo this product can show, and (4) where is the natural stopping point a user should be allowed to reach without
the product fighting it. A landing page can borrow the VISUAL vocabulary from mass-adoption products (restraint,
one real photo, one clear commitment-framed CTA); it should not borrow the retention mechanics (streaks, variable
reward, no stopping cues) unless the brief is actually building a retained-use product, and even then mechanism 4's
ethical caution applies.

## Sourcing note
Duolingo: Lenny's Newsletter interview with Group PM Jackson Shuttleworth (named, most authoritative source found).
Airbnb: Ert, Fleischer & Magen, "Trust and reputation in the sharing economy" (peer-reviewed); photo-doubling-bookings
claims are anecdotal secondary sources. Stripe: Stripe's own published checkout-design guidance (vendor content).
TikTok/infinite scroll: established behavioral-psychology literature on variable-ratio reinforcement, applied by
secondary UX commentary to TikTok specifically (platform-specific causation is asserted, not independently proven);
EU Commission preliminary findings are explicitly preliminary. Linear: design-blog case studies and commentary, no
primary financial or growth data independently confirmed.
