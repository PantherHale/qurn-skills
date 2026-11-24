# Qurn evals: does the skill change what the agent does?

Six fixed prompts, each with checkable assertions (`cases.json`). The grader is deterministic: no AI judge, so the same replies always get the same score.

## Run it

1. For each case, send its `prompt` to the same model twice in a fresh session each time: once **with** Qurn installed and invoked (`/qurn <prompt>`), once **without** it. Save each reply as `<case-id>.txt` in `out/with/` and `out/without/`.
   For example, with Claude Code installed: `claude -p "<prompt>" > out/without/<id>.txt` (no skill) and `claude -p "/qurn <prompt>" > out/with/<id>.txt` (skill installed). Use the same model for both.
2. Grade: `node scripts/qurn-eval.mjs grade --cases evals/qurn/cases.json --with out/with --without out/without`

The table shows each case's score with and without Qurn, and marks a case "baseline already passes" when the plain model already does the behaviour, which means the skill adds nothing there. A skill tuned for one model can stop helping on the next, so re-run after a model update.

## What this does and does not show

- It measures six specific behaviours in the **reply text**. It does not measure whether the finished project is better.
- Assertions are pattern checks. A model can phrase the right behaviour in words the pattern misses (a false fail) or mention the words without doing the behaviour (a false pass). Read the failures the grader prints before trusting a number.
- Six cases, one run each, is a smoke test, not a benchmark. Run each case several times and add cases from real failures before quoting a result to anyone.
- No results are committed here. Publish only numbers you actually produced.
