# Phase 6 (delegator) -- per-source studies

Read 2026-11-24 through fetch agents (non-preapproved pages paraphrased, not copied). "Summary" marks a part that came back as a model summary: unverified. Nothing here is from memory.

## A. Our own skill (before)
`skills/delegator/` had about 5,800 words in 3 references (playbook with the worker prompt template and DAG-first checklist, a 3,800-word expert reference, multi-vendor dispatch) and **no scripts**. The twin was the weaker copy this time (main held the agent-dispatch bullet and file; the twin held nothing unique), so main to twin was safe, but I diffed both directions first.
The reference was already deep: the three parallelism primitives, the OrchestraBench failure asymmetry, Vals AI team-versus-solo cost numbers (secondhand), the runtime-lock pattern, concurrency and isolation mechanics, handoff documents, worker status protocol, MAST and Cognition mentioned.
**Two stale pointers fixed:** the playbook said "must match night-delegation.ts" and cited `night-model.ts`; those files belong to the Qurn app, not this repository.
**Verified absent by exact search:** the `SubagentStart` and `SubagentStop` hooks; `maxTurns` partial results; Cognition's two principles in their own words; the 1,000-2,000-token return size; the 4x and 15x token figures; two-stage review; wave planning; any executable check of a dispatch.
**The playbook's concurrency claims were confirmed verbatim** this round (cap of 20, depth of 3, worktree from the default branch, auto-removal when unchanged); before they were "re-checked" from secondary sources.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| Claude Code sub-agents page | first 40k of 115k characters verbatim, rest summary | Context isolation, `isolation: worktree`, `maxTurns`, background default, model order, tool restrictions; the limits themselves came through the summary and were confirmed on the SDK page |
| Claude Code agent-sdk/subagents page | full | Verbatim: `CLAUDE_CODE_MAX_CONCURRENT_SUBAGENTS` default 20, `CLAUDE_CODE_MAX_SUBAGENT_SPAWN_DEPTH` default 3, `maxBudgetUsd` no default limit; the subagent receives only the prompt string; AgentDefinition fields |
| Claude Code agent-teams page | full | Experimental flag, 3 to 5 teammates, 5 to 6 tasks each, linear cost, one team per session, file overwrites, task list with file locking |
| Claude Code worktrees page, common-workflows | full | `.claude/worktrees/<name>`, branch `worktree-<name>`, `worktree.baseRef`, cleanup rules, `-p` runs not cleaned |
| Claude Code hooks page | the SubagentStart and SubagentStop sections verbatim; the rest summary | `additionalContext`, `decision: "block"`, `last_assistant_message` |
| Claude Code settings page | full | No environment-variable list on that page |
| Anthropic: effective context engineering | full | Subagents return a condensed summary of "often 1,000-2,000 tokens" |
| Anthropic: writing tools for agents | full | 25,000-token default tool-response cap in Claude Code; concise versus detailed responses; consolidation |
| git-worktree manual | full | add, list, lock, remove, prune; one branch per worktree unless forced; shared refs and config; submodule warning |
| arXiv 2503.13657 (MAST), abstract and HTML v3 | abstract full; HTML first 40k characters verbatim then summary; the PDF returned unreadable bytes | 1,642 traces, 7 frameworks, 14 failure modes in 3 categories, kappa 0.88, 41% to 86.7% failure rates; the first category's percentages verbatim, the others summary |
| Cognition, "Don't build multi-agents" (2025-06-12) | full | Two principles; the Flappy Bird example; single-threaded linear agent; author's caveat |
| Phase 5 reads reused | | Anthropic multi-agent research system (4x, 15x, 3 to 5 subagents, effort scaling) and building-effective-agents patterns |

## C. Installed orchestration skills
`dispatching-parallel-agents` was read; its pattern (one agent per independent domain, self-contained prompt, focused output, review and integrate) is already in our playbook. `subagent-driven-development` (2,844 words) was **grepped, not read in full**: it uses an implementer status protocol (DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED), a task review after every task and "never dispatch multiple implementation subagents in parallel" (conflicts), which points the opposite way from fan-out for implementation. The ECC skills (`team-agent-orchestration`, `parallel-execution-optimizer`, `autonomous-loops`, `claude-devfleet`) and `dmux-workflows` were sized only: **not read**.

## D. Not read (open)
`/batch` documentation; the environment-variables page; the hooks page outside the two subagent sections; MAST prevalence beyond category one; OrchestraBench beyond the abstract; the ECC and dmux skills; any real multi-agent run of this project.

## E. Gaps (each verified absent before being claimed)
No executable check of a dispatch; unsourced concurrency and isolation numbers (now sourced); no hook-based verification gate; no agent-team numbers; no Cognition principles or MAST taxonomy in sourced form; no return-size guidance; stale pointers to another product's files.
