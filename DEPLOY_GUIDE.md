# 🚀 배포 가이드

## 📱 실제 URL로 배포하기

이 가이드를 따라하면 **무료로** 앱을 배포하고 전 세계 어디서나 접속할 수 있습니다!

---

## 🎯 배포 후 결과

배포가 완료되면:
- ✅ **실제 URL** 제공 (예: https://couple-trip.vercel.app)
- ✅ **전 세계 어디서나** 접속 가능
- ✅ **핸드폰에서** 홈 화면에 추가 가능
- ✅ **HTTPS** 보안 연결
- ✅ **무료** (개인 프로젝트용)

---

## 📋 준비사항

1. **GitHub 계정** - 코드 저장용
2. **Vercel 계정** - 프론트엔드 배포 (무료)
3. **Railway 계정** - 백엔드 배포 (무료, $5 크레딧 제공)

---

## 1단계: GitHub에 코드 업로드

### 1-1. GitHub Repository 만들기

1. https://github.com 접속 및 로그인
2. 오른쪽 상단 **"+"** → **"New repository"**
3. Repository 이름: `couple-trip-expense`
4. **Public** 선택
5. **"Create repository"** 클릭

### 1-2. 로컬 코드를 GitHub에 푸시

```powershell
# 프로젝트 폴더로 이동
cd E:\yeong\couple-trip-expense

# Git 초기화
git init

# 모든 파일 추가
git add .

# 커밋
git commit -m "Initial commit"

# GitHub 저장소 연결 (YOUR-USERNAME을 본인 것으로 변경)
git remote add origin https://github.com/YOUR-USERNAME/couple-trip-expense.git

# 푸시
git branch -M main
git push -u origin main
```

---

## 2단계: 백엔드 배포 (Railway)

### 2-1. Railway 계정 생성

1. https://railway.app 접속
2. **"Start a New Project"** 클릭
3. GitHub로 로그인
4. **"Deploy from GitHub repo"** 선택

### 2-2. 백엔드 배포 설정

1. `couple-trip-expense` 저장소 선택
2. **"Deploy Now"** 클릭
3. Settings → **Root Directory** 설정:
   ```
   backend
   ```

### 2-3. 환경 변수 설정

Settings → **Variables** 탭에서 다음 변수 추가:

```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-super-secret-key-change-this-to-random-string-123456789
PORT=5000
EXCHANGE_RATE_API_KEY=free
```

⚠️ **중요**: `JWT_SECRET`은 반드시 복잡한 랜덤 문자열로 변경하세요!

### 2-4. 도메인 확인

1. Settings → **Networking** 탭
2. **"Generate Domain"** 클릭
3. 생성된 URL 복사 (예: `https://couple-trip-backend.up.railway.app`)

---

## 3단계: 프론트엔드 배포 (Vercel)

### 3-1. Vercel 계정 생성

1. https://vercel.com 접속
2. **"Sign Up"** → GitHub로 로그인
3. **"Import Project"** 클릭

### 3-2. 프론트엔드 배포 설정

1. `couple-trip-expense` 저장소 선택
2. **Root Directory** 설정:
   ```
   frontend
   ```
3. **Framework Preset**: Vite 선택

### 3-3. 환경 변수 설정

**Environment Variables** 섹션에서:

```
VITE_API_URL=https://couple-trip-backend.up.railway.app/api
```

⚠️ **중요**: Railway에서 복사한 백엔드 URL을 사용하고, 끝에 `/api`를 붙이세요!

### 3-4. 배포 시작

1. **"Deploy"** 버튼 클릭
2. 2~3분 기다리면 배포 완료!
3. 생성된 URL 복사 (예: `https://couple-trip-expense.vercel.app`)

---

## 4단계: CORS 설정 (백엔드)

백엔드 코드에서 프론트엔드 URL을 허용해야 합니다.

`backend/src/server.js` 파일 수정:

```javascript
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://couple-trip-expense.vercel.app"  // ← Vercel URL 추가
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://couple-trip-expense.vercel.app"  // ← Vercel URL 추가
  ]
}));
```

변경 후 GitHub에 푸시:
```powershell
git add .
git commit -m "Update CORS settings"
git push
```

Railway가 자동으로 재배포합니다!

---

## 5단계: 테스트

1. Vercel URL로 접속 (예: https://couple-trip-expense.vercel.app)
2. 회원가입 테스트
3. 여행 생성 테스트
4. 지출 기록 테스트

---

## 📱 모바일에서 설치하기

### 안드로이드 (Chrome)

1. 배포된 URL 접속
2. Chrome 메뉴(⋮) → **"홈 화면에 추가"**
3. 완료! 앱처럼 사용 가능

### iOS (Safari)

1. 배포된 URL 접속
2. 공유 버튼(□↑) → **"홈 화면에 추가"**
3. 완료!

---

## 🔧 문제 해결

### 백엔드가 작동하지 않을 때

1. Railway → Deployments 탭 확인
2. Logs 탭에서 에러 확인
3. 환경 변수가 올바른지 확인

### 프론트엔드에서 API 연결이 안 될 때

1. `VITE_API_URL`이 올바른지 확인
2. Railway URL 끝에 `/api`가 붙어있는지 확인
3. CORS 설정 확인

### 데이터베이스 문제

SQLite는 Railway에서 재시작 시 초기화될 수 있습니다.

**해결책: PostgreSQL로 변경** (프로덕션 권장)

Railway에서:
1. **"+ New"** → **"Database"** → **"PostgreSQL"**
2. 자동으로 `DATABASE_URL` 환경 변수 생성됨
3. `prisma/schema.prisma` 수정:
   ```prisma
   datasource db {
     provider = "postgresql"  // sqlite → postgresql
   }
   ```
4. 푸시 후 Railway에서 마이그레이션:
   ```bash
   npx prisma migrate deploy
   ```

---

## 💰 비용

### 무료 티어 제한

**Railway**:
- 월 $5 크레딧 제공
- 소규모 프로젝트에 충분

**Vercel**:
- 개인 프로젝트 무료
- 대역폭 제한: 100GB/월

### 비용 절약 팁

1. 테스트용으로만 사용
2. 실제 사용자가 많아지면 유료 플랜 고려
3. 이미지는 Cloudinary 무료 티어 사용

---

## 📊 배포 상태 확인

### Railway
- Deployments 탭에서 빌드 로그 확인
- Metrics 탭에서 리소스 사용량 확인

### Vercel
- Deployments 탭에서 배포 상태 확인
- Analytics에서 방문자 통계 확인

---

## 🎉 완료!

이제 친구나 파트너에게 URL을 공유하세요!

```
https://couple-trip-expense.vercel.app
```

전 세계 어디서나 접속 가능합니다! 🌍✈️

---

## 🔄 업데이트 방법

코드를 수정한 후:

```powershell
git add .
git commit -m "Update: description"
git push
```

Railway와 Vercel이 자동으로 새 버전을 배포합니다!

---

## 📞 도움이 필요하면

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

즐거운 여행 되세요! 🚀
