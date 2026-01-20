@echo off
echo ========================================
echo   데이터베이스 초기화 스크립트
echo ========================================
echo.
echo 백엔드 서버를 중지하고 데이터베이스를 초기화합니다...
echo.

cd /d E:\yeong\couple-trip-expense\backend

echo 1. 포트 5000 사용 중인 프로세스 종료...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    echo    프로세스 %%a 종료 중...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 >nul

echo 2. 데이터베이스 파일 삭제...
if exist prisma\dev.db (
    del /f prisma\dev.db
    echo    dev.db 삭제 완료
) else (
    echo    dev.db 파일이 없습니다
)

if exist prisma\dev.db-journal (
    del /f prisma\dev.db-journal
    echo    dev.db-journal 삭제 완료
)

echo 3. 마이그레이션 재실행...
call npx prisma migrate dev --name init

echo.
echo ========================================
echo   초기화 완료!
echo ========================================
echo.
echo 이제 백엔드 서버를 다시 시작하세요:
echo   npm run dev
echo.
pause
