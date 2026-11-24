# Coder: agent session cost, context files, subagents and prompt caching (read from the docs)

Added 2026-11-24 (Phase 4 upgrade). Read from code.claude.com (best-practices, memory, costs, sub-agents), platform.claude.com (prompt-caching) and agents.md. Pages were partly verbatim and partly model-summarised; items marked **(unverified)** are from a summarised part. Product settings change often: check `/help` and the docs for the installed version. Use with `coder-efficiency.md`.

## 1. Lint the files the agent loads every session
`node scripts/context-lint.mjs <folder-or-file> [--md]`. The consulting agent runs it and shows the output. Checks `CLAUDE.md`, `CLAUDE.local.md` and `AGENTS.md`: `too-long` (over 200 lines), `broken-import` (an `@path` that does not exist: FAIL, because that guidance silently never loads), `import-too-deep` (over four hops), `no-check-command`, `duplicate-line`, `vague-rule`, and `broken-path` (a backticked path that does not exist relative to the file, the repository root or the enclosing skill folder). `--md` checks every markdown file for broken paths only. Treat `--md` as a candidate list: on qurn it listed 125 paths, and only a few were truly stale (the rest were example paths for other projects or historical notes). The linter cannot judge whether a rule is worth its tokens: apply the test in section 2.

## 2. What goes in CLAUDE.md / AGENTS.md (Claude Code docs)
- Target **under 200 lines per file**; run `/init` for a first draft and `/doctor` for cut suggestions (`/doctor prompt-audit` flags stale or contradictory instructions). Personal preferences go in `CLAUDE.local.md` (gitignored).
- **Test each line:** "Could the agent find this by reading the code?" and "Would it actually go and look?" If both are yes, delete it. The most useful line is the command that runs the check (test, lint, typecheck), because the agent can then verify its own work.
- **Loading:** `CLAUDE.md` and `CLAUDE.local.md` load from the working directory and every parent, concatenated root-first; files in subdirectories load when the agent reads or edits there; HTML block comments are stripped. `@path` imports resolve relative to the importing file, up to four hops, and are skipped inside code spans and fenced blocks. Verify what loaded with `/context all`.
- **AGENTS.md** (an open "README for agents", now stewarded by the Agentic AI Foundation under the Linux Foundation; supported by Codex, Cursor, Copilot's coding agent, Gemini CLI, Zed, VS Code and many others): plain Markdown at the repo root with no required fields; suggested sections: overview, build and test commands, code style, testing, security, PR instructions, deployment. The closest file to the edited one wins, and an explicit chat instruction beats all. Claude Code reads `AGENTS.md` only when no `CLAUDE.md` exists in or above the working directory (version 2.1.277 or later); to share one file, import it from `CLAUDE.md` with `@AGENTS.md` (on Windows) or symlink it.
- Put `deny` permission rules for secrets in settings, not in prose: deny rules hold in every mode, for example `Read(./.env)`.

## 3. Cost levers (Claude Code costs page)
- Reported averages: about $13 per developer per active day, $150-250 per developer per month, under $30 per active day for 90% of users (an enterprise-wide average, not a budget).
- `/clear` between unrelated tasks (`/rename` first if you will resume); `/compact <what to keep>` steers compaction, and a CLAUDE.md section titled "Compact instructions" does the same. After two failed corrections, `/clear` and write a better prompt instead of piling on.
- Use Sonnet for most coding and keep Opus for hard problems; use `model: haiku` for simple subagent jobs. Thinking cannot be switched off on the newest models, and `MAX_THINKING_TOKENS` only affects fixed-budget models.
- Cut noisy tool output before it reaches the context: a PreToolUse hook can keep only the last lines of test output (the page's example uses `tail -n 100`).
- Cache lifetime in the app is about one hour on a subscription and five minutes on an API key (costs page). Our inference: a pause longer than that probably means the next turn pays full price again.
- Agent teams cost far more (the page cites about 7x the tokens when teammates run in plan mode).

## 4. Subagents (sub-agents page)
- Each subagent has its own context window and returns only a summary, so use one for work that reads many files (search, review) and keep the main thread small. Its usage still counts toward the same limits.
- A subagent file has `name` and `description` (required) and optional `tools` (an allowlist), `disallowedTools` (a denylist applied first), `model` (`haiku`, `sonnet`, `opus`, `fable`, a full ID, or `inherit`), `maxTurns`, `permissionMode`, `effort`, `memory`, `isolation: worktree`, `omitClaudeMd`. A read-only reviewer is `tools: Read, Grep, Glob`. Unknown fields are silently ignored, so a typo does nothing.
- Model order: the per-call parameter, then the file's `model`, then `CLAUDE_CODE_SUBAGENT_MODEL`, then the main conversation's model. Claude Code warns at startup when subagent descriptions together exceed 15,000 tokens, because they are always in context.

## 5. Prompt caching (API docs; the last part of the page was not read)
- The cache holds a prefix. Default lifetime 5 minutes, refreshed on every read; optional 1 hour (`"ttl": "1h"`). **Prices:** a 5-minute write costs 1.25x the base input price, a 1-hour write 2x, a read 0.1x (0.05x for Opus 5.5 and Sonnet 5.5, 0.025x for Fable 5.2 and 5.1).
- **Minimum cacheable prompt:** 512 tokens for Opus 5.5, Opus 5, Sonnet 5.5, Fable 5 and Haiku 5.5; 1,024 for Opus 4.8, Sonnet 5 and Sonnet 4.6; 2,048 for Opus 4.7; 4,096 for Opus 4.6, Opus 4.5 and Haiku 4.5. A shorter prompt is processed normally and simply not cached, with no error.
- **What breaks the cache:** any byte difference in the cached prefix; changing tool definitions (invalidates tools, system and messages); toggling web search or citations; adding or removing images or changing `tool_choice` (invalidates messages); changing thinking parameters or `output_config.effort`. So never put a timestamp, a random id or a per-user string before the last breakpoint.
- **Breakpoints:** up to 4 explicit `cache_control` breakpoints; the lookback checks 20 blocks; automatic caching uses one of the 4 slots (a fifth gives a 400 error). Put the breakpoint on the last block that stays identical between requests, not on the new user message.
- A cache entry exists only after the first response starts, so wait for it before firing parallel requests; `max_tokens: 0` writes the cache without billing output tokens. Measure with the usage fields (cache read and cache creation tokens) rather than assuming a hit.

## 6. CHECK lines
- `node scripts/context-lint.mjs <repo>` has no FAIL and the instruction file is under 200 lines.
- `node scripts/perf-scan.mjs <src>` has no FAIL, and every WARN is fixed, suppressed with a reason, or measured and dismissed.
- Cache hit tokens are non-zero on the second request of a repeated prompt.

## 7. Not read (open)
The end of the prompt-caching page, hooks, skills and model-config pages, `permission-modes`, auto-memory details (the limits figure for subdirectory files came back garbled), and any third-party agent framework docs.
