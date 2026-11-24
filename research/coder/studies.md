# Phase 4 (coder) -- per-source studies

Read 2026-11-24 through fetch agents (non-preapproved pages were paraphrased, not copied). "Summary" marks the part of a long page that came back as a model summary: unverified. Nothing here is from memory.

## A. Our own skill (before)
`skills/coder/` had about 11,000 words in 11 references and **no scripts**, and its twin `coder-specialist` linked a reference it did not contain (`agent-observability-reference.md`). A topic search found strong coverage of craft (APIs, Postgres basics, SQLite WAL and busy_timeout, N+1, concurrency, Electron, TypeScript, efficient agent sessions, review lenses, DevEx review). Verified absent by exact search: any guidance on Next.js, Astro, SvelteKit, Hono or Vite; Cloudflare Workers and Vercel limits; the web.dev optimisation numbers (LCP subparts, `fetchpriority`, `content-visibility`, `size-adjust`); the Postgres "Don't Do This" items; PgBouncer pool modes; the prompt-caching numbers (TTLs, price multipliers, minimum tokens, invalidation); `/compact`, subagent frontmatter and cost figures.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| web.dev: vitals, optimize-lcp, optimize-inp, optimize-cls | full | Thresholds at p75; LCP subpart shares (about 40 / under 10 / about 40 / under 10 percent); `fetchpriority`, never lazy on the LCP image; INP yielding and `content-visibility`; CLS dimensions, `font-display`, font metric overrides, bfcache |
| Next.js caching ("previous model") and production checklist | full | `fetch` not cached by default there; `revalidate`, tags, segment config; the checklist items. Newer Cache Components model **not read** |
| Astro islands, SvelteKit performance, Vite performance, Hono intro | full | `client:*` directives, font preload in `handle`, avoid SPA mode, avoid barrel files, `server.warmup`, runtimes list |
| FastAPI async | full | `def` versus `async def`, thread pool consequence |
| Cloudflare Workers limits (page dated 2026-11-19), Vercel Functions limits (updated 2026-08-24) | full | CPU time, subrequests, body limits, durations, memory, bundle sizes |
| PostgreSQL wiki "Don't Do This" (20 items, edited 2026-11-11), EXPLAIN (PG 19 docs), index types, CREATE INDEX | wiki, index pages full; EXPLAIN first 40k verbatim, rest summary | Replacement for each bad pattern; `CONCURRENTLY` rules; reading `EXPLAIN (ANALYZE, BUFFERS)` |
| SQLite WAL page (updated 2026-08-25), pragma page | WAL full; pragma first 40k verbatim, rest summary | WAL pros and cons, network-filesystem limit, checkpoint at 1,000 pages, **WAL-reset bug in 3.7.0 to 3.51.2 fixed in 3.51.3 (2026-03-13)**; `foreign_keys` default OFF per connection |
| PgBouncer features | full | Pool modes and what transaction mode breaks |
| Claude Code docs: best-practices, memory, costs, sub-agents | best-practices, memory, sub-agents first 40k verbatim then summary; costs full | 200-line target, import rules, AGENTS.md handling, `/doctor`, `/compact`, "Compact instructions", cost figures, subagent frontmatter and model order, 15,000-token description warning |
| Prompt caching (API docs) | first 40k verbatim, then a summary chunk; **last 15,598 characters not read**; price table, minimums and invalidation table read verbatim | TTLs, multipliers, minimum tokens per model, breakpoint rules |
| agents.md | full (paraphrased) | Format, sections, precedence, supporters, Linux Foundation stewardship |

## C. Not read this phase (open)
Netlify, Fly.io, Supabase docs; Postgres connection-count sizing; V8 and Node performance guides; bundle-analysis tool docs; HTTP/2 and HTTP/3; the installed skills (`coding-standards`, backend and frontend patterns, `search-first`, `strategic-compact`, `agentic-engineering`, `context-budget`, `token-budget-advisor`) were listed, **not read line by line**; Next.js Cache Components; Astro directives reference; the end of the prompt-caching page; hooks, skills and model-config docs.

## D. Gaps (each verified absent before being claimed)
Framework and platform specifics; web.dev optimisation numbers; Postgres traps and index rules; PgBouncer modes; SQLite WAL caveats and the corruption-bug version range; prompt-caching numbers and invalidation; CLAUDE.md and AGENTS.md rules; subagent and cost levers; **no executable check of source or of instruction files**; twin drift. Also found: two genuinely stale paths inside skills (`src/specialists/knowledge/security-checklist.md`, `specialist-skills/research/security.md`), fixed.
