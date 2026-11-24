# Phase 2 (tester) -- per-source studies

Read 2026-11-24. "Read" means the page text was fetched in this session; "partial" means part of it came back as a model summary or only reader comments. Nothing here is stated from memory. Pages from non-preapproved sources were paraphrased by the fetch agent, not copied.

## A. Local skills (read in full)
| Source | What it contains | Best ideas | Weak or missing |
|---|---|---|---|
| `e2e-testing` (user skill, 781 words) | Playwright POM, a config, quarantine with `test.fixme`, flaky causes, artifacts, CI YAML | `--repeat-each=10` to find flakes; `trace: 'on-first-retry'` | Teaches `waitForLoadState('networkidle')` as part of the fix for animation timing, uses `page.locator('[data-testid=..]')` instead of role locators, sets `workers: 1` on CI (slow; our judgment), and has no `forbidOnly` |
| `webapp-testing` (481 words) | Python Playwright scripts, `with_server.py` helper, reconnaissance-then-action | Treat helper scripts as black boxes; wait for JS before inspecting the DOM | Says to use `wait_for_timeout`; `networkidle` as the "CRITICAL" wait |
| superpowers `verification-before-completion` | The iron law: no completion claim without fresh evidence; the red-green regression cycle; "agent reports success" is not evidence | Red-green: write, run, **revert the fix, run (must fail)**, restore, run | Not specific to test files |
| superpowers `writing-good-tests` (1,282 words) | Name the break; mirror assertions; change detectors; mock existence; partial mocks; test-only production methods; mental mutation check | The two questions (what change fails this, is it a bug or a decision; does it touch the real thing) and the warning-signs list | Prose only; no scanner |
| ECC `tdd-workflow`, `verification-loop`, `accessibility`, `ai-regression-testing`, `eval-harness`, `click-path-audit` | Headings and sizes checked; not read line by line | (not studied further) | Marked open |
| Our own `skills/tester` (before) | 50-line SKILL.md plus 18k words of references: kinds of test, playbook, board of testers, flaky playbook, browser proof, QA techniques | Very good coverage of names and evidence rules | See gap list in PHASE_REPORT |

## B. Official documentation (read, verbatim or fetch-agent paraphrase)
| Source | What it gave us |
|---|---|
| Playwright best-practices, test-retries, test-sharding, test-snapshots, accessibility-testing, test-agents | Exact config: `trace: 'on-first-retry'` (not `on`), `fullyParallel`, `forbidOnly`, blob reports and `merge-reports`, `fail-fast: false`; snapshot `threshold` default 0.2, `maxDiffPixels` unset, `stylePath`; axe traps (`exclude`, whole-violations snapshot); test agents need `init-agents` and a seed test |
| Stryker docs (intro, mutant states and metrics, configuration, incremental) | Metric formulas, `thresholds` defaults `80/60/null`, `perTest` needing independent tests, incremental limits |
| fast-check (introduction, properties, model-based) | `await fc.assert`, do not mutate inputs, prefer arbitrary options over filter, command-based model testing, seed and path replay. Pages are the 5.x preview; round trip / idempotence / oracle patterns were **not** on the pages read |
| Hypothesis stateful | `RuleBasedStateMachine`, `@initialize`, `@precondition` over `assume()`, `@invariant`, bundles; docs say a plain `@given` with `data()` may be enough |
| Testing Library (principles, query priority) | Query order and `findBy` default timeout 1000 ms |
| axe-core rule table, Deque 2021 study | About 105 rules listed (hand count), about 90 default-on (derived); 57% is **issue volume** in Deque's own audits, not WCAG criteria |
| Pact (how it works, can-i-deploy) | Consumer-driven flow, minimal expected response, `can-i-deploy` exit codes, `record-deployment`; page last updated Oct 2022 |
| k6 (thresholds, test types) | Threshold syntax, duplicate metric keys silently ignored, checks do not change exit status, six test types |
| Vitest (browser mode, coverage config) | Provider rule, `userEvent` from `vitest/browser`, coverage thresholds (negative = max uncovered count), `perFile`, `autoUpdate`, `reportsDirectory` deleted before each run |
| Lighthouse CI configuration | Verbatim: collect defaults (`numberOfRuns` 3, ready pattern, timeouts), config file search order. The assert section came back model-extracted: **unverified** |
| MSW philosophy | Network-level handlers from the server's perspective; the best-practices URL tried returned 404 |
| Fowler practical test pyramid | First 40k characters verbatim (many small fast unit tests; test behaviour; integration tests for serialisation code; in-memory DB stand-in is risky), the rest model-extracted |
| Chromatic overview, Testcontainers guides landing | Overview only; no rules or numbers |

## C. Online skills (searched, mostly not readable)
The search found Playwright-focused skills (alirezarezvani playwright-pro `review`, Jeffallan `playwright-expert`, bobmatnyc `playwright`, lambdatest `playwright-skill`, TestDino, OpenMetadata). Two of the three GitHub URLs returned 404; the third (bobmatnyc) was read: a general Playwright reference with a config template and five best-practice items, several snippets not runnable as written and some discouraged APIs (`page.fill`, `page.waitForSelector`, `isVisible()` in `if`). Star counts were not available from the search. None of the online skills had a scanner or a red-green rule.

## D. Failures and limits (do not hide)
- Google testing blog "Just Say No to More End-to-End Tests": only the comment thread came back; the 70/20/10 figure stays unverified.
- MSW best-practices page: 404 at the tried URL. Two GitHub skill pages: 404.
- Lighthouse CI assert options, Fowler's later sections: model-extracted, so unverified.
- Not read at all: Cypress, Jest config, Playwright component testing, Percy, Schemathesis, chaos tooling, ECC testing skills line by line, Hypothesis beyond stateful.
