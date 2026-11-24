# Delegator specialist

Decides how many workers a goal needs, which tasks can run in parallel and which must wait for another, and writes each one a self-contained prompt. It keeps shared wiring (package.json, entry points, routes) with a single owner so parallel workers never collide, and it never inflates the count for a small job.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When a goal is big enough for several agents or workers: deciding how many, what runs in parallel, what waits, and writing each worker a self-contained prompt.
- When workers run on more than one AI vendor/model, or a worker's lifetime (gated task vs. quick one-shot turn) needs picking -- read `references/agent-dispatch-reference.md`.
- Do not use for work one agent can finish alone in one session.

## As a command

Run it as `/delegator <request>` in Claude Code or Gemini CLI, or `/prompts:delegator <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- any time, asked directly

## Instructions

You are the task delegation specialist. Decide how many workers the goal needs, which tasks run in parallel and which wait on another, and give each a self-contained prompt. Keep shared wiring with one owner. Use your playbook (delegator-playbook.md in references/): parallelise only file-disjoint, context-independent work, follow its worker-count rules, and write each worker prompt in its template (objective, owns, must not touch, output, done when, how to verify). You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next.

DISPATCH LINT AND VERIFIED ORCHESTRATION FACTS (Phase 6 upgrade, 2026-11-24): put in REQUIRED RUNS that the consulting agent writes the worker prompts to a file and runs `node scripts/dispatch-lint.mjs <file>` and shows the output (you cannot run it yourself). A FAIL is a blocker: a missing template field, two parallel workers owning one file, shared wiring given to a worker, a dangling or circular dependency, or a back-reference a fresh worker cannot resolve. The lint checks format only. Before approving any fan-out, answer the question it cannot: can each worker understand its piece without the others' decisions? If two workers must agree on a schema, an interface or a visual style, decide it first and put it in both prompts, or do not split (Cognition's "actions carry implicit decisions"; Anthropic's finding that most coding is a poor fit). Cap every worker's return (a diff or a short structured result), set `maxTurns` and a spend cap on unattended workers, and require the lead to run the build and tests after fan-in. For exact limits, flags, hooks, worktree and agent-team behaviour and the MAST failure modes, use `orchestration-facts-reference.md` and treat what it marks unverified as unverified.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [references/delegator-playbook.md](references/delegator-playbook.md)
- [references/delegator-reference.md](references/delegator-reference.md)
- [references/agent-dispatch-reference.md](references/agent-dispatch-reference.md)
- [references/orchestration-facts-reference.md](references/orchestration-facts-reference.md)
- [scripts/dispatch-lint.mjs](scripts/dispatch-lint.mjs)


---

<!-- references/delegator-playbook.md -->

# Delegator: playbook
(research 2026-09-23, sources in specialist-skills/research/delegator.md)

## When parallel pays / doesn't
- Fan out only when tasks are file-disjoint AND context-independent -- if B needs A's output, schedule serially even if files don't overlap.
- Blind fan-out is a poor fit for "most coding" (Anthropic's own finding); it wins on breadth-first, independent-direction work, not tightly coupled changes. A concrete number backing this (2026-10-30, Vals AI Vibe Code Bench, secondhand coverage): agent teams cost roughly 1.8x-5.1x more than a solo agent per coding task, with quality gains absent in 3 of 4 tested matchups -- cite this against "add more agents" pressure on an ordinary coding goal.
- A trivial "independent" piece is reclaimed by the lead, not given its own worker -- prompt-writing and integration overhead isn't repaid by a two-line change.
- Past a handful of workers, the serial remainder (integration, build, test, shared-wiring edits) dominates wall-clock time regardless of count (Amdahl) -- this project caps at 4.

## Worker-count heuristics (the Qurn app's own rule, from its night-delegation.ts: not a Claude Code limit, and that file is not in this repository)
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
- Tier selection is a separate, non-inferred decision in the Qurn app (its night-model.ts, not in this repository): Sonnet by default, Opus/Haiku only on explicit per-message operator ask.
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


---

<!-- references/delegator-reference.md -->

# Delegator: expert reference

Use with `delegator-playbook.md`. Checked against primary sources 2026-10-05 (Anthropic's engineering posts, Claude Code docs, Cognition's two posts, the MAST paper, git/trunk-based-development docs, Wikipedia for classical scaling laws).

## Is it worth parallelising?
- **Budget tokens before anything else.** Anthropic's own multi-agent research system uses about **4× the tokens of a plain chat interaction, and a full multi-agent run about 15×** — and token usage alone explained about 80% of the performance variance they measured. Parallelise only when the task's value clearly pays for that 15× cost.
- **Amdahl's law** caps speed-up by the serial fraction (30% serial → max 3.3× no matter how many workers). It's incomplete on its own: the **Universal Scalability Law** (Gunther) adds a coherency term showing throughput can actually *fall* past a peak, not just plateau — `C(N) = N / (1 + α(N-1) + βN(N-1))`, where α is contention and β is coherency cost; peak concurrency is at `N = √((1-α)/β)`. Past that peak, adding a worker makes the whole job slower, not just not-faster. (Gustafson's law is the usual counterpoint to Amdahl — more workers can do more total work, just not the *same* work faster; mention it if someone's sizing a batch job rather than a deadline.)
- **Brooks' law is a strong tendency, not an absolute rule** — Brooks himself called it "an outrageous oversimplification," and it hinges on how divisible the task actually is ("nine women can't make a baby in one month"), ramp-up cost, and communication growth. Use it as a caution for non-partitionable work, not a hard formula to quote with confidence.
- **Little's law** (L = λ·W) is only valid for long-run averages in a stable system (arrival rate = exit rate) — at fixed throughput, lead time grows linearly with work-in-progress. The Kanban Guide itself does *not* name Little's law explicitly (it defines WIP, lead time, throughput, cycle time directly) — cite Little's law separately when you use it.
- **A specific "each task should be at least 15 minutes" sizing rule has no confirmed source** — don't cite a number. The sourced version (Claude Code's own agent-teams guidance): a task is "too small" when coordination overhead exceeds the benefit, "too large" when a teammate goes too long without a check-in, and "just right" is a self-contained unit with a clear deliverable (a function, a test file, a review) — aim for roughly 5–6 tasks per teammate.

## How to cut the work
1. Write interfaces and contracts first (types, API shapes, file names, function signatures, event names); hand each worker one side only once the shape exists.
2. **Give every file exactly one owner.** Two teammates touching the same file is the single most common failure mode across every source consulted. Shared files (package.json, lockfile, routes index, schema, config) belong to one worker or to the delegator's own serial step.
3. Order by a dependency graph: foundation, then independent leaves in parallel, then integration, then verification. Give the critical path (the longest dependent chain — the thing Amdahl's serial fraction is really made of) the strongest worker and start it first.
4. **Keep writes single-threaded; fan out reads freely.** This is Cognition's distilled position after building and shipping a multi-agent coding product: multiple agents can usefully contribute *intelligence* to a task (parallel research, parallel review, parallel search) as long as the actual file *writes* stay serialised through one path. Vertical slices (one user-visible thing end to end) usually beat horizontal layers because each slice can be tested and merged alone.
5. Put verification in the plan itself: each task states the exact command that proves it; a final integration task runs the whole suite and the actual app.

## Matching effort and model to the task
- Scale effort explicitly and write the rule into the delegation prompt, because **agents cannot reliably judge effort on their own** — Anthropic observed subagents spawning 50+ workers for genuinely simple queries without an explicit rule. A reasonable scale: simple fact-finding → 1 agent, 3–10 tool calls; a comparison → 2–4 subagents, 10–15 calls each; complex multi-part research → 10+ subagents with clearly divided responsibilities.
- **Multi-agent setups are a poor fit for work that needs shared context, has many cross-cutting dependencies, needs real-time coordination, or is most ordinary coding** (Anthropic's own characterisation of where their multi-agent architecture does and doesn't help). Default to the simplest thing — one good single-agent call — and only add multi-step orchestration when that single call demonstrably falls short.
- Cheaper/faster models work for clear, mechanical, **unambiguously specified** edits — but Cognition observed a smaller model can misread even slightly ambiguous markdown written by a larger one and make the wrong edit from it. Only delegate to a cheaper model when the brief is exact, not just "simple-sounding." Anthropic's best internal result paired a *stronger lead* with *cheaper subagents* (an Opus lead orchestrating Sonnet subagents beat a single Opus agent working alone by about 90% on their internal research benchmark) — the leverage came from the lead's judgement, not from the subagents being smart.

## The worker brief (self-contained — workers see nothing else)
Claude Code subagents do **not** see the conversation history, prior file reads, or auto-memory — they get only the brief you write, plus CLAUDE.md and git status. Put everything needed directly in the brief: objective, why it matters, the files it owns, the files it must not touch, inputs (paths, contracts, decisions already made and *why*, options already rejected), the exact output expected, done-when as a runnable check, constraints, how to report back, and what to do if blocked (stop and report, never guess). **Pass full context, not just the task line** — Cognition's own cautionary example was two subagents building a single game where one invented a Mario-style background and the other an inconsistent bird, because neither was told the other's implicit design decisions. Write down style, naming and design choices explicitly so parallel workers can't silently diverge.

## Verification
Give every worker a runnable check (tests, build exit code, linter, screenshot diff) and require the actual evidence in its report, not an assertion that it's done. Consider an adversarial review step in a *fresh* context that sees only the diff plus the stated criteria — told explicitly to flag only correctness or requirement gaps, or it will over-report and drive unwanted extra engineering (Cognition reports roughly 2 real bugs caught per PR this way, ~58% of them severe). The **MAST taxonomy** (a 2025 study of 1,600+ annotated multi-agent traces across 7 frameworks) found failures cluster into 14 modes across 3 categories — system design, inter-agent misalignment, and task verification — and that these failures are structural, not just a weaker model's fault. (The exact per-mode names and percentages from that paper are not independently confirmed in this session — read the paper's taxonomy table before quoting a specific mode name or percentage.) Gate "done" deterministically where possible (a Stop hook, a CI exit code) rather than trusting a self-reported "done."

## Isolation and merging
Give every writer its own worktree and branch so edits in one never touch another. **A Claude Code worktree branches from the remote default branch by default — it will not see your unpushed local commits** unless `worktree.baseRef` is explicitly set to `"head"`, or you push first. Assign each teammate a distinct set of files; two teammates on one file will overwrite each other's work. Remove or prune finished worktrees.

Keep branches genuinely short-lived: trunk-based development guidance is that a feature branch should last "a couple of days" at most, with more than two days treated as a long-lived-branch risk; one developer per branch (two if pairing); never merge feature branches into each other directly — only into trunk, in dependency order; merge trunk into the branch before pushing so the branch owner resolves any conflict, not whoever merges last. For changes that genuinely need to outlive a short branch, use feature flags or branch-by-abstraction instead of letting the branch diverge for weeks.

## Flow and limits
Measure the serial fraction (integration, build, review) before choosing a worker count — if it's above roughly 1/N, the Nth worker buys almost nothing (Amdahl again). The Kanban Guide's flow principle applies directly to agent fan-out too: full utilisation of every worker leaves "no slack in the system and the result is very poor flow" — cap concurrent workers and let some finish before starting more, rather than always running at the ceiling. Monitor running teammates rather than assuming silence means progress — an unattended multi-agent team risks wasted effort, a lead that stops early or starts implementing itself instead of delegating, and task status that silently goes stale. For a batch of similar tasks, pilot on 2–3 items first, refine the brief from what went wrong, then fan the rest out.

## Smells
Two workers editing one file; a worker told to "figure out the design" while another builds on top of it with no shared contract; no integration task; a plan whose critical path nobody explicitly owns; a brief that says "see above" (the worker has no "above"); a dozen workers for a two-hour job; a read-only reviewer given write access "just in case"; trusting a "done" report with no attached output; a conflicting-output or premature-action failure "fixed" by just retrying the worker (see failure-mode asymmetry below); fan-out width driven up without capping what each worker returns.

## Failure-mode asymmetry: some failures don't recover with a retry
A benchmark (OrchestraBench, arXiv 2608.05263 -- **confirmed 2026-10-30 by fetching the abstract directly**) found tool-invocation errors fully recoverable by retry ("recovered fully (1.0)"), ambiguous delegation only partly recoverable ("recovered partially (0.30)"), and "three latent or semantic modes never recovered (0.0)." The abstract itself does not individually name those three modes as "context pollution / conflicting outputs / premature action" -- that specific labeling is this project's own inference, not a direct quote -- and the paper's own caveat is worth repeating whenever these numbers are cited: "these results are controlled-chain mechanism probes, not domain-workload claims." The practical split still holds: a stuck tool belongs in the "retry/reassign" bucket above; a worker that silently acted on stale or missing context does not -- that has to be caught before dispatch by the DAG-first checklist's output-dependency check, not patched after. A separate measurement (DACS, arXiv 2604.07911 -- **confirmed 2026-10-30**) reports flat-shared-context steering accuracy ranging as low as 21% and as high as 60% across eight tested scenarios, worsening as agent count N grows -- the specific "60% at N=3, 21% at N=10" two-point curve cited before is not literally in the abstract (don't quote it as a precise curve), but the direction (context pollution gets worse, not better, with more agents) is confirmed, and is another reason isolated, fresh context per worker is the default to keep, not a shared scratchpad "to keep workers in sync."

## Agent teams vs. solo agent on coding tasks: a concrete cost/outcome number (2026-10-30, secondhand coverage of Vals AI's Vibe Code Bench -- could not fetch Vals AI's own write-up directly; corroborate at vals.ai before citing the exact percentages as load-bearing)
Multiple independent write-ups of a Vals AI team study (GPT-6 Sol and Claude Opus 5.5, solo vs. team, building full web apps from spec, graded by browser agents on the deployed app) converge on: team configurations cost **roughly 1.8x-5.1x more** per app than a solo agent, and only one of four model/effort matchups showed a significant quality gain from using a team. For Claude Opus 5.5 at medium effort, the solo agent scored *slightly higher* than the team (~91.5% vs ~91.2%) while making about a quarter as many tool calls, at roughly half the cost. Use this as a concrete number to cite against "add more agents" pressure on an ordinary coding goal -- it corroborates Anthropic's own "most coding is a poor fit for multi-agent fan-out" line (above) with an actual cost multiplier, not just a qualitative warning.

## Shared *runtime* state between workers: locking pattern (2026-10-30, "The Agentic Race Condition," theagenticstack.substack.com, fetched directly)
Worktree-per-worker and file-ownership (above) cover git-level and file-level races but not a DB row, account balance, or queue two workers both touch. The concrete pattern:
1. **Pessimistic, per-entity lock acquired before the LLM call, not just before the write** -- "LLM context windows are not transactional boundaries," so the lock has to span the whole multi-step operation. Atomic acquisition (e.g. Redis `SET NX EX`), released in a `finally`.
2. **Mandatory TTL on every lock**, sized above the expected max workflow duration (example given: 20s workflow, 45s TTL) -- this is what prevents a crashed/hung agent from holding a lock forever.
3. **Contended work reroutes, it doesn't block** -- send to a retry/dead-letter queue (~60s retry) rather than having the second worker wait synchronously.
4. **For genuinely high-stakes shared state (a balance, a counter), prefer a single-owner agent** that serializes all writes to that resource over a voluntary-lock free-for-all among many writers.
5. **Append-only log + an idempotency key per write**, so a crashed owner can recover from the log and a retried write can't double-apply.
Reach for this whenever the DAG-first checklist's shared-wiring check turns up a shared *runtime* resource rather than a shared *file* -- rule 4's "single owner for the file" answer isn't sufficient on its own for mutable runtime state.

## Current subagent concurrency and isolation mechanics (re-checked 2026-10-29)
- Default concurrency: **20 subagents per session**, overridable via `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` -- spawning past the cap fails fast with an explicit error rather than queueing or degrading.
- Nesting depth: a separate cap, `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH`, default **3**, settable to 1 to disable nesting entirely.
- `isolation: worktree` branches a temp worktree off the *default branch*, not the parent's HEAD, and is auto-removed if the worker made no changes.
- **Worktree isolation is necessary but not sufficient.** It removes git-level races (`.git/index.lock` contention between parallel workers) but not: (a) logical edits across worktrees that still conflict once merged to the same branch, even though the git mechanics never collided; (b) shared *non-git* runtime resources -- a dev server port, a test database, a build cache -- that more than one worker touches. These need their own isolation (a distinct port/schema per worker), separate from file-ownership and separate from worktree assignment.
- **A worker's declared `isolation` is not unconditionally enforced.** With agent-teams mode enabled, a named subagent launched interactively runs as a teammate in the main session's working directory regardless of its frontmatter `isolation` setting, unless isolation is also passed on that specific call. Treat isolation as something to verify against the actual invocation path used, not something a worker's config guarantees on its own.
- **Report bloat is a cost independent of task scoping.** Even a well-scoped fan-out can bloat the lead's context if every worker hands back a long narrative. Give every worker an explicit OUTPUT FORMAT cap (a diff, a short structured result) -- this scales with fan-out width, so it matters more as a plan approaches the project's own worker-count ceiling.

## Three different Claude Code parallelism primitives, not one (checked 2026-10-23, secondary sources — verify exact behaviour against Anthropic's own docs before citing specifics)
Don't default to "spawn subagents" as the only shape. Anthropic's own support material and several independent write-ups describe three distinct mechanisms, each isolating differently: **ad-hoc subagents** (a brief dispatched mid-conversation, its own context window, optionally its own worktree — the pattern this file mostly assumes); **Agent Teams** (a shared workspace where agents message each other directly, no automatic file isolation — closer to the "GroupChat" pattern, and the reason "give every file exactly one owner" above matters even more here than with subagents); **`/batch`** (a native bulk-workflow command for identical mechanical work across many targets — e.g. the same migration across N repos — that interviews you once up front, then fans out to one worktree-isolated agent per target, each testing its own change and opening its own PR). Pick by isolation need, not habit: genuinely identical repeated work → `/batch`; agents that need to coordinate and see each other's output → Agent Teams (accept the file-ownership discipline above); a one-off task needing its own clean context → a plain subagent.

## Lanes, boards and decisions (from the installed orchestration skills, read 2026-10-08, plus Anthropic's reliability notes)
- **Lane matrix before a large push.** One row per lane with: can it run in parallel, its write surface, its risk, its verification. Mark each lane parallel, sequential or **gated** (waits for a named condition, such as DNS propagation or a green build). Run lanes together only when their write surfaces do not collide; if a lane finds a blocker that changes the plan, pause the dependent lanes and update the matrix. Never parallelise destructive commands, migrations, writes to one table or live customer-impacting deploys without an explicit gate. End with a verification table (lanes run, completed, blocked, evidence), not a speed claim.
- **Agent board with merge gates.** Treat each agent as a teammate with a narrow contract: an owner, a scope (files, branch, tool surface, forbidden areas), a state (backlog, ready, running, review, blocked, merged), evidence (tests, screenshots, logs) and a merge gate (the exact condition that allows integration). One integrator merges. Failure names: agent soup (many agents, no owner or merge gate), invisible work (output only in a chat transcript), board theatre (cards with no acceptance criteria), overlapping writes. Do not add automation until the operator can answer who owns this, what changed, which gate failed and what can safely merge.
- **A council for decisions, not for work.** For a choice with several credible paths (monorepo or polyrepo, ship now or hold), run independent voices: a skeptic, a pragmatist and a critic as fresh subagents given ONLY the question and the context it needs, never the conversation (that is the anti-anchoring mechanism), while the lead writes its own position first. Rules for the synthesis: do not dismiss a voice without saying why, say so when a voice changed the answer, keep the strongest dissent in the verdict, and treat two voices against the lead as a real signal. It is the wrong tool for verifying output (use an adversarial review), for breaking work into steps, or for an obvious task.
- **Reliability lessons from running agents in production (Anthropic).** Build runs that can resume from where the agent stopped instead of restarting; shift new versions in gradually so a deploy does not break agents mid-run; tell the agent when a tool is failing and let it adapt. Anthropic's lead agent ran subagents one after another, which capped the parallelism it could use.

## Handoff documents between sessions (from a production handoff skill)
When a session ends and another agent (or a fresh session) must pick up the work, write a handoff document rather than trusting the next session to reconstruct context from scratch. Save it outside the workspace (the OS temp directory), not inside the repo. Include a "suggested skills" section naming which skills the next session should invoke. **Don't duplicate what already exists elsewhere** — specs, plans, ADRs, issues, commits, diffs — reference them by path or URL instead of re-pasting their content; a handoff doc that re-describes a spec already on disk goes stale the moment the spec changes. Redact anything sensitive (API keys, passwords, PII) before writing it. If the next session has a stated focus, tailor the doc to that focus rather than writing a generic status dump.

## Named frameworks from the specialists themselves (verified 2026-10-05)
- **Brooks' Surgical Team (exact roles):** Surgeon/chief programmer (owns architecture, final design say), Copilot (alter ego, can write code, surgeon has final say), Administrator (handles people/budget/org so the surgeon stays technical), Editor, Program clerk, Toolsmith. Maps onto agent delegation as "one strong lead keeps architectural ownership; everything that isn't core design gets offloaded to a support role" rather than splitting the core work N ways.
- **Gunther's Wheel of Capacity Planning:** an iterative measure → model → adjust cycle (from "Guerrilla Capacity Planning") — use it instead of guessing a worker count N once; re-measure and re-size.
- **Anthropic's 2026 Agentic Coding Trends Report:** developers report being able to fully delegate only about 0-20% of their work to AI even while using it in ~60% of tasks — a concrete ceiling to cite when someone assumes an agent can take over a task end-to-end. The report frames hierarchical orchestrator-plus-specialists as the now-expected default shape, not a novel idea.
- **Cognition's "smart friend" architecture** (from their April 2026 follow-up post): pair a small/fast model with a larger one, and have the *small model itself detect ambiguity and escalate* — rather than the delegator pre-judging ambiguity for every task up front. Their production system also runs coder and reviewer as two separate agents in a loop ("Devin Review"), not one agent self-checking.
- **DeMarco's "jelled team" as a deliverable** (Peopleware; reframed in his novel "The Deadline"): team cohesion should be tracked and protected as a project deliverable, not an incidental side effect. The practical point for mixed human+agent delegation: agents cannot jell, so a delegator mixing people and agents should explicitly protect the human sub-team's cohesion (shared standups, shared ownership) since agent workers can't contribute to or benefit from it.
- **Forsgren/Humble/Kim's "Accelerate" — 24 Key Capabilities in 5 categories** (not just the DORA metrics): Continuous Delivery (version control for all production artifacts, deployment automation, CI, trunk-based development, test automation, test-data management, shift-left security), Architecture (loosely coupled, architecting for empowered teams), Product & Process (customer feedback loops, value-stream visibility, small batches, team experimentation), Lean Management & Monitoring (lightweight change approval, monitoring, proactive health checks, WIP limits, visualising work), Culture (generative culture per Westrum, learning culture). "Loosely coupled architecture" and "architecting for empowered teams" are the two capabilities that most directly back this file's "give every file exactly one owner" rule — found statistically linked to delivery performance, not just folklore.
- **Checked and found not to exist:** there is no Fowler bliki entry specifically on trunk-based development (fetch returned 404) — the existing citation straight to trunkbaseddevelopment.com is correct as-is; don't replace it with a Fowler link.

## Where to read more (name, do not paste)
Anthropic's engineering blog directly — "How we built our multi-agent research system," "Building effective agents," "Writing tools for agents," "Effective context engineering for AI agents" (all free, short, and more precise than a summary); Claude Code's own docs (code.claude.com/docs — agent-teams, sub-agents, worktrees, best-practices) for anything about how Claude Code itself behaves; Cognition's two posts, read in order — "Don't build multi-agents" (2025) then "Multi-agents: what's actually working" (2026, the softened follow-up) — the second one updates the first, don't cite only the first; the MAST paper (arXiv 2503.13657) for the structural multi-agent failure taxonomy; trunkbaseddevelopment.com directly for branch-lifetime guidance; "The Mythical Man-Month" (Brooks, for the original n(n-1)/2 argument and its caveats, in his own words rather than a paraphrase); the Kanban Guide (kanban.university) and Little's law (any queueing-theory source) for flow reasoning.


---

<!-- references/agent-dispatch-reference.md -->

# Delegator: multi-vendor dispatch

For dispatching work across more than one AI vendor/model behind one interface, and deciding when a worker needs the full isolated-task treatment versus a lighter one-shot turn.

## Vendor adapters
When more than one AI vendor/model can do the same job, define one adapter interface (`{id, capabilities, run(opts): Promise<Outcome>}`) that every vendor integration implements; adding a vendor is one new file plus one new case in a single dispatch switch. Make the switch's default/fallthrough branch a compile-time error (an exhaustive match on a closed type) so a missing case is caught before it ships, not discovered at runtime. Required capability flags (does it stream/heartbeat, can it run unattended, is it local-only) belong on the interface, not inferred ad hoc -- a non-streaming adapter that never signals activity will get killed by a stall watchdog for looking idle.

## Failover
On a genuine vendor-side rate/usage limit (never your own configured ceiling -- see `security`'s `agent-trust-reference.md` for that distinction), fail over to another configured vendor and retry the exact same request rather than surfacing the limit to the operator. Pick the replacement from a vendor that isn't itself currently cooling down from the same kind of limit.

## Matching the worker's lifetime to the task
Not all dispatched work needs the full gated/isolated treatment (`architect`'s `agent-infra-reference.md`). A "just talk to it and get work done" turn -- one request/response, no iteration of its own, editing the operator's real working tree directly -- is a legitimate, simpler lifetime alongside the gated one, built on the *same* adapter interface above. Don't force a quick one-shot question through the heavier gated pipeline just for consistency; reserve the gate and worktree isolation for work nobody is watching turn-by-turn, and use the lighter lifetime when there's no merge decision to make. When writing a self-contained prompt for either lifetime, say explicitly which one the worker is operating under -- a worker given gated-task instructions but run as a one-shot turn (or vice versa) will make the wrong call about whether its own changes are safe to leave uncommitted.


---

<!-- references/orchestration-facts-reference.md -->

# Delegator: orchestration facts read from the primary docs, and when not to fan out

Added 2026-11-24 (Phase 6 upgrade). Each fact is from the page named in its heading, read on that date; **(unverified)** marks something that came through a model summary or was not on a page read. Product limits and flags change quickly: re-check the installed version before quoting a number. Use with `delegator-playbook.md` (the worker prompt template and checklist) and `delegator-reference.md` (broader craft).

## 1. Lint the dispatch before sending it
`node scripts/dispatch-lint.mjs <dispatch.md> [--max-workers N]`. The consulting agent runs it and shows the output (the specialist has no shell). It checks the playbook's own template, mechanically:
- **FAIL:** a missing OBJECTIVE, OWNS, DO NOT TOUCH, OUTPUT FORMAT or DONE WHEN; two workers that can run at the same time owning the same file; a worker handed shared wiring (manifests and lockfiles, entry points, route registration, CI config, IPC contracts, DI containers) that only the lead may own; a file both owned and forbidden; a dangling or circular DEPENDS ON; a back-reference the worker cannot resolve ("as discussed", "see above").
- **WARN:** ordered workers sharing a file; DO NOT TOUCH not naming a parallel sibling's files; ownership too broad to prove disjoint (`src/`, `.`); a done-when that is not checkable; an output format that asks for a report with no size cap; two parallel workers on one port; more workers than the cap (default 4: the playbook's rule, not Claude Code's limit of 20); no lead or integration step with a build or test command; a single worker on a single file with a one-line objective (the lead should just do it).
- **INFO:** the waves implied by DEPENDS ON.
It cannot tell whether the work should be split at all, whether two workers will make conflicting design decisions, or whether a worker's context is the right context. Section 5 is about exactly those judgments.

## 2. Claude Code subagents (code.claude.com sub-agents and agent-sdk/subagents pages)
- **Context:** each subagent has its own context window, system prompt, tools and permissions; only its final message returns to the parent; its usage counts toward the same limits. It receives **only the prompt string** the parent writes (plus project `CLAUDE.md` unless `omitClaudeMd`), not the parent's history. So the prompt must carry the file paths, error messages and decisions it needs.
- **Limits (SDK page, verbatim; Claude Code v2.1.219 or later):** `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` default **20** (spawning past it fails with an error, no queueing); `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` default **3** layers (1 stops subagents from spawning); `maxBudgetUsd` has **no limit by default** and ends the query with `error_max_budget_usd` at the cap. Set `maxTurns`, the depth, the concurrency and a spend cap on anything unattended.
- **`maxTurns`:** when reached, output comes back marked partial and the subagent can be resumed. Resume with `SendMessage` using the agent id or name. Custom subagents spawned from the main conversation start in the background by default; background results arrive as a notification in a later turn.
- **Tools:** `tools` is an allowlist and `disallowedTools` a denylist applied first; listing a tool does not pre-approve it; omit `Agent` from `tools` to stop a subagent spawning others. A read-only reviewer is `Read, Grep, Glob`.
- **Hooks (hooks page):** `SubagentStart` fires on spawn, resume and each new teammate message; it cannot block creation but can inject `additionalContext` at the start of the subagent's conversation. `SubagentStop` fires when a subagent finishes; `decision: "block"` with a `reason` keeps it running and the reason becomes its next instruction; read `last_assistant_message` instead of the transcript. Match on `agent_type`; anchor plugin names (`^my-plugin:reviewer$`). Use this for a verification gate on a worker's "done".
- **Return size:** Anthropic's context-engineering post says subagents may use tens of thousands of tokens exploring but return a condensed summary, "often 1,000-2,000 tokens". Ask every worker for that, not a narrative.

## 3. Worktrees (Claude Code worktrees page; git-worktree manual)
- `claude --worktree <name>` (or `-w`) creates `.claude/worktrees/<name>/` on a new branch `worktree-<name>`. New worktrees branch from the **default branch**, not the current HEAD, unless `worktree.baseRef` is `"head"` (`"fresh"` is the default). A subagent with `isolation: worktree` is removed automatically if it made no changes; one with changes stays until a periodic sweep (`cleanupPeriodDays`). A `claude -p` run gets no exit prompt, so its worktree is **not** cleaned up: remove it with `git worktree remove`. `.worktreeinclude` (gitignore syntax) copies ignored files such as `.env` into a new worktree.
- **git:** `git worktree add <path> [<commit-ish>]` refuses a branch that is already checked out in another worktree (`--force` overrides); `list`, `lock`, `unlock`, `move`, `repair`, `remove` (clean worktrees only, `--force` otherwise; locked needs `--force` twice) and `prune`. Everything under `refs/` and the repository config are shared; `HEAD` and the index are per worktree (extra per-worktree config through `extensions.worktreeConfig`). **Multiple checkouts are "still experimental" and the manual says it is NOT recommended to make multiple checkouts of a superproject with submodules.**
- A worktree isolates files and the git index, not ports, databases or caches (`delegator-playbook.md`); give each worker its own.

## 4. Agent teams (agent-teams page)
Experimental, off by default (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`). Several sessions, one lead; teammates have their own context windows and message each other and share a task list under `~/.claude/tasks/<team>/` (pending, in progress, completed, with dependencies; claims use file locking). Subagents report only to the caller; teams cost significantly more tokens, linearly with teammates. The page advises 3 to 5 teammates and 5 to 6 tasks each; "two teammates editing the same file leads to overwrites", so give each a different set of files. Limits: one team per session, no nested teams, in-process teammates are not restored on resume, no teammates in `-p` mode. With teams enabled, a subagent you name launches as a teammate in the main working directory, so a worktree `isolation` in its frontmatter is not enough unless it is passed on that call.

## 5. When not to fan out (and what breaks when you do)
- **Anthropic, multi-agent research system:** about 4x the tokens of chat for an agent and about 15x for a multi-agent system; it suits breadth-first work with independent directions and fits coding less well because coding has fewer parallelisable parts; early versions spawned 50 subagents for simple queries, so effort rules went into the prompt (1 agent with 3 to 10 tool calls for a simple fact, 2 to 4 subagents for a comparison, more than 10 for complex research).
- **Anthropic, building effective agents:** use the simplest pattern; orchestrator-workers when subtasks cannot be predicted (for example a multi-file change); an agent only for open-ended problems.
- **Cognition, "Don't build multi-agents" (2025-06-12, the author says things will change):** Principle 1, share context and **full agent traces**, not just messages. Principle 2, **actions carry implicit decisions, and conflicting decisions carry bad results**. Their example: a "Flappy Bird" task split in two produced a Mario-style background and a bird that did not look like a game asset, with the subagents holding conflicting assumptions even though the task text was shared. Their recommendation: a single-threaded linear agent, with a compressing model for very long tasks. Use it as the counterweight: split only when decisions are separable.
- **MAST failure taxonomy (arXiv 2503.13657, v3 of 2025-10-26):** 1,642 annotated traces across 7 multi-agent frameworks, 14 failure modes in 3 categories, annotator agreement kappa 0.88, failure rates of 41% to 86.7% across the systems studied. System design: disobey task specification (11.8%), disobey role specification (1.5%), step repetition (15.7%), loss of conversation history (2.8%), unaware of termination conditions (12.4%). Inter-agent misalignment: conversation reset, failure to ask for clarification, task derailment, information withholding, ignoring another agent's input, reasoning-action mismatch. Task verification: premature termination, no or incomplete verification, incorrect verification. The percentages for the second and third categories came through a summary **(unverified)**. Map each to a dispatch control: restate the spec in every prompt, give each worker one role, cap turns, state termination, require evidence and run a separate verification step.
- **Check before fanning out:** can the pieces be understood without each other's decisions? If two workers must agree on a schema, a style or an interface, either decide it first and put it in both prompts, or do not split.

## 6. Not read (open)
The `/batch` command's own documentation, the Claude Code environment-variables page (settings has no variable list), the full hooks page except the two subagent sections, Cognition's later posts, MAST prevalence figures beyond the first category, claude-devfleet and dmux and the other installed orchestration skills (only their sizes were checked), OrchestraBench beyond the abstract already cited in the reference, and any evidence from a real multi-agent run of this project.


