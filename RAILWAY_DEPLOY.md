# 🚂 Railway 백엔드 배포 가이드

## 1단계: Railway 가입 및 로그인

1. https://railway.app 접속
2. **Login** → **GitHub으로 로그인**
3. Railway에 GitHub 계정 연결

---

## 2단계: 새 프로젝트 생성

1. Railway 대시보드에서 **New Project** 클릭
2. **Deploy from GitHub repo** 선택
3. GitHub 저장소 `minju2140/travel` 선택
4. **Deploy Now** 클릭

---

## 3단계: 서비스 설정

### A. Root Directory 설정

1. 배포된 서비스 클릭
2. **Settings** 탭
3. **Service Settings** 섹션:
   ```
   Root Directory: backend
   ```
4. **Save**

### B. Build & Start 명령 설정

**Settings** → **Build** 섹션:
```
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
```

**Settings** → **Deploy** 섹션:
```
Watch Paths: backend/**
```

---

## 4단계: 환경 변수 설정

**Variables** 탭 클릭 → **New Variable** 클릭:

```
DATABASE_URL=file:./prod.db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2026
PORT=5000
EXCHANGE_RATE_API_KEY=free
NODE_ENV=production
```

**중요**: `JWT_SECRET`은 반드시 복잡한 랜덤 문자열로 변경하세요!

---

## 5단계: 도메인 확인

1. **Settings** 탭
2. **Domains** 섹션에서 생성된 URL 확인
   - 예: `https://couple-trip-backend.up.railway.app`
3. 이 URL을 복사해두세요!

---

## 6단계: 배포 확인

1. **Deployments** 탭에서 배포 상태 확인
2. "SUCCESS" 표시 확인
3. 브라우저에서 테스트:
   ```
   https://your-backend.up.railway.app/health
   ```
   → 응답: `{"status":"ok"}`

---

## 7단계: Vercel에 백엔드 URL 연결

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. **Add** 클릭:
   ```
   Name: VITE_API_URL
   Value: https://your-backend.up.railway.app/api
   ```
   (Railway에서 복사한 URL + `/api`)
4. **Save**
5. **Deployments** → 최근 배포 → **Redeploy**

---

## 8단계: 백엔드 CORS 설정

Railway 백엔드가 Vercel 프론트엔드를 허용하도록 설정:

`backend/src/server.js` 파일 수정 필요:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://travel-liard-iota.vercel.app"  // ← Vercel URL 추가
  ],
  credentials: true
}));
```

변경 후:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Railway가 자동으로 재배포합니다!

---

## ✅ 완료 확인

1. Vercel URL 접속: https://travel-liard-iota.vercel.app
2. 회원가입 시도
3. 성공하면 완료! 🎉

---

## 💡 무료 플랜 제한

### Railway 무료 플랜
- **$5 크레딧/월** (약 500시간)
- 사용하지 않을 때는 자동 sleep
- 첫 요청 시 wake-up (5-10초 소요)

### 주의사항
- SQLite 데이터베이스는 Railway 재배포 시 초기화됨
- 실제 서비스용으로는 PostgreSQL 권장

---

## 🔧 문제 해결

### 배포 실패
- **Build Logs** 확인
- Root Directory가 `backend`로 설정되었는지 확인

### 데이터베이스 오류
```bash
# Railway에서 Prisma 마이그레이션 수동 실행
npx prisma migrate deploy
```

### CORS 오류
- 백엔드 `server.js`의 CORS origin에 Vercel URL 추가
- GitHub push → Railway 자동 재배포

---

**문제가 있으면 Railway의 Build Logs와 Deploy Logs를 확인하세요!** 🚂
