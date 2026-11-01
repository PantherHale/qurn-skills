# Delegator: playbook
(research 2026-09-23, sources in specialist-skills/research/delegator.md)

## When parallel pays / doesn't
- Fan out only when tasks are file-disjoint AND context-independent -- if B needs A's output, schedule serially even if files don't overlap.
- Blind fan-out is a poor fit for "most coding" (Anthropic's own finding); it wins on breadth-first, independent-direction work, not tightly coupled changes. A concrete number backing this (2026-10-30, Vals AI Vibe Code Bench, secondhand coverage): agent teams cost roughly 1.8x-5.1x more than a solo agent per coding task, with quality gains absent in 3 of 4 tested matchups -- cite this against "add more agents" pressure on an ordinary coding goal.
- A trivial "independent" piece is reclaimed by the lead, not given its own worker -- prompt-writing and integration overhead isn't repaid by a two-line change.
- Past a handful of workers, the serial remainder (integration, build, test, shared-wiring edits) dominates wall-clock time regardless of count (Amdahl) -- this project caps at 4.

## Worker-count heuristics (must match night-delegation.ts)
- Difficulty is scored 1-10 from the operator's own text only (operatorText()), stripping appended specialist guidance/build reports -- never re-score the whole prompt.
- difficulty < 3 (PLAN_AT): 1 worker, no plan (SOLO).
- 3 <= difficulty < 7 (FAN_OUT_AT): 1 worker, five-step plan, no sub-agents (PLANNED).
- difficulty >= 7: fan out to min(4, 2 + floor((difficulty-7)/2)) parallel sub-agents (MAX_WORKERS=4), each owning different files.
- Never inflate worker count for file count alone -- the gate is difficulty AND independence, checked together.
- Run this DAG-first checklist before calling anything parallel: file-ownership check, output-dependency check, shared-wiring check, Amdahl gut-check, triviality check.

## Shared-wiring ownership
- Exactly one owner: the lead/orchestrator, never a sub-agent.
- Named collision points: package.json, entry point, routes/registration file, IPC contract, DI container, shared types file, CI config.
- Reserved before the parallel set (if workers need it to exist first) or after (if it's integration) -- never inside a parallel task itself.
- Lead integrates, builds and runs tests after every fan-out, whether or not any worker touched shared wiring.

## Worker prompt template (self-contained -- worker starts with nothing)
```
ROLE: <one line, if relevant>
OBJECTIVE: <single outcome, one sentence>
OWNS (files/dirs): <exact paths, no overlap with siblings>
DO NOT TOUCH: <shared wiring + sibling files, named explicitly>
CONTEXT YOU NEED: <goal, relevant existing code/conventions, ruled-out constraints>
DEPENDS ON: <none, or "output of Task X">
OUTPUT FORMAT: <diff/file/report, how the lead consumes it>
DONE WHEN: <observable, checkable condition>
MODEL: <tier, if the harness allows per-worker tiering>
```

## Model tier
- Tier selection is a separate, non-inferred decision in this codebase (night-model.ts): Sonnet by default, Opus/Haiku only on explicit per-message operator ask.
- Do not reintroduce difficulty-based tiering. May note, as an observation only: the lead/orchestrator benefits most from a stronger tier when decomposition itself is hard; a bounded, well-specified parallel worker rarely needs the strongest tier.

## Failure handling
- A worker reports a stuck tool/task rather than silently degrading; the lead adapts (retry, reassign, narrow scope) instead of masking it.
- Checkpoint intermediate progress so a failed worker's partial work isn't thrown away on retry.
- Always run a build/test integration gate after fan-in -- a per-worker "done" does not mean the whole is done.
- If a piece turns out trivial mid-flight, the lead absorbs it instead of relaunching a worker.
- **Not all failures are retry-recoverable.** Tool-invocation errors are: surface and retry/reassign. Context pollution, conflicting outputs between workers, and premature action (a worker acting before a dependency's output exists) are reported as never recovering once triggered -- these must be caught by the DAG-first checklist's output-dependency check *before* dispatch, not patched afterward.

## Current Claude Code concurrency/isolation mechanics (check before assuming)
- Default concurrency cap: 20 subagents per session (`CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS`); past the limit, spawning fails fast rather than queueing.
- Nesting depth cap: 3 (`CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`), separate from the concurrency cap -- a sub-agent's own sub-agents count against it.
- `isolation: worktree` branches off the default branch, not the parent's HEAD, and auto-removes itself if the worker made no changes.
- **Worktree isolation only covers git-level races** (index-lock contention). It does not cover: logical edits that still conflict at merge time even though the git mechanics didn't collide, or shared *runtime* resources -- a dev server port, a test database, a build cache -- that more than one worker touches. Check these separately; give each worker its own port/schema when they'd otherwise collide. For a shared *mutable* resource a worker actually writes (a DB row, a balance, a queue), the fix is a per-entity lock held for the whole operation (not just the write) with a TTL, plus an idempotency key on retries, or a single-owner agent for the resource -- see delegator-reference.md's locking-pattern section (2026-10-30).
- **A declared `isolation` setting is not unconditionally enforced.** With agent-teams mode enabled, a named subagent launched interactively can run as a teammate in the main session's working directory regardless of its frontmatter `isolation` value, unless isolation is also passed on that specific call. Verify against the actual invocation, not just the worker's declared config.
- **Report bloat is its own cost.** Many subagents each returning a long narrative report consumes the lead's context regardless of how well-scoped the work was. Cap every worker's OUTPUT FORMAT to a diff or short structured result, not a narrative -- especially as fan-out width grows.
