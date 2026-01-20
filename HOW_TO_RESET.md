# 🔄 데이터베이스 초기화 가이드

## 빠른 초기화 (추천)

가장 간단한 방법:

```batch
E:\yeong\couple-trip-expense\QUICK_RESET.bat
```

이 파일을 더블클릭하면:
- ✅ 모든 서버 자동 중지
- ✅ 데이터베이스 완전 초기화
- ✅ 백엔드/프론트엔드 자동 재시작
- ✅ 새 창에서 서버 실행

**완료 후**: 브라우저에서 `http://localhost:5173` 접속!

---

## 수동 초기화

### 방법 1: 백엔드만 초기화

1. 백엔드 터미널에서 `Ctrl+C` (서버 중지)
2. `E:\yeong\couple-trip-expense\backend\RESET_DB.bat` 실행
3. 완료 후 `npm run dev` 실행

### 방법 2: 완전 수동

**1단계: 서버들 중지**
```powershell
# 포트 확인
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# 프로세스 종료 (PID는 위에서 확인)
taskkill /F /PID [PID번호]
```

**2단계: 데이터베이스 삭제**
```powershell
cd E:\yeong\couple-trip-expense\backend
Remove-Item prisma\dev.db -Force
Remove-Item prisma\dev.db-journal -Force -ErrorAction SilentlyContinue
```

**3단계: 마이그레이션 재실행**
```powershell
npx prisma migrate dev --name init
```

**4단계: 서버 재시작**
```powershell
# 터미널 1 (백엔드)
cd E:\yeong\couple-trip-expense\backend
npm run dev

# 터미널 2 (프론트엔드)
cd E:\yeong\couple-trip-expense\frontend
npm run dev
```

---

## 🔐 비밀번호를 잊어버렸을 때

현재는 데이터베이스를 초기화하는 방법밖에 없습니다.

### 향후 추가 예정 기능:
- [ ] 비밀번호 재설정 기능
- [ ] 이메일로 비밀번호 재설정 링크 발송
- [ ] 관리자 모드로 사용자 삭제

---

## 💡 팁

### 테스트용 계정 여러 개 만들기

초기화 없이 다른 이메일로 회원가입하세요:
- test1@test.com
- test2@test.com
- myemail+test1@gmail.com (Gmail의 + 기능)

### 데이터 백업

중요한 데이터가 있다면:
```powershell
copy E:\yeong\couple-trip-expense\backend\prisma\dev.db backup_dev.db
```

복원:
```powershell
copy backup_dev.db E:\yeong\couple-trip-expense\backend\prisma\dev.db
```

---

## 문제 해결

### "파일을 삭제할 수 없습니다" 오류
➡️ 백엔드 서버가 실행 중입니다. `Ctrl+C`로 중지 후 재시도

### 포트가 이미 사용 중
➡️ 다른 프로세스가 포트를 사용 중입니다:
```powershell
netstat -ano | findstr :5000
taskkill /F /PID [PID]
```

### 프론트엔드가 5174 포트로 열림
➡️ 5173이 사용 중입니다. 5174로 접속하거나 5173 프로세스 종료 후 재시작
