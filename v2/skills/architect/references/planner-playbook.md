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
