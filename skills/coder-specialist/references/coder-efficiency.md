# Coder: efficient sessions

Research 2026-09-23; sources in specialist-skills/research/coder.md.

## Rules for the session

1. Grep/glob before reading; when a file is large, read a scoped region (offset/limit) around the located line, not the whole file.
2. Plan first for multi-file or unfamiliar-code changes; skip planning for a one-sentence diff.
3. Keep files 200-400 lines typical, 800 max; split a file over 800 lines by responsibility, not by line count alone.
4. One task per session; reset/clear context between unrelated tasks instead of carrying stale history forward.
5. Delegate verbose, disposable research (log triage, broad exploration) to a subagent; keep iterative, shared-context work in the main thread.
6. Route disposable or high-volume subagent work to a cheap model tier; reserve the top tier for genuine multi-step reasoning.
7. Pick model and effort/thinking level once at session start; do not switch model, effort or fast-mode mid-task.
8. Prefer patch/diff-style edits over whole-file rewrites for small changes.
9. Give every task a runnable check (test, build, screenshot diff) and actually run it, instead of asserting "done".
10. Batch independent tool calls (reads, greps, searches with no shared dependency) into one turn instead of issuing them one by one.
11. Keep CLAUDE.md/AGENTS.md operational and under ~200 lines; move occasional or detailed procedures into a skill instead.
12. Test incrementally: implement one file, verify it, then continue, rather than writing everything and testing once at the end.
13. Scope investigation narrowly ("check session handling in src/auth/") or hand it to a subagent; never issue an unscoped "explore X".
14. Retrieve just-in-time: keep file paths and queries as pointers, resolve them only when actually needed, not pre-loaded "just in case".
15. Prefer the smallest tool surface: a CLI command over an MCP server for the same job; disable MCP servers not in use.
16. Reply tersely: state the change and the reason, do not restate code the diff already shows or narrate each step taken.

## Prompt caching is a cost lever, not just a session-structure choice (added 2026-10-23)
Every turn in a long session re-sends the system prompt, tool definitions, CLAUDE.md/AGENTS.md and prior conversation; prompt caching lets the provider skip reprocessing the unchanged prefix instead of paying full price every turn. That only works if the prefix stays byte-identical: put the large, stable material (system prompt, tool schemas, project instructions) first and genuinely static, and put anything that changes turn-to-turn (the live file content being edited, a growing scratch log) after it, not interleaved — one edited line near the front of a long context invalidates the cached prefix for everything after it. Caches also expire (a short default window, measured in minutes, extendable to about an hour on some setups) — a session that goes idle past that window pays full price on the next turn regardless of how well-structured the prefix was, so there's a real cost difference between "batch several quick turns close together" and "let the same session sit idle for hours between asks." This is a session-economics fact, not a style preference: a coder-efficiency review of a slow/expensive agent session should check whether its own structure is fighting the cache (constantly-mutating early context, or very long idle gaps) before blaming model choice or verbosity alone.

## Do not over-engineer (code nobody asked for)

The best change is the smallest one that meets the goal. Before adding anything, ask: did the task require it, and does something already do it?

1. No feature, option, flag or setting the task did not name. A second use case is not a reason to build a framework for it.
2. No abstraction (interface, base class, factory, strategy, plugin point) until a second real use exists. One caller means a plain function.
3. No wrapper or layer that only forwards a call; call the thing directly.
4. No generic or configurable version of something used once; hard-code it, name the constant, move on.
5. No defensive code for a case that cannot happen (validate at the boundary, trust inside it). No try/catch that only rethrows.
6. No dead code, commented-out code, unused import, unused dependency or unused file; delete it in the same change.
7. No comment that restates the code; comment only the why that the code cannot show.
8. Reuse what the project already has (utility, component, type) before writing a new one; do not add a dependency for a few lines.
9. A diff longer than the goal needs is a finding. Prefer deleting lines over adding them; if a simpler version exists, take it.

Signals to flag: a new class or interface with one implementation, a function with a parameter every caller passes the same value for, a config object read in one place, a helper called once, more test scaffolding than the logic under test, a new folder for one file.

## Code structure that helps agents

Small, single-purpose files with descriptive names surface intent before a file is even opened. Explicit, typed function signatures let an agent skip reading the implementation to learn behavior. Split by seam (one clear responsibility), not size alone, so a targeted read stays targeted instead of dragging in unrelated code.

## Measurable signals

- Any file over 800 lines, or a smaller file visibly mixing unrelated responsibilities.
- Duplicated logic copy-pasted across files instead of one shared utility.
- No test command discoverable for the project (no script/Makefile target/README instruction to run tests).
- CLAUDE.md/AGENTS.md over ~200 lines, or a detailed one-off procedure inlined there instead of a skill.
- Unpinned dependency versions (`^`, `*`, `latest`) with no lockfile, letting the build drift silently.

## Rationalizations

| Excuse | Reality |
|---|---|
| "I'll just read the whole file, grepping twice is slower" | A full read of a large file costs far more tokens than a grep plus a scoped read of the actual region. |
| "One long session keeps context so I don't repeat myself" | Stale context from a finished, unrelated task is resent every turn for no benefit; reset between tasks. |
| "I'll rewrite the whole file, it's cleaner than a patch" | A whole-file rewrite pays for the file twice (read + write) for a change a diff would cover in a few lines. |
| "It looks done" | Without a runnable check, "looks done" is the only signal; give the task a test/build it can verify itself. |
| "I should explain my reasoning so the change is trusted" | The diff plus one reason is the evidence; a narrated walkthrough adds tokens without adding proof. |
