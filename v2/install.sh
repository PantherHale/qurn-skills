#!/usr/bin/env sh
# Copies the six specialist skills to where an agent looks for them, and wires each tool's own entry point:
#   Claude Code    /web-specialist ...           (an installed skill is its own command)
#   claude-agents  @agent-web-specialist ...     (adds read-only subagents that preload the skills; adapters/claude-agents)
#   Gemini CLI     /web-specialist ...           (commands/gemini/*.toml -> .gemini/commands)
#   Codex          /prompts:web-specialist ...   (commands/codex/*.md -> ~/.codex/prompts; Codex reads prompts per user only)
#   Cursor, Windsurf, Copilot, Cline   short rule files that point at ./.agents/skills (adapters/<tool>), so project only
#   mcp            prints how to add the MCP server; nothing is copied
#   ./install.sh <claude|claude-agents|codex|gemini|antigravity|cursor|windsurf|copilot|cline|mcp> [--project]
set -eu
agent="${1:-}"
scope="${2:-}"
here="$(cd "$(dirname "$0")" && pwd)"
usage() { echo "usage: ./install.sh <claude|claude-agents|codex|gemini|antigravity|cursor|windsurf|copilot|cline|mcp> [--project]" >&2; exit 2; }

if [ "$agent" = "mcp" ]; then
  echo "The MCP server needs no copying. Point your client at it:"
  echo "  Claude Code:  claude mcp add --scope user --transport stdio specialists -- node \"$here/mcp/server.mjs\""
  echo "  VS Code:      .vscode/mcp.json  { \"servers\": { \"specialists\": { \"type\": \"stdio\", \"command\": \"node\", \"args\": [\"$here/mcp/server.mjs\"] } } }"
  echo "  Others:       command node, argument $here/mcp/server.mjs   (see mcp/README.md)"
  exit 0
fi

# The rule files of these tools are short and point at ./.agents/skills, so they are installed per project.
case "$agent" in
  cursor|windsurf|copilot|cline)
    [ "$scope" = "--project" ] || { echo "$agent installs per project: add --project" >&2; exit 2; } ;;
  *) ;;
esac

if [ "$scope" = "--project" ]; then
  case "$agent" in
    claude|claude-agents) dest=".claude/skills" ;;
    codex|gemini|antigravity|cursor|windsurf|copilot|cline) dest=".agents/skills" ;;
    *) usage ;;
  esac
else
  case "$agent" in
    claude|claude-agents) dest="$HOME/.claude/skills" ;;
    codex) dest="$HOME/.agents/skills" ;;
    gemini) dest="$HOME/.gemini/skills" ;;
    antigravity) dest="$HOME/.gemini/config/skills" ;;
    *) usage ;;
  esac
fi

mkdir -p "$dest"
# Names used before 2026-09-24, replaced by the command names.
rm -rf "$dest/web-designer-specialist" "$dest/test-board-specialist"
for skill in "$here"/skills/*/; do
  name="$(basename "$skill")"
  rm -rf "${dest:?}/$name"
  cp -R "$skill" "$dest/$name"
  echo "installed $name -> $dest/$name"
done

copy_files() { # <from> <to>
  mkdir -p "$2"
  for f in "$1"/*; do cp "$f" "$2/"; echo "wrote $(basename "$f") -> $2"; done
}
case "$agent" in
  gemini) if [ "$scope" = "--project" ]; then copy_files "$here/commands/gemini" ".gemini/commands"; else copy_files "$here/commands/gemini" "$HOME/.gemini/commands"; fi ;;
  codex) copy_files "$here/commands/codex" "${CODEX_HOME:-$HOME/.codex}/prompts" ;;
  claude-agents) if [ "$scope" = "--project" ]; then copy_files "$here/adapters/claude-agents" ".claude/agents"; else copy_files "$here/adapters/claude-agents" "$HOME/.claude/agents"; fi ;;
  cursor) copy_files "$here/adapters/cursor" ".cursor/rules" ;;
  windsurf) copy_files "$here/adapters/windsurf" ".windsurf/rules" ;;
  copilot) copy_files "$here/adapters/copilot" ".github/instructions" ;;
  cline) copy_files "$here/adapters/cline" ".clinerules" ;;
  *) ;;
esac
