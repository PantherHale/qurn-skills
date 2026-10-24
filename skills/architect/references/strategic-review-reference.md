# Architect: strategic plan review (11-section rubric)
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A plan-level review checklist for a non-trivial plan, run before implementation starts and
again when drift is suspected mid-build. Each section is a lens, not a form to fill
mechanically -- skip a lens only when it genuinely does not apply, and say so.

## The eleven sections
1. **Architecture** -- component boundaries and the dependency graph; data flow for the happy,
   nil, empty and error path of every new flow; state machines including invalid transitions
   and what prevents them; what breaks first at 10x and 100x load; single points of failure;
   auth boundaries per new endpoint (who can call it, what can they change); the rollback path
   and its time cost if this ships broken.
2. **Error & rescue map** -- for every method/codepath that can fail: what can go wrong, its
   exception class, whether it's rescued, the rescue action, and what the user sees. A
   catch-all (`rescue StandardError`, bare `except Exception`) is a smell -- name the specific
   exceptions. Any gap where the user sees a raw error silently is a blocking finding.
3. **Security & threat model** -- new attack surface (endpoints, params, file paths, jobs);
   input validation at every new boundary (nil, empty, wrong type, oversized, injection
   attempts); authorization per new data access (scoped to the right user, no direct-object-
   reference leak); new secrets (env vars, rotatable); dependency risk; audit logging on
   sensitive operations. Rate each finding by likelihood x impact.
4. **Data flow & interaction edge cases** -- trace INPUT -> VALIDATION -> TRANSFORM -> PERSIST
   -> OUTPUT with shadow paths for nil/empty/wrong-type, invalid/too-long, timeout/OOM,
   duplicate/lock, stale/partial. For shared mutable state, name the invariant and its exact
   caller/time boundary, then walk both completion orders of any two overlapping async
   operations that can affect it -- naming the mechanism that prevents the bad order, not just
   a favorable schedule. For every new interaction: double-click/stale submit, navigate-away
   mid-flight, zero/huge/changing lists, duplicate/backlogged jobs.
5. **Code quality** -- fits existing patterns; duplicated logic cited by file:line (not flagged
   on resemblance alone); naming describes what, not how; missing nil/empty/boundary handling;
   over-engineering (abstractions for a problem that doesn't exist yet) and under-engineering
   (happy-path fragility) both flagged; any method branching more than 5 times gets a refactor
   note.
6. **Tests** -- diagram every new flow, codepath, job and error path, and for each: what type
   of test covers it (unit/integration/system/E2E), does it exist, what's the failure-path and
   edge-case test. Ask: what test would make you confident shipping at 2am Friday; what would a
   hostile QA engineer write to break this; what's the chaos test. Flag any test depending on
   time, randomness, external services or ordering as a flakiness risk.
7. **Performance** -- N+1 queries on every loop over an ORM association; missing indexes on new
   WHERE/ORDER BY columns; max size of every new in-memory structure; caching candidates for
   expensive/external calls; worst-case job payload and retry behavior; top 3 slowest new
   codepaths with an estimated p99.
8. **Observability & debuggability** -- structured logs at entry/exit/each branch of new
   codepaths; the one metric that proves the feature is working and the one that proves it's
   broken; trace-id propagation across new service/job boundaries; what alert and dashboard
   panel should exist day 1; could a bug reported three weeks post-ship be reconstructed from
   logs alone.
9. **Deployment & rollout** -- migration backward-compatibility and lock duration; whether a
   feature flag is warranted; migrate-then-deploy ordering; an explicit rollback plan; what
   breaks when old and new code run simultaneously during the rollout window; a post-deploy
   smoke check for the first five minutes.
10. **Long-term trajectory** -- debt introduced (code, operational, test, docs); whether this
    makes future change harder; reversibility rated 1 (one-way door) to 5 (trivially reversible);
    would this be obvious to a new engineer in 12 months.
11. **Design & UX** -- only when the plan adds or changes UI: information architecture (what
    the user sees first/second/third); a state-coverage table (feature x loading/empty/error/
    success/partial); whether mobile is a first-class consideration or an afterthought;
    baseline accessibility (keyboard nav, contrast, touch targets). Skip explicitly ("no UI
    scope") rather than silently.

## How to use it
- Produce an explicit diagram (ASCII is fine) for architecture, data flow, state machine,
  error flow, and rollback at minimum -- a described flow is weaker evidence than a drawn one.
- A finding that says "this could be a problem" without a file/line and a concrete failure
  mode is not a finding; push for the specific break.
- Keep scope decisions and deferred items visible in the output (what's accepted, what's
  explicitly deferred with a reason, what's rejected) rather than silently dropping them.
