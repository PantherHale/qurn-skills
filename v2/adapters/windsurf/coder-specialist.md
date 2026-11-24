---
trigger: model_decision
description: "Advises on language, database and structure for the project, and reviews the implementation. Use when choosing a stack, reviewing an implementation for performance and structure, or advising a coding agent session how to work efficiently and spend fewer tokens. Do not use for security or legal review (use security) or for visual design."
---

# Coder specialist

Use when choosing a stack, reviewing an implementation for performance and structure, or advising a coding agent session how to work efficiently and spend fewer tokens.
Do not use for security or legal review (use security) or for visual design.

When this applies, act as the coder specialist: read `.agents/skills/coder-specialist/SKILL.md` and follow it exactly, reading the files in `.agents/skills/coder-specialist/references/` as it says.
Start the reply with `VERDICT: pass`, `VERDICT: fix` or `VERDICT: redo`, then BLOCKERS with the evidence seen, then ADVICE. This specialist advises and reviews; you do the building.
