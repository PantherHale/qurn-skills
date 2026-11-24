# Test quality -- is each test able to fail, and is the suite honest about what it proves

`test-board-reference.md` says which kinds of test to run. This file judges the tests themselves: a green suite made of tests that cannot fail is worse than a red one, because it creates confidence. Written 2026-11-24 from the superpowers `writing-good-tests` and `verification-before-completion` skills, Playwright's best-practices, retries and visual-comparison pages, Stryker's mutant-state docs, and Fowler's practical test pyramid (all read in `research/tester/`). Where a rule is our own judgment, not a source's, it says so.

## 1. Two questions for every test
1. **What production change would make this test fail, and is that change a bug or a decision?** If you cannot name one, the test protects nothing. If only an intentional decision can fail it (a constant, exact wording, private structure), it is a change detector: it fires on redesign and sleeps through bugs.
2. **Does it exercise the real thing?** A test that passes because a mock is present, and fails when the mock is removed, says nothing about the component.

## 2. The smells, with the fix
| Smell | Why it is false confidence | Fix |
|---|---|---|
| **Mirror assertion**: the expected value is computed by the code under test or its helpers (`expect(build(x)).toBe(build(x))`) | True whatever the code does | Hand-derived literal, or a table of literal `want` values |
| **Change detector** (`expect(MAX_RETRIES).toBe(5)`) | Fails only on intentional edits | Test the behaviour that depends on the decision: "a failing call is retried 5 times and the 6th never happens" |
| **Asserting on the mock** (`getByTestId('sidebar-mock')`) | Proves the mock exists | Assert the real component, or unmock it, or delete the assertion |
| **Partial mock** (only the fields the test reads) | Downstream code reads an omitted field and breaks in integration | Mirror the complete real structure |
| **Accepts anything** (a double that ignores arguments, counts and order) | Verifies nothing | Assert arguments and order when they are part of the contract; one fixture per branch (success, error, malformed) |
| **Test-only method on a production class** (`destroy()` only tests call) | Pollutes production, hides lifecycle mistakes | Put it in a test utility |
| **Mock setup larger than the test** | The mock drifts from the real thing | Switch to an integration test with real components |
| **Greps source text** (asserts a file contains a line) | Proves the source is the source | Run it against controlled input; assert output, side effects or exit code |
| **Tests the framework** (your router calls a registered handler) | That is upstream's test | Test the contract at your boundary: the route you register, the query you emit, the payload you produce |
| **No assertion** | Passes whenever the code does not throw | Assert the outcome or delete the test |
| **Coverage-for-its-own-sake test** | Maintenance cost, no protection | Delete, or assert the first consumer-visible result |
Trivial constructors, getters and forwarding earn a test only when they validate, normalise, default, derive, enforce or cause a side effect.

## 3. Proof that a test can fail (red-green)
A regression test counts only after it has been seen failing for the right reason.
1. Write the test against the old behaviour. Run it: it must pass or fail as expected.
2. Revert the fix (or reintroduce the bug). Run it: **it must fail**, with the failure the bug would cause.
3. Restore the fix. Run it: it passes.
A test written after the fix and never reverted is a claim, not evidence. Skip this only for tests of new behaviour written before the code (strict test-first already did step 2).
**Mental mutation check** before calling a file finished: for each realistic mutation, at least one test fails: wrong constant or argument, wrong branch handler, missing state change or side effect, empty or default return, missing validation for zero, empty, null, unauthorised or malformed input. A mutation nothing catches means unprotected behaviour or a tautological test.

## 4. Mutation score, read correctly (Stryker's own definitions)
A mutant is **killed** when at least one test fails while it is active, **survived** when all pass, **no coverage** when no test reaches it, **timeout** when the run hangs (counted as detected). Runtime errors, compile errors and ignored mutants are not in the score.
- Detected = killed + timeout. Undetected = survived + no coverage. Covered = detected + survived. Valid = detected + undetected.
- **Mutation score = detected / valid x 100.** "Score based on covered code" = detected / covered x 100 and ignores untested code, so it is always at least as high: say which one you quote.
- Defaults: `thresholds` is `high 80, low 60, break null`. `break: null` means the build never fails. Setting thresholds is all-or-nothing (all three keys). A `break` set far above today's score fails every build and gets switched off; set it a few points under the current score and raise it later (this advice is a practitioner guide's, not Stryker's own docs).
- `coverageAnalysis: perTest` (default) runs only the tests that cover each mutant, so tests must be independent and runnable in random order. `incremental` reuses earlier results, but does not notice changes to files that are neither mutated nor tests (dependency updates, env vars, snapshots), so do a full run on a schedule.
- Survivors are read one by one: an equivalent mutant (same behaviour) is ignored with a reason; a real survivor becomes a test.

## 5. Judging a suite quickly (the review procedure)
1. `node scripts/suite-smell-scan.mjs <tests-and-configs>` and read every FAIL. The scanner finds the mechanical ones (focused tests, fixed sleeps, assertions that never wait, mirror lines, tests with no assertion, skips with no reason, CSS locators, unset axe tags, config with no `forbidOnly` or no mutation `break`). Its rule list and the basis for each rule are in section 8.
2. Run the suite and read the counts. Compare to the last run: a count that dropped is a failure. Run `--repeat-each=10` (and `--workers=1` to separate timing from parallelism) on anything new; a `flaky` outcome is a defect, not a pass.
3. Read ten tests by hand against section 2. The scanner cannot see a mirror assertion built through a helper, a change detector, a partial mock or a test of the framework: these need a reader.
4. Pick the three riskiest behaviours in the product (money, auth, data loss). For each, name the test that would fail if it broke. No test, or only an end-to-end one, is a finding.
5. State what was not covered. Dijkstra's point stands: testing shows the presence of bugs, never their absence.

## 6. Tests written by an AI agent (what to demand)
- The test was run red before the fix (section 3), and the output is shown.
- Expected values are literals, not computed by the code under test.
- No assertion that "the mock was called" stands alone; there is also an assertion on the real outcome.
- It is not edited to pass: when a test fails after a change, first decide whether the test or the code is wrong, and say which.
- A healer, retry or auto-repair step that rewrites a failing test is reviewed like a code change: it can silently weaken the assertion. Playwright's own healer can also choose to skip a test it believes is broken; treat a skip it adds as a finding.
- A new test file is burned in (`--repeat-each` 20-50) before merge.

## 7. The pyramid, applied
Push each test as low as it can go. If a high-level test catches a bug and no low-level test fails, add the low-level test. Keep end-to-end tests for the few journeys that must never break; do not use them for edge cases (validation, empty states, a down database): those belong at unit or integration level. Integration tests are for code that serialises or deserialises (REST, database, queues, filesystem); run the real dependency locally, because an in-memory stand-in with different behaviour is a known risk. Do not hit third-party servers in tests. Legacy code with no tests is the one case to start from the top: a few end-to-end checks first, then lower levels. (Sources: Fowler's practical test pyramid, first 40k characters read verbatim and the rest model-extracted; the Google testing-blog post could not be read and only reader comments came back, so its 70/20/10 split stays unverified.)

## 8. What the scanner checks and why
FAIL: `focused-test` (`.only`, `fit`), `wait-for-timeout`, `non-retrying-assertion` (`expect(await x.isVisible())` and similar), `mirror-assertion`, `no-assertion`.
WARN: `sleep-in-test`, `non-retrying-value-check` (`expect(await x.textContent())`), `skip-no-reason`, `mock-test-id`, `network-idle-wait`, `css-locator`, `axe-violations-snapshot`, `axe-tags-unset`, `unseeded-random`, `external-url-in-test`, `empty-catch`, `suppression-no-reason`.
Playwright config: `config-no-forbid-only`, `config-trace-on`, `config-no-trace`, `config-retries-high` (over 2). Stryker config: `stryker-no-break`.
Basis: Playwright best-practices documents web-first assertions, role locators over CSS/XPath, mocking third parties, trace on first retry (not on for every test) and running tests in isolation; the retries page defines "flaky" and says isolated tests are usually better than serial state; `network-idle-wait`, `unseeded-random` and `empty-catch` are our own judgment, not a documented rule. A clean scan is a floor: it never proves the right things are tested.
Suppress one finding with `// test-allow: <rule> -- <reason of 10+ characters>` on the line or up to two lines above.

## 9. CHECK lines
- `node scripts/suite-smell-scan.mjs <tests>` has no FAIL.
- Every regression test was seen failing with the fix reverted (output pasted).
- The suite's passing count is equal to or higher than the last run, and any skip names a reason and an owner.
- For critical modules the mutation score (state which one) is above the `break` set in config.
