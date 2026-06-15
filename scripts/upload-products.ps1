param(
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Pause-AndExit($Code) {
  Write-Host ""
  Read-Host "Press Enter to close"
  exit $Code
}

function Fail($Text) {
  Write-Host ""
  Write-Host $Text -ForegroundColor Red
  Pause-AndExit 1
}

if (-not (Test-Path ".git")) {
  Fail "Cannot find .git. Please run this script inside the project folder."
}

Write-Host "Syncing latest GitHub main..." -ForegroundColor Cyan
git pull --rebase --autostash origin main

Write-Host "Checking product JSON..." -ForegroundColor Cyan
node -e "JSON.parse(require('fs').readFileSync('src/admin-products.json','utf8')); console.log('admin-products.json ok')"

Write-Host "Running lint..." -ForegroundColor Cyan
npm.cmd run lint

$status = git status --short
if (-not $status) {
  Write-Host ""
  Write-Host "No changes to upload." -ForegroundColor Yellow
  Pause-AndExit 0
}

Write-Host ""
Write-Host "Changes to upload:" -ForegroundColor Cyan
Write-Host $status
Write-Host ""

if (-not $Message) {
  $Message = Read-Host "Enter update message, or press Enter for default"
}

if (-not $Message) {
  $Message = "Update products"
}

Write-Host "Staging files..." -ForegroundColor Cyan
git add --all

$staged = git diff --cached --name-only
if (-not $staged) {
  Write-Host "No staged changes." -ForegroundColor Yellow
  Pause-AndExit 0
}

Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m $Message

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "Done. GitHub Pages will deploy automatically." -ForegroundColor Green
Pause-AndExit 0
