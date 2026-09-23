# Delegator: research notes
2026-09-23

Scope: research for the DELEGATOR specialist of an advisory-only AI coding agent (PManagerProject nightrunner). The
Delegator decides how many workers a goal needs, which tasks run in parallel vs. wait, who owns shared wiring
(package.json, entry points, routes) so parallel workers never collide, and writes each worker a self-contained
prompt — never inflating the count for a small job (`src/specialists/manifest.ts` lines 198-211, checkpoint `start`
only, prompt capped at 300 words). It hands back "the worker count, which tasks run in parallel, the order of the
rest, and who owns the shared wiring," and its one knowledge file is `src/control/night-delegation.ts` — the actual
mechanism already live in this codebase.

`night-delegation.ts` already encodes a difficulty-gated agent count (the "BridgeMind" pattern, difficulty 1-10 from
a heuristic score, not a model call): difficulty < 3 → one agent, no plan (`SOLO`); 3-6 → one agent with a five-step
plan (`PLANNED`); ≥ 7 → a plan fanned out to `min(4, 2 + floor((difficulty-7)/2))` parallel sub-agents (`fanOut`),
each told to own different files, with shared wiring (package.json, entry point, routes) reserved for the lead, which
integrates, builds and tests after sub-agents finish. `scoreGoal` explicitly excludes ruled-out subjects ("no auth,
no backend") from the score, and scores only the operator's own text (`operatorText`), stripping appended specialist
guidance so a one-line request doesn't read as 10/10 because the guidance mentions "backend" and "architecture."
Model tier is a deliberately separate axis (`night-model.ts`, referenced in the file's own header comment) — the
Delegator's job is agent count and scheduling, not which model each agent uses, though the DELEGATOR sources below
(Anthropic's lead/subagent tiering) show that tiering-by-role is still worth knowing even if this codebase currently
keeps it constant by policy.

## Sources

| URL | Take |
|---|---|
| https://www.anthropic.com/engineering/multi-agent-research-system | Scaling rule stated explicitly: simple fact-finding = 1 agent, 3-10 tool calls; direct comparisons = 2-4 subagents, 10-15 calls each; complex/broad research = 10+ subagents with clearly divided responsibilities. Orchestrator-worker beat single-agent by 90.2% on breadth-first (independent-direction) queries but is a poor fit for tasks needing shared context or many cross-agent dependencies — "most coding" was named as exactly this poor-fit case. Multi-agent systems burn ~15x the tokens of a single chat call — only worth it for high-value, parallelizable tasks. Early failures came from vague subtask descriptions causing subagents to duplicate the same work (e.g., two researchers both scanning the same time period); the fix was explicit non-overlapping task boundaries per subagent. Lead agent = Opus (planning/coordination), subagents = Sonnet (parallelizable execution) — "upgrading to Sonnet 4 is a larger gain than doubling the token budget." Failure handling: agents can't cheaply restart from scratch, so they checkpoint / save plans to external memory before hitting context limits; a failing tool should be surfaced to the agent to adapt around rather than hidden, combined with deterministic retry/checkpoint safeguards. |
| https://www.anthropic.com/research/building-effective-agents | Orchestrator-workers: a central LLM breaks down and delegates *dynamically* — used when subtasks can't be predicted/hardcoded in advance (e.g., coding changes across an unknown set of files). Parallelization has two distinct shapes: **sectioning** (independent subtasks run side by side — e.g., guardrail check + response generation at once) and **voting** (the same task run multiple times for confidence/consensus — e.g., several independent vulnerability-review passes). Core decision rule: start with the simplest solution; add agentic complexity only when it demonstrably improves outcomes, since agents trade latency and cost for capability and can compound errors autonomously. Workflows (fixed, code-orchestrated paths) fit well-defined, predictable tasks; agents (self-directed) fit open-ended ones. |
| https://code.claude.com/docs/en/sub-agents | Concrete plumbing this Delegator's output feeds: subagents get an isolated fresh context (no parent history, no already-read files) unless `isolation: worktree`/fork; up to 20 can run concurrently by default (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`), nested up to 3 deep. Each is configured with a `tools` allowlist, a `model` (`sonnet`/`opus`/`haiku`/`inherit`), and optionally `skills` preloaded at startup — i.e., a self-contained prompt is necessary *because* the subagent literally cannot see anything else. Foreground subagents block the caller; background ones run concurrently with a reduced (largely read/write-but-not-blocking) tool set. Guidance: use subagents for high-volume/verbose output you don't want in the main context, tool/permission isolation, model-tier savings (Haiku for cheap parallel work), and genuinely independent investigations; keep work in the main thread when steps need frequent back-and-forth or heavy shared context (planning→implementation→testing in one pass). |
| https://openai.github.io/openai-agents-python/handoffs/ | A different multi-agent shape worth contrasting against fan-out: a **handoff** is a full transfer of control (the receiving agent inherits conversation history by default, unlike a tool call) represented to the LLM as a callable tool (`transfer_to_refund_agent`). `input_type` lets the delegating agent pass structured context (e.g., a reason) validated before transfer; `input filters` control exactly how much history the receiving agent inherits (e.g., stripped of prior tool calls) — the handoff pattern is for *sequential specialization* (routing to the right specialist), not for parallel fan-out. |
| https://www.langchain.com/blog/langgraph-multi-agent-workflows | Three reasons to split into multiple agents at all: focus (an agent succeeds more often when it isn't choosing among dozens of tools), custom prompts/models per responsibility, and modularity (each agent can be evaluated and improved without breaking the whole). Three patterns: multi-agent collaboration (shared scratchpad, all work visible, rule-based routing — verbose), supervisor (agents keep independent scratchpads; only final outputs hit shared state; the supervisor's "tools" are literally the other agents), and hierarchical teams (supervisors of supervisors, for deeper nesting). All communicate by writing to shared graph state, not by directly calling each other. |
| (search, not fetched) LangGraph "swarm vs supervisor" comparisons | Supervisor: central router, higher token cost (~20-40% more) but centralized conflict resolution and dynamic routing; worth it when task order/routing is genuinely dynamic. Swarm: peer agents hand off directly via explicit tools, no central router call per turn, cheaper, but suits independent workloads better than ones needing central arbitration. (to verify — not independently fetched) |
| https://docs.crewai.com/concepts/crews | Two process types: sequential (tasks run in configured order — the default) and hierarchical (a manager agent delegates and validates before proceeding). Task-to-agent assignment is 1:1 and explicit in config. Cross-task dependency is expressed via a `context` field (a task consumes an earlier task's output) — the documented model is essentially a DAG expressed through explicit context references, with no separately documented native parallel-execution primitive (i.e., parallelism isn't a first-class CrewAI concept the way it is in LangGraph's network/sectioning patterns). |
| https://cvw.cac.cornell.edu/parallel/efficiency/amdahls-law | S = 1 / (Fs + Fp/N); as N→∞, S→1/Fs. Practical reading for worker counts: the *serial* fraction of the task — the part that can't be split (integration, build, shared-wiring edits, review) — caps the benefit of adding workers, independent of how good the workers are. A goal that's 10% irreducibly serial can never beat ~10x speedup no matter the worker count; past a small N the marginal worker adds coordination cost for near-zero wall-clock gain. |
| https://git-scm.com/docs/git-worktree | Multiple worktrees let independent branches be checked out and worked on simultaneously without stash/switch overhead — the practical mechanism for *actually* running file-disjoint parallel workers without them corrupting each other's working directory. Shared across worktrees: refs (branches, tags), objects, config. Per-worktree: HEAD, the index (staging area) — meaning two workers in two worktrees can each stage/commit independently without racing on the index. Caveats: a branch can't be checked out in two worktrees at once (without `--force`); submodule support is incomplete and multiple checkouts of a superproject aren't recommended; removed worktrees need explicit `git worktree remove`/`prune` or stale admin files linger. |

## Rules

1. **Worker count is gated by difficulty, not by how many files "could" be touched.** This codebase's own scale (`night-delegation.ts` `PLAN_AT=3`, `FAN_OUT_AT=7`, `MAX_WORKERS=4`) already implements the never-inflate-for-a-small-job rule from the manifest description — the Delegator's advice should reproduce this shape (one agent below the plan threshold, a plan-only tier before fan-out, a capped worker count above it) rather than defaulting to "more agents = more thorough." (night-delegation.ts:32-36, 132-141; Anthropic's own scaling table starts at 1 agent for simple fact-finding)

2. **Fan out only when subtasks are genuinely independent — file-disjoint AND context-disjoint.** File-ownership independence (no two workers touch the same file, matching the Architect's task partition) is necessary but not sufficient: if worker B's output must inform worker A's decision, they're sequential regardless of file overlap. The 90.2% win Anthropic measured was specifically for breadth-first, independent-direction queries; the same source names tasks needing shared context or many cross-agent dependencies — "most coding" — as a poor fit for blind fan-out. (multi-agent-research-system; building-effective-agents on orchestrator-workers being for *unpredictable* subtasks)

3. **Find independence from the Architect's task DAG, not by guessing.** A task can run in parallel with another exactly when: it owns a disjoint file set, it does not depend on the other's output, and neither reaches into the shared-wiring files reserved for the lead. Where the DAG is a chain (B needs A's file), schedule serially even if the file sets don't literally overlap yet. (this project: fanOut's instruction to "split it into up to N independent pieces that touch different files," night-delegation.ts:113-117)

4. **Shared wiring gets exactly one owner: the lead/orchestrator, not a sub-agent.** package.json, the entry point, and the routes/registration file are the recurring collision points across every framework; this project's own fan-out directive names these three explicitly and assigns them to the delegating agent, with sub-agents integrated back in afterward. (night-delegation.ts:115-117) Generalize: any file that every task would otherwise need to import from or register into (a router, a DI container, a shared types file, a CI config) belongs to this same single-owner bucket.

5. **Isolate parallel workers physically, not just by convention.** Where the harness supports it (this project runs on Claude Code subagents), file-disjoint task ownership is a *plan-level* guarantee, but a git worktree per worker (or per-worker workspace) is the *mechanical* guarantee that a worker's uncommitted edits can't race another's, since HEAD and the index are per-worktree while refs/objects are shared. Reserve this for work that will actually touch git state concurrently; skip it for read-only or single-file tasks. (git-worktree docs)

6. **Cap the fan-out width below the point where coordination eats the parallel gain.** Amdahl's law's shape — speedup saturating at 1/serial-fraction — is the formal version of this project's `MAX_WORKERS = 4` and the `2 + floor((difficulty-7)/2)` taper: past a handful of workers, the serial remainder (integration, build, test, review) dominates wall-clock time regardless of added workers, so the count should grow slowly with difficulty, not linearly. (night-delegation.ts:36,136; Amdahl's law)

7. **A self-contained worker prompt exists because the worker cannot see anything else.** Claude Code subagents start with a fresh, isolated context window by default — no parent history, no files already read, no shared memory — so every fact a worker needs (what it owns, what it must not touch, what "done" looks like, and what it can assume other workers are doing) must be in the prompt itself. A vague prompt is the single most-cited cause of wasted parallel work (Anthropic's semiconductor-research example: two subagents redundantly searched the same period because scope wasn't spelled out). (code.claude.com/docs/en/sub-agents; multi-agent-research-system)

8. **Choose the delegation shape (fan-out vs. handoff vs. supervisor loop) to match the actual task shape.** Fan-out/sectioning is for independent pieces done in parallel and merged once (this project's model). A handoff is for sequential specialization — routing to the one right specialist and transferring full context, not running many at once. A supervisor pattern is for dynamic routing where the next step depends on what came back, and is worth its higher token overhead only when routing is genuinely unpredictable turn to turn. Don't reach for handoff/supervisor machinery when the job is a flat set of independent files (fan-out is cheaper and matches this project's model). (OpenAI Agents SDK handoffs; langgraph-multi-agent-workflows)

9. **Model tier follows the role, when tiering is allowed at all.** Anthropic's own system uses a stronger model for the lead/orchestrator (planning, decomposition, synthesis) and a cheaper model for subagents doing bounded, parallelizable execution — the asymmetry exists because coordination quality bounds the whole system's output more than any one worker's raw capability does. NOTE for this project specifically: `night-delegation.ts`'s header comment states model tier is a *deliberately separate, non-inferred* decision here (Sonnet by default, Opus/Haiku only on explicit operator ask) — the Delegator should not silently reintroduce difficulty-based tiering into a codebase that has explicitly ruled it out; it can still name *within its own advice* which role would benefit from which tier, leaving the actual tier selection to the operator/`night-model.ts` policy. (night-delegation.ts:9-14; multi-agent-research-system)

10. **A trivial "independent" piece should be reclaimed by the lead, not given its own worker.** This project's fan-out directive says exactly this: "If a piece turns out to be trivial, do it yourself instead" — spinning up a worker has fixed overhead (prompt-writing, isolation, later integration) that a two-line change doesn't repay. (night-delegation.ts:117-118)

11. **Failure handling: let a worker report a stuck tool/task rather than silently degrade, and don't force a full restart.** Multi-agent systems should surface a failing step back to the coordinating agent so it can adapt (retry, reassign, or narrow scope) instead of masking it; checkpoint intermediate results so a failed worker's partial progress isn't thrown away on retry. Combine this adaptive layer with deterministic guardrails (retry limits, a build/test gate the lead always runs after integration) rather than relying on the workers to self-police. (multi-agent-research-system on checkpointing and adaptive failure surfacing)

12. **A network/sectioning shape needs no central router at all when tasks truly don't depend on each other's output.** LangGraph's "network" architecture is named for exactly the case where "there is no clear hierarchy of agents or specific order in which agents must be called" — this is the cheapest possible parallel shape (no per-turn routing decision, no supervisor call), and it's the shape this project's own `fanOut` directive already assumes. Reach for a supervisor/handoff shape only when the network shape's assumption (no ordering needed) is false. (langgraph-multi-agent-workflows; night-delegation.ts fanOut)

13. **Voting (running the same task N times) is a different kind of "parallel" than sectioning, and this project doesn't currently use it.** Anthropic's parallelization pattern includes running an *identical* task multiple times for confidence (e.g., several independent security-review passes, majority vote). This project's `fanOut` is pure sectioning (different files, one pass each) — if a future goal wants confidence-through-redundancy (e.g., "have three passes independently check this migration is safe"), that is a distinct decision from bumping the worker count for difficulty, and the Delegator should name it explicitly as voting rather than silently blending it into the difficulty-gated worker count. (building-effective-agents)

## Finding independence: a DAG-first checklist

Before assigning anything to "runs in parallel," build (even mentally, even in the 300-word budget as a compressed
list) the dependency graph the Architect's task breakdown implies, then apply these checks in order:

1. **File-ownership check**: do the two tasks' declared file lists intersect? If yes, they cannot run in parallel —
   either merge them into one task or move the intersecting file to a shared-wiring phase owned by the lead (rule 4).
2. **Output-dependency check**: does either task's description reference "the result of," "based on what X finds,"
   or similar? If yes, that's a DAG edge — schedule serially even though the files might not overlap yet (rule 3).
3. **Shared-wiring check**: does either task need to import from, register into, or modify a file more than one task
   would otherwise touch (router, DI container, package.json, IPC contract)? If yes, pull that piece out into a
   lead-owned step that runs either before the parallel set (if both need it to exist first) or after (if it's
   integration) — never inside one of the parallel tasks itself (rule 4).
4. **Amdahl gut-check**: after the DAG is drawn, estimate what fraction of total effort is the serial remainder
   (shared-wiring setup + the final integration/build/test step). If that fraction is large relative to the
   parallelizable middle, a bigger worker count won't help — this is when the Delegator should recommend PLANNED
   (one agent, plan, no fan-out) even if the goal's raw difficulty score would suggest fan-out (rule 6).
5. **Triviality check**: for each piece that survives checks 1-3 as "parallelizable," ask whether it's small enough
   that writing its self-contained prompt costs more than doing it inline would. If so, fold it back into the lead's
   own work (rule 10).

## Worked example

Using this project's own `scoreGoal`/`delegationFor` mechanics (`night-delegation.ts`) against an illustrative goal:
*"Build a full export feature: bundle a project into a zip with metadata, add a progress panel, and record export
history — no auth changes needed."*

Walking the heuristic: "backend," "database," "auth" are not present as hard-word hits; "no auth changes needed"
would in fact strip "auth" via the `RULED_OUT` pattern if it appeared. Words like "build," "add," "panel," "feature"
hit `MEDIUM_WORDS` (+1). Length likely crosses the `words > 12` and `words > 30` thresholds (+2). No 3D, no explicit
"very big," no bullet list in this phrasing — so this goal likely lands around difficulty 5-6: above `PLAN_AT` (3)
but below `FAN_OUT_AT` (7). Per this project's own thresholds, that's the **PLANNED** tier: one agent, a five-step
plan, no sub-agents — even though the goal has three visibly separable pieces (export core, progress/history,
UI panel), because none of them individually justifies fan-out's overhead at this difficulty, and (per the DAG-first
checklist above) the UI panel task depends on the progress/history task's interface, which depends on the export
core's events — a mostly-serial chain, not an independent set, which further argues against paying fan-out's
coordination cost even if the raw score had landed at 7.

Contrast with: *"Build a full-stack real-time multiplayer backend with auth, a database, and a REST API, plus a
matching frontend — from scratch."* This hits `full-stack`, `backend`, `auth`, `database`, `api`, `real-time`,
`from scratch` — six-plus `HARD_WORDS` matches alone — well past `FAN_OUT_AT`. Here the Delegator's job is different:
identify which of {auth, database schema, API routes, real-time transport, frontend} are genuinely file-disjoint and
context-independent (per the DAG-first checklist) before committing to the worker count `night-delegation.ts` would
compute, since a high difficulty score justifies *considering* fan-out but the actual DAG might still force some of
those pieces to run serially (e.g., API routes likely depend on the database schema existing first).

## Templates

### Delegation decision (Delegator's output shape, mirroring this project's `Delegation` type)

```
DIFFICULTY: <1-10, from the goal text alone — ignore appended specialist guidance/build reports>
WORKERS: <1, or up to project MAX_WORKERS>
PLAN: <yes/no — plan required at/above the plan threshold even when workers = 1>

PARALLEL SET A (run together, no shared files, no cross-dependency):
  - Task <x>: owns <files>; depends on: none
  - Task <y>: owns <files>; depends on: none

SERIAL AFTER (waits on Parallel Set A):
  - Task <z>: owns <files>; depends on: <x>, <y> output

SHARED WIRING (single owner = lead, not delegated):
  - package.json / entry point / routes / <project-specific shared file>

INTEGRATION: lead merges worker output, resolves any touch on shared wiring, builds, runs tests.
IF A PIECE IS TRIVIAL: lead does it directly instead of spinning up a worker.
```

### Self-contained worker prompt template

```
ROLE: <one line — what specialty/perspective this worker brings, if relevant>
OBJECTIVE: <the single outcome this worker must produce — one sentence>
OWNS (files/dirs): <exact paths — must not overlap any sibling worker's ownership>
DO NOT TOUCH: <shared wiring and any sibling's files, named explicitly>
CONTEXT YOU NEED: <everything the worker must know because it starts with nothing —
                    relevant existing code/conventions, the goal, constraints ruled out>
DEPENDS ON: <none, or "the output of Task X" — if non-none, this worker should not be
             dispatched until that output exists>
OUTPUT FORMAT: <what to hand back — a diff, a file, a report — and how the lead will consume it>
DONE WHEN: <an observable, checkable condition>
MODEL: <tier, if the harness allows per-worker tiering>
```

### Model-tier note template (advisory only — this project keeps tier selection separate from delegation)

```
DELEGATION advises worker count and scheduling only. If asked to also comment on model tier per role:

  LEAD/ORCHESTRATOR: benefits most from a stronger tier when the plan itself is complex to decompose
                      (matches Anthropic's Opus-lead/Sonnet-worker split for planning-heavy roles).
  PARALLEL WORKERS:  a bounded, well-specified piece of a fan-out rarely needs the strongest tier —
                      note this as an observation, not a directive.
  FINAL NOTE: tier selection stays with the operator / night-model.ts policy (Sonnet by default,
              Opus/Haiku only on explicit per-message ask). Do not infer tier from difficulty.
```

## Smells

- **Worker count scaled to file count instead of difficulty/independence** — inflates cost without matching Anthropic's or this project's own scaling curve (rule 1, rule 6).
- **"Independent" tasks that actually share context** — file-disjoint but one needs the other's decision or output; scheduled parallel anyway (rule 2, rule 3).
- **Shared wiring given to a sub-agent** — package.json/routes/entry point edited by more than one worker, or by a worker instead of the lead (rule 4).
- **Vague worker prompt** — missing "do not touch," missing done-condition, or assuming the worker can see prior conversation/context it can't (rule 7; code.claude.com isolation model).
- **Handoff used where fan-out was needed, or vice versa** — sequential specialization routed as if it were parallel-independent work, or a genuinely dynamic routing problem forced into a fixed fan-out (rule 8).
- **A trivial task spun up as its own worker** — overhead not repaid by the work (rule 10).
- **No integration/build gate after fan-in** — parallel pieces merged without the lead running build+tests, so a per-worker "done" doesn't mean the whole is done (rule 11, night-delegation.ts:117).
- **Difficulty score polluted by appended guidance** — scoring the whole prompt (including specialist notes, build reports) instead of just the operator's own text, inflating difficulty on every subsequent turn (night-delegation.ts's own fix via `operatorText`/`APPENDED`, rule 1).
- **Silent re-introduction of difficulty-based model tiering** in a codebase whose model-tier policy is deliberately separate and non-inferred (rule 9; night-delegation.ts:9-14).
- **DAG re-derived from scratch instead of consumed from the Architect** — the Delegator scoring parallelism straight off the raw goal text when a task/dependency breakdown already exists upstream, risking disagreement between the two specialists about what's independent (see Relationship section, and Open Questions).
- **Voting mistaken for sectioning, or vice versa** — treating "run the same review three times for confidence" the same as "split three different files across three workers"; the two have different costs and different reasons to exist (rule 13).
- **Coordination shape mismatched to the task's actual ordering need** — reaching for a supervisor/handoff pattern's overhead when the tasks have no real ordering dependency and a plain network/sectioning fan-out (this project's model) would do (rule 12).

## Framework comparison at a glance

A quick reference for when another framework's documented shape maps onto this project's own delegation vocabulary:

| Framework concept | Nearest equivalent here | When it's the right lens |
|---|---|---|
| LangGraph "network" (no fixed order, parallel/map-reduce friendly) | `fanOut` with a `PARALLEL SET` | Tasks have no ordering dependency at all |
| LangGraph "supervisor" (router decides next agent from shared state) | Not currently modeled in `night-delegation.ts` | Routing must be decided dynamically, turn to turn, from results so far |
| OpenAI Agents SDK "handoff" (full control transfer, history inherited) | Not currently modeled in `night-delegation.ts` | One specialist must take over completely, not run alongside others |
| CrewAI "sequential process" | `PLANNED` (one agent, ordered plan, no fan-out) | The whole goal is one ordered chain with no independent branches |
| CrewAI "hierarchical process" (manager delegates + validates) | The lead's own integration/build/test gate after `fanOut` | A single coordinator must validate before proceeding — already implicit in this project's fan-out directive |
| Anthropic "voting" (same task run N times) | Not currently modeled in `night-delegation.ts` | Confidence through independent redundancy is worth more than coverage of more ground |

The practical reading: this project's `night-delegation.ts` has deliberately implemented one shape (network/sectioning
fan-out with a single lead for wiring and integration) out of the several the wider field documents. The Delegator's
job is to apply that one shape well — per rule 12, reaching for supervisor/handoff/voting machinery this project
doesn't otherwise use should be a deliberate, named exception, not a default.

## Distilled checklist

- [ ] Difficulty scored from the operator's own text only, guidance/build-report stripped
- [ ] Worker count matches the plan/fan-out thresholds — never inflated for file count alone
- [ ] Every parallel task pair checked for both file-disjointness AND context-independence
- [ ] Exactly one owner named for every shared-wiring file
- [ ] Each worker prompt is self-contained: objective, ownership, do-not-touch, context, dependency, output format, done-condition
- [ ] Any task that turns out trivial is reclaimed by the lead instead of dispatched
- [ ] A build/test/integration step is scheduled after fan-in, owned by the lead
- [ ] Sequential-specialization (handoff-shaped) needs are not forced into a parallel fan-out, and vice versa
- [ ] Model-tier suggestions (if any) respect this project's explicit "tier is a separate, non-inferred decision" policy
- [ ] Failure path named: what happens if one worker in a parallel set fails (retry, reassign, or lead absorbs it)
- [ ] DAG-first checklist applied (file-ownership, output-dependency, shared-wiring, Amdahl gut-check, triviality) before any parallel-vs-serial call
- [ ] Voting (redundant confidence-check passes) not silently conflated with sectioning (independent-file fan-out) when both could apply
- [ ] Coordination shape (network/sectioning vs. supervisor vs. handoff) matches the task's actual ordering need, not just its difficulty score

## Relationship to the other specialists

The manifest situates the Delegator among five siblings, all consulted differently:

- **Architect** is the Delegator's direct upstream: its manifest description explicitly separates the two ("no two
  tasks edit the same file at once" is the Architect's phrasing; "no two workers edit the same file at once" is the
  Delegator's) — same invariant, two different resolutions. The Architect draws the phase/task partition and names
  dependencies; the Delegator's entire job (worker count, parallel-vs-serial, shared-wiring ownership, prompts) is
  downstream of that partition already existing. A Delegator that re-derives task boundaries from the raw goal
  instead of the Architect's breakdown risks disagreeing with it — see Open Questions below.
- **Coder** confirms stack and reviews implementation; the Delegator should not duplicate the Coder's job by
  deciding *what* a worker should build, only *how many* workers and in what order. A worker prompt's OBJECTIVE
  field states what to build (drawing on the Architect's task description); the Coder later reviews whether it was
  built well.
- **Security** and **Test Board** operate at `middle`/`end` checkpoints reviewing the merged result; the Delegator
  is `start`-only. This means the Delegator's shared-wiring and integration-gate advice (rule 4, rule 11) is what
  determines whether Security/Test Board even get a coherent, already-integrated artifact to review — if the lead
  skips the integration/build gate after fan-in, the `middle` checkpoint inherits a half-merged state.
- **Both Architect and Delegator share the `start` checkpoint.** Since only one of them can speak first in a given
  turn's guidance, and the Delegator's manifest description assumes task/dependency information already exists, the
  practical reading is that the Architect's output within the same start-checkpoint turn is the Delegator's input —
  they are not two independent opinions to reconcile, but a pipeline within one checkpoint.

## Open questions

- `night-delegation.ts` computes worker count from a text heuristic alone. The Architect (per its own research notes) is expected to produce a task/file-ownership breakdown — does the Delegator currently consume that breakdown directly, or does it independently re-derive parallelism from the raw goal text? If the latter, the two specialists could disagree about what's independent. (to verify against the live start-checkpoint flow)
- The manifest caps the Delegator's reply at 300 words. The self-contained worker prompt template above, multiplied by up to `MAX_WORKERS` (4) workers, will not fit in that budget for a fan-out case — does the Delegator write short *pointers* to full prompts assembled elsewhere, or is the true worker-prompt authoring done by the nightrunner itself using the Delegator's advice as a shorter spec?
- Does this project's harness give the Delegator (or the nightrunner acting on its advice) access to git worktrees per parallel sub-agent, or do parallel Claude Code subagents in this setup share one working directory today? Rule 5's isolation guidance only matters if worktree-per-worker is actually wired up. (to verify)
- `night-model.ts` is referenced but not read in this research pass — confirming its exact tiering rule (and whether "Opus/Haiku only when asked for explicitly per message" applies per-worker or only at the top level) would sharpen rule 9. (to verify)
- Failure handling in `night-delegation.ts` isn't visible in the file read for this research (it only computes the plan, not runtime recovery) — where does retry/reassignment for a failed parallel sub-agent actually live in this codebase? (to verify)
- This project's `fanOut` directive is a pure network/sectioning shape (per the Framework Comparison table). Is there an appetite for adding a voting mode (redundant confidence passes) for high-stakes goals — e.g., a security-sensitive migration — or is that judged to belong to the Security/Test Board specialists' own review passes instead of the Delegator's scheduling layer? (to verify)
- `teamLabel` in `night-delegation.ts` (lines 143-149) computes a *different* team description via `sessionsFor`/`needsResearch` from `night-research.ts` for difficulty >= 3, layered on top of the `workers`/`plan` fields already computed — how do these two notions of "how many agents" reconcile when they disagree, and which one is the Delegator actually supposed to advise from? (to verify)
