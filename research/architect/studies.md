# Phase 5 (architect) -- per-source studies

Read 2026-11-24 through fetch agents (non-preapproved pages paraphrased, not copied). "Summary" marks a part that came back as a model summary: unverified. Nothing here is from memory.

## A. Our own skill (before)
`skills/architect/` had about 12,000 words in 10 references (planner playbook with the twelve-part format, architect playbook with decomposition rules and drift check, a 3,700-word expert reference, evolution, office hours, strategic review, retro, engineering-plan review, spec writing, agent-infra) and **no scripts**. Coverage by exact search was already broad: arc42, C4, MADR, ADR statuses, strangler, modular monolith, fitness functions, Well-Architected, Shape Up, appetite, ATAM, DORA, SLO, error budget, Conway, Team Topologies, outbox, saga, idempotency, pre-mortem, reference class, cone of uncertainty, circuit breaker, bulkhead, RICE, OKR, EARS, Kano.
**The twin was ahead:** `architect-specialist/references/architect-playbook.md` carried rules 12 to 14 (PR-sized tasks with a verifiable done-when, a context scope per task, slice-versus-layer as a micro-decision), a spec-driven-development section, a context-engineering section and a longer ADR rule; the main copy lacked them. The main copy had `agent-infra-reference.md` and the agent-infra sentences in SKILL.md that the twin lacked. Fixed by union, not overwrite.
**Verified absent:** Y-statement; event sourcing and CQRS; quality-attribute scenarios; tracer bullets; docs-as-code; anticorruption layer and context map; eventual consistency; backpressure; monorepo; build-vs-buy; RACI or DACI; and **any executable check of a plan**, although the playbook says "the app checks this" and no checker existed in this repo.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| MADR (adr.github.io/madr), ADR home | full | MADR 4.0.0 (2024-09-17) headings, which are mandatory, front-matter fields, status placeholder, file naming; Nygard 2011 and Zdun's Y-statement named |
| Fowler: ArchitectureDecisionRecord (2026-03-24), BoundedContext, StranglerFigApplication, MonolithFirst, MicroservicePrerequisites | full | What to record and where, never change an accepted ADR, reevaluation triggers; strangler four activities; Monolith First; prerequisites in hours |
| arc42 overview, C4 model home | full (arc42 on retry after a dropped connection) | Twelve section names; four abstractions and diagrams; supporting diagrams |
| DDD Reference (domainlanguage.com) | landing only (PDF link) | Context-mapping pattern names **not read** |
| Azure Well-Architected, Google Cloud Architecture Framework | full | Five and six pillars; Google perspectives |
| AWS Well-Architected pillars | **404** | Not read |
| Shape Up: contents, chapters 3 and 8 | full | Appetite definition, small and big batch, six-week cycle, two-week cool-down, betting table, circuit breaker; pitch ingredients from the table of contents only |
| Thoughtworks fitness-function article (2019), Radar techniques | article full; Radar partly summarised | Definition and thresholded examples; ADR Radar entry unverified |
| GitHub Spec Kit README and spec-driven.md | full (extracted) | Command order, generated files, constitution, `[NEEDS CLARIFICATION]`, `[P]`, gates |
| Kiro specs | full (extracted) | Three files, dependency-graph waves; EARS not confirmed |
| Anthropic: building effective agents, multi-agent research system | full (extracted) | Workflow patterns, simplicity rule; 4x and 15x token figures, 3 to 5 subagents, effort scaling rules |
| Claude Code common workflows (plan mode) | full (extracted) | Entering plan mode; the approval-flow page was not read |

## C. Not read this phase (open)
AWS pillars; DDD context-mapping pattern pages; Shape Up chapters 6 and 14; Kiro requirement notation page; C4 notation and tooling; estimation sources beyond those `architect-reference.md` cites; the installed planning skills (`blueprint`, `architecture-decision-records`, `hexagonal-architecture`, `plan`, `writing-plans`, `brainstorming`, `codebase-design`, `domain-modeling`, `spec-miner`), listed, not read.

## D. Gaps (each verified absent before being claimed)
No executable plan check; no sourced ADR template details (MADR fields, Fowler's rules); no sourced Monolith First and microservice prerequisites; no strangler-fig four activities; no Shape Up appetite and circuit breaker; no fitness-function examples; no spec-driven tooling or agent-planning patterns with numbers; the twin and main copies each held content the other lacked.
