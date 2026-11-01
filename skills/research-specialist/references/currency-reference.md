# Research: recency and currency

Origin: research 2026-10-30, sources in `research/research-specialist.md` (CRAAP's currency criterion; this
repo's own `research/security.md` 2026-10-29 update, which is itself a worked example of catching and correcting
a stale claim -- the vacated FTC click-to-cancel rule). The failure mode this guards against: presenting a fact
that used to be true as if it still is, with no signal to the reader that it needs rechecking.

## Date everything time-sensitive

- Every source used for a time-sensitive claim (a law, a price, a version number, a company's current status, a
  security advisory, "who currently holds this role") carries the date it was published or last updated, and the
  date it was checked this session. Both dates go in the report, not just one.
- A source with no visible date, or one that reads as a "living page" (a pricing page, a docs page) without a
  last-updated stamp, is itself worth flagging -- note that currency could not be confirmed from the page alone.

## State the model's own knowledge gap explicitly

- This specialist runs on a model with a training cutoff. On anything that plausibly changed after that cutoff --
  or that changes on any kind of regular cadence -- say so explicitly and actively re-check via search/fetch
  rather than relying on the model's internal sense of "the current state of X."
- Treat "I don't recall this changing" as no evidence at all for a fact that is cheap to actually re-check.

## Actively look for a newer update on anything that changes

Categories that need an active "is there anything newer" check, not just a one-time lookup:
- Pricing, subscription terms, and billing policy pages.
- Laws, regulations, and court rulings (a rule can be enacted, amended, or vacated after the fact -- see the
  FTC click-to-cancel example in `research/security.md`, where a rule assumed to be in force was found to have
  been vacated by an appellate court months earlier).
- Library/API/SDK versions, deprecations, and breaking changes.
- Security advisories and CVEs -- a dependency "clean" six months ago is not evidence it is clean now.
- Personnel, company status (acquired, renamed, shut down), and product names.
- Anything the request itself frames as "the latest," "current," or "as of now."

## Don't let an old secondary source outrank a newer primary one

When a well-corroborated older claim and a newer, less-corroborated primary update seem to conflict, check
whether the newer source genuinely supersedes the older one (an amendment, a new ruling, a new release) before
treating it as a live disagreement under `corroboration-reference.md` -- it may simply be that the older claim
has gone stale, which is a currency problem, not a real dispute between equally current sources.

## Say the freshness ceiling out loud in the report

Every report should state, in plain terms, how fresh its findings are allowed to be: what was actually searched
this session (current as of the session date), versus anything carried over from the specialist's own training
knowledge (bounded by its cutoff, and only ever offered as a lead to go verify, never as the report's own
evidence).
