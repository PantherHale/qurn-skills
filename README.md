<div align="center">

# Qurn

**Eight specialist agents for Claude Code, Codex, Gemini CLI, Cursor, Windsurf, Copilot, Cline, Aider, and anything that speaks MCP.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/format-Agent%20Skills-6e40c9)](skills/)

</div>

---

Eight commands turn any coding agent into a small studio: a web designer, a test board, an architect, a coder, a
security reviewer, a delegator, a team lead that runs all of them, and a researcher that keeps the rest current.
Each one is built from cited sources — not improvised prompts — and ships as a portable `SKILL.md` plus reference
files, so it works the same way in Claude Code, Codex, or a plain system prompt to a local model.

## Commands

| Command | Specialist | What it does |
|---|---|---|
| `/web` | Web designer | Takes stock of a site or app's UI, picks a concrete visual direction (minimalism, brutalism, bento, glassmorphism, neumorphism, and more), and hands back numbered build orders instead of a vague opinion. |
| `/tester` | Test board | Builds the full test plan for a project — unit, integration, end-to-end, accessibility, performance, environment, error paths — convenes a board of tester personas, and blocks a "done" claim that has no evidence behind it. |
| `/architect` | Architect | Splits a goal into phases and tasks, sets module boundaries and structure, and catches drift from the plan midway through a build. |
| `/coder` | Coder | Advises on language, database, and project structure; reviews an implementation for performance and structure; tells a coding agent how to spend fewer tokens doing the same work. |
| `/security` | Security | Reviews auth, payments, uploads, secrets, dependencies, desktop IPC, and AI features before launch, plus the legal product checks (unsubscribe, consent, age gates, privacy rights) that get skipped under deadline pressure. |
| `/delegator` | Delegator | Breaks a goal too big for one agent into parallel and sequential work, deciding how many workers it needs and writing each one a self-contained prompt. |
| `/qurn` | Team lead | Reads a request, decides which of the above specialists actually apply, consults each one in turn, does the building or fixing their advice calls for, and reports one rolled-up verdict. Use this one when you're not sure which specialist fits, or the job spans more than one. |
| `/evolve` | Researcher | Spends a pass researching the last 7 days in security, design, architecture, coding, testing, and AI-agent tooling, and writes dated, sourced notes that every other specialist reads from afterward. |

Every specialist replies with a `VERDICT` (`pass`, `fix`, or `redo`), the evidence behind it — file, line, a
measurement, test output — and concrete next steps. `qurn` is the only one that writes code; the rest hand back a
verdict and advice for whatever agent or developer is driving.

## Install

Clone the repo, then run the installer for your agent. It copies the `skills/` (or equivalent) folder to wherever
that agent looks for skills — project-local or system-wide, your choice.

```sh
git clone https://github.com/PantherHale/qurn-skills.git
cd qurn-skills

# user-wide install (available in every project)
./install.sh claude            # Claude Code
./install.sh codex             # Codex
./install.sh gemini            # Gemini CLI

# project-only install
./install.sh claude --project
```

On Windows:

```powershell
git clone https://github.com/PantherHale/qurn-skills.git
cd qurn-skills
./install.ps1 -Agent claude
```

No installer for your tool? Grab what you need directly:

| Your setup | What to copy |
|---|---|
| Any Agent-Skills-compatible CLI | `skills/<name>/` into wherever it reads skills from |
| Cursor | `adapters/cursor/*.mdc` into `.cursor/rules/` |
| Windsurf | `adapters/windsurf/*.md` into `.windsurf/rules/` |
| GitHub Copilot | `adapters/copilot/*.instructions.md` into `.github/instructions/`, plus `AGENTS.md` at the repo root |
| Cline | `adapters/cline/*.md` into `.clinerules/` |
| Aider | point `.aider.conf.yml` at `AGENTS.md` (see `adapters/aider/`) |
| Claude Code subagents | `adapters/claude-agents/*.md` into `.claude/agents/` |
| Any MCP client (Claude Desktop, VS Code, Zed, Continue, …) | point it at `mcp/server.mjs` — zero dependencies, runs with plain `node` |
| A model with no skill loader at all (Ollama, DeepSeek, a bare API call) | paste `flatten/<name>.prompt.md` in as the system prompt |

Full agent-by-agent path table in [INSTALL.md](INSTALL.md).

## Usage

```
/qurn build a pricing page and make sure it's ready to ship
/security review this app before launch
/architect plan the migration to the new auth system
/web redesign the dashboard, something bolder than what we have
```

Prefix any command with `start`, `middle`, or `end` to force which checkpoint it reviews from; left off, the
specialist infers it from the state of the project.

## How it's built

```
skills/<name>/SKILL.md       the specialist: YAML front matter + instructions
skills/<name>/references/    the longer material the instructions point into
flatten/<name>.prompt.md     the whole specialist flattened into one file
commands/codex/, gemini/     native slash-command files for those two CLIs
adapters/                    Cursor, Windsurf, Copilot, Cline, Aider, Claude subagents
mcp/server.mjs               one dependency-free MCP server exposing all eight
research/                    the sources each specialist's advice is actually built from
```

Everything above is generated from one source of truth — the specialists running day to day inside a private
production app — so the published skills and the live versions never drift apart. Forking this to change a
specialist's behavior means editing its `SKILL.md` and references directly; there's no separate build step
required on a fork.

## License

[MIT](LICENSE)
