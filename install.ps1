# Copies the six specialist skills to where an agent looks for them.
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
Get-ChildItem -Directory (Join-Path $PSScriptRoot 'skills') | ForEach-Object {
  $target = Join-Path $dest $_.Name
  if (Test-Path $target) { Remove-Item -Recurse -Force -Confirm:$false $target }
  Copy-Item -Recurse $_.FullName $target
  Write-Output "installed $($_.Name) -> $target"
}
