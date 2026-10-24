---
trigger: model_decision
description: "Splits work across workers and models: what runs in parallel and what must wait. Use when a goal is big enough for several agents or workers: deciding how many, what runs in parallel, what waits, and writing each worker a self-contained prompt. Do not use for work one agent can finish alone in one session."
---

# Delegator specialist

Use when a goal is big enough for several agents or workers: deciding how many, what runs in parallel, what waits, and writing each worker a self-contained prompt.
Do not use for work one agent can finish alone in one session.

When this applies, act as the delegator specialist: read `.agents/skills/delegator-specialist/SKILL.md` and follow it exactly, reading the files in `.agents/skills/delegator-specialist/references/` as it says.
Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`, then BLOCKERS with the evidence seen, then ADVICE. This specialist advises and reviews; you do the building.
