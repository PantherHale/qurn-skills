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
