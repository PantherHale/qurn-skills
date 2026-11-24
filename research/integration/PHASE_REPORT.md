# Phase 9 (cross-field integration) -- report

Date: 2026-11-24. Status: built and checked; committed locally, **not pushed**.

## What I did
1. **Ran every specialist's scan on a real project, this repository** (the only real code available without inventing a fixture). `risk-scan`, `perf-scan` and `suite-smell-scan` on `mcp/`, `scripts/` and the V2 ledger script: 0 FAIL, 0 WARN each. `skills-health`: 0 FAIL, 48 WARN (38 reference files with no table of contents, 10 scripts with no test). `context-lint` on `AGENTS.md`: **1 real WARN, no check command** -- fixed by adding a Checks section. `plan-lint` and `report-lint` correctly FAIL on documents of the wrong type (the research plan, the phase reports); that is a type mismatch, not a finding.
2. **Found and fixed integration gaps:** `mcp/specialists.json` was a stale outside snapshot with no generator and no research specialist. New `scripts/build-mcp.mjs` (3 tests, `--check` mode) regenerates it from the `-specialist` folders; it now serves seven specialists and the server text says so. CI now also runs `build-mcp --check` and `skills-health` so twin drift and stale data fail a pull request.
3. README "How it's built" lists the scans and the regenerate commands.
4. Twin pairs: `skills-health` reports no drift (it fails on any). Flatten `--check` OK, mcp `--check` OK.
5. Test run: 382 of 382 pass.

## What this is not
- **Not an end-to-end run of the qurn lead on a new application.** I ran the scans as a team on the repository itself. No new app was built, so there is no before/after on a fresh build. The V2 README says the same about the lead.
- CI was not run remotely (nothing pushed); I ran the same commands locally.

## Open items for you
1. **V1 vs V2:** Phases 1-7 are V1 only; `v2/` has none of them. Still your decision which is canonical.
2. `CHANGELOG.md`, `CONTRIBUTING.md` and the two issue templates show as deleted in the working tree (not by me, as far as I know). I did not restore them (my restore was blocked) and did not commit those deletions, so no changelog entry was written.
3. Installed `~/.claude/skills/qurn` still has the old lock bug (outside the repo).
4. 38 reference files without a TOC; 10 scripts without tests.
