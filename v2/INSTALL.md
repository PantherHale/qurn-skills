# Installing the specialists

Every skill lives in `skills/<name>/` as a standard `SKILL.md` (Agent Skills format) with `references/` and, for two
of them, `scripts/`. Copy the folders to where your agent looks for skills, or run the install script.

| Agent | Project (this repo only) | Everywhere (your user) |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `.agents/skills/` | `~/.agents/skills/` |
| Gemini CLI | `.gemini/skills/` or `.agents/skills/` | `~/.gemini/skills/` |
| Antigravity | `.agents/skills/` | `~/.gemini/config/skills/` (IDE) |

`.agents/skills/` in a project is read by Codex, Gemini CLI and Antigravity alike, so one copy there covers all three.
Paths were checked against each agent's documentation on 2026-09-23; check yours if an agent does not pick them up.

```sh
./install.sh claude            # user-wide for Claude Code
./install.sh codex --project   # into ./.agents/skills of the current folder
```

```powershell
./install.ps1 -Agent claude
./install.ps1 -Agent codex -Project
```

## Tools that use rule files, subagents or MCP instead of skills

Checked against each tool's own documentation on 2026-10-08. Every rule file is a short pointer, because the tools
cap or advise on size (Windsurf 12,000 characters per rule file, Cursor under 500 lines, Copilot under two pages). The
long knowledge stays in `./.agents/skills/<name>/`, which the pointer tells the agent to read, so these installs put
the skills there too.

| Tool | Install | What it adds |
|---|---|---|
| Claude Code subagents | `./install.sh claude-agents` | `.claude/agents/<name>.md`: a read-only subagent (`tools: Read, Grep, Glob`) per specialist that preloads its skill. Claude delegates by description, or you write `@agent-web-specialist`. |
| Cursor | `./install.sh cursor --project` | `.cursor/rules/<name>.mdc`, "Apply Intelligently": Cursor reads the description and pulls the rule in when it fits. |
| Windsurf | `./install.sh windsurf --project` | `.windsurf/rules/<name>.md` with `trigger: model_decision`. |
| GitHub Copilot | `./install.sh copilot --project` | `.github/instructions/web-specialist.instructions.md`, applied to web files by `applyTo`. The other five are reached through `AGENTS.md`, which Copilot reads. |
| Cline | `./install.sh cline --project` | `.clinerules/web-specialist.md`, applied to web files by `paths`. Cline also reads `AGENTS.md`. |
| Aider | see `adapters/aider/aider.conf.yml.example` | `read: AGENTS.md` in `.aider.conf.yml`: Aider loads it read-only, and cached when prompt caching is on. |
| **Any MCP client** | `./install.sh mcp` prints the commands | One server (`mcp/server.mjs`, no dependencies) with the six specialists as prompts, resources and tools. See `mcp/README.md`. |

Windows: use `./install.ps1 -Agent <name> [-Project]`; the names are the same.

## Agents and models with no skill support

- **Ollama, DeepSeek, Hermes or any chat model:** paste `flatten/<name>.prompt.md` as the system prompt. Each file is
  the skill plus all of its references in one piece.
- **Agents that read `AGENTS.md`:** copy `AGENTS.md` to your project root; it tells the agent which specialist fits
  which task and where the full skill is.

## Using a specialist

Ask for it by name: "consult the security-specialist before we launch", "have the test-board-specialist decide if
this is done". Each one reads the project and answers with `VERDICT: pass`, `fix` or `redo`, then its blockers and
advice. They advise; your agent does the work. The web specialist is the one that directs: its reply is numbered
build orders for your agent to carry out.
