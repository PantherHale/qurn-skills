# Human behaviour in product and web design: what is solid, what is oversold

Researched 2026-11-07. Tags as in `domain-atlas-reference.md`. The headline for anyone building persuasive interfaces: **published effects of behavioural interventions are smaller and less certain than the popular summaries suggest. Test your own.** Not legal advice.

## 1. Nudges and "psychological tricks": how large are the effects?

- **Mertens et al. 2022 (PNAS)**, a meta-analysis of choice-architecture interventions: an average effect of about **Cohen's d = 0.45** (95% CI 0.39 to 0.52), with the authors also finding moderate publication bias toward positive results [primary].
- **Reanalyses disagree on how much survives.** Szaszi and Higney adjusted the same data for publication bias and estimated an average between **d = 0.08 (severe bias) and 0.31 (moderate)**. A robust-Bayesian reanalysis (Maier et al. 2022) was titled "No evidence for nudging after adjusting for publication bias"; commentators note that does not prove the true effect is zero. [primary papers; read the dispute, do not pick a side from a headline]
- **DellaVigna and Linos, Econometrica 2022**, compared **126 randomised trials run by two nudge units** (about 23 million people) with published academic nudge trials: the nudge-unit trials averaged **+1.4 percentage points** take-up (about an 8% relative increase on a 17.3% control rate), far below the academic literature. They estimate selective publication plus low statistical power explain about **70%** of the gap [primary]. Scope: binary take-up outcomes, defaults excluded, and the academic sample was small.
- **What to take from it:** expect small effects (single-digit percentage points of lift at best), design the test before the tactic, and do not copy a "we got 300% more signups" story. A tactic that reliably works is cheap to verify on your own traffic; one that cannot be verified should not be trusted.

## 2. How people read pages

- **F-pattern (Nielsen Norman Group, 2006, eye-tracking, 232 participants)** [primary on nngroup.com; read the original]: on text-heavy pages users often scan in an F shape, attention concentrated at the top and left, skipping sidebars. NN/g has since described other patterns (for example scanning skipping between keywords and emphasised elements) and the 2006 pattern is not a law for every layout. Practical use: front-load the key words of headings and lines, one idea per section, put the action where the eye already is, and **test the layout instead of assuming the pattern**.
- Most people scan rather than read (NN/g's early finding: most users tested scanned) [practice]: headings, short paragraphs, visible keywords, plain verbs.
- **Trust and credibility** [primary: Stanford Web Credibility Project, credibility.stanford.edu, about three years and over 4,500 people, ten published guidelines; pages date from about 2002 to 2007, so check against current practice]: people judge a site partly by how it looks, so make the visual design fit its purpose; **provide third-party support (citations, references, source material) and link to it**; and sites win credibility by being both easy to use and useful. B. J. Fogg's **prominence-interpretation theory** says users first notice an element (prominence) and then judge it (interpretation); credibility is not judged if either step fails, and context such as the subject area changes the judgement. Limitation: much of it rests on self-reports. Defensible rules: real contact details, real names and photos only if real, sources linked, and no claim you cannot support.

## 3. Persuasion that crosses into harm

- **US:** the FTC's 2024 click-to-cancel rule was **vacated by the Eighth Circuit in July 2025** on procedural grounds [primary-ish via law-firm reports]. The FTC reopened rulemaking with an advance notice in **March 2026**; a new nationwide rule is not in force and is reported to be well over a year away. **Enforcement continues** under the ROSCA statute and Section 5 of the FTC Act, and state auto-renewal laws (California and New York are cited) carry many of the same requirements [practice].
- **Recurring harm themes** in actions: unclear disclosures at signup, charges people did not expect or consent to, and cancellation that is hard or impossible. **Rule for Qurn: signup and cancel must be equally easy, prices and renewal terms stated before payment, and these are blocking findings, not style notes** (matches `web`'s marketing-psychology rules).
- **EU, UK, India:** see `domain-global-law-and-compliance-reference.md`. In short: DSA Article 25 bars platform dark patterns and an EU Digital Fairness Act is planned; the UK's DMCC Act gives the regulator direct fining powers and a subscription regime is due about 2027; India's 2023 guidelines name 13 dark patterns. Dates there are flagged where sources conflict; ask a lawyer for the market you serve.
- **Cultural reach of this whole file.** The studies cited here were run mostly on Western samples (about 96% of psychology samples come from countries holding about 12% of the world's population). Treat effect sizes as unproven elsewhere and test locally (`domain-global-markets-and-localization-reference.md`).
- Dark patterns also lose on evidence: short-term lift is easy to measure and long-term trust, refunds, chargebacks and reputation are not.

## 4. Habits and attention (thin)

Specific numbers about mobile attention, abandonment times and "seconds to hook" circulate widely, often tracing to a single old vendor study. None were verified here. If a plan leans on one, find the original study, its date, its sample and who paid for it before using it.

## 5. How Qurn uses this

1. A behavioural claim in a plan ("add urgency to raise conversion") needs an evidence level: measured on this product, published trial, or opinion.
2. Persuasion changes are experiments with a stated metric, a stop rule and a size expectation set from section 1, not guarantees.
3. Anything in section 3 is checked at the pre-launch gate.
4. Weak spots listed above go into the report as open items, not guesses.
