# Phase 2 (tester) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/tester/studies.md`.

## 1. What we found
Our tester skill was already broad: 18k words covering kinds of test, a playbook, a board of testers, a flaky-test playbook, browser proof and QA technique. It was thin in three places:
1. **It never checked the tests themselves.** It said "run the suite", but nothing said how to tell a test that can fail from one that cannot (mirror assertions, tests with no assertion, assertions on a mock, change detectors, a regression test never seen failing).
2. **It gave names but not exact settings.** Option names, defaults and traps (`forbidOnly`, `trace`, Stryker `break`, snapshot `threshold`, axe tags, Vitest coverage thresholds, k6 duplicate keys) were not in one place.
3. **It carried errors.** The playbook pointed to a script path that does not exist (`src/control/design-board/design-board.mjs`; the file is `scripts/design-board.mjs`), a rationalization row said axe covers "~57% of WCAG issues" (it is 57% of issues by volume, per Deque), and Playwright MCP version numbers, `getByRef` and download counts could not be confirmed on any page read.

## 2. What changed
| Item | File |
|---|---|
| Test-quality rules: two questions, smell table, red-green proof, mutation check, Stryker metrics, review procedure, AI-written tests, pyramid | `skills/tester/references/test-quality-reference.md` |
| Exact settings from official docs, with unverified items marked | `skills/tester/references/tool-config-reference.md` |
| Scanner for tests and configs: 20 rules, 18 tests, suppression with a reason of 10+ characters | `skills/tester/scripts/suite-smell-scan.mjs` and `.test.mjs` |
| SKILL.md paragraph and three reference links; verdict rule that the consulting agent must run the scan | `skills/tester/SKILL.md` |
| Playbook: path fixed, 57% row corrected, MCP claims marked "to verify", two new rationalization rows | `skills/tester/references/test-board-playbook.md` |
| Twin mirrored (`diff -rq` clean) and `flatten/tester.prompt.md` regenerated (`--check` OK) | `skills/tester-specialist/`, `flatten/` |

## 3. Proof
**Scanner on a fixture with 20 planted defects** (my fixture; 15 mechanical, 5 needing a reader): it reported 15 findings, all real, none on the sound tests.
**Blind review, same fixture, read-only reviewers with no shell, one run each:**
| Reviewer | Planted defects found | Missed | Verdict given |
|---|---|---|---|
| Old skill | 19 of 20 | `AxeBuilder` with no WCAG tags | fix |
| New skill | 20 of 20 | none | redo |
**Honest reading:** the reading gain is one defect. A strong reviewer with the old skill already found almost everything; the five judgment-only defects (helper mirror, change detector, partial mock, regression never seen failing, coverage as the target) were caught by both. The measurable gains are (a) a repeatable scanner that finds 15 of 20 without any model, (b) the corrections above, (c) exact settings in one place. The old reviewer also repeated the uncorrected "axe covers about 57% of issues" without "by volume".
**Limits of this proof:** one run per side; I wrote the fixture and chose defects the new files cover; the new reviewer had read the scanner's rule list, so part of its score is rule knowledge; the new reviewer gave `redo` with no failing run to cite while our own rule says a redo needs cited evidence, and the old one gave `fix`, which fits that rule better (a skill-wording point to tighten); nothing was run against a real product.
**Checks:** `diff -rq skills/tester skills/tester-specialist` clean; `node scripts/build-flatten.mjs --check` OK; `node --test` 141 tests: passed 141 on 9 of 11 runs after the rename. The scanner has 100% line coverage in its own test run (that count includes the test file). It scans clean on qurn's own 9 test files and one file in the inventory app; real-world validation is thin.

## 4. Mistakes and surprises (not hidden)
- First version was named `test-smell-scan.mjs`; Node's test runner treats `test-*.mjs` as a test file, ran it with no arguments, and failed CI-style (2 failures). Renamed to `suite-smell-scan.mjs` and fixed every reference.
- **Flaky test, not mine:** `v2/skills/qurn/scripts/qurn-ledger.test.mjs`, "concurrent writers on one file never break the chain", failed ("writer 1 exited 1") in 2 of about 13 full runs, and probably is the one-off failure noted in Phase 1. By our own rule it is a defect, not noise. Not fixed here.
- `mcp/specialists.json` is a stale snapshot built outside this repo (its tester playbook is 7.8k characters against 12.8k on disk, and it has no Phase 1 web files). There is no generator here. I did not hand-edit it. The plan said "regenerate flatten and mcp"; only flatten is regenerated.
- Unverified or unread (see studies.md section D): Google "no more E2E tests" article, MSW best practices, two online skill pages (404), Lighthouse CI assert options, Fowler's later sections, Cypress, Jest, Percy, Schemathesis, chaos tooling, ECC testing skills line by line.

## 5. Open items for you
1. Decide how `mcp/specialists.json` gets regenerated (it needs the original manifest or a new generator).
2. Say whether to fix the flaky ledger-concurrency test.
3. Skill wording: tighten "a redo needs cited evidence" to say file evidence alone is a `fix`.
4. A real before/after on a real project, if you want evidence beyond a planted fixture.
5. Phase 3 (security) starts only when you say so.
