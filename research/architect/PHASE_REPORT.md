# Phase 5 (architect) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/architect/studies.md`.

## 1. What we found
Our architect skill was already broad (about 12,000 words in 10 references). Findings, each verified by exact search:
1. **The twin was ahead of the main copy.** `architect-specialist/references/architect-playbook.md` held rules 12 to 14 (PR-sized tasks with a verifiable done-when, a per-task context scope, slice-versus-layer as a micro-decision), a spec-driven-development section, a context-engineering section and a longer ADR rule; the main copy lacked all of it. The main copy held `agent-infra-reference.md` and the SKILL.md agent-infra sentences that the twin lacked. Both sides had unique content, so a blind copy in either direction would have destroyed work. Fixed by union.
2. **No executable check of a plan.** The planner playbook says "the app checks this format", but no checker existed in this repo and the skill had no scripts.
3. Missing or unsourced: MADR 4.0.0 details and Fowler's ADR rules (never change an accepted ADR, reevaluation triggers), Monolith First and the microservice prerequisites, the strangler-fig activities, Shape Up appetite and circuit breaker, fitness-function examples, spec-driven tooling, and the Anthropic agent-planning patterns with numbers.

## 2. What changed
| Item | File |
|---|---|
| Plan linter: all twelve headings; task fields; dangling and circular dependencies; same-phase file overlap (FAIL if parallel, WARN if ordered); shared wiring owned by the last task; Must requirements covered; unknown covers; NFR numbers; risk and ADR fields; task over 8 hours; three-point estimates and PERT arithmetic; verifiable done-when; phase non-goals and contingency; test-strategy command; open-question defaults; prints the critical path. 19 tests, 100% line coverage | `skills/architect/scripts/plan-lint.mjs`, `.test.mjs` |
| Sourced reference: ADRs (MADR 4.0.0, Fowler), arc42, C4, bounded context, strangler fig, Monolith First, microservice prerequisites, well-architected pillars, fitness functions, Shape Up, Spec Kit, Kiro, Anthropic agent patterns and token figures, plan mode; unverified items marked | `skills/architect/references/planning-frameworks-reference.md` |
| Main playbook replaced by the twin's superset | `skills/architect/references/architect-playbook.md` |
| SKILL.md paragraph (required lint run, read the critical path against milestones, what the linter cannot judge) and three links including the previously unlinked agent-infra reference | `skills/architect/SKILL.md` |
| Twin re-copied from the merged main (`diff -rq` clean for architect, coder, security); `flatten/` regenerated (`--check` OK) | `skills/architect-specialist/`, `flatten/` |

## 3. Proof
**Fixture:** a "Pantry" plan (3-person team, 6-week appetite) in the exact twelve-part format with **24 planted flaws**. 14 mechanical: missing section 12, an empty done-when, a dangling dependency, a dependency cycle, two parallel tasks owning one file, a 14-hour task, an uncovered Must, an NFR with no number, a risk with no mitigation, an ADR with no consequences, a wrong PERT sum, a vague done-when, a phase with no non-goals, shared wiring in non-last tasks. 10 judgment: Stripe (the riskiest piece) in the last phase, no walking skeleton, 99.99% availability on one VM with one SQLite file, authentication in the last phase after payments, five microservices on Kubernetes for three people, a big-bang Friday cutover with no rollback, an unverifiable done-when that depends on Stripe support, a milestone not credible against the critical path, scope creep against the Out list, and no ADR for SQLite.
**Linter alone:** found all 14 mechanical flaws, plus an uncovered NFR1 and a printed critical path of 35.7 hours.
**Blind review, read-only reviewers with no shell, one run each:**
| Reviewer | Planted flaws found | Total findings | Verdict |
|---|---|---|---|
| Old skill | 24 of 24 | 40 | redo |
| New skill | 24 of 24 | 32 | redo |
**Honest reading: no measurable reviewer gain, the third phase in a row with a ceiling effect.** A strong reviewer with the old skill already caught every planted flaw, including the mechanical ones the linter exists for, and found slightly more extra issues (no UI tasks, no CI or deployment tasks, an untestable merge rule). The new reviewer did two things the old one could not: it read the linter's source and correctly predicted its output (which flaws would FAIL, which would WARN, and a critical path of about 35 hours), and it cited the Monolith First prerequisites from the new reference. So the gain is a repeatable, deterministic check and sourced citations, not a better reviewer.
**Limits:** one run per side; I wrote the fixture and chose flaws the linter covers; no real twelve-part plan exists on this machine (only the playbook's template), so the linter has been tested on synthetic plans only; nothing built from a plan.
**Checks:** `diff -rq` clean for the architect, coder and security twins; `build-flatten --check` OK; `node --test` 287 tests, 287 passed on 3 consecutive runs after the last edit.

## 4. Mistakes and surprises (not hidden)
- My own fixture first tripped my own linter: `migrations/` is shared wiring that belongs to the last task of a phase, and `2d` is 16 hours, over the cap. The linter was right and the fixture was wrong; I fixed the fixture, not the rule.
- My ADR regex rejected "none." with a full stop; the test caught it.
- I had planned to re-copy the twin from the main skill, as in earlier phases. Reading the diff first showed that would have deleted the twin's newer rules; I merged instead. Lesson: diff before every sync. Mirroring direction is not always main to twin.
- One sentence in the reference claimed our rules 12 to 14 were "consistent with these sources"; I had not checked that, so I changed it to say they came from earlier research and were not re-checked.

## 5. Unverified or not read
AWS Well-Architected pillars (404); DDD context-mapping pattern pages (PDF only); Shape Up chapters 6 and 14 (pitch contents taken from the table of contents and glossary); Kiro's requirement notation (EARS not confirmed); Thoughtworks Radar's ADR entry (summary only); C4 notation and tooling pages; estimation sources beyond `architect-reference.md`; the installed planning skills (`blueprint`, `architecture-decision-records`, `hexagonal-architecture`, `plan`, `writing-plans`, `brainstorming`, `codebase-design`, `domain-modeling`, `spec-miner`), listed, not read.

## 6. Open items for you
1. `mcp/specialists.json` is a stale outside snapshot with no generator in this repo (open since Phase 1).
2. The flaky `qurn-ledger` concurrency test is still unfixed (open since Phase 2).
3. No CI check that each `skills/<name>-specialist/` equals `skills/<name>/`. Twins had drifted in four of the five phases so far (web, security, coder, architect; tester was identical), and in architect it drifted in both directions.
4. A real before/after on a real project would be stronger evidence than a planted fixture; every fixture so far has hit a ceiling.
5. Phase 6 (delegator) starts only when you say so.
