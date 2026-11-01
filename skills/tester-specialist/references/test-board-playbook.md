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
