# Phase 8 (evolve, status, qurn lead) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/evolve/studies.md`. This phase has **no blind reviewer comparison**: the previous four showed ceiling effects, a planted-fixture test of a lead that mostly coordinates other skills would be even weaker, and the cost is now high. The proof here is what the new tool found in the real repository.

## 1. What we found
1. **V1 and V2 are separate copies, and Phases 1 to 7 changed only V1.** `v2/` is "a second, self-contained copy of the specialist skills with the Pro lead"; none of the new references, scanners or fixes exist there. `skills-health.mjs --compare v2/skills` lists the lag: architect (3 files only in V1, 2 differing), coder (6 and 2), delegator (3 and 2), evolve (2), research (3 only in V1, 13 only in V2), qurn (9 only in V2). I should have surfaced this at Phase 1.
2. **The qurn lead in V1 is a single SKILL.md**; the Pro lead (assumptions gate, run modes, hash-chained ledger, pre-mortem, blind review) is V2 only. The qurn skill installed in `~/.claude/skills` is a third version: 4 of V2's 9 references, a pointer to a reference it does not contain (`references/domain-atlas-reference.md`), and the old ledger script.
3. **The long-open flaky `qurn-ledger` test is a real Windows bug**, now fixed (section 3).
4. **Evolve is stale**: it points at the Qurn app's vault and `src/specialists/knowledge/*.md` (not in this repository), lists "web-designer" and "test-board" and omits research, and had a `last-reviewed` of 2026-10-04.
5. **I had not updated `last-reviewed` on any skill I upgraded** in Phases 1 to 7. Fixed for all 17 skill folders.
6. **Status accepted a "pass" with no evidence**, and had no way to say "not read" or "one run only".

## 2. What changed
| Item | File |
|---|---|
| Skills health checker: frontmatter limits from Anthropic's skill docs, dangling pointers, orphaned files, scripts with no test, reference files over 100 lines with no table of contents, nested references, SKILL.md length and weight, stale `last-reviewed`, **twin drift (FAIL) so a `-specialist` copy can never silently diverge**, `--compare` against another tree. 13 tests, 100% line coverage | `skills/evolve/scripts/skills-health.mjs`, `.test.mjs` |
| Evolve: a health-check step, the right paths and roster for this repository, update the review date and diff twins both ways before copying | `skills/evolve/SKILL.md` |
| Qurn lead: a table of every specialist's scan and what the lead must do with it (run it, show the output, log it as evidence, FAIL blocks, WARN is fixed or suppressed with a reason), plus four rules learned across the phases | `skills/qurn/SKILL.md` |
| Status: a "pass" with no evidence is reported as "passed, evidence not recorded"; carry "not read" and "one run only" into the report; verify the ledger chain when the script exists | `skills/status/SKILL.md` |
| `isRetryableLockError`: EEXIST everywhere, EPERM, EBUSY, EACCES on Windows only; a unit test for it | `v2/skills/qurn/scripts/qurn-ledger.mjs`, `.test.mjs` |
| `last-reviewed` set to 2026-11-24 on the 17 skill folders; `flatten/` regenerated (`--check` OK) | `skills/*/SKILL.md`, `flatten/` |

## 3. Proof (measurements, not a reviewer comparison)
- **Ledger bug:** before, `EPERM` on the lock file in 2 of 640 writer runs (16 writers, 4 busy CPU loops); after, 0 of 1,280. Unit test added; ledger tests 18 of 18.
- **Health check on the real repository (V1):** 0 FAIL after my fixes; 48 WARN: 38 reference files over 100 lines with no table of contents (19 files, each counted in its twin too) and 10 scripts with no test file (`design-board.mjs`, `experience-testers.mjs`, `style-signals.mjs` in tester and web, and their twins). It also caught one error in my own edit: my first status text named a script path that does not exist in that skill's folder; reworded.
- **Checks:** all seven twin pairs identical (`skills-health` reports no drift); `build-flatten --check` OK; `node --test` 379 tests, 379 passed on three consecutive runs.

## 4. Mistakes and surprises (not hidden)
- A test line I wrote ran bare `node` with no script; removed.
- My status edit created a dangling pointer that the new health check flagged on its first run.
- The first lock-bug reproduction attempt used a bad path and "failed" 200 of 200 for the wrong reason; I caught it and reran correctly. The bug did not appear in 200 quiet runs, only under contention and CPU load.
- I did not run a real qurn session end to end; the V2 README itself says the end-to-end workflow is untested.

## 5. Unverified or not read
`skill-comply`, `skill-scout` and `rules-distill` beyond their first lines; the `skill-stocktake` scripts; how other teams run weekly refreshes (no source found); the real lead on a real project.

## 6. Open items for you (several need your decision before Phase 9)
1. **Which tree is canonical, V1 `skills/` or V2?** Phases 1 to 7 are V1 only. Phase 9 should either port the upgrades into V2's tree or retire one of them.
2. **The qurn skill installed in `~/.claude/skills/qurn`** has the old lock bug (it will fail intermittently on Windows under parallel writers), a dangling `domain-atlas-reference.md` pointer, and only 4 of 9 references. It is outside this repository, so I did not touch it. Want it replaced from V2 with the fix?
3. `mcp/specialists.json` is a stale outside snapshot with no generator in this repo (open since Phase 1).
4. **CI:** add `node skills/evolve/scripts/skills-health.mjs skills` to the workflow so twin drift and dangling files fail a pull request? I did not edit the workflow.
5. 38 reference files lack a table of contents (Anthropic recommends one over 100 lines). It is mechanical; want me to add them?
6. 10 scripts have no tests (tester and web browser scripts, large). Want tests written?
7. Cost: the session meter reads about $157. Phase 9 (integration) is the last phase.
8. Phase 9 starts only when you say so.
