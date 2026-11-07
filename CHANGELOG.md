# Changelog

## 1.0.0 (2026-11-07)

First tagged release.

- Ten portable skills, each a `SKILL.md` with reference files: `research`, `web`, `tester`, `architect`, `coder`, `security`, `delegator`, `evolve`, `status`, and the team lead `qurn`, which consults the others.
- Install scripts for Claude Code, Codex, Gemini CLI, Antigravity, Cursor, Windsurf, Copilot and Cline (`install.sh` and `install.ps1`), plus an MCP server for any MCP client.
- `flatten/` single-file prompts for models with no skill loader.
- A generator and check for those prompts (`node scripts/build-flatten.mjs`, `--check`) and a CI workflow that runs the tests and the check on Linux and Windows.
- Fixed: the single-file prompts in `flatten/` had drifted from the skills and are now regenerated from them.
- Fixed: removed leftover internal wording and local file paths from the research notes and script comments.
- Added: contributing guide, issue templates, and a showcase build.
