# Research: source credibility and tiering

Origin: research 2026-10-30, sources in `research/research-specialist.md`. Run this on every source before using
what it says.

## Tier every source before using it

- **Primary.** The original record: the dataset itself, the primary research paper, the law's actual text, the
  vendor's own docs/changelog, the company's own filing or press release, a direct quote/transcript, the source
  code. Prefer this tier whenever one exists and is reachable.
- **Secondary.** A credible party's analysis or report *of* a primary source: a news outlet reporting on a study,
  a law firm's client alert summarizing a ruling, a textbook. Useful and often necessary, but one step removed.
- **Tertiary.** An aggregator, summary-of-summaries, SEO content farm, or a blog restating a secondary source with
  no new verification of its own. Treat as a lead to the real source, not as a citation in its own right.

**Rule (IFCN Code of Principles, the professional fact-checking industry's own standard):** prefer a primary
source wherever a suitable one exists and is reachable; when only a secondary source is used instead, say so
explicitly in the report rather than presenting it as if it were primary. Silence about using a secondary source
is itself a defect.

## CRAAP check each source whose reliability isn't already obvious

Run this on anything that isn't an obvious primary source (a vendor blog, an anonymous aggregator, an unfamiliar
outlet, a one-person newsletter):

- **Currency** -- how recent is it, and has it been updated since first published? A fact that was true when
  written can be stale now; check the publish/update date explicitly.
- **Relevance** -- does it actually address the specific claim at hand, for the audience you're researching for,
  or is it adjacent/tangential dressed up as on-topic?
- **Authority** -- who wrote or published it, and what is their actual expertise or affiliation? An unsigned post
  or an anonymous "industry expert" is a lower-authority source than a named researcher, a named court, or an
  organization's own official page.
- **Accuracy** -- is the claim evidenced, reviewed, or independently checkable, or is it an unsupported assertion?
- **Purpose** -- why does this source exist? To inform, to sell something, to persuade, to rank well in search
  (SEO content), or to advocate a position? A source's purpose shapes what it is likely to omit or exaggerate,
  even when nothing in it is outright false.

**Known limitation of CRAAP, carry this forward:** it judges one source in isolation and says nothing about
whether other sources agree. Passing CRAAP is not the same as being corroborated -- see
`corroboration-reference.md` for the separate, required second step.

## Weighting notes

- A source's stated purpose (commercial, advocacy, SEO) does not automatically disqualify it, but it must be
  factored into how much weight the claim gets and said out loud in the report, not silently discounted or
  silently trusted.
- Official/primary pages (a vendor's own docs, a court's own opinion, a regulator's own page) outrank every
  secondary write-up of the same fact, even a well-regarded one -- fetch the primary page directly whenever the
  URL is known, rather than settling for a summary of it.
- A page that itself only aggregates other blogs' claims with no primary citation of its own (a common SEO
  pattern found repeatedly in this specialist's own build research -- vendor content-marketing posts restating
  each other) should be named as such in the report, not cited as if it were independent confirmation.
