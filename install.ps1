# Copies the six specialist skills to where an agent looks for them, and their slash commands:
#   Claude Code  /web-specialist ...           (an installed skill is its own command)
#   Gemini CLI   /web-specialist ...           (commands/gemini/*.toml -> .gemini/commands)
#   Codex        /prompts:web-specialist ...   (commands/codex/*.md -> ~/.codex/prompts; Codex reads prompts per user only)
#   ./install.ps1 -Agent <claude|codex|gemini|antigravity> [-Project]
param(
  [Parameter(Mandatory = $true)][ValidateSet('claude', 'codex', 'gemini', 'antigravity')][string]$Agent,
  [switch]$Project
)
$ErrorActionPreference = 'Stop'

if ($Project) {
  $dest = if ($Agent -eq 'claude') { '.claude/skills' } else { '.agents/skills' }
} else {
  $dest = switch ($Agent) {
    'claude' { Join-Path $HOME '.claude/skills' }
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

function Copy-Commands([string]$From, [string]$To) {
  New-Item -ItemType Directory -Force -Path $To | Out-Null
  Get-ChildItem -File $From | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $To $_.Name) -Force
    Write-Output "command $($_.Name) -> $To"
  }
}
$codexHome = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $HOME '.codex' }
switch ($Agent) {
  'gemini' { Copy-Commands (Join-Path $PSScriptRoot 'commands/gemini') $(if ($Project) { '.gemini/commands' } else { Join-Path $HOME '.gemini/commands' }) }
  'codex' { Copy-Commands (Join-Path $PSScriptRoot 'commands/codex') (Join-Path $codexHome 'prompts') }
  default { }
}
