# 🚀 Vercel 배포 가이드

## ⚠️ 배포 실패 시 해결 방법

### 1단계: Vercel 프로젝트 설정 확인

Vercel 대시보드에서 프로젝트 선택 → **Settings** 탭

#### ✅ General Settings

**Root Directory**: `frontend` ← **반드시 설정!**

#### ✅ Build & Development Settings

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

---

## 2단계: 프로젝트 재import

설정이 잘못된 경우, 프로젝트를 삭제하고 다시 import:

### A. 기존 프로젝트 삭제

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → 하단 **Delete Project**
3. 프로젝트 이름 입력 후 삭제

### B. 새로 Import

1. Vercel 대시보드 → **Add New...** → **Project**
2. GitHub 저장소 `minju2140/travel` 선택
3. **Configure Project** 화면에서:

```
Project Name: couple-trip-expense
Framework Preset: Vite
Root Directory: frontend  ← 클릭하여 선택!
```

4. **Environment Variables** (선택사항 - 나중에 추가 가능):
```
Name: VITE_API_URL
Value: http://localhost:5000/api
```
(Railway 백엔드 배포 후 실제 URL로 변경)

5. **Deploy** 클릭!

---

## 3단계: 배포 확인

### 성공 시
- **Deployments** 탭에서 "Ready" 상태 확인
- 생성된 URL 클릭하여 접속
- 예: `https://couple-trip-expense.vercel.app`

### 실패 시
- **Build Logs** 전체 확인
- 오류 메시지 복사

---

## 🔍 자주 발생하는 오류

### 오류 1: "Could not find package.json"
```
Error: Could not find a package.json file
```

**원인**: Root Directory가 설정되지 않음

**해결**:
1. Settings → General
2. Root Directory → **Edit**
3. `frontend` 입력 또는 폴더 선택
4. **Save**
5. Deployments → **Redeploy**

---

### 오류 2: "Module not found"
```
Error: Cannot find module 'react'
```

**원인**: 의존성 설치 실패

**해결**:
1. Settings → General
2. Node.js Version → `18.x` 또는 `20.x`
3. Install Command → `npm install`
4. **Save** → **Redeploy**

---

### 오류 3: Build 시간 초과
```
Error: Build exceeded maximum duration
```

**원인**: 빌드가 너무 오래 걸림 (무료 플랜: 최대 45초)

**해결**: 
- Vercel 무료 플랜 제한
- Pro 플랜으로 업그레이드 또는
- 다른 호스팅 서비스 사용 (Netlify)

---

## 📱 배포 완료 후

### 1. URL 확인
배포 성공 시 받는 URL:
```
https://your-project-name.vercel.app
```

### 2. 백엔드 연결

Railway에서 백엔드 배포 완료 후:

1. Railway에서 백엔드 URL 복사
   예: `https://couple-trip-backend.up.railway.app`

2. Vercel → Settings → Environment Variables
   ```
   Name: VITE_API_URL
   Value: https://couple-trip-backend.up.railway.app/api
   ```

3. Deployments → **Redeploy**

### 3. 백엔드 CORS 설정

백엔드 코드에서 Vercel URL 허용:

`backend/src/server.js`:
```javascript
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://your-project.vercel.app"  // ← Vercel URL 추가
  ],
  credentials: true
}));
```

변경 후 GitHub push → Railway 자동 재배포

---

## 🎉 완료!

배포가 성공하면:
- ✅ 프론트엔드: `https://your-project.vercel.app`
- ✅ 백엔드: `https://your-backend.railway.app`
- ✅ 전 세계 어디서나 접속 가능!

---

## 💡 팁

### 자동 배포
- GitHub에 push하면 Vercel이 자동으로 배포
- `main` 브랜치에 push → Production 배포
- 다른 브랜치 push → Preview 배포

### Preview URL
- PR(Pull Request) 생성 시 자동으로 Preview URL 생성
- 테스트 후 merge

### 도메인 연결
- Settings → Domains
- 본인의 도메인 연결 가능

---

**문제가 계속되면 Build Logs를 확인하고 오류 메시지를 공유해주세요!** 🚀
