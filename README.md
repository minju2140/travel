# 💑 커플 여행 지출 관리 앱

해외 여행 중 다양한 통화로 사용한 지출을 자동으로 원화로 환산하여 커플이 함께 지출 내역을 실시간으로 공유하고 관리할 수 있는 웹 애플리케이션

[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR-USERNAME/couple-trip-expense)

---

## ✨ 주요 기능

- 🌍 **14개 통화 지원** - 자동 환율 환산
- 💰 **실시간 동기화** - 파트너와 즉시 공유
- 📊 **통계 대시보드** - 예쁜 차트로 지출 분석
- 🧮 **자동 정산** - 누가 누구에게 얼마를 보내야 하는지 자동 계산
- 📱 **PWA 지원** - 모바일에 앱처럼 설치
- 🎨 **반응형 디자인** - 모바일/태블릿/데스크톱 모두 지원

---

## 🚀 빠른 시작

### 로컬 실행

```bash
# 백엔드
cd backend
npm install
npm run dev

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev
```

접속: http://localhost:5173

### 배포 (무료)

상세 가이드: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)

1. GitHub에 코드 업로드
2. Railway에 백엔드 배포
3. Vercel에 프론트엔드 배포
4. 완료!

---

## 📖 문서

- [🚀 배포 가이드](DEPLOY_GUIDE.md) - 무료 배포 방법
- [📱 모바일 설치](MOBILE_INSTALL.md) - PWA 설치 가이드
- [🔄 DB 초기화](HOW_TO_RESET.md) - 데이터베이스 리셋
- [⚡ 빠른 시작](QUICK_START.md) - 시작하기

---

## 🛠️ 기술 스택

### 백엔드
- Node.js + Express.js
- Prisma ORM + SQLite
- Socket.io (실시간 동기화)
- JWT 인증

### 프론트엔드
- React 18 + Vite
- TailwindCSS
- Zustand (상태관리)
- Recharts (차트)
- Socket.io-client

---

## 🎯 사용 방법

### 1. 회원가입 및 커플 연결
- 회원가입 후 초대 코드 생성
- 파트너가 초대 코드로 참여

### 2. 여행 생성
- 여행 이름, 날짜, 방문 국가 입력

### 3. 지출 기록
- 금액, 통화, 카테고리 선택
- 지불 유형: 내가 냄 / 파트너가 냄 / 공동 지출

### 4. 통계 확인
- 대시보드: 카테고리별/개인별/일별 차트
- 정산: 자동 계산된 정산 금액

---

## 💰 지원 통화

KRW, USD, JPY, EUR, CNY, GBP, THB, VND, TWD, HKD, SGD, AUD, CAD, CHF

---

## 📊 카테고리

🍔 식비 | 🏨 숙박 | 🚌 교통 | 🛍️ 쇼핑 | 🎭 관광 | 🎮 오락 | 📌 기타

---

## 🔒 보안

- JWT 토큰 기반 인증
- bcrypt 비밀번호 해싱
- HTTPS 지원 (배포 시)
- CORS 정책 설정

---

## 📱 PWA 기능

- 홈 화면에 추가
- 전체 화면 모드
- 오프라인 캐싱
- 푸시 알림 준비 완료

---

## 🌐 배포 상태

- Frontend: [![Vercel](https://img.shields.io/badge/vercel-deployed-green)](https://vercel.com)
- Backend: [![Railway](https://img.shields.io/badge/railway-deployed-purple)](https://railway.app)

---

## 📄 라이선스

MIT License

---

## 🤝 기여

이슈와 PR을 환영합니다!

---

## 💬 문의

문제가 있으시면 [Issues](https://github.com/YOUR-USERNAME/couple-trip-expense/issues)에 남겨주세요.

---

**즐거운 여행 되세요!** ✈️💰
