# Test Board: exploratory QA method and issue taxonomy
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A black-box method for actually using the running product, not just running its test suite.
Pairs with this project's own board-of-testers approach: this is what a single tester does
during one pass.

## Method
1. **Orient first.** Establish the known-good baseline (page loads, expected state) before
   trying to break anything. A screenshot or snapshot of the successful state is the reference
   every later check compares against.
2. **Explore by priority.** Core flows before secondary pages. For each page/flow: layout and
   broken images, every control clicked, forms (empty submit, invalid data, edge-case input:
   long text, unicode, special characters), navigation in and out (breadcrumbs, back button,
   deep links), the four states (empty, loading, error, overflow), console errors after every
   interaction, and mobile/tablet viewport where relevant.
3. **Confirm before reporting.** Retry a found issue once, from the same starting state, before
   writing it up -- a one-off cannot be told apart from a real bug.
4. **Document with evidence.** A screenshot (or annotated screenshot) and a short description
   per issue; link the before/after for an interactive bug.
5. **Never fake a check.** A guided walkthrough you control teaches nothing about real usage --
   that's demo theater, not QA.

## Diff-aware scoping
On a feature branch, map changed files (controllers/routes/views/components/services/styles) to
the pages and flows they affect, and test those plus anything adjacent, rather than the whole
app blind. Flag any new bug not already tracked.

## Issue taxonomy

| Severity | Definition | Example |
|---|---|---|
| critical | blocks a core workflow, causes data loss, or crashes the app | checkout broken, data deleted with no confirm |
| high | a major feature is unusable, no workaround | search returns wrong results, auth redirect loop |
| medium | works but with a real problem, workaround exists | 5s+ load, validation missing but submit still works |
| low | cosmetic or polish | typo, 1px misalignment, inconsistent hover state |

Categories to scan for: Visual/UI (layout breaks, broken images, z-index, theme issues),
Functional (broken links, dead buttons, bad redirects, state not persisting, race conditions on
double-submit), UX (confusing nav, missing loading indicator, vague error text, no confirm
before a destructive action), Content (typos, leftover placeholder text, wrong button labels),
Performance (slow loads, layout shift, excessive requests, blocking JS), Console (uncaught
exceptions, failed requests, CORS/CSP violations), Accessibility (missing alt text, unlabeled
inputs, broken keyboard nav, focus traps, poor contrast).

## Health score (optional, for a repeatable before/after comparison)
Score each tested category 0-100 (start at 100, subtract 25/15/8/3 per critical/high/medium/low
finding; Console and Links score by error/broken-link count instead), then take the weighted
average: Functional 20%, Console 15%, Accessibility 15%, UX 15%, Visual 10%, Links 10%,
Performance 10%, Content 5%. Exclude untested categories from the average rather than scoring
them zero, and label a partial run "provisional" with its coverage noted.

## Rules that keep this honest
- Never read source code during a black-box exploration pass -- test like a real user would.
- Deduplicate one root cause seen on multiple pages into a single issue.
- Never sign a user out or switch accounts to check another role's view without asking first.
