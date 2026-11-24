# Qurn V2 management system

The advanced management layer. It extends the six management rules in `SKILL.md`; it replaces none of them. The ledger stays append-only, the operator still decides anything hard to reverse, and the plan is still auto-accepted unless the gate in `assumptions-gate-reference.md` has an open question.

Read the section you need; a small job uses only sections 1, 2 and 6.

## 1. Run modes

Pick the mode at the start and write it at the top of `docs/design/QURN_PLAN.md`. The operator can force one with `/qurn pro <request>`.

| Mode | Use when | What runs |
|---|---|---|
| **Lite** | One feature, one or two specialists | Assumptions gate, ledger, final BRIEF. No budgets, no risk register |
| **Standard** | A normal build | Lite plus waves (section 3), gates (section 5), change control (section 7) |
| **Pro** | A paid or client project, anything going public | Everything: budgets (4), risk register (8), escalation matrix (9), handoff packets (10), status reports (11), retro (12) |

Whether Pro is a paid tier is a product decision for the owner of this repo. Nothing in the skill enforces billing; it only defines what Pro does.

## 2. Charter

`QURN_PLAN.md` is the single charter: goal, audience, mode, specialists in scope, phases, out-of-scope list, constraints, budget caps, definition of done. Every later decision is checked against it. Changes to it go through section 7, never by quiet edit.

**Definition of done** is written at the start as 3 to 7 checkable statements ("cold load on the live URL under 3 s on a throttled phone", "0 errors from the glTF validator"). The `tester` specialist grades against these, not against taste.

## 3. Dependency graph and waves

Before work starts, list tasks with what each needs and what files it owns, then group into waves:

- **Wave n** = tasks whose needs are all done and whose owned files do not overlap (management rule 1).
- Run a wave's tasks in parallel when a subagent tool exists; otherwise in a fixed order.
- A task blocked by a `redo` holds only its dependents; the rest of the wave continues (management rule 3).
- Use `delegator` for the worker prompts. Each prompt is self-contained: goal, owned files, locked decisions, definition of done, what NOT to touch.

Typical order for a 3D web build: research (facts) -> architect (structure) -> web (concept + BUILD ORDERS) -> coder (stack, asset pipeline) in parallel with security (data, licences) -> build -> tester -> second-opinion reviewer -> final verdict.

## 4. Budgets (Pro)

Set caps in the charter, before work starts:

- **Time**, **money** (API/tool spend), and **tokens or turns** per specialist and in total.
- If the `project-cost-time-estimate` skill is installed, use it to size the caps; otherwise estimate by milestone and say it is an estimate.
- Ledger line after each specialist: `budget: <spent>/<cap>`. At 80% of any cap, tell the operator in one line. At 100%, stop that thread and ask (management rule 4). Never silently exceed a cap, and never "borrow" from another specialist's cap.
- Spend the operator did not approve (paid generation credits, paid assets, hosting) is always an escalation, not a budget line.

## 5. Quality gates

Each checkpoint has entry and exit criteria. A gate that fails blocks the next checkpoint, not unrelated threads.

| Gate | Entry | Exit |
|---|---|---|
| **G0 Assumptions** | Charter written | Assumptions triaged, ASK items answered or defaulted, decisions locked |
| **G1 Plan** | G0 passed | Phases, waves, definition of done, caps written; `architect` verdict not `redo` |
| **G2 Build** | G1 passed | Each BUILD ORDER done with evidence; no unlogged assumptions |
| **G3 Verify** | G2 passed | `tester` verdict `pass` against the definition of done; `security` not `redo` |
| **G4 Review** | G3 passed | Independent second opinion (SKILL.md step 8) on anything visual or 3D |
| **G5 Ship** | G4 passed | Ship checklist (SKILL.md "Lessons"), operator approval for publish |

Passing a gate is a ledger line: `gate: G3 pass -- tester pass, 0 open redo`.

## 6. Ledger schema (v2)

Same file, same append-only rule. Add structure so it can be read by a person or a script:

```
<UTC time> | <id> | <owner> | <kind> | <status> | <summary> | ev:<evidence> | h:<hash>
```

- Written and checked by `scripts/qurn-ledger.mjs` (see `qurn-pro-system-reference.md`); the hash chains each line to the one before it.
- `kind`: `verdict`, `assumption`, `decision`, `change`, `risk`, `gate`, `budget`, `escalation`, `retro`.
- Corrections are new lines that reference the old id in the summary (`corrects D4`). Nothing is edited or deleted; the script detects it if it is.
- The `status` skill reads this file; keep every line self-explanatory.

## 7. Change control

Scope changes are the main cause of overspend. When a request, a specialist or the builder implies work outside the charter:

1. Write a `change` line: what, why, who asked.
2. Cost it in time, money and files touched, and say what it pushes out.
3. CLEARED if it is inside the locked decisions; otherwise ask the operator with a recommended default (same format as the assumptions gate).
4. Approved changes update the charter by a new dated line, and the affected waves are re-planned.

Operator mid-turn messages that change scope are changes, not noise (SKILL.md "Fold in mid-turn messages"). Exception: pure fixes to something already ordered are not changes.

## 8. Risk register (Pro)

Keep up to ten live risks in the plan. Each: what could go wrong, likelihood (low/med/high), impact, an owner, a trigger that tells you it is happening, and the response. Review at every gate. Examples that recur in this repo's builds: phone performance on 3D pages, an unrecorded asset licence, a brand-lookalike product on a public site, a loader missing for a compressed asset. A risk that fires becomes a `redo` on its owner, not a note.

## 9. Escalation matrix

| Situation | Action |
|---|---|
| Specialist `redo` | Fix and re-check; others continue unless dependent |
| Same element rejected twice | Change the method: reference study, rebuild, show a close-up (SKILL.md "Lessons") |
| Two specialists disagree | Ask each for evidence, prefer the measured one; if still tied, ask the operator with both options and a recommendation |
| Cap reached, or spend not approved | Stop that thread, ask |
| Destructive, public or production action | Always ask (management rule 4) |
| Builder wants to proceed on a guess | Stop; it is a new assumption (assumptions gate) |
| Cannot verify an external fact | Mark "to verify", route to `research`, do not build on it |

## 10. Handoff packet

When work passes from one specialist or worker to the next, write one block, in the ledger or the worker prompt:

```
FROM: <who>  TO: <who>
DONE: <what exists, with file paths>
LOCKED: <decisions that must not change>
OPEN: <unresolved items, each with owner>
NEXT: <the exact ask>
KEEP: <what already works and must not be diluted>
```

The receiver reads the packet and the charter, not the sender's whole conversation.

## 11. Status reports

On request, or at each gate in Pro, give the operator one short report in plain language, in this order: finished, blocked (and why), not started, spend against caps, and what you need from them. No ledger-speak, no pasted ledger (management rule 5).

## 12. Retro

At the end of a Pro run, append a `retro` block: what slipped, which assumptions were wrong and what they cost, which gate caught a real problem, which caps were off. Fold lasting lessons into SKILL.md "Lessons from real builds" with a date and the operator's own words where they gave them. Nothing is deleted from the ledger.
