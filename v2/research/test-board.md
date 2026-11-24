# Test board: research notes
2026-09-23 (expanded 2026-10-29 — see new sections: AI-agent-era testing, Playwright/stack currency,
accessibility/performance baseline refresh, release-readiness, and the updated distilled checklist;
pushed one level deeper 2026-10-30 — see new section: verification pass + RAG-eval/judge-calibration
fresh research, and corrections inlined above wherever a 2026-10-29 "to verify" flag resolved)

Scope: research for the TEST BOARD specialist of an AI coding agent. This
specialist plans and judges testing — it never builds. It is the standards gate: middle and end
of every goal, checkpoints `['middle', 'end']` (`src/specialists/manifest.ts`). Its knowledge file
is `src/control/design-board/design-board.mjs`, a 15-tester web "board of testers" run in a real
Chrome/Edge via `playwright-core` (throttled network/CPU, viewport emulation, axe-style DOM
checks, token-discipline source scan). That file is web-only; this note extends the same
persona-with-a-condition pattern to desktop/Electron, CLI and API work, and adds the QA process,
environment matrix, review, and error-testing material the specialist's prompt promises
("TEST PLAN covering every kind that fits... unit, integration, end-to-end, visual regression,
accessibility, performance, security, responsive and cross-browser... REQUIRED RUNS... evidence").

Read for context (not cited as web sources): `src/specialists/manifest.ts` lines ~96-117 (the
test-board specialist entry) and `src/control/design-board/design-board.mjs` (the 15
`await tester(...)` calls: mobile-4g, low-end-android, zoom-reflow, screen-reader, keyboard,
contrast-colour, reduced-motion-no-gpu, no-js-bot, first-five-seconds, screen-sizes, scroll-audit,
scroll-smoothness, craft-no-emoji, scroll-film, token-discipline).

---

## Sources

| URL | Take |
|---|---|
| https://playwright.dev/docs/best-practices | Test isolation via fresh state per test; prefer user-facing locators over CSS/XPath; web-first `expect` assertions that auto-retry, never manual `isVisible()` checks; don't test third-party dependencies, mock them instead; run on CI every commit, Linux runners, parallel + sharded; `npx playwright test --trace on` for CI debugging; lint for missing `await`. |
| https://playwright.dev/docs/locators | Priority: `getByRole`, `getByText`, `getByLabel`, `getByPlaceholder`, `getByAltText`, `getByTitle`, `getByTestId`. Locators are live queries (re-resolve at action time, auto-wait); CSS/XPath are brittle and explicitly discouraged. Locators are strict — fail on multiple matches unless `.first()/.last()/.nth()`. Chain with `.filter({ hasText })` and combine with `.and()`. |
| https://playwright.dev/docs/browser-contexts | A `BrowserContext` is an incognito-like sandbox, "fast and cheap to create," fully isolated even inside one browser process. Playwright Test gives every test its own context + page by default — this is what "test isolation" means in Playwright: no shared cookies/storage/session between tests, so order and parallelism are safe. |
| https://playwright.dev/docs/trace-viewer | Trace captures a DOM snapshot before/during/after each action, a screenshot filmstrip, console logs, network requests, and source location. Record with `--trace on` locally or `trace: 'on-first-retry'` in CI config (cheap: only failing-then-retried tests pay for it). Open with `npx playwright show-trace path/to/trace.zip` or drag the zip into trace.playwright.dev (stays local, no upload). |
| https://playwright.dev/docs/test-snapshots | `expect(page).toHaveScreenshot()` — first run writes the golden under `<test>-snapshots/<name>-<browser>-<platform>.png`; subsequent runs diff with pixelmatch. `maxDiffPixels` / `maxDiffPixelRatio` set tolerance globally in config or per-call. `--update-snapshots` regenerates goldens after an intended change. `stylePath` masks volatile regions (e.g. hide iframes/ads) before the pixel diff. Rendering differs by OS/GPU/power source — goldens must be generated and compared on the same platform, normally in CI, not on a dev laptop. |
| https://playwright.dev/docs/test-projects | `projects: []` in `playwright.config.ts` runs the same suite under different `use` blocks — `devices['Desktop Chrome']`, `devices['Desktop Firefox']`, `devices['Pixel 5']`, etc. — for cross-browser and device-emulation coverage from one test file. `dependencies` lets a "setup" project (e.g. auth) run and pass before dependent projects start. Run one with `--project=firefox`. |
| https://vitest.dev/guide/mocking | `vi.fn()` (spy/stub), `vi.spyOn()` (wrap existing method, restorable), `vi.mock('./mod', factory)` (whole-module mock, **hoisted above imports** by the compiler — the classic gotcha: code below the `vi.mock` call still runs after the real import is replaced, but you cannot reference outer-scope variables inside the factory without `vi.hoisted`). `vi.stubGlobal` for globals, `vi.setSystemTime` / `vi.useRealTimers` for fake time. Must reset/restore mocks between tests (`restoreMocks`/`clearMocks` config or manual `vi.restoreAllMocks()`) or state leaks across tests. |
| https://vitest.dev/guide/coverage | Two providers: **v8** (default; instruments nothing, reads V8's own coverage counters, fastest, Node/Chromium-only) vs **istanbul** (source-transforms every file, slower, works on any JS runtime, 12+ years battle-tested). Enable with `test.coverage.provider` in config or `vitest run --coverage` on the CLI. `include`/`exclude` glob the measured files. |
| https://jestjs.io/docs/mock-functions | `jest.fn()` records `.mock.calls`, `.mock.results`, `.mock.instances`, `.mock.contexts`. `mockReturnValueOnce`/`mockResolvedValueOnce` chain per-call return values, falling back to the last `mockReturnValue`. `jest.mock('axios')` auto-mocks a module; `jest.requireActual` + spread lets a mock keep most real exports and override one. Matchers: `toHaveBeenCalledWith`, `toHaveBeenLastCalledWith`. Caveat called out directly: inject values into pure functions rather than baking logic into things you have to mock. |
| https://testing-library.com/docs/guiding-principles/ | "The more your tests resemble the way your software is used, the more confidence they can give you." Tests should touch DOM nodes the way a user or assistive tech would, not component internals; API should stay simple. (Query priority order — `getByRole` first, `getByTestId` last-resort — is on Testing Library's separate queries page; not fetched here, so: to verify exact ordering text.) |
| https://github.com/dequelabs/axe-core | Checks WCAG 2.0/2.1/2.2 A/AA/AAA plus best-practice rules. Explicitly states it finds **on average 57% of WCAG issues automatically** — the rest need a human. Results split into `violations` / `incomplete` (needs manual review — axe couldn't decide) / `inapplicable` / `passes`. `color-contrast` is unreliable under JSDOM (no real rendering) — run it in a real browser. |
| https://www.deque.com/axe/core-documentation/api-documentation/ | Impact scale for every rule failure: `minor` < `moderate` < `serious` < `critical`; a rule's reported impact is the highest impact among its failing checks. `incomplete` = aborted / needs review (not pass, not fail); `inapplicable` = rule didn't match anything on the page (e.g. no `<video>`, so caption rules don't fire). |
| https://github.com/GoogleChrome/lighthouse-ci | Runs Lighthouse on every commit/PR, trends scores over time. `.lighthouserc.js` holds `assert` rules (fail the build under a score/metric threshold) and budgets (byte-size / count ceilings per resource type). `lhci autorun` is the one command that collects + asserts + (optionally) uploads. Runs audits multiple times per URL to damp variance before asserting. |
| https://grafana.com/docs/k6/latest/ | Open-source, scriptable (JS) load-testing tool built to be cheap on resources at high VU counts. Named test shapes: **smoke** (tiny load, sanity check), **load** (expected traffic), **stress** (find the breaking point), **soak** (sustained load over hours, finds leaks), **spike** (sudden burst). Has thresholds (pass/fail SLO assertions baked into the script) and a browser-testing mode; integrates with Grafana Cloud and CI. |
| https://docs.pact.io/ | Consumer-driven contract testing. Consumer test runs against a mock provider and records a "pact" (the exact requests/responses it needs); the file is then replayed against the *real* provider in the provider's own test suite to verify it still honors that contract. Analogy given: test the smoke alarm with its own test button, not by setting the house on fire — i.e. verify the contract, not a full end-to-end deploy, to catch integration breaks between independently-deployed services. |
| https://stryker-mutator.io/docs/ | Mutation testing: Stryker auto-injects small code changes ("mutants" — flip a `<` to `<=`, negate a condition, etc.), reruns the test suite per mutant. A mutant is **killed** if a test fails (good — the suite noticed), **survived** if all tests still pass (bad — a gap: tests execute the line but never assert on its effect), or **timeout** (mutant caused a hang). Mutation score = % killed. Directly answers what code coverage cannot: coverage only proves a line *ran*, not that anything *checked* it. |
| https://fast-check.dev/ | Property-based testing for JS/TS: instead of example inputs, you declare a property (an invariant) and `fc.assert(fc.property(fc.string(), ..., fn))` runs it against hundreds of generated cases (arbitraries) covering edge cases you wouldn't think to write by hand. On failure it **shrinks** the counterexample to the smallest input that still fails, so the bug report is minimal, not a 500-char random string. |
| https://owasp.org/www-project-web-security-testing-guide/ | WSTG ("the premier... testing resource") is the reference for how to actually test for the OWASP categories (auth, session management, input validation, business logic, client-side, etc.) rather than just listing the Top 10 risks. v4.2 is the last stable full release; v5.0 develops openly on GitHub. Meant to be consulted as a testing checklist/methodology, not just a vulnerability list. |
| https://developer.chrome.com/docs/devtools/performance/reference | DevTools Performance panel throttles Network and CPU independently in "Capture settings." CPU throttling is a simple multiplier (e.g. "4x slowdown" = CPU runs 4x slower); DevTools states plainly it **cannot truly simulate mobile CPU architecture**, only approximate the wall-clock slowdown — treat results as directional, calibrate a custom preset against a real device when precision matters. |
| https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html | Google's own guidance: roughly 70% small (unit), 20% medium (integration), 10% large (e2e) — the "test sizes" framing (small/medium/large) is preferred internally over unit/integration/e2e because it's about speed+isolation, not just scope. Heavy e2e investment is explicitly called a trap: slow feedback loops, flaky, and by the time a large test fails you still have to bisect down to a unit-level repro anyway. |
| https://kentcdodds.com/blog/write-tests | "Write tests. Not too many. Mostly integration." (Guillermo Rauch, endorsed by Kent C. Dodds). Chasing 100% coverage has diminishing/negative returns past ~70%; testing implementation details breaks on refactors and buys false confidence. The "Testing Trophy": static (lint/types) → unit+integration (biggest investment) → e2e (fewest, highest-confidence-per-test). |
| https://martinfowler.com/bliki/TestPyramid.html | Pyramid: many unit tests, fewer service/subcutaneous tests, fewest UI-driven end-to-end tests — because UI tests are "brittle, expensive to write, and time consuming to run." Names the inverted anti-pattern the **ice-cream cone**: record-playback UI tools produce lots of slow high-level tests and almost no unit tests, and that shape "resists changeability." Rule of thumb: when a high-level test catches a bug, write a *unit* test that reproduces it before fixing, so the low-level suite gets the permanent regression guard. |
| https://google.github.io/eng-practices/review/reviewer/looking-for.html | The reviewer checklist: Design (does it belong, does it fit the system), Functionality (matches intent, handles edge cases/concurrency, verify UI by hand if needed), Complexity ("could this be simpler," flag over-engineering), Tests (present, correct, would actually fail if the code broke), Naming, Comments (explain *why*, not *what*), Style/consistency with the existing file, Documentation kept in sync, read every line of human-written code in your queue, know the broader context, and say something positive when it's earned. |
| https://google.github.io/eng-practices/review/reviewer/standard.html | The actual bar: approve once the change "definitely improves the overall code health of the system," even if it isn't perfect — reviewers are told explicitly not to require perfection or block on personal style preference. Non-blocking nits get prefixed "Nit:"; teaching moments that aren't required for approval are marked optional too. The one hard line: never approve something that would make code health *worse*, except declared emergencies. |
| https://www.w3.org/WAI/WCAG22/quickref/ | Four POUR principles: Perceivable, Operable, Understandable, Robust. Conformance is A (must), AA (should — the common legal/contractual bar), AAA (aspirational, rarely required site-wide). Concrete AA anchors worth hard-coding into a checklist: 1.4.3 contrast ≥ 4.5:1 for normal text, 1.4.10 Reflow — no 2D scrolling needed at 320 CSS px / 400% zoom, 2.1.1 full keyboard operability. |
| https://principlesofchaos.org/ | Chaos engineering: define a measurable "steady state," hypothesize it holds under both a control and an experimental group, inject a real-world fault (kill a process, sever a network link, degrade a disk) into the experimental group only, and look for the steady-state metric to diverge. Advanced practice: run in production with real traffic, automate experiments continuously, and minimize blast radius so a bad experiment can't take down the whole system. |
| https://www.electronjs.org/docs/latest/tutorial/automated-testing | Electron's own recommended paths: WebDriver-protocol tools (WebdriverIO/Selenium — drive the renderer like a normal browser), Playwright (`_electron.launch`, CDP-based, "experimental" per Electron's own docs, grants main-process access via `electronApp.evaluate()`), or a hand-rolled driver over Node IPC when you want minimal overhead and don't need a full protocol server. |
| https://playwright.dev/docs/api/class-electron | `const { _electron: electron } = require('playwright'); const app = await electron.launch({ args: ['main.js'] }); const window = await app.firstWindow(); await window.screenshot(...); await app.close();`. `electronApplication.evaluate()` runs inside the main process with `require('electron')` as its argument — this is how a test can assert on main-process state (menus, IPC handlers, app lifecycle) that a pure DOM test can't reach. Supported from Electron v12.2.0+/13.4.0+/14+. |
| (search, not fetched) ISTQB CTFL v4.0 (2023) | Test levels: component/unit, integration, system, acceptance. Test types: functional, non-functional, structural (white-box), change-related (regression/retest). Black-box techniques: equivalence partitioning, boundary value analysis, decision table testing, state transition testing; white-box: statement/branch coverage; experience-based: exploratory testing, checklist-based testing, error guessing. (to verify exact wording — search summary only, syllabus PDF not fetched) |
| (search, not fetched) Session-Based Test Management, James & Jonathan Bach | A **charter** names the area under test, the resources/tools available, and the mission; a **session** is a time-boxed (typically 60–120 min) block of uninterrupted exploratory testing against that charter, logged and later "debriefed." Rapid Reporter-style tools tag the session log so results roll up into metrics without turning exploration into a rigid script. (to verify exact terminology) |

Additional facts asserted below without a fresh fetch are marked **(to verify)** inline.

### Sources — 2026-10-29 refresh (AI-agent era, current stack practice)

| URL | Take |
|---|---|
| https://web.dev/articles/inp | **Fetched directly, primary source.** INP is confirmed "a stable Core Web Vital metric" as of fetch date. Thresholds at the 75th percentile, segmented mobile/desktop: **good ≤ 200ms, needs improvement 200–500ms, poor > 500ms.** This supersedes FID (retired 2024) as the responsiveness Core Web Vital. Widely-repeated 2026 SEO-blog claims of a "March 2026 update lowering INP good threshold to 150ms and LCP to 2.0s" could **not** be confirmed on this primary page — treat those specific numbers as **unverified/likely false** until found on web.dev or Search Central directly. **Resolved 2026-10-30, ruled false/unconfirmed, two more primary checks:** fetched developers.google.com/search/blog's 2026 archive directly — no January-through-October 2026 entry announces any Core Web Vitals/INP/LCP threshold change (March 2026 entries are about crawling, not CWV); a follow-up web search for the specific "150ms" claim surfaced only secondary SEO blogs repeating each other, one of which admits web.dev was last substantively updated 4 September 2025 and still states LCP good ≤2.5s. No primary Google source for the 150ms/2.0s claim exists as of this date — stop repeating it. |
| https://playwright.dev/docs/release-notes | **Fetched directly, primary source (first 100k chars).** Playwright has built dedicated AI-agent tooling since v1.51: a "Copy prompt" button that packages an LLM-ready error context; v1.56 ships **Test Agents** — planner (explores the app, writes a Markdown test plan), generator (turns the plan into test files), and healer (reruns the suite and repairs failing tests), scaffolded via `npx playwright init-agents --loop=claude|vscode|opencode`; v1.59 adds `--debug=cli` for a coding agent to attach/step through a test, `npx playwright trace` for CLI-based inspection, and "agentic video receipts" (screencasts with chapter titles/action annotations as a reviewable record of what an agent did); v1.62 bundles the official **Playwright MCP server** (`npx playwright mcp`); v1.63–1.64 add structured/JSON aria snapshots and `page.getByRef()` for agents to address elements by stable aria ref instead of brittle selectors; v1.64 adds experimental **WebMCP** support so a page's own registered tools are exposed to an agent as `webmcp_<tool>`. Net: modern Playwright assumes an agent, not only a human, is driving or reading the test — the test-board specialist should prefer aria-ref/MCP-based element addressing and the trace/CLI tooling over manual selector-guessing when an agent is doing the testing. |
| https://www.openlayer.com/blog/llm-as-judge-evaluation-guide (via search summary, not directly fetched) | LLM-as-judge in 2026 practice: **validate the judge itself** before trusting its scores — pin the judge model version inside the eval contract and re-run a calibration set on any judge-model swap (a judge swap is itself a breaking change to the eval suite, not a config tweak). Known, well-documented biases: **position bias** (first option in a pairwise comparison wins disproportionately) and **length bias** (longer answers score higher independent of quality). Mitigations repeated across sources: prefer **pairwise comparison over absolute 1-10 scoring** where feasible; use a judge model **stronger than** the model under test; **layer deterministic checks first** (schema validation, regex, exact-match) and reserve the LLM judge for genuinely qualitative judgment calls it can't be replaced for; **human-spot-check 5-10% of judge outputs** on a rolling basis rather than trusting the judge indefinitely. (to verify: exact numbers are vendor-blog figures, not independently confirmed) |
| search summary (DEV/FutureAGI/MetaCTO, not directly fetched) | 2026 practitioner consensus on **regression suites for LLM/agent features**: run a **versioned golden dataset** of input/expected-behavior pairs on every PR as a CI gate, same role a unit-test suite plays for deterministic code — block merge on regression. Keep the **PR-gating suite short** (illustrative figure: ~15 min budget, ~150-200 examples) since slow eval suites get skipped/bypassed in practice; run a larger suite nightly/pre-release. **Watch sub-metrics, not one aggregate score** — a prompt change can improve relevance while silently regressing safety or latency, and a single blended number hides that. Feed real production failures back into the golden dataset over time (promote hard cases found in live traces into the regression set) rather than freezing the dataset at launch. (to verify: specific run-time/example-count figures are illustrative vendor numbers) |
| search summary (Promptfoo/DeepEval comparison posts, not directly fetched) | Current open-source tooling split: **Promptfoo** — declarative YAML config, built-in **red-team mode** with plugins for prompt injection, jailbreaks, PII leakage, BOLA/BFLA (broken object/function-level authorization via tool calls), and "excessive agent agency"; returns a non-zero exit code on assertion failure, usable directly as a CI gate. **DeepEval** — pytest-native, imperative Python, research-backed metric library including **G-Eval** (a configurable LLM-judge metric for criteria that don't fit a fixed rubric), commonly used for agent-behavior grading. Reported (unverified, vendor-sourced) pattern: DeepEval as the PR-gating pass/fail check, Promptfoo for prompt/config comparison and red-teaming. Neither source claims RAGAs is a good fit for agent (as opposed to pure RAG) evaluation. (to verify: all of the above is from search-result summaries, not a direct fetch of either project's own docs) |
| search summary (Datadog Bits AI, Semaphore, Testomat, Kong eng blog, tianpan.co, not directly fetched) | 2026 shift in **flaky-test handling**: several CI vendors now run an agent that (a) detects flakiness from failure-rate history (one simple heuristic cited: flag a test whose failure rate over recent runs exceeds ~30%), (b) diagnoses the likely cause with an LLM pass over the test + stack trace, and (c) proposes or auto-opens a fix PR. A **sharp caution from a July 2026 post** (tianpan.co): flaky tests are far more dangerous in an agent-driven loop than a human one, because a human engineer dismisses an unrelated red X and moves on, while an autonomous coding agent can misread a flaky failure as "my change broke this" and chase a nonexistent regression, or conversely learn to ignore all red and start rubber-stamping real failures. Practical implication for this specialist: **quarantine known-flaky tests out of the signal an agent (including this test-board specialist itself, when used by a coding agent) reads as ground truth**, with the quarantine dated and reasoned — this strengthens, not just repeats, the pre-existing "flaky tests" guidance in the QA process section below. (to verify: vendor-reported fix rates and $-per-fix figures are unverified marketing numbers, not included as fact) |
| https://www.w3.org/WAI/WCAG22/quickref/ (re-fetched for the 2.2-specific additions) | **Confirmed via primary source**: WCAG 2.2's nine net-new success criteria versus 2.1 are 2.4.11 Focus Not Obscured (Minimum), 2.4.12 Focus Not Obscured (Enhanced), 2.4.13 Focus Appearance, 2.5.7 Dragging Movements, 2.5.8 Target Size (Minimum), 3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication (Minimum), 3.3.9 Accessible Authentication (Enhanced). Of these, **AA-level and directly relevant to a modern web/app test plan**: 2.4.11 (focus indicator not fully hidden by sticky headers/footers — common bug class in modern SPA layouts), 2.5.8 (touch target ≥24x24 CSS px, AA), 3.3.7 Redundant Entry (don't force a user to re-enter info already given in the same process), 3.3.8 Accessible Authentication (no cognitive-function test — e.g. password — as the *only* way to authenticate, without an alternative). The fetch could not confirm whether any version newer than 2.2 exists as of this date — **no evidence found of a WCAG 2.3/3.0 superseding 2.2 as of late 2026**; AA on 2.2 remains the working bar (to verify periodically, as this is a fast-moving area only confirmed as of this fetch). **Resolved 2026-10-30, confirmed via the stronger source this note itself called for:** fetched https://www.w3.org/WAI/standards-guidelines/wcag/ (the main W3C WAI standards page, not just the 2.2 quickref) directly — it states WCAG 2.2 (published 5 October 2023, updated 12 December 2024) is still the latest published version ("W3C encourages you to use the latest version of WCAG"), and names only one successor in progress: **WCAG 3.0** ("W3C Accessibility Guidelines 3.0," formerly codenamed "Silver"), explicitly an **early draft** with no publication date or final status. No WCAG 2.3 exists. AA-on-2.2 is confirmed the correct current working bar. |

---

## Test kinds

Format: kind — purpose — tool/skill — exact command — pass condition.

| Kind | Purpose | Tool | Command | Pass condition |
|---|---|---|---|---|
| Unit | Smallest testable unit behaves correctly in isolation | Vitest / Jest | `vitest run` / `jest` | All assertions pass; no `.only`/`.skip` left in; new code has a failing-first test that now passes |
| Integration | Modules/services combined behave correctly (DB, IPC, real modules, minimal mocking) | Vitest/Jest + real deps or test containers | `vitest run tests/integration` | Passes against a real (or realistically faked) dependency, not a stub that just echoes the expectation |
| Contract | Two independently-deployed services agree on the API shape | Pact | `pact-broker` verify / provider's `PactVerifier` | Consumer pact file verifies green against the real provider build |
| End-to-end (web) | A full user journey works in a real browser | Playwright | `npx playwright test` | Journey completes; web-first assertions pass; no unexpected console errors |
| End-to-end (Electron) | The packaged desktop app launches and the flow works across main + renderer | Playwright `_electron` | `npx playwright test --project=electron` | `firstWindow()` resolves, key IPC/menu actions verified via `electronApp.evaluate()`, window closes cleanly |
| Visual regression | Pixels didn't silently drift | Playwright `toHaveScreenshot` | `npx playwright test --update-snapshots` (baseline) then `npx playwright test` | Diff ≤ configured `maxDiffPixels`; new diffs reviewed and intentional, not silently accepted |
| Accessibility | WCAG conformance, screen-reader/keyboard usability | axe-core (+ Playwright), manual keyboard/SR pass | `@axe-core/playwright` `AxeBuilder().analyze()` | Zero `violations` at the agreed impact floor (commonly serious+critical block, moderate warn); `incomplete` triaged by a human, not auto-passed |
| Performance | Load time, responsiveness, resource budgets under real-world constraints | Lighthouse CI, Chrome DevTools throttling, design-board.mjs testers | `lhci autorun` | Score/metric assertions in `.lighthouserc.js` pass; current Core Web Vitals field thresholds (directly fetched from web.dev/articles/inp, 2026-10-29): **LCP ≤ 2.5s good**, **INP ≤ 200ms good / 200-500ms needs improvement / >500ms poor** (INP confirmed still a stable Core Web Vital, replacing the retired FID), **CLS ≤ 0.1 good**, all at p75 of real-user field data — Lighthouse/DevTools lab numbers are directional for debugging, field data is the actual pass/fail signal |
| Load / stress / soak | System holds up under expected, breaking, and sustained load | k6 (or Artillery) | `k6 run script.js` | Thresholds (e.g. `http_req_duration p(95)<500`) pass at target VU count; soak run shows no memory/error-rate creep over time |
| Security | Common web/app vulnerabilities absent | OWASP WSTG checklist, manual + scanner (e.g. ZAP) (to verify tool choice) | project-specific | No critical/high findings against the WSTG categories exercised for this project's surface (auth, session, input validation, API) |
| Mutation | Tests actually catch bugs, not just execute lines | Stryker | `npx stryker run` | Mutation score above the project's agreed floor; every survived mutant triaged (either a real gap fixed, or accepted with a reason) |
| Property-based | Invariants hold across generated inputs, not just hand-picked examples | fast-check | run inside the normal `vitest`/`jest` command | `fc.assert` finds no counterexample within the configured run count; any past shrunk failure becomes a permanent example-based regression test |
| Responsive / cross-browser | Layout and behavior hold across viewports, browsers, and devices | Playwright projects, design-board.mjs (`screen-sizes`, `zoom-reflow`) | `npx playwright test` (multi-project config) / `node design-board.mjs --only screen-sizes,zoom-reflow` | No layout break, no horizontal scroll, no clipped/overlapping content at any configured viewport or 400% zoom |
| Coverage | How much of the code the suite exercises (a floor, not a target) | Vitest/Jest coverage (v8 or istanbul) | `vitest run --coverage` | Meets the project's coverage floor **and** the report is read for untested branches, not just the percentage number |
| CLI | Command-line tool behaves correctly across args, exit codes, stdout/stderr | Bats / ShellSpec (shell); Vitest+`execa` (Node CLIs) | `bats tests/*.bats` | Exit codes match expectation, stdout/stderr match (or match a documented golden), no stray temp files left behind |
| API | HTTP/RPC endpoints behave correctly | Vitest/Jest + supertest, or k6 for load, or Postman/Newman for contract smoke (to verify Newman fit) | `npm test` / `newman run collection.json` | Status codes, schema, and error shapes match spec; auth/authorization boundaries enforced |

Notes per kind, beyond the table:

- **Unit vs. integration boundary.** A test that mocks every collaborator and asserts on a return
  value is a unit test; a test that wires real modules together (even in-memory: a real reducer, a
  real parser, a real in-memory DB) and asserts on observable behavior is an integration test in
  the Kent C. Dodds / testing-trophy sense, and should get the larger share of new test-writing
  effort for anything past a pure utility function.
- **Visual regression is not accessibility testing** and vice versa — a screenshot can match pixel
  for pixel while the DOM order is wrong for a screen reader, and an axe-clean page can still look
  visually broken. Run both; neither substitutes for the other.
- **Mutation testing is expensive to run on every commit** (it reruns the whole suite once per
  mutant) — treat it as a periodic health check on the test suite itself (e.g. weekly, or on the
  files a PR touches) rather than a REQUIRED RUN gating every change, unless the project's CI
  budget allows full runs.
- **Property-based testing pays off most on pure functions with an invariant that's easy to state**
  (parsers, serializers/deserializers that should round-trip, sorting, math) — it is a poor fit for
  code whose correctness is defined by a long list of specific examples rather than a general rule.
- **Load/stress/soak are different questions.** Smoke confirms the script itself works; load
  confirms behavior at expected traffic; stress finds the breaking point (useful for capacity
  planning, not for every release); soak (hours, not minutes) is the only one of the four that
  reliably surfaces memory leaks and slow resource exhaustion — a short load test will not catch a
  leak that only matters after six hours.

---

## AI-agent-era testing (added 2026-10-29)

Scope: this section covers two distinct things the test-board specialist now needs to handle that
the original playbook predates — (A) testing a product that itself has AI/LLM features, and (B)
the fact that a *coding agent* (not only a human) may now be the one reading this specialist's
verdict and acting on it, which changes what counts as safe evidence (notably around flaky tests).

**Testing AI/LLM features in the product under test:**

| Kind | Purpose | Tool | Pass condition |
|---|---|---|---|
| Golden-set regression eval | A prompt/model/RAG change didn't silently regress known-good behavior | Promptfoo or DeepEval, run in CI on every PR touching prompts/agent logic | Versioned golden dataset scores at or above the previous baseline on every tracked sub-metric (not just a blended average); any regression blocks merge same as a failing unit test |
| LLM-as-judge eval | Grading free-form output where exact-match isn't possible (quality, helpfulness, tone, safety) | DeepEval `G-Eval` or an equivalent custom judge prompt | Judge model is pinned and versioned in the eval config; judge itself was calibrated against a human-labeled sample before being trusted; prefer pairwise comparison over absolute scoring to reduce scoring noise |
| Prompt-injection / red-team | The product's AI surface resists adversarial input, jailbreaks, and unauthorized tool/function access | Promptfoo red-team mode (prompt injection, jailbreak, PII-leak, BOLA/BFLA, excessive-agency plugins) | Zero successful jailbreak/injection/unauthorized-tool-call findings at the configured severity floor; any "excessive agent agency" finding (the agent took an action beyond its stated scope) is a blocker, not a warn |
| Agent-tool-use testing | An agentic feature calls its tools correctly, respects scope, and doesn't go off-task | Scripted tool-call transcripts + assertion on which tools were called, with what arguments, in what order | Tool calls match the declared contract; the agent never calls a tool it wasn't granted; a tool failure is handled (retried/surfaced), not silently swallowed or papered over by inventing a plausible-looking result |
| Hallucination / groundedness | Output claims only what's actually supported by the provided context/data | Deterministic check first (does every cited fact trace to a source in context) then LLM-judge for the rest | No ungrounded factual claim presented as fact; synthetic/demo data is labeled, matching this project's existing TRUTH CHECK rule in the skill prompt |

Notes:
- **Deterministic checks first, judge last.** The repeated 2026 practitioner pattern (not vendor
  hype — it shows up independently across sources) is to never let an LLM judge grade something a
  regex, schema validator, or exact-match check could grade for free. The judge is for genuinely
  qualitative calls only — using it as the first-line check wastes money and adds the judge's own
  noise to things that didn't need it.
- **A judge-model swap is a breaking change to the eval suite itself**, not a transparent
  improvement — re-run the calibration set and expect scores to move even if nothing about the
  product changed. Treat an unexplained score jump right after a judge-model bump as a finding
  about the eval, not evidence the product improved.
- **Red-team findings get the same evidence bar as any other finding**: the actual adversarial
  prompt and the actual response that broke the policy, not a description of what a prompt
  injection test "generally covers."

**Flaky tests in an agent-driven workflow — stronger than the original guidance:**

The original QA-process section below already treats flaky tests as worse than no test. 2026
practice sharpens *why* this matters more now: a human engineer who sees an unrelated red X
dismisses it and moves on; a coding agent consuming this specialist's verdict (or any CI gate)
cannot reliably make that same judgment call, and can either (a) misattribute a known-flaky
failure to its own change and chase a nonexistent regression, burning time and possibly "fixing"
something that was never broken, or (b) learn that red is noise and start ignoring real failures
too. Concretely: **quarantine known-flaky tests out of whatever signal an agent reads as ground
truth**, dated and reasoned, before that signal reaches an autonomous loop — not just before it
reaches a release gate. This specialist should treat an un-quarantined flaky test feeding an
agent's decision loop as a blocker-class finding, not a minor note, when the consuming workflow is
itself agentic.

**Stack currency note (Playwright, directly fetched from playwright.dev/docs/release-notes):**
modern Playwright (v1.56+) ships dedicated agent tooling — Test Agents (planner/generator/healer,
`npx playwright init-agents`), a bundled MCP server (`npx playwright mcp`, v1.62+), and
`page.getByRef()` with structured aria snapshots (v1.63-1.64) for addressing elements by stable
aria ref instead of a CSS/XPath selector that breaks on markup churn. When an agent (rather than a
human) is writing or running the Playwright suite, prefer aria-ref/MCP-based element addressing
and the trace/CLI tooling (`npx playwright trace`, `--debug=cli`) over hand-written selectors —
this is now the tool's own recommended path for agent-authored tests, not a workaround.

---

## QA process

**Levels (ISTQB, to verify exact wording):** component/unit → integration → system → acceptance.
Each level asks a different question — "does this function work," "do these two modules agree,"
"does the whole system meet its requirements," "does this satisfy the person who asked for it."
Skipping a level doesn't get compensated for by doing more of another — an end-to-end pass does
not prove a unit is correct, and a green unit suite does not prove two units integrate.

**Types (crosscuts levels):** functional (does it do the right thing), non-functional (how well —
performance, security, usability, reliability), structural/white-box (statement/branch coverage of
the code itself), change-related (regression — did this break something that used to work).

**Black-box design techniques** (derive test cases from the spec, not the code):
- *Equivalence partitioning* — split inputs into classes that should behave the same; test one
  representative per class instead of every value.
- *Boundary value analysis* — bugs cluster at edges; test the boundary, one below, one above (e.g.
  min-1, min, min+1, max-1, max, max+1).
- *Decision table testing* — enumerate combinations of conditions and their expected actions when
  logic has multiple interacting flags/inputs; catches missed combinations plain example tests skip.
- *State transition testing* — model the system as states + transitions/events; test valid
  transitions, invalid transitions (should be rejected), and transitions with no defined effect.

**Experience-based / exploratory:** charter-driven, time-boxed (60–120 min, to verify), a named
tester covers a named area with a stated mission, and takes notes as they go rather than following
a script. Complements scripted testing — it finds the things nobody thought to write a test for.
Use when: a new feature just landed, before a release, or when scripted coverage feels thin but
nobody can say exactly why.

**Risk-based testing:** more testing effort where the *probability × impact* of failure is
highest — payment flows and auth get more scrutiny than a tooltip's copy. The test-board specialist
should weight its REQUIRED RUNS by what the project's actual risk surface is (user data? money?
public-facing? single-user local tool?) rather than applying a flat checklist regardless of stakes.

**Pyramid vs. trophy:** Google's own guidance (small/medium/large ≈ 70/20/10) and Fowler's classic
pyramid both push weight toward fast, isolated tests and treat heavy UI/e2e investment as a trap
(slow, flaky, ice-cream-cone anti-pattern). Kent C. Dodds' trophy reshapes this for modern
frontend work: static analysis is free and goes first, then the biggest investment moves to
*integration* tests (real modules, minimal mocking, closer to how the app is actually used) rather
than pure isolated units, with e2e kept small and reserved for the handful of journeys that must
never break. Both models agree on the failure mode to avoid: a fat top layer of slow, flaky,
high-level tests and a thin foundation underneath it.

**Flaky tests:** a test that passes and fails without a code change is worse than no test — it
teaches the team to re-run and ignore failures, which erases the signal for every other test in
the suite too. Google's practice: track failure/pass history per test, auto-quarantine or
auto-rerun known-flaky tests separately from the trusted signal, and treat new tests with
suspicion for a burn-in period before they gate anything. The test-board specialist should never
accept "it passed on retry" as evidence without also demanding the flaky test be fixed or
quarantined with a reason — a retry that silently launders a flaky failure is a REQUIRED RUN
being gamed.

**ISTQB test process activities** (to verify exact wording — general syllabus structure, not a
direct quote): planning (what will be tested, to what standard, with what resources), monitoring
and control (tracking progress against the plan and adjusting), analysis (what needs to be
tested, derived from requirements/risk), design (turning that into concrete test cases using the
techniques above), implementation (scripting/automating the designed cases, preparing data and
environments), execution (running them, logging actual vs. expected), and completion (reporting,
archiving, and feeding lessons back into the next cycle). The test-board specialist's TEST PLAN +
REQUIRED RUNS + verdict maps onto design/implementation + execution + completion; it should not
skip straight to execution without a design step that names *why* each test exists.

**Test-basis discipline:** black-box technique names (equivalence partitioning, boundary value
analysis, decision tables, state transitions) are not academic — they are the fastest way to catch
an under-tested boundary before a user does. A form field with a documented 1-500 character limit
that only has tests for "hello" and "" is missing 499, 500, and 501 — boundary value analysis
makes that omission visible on inspection instead of by accident in production.

---

## Environment testing

The product must be tested in the conditions it will actually run in, not just the one machine
that built it. Cheap ways to hit each condition:

| Condition | Why it matters | Cheap way to test it |
|---|---|---|
| OS matrix (Windows/macOS/Linux) | Path separators, case sensitivity, line endings, native modules | Playwright `projects`, CI matrix build (GitHub Actions `matrix.os`), or at minimum manual smoke on the operator's actual OS (Windows here) |
| Runtime versions (Node, browser) | API availability, deprecated behavior, silent version drift | `.nvmrc`/`engines` field enforced in CI; run the oldest and newest supported Node in CI matrix |
| Clean install | "works on my machine" masks a missing dependency or undocumented setup step | Delete `node_modules` + lockfile-respecting `npm ci` in a fresh clone/container; first-run must succeed with zero manual steps beyond the documented ones |
| Missing / malformed env vars | Crashes vs. graceful degradation when config is absent | Unset each required env var one at a time and run; expect a clear startup error, never a silent wrong-default or a stack trace |
| Locale / timezone / DST | Date math, currency/number formatting, sort order break silently | Run with `TZ=Pacific/Kiritimati` and `TZ=Pacific/Niue` (extremes either side of UTC), and force a DST-transition date; run with a non-`en-US` locale |
| Slow / offline network | Hangs, unhandled rejections, no retry/backoff | Chrome DevTools / CDP network throttling (Slow 4G, Fast 3G — see design-board.mjs `SLOW_4G`/`FAST_3G`), and a hard `offline: true` toggle mid-session |
| Low memory / CPU | Jank, OOM crashes, dropped frames | CDP CPU throttling (`Emulation.setCPUThrottlingRate`, 4-6x used in design-board.mjs), container memory limits (`docker run -m 512m`) |
| Paths with spaces / unicode / Windows-style | Shell quoting bugs, broken globs, backslash vs. forward-slash bugs | Install/run from a path containing a space and a non-ASCII character; on Windows, verify both `\` and `/` separators are accepted where the app takes user paths |
| Permissions | App assumes elevated rights it won't have in the real environment | Run as a non-admin user; on Windows, a restricted-ACL folder; on POSIX, a read-only mount for anything the app should only read |
| First-run vs. upgrade | Migration bugs, stale cache, schema drift | Fresh install with no prior state, versus install-over-previous-version with real prior data present; check both produce correct state |
| Container vs. host | Missing system deps, different filesystem semantics, networking differences | Run the same test suite inside the project's Docker image (if any) and directly on host; diffs are findings, not noise |

**Windows-specific notes** (this project runs on Windows 11, per its own environment): path length
limits (the historical 260-character `MAX_PATH`, still relevant unless long-path support is
explicitly enabled), `\` vs `/` in user-typed paths, case-insensitive-but-case-preserving
filesystem (a bug that only shows up on case-sensitive Linux CI can hide locally), line-ending
(`CRLF` vs `LF`) drift in generated files, and PowerShell's different quoting rules from POSIX
shells breaking a script that was only ever tested in Bash. A project developed and only ever run
on one OS should get at least one deliberate cross-shell command test (does the documented install
command work verbatim in both PowerShell and Bash) rather than assuming shell scripts are portable.

**Cheap ways to fake a whole matrix without real hardware:** Playwright `projects` for
browser/device matrix; Docker `--memory`/`--cpus` flags for resource limits; `TZ=` env var plus
`Intl.DateTimimeFormat` locale override for locale/timezone (no separate machine needed); CDP
network/CPU throttling for slow-network and low-end-device simulation; a throwaway non-admin OS
user account for permissions; a fresh container or a wiped VM snapshot for clean-install — most of
this matrix is achievable on one machine with the right flags, so "we don't have enough test
hardware" is rarely a valid reason to skip it.

---

## Reviews

**Code review** (Google eng-practices): the reviewer's job is not to demand a perfect diff — the
standard is "does this change definitely improve the overall code health of the system," and
non-blocking preferences get a "Nit:" prefix so they never gate. What to actually look at, every
time: Design (does it belong here, does it fit the surrounding system), Functionality (does it do
what the author intended, including edge cases and concurrency), Complexity (could this be
simpler — flag over-engineering as hard as under-engineering), Tests (present, correct, and would
genuinely fail if the code broke), Naming, Comments (explain *why*, not *what*), Style/consistency
with the file it's in, and Documentation kept current. Read every line of human-written code in
scope; know the surrounding context; say something positive when it's earned, not only findings.

**Design review:** before code exists — does the proposed shape fit the system, is it the
simplest thing that solves the actual problem (YAGNI), does it avoid speculative generality, and
does it name the failure modes it's choosing not to handle (rather than pretending they can't
happen).

**Accessibility review:** WCAG 2.2 POUR (Perceivable / Operable / Understandable / Robust), AA as
the working bar — confirmed current as of the 2026-10-29 refresh (no WCAG 2.3/3.0 found superseding
2.2). Automated (axe-core) plus manual: real keyboard-only pass (Tab/Shift+Tab reaches everything,
focus is visible, nothing traps focus), a screen-reader pass (does the accessibility tree read as a
coherent outline, not just "no errors"), and contrast measured on the actual composited background,
not assumed from a design token. Axe only catches ~57% of WCAG issues — "axe found zero violations"
is evidence of *one* layer, not a clearance. **WCAG 2.2's nine net-new criteria over 2.1** (directly
fetched, see Sources): the three most likely to catch a modern SPA off guard are 2.4.11 Focus Not
Obscured (a sticky header/footer hiding the focus ring on a focused element), 2.5.8 Target Size
(touch targets under 24x24 CSS px at AA), and 3.3.8 Accessible Authentication (a login that offers
only a cognitive-function test like a password with no alternative, e.g. no passkey/magic-link
option) — add these three to any accessibility REQUIRED RUN, not only the pre-2.2 checklist.

**Test review** (what makes a test worthless): asserts nothing meaningful (executes the code,
checks nothing that would fail if the logic were wrong — this is exactly what a mutation-testing
survived-mutant catches); tests the mock instead of the system (asserts the stub was called with
X, never that X produces the right real behavior); over-specifies implementation details so it
breaks on every harmless refactor; is flaky and therefore ignored; duplicates another test with no
new signal; has no clear name describing the behavior under test, so a failure doesn't tell anyone
what broke.

---

## Errors

**Error-path / negative testing:** for every success path tested, test what happens when the
input is wrong, missing, too large, of the wrong type, or arrives at the wrong time (out-of-order,
concurrent, mid-shutdown). Equivalence partitioning and boundary value analysis apply directly
here: the "invalid" partition and its boundaries need their own test cases, not just the happy
path's.

**Fault injection / chaos basics** (Principles of Chaos Engineering): define the steady state you
expect (a metric, not a vibe), hypothesize it survives a specific real-world fault, inject exactly
that fault (kill a dependency, sever a connection, fill a disk, delay a response) with the
smallest possible blast radius, and check whether the steady-state metric actually held. This is
the disciplined version of "what if the network drops mid-save" — measured, not guessed.

**Good error messages and recovery:** a user-facing error names what happened and what to do next
(never a raw stack trace or an internal exception type in a UI-facing message); the app recovers
to a safe, known state rather than crashing or continuing with silently-corrupted state; retries
are bounded and visible, not an infinite silent loop.

**Testing logging and alerts:** don't just test that the feature works — test that when it
*fails*, something durable records it (log line with enough context to debug later, not just
"error occurred") and, where the project has alerting, that the failure path actually fires the
alert rather than being swallowed by a bare `catch {}`. A silently-swallowed error is a CRITICAL
finding under this project's own security/coding-style rules (never silently swallow errors).

**A concrete negative-test checklist to apply per feature:**
1. Required input missing entirely (undefined/null/empty string).
2. Input of the wrong type (number where a string was expected, and vice versa).
3. Input at, one below, and one above every documented boundary (size limit, count limit, range).
4. Input that is syntactically valid but semantically nonsensical (a well-formed date in the far
   future/past, a negative quantity where only positive makes sense).
5. The dependency the code calls is down, slow, or returns malformed data (mock the failure, don't
   only test the happy response).
6. The operation is cancelled or interrupted partway through (process killed, network dropped,
   user navigates away) — does partial state get cleaned up or left corrupt.
7. The same operation is attempted twice concurrently or in rapid succession (double-submit,
   double-click, retried request) — is it idempotent where it needs to be.

---

## Board of testers

Same pattern as `design-board.mjs`: one persona, one condition, one measured check, one
tool/command. The 15 web testers already in `design-board.mjs` (mobile-4g, low-end-android,
zoom-reflow, screen-reader, keyboard, contrast-colour, reduced-motion-no-gpu, no-js-bot,
first-five-seconds, screen-sizes, scroll-audit, scroll-smoothness, craft-no-emoji, scroll-film,
token-discipline) already cover the web persona set well — mobile/slow-network, accessibility
(screen reader, keyboard, contrast, reduced motion), robustness (no-JS), first impression,
multi-monitor, scroll integrity, copy craft, and design-token discipline. This section extends the
same pattern to the kinds of project the design board doesn't cover.

**Web (already covered by design-board.mjs — reuse, don't duplicate):**
run `node src/control/design-board/design-board.mjs --url <target>` and treat any `FAIL`
(blocker/major finding) as blocking, `WARN` (minor) as a note.

**Desktop / Electron:**
1. *The fresh-install user* — condition: never run the app before, no prior config/cache. Check:
   first-run completes without a crash or a blank window. Tool: `_electron.launch({ args:
   ['main.js'] })` against a clean user-data dir; `firstWindow()` must resolve within a bounded
   timeout.
2. *The upgrading user* — condition: has real data from a previous version. Check: migration runs
   once, old data is readable, nothing silently drops. Tool: seed a fixture user-data dir from the
   previous version's schema, launch the new build, assert data intact.
3. *The main-process auditor* — condition: cares about what happens outside the renderer (menus,
   IPC handlers, app lifecycle, native dialogs). Check: IPC contract behaves as declared. Tool:
   `electronApp.evaluate(({ app, ipcMain }) => ...)` to assert on main-process state directly.
4. *The no-window-left-behind auditor* — condition: closes and reopens windows repeatedly. Check:
   no leaked windows/listeners, memory doesn't climb monotonically. Tool: `app.windows()` count
   after repeated open/close, plus a heap snapshot before/after (Chrome DevTools `take_heapsnapshot`
   equivalent, or `--inspect` + manual snapshot diff).
5. *The restricted-permissions user* — condition: runs as a standard (non-admin) OS account, or
   from a folder the app doesn't own. Check: the app either works fully or fails with a clear,
   actionable message — never a silent no-op or an unhandled native exception.

**CLI:**
1. *The exact-args user* — condition: calls the tool with every documented flag combination.
   Check: exit code and stdout match spec. Tool: Bats (`run` + `$status`/`$output`) or ShellSpec.
2. *The wrong-args user* — condition: typos a flag, omits a required argument, passes a value of
   the wrong type. Check: non-zero exit code, a message on stderr (not stdout) that says what was
   wrong, no stack trace. Tool: same harness, asserting `$status != 0` and `$output` content.
3. *The piped user* — condition: feeds the tool via stdin or a Unix pipe, or redirects stdout to a
   file. Check: behaves the same piped as interactive; no ANSI color codes leak into a
   non-TTY/redirected stream. Tool: Bats with `run bash -c 'echo x | tool'`.
4. *The interrupted user* — condition: sends SIGINT/Ctrl-C mid-operation. Check: exits cleanly, no
   half-written output file, no orphaned child process. Tool: shell test sending signal + `wait`,
   checking exit code and filesystem state after.
5. *The unicode/space path user* — condition: runs the tool against a path with spaces or non-ASCII
   characters (mirrors the ENVIRONMENT TESTING row above). Check: no quoting/globbing failure.

**API:**
1. *The spec-following client* — condition: sends exactly what the API contract says. Check:
   status code, response schema, and headers match the contract. Tool: supertest/Vitest, or Pact
   consumer/provider verification if another service is the real caller.
2. *The malformed-request client* — condition: sends missing fields, wrong types, oversized
   payloads, invalid JSON. Check: 4xx with a machine-readable error body, never a 500 or a
   half-processed side effect.
3. *The unauthenticated / wrong-scope client* — condition: no token, expired token, or a token
   without the needed permission. Check: 401/403 as appropriate, and — critically — no data
   leaked in the error response itself (OWASP WSTG authorization category).
4. *The concurrent client* — condition: two requests race on the same resource. Check: no lost
   update, no double-charge/double-write; the API's concurrency guarantee (locking, optimistic
   versioning, idempotency key) actually holds under a real race, not just in theory.
5. *The load client* — condition: N requests/sec sustained for M minutes. Check: latency and error
   rate stay within threshold. Tool: `k6 run` with `thresholds` asserting p95 latency and error
   rate; run smoke → load → (stress/soak as risk warrants).

---

## Evidence rules

The test-board specialist's own prompt already says it: *"No claim of done without output you can
point to."* Concretely:

- A REQUIRED RUN is not satisfied by a plan to run it, a description of what it would show, or a
  claim that it "should pass" — only by actual command output (exit code, printed summary,
  screenshot path, trace file) that the specialist or the operator can open and inspect.
- A retry that turns a failure into a pass is only evidence once the flake itself has been
  explained or fixed — an unexplained flip from FAIL to PASS on rerun is a finding about the test,
  not proof the product works.
- Skipped kinds must say *why* ("not applicable: no UI in this project," "no network calls to
  throttle") — a silent gap in the TEST PLAN is itself a finding.
- Visual/accessibility findings must carry the artifact that shows them (screenshot path, axe
  violation object, contrast ratio number) — "looks fine" is not evidence; `design-board.mjs`'s
  own `add(sev, msg, fix, evidence)` shape is the right model: every finding carries its evidence.
- Coverage and mutation-score numbers are read alongside *what* is uncovered/survived, not quoted
  as a bare percentage — a 95% line-coverage number with the missing 5% being the only error
  handling in the file is a failing signal dressed as a passing one.
- A green build and the app actually starting are baseline evidence for *every* verdict, not a
  substitute for the rest of the TEST PLAN — "it builds" and "it's done" are different claims.

---

## Distilled checklist

For the specialist to hand back at the middle/end checkpoint:

1. Name the test kinds that apply to *this* project (not a copy-pasted universal list) and mark
   the rest "skipped: <reason>."
2. For each applying kind: tool/skill, exact command, pass condition — all three, not two.
3. Unit + integration tests exist and were actually run (command output attached), not merely
   "should pass."
4. Coverage number attached *and* the uncovered lines/branches named, especially error paths.
5. For UI-bearing projects: run the relevant `design-board.mjs` testers (or the desktop/CLI/API
   equivalents above) and attach the `report.md`/`latest.json`/screenshots, not a summary of them.
6. Accessibility: axe run plus one manual keyboard pass and one manual screen-reader-outline pass;
   zero serious/critical violations, `incomplete` items triaged by name.
7. Performance: Lighthouse/DevTools-throttled numbers against a stated budget, not a vibe ("feels
   fast").
8. Security: OWASP-WSTG-informed pass on this project's actual attack surface (auth? user input?
   file/network access?) — named, not assumed absent.
9. Error paths: at least one negative test per input boundary and per external dependency
   (network, disk, other process) that can fail.
10. Environment: clean install verified; at minimum one non-default locale/timezone and one
    throttled-network run, scaled up by the project's actual deployment risk.
11. Flaky tests named and either fixed or quarantined with a dated reason — never silently
    re-run away.
12. Verdict is PASS/WARN/FAIL with the worst open finding cited by file/command/screenshot, mirror
    of `design-board.mjs`'s own `worst >= 2 ? 'FAIL' : worst === 1 ? 'WARN' : 'PASS'` logic — one
    redo demanded only when a FAIL can be cited with evidence, per the specialist's own prompt.
13. **If the project has an AI/LLM feature:** a versioned golden-set regression eval exists and ran
    on this change, sub-metrics (not just a blended score) are named, the judge model (if any) is
    pinned/versioned and was itself calibrated, and at least prompt-injection/excessive-agency
    red-teaming was considered (named, not silently skipped) for any user-facing AI surface.
14. **Flaky tests are quarantined before they reach any agentic consumer of this verdict**, not
    only before a release gate — an un-quarantined flaky test feeding an autonomous loop is a
    blocker-class finding per the 2026-10-29 AI-agent-era testing section above.
15. Accessibility REQUIRED RUN explicitly checks the three WCAG 2.2-specific AA items most likely
    to miss in a modern SPA: focus not obscured by sticky chrome, 24x24px minimum touch targets,
    and a non-password-only authentication path — not only the pre-2.2 POUR basics.
16. Performance REQUIRED RUN cites current Core Web Vitals field thresholds by name (LCP ≤2.5s,
    INP ≤200ms, CLS ≤0.1 at p75) rather than a bare Lighthouse lab score with no field-data context.

---

## Open questions

- Exact ISTQB CTFL v4.0 wording for test levels/types/techniques was taken from search-result
  summaries, not the syllabus PDF itself — worth a direct fetch of the syllabus document before
  treating any exact phrase as a quote (to verify).
- Session-Based Test Management's exact charter/session terminology (60–120 min box, debrief
  format) came from search summaries, not Satisfice's own site — same caveat (to verify).
- No official Playwright page on **visual comparison across OS** gives a hard recommendation
  beyond "keep it consistent"; the project should decide once whether goldens live per-OS or are
  generated only in CI, and hold to it (to verify Playwright's current stance, if any, beyond what
  was fetched).
- k6 vs Artillery: only k6's own docs were fetched; no independent comparison was pulled, so the
  choice between them for this project is still open (to verify).
- Postman/Newman's fit as this project's API contract-smoke tool was asserted, not verified
  against fetched docs — Pact is the fetched, evidenced choice for consumer-driven contracts; if
  the project's API doesn't have a separate consumer service, Newman/Postman may be unnecessary
  overhead rather than the right tool (to verify against the actual project's API surface).
- OWASP WSTG v4.2 vs the in-progress v5.0: this note used v4.2 as current-stable per the fetched
  page; if v5.0 has shipped stable content by the time this specialist runs, re-check (to verify).
  **Resolved 2026-10-30:** re-fetched https://owasp.org/www-project-web-security-testing-guide/
  directly — the project page's own "Latest Version" field still reads **4.2**, and its own text
  says "We are currently developing release version 5.0" (no date given). v4.2 is confirmed still
  the current stable/latest as of this fetch; v5.0 has not shipped.
- No dedicated fetch was done for CLI-specific accessibility/i18n testing (e.g. NO_COLOR support,
  screen-reader-friendly terminal output) — flagged as a gap for the CLI board-of-testers section
  above, added from general practice rather than a fetched source (to verify).
- **2026-10-29 refresh, open items:** the LLM-as-judge bias/calibration guidance, the regression-eval
  CI-budget figures (~15 min, ~150-200 examples), the Promptfoo/DeepEval feature comparison, and all
  vendor-reported flaky-test-agent fix rates came from WebSearch result summaries, not a direct
  fetch of each project's own docs or an independent benchmark — treat specific numbers as
  illustrative, the qualitative pattern (deterministic-checks-first, judge calibration, quarantine
  flaky tests from agentic consumers) as the load-bearing finding (to verify numbers against
  promptfoo.dev / deepeval docs directly if a specific figure needs to be cited as fact).
- The claimed March 2026 Google Core Web Vitals threshold tightening (INP good to 150ms, LCP to
  2.0s) repeated across several SEO blogs could **not** be confirmed against the primary
  web.dev/articles/inp page, which still states the 200ms/500ms INP thresholds — this specific claim
  should be treated as false or at minimum unconfirmed, not cited (to verify directly against
  Google Search Central if this matters for a specific project's performance budget). **Resolved
  2026-10-30 — now closed, not just unconfirmed:** see the Sources-table correction above; checked
  directly against Google Search Central's own 2026 blog archive and a dedicated web search for the
  claim, and found no primary-source corroboration anywhere, only secondary blogs citing each other.
  Treat as false until Google publishes it on web.dev or the Chromium metrics changelog.
- WCAG version-after-2.2 status was checked only against the W3C WCAG 2.2 quickref page itself
  (which naturally doesn't name any successor) — a direct check of the main W3C WAI standards page
  would be the stronger way to confirm no newer WCAG version has shipped (to verify). **Resolved
  2026-10-30:** see the Accessibility-review-section correction above — fetched the main W3C WAI
  standards page directly; 2.2 is still latest, WCAG 3.0 is an early draft only. Closed.
- Playwright release-notes fetch only covered the first 100k of ~208k characters (versions roughly
  1.51-1.64) — earlier version history and anything versioned past the fetched window wasn't read
  (to verify if an older-Playwright-specific feature needs confirming). **Partially addressed
  2026-10-30:** fetched the next 100k-200k character window of the same page — it lands on v1.44-era
  content (test-suite `entries()`, blob/JUnit reporter options, `--last-failed`), i.e. the page is
  sorted newest-to-oldest and the *second* chunk is *older* than the first, not newer. This means
  the 2026-10-29 fetch's first 100k chars already contained the newest material on the page (up
  through whatever version heads the document); there is no missed newer-than-1.64 content sitting
  further down in this same document. Still unconfirmed: whether a Playwright version newer than
  what headed the page at fetch time has since shipped — that needs a fresh fetch, not a deeper
  read of the same one (to verify against the live page close to when this specialist runs).
- ISTQB CTFL v4.0 exact wording and Session-Based Test Management's exact charter/session/debrief
  terminology **remain unresolved after a second attempt (2026-10-30):** satisfice.com/sbtm was
  fetched directly and does not itself contain the charter/session/debrief definitions — it only
  points to a separate "Session-Based Test Management" document and a debrief-checklist page not
  fetched this round. A secondary-source search did yield a plausible charter template ("Explore
  <area> With <tools/resources> To discover <information>"), but still no primary-source confirmation
  of the 60-120 minute session-length figure. Treat both items as still open (to verify against the
  original SBTM PDF/debrief-checklist page directly).
- k6 vs Artillery and Postman/Newman's fit were not re-examined in the 2026-10-30 pass — still open
  exactly as stated above.
- No dedicated fetch was done for CLI NO_COLOR/screen-reader-terminal-output testing in the
  2026-10-30 pass either — still open exactly as stated above.

---

## 2026-10-30 — verification pass + fresh research

Scope: (1) resolve or definitively rule out every item the 2026-10-29 refresh flagged **(to
verify)** or "search summary, not fetched" where a direct fetch was actually achievable today, and
(2) one genuinely new research thread the prior pass didn't touch. Corrections to 10-29 claims are
inlined at their original location above (Sources table, Accessibility review section, Open
questions) rather than restated in full here — this section holds only what's new: the fresh-fetch
log, the new primary source, and what stayed open.

### Sources — 2026-10-30

| URL | Take |
|---|---|
| https://developers.google.com/search/blog (fetched directly, 2026 archive) | No 2026 (Jan-Oct) Search Central blog entry announces any Core Web Vitals/INP/LCP threshold change. Confirms (does not merely fail to find) that the "March 2026 INP tightened to 150ms" claim has no Google-published source. See the inline Sources-table correction above for the full write-up. |
| https://www.w3.org/WAI/standards-guidelines/wcag/ (fetched directly) | Primary confirmation: WCAG 2.2 (5 Oct 2023, updated 12 Dec 2024) is still the latest published version; WCAG 3.0 ("Silver") is only an early draft with no ship date; no WCAG 2.3 exists. Stronger source than the 2.2-quickref page the 10-29 pass used, per that pass's own open question. |
| https://owasp.org/www-project-web-security-testing-guide/ (re-fetched directly) | Primary confirmation: the project page's own "Latest Version" field reads 4.2; the page's own text says v5.0 is "currently... developing," no date given. v4.2 is confirmed current-stable, not superseded. |
| https://arxiv.org/html/2606.19544 (fetched directly, primary source — this is the new, load-bearing find) | **"Kappa deflation" in LLM-as-judge evaluation.** Exact-match agreement between an LLM judge and human labels systematically overstates reliability because it doesn't correct for chance agreement; the paper measures the gap as Cohen's κ below exact-match by **33.8-41.3 percentage points across 21 judges on MT-Bench** (cohort mean 38.6pp; smaller but still present on JudgeBench, 23.7pp, and RewardBench, 10.2pp). Concrete example cited: a judge reporting "85% agreement" on MT-Bench's balanced 3-way A/B/Tie label set actually sits at κ≈0.48 once chance-corrected; Gemini 3.1 Pro specifically: exact-match 0.849, κ 0.511. The paper's own **Minimum Viable Validation Protocol** for calibrating a judge before trusting it: (1) report Cohen's κ or Krippendorff's α alongside any exact-match number — κ/α is the headline reliability figure, exact-match is not; (2) measure position bias directly via paired AB+BA evaluations, reporting \|P(A wins) − 0.5\|, with a stated bias threshold of **<0.10**; (3) run at least 3 independent replicates at temperature 0 before trusting a single score; (4) validate on at least 2 benchmarks with different label structures, since a balanced label set (high chance agreement) deflates κ far more than an imbalanced one. **This is a concrete, citable, numbers-attached answer to the "LLM-judge calibration rubric" the 2026-10-29 section flagged as vendor-blog-sourced and unverified** — the qualitative pattern that section already captured (validate before trusting, re-run on judge-model swap) holds, and now has a primary-source protocol and numbers to cite instead of search-summary figures. |
| https://deepeval.com/docs/metrics-llm-evals (fetched directly) | Confirms, from DeepEval's own docs (not a search summary): G-Eval is described in DeepEval's own words as using "LLM-as-a-judge with chain-of-thoughts (CoT) to evaluate LLM outputs," configured via free-text `criteria` or explicit `evaluation_steps`, with an optional `rubric` to bound scores and `strict_mode` for binary pass/fail. The docs themselves flag it as **NOT deterministic** and point to `DAGMetric` when deterministic grading is needed instead — direct confirmation of the "deterministic checks first, judge last" pattern already in the 10-29 AI-agent-era section, now from the tool's own docs rather than a comparison blog. |
| https://www.promptfoo.dev/docs/red-team/ (fetched directly) | **Partially confirmed, partially not.** Confirmed by exact name from the page: `Broken object-level authorization (BOLA)` and `Broken function-level authorization (BFLA)` plugins, plus a "harmful content" plugin and a "competitor endorsement" plugin; "excessive agency/overreliance" is confirmed as a named vulnerability category Promptfoo tests for. **Not confirmed from this specific page**: prompt-injection and jailbreak as named plugin identifiers, a PII-leak plugin by name, and whether a failed assertion returns a non-zero exit code for CI gating — the page discusses these as threat categories/CI monitoring in prose but doesn't name the exact plugin IDs or state the exit-code behavior. Downgrade the 10-29 claim from "confirmed plugin list" to "partially confirmed by name, rest plausible but needs the Quickstart/plugins reference page specifically." |
| https://api.npmjs.org/downloads/point/last-week/@playwright/mcp and /playwright (fetched directly, npm registry API — primary source, not a vendor estimate) | **New data point, not in the 10-29 pass.** For the week 2026-10-23 to 2026-10-29: core `playwright` package = **154,480,826** weekly downloads; the official `@playwright/mcp` server package = **8,572,341** weekly downloads. This is a hard, primary-source adoption number for the Playwright MCP server specifically (the 10-29 section only asserted qualitatively that Playwright "bundles" an MCP server from v1.62+) — roughly one `@playwright/mcp` install for every ~18 core-Playwright downloads that week, i.e. MCP-based usage is already a meaningful, not marginal, fraction of the Playwright install base. Treat the ratio as a single-week snapshot, not a trend line — no historical series was pulled. |
| search summary, RAG/retrieval-pipeline evaluation practice 2026 (multiple vendor blogs — premai.io, getmaxim.ai, futureagi.com, adaline.ai; not directly fetched, consistent across sources so reported as practitioner consensus) | **New research thread, requested fresh angle.** Current practice evaluates RAG pipelines as two separable questions rather than one blended score: (1) **retrieval quality** — Context Precision (are the top-ranked chunks actually the relevant ones) and Context Recall (did retrieval surface everything needed), operationalized as Precision@K / Recall@K / MRR against a labeled query-to-relevant-chunk test set; a hybrid retriever (dense + BM25 + re-ranker) is repeatedly cited as more tolerant of imperfect chunking than pure dense retrieval alone; and (2) **generation quality given that retrieval** — faithfulness/groundedness (does the answer only claim what the retrieved context supports), answer relevance, and hallucination rate, often framed as the "RAG triad" (groundedness, context relevance, answer relevance). Process consensus: build a labeled, versioned test set of query → expected-relevant-chunks pairs, run both evaluation layers in CI on every change that touches retrieval/chunking/prompt, and monitor retrieval quality in production separately from generation quality, because a change can silently regress one while the other looks fine. Tooling note (lower confidence, vendor-sourced): Ragas has the broadest RAG-specific metric library but a flagged fading maintenance signal as of mid-2026; DeepEval is the repeated pick for CI gating since it runs as pytest-style assertions; this slots directly under this project's existing "Golden-set regression eval" row in the AI-agent-era testing table — a RAG feature's golden set should carry retrieval-layer labels (expected chunk IDs), not only expected final answers, or a retrieval regression hides behind an unchanged final-answer score. |

### What stayed open after this pass

ISTQB CTFL v4.0 exact wording, SBTM's exact 60-120-minute session-length figure, k6-vs-Artillery,
Postman/Newman's fit, and CLI NO_COLOR/screen-reader-terminal testing were not resolved this round
(see the corresponding Open-questions entries above, now marked where a second attempt was made and
still came up short). Nothing in this pass found evidence contradicting the 2026-10-29 guidance on
any of these — they remain open for lack of a fetchable primary source, not because something
fetched cast doubt on them.

### Distilled-checklist-relevant additions from this pass

- Item 13 (AI/LLM feature golden-set regression) should also require, **when the project has a RAG
  component specifically**: retrieval-layer labels (expected relevant chunk IDs, not only expected
  final answers) in the golden set, and Context Precision/Recall or Precision@K/Recall@K tracked as
  their own sub-metric separate from generation-quality sub-metrics — a retrieval regression can hide
  behind an unchanged final-answer score if only the answer is graded.
- Item 13's judge-calibration requirement now has a concrete, citable bar instead of a vague
  "calibrated against human labels": report Cohen's κ (not raw exact-match agreement) between judge
  and human labels, treat κ as the real reliability number, and check position bias via paired AB+BA
  runs with a <0.10 bias threshold, per arXiv:2606.19544's Minimum Viable Validation Protocol — raw
  "85% agreement" claims should be read with suspicion until the chance-corrected number is produced.
- Performance REQUIRED RUN can now cite, when relevant to an agent-tooling decision rather than to
  the product's own performance: Playwright's MCP server (`@playwright/mcp`) is confirmed at
  8.57M weekly npm downloads against 154.5M for core Playwright (week of 2026-10-23, npm registry
  API) — meaningful real-world adoption, not an experimental feature nobody uses, supporting the
  10-29 section's recommendation to prefer aria-ref/MCP-based element addressing for agent-authored
  Playwright suites.

---

## 2026-10-31, later pass (WebSearch landscape check, WCAG 2.2 for a marketing page)

Weaker-confidence pass (WebSearch summaries, no direct W3C fetch this pass) ahead of a self-QA pass on the
Marrow combined demo.

- **Sources disagree on how many success criteria WCAG 2.2 added (six vs. nine, with 4.1.1 Parsing removed)** —
  flagged explicitly rather than quoting either number as settled; the W3C spec itself is the only source to
  trust for an exact count, not a summarized guide.
- **Workflow convergence, matches this board's own existing practice:** automated scan first, then manual keyboard
  navigation, focus-visibility, target-size (44px comfortable / 24px WCAG floor, matching the figure already used
  elsewhere in this project's web-specialist references), form labeling, and alt text, finishing with a screen
  reader pass — no new technique found, this corroborates the existing order rather than changing it.
- **One unverified statistic, explicitly not to cite:** a "56.1 average detectable errors per page, 2026, +10.1%
  YoY" figure traces to a blog summarizing WebAIM's Million report, not WebAIM directly — do not quote this number
  in a client-facing finding without pulling the original WebAIM Million page.
- **Action for the Marrow combined demo specifically:** it has not yet had an automated scan or a keyboard/
  screen-reader pass run against it this session (static source review only) — naming this explicitly as an
  unverified-claim gap, per this board's own "say so explicitly rather than reporting success" rule, rather than
  reporting the merge as accessibility-checked when it has not been.
