@echo off
cd /d "%~dp0"
start "商品管理工具伺服器" /min powershell -NoProfile -ExecutionPolicy Bypass -Command "python -m http.server 5179"
timeout /t 2 /nobreak >nul
start "" "http://localhost:5179/商品管理工具.html"
