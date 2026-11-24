# Qurn Pro system: proof, not promises

What separates this lead from a checklist skill: every claim it makes is backed by something a customer can inspect, and the record cannot be quietly rewritten. Five mechanisms. They sit on top of `management-v2-reference.md` and `assumptions-gate-reference.md`.

## 1. The proof ledger (a script, not a convention)

`scripts/qurn-ledger.mjs` (Node, no dependencies; tests in `qurn-ledger.test.mjs`, run with `node --test`). It owns `docs/design/QURN_LEDGER.md`.

```
node scripts/qurn-ledger.mjs add --owner coder --kind verdict --status pass \
  --summary "disposed on unmount, 6 textures" --evidence "file:docs/proof/coder-textures.txt"
node scripts/qurn-ledger.mjs verify [--final] [--require-blind]
node scripts/qurn-ledger.mjs report > docs/design/DELIVERY_REPORT.md
node scripts/qurn-ledger.mjs lessons --project <name>   # end of run: lesson candidates, see experience-playbook-reference.md
```

Line format: `utc | id | owner | kind | status | summary | ev:<evidence> | h:<hash>`. Each hash covers the previous line's hash, so **editing, deleting or reordering any past line breaks the chain** and `verify` fails, naming the line. This turns "append-only" from a request into something checkable. Corrections are new lines.

What `verify` enforces:
- A **pass verdict must carry evidence**: `file:<path>` (the file must exist), `cmd:<what was run and seen>`, or `url:<link>`. `add` refuses a pass with none.
- **Open redo blocks `--final`.** A redo clears only when the same owner logs a later pass.
- **Budget lines** (`tokens 85/100`) warn at 80% and error over the cap.
- **Repeat failure:** a second redo from one owner prints "change the method". See section 4.
- **Blind review:** with `--require-blind`, final needs a passing verdict from `blind-reviewer` (section 2).

Qurn calls `add` in the same reply as each verdict (SKILL.md step 7). If Node is unavailable, write the same line format by hand and say the chain could not be verified; never claim a verified ledger without running `verify`.

## 2. The blind-review seat

Generalises SKILL.md step 8 from web builds to every build in Pro mode. Before the final verdict, a reviewer that has **not** seen the plan, the build orders or the ledger gets only: the finished result, the definition of done, and the evidence files. It grades against the definition of done and logs as owner `blind-reviewer`. Qurn may not override a blind `redo` by reasoning; it fixes the thing and the reviewer re-checks. No subagent tool: a separate pass that deliberately does not reread prior reasoning, and the report says it was not truly independent.

## 3. The operator profile (the gate learns)

`docs/design/QURN_PROFILE.md` keeps durable operator preferences, one per line: date, the operator's own words, and the rule it implies (for example "phone layout is its own composition", "no named competitors on a public site", "commit and push when verified"). Rules:
- The assumptions gate reads the profile first. An assumption the profile answers is CLEARED with the profile line cited, so the operator is not asked the same thing twice.
- A new answer from the operator that is a preference, not a one-off, is appended to the profile after asking "keep this as a standing rule?". Never add a preference the operator did not state.
- The profile is the operator's data. It is never copied to another project or shared without their say-so.

Effect: the longer someone uses Qurn, the fewer questions it asks and the fewer repeat corrections it needs. That compounding is the product, not any single run.

## 4. The circuit breaker

Repeat rejection is the most expensive failure (the Cola can was rejected six times). When `verify` warns "change the method", Qurn must not tweak again. The required sequence: stop, run a reference study, rebuild the weak part from real structure, show a close-up at rest, log the new method as a `decision`, then request a fresh verdict. A third redo from the same owner escalates to the operator with both attempts and a recommendation.

## 5. KEEP contracts and the delivery report

- Every `fix`/`redo` pass starts with a KEEP list, and each KEEP item names a check that can be re-run (a screenshot path, a test name, a measured value). After the fix, those checks run again and the results are logged. A fix that drops a KEEP check is itself a redo (management rule 6, now measurable).
- `report` writes `DELIVERY_REPORT.md`: verdict per specialist with its evidence, open blockers, assumptions asked and cleared, decisions, changes, risks, gates, warnings, and whether the chain is intact. Agencies can hand it to their client as the proof of what was checked. It states problems as problems; do not trim them.

## What this is and is not

It is a way to make an agent's claims inspectable and its record tamper-evident. It is not a security product: someone with write access can rebuild a whole chain from scratch, so for an external audit also commit the ledger to git and record the final hash in the commit message. It does not verify that evidence is truthful, only that it exists and was recorded in order; the blind reviewer and the tester are what test truthfulness.
