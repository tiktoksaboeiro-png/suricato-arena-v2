@echo off
cd /d %~dp0

echo ================================
echo INICIANDO SURICATO ARENA V2
echo ================================

echo.
echo Abrindo servidor local...
start cmd /k "npm run dev"

timeout /t 5 >nul

start http://localhost:3000

echo.
echo SURICATO ARENA ONLINE
pause