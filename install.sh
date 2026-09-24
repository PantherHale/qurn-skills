#!/usr/bin/env sh
# Copies the six specialist skills to where an agent looks for them, and their slash commands:
#   Claude Code  /web-specialist ...           (an installed skill is its own command)
#   Gemini CLI   /web-specialist ...           (commands/gemini/*.toml -> .gemini/commands)
#   Codex        /prompts:web-specialist ...   (commands/codex/*.md -> ~/.codex/prompts; Codex reads prompts per user only)
#   ./install.sh <claude|codex|gemini|antigravity> [--project]
set -eu
agent="${1:-}"
scope="${2:-}"
here="$(cd "$(dirname "$0")" && pwd)"
usage() { echo "usage: ./install.sh <claude|codex|gemini|antigravity> [--project]" >&2; exit 2; }

if [ "$scope" = "--project" ]; then
  case "$agent" in
    claude) dest=".claude/skills" ;;
    codex|gemini|antigravity) dest=".agents/skills" ;;
    *) usage ;;
  esac
else
  case "$agent" in
    claude) dest="$HOME/.claude/skills" ;;
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

copy_commands() { # <from> <to>
  mkdir -p "$2"
  for f in "$1"/*; do cp "$f" "$2/"; echo "command $(basename "$f") -> $2"; done
}
case "$agent" in
  gemini) if [ "$scope" = "--project" ]; then copy_commands "$here/commands/gemini" ".gemini/commands"; else copy_commands "$here/commands/gemini" "$HOME/.gemini/commands"; fi ;;
  codex) copy_commands "$here/commands/codex" "${CODEX_HOME:-$HOME/.codex}/prompts" ;;
  *) ;;
esac
