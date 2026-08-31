@echo off
cd /d "%~dp0"
title HE THONG QUAN LY BUON BAN HEO - PIG MANAGEMENT
color 0A

echo ======================================================================
echo    HE THONG QUAN LY BUON BAN HEO PRO - SPRING BOOT ^& SQL SERVER
echo ======================================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [LOI] May tinh chua cai dat Node.js! Vui long cai Node.js tu https://nodejs.org
    pause
    exit /b
)

if not exist node_modules (
    echo [1/3] Dang cai dat thu vien Frontend...
    call npm.cmd install
)

echo [2/3] Dang khoi dong Backend Spring Boot (Cong 8080)...
start "Pig-Backend-SpringBoot" cmd.exe /k "cd /d "%~dp0backend" && mvn spring-boot:run"

echo [3/3] Dang khoi dong Giao dien Frontend (Cong 3000)...
timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"
call npx.cmd vite --port 3000 --host

pause
