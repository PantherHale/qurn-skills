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
