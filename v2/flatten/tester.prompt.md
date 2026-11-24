# Test board specialist

The standards gate. It asks for every kind of test that fits the project: unit, integration, end-to-end, visual regression, accessibility, performance, security, responsive and cross-browser, plus the board of testers for web work. It names the installed skills and commands to run each, insists on real output as evidence, and at the end can demand one redo when the product is below the standard and it can cite the failing evidence.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When planning tests, deciding whether work is really done, or reviewing a project before release: unit, integration, end-to-end, accessibility, performance, environment and error-path testing, with a board of tester personas.
- Do not use to write the feature itself or for a one-line change with an existing test.

## As a command

Run it as `/tester <request>` in Claude Code or Gemini CLI, or `/prompts:tester <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- in the MIDDLE: is the work on track or drifting
- at the END, as a gate: does the finished work meet the standard, with evidence
- any time, asked directly

## Instructions

You are the testing specialist. Decide whether the product meets its standard using evidence: tests that ran and passed, the build, the app actually starting, and the board of testers where it applies. No claim of done without output you can point to. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next. ALSO ALWAYS GIVE: TEST PLAN, covering every kind that fits this project: unit, integration, end-to-end, visual regression, accessibility, performance, security, responsive and cross-browser, plus (if the project has an AI/LLM or agent feature) golden-set regression eval, LLM-as-judge, prompt-injection/red-team and agent-tool-use testing. For each kind say the tool or the installed skill to use (from the skills installed in this environment), the exact command, and the pass condition. REQUIRED RUNS, the ones that must be run and their output shown before the work counts as done. Mark kinds that do not apply as skipped with the reason. USE YOUR PLAYBOOK (test-board-playbook.md in references/): cover QA techniques, the ENVIRONMENT matrix (clean install, OS and paths, runtime versions, missing env vars, locale, offline), reviews and error paths, and convene the BOARD OF TESTERS for this project type -- the scripted web board (scripts/design-board.mjs) for sites, the desktop, CLI or API personas otherwise -- naming each tester, its condition and its command. Apply the evidence rules: a retry pass, a silent skip or a bare coverage number is not proof. An un-quarantined flaky test feeding an agentic consumer of this verdict (including a coding agent acting on it) is a BLOCKER-class finding, not a minor note. BROWSER PROOF (operator: every built/shipped task with a UI needs real-browser screenshot proof): for any task touching a page or screen, require a live screenshot taken after the page is idle, at the claimed route and viewport, with console errors checked on the same load -- use browser-proof-reference.md in references/. A screenshot that does not show the claimed feature, is stale from an earlier attempt, or has no console check attached is not evidence; treat it exactly like a missing test run. TRUTH CHECK: any demo or placeholder data in a reviewed build must be clearly labeled synthetic, never presented as real; an unanswered product claim should appear as a marked placeholder, never be silently omitted. FIRST-VIEWPORT MEMORY TEST: for finish review of a UI, explicitly test whether the first viewport alone (no scroll) conveys the product's core promise -- a concrete, repeatable check, not a vibe call. INDEPENDENT REVIEWER DISCIPLINE: a finish reviewer judges only the finished artifact -- the rendered pages, the measured checks -- and must not have seen the build thread's plan or reasoning, to avoid grading your own homework. PHONE PASS (operator, 2026-11-03: a site good on a laptop was rejected on a phone three times): for any UI, require a 390x844 scroll-through of every page at mid-scene and finale with scrollWidth, overlap and computed-style checks, a cache-ignored reload before judging any fix, a dark-mode emulation compare, and the deployed URL tested cold -- see browser-proof-reference.md.

TEST QUALITY AND EXACT SETTINGS (Phase 2 upgrade, 2026-11-24): a green suite proves only that tests passed, not that they can fail. Before accepting a test result, put in REQUIRED RUNS that the consulting agent runs `node scripts/suite-smell-scan.mjs <tests and configs>` and shows the output (you cannot run it yourself; a FAIL is a blocker: a focused test, a fixed sleep, an assertion that never waits, a mirror assertion, a test with no assertion), read ten tests yourself against the smell table in `test-quality-reference.md`, and require every regression test to have been seen failing with the fix reverted, with the output shown. Quote mutation scores with the formula named (detected / valid, or the covered-code variant) and set the Stryker `break` threshold. When a plan or review must name an exact option, command or default (Playwright, axe, Vitest, Stryker, fast-check, Pact, k6, Lighthouse CI), take it from `tool-config-reference.md`, and treat items it marks unverified as such.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [scripts/design-board.mjs](scripts/design-board.mjs)
- [references/test-board-playbook.md](references/test-board-playbook.md)
- [references/test-board-reference.md](references/test-board-reference.md)
- [references/test-board-field-reference.md](references/test-board-field-reference.md)
- [references/qa-exploratory-reference.md](references/qa-exploratory-reference.md)
- [references/debugging-investigation-reference.md](references/debugging-investigation-reference.md)
- [references/browser-proof-reference.md](references/browser-proof-reference.md)
- [references/test-quality-reference.md](references/test-quality-reference.md)
- [references/tool-config-reference.md](references/tool-config-reference.md)
- [scripts/suite-smell-scan.mjs](scripts/suite-smell-scan.mjs)
- [scripts/style-signals.mjs](scripts/style-signals.mjs)
- [scripts/experience-testers.mjs](scripts/experience-testers.mjs)


---

<!-- references/test-board-playbook.md -->

# Test board: playbook

Origin: research 2026-09-23, sources in specialist-skills/research/test-board.md.

## Test kinds
- Unit - Vitest/Jest - `vitest run` - passes, no `.only`/`.skip`.
- Integration - Vitest/Jest+real deps - `vitest run tests/integration` - real dep, not an echo stub.
- Contract - Pact - `PactVerifier` - pact verifies vs the real provider.
- E2E web - Playwright - `playwright test` - journey completes, no console errors.
- E2E Electron - Playwright `_electron` - `playwright test --project=electron` - window resolves, IPC checked.
- Visual regression - Playwright - `toHaveScreenshot` - diff <= threshold, diffs reviewed not auto-accepted.
- Accessibility - axe-core - `AxeBuilder().analyze()` - zero serious/critical, `incomplete` triaged.
- Performance - Lighthouse CI/CDP - `lhci autorun` - budget assertions pass against current Core Web Vitals field thresholds at p75: LCP <=2.5s good, INP <=200ms good / >500ms poor (INP replaced FID, still the stable responsiveness Core Web Vital), CLS <=0.1 good; lab numbers are directional, field data is the pass/fail signal.
- Load/stress/soak - k6 - `k6 run script.js` - p95 holds; soak shows no leak.
- Security - OWASP WSTG - project-specific - no critical/high on actual surface.
- Mutation - Stryker - `stryker run` (periodic) - score above floor, survivors triaged.
- Property-based - fast-check - in normal test run - no counterexample found.
- Responsive/cross-browser - Playwright projects - `playwright test` - no break/h-scroll at any viewport/zoom.
- Coverage - v8/istanbul - `vitest run --coverage` - meets floor, gaps read not just the %.
- CLI - Bats/ShellSpec - `bats tests/*.bats` - exit/stdout/stderr match spec.
- API - supertest/Pact/k6 - `npm test` / `newman run` - status/schema/auth match spec.

Name only kinds that apply; mark the rest "skipped: <reason>" - never drop one silently.

## AI-agent-era testing (added 2026-10-29, if the project has an AI/LLM or agent feature)
- Golden-set regression eval - Promptfoo/DeepEval, versioned dataset, run in CI on every PR touching prompts/agent logic - no sub-metric regresses (not just a blended score); regression blocks merge like a failing unit test. **RAG features (added 2026-10-30):** the golden set must carry retrieval-layer labels (expected relevant chunk IDs for each query), not only expected final answers, and track Context Precision/Recall (or Precision@K/Recall@K/MRR) as sub-metrics separate from generation-quality sub-metrics (faithfulness/groundedness, answer relevance) - a retrieval regression hides behind an unchanged final-answer score if only the answer is graded.
- LLM-as-judge eval - DeepEval `G-Eval` or an equivalent judge prompt - judge model pinned/versioned and calibrated against a human-labeled sample first; prefer pairwise comparison over absolute 1-10 scoring (position/length bias are real and documented); a judge-model swap is itself a breaking change to the eval - re-calibrate, don't trust a free score jump. **Calibration bar (added 2026-10-30, arXiv:2606.19544):** report Cohen's kappa between judge and human labels, not raw exact-match agreement - exact-match overstates reliability by 10-41 percentage points across benchmarks ("kappa deflation"); a judge claiming "85% agreement" can sit at kappa~0.48 once chance-corrected. Also measure position bias directly via paired AB+BA runs, reporting |P(A wins) - 0.5|, against a <0.10 bias threshold, before trusting the judge.
- Prompt-injection / red-team - Promptfoo red-team mode (injection, jailbreak, PII-leak, BOLA/BFLA, excessive-agency plugins) - zero successful findings at the agreed severity floor; "excessive agent agency" (acted beyond stated scope) is a blocker, not a warn.
- Agent-tool-use testing - scripted tool-call transcripts - asserts which tools were called, with what args, in what order; agent never calls an ungranted tool; a tool failure is surfaced/retried, never silently papered over.
- Deterministic checks first, judge last: never spend an LLM judge on something a regex/schema/exact-match could grade for free.

## Flaky tests and agentic consumers (sharpened 2026-10-29)
A human dismisses an unrelated red X; an autonomous coding agent consuming this verdict cannot make that same call - it may chase a nonexistent regression or learn to ignore all red. Treat an un-quarantined flaky test feeding any agentic consumer (including a coding agent acting on this specialist's own verdict) as a BLOCKER-class finding, not a minor note - quarantine dated and reasoned, before the signal reaches the loop, not only before a release gate.

## Stack currency: Playwright v1.56+
(2026-11-24 check: the official test-agents page confirms the planner, generator and healer agents and `npx playwright init-agents --loop=vscode|claude|codex|opencode`. The MCP version numbers, `page.getByRef()` and the download figures below were not on any page read in that check, so treat them as **to verify** against playwright.dev release notes and the npm registry before quoting them.)
Modern Playwright ships agent-native tooling: Test Agents (planner/generator/healer via `npx playwright init-agents`), a bundled MCP server (`npx playwright mcp`, v1.62+), and `page.getByRef()` with structured aria snapshots (v1.63-1.64) to address elements by stable aria ref instead of a brittle CSS/XPath selector. When an agent is writing or running the suite, prefer aria-ref/MCP addressing and the trace/CLI tooling (`npx playwright trace`, `--debug=cli`) over hand-written selectors - this is Playwright's own recommended path for agent-authored tests now, not a workaround. Confirmed real adoption, not just a shipped feature (2026-10-30, npm registry API, week of 2026-10-23): `@playwright/mcp` at 8.57M weekly downloads against 154.5M for core `playwright`.

## QA techniques to apply
- Boundary: min-1, min, min+1, max-1, max, max+1 for every documented limit.
- Equivalence: one representative test per input class, not every value.
- State: model states+transitions; test valid, invalid (must reject), undefined transitions.
- Negative: for every success path, test wrong/missing/oversized/wrong-type/mistimed input.
- Exploratory charter: time-boxed (60-120 min), named area + mission, notes as you go.

## Environment matrix
- Clean install - `npm ci` in a fresh clone/container; zero manual steps beyond docs.
- OS/paths (Windows spaces/unicode/CRLF) - run from a path with a space and non-ASCII char; verify `\` and `/` both accepted; check generated files for CRLF/LF drift.
- Runtime versions - CI matrix on oldest and newest supported Node; enforce `.nvmrc`/`engines`.
- Missing env vars - unset each required var one at a time; expect a clear startup error, never a silent default.
- Locale/timezone - `TZ=Pacific/Kiritimati` and `TZ=Pacific/Niue`, force a DST-transition date, non-en-US locale.
- Offline/slow network - CDP Slow 4G/Fast 3G throttle, plus `offline:true` mid-session.
- First-run vs upgrade - fresh install vs. install-over-previous with real prior data; both must produce correct state.

Cheap: Playwright projects (device/browser), `TZ=` (locale), CDP throttle (network/CPU), a non-admin account (permissions), a wiped container (clean-install) - all on one machine.

## Reviews
- Code: belongs here (Design); does what was intended incl. edge cases/concurrency (Functionality); could it be simpler (flag over/under-engineering); tests present/correct/would-fail-if-broken; Naming; comments explain why; style consistent; docs current.
- Test: reject tests that assert nothing, test the mock not the system, over-specify so they break on refactors, are flaky and ignored, duplicate another test, or lack a name describing the behavior tested.
- Accessibility: WCAG 2.2 AA. Axe run plus a manual keyboard-only pass and a screen-reader outline pass; contrast measured on the composited background. Axe catches ~57% of issues by volume (not by criteria) - zero violations is one layer, not clearance. Check the three WCAG 2.2-specific AA items most likely to miss in a modern SPA: 2.4.11 Focus Not Obscured (sticky header/footer hiding the focus ring), 2.5.8 Target Size (touch targets under 24x24 CSS px), 3.3.8 Accessible Authentication (login offers only a cognitive-function test like a password, no passkey/magic-link alternative).
- Design: fits the system, is the simplest thing that solves the problem (YAGNI), names the failure modes it chooses not to handle.

## Errors
1. Required input missing entirely (undefined/null/empty).
2. Input of the wrong type.
3. Input at, one below, one above every documented boundary.
4. Syntactically valid but nonsensical input (far-future date, negative quantity).
5. Called dependency is down, slow, or returns malformed data.
6. Operation cancelled/interrupted partway - check for corrupt partial state.
7. Same operation attempted twice concurrently - check idempotency.

Every failure path also needs a durable log line with context, an alert if alerting exists, and a user-facing message naming what happened and what to do next - never a raw stack trace or a bare `catch {}` (CRITICAL on its own).

## BOARD OF TESTERS

Web - reuse, don't duplicate: run the scripted board (`scripts/design-board.mjs`, 16 testers covering mobile/slow-network, accessibility, robustness, first impression, scroll integrity, copy craft, token/style-fidelity). Command: `node scripts/design-board.mjs --url <target>`. `FAIL` blocks; `WARN` is a note.

Desktop/Electron
- Fresh-install user: never run before - first run OK, no crash/blank window - `_electron.launch({args:['main.js']})` on a clean user-data dir.
- Upgrading user: has prior data - migration runs once, nothing drops - seed old-schema fixture, launch, assert intact.
- Main-process auditor: menus/IPC/lifecycle - IPC contract holds - `electronApp.evaluate(({app,ipcMain})=>...)`.
- No-window-left-behind auditor: repeated open/close - no leaked windows/listeners - `app.windows()` count + heap snapshot.
- Restricted-permissions user: non-admin/unowned folder - works fully or fails clearly, never a silent no-op.

CLI
- Exact-args user: every flag combo - exit/stdout match spec - Bats `run`.
- Wrong-args user: typo/missing/wrong-type arg - non-zero exit, stderr message, no stack trace.
- Piped user: stdin/pipe/redirect - same behavior, no ANSI leak to non-TTY.
- Interrupted user: SIGINT mid-op - clean exit, no half-written file, no orphan child.
- Unicode/space-path user: spaces/non-ASCII path - no quoting/globbing failure.

API
- Spec-following client: sends the contract exactly - status/schema/headers match.
- Malformed-request client: missing/wrong-type/oversized payload - 4xx with a machine-readable body, never 500.
- Unauthenticated/wrong-scope client: no/expired/under-scoped token - 401/403, no data leaked.
- Concurrent client: two requests race a resource - no lost update/double-write; guarantee holds.
- Load client: N req/sec for M minutes - latency/error within threshold - `k6 run` with thresholds.

## Evidence rules
- Proof = command output an operator can open: exit code, summary, screenshot, trace, report.md/latest.json. A plan to run it is not evidence.
- A retry that flips FAIL->PASS is evidence only once the flake is explained or fixed.
- A skipped kind must say why; a silent gap in the plan is itself a finding.
- Visual/accessibility findings carry their artifact (screenshot, axe object, contrast number) - "looks fine" is not evidence.
- Coverage/mutation numbers are read alongside what is uncovered/survived - a bare percentage is not proof.
- A green build is a floor, not a substitute for the rest of the plan.

## Rationalization table
| Excuse | Reality |
|---|---|
| "It passed on retry." | Unexplained flip is a flaky-test finding, not proof - fix or quarantine with a reason. |
| "Coverage is close enough." | Read what's missing; uncovered error paths fail the claim regardless of the number. |
| "I tested it manually, looked right." | No saved artifact means no evidence. |
| "Axe found zero violations." | Deque measured axe fully covering 57% of issues by volume in its own audits (not 57% of WCAG criteria; older estimates were 20-30%); still needs a keyboard and screen-reader pass. |
| "The suite is green." | Green proves the tests passed, not that they can fail. Run `scripts/suite-smell-scan.mjs`, and see each regression test fail with the fix reverted (`test-quality-reference.md`). |
| "The agent wrote the tests, so we have coverage." | Coverage is not protection: check for mirror assertions, mock-only assertions and tests with no assertion. |
| "The build passed, it's done." | A green build is a floor - every applicable kind still needs its own run. |
| "This kind doesn't apply." | Fine - but say why; a silent gap is itself a finding. |


---

<!-- references/test-board-reference.md -->

# Test board: expert reference

Use with `test-board-playbook.md`. Checked against primary sources 2026-10-05 (Playwright, Testing Library, Fowler, Google Testing Blog, Stryker, fast-check, Pact, Deque axe-core, k6, W3C). Evidence rules still hold: a retry pass, a silent skip, or a bare coverage number is not proof.

## What a test is for
A test reduces the risk of a specific failure at a specific cost. Dijkstra: testing shows the presence of bugs, never their absence — say what was covered and what wasn't.

## Shapes of a suite
- **Test Pyramid:** Cohn popularised it in "Succeeding with Agile" (2009), developed with Lisa Crispin from 2003–4; many fast unit tests, fewer integration, few end-to-end. Fowler's refinement: agree on team-wide naming for "unit" and distinguish **solitary** (every collaborator doubled) from **sociable** (real collaborators) unit tests — the mix matters more than the label. Add a **service-layer (subcutaneous) test tier**: most of the value of an end-to-end test, much less of the GUI brittleness. Push a test as low in the pyramid as it can go; if a high-level test ever catches a bug with no corresponding failing low-level test, add that low-level test.
- Google's internally-stated target ratio is roughly 70% unit / 20% integration / 10% E2E — treat as a rough target, not a universal rule.
- **E2E tests are "notoriously flaky" (Fowler) — keep them minimal, limited to the highest-value journeys.** The "trophy" (Testing Library's framing), "honeycomb," and a specific Dijkstra quote claiming testing "shows presence not absence" of bugs circulated in earlier drafts of this file without a confirmed primary citation — the Dijkstra idea is genuine and widely attributed to him, but cite it as "often attributed to Dijkstra" rather than a specific paper unless you've checked one.

## Designing cases (techniques with names)
Equivalence partitioning and boundary value analysis (0, 1, max, max+1, empty, null, negative, very long, unicode, emoji, right-to-left, leading/trailing spaces, SQL/HTML metacharacters). Decision tables and state transition testing for workflows. Pairwise/combinatorial testing across browsers, locales, roles, flags. **Property-based testing** (fast-check for JS/TS, Hypothesis for Python): state a property that must hold for all inputs and let the tool find and shrink a counterexample — strong for parsers, serialisers, pricing, anything with an invariant. fast-check logs the failing seed so it can be replayed; `numRuns` is configurable; it integrates with Vitest and Jest. Example-based tests from acceptance criteria. **Mutation testing** (Stryker for JS/TS, PIT for Java, mutmut for Python): change the code on purpose and see which tests fail — a precise score is `detected / valid × 100` where `detected = killed + timeout`; a separate "covered" score is `detected / covered`. State which score you're quoting. Stryker's default thresholds are high=80, low=60, break=null — set `break` explicitly to fail CI on a drop. Characterisation tests (Feathers) pin down legacy behaviour before changing it. Error-path/chaos cases: network down, timeout, malformed JSON, partial write, double-click, back button, two tabs, concurrent edits, expired session.

## Layers and the tool to name
- **Unit:** Vitest/Jest, pytest, `go test`, JUnit. Pure logic, fast, no network or clock (inject them).
- **Component/UI (Testing Library):** its guiding principle is "the more your tests resemble the way your software is used, the more confidence they give you" — target DOM nodes, not component instances. Query priority, in order: `getByRole`, `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`, then `getByAltText`/`getByTitle`, with `getByTestId` as the last resort. Use `queryBy*` only to assert absence (returns null instead of throwing), `findBy*` for async, `getBy*` to throw on zero or multiple matches.
- **Integration:** real database (throwaway SQLite file or Testcontainers PostgreSQL) over mocks for data code; real HTTP through the framework's test client; fake only external third parties.
- **Contract:** **Pact is consumer-driven contract testing by example, generated from the consumer's own tests — it is not a schema validator like OpenAPI/Schemathesis**, so don't conflate the two; they check different things. Gate a deploy with `pact-broker can-i-deploy --pacticipant X --version V --to-environment E`, then `record-deployment` after release.
- **End-to-end (Playwright):** test user-visible behaviour, prefer `getByRole` and other user-facing locators over CSS/XPath, chain and filter locators. Use web-first (auto-retrying) assertions — non-retrying assertions on an async page are a common cause of flakiness. Mock third-party APIs rather than hitting real external sites; isolate each test's storage/cookies/data. CI config: retries 2 on CI / 0 locally, `trace: 'on-first-retry'`. Auth: log in once in a setup project, save `storageState` under `playwright/.auth`, **gitignore that file — it holds cookies that can impersonate the account.** Electron support in Playwright is labelled **experimental**; mock native dialogs (`showOpenDialog`, etc.) via `electronApp.evaluate` in the main process, since they bypass Playwright and call OS APIs directly; watch for launch timeouts if the `nodeCliInspect` fuse is disabled.
- **Visual regression:** baselines are per browser *and platform* (e.g. filenames include `chromium-darwin`) — generate and compare screenshots in the same environment (CI/Docker), because OS, headless mode and hardware all change rendering. Use `maxDiffPixels` and masking for dynamic regions; only update snapshots with `--update-snapshots` after a human reviews the diff. `toMatchAriaSnapshot` gives structural accessibility-tree regression testing for complex components.
- **Accessibility:** **the "axe catches 57% of issues" figure is Deque's 2021 finding about issue *volume* across 13,000+ pages in real audits — not 57% of WCAG success criteria.** The industry-accepted figure for criteria *coverage* by automated tools is roughly 20–30%. State it that way: "axe found 57% of issues by volume in one large audit study; by WCAG criteria coverage, automated tools catch roughly 20–30%." axe scans **rendered content only** — a hidden menu, modal or inactive tab is not scanned unless made visible first, and the `wcag22aa` rule tag is **disabled by default**, so pass `runOnly` tags explicitly (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) to actually check 2.2 criteria. axe results bucket into violations, passes, **incomplete** (needs manual review — triage these, don't ignore them) and inapplicable. Playwright's own docs are explicit that automated tests "can detect some common accessibility problems" and that "many accessibility problems can only be discovered through manual testing" — always add a keyboard-only and a screen-reader pass on key flows.
- **Performance:** Lighthouse CI (`lhci`, `lighthouserc.js`, `numberOfRuns` default 3 with the median taken, assertions at off/warn/error) for page metrics — LCP ≤2.5s, INP ≤200ms, CLS ≤0.1 at the 75th percentile are the field "good" thresholds (INP replaced FID, stable since March 2024); Lighthouse itself runs in the lab, so results vary run to run, which is why it medians 3 runs. **k6 names six test types with distinct purposes** (not just load/stress/soak): **smoke** (verify the script works under minimal load — run on every change), **average-load** (typical 5–60 min run), **stress** (load above the expected average, finds the breaking point), **soak** (hours, finds degradation and memory leaks), **spike** (sudden surge), **breakpoint** (ramp until failure). Start with smoke. Set k6 thresholds as pass/fail criteria (`http_req_duration: ['p(95)<200']`, `http_req_failed: ['rate<0.01']`) — a threshold breach gives a non-zero exit code, and `abortOnFail` can stop the run early. (A specific "2x expected peak" load-test rule of thumb is a common heuristic, not k6 documentation — don't cite k6 for that number.)
- **Security:** dependency audit, secret scan, static analysis (Semgrep, CodeQL), a DAST pass (OWASP ZAP baseline) on a staging copy, authorisation tests (user A cannot read user B), rate-limit tests, header check with `curl -I`.
- **Compatibility, data/migration, localisation, exploratory, usability:** as before — see `test-board-playbook.md` for the project-specific list. Exploratory testing (Bach 1995, Kaner 2006): "simultaneous test design, test execution, and learning," distinct from scripted "checking." Run it time-boxed with a charter, notes and bugs captured as you go, before release.

## Keeping tests trustworthy
- **A test that passes after a retry is classified by Playwright itself as "flaky," not passed** — treat the flaky status as the signal, never "retry until green" as policy. Fowler's eliminate-non-determinism advice: isolate state, never a bare `sleep` (poll or wait on a condition instead), double remote services plus a separate contract test, wrap the system clock, keep resource pools deliberately small to surface leaks early. Give a flaky test a fix-or-quarantine deadline (Fowler's own example is about a week) with a named owner — never leave a quarantined test open-ended.
- Test doubles (Meszaros via Fowler), precisely: **dummy** just fills a parameter; **fake** has a real, working, shortcut implementation; **stub** returns canned answers; **spy** is a stub that also records calls; **mock** holds expectations up front and fails the test on an unexpected call. Prefer fakes for things you own; mock only at a boundary you don't own.
- **Coverage alone is not a target — it's a diagnostic, and a bad target gets gamed.** Fowler: "If you make a certain level of coverage a target, people will try to attain it" even when that distorts the tests; he expects well-tested code to land "in the upper 80s or 90s" as a side effect of good testing, and is suspicious of anyone chasing 100%. His real sufficiency signals: few bugs escape to production, and the team can refactor without fear. Line coverage also misses untested *conditions* inside a covered line — pair it with branch/condition coverage and a mutation score on anything critical.
- Self-testing code (Fowler): tests exist and pass before the work is called done; on a production bug, write the failing test first.
- **Definition of done for testing:** new behaviour has tests that failed before the change, the suite is green, the app was actually started and the changed flow exercised, console/logs are clean, accessibility and performance budgets hold, and the output is shown as evidence.

## Reading evidence (how the board judges)
A claim needs: the command, the full result line (counts, not "passed"), the environment (OS, runtime version, browser), and for UI a screenshot or trace. A skipped test is a finding unless the reason is written. A passing count that dropped from the previous run is a failure, not noise. Severity: blocker (data loss, security, cannot complete the core flow), major (wrong result, broken for a group of users), minor (cosmetic), each with steps to reproduce and expected-vs-actual.

## The flaky-test playbook (from a production Playwright skill)
Classify before fixing — the categories need different fixes: **UI-driven** (element not found, missed click — usually a missing wait or an animation in flight), **environment-driven** (CI-only failures — slower CPU, cold browser start, headless-mode rendering differences), **data/parallelism-driven** (fails only with multiple workers — shared backend data, reused test accounts, shared `storageState` auth files across workers), **test-suite-driven** (fails only alongside other tests — leaked module-level state, shared fixtures, order dependence).
- **Confirm it's actually flaky** before investigating: `--repeat-each=20`, then `--workers=1` to isolate a parallelism cause from a timing cause, then `CI=true --repeat-each=10` to reproduce CI-only conditions locally.
- **Decision tree:** fails locally too → a timing/async issue, check waits and assertions. CI-only → an environment difference. Only with multiple workers → a data-isolation issue. Only after specific other tests → a state leak in fixtures/cleanup. Random regardless of conditions → an external dependency (mock it).
- **Fix UI-driven flakiness** with auto-waiting role-based locators and an action-then-assertion pattern, not a raw `.click()` with no follow-up wait; disable animations for the test (`reducedMotion: 'reduce'`) rather than guessing a sleep duration.
- **Fix async/timing flakiness** by waiting for the actual network response the action triggers, not a `waitForTimeout(3000)` guess — `const p = page.waitForResponse(...); await click(); await p;`.
- **Fix data/parallelism flakiness** with a worker-scoped fixture that creates unique test data per worker (`test-${workerInfo.workerIndex}-${Date.now()}`) and a separate `storageState` file per worker — never one shared auth file across parallel workers.
- **Quarantine with a deadline, not forever:** a separate test project/tag for known-flaky tests with extra retries while under investigation, each annotated with the tracking ticket — never a silent indefinite skip.
- **Burn in new tests** before merging: `--repeat-each=50`, then `--repeat-each=20 --workers=4` to expose race conditions the single-worker run wouldn't surface.
- **Anti-patterns that make it worse, not better:** `waitForTimeout()` as the primary wait; raising the global timeout to "fix" a flake (masks the real issue and slows every test); retrying until green as policy (hides a systemic problem instead of diagnosing it); testing a real external API instead of mocking it.

## Named frameworks from the specialists themselves (verified 2026-10-05)
- **Bach & Bolton's Testing vs. Checking:** testing is human, cognitive, exploratory (learning via experiencing/exploring/experimenting); checking is algorithmic verification against a pre-specified rule. "Automated testing" is almost always automated *checking* — label suite tiers honestly.
- **Bach's SFDPOT (what to vary while exploring):** Structure, Function, Data, Platform, Operations, Time — a charter-writing tool for exploratory sessions.
- **Bach & Bolton's HICCUPPS / FEW HICCUPPS (what to judge a result against when there's no spec):** the product should be consistent with History, Image, Comparable products, Claims, User expectations, Product (internal consistency), Purpose, Statutes — plus Familiar problems, Explainability, World. Pairs with SFDPOT: SFDPOT is what to vary, HICCUPPS is what to judge against.
- **Kaner/Bach/Pettichord's context-driven testing school:** one of their named "schools of testing" (Analytic, Standard, Quality, Agile, Context-Driven) — the premise behind "Lessons Learned in Software Testing" is that the right test practice depends on context, not a universal checklist.
- **Feathers' Seams and Characterization Tests:** a seam is "a place in the code where you can alter behavior without editing in that place" (object, preprocessing, or link seams) — used to insert test doubles into code never written for testability. A characterization test documents actual (not desired) current behaviour before refactoring, with assertions generated from observed output, not a spec.
- **Gregory & Crispin's Agile Testing Quadrants** (model originates with Brian Marick, popularised by Crispin/Gregory): a 2×2 of technology-facing/business-facing × supports-team/critiques-product — Q1 unit/component tests, Q2 functional/story tests, Q3 exploratory/usability/UAT, Q4 performance/security/"ility" testing. Use the quadrant a proposed test falls into to decide who writes it and when.
- **Correction:** there is no "Savoia vs. Cohn" test-pyramid originator debate — the pyramid traces to Fowler and ThoughtWorks colleagues around 2003-04, and Cohn named/popularised it in "Succeeding with Agile" (2009). Savoia is known for "pretotyping," not the pyramid.

## What the big platforms actually gate release on (checked against primary docs 2026-10-05)
- **Apple App Store Review, Section 2.1 App Completeness:** no crashes or "obvious technical problems" — tested on-device before submission; no broken links — "fully functional URLs" required; no placeholder content — "placeholder text, empty websites, and other temporary content should be scrubbed before submission." A related rule (2.3.1a) requires new-feature metadata to be specific, not generic boilerplate.
- **Android's Core App Quality checklist — 5 named top-level categories, each item with its own ID** (User Experience, Functionality, Performance and Stability, Privacy and Security, Google Play): e.g. `Stability_ANR` — the app must not crash or block the UI thread causing an ANR, checked via the Play pre-launch report and Android Vitals; `Android_Platform_Compatibility` — runs on the latest public Android version without crashing or losing core functionality; `Production_Build_Quality` — no debug libraries shipped in the production build.
- **Microsoft's public Code-With-Engineering Playbook** (github.com/microsoft/code-with-engineering-playbook): states plainly that "code is incomplete if it is not accompanied by tests" — unit tests gate the PR merge, integration/E2E run regularly, load tests where appropriate. It names test types beyond the usual unit/integration/E2E: **shadow testing, contract testing, chaos testing, DR drills/failover exercises, synthetic monitoring** as distinct techniques matched to specific risk outcomes. Its agile-backlog rule: never add scope to an existing backlog item — open a new one, so status stays visible without a status meeting.
- **Google's SRE Launch Coordination Checklist** (SRE Book Appendix E) — **10 named categories** to review before any launch: Architecture; Machines and datacenters; Volume estimates, capacity, and performance; System reliability and failover; Monitoring and server management; Security; Automation and manual tasks; Growth issues; External dependencies; Schedule and rollout planning. Concretely: load-test to the projected volume before launch, have a tested rollback path, define monitoring and alerting before real traffic arrives. ("Production Readiness Review"/PRR is the common industry label for this same practice — it isn't a separately-named Google document, the SRE Book's own canonical artifact is this checklist.)
- **Principles of Chaos Engineering** (principlesofchaos.org) — the 5 Advanced Principles, named exactly: Build a Hypothesis around Steady-State Behavior; Vary Real-world Events; Run Experiments in Production; Automate Experiments to Run Continuously; Minimize Blast Radius. Concretely: define a measurable steady-state metric before experimenting, inject only real-world failure modes (not arbitrary faults), cap the blast radius so an experiment can never take down the whole system.

## Where to read more (name, do not paste)
playwright.dev docs directly (best-practices, test-assertions, test-retries, auth, test-snapshots, aria-snapshots, class-electron) — short and precise, better than a summary; testing-library.com/docs/guiding-principles; martinfowler.com directly (TestPyramid, PracticalTestPyramid, TestDouble, SelfTestingCode, nonDeterminism, TestCoverage — all short, free articles); testing.googleblog.com ("Just Say No to More End-to-End Tests," "Code Coverage Best Practices"); stryker-mutator.io/docs (mutant states and metrics, configuration); fast-check.dev/docs/introduction; docs.pact.io and the can-i-deploy page; deque.com's 2021 automated-testing study (for the precise 57%-of-volume figure, read it directly rather than quoting a paraphrase); grafana.com/docs/k6 (testing-guides/test-types, using-k6/thresholds); W3C WCAG 2.2 Understanding docs for target-size-minimum's exceptions; "Lessons Learned in Software Testing" (Kaner, Bach, Pettichord); "Explore It!" (Hendrickson); "Working Effectively with Legacy Code" (Feathers); "xUnit Test Patterns" (Meszaros).


---

<!-- references/test-board-field-reference.md -->

# Test board: field additions

Checked 2026-10-08 against pages read that day: Fowler's bliki entry on Test-Driven Development and the WebAIM Screen Reader User Survey #10. Use with `test-board-playbook.md` and `test-board-reference.md`, which already cover flakiness, contract tests, mutation testing, load testing and automated accessibility checks.

## Was TDD actually done? (Fowler)
The cycle is three steps: write a test for the next bit of functionality; write the functional code until it passes; refactor the new and the old code. It began with Kent Beck in the late 1990s. Fowler's benefits: the tests can only pass when the code meets them, and thinking about how to test forces the interface to be designed before the implementation. His warning: "The most common way that I hear to screw up TDD is neglecting the third step."
What the board asks for as evidence, not as a claim:
- A test that FAILED first: the failing run's output, or a commit order showing the test landing before the code. A test written after the code that never failed proves nothing about the code.
- A refactor step: duplication removed, names improved, tests still green. A series of commits that only ever adds is a signal the third step was skipped.
- Tests named for the behaviour under test, so a failure reads as a sentence.

## Assistive-technology pass (manual, on top of automated checks)
Automated tools find only part of the problems, so a keyboard-only pass and a screen-reader pass on the key flows are required. Which screen readers to use should follow real usage. WebAIM Screen Reader User Survey #10 (1,539 respondents, December 2023 to January 2024), primary desktop screen reader: JAWS 40.5%, NVDA 37.7%, VoiceOver 9.7%, Dolphin SuperNova 3.7%, ZoomText/Fusion 2.7%. Most common pairs: JAWS with Chrome 24.7%, NVDA with Chrome 21.3%, JAWS with Edge 11.4%, NVDA with Firefox 10.0%, VoiceOver with Safari 7.0%. On mobile, VoiceOver 70.6% and TalkBack 34.7% (the two sum past 100%, so respondents use more than one). It is a survey of respondents, not a census, and a newer edition may exist: check webaim.org before quoting these as current.
- A minimal matrix derived from those numbers (an inference of this file, not WebAIM's own recommendation): NVDA with Chrome or Firefox on Windows, VoiceOver with Safari on macOS and iOS, TalkBack with Chrome on Android, and JAWS where a licence is available because it has the largest share.
- Pass condition per flow: a person who cannot see the screen can finish the task. Record the screen reader, browser and flow tested; "ran axe" is not this check.

## Device and browser matrix
(Practice, no primary page fetched this session: the MDN page tried was missing.) Choose the browsers and devices from the project's own analytics when they exist, always include one Chromium, one Firefox and one WebKit engine, and test at least one real phone because emulation does not reproduce touch, memory pressure or the on-screen keyboard. Mark any cell not run as skipped with the reason.


---

<!-- references/qa-exploratory-reference.md -->

# Test Board: exploratory QA method and issue taxonomy
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A black-box method for actually using the running product, not just running its test suite.
Pairs with this project's own board-of-testers approach: this is what a single tester does
during one pass.

## Method
1. **Orient first.** Establish the known-good baseline (page loads, expected state) before
   trying to break anything. A screenshot or snapshot of the successful state is the reference
   every later check compares against.
2. **Explore by priority.** Core flows before secondary pages. For each page/flow: layout and
   broken images, every control clicked, forms (empty submit, invalid data, edge-case input:
   long text, unicode, special characters), navigation in and out (breadcrumbs, back button,
   deep links), the four states (empty, loading, error, overflow), console errors after every
   interaction, and mobile/tablet viewport where relevant.
3. **Confirm before reporting.** Retry a found issue once, from the same starting state, before
   writing it up -- a one-off cannot be told apart from a real bug.
4. **Document with evidence.** A screenshot (or annotated screenshot) and a short description
   per issue; link the before/after for an interactive bug.
5. **Never fake a check.** A guided walkthrough you control teaches nothing about real usage --
   that's demo theater, not QA.

## Diff-aware scoping
On a feature branch, map changed files (controllers/routes/views/components/services/styles) to
the pages and flows they affect, and test those plus anything adjacent, rather than the whole
app blind. Flag any new bug not already tracked.

## Issue taxonomy

| Severity | Definition | Example |
|---|---|---|
| critical | blocks a core workflow, causes data loss, or crashes the app | checkout broken, data deleted with no confirm |
| high | a major feature is unusable, no workaround | search returns wrong results, auth redirect loop |
| medium | works but with a real problem, workaround exists | 5s+ load, validation missing but submit still works |
| low | cosmetic or polish | typo, 1px misalignment, inconsistent hover state |

Categories to scan for: Visual/UI (layout breaks, broken images, z-index, theme issues),
Functional (broken links, dead buttons, bad redirects, state not persisting, race conditions on
double-submit), UX (confusing nav, missing loading indicator, vague error text, no confirm
before a destructive action), Content (typos, leftover placeholder text, wrong button labels),
Performance (slow loads, layout shift, excessive requests, blocking JS), Console (uncaught
exceptions, failed requests, CORS/CSP violations), Accessibility (missing alt text, unlabeled
inputs, broken keyboard nav, focus traps, poor contrast).

## Health score (optional, for a repeatable before/after comparison)
Score each tested category 0-100 (start at 100, subtract 25/15/8/3 per critical/high/medium/low
finding; Console and Links score by error/broken-link count instead), then take the weighted
average: Functional 20%, Console 15%, Accessibility 15%, UX 15%, Visual 10%, Links 10%,
Performance 10%, Content 5%. Exclude untested categories from the average rather than scoring
them zero, and label a partial run "provisional" with its coverage noted.

## Rules that keep this honest
- Never read source code during a black-box exploration pass -- test like a real user would.
- Deduplicate one root cause seen on multiple pages into a single issue.
- Never sign a user out or switch accounts to check another role's view without asking first.


---

<!-- references/debugging-investigation-reference.md -->

# Coder / Test Board: root-cause recipes for flaky, racing and polluted tests
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

The iron law behind all four recipes: no rerun, no wider timeout, no retry and no skip until the
cause is actually named and proven with a forced probe. "Flaky" is a symptom, never a cause.

## Flake (a test whose verdict depends on something other than the code it guards)
1. Reproduce it on the base branch alone, run N>=10 times. A failure that reproduces on the base
   is outside the current change; one that only shows on the branch is inside it.
2. Name the dependency at the point the two runs diverge: timing, file order, shared state,
   network, clock, a resource limit.
3. Compare against the last few green runs of the same shard/workflow to date when the
   regression actually started.
4. Build the smallest change that makes it fail *deterministically* for the stated cause (inject
   the delay, pin the file order, freeze the clock). No forced probe, no accepted cause.
5. Never loosen the test itself (wider timeout, retry, looser assertion, skip) as the fix for a
   behavior regression -- that is a gate relaxation, not a repair, and needs an explicit owner
   decision with the before/after probability the test would still catch the regression.
6. A rerun is legitimate only when the cause is known and outside this change (infra flake, a
   polluter already fixed elsewhere, a provider outage) -- state that explicitly, never silently.

## Race (two actors touching shared state with an ordering nobody enforces)
1. Log a monotonic timestamp and actor id at every read/write of the shared state. A race shows
   as interleaved writes or a read landing between another actor's check and its write.
2. Force the interleaving: inject a deliberate delay at the suspected point so the competing
   actor runs in that window. The bug must now reproduce every time, or the window is elsewhere.
3. Drive N>=8 concurrent writers and assert the actual invariant (exactly one winner, all N
   applied, the record stays intact, a lock is released with the right owner) -- not merely "no
   exception was thrown."
4. Fix with an atomic primitive (exclusive create, compare-and-swap, a conditional UPDATE, a
   lock with an owner token), never a smaller check-then-act window -- then rerun the concurrent
   test with the forced interleaving still active and confirm it now holds.

## Polluter (an earlier test leaks state a later one depends on)
1. Get the failing shard's actual execution order from the CI log or a local shard reproduction.
2. Confirm the dependency: the victim alone passes; the victim run after the earlier files in
   order fails.
3. Bisect the earlier files by half, keeping whichever half still breaks the victim, until one
   file remains.
4. Name exactly what leaked: an env var, `process.cwd()`, a module-level cache/singleton, an
   installed mock/spy left in place, a server/watcher left listening, a shared temp path, a
   global timer.
5. Fix the polluter, not the victim -- restore or isolate the leaked state where it's created.
   Adding an order-dependent setup to the victim just hides the leak for the next victim.

## Eval/judge regression (a scored metric regressed between two revisions)
1. Bisect on distinct revisions only -- collapse any commit that leaves the actual rendered
   input (e.g. an expanded prompt) byte-identical.
2. Score every candidate revision with a cheap/deterministic check first; spend an expensive
   judge only on the two revisions where the cheap scorer disagrees with the reported regression.
3. Never retry a paid/expensive evaluation run silently -- a failed launch is a launch failure in
   the report, not a second sample of the same case.
4. Report the first bad revision with its actual diff, the cheap and paid scores per revision,
   and which cases were not run.

## Shared posture
Keep evidence attached to every claim: the exact command, the revision it ran against, and
whether the result was a static read, a unit test, a live run, or production. A claimed
reproduction nobody can see is not a reproduction.


---

<!-- references/browser-proof-reference.md -->

# Browser proof: expert reference

Use with `test-board-playbook.md` and `test-board-reference.md`. Researched 2026-10-17 (Chrome DevTools MCP writeups, a 2026 browser-automation-MCP roundup, Playwright visual-regression docs already cited in `test-board-reference.md`). This file exists because the operator's original ask for coding agent -- "real-browser testing with screenshot proof for every built/shipped task" -- was never wired into a checkpoint; it is advisory until a builder or the office actually captures and stores a screenshot per task.

## Two different tools for two different jobs
- **Chrome DevTools MCP** (available to this app as `mcp__plugin_ecc_chrome-devtools__*`) is for a live, local, deterministic look at one running page right now: navigate, click, fill, read console/network, run `evaluate_script` for computed styles or API bodies, and `take_screenshot`. It returns a real PNG in the response, not a text description -- that PNG *is* the proof, not a claim that one was taken.
- **Playwright** (already the project's stated E2E/visual-regression tool per `test-board-reference.md`) is for repeatable, CI-run regression: `toHaveScreenshot` with per-OS/browser baselines, diffed on every run, never auto-accepted.
Use DevTools MCP for a builder's one-off "does this task actually render" proof during a night's work; use Playwright for the suite that runs every time and catches drift. Neither replaces the other -- a task's live screenshot is evidence it shipped tonight; a Playwright baseline is evidence it still looks right next week.

## What counts as proof for one shipped task
A claim of "built" or "shipped" for anything with a UI needs, attached to the task's report, not asserted in prose:
1. The exact URL or route navigated to (not "the homepage" -- the literal path).
2. A screenshot taken *after* the page is idle (wait for network/animation settle, not immediately on navigate -- a screenshot of a loading spinner is not proof the feature works).
3. Any console errors captured from that same page load (`list_console_messages` or equivalent) -- a screenshot with a red console is a FIX, not a pass, even if the pixels look right.
4. The viewport/device it was captured at, when the task claims responsive behaviour.
A screenshot with no URL, no timestamp context, and no console check attached is not meaningfully different from an assertion -- it is a picture, not evidence, unless it is tied to the specific run that produced it.

## Where it lives
Store the screenshot file path (or the MCP response's image) alongside the task's own report/attempt record, not only in chat transcript -- a transcript scrolls away; a file on disk in the task's artifact directory survives review and a later audit. Name files so a reviewer can tell which task and which checkpoint produced them without opening them (`<taskId>-<checkpoint>-<viewport>.png`), the same way `night-attempts.ts`'s attempt log names things by task so a cold reader can reconstruct what happened.

## What the reviewer (test-board, or coder at the end checkpoint) actually checks
- The screenshot exists and is recent (matches this run, not a stale one from an earlier attempt that happened to pass).
- It shows the actual claimed feature, not a generic page (an empty state screenshotted instead of the populated one it was supposed to prove).
- No devtools error overlay, no broken-image icon, no obviously unstyled/unloaded content.
- For a responsive claim, more than one viewport was actually captured -- one desktop screenshot is not proof a mobile claim holds.
Apply the same evidence rule already in `test-board-reference.md`: "looks fine" with no attached artifact is not evidence; a claim with a screenshot that doesn't match the claim is worse than no screenshot, because it reads as proof when it isn't.

## Common failure modes
- A builder screenshots the editor or the terminal instead of the running app -- the app was never actually loaded in a browser.
- A screenshot taken before a hot-reload finished, showing the previous state.
- Credential or secret material visible in a captured screenshot (a logged-in session, an API key in a dev banner) -- redact or recrop before it is stored anywhere a reviewer or this app's own UI might display it; never capture a page with a password field focused and visible mid-entry.
- Treating a CI Playwright baseline pass as proof a *specific feature built tonight* works -- the baseline only proves pixels didn't drift from whatever was there before; a brand-new feature has no baseline yet, so it needs the live DevTools-MCP screenshot instead, not a Playwright green check.

## Where to read more (name, do not paste)
The Chrome DevTools MCP project's own docs for the exact tool list and what each returns; Playwright's visual-comparisons docs (already cited in `test-board-reference.md`) for baseline/diff mechanics; this file's job is the proof discipline around using either, not a restatement of either tool's API.

## Phone pass and fix verification (added 2026-11-03, Qurn Cola build)
Real misses from that build, each of which a stricter proof rule would have caught earlier:
- **Scroll the whole page, not the hero.** A phone pass is 390x844 at mid-scene AND at the finale of EVERY page and scene. The worst phone bugs were on the timeline and picker pages, deep in the scroll. Per screenshot check: `document.documentElement.scrollWidth === 390`, no floating widget over the nav links, no text on the 3D object or the fixed corner element.
- **Measure the claimed rule, not only the picture.** After a CSS fix, run `getComputedStyle` on the element (position, width, z-index) via `evaluate_script`. "Fixed" with a screenshot that still shows the old layout means the rule did not apply.
- **Reload with the cache ignored before judging a fix.** The fix was on disk while the browser used a cached stylesheet. Compare the served file with `document.styleSheets` rules to tell "not deployed" from "not loaded".
- **Source order beats intent.** A media-query override written before the base rule of equal specificity silently loses. Grep for a later base rule or raise specificity, then confirm by computed style.
- **Wait for idle before judging motion states.** A badge caught mid-drop looked upside down; confirm it settles, then judge. A screenshot during an entrance animation is not a failure and not a pass.
- **Colour-scheme check.** Emulate `prefers-color-scheme: dark` and compare with desktop; "the phone looks darker" is forced dark mode until proven otherwise.
- **Performance claims need a fit environment.** Use a fresh isolated browser context with no other WebGL tabs. A throttled or background devtools tab cannot report frame rate; write "fps not measurable here" and give proxies. Test the deployed URL cold after every push.


---

<!-- references/test-quality-reference.md -->

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


---

<!-- references/tool-config-reference.md -->

# Tool settings -- exact option names, defaults and traps, read from the official docs

Use with `test-board-reference.md` (what to run) and `test-quality-reference.md` (are the tests honest). This file is for when a plan or a review has to name an exact option. Everything here was read from the vendor page named in its heading on 2026-11-24; items marked **(unverified)** came back through a model summary or a third-party guide and should be checked before they are relied on. Defaults change between versions: check the version in the project.

## Playwright (playwright.dev/docs: best-practices, test-retries, test-sharding, test-snapshots, accessibility-testing, test-agents)
**Config worth setting:** `fullyParallel: true`, `forbidOnly: !!process.env.CI`, `retries: process.env.CI ? 2 : 0`, `use: { trace: 'on-first-retry' }`. The docs say not to set trace `on` for every test because it is heavy. Run `npx playwright test --trace on` locally when you need it, then `npx playwright show-report`.
**Rules:** test user-visible behaviour; each test isolated (own storage, cookies, data); login once with a setup project and reuse the signed-in state; do not test third parties, mock them (`page.route('**/api/...', route => route.fulfill(...))`); prefer `getByRole('button', { name })`, chain and filter locators (`getByRole('listitem').filter({ hasText })`); generate locators with `npx playwright codegen <url>`; web-first assertions (`await expect(locator).toBeVisible()`), never `expect(await locator.isVisible()).toBe(true)`; never leave an assertion un-awaited (lint with `@typescript-eslint/no-floating-promises`, run `tsc --noEmit` on CI); `expect.soft` records a failure without stopping.
**Debug:** `npx playwright test --debug`, or a single line `file.spec.ts:9 --debug`; on CI read the trace viewer, not only video and screenshots.
**Retries:** default is no retry. Outcomes are passed, **flaky** (failed then passed on retry) and failed. A failure discards the worker and its browser; a retry starts a new worker and `beforeAll` runs again. `testInfo.retry` detects a retry. `test.describe.configure({ mode: 'serial' })` skips later tests after a failure and retries the group together: the docs prefer isolated tests.
**CI and speed:** run on every commit and pull request; Linux is cheaper; install only the browser you need (`npx playwright install chromium --with-deps`); shard with `--shard=1/4`. With `fullyParallel: true` shards split by test, otherwise by file (uneven files give uneven shards). Use `reporter: process.env.CI ? 'blob' : 'html'`, upload the blobs, then `npx playwright merge-reports --reporter html ./all-blob-reports`. In a GitHub matrix use `fail-fast: false` and run the merge job with `if: ${{ !cancelled() }}`.
**Visual comparison:** `await expect(page).toHaveScreenshot('name.png')`; first run writes the baseline; update with `--update-snapshots` after a human reviews the diff. Option `threshold` is 0 to 1 and defaults to `0.2`; `maxDiffPixels` has no default. Hide volatile areas with `stylePath` (a CSS file). Move the mouse away (`page.mouse.move(-1, -1)`) before a shot. Names include the project and OS (`...-chromium-darwin.png`): render baselines and comparisons in the same environment, because OS, version, hardware, power and headless mode change rendering. Commit the `*-snapshots` folder and review changes.
**Accessibility (`@axe-core/playwright`):** `new AxeBuilder({ page }).analyze()` then `expect(results.violations).toEqual([])`; limit with `.include('#x')`; claim only WCAG A and AA with `.withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])`; scan after an interaction only once the revealed element is waited for. Traps the docs name: snapshotting the whole `violations` array is fragile (it holds rendered HTML), so fingerprint by `violation.id` and `nodes.map(n => n.target)`; `.exclude()` silences every rule on an element and its children, so avoid it on large components; `.disableRules([...])` is by rule id; automated scans find only some issues, many need manual testing. Attach full results with `testInfo.attach(...)`.
**Test agents (v1.56+):** planner writes a Markdown plan into `specs/`, generator writes tests under `tests/` and verifies selectors live, healer reruns failures and proposes a patch (it may skip a test it thinks is genuinely broken). Set up with `npx playwright init-agents --loop=vscode` (also `claude`, `codex`, `opencode`); regenerate the definitions when Playwright updates; needs a seed test `tests/seed.spec.ts`. The doc lists no anti-patterns, so apply `test-quality-reference.md` section 6 to anything it writes. The playbook's claims about MCP version numbers, `page.getByRef()` and download counts were not found on these pages: **(unverified)**.

## axe-core (github.com/dequelabs/axe-core doc/rule-descriptions.md, Deque study)
The rule table lists about 105 rules in 4.14 by hand count, of which about 90 are on by default; WCAG 2.2, AAA, experimental and deprecated rules are off by default **(derived by counting, not stated on the page)**. Deque's 2021 study (about 2,000 audits, 13,000 pages, nearly 300,000 issues) found automated testing fully covered 57% of issues by **volume**, against an older belief of 20-30% coverage; it is Deque's own study and counts issues, not WCAG success criteria. Treat `incomplete` results as a to-do list.

## Testing Library (testing-library.com)
Query priority: `getByRole` (top preference), `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`, then `getByAltText`, `getByTitle`, last `getByTestId`. `getBy` throws on zero or many, `queryBy` returns null (use it to assert absence), `findBy` is async with a default timeout of 1000 ms. Do not test component instances; test DOM nodes.

## Vitest (vitest.dev)
**Coverage:** `coverage.provider` `'v8'` (default) or `'istanbul'`; `coverage.enabled` default false; `coverage.thresholds` takes `lines`, `functions`, `branches`, `statements` where a positive number is a minimum percent and a **negative number is a maximum count of uncovered items**; `thresholds.perFile` (default false) checks each file; `thresholds.autoUpdate` writes improved numbers back; glob keys such as `'src/utils/**'` do not inherit `perFile`; `reportOnFailure` default false; `coverage.reportsDirectory` is **deleted before each run** when `clean` is on. Default reporters: text, html, clover, json. A coverage floor is a diagnostic: pair it with branch coverage and a mutation score.
**Browser mode:** `npx vitest init browser`; needs a provider (`playwright`, `webdriverio`, or `preview`); CI needs playwright or webdriverio; `test.browser.instances` needs at least one entry; use `userEvent` from `vitest/browser` or `locator.fill`, not `@testing-library/user-event`; `vi.spyOn` on an imported ESM namespace throws, use `vi.mock('./m.js', { spy: true })`; mock `alert`, `confirm`, `print` yourself; split node and browser suites with `test.projects`.

## Stryker (stryker-mutator.io): see `test-quality-reference.md` section 4
Other defaults: `testRunner` `command` (plugins for vitest, jest, mocha), `coverageAnalysis` `perTest`, `timeoutMS` 5000, `timeoutFactor` 1.5, `incrementalFile` `reports/stryker-incremental.json`, `disableTypeChecks` true, `reporters` clear-text, progress, html. `--force` reruns everything; `--mutate src/app.js:5-7` narrows to lines. In PowerShell quote glob patterns.

## fast-check (fast-check.dev) and Hypothesis
fast-check: `await fc.assert(fc.property(arb..., predicate))`: always await; a predicate may throw or return false to fail; never mutate generated inputs (clone first); prefer arbitrary options (`fc.string({ minLength: 2 })`) over `.filter`; `fc.pre(...)` for preconditions; failures print a seed and path for replay. Model-based: implement commands with `check(model)`, `run(model, real)`, `toString()`; generate with `fc.commands(..., { size: '+1' })`; runners `fc.modelRun`, `fc.asyncModelRun`, `fc.scheduledModelRun` (for races); do not "test the code by comparing it to itself". The fetched pages do not list `numRuns` defaults or property patterns (round trip, idempotence, oracle): **(unverified)**; the docs were the 5.x preview, stable was 4.x.
Hypothesis stateful: `RuleBasedStateMachine` with `@rule`, `@initialize` (runs once, first), `@precondition` (prefer over `assume()`), `@invariant()` (after every step); `Bundle` with `target=` and `consumes()`; settings `max_examples`, `stateful_step_count`; the docs themselves say a plain `@given` with `data()` may be enough.

## Pact (docs.pact.io)
Consumer test registers the expected request and minimal response with a mock provider, runs real consumer code, and produces a pact file; the provider is then verified against it ("at least the data described" must be present); provider states set up preconditions. Gate deploys with `pact-broker can-i-deploy --pacticipant X --version V --to-environment E` (exit 0 yes, 1 no), then `record-deployment`. Newer work uses deployments and environments, not tags. The page was last updated Oct 2022.

## k6 (grafana.com/docs/k6)
Thresholds are pass/fail: `http_req_failed: ['rate<0.01']`, `http_req_duration: ['p(95)<200']`; long form `{ threshold, abortOnFail, delayAbortEval }`. **Do not repeat a metric key** (later entries are silently ignored); per-tag form `'http_req_duration{type:API}'`; `checks` thresholds work but checks alone do not change the exit status. Six test types: smoke (start here), average-load, stress, soak, spike, breakpoint; the docs give shapes (ramp up, plateau, ramp down), no stage arrays, and warn against "rollercoaster" patterns.

## Lighthouse CI (github.com/GoogleChrome/lighthouse-ci docs/configuration.md)
Verbatim part: `collect.numberOfRuns` default 3, `collect.method` `node`, `startServerReadyPattern` `listen|ready`, `startServerReadyTimeout` 10000 ms, `.lighthouseci/` is cleared each run unless `additive`; config file search order starts with `.lighthouserc.cjs` and does not walk upward; `LHCI_` environment variables; `autorun` flags need `=` syntax; do not use `method: psi` for private sites. **(unverified, model-extracted)**: assertion presets `lighthouse:recommended|all|no-pwa`, levels off/warn/error, `aggregationMethod` default `optimistic`, `assertMatrix` for per-URL thresholds, do not combine `budgetsFile` with other assert options.

## Mock Service Worker (mswjs.io/docs/philosophy)
Handlers describe network behaviour ("when request X happens, respond with Y") from the server's side, at the network layer, with real `Request` and `Response` objects, so application code is untouched. Its best-practices page returned 404 at the URL tried; the rules there are not read.

## Not read (open)
Chromatic and Percy specifics beyond "pixel compare against an approved baseline", Testcontainers APIs, Cypress, Jest configuration, Playwright component testing, Schemathesis, chaos tooling beyond the five principles already in `test-board-reference.md`, and the two online Playwright review skills whose pages returned 404.


