# Skill design: research notes

2026-09-23

Scope: how strong existing AI-agent SKILLS are designed, applied to (a) six specialist advisers — web designer, test board, architect, coder, security, delegator — and (b) packaging those specialists as portable skills that work across Claude Code, Codex, Gemini CLI, Antigravity, and plain-prompt models (Ollama, DeepSeek, Hermes). This file is read-only research; it does not modify the sibling specialist files (`web-designer.md`, `test-board.md`, `architect.md`, `coder.md`, `delegator.md`) already in this directory.

---

## Skills studied

30 local `SKILL.md` files were read in full (well past the 15 minimum), covering design, security, testing, coding-efficiency, architecture/planning, and orchestration. 12 public sources were fetched (specification, three agent-vendor docs, one reference repo, one flagship community methodology, two community collections).

### Local — design

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| taste-skill | `C:\Users\gaura\.claude\skills\taste-skill\SKILL.md` | Section 0 "read the room before anything else" — forces a one-line **Design Read** statement before any code; explicit dial system (`DESIGN_VARIANCE`/`MOTION_INTENSITY`/`VISUAL_DENSITY` 1–10) turns vague taste into checkable numbers; huge "banned defaults" tables (palettes, hex codes, serif fonts) with a named **override condition** for each ban, not a blanket rule | 1,207 lines in one file — the single worst progressive-disclosure violator studied; everything is prose+tables in SKILL.md itself, nothing pushed to `references/` |
| apple-design | `C:\Users\gaura\.claude\skills\apple-design\SKILL.md` | Named-principle numbering (1. Response, 2. Direct manipulation, …) that doubles as a shared vocabulary; a closing "Quick Reference" table that compresses the whole skill to one screen — good progressive-disclosure-within-a-file pattern | Concrete numeric constants (damping `1.0`, deceleration `0.998`) stated as universal truths without a "why" pointer — reads as authoritative physics but is really Apple's product opinion |
| impeccable | `.claude\plugins\cache\impeccable\impeccable\4.0.2\skills\impeccable\SKILL.md` | Best command-router pattern seen: one table mapping sub-commands → reference file, explicit "no argument → load routing.md, never auto-run" rule; **mode** vocabulary (Persuade/Operate/Read/Experience) shared across all sub-skills; a stated verification budget ("bounded passes, not a loop") that forbids screenshot-per-tweak cost blowups | Deep reference chains (`reference/new-work.md` → other refs) risk violating the spec's "keep references one level deep" rule |
| ui-ux-pro-max | `C:\Users\gaura\.claude\skills\ui-ux-pro-max\SKILL.md` | Priority-ranked rule table (1–10, CRITICAL→LOW) so an agent triages instead of reading linearly; ships a real CLI (`search.py --domain`) so the knowledge base is queried, not loaded whole — the strongest scripts/ bundling example studied | 686 lines with bilingual (Chinese/English) prose mixed into one file; still front-loads huge quick-reference tables in SKILL.md instead of `references/` |
| frontend-design | `C:\Users\gaura\.claude\skills\frontend-design\SKILL.md` | Explicit "brainstorm → plan → critique → build → critique again" process with a required token-system output (4–6 named hex values, 2+ typeface roles) before code; names the three current AI-design clichés by hex value so the model can self-detect them | Relies entirely on the model's judgment for "is this templated" — no mechanical checklist a smaller/cheaper model could run |
| make-interfaces-feel-better | `.claude\skills\ecc\make-interfaces-feel-better\SKILL.md` | Compact, single-purpose, ~150 lines; ends in a before/after **review-output table format** plus a mechanical checklist — a good template for a narrow, checkable specialist sub-skill | Marked `metadata.origin: community` with a literal provenance note ("salvaged from stale community PR #1659 by `linus707`") — good transparency practice worth copying verbatim |
| liquid-glass-design | `.claude\skills\ecc\liquid-glass-design\SKILL.md` | Platform-scoped (iOS 26 SwiftUI/UIKit/WidgetKit only) and says so in the description — never claims to work where it doesn't; explicit anti-patterns list | Narrow to one platform; not reusable as a cross-agent pattern reference beyond "scope your compatibility honestly" |
| design-system | `C:\Users\gaura\.claude\skills\design-system\SKILL.md` | Three-layer token architecture (primitive→semantic→component) as a portable naming convention; scripts table with one-line purpose per script | Frontmatter includes non-spec fields (`argument-hint`, `metadata.author/version`) with no compatibility note about which agents honor them |

### Local — security

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| security-review | `C:\Users\gaura\.claude\skills\security-review\SKILL.md` | FAIL/PASS paired code blocks per topic (hardcode vs env var, string-concat SQL vs parameterized) — the clearest "show, don't just tell" pattern in the whole set; per-topic "Verification Steps" checklist plus one master "Pre-Deployment Security Checklist" that aggregates them | 495 lines of checklists with zero routing — a security specialist skill this size needs the topics split into `references/*.md` with SKILL.md as an index |
| security-scan | `.claude\skills\ecc\security-scan\SKILL.md` | Wraps a real external tool (AgentShield) instead of reimplementing scanning logic in prose; documents a graded output (A–F, 90–100 etc.) so downstream automation can gate on a number, not free text | Tight coupling to one named npm package and GitHub Action — an example of a skill that is really a tool wrapper, not portable knowledge |
| safety-guard | `.claude\skills\ecc\safety-guard\SKILL.md` | Three named modes (Careful / Freeze / Guard) with an explicit implementation mechanism (PreToolUse hooks) and a stated log path — turns a policy into an auditable mechanism | Short on the "why" — assumes the hook infrastructure exists; not self-contained for an agent without hook support |
| security-bounty-hunter | `.claude\skills\ecc\security-bounty-hunter\SKILL.md` | Explicit **in-scope vs skip** tables by CWE — this is the sharpest example studied of a skill defining what NOT to chase, preventing noisy false-positive triage; a "Quality Gate" checklist gates the deliverable (report), not just the process | Assumes a bounty-program context; would need reframing for an internal security specialist that also has to flag non-bounty-worthy but still real bugs |

### Local — testing / QA

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| tdd (mattpocock) | `plugins\cache\mattpocock\...\skills\engineering\tdd\SKILL.md` | Introduces **seam** as shared vocabulary and forces "confirm seams with the user before writing any test" — a concrete anti-scope-creep gate; names three anti-patterns with a diagnostic "tell" for each (e.g., tautological tests: "passes by construction") | Very short (only ~35 lines) — relies on companion files (`tests.md`, `mocking.md`) not fetched here; on its own it under-specifies |
| test-driven-development (superpowers) | `plugins\cache\...\superpowers\6.4.1\skills\test-driven-development\SKILL.md` | The strongest **evidence-forcing** design studied: "NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST" as an iron law, a Good/Bad code pair per phase, a **Common Rationalizations table** (excuse → reality) and a matching **Red Flags — STOP and Start Over** list; ends in a literal verification checklist | 331 lines, all prose/checklist, no `references/` split — acceptable at this length but pushing the ceiling |
| qa (mattpocock, deprecated) | `plugins\cache\...\skills\deprecated\qa\SKILL.md` | Separates "durable" issue content (no file paths/line numbers, user-facing language) from ephemeral implementation detail — directly reusable for a **test board** specialist that files findings for humans; explicit breakdown-vs-single-issue decision rule | Filed under `deprecated/` in its own plugin — a reminder to check a skill's lifecdecycle status before copying it wholesale |
| webapp-testing | `C:\Users\gaura\.claude\skills\webapp-testing\SKILL.md` | Decision-tree flowchart (ASCII) for choosing an approach before acting; explicit rule to treat bundled scripts as **black boxes** — run `--help`, don't read the source, to protect context budget | Assumes Playwright + Python; not model/agent-agnostic without adaptation |
| e2e-testing | `.claude\skills\ecc\e2e-testing\SKILL.md` | Full worked examples (POM class, config, CI YAML, flaky-test quarantine) rather than abstract advice; a **Test Report Template** with fixed fields the agent fills in, giving deterministic output shape | Framework-specific (Playwright/TS) throughout — needs a "swap examples per stack" note to be portable |
| verification-loop | `.claude\skills\ecc\verification-loop\SKILL.md` | Phase-numbered pipeline (build → types → lint → tests → security grep → diff) each with a copy-pasteable command and a fixed report template ending in `READY/NOT READY` | Generic bash greps for secrets (`grep -rn "sk-"`) are weak/brittle compared to a real secret scanner — cosmetic security, not real coverage |
| browser-qa | `.claude\skills\ecc\browser-qa\SKILL.md` | Explicit **blast-radius / safety-first** section before the QA phases — read-only by default, staging-only mutation, redact credentials before saving screenshots; a `verdict ∈ {SHIP, SHIP WITH FIXES, DO NOT SHIP, INCONCLUSIVE}` enum so downstream tooling can branch on it | None of the phases specify what "good" looks like numerically beyond Core Web Vitals — subjective visual-regression judgment calls remain unverifiable by a smaller model |

### Local — coding efficiency

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| token-budget-advisor | `.claude\skills\ecc\token-budget-advisor\SKILL.md` | Extremely precise TRIGGER/DO-NOT-TRIGGER phrase lists directly in the description field — the best worked example of description-engineering for reliable activation found anywhere in this study; explicit "shortcuts — skip the question" table so a returning user doesn't get re-prompted | Depends on the model mentally estimating tokens (`words × 1.3`) with a stated ±15% error bar — a heuristic dressed as precision |
| context-budget | `.claude\skills\ecc\context-budget\SKILL.md` | Four-phase pipeline (Inventory → Classify → Detect Issues → Report) with a fixed ASCII report template; a three-bucket classification (Always/Sometimes/Rarely needed) that is directly reusable for judging which specialist skills to keep loaded | Numeric estimates (500 tokens/MCP tool, words×1.3) are rules of thumb presented without a citation or calibration method |
| strategic-compact | `C:\Users\gaura\.claude\skills\strategic-compact\SKILL.md` | A **Compaction Decision Guide** table (phase transition → compact? → why) and a **What Survives Compaction** table (persists vs lost) — both are compact, scannable decision aids, the shape every specialist checklist should aim for | Ships an actual hook script referenced by absolute path (`~/.claude/skills/strategic-compact/suggest-compact.js`) — portable only to harnesses with the same hook system |
| caveman | `plugins\cache\caveman\...\skills\caveman\SKILL.md` | Best "mode" skill studied: persistent-until-toggled-off behavior explicitly stated, per-intensity-level before/after example pairs, and an explicit **Auto-Clarity** escape hatch (drop the mode for security warnings/destructive-action confirmations) so compression never hides risk | Multilingual classical-Chinese register examples bloat the file for teams that will never use them — a case for pushing locale variants to `references/` |

### Local — architecture / planning

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| writing-plans (superpowers) | `plugins\cache\...\superpowers\6.4.1\skills\writing-plans\SKILL.md` | "No Placeholders" section listing banned phrases verbatim (TBD, "add appropriate error handling", "similar to Task N") — a mechanical, grep-able red-flag list; mandatory plan header with a **Global Constraints** and **Review Focus** section that travels with every task | Assumes a specific harness feature (checkbox task tracking, a companion `subagent-driven-development` skill) — the plan format is excellent, the execution-handoff prose is harness-specific |
| blueprint | `.claude\skills\ecc\blueprint\SKILL.md` | Explicit **do-not-trigger** condition in the front-matter description ("DO NOT TRIGGER when task is completable in a single PR... or user says 'just do it'") — directly reusable phrasing pattern; "Zero runtime risk" claim backed by a literal fact ("repository contains only `.md` files") | 5-phase pipeline description is aspirational prose; the actual adversarial-review step depends on having a second, stronger model available |
| architecture-decision-records | `.claude\skills\ecc\architecture-decision-records\SKILL.md` | Explicit consent gate before any file write ("ask the user for confirmation before creating the directory... Do not create files without explicit consent") — a directly reusable pattern for any skill that writes to a repo; Do/Don't list for ADR quality | Decision-detection "signals" list is soft heuristic prose, not something a small model can apply consistently |
| codebase-design (mattpocock) | `plugins\cache\mattpocock\...\skills\engineering\codebase-design\SKILL.md` | Rigorous glossary discipline: "use these terms exactly — don't substitute X" plus an explicit **Rejected framings** section explaining why tempting alternative vocab (Ousterhout's depth ratio, DDD "boundary") was rejected — this is the strongest shared-vocabulary skill found and a template for the **architect** specialist | Entirely conceptual/prose; zero checklists or scripts — good for reasoning, weak for verification |

### Local — orchestration

| Name | Path | What to borrow | What to avoid |
|---|---|---|---|
| dispatching-parallel-agents (superpowers) | `plugins\cache\...\superpowers\6.4.1\skills\dispatching-parallel-agents\SKILL.md` | A `dot`-notation decision-flowchart embedded directly as text (renders as a graph in tooling, degrades to readable text otherwise); ❌/✅ paired "Common Mistakes" examples — directly the model for a **delegator** specialist's core logic | Graphviz `dot` syntax as inline pseudocode assumes the reading agent can parse it; a plain-prompt model will just read it as text, which still mostly works but is a design bet |
| subagent-driven-development (superpowers) | `plugins\cache\...\superpowers\6.4.1\skills\subagent-driven-development\SKILL.md` | By far the most sophisticated skill studied: a persistent ledger file surviving context compaction, a bounded 5-round fix loop with escalating model tiers, a **Rulings, not stalls** doctrine naming exactly four things that are allowed to stop autonomous execution, and a closing Common-Rationalizations table mapping excuses to why they're wrong | 568 lines — deliberately long because it is a full methodology, not a single-purpose skill; not something to imitate at the length level, only at the rigor level |
| team-agent-orchestration | `.claude\skills\ecc\team-agent-orchestration\SKILL.md` | Named Kanban states with explicit exit criteria per state; a JSON "card" schema — this is the cleanest machine-readable state-object pattern found, directly portable to a **delegator** specialist that must hand off work items across harnesses | "Failure Modes To Watch" section is good but not tied to a detection mechanism — descriptive, not diagnostic |

### Public

| Name | URL | What to borrow | What to avoid |
|---|---|---|---|
| Agent Skills — overview | https://agentskills.io | Canonical progressive-disclosure framing in three stages (Discovery → Activation → Execution) with token-cost intuition ("~100 tokens" at discovery); the client showcase proves the spec already has real adoption across ~45 agent products, including two directly relevant to "plain-prompt models": Hermes Agent and Deep Code (DeepSeek CLI) | It's a marketing/index page, not itself a source of authoring craft — pair with the specification page |
| Agent Skills — specification | https://agentskills.io/specification | The normative source of truth: `name` (≤64 chars, lowercase/hyphen, must match folder name, no leading/trailing/double hyphen), `description` (≤1024 chars, "should describe both what the skill does and when to use it"), optional `license`, `compatibility` (≤500 chars, "most skills do not need" it), `metadata` (string→string map), experimental `allowed-tools`; hard rule "keep your main SKILL.md under 500 lines"; "keep file references one level deep"; ships a validator (`skills-ref validate`) | The spec is intentionally minimal — it does not standardize `context: fork`, `disable-model-invocation`, `arguments`, or model/effort overrides, all of which are Claude-Code-only extensions layered on top |
| Claude Code — Skills docs | https://code.claude.com/docs/en/skills | Claude-Code-specific superset fields (`disable-model-invocation`, `user-invocable`, `context: fork`, `paths`, `arguments`, `shell`, `model`, `effort`) each with a stated purpose; the sharpest anti-pattern warnings found anywhere: "the forked context ... doesn't run in a fork of the current conversation" (common misconception named and corrected), and the standing-instructions-vs-one-time-task-context split for multi-turn skill content | These extension fields are explicitly non-portable — a skill authored against them will silently degrade (fields ignored) on any other agent, which is exactly the risk this research file exists to flag |
| anthropics/skills — repo | https://github.com/anthropics/skills | Canonical repo layout: `skills/` (by category, including `docx`/`pdf`/`pptx`/`xlsx`), `spec/`, `template/`, `.claude-plugin/`; confirms only `name`+`description` are required, everything else is optional | Top-level fetch didn't surface bundling/versioning conventions in prose — those live inside individual skill folders (see skill-creator below) and weren't exhaustively re-crawled |
| anthropics/skills — skill-creator SKILL.md | https://raw.githubusercontent.com/anthropics/skills/main/skills/skill-creator/SKILL.md | The description-writing rule stated most sharply of any source: make it **"pushy" rather than understated** — "Build dashboards" is weak, "Build dashboards. Use this whenever users mention data visualization, metrics, or displaying company information" is right; explicit guidance to explain the *why* behind a rule rather than a bare MUST, "leverage the model's reasoning ability"; recommends a table of contents once a reference file exceeds 300 lines; explicit non-negotiable: skills "must not contain malware or misleading content" | Being the meta-skill for skill authoring, it necessarily talks about itself in the abstract — concrete numeric thresholds (300-line TOC trigger) are Anthropic's own heuristic, not spec-mandated |
| obra/superpowers — repo | https://github.com/obra/superpowers | States its own design philosophy explicitly: "Evidence over claims — verify before declaring success," "mandatory workflows, not suggestions"; organizes 19+ skills into Testing/Debugging, Collaboration, Meta buckets, with a `diagnosing-superpowers` skill specifically for post-hoc analysis when an agent skipped the prescribed workflow | A complete methodology bound tightly to Claude Code's Task/subagent tooling — porting it to a plain-prompt model means keeping the *checklists and rationalization tables*, not the subagent-dispatch machinery |
| OpenAI Codex — repo (root) | https://github.com/openai/codex | Confirms an `AGENTS.md` file exists at repo root and that Codex documents an MCP registry for external tool integration; did not itself surface discovery-path details (see the dedicated skills doc below) | The repo README/nav is not the place to learn the skill-loading algorithm — go straight to the docs site |
| OpenAI Codex/ChatGPT — Skills docs | https://learn.chatgpt.com/docs/build-skills (redirected from developers.openai.com/codex/skills/) | Explicitly states "Skills build on the [open agent skills standard](https://agentskills.io)"; documents Codex-specific discovery order — repo `.agents/skills` (cwd, parent dirs, repo root) → user `$HOME/.agents/skills` → admin `/etc/codex/skills` → built-in; optional `agents/openai.yaml` sidecar for UI/invocation-policy config (`allow_implicit_invocation`) layered next to the spec-standard `SKILL.md` | The `.agents/skills` path is the interoperability seam — but Codex's own extension (`agents/openai.yaml`) is exactly the kind of per-agent sidecar that must never be assumed present by other tools |
| Gemini CLI — Skills docs | https://geminicli.com/docs/cli/skills/ | Four-tier precedence (built-in → extension → user `~/.gemini/skills/` → workspace `.gemini/skills/`), each also reachable via an explicit interoperability alias `.agents/skills/` documented as "compatible across different AI tools"; clean one-line distinction from `GEMINI.md`: persistent background vs. on-demand expertise | Precedence order between tiers matters for override behavior and isn't identical to Codex's or Claude Code's — a shared skill dropped into the wrong tier can be silently shadowed by a built-in of the same name |
| Google Antigravity — Skills docs | https://antigravity.google/docs/skills/ | Confirms adoption of the same open standard; states the most actionable authoring advice found for the description field: **"Use narrow descriptions (e.g., 'Use when you need to ...') and include 'Do not use' to reduce over-activation"** and **"Add a Safety section for skills that propose terminal or infrastructure changes"** — both directly applicable to the security and delegator specialists; documents both IDE and CLI path variants (`~/.gemini/config/skills/` vs `~/.gemini/antigravity-cli/skills/`) | Antigravity's paths live under a `.gemini/` namespace despite being a distinct product from Gemini CLI — naming alone does not tell you which tool actually reads a given directory; must verify per install |
| VoltAgent/awesome-agent-skills | https://github.com/VoltAgent/awesome-agent-skills | Organizes 1000+ skills **by originating vendor/team** rather than by function, and claims compatibility across "Claude Code, Codex, Antigravity, Gemini CLI, Cursor, GitHub Copilot, OpenCode, Windsurf, and more" purely by virtue of the shared `SKILL.md` format — evidence that the open spec's minimalism is what makes 1000+ skills usable with zero per-agent modification | States broad compatibility but gives **no technical guidance** on achieving it — confirms that "just follow the spec, skip the vendor extension fields" is read as sufficient by the community, but nobody has written down the adapter pattern this research file proposes below |
| karanb192/awesome-claude-skills | https://github.com/karanb192/awesome-claude-skills | Concrete curation bar worth copying for any internal registry: a skill needs a working `SKILL.md`, clear docs, activity within 6 months, and "no security vulnerabilities or malicious code" before it earns a ✅ Verified badge, vs. ⏳ pending | Curation criteria are procedural (badge process) rather than content criteria — doesn't itself define what makes a *description* or *body* good, unlike skill-creator |

---

## Patterns

**Front-matter: two required fields, everything else is a dialect.** Every source agrees `name` and `description` are the only universal requirements. `name` constraints are mechanical and validated (`skills-ref validate`): lowercase, hyphens, ≤64 chars, must equal the folder name. Every other field — `license`, `compatibility`, `metadata`, `allowed-tools` in the open spec; `disable-model-invocation`, `user-invocable`, `context`, `paths`, `arguments`, `shell`, `model`, `effort` in Claude Code; `agents/openai.yaml` in Codex — is a vendor extension that degrades gracefully (ignored) elsewhere but never upgrades gracefully (a Claude-only skill does not become forkable on Gemini CLI just because the field is present). The practical rule: **write to the open-spec fields as the contract; put vendor extensions in a clearly separated adapter file, never inline in the shared `SKILL.md` body.**

**Description-writing is the highest-leverage craft skill.** Three independent sources converge on the same advice with different vocabulary: agentskills.io says "should include specific keywords that help agents identify relevant tasks"; skill-creator says be "pushy" and give both capability and *context* ("Use this whenever users mention..."); Google Antigravity says use "narrow descriptions ('Use when you need to...')" plus an explicit **"Do not use"** clause to prevent over-activation. The single strongest concrete example in this study is `token-budget-advisor`'s description field, which enumerates literal trigger phrases *and* literal non-trigger phrases in the same field. For the six specialists, every description should have three parts: (1) what it does, (2) a positive trigger list ("Use when..."), (3) a negative trigger list ("Do not use when...") — Antigravity is the only source that names part 3 explicitly, but it is visibly missing from most of the local skills studied (only `token-budget-advisor` and `blueprint` do it well).

**Progressive disclosure is a hard budget, not a suggestion, and most local skills violate it.** The spec's numbers are explicit: ~100 tokens for name+description at discovery, <5000 tokens (≈500 lines) for the activated SKILL.md body, unlimited for on-demand `references/`/`scripts/`/`assets/`. Of the 30 local skills read, at least six exceed 500 lines in the main file with no `references/` split (`taste-skill` at 1207 lines is the extreme case; `ui-ux-pro-max` at 686; `security-review` at 495 sitting right at the edge; `subagent-driven-development` at 568 lines, though that one is explicitly a full methodology). The pattern that gets this right is `impeccable`: SKILL.md is a router table, one row per sub-command, each pointing to a `reference/*.md` file loaded only when that sub-command fires — this is the template to copy for any specialist whose knowledge spans multiple sub-topics (e.g., web-designer covering typography, color, motion, and layout as separate reference files).

**Checklists and paired examples beat prose for verification; prose beats checklists for judgment.** The skills that most reliably produce checkable output pair a bad/good code block with a checklist item (`security-review`'s FAIL/PASS blocks, `test-driven-development`'s `<Good>`/`<Bad>` pairs, `make-interfaces-feel-better`'s before/after table). The skills that most reliably produce good open-ended reasoning are pure prose with a shared vocabulary (`codebase-design`'s glossary, `frontend-design`'s process narrative). A specialist skill needs both: prose to calibrate judgment on ambiguous cases, checklists to make the final output auditable by a *different, possibly weaker* model (e.g., a code-reviewer checking a coder's work).

**Evidence is forced with four concrete devices, and the strongest skills use two or more together:**
1. *Rationalization tables* (excuse → reality) — `test-driven-development`, `subagent-driven-development`. Directly names the exact self-talk a model uses to skip a step, which is far more effective than a bare rule because it pre-empts the specific failure mode.
2. *Red-flags / STOP lists* — `test-driven-development`'s "Red Flags - STOP and Start Over," `writing-plans`'s "No Placeholders" list of banned literal phrases. These are mechanically greppable, which matters for a hook or a cheap-model auditor to check compliance without re-reasoning about the task.
3. *Verification checklists gating completion* — nearly universal (`security-review`'s Pre-Deployment checklist, `verification-loop`'s phased report, `test-driven-development`'s Verification Checklist). The strongest versions end in a binary or enum verdict (`READY/NOT READY`, `SHIP/SHIP WITH FIXES/DO NOT SHIP/INCONCLUSIVE`) rather than free text, so a delegator or CI gate can branch on it programmatically.
4. *Named escalation/adjudication protocols* — `subagent-driven-development`'s bounded 5-round fix loop with model-tier escalation and a "Rulings, not stalls" doctrine naming exactly four conditions allowed to halt autonomous work. This is the most sophisticated pattern found and is the right model for a **delegator** specialist that must decide when to escalate vs. proceed alone.

**Model-agnosticism is achieved by omission, not by conditional logic.** No skill studied contains `if (agent == "Claude Code") ... else ...` branching in its body. The open-spec skills (`liquid-glass-design`, `make-interfaces-feel-better`, and everything under `anthropics/skills`) simply never reference a proprietary mechanism (subagents, hooks, forked contexts) in the shared body — when a mechanism is genuinely needed, it goes in a note the skill treats as optional ("if your harness supports X, do Y; otherwise Z"). `webapp-testing`'s bundled Python/Playwright scripts are agent-agnostic because they are plain executables invoked via `--help`, not something requiring a specific harness's tool-calling convention. The clearest failure mode is Claude Code's own `context: fork` — the docs themselves call out that agents misunderstand what it does, which is a strong signal that harness-specific mechanisms should be isolated in adapter files, never load-bearing in the portable core.

**Scripts are bundled as black boxes with a `--help` contract, never inlined.** `webapp-testing` and `ui-ux-pro-max` both explicitly instruct the agent to run `--help` before reading source, explicitly to protect context budget ("DO NOT read the source until you try running the script first"). `ui-ux-pro-max` goes further and ships an actual queryable database (CSV files + a Python CLI) rather than putting the knowledge in Markdown at all — this is the right model for the **web-designer** specialist's palette/typography/style data, and for a **security** specialist's CWE/checklist data, both of which are large, structured, and better served by a script than by prose.

**Versioning and install instructions are inconsistent across sources — nobody has a strong answer.** `blueprint` documents both a "full ECC install" path (pinned to a reviewed commit SHA, explicit warning against blind `git pull`) and a "vendored standalone" path (re-copy the file; no `git pull` semantics apply to a vendored copy) — the most careful treatment of update safety found. `ui-ux-pro-max` and `design-system` use a semver-ish `metadata.version` string but nothing enforces or reads it. The spec itself defines `metadata` as an open string map specifically so vendors *can* add versioning without a shared convention — meaning a specialist-skills repo needs to invent its own version discipline (see Recommendations) rather than relying on any studied precedent.

**What makes a skill weak, distilled from the worst examples above:**
- *Too long with no split* — `taste-skill` (1207 lines, single file, no `references/`).
- *Vague, unfalsifiable rules* — anything relying on "use good judgment" without a paired example or checklist (parts of `browser-qa`'s visual-regression phase, `architecture-decision-records`' decision-detection "signals").
- *Duplicated knowledge across skills* — `apple-design` and `ui-ux-pro-max` both encode motion/spring-physics guidance independently, with different numeric defaults, and neither references the other.
- *Silent vendor lock-in* — fields or mechanisms (`context: fork`, hook scripts referenced by absolute path) presented as if universal, with no compatibility note.
- *Missing negative-trigger guidance* — most local skills state only when to use, never when *not* to, inviting over-activation exactly as Antigravity's docs warn against.

---

## Cross-agent compatibility

| Agent | Skill file it reads | Discovery paths (precedence, lowest→highest where documented) | Vendor-only extensions beyond `name`/`description` | Notes for portability |
|---|---|---|---|---|
| **Claude Code** | `SKILL.md` (YAML front-matter + Markdown body) | Personal `~/.claude/skills/<name>/`; project `.claude/skills/<name>/`; plugin-provided `plugins/cache/<plugin>/.../skills/<name>/` (confirmed by this machine's own inventory) | `disable-model-invocation`, `user-invocable`, `allowed-tools` (turn-scoped pre-approval, does not restrict the tool pool), `disallowed-tools`, `context: fork` (isolated subagent — commonly misunderstood per the docs' own callout), `paths` (glob-gated activation), `arguments` (`$name`/`$0`/`$1` substitution), `shell`, `model`, `effort` | Richest extension surface studied. A portable skill's shared body must never assume `context: fork`, `arguments`, or hook-based side effects exist; a Claude-Code-only adapter file carries these. |
| **Codex (OpenAI/ChatGPT)** | `SKILL.md`, following the same open-spec front-matter | Repo `.agents/skills` (cwd → parent dirs → repo root) → user `$HOME/.agents/skills` → admin `/etc/codex/skills` → built-in | Optional sidecar `agents/openai.yaml` for UI display + `allow_implicit_invocation` policy + declared tool dependencies, kept *outside* `SKILL.md` | `.agents/skills` is the interoperable path shared with Gemini CLI's alias — put the canonical portable copy here and symlink/copy into agent-specific directories rather than duplicating content. |
| **Gemini CLI** | `SKILL.md`, open-spec front-matter | Built-in → extension-provided → user `~/.gemini/skills/` (or interoperable alias `~/.agents/skills/`) → workspace `.gemini/skills/` (or `.agents/skills/`) | None documented beyond the base spec; `GEMINI.md` is a separate, always-loaded background-context file, not a skill | Highest-fidelity open-spec implementation studied — no vendor extension fields found, making it the safest reference implementation to validate a portable skill against. |
| **Google Antigravity** | `SKILL.md`, open-spec front-matter | IDE/Antigravity 2.0: workspace `.agents/skills/<name>/` → global `~/.gemini/config/skills/<name>/`; CLI: workspace `.agents/skills/<name>/` → global `~/.gemini/antigravity-cli/skills/<name>/` → plugin-provided `~/.gemini/antigravity-cli/plugins/<name>/skills/` | None documented beyond the base spec; strong *authoring convention* (not a schema field) around narrow descriptions, explicit "Do not use" clauses, and a "Safety" section for destructive/infra-changing skills | Shares the `.agents/skills` workspace path with Codex and Gemini CLI's alias — a single workspace-level `.agents/skills/<specialist>/SKILL.md` is picked up by all three without duplication. Global paths differ per product and must be handled by an install script, not assumed. |
| **Plain-prompt models** (Ollama-served models, DeepSeek API, Hermes/Nous checkpoints without an agent harness) | No filesystem discovery exists — there is no runtime performing Discovery/Activation/Execution. `agentskills.io`'s own client list shows Hermes Agent and Deep Code (a DeepSeek-model CLI) support the spec, but only because they ship a *harness* around the base model; the base model itself (raw completion/chat API) has no skill loader. | N/A — no paths. The only "loading" mechanism is whatever is concatenated into the system/first-user message before inference. | N/A | Portability here means the *SKILL.md body* (not the front-matter mechanism) must be directly usable as inlined system-prompt text: no reliance on `${CLAUDE_SKILL_DIR}`-style variable substitution, no assumption that `references/*.md` will be fetched on demand (either inline the whole reference or omit it), no assumption of tool-calling for bundled scripts (the model must be told the *exact* shell command as literal text it can ask the human/wrapper to run). Treat the "plain-prompt" case as **progressive disclosure collapsing to a single disclosure**: ship one flattened prompt file per specialist, generated from the same source SKILL.md + references, rather than authoring a separate skill. |

---

## Template

One shared skeleton, instantiated per specialist. Fields above the line are open-spec (portable everywhere); the block below the line is the Claude-Code-only adapter layer, kept in a separate file (see Repo layout) rather than inline.

```markdown
---
name: <specialist>-adviser
description: >-
  <One sentence: what this specialist does.>
  Use when <positive trigger 1>, <positive trigger 2>, or the user mentions
  <keyword list>. Do not use when <negative trigger 1> or <negative trigger 2>
  — <what to use instead>.
license: <SPDX id or "See LICENSE.txt">
compatibility: Requires <nothing | named tools/network — omit field entirely if none>
metadata:
  specialist-skills-version: "1.0"
  origin: specialist-skills
  last-reviewed: 2026-09-23
---

# <Specialist Name> Adviser

<One paragraph: the specialist's job, its authority boundary (advisory vs.
blocking), and what "done" looks like when this skill is used.>

## When to activate
- <situation 1>
- <situation 2>
Do not activate for: <explicit negative case>.

## Decision flow
<ASCII or dot-notation flowchart if the specialist's first move depends on a
branch — e.g. "is this a redesign or greenfield?" for web-designer, "is this
remotely exploitable?" for security.>

## Core checklist
| # | Check | Pass example | Fail example |
|---|---|---|---|
| 1 | ... | ... | ... |

(Keep this table short — 5-10 rows. Anything longer moves to references/.)

## Verdict format
State the exact enum or structured output this specialist must end with, e.g.:
`SHIP / SHIP WITH FIXES / DO NOT SHIP` or `APPROVE / BLOCK (CRITICAL) / WARN (HIGH)`.

## Common rationalizations
| Excuse | Reality |
|---|---|
| "..." | "..." |

## Further reading
- Full checklist and worked examples: [references/checklist.md](references/checklist.md)
- Domain data (only if applicable — palettes, CWE list, etc.): scripts/query.py --help

<!-- --- Claude-Code-only adapter fields; strip this whole block for the
     open-spec / portable copy. Keep it in claude-code/<specialist>.frontmatter.yaml
     instead, merged at publish time. ---
allowed-tools: Read Grep Glob
disallowed-tools:
context: fork        # only if the specialist's job is genuinely self-contained
-->
```

Notes on filling this in per specialist:

- **web-designer** — decision flow branches on redesign-vs-greenfield (borrowed from `impeccable`'s Modes) and on aesthetic-vs-official-design-system (borrowed from `taste-skill` Section 2.A/2.B); core checklist borrows the FAIL/PASS pairing from `security-review`; domain data (palettes, type pairings) belongs in `scripts/` per `ui-ux-pro-max`, not inlined.
- **test-board** — decision flow borrows the QA skill's single-issue-vs-breakdown rule; verdict format borrows `browser-qa`'s four-state enum; rationalization table borrows directly from `test-driven-development`'s table, filtered to test-board-relevant excuses ("it passed manually," "coverage is close enough").
- **architect** — leans almost entirely on `codebase-design`'s glossary discipline (Module/Interface/Depth/Seam/Adapter) plus `architecture-decision-records`' consent-gated-write pattern for any ADR it proposes; verdict format is closer to a recommendation memo than a pass/fail enum.
- **coder** — borrows `writing-plans`' "No Placeholders" banned-phrase list as its own self-check before returning code, and `subagent-driven-development`'s DONE / DONE_WITH_CONCERNS / NEEDS_CONTEXT / BLOCKED status vocabulary as its verdict format.
- **security** — merges `security-review`'s FAIL/PASS pairs (breadth) with `security-bounty-hunter`'s in-scope/skip table (precision, avoids false-positive noise) and `safety-guard`'s three-mode mechanism for anything that proposes a destructive action; per Antigravity's guidance, this specialist's description most needs the explicit "Do not use for informational-only findings without exploit impact" negative trigger, and its body most needs the Safety section Antigravity calls out by name.
- **delegator** — the decision-flow section is the whole skill: borrow `dispatching-parallel-agents`' independence test (shared state? sequential dependency?) directly, `team-agent-orchestration`'s JSON card schema as the structured handoff object, and `subagent-driven-development`'s "four things that stop you" doctrine as the delegator's own escalation gate.

---

## Repo layout

```
specialist-skills/
├── research/
│   ├── skill-design.md              # this file
│   ├── web-designer.md              # existing
│   ├── test-board.md                # existing
│   ├── architect.md                 # existing
│   ├── coder.md                     # existing
│   ├── delegator.md                 # existing
│   └── security.md                  # not yet written (gap noted below)
│
├── skills/                          # ONE SOURCE OF TRUTH — open-spec bodies only
│   ├── web-designer-adviser/
│   │   ├── SKILL.md                 # open-spec front-matter + body (per Template)
│   │   ├── references/
│   │   │   ├── typography.md
│   │   │   ├── color.md
│   │   │   └── motion.md
│   │   └── scripts/
│   │       └── query.py             # palette/type-pairing lookup, --help contract
│   ├── test-board-adviser/
│   │   ├── SKILL.md
│   │   └── references/checklist.md
│   ├── architect-adviser/
│   │   ├── SKILL.md
│   │   └── references/glossary.md
│   ├── coder-adviser/
│   │   ├── SKILL.md
│   │   └── references/anti-placeholder-list.md
│   ├── security-adviser/
│   │   ├── SKILL.md
│   │   ├── references/
│   │   │   ├── owasp-checklist.md
│   │   │   └── in-scope-vs-skip.md
│   │   └── scripts/cwe-lookup.py
│   └── delegator-adviser/
│       ├── SKILL.md
│       └── references/handoff-schema.json
│
├── adapters/                        # per-agent extension layers, never load-bearing
│   ├── claude-code/
│   │   └── <specialist>.frontmatter.yaml   # merged over skills/<specialist>/SKILL.md
│   ├── codex/
│   │   └── <specialist>/agents/openai.yaml
│   ├── gemini-cli/                  # usually empty — reference implementation of the open spec
│   └── antigravity/                 # usually empty — same reason
│
├── flatten/                         # build output for plain-prompt models
│   ├── build.py                     # concatenates SKILL.md + all references/*.md
│   │                                 # into one prompt file per specialist; no
│   │                                 # ${VAR} substitution, no on-demand fetch
│   └── out/
│       ├── web-designer-adviser.prompt.md
│       ├── security-adviser.prompt.md
│       └── ...
│
├── install/
│   ├── install-claude-code.sh       # copies skills/ + merges adapters/claude-code/*
│   │                                 # into ~/.claude/skills/ or .claude/skills/
│   ├── install-codex.sh             # copies into .agents/skills/ (workspace) or
│   │                                 # $HOME/.agents/skills (user)
│   ├── install-gemini-cli.sh        # copies into .gemini/skills/ or .agents/skills/
│   ├── install-antigravity.sh       # copies into .agents/skills/ (workspace-level
│   │                                 # install covers Codex + Gemini CLI + Antigravity
│   │                                 # simultaneously — see Recommendations)
│   └── VERSION                      # single semver string for the whole pack
│
└── README.md                        # what this repo is, one line per specialist,
                                      # pointer to skill-design.md for the design rationale
```

Design rationale for this shape:

- `skills/` holds only what the open spec defines. This is what gets validated with `skills-ref validate` and what every agent — including future ones not yet studied — can read without modification.
- `adapters/` isolates every vendor extension field found in the research above (Claude Code's `context`/`arguments`/`allowed-tools`, Codex's `agents/openai.yaml`). Nothing in `skills/*/SKILL.md` may reference a mechanism that only exists in one adapter.
- `flatten/` exists because plain-prompt models have no discovery mechanism at all (per the Cross-agent compatibility table) — progressive disclosure is meaningless to them, so the build step does the disclosure once, at build time, producing a single self-contained prompt file per specialist.
- `install/` scripts encode the actual discovery paths from the Cross-agent compatibility table so installing correctly doesn't depend on remembering four different directory conventions.

---

## Recommendations

1. **Adopt the open-spec fields as the only contract inside `skills/*/SKILL.md`.** Concretely: `name`, `description`, optional `license`, optional `compatibility`, optional `metadata` (string map). Never put `context: fork`, `arguments`, `allowed-tools`, or any Claude-Code-specific field in this file — those live in `adapters/claude-code/<specialist>.frontmatter.yaml` and get merged at install/publish time. This directly follows from the Cross-agent compatibility table: Gemini CLI and Antigravity implement the base spec with no extensions, so anything written only against the base spec runs unmodified on both, and Codex additionally reads the exact same file with its own sidecar bolted on separately.

2. **Write every description with the three-part shape found only in the strongest examples (`token-budget-advisor`, `blueprint`, and Antigravity's own authoring guidance): what it does, positive triggers, negative triggers.** Most of the 30 local skills studied skip part three, and Antigravity's docs name over-activation as the specific failure this prevents. For the security and delegator specialists in particular — the two most likely to be invoked wrongly with expensive consequences — the negative-trigger clause is not optional.

3. **Enforce the 500-line ceiling on every specialist's `SKILL.md` mechanically, not by discipline.** Six of the thirty local skills studied blow past it, `taste-skill` by more than double. Add a pre-commit or CI check (`wc -l skills/*/SKILL.md`) that fails above 500 lines and points the author at `references/`, mirroring `impeccable`'s router pattern: SKILL.md becomes a table of sub-topics pointing at `references/*.md`, loaded only when that sub-topic is actually relevant.

4. **Give each specialist a verdict enum, not a prose conclusion.** `browser-qa`'s `SHIP/SHIP WITH FIXES/DO NOT SHIP/INCONCLUSIVE` and `verification-loop`'s `READY/NOT READY` are the pattern: a fixed small vocabulary that a delegator or CI gate can branch on without re-parsing natural language. Every specialist template above specifies this field for exactly this reason — it's what makes the six specialists composable into a pipeline instead of six independent free-text essays.

5. **Bundle domain data as a queried script, not as inlined prose, whenever the data is large and structured.** `ui-ux-pro-max`'s CSV+CLI approach is the strongest example found; apply the same shape to the web-designer's palette/typography data and the security specialist's CWE/OWASP checklist data. This keeps the activated SKILL.md small (satisfying recommendation 3) while keeping the knowledge base arbitrarily large.

6. **For plain-prompt models, build — don't author — a second artifact.** Since Ollama-served models, raw DeepSeek API calls, and bare Hermes checkpoints have no Discovery/Activation runtime (confirmed by the absence of any filesystem-scanning mechanism for them in the research above), do not try to make `SKILL.md` itself "work" there by convention. Instead, the `flatten/build.py` step concatenates each specialist's `SKILL.md` body with all of its `references/*.md` into one flat file with no `${VAR}` substitution and no deferred-loading assumptions, and that flat file is what gets pasted into the system prompt or first message. This is the direct consequence of the Cross-agent compatibility table's finding that "portability" for these targets means collapsing progressive disclosure to a single disclosure, not replicating it.

7. **Version the pack, not individual skills, using the discipline `blueprint` demonstrates and nothing else in this study attempts.** A single `install/VERSION` file plus a documented "pin to a reviewed commit SHA, never blind `git pull`" install instruction (copied nearly verbatim from `blueprint`'s Installation section) is more honest than scattering `metadata.version: "1.0"` strings that nothing reads or enforces, which is what most local skills studied actually do today.

8. **PManager's nightrunner should load from `skills/` directly, never from a per-agent copy.** Concretely: nightrunner's specialist-consult code path (`src/specialists/consult.ts`, `src/specialists/manifest.ts`, `src/specialists/knowledge.ts` per this repo's current tree) should read `specialist-skills/skills/<name>/SKILL.md` (plus its `references/`) as its single source of truth at runtime, the same file Claude Code, Codex, Gemini CLI, and Antigravity are each independently pointed at via `install/*.sh`. If nightrunner instead vendors a copy into `src/specialists/knowledge/*.md` (as the current repo's `web-designer-references.md`, `security-checklist.md`, and `performance-checklist.md` suggest it already does), the two copies will drift the first time either is edited — the exact "duplicated knowledge across skills" weakness identified above (`apple-design` vs. `ui-ux-pro-max` diverging on spring-physics defaults) but self-inflicted instead of inherited. The fix is either a build step that copies `specialist-skills/skills/*` into `src/specialists/knowledge/` on every change, or (better) nightrunner reads directly from a git submodule / published package pinned to `specialist-skills`' own `install/VERSION`.

---

## Open questions

- **No studied source defines a real cross-skill deduplication mechanism.** `apple-design` and `ui-ux-pro-max` silently disagree on motion-timing defaults; nothing in the open spec, Claude Code's docs, or any vendor doc addresses what happens when two active skills give conflicting numeric guidance. For six specialists that will sometimes overlap (coder and security both have opinions on input validation; web-designer and architect both have opinions on component boundaries), does PManager need an explicit precedence rule, or is "the more specific specialist wins" left to the orchestrating model's judgment?
- **The `compatibility` field is documented but nothing in this study shows an agent actually enforcing it.** If a specialist skill declares `compatibility: Requires network access` and is loaded into a plain-prompt model with no tool access, does anything warn the user, or does the skill just silently fail at the first step that needs network? Worth testing directly against Ollama/DeepSeek/Hermes before shipping the `flatten/` pipeline.
- **Versioning across the pack vs. per-skill remains unresolved by precedent.** `blueprint`'s SHA-pinning approach is the most careful found, but it assumes a git-based install; nightrunner's runtime-loading recommendation (8, above) needs its own answer for what happens when `specialist-skills` publishes a breaking change to, say, the security specialist's verdict enum, while three different agent adapters are mid-install with the old version.
- **How much of Antigravity's "Safety section" convention should become a required field, not a convention?** It's the single most directly applicable piece of guidance found for the security and delegator specialists, but it's stated as house style in one vendor's docs, not part of the open spec — should `specialist-skills` treat it as a required section (enforced by the same CI check as the 500-line ceiling) even though no other agent's tooling will read it as structured data?
- **The community collections (VoltAgent, karanb192) prove portability is achievable in practice but document zero methodology for it.** This research file is, as far as the sources fetched show, the first attempt to write down *why* spec-only skills port cleanly (vendor-extension isolation) rather than just asserting that they do — worth eventually contributing back upstream (e.g., to agentskills.io's docs or the anthropics/skills template) rather than keeping it PManager-internal only.
- **`security.md` does not yet exist in this repo's `research/` directory** (confirmed by listing before writing this file — only `web-designer.md`, `test-board.md`, `architect.md`, `coder.md`, and `delegator.md` are present). The security specialist template above is ready to be filled in against that gap, but this file does not do so, per the task's read-only scope.
