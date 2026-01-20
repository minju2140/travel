# 📱 모바일 설치 가이드

## 🎉 앱이 PWA로 설정되었습니다!

이제 모바일 기기에서 앱처럼 설치하고 사용할 수 있습니다.

---

## 📋 설치 전 준비 (한 번만)

### 1단계: 아이콘 생성

브라우저에서 다음 URL을 엽니다:
```
http://localhost:5173/generate-icons.html
```

"아이콘 생성 및 다운로드" 버튼을 클릭하면:
- `icon-192.png`
- `icon-512.png`

두 파일이 다운로드됩니다.

### 2단계: 아이콘 파일 저장

다운로드한 두 파일을 다음 폴더에 저장:
```
E:\yeong\couple-trip-expense\frontend\public\
```

### 3단계: 브라우저 새로고침

프론트엔드를 새로고침하면 PWA 설정이 완료됩니다!

---

## 📱 모바일에 설치하는 방법

### 안드로이드 (Chrome)

1. **모바일과 PC가 같은 WiFi에 연결되어 있는지 확인**

2. **PC의 IP 주소 확인**:
   ```powershell
   ipconfig
   ```
   (IPv4 주소를 찾으세요. 예: 192.168.0.10)

3. **모바일 Chrome에서 접속**:
   ```
   http://[PC의IP주소]:5173
   ```
   예: `http://192.168.0.10:5173`

4. **설치하기**:
   - Chrome 메뉴(⋮) → "홈 화면에 추가"
   - 또는 주소창 옆 "설치" 아이콘 클릭

5. **완료!** 홈 화면에 앱 아이콘이 나타납니다.

### iOS (Safari)

1. **모바일 Safari에서 접속**:
   ```
   http://[PC의IP주소]:5173
   ```

2. **설치하기**:
   - 공유 버튼(□↑) 클릭
   - "홈 화면에 추가" 선택
   - "추가" 버튼 탭

3. **완료!** 홈 화면에 앱이 추가됩니다.

---

## 🌐 실제 배포하기 (선택사항)

로컬이 아닌 **실제 인터넷에서** 사용하려면 배포가 필요합니다.

### Vercel로 무료 배포

#### 백엔드 배포

1. **Railway.app** 계정 생성
2. GitHub에 코드 업로드
3. Railway에서 프로젝트 연결
4. 환경 변수 설정:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `PORT=5000`

#### 프론트엔드 배포

1. **Vercel** 계정 생성
2. GitHub 연결
3. 프로젝트 import
4. 환경 변수 설정:
   - `VITE_API_URL=https://your-backend.railway.app`

#### API URL 업데이트

`frontend/src/api/axios.js` 수정:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // ...
});
```

배포 후 **실제 URL**로 접속 가능:
- Frontend: `https://your-app.vercel.app`
- 전 세계 어디서나 접속 가능!
- HTTPS로 안전한 연결
- 더 빠른 속도

---

## 🔧 문제 해결

### 모바일에서 연결이 안 될 때

1. **방화벽 확인**:
   ```powershell
   # Windows 방화벽에서 포트 5000, 5173 허용
   netsh advfirewall firewall add rule name="Vite Dev" dir=in action=allow protocol=TCP localport=5173
   netsh advfirewall firewall add rule name="Backend" dir=in action=allow protocol=TCP localport=5000
   ```

2. **같은 WiFi 네트워크 확인**:
   - PC와 모바일이 같은 WiFi에 연결되어 있어야 함

3. **IP 주소 재확인**:
   ```powershell
   ipconfig
   ```

### "홈 화면에 추가" 버튼이 안 보일 때

- 브라우저 캐시 삭제
- 시크릿 모드에서 테스트
- 아이콘 파일이 제대로 저장되었는지 확인

---

## ✨ PWA 기능

설치 후 다음 기능을 사용할 수 있습니다:

- ✅ **홈 화면 아이콘**: 일반 앱처럼 실행
- ✅ **전체 화면 모드**: 브라우저 UI 없이 실행
- ✅ **빠른 실행**: 바로 앱이 열림
- ✅ **오프라인 지원**: 기본 캐싱 (service worker)
- ✅ **푸시 알림 준비**: 향후 추가 가능

---

## 📊 현재 상태

✅ PWA 설정 완료
✅ manifest.json 생성
✅ Service Worker 등록
✅ 모바일 최적화 UI
✅ 반응형 디자인

🚀 이제 친구나 파트너에게 공유하세요!

---

## 💡 팁

### 테스트용 빠른 공유

같은 WiFi에 있다면:
1. PC의 IP와 포트를 QR 코드로 만들기
2. 모바일에서 QR 스캔
3. 바로 앱 설치!

### 실제 사용 시

배포 후:
- 도메인 주소 공유 (예: https://myapp.vercel.app)
- 누구나 설치 가능
- 데이터 동기화
- 실시간 업데이트

즐거운 여행 되세요! ✈️💰
