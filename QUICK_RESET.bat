@echo off
echo ========================================
echo   앱 완전 초기화 및 재시작
echo ========================================
echo.

cd /d E:\yeong\couple-trip-expense\backend

echo [1/5] 모든 서버 중지...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173 ^| findstr LISTENING') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 >nul

echo [2/5] 데이터베이스 초기화...
if exist prisma\dev.db del /f prisma\dev.db >nul 2>&1
if exist prisma\dev.db-journal del /f prisma\dev.db-journal >nul 2>&1

echo [3/5] 마이그레이션 재실행...
call npx prisma migrate dev --name init

echo [4/5] 백엔드 서버 시작...
start "Backend Server" cmd /k "cd /d E:\yeong\couple-trip-expense\backend && npm run dev"

timeout /t 3 >nul

echo [5/5] 프론트엔드 서버 시작...
start "Frontend Server" cmd /k "cd /d E:\yeong\couple-trip-expense\frontend && npm run dev"

echo.
echo ========================================
echo   초기화 및 재시작 완료!
echo ========================================
echo.
echo 백엔드: http://localhost:5000
echo 프론트엔드: http://localhost:5173
echo.
echo 새 창에서 서버들이 시작되었습니다.
echo 잠시 후 브라우저에서 http://localhost:5173 으로 접속하세요!
echo.
pause
