# Phase 8 (evolve, status, qurn lead) -- per-source studies

Read 2026-11-24. Fetched pages were read through a fetch agent (non-preapproved pages paraphrased). Nothing here is from memory.

## A. Our own skills (before)
- `skills/qurn/` (V1 lead): one SKILL.md, 2,309 words, no references, no scripts. `v2/skills/qurn/` is the Pro lead: 3,065 words, 7 references and a hash-chained ledger script with tests.
- `skills/evolve/` (939 words) and `skills/status/` (480 words): one SKILL.md each, no twins, no scripts.
- Evolve's instructions point at the Qurn app's vault and at `src/specialists/knowledge/*.md`, and name coworkers "web-designer" and "test-board" and omit research; none of that exists in this repository.
- `v2/` is "a second, self-contained copy of the specialist skills with the Pro lead" (its README). **Every upgrade from Phases 1 to 7 lives only in V1 `skills/`.** V2 has none of it.
- The qurn skill installed in `~/.claude/skills/qurn` is neither V1 nor V2: it has 4 of V2's 9 references, one pointer to a missing file (`references/domain-atlas-reference.md`), and a copy of `qurn-ledger.mjs` with the lock bug below.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| Anthropic Agent Skills best practices | full | Name at most 64 characters, lowercase letters, digits, hyphens, no "anthropic" or "claude"; description at most 1,024 characters, third person, what and when; body under 500 lines; references one level deep; table of contents for reference files over 100 lines; no time-sensitive content; scripts should solve errors, not punt, and justify constants; at least three evaluations; test with Haiku, Sonnet and Opus |
| Agent Skills overview | full | Loading levels: metadata about 100 tokens always, instructions under 5k tokens when triggered, resources as needed; use skills only from trusted sources; audit bundled files |
| Anthropic engineering post on Agent Skills (2025-10-16) | full (paraphrased) | Progressive disclosure as the core principle; start with evaluation; security warning about untrusted skills |
| ECC `skill-stocktake` | read (first 110 lines) | Quick Scan versus Full modes, a results cache, a Keep, Improve, Update, Retire, Merge verdict per skill, chunks of about 20 per subagent; it relies on shell scripts and a subagent judgement |
| ECC `skill-comply`, `skill-scout`, `rules-distill` | first lines only | skill-comply measures whether agents actually follow a skill by generating scenarios at three strictness levels; skill-scout searches before creating a skill; rules-distill extracts cross-cutting principles ("deterministic collection plus judgement"). Not read further |
| Our V2 `qurn-ledger.mjs` and its test | read and stress-tested | Root cause of the flaky concurrent-writers test, below |

## C. The flaky ledger test (open since Phase 2): diagnosed and fixed
Reproduced with 16 concurrent writers per round and CPU load: `EPERM: operation not permitted, open '...ledger.md.lock'` (2 failures in 640 writer runs). On Windows a lock file whose deletion is pending is reported as EPERM (or EBUSY, EACCES) instead of EEXIST, and `withLock` treated any code but EEXIST as fatal. Fix: `isRetryableLockError` retries EEXIST everywhere and EPERM, EBUSY and EACCES on Windows only. After the fix: 0 failures in two rounds of 640. The full suite then passed 379 of 379 on three runs. Evidence is strong, not proof: an intermittent bug can hide.

## D. Not read (open)
`skill-comply`, `skill-scout` and `rules-distill` beyond their first lines; the `skill-stocktake` scripts; how other teams run a weekly refresh (no source found or read); any run of the real qurn lead on a real project (the V2 README says this is not yet tested).
