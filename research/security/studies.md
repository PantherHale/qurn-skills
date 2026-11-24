# Phase 3 (security) -- per-source studies

Read 2026-11-24 through fetch agents (pages from non-preapproved sources were paraphrased, not copied). "Summary" marks a page cut at about 40k characters whose rest came back as a model summary: treat as unverified. Nothing here is from memory.

## A. Our own skill (before)
`skills/security/` had about 15,000 words in 10 references, **no scripts**, and had drifted from its twin (`security-specialist` lacked `agent-trust-reference.md` and its SKILL.md link). A topic grep found the standards already current (OWASP Top 10:2025, ASVS 5.0 chapters, OWASP LLM Top 10 2025, Agentic Top 10 2026 names, MCP Top 10, NIST 800-63B Rev 4, CWE 2025, 20 Electron items, MCP spec attack classes). The earlier research was good; the gaps are the ones below.

## B. Sources read
| Source | Read | What it gave us |
|---|---|---|
| OWASP Top 10:2025 (top10.owasp.org/2025) | intro + list | Confirms the edition; A03 Software Supply Chain Failures, A10 Mishandling of Exceptional Conditions; SSRF folded into A01 |
| OWASP ASVS 5.0 (asvs.owasp.org, repo tree) | home + chapter list | 5.0.0 published 30 May 2025, 17 chapters, "around 350" requirements; L1 about 20%, L2 about 50%, L3 about 30% (paraphrase) |
| OWASP LLM Top 10 | list page | 2025 list of ten; a separate 2026 page exists, not read |
| OWASP cheat sheets: Authentication, Session Management, Password Storage, JWT, SSRF, CSRF, File Upload, Deserialization, Docker, CI/CD, Secrets Management, LLM Prompt Injection, MCP | all read (some parts summary) | Exact numbers: Argon2id m=19456 t=2 p=1; bcrypt 72-byte limit; JWT 160-bit HMAC, no `none`, no key from `jwk/jku/x5u`; SSRF deny-list ranges and redirect rule; CSRF Sec-Fetch-Site and signed double-submit; docker rules; best-of-N 89% and 78% data point; MCP: hash-pin tool definitions, Origin 403, `additionalProperties: false` |
| MCP spec: security best practices (draft), authorization 2025-06-18 | full | Attack classes (confused deputy, token passthrough, SSRF in discovery, state handle hijack, local server compromise, URL validation, mix-up, scope minimisation); RFC 8707 `resource`, PKCE, audience validation; RFC 9207 for mix-up; DCR deprecation noted in the draft |
| Simon Willison, "The lethal trifecta" (2025-06-16) | full | Three legs; avoid the combination; guardrails unreliable; points to the "Design Patterns for Securing LLM Agents" paper and CaMeL (neither read) |
| Electron security checklist and fuses | full | 20 items (matches ours); fuse defaults and "most apps can safely..." advice |
| GitHub: security hardening for GitHub Actions | read as markdown | SHA pinning (or lockfile), read-only default token, avoid `pull_request_target`, use `workflow_run`, script injection through `env:` |
| npm: provenance statements, trusted publishers | full | npm 9.5.0, `id-token: write`, `npm audit signatures`; trusted publishing needs npm 11.5.1 and Node 22.14.0, no self-hosted runners, 2-day first publish, 10 publishers per package |
| SLSA build levels | full (v1.1, marked retired) | L0-L3 definitions; v1.2 is current and was not read |
| Gitleaks README | full | Commands, flags, exit codes, `gitleaks:allow`, baseline, pre-commit; **feature-complete, security patches only, successor named Betterleaks** |
| NIST SSDF SP 800-218 | abstract only | The four practice groups were not on the page |
| OSV-Scanner | landing only | No commands read |
| Semgrep quickstart | partial | `semgrep ci`, login; rulesets and `--error` not read |
| Trivy docs | **404** after redirect | Not read |
| MITRE ATLAS matrix | **404** | Not read |

## C. Local skills compared (not read in depth this phase)
Installed security skills (`security-review`, `security-scan`, django/laravel/springboot/quarkus security, ECC security skills, `security-bounty-hunter`) were listed, not read line by line: marked **open**. Phase 3 compared sources against our text by topic search and used the new scanner on real code to test precision.

## D. Gap list (each checked by exact-term search before being claimed)
Absent from our files: lethal-trifecta check; `pull_request_target` / `workflow_run` and script injection in Actions; JWT algorithm and header-key rules; RFC 8707 and RFC 9207; IMDSv2; Gitleaks usage and its maintenance status; best-of-N data; npm trusted-publishing details; `TypeNameHandling` and `BinaryFormatter` specifics; and, most important, **any executable check of a project's own source**. Twin drift also found.

## E. Not read (open)
SSDF practice groups, ATLAS, Trivy, OSV-Scanner commands, Semgrep rulesets, SLSA 1.2, OWASP LLM Top 10 2026, the DeepMind CaMeL and agent-design-patterns papers, privacy-law texts (GDPR, CCPA, CAN-SPAM, COPPA, India DPDP: legal items stay with `research` and "not legal advice"), installed security skills in depth.
