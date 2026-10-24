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
