# Copies the six specialist skills to where an agent looks for them, and wires each tool's own entry point:
#   Claude Code    /web-specialist ...           (an installed skill is its own command)
#   claude-agents  @agent-web-specialist ...     (adds read-only subagents that preload the skills; adapters/claude-agents)
#   Gemini CLI     /web-specialist ...           (commands/gemini/*.toml -> .gemini/commands)
#   Codex          /prompts:web-specialist ...   (commands/codex/*.md -> ~/.codex/prompts; Codex reads prompts per user only)
#   Cursor, Windsurf, Copilot, Cline   short rule files that point at ./.agents/skills (adapters/<tool>), so -Project only
#   mcp            prints how to add the MCP server; nothing is copied
#   ./install.ps1 -Agent <claude|claude-agents|codex|gemini|antigravity|cursor|windsurf|copilot|cline|mcp> [-Project]
param(
  [Parameter(Mandatory = $true)][ValidateSet('claude', 'claude-agents', 'codex', 'gemini', 'antigravity', 'cursor', 'windsurf', 'copilot', 'cline', 'mcp')][string]$Agent,
  [switch]$Project
)
$ErrorActionPreference = 'Stop'

if ($Agent -eq 'mcp') {
  $server = Join-Path $PSScriptRoot 'mcp/server.mjs'
  Write-Output 'The MCP server needs no copying. Point your client at it:'
  Write-Output "  Claude Code:  claude mcp add --scope user --transport stdio specialists -- node `"$server`""
  Write-Output '  VS Code:      .vscode/mcp.json  "servers": { "specialists": { "type": "stdio", "command": "node", "args": ["<path to server.mjs>"] } }'
  Write-Output "  Others:       command node, argument $server   (see mcp/README.md)"
  return
}

# The rule files of these tools are short and point at ./.agents/skills, so they are installed per project.
$ruleDirs = @{ cursor = '.cursor/rules'; windsurf = '.windsurf/rules'; copilot = '.github/instructions'; cline = '.clinerules' }
if ($ruleDirs.ContainsKey($Agent) -and -not $Project) { throw "$Agent installs per project: add -Project" }

if ($Project) {
  $dest = if ($Agent -in 'claude', 'claude-agents') { '.claude/skills' } else { '.agents/skills' }
} else {
  $dest = switch ($Agent) {
    'claude' { Join-Path $HOME '.claude/skills' }
    'claude-agents' { Join-Path $HOME '.claude/skills' }
    'codex' { Join-Path $HOME '.agents/skills' }
    'gemini' { Join-Path $HOME '.gemini/skills' }
    'antigravity' { Join-Path $HOME '.gemini/config/skills' }
  }
}

New-Item -ItemType Directory -Force -Path $dest | Out-Null
# Names used before 2026-09-24, replaced by the command names.
foreach ($old in 'web-designer-specialist', 'test-board-specialist') {
  $stale = Join-Path $dest $old
  if (Test-Path $stale) { Remove-Item -Recurse -Force -Confirm:$false $stale }
}
Get-ChildItem -Directory (Join-Path $PSScriptRoot 'skills') | ForEach-Object {
  $target = Join-Path $dest $_.Name
  if (Test-Path $target) { Remove-Item -Recurse -Force -Confirm:$false $target }
  Copy-Item -Recurse $_.FullName $target
  Write-Output "installed $($_.Name) -> $target"
}

function Copy-Files([string]$From, [string]$To) {
  New-Item -ItemType Directory -Force -Path $To | Out-Null
  Get-ChildItem -File $From | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $To $_.Name) -Force
    Write-Output "wrote $($_.Name) -> $To"
  }
}
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' }
switch ($Agent) {
  'gemini' { Copy-Files (Join-Path $PSScriptRoot 'commands/gemini') $(if ($Project) { '.gemini/commands' } else { Join-Path $HOME '.gemini/commands' }) }
  'codex' { Copy-Files (Join-Path $PSScriptRoot 'commands/codex') (Join-Path $codexHome 'prompts') }
  'claude-agents' { Copy-Files (Join-Path $PSScriptRoot 'adapters/claude-agents') $(if ($Project) { '.claude/agents' } else { Join-Path $HOME '.claude/agents' }) }
  { $ruleDirs.ContainsKey($_) } { Copy-Files (Join-Path $PSScriptRoot "adapters/$Agent") $ruleDirs[$Agent] }
  default { }
}
