@echo off
echo 프론트엔드 재시작 중...
cd /d E:\yeong\couple-trip-expense\frontend
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install
npm run dev
