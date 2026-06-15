@echo off
cd /d "%~dp0"
start "首頁內容工具伺服器" /min powershell -NoProfile -ExecutionPolicy Bypass -Command "Set-Location '%~dp0'; python -m http.server 5180"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5180/首頁內容管理工具.html"
