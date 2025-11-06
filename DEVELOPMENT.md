# 🚀 TravelMate AI - 개발 및 실행 가이드

## 📦 프로젝트 구조

```
solideo-Day2-01-06-Practice2/
├── backend/              # Node.js + Express API 서버
│   ├── server.js        # 메인 서버 파일
│   ├── package.json     # 백엔드 의존성
│   ├── .env             # 환경 변수
│   └── travelmate.db    # SQLite 데이터베이스 (자동 생성)
│
├── frontend/            # React 웹 앱
│   ├── public/          # 정적 파일
│   │   └── index.html
│   ├── src/             # React 소스코드
│   │   ├── components/  # React 컴포넌트
│   │   │   ├── TripForm.js         # 여행 계획 입력 폼
│   │   │   ├── LoadingScreen.js    # AI 생성 로딩 화면
│   │   │   └── TripView.js         # 여행 일정 표시
│   │   ├── App.js       # 메인 앱 컴포넌트
│   │   ├── index.js     # React 엔트리포인트
│   │   └── *.css        # 스타일 파일
│   └── package.json     # 프론트엔드 의존성
│
├── README.md            # 프로젝트 개요
├── PRODUCT_SPECIFICATION.md  # 제품 기획서
├── TECH_ARCHITECTURE.md      # 기술 아키텍처
├── BUSINESS_MODEL.md         # 비즈니스 모델
├── UI_UX_DESIGN.md          # UI/UX 설계
└── COMPETITIVE_ANALYSIS.md   # 경쟁사 분석
```

---

## 🛠️ 사전 요구사항

설치 필요:
- **Node.js** 18+ ([다운로드](https://nodejs.org/))
- **npm** 또는 **yarn**

---

## ⚡ 빠른 시작

### 1️⃣ 백엔드 서버 실행

```bash
# 백엔드 디렉토리로 이동
cd backend

# 의존성 설치
npm install

# 서버 시작 (개발 모드)
npm run dev

# 또는 일반 실행
npm start
```

**서버 실행 확인**:
- URL: http://localhost:3001
- 헬스 체크: http://localhost:3001/api/health

출력 예시:
```
✅ SQLite 데이터베이스 연결 성공
✅ 샘플 장소 데이터 삽입 완료
🚀 TravelMate AI 백엔드 서버 시작!
📡 포트: 3001
🌐 URL: http://localhost:3001
```

---

### 2️⃣ 프론트엔드 실행

**새 터미널 창을 열고:**

```bash
# 프론트엔드 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

**브라우저 자동 실행**:
- URL: http://localhost:3000
- React 개발 서버가 자동으로 브라우저를 엽니다

---

## 🎮 사용 방법

### 1. 여행 계획 생성

1. 브라우저에서 http://localhost:3000 접속
2. 여행 정보 입력:
   - 출발지: 서울역
   - 도착지: 부산 (또는 제주, 강릉 등)
   - 날짜 및 시간 선택
   - 여행 기간: 당일 / 1박2일 등
   - 예산: 5만원~제한없음
   - 스타일: 힐링/맛집/관광/액티비티
3. **"여행 계획 만들기"** 버튼 클릭
4. AI 생성 로딩 화면 (30초)
5. 완성된 여행 일정 확인!

### 2. 일정 확인

생성된 일정에서 다음을 확인할 수 있습니다:
- **타임라인**: 시간순 상세 일정
  - 교통편 정보 (KTX, 버스, 비행기)
  - 방문 장소 (맛집, 카페, 관광지)
  - 소요 시간 및 이동 거리
- **지도**: 경로 시각화 (좌표 정보)
- **비용**: 총 예상 비용 및 상세 내역

---

## 🔧 주요 기능

### 백엔드 API

#### 1. 헬스 체크
```bash
GET http://localhost:3001/api/health
```

#### 2. 여행 계획 생성
```bash
POST http://localhost:3001/api/trips/create
Content-Type: application/json

{
  "origin": "서울역",
  "destination": "부산",
  "startDate": "2025-11-15",
  "startTime": "09:00",
  "duration": "당일",
  "budget": 150000,
  "style": "힐링 여행",
  "userId": "guest"
}
```

**응답 예시**:
```json
{
  "success": true,
  "tripId": "uuid...",
  "trip": {
    "id": "uuid...",
    "origin": "서울역",
    "destination": "부산",
    "itinerary": {
      "transportation": [...],
      "timeline": [...],
      "summary": {
        "totalCost": 150000,
        "totalTime": "12시간",
        "visitCount": 6
      }
    }
  }
}
```

#### 3. 여행 조회
```bash
GET http://localhost:3001/api/trips/:tripId
```

#### 4. 장소 검색
```bash
GET http://localhost:3001/api/places/search?category=restaurant
```

---

## 🎨 주요 컴포넌트

### 프론트엔드

1. **TripForm** (`components/TripForm.js`)
   - 여행 정보 입력 폼
   - 유효성 검사
   - API 호출

2. **LoadingScreen** (`components/LoadingScreen.js`)
   - AI 생성 로딩 애니메이션
   - 프로그레스 바
   - 단계별 상태 표시

3. **TripView** (`components/TripView.js`)
   - 생성된 여행 일정 표시
   - 타임라인 / 지도 / 비용 탭
   - 일정 수정 및 확정

---

## 🗄️ 데이터베이스

### SQLite (자동 생성)

**파일 위치**: `backend/travelmate.db`

**테이블 구조**:

```sql
-- 여행 테이블
trips (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  origin TEXT,
  destination TEXT,
  start_date TEXT,
  start_time TEXT,
  duration TEXT,
  budget INTEGER,
  style TEXT,
  itinerary TEXT,  -- JSON 형식
  created_at TEXT
)

-- 장소 테이블
places (
  id TEXT PRIMARY KEY,
  name TEXT,
  category TEXT,
  latitude REAL,
  longitude REAL,
  rating REAL,
  description TEXT
)
```

**샘플 데이터**:
- 부산: 해운대 해수욕장, 광안리, 감천문화마을 등
- 제주: 성산일출봉, 우도, 협재 해수욕장 등

---

## 🐛 트러블슈팅

### 문제 1: 백엔드 서버 실행 안됨
```bash
# 포트 3001이 이미 사용 중인 경우
# .env 파일에서 포트 변경
PORT=3002

# 또는 실행 중인 프로세스 종료
lsof -ti:3001 | xargs kill -9
```

### 문제 2: 프론트엔드에서 백엔드 연결 실패
- 백엔드 서버가 실행 중인지 확인 (http://localhost:3001/api/health)
- CORS 설정 확인 (이미 활성화됨)
- 브라우저 콘솔에서 에러 메시지 확인

### 문제 3: npm install 오류
```bash
# 캐시 정리 후 재시도
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 문제 4: SQLite 데이터베이스 초기화
```bash
# 데이터베이스 파일 삭제 후 재시작
rm backend/travelmate.db
# 서버 재시작 시 자동으로 새로 생성됨
```

---

## 🧪 테스트

### API 테스트 (curl)

```bash
# 헬스 체크
curl http://localhost:3001/api/health

# 여행 계획 생성
curl -X POST http://localhost:3001/api/trips/create \
  -H "Content-Type: application/json" \
  -d '{
    "origin": "서울역",
    "destination": "부산",
    "startDate": "2025-11-15",
    "startTime": "09:00",
    "duration": "당일",
    "budget": 150000,
    "style": "힐링 여행"
  }'
```

---

## 📝 개발 노트

### 현재 구현된 기능 (MVP)

✅ **완료**:
- 백엔드 API 서버 (Node.js + Express)
- SQLite 데이터베이스
- 여행 계획 생성 API
- Mock AI 일정 생성 (실제 ML 모델은 Phase 2)
- React 프론트엔드
- 여행 정보 입력 폼
- 로딩 화면 애니메이션
- 일정 확인 화면 (타임라인, 지도, 비용)
- 샘플 데이터 (부산, 제주 등)

### 향후 개발 예정 (Phase 2)

⏳ **예정**:
- 실제 AI/ML 추천 모델 통합
- 실제 교통 API 연동 (코레일, 버스, 항공)
- Google Maps API 연동 (실제 지도 표시)
- 사용자 인증 (회원가입/로그인)
- 일정 수정 기능
- 예약 기능
- 소셜 공유
- 모바일 앱 (React Native)

---

## 🎯 다음 단계

1. **실제 API 연동**
   - 공공데이터포털 API 키 발급
   - 코레일 API 연동
   - Google Maps API 키 발급

2. **AI 모델 개발**
   - Python 머신러닝 서버 구축
   - 추천 알고리즘 학습
   - FastAPI로 모델 서빙

3. **사용자 인증**
   - JWT 토큰 기반 인증
   - OAuth 소셜 로그인

4. **배포**
   - AWS EC2/Elastic Beanstalk
   - Docker 컨테이너화
   - CI/CD 파이프라인

---

## 📚 참고 문서

- [README.md](./README.md) - 프로젝트 개요
- [PRODUCT_SPECIFICATION.md](./PRODUCT_SPECIFICATION.md) - 상세 기획서
- [TECH_ARCHITECTURE.md](./TECH_ARCHITECTURE.md) - 기술 아키텍처
- [BUSINESS_MODEL.md](./BUSINESS_MODEL.md) - 비즈니스 모델
- [UI_UX_DESIGN.md](./UI_UX_DESIGN.md) - 디자인 가이드
- [COMPETITIVE_ANALYSIS.md](./COMPETITIVE_ANALYSIS.md) - 경쟁사 분석

---

## 🤝 기여

이 프로젝트는 MVP 단계입니다. 기여를 환영합니다!

---

## 📄 라이선스

MIT License

---

**Happy Coding! 🚀**
