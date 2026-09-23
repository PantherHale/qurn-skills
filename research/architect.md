# Architect: research notes
2026-09-23

Scope: research for the ARCHITECT specialist of an advisory-only AI coding agent (PManagerProject nightrunner). The
Architect never edits files or runs commands — it turns a goal into phases and small tasks, each with the files it
owns and what it depends on, so no two workers touch the same file; it reads the existing project to respect its
structure, flags leaking boundaries and designs that won't scale, and mid-build it catches drift from the plan
(`src/specialists/manifest.ts` lines 120-134, checkpoints `start` + `middle`, prompt capped at 300 words). It hands
back "a phase and task breakdown with file ownership and dependencies, and the structural risks to avoid," and reads
`src/memory/project-map.ts` as its one knowledge file. Its sibling, the Delegator, turns the same breakdown into
worker counts and prompts (`src/control/night-delegation.ts`) — the Architect's job stops at *what the phases and
file boundaries are*, not *how many agents run them*.

## Sources

| URL | Take |
|---|---|
| https://c4model.com/ | Hierarchical abstraction levels (system context → container → component → code) with matching diagrams; notation- and tool-independent. Page itself was thin on decomposition rules — the value is the *level discipline*: don't mix a container-level decision with a code-level one in the same artifact. |
| https://arc42.org/overview | 12-section template; the decomposition-relevant sections are Context & Scope (§3, external systems/interfaces — the system's boundary), Building Block View (§5, hierarchically refined source/module structure, "usually the most extensive section"), and Architectural Decisions (§9). Introduction & Goals (§1) anchors quality goals that later decisions get checked against. |
| https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions | Nygard's original ADR: four sections (Title, Context, Decision, Consequences). Decision stated as "we will..." in full sentences. Consequences lists *all* outcomes, not just the good ones. Superseding an ADR marks it deprecated with a reference forward rather than deleting it — history is append-only. Rationale: "large documents are never kept up to date; small, modular documents have at least a chance." |
| https://adr.github.io/ | ADRs capture a single Architecturally Significant Requirement (a decision with "a measurable effect on the architecture and quality" of the system) plus its rationale and trade-offs. No one mandated format — cites the Y-statement (Zdun et al.) alongside Nygard's as valid templates. The set of ADRs forms a "decision log." |
| https://martinfowler.com/bliki/BoundedContext.html | A bounded context is the region where a single model/vocabulary stays consistent. "Total unification of the domain model for a large system will not be feasible" — the same word (his example: "meter") means different things in different contexts, and forcing one model across contexts is the leak. Context maps make the relationships (and the strain) between contexts visible. |
| https://martinfowler.com/bliki/StranglerFigApplication.html | Four phases for incremental legacy replacement: clarify outcomes, decompose the system (find seams where components isolate cleanly), deliver incrementally (replace one seam at a time, learn, repeat), evolve the organization. Requires a transitional architecture where old and new coexist — added complexity that's justified by lower risk and earlier ROI. |
| https://martinfowler.com/bliki/MonolithFirst.html | Start monolithic even for apps expected to grow big — "almost all successful microservice stories started with a monolith that got too big." Correct service boundaries need experience the project doesn't have on day one, and splitting later is much easier if the monolith was kept modular at the API and data-storage layers from the start. |
| https://www.industrialempathy.com/posts/design-docs-at-google/ | Google design-doc sections: Context & Scope, Goals & Non-Goals, the Design (with trade-offs), Alternatives Considered, Cross-Cutting Concerns (security, privacy, observability). Written *before* coding. Sweet spot 10-20 pages for big projects, 1-3 for "mini" ones — "short enough to actually be read." Non-goals are reasonable possibilities explicitly excluded, not negated requirements. |
| https://alistair.cockburn.us/hexagonal-architecture/ | Ports and adapters: the application core (business logic) has no dependency on any external technology; it talks through ports (interfaces), and adapters (UI, DB, test harness) plug into those ports and own all the technology-specific code. Rule: "code pertaining to the inside part should not leak into the outside part" — a leaking boundary is business logic sitting inside a controller/UI/DB-adapter file, or a DB row shape used as the domain model. |
| https://12factor.net/ | One codebase, many deploys. Config lives in the environment, never in code — deployment settings should never be a file-ownership question that a task needs to touch. Dependencies explicitly declared and isolated. Processes are stateless — a task that persists state in a process-local place instead of a shared store is a scaling risk to flag. |
| (search, not fetched) "A Philosophy of Software Design" (Ousterhout) summaries | Deep modules: simple interface, complex/valuable implementation hidden behind it. Shallow modules (big interface, little hidden value) don't pay for the complexity of learning them — a task that adds a module whose interface is nearly as complex as its implementation is a boundary smell. Classic deep-module examples: Unix file I/O (five functions, decades of internal change hidden behind them), garbage collectors (near-zero visible interface). |

## Rules

1. **Decompose top-down through named levels before naming tasks.** Fix the system boundary (what's in vs. out, arc42 §3 / C4 system-context) before naming containers, and containers before components — a task list written without first fixing *which level* it operates at tends to mix "add a route" (component-level) with "split into two services" (container-level) in the same phase. (arc42; c4model.com)

2. **Every phase's task list must partition files, not just responsibilities.** Two tasks in the same phase must not list overlapping file paths — if they legitimately need the same file, they are one task, not two, or the shared file is promoted to be owned by an earlier "wiring" phase. This is the file-ownership rule the Architect's own manifest entry names as its purpose. (manifest.ts:124-126; note the Delegator owns the actual scheduling of who runs when — the Architect only needs to make ownership *partitionable*)

3. **A bounded context boundary is where a word's meaning would have to change.** When the same noun ("user," "meter," "order") means two different things depending on which module reads it, that's the seam — put the boundary there and give each side its own type/model rather than one shared shape with optional fields. Fowler's context-map exercise (draw which contexts talk to which, and how the same term translates across the line) is the concrete tool for finding this before writing tasks. (Fowler, BoundedContext)

4. **Boundary leak = business logic that only works with one adapter's shape.** In hexagonal terms: if deleting the database adapter (or swapping the UI framework) would force a change to files outside that adapter, the boundary already leaked. Flag any task whose file list mixes a port (interface / domain type) with an adapter (DB query, HTTP client, UI component) as a boundary smell to split. (Cockburn)

5. **New capability defaults to extending the existing module structure; a new top-level module needs a named reason.** Respecting existing structure means reading how the project already draws its lines (folder layout, existing bounded contexts, existing ADRs) before proposing a different one — a plan that reorganizes structure without the goal asking for it is scope creep, not architecture. (project-map.ts is the Architect's one knowledge file for this reason — it is the record of what already exists)

6. **A monolith stays splittable only if modularity is enforced at the API and storage layer, not just by folder.** For a project that isn't a monolith-to-microservices candidate yet, still apply the same discipline: a task that reaches across a module's API into another module's private storage is a scaling risk even inside a single codebase. (Fowler, MonolithFirst)

7. **Record a decision, not just a plan, whenever a choice has a "we could have gone the other way" quality.** Use Nygard's four fields — Context, Decision, Consequences (all of them, not just upside), Title — for anything Architecturally Significant (measurable effect on architecture or quality). A decision that gets silently reversed two phases later without a superseding note is the drift signal in rule 10. (Nygard ADR; adr.github.io)

8. **Non-goals are part of the phase breakdown, not an afterthought.** Naming what a phase explicitly will NOT do (e.g., "no auth in phase 1") prevents a worker from silently expanding scope into a later phase's territory — this is the same discipline `night-delegation.ts`'s `RULED_OUT` regex encodes at the goal-scoring layer (treating "no auth, no backend" as removing those subjects from the difficulty score entirely). Google's design-doc Non-Goals section is the same idea one level up. (industrialempathy.com; night-delegation.ts:61-62)

9. **Prefer a deep module over a wide interface when splitting a phase into tasks.** A task whose "interface" to the rest of the plan (the files/functions other tasks must call) is nearly as complicated as what it does internally is a sign the task boundary is drawn in the wrong place — redraw it so the task hides more and exposes less. (Ousterhout, via secondary sources)

10. **Mid-build drift shows up as: files touched outside a task's declared ownership, a phase's non-goals violated, or a decision reversed without a new ADR.** The Architect's `middle` checkpoint exists to catch exactly this — re-read the actual diff/file list against the original phase breakdown, not just re-ask "does this look right." A COMMON_RULES-style verdict of `redo` needs cited evidence (a specific file outside scope, a specific reversed decision), never a vibe. (manifest.ts COMMON_RULES, lines 44-49; manifest.ts:127-128 "middle" checkpoint)

11. **A design doc's size should match the goal's size, not a fixed template.** Google's own practice splits "mini" design docs (1-3 pages, for incremental changes) from full ones (10-20 pages, for larger projects) on the same principle: "sufficiently detailed but short enough to actually be read." An Architect that hands back a full arc42-style breakdown for a one-file fix is not being thorough, it's burning the 300-word budget on ceremony the goal didn't ask for. (industrialempathy.com)

12. **A context diagram (even a one-line one) beats a paragraph for the system boundary.** C4's system-context level exists because "what talks to what, and what's inside vs. outside" is easier to check as a small labeled diagram (boxes + arrows, even in ASCII/text form) than as prose — use it whenever a goal introduces a new external dependency (a third-party API, a new service, a new client) so the boundary is unambiguous before tasks are cut. (c4model.com)

13. **Strangler-fig phasing applies inside a single build, not just to legacy migrations.** When a goal changes how an existing piece works (not just adds a new one), phase it the same way: keep the old path alive, build the new path alongside it, cut over, then remove the old path as its own explicit task — never as an implicit side effect of "and then delete the old code" tacked onto the task that built the replacement. This keeps the removal reviewable and revertible on its own. (Fowler, StranglerFigApplication)

## Boundary-detection heuristics (quick checks before finalizing task ownership)

- **The "delete this adapter" test**: pick a file that talks to something external (DB, filesystem, network, UI framework). If deleting it would force edits anywhere outside itself and its direct callers-through-an-interface, the boundary already leaked (Cockburn's hexagonal rule, rule 4).
- **The "same word, two meanings" test**: list the nouns each task's files use for its core data. If two tasks use the same noun for shapes that don't overlap field-for-field, that's a bounded-context seam, not a shared type waiting to be reconciled (rule 3).
- **The "who else imports this" test**: before assigning a file to one task's ownership, check whether any other planned task would need to import from it. If more than one task needs it, it's shared wiring and belongs to a dedicated phase, not to whichever task happened to create it first (rule 2, rule 4).
- **The "explain the interface in one sentence" test**: if a task's public surface (what other tasks call, what files it exports) can't be described in one sentence without listing every internal step, the module is shallow and the boundary is probably drawn around implementation detail rather than around a real capability (rule 9, Ousterhout).
- **The "would a new engineer read this folder the same way" test**: check the proposed task/phase structure against what `project-map.ts` already shows. If a newcomer reading the existing structure wouldn't guess the new layout, that's the "structure imposed, not read" smell (rule 5).

## Worked example

Goal (illustrative, sized to land around difficulty 6-7 on this project's own `night-delegation.ts` scale — a "build a feature" goal with a couple of hard-word hits): *"Add a project export feature: users pick a project, the app bundles its files and metadata into a zip, and a new panel shows export progress and history."*

Applying the rules above:

```
PHASE 1: Export core (owns: src/export/*)
  Goal: a pure function/service that, given a project id, produces a zip buffer + a metadata manifest.
  Non-goals: no UI, no progress reporting yet, no history persistence.
  Depends on: none

  TASK 1.a: export builder
    Owns: src/export/build-export.ts, src/export/manifest.ts
    Depends on: none
    Shared wiring touched: none
    Done when: given a fixture project, produces a byte-identical zip across runs (deterministic ordering)

STRUCTURAL RISK: if build-export.ts reaches into the project's live in-memory model instead of a read-only
snapshot, a concurrent edit during export becomes a race — flag before Phase 2.

PHASE 2: Progress + history (owns: src/export/progress.ts, src/memory/export-history.ts)
  Goal: progress events emitted during export are recorded and queryable as history.
  Non-goals: no UI rendering.
  Depends on: Phase 1 (calls build-export's emitted events)

PHASE 3: UI panel (owns: web/src/panels/ExportPanel.tsx, web/src/panels/export-panel.css)
  Goal: a panel that triggers an export and shows live progress + past history.
  Non-goals: no changes to how projects are listed/selected elsewhere.
  Depends on: Phase 2 (reads progress/history) — NOT Phase 1 directly, per rule 2/9 (UI should depend on the
  narrower progress/history interface, not reach past it into the export builder's internals)

SHARED WIRING: electron/preload/api.ts and electron/main/ipc-contract.ts both need the new export IPC channel
declared — single owner (the lead), touched once, after Phase 2 exists and before Phase 3 starts.
```

Note what this example demonstrates: Phase 3 (UI) is deliberately made to depend on Phase 2's narrower interface
rather than Phase 1's internals directly (rule 9's deep-module preference applied at the phase level, not just the
task level), and the shared IPC-contract file is called out once, explicitly, rather than left for whichever phase
gets to it first (rule 2, rule 4).

## Templates

### Phase / task breakdown (Architect's output shape)

```
PHASE <n>: <name>
  Goal: <one sentence, what's true when this phase is done>
  Non-goals: <what this phase explicitly does not do>
  Depends on: <phase(s) or "none">

  TASK <n.a>: <name>
    Owns (files/dirs): <exact paths — no overlap with any other task in this phase>
    Depends on: <task(s) within this phase, or "none" — this is what tells the Delegator what can run in parallel>
    Shared wiring touched: <none, or name it explicitly — package.json, routes file, entry point — and flag
                            that it must be a single owner, per rule 2>
    Done when: <observable condition, e.g. "tests pass," "endpoint returns X">

STRUCTURAL RISKS:
  - <boundary that may leak, and which two files/modules it's between>
  - <part of the design unlikely to scale past X, and why>
```

### Small design-doc template (adapted from Google + arc42, kept to Google's "mini" size for most nightrunner goals)

```
# <feature/goal> — design note

Context & Scope: <what exists today; what this goal changes>
Goals: <bullet list>
Non-goals: <bullet list — reasonable adjacent asks this explicitly excludes>
Design: <the approach, with the one or two trade-offs that mattered>
Alternatives considered: <briefly, why not>
Boundaries touched: <existing bounded contexts / modules this crosses, if any>
Risks: <scaling / boundary-leak risks, from the Smells list below>
```

### ADR stub (Nygard, for any reversible-but-significant call)

```
# ADR <n>: <short noun phrase>
Context: <forces at play>
Decision: "We will <...>."
Consequences: <all of them, positive and negative>
Status: proposed | accepted | superseded by ADR <n>
```

## Smells

- **Shared-file collision**: two tasks in the same phase list an overlapping file — either merge the tasks or move the file to a dedicated wiring phase (rule 2).
- **Cross-adapter leak**: a task's file list mixes a domain/port file with a concrete adapter (DB, HTTP, UI) file (rule 4).
- **Vocabulary stretch**: the plan reuses one type/model across two modules that use the same word differently (rule 3).
- **Silent scope growth**: a task starts touching files outside its declared ownership, or a phase starts doing something its non-goals ruled out (rule 8, rule 10).
- **Wide-interface task**: a task's contract with the rest of the plan is as complex as its implementation — split it or hide more behind it (rule 9).
- **Unmodular monolith**: cross-module reach into another module's private storage/internals, even without a services split in view (rule 6).
- **Undocumented reversal**: a decision from an earlier phase gets contradicted with no ADR update marking it superseded (rule 7, rule 10).
- **Level-mixing**: a task list that jumps between "which service owns this" (container-level) and "which function handles this" (code-level) without separating them (C4, arc42).
- **Structure imposed, not read**: a plan proposes a new top-level layout without a stated reason tied to the goal, ignoring what `project-map.ts` shows already exists (rule 5).

## Scaling risks by project type

- **Web app (client+server)**: shared types between client and server drifting apart (no single source of truth for a DTO); route file and page-registration file becoming the de facto shared-wiring bottleneck every task touches; SSR data-fetching waterfalls (12-factor's stateless-process principle broken by session-in-memory patterns).
- **Electron**: main/renderer/preload boundary is the hexagonal port in this architecture — IPC contracts (`ipc-contract.ts`, `preload/api.ts` in this very repo) are the port; a leak is renderer code reaching into Node APIs directly, or main-process code assuming a specific UI. Watch for permission/capability files (`electron/main/permissions.ts`) becoming an undeclared shared-wiring file multiple phases touch.
- **CLI**: command-registration file (the "routes" equivalent) is the shared-wiring choke point; risk is business logic living inside the command handler instead of behind a testable interface the handler calls.
- **API/backend service**: the migrations directory and the route/handler registration file are the two most common shared-wiring files; N+1 and unbounded-query risks belong to the Coder specialist, but the Architect should flag a data-access layer that isn't behind a repository-style interface as a boundary risk before scale becomes a review-time argument.
- **Mobile**: platform-specific file pairs (iOS/Android or platform.select splits) are a bounded-context-per-platform pattern; a leak is shared business logic reaching into a platform-specific view file directly instead of through a shared interface.

### Mid-build drift check (Architect's `middle`-checkpoint output shape)

```
DRIFT CHECK against PHASE <n> plan:

FILES TOUCHED OUTSIDE DECLARED OWNERSHIP:
  - <file>: planned owner was <task X>, actually touched by <task Y> — cite the diff/commit

NON-GOALS VIOLATED:
  - Phase <n> non-goal "<...>" appears to have been done anyway in <file/commit>

DECISIONS REVERSED WITHOUT A NEW ADR:
  - ADR <n> said "<decision>"; current code in <file> now does the opposite, no superseding ADR found

VERDICT: pass | fix | redo
  (redo requires at least one cited item above — never a bare "this feels off")
```

## Scaling risks by project type (expanded)

Beyond the one-line-per-type summary above, here is more detail on where each project type's boundaries tend to
crack under growth, useful when the Architect is asked specifically about scaling risk rather than initial
decomposition:

- **Web app (client+server)**: beyond the shared-DTO and route-registration risks already named, watch for a
  client-side store (Redux/Zustand/Context) that starts caching server state redundantly alongside a server-cache
  library — two sources of truth for the same data is a bounded-context violation inside a single app. Also watch
  the CSS/design-token file: if every feature phase edits the same global stylesheet, that file is unnamed shared
  wiring exactly like a routes file would be.
- **Electron**: the three-process boundary (main / preload / renderer) means every new capability crosses at least
  two ports (renderer→preload, preload→main) — a phase that adds a feature needing new main-process access should
  budget a task specifically for the IPC contract update, not fold it invisibly into the renderer task. A second
  risk: main-process code accumulating direct filesystem/OS calls without a service-layer boundary, which makes the
  main process itself a shallow module (huge interface, thin abstraction) as it grows.
- **CLI**: as commands accumulate, the argument-parsing/registration file becomes both the shared-wiring bottleneck
  and a shallow-module risk (rule 9) — if every new command requires learning the whole parser's internals to add an
  entry, the registration interface has stopped being simple. A second risk is command handlers that shell out to
  other commands' internals directly instead of through a shared library function, which silently recreates the
  cross-adapter-leak smell between "commands" that were supposed to be independent adapters onto one core.
- **API/backend service**: beyond migrations and route registration, watch for a single "utils" or "helpers" module
  that every route file imports from — it starts deep (one clear job) and drifts shallow (grab-bag of unrelated
  functions) as more tasks add "just one more helper" to it without a phase ever revisiting its boundary.
- **Mobile**: beyond platform-file leaks, watch for navigation/routing configuration becoming the shared-wiring file
  every feature phase touches (the mobile equivalent of a web app's routes file), and for a shared design-token file
  that platform-specific view files bypass with hardcoded values under time pressure — each bypass is a small
  boundary leak that compounds.

## Distilled checklist

- [ ] System/context boundary named before any container/component-level task exists
- [ ] Every task in a phase owns a disjoint file list; overlaps promoted to a wiring phase
- [ ] Shared wiring (package.json, routes, entry point, IPC contract) explicitly named and single-owned
- [ ] Each phase has stated non-goals, not just goals
- [ ] Any Architecturally Significant decision has a Context/Decision/Consequences note
- [ ] No task's interface to the rest of the plan is as complex as its implementation
- [ ] Existing structure (project-map.ts) read and respected unless the goal names a reason to change it
- [ ] Mid-build: current file diffs checked against declared task ownership; any drift cited with evidence, not opinion
- [ ] Scaling risks named per the project type table above, not generically

## Relationship to the other specialists

Reading the manifest end to end situates the Architect among five siblings, which matters for knowing what the
Architect should *not* try to do:

- **Coder** confirms the language/stack and reviews for small diffs, tests-first and build/run correctness, and owns
  the five-mistakes performance checklist. The Architect should flag a *structural* performance risk (e.g., a data
  layer with no repository boundary, rule 6) but leave the concrete performance review (indexes, batching, caching)
  to the Coder — naming both would waste the Architect's 300-word budget on someone else's job.
- **Security** owns account/subscription/privacy/auth verdicts; the Architect can and should still flag an auth
  *boundary* smell (e.g., a security check that lives inside a UI adapter instead of behind a port everything routes
  through, rule 4) without rendering its own security verdict.
- **Test Board** is the standards gate at `middle` and `end` and can demand a redo with cited evidence; the
  Architect's own `middle`-checkpoint drift check (see the Mid-build drift check template) is narrower — it verifies
  the plan was followed, not that the product meets quality bar. The two checkpoints can overlap in timing but not
  in what they're checking.
- **Delegator** is the only other specialist consulted at `start`, and it is *downstream* of the Architect's task
  breakdown, not parallel to it: the Delegator's own manifest description assumes tasks already exist with file
  ownership and dependencies named ("which tasks run in parallel and which must wait for another") — that phrasing
  is only answerable once the Architect's phase/task output exists. The two entries share a category concern (file
  ownership, "no two workers edit the same file at once" appears near-verbatim in both descriptions) but at
  different resolutions: Architect draws the partition, Delegator schedules within it.
- **Web Designer** carries its own workflow/phase discipline for web/3D goals specifically (brief → thesis → tokens →
  components → board of testers); when a goal is a web-design goal, the Architect's phase breakdown should defer to
  that workflow's ordering rather than inventing a competing one, and instead focus its own advice on file ownership
  and shared-wiring risk within that workflow's phases.

## Open questions

- How should the Architect represent a task DAG (dependencies within a phase) in a way the Delegator can consume directly without re-deriving it? `night-delegation.ts` currently scores difficulty from the raw goal text, not from an Architect-produced task graph — is there (or should there be) a structured hand-off between the two specialists, or does the Delegator re-read the Architect's prose output?
- The manifest caps the Architect's reply at 300 words — the templates above (especially the full design-doc template) don't fit in that budget for anything but the smallest goals. Does the Architect need a "mini" vs "full" mode switch, and if so what triggers it (this doc borrows Google's own mini-vs-full split as the likely answer)?
- `project-map.ts` is the Architect's only knowledge file today. Is it kept current automatically, or could the Architect be advising against stale structure without knowing it's stale? (to verify)
- The "middle" checkpoint catches drift, but the manifest doesn't specify what triggers a middle-checkpoint call versus relying on an @architect mention — is there a scheduled point (e.g., N tasks in, or per phase boundary) or is it purely on-demand? (to verify)
- Bounded-context guidance assumes a domain with real vocabulary collisions; for small nightrunner goals (a single-page site, a CLI script) is context-mapping overkill, and if so what's the size threshold where the Architect should skip straight to a flat task list?
