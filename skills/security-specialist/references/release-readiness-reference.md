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
