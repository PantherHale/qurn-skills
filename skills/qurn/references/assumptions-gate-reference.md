# Assumptions gate (Qurn V2)

Purpose: stop the building agent from over-coding and coding on guesses. Before any code is written on a new project, the builder shows what it is assuming. Qurn answers what it can; only the rest reaches the operator.

## When it runs

- **Always** at the start checkpoint (nothing built yet), before the first line of code.
- **Cheap re-run** mid-build whenever the builder hits a new assumption it was not given an answer for (see "Mid-build").
- **Skip** for a one-file fix or a request with no design choices in it. Say "no assumptions to gate" in one line instead.

## Step 1 -- Qurn hands over the whole plan

Write the plan to `docs/design/QURN_PLAN.md` (goal, who it is for, specialists consulted, phases, what is explicitly out of scope, constraints already known) and give the builder that file plus the repo. The builder gets the whole plan, not a slice of it.

## Step 2 -- Builder reports assumptions, writes no code

Tell the builder: read the plan and the project, then reply with an ASSUMPTIONS list only. No code, no scaffolding, no installs. Each entry:

```
A<n>. Assumes: <the thing it would take as true>
      Because: <what in the plan or repo suggested it, or "nothing -- a guess">
      If wrong: <what gets rebuilt or wasted>
      Would build: <the concrete code or feature this leads to>
```

The builder must also list **extras it is tempted to add** that the plan did not ask for (extra pages, settings, abstractions, "nice to have" features). These are the over-coding risk and are triaged like any assumption.

## Step 3 -- Qurn triages every entry

Give each entry exactly one outcome:

| Outcome | Meaning | Who sees it |
|---|---|---|
| **CLEARED** | Qurn can answer it from the plan, the repo, the ledger, the operator profile (`docs/design/QURN_PROFILE.md`), a specialist's advice, or `research`. Cite the source in a few words. | Counted in one summary line; list on request |
| **CUT** | An extra nobody asked for, or a guess that adds scope. Tell the builder not to build it. | Counted in the summary line |
| **ASK** | Only the operator can answer: product intent, money, taste, legal or privacy, anything hard to reverse, and **which countries the company, founders and users are in** (it decides which laws, taxes, payment methods and languages apply; never assume the US). | Shown to the operator |

Qurn must not clear an assumption by making up an answer. If it cannot cite where the answer comes from, it is an ASK. Anything touching spend, deleting data, publishing, or production systems is always an ASK (management rule 4).

## Step 4 -- Show the operator only the ASK items

Plain language, no jargon, one question each, each with a recommended default so a one-word reply works:

```
Before I build, <N> things I can't decide for you (I cleared <C> myself and cut <X> extras):

1. <question> -- I'd go with <default> because <reason>. Other option: <alt>.
2. ...

Reply "go" to accept all my defaults, or tell me which to change.
```

If there are zero ASK items, say so in one line and continue straight into the build. This keeps the "plan is auto-accepted" rule from step 2 of "How to run it": the gate pauses only when something genuinely needs the operator, and never to re-confirm what Qurn already settled.

## Step 5 -- Lock the answers

Append to the ledger (`docs/design/QURN_LEDGER.md`), one line per outcome:

`assumptions: A3 CLEARED -- plan says static site, no backend (QURN_PLAN.md)`
`assumptions: A5 CUT -- admin dashboard not requested`
`assumptions: A7 ASK -> operator: keep the existing logo`

Then send the builder a LOCKED DECISIONS list (cleared plus operator answers plus cuts) and tell it: build only what the plan and these decisions cover. Anything beyond them is a new assumption, not permission.

## Mid-build

If the builder hits something not covered by the plan or locked decisions, it stops that thread and reports one new assumption in the same format. Qurn triages it the same way: CLEARED or CUT continues without bothering the operator; ASK waits for the answer while other independent work carries on (management rule 3). Never let the builder guess and keep going.

## At the end

The final BRIEF lists any locked decision that turned out wrong and what it cost, so the next run's gate gets sharper.

## Failure modes to avoid

- **Rubber stamping.** Clearing everything to avoid asking. If more than about two thirds are CLEARED with no cited source, re-triage.
- **Interrogation.** Asking the operator things the plan already answers. Fewer, better questions: merge related ones.
- **Gate as theatre.** An assumptions list with no code consequences. Every entry must say what it would build.
- **Scope creep via "cleared".** Clearing an extra as "reasonable" instead of cutting it. If the plan did not ask for it, it is CUT unless the operator says otherwise.
