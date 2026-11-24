# Research: verdict and handback format

Origin: research 2026-10-30, sources in `research/research-specialist.md`. How this specialist hands findings back
to the agent that consulted it -- including another specialist refreshing its own research file (the exact use
case this repo's 2026-10-29 security refresh and other specialists' recent reference-sync commits are examples
of).

## Verdict line

Start every reply with one of:
- `VERDICT: confirmed` -- every material claim traces to 2+ genuinely independent sources (see
  `corroboration-reference.md`), none contested, nothing stale per `currency-reference.md`.
- `VERDICT: mixed` -- some claims confirmed, others single-sourced, contested, or flagged to verify; state the mix.
- `VERDICT: unconfirmed` -- the central claim the request asked about could not be grounded in any source found
  this session, or only tertiary/low-credibility sources were found.

## FINDINGS

One entry per distinct claim, each with:
- The claim itself, stated plainly.
- Its confidence tier (confirmed / single-sourced / contested / to verify -- from `corroboration-reference.md`).
- Its citation(s): source name, URL, and what that specific source actually says (a short quote or close
  paraphrase), not just a bare link.
- Its source tier (primary/secondary/tertiary) and date, when that matters to how much weight it carries.

## TO VERIFY

A standalone, visible list of every claim that did not reach "confirmed": what's missing (a second source, a
primary document, a more recent check), and, where useful, what the next step to close the gap would be. This
list is not optional filler -- a reply with findings but no "to verify" list when some findings are single-sourced
is unfinished.

## ADVICE

Only when the research was requested in support of a decision another agent will make: what the findings imply
for that decision, clearly separated from the findings themselves so the reader can tell "what I found" from
"what I think you should do about it."

## When writing or refreshing a `research/<name>.md` file for another specialist

Follow `research/README.md`'s own convention exactly, since that file documents this specialist's own knowledge
base the same way: a sources table (URL, what it adds), "to verify" tags inline on anything not independently
fetched, and a distilled checklist at the end that a skill's references are built from. Read the target
specialist's existing research file first (if one exists) and extend it -- add a clearly dated new section for
what changed, the way `research/security.md`'s "2026-10-29 update" section was added alongside its original
September content rather than silently rewritten into it, so provenance of what was found when stays intact.

## Discipline that applies to every handback, regardless of format

- Never pad a thin research pass to sound more thorough than it was. A short, honestly-labelled handback -- "found
  one source, could not corroborate, here's what's missing" -- is a complete and successful piece of work, not a
  lesser one than a long confident one.
- Never present a single confidence tier's worth of evidence as if it were a higher one to make the handback read
  more conclusively.
- When the request was effectively unanswerable from available sources, say that plainly as the verdict rather
  than stretching thin material to look like an answer.
