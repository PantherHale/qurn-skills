# Architect: weekly engineering retrospective
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A different thing from this project's weekly-evolve routine: evolve researches what changed in
the outside world; this is a retrospective on the team's *own* output over the past week --
commits, PRs, tests, focus. Use it when the operator asks how the week went, not for external
research.

## What to compute from the week's git history
- **Shipping velocity**: commit-type mix (feat/fix/refactor/etc), PR size distribution, any
  fix-chain (a run of fix commits hitting the same subsystem -- a sign something wasn't done
  right the first time), version-bump discipline.
- **Time and session patterns**: when the most productive hours actually were, whether sessions
  are trending longer or shorter, estimated active-coding hours per day.
- **Code quality signals**: the test-LOC-to-code-LOC ratio and its trend; hotspot files that
  keep churning (same file touched commit after commit is a design smell, not bad luck).
- **Test health**: total test files, how many changed this period, any regression-test commits,
  and the ratio trend -- flag below ~20% test ratio as a growth area, not a pass/fail gate.
- **Shortcut debt**: if the project marks accepted shortcuts in code (a comment tagging a known
  corner cut with an upgrade trigger), surface the count and list -- this is debt made visible,
  not hidden.

## Structure of the report
1. One tweetable-length summary line up top: commit count, LOC, test ratio, PR count, peak
   hour, current streak.
2. Trends vs. the last retro, if one exists -- a number alone means less than its direction.
3. Narrative, not just tables: what the time/session patterns mean, what the velocity numbers
   reveal, what the quality signals are trending toward.
4. Top 3 wins across the period, each naming what shipped, who, and why it mattered.
5. 3 things to improve -- specific, anchored in an actual commit or file, never generic ("write
   more tests"). Each should be concrete enough to check next retro: "test coverage on the
   billing module is 8%" not "improve testing."
6. 3 habits for next week -- small, adoptable in under 5 minutes each, at least one team-facing
   (e.g. same-day PR review).
7. If it's a multi-person project, one short section per person: what they shipped, one genuine
   specific praise anchored in a real commit, one constructive growth note framed as investment
   not criticism.

## Tone
- Praise is specific or it's noise: "cleaned up the entire auth module in 3 small reviewable
  PRs" beats "great work this week."
- A growth note is framed as what it unlocks, not what was wrong: "worth investing in before the
  next feature lands on top of it," not "your tests are thin."
- Carry a recommendation from last retro forward -- did the team actually act on it? Naming
  follow-through (or its absence) is more useful than a fresh list every week.
