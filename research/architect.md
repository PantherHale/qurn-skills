# Architect: research notes
2026-09-23 (expanded 2026-10-29)

Scope: research for the ARCHITECT specialist of an advisory-only AI coding agent. The
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

## Sources (2026-10-29 pass — spec-driven dev, task decomposition for agents, modern module patterns, risk ID)

| URL | Take |
|---|---|
| https://github.com/github/spec-kit | GitHub Spec Kit's spec-driven development (SDD) flow for AI coding agents, run as chat skills reviewed at each step: **Constitution** (once per project — governing principles: code quality, testing, maintainability) → **Specify** (what to build and why) → **Plan** (technical direction — framework, storage) → **Tasks** (break the plan into work items) → **Implement** (build from tasks) → **Converge** (check result against spec, loop implement/converge until `Converged`). The anchor idea: the specification, not the code, is the source of truth, and every later artifact traces back to it. |
| https://allstacks.com/blog/spec-driven-development | Names the failure mode this project's own plan-writing exists to prevent: "AI agents don't ask clarifying questions. Given a vague ticket, they guess and produce plausible code that may solve the wrong problem." A spec is "ready" only with all six elements present: goal statement, functional requirements, non-functional requirements, integration contracts, edge cases/failure modes, acceptance criteria — missing two or more makes it a draft, not a spec. Cites Birgitta Böckeler's maturity taxonomy: spec-first (written once, then abandoned) → spec-anchored (kept current with code) → spec-as-source (code regenerated from spec). Named anti-patterns: spec stops at goals and skips integration contracts/edge cases (exactly where agents make costly mistakes); spec lives apart from the work (e.g., an unlinked doc); spec never updated after the first pass; teams optimize for spec *volume* over quality. Explicitly wrong-tool cases: research/prototyping, exploratory UI, ML training/data pipelines (need eval harnesses, not behavior specs), production hotfixes. |
| (search, not individually fetched) OpenSpec / BMAD-METHOD / Spec Kit comparisons (developertoolkit.ai, besthub.dev) | Three-way split in the 2026 SDD tooling landscape, useful for sizing which the Architect's own "mini vs. full" plan question (Open question, below) maps onto: **OpenSpec** — lightweight, built for retrofitting specs onto an *existing* codebase (low technical complexity, low overhead — closest to this project's "mini" design-doc mode). **Spec Kit** — governance/compliance/traceability via its Constitution step (medium complexity). **BMAD-METHOD** — full multi-agent orchestration simulating an entire dev team with 19+ specialized agents (high complexity/overhead) — overkill for a single-architect advisory role like this one. To verify: exact feature parity, since star counts and version numbers in these comparison posts conflict across sources. [2026-10-30: partially verified — see 10-30 section. The three-way split holds up across more sources (OpenSpec = 3-step loop/brownfield, Spec Kit = ~6-step pipeline/governance, BMAD = full agile-team simulation, 49.5k stars per one source), but no source produces an actual feature-by-feature parity table; star counts still vary by source and date, so the fuzziness itself is now the confirmed finding, not a gap to close further.] |
| https://se-ml.github.io/agentic_patterns/03-plan-driven-task-decomposition/ | Plan-driven task decomposition pattern, directly answering "what makes a task atomic" for an AI-agent builder: "narrow objective, explicit dependencies, scoped context, and a clear verification point." Work groups into **stages** (goal + verification step) containing **tasks** (prerequisites or "None," scope, needed context, a verification action — command/test/review). Dependencies are stated explicitly, never left to implied execution order; the plan is reviewed by a human before implementation starts. Named failure modes: **drift** (agent gradually solves a different problem than intended — this project's own rule 10 by another name), **gold-plating** (agent adds unneeded structure because scope was never bounded — ties to rule 11's mini-vs-full sizing), **context pollution** (stale/irrelevant context from long sessions shapes later work). Anti-patterns: starting implementation straight from the spec with no planning step; one task for a whole feature; passing the entire codebase/transcript into every step; implicit dependencies; executing an unreviewed plan; a plan with no verification points. |
| (search, not individually fetched) task-sizing guidance for coding agents (OpenAI prompting guidance via thepromptshelf.dev, atoms.dev, augmentcode.com) | Convergent advice across several practitioner sources: **size a task like a pull request** — if you'd review the change as one PR, it's one agent task; if it would naturally split into multiple PRs, split the agent work too. Every task needs a programmatically verifiable "done when," structured (per OpenAI's own prompting guidance) as Goal / Context / Constraints / Done-when — a near-exact match to this file's existing task template (`Owns / Depends on / Done when`), reinforcing rule 2 and the templates section rather than displacing them. Parallel-agent guidance (Augment): only 2-4 agents in parallel, with explicit task boundaries — shared "hotspot" files (routes, configs) cause merge conflicts even with good task boundaries, so such files still need the single-owner "wiring phase" treatment from rule 2 even when work is split across multiple concurrent agents, not just multiple sequential tasks. To verify: a frequently repeated "58% faster with structured decomposition" figure traces to a single secondary summary with no clear primary source — do not cite that number. |
| (search, not individually fetched) context engineering as architecture (hackernoon.com, arXiv 2603.09619, metacto.com) | The clearest *shift in the last 6-12 months*: context is increasingly treated as an architectural concern, not a prompting trick — "for an AI agent that needs to plan, call tools, interpret results, preserve decisions, and continue across multiple steps, context becomes architecture." Two patterns worth folding into Architect guidance: **context isolation between sub-agents** (give a "Researcher" agent only search results, a "Writer" agent only the final outline — the same deep-module/narrow-interface discipline this file's rule 9 already applies to tasks, now applied to what context each task/agent is handed) and **separating stable scaffolding from dynamic task state** (the project's architecture docs/ADRs are the stable layer; a given task's working context is the dynamic layer — conflating them is how "context pollution" from the decomposition pattern above actually happens in practice). A March 2026 arXiv preprint (Vishnyakova) extends this to "intent and specification engineering," treating context boundaries as first-class architectural decisions alongside module boundaries — i.e., the Architect's job may increasingly include specifying *what context* a task gets, not only *what files* it owns. Caveat, explicitly flagged by the secondary source: one cited study reportedly found LLM-generated context files *reduced* task success while raising inference cost 20%+ — a reminder that more context handed to a task is not automatically better; this matches rule 9's existing bias toward narrow interfaces. [2026-10-30: the arXiv preprint itself fetched directly (arxiv.org/abs/2603.09619) — it is real: Vera V. Vishnyakova, HSE University, submitted 2026-03-10. Confirmed: it proposes five context-quality criteria (relevance, sufficiency, isolation, economy, provenance) and a four-level cumulative maturity pyramid (prompt engineering → context engineering → intent engineering → specification engineering). NOT confirmed from the abstract/paper itself: the specific "reduced task success 20%+" figure — that claim did not surface in a direct read and still traces only to the secondary summary. Treat the pyramid/criteria as citable; keep the 20%+ figure as unverified.] |
| https://milanjovanovic.tech/blog/where-vertical-slices-fit-inside-the-modular-monolith-architecture | 2026 framing that resolves a boundary-design question this file didn't previously have an answer for: modules and vertical slices operate at **different levels**, not as competing styles. A module is the **macro** decision — bounded context, public contract, data ownership, communication style (this file's existing bounded-context and hexagonal-port rules, 3 and 4). A vertical slice is the **micro** decision — feature-folder organization *inside* a module (e.g., one folder per use-case, each owning its own request/handler/response). A real modular monolith can mix internal styles per module (layered in one, vertical-slice in another, transaction-script in a third) as long as the module boundary itself stays clean — meaning the Architect should judge slice-vs-layer choices only *within* a module, never let that choice leak across a module boundary. Reinforces rule 6 (monolith stays splittable only if modularity is enforced at the API/storage layer) with a concrete internal-organization pattern for the common case of "not ready to split into services yet." |
| (search, not individually fetched) software project risk identification (ONES.com practitioner guides, Built In) | Current practitioner consensus for risk ID, useful as a companion method to this file's existing Smells/Scaling-risks lists: segment risks into **technical, organizational, external, and project-management** buckets *before* an identification session (prevents a review from being all-technical and missing vendor/compliance/resourcing risk); checklists support but don't replace a team brainstorm — individual expert insight surfaces risks groups suppress. Qualitative assessment covers "about 80% of the way for most projects," with quantitative risk modeling reserved for significant financial/regulatory exposure — directly supports this file's existing bias toward citing concrete evidence (file/line, measurement) over abstract risk scoring. AI-assisted risk identification/monitoring is a named emerging practice but with thin evidence; treat as to-verify rather than settled method. |

## Shifts in the last 6-12 months (as of 2026-10-29)

- **Spec-driven development (SDD) went from niche to a 30+ framework ecosystem.** GitHub Spec Kit (open-sourced Sept 2025) is the most-cited anchor; OpenSpec and BMAD-METHOD are the lightweight and heavyweight poles. The shared premise across all of them: once an agent can write code faster than a human can review it, the spec — not the diff — is what should be reviewed carefully. This is directly relevant to the Architect's own output shape: a phase/task breakdown *is* a spec-adjacent artifact, and the "done when" / non-goals fields this file already requires are exactly the fields SDD tooling calls out as most commonly missing.
- **Context is now discussed as an architectural layer, not a prompting detail.** "Context engineering" emerged as a named discipline in 2026, treating context-window boundaries (what a task/sub-agent is handed) with the same rigor previously reserved for module boundaries. For the Architect this suggests a fourth column alongside "owns / depends on / done when" worth considering: *context scope* — what prior decisions, files, or docs a task actually needs to see, as distinct from what it owns.
- **Modular monolith vs. microservices debate has stabilized, not resolved, toward "modular monolith by default."** Multiple 2026 sources converge on: start modular monolith, extract a service only when a specific scaling pain is unbearable — this reinforces rather than changes this file's existing MonolithFirst rule (6), but the vertical-slice-inside-a-module pattern is a genuinely new piece of guidance for the *internal* organization question this file didn't previously answer.
- **ADRs are starting to be treated as machine-readable context for coding agents, not just a human decision log.** Several 2026 sources describe exposing a project's ADR history directly to coding agents as a way to get better-grounded generated code — i.e., the ADR's audience now explicitly includes the next agent that reads the repo, not only the next human. Evidence here is thin (mostly tooling/skill blogs, not a primary methodology source) — flagged to verify, but worth the Architect noting ADRs as agent-context, not only an audit trail, when advising on their location/format. [2026-10-30: confirmed as a real, converging practitioner trend with a concrete named tool — see 10-30 section (adr-kit) — but still no primary methodology source (standards body, vendor spec); remains opinion-tier evidence, just now opinion-tier evidence from several independent writers converging on the same conventions (docs/adr/ location, reference from CLAUDE.md/AGENTS.md, status-gated trust, never-edit-only-supersede) rather than one blog's guess.]
- **Task decomposition for coding agents converged on PR-sized units with programmatic "done when."** This essentially validates and sharpens rules 2 and 9 already in this file rather than contradicting them — the main new, citable addition is the explicit comparison to pull-request granularity as the sizing heuristic, and OpenAI's own four-field prompt structure (Goal/Context/Constraints/Done-when) as a convergent third-party source for the same shape this file's task template already uses.

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

14. **A task needs a programmatically verifiable "done when," sized like a single pull request.** If a task would naturally be reviewed as more than one PR, split it; if two tasks would obviously be reviewed together as one PR, merge them. "Done when" must be checkable without judgment calls (a test passes, a fixture byte-matches, an endpoint returns X) — "looks right" is not a verification point. (se-ml.github.io plan-driven decomposition; convergent OpenAI/practitioner sizing guidance, 2026)

15. **Name each task's context scope, not only its file ownership.** Alongside "owns" and "depends on," note what prior decisions/docs/files a task actually needs to see (an ADR, a sibling module's public contract) versus what it merely touches. Handing a task the whole codebase or full project history is not more thorough — it is the "context pollution" failure mode, and a 2026 study is cited (secondhand, to verify) finding over-large generated context *reduced* task success while raising cost. This is rule 9's deep-module discipline applied to context, not just interface. (context-engineering sources, 2026; se-ml.github.io)

16. **Inside one module, the slice-vs-layer organization choice is a micro-decision that must not leak across the module boundary.** A module (bounded context, public contract, data ownership) is the macro call this file's rules 3/4/6 already govern; whether that module organizes itself as vertical slices (one folder per use-case) or classic layers is a separate, smaller call that can vary module-to-module in the same codebase without being a boundary smell — flag it only if the *module's own public contract* changes shape because of the internal choice, not because of the internal choice itself. (milanjovanovic.tech, 2026)

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

### Small design-doc template (adapted from Google + arc42, kept to Google's "mini" size for most goals)

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
- [ ] Each task's "done when" is programmatically verifiable and sized like a single pull request
- [ ] Each task's context scope is named, not just its file ownership — no task is handed more context than it needs
- [ ] A module's internal organization choice (slices vs. layers) is checked only against that module's own boundary, not treated as a cross-module smell by itself
- [ ] Risk identification covers technical, organizational, external, and project-management buckets, not just technical

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
- Bounded-context guidance assumes a domain with real vocabulary collisions; for small goals (a single-page site, a CLI script) is context-mapping overkill, and if so what's the size threshold where the Architect should skip straight to a flat task list?
- The SDD ecosystem (Spec Kit, OpenSpec, BMAD) suggests the Architect's own "mini vs. full" question (open question above) may already have external answers to borrow from — OpenSpec's lightweight/retrofit mode maps closely to this file's "mini" design doc, Spec Kit's Constitution step maps to a one-time project-level ADR. Should the Architect's references explicitly cite which named SDD framework a given mode corresponds to, or does that risk importing tooling assumptions (CLI commands, specific file layouts) that don't apply inside this project's own manifest-driven flow? (to verify)
- Context-engineering sources treat "what context a task gets" as an architectural decision on par with "what files a task owns" (rule 15). Does the Architect's output template need a formal `Context scope:` field next to `Owns`/`Depends on`, or is naming it in prose (as rule 15 currently does) sufficient given the 300-word budget? (to verify — no primary source yet establishes a template shape for this, only the principle)
- ADRs being read directly by coding agents (not just humans) as context is reported across several 2026 tooling blogs but with no primary methodology source found. If true, does that change what an ADR's "Consequences" section should say — e.g., explicit file paths or interface names an agent should check before reversing the decision — rather than the prose-only Nygard format this file's template currently uses? [2026-10-30: the named tool found (adr-kit) answers this concretely for one implementation — it adds a fenced JSON `## Enforcement` block to each ADR with machine-checkable rules (`forbid_pattern`, `forbid_import`, `require_pattern`, scoped by `path_glob`), on top of the prose Nygard/MADR body, rather than changing what Consequences says in prose. Whether the Architect's own template should add an equivalent structured block, or stay prose-only and let a downstream tool add enforcement, is still open — but the question now has a concrete existing answer to react to instead of none.]

## 2026-10-30 pass — verifying the 10-29 flags, plus one level deeper

Every item the 10-29 pass marked "(to verify)", "(search, not individually fetched)," or flagged thin was re-checked by direct fetch where a primary or near-primary source exists. Corrections/upgrades are also inlined above, next to the original flag; this section is the detail and citations behind those inline notes, plus the new ground covered.

### Verified/corrected from the 10-29 flags

| Flag from 10-29 | Resolution |
|---|---|
| ADRs being exposed directly to coding agents as context — "evidence thin, mostly tooling/skill blogs" | **Confirmed as a real, converging trend, still opinion-tier.** Direct fetches of https://tianpan.co/blog/2026/07/02/the-adr-your-agent-never-read and the repo at https://github.com/rvdbreemen/adr-kit both independently converge on the same conventions: ADRs as plain Markdown in a conventional folder (`docs/adr/`), referenced from the project's agent-instruction file (`CLAUDE.md`/`AGENTS.md`) so an agent actually finds them, status-gated trust (accepted = binding, proposed = non-binding, superseded = history only, never edited away), and point-in-code comments linking back to the ADR number. Still no standards-body or vendor primary source — it's several independent practitioners agreeing, not one methodology. |
| The Vishnyakova arXiv preprint (2603.09619) — read only via secondary summary | **Paper itself fetched directly.** Real, single-author, Vera V. Vishnyakova (HSE University), submitted 2026-03-10, cs.AI. Confirmed: five context-quality criteria (relevance, sufficiency, isolation, economy, provenance) and a four-level cumulative "maturity pyramid" (prompt engineering → context engineering → intent engineering → specification engineering), with the summary line "whoever controls an agent's context controls its behavior, whoever controls its intent controls its strategy, whoever controls its specifications controls its scale." **Not confirmed**: the specific "reduced task success while raising cost 20%+" figure attributed to this line of research — that did not appear in the direct fetch and still traces only to a secondary summary. Cite the pyramid/criteria; don't cite the 20%+ figure to this paper. |
| OpenSpec / Spec Kit / BMAD-METHOD feature-parity claim | **Partially confirmed, fuzziness itself confirmed.** Multiple 2026 comparison posts (dev.to, besthub.dev) converge on the same three-way split — OpenSpec as a lightweight ~3-step loop for brownfield/retrofit work, Spec Kit as a ~6-step governed pipeline for greenfield/project-wide rules, BMAD-METHOD as the heaviest, simulating a full agile team via specialized planning agents (analyst, PM, architect) with one source citing 49.5k GitHub stars. No source produces an actual feature-by-feature matrix; star counts and version numbers genuinely vary release to release across sources, which is why the 10-29 flag couldn't resolve it — that volatility is now the confirmed finding, not a gap to keep chasing. |
| "58% faster with structured decomposition" figure | Not re-chased further this pass (10-29 already correctly identified it as untraceable to a primary source) — still do not cite it. |
| AI-assisted risk identification as an emerging practice | Not re-verified this pass; still thin, still flagged as an emerging-but-unconfirmed practice rather than settled method. |

### New ground: concrete adoption case study, named ADR-for-agents tool, context-budgeting tooling

| Source | Take |
|---|---|
| https://asana.com/inside-asana/spec-driven-development | **The concrete real-world SDD adoption case this project previously lacked.** Asana built an internal `/spec-driven` workflow harness (spec → plan → implement → verify → ship, with session-spanning state tracking) and ran it for roughly three months. Reported, with explicit caveats: an Admin Console migration of 66 settings across ~150 cloud-agent-run migrations, 91% needing no revision after review, shipped over a month early; adoption by about half of engineers, 30-50 weekly active in the final month; across 7 engineers / 524 merged PRs over four months, PRs/week up 38%, implementation-code additions up 2.66x (≈66% even excluding one high-volume outlier window); explicit-revert rate 1.2% for `/spec-driven` PRs vs. 1.66% for other PRs. **Asana's own stated caveats, carried over verbatim because they matter**: comparisons were not controlled, so the effect of the spec workflow can't be separated from project mix or general agent-tooling improvements; PR count/code-volume are weak productivity proxies since agents can produce oversized diffs; specs took 30 minutes to multiple days and became a review bottleneck for at least one team, who found the extra process *more* complicated than just planning and implementing directly; agent-written research notes were sometimes vague or wrong with no team agreement yet on whether to trust them as documentation; the authors call the results "encouraging for an internal experiment," explicitly not proof of broad benefit. This is the single most citable piece of real adoption evidence in either pass — use it, but always with its own caveats attached, not just the headline numbers. |
| https://github.com/rvdbreemen/adr-kit | **A named, current ADR-for-agents tool**, answering the 10-29 "to verify" on this topic concretely. Turns ADRs into enforceable guardrails for coding agents: Markdown ADRs in `docs/adr/` (MADR-profile body by default, Nygard selectable), plus a fenced JSON `## Enforcement` block per ADR (`forbid_pattern`, `forbid_import`, `require_pattern`, scoped by `path_glob`) that CI/pre-commit can check with file:line citations. Agents query a generated index (`bin/adr-context`) before a task and open only the relevant ADRs rather than all of them (directly matches this file's rule 15 — context scope, not the whole decision log); a PreToolUse hook injects the governing ADR's Decision text before an edit. Supports Claude Code, Codex, Copilot CLI, OpenCode; ships an MCP server with 7 tools. Caveat: pre-1.0, 13 stars/1 fork — a real, working convention, not yet a widely-adopted standard; cite it as "one current implementation of the pattern," not "the" tool. |
| https://atlan.com/know/ai-agent/ai-agent-context/how-to-implement-context-window-management-ai-agents/ ; https://dev.to/orieken/treat-the-context-window-like-a-budget-not-a-junk-drawer-5602 | **Current context-engineering/context-budgeting tooling pattern**, the other new-ground item asked for. Converging 2026 practitioner guidance: budget the context window by category rather than treating it as one pool — rough splits cited are system prompt 10-15%, tool definitions 10-15%, conversation history 25-30%, retrieved documents 25-30%, reasoning/output 20-25% — and have the agent framework track per-category token usage, warning or truncating when a category exceeds budget. Tool-schema bloat (every connected tool's definition riding along on every call) is named as one of the most common sources of silent context bloat in 2026 agent setups — directly relevant to this file's rule 15/context-scope guidance, since it's a budget line an Architect-drawn task boundary doesn't normally think about but should. Core techniques named: write state outside the context window (a to-do list, a NOTES.md file, file-based memory) rather than keeping it all in-context; compress/summarize long-running history; isolate sub-agent context per role (same discipline as this file's existing context-isolation guidance). Caveat: percentages are heuristics from vendor/community blogs, not a benchmarked standard — cite the *categories* as the useful idea, not the specific percentages as settled numbers. |
| https://arxiv.org/html/2602.00180 (Spec-Driven Development, arXiv, brownfield case study) | A second, more academically-framed SDD case: a single-case practitioner-researcher study at a large financial institution (reported via secondary summary as Brazilian), one staff engineer coordinating four AI agents on a brownfield system under a spec-driven workflow. Not independently fetched/confirmed line-by-line this pass — flagged here as the closest thing to peer-reviewed enterprise SDD evidence found, worth a direct fetch in a future pass rather than cited by its headline alone. (to verify in a future pass — this file is now flagging its *own* new ground honestly rather than passing along an unread claim as settled) |

### What this changes for the Architect's guidance (and what it doesn't)

- Rule 7 (ADR template) and the context-engineering guidance (rule 15 and its "Shifts" entry) were load-bearing enough to update in `skills/architect-specialist/references/architect-playbook.md` and the mirrored copy in `flatten/architect.prompt.md`: rule 7 now names the discoverable-location + agent-instruction-file-reference convention (docs/adr/, referenced from CLAUDE.md/AGENTS.md, status-gated trust, never-edit-only-supersede); the context-engineering paragraph now names Vishnyakova's five context-quality criteria and four-level pyramid as a citable lens, and adds category-based context-window budgeting (system/tools/decisions/working-state as separate budget lines) as a concrete technique underneath the existing "deep module for context" principle.
- The Asana case study and the SDD-framework fuzziness do **not** change any existing rule — they're evidence *for* rules already in this file (11, 14, the SDD framing in the 10-29 "Shifts" section), not a reason to add a new one. Treat them as citation upgrades, not new guidance.
- The "mini vs. full" open question (10-29, still open) remains genuinely open — Asana's own experience (specs becoming a review bottleneck, one team finding the structure not worth it) is actually a data point *against* always reaching for the heavier mode, which the next pass should fold into that open question rather than treating SDD adoption as one-directionally good.

---

## 2026-10-31, later pass (WebSearch landscape check, ADRs for a small team)

Weaker-confidence pass (WebSearch summaries, no direct primary fetch) ahead of advancing the Marrow combined-site
build, which needed exactly one real architectural decision recorded (the brand-merge and the shared-CSS-variable
seam between the 3D-can scroll JS and the café section).

- **Converges with this file's existing ADR rule (rule 7):** independent 2026 sources (AWS Architecture Blog,
  TechTarget) restate the same shape already in this file — one decision per record, store under a discoverable
  repo path (`docs/adr/` or, as this project already does per-build, `docs/design/DESIGN.md`), status field
  (proposed/accepted/deprecated/superseded), never edit an accepted record in place. No new rule needed; this is
  corroboration, not a gap.
- **One addition worth noting for a small/single-agent project specifically:** AWS's own guidance (keep ADR
  participants under ~10, start with a pilot team before a full rollout) implicitly assumes a multi-person team;
  for a one-operator project like this repo, the equivalent discipline is just "write the record before moving on,
  even solo" — the DESIGN.md written for the Marrow merge this session follows that: it states the decision (one
  brand, not two), the reason (sub-brand voice split, not inconsistency), and the one technical seam (SITE_INK/
  SITE_TEXT now equal the café's own ink/cream) rather than leaving it to be reverse-engineered from the diff later.
