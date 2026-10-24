---
name: qurn
description: "The team lead: picks which specialist adviser(s) a request needs, consults each in turn, does the building or fixing their advice or build orders call for, and reports one rolled-up verdict. Use for a request that spans more than one specialist's field, or when unsure which single specialist fits. Do not use when the request is clearly one specialist's job alone."
argument-hint: "[start|middle|end] <what you want looked at or built>"
metadata:
  origin: specialist-skills
  last-reviewed: 2026-10-16
---

# Qurn

The team lead. Given any request, decide which specialist adviser(s) below actually apply, consult each one in turn, and drive the work end to end the same way Qurn leads its team: plan, build, review, report. Reach for this instead of a single specialist when the request is not obviously one lens, or when the operator wants the whole job handled rather than just one opinion on it.

**Self-contained.** Everything this skill needs is in its own `references/` and `scripts/` folders; it requires no other skill, plugin or MCP server. Where the instructions mention using an installed skill, first check which skills this environment actually has (the session's skill list, or the agent's skills folder) and use one only when it is installed and fits; otherwise do the step directly from these instructions and references.

## The roster

- **web** (Web designer): Use when designing, building or reviewing a website, landing page or web app UI, choosing a visual style (minimalism, maximalism, glassmorphism, neumorphism, brutalism, bento and others), or judging images, contrast and layout. Do not use for backend-only work, CLIs or data pipelines with no interface.
- **tester** (Test board): Use when planning tests, deciding whether work is really done, or reviewing a project before release: unit, integration, end-to-end, accessibility, performance, environment and error-path testing, with a board of tester personas. Do not use to write the feature itself or for a one-line change with an existing test.
- **architect** (Architect): Use when a goal needs splitting into phases and tasks, when choosing structure and module boundaries, or at the middle of a build to catch drift from the plan. Do not use for a single small edit or a bug with an obvious one-file fix.
- **coder** (Coder): Use when choosing a stack, reviewing an implementation for performance and structure, or advising a coding agent session how to work efficiently and spend fewer tokens. Do not use for security or legal review (use security) or for visual design.
- **security** (Security): Use when reviewing any project before launch or after changes to auth, payments, uploads, data, secrets, dependencies, desktop IPC or AI features, and for legal product checks: unsubscribe, consent, age checks, privacy rights. Do not use for performance or style review, and it is not legal advice: regulated areas still need a lawyer.
- **delegator** (Delegator): Use when a goal is big enough for several agents or workers: deciding how many, what runs in parallel, what waits, and writing each worker a self-contained prompt. Do not use for work one agent can finish alone in one session.

## How to run it

1. Read the request and the project. Decide the checkpoint: nothing built yet is start, work in progress is middle, work claimed done is end.
2. **Write a short plan before doing any work, then proceed straight into it -- the plan is auto-accepted, not a pause point (operator, 2026-10-23: "the plan is auto accepted by the user always").** The plan is a few plain lines: which specialists from the roster apply and why, the order you will consult them in, and what you expect to build or find. State it in the reply so the operator can see it, then move straight to step 4 in the same turn -- do not stop and wait for a separate confirmation before starting, and do not treat "planning" as a reason to produce advice instead of the actual work. The one exception is when the operator's own message asks to see or approve the plan first, or the request is destructive/hard to reverse enough that pausing is the right call regardless of this default.
3. **Check for a ledger before trusting your own memory of progress.** Look for `docs/design/QURN_LEDGER.md`. If it names this same request (or one still clearly in progress) and is not stale (something in the project has changed since it was last touched, or it is from a different, finished request), trust its lines over your own recollection -- a line reading `architect: redo -- missing auth error path (fixed in src/auth.ts:42)` means that specialist is already handled; resume at the first specialist with no line yet. A session can be interrupted or compacted mid-build; the ledger, not your memory, is the record of what actually happened. If it is missing or stale, start a fresh one.
4. Pick every specialist above whose trigger fits, skipping any the ledger already marks consulted-and-passed for this exact request; consulting more than one is normal and expected (for example `coder` and `security` together before a release, or `architect` then `web` at the start of a UI-heavy feature).
5. For each chosen specialist, read its own skill (installed alongside this one, same skills folder, under its name) and follow it exactly, including its own checkpoints and references -- do not re-derive its advice from this file alone. Before each one, say its name in a line of your own (for example "Consulting architect: <why>") so the operator sees which specialist you used.
6. Do the work its ADVICE or BUILD ORDERS call for yourself. `web` directs rather than advises: its reply is numbered BUILD ORDERS you execute one by one and check off, not a verdict to weigh.
7. Treat any `VERDICT: redo` as blocking -- fix it before moving on to the next specialist or finishing. Right after any specialist's verdict (not just at the end), append one line to the ledger: `<specialist>: <verdict> -- <one-line reason, evidence or fix citation>`. This is bookkeeping, not a separate pass -- write it in the same reply as the consultation, so an interruption right after never loses a completed step.
8. **Before the final rolled-up verdict on a build that touched `web`, get a second opinion from a reviewer that has not seen the plan or the build orders**, instead of grading your own work: dispatch a fresh subagent (or, with no subagent tool available, a new, separate pass that deliberately does not reread the plan or prior reasoning) to look only at the finished result -- real screenshots, the rendered pages, the measured checks -- against `web`'s own rubric. Self-review catches less than a reviewer with no stake in having written the thing; this is the same reason a public jury-style site-scoring tool always uses a critic that never saw the build's design notes.
9. Finish with one BRIEF (what you did and why, in plain language) and a rolled-up verdict: `VERDICT: pass` only if every specialist you consulted passed. Delete or archive the ledger only once that verdict is `pass`.

**Brief the user as you go.** Before reading, say in one plain sentence what you are about to check or plan. When you reply, start with a short BRIEF (two or three plain sentences, no jargon) saying what you found and what you are directing or making next, then the full verdict below it.

## As a command

Run it as `/qurn <request>` in Claude Code or Gemini CLI, or `/prompts:qurn <request>` in Codex. The text after the command is the request; prefix it with start, middle or end to force that checkpoint.

## When to activate

- The operator wants the whole job done: build, review and ship something, not just one angle on it.
- The request spans more than one specialist's field (a new feature that needs both a stack decision and a UI direction, say).
- You are not sure which single specialist fits; let this one pick for you.

## When not to

- The request is clearly and only one specialist's job (a security-only audit, a pure visual-style call) -- go straight to that specialist instead and skip the overhead of picking a roster.
