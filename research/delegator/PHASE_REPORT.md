# Phase 6 (delegator) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/delegator/studies.md`.

## 1. What we found
Our delegator skill was already deep for its size (about 5,800 words: the worker prompt template, a DAG-first checklist, the three parallelism primitives, failure asymmetry, runtime locking, concurrency and isolation mechanics, handoff documents). Findings, each verified by exact search:
1. **No executable check of a dispatch.** The skill had no scripts.
2. **Twin sync direction.** After the Phase 5 lesson I diffed both ways before copying. Main was the superset (it held the agent-dispatch bullet and file; the twin held nothing unique), so main to twin was safe.
3. **Two stale pointers:** the playbook said "must match night-delegation.ts" and cited `night-model.ts`; those files belong to the Qurn app, not this repository. Relabelled.
4. **The playbook's concurrency claims are now confirmed from a primary source.** On the SDK subagents page, verbatim: concurrency default 20, spawn depth default 3, `maxBudgetUsd` no default limit; and on the sub-agents and worktrees pages: `isolation: worktree` branches from the default branch and is removed when unchanged. Before this they were "re-checked" from secondary sources.
5. Missing: the `SubagentStart` and `SubagentStop` hooks, `maxTurns` partial results, the agent-teams numbers (3 to 5 teammates, 5 to 6 tasks each, linear cost), Cognition's two principles in their own words, the 1,000-2,000-token return size, the 4x and 15x token figures, and MAST named in full.

## 2. What changed
| Item | File |
|---|---|
| Dispatch linter: required template fields; parallel file-ownership collisions (FAIL) and ordered ones (WARN); shared wiring owned by a worker; owned-and-forbidden; dangling and circular dependencies; back-references ("as discussed", "see above"); vague done-when; uncapped report output; shared ports; worker count (default cap 4, `--max-workers`); missing integration gate; single trivial worker; prints the waves; one aggregated warning per worker for unnamed siblings. 21 tests, 100% line coverage | `skills/delegator/scripts/dispatch-lint.mjs`, `.test.mjs` |
| Orchestration facts with sources and dates: subagent limits and flags, hooks, worktrees and git rules, agent teams, when not to fan out (Anthropic, Cognition, MAST); unverified items marked | `skills/delegator/references/orchestration-facts-reference.md` |
| SKILL.md paragraph (required lint run; the question the lint cannot answer: can each worker understand its piece without the others' decisions; cap returns, set `maxTurns` and a spend cap, lead runs build and tests after fan-in) and links including the previously unlinked dispatch reference | `skills/delegator/SKILL.md` |
| Playbook stale pointers relabelled | `skills/delegator/references/delegator-playbook.md` |
| Twin re-copied (`diff -rq` clean for delegator, architect, coder, security); `flatten/` regenerated (`--check` OK) | `skills/delegator-specialist/`, `flatten/` |

## 3. Proof
**Fixture:** a dispatch for dark mode and CSV/PDF export (8 workers plus a lead step, unattended overnight, one git worktree per worker) with **22 planted flaws**. 13 mechanical: a missing DONE WHEN, a missing DO NOT TOUCH, two parallel workers owning one file, a worker owning `package.json`, a dependency on a worker that does not exist, "as discussed in the planning chat", a vague done-when, an uncapped report, two workers on port 3000, eight workers over the cap, no integration gate, a worker owning all of `src/`, a file both owned and forbidden. 9 judgment: conflicting implicit design decisions between the token and component workers, a cross-cutting change poorly suited to fan-out, a shared `test.db` that worktrees do not isolate, no turn or spend cap for an unattended run, merging on "done" with no evidence, a reviewer with write access told to fix things, a docs worker that needs an endpoint that does not exist yet, worktrees that branch from the default branch and so miss earlier workers' commits, and no failure policy.
**Linter alone:** found all 13 mechanical flaws; its first run also produced 54 warnings, almost all one `do-not-touch-incomplete` per pair of workers (growing with the square of the worker count), which I aggregated to one per worker, bringing it to 14.
**Blind review, read-only reviewers with no shell, one run each:**
| Reviewer | Flaws found | Total findings | Missed | Verdict |
|---|---|---|---|---|
| Old skill | 20 of 22 | 32 | the missing DO NOT TOUCH on W3 (and it wrongly listed W3 among workers that name their siblings' files); the explicit "tightly coupled cross-cutting change, poor fit for fan-out" framing (its worker-count finding came close: "mostly run in sequence, reduce to 3 or 4") | redo |
| New skill | 22 of 22 | 22 | none | redo |
**Honest reading: a gain of 2 of 22, the first phase with any visible difference, but small and from one run each.** The new reviewer cited the dispatch-specific rules (parallel overlap, shared wiring, the worktree base branch, the spend-cap default) and also raised extras: all eight workers on the strongest model, worktrees with no `node_modules` or `.env` copy, nobody owning route registration, and exact test counts that are arbitrary. The old reviewer also found many extras and made one factual error about W3. Both said redo. The new reviewer could not run the linter and asked the consulting agent to.
**Limits:** one run per side; I wrote the fixture and chose flaws the linter and new reference cover; no real dispatch plan or real multi-agent run exists on this machine to validate the linter against; the old skill already held most of the judgment rules, so a ceiling effect still limits what this test can show.
**Checks:** `diff -rq` clean for the delegator, architect, coder and security twins; `build-flatten --check` OK; `node --test` 329 tests, 329 passed on 3 consecutive runs after the last edit.

## 4. Mistakes and surprises (not hidden)
- The linter's first version was noisy by construction (a warning per worker pair); a fixture with 8 workers exposed it. Aggregated and covered by a test.
- One of my own smoke scripts used a bare Windows path as a module import and failed; fixed with a `file://` URL.
- The sub-agents page came back with an injection-shaped harness flag about permissions rules; the content was documentation, nothing asked for any action.

## 5. Unverified or not read
`/batch` documentation; the Claude Code environment-variables page (the settings page has no variable list); the hooks page outside the two subagent sections; MAST failure percentages beyond the first category (summary only); OrchestraBench beyond the abstract already in the reference; the superpowers `subagent-driven-development` skill (2,844 words) was only grepped, not read in full; the ECC skills `team-agent-orchestration`, `parallel-execution-optimizer`, `autonomous-loops`, `claude-devfleet` and `dmux-workflows` were only sized, not read; Cognition's later posts.

## 6. Open items for you
1. `mcp/specialists.json` is a stale outside snapshot with no generator in this repo (open since Phase 1).
2. The flaky `qurn-ledger` concurrency test is still unfixed (open since Phase 2).
3. No CI check that each `skills/<name>-specialist/` equals `skills/<name>/`: twins had drifted in five of the six phases so far (web, security, coder, architect, delegator; tester was identical), and in architect in both directions.
4. A real before/after on a real project would be stronger evidence than planted fixtures.
5. Cost: the session meter reads about $132 so far across six phases (it read about $114 when this phase's review started; the phase itself cost about $18). Three phases remain (research, evolve/status/qurn lead, integration), at roughly $15 to $25 each.
6. Phase 7 (research) starts only when you say so.
