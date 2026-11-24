# Architect: writing a single feature/bug spec or issue
(adapted 2026-10-16 from github.com/garrytan/gstack, MIT license)

Complements the whole-app planner-playbook (which structures an entire project plan): this is
the discipline for turning one vague ask into one precise, implementable spec or issue. Use
it when the unit of work is a feature, a bug, or a backlog item — not a whole project.

## The five phases, in strict order — never skip or collapse one
1. **Understand the why.** Do not proceed until you can answer, without hand-waving: who is
   affected; what the current behavior actually is (verified, not assumed); what it should be
   instead; why now (blocking other work, costing money, a correctness bug, compliance risk);
   and how you'll know it's done (an observable, measurable outcome — not vibes).
2. **Scope and boundaries.** Lock explicitly: what's out of scope (locking this early prevents
   creep later); what existing systems/files/tables/endpoints this touches; any ordering
   constraints; the smallest version that delivers the value (the MVP cut); and the failure
   modes and rollback options if shipped wrong.
3. **Technical interrogation — read code before asking.** Before any technical question, read
   at least one piece of real evidence from the codebase (grep the symbol, read the file) and
   cite `path:line` in the question itself. For a project-level ask with no concrete symbol
   named, read the project structure (manifest file, relevant top-level directory, any
   existing docs on the topic) and cite what you found before asking. If genuinely nothing
   relevant exists, say so explicitly and proceed as greenfield — never silently skip the
   search. Then interrogate only the categories that apply: data model (migrations, indexes),
   API (new endpoints, backward compatibility), background processing (queue, idempotency,
   failure handling), UI (new/modified components, state), infrastructure (IaC, secrets, cost),
   testing (how to test at each layer, regression risk).
4. **Draft review.** Present the full draft and ask one question: "does this accurately
   capture what you want — what did I get wrong?" Iterate until confirmed; do not advance on
   a partial or ambiguous answer.
5. **Quality gate, then file.** Only after the draft is confirmed: run a final content review,
   check for secrets/sensitive content before it leaves the machine, then file it.

**How to ask, throughout:** 3-5 questions per round max, numbered, ending the message (never
buried mid-paragraph); call out assumptions explicitly ("I'm assuming this only affects the
admin role — is that right?"); reference the actual code instead of asking generically
("this needs a new column on `orders` — or a separate table?" not "does this touch the
database?").

## Fourteen issue-quality standards — check a drafted spec against these
1. **Stakeholder context.** Explain who cares and why, from end-user, product and engineering
   angles — the implementer should understand the value, not just the mechanics.
2. **Verified current state.** Document what exists today before proposing changes, with
   file:line citations; note a verification date if the state could drift before this ships.
3. **Audit tables for landscape context.** When changing one member of a family (one worker,
   one endpoint), show the whole family's status in a table — prevents tunnel vision and
   surfaces related problems for free.
4. **Quantified impact.** Numbers, not adjectives: "47 files across 12 directories," not
   "several files"; "~500ms → ~50ms (10x)," not "improves performance." If you lack numbers,
   say so and explain how to get them.
5. **Prioritized recommendations with rationale.** Tier work (Critical/High/Medium/Low) with a
   one-sentence reason per tier, and explain the sequencing — why this order, not just what it
   is.
6. **"What's working well / do not touch."** For audits and refactors, state explicitly what
   is already correct — prevents the implementer from "fixing" something that wasn't broken.
7. **Dependency graphs for multi-part work.** A small ASCII DAG plus the rationale for why
   this order, not a prose description of dependencies.
8. **Concrete schemas and shapes.** Actual SQL, actual interfaces, actual request/response
   bodies — never pseudocode or vague description. Close enough that the implementer makes
   zero design decisions of their own.
9. **File reference table.** Full paths from repo root, with line numbers for specific logic
   changes.
10. **Testable acceptance criteria.** Numbered, pass/fail, no subjective language: "orders
    older than 30 days return HTTP 410 for all 4 roles," never "the feature works correctly"
    or "edge cases are handled."
11. **Testing pyramid.** Name what to test at each layer (unit/integration/E2E) with an
    expected count, not just "add tests."
12. **Root-cause analysis for bugs.** Explain why the problem exists before proposing the fix —
    the implementer needs the root cause to validate the fix and avoid reintroducing the same
    class of bug elsewhere.
13. **Effort breakdown per component.** "~12h" is not a plan; "2h schema + 3h service + 4h
    tests + 3h frontend" is.
14. **Rollback strategy.** For anything touching data, infra or shared state: how do we undo
    this? Even "revert the PR" is worth stating explicitly rather than leaving implicit.

## Dedupe before filing
Before filing a new spec, search existing open issues for the same keywords. Zero matches:
continue silently. One or more matches: surface them and ask whether to merge into an
existing item or file anyway — never silently file a duplicate, and never silently skip the
check because the search tooling isn't available (say so explicitly and continue without it).
