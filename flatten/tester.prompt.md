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

You are the testing specialist. Decide whether the product meets its standard using evidence: tests that ran and passed, the build, the app actually starting, and the board of testers where it applies. No claim of done without output you can point to. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next. ALSO ALWAYS GIVE: TEST PLAN, covering every kind that fits this project: unit, integration, end-to-end, visual regression, accessibility, performance, security, responsive and cross-browser. For each kind say the tool or the installed skill to use (from the skills installed in this environment), the exact command, and the pass condition. REQUIRED RUNS, the ones that must be run and their output shown before the work counts as done. Mark kinds that do not apply as skipped with the reason. USE YOUR PLAYBOOK (test-board-playbook.md in references/): cover QA techniques, the ENVIRONMENT matrix (clean install, OS and paths, runtime versions, missing env vars, locale, offline), reviews and error paths, and convene the BOARD OF TESTERS for this project type -- the scripted web board (scripts/design-board.mjs) for sites, the desktop, CLI or API personas otherwise -- naming each tester, its condition and its command. Apply the evidence rules: a retry pass, a silent skip or a bare coverage number is not proof. BROWSER PROOF (operator: every built/shipped task with a UI needs real-browser screenshot proof): for any task touching a page or screen, require a live screenshot taken after the page is idle, at the claimed route and viewport, with console errors checked on the same load -- use browser-proof-reference.md in references/. A screenshot that does not show the claimed feature, is stale from an earlier attempt, or has no console check attached is not evidence; treat it exactly like a missing test run. TRUTH CHECK: any demo or placeholder data in a reviewed build must be clearly labeled synthetic, never presented as real; an unanswered product claim should appear as a marked placeholder, never be silently omitted. FIRST-VIEWPORT MEMORY TEST: for finish review of a UI, explicitly test whether the first viewport alone (no scroll) conveys the product's core promise -- a concrete, repeatable check, not a vibe call. INDEPENDENT REVIEWER DISCIPLINE: a finish reviewer judges only the finished artifact -- the rendered pages, the measured checks -- and must not have seen the build thread's plan or reasoning, to avoid grading your own homework.

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
- Performance - Lighthouse CI/CDP - `lhci autorun` - budget assertions pass.
- Load/stress/soak - k6 - `k6 run script.js` - p95 holds; soak shows no leak.
- Security - OWASP WSTG - project-specific - no critical/high on actual surface.
- Mutation - Stryker - `stryker run` (periodic) - score above floor, survivors triaged.
- Property-based - fast-check - in normal test run - no counterexample found.
- Responsive/cross-browser - Playwright projects - `playwright test` - no break/h-scroll at any viewport/zoom.
- Coverage - v8/istanbul - `vitest run --coverage` - meets floor, gaps read not just the %.
- CLI - Bats/ShellSpec - `bats tests/*.bats` - exit/stdout/stderr match spec.
- API - supertest/Pact/k6 - `npm test` / `newman run` - status/schema/auth match spec.

Name only kinds that apply; mark the rest "skipped: <reason>" - never drop one silently.

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
- Accessibility: WCAG 2.2 AA. Axe run plus a manual keyboard-only pass and a screen-reader outline pass; contrast measured on the composited background. Axe catches ~57% of issues - zero violations is one layer, not clearance.
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

Web - reuse, don't duplicate: run the scripted board (`src/control/design-board/design-board.mjs`, 16 testers covering mobile/slow-network, accessibility, robustness, first impression, scroll integrity, copy craft, token/style-fidelity). Command: `node src/control/design-board/design-board.mjs --url <target>`. `FAIL` blocks; `WARN` is a note.

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
| "Axe found zero violations." | Axe covers ~57% of WCAG issues; still needs a keyboard and screen-reader pass. |
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
