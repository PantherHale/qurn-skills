# Specialist Skills

Six specialist advisers for AI coding agents: **web designer, test board, architect, coder, security, delegator**.
Each one is built from cited research, not vibes, and is meant to be pointed at from any project:
"consult the security specialist before you ship".

**Status:** six skills built from the research, tested in PManager. Not published yet. See [INSTALL.md](INSTALL.md).

## Layout

- `research/` -- cited study notes per specialist: the sources actually read, what to take from each, what to refuse.
- `skills/<name>/SKILL.md` -- the specialist as an open Agent Skills file (YAML front matter + instructions),
  with longer material under `skills/<name>/references/`. Read natively by Claude Code, Codex, Gemini CLI and Antigravity.
- `flatten/<name>.prompt.md` -- each skill with all its references in one file: paste it as the system prompt for
  models with no skill loader (Ollama, DeepSeek, Hermes).
- `AGENTS.md` -- which specialist fits which task, for agents that read `AGENTS.md`.
- `adapters/` -- the same specialists for tools that use subagents or rule files: Claude Code subagents, Cursor, Windsurf,
  GitHub Copilot, Cline, Aider.
- `mcp/` -- one dependency-free MCP server (`server.mjs`) that gives any MCP client the six specialists.
- `install.sh`, `install.ps1`, `INSTALL.md` -- where each agent looks for skills, and a copy script.

`skills/`, `flatten/`, `commands/`, `adapters/`, `mcp/` and `AGENTS.md` are generated from PManager
(`npm run skills:export`), the app the specialists run in, so the published skills and the app never drift. Edit them
there, not here.

## Origin

Extracted from the specialists in PManager's nightrunner, where they advise and review but never edit files.
