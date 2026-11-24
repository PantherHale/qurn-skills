# Phase 4 (coder) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/coder/studies.md`.

## 1. What we found
Our coder skill was already strong on craft (about 11,000 words: APIs, Postgres basics, SQLite, N+1, concurrency, Electron, TypeScript, efficient agent sessions, review lenses, DevEx review). Gaps, each verified absent by exact-term search:
1. **No executable check** of source or of instruction files (the skill had no scripts).
2. No framework or platform specifics (Next.js, Astro, SvelteKit, Hono, Vite; Cloudflare Workers and Vercel limits).
3. No web.dev optimisation numbers (LCP subparts, `fetchpriority`, `content-visibility`, font metric overrides).
4. No Postgres "Don't Do This" items, PgBouncer pool modes, or the SQLite WAL network-filesystem limit and WAL-reset bug versions.
5. No prompt-caching numbers (TTLs, price multipliers, minimum tokens per model, invalidation, breakpoints); no `/compact`, subagent frontmatter or cost figures.
6. **Twin drift:** `coder-specialist` linked a reference it did not contain.
7. Two stale paths inside skills (`src/specialists/knowledge/security-checklist.md`, `specialist-skills/research/security.md`).

## 2. What changed
| Item | File |
|---|---|
| Performance scanner: n-plus-one (JS and Python), select-star, unbounded-query, sync-io-in-handler, heavy-import, json-deep-clone, volatile-system-prompt, async-blocking-call, img-no-dimensions, blocking-script, font-display, sqlite-pragmas, lazy-lcp-image (FAIL), and six Postgres schema rules; 16 tests, 99.4% lines | `skills/coder/scripts/perf-scan.mjs`, `.test.mjs` |
| Context linter for CLAUDE.md and AGENTS.md: too-long, broken-import (FAIL), import-too-deep, no-check-command, duplicate-line, vague-rule, broken-path; `--md` for all markdown; 13 tests, 100% lines | `skills/coder/scripts/context-lint.mjs`, `.test.mjs` |
| Core Web Vitals fixes, framework notes, platform limits with dates, Postgres and SQLite and PgBouncer rules | `skills/coder/references/stack-and-platform-reference.md` |
| CLAUDE.md and AGENTS.md rules, cost levers, subagents, prompt-caching numbers | `skills/coder/references/agent-cost-and-context-reference.md` |
| SKILL.md paragraph (required scan runs, no performance claim without measurement) and five links including the previously unlinked observability reference | `skills/coder/SKILL.md` |
| Two stale paths fixed; twins re-copied (`diff -rq` clean for coder and security); `flatten/` regenerated (`--check` OK) | `performance-checklist.md`, `security-systems.md`, `skills/*-specialist/`, `flatten/` |

## 3. Proof
**Fixture:** I wrote an "orderdesk" project with **29 planted defects**, chosen to need current knowledge, not only well-known smells: 6 Postgres schema traps (serial, timestamp, money, char(n), a plain `CREATE INDEX` on a 40M-row table, `NOT IN` over a nullable column), 6 code-level (N+1, `SELECT *` with no limit, unbounded `findMany`, sync file read in a handler, moment, JSON deep clone), PgBouncer transaction mode with per-request `SET` and named prepared statements, a Cloudflare Free-plan Worker with 300,000 hash rounds and 80-120 subrequests, a 8-15 MB upload through a Vercel Function, 4 landing-page web-vitals defects, 2 prompt-cache mistakes (timestamp in the system prompt, `cache_control` on the user message), 3 FastAPI/SQLite defects (blocking calls in `async def`, no foreign keys or busy timeout, a database on a network share), and 5 `CLAUDE.md` defects.
**Scanners alone on the fixture:** about 23 of the 29 flagged (mechanical items). The 6 they cannot see: PgBouncer, Worker CPU, Worker subrequests (flagged only as a loop), the Vercel body limit, the cache breakpoint position, and SQLite on a network share. My first scan **missed** the volatile system prompt (the date was on a different line from the word `system`); I rewrote the rule to read the whole block, and a new test then caught a false positive that I also fixed.
**Blind review, same fixture, read-only reviewers with no shell, one run each:**
| Reviewer | Defects found | Missed | Verdict |
|---|---|---|---|
| Old skill | 28 of 29 | SQLite connection sets no `foreign_keys` or `busy_timeout` | redo |
| New skill | 29 of 29 | none | redo |
**Honest reading: a gain of one defect, so a small one.** A strong reviewer with the old skill already found almost everything, including the platform-limit defects from its own knowledge. What differed is the quality of the evidence: the old reviewer wrote that the Cloudflare and Vercel numbers were "from my own knowledge, verify against current docs"; the new reviewer cited the dated vendor figures (Cloudflare page dated 2026-11-19, Vercel 2026-08-24), the SQLite WAL-reset version range, and named which scan rule would fire for each finding. So the upgrade makes numbers sourced and checkable; it did not make the reviewer find substantially more.
**Limits:** one run per side; I wrote the fixture and chose defects the new files cover; the reviewers had no shell, so the scanners were never actually run by them; nothing was measured on a real product (no EXPLAIN, no bundle, no Lighthouse).
**Real-code precision:** perf-scan on the inventory app and `researchmodel1` gave only WARNs (45 and 1 `n-plus-one`, 58 `select-star`, 32 `pg-timestamp-without-tz`, and others; I did not read them all, so the false-positive rate there is unmeasured). On qurn's `skills/` it gives 10 `select-star` and 2 `n-plus-one`, all inside example text. `context-lint --md` on qurn's docs listed 125 paths: about 3 truly stale (two fixed, one the twin's dangling link, fixed by the re-copy); the rest are example paths for other projects or historical notes, so treat `--md` as a candidate list.
**Checks:** `diff -rq` clean for coder and security twins; `build-flatten --check` OK; `node --test` 249 tests, 249 passed on 4 consecutive runs after the last edit.

## 4. Mistakes and surprises (not hidden)
- Two shell edits lost regex backslashes and wrote broken code; `node --check` and the tests caught both. After that I edited regexes only with the Edit tool or by splicing a clean file.
- A line-based rule could not see across lines (volatile prompt); fixed. Removing it left dead code in `applyRule`, which I removed after coverage dropped.
- Three sentences in my references were my own inferences, not from the pages; I removed or labelled them "our judgment" before shipping.
- Twin drift again (the third phase in which a twin had drifted); mirroring after every edit is now routine, but nothing enforces it in CI beyond `build-flatten --check`, which only checks flatten files.

## 5. Unverified or not read
Netlify, Fly.io, Supabase docs; Postgres connection-count sizing; V8 and Node performance guides; bundle-analysis tool docs; HTTP/2 and HTTP/3; the installed coding skills (`coding-standards`, backend and frontend patterns, `search-first`, `strategic-compact`, `agentic-engineering`, `context-budget`, `token-budget-advisor`), listed but not read line by line; Next.js Cache Components model; Astro directives reference; the last 15,598 characters of the prompt-caching page; hooks, skills and model-config docs; parts of the memory, sub-agents, EXPLAIN and pragma pages came back as summaries (marked in the references). The memory-docs fetch also carried an injection-shaped phrase in its harness note; nothing in the pages asked for any action.

## 6. Open items for you
1. `mcp/specialists.json` is a stale outside snapshot with no generator in this repo (open since Phase 1): how should it be regenerated?
2. The flaky `qurn-ledger` concurrency test is still unfixed (open since Phase 2).
3. Add a CI check that each `skills/<name>-specialist/` equals `skills/<name>/`? Twins had drifted in three of the four phases so far (web, security, coder; tester was identical).
4. A harder real-world before/after (a real project, run with and without the skill) would be stronger evidence than a planted fixture; the fixtures keep hitting a ceiling.
5. Phase 5 (architect) starts only when you say so.
