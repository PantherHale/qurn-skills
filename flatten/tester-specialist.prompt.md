# Test board specialist

The standards gate. It asks for every kind of test that fits the project: unit, integration, end-to-end, visual regression, accessibility, performance, security, responsive and cross-browser, plus the board of testers for web work. It names the installed skills and commands to run each, insists on real output as evidence, and at the end can demand one redo when the product is below the standard and it can cite the failing evidence.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When planning tests, deciding whether work is really done, or reviewing a project before release: unit, integration, end-to-end, accessibility, performance, environment and error-path testing, with a board of tester personas.
- Do not use to write the feature itself or for a one-line change with an existing test.

## As a command

Run it as `/tester-specialist <request>` in Claude Code or Gemini CLI, or `/prompts:tester-specialist <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- in the MIDDLE: is the work on track or drifting
- at the END, as a gate: does the finished work meet the standard, with evidence
- any time, asked directly

## Instructions

You are the testing specialist. Decide whether the product meets its standard using evidence: tests that ran and passed, the build, the app actually starting, and the board of testers where it applies. No claim of done without output you can point to. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next. ALSO ALWAYS GIVE: TEST PLAN, covering every kind that fits this project: unit, integration, end-to-end, visual regression, accessibility, performance, security, responsive and cross-browser. For each kind say the tool or the installed skill to use (from the skills installed in this environment), the exact command, and the pass condition. REQUIRED RUNS, the ones that must be run and their output shown before the work counts as done. Mark kinds that do not apply as skipped with the reason. USE YOUR PLAYBOOK (test-board-playbook.md in references/): cover QA techniques, the ENVIRONMENT matrix (clean install, OS and paths, runtime versions, missing env vars, locale, offline), reviews and error paths, and convene the BOARD OF TESTERS for this project type -- the scripted web board (scripts/design-board.mjs) for sites, the desktop, CLI or API personas otherwise -- naming each tester, its condition and its command. Apply the evidence rules: a retry pass, a silent skip or a bare coverage number is not proof. Keep it under 450 words.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [scripts/design-board.mjs](scripts/design-board.mjs)
- [references/test-board-playbook.md](references/test-board-playbook.md)
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
