# Research: numerical and statistical claim verification

Origin: research 2026-10-30, sources in `research/research-specialist.md` (Pew Research Center's internal
"number check" process; practitioner data-claim checklists; the NumTemp benchmark paper). Run this extra pass
whenever the claim under research involves a number, a percentage, a statistical comparison, or a trend -- these
fail in their own specific ways that the general anti-hallucination pass doesn't fully catch.

## Trace every number to its original source

- A number is only as good as the furthest-back source it can be traced to. Prefer the original dataset, the
  primary report, or the press release *that introduced the figure* over a news article's or blog's restatement
  of it -- restatements drift, round differently, or drop qualifiers.
- When only a restatement is reachable, say so and name it as a restatement, not as if the original had been read
  directly.
- Never re-verify a number by asking an LLM (this one or another) to confirm its own or another model's earlier
  output -- that checks nothing; re-fetch the external source or re-derive the figure from data, every time.

## Check words that imply a statistical property

Words like "majority," "most," "a significant increase," "a growing trend," "the average" are themselves claims,
not just color -- check them against the actual numbers and, where relevant, the actual statistical test behind
them, following Pew's own practice:

- "Majority" means more than half -- a 48% plurality is not a majority; check the actual number before using the
  word.
- "Significant" in a statistical sense (confidence interval, p-value, margin of error) is a different claim from
  "significant" meaning "large" in plain English -- know which one a source means, and don't import statistical
  authority a plain-English claim never had.
- Rounding should be checked for consistency with the source data's actual precision -- a figure rounded from
  44.6% to "45%" is fine to call "almost half"; the same figure rounded up and then described as "a majority"
  would not be.

## Trend claims need both endpoints

A claim that something is rising, falling, or changing over time requires real data at *both* ends of the stated
period, not one current data point plus an assumed starting point. If the earlier data point can't be found,
report the current figure alone and say the trend claim itself could not be verified -- don't let a single
snapshot imply a trajectory.

## Sampling and method, not just the headline figure

Before trusting a statistic, check (to the extent the source discloses it) how the underlying data was actually
gathered -- sample size, who was sampled, self-selection, survey vs. measured data -- the same way a reviewer would
check whether a claimed trend survives looking at its method. When a source gives the number but not the method,
say the method is undisclosed rather than silently assuming it was sound.

## Independent corroboration still applies to numbers

A single statistic, even one traced to a plausible original source, gets the same corroboration bar as any other
claim (see `corroboration-reference.md`): look for at least one more independent figure/source before reporting
it as settled, especially for a number that will drive a decision (a cost estimate, a vulnerability-rate claim, a
market-size figure).

## Known pitfall: benchmark/training-data leakage

When evaluating whether a claim is "well-known" or "easily checkable," don't treat a model getting a famous,
heavily-published statistic right as proof its general verification process is sound -- it may simply have
memorized a widely-repeated figure rather than verified it this session. Apply the same trace-to-source
requirement to famous numbers as to obscure ones.
