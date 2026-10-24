# Coder specialist

Chooses or confirms the language, framework and database from what the project already uses, preferring zero-setup storage and never requiring Docker or a database server. It reviews for small diffs, tests written first, and code that actually builds and runs, and it points the coding agent at the testing skills to use.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When choosing a stack, reviewing an implementation for performance and structure, or advising a coding agent session how to work efficiently and spend fewer tokens.
- Do not use for security or legal review (use security) or for visual design.

## As a command

Run it as `/coder <request>` in Claude Code or Gemini CLI, or `/prompts:coder <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- in the MIDDLE: is the work on track or drifting
- at the END, as a gate: does the finished work meet the standard, with evidence
- to DIAGNOSE a task that failed the same way twice: why, read-only, in one shot
- any time, asked directly

## Instructions

You are the implementation specialist. Choose or confirm the language and database from what the project already uses, preferring zero-setup storage; never require Docker or a database server. Review for small diffs, tests first, and code that builds and runs. ALSO CHECK the five performance mistakes in references/ (uncompressed JSON responses, slow database writes -- loops of single-row writes, missing indexes, unbatched inserts, dependency bottlenecks -- a heavy package for a small job or an installed-but-unused one, blocking UI updates -- synchronous work or a big parse on the main thread, setState per animation frame, unvirtualized long lists, and server-side-rendering inefficiencies -- duplicated server/client fetches, no caching of a repeated expensive computation, an unpaginated SSR payload, sequential fetches that should run in parallel); cite the file and what you found. ALSO CHECK the extended performance floor in references/ (caching, indexes, pagination, code splitting, debounced input, lazy loading, minification, connection pooling, pruned dependencies). Account, subscription, privacy and auth security belong to the SECURITY specialist, which reviews alongside you: name a gap you notice but leave that verdict to it. OVER-ENGINEERING CHECK (operator, 2026-10-05: the code must not be over-engineered, and must not carry lines nobody requires): at the middle and end, read the diff against the goal and flag, citing file and line, anything not asked for: a feature, option or setting nobody requested, an abstraction, interface, factory or wrapper with a single use, a config or plugin point nothing configures, a helper that wraps one call, a layer that only forwards, generic code for a case that does not exist, dead or commented-out code, an unused import, dependency or file, defensive handling of something that cannot happen, and comments that restate the code. Each is a FIX with the simpler version in one line; a diff that is longer than the goal needs is itself a finding. Never ask for more code to make code look thorough. EFFICIENCY (operator, 2026-09-23: the coding session must work efficiently and save tokens): hand back a short EFFICIENCY list for the session from coder-efficiency.md in references/ -- the 3 to 5 rules that matter most for this project now (grep before read, read by region, split files over 800 lines, one task per session, terse replies with no restated code, batch independent tool calls, a runnable check instead of claiming done) -- and flag its measurable signals you find (a file over 800 lines, duplicated logic, no test command, an oversized CLAUDE.md or AGENTS.md, unpinned dependencies), citing the file. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [references/performance-checklist.md](references/performance-checklist.md)
- [references/coder-efficiency.md](references/coder-efficiency.md)
- [references/coder-reference.md](references/coder-reference.md)
- [references/coder-quality-reference.md](references/coder-quality-reference.md)
- [references/code-review-army-reference.md](references/code-review-army-reference.md)
- [references/debugging-investigation-reference.md](references/debugging-investigation-reference.md)
- [references/release-readiness-reference.md](references/release-readiness-reference.md)
- [references/eng-plan-review-reference.md](references/eng-plan-review-reference.md)
- [references/devex-review-reference.md](references/devex-review-reference.md)


---

<!-- references/performance-checklist.md -->

# Coder: performance checklist

Operator, 2026-09-22: while building, the coding agent must not miss these five performance mistakes. Check for each one at the middle and end checkpoints, on every goal that writes a server, a database, a build step or a UI that renders data. Cite the actual file and line when flagging one; a generic warning is not a finding.

1. **Uncompressed JSON over the wire.** Any HTTP response over a few KB (API responses, SSR payloads, WebSocket messages) must be served with `gzip`/`br` compression (the framework's built-in compression middleware, or the server's own gzip). Watch for large arrays or nested objects serialized and sent raw. Prefer sending only the fields the client needs over sending a whole row/object "for convenience".

2. **Slow database writes.** No write in a loop; batch inserts/updates in one statement or one transaction instead of one round-trip per row. Use prepared statements/parameterized queries, not string-built SQL, for both safety and speed (the query planner reuses the plan). Index the columns a write's own lookup or `WHERE`/`ON CONFLICT` clause depends on. Wrap multi-row writes in a transaction so they commit once, not once per row.

3. **Dependency bottlenecks.** Before adding a package, check its bundle cost (a date library, an icon set or a whole UI kit pulled in for one component) and prefer a smaller one or a few lines of code. Never install a heavy dependency (a headless browser, a native binding, a full ORM) for a single simple call. Keep an unused dependency out of `package.json` entirely -- an installed-but-unused package is a build-time and audit cost with no benefit (same rule the design-board hygiene step already enforces for the web workflow).

4. **Blocking UI updates.** Never run a synchronous loop, a big JSON parse/stringify or a heavy computation on the main/UI thread inside a render or an event handler; move it to a worker, a server call, or break it into chunks with `requestIdleCallback`/`setTimeout(0)`. A `setState` (or equivalent) per animation frame is a blocking pattern too -- use refs, CSS variables or a motion library instead (the same rule the web design-board scroll section already states for animation). Long lists render virtualized, never the whole array in one pass.

5. **Server-side-rendering inefficiencies.** Do not re-fetch data on the server that the client will immediately re-fetch again (no duplicated data-fetching between server and client passes). Cache or memoize an expensive server-side computation that repeats per-request with the same inputs. Stream or paginate a large SSR payload instead of rendering the entire data set into the initial HTML. Never block the whole page's first byte on the slowest of several independent data sources -- fetch them in parallel, not one after another.

## Where this applies

This is deliberately not scoped to web design -- it applies to any project with an API, a database or a UI, not only the ones that go through the web design-board. Read it at the same checkpoints the architecture and code review already happen at (start for stack choice, middle and end for review), not only for websites.

## Extended standing checklist (operator, 2026-09-22): every project

On top of the five mistakes above, check for all of these before a goal counts as done. Missing one is a finding, cite the file.

**Performance/production floor:** cache API responses; load balancer for scaled services; index the databases; compress images; lazy-load below-fold content with skeleton loaders (not a blank screen or bare spinner); cache expensive queries; no N+1 queries; debounce input handlers; code-split by route/component; use a CDN for static assets; server-side caching; paginate large lists; run a Lighthouse audit; compress API payloads; no unnecessary re-renders; minify JS/CSS; lazy-load images/media; defer non-critical scripts; keep dependencies pruned; use database connection pooling; pause every continuous animation loop (`requestAnimationFrame`, a WebGL/three.js render loop, a CSS-driven infinite marquee or spinner tied to JS) when `document.visibilityState === 'hidden'` — a background tab with no pause still burns GPU/CPU and battery for an animation nobody is looking at; resume on `visibilitychange` back to `visible`, not by restarting the whole scene.

Account/subscription/privacy/auth security is now its own specialist's job -- see `src/specialists/knowledge/security-checklist.md` and the `security` entry in the manifest. The coder still owns performance; flag a security gap if you see one, but defer the verdict to the security specialist.


---

<!-- references/coder-efficiency.md -->

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


---

<!-- references/coder-reference.md -->

# Coder: backend, frontend and craft reference

Use with `performance-checklist.md` and `coder-efficiency.md`. Checked against primary sources 2026-10-05 (PostgreSQL/SQLite docs, react.dev, TanStack docs, web.dev, Node.js docs, TypeScript docs, Electron docs, RFCs, Google SRE book, AWS Builders' Library). Name the exact technique and the file it applies to.

## Method
Measure first (profile, query plan, network panel, bundle analyser), fix the one biggest cost, measure again. Premature optimisation is optimising unmeasured code; skipping an obvious N+1 is negligence.

## HTTP and APIs
- Status codes: **idempotent methods per RFC 9110 are GET, HEAD, PUT, DELETE, OPTIONS, TRACE — POST and PATCH are not idempotent.** 409 = conflicts with the current resource state (concurrent edit, stale version); 422 = well-formed but semantically unprocessable — keep these distinct. 429 (RFC 6585, a separate RFC from 9110) means rate-limited, may carry `Retry-After`, and **429 responses must never be cached**.
- `Idempotency-Key` for POST is a **de-facto pattern, not a ratified standard** — the IETF draft (`draft-ietf-httpapi-idempotency-key-header`) is an expired Internet-Draft. Still a good pattern: caller supplies a token, the server records the token and the mutation atomically, a retry with the same token returns the equivalent response, a retry with the same token but different parameters returns a validation error (AWS Builders' Library calls this "making retries safe with idempotent APIs").
- Caching (RFC 9111 / MDN): hashed static assets get `Cache-Control: public, max-age=31536000, immutable`; HTML gets `Cache-Control: no-cache` (which means *store but revalidate*, not *don't store* — that's `no-store`, which also loses bfcache eligibility) plus an ETag; personalised responses get `no-cache, private`; avoid `Vary: User-Agent`. A successful unsafe method (PUT/POST/DELETE) invalidates the target URI in caches. Without an explicit freshness header, caches may guess (roughly 10% of the age since `Last-Modified`) — always set `Cache-Control` explicitly rather than relying on a guess.
- Pagination: cursor/keyset for large sets. `OFFSET` reads and discards N rows on every page, gets slower as the offset grows, and can show duplicate or skipped rows when rows are inserted mid-pagination — prefer keyset ("seek") pagination.

## Databases
### PostgreSQL
- Index composite columns with equality filters first, then range; PostgreSQL docs note indexes with more than ~3 columns rarely help further.
- Use `INCLUDE (...)` for covering indexes — but index-only scans only pay off when most heap pages are "all-visible" (rarely updated tables); don't assume it always wins.
- Partial indexes for hot subsets (`WHERE billed IS NOT TRUE`) and conditional uniqueness — the predicate must match the query's `WHERE` exactly; a parameterised predicate won't match. Many disjoint partial indexes are a sign you want one composite index or actual partitioning instead.
- `EXPLAIN (ANALYZE, BUFFERS)` **actually executes the statement** — wrap a write in `BEGIN ... ROLLBACK` before running it. Compare estimated vs. actual row counts; never extrapolate a toy-table plan onto production-size data.
- Bulk load with `COPY` over looped `INSERT`s; otherwise one transaction; drop indexes/FKs before a huge load and recreate them after, then `ANALYZE`.
- Autovacuum stays on; use plain `VACUUM`, avoid `VACUUM FULL` (it takes an `ACCESS EXCLUSIVE` lock). Watch transaction ID age (`age(datfrozenxid)`) and stale replication slots — both block cleanup.
- Transaction isolation: **at Repeatable Read and Serializable, the application must retry on SQLSTATE 40001 (serialization failure)** — these levels don't silently succeed, they can abort the transaction and the caller has to catch and retry. Read Committed permits non-repeatable reads, phantoms and serialization anomalies, so use `SELECT ... FOR UPDATE` or a stricter isolation level for read-modify-write races, and always handle the retry case.

### SQLite
- `foreign_keys` is **off by default and set per connection** — turn it on explicitly every time you open a connection, don't assume it carries over. `journal_mode=WAL` persists in the database file once set; `busy_timeout` is per-connection and overwrites any prior busy handler.
- WAL mode is for a single host only — never over a network filesystem. Keep write transactions small: over 100MB may slow down, over 1GB may fail. Avoid permanently open read connections — they cause checkpoint starvation and unbounded WAL growth (default autocheckpoint is 1000 pages). Use SQLite 3.51.3+ (a WAL-reset corruption race was fixed there). Run `PRAGMA optimize` at connection open and periodically for long-lived connections, and after `CREATE INDEX`.

## Concurrency, retries, and overload (Google SRE book + AWS Builders' Library)
- **Retry at exactly one layer of the stack.** Retrying at five layers with 3 retries each multiplies load 3^5 = 243×. Cap with a retry budget (e.g. no more than ~10% of client traffic may be retries; SRE book example: 60 retries/minute/process). Use randomised exponential backoff on every retry. Never retry a permanent error or a malformed request.
- Propagate deadlines down the call chain; avoid very long deadlines (they cause bimodal latency and exhaust thread pools). Choose a timeout from the downstream latency distribution (e.g. p99.9, accepting ~0.1% false timeouts) rather than a round number.
- Under overload: keep queues short (≤~50% of thread-pool size) and shed load early rather than queueing it; degrade quality instead of failing outright; use client-side adaptive throttling that drops the lowest-criticality requests first. Cap servers by CPU cost, not request count — different requests cost very differently.
- Avoid fallback code paths that run rarely — they rot. Prefer strengthening the primary path, a caller-side retry, or a failover path that is exercised continuously (not just at disaster time).

## Node.js
Never call sync `crypto`/`zlib`/`fs`/`child_process` inside a request handler. Bound user input sizes; watch for nested-quantifier ReDoS regexes (use RE2 or a plain `indexOf` for simple matches). Treat large `JSON.parse`/`stringify` as blocking work — stream or offload it. Use worker threads for CPU-bound JS only (via a pool; they don't help I/O), transfer `ArrayBuffer`s via `transferList` instead of copying, and set `resourceLimits`. Prefer `setImmediate`; never recurse `process.nextTick` (it starves the loop). Measure with `monitorEventLoopDelay` (report p99), `performance.eventLoopUtilization`, and `performance.mark`/`measure`.

## Frontend (React/TypeScript)
- **`useDeferredValue` and debounce solve different problems — don't treat them as interchangeable.** Debounce cuts the number of *network requests*; `useDeferredValue` cuts *render cost* by letting React keep showing stale content while a slow re-render happens in the background (the child must be wrapped in `memo` for it to actually skip re-rendering, and you can show "stale" styling by comparing `query !== deferredQuery`). `startTransition` cannot wrap the `setState` of a controlled text input itself, and an update after an `await` inside a transition is not automatically still a transition — it needs to be wrapped again.
- Compute values during render; use effects only to sync with something outside React; handle user actions in event handlers, not effects. Reset state on identity change with a `key`, not an effect. Subscribe to external stores with `useSyncExternalStore`. Guard async fetch effects against stale results with an ignore flag or `AbortController`.
- `memo` only helps when props are stable and the render is actually costly — pass primitives, not freshly-created objects, and accept `children` as JSX where possible to dodge re-renders. With the React Compiler enabled, drop most manual `memo`/`useMemo`/`useCallback`. Server Components keep heavy libraries out of the client bundle and remove fetch waterfalls, but can't hold state.
- TanStack Query defaults: `staleTime: 0`, `gcTime: 5min`, 3 retries with exponential backoff — set `staleTime` deliberately per query, `'static'` for data that truly never changes. Optimistic update recipe: `cancelQueries` → snapshot in `onMutate` → restore in `onError` → invalidate in `onSettled`. Virtualise long lists with TanStack Virtual (headless; test dynamic sizing with `measureElement`).
- Metrics at p75 field data: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 are "good"; fix INP by splitting long tasks, offloading to workers, shrinking the DOM and cutting layout work — diagnosed from field data, not a lab guess. CLS: width/height or `aspect-ratio` on every media element, reserve space for late content, `font-display: optional` with a size-matched fallback. AVIF/WebP with a JPEG/PNG fallback; SVG for icons; video instead of GIF. Code-split per route with dynamic import, split vendor chunks, preload critical deferred chunks.

## TypeScript
`strict: true` does **not** include `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes` — enable those separately if you want the stricter guarantees. It does include `useUnknownInCatchVariables` (catch variables are `unknown`, narrow with `instanceof` before use) and `strictBuiltinIteratorReturn`. Use `verbatimModuleSyntax` and `isolatedModules` when a single-file transpiler (esbuild) is in the toolchain. Discriminate unions by a literal `kind` field; end exhaustive switches with `const _x: never = value`. Write type predicates (`x is T`) for custom guards at a validation boundary.

## Electron
- Run CPU-heavy main-process work in a `utilityProcess` (it can open `MessagePort`s to renderers) rather than `child_process.fork`. Bundle main-process code to cut `require()` overhead; skip polyfills Chromium already provides; call `Menu.setApplicationMenu(null)` early if using a custom/frameless window.
- Security defaults to confirm, not assume: `contextIsolation` on (default since v12), `sandbox` on (default since v20), `nodeIntegration` off for remote content (default since v5), `webSecurity` on. Add a restrictive CSP (`script-src 'self'`); validate the sender of every IPC message; never expose raw `ipcRenderer` — use `ipcRenderer.invoke` + `ipcMain.handle` for two-way calls through a narrow `contextBridge.exposeInMainWorld` API (IPC uses structured clone — no DOM nodes, `WebContents`, or class instances across the boundary). Restrict `will-navigate` and `setWindowOpenHandler`; validate before `shell.openExternal`; set a permission-request handler; avoid `file://`, use a custom protocol; flip unused fuses (e.g. disable `runAsNode`) and stay on a current Electron version.

## Code quality craft
Names say intent; small focused functions; early returns over nesting; no magic numbers; comments explain why; delete dead code; rule of three before abstracting; pure functions at the core, side effects at the edge; immutable data; make illegal states unrepresentable with types. Refactoring (Fowler): small steps under a green suite. Reviewing: correctness, tests, naming, security, performance, readability, scope. Git hygiene: small commits that say why, conventional types, secrets never committed. Each dependency is a liability — prefer the platform and small focused libraries, pin versions, update on a schedule.

## Language and tooling picks (when asked to choose)
TypeScript for a shared UI+API product; Python for data/ML/scripting; Go for small fast network services and CLIs; Rust where memory safety and speed are both required; Java/Kotlin for large enterprise or Android; Swift for Apple platforms. Database: SQLite for single-user/embedded, PostgreSQL for multi-user web, Redis only for caching/queues. Prefer the stack the project already uses; a change needs a measured reason.

## Named frameworks from the specialists themselves (verified 2026-10-05)
- **McCabe's cyclomatic complexity ceiling of 10** (discussed in McConnell's "Code Complete"): split a routine once its branch count passes 10 — NIST still cites 10 as the sound default. McConnell's **defensive programming**: barricade a module's *boundary* — validate everything crossing in from outside — rather than littering checks through internal code.
- **Fowler's "Replace Conditional with Polymorphism":** when a conditional branches on an object's type/state, move each branch into a subclass method overriding a common interface (built via "Replace Type Code with Subclasses/State/Strategy" first). The exact named fix when a switch/if-chain keeps growing to add new variants — not generic "extract function."
- **Beck's Test Desiderata:** a good test is Isolated, Composable, Fast, Inspiring, Writable, Readable, Behavioral, Structure-insensitive, Automated, Specific, Deterministic (one further property not independently confirmed this pass — treat the list as "at least these 11"). Use "Behavioral" and "Structure-insensitive" as the concrete check for whether a test checks behaviour or implementation detail.
- **Kleppmann's reliability definition:** "the system continues to work correctly, even when things go wrong" — faults are anticipated and handled, distinct from a failure (total stop). CAP: under a partition, choose Consistency or Availability. PACELC (Abadi, referenced by the same latency/consistency tradeoff DDIA Ch.9 discusses): even with no partition, every system still trades Latency against Consistency all the time — the real question isn't just "CP or AP," it's "do we favour latency or consistency by default."
- **Gregg's USE Method, exact definition:** for every resource check Utilization (% busy or % capacity used — he explicitly flags these as two different, non-interchangeable definitions), Saturation (queued work the resource can't service), Errors. Use the capacity-used definition of utilization when deciding if something is actually a bottleneck; run USE per resource (CPU, disk, network, memory) as the first triage pass before code-level profiling.
- **Abramov's synchronization model for `useEffect`:** an effect doesn't model component lifecycle (mount/update/unmount) — it synchronizes with an external system; each dependency change is one connect → disconnect(cleanup) → reconnect loop. When reviewing an effect, ask "what external system is this synchronizing with, and what's the cleanup for a stale connection," not "what should run on mount."
- **Simpson's (YDKJS) point on JS coercion:** apparent "gotchas" aren't broken — they follow the ToPrimitive/ToString/ToNumber/ToBoolean abstract operations in a learnable order. Name the specific operation involved in a coercion bug rather than issuing a blanket "never use `==`."

## Where to read more (name, do not paste)
"The Pragmatic Programmer"; "Refactoring" (Fowler); "A Philosophy of Software Design" (Ousterhout); "Designing Data-Intensive Applications" (Kleppmann); "SQL Performance Explained" and use-the-index-luke.com (Winand); postgresql.org/docs directly (EXPLAIN, indexes, transaction isolation, routine vacuuming — short and precise); sqlite.org/pragma.html and /wal.html directly; react.dev ("You Might Not Need an Effect," `memo`, `useDeferredValue`, React Compiler); tanstack.com (Query, Virtual) docs; nodejs.org "Don't Block the Event Loop" and the `perf_hooks`/`worker_threads` API docs; sre.google/sre-book (Handling Overload, Addressing Cascading Failures); AWS Builders' Library ("Timeouts, retries, and backoff with jitter," "Making retries safe with idempotent APIs," "Avoiding fallback in distributed systems"); electronjs.org security and performance tutorials; the RFC 9110/9111/6585 texts directly for any HTTP semantics claim.


---

<!-- references/coder-quality-reference.md -->

# Coder: quality floor additions

Checked 2026-10-08 against pages read that day: Prisma's query-optimisation docs (N+1), Fowler's "Feature Toggles", semver.org, Conventional Commits 1.0.0, Zod's basics page, The Twelve-Factor App (Logs) and Claude Code's best-practices guide. Use with `coder-reference.md`, `coder-efficiency.md` and `performance-checklist.md`; this file covers what those did not name.

## N+1 queries
Prisma's definition: the problem "occurs when looping through query results and performing one additional query per result." Its fixes, in order of effort: a nested read (`include`) runs two queries instead of one per row; an `in` filter over the collected ids fetches all related rows at once; a join strategy (`relationLoadStrategy: "join"`) runs one query; for GraphQL, DataLoader-style batching collects calls made in the same tick. Detect it by logging queries and counting them against rows returned. Review rule: a database call inside a loop or a `.map` is a finding until proven bounded.

## Feature toggles (Fowler, after Hodgson)
Four kinds, by lifetime and how often the decision changes: **release** toggles (days to weeks, usually static; they let unfinished work ship as latent code so trunk-based development works), **experiment** toggles (hours to weeks, decided per request so a user always sees the same variant), **ops** toggles (mostly transient; a few kill switches stay), **permissioning** toggles (years, per user group).
- Keep the decision point apart from the decision logic: one decision function, not toggle checks scattered through the code. For a long-lived toggle use a strategy object, not a growing if/else.
- Release toggles belong in source-controlled static configuration so they travel through the delivery pipeline; ops toggles may need dynamic configuration.
- Toggles are inventory with a carrying cost. Give each an owner and an expiry date or a removal task, and consider a cap on how many may exist at once.
- Testing: you need not test every combination. Test the intended production configuration and the fallback with toggles off.

## Safe schema and interface changes
Expand, migrate, contract, as three separate changes (see `architect-evolution-reference.md`). A migration that drops or renames a column in the same change that stops using it is a finding.

## Versions and commit messages
- **SemVer:** MAJOR for incompatible API changes, MINOR for backward-compatible functionality, PATCH for backward-compatible fixes. `0.y.z` means anything may change at any time. A released version is immutable: any change is a new version. To retire something, announce the deprecation in a minor release first and remove it in a later major.
- **Conventional Commits 1.0.0:** `<type>[optional scope]: <description>`, then an optional body and footers. `feat` maps to MINOR and `fix` to PATCH; a breaking change is marked with `!` before the colon or a `BREAKING CHANGE:` footer and maps to MAJOR whatever the type. The point is mechanical: generated changelogs and automatic version bumps.

## Validate untrusted data at the boundary (Zod)
`schema.parse(input)` returns a typed deep clone or throws a `ZodError`; `schema.safeParse(input)` returns `{ success, data | error }` and needs no try/catch, which is the better default at an API or form boundary. Derive the type from the schema with `z.infer<typeof schema>` so type and validator cannot drift; when `.transform()` changes the shape use `z.input` and `z.output`. Schemas with async refinements need `parseAsync` or `safeParseAsync`.

## Logs
The Twelve-Factor rule: treat logs as event streams. The app "never concerns itself with routing or storage of its output stream": it writes unbuffered to stdout and the environment captures and routes it. A service that opens and rotates its own log files is a finding. (Practice, not in that text: emit one structured JSON record per event with a level and a request id, so the stream is searchable.)

## Working with a coding agent (Claude Code's own guidance, additions only)
- After TWO failed corrections of the same problem, clear the session and write a better first prompt that includes what you learned; a clean session with a better prompt beats a long one carrying failed attempts.
- Advice versus guarantee: CLAUDE.md is advisory, hooks are deterministic. If something must happen every time (lint after each edit, block writes to a folder), make it a hook, and if the agent already does something correctly without an instruction, delete the instruction. A Stop hook that runs the check blocks the turn from ending until it passes.
- For a larger feature, have the agent interview you and write a spec, then execute it in a fresh session. A useful spec is self-contained: it names the files and interfaces, says what is out of scope, and ends with an end-to-end verification step.
- Give a reviewer in a fresh context only the diff and the criteria, and tell it to flag gaps that affect correctness or the stated requirements; otherwise it reports something regardless and drives over-engineering.


---

<!-- references/code-review-army-reference.md -->

# Coder: specialist review lenses
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

Six narrow checklists, each a different lens on the same diff. Run the ones that apply to
what changed; a lens with nothing to say is a lens that passed, not one that was skipped.

## API contract (when an API surface changed)
- Breaking changes: removed response fields, changed field types, new required params on an
  existing endpoint, changed HTTP method/status code, a renamed endpoint with no redirect/alias.
- Versioning: a breaking change shipped without a version bump; two versioning schemes mixed in
  one API (URL vs header vs query param); a deprecated endpoint with no sunset date.
- Error responses: new endpoints returning a different error shape than existing ones; a 200 on
  error or a 500 on validation failure; an error message leaking a stack trace or SQL.
- Pagination/rate limits: a new endpoint missing rate limiting that siblings have; offset-to-
  cursor pagination changed without back-compat; no total-count or next-page indicator.
- Backwards compatibility: will an older client, or a mobile app that can't force-update, still
  work? Was a webhook payload changed without notifying subscribers?

## Data migration (when a schema migration is part of the change)
- Reversibility: is there a down migration, and does it actually undo the change (not a no-op)?
- Data loss: dropping a column still holding data, truncating a type, a NOT NULL added to a
  column with existing NULLs and no backfill first.
- Lock duration: ALTER TABLE or CREATE INDEX without CONCURRENTLY on a large table; several
  ALTERs that could be one lock acquisition.
- Backfill: a new NOT NULL column with no DEFAULT and no backfill script; a backfill that
  updates every row in one transaction instead of batching.
- Multi-phase safety: does old code + new schema (mid-rollout) crash? Is a feature flag needed
  to bridge the deploy window?

## Maintainability (always)
- Dead code: unused variables/imports, functions defined but never called (grep the repo, not
  just the diff), commented-out blocks with no reason given.
- Magic numbers and string coupling: bare literals used as thresholds/limits, an error string
  used as a conditional elsewhere, hardcoded URLs/ports that belong in config.
- Stale comments: a comment or docstring describing behavior this diff just changed; a TODO
  that references work already done.
- Conditional side effects: a branch that forgets the side effect the sibling branch has (a log
  claiming an action that was conditionally skipped, a state transition updating related
  records on only one path).
- Module boundaries: reaching into another module's private-by-convention internals; a direct
  DB query in a controller/view that should go through a service.

## Performance (backend or frontend changes)
- N+1 queries: an ORM association traversed inside a loop without eager-loading.
- Missing indexes on new WHERE/ORDER BY columns, especially new foreign keys.
- Algorithmic complexity: nested loops over collections, `.find` inside `.map`, repeated linear
  search where a map/set lookup would do, string concatenation in a loop.
- Frontend bundle: a known-heavy new dependency (moment.js, full lodash) for a one-off need;
  barrel imports instead of deep imports; unoptimized static assets; missing route-level code
  splitting.
- Frontend render: sequential fetches that could be `Promise.all`; new objects/arrays created
  inline in render props (breaks memoization); missing `loading="lazy"` on below-fold images.
- Blocking async: synchronous I/O inside an async handler; `sleep()` inside an event-loop
  handler; CPU-heavy work on the main thread with no worker offload.
- Missing pagination: a list endpoint or query with no LIMIT that grows with data volume.

## Simplification (diffs over ~100 lines; advisory only, never auto-applied)
Hunts unrequested *structure*, never coverage -- never flag a test, error path or edge-case
branch for deletion; that's the testing lens's job.
- `delete`: dead code, unused flexibility, a speculative feature with no caller.
- `stdlib`: a hand-rolled thing the standard library already ships -- name the stdlib function.
- `native`: a dependency doing what the platform already does (`<input type="date">` over a
  picker lib, a DB constraint over app-level validation).
- `speculative`: a single-implementation interface, a factory with one product, a config
  nobody sets, a wrapper with one caller.
- `shrink`: same logic in meaningfully fewer lines (only worth flagging at 5+ lines saved).
Never flag: harmless redundancy that aids readability, consistency-only style matches, a
single smoke-test assert, or anything already addressed elsewhere in the same diff.

## Testing (always)
- Missing negative-path tests: new error/rejection/invalid-input handling with no test for the
  failure branch; a permission check asserted in code but never tested for "denied".
- Missing edge cases: zero, negative, max-int, empty string/array, nil, single-element
  collections (off-by-one), unicode in user-facing input.
- Test isolation: shared mutable state between tests, order-dependent tests, tests pinned to
  wall-clock time or making real network calls.
- Negative assertions gone stale: a diff that renames or removes an identifier can leave a
  standing "X is absent" assertion passing forever while guarding nothing -- grep the suite for
  the old name.
- Low-value tests: an assertion-free probe, a self-comparison, a test that only exists to keep a
  test-only export alive, a private-method test duplicated at a real boundary. Flag these as
  INFORMATIONAL (rewrite at the real boundary or retire with cause), never silently delete.
- A regression test that never demonstrably failed before the fix proves the mock, not the fix
  -- ask for the fails-at-HEAD / passes-after-fix evidence.

## Output discipline (borrowed from the source's finding format)
State severity, the file and line, a one-line summary, and the concrete fix -- never a vague
"have you considered..." Group findings by the lens that found them so the reader knows which
checklist produced what.


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

<!-- references/release-readiness-reference.md -->

# Coder / Security: pre-merge readiness gate
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A checklist to run before treating a change as mergeable/shippable, distinct from the
architect's broader 11-section strategic-review-reference.md: this is the final go/no-go gate,
not a design review.

## What to check, in order
1. **Review freshness** -- was this diff actually reviewed, and does that review still match
   the current code? A review done before several "fix"/"refactor" commits landed afterward no
   longer certifies what's about to ship -- treat it as stale, not valid.
2. **Tests, actually run** -- cite a fresh green run tied to this exact code, or run it now;
   a failing test is a hard blocker, never something to note and continue past. Check E2E and
   any judged/scored eval results separately from unit/integration -- "unit tests pass" is not
   evidence an end-to-end flow still works.
3. **Docs kept current** -- if the change ships a user-visible feature, did the changelog or
   equivalent doc actually get touched on this branch, or only the code?
4. **Description accuracy** -- does the PR/change description still match what the diff
   actually does? A stale description (missing a feature that got added, or describing
   something that was later reverted) is a real finding, not nitpicking.
5. **Deployment facts, not assumptions** -- know what this merge will actually trigger (an
   auto-deploy workflow, a manual command, nothing) before approving. A staging URL existing is
   not proof production is held back, and a merge is not proof the new code is live -- those
   are two separate claims needing two separate pieces of evidence.

## Severity discipline
- Any of the above missing or failing, when the change is genuinely user-facing, is a blocker
  worth surfacing explicitly -- not a silent pass.
- A warning (stale docs, a slightly stale review with only trivial commits since) can be
  accepted knowingly, but the acceptance should be visible in the report, not silently skipped.
- Never report "done" when a required check was skipped, degraded or not run -- say exactly what
  was and wasn't verified.

## Post-merge
- Confirm the expected deploy actually started (or name why it didn't) rather than assuming
  merge implies deploy.
- Verify the live/production surface against the new revision specifically, not just that the
  URL returns 200 -- a healthy old version looks identical to a healthy new one from the outside
  without checking the deployed revision.


---

<!-- references/eng-plan-review-reference.md -->

# Architect/coder: engineering-plan review doctrine
(adapted 2026-10-16 from github.com/garrytan/gstack, MIT license)

How an eng-manager-mode reviewer locks in a plan or diff before implementation starts. Use
the cognitive patterns to shape advice throughout, the confidence rule on every finding, and
the shared-code and test rubrics when a plan proposes extraction or test coverage.

## Cognitive patterns — how a good eng manager thinks about any plan
Apply these as a lens, not a checklist to recite:
1. **State diagnosis first.** Is the team/codebase falling behind, treading water, repaying
   debt, or innovating? A plan's right amount of rigor depends on which.
2. **Blast radius.** For every new path or integration, trace the worst case: what breaks,
   who notices, how far it spreads.
3. **Boring by default.** Budget a small number of "innovation tokens" per plan; spend them
   deliberately, default to proven technology everywhere else.
4. **Incremental change.** Prefer a strangler-fig migration or canary over a big-bang rewrite.
5. **Systems over heroes.** Design for a tired on-call engineer at 3am, not the author's own
   full attention.
6. **Reversibility.** Flags and staged rollouts make a wrong call cheap to undo — ask "can we
   back out of this in 5 minutes?" before asking "is this correct?"
7. **Failure is information.** Treat an incident or a caught bug as a free lesson, not a
   blame target; log it as a learning.
8. **Conway's Law.** Team boundaries and system boundaries drift toward each other — design
   them together, or expect the architecture to bend toward the org chart anyway.
9. **DX signals quality.** Slow CI, slow local dev and painful deploys are leading indicators
   of a quality and retention problem, not just an inconvenience.
10. **Essential vs. accidental complexity.** Ask whether a hard part is inherent to the
    problem or something the plan invented — only the first deserves budget.
11. **Two-week smell.** A feature that should be small taking two weeks is an onboarding or
    architecture problem, not a scheduling one — investigate why, don't just extend the date.
12. **Glue work.** Coordination, unblocking others and cross-team wiring have real value — a
    plan should name who owns it, not let it fall on whoever is most available.
13. **Make change easy, then make the change.** Refactor-to-enable and the behavior change
    are two different commits/PRs; don't let scope creep merge them.
14. **Own production.** Whoever builds it should feel the pager — a plan that routes all
    on-call to someone else is a design smell.
15. **Error budgets.** A 99.9% SLO has 0.1% to spend; a plan chasing 100% uptime at any cost
    is over-engineering, not rigor.

## Confidence calibration — every finding gets a number
Score every finding 1-10 and follow its display rule; never report an unscored finding.

| Score | Meaning | Display |
|---|---|---|
| 9-10 | Verified by reading the specific code; concrete bug/exploit demonstrated | Show normally |
| 7-8 | High-confidence pattern match, very likely correct | Show normally |
| 5-6 | Moderate, could be a false positive | Show with "medium confidence, verify" caveat |
| 3-4 | Low confidence, suspicious but may be fine | Suppress from the main report; keep in an appendix |
| 1-2 | Speculation | Report only if the severity would be P0 |

**Pre-emit gate:** before promoting a finding, quote the exact file:line(s) that motivate it.
If you cannot quote the motivating line, the finding is unverified — force it to 4-5, never
invent a 7+ to work around the gate. Format: `[SEVERITY] (confidence: N/10) file:line —
description`. For framework-generated symbols (ORM `Meta`, migrations, decorators), quoting
the construct that creates the symbol counts as verification — grepping for a name and not
finding it does not.

## Shared-code extraction rubric — before approving any "let's share this" proposal
- **Prove the callers.** Require at least two real, first-party call sites with file:line.
  Similar-looking names or formatting are not evidence of equivalent behavior. Generated or
  third-party copies never count as callers.
- **Reuse before extracting.** Check existing libraries/helpers first; compare inputs,
  outputs, error handling, side effects and deployment boundaries before assuming a new
  shared module is warranted.
- **Keep the helper small.** Name its contract, its callers, and the smallest migration
  order. An option-heavy helper that tries to serve every caller's edge case is worse than
  two small duplicated functions.
- **Account for the whole change.** State lines removed/added/saved for the core extraction
  separately from the total including tests and call-site integration; savings = removed -
  added, not a vibe.
- **Rank by net benefit.** Favor reliability gains and net savings over superficial
  similarity; reject a shared abstraction whose adoption/testing risk exceeds its payoff.

## Test value bar — before any proposed test is accepted
A proposed test earns its place only with all four answers; otherwise extend an existing
test or drop the proposal:
1. What observable behavior, invariant or contract does it protect?
2. What credible regression makes it fail?
3. Why doesn't existing coverage already catch that? (prefer a new row in an existing
   table-driven test over a near-duplicate test file)
4. Does it need a production-only seam (export, flag, wrapper) that no real caller needs? If
   yes, test at the real boundary instead.

A test that breaks under a behavior-preserving refactor is asserting implementation, not
behavior — rewrite it at the owning boundary unless exact output IS the contract (goldens,
wire formats, prompt bytes).

**Quality tiers for existing coverage:** ★★★ behavior + edge cases + error paths; ★★ happy
path only; ★ smoke test / existence check — never counts as real coverage.

## E2E / unit / eval decision matrix
- **E2E or integration test** when: the flow spans 3+ components/services; mocking would hide
  the real failure (API → queue → worker → DB); it's an auth, payment or data-destruction
  flow too important to trust to unit tests alone.
- **Eval test** when: a prompt template, system instruction or tool definition changed and
  quality — not just "it ran" — needs checking.
- **Unit test** when: a pure function, an internal helper with no side effects, a single
  function's edge case, or a rare non-customer-facing flow.

## Plan-reality sanity rows — catch a plan built on an unverified premise
Before trusting a plan's narrative, check it against these recurring failure patterns (each
one is named for the incident that justified it — treat them as a checklist, not prose to
skim):
- **Premise table** — does every claim the plan rests on ("13 of 28 threads ran nothing")
  have a per-item receipt, or is it an unverified aggregate?
- **Already-done check** — has the base branch already shipped this since the plan was
  written? Re-planning solved work wastes a cycle.
- **Surface check** — does the exact flag/API/CLI option the plan calls still exist on the
  current version, verified by running `--help` or reading the source, not remembered?
- **Binding decisions** — did an earlier owner decision get silently reverted by a later
  phase reverting to a stale default?
- **Numbers** — is every quoted ratio, percentage or benchmark re-derived, not carried
  forward from an earlier draft with no basis shown?
- **Deferred asks** — did the plan silently drop part of what was actually requested?
- **Scope-unit count** — did the unit of work (PRs, phases, files) grow silently between
  drafts without anyone pricing the extra review cost?

## Review sections, in order
Evaluate in this order and never skip one, even for a small plan: **1. Architecture**
(boundaries, data flow, bottlenecks, security at the API edge, one realistic production
failure per new integration) → **2. Code quality** (organization, the shared-code rubric
above, explicit error-handling gaps, technical debt) → **3. Tests** (trace every code path
and user flow, score existing coverage by the ★ tiers, apply the test value bar and E2E
matrix, flag any regression risk as CRITICAL) → **4. Performance** (N+1 queries, memory,
caching, unbounded loops — state the scale affected or mark it unknown, never invent a
benchmark).


---

<!-- references/devex-review-reference.md -->

# Coder: developer-experience review (API/CLI/SDK/docs as a product)
(adapted 2026-10-16 from github.com/garrytan/gstack, MIT license)

Applies whenever the thing being built has its own developers or integrators: a library, CLI,
SDK, API, or an internal tool other engineers will use. Treat the DX surface itself as a
product with users, not an afterthought to the feature.

## The 8 passes — rate each 0-10 with evidence, not a guess
1. **Getting started (zero friction).** Install: one command, no prerequisites? First run:
   visible, meaningful output immediately? Is there a sandbox/playground before install, a
   free tier with no credit card? Quick-start copy-paste complete and shown with real output?
2. **API/CLI/SDK design.** Naming guessable without docs, consistent grammar across the whole
   surface? Every parameter has a sensible default? 100% coverage, or do real users drop to
   raw HTTP/undocumented flags for edge cases? Can a user explore from the CLI/playground
   without opening docs? Progressive disclosure: simple call is production-ready, complexity
   revealed gradually, not required upfront?
3. **Error messages & debugging.** Trace 3 real error paths. Score each against the three-tier
   model below. Does the most actionable info ("did you mean X?") appear FIRST, not buried at
   the bottom of a long error chain (TypeScript's classic mistake)?
4. **Documentation & learning.** Find what's needed in under 2 minutes? Progressive disclosure
   for beginners vs. experts? Code examples copy-paste complete and runnable as-is? Do docs
   version-match what the user actually has installed?
5. **Upgrade & migration path.** What breaks on upgrade, and is the blast radius limited?
   Deprecation warnings actionable ("use newMethod() instead"), not just a notice? Are there
   codemods for breaking changes, or only prose migration guides?
6. **Developer environment & tooling.** Editor integration (autocomplete, inline docs)? Works
   non-interactively in CI? Types included for IDE intellisense? Cross-platform (Mac/Linux/
   Windows, ARM/x86)? Hot reload / fast feedback loop in local dev?
7. **Community & ecosystem.** Open source with a permissive license? A real place to ask
   questions with someone actually answering? Runnable, real-world examples — not just hello
   world? Pricing transparent, no surprise bills?
8. **DX measurement & feedback loops.** Can time-to-hello-world actually be measured/
   instrumented? Is there a feedback mechanism (bug reports, NPS)? Are periodic DX audits
   planned so regressions get caught?

## Error-message quality: the three tiers
- **Tier 1 (Elm-style — conversational):** first person, complete sentences, exact location,
  a suggested fix, a pointer to learn more. `I cannot do addition with String values like
  this one... Hint: use the (++) operator instead.`
- **Tier 2 (Rust-style — annotated source):** error code links to a tutorial; primary +
  secondary labels pointing at the exact source span; a help section showing the precise edit.
- **Tier 3 (Stripe-API-style — structured):** a JSON error object with `type`, `code`,
  `message`, `param` and `doc_url` — five fields, zero ambiguity for a machine caller.
The formula underneath all three: what happened + why + how to fix it + where to learn more +
the actual values that caused it. Never ship an error that states only the first of these.

## Time-to-hello-world (TTHW) benchmark tiers
| Tier | Time | Adoption impact |
|---|---|---|
| Champion | < 2 min | 3-4x higher adoption |
| Competitive | 2-5 min | baseline |
| Needs work | 5-10 min | significant drop-off |
| Red flag | > 10 min | 50-70% abandon |

## Evidence tiers when auditing a live surface
Mark every score with how it was obtained — never blend them silently:
- **TESTED** — actually walked the flow (browser, CLI invocation) and observed the result.
- **PARTIAL** — tested the entry point but not every branch (e.g. the happy path but not the
  error path).
- **INFERRED** — read the README/CHANGELOG/source and reasoned about it without executing it.
Untestable dimensions (credential entry, email verification, build times, IDE install) stay
INFERRED by design — never fabricate a TESTED score for something nobody actually ran.

## Plan-vs-reality comparison ("boomerang")
When a DX plan existed before the build, compare its predicted scores and TTHW against what
shipped. A gap here (plan said 3 minutes, reality is 8) is itself a finding — log it so the
next plan calibrates tighter, and treat a repeated gap on the same dimension as a process
problem, not a one-off miss.

## Scorecard shape
Report one row per pass with score /10, evidence tier, and the concrete artifact (screenshot,
command output, file:line) backing it — a score with no evidence is not a score.
