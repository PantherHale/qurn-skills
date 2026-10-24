# Specialists

Six specialist advisers. Consult the one that fits the task; each ends its reply with a verdict. Full skills with their references live in `skills/<name>/` (installed copies: `.agents/skills/<name>/`).

## web

Use when designing, building or reviewing a website, landing page or web app UI, choosing a visual style (minimalism, maximalism, glassmorphism, neumorphism, brutalism, bento and others), or judging images, contrast and layout. Do not use for backend-only work, CLIs or data pipelines with no interface.

Full instructions: `skills/web/SKILL.md`.

## tester

Use when planning tests, deciding whether work is really done, or reviewing a project before release: unit, integration, end-to-end, accessibility, performance, environment and error-path testing, with a board of tester personas. Do not use to write the feature itself or for a one-line change with an existing test.

Full instructions: `skills/tester/SKILL.md`.

## architect

Use when a goal needs splitting into phases and tasks, when choosing structure and module boundaries, or at the middle of a build to catch drift from the plan. Do not use for a single small edit or a bug with an obvious one-file fix.

Full instructions: `skills/architect/SKILL.md`.

## coder

Use when choosing a stack, reviewing an implementation for performance and structure, or advising a coding agent session how to work efficiently and spend fewer tokens. Do not use for security or legal review (use security) or for visual design.

Full instructions: `skills/coder/SKILL.md`.

## security

Use when reviewing any project before launch or after changes to auth, payments, uploads, data, secrets, dependencies, desktop IPC or AI features, and for legal product checks: unsubscribe, consent, age checks, privacy rights. Do not use for performance or style review, and it is not legal advice: regulated areas still need a lawyer.

Full instructions: `skills/security/SKILL.md`.

## delegator

Use when a goal is big enough for several agents or workers: deciding how many, what runs in parallel, what waits, and writing each worker a self-contained prompt. Do not use for work one agent can finish alone in one session.

Full instructions: `skills/delegator/SKILL.md`.

## evolve

Use when asked to refresh, evolve or update the team, or what changed this week. It researches the past 7 days and writes sourced notes the specialists then read.

Full instructions: `skills/evolve/SKILL.md`.

## qurn

The team lead: use for a request that spans more than one specialist above, or when unsure which one fits. It consults each that applies in turn and reports one rolled-up verdict.

Full instructions: `skills/qurn/SKILL.md`.
