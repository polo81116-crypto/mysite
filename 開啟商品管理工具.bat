@echo off
cd /d "%~dp0"
start "" "http://localhost:5179/商品管理工具.html"
powershell -NoProfile -ExecutionPolicy Bypass -Command "python -m http.server 5179"
