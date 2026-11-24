# Architect: playbook
(research 2026-09-23, sources in specialist-skills/research/architect.md)

## Decomposition rules
1. Fix the system boundary before naming tasks -- don't mix "add a route" with "split into services" in one phase.
2. Every task in a phase owns a disjoint file list; overlap means merge the tasks or promote the file to a single-owner wiring phase.
3. A bounded-context seam is where a word's meaning changes (e.g. "user"); give each side its own type, not a shared shape with optional fields.
4. Boundary leak: business logic that only works with one adapter's shape -- deleting a DB/UI adapter shouldn't force edits elsewhere.
5. Extend existing structure by default; a new top-level module needs a reason tied to the goal (read project-map.ts first).
6. Cross-module reach into another module's private storage is a scaling risk even without a services split in view.
7. Record Context/Decision/Consequences for any architecturally-significant, reversible-looking choice; a silent reversal later is drift. Put ADRs in a conventional, discoverable location (e.g. docs/adr/) and reference that folder from the project's agent-instruction file (CLAUDE.md/AGENTS.md) -- coding agents only see what's pointed to, and only an accepted (not proposed) ADR should be treated as binding; a superseded one stays visible, never edited away, so the next agent that reads it sees the replacement, not a dead end.
8. Name non-goals per phase, not just goals -- prevents scope creep into a later phase's territory.
9. Prefer a deep module: a task whose interface to the rest of the plan is as complex as its implementation is drawn in the wrong place.
10. Phase a change to existing behavior like a strangler fig: old path stays alive, new path built alongside, cutover, removal as its own explicit task.
11. Match design-note size to goal size -- a one-file fix doesn't need a full breakdown; don't burn the word budget on ceremony.
12. A task needs a programmatically verifiable "done when," sized like a single pull request -- if it would naturally be reviewed as more than one PR, split it; if two tasks would obviously be reviewed together, merge them. "Looks right" is not a verification point.
13. Name each task's context scope, not only its file ownership -- note what prior decisions/docs/files a task actually needs to see versus what it merely touches. Handing a task the whole codebase/history is not more thorough, it's context pollution and has been shown to reduce task success while raising cost.
14. Inside one module, slice-vs-layer organization is a micro-decision, not a competing macro pattern -- a module (bounded context, public contract, data ownership) is the macro call (rules 3/4/6); whether it organizes internally as vertical slices (one folder per use-case) or classic layers can vary module-to-module without being a boundary smell. Flag it only if the internal choice changes the module's own public contract.

## Spec-driven development -- why agents need this framing
Coding agents don't ask clarifying questions; given a vague goal they guess and produce plausible code that solves the wrong problem. The spec-driven flow (Constitution -> Specify -> Plan -> Tasks -> Implement -> Converge) exists to put a reviewable artifact between the goal and the diff: **Constitution** (once per project -- governing principles: code quality, testing, maintainability), **Specify** (what to build and why), **Plan** (technical direction), **Tasks** (break the plan into work items -- this file's own phase/task output), **Implement** (build from tasks), **Converge** (check the result against the spec, loop until converged). The specification, not the code, is the source of truth; this file's phase/task breakdown is itself a spec-adjacent artifact, and "done when" / non-goals are exactly the fields most often missing from a weak spec.

## Context engineering -- scoping a task's context window like a module boundary
Context is increasingly an architectural concern, not a prompting detail: what a task or sub-agent is handed shapes its output the same way a module's interface shapes what depends on it. Apply the same deep-module discipline (rule 9) to context: isolate a sub-agent's context to what its role needs (a Researcher gets search results, a Writer gets the outline -- not each other's full history), and separate the stable layer (architecture docs, ADRs) from a task's dynamic working state. More context handed to a task is not automatically better -- over-large generated context has been reported (not independently confirmed from a primary source) to reduce task success while raising cost, which is rule 13 above. A 2026 single-author paper (Vishnyakova, arXiv:2603.09619) names five context-quality criteria worth checking a task's context scope against -- relevance, sufficiency, isolation, economy, provenance -- and places context engineering as the second of four cumulative maturity levels (prompt engineering -> context engineering -> intent engineering -> specification engineering); treat it as one useful lens, not a settled standard. In practice, budget the context window by category rather than handing a task everything available: system/instructions, tool definitions, prior decisions (ADRs, docs), and task-specific working state are different budget lines, and tool-schema bloat (every available tool's definition riding along on every call) is one of the most common ways a task's context gets bloated without anyone adding a single fact.

## Template
```
PHASE <n>: <name>
  Goal: <one sentence>
  Non-goals: <explicit exclusions>
  Depends on: <phase(s) or none>

  TASK <n.a>: <name>
    Owns: <exact file paths -- no overlap with sibling tasks>
    Depends on: <task(s) in this phase, or none>
    Shared wiring touched: <none, or name it -- single owner only>
    Done when: <observable condition>

STRUCTURAL RISKS:
  - <boundary that may leak, between which two files/modules>
  - <part unlikely to scale, and why>
```

## Boundary smells
- Shared-file collision: two tasks list an overlapping file.
- Cross-adapter leak: a task mixes a domain/port file with a concrete adapter file.
- Vocabulary stretch: one type reused across two modules that mean different things by the same word.
- Silent scope growth: files touched outside declared ownership, or a non-goal violated anyway.
- Wide-interface task: contract with the rest of the plan as complex as its implementation.
- Unmodular monolith: reach across a module's API into another's private internals.
- Undocumented reversal: an earlier decision contradicted with no superseding ADR.
- Structure imposed, not read: new top-level layout with no stated reason, ignoring project-map.ts.
- NOT a smell by itself: a module organized as vertical slices while a sibling module uses layers -- that's rule 14's micro-decision, flag it only if the internal choice leaks into the module's public contract.

## Scaling risks by project type
- Web (client+server): shared DTOs drift between client/server; the routes/page-registration file becomes the de facto shared-wiring bottleneck.
- Electron: main/preload/renderer is the port boundary -- the IPC contract (ipc-contract.ts, preload/api.ts) is the leak point; watch permissions files becoming undeclared shared wiring.
- CLI: the command-registration file is the shared-wiring choke point; risk is logic living in the handler instead of behind a testable interface.
- API/backend: the migrations dir and route/handler registration are the two shared-wiring files; flag a data layer with no repository-style interface.
- Mobile: platform-file pairs are a bounded-context-per-platform pattern; the leak is shared logic reaching into a platform-specific view directly.

## Drift signals (middle checkpoint)
```
DRIFT CHECK against PHASE <n> plan:
FILES TOUCHED OUTSIDE DECLARED OWNERSHIP: <file>: planned owner <task X>, actually touched by <task Y> -- cite diff.
NON-GOALS VIOLATED: Phase <n> non-goal "<...>" done anyway in <file>.
DECISIONS REVERSED WITHOUT A NEW ADR: ADR <n> said "<...>"; <file> now does the opposite.
VERDICT: pass | fix | redo (redo needs a cited item, never a vibe)
```
