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
