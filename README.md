# Specialist Skills

Six specialist advisers for AI coding agents: **web designer, test board, architect, coder, security, delegator**.
Each one is built from cited research, not vibes, and is meant to be pointed at from any project:
"consult the security specialist before you ship".

**Status:** research in progress. Not published yet.

## Layout

- `research/` -- cited study notes per specialist: the sources actually read, what to take from each, what to refuse.
- `skills/<name>/SKILL.md` -- the specialist as an open Agent Skills file (YAML front matter + instructions),
  with longer material under `skills/<name>/references/`. Read natively by Claude Code, Codex, Gemini CLI and Antigravity.
- `AGENTS.md` -- the same specialists flattened into one file, for agents and local models with no skill support
  (Ollama, DeepSeek, Hermes): paste it as a system prompt or keep it in the project root.
- `adapters/` -- install notes per agent.

## Origin

Extracted from the specialists in PManager's nightrunner, where they advise and review but never edit files.
