# Real-session lessons: what goes wrong in practice and what the lead does about it

Mined 2026-11-24 from the operator's own Claude Code transcripts: 1,166 typed messages across 375 sessions and about 40 projects (web sites, a desktop inventory app, a voice assistant, a chess app, games, a video tool, a SaaS product). Only the operator's own words were read, locally; nothing was sent anywhere. Project names are left out on purpose. Counts are messages matching a keyword pattern, so they are rough signals, not measurements.

## Contents
1. What the transcripts show (counts)
2. Run contract: stops, "do not stop until", unattended runs
3. "It looks AI / bad" and "it is the same as before"
4. Lag and "too slow"
5. Data that goes missing, shared databases, blank screens
6. "Test every page" without a plan
7. Research that finishes too fast
8. Commits, live sites and tool folders
9. Pasted review findings
10. Plain words
11. Testing on real projects: data collected
12. What was implemented, and what is not solved

## 1. What the transcripts show
| Signal | Messages | Reading |
|---|---|---|
| Message starts with "continue" | 75 (53 are one or two words) | The agent stopped before the plan was done, or a session ended; the operator restarts it by hand, sometimes "I am going to sleep" |
| "looks bad / AI / generic / boxy / same structure" | 33 | Visual output judged as default or templated, again and again, across six projects |
| "lag / slow / stuck / glitch" | 21 | Real-device speed problems reported after the agent said it was fine |
| "test every page / user testing / bug-free" | 16 | The operator asks for page-by-page testing because bugs reach them first |
| Missing, duplicate or wrong data; blank screen; logins fail | 11 | Mostly one multi-user app and one packaged desktop app |
| "stop after each phase" or "do not stop until" | 7 | Two opposite pace instructions, both needing to be honoured exactly |
| "research" complaints ("did no research", "finished this fast") | several | The research deliverable was a stack of existing material, not new work |
| "what do you mean" | 8 | Unexplained jargon in a report |
| `/qurn` used | 197 messages, 16 projects | The lead is the operator's main entry point, so its habits matter most |

## 2. Run contract: stops, "do not stop until", unattended runs
- At the start, write the operator's pace instructions into the ledger as a RUN CONTRACT line: `stop after each phase`, `stop after each PR`, `do not stop until P3 is done`, `unattended, operator asleep`. Quote the operator's words. Re-read it before every stop or continue decision; a later message overrides an earlier one only when it says so.
- "Do not stop until X" means no clarifying questions and no phase-end pause until X exists and is verified; a blocker that needs a decision is logged, worked around if safe, and listed in the final report. "Stop after each" means stop and give a two-line status each time, even when the next step is obvious.
- Unattended: before starting, check that nothing needs a person (a login, Docker, a licence prompt). Write a RESUME line after every phase: what is done, what is next, the exact command to continue. A new session must be able to start from that line alone; the operator should never have to type "continue" and hope.
- When a session is near its context limit, finish the current step, write the RESUME line, and say so plainly rather than stopping mid-edit.
- A "continue" that arrives with no new instruction means: re-read the ledger and the RUN CONTRACT, resume at the first unfinished step, say which step that is in one line.

## 3. "It looks AI / bad" and "it is the same as before"
- The operator's words repeat: "generic", "boxy", "same structure", "you just stacked one site on another", "you just zoomed in", "I want big changes, not little ones".
- Before any visual rebuild, write a one-line CHANGE CONTRACT: which of structure (section order and layout), palette, type, hero object, motion and copy will change, and which will not. After the rebuild, show a measured diff: sections added, removed or re-ordered; colours replaced; the hero object's geometry or material changed. If the operator said "full redo", fewer than three of those six changed means the work is not done.
- Study first: open at least three real reference sites or products in the same field and note the specific techniques, then say which one each section borrows. A rebuild with no named reference is the "AI" look the operator complains about.
- A close-up screenshot of the thing the operator named (the object's edge, the label, the end page) is part of the evidence; a full-page screenshot is not.
- The web specialist's `slop-scan.mjs` catches mechanical tells only. It cannot see "same structure on every page"; the lead compares the section order of the pages it built and flags pages that match.

## 4. Lag and "too slow"
- "Laggy" is a claim about the operator's device, not the agent's machine. Measure on a throttled profile (4x CPU slowdown, mobile viewport) and report numbers: long tasks, frames dropped while scrolling, time to first reply for a voice or chat feature. Say what could not be measured.
- Voice and real-time features: report the end-to-end delay from the end of speech to the first audible reply, and the error rate of the transcript on a short list of spoken test phrases. "Fast" without those two numbers is not a result.

## 5. Data that goes missing, shared databases, blank screens
Three real failures, each with a rule.
1. **Packaged app opens to a blank screen.** Build-time variables (for example `APP_API_URL`) were never passed to the build job, so the published installer had empty values. Rule: run `scripts/preflight.mjs <project>`; its `env-undocumented` and `ci-var-not-passed` rules fail when a public build variable is read in code but missing from the docs or the workflow. Then launch the packaged build once and look at it.
2. **Every installed copy used the same hosted database.** A desktop app had a hosted server address written into the code, so staff PCs and the hosted site read and wrote the same records. Rule: `hosted-url-literal` in preflight; say which environment each build points at, and make the local app default to its own local store.
3. **Records randomly missing or duplicated.** Rule for any multi-user app: before and after every migration, import or sync, record row counts per table and the ids of ten sample records; a mismatch is a FAIL. Add a test that creates, edits and re-reads a record through two sessions. Duplicate detection needs a unique key, not a name match.
- Add a "what will go wrong on a second machine" step to every ship checklist: fresh clone, fresh install, empty database, no environment variables set.
- The operator said "why can't you remember anything": write environment facts (which database, which host, which account) into `docs/design/QURN_PROFILE.md` or the project's own notes so the next session does not rediscover them.

## 6. "Test every page" without a plan
- Build the route list from the router or the file tree, then visit every route at 390 px and 1280 px with a clean profile, and for each one record: console errors, failed requests, a screenshot, one action performed (a click or a form submit). A route with no recorded action is not tested.
- Test the flows the operator names first (login, password change, add client, search), then the rest. A password-change form that shows nothing while it works is a bug; every action that takes over 300 ms needs visible feedback.

## 7. Research that finishes too fast
- A research phase reports the number of sources actually opened, and a task that asked for "research on every specialist" is not done in minutes. Ethical minimum for a rebuild brief: at least three sources opened per area, each with what was taken from it.
- If the work product is a combination of existing things, say what is new. "I merged A and B" is not a research result.

## 8. Commits, live sites and tool folders
- Never make something public (publish, deploy to the live domain, push a site live) unless the operator's current message says so; one real incident was a site made live by accident and then turned into a waitlist.
- Before every commit run `preflight`: it flags committed environment files, agent-private files and design-tool folders (one real repo had a tool folder committed and the operator asked "did you commit it?").
- Commit and push only when asked, or when the RUN CONTRACT says auto-commit; say what was committed and where it went.

## 9. Pasted review findings
The operator pastes findings from other reviewers (a paid action that can be retried with a new idempotency key; a video element left in the page under reduced motion; browser tests that fail only under load). Treat each pasted finding as a ledger item: reproduce it, fix it, add a test that fails without the fix, and answer it by number. Do not summarise away a finding you did not fix; say why.

## 10. Plain words
Eight messages asked "what do you mean by ...". Terms such as "Gate A", "best-effort", "envelope" were used without a plain sentence. Every report defines a term the first time it appears, in a few words.

## 11. Testing on real projects: data collected
Run 2026-11-24 on the operator's real projects, read-only except where stated.
- **Scanners on four projects** (security, performance, test-smell, design, context): the first pass gave one project 36 security and 60 test-smell FAILs. Five false-positive classes were found and fixed in the scanners (copies of the project under `.claude/worktrees` scanned twice; fake keys and attack strings inside test files; `expect(f(x)).toBe(f(x))` determinism checks read as tautologies; a database `exec` of a SQL string read as a shell command; a local helper that asserts read as "no assertion"). Result: 36 to 1 and 60 to 2. Lesson: run every new scanner on a real project before trusting its FAIL count.
- **A real inventory app, its own suite, 1,210 tests:** all pass when run correctly. Two apparent failures were found and explained. (1) Four CSP tests failed only in a full run: a fixture set `DATABASE_PATH` after the app module was already imported, so the setting was ignored and the fixture used whichever database the app had resolved at import (by default the real `properties.db`). It passed alone and failed in order, so it is a test-isolation bug that could touch real data; fixed in the fixture by setting the module's database directly and restoring it. (2) One benchmark test failed only because my own temp `DATABASE_PATH` pointed at a file that did not exist yet; with the variable unset it passes. Lesson: when a test fails in a full run and passes alone, look for state set at import time before blaming the product, and check your own harness before reporting a product bug.
- **Safe procedure used, reuse it:** hash the real database files before the run and after (`md5sum`), run the suite in a throw-away virtual environment, point `DATABASE_PATH` at a temp file, and report the hashes. Real data was unchanged.
- **Not done:** no browser click-through of the running app, no real-device speed numbers, no check of the packaged installer.

## 12. What was implemented, and what is not solved
- Implemented: this file; `scripts/preflight.mjs` with 6 tests, checked on the operator's real projects; a short section in the lead's `SKILL.md` that points here and makes the RUN CONTRACT, RESUME line and CHANGE CONTRACT required.
- Not solved: no source gives a way to make the agent "remember" across sessions beyond writing files; lag and voice quality need real-device numbers that this repository cannot produce; "looks AI" remains a judgment, and the checks above only raise the floor.
