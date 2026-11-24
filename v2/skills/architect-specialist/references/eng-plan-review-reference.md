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
