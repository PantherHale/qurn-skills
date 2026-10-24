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
