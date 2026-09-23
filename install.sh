#!/usr/bin/env sh
# Copies the six specialist skills to where an agent looks for them.
#   ./install.sh <claude|codex|gemini|antigravity> [--project]
set -eu
agent="${1:-}"
scope="${2:-}"
here="$(cd "$(dirname "$0")" && pwd)"

if [ "$scope" = "--project" ]; then
  case "$agent" in
    claude) dest=".claude/skills" ;;
    codex|gemini|antigravity) dest=".agents/skills" ;;
    *) echo "usage: ./install.sh <claude|codex|gemini|antigravity> [--project]" >&2; exit 2 ;;
  esac
else
  case "$agent" in
    claude) dest="$HOME/.claude/skills" ;;
    codex) dest="$HOME/.agents/skills" ;;
    gemini) dest="$HOME/.gemini/skills" ;;
    antigravity) dest="$HOME/.gemini/config/skills" ;;
    *) echo "usage: ./install.sh <claude|codex|gemini|antigravity> [--project]" >&2; exit 2 ;;
  esac
fi

mkdir -p "$dest"
for skill in "$here"/skills/*/; do
  name="$(basename "$skill")"
  rm -rf "${dest:?}/$name"
  cp -R "$skill" "$dest/$name"
  echo "installed $name -> $dest/$name"
done
