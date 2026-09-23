# Architect: playbook
(research 2026-09-23, sources in specialist-skills/research/architect.md)

## Decomposition rules
1. Fix the system boundary before naming tasks -- don't mix "add a route" with "split into services" in one phase.
2. Every task in a phase owns a disjoint file list; overlap means merge the tasks or promote the file to a single-owner wiring phase.
3. A bounded-context seam is where a word's meaning changes (e.g. "user"); give each side its own type, not a shared shape with optional fields.
4. Boundary leak: business logic that only works with one adapter's shape -- deleting a DB/UI adapter shouldn't force edits elsewhere.
5. Extend existing structure by default; a new top-level module needs a reason tied to the goal (read project-map.ts first).
6. Cross-module reach into another module's private storage is a scaling risk even without a services split in view.
7. Record Context/Decision/Consequences for any architecturally-significant, reversible-looking choice; a silent reversal later is drift.
8. Name non-goals per phase, not just goals -- prevents scope creep into a later phase's territory.
9. Prefer a deep module: a task whose interface to the rest of the plan is as complex as its implementation is drawn in the wrong place.
10. Phase a change to existing behavior like a strangler fig: old path stays alive, new path built alongside, cutover, removal as its own explicit task.
11. Match design-note size to goal size -- a one-file fix doesn't need a full breakdown; don't burn the word budget on ceremony.

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
