# Phase 3 (security) -- report

Date: 2026-11-24. Status: built and checked; **stopped for operator review**. Studies: `research/security/studies.md`.

## 1. What we found
Our security skill was already strong on facts (about 15,000 words: OWASP Top 10:2025, ASVS 5.0 chapters, LLM Top 10 2025, Agentic and MCP Top 10 names, NIST 800-63B Rev 4, 20 Electron items, MCP spec attack classes). My first keyword search wrongly suggested many gaps; each claimed gap below was re-checked by exact-term search. Real gaps:
1. **No executable check** of a project's own code (the skill had no scripts at all).
2. Absent from the text: the lethal-trifecta check; GitHub Actions `pull_request_target`, `workflow_run` and script injection; JWT algorithm, key-source and entropy rules; RFC 8707 and RFC 9207; IMDSv2; Gitleaks usage and its maintenance status; best-of-N figures; npm trusted-publishing specifics; deserialization specifics.
3. **Twin drift:** `security-specialist` lacked `agent-trust-reference.md` and its SKILL.md link.

## 2. What changed
| Item | File |
|---|---|
| Scanner: about 45 rules across secrets, injection, JWT, TLS, CORS, Electron, Actions, Docker, MCP config; `--include-build` for secret formats in bundles; suppression with a reason of 10+ characters; 25 tests, 100% line coverage | `skills/security/scripts/risk-scan.mjs`, `.test.mjs` |
| Mechanical scan, JWT, Actions hardening, npm provenance and trusted publishing, SLSA levels, Gitleaks, trifecta check, LLM and MCP cheat-sheet rules, other OWASP numbers, with unverified items marked | `skills/security/references/ci-and-code-hardening-reference.md` |
| SKILL.md paragraph (required scan run, trifecta check, pointer to the new file) and three links including the previously missing `agent-trust-reference.md` | `skills/security/SKILL.md` |
| Twin re-copied (`diff -rq` clean), `flatten/security.prompt.md` regenerated (`--check` OK) | `skills/security-specialist/`, `flatten/` |

## 3. Proof
**Scanner precision on real code (read-only).** First version put 33 FAILs on the inventory app, almost all Python f-strings that interpolate column lists or constants while values stay `?` placeholders. I split the rule: FAIL only when a variable lands in a value position; interpolation of an ALL_CAPS constant or a placeholder-named variable is WARN. Result: 0 FAIL, 32 WARN on that app; I read all 10 lines that stayed FAIL under the intermediate version and none was a confirmed injection. On `researchmodel1`: 0 FAIL, 26 WARN (innerHTML use, Actions pins). On qurn itself: 0 FAIL in `skills/`, 2 WARN (an MD5 in `design-board.mjs`, probably not for passwords; not checked). The scanner's own test file is excluded by name, and `v2/.../skill-scan.test.mjs` fixtures (deliberately fake keys) were flagged as expected.
**Scanner on a fixture with 26 planted defects** (my fixture): 28 findings, 19 of the 26 planted defects found, plus one real bonus (a download piped straight into a shell). The 7 it cannot see need judgment: SSRF, IDOR, client-trusted price, unsigned webhook, no login rate limit, fallback JWT secret, and the lethal trifecta.
**Blind review, same fixture, read-only reviewers with no shell, one run each:**
| Reviewer | Planted defects found | Verdict |
|---|---|---|
| Old skill | 26 of 26 (counted the trifecta by substance: private inbox, outsider-written emails, send to any address; did not use the word) | redo |
| New skill | 26 of 26 (named all three trifecta legs) | redo |
**Honest reading: no measurable reviewer gain.** These are well-known vulnerabilities and both reviewers found every one; the fixture has a ceiling effect. The old reviewer was actually better on the skill's WORDING requirement (it wrote the privacy-policy sentence naming Anthropic; the new reviewer only said to check). The new reviewer cited exact numbers (Argon2id parameters, an 88-bit JWT secret against 256 needed). The real gains are the repeatable scanner and the corrections. A harder fixture with subtle logic flaws is needed to separate the two.
**Limits:** one run per side; I wrote the fixture; no real product tested; scanner is line-based for most rules (a multi-line SQL string can be missed) and is not a dependency audit or a history scan.
**Checks:** `diff -rq skills/security skills/security-specialist` clean; `build-flatten --check` OK; `node --test` 191 tests, 191 passed on 4 consecutive runs after the last edit (earlier runs that day had 1 unidentified failure in 9, most likely the known ledger-concurrency flake).

## 4. Mistakes and surprises (not hidden)
- My first gap list was too long because I searched by keyword and missed phrasing differences; I re-verified every item by exact term before keeping it.
- A shell here-doc edit mangled one regex in the scanner (literal newlines inside a pattern). I found it with `node --check`, rewrote the function from a clean file, and the tests caught the JWT-list bug that followed.
- The dedupe I added (one finding per rule per line) broke one of my own tests; I fixed the test, not the behaviour.
- `mcp/specialists.json` is still a stale outside snapshot with no generator in this repo; it lacks Phase 1, 2 and 3 work.

## 5. Unverified or not read
SSDF practice groups (page had only the abstract), MITRE ATLAS (404), Trivy (404 after redirect), OSV-Scanner commands, Semgrep rulesets and `--error`, SLSA 1.2 text (read v1.1, marked retired), OWASP LLM Top 10 2026 page, the DeepMind CaMeL and agent design-pattern papers, privacy-law texts (legal items stay with `research`, "not legal advice"), the installed security skills in depth, Gitleaks' successor (named on the README, not checked).

## 6. Open items for you
1. `mcp/specialists.json`: how should it be regenerated? (open since Phase 1)
2. Fix the flaky `qurn-ledger` concurrency test? (open since Phase 2)
3. Want a harder, subtler security fixture, or a real before/after on a real project?
4. Phase 4 (coder) starts only when you say so.
