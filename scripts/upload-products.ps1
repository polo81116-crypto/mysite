param(
  [string]$Message = ""
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

function Stop-WithMessage($Text) {
  Write-Host ""
  Write-Host $Text -ForegroundColor Red
  Write-Host ""
  Read-Host "按 Enter 關閉"
  exit 1
}

if (-not (Test-Path ".git")) {
  Stop-WithMessage "找不到 .git，請確認腳本放在專案資料夾內。"
}

Write-Host "檢查商品資料 JSON..." -ForegroundColor Cyan
node -e "JSON.parse(require('fs').readFileSync('src/admin-products.json','utf8')); console.log('admin-products.json ok')"

Write-Host "檢查程式語法..." -ForegroundColor Cyan
npm.cmd run lint

$status = git status --short
if (-not $status) {
  Write-Host ""
  Write-Host "沒有偵測到需要上傳的變更。" -ForegroundColor Yellow
  Read-Host "按 Enter 關閉"
  exit 0
}

Write-Host ""
Write-Host "本次會上傳以下變更：" -ForegroundColor Cyan
Write-Host $status
Write-Host ""

if (-not $Message) {
  $Message = Read-Host "請輸入這次更新說明，直接 Enter 則使用預設"
}

if (-not $Message) {
  $Message = "Update products"
}

Write-Host "同步 GitHub 最新版本..." -ForegroundColor Cyan
git pull --rebase origin main

Write-Host "建立提交..." -ForegroundColor Cyan
git add src/admin-products.json 商品管理工具.html Imgea public src/App.jsx vite.config.js
git commit -m $Message

Write-Host "推送到 GitHub..." -ForegroundColor Cyan
git push origin main

Write-Host ""
Write-Host "完成。GitHub Pages 會自動部署，通常需要等一下才會更新。" -ForegroundColor Green
Read-Host "按 Enter 關閉"
