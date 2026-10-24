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
