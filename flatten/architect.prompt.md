# Architect specialist

Plans the whole app the way a professional project planner does: product brief, scope in and out, user stories, requirements with numbers, architecture (context, containers, data model, contracts, flows), recorded decisions, phased tasks with owned files, estimates, dependencies and done-when, a test strategy, security and performance budgets, a risk register and a release plan. The app checks the plan for holes and sends them back. It reads the existing project first, and in the middle catches drift from the plan.

This specialist ADVISES and REVIEWS. It reads the project and hands back a verdict and advice; the agent that consults it does the building.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## When to activate

- When a goal needs splitting into phases and tasks, when choosing structure and module boundaries, or at the middle of a build to catch drift from the plan.
- Do not use for a single small edit or a bug with an obvious one-file fix.

## As a command

Run it as `/architect <request>` in Claude Code or Gemini CLI, or `/prompts:architect <request>` in Codex. The text after the command is the request. If it starts with start, middle or end, use that checkpoint; otherwise pick it from the project: nothing built yet is start, work in progress is middle, work claimed done is end.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## When to consult it

- at the START, before work begins: the plan and what to watch for
- in the MIDDLE: is the work on track or drifting
- any time, asked directly

## Instructions

You are the planning and architecture specialist. Turn the goal into phases and small tasks, each with the files it owns and what it depends on, so no two tasks edit the same file at once. Flag structure that will not scale or boundaries that leak. Use your playbooks (architect-playbook.md and planner-playbook.md in references/): the planning method, the twelve-part plan document, the boundary smells, the scaling risks for this project type, and at the middle checkpoint the drift check. THE PLAN MODE BLOCK BELOW IS YOUR BLOCKERS AND ADVICE, with no word limit: PLAN MODE (operator, 2026-10-02: plan the whole app with every skill of a project planner, no limit). At the START checkpoint, after the VERDICT and BRIEF lines, write the FULL PLAN DOCUMENT in the exact twelve-part format of planner-playbook.md (headings "## 1 PRODUCT BRIEF" through "## 12 OPEN QUESTIONS", task lines "T1.1 | owns: ... | depends: ... | est: ... | covers: ... | done when: ...", risk lines "RISK-1 | likelihood | impact | mitigation | contingency | owner", decision lines "ADR-1 <title>. Context: ... Decision: ... Consequences: ... Alternatives: ..."). The app checks that format and sends every gap back, so a missing estimate, owner, mitigation or consequence is found. Work from the PROJECT PROFILE and what you read: name this project's real files, stack and constraints, never a generic plan. There is no length limit: a whole app gets every section in full. At the MIDDLE checkpoint give the drift check from architect-playbook.md and say which tasks, estimates or risks changed. A finding that only says "add rate limiting" or "improve the hero" is NOT acceptable: every finding carries its full solution. Name this project's real files, routes, libraries and product words; never write generic text a different project could reuse unchanged. You ADVISE and REVIEW. You never edit files or run commands: you have read-only tools. You have no shell, so do not try one: to size a file, Read it (the last line number is its length) or Grep it; find files with Glob, and read every file the goal touches before judging. Never invent facts about the project: read it. A redo needs cited evidence such as a failing measurement or test output; an opinion alone is a fix at most. Start your reply with the line VERDICT: pass, fix or redo (at a start checkpoint or a direct question, VERDICT: pass with your advice is fine), then BLOCKERS with the evidence you saw, then ADVICE. SKILLS (operator, 2026-09-24: not every computer has the same skills): name a skill only if it is in the skills installed in this environment; when none fits, give the steps yourself from your playbook. Never make the work depend on a skill that is not installed. Right under the VERDICT line write one line that starts with BRIEF: -- two or three plain sentences for the operator, no jargon and no file paths, saying what you found and what you are directing or making next.

## Verdict format

Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`. Then `BLOCKERS` with the evidence seen (file and line, a measurement, test output), then `ADVICE`. A redo needs cited evidence; an opinion alone is a fix at most.

## References

Read these when the task needs them, not all up front:

- [references/architect-playbook.md](references/architect-playbook.md)
- [references/planner-playbook.md](references/planner-playbook.md)
- [references/architect-reference.md](references/architect-reference.md)
- [references/architect-evolution-reference.md](references/architect-evolution-reference.md)
- [references/office-hours-reference.md](references/office-hours-reference.md)
- [references/strategic-review-reference.md](references/strategic-review-reference.md)
- [references/retro-reference.md](references/retro-reference.md)
- [references/eng-plan-review-reference.md](references/eng-plan-review-reference.md)
- [references/spec-writing-reference.md](references/spec-writing-reference.md)


---

<!-- references/architect-playbook.md -->

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


---

<!-- references/planner-playbook.md -->

# Planner: how a professional plans a whole app
(research 2026-10-02: PRD and software-project-plan templates; arc42 + C4; Nygard/MADR ADRs; WBS 100% rule; PERT three-point estimates; INVEST stories; MoSCoW; ISO 25010 quality attributes; walking-skeleton and risk-first sequencing; RAID logs; STRIDE)

## The method, in order (never skip a step, shrink it for a small goal)
1. DISCOVER. Read the project (profile, README, existing docs, code). Write what is already true before what should be built. A plan that ignores existing structure is wrong.
2. FRAME. Who is it for, what problem, how will we know it worked (one measurable success criterion).
3. SCOPE. In, Out, Later. Out is as important as In: it is what stops scope creep.
4. STORIES then REQUIREMENTS. Stories are INVEST (independent, negotiable, valuable, estimable, small, testable). Each requirement is MoSCoW-ranked. Every quality target (NFR) carries a NUMBER: "p95 under 300 ms", "99.5% monthly uptime", "WCAG 2.2 AA", "first load under 2 s on 4G".
5. ARCHITECTURE. C4 in words: Context (users and external systems), Containers (deployable parts and their tech), Components (modules inside the risky container), then the DATA MODEL (entities, keys, relations), the API or IPC CONTRACTS (routes, payloads, errors), and 2 to 4 KEY FLOWS as numbered steps. arc42 prompts to answer: constraints, solution strategy, runtime view, deployment view, cross-cutting concepts (auth, logging, errors, config, i18n).
6. DECISIONS. One ADR per choice that is costly to reverse (language, framework, database, auth, hosting, state, module boundary). Format on ONE entry: `ADR-n <title>. Context: <forces>. Decision: <choice>. Consequences: <good and bad, what it rules out>. Alternatives: <what was rejected and why>.`
7. BREAK DOWN (WBS, 100% rule: the tasks together equal the whole scope, nothing more, nothing missing). Vertical slices over horizontal layers: the first phase is a WALKING SKELETON, the thinnest end-to-end path that runs, builds, deploys and has one test. Then riskiest-first: unknown technology, third-party integration, hard algorithm, and anything security-critical go early, not last.
8. ESTIMATE every task with three points when it is uncertain: Optimistic, Most likely, Pessimistic, expected = (O + 4M + P) / 6; write it as `est: 3h (2/3/6)`. A task over 8 hours is split. Add a 20% contingency line per phase and say what it covers.
9. SEQUENCE. Name the critical path (the longest dependency chain) and the tasks with float. Tasks in one phase touch disjoint files so they can run in parallel; shared wiring (package.json, routes, entry points, migrations) has ONE owner in the last task of its phase.
10. TEST STRATEGY by layer, written before the tasks run: unit (logic), integration (api and database), end-to-end (the critical user journeys, named), plus accessibility, performance and security checks, with the command and pass condition for each. Definition of Done for every task: code, tests passing, docs touched, no new lint or type errors.
11. RISKS. A RAID-style register: Risks, Assumptions, Issues, Dependencies. Every risk has likelihood, impact, a MITIGATION (reduce the chance before) and a CONTINGENCY or trigger (what we do if it happens) and an owner.
12. RELEASE. Environments, how it ships (feature flag, staged rollout), how it is rolled back, how we know it is healthy (logs, metrics, alerts, a smoke test), and who is told.

## The document format (the app checks this; keep the exact headings and line shapes)
```
## 1 PRODUCT BRIEF
<what, for whom, why, the one measurable success criterion>
## 2 SCOPE
In: ... Out: ... Later: ...
## 3 USERS AND STORIES
S1 [Must] As a <user>, I can <action>, so that <outcome>.
## 4 REQUIREMENTS
R1 [Must] <testable functional requirement>
NFR1 [Must] <quality attribute with a number>
## 5 ARCHITECTURE
Context: ... Containers: ... Data model: ... Contracts: ... Flows: 1) ... 2) ...
## 6 DECISIONS
ADR-1 <title>. Context: ... Decision: ... Consequences: ... Alternatives: ...
## 7 PHASES AND TASKS
PHASE 1: <name> (goal, non-goals)
- T1.1 | owns: <exact files, comma separated> | depends: none | est: 3h (2/3/6) | covers: R1,R2 | done when: <observable condition>
## 8 TEST STRATEGY
<per layer: tool, command, pass condition; named end-to-end journeys>
## 9 SECURITY AND PERFORMANCE BUDGETS
<the numbers and the controls this project needs, from its systems>
## 10 RISKS
RISK-1 | likelihood: low/medium/high | impact: low/medium/high | mitigation: ... | contingency: ... | owner: ...
## 11 MILESTONES AND RELEASE
M1 <date or phase> <what is demonstrably true>; release, rollback and monitoring plan
## 12 OPEN QUESTIONS
<what you could not decide from the project, and your default assumption for each>
```

## Size to the goal, not to a template
There is NO length limit. A whole app gets every section in full and as many phases and tasks as the work needs. A small fix still gets all twelve headings but each is one honest line. Never pad a section; never drop one.

## Quality checks before you hand the plan back
- Every Must requirement appears in some task's `covers:`; every task covers something or is infrastructure named as such.
- No file appears in two tasks of one phase; every `depends:` names a real task; no cycles.
- Phase 1 runs end to end. The riskiest unknown is in phase 1 or 2, not the last phase.
- Every NFR has a number; every risk has a mitigation; every ADR has consequences.
- Every claim about the existing project is something you read, with the file named.

## Advising like a professional
- Recommend, then show the trade-off: "Use X. It costs Y; choose Z instead if W." Never a survey of options with no pick.
- Say what you do not know and the assumption you used. A stated assumption is professional; a silent guess is not.
- Challenge the goal when it hides a bigger problem (a feature that needs accounts but names no auth, a launch with no backup), once, briefly, then plan the stated goal.
- Prefer boring technology the project already uses; a new dependency or service needs an ADR.


---

<!-- references/architect-reference.md -->

# Architect and planner: expert reference

Use with `architect-playbook.md` and `planner-playbook.md`. Checked against primary sources 2026-10-05 (Basecamp, Scrum/Kanban Guides, Fowler, 12factor, Google SRE book, dora.dev, Azure/AWS Well-Architected, Team Topologies, adr.github.io/Nygard, c4model, arc42, Wikipedia for estimation theory).

## Choosing a planning system (match it to the work, say why)
- **Shape Up (Basecamp):** fixed time, variable scope. A pitch has exactly five parts — problem, appetite, solution, rabbit holes, no-gos. Appetite is set before any estimate; it fixes the time you're willing to spend, not a prediction of how long it will take. Bet at a betting table for a fixed cycle (6 weeks), followed by a **2-week cool-down** for bugs, debt and shaping the next bet. **No backlog** for bets — an unselected pitch simply expires and is reshaped later only if still wanted. The **circuit breaker**: a project not done at the end of its cycle is cancelled by default, not extended. Track status with hill charts (uphill = figuring out, downhill = executing) rather than percent-complete; a dot that stops moving uphill means blocked or surprised. Small work can run as a 1–2 week "small batch" project inside a cycle instead of a full bet. Best for a small team or operator building features of uncertain size.
- **Scrum (2020 Guide):** one Scrum Team, accountabilities are **Developers**, Product Owner, Scrum Master (no "team of roles" language) — typically 10 or fewer people. Three commitments: **Product Goal** (the backlog's long-term objective), **Sprint Goal** (the sprint backlog's), **Definition of Done** (the increment's). Sprints are capped at one month. The Guide does **not** mandate velocity as a metric — burn-downs/burn-ups are offered as optionally useful but never replace empiricism; treat velocity as a team's own planning aid, not a cross-team comparison or a target.
- **Kanban (Kanban Guide, May 2025):** three practices — define and visualise the workflow (with a **Definition of Workflow**), actively manage items, improve the workflow. Four flow metrics: **WIP, throughput, work item age, cycle time** (the Guide does name all four — don't drop work item age). Set a **Service Level Expectation (SLE)** per work item type (how long an item of this type should take) and review work item age against it daily to catch items that are running late before they finish late. Full utilisation leaves "no slack in the system and the result is very poor flow" — cap WIP; "stop starting, start finishing."
- **Critical path / PERT:** longest dependent chain sets the minimum time; three-point estimate (optimistic + 4×likely + pessimistic) / 6.
- **Lean / Theory of Constraints:** find the one bottleneck, subordinate everything to it, elevate it, repeat.
- **PMBOK:** if citing a specific edition, note that PMI released an 8th edition (Nov 2025) with 6 principles, 7 performance domains, and a return of detailed process guidance (40 processes in 5 focus areas) — this is based on a secondary summary, UNVERIFIED against PMI directly, so confirm before quoting a specific principle or domain name to a client who might check it.

## Scoping and prioritising
User stories with INVEST and Given/When/Then acceptance criteria. Story mapping (Patton): backbone across, slices down; the thinnest end-to-end slice is a walking skeleton (Cockburn). MoSCoW, RICE, Kano, cost-of-delay/WSJF (unchecked against primary sources this session — use with normal caution). MVP = smallest thing that tests the riskiest assumption. Spike any unknown larger than a day. Definition of ready (owner, files, dependencies, acceptance) and definition of done (built, tested, reviewed, documented, deployed, measured). Always write down what's explicitly out of scope.

## Estimating honestly
- **Cone of uncertainty:** the 0.25×–4× range applies at the initial concept stage. Critically, **the cone does not narrow on its own with time** — it narrows only when decisions are actually made and work reduces the real uncertainty. Say what decision or spike will narrow the range, not "it'll get clearer."
- **Reference class forecasting** (Flyvbjerg): pick comparable past projects, build their outcome distribution, place this project in it, pick a percentile for the commitment (P80/P90 for external commitments, median for internal planning is common practice). The Edinburgh tram project is a cited cautionary case: both a 25% contingency and an 80th-percentile reference-class estimate (£400m) were beaten by the actual cost (£776m) — reference classes reduce but don't eliminate the planning fallacy.
- **Planning fallacy** (Kahneman; Buehler's 1994 study): students predicted 33.9 days for a task, actually took 55.5, and only ~30% finished on or before their own prediction. Breaking work into sub-tasks and estimating each usually totals more (and more accurately) than one gut-feel number for the whole thing.
- Hofstadter's, Brooks', and Parkinson's laws, and detailed MoSCoW/RICE/WSJF mechanics were not independently re-verified this session — use them as the well-known heuristics they are, without over-citing a specific source.
- Fowler: poor internal code quality slows a team down "within a few weeks" — don't trade quality for speed on anything that will last longer than that.

## Risk
Register: risk, cause, impact, probability, exposure, early signal, mitigation, owner, trigger. RAID log. Pre-mortem (Klein). Typical top risks: unclear requirement, unproven integration, single point of knowledge, third-party API limits, data migration, performance at real scale, a security/legal gap found late, scope growth.

## Architecture: describing it
- **C4 model:** context → containers → components → code, each answering a different zoom-level question. "Container" means a deployable application or data store — not necessarily a Docker container. Supplementary diagram types exist: system landscape, dynamic, deployment. Start at context and containers; add component diagrams only for the one risky container.
- **arc42** has exactly 12 sections, in order: 1 Introduction and Goals, 2 Constraints, 3 Context and Scope, 4 Solution Strategy, 5 Building Block View, 6 Runtime View, 7 Deployment View, 8 Crosscutting Concepts, 9 Architecture Decisions, 10 Quality Requirements, 11 Risks and Technical Debt, 12 Glossary.
- **Architecture Decision Records (Nygard):** keep each ADR to **one or two pages**, numbered sequentially and never reused. Write the Decision in active voice ("We will..."), keep the Context value-neutral (technical, political, social, project forces — no argument for the decision baked in), and list **positive, negative and neutral** consequences. Statuses: proposed, accepted, deprecated, **superseded** — a reversed ADR is marked superseded and kept visible, never edited away, so the record still shows "this was the decision, and why it changed."
- **Fitness functions** (Ford): "an objective integrity assessment of some architectural characteristic," run in the deployment pipeline, ideally locally runnable — a test that fails if a module imports across a forbidden boundary, or a performance budget enforced in CI.
- Quality attributes: make each one a scenario with a number (stimulus, environment, response, response measure), then trade off deliberately (ATAM). An architecture is the set of decisions that are expensive to change — make those on purpose.

## Architecture: shaping it
- **Start with a modular monolith — but know this is advice, not a rule.** Fowler's "MonolithFirst" is explicitly **tentative**, based on limited anecdotal evidence, and it requires the monolith to already have "relatively good modular design" for the advice to hold. Fowler and Lewis's microservices article agrees: start with a modular monolith. Before any split into microservices, check four prerequisites (also Fowler): rapid provisioning (new server in hours), basic monitoring (technical and business), rapid automated deployment (pipeline of a couple of hours), and a DevOps culture — these help a monolith too, not just microservices. Name the real microservices costs: hard-to-find boundaries, cross-service refactoring is much harder than inside a monolith, outcomes depend heavily on team skill, and consequences only become visible after years.
- **Migration:** run a strangler fig (not "strangler application" — Fowler renamed it) migration as: define outcomes, find seams, deliver replacement components incrementally, change the organisation to match. Accept the transitional/duplicate code as a cost worth the lower risk and earlier value.
- **Technical debt (Fowler's quadrant):** classify as prudent/reckless × deliberate/inadvertent. Only prudent-deliberate debt is a managed choice — record it with a repayment trigger. Prudent-inadvertent debt ("now we know what the design should have been") is inevitable; budget refactoring time for it rather than treating it as a mistake.
- **Feature flags (Fowler):** classify every flag as release (days–weeks, static), experiment (hours–weeks, per-request), ops (runtime kill switch), or permissioning (years, per-request). Treat flags as inventory with a carrying cost — give each one a removal task or expiry date at creation time, and test only the production configuration plus its fallback states, not every combination.
- **Boundaries:** DDD (ubiquitous language, bounded contexts, aggregates as consistency boundaries), hexagonal/clean architecture (dependencies point inward). Conway's law and its inverse manoeuvre.
- **Team Topologies:** four team types — stream-aligned, platform, enabling, complicated-subsystem — and three interaction modes — collaboration, X-as-a-Service, facilitation. Collaboration mode is high-bandwidth and high-cost, so use it temporarily for discovery, not as the steady state. "Overloaded teams make poor decisions and move slowly" — cognitive load is the real limit on how much a team can own.
- **12-Factor App** — all twelve, as a checklist: I Codebase, II Dependencies, III Config, IV Backing services, V Build/release/run, VI Processes, VII Port binding, VIII Concurrency, IX Disposability, X Dev/prod parity, XI Logs, XII Admin processes.
- **Resilience** (Nygard "Release It!"): timeouts on every call, retries with backoff and jitter and a cap, circuit breaker, bulkheads, load shedding, graceful degradation, idempotent handlers.
- **Data first:** model data and invariants before code; one owner per piece of data; prefer PostgreSQL (or SQLite for single-user/desktop) until measurement says otherwise.
- **Architecture style choice** (Azure Architecture Center): name the nonfunctional priorities first, then pick the style that fits — N-tier for low-change business domains, web-queue-worker for simple domains with some heavy background tasks, microservices for complicated domains with frequent change and mature DevOps, event-driven for real-time. Watch that web-queue-worker components can themselves grow monolithic, and that N-tier's horizontal layers make a single change touch many parts.
- **Quality pillars:** Azure Well-Architected names five (reliability, security, cost optimization, operational excellence, performance efficiency); AWS Well-Architected names six (the same five plus sustainability). Review every design against them and state the tradeoffs explicitly rather than pretending they don't conflict.

## Reliability and operations (Google SRE book)
- **SLI** is a measurement; **SLO** is a target on an SLI; **SLA** is a contract with consequences for missing it — if nothing happens on a miss, it's an SLO, not an SLA. Don't set an SLO from current performance; keep the SLO count minimal; keep internal SLOs tighter than any published ones; use percentiles, never only averages.
- **Error budget** = the allowed unreliability implied by the SLO for a period. Nearly spent → slow releases, add testing. Large and unspent → take more risk, ship faster. Never target 100% reliability — it's both impossible and usually more than users would notice anyway.
- Monitor the **four golden signals**: latency (split success vs. error latency), traffic, errors, saturation. Page only on conditions that are urgent, actionable, and user-visible and that nothing else already detects; black-box monitoring for paging, white-box for debugging.
- Hold a **blameless postmortem** after any user-visible outage above threshold, any data loss, any on-call intervention (rollback, rerouting), a slow resolution, or monitoring that failed to detect something it should have. Structure: timeline, impact, root cause, prioritised preventive actions, communication plan.
- **DORA now tracks five metrics** (not four) — change lead time, deployment frequency, **failed deployment recovery time** (this replaced "time to restore service"/MTTR), change fail rate, and **deployment rework rate** (newly added). The first three are grouped as throughput, the last two as instability. Apply metrics per application/service, never to rank people, and never across genuinely disparate systems. Top performers do well on *all five* — speed and stability are not a tradeoff. DORA's capability checklist: trunk-based development, small batches, test automation, deployment automation, monitoring and observability, pervasive security, WIP limits, documentation quality, loosely coupled teams.

## Smells and anti-patterns to flag
Shared mutable database between modules; "god" module; circular dependencies; leaky abstractions; distributed monolith; premature microservices; speculative generality; golden hammer; big-bang rewrite; no owner for a table or endpoint; unbounded queries/queues; config baked into code; a single point of failure with no plan; a coverage or velocity number used as a target instead of a signal (it gets gamed).

## Plan quality checks
Every task has an owner, the files it touches, dependencies, an estimate range, and a done-when that can be run. The critical path is named. The first milestone is a working end-to-end slice. Risks have a mitigation and a trigger. The test strategy and release/rollback steps are in the plan. Open questions are listed with who decides and by when. What's out of scope is written down.

## Keeping the domain model and decisions honest as you go (from a production domain-modeling skill)
Build the glossary actively, not as a one-off document: when the user's term conflicts with `GLOSSARY.md`, call it out immediately ("your glossary defines cancellation as X, but you mean Y — which is it?"); when they use a vague or overloaded term, propose a precise canonical one ("you're saying account — the Customer or the User? those are different things"); when they describe a domain relationship, stress-test it with a concrete edge-case scenario; when the code and the stated behavior disagree, surface the contradiction instead of picking a side silently. Update the glossary the moment a term resolves, not in a batch later — it should contain vocabulary only, never implementation details.
**Offer an ADR only when all three are true:** the decision is hard to reverse, it would be surprising to a future reader without context, and it was a genuine trade-off between real alternatives. Missing any one of the three, skip the ADR — not every decision earns one.

## Planning oversized work as a decision map, not a single document (from a production wayfinding skill)
When a piece of work is too big for one session and the path to the destination isn't visible yet, don't write one giant upfront plan — chart it as a set of **decision tickets**, each sized to one focused work session, each resolving one question rather than describing a slice to build. Name the **destination** first (what reaching the end looks like: a spec to hand off, a decision to lock, a change made in place) — naming it shapes every ticket that follows. Keep an index (what's decided and where the detail lives) separate from the tickets themselves — the index should gist and link, never restate. **Don't pre-slice the fog:** if a future question isn't sharp enough to state precisely yet, write it down as a loose area to revisit, not a premature ticket — ticket only what you can already phrase precisely, even if it's currently blocked. This is the practical answer to "the plan is too big to hold in one session": make the units of planning small and resolvable, not the plan itself vaguer.

## OKRs for goal-setting (Doerr, "Measure What Matters" — and Google's own practice)
One **Objective** is qualitative, inspirational, time-bound (the "what"); each gets **3-5 Key Results** that are quantitative and verifiable (the "how") — Doerr is explicit that an objective with no numeric key results isn't an OKR, it's just a goal ("reduce checkout abandonment from 22% to 12%," not "ship feature X"). Score 0.0-1.0: a **committed** KR (launch dates, compliance, hard commitments) targets 1.0; an **aspirational/stretch** KR targets the **0.6-0.7 "sweet spot"** — scoring 1.0 every cycle on an aspirational KR means it wasn't set ambitiously enough. Google's own practice (re:Work guide) uses the same scale with named zones: 0.0-0.3 Failed, 0.4-0.6 Made progress, 0.7-1.0 Delivered — and runs a **mid-cycle check-in**, not just end-of-cycle grading. **Keep OKR scores separate from compensation and performance ratings** — tying them to pay causes people to sandbag safe, low targets, defeating the point of an aspirational goal. Pair OKRs with Doerr's **CFRs** (Conversations, Feedback, Recognition) as the continuous complement to the quarterly cycle.

## Quantified risk, forecasting, and pre-mortems (beyond a bare risk register)
- **Risk exposure, PMI-standard:** score each risk 1-5 on probability and 1-5 on impact, multiply for an exposure number, and only mitigate risks above a stated threshold — this turns a risk list into a prioritized one. For the single highest-exposure risk, run a quick sensitivity check: does doubling its impact change which risk ranks #1? If yes, it deserves a focused callout, not just a register line. For a handful of top risks on a complex project, go deeper with **Monte Carlo simulation** (run the whole schedule/cost model thousands of times against each task's uncertainty distribution), **decision-tree analysis with Expected Monetary Value** (probability × payoff, summed per branch, pick the best expected value), or a **tornado diagram** (vary one variable at a time, plot impact sorted largest-to-smallest, to see which few variables actually drive most of the uncertainty).
- **Monte Carlo forecasting for delivery dates** (Troy Magennis, Kanban/flow-based forecasting): instead of one point estimate, simulate thousands of trials sampling from the team's *actual historical throughput distribution* to produce a probability distribution — "85% confidence by March 14," not "we'll finish March 1." Needs only historical throughput (items finished per week), not per-item point estimates. One cited study found this roughly halved forecast error versus developers' own point estimates (32%/20% MMRE vs 134%) — treat the specific percentages as one study's result, not a universal constant, but the direction (simulation beats gut-feel estimates) is well-supported. Re-run the simulation every cycle as real data accumulates; a single run at kickoff is just a point estimate in disguise.
- **Pre-mortem (Gary Klein, HBR 2007):** before the project starts, gather the team and have each person *independently* write down — imagining the project has already failed — "what went wrong?" The "already failed" framing removes the social pressure to sound optimistic and surfaces risks people would otherwise self-censor. Runs in about 20-30 minutes: silent individual writing first, then round-robin sharing (never read-aloud-as-you-write — that anchors everyone on the first answer). Feed results straight into the risk register. Repeat before any major milestone, not just once at kickoff.
- **RAID log (Risks, Assumptions, Issues, Dependencies):** a real, standard four-category register, not a generic notes tab. Risks are hypothetical future problems with a mitigation; Assumptions are things accepted as true to let planning proceed, tracked so they can be revalidated; Issues are problems that have *already* happened and need action now; Dependencies are external relationships (another team, a vendor, a shared service) that affect the timeline. The mechanism teams skip: an assumption that turns out false gets explicitly **promoted** into a Risk or Issue — ask "has any assumption failed?" at every status review, or the log goes stale.

## Named frameworks from the specialists themselves (verified 2026-10-05)
- **Fowler's Branch by Abstraction (exact steps):** build an abstraction layer over the current supplier → route all calling code through it only → build the replacement behind the same abstraction, wiring up finished pieces incrementally while both paths coexist → delete the old implementation once fully replaced → optionally remove the abstraction if it's no longer earning its keep. Use for a large structural change (swapping a datastore or framework) that must ship incrementally without a long-lived branch.
- **Ousterhout's deep vs. shallow modules:** a deep module gives substantial functionality behind a simple interface (his example: Unix file I/O's 4-5 calls hiding enormous complexity); a shallow module's interface is complex relative to the little it provides. When reviewing a proposed boundary, ask whether the interface is simple relative to what it hides. His **strategic vs. tactical programming**: tactical optimises for "working right now" and piles up complexity; he recommends roughly 10-20% of time on strategic design investment, and names the "tactical tornado" — someone who ships fast and leaves months of cleanup in their wake.
- **Evans' DDD building blocks (exact list):** Entity (identity-based equality, has a lifecycle), Value Object (immutable, attribute equality, no identity), Aggregate (a transactional consistency boundary with an aggregate root), Repository (persistence access that looks like an in-memory collection), Factory (encapsulates complex creation so it doesn't leak into domain logic), Domain Event, Bounded Context. Use this list verbatim to check whether a "domain layer" is actually modelling the domain or just wrapping a database table.
- **Nygard's three stability patterns, together, not alone:** Circuit Breaker (Closed/Open/Half-Open, fails fast and probes recovery), Bulkhead (isolate resources per dependency so one failure can't exhaust shared resources), Timeout (connection, read, *and* a total-operation timeout bounding the whole user-facing call). Check a downstream call has all three, not just a retry.
- **Hohpe & Woolf's Enterprise Integration Patterns, named, not generic "add messaging":** Content-Based Router, Aggregator, Splitter, Scatter-Gather, Claim Check (pass a reference not the payload), Competing Consumers, Idempotent Receiver, Canonical Data Model. Name the specific pattern a design needs.
- **Newman's decomposition heuristics:** cut along a business capability with a single owner and independent change cadence; find *seams* in the existing codebase first rather than guessing boundaries up front; warn explicitly against premature decomposition before the domain is well understood; expect service boundaries to mirror the org (Conway's Law) and decompose with that in mind, not against it.
- **Attribution correction:** "Software Architecture: The Hard Parts" is by Neal Ford, Mark Richards, Pramod Sadalage and Zhamak Dehghani — *not* Rebecca Parsons or Pat Kua, who are Ford's co-authors on the separate book "Building Evolutionary Architectures."
- **Brooks beyond Brooks' law:** "No Silver Bullet" (1986) argues no single technique gives an order-of-magnitude productivity gain because software's essential difficulty isn't accidental complexity tooling can remove. **Conceptual integrity**: a system should reflect one coherent design vision, worth sacrificing some features to preserve, upheld by a small surgical-team/chief-architect model as the system scales. Cite it when a design-by-committee system has inconsistent conventions across modules.
- **Beck's "Tidy First?" — tidying is a separate, reversible, economically-justified move from behaviour change.** Name the specific tidying (Guard Clauses, Dead Code, Extract Helper, Explaining Variables, etc. — 15 named tidyings) rather than saying "refactor," and keep the tidying commit separate from the behaviour-changing one.

## Where to read more (name, do not paste)
"Shape Up" (Singer, free at basecamp.com/shapeup); the official Scrum Guide and Kanban Guide (free, short, read them directly rather than a summary); "The Pragmatic Programmer"; "A Philosophy of Software Design" (Ousterhout); "Designing Data-Intensive Applications" (Kleppmann); "Release It!" (Nygard); "Building Evolutionary Architectures" (Ford et al.); martinfowler.com directly for MonolithFirst, StranglerFigApplication, TechnicalDebtQuadrant, FeatureToggles, TestPyramid — these are short, free, and often more precise than a summary; "Domain-Driven Design" (Evans); "Team Topologies" (Skelton, Pais, or teamtopologies.com/key-concepts); "Accelerate" and dora.dev directly (the metrics page is updated more often than any book); "Site Reliability Engineering" (sre.google/sre-book, free online); "The Mythical Man-Month" (Brooks); c4model.com and docs.arc42.org directly; adr.github.io and Nygard's original 2011 post.


---

<!-- references/architect-evolution-reference.md -->

# Architect: changing and running a system safely

Checked 2026-10-08 against pages read that day: Fowler's bliki (Parallel Change), Stripe's API versioning post and idempotency docs, microservices.io (Transactional Outbox, Saga), the Azure Architecture Center (multitenant approaches), the Google SRE Workbook (Canarying Releases), the AWS Disaster Recovery whitepaper, and the "Latency Numbers" table (a 2012 snapshot). Use with `architect-reference.md` and `planner-playbook.md`: these are the pieces a plan needs under "phased tasks", "risks" and "release plan". Provider-specific services are left out on purpose; the principles are what transfer.

## 1. Parallel change: never change a shared thing in one step
Any change to something other code depends on (a database column, an API field, a function signature, an event schema) is three steps (Fowler): **expand** (support the old and the new side by side), **migrate** (move every consumer; the longest phase when consumers are external), **contract** (delete the old one). It decouples building the change from rolling it out, and it means code can be released in any of the three phases, which is what makes it work with continuous delivery.
- Plan it as THREE tasks, each with its own done-when. A "contract" task is a real task: Fowler's warning is that skipping it leaves a worse codebase than before, with two versions forever.
- Cost: during migrate the supplier supports two versions and clients can confuse old with new. Name the end date.
- Plan check: a task that renames, removes or retypes a shared thing in one step is a finding.

## 2. API versioning (Stripe's model)
- Compatible: adding endpoints or fields. Incompatible: removing or altering a field. Stripe's own example: code testing `bank_account[:verified]` breaks when that field is replaced by `status`. (Inference: an additive field is only safe when clients ignore fields they do not know; say so in the contract.)
- Stripe versions by date (for example `2017-05-24`), pins an account to the latest version at its first request, and lets a request override it with the `Stripe-Version` header. Each version holds a small set of changes so upgrades stay incremental.
- Each incompatible change lives in a self-contained "version change module" that declares what it changes and transforms the data; modules apply in reverse chronological order to build a response for an older version. Old versions then cost a fixed amount to keep.
- Their principles: keep upgrades lightweight, make versioning first-class in docs and tooling, keep old versions cheap through tight encapsulation. Their honest trade-off: "versioning is always a compromise between improving developer experience and the additional burden of maintaining old versions."
- Plan rule: decide the versioning scheme and the deprecation window before the first external consumer exists, not after.

## 3. Idempotency keys
Anything a client may retry that moves money, sends a message or creates a record needs one. Stripe's exact behaviour: the client sends an `Idempotency-Key` header (a V4 UUID or another high-entropy string, up to 255 characters, never personal data); the server saves the status code and body of the FIRST request for that key, success or failure, and returns the same result to later requests, including a `500`. Keys may be pruned after at least 24 hours. Reusing a key with different parameters is an error. Results are saved only once execution has begun, so a request that fails validation, or conflicts with one still running, is not saved and can be retried. POST accepts keys; GET and DELETE are idempotent by definition and take none.

## 4. Reliable messaging and distributed transactions
- **Dual write problem:** updating a database and publishing a message cannot both be atomic without two-phase commit, so "sending a message in the middle of a transaction is not reliable." **Transactional outbox:** write the message to an outbox table in the same local transaction, and let a separate relay publish it, so it goes out if and only if the transaction commits. The relay can publish duplicates if it crashes, so consumers must be idempotent. Two relays: a polling publisher, or tailing the transaction log.
- **Saga:** a sequence of local transactions where each step triggers the next, and a failure runs compensating transactions to undo earlier steps. Two coordination styles: **choreography** (services react to each other's events, decentralised) and **orchestration** (a central orchestrator tells each service what to run, more explicit). Costs: compensations are written by hand, and a saga has no ACID isolation, so concurrent sagas can produce anomalies that need deliberate countermeasures.
- (Inference, label it in the plan.) These patterns exist because data is already split across services. A system on one database does not need either; the plan should say why the split exists before reaching for them.

## 5. Multi-tenancy is a spectrum, decided early
Azure's framing: at one end every resource is shared by all tenants, at the other each tenant gets isolated resources; one dedicated set per tenant "typically lacks cost efficiency and makes resource management difficult" beyond a few tenants. Every point in between trades scale, isolation, cost efficiency, performance, implementation complexity and manageability. **Deployment Stamps** give a tenant, or a group of tenants, dedicated infrastructure: single-tenant stamps need no multitenancy logic in the application, give the highest isolation and avoid the noisy-neighbour problem, but cost more and become hard to manage as tenants multiply; multitenant stamps share cost but need extra patterns and can still have noisy neighbours.
- Plan rule: choose the tenancy model at the data-model step, since it changes every table and every authorisation check. Hand the isolation checks to the security specialist.

## 6. Rollouts: canary, with a control and a stop rule
Google SRE defines canarying as "a partial and time-limited deployment of a change in a service and its evaluation," the rest of the fleet being the control. A good canary is large and long enough to be representative, has enough traffic for a real sample, and covers a busy period because performance defects "typically manifest only under heavy load". Metrics must indicate problems (start from the SLIs), be attributable to the change and not to outside factors, and must NOT be a before-and-after comparison, because time is one of the biggest sources of change in any metric. The economics: 5% of traffic with a 20% failure rate is a 1% overall error rate instead of 20%. Caveat: poor isolation lets a bad canary hurt the control.
- A release plan names the canary population, the metrics, the abort threshold and the rollback step. "Deploy and watch" is not a release plan.

## 7. Disaster recovery: start from RPO and RTO
Recovery point objective (how much data you can lose) and recovery time objective (how long you can be down) choose the strategy. In rising cost and complexity and falling recovery time (AWS): **backup and restore**, **pilot light** (data replicated, core infrastructure present but switched off), **warm standby** (a scaled-down, fully working copy that can take traffic at reduced capacity at once), **multi-site active/active**. Pilot light needs extra action before it can serve; warm standby only needs to scale up.
- Backups only count if a restore has been tested; schedule a restore job. Continuous replication does not protect against corruption or malicious deletion; add versioning or point-in-time recovery.
- Define infrastructure as code, or redeployment will blow the RTO.
- Automatic failover should be used "with caution": a false alarm costs availability and data. Many teams automate every step but keep the trigger manual, so it is a push of a button.
- Active/active needs a write strategy: **write global** (one region takes writes, another is promoted on failure), **write local** (nearest region, with conflict resolution; DynamoDB global tables use last writer wins) or **write partitioned** (a key such as user id fixes the region, avoiding conflicts).
- A small project may need only backup and restore. Say which strategy and why in the plan.

## 8. Back-of-envelope numbers (a 2012 snapshot: use the ratios, not the absolutes)
L1 cache 0.5 ns; main memory 100 ns; read 4K randomly from SSD 150 µs; read 1 MB sequentially from memory 250 µs; round trip inside one datacenter 500 µs; read 1 MB from SSD 1 ms; disk seek 10 ms; read 1 MB from disk 20 ms; packet California to Netherlands and back 150 ms. Before choosing a design, write one estimate: requests per second, payload size, storage growth per year. The inputs come from the brief or are marked as assumptions; an invented traffic figure presented as fact is a finding.

## Where to read more (name, do not paste)
martinfowler.com/bliki/ParallelChange.html; stripe.com/blog/api-versioning and docs.stripe.com/api/idempotent_requests; microservices.io/patterns/data/transactional-outbox.html and /saga.html; the Azure Architecture Center "Architectural approaches for a multitenant solution"; sre.google/workbook/canarying-releases; the AWS whitepaper "Disaster Recovery of Workloads on AWS: Recovery in the Cloud".


---

<!-- references/office-hours-reference.md -->

# Architect: product interrogation (office hours)
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

Before planning a goal that is a new product or feature idea (not a known bug or a spec
already handed down), ask what it is for. A plan built on an unverified "everyone wants
this" is a plan for the wrong thing, no matter how clean its phases are.

## Operating principles
- Specificity is the only currency -- "enterprises in healthcare" is not a customer; a name,
  a role and a reason is.
- Interest is not demand -- a waitlist signup or "that's interesting" proves nothing; money,
  expanding usage or panic when the thing breaks does.
- The user's own words beat the operator's pitch -- if how someone describes the value differs
  from the stated goal, the gap is the finding.
- The status quo (a spreadsheet, a manual workaround) is the real competitor, not another tool
  -- if the workaround is cheap, the problem may not be painful enough to build for yet.
- Narrow beats wide, early -- the smallest thing someone would act on this week beats the full
  platform vision.

## The six forcing questions
Push past the first (polished) answer to each; the real answer is the second or third pass.
Ask only the ones the goal's evidence doesn't already answer.
1. **Demand reality** -- what's the strongest evidence someone actually wants this, not "is
   interested"? Red flag: waitlist size, "VCs like the space".
2. **Status quo** -- what are they doing right now, even badly, and what does that cost them?
   Red flag: "nothing exists" often means the pain isn't there yet, not that the opportunity is huge.
3. **Desperate specificity** -- name the actual person: role, what gets them promoted or fired.
   Red flag: a category ("SMBs", "marketing teams") is a filter, not a person.
4. **Narrowest wedge** -- the smallest version someone would pay for this week, not after the
   full build. Red flag: "needs the whole platform to be useful" usually means the value prop
   isn't clear yet.
5. **Observation & surprise** -- has anyone watched a real user try this unaided, and what
   surprised them? Red flag: "we sent a survey" / "no surprises, as expected" means nobody is
   really watching.
6. **Future-fit** -- in three years, does this get more essential or less? Red flag: "the market
   is growing 20%/yr" is not a thesis; every competitor can say it too.

## Posture
- Take a position on every answer, including what evidence would change your mind -- never
  "that could work" or "many ways to think about this".
- One push per question is often not enough; a second push usually surfaces the real answer.
- Close with one concrete next action, not a restated strategy.
- Match this to the project's stage: pre-product leans on Q1-3; a shipped product with paying
  users leans on Q4-6.


---

<!-- references/strategic-review-reference.md -->

# Architect: strategic plan review (11-section rubric)
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A plan-level review checklist for a non-trivial plan, run before implementation starts and
again when drift is suspected mid-build. Each section is a lens, not a form to fill
mechanically -- skip a lens only when it genuinely does not apply, and say so.

## The eleven sections
1. **Architecture** -- component boundaries and the dependency graph; data flow for the happy,
   nil, empty and error path of every new flow; state machines including invalid transitions
   and what prevents them; what breaks first at 10x and 100x load; single points of failure;
   auth boundaries per new endpoint (who can call it, what can they change); the rollback path
   and its time cost if this ships broken.
2. **Error & rescue map** -- for every method/codepath that can fail: what can go wrong, its
   exception class, whether it's rescued, the rescue action, and what the user sees. A
   catch-all (`rescue StandardError`, bare `except Exception`) is a smell -- name the specific
   exceptions. Any gap where the user sees a raw error silently is a blocking finding.
3. **Security & threat model** -- new attack surface (endpoints, params, file paths, jobs);
   input validation at every new boundary (nil, empty, wrong type, oversized, injection
   attempts); authorization per new data access (scoped to the right user, no direct-object-
   reference leak); new secrets (env vars, rotatable); dependency risk; audit logging on
   sensitive operations. Rate each finding by likelihood x impact.
4. **Data flow & interaction edge cases** -- trace INPUT -> VALIDATION -> TRANSFORM -> PERSIST
   -> OUTPUT with shadow paths for nil/empty/wrong-type, invalid/too-long, timeout/OOM,
   duplicate/lock, stale/partial. For shared mutable state, name the invariant and its exact
   caller/time boundary, then walk both completion orders of any two overlapping async
   operations that can affect it -- naming the mechanism that prevents the bad order, not just
   a favorable schedule. For every new interaction: double-click/stale submit, navigate-away
   mid-flight, zero/huge/changing lists, duplicate/backlogged jobs.
5. **Code quality** -- fits existing patterns; duplicated logic cited by file:line (not flagged
   on resemblance alone); naming describes what, not how; missing nil/empty/boundary handling;
   over-engineering (abstractions for a problem that doesn't exist yet) and under-engineering
   (happy-path fragility) both flagged; any method branching more than 5 times gets a refactor
   note.
6. **Tests** -- diagram every new flow, codepath, job and error path, and for each: what type
   of test covers it (unit/integration/system/E2E), does it exist, what's the failure-path and
   edge-case test. Ask: what test would make you confident shipping at 2am Friday; what would a
   hostile QA engineer write to break this; what's the chaos test. Flag any test depending on
   time, randomness, external services or ordering as a flakiness risk.
7. **Performance** -- N+1 queries on every loop over an ORM association; missing indexes on new
   WHERE/ORDER BY columns; max size of every new in-memory structure; caching candidates for
   expensive/external calls; worst-case job payload and retry behavior; top 3 slowest new
   codepaths with an estimated p99.
8. **Observability & debuggability** -- structured logs at entry/exit/each branch of new
   codepaths; the one metric that proves the feature is working and the one that proves it's
   broken; trace-id propagation across new service/job boundaries; what alert and dashboard
   panel should exist day 1; could a bug reported three weeks post-ship be reconstructed from
   logs alone.
9. **Deployment & rollout** -- migration backward-compatibility and lock duration; whether a
   feature flag is warranted; migrate-then-deploy ordering; an explicit rollback plan; what
   breaks when old and new code run simultaneously during the rollout window; a post-deploy
   smoke check for the first five minutes.
10. **Long-term trajectory** -- debt introduced (code, operational, test, docs); whether this
    makes future change harder; reversibility rated 1 (one-way door) to 5 (trivially reversible);
    would this be obvious to a new engineer in 12 months.
11. **Design & UX** -- only when the plan adds or changes UI: information architecture (what
    the user sees first/second/third); a state-coverage table (feature x loading/empty/error/
    success/partial); whether mobile is a first-class consideration or an afterthought;
    baseline accessibility (keyboard nav, contrast, touch targets). Skip explicitly ("no UI
    scope") rather than silently.

## How to use it
- Produce an explicit diagram (ASCII is fine) for architecture, data flow, state machine,
  error flow, and rollback at minimum -- a described flow is weaker evidence than a drawn one.
- A finding that says "this could be a problem" without a file/line and a concrete failure
  mode is not a finding; push for the specific break.
- Keep scope decisions and deferred items visible in the output (what's accepted, what's
  explicitly deferred with a reason, what's rejected) rather than silently dropping them.


---

<!-- references/retro-reference.md -->

# Architect: weekly engineering retrospective
(adapted 2026-10-15 from github.com/garrytan/gstack, MIT license)

A different thing from this project's weekly-evolve routine: evolve researches what changed in
the outside world; this is a retrospective on the team's *own* output over the past week --
commits, PRs, tests, focus. Use it when the operator asks how the week went, not for external
research.

## What to compute from the week's git history
- **Shipping velocity**: commit-type mix (feat/fix/refactor/etc), PR size distribution, any
  fix-chain (a run of fix commits hitting the same subsystem -- a sign something wasn't done
  right the first time), version-bump discipline.
- **Time and session patterns**: when the most productive hours actually were, whether sessions
  are trending longer or shorter, estimated active-coding hours per day.
- **Code quality signals**: the test-LOC-to-code-LOC ratio and its trend; hotspot files that
  keep churning (same file touched commit after commit is a design smell, not bad luck).
- **Test health**: total test files, how many changed this period, any regression-test commits,
  and the ratio trend -- flag below ~20% test ratio as a growth area, not a pass/fail gate.
- **Shortcut debt**: if the project marks accepted shortcuts in code (a comment tagging a known
  corner cut with an upgrade trigger), surface the count and list -- this is debt made visible,
  not hidden.

## Structure of the report
1. One tweetable-length summary line up top: commit count, LOC, test ratio, PR count, peak
   hour, current streak.
2. Trends vs. the last retro, if one exists -- a number alone means less than its direction.
3. Narrative, not just tables: what the time/session patterns mean, what the velocity numbers
   reveal, what the quality signals are trending toward.
4. Top 3 wins across the period, each naming what shipped, who, and why it mattered.
5. 3 things to improve -- specific, anchored in an actual commit or file, never generic ("write
   more tests"). Each should be concrete enough to check next retro: "test coverage on the
   billing module is 8%" not "improve testing."
6. 3 habits for next week -- small, adoptable in under 5 minutes each, at least one team-facing
   (e.g. same-day PR review).
7. If it's a multi-person project, one short section per person: what they shipped, one genuine
   specific praise anchored in a real commit, one constructive growth note framed as investment
   not criticism.

## Tone
- Praise is specific or it's noise: "cleaned up the entire auth module in 3 small reviewable
  PRs" beats "great work this week."
- A growth note is framed as what it unlocks, not what was wrong: "worth investing in before the
  next feature lands on top of it," not "your tests are thin."
- Carry a recommendation from last retro forward -- did the team actually act on it? Naming
  follow-through (or its absence) is more useful than a fresh list every week.


---

<!-- references/eng-plan-review-reference.md -->

# Architect/coder: engineering-plan review doctrine
(adapted 2026-10-16 from github.com/garrytan/gstack, MIT license)

How an eng-manager-mode reviewer locks in a plan or diff before implementation starts. Use
the cognitive patterns to shape advice throughout, the confidence rule on every finding, and
the shared-code and test rubrics when a plan proposes extraction or test coverage.

## Cognitive patterns — how a good eng manager thinks about any plan
Apply these as a lens, not a checklist to recite:
1. **State diagnosis first.** Is the team/codebase falling behind, treading water, repaying
   debt, or innovating? A plan's right amount of rigor depends on which.
2. **Blast radius.** For every new path or integration, trace the worst case: what breaks,
   who notices, how far it spreads.
3. **Boring by default.** Budget a small number of "innovation tokens" per plan; spend them
   deliberately, default to proven technology everywhere else.
4. **Incremental change.** Prefer a strangler-fig migration or canary over a big-bang rewrite.
5. **Systems over heroes.** Design for a tired on-call engineer at 3am, not the author's own
   full attention.
6. **Reversibility.** Flags and staged rollouts make a wrong call cheap to undo — ask "can we
   back out of this in 5 minutes?" before asking "is this correct?"
7. **Failure is information.** Treat an incident or a caught bug as a free lesson, not a
   blame target; log it as a learning.
8. **Conway's Law.** Team boundaries and system boundaries drift toward each other — design
   them together, or expect the architecture to bend toward the org chart anyway.
9. **DX signals quality.** Slow CI, slow local dev and painful deploys are leading indicators
   of a quality and retention problem, not just an inconvenience.
10. **Essential vs. accidental complexity.** Ask whether a hard part is inherent to the
    problem or something the plan invented — only the first deserves budget.
11. **Two-week smell.** A feature that should be small taking two weeks is an onboarding or
    architecture problem, not a scheduling one — investigate why, don't just extend the date.
12. **Glue work.** Coordination, unblocking others and cross-team wiring have real value — a
    plan should name who owns it, not let it fall on whoever is most available.
13. **Make change easy, then make the change.** Refactor-to-enable and the behavior change
    are two different commits/PRs; don't let scope creep merge them.
14. **Own production.** Whoever builds it should feel the pager — a plan that routes all
    on-call to someone else is a design smell.
15. **Error budgets.** A 99.9% SLO has 0.1% to spend; a plan chasing 100% uptime at any cost
    is over-engineering, not rigor.

## Confidence calibration — every finding gets a number
Score every finding 1-10 and follow its display rule; never report an unscored finding.

| Score | Meaning | Display |
|---|---|---|
| 9-10 | Verified by reading the specific code; concrete bug/exploit demonstrated | Show normally |
| 7-8 | High-confidence pattern match, very likely correct | Show normally |
| 5-6 | Moderate, could be a false positive | Show with "medium confidence, verify" caveat |
| 3-4 | Low confidence, suspicious but may be fine | Suppress from the main report; keep in an appendix |
| 1-2 | Speculation | Report only if the severity would be P0 |

**Pre-emit gate:** before promoting a finding, quote the exact file:line(s) that motivate it.
If you cannot quote the motivating line, the finding is unverified — force it to 4-5, never
invent a 7+ to work around the gate. Format: `[SEVERITY] (confidence: N/10) file:line —
description`. For framework-generated symbols (ORM `Meta`, migrations, decorators), quoting
the construct that creates the symbol counts as verification — grepping for a name and not
finding it does not.

## Shared-code extraction rubric — before approving any "let's share this" proposal
- **Prove the callers.** Require at least two real, first-party call sites with file:line.
  Similar-looking names or formatting are not evidence of equivalent behavior. Generated or
  third-party copies never count as callers.
- **Reuse before extracting.** Check existing libraries/helpers first; compare inputs,
  outputs, error handling, side effects and deployment boundaries before assuming a new
  shared module is warranted.
- **Keep the helper small.** Name its contract, its callers, and the smallest migration
  order. An option-heavy helper that tries to serve every caller's edge case is worse than
  two small duplicated functions.
- **Account for the whole change.** State lines removed/added/saved for the core extraction
  separately from the total including tests and call-site integration; savings = removed -
  added, not a vibe.
- **Rank by net benefit.** Favor reliability gains and net savings over superficial
  similarity; reject a shared abstraction whose adoption/testing risk exceeds its payoff.

## Test value bar — before any proposed test is accepted
A proposed test earns its place only with all four answers; otherwise extend an existing
test or drop the proposal:
1. What observable behavior, invariant or contract does it protect?
2. What credible regression makes it fail?
3. Why doesn't existing coverage already catch that? (prefer a new row in an existing
   table-driven test over a near-duplicate test file)
4. Does it need a production-only seam (export, flag, wrapper) that no real caller needs? If
   yes, test at the real boundary instead.

A test that breaks under a behavior-preserving refactor is asserting implementation, not
behavior — rewrite it at the owning boundary unless exact output IS the contract (goldens,
wire formats, prompt bytes).

**Quality tiers for existing coverage:** ★★★ behavior + edge cases + error paths; ★★ happy
path only; ★ smoke test / existence check — never counts as real coverage.

## E2E / unit / eval decision matrix
- **E2E or integration test** when: the flow spans 3+ components/services; mocking would hide
  the real failure (API → queue → worker → DB); it's an auth, payment or data-destruction
  flow too important to trust to unit tests alone.
- **Eval test** when: a prompt template, system instruction or tool definition changed and
  quality — not just "it ran" — needs checking.
- **Unit test** when: a pure function, an internal helper with no side effects, a single
  function's edge case, or a rare non-customer-facing flow.

## Plan-reality sanity rows — catch a plan built on an unverified premise
Before trusting a plan's narrative, check it against these recurring failure patterns (each
one is named for the incident that justified it — treat them as a checklist, not prose to
skim):
- **Premise table** — does every claim the plan rests on ("13 of 28 threads ran nothing")
  have a per-item receipt, or is it an unverified aggregate?
- **Already-done check** — has the base branch already shipped this since the plan was
  written? Re-planning solved work wastes a cycle.
- **Surface check** — does the exact flag/API/CLI option the plan calls still exist on the
  current version, verified by running `--help` or reading the source, not remembered?
- **Binding decisions** — did an earlier owner decision get silently reverted by a later
  phase reverting to a stale default?
- **Numbers** — is every quoted ratio, percentage or benchmark re-derived, not carried
  forward from an earlier draft with no basis shown?
- **Deferred asks** — did the plan silently drop part of what was actually requested?
- **Scope-unit count** — did the unit of work (PRs, phases, files) grow silently between
  drafts without anyone pricing the extra review cost?

## Review sections, in order
Evaluate in this order and never skip one, even for a small plan: **1. Architecture**
(boundaries, data flow, bottlenecks, security at the API edge, one realistic production
failure per new integration) → **2. Code quality** (organization, the shared-code rubric
above, explicit error-handling gaps, technical debt) → **3. Tests** (trace every code path
and user flow, score existing coverage by the ★ tiers, apply the test value bar and E2E
matrix, flag any regression risk as CRITICAL) → **4. Performance** (N+1 queries, memory,
caching, unbounded loops — state the scale affected or mark it unknown, never invent a
benchmark).


---

<!-- references/spec-writing-reference.md -->

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
