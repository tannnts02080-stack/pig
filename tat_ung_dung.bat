@echo off
title TAT HE THONG PIG MANAGEMENT
color 0C

echo ======================================================================
echo    DANG TAT TOAN BO BACKEND (PORT 8080) VA FRONTEND (PORT 3000)...
echo ======================================================================
echo.

:: Tat cac tien trinh Java (Spring Boot Backend) va Node (Vite Frontend)
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul

echo.
echo [THANH CONG] Da tat sach tat ca Backend va Frontend!
echo Cac cong 8080 va 3000 da duoc giai phong hoan toan.
echo.
pause
