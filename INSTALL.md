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

## Agents and models with no skill support

- **Ollama, DeepSeek, Hermes or any chat model:** paste `flatten/<name>.prompt.md` as the system prompt. Each file is
  the skill plus all of its references in one piece.
- **Agents that read `AGENTS.md`:** copy `AGENTS.md` to your project root; it tells the agent which specialist fits
  which task and where the full skill is.

## Using a specialist

Ask for it by name: "consult the security-specialist before we launch", "have the test-board-specialist decide if
this is done". Each one reads the project and answers with `VERDICT: pass`, `fix` or `redo`, then its blockers and
advice. They advise; your agent does the work.
