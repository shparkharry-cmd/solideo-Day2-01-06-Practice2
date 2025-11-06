# 🏗️ TravelMate AI - 기술 아키텍처 설계서

## 문서 정보
- **버전**: 1.0.0
- **작성일**: 2025-11-06
- **대상 독자**: CTO, 개발팀, 인프라팀
- **문서 목적**: 시스템 구조 및 기술 스택 정의

---

## 1. 시스템 아키텍처 개요

### 1.1 전체 구조도

```
┌─────────────────────────────────────────────────────────────┐
│                         사용자 (Users)                        │
└────────────┬────────────────────────────────┬────────────────┘
             │                                │
        iOS App                          Android App
             │                                │
             └────────────┬───────────────────┘
                          │
                     API Gateway
                    (Load Balancer)
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    Web Server       AI Engine        Real-time
   (Node.js API)    (Python ML)       Service
         │                │           (WebSocket)
         │                │                │
         └────────────────┼────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    PostgreSQL         Redis           MongoDB
   (Main DB)         (Cache)        (Logs/Analytics)
         │                │                │
         └────────────────┼────────────────┘
                          │
              ┌───────────┴───────────┐
              │                       │
         External APIs            CDN
    (교통, 지도, 결제 등)      (이미지, 정적 파일)
```

### 1.2 레이어 구조

```
┌──────────────────────────────────────┐
│   Presentation Layer (모바일 앱)      │  ← React Native
├──────────────────────────────────────┤
│   API Layer (REST/GraphQL)           │  ← Node.js + Express
├──────────────────────────────────────┤
│   Business Logic Layer               │  ← TypeScript Services
├──────────────────────────────────────┤
│   AI/ML Layer                        │  ← Python + TensorFlow
├──────────────────────────────────────┤
│   Data Layer                         │  ← PostgreSQL + Redis
├──────────────────────────────────────┤
│   Integration Layer (External APIs)  │  ← API Adapters
└──────────────────────────────────────┘
```

---

## 2. 기술 스택 (Tech Stack)

### 2.1 프론트엔드 (Mobile App)

#### React Native
**선택 이유**:
- iOS/Android 동시 개발 → 개발 기간 50% 단축
- JavaScript 생태계 활용
- Hot Reload로 빠른 개발
- 대규모 커뮤니티 지원

**주요 라이브러리**:
```
UI Framework:
- React Native 0.73+
- React Navigation (화면 전환)
- React Native Paper (Material Design)

지도:
- react-native-maps (Google Maps 통합)
- @react-native-community/geolocation (GPS)

상태 관리:
- Redux Toolkit (전역 상태)
- React Query (서버 상태 캐싱)

기타:
- Axios (HTTP 클라이언트)
- react-native-push-notification (푸시 알림)
- react-native-vector-icons (아이콘)
```

**성능 최적화**:
- React.memo로 불필요한 리렌더링 방지
- FlatList virtualization (긴 리스트 최적화)
- Image lazy loading
- Code splitting (라우트별 번들 분리)

---

### 2.2 백엔드 (API Server)

#### Node.js + Express
**선택 이유**:
- Non-blocking I/O → 높은 동시 처리 능력
- JavaScript로 프론트/백 통일 → 개발 효율성
- 풍부한 npm 패키지 생태계
- 빠른 프로토타이핑

**기술 스택**:
```
Runtime: Node.js 20 LTS
Framework: Express.js 4.x
Language: TypeScript (타입 안정성)

주요 라이브러리:
- express-validator (입력 검증)
- helmet (보안 헤더)
- cors (CORS 처리)
- morgan (로깅)
- jsonwebtoken (JWT 인증)
- bcrypt (비밀번호 해싱)
```

**API 설계**:
```
RESTful API 구조:

POST   /api/v1/trips              # 여행 생성
GET    /api/v1/trips/:id          # 여행 조회
PUT    /api/v1/trips/:id          # 여행 수정
DELETE /api/v1/trips/:id          # 여행 삭제

GET    /api/v1/transportation     # 교통편 검색
GET    /api/v1/places/recommend   # 장소 추천
POST   /api/v1/users/profile      # 사용자 프로파일

WebSocket:
WS     /ws/realtime              # 실시간 업데이트
```

**인증 방식**:
- JWT (JSON Web Token)
- Access Token (30분) + Refresh Token (30일)
- OAuth 2.0 (카카오, 네이버, 구글 로그인)

---

### 2.3 AI/ML 엔진

#### Python + TensorFlow
**선택 이유**:
- 머신러닝 표준 언어
- 풍부한 ML/AI 라이브러리
- 과학 계산 최적화

**기술 스택**:
```
Language: Python 3.11+
Framework:
- FastAPI (ML 모델 서빙)
- TensorFlow 2.14+ (딥러닝)
- Scikit-learn (전통적 ML)
- Pandas (데이터 처리)
- NumPy (수치 연산)

추천 시스템:
- Implicit (Collaborative Filtering)
- Surprise (추천 알고리즘)
- Sentence-Transformers (텍스트 임베딩)

NLP:
- Transformers (BERT, GPT)
- KoNLPy (한국어 형태소 분석)
```

**모델 구조**:

**1) 추천 모델**:
```
Input Layer:
- 사용자 특징 벡터 (128차원)
  - 나이, 성별, 취향, 과거 이력
- 장소 특징 벡터 (128차원)
  - 카테고리, 가격, 위치, 평점

Hidden Layers:
- Dense Layer 1: 256 units (ReLU)
- Dropout: 0.3
- Dense Layer 2: 128 units (ReLU)
- Dropout: 0.2

Output Layer:
- Dense Layer: 1 unit (Sigmoid)
- 출력: 추천 점수 (0~1)
```

**2) 경로 최적화 모델**:
```
알고리즘: Reinforcement Learning (DQN)

State: 현재 위치, 시간, 남은 예산, 방문한 장소
Action: 다음 방문 장소 선택
Reward: -이동 시간 - 비용 + 장소 만족도

학습:
- Experience Replay (과거 경험 재학습)
- Target Network (안정적 학습)
- Epsilon-Greedy (탐색 vs 활용)
```

**모델 서빙**:
```
FastAPI 엔드포인트:

POST /ml/recommend
Input: {user_id, location, filters}
Output: [{place_id, score, reason}, ...]
Response Time: < 100ms

POST /ml/optimize_route
Input: {places[], start_time, preferences}
Output: {route[], timeline[], total_cost}
Response Time: < 2s
```

---

### 2.4 데이터베이스

#### PostgreSQL (주 데이터베이스)
**선택 이유**:
- ACID 트랜잭션 보장
- 복잡한 쿼리 지원 (JOIN, Aggregation)
- JSON 타입 지원 (유연한 스키마)
- PostGIS 확장 (지리 정보 처리)

**스키마 설계**:
```sql
-- 사용자 테이블
users:
  id: UUID (Primary Key)
  email: VARCHAR(255) UNIQUE
  password_hash: VARCHAR(255)
  profile: JSONB (취향 정보)
  created_at: TIMESTAMP

-- 여행 테이블
trips:
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → users)
  origin: GEOGRAPHY(POINT)
  destination: GEOGRAPHY(POINT)
  start_date: TIMESTAMP
  end_date: TIMESTAMP
  budget: INTEGER
  status: ENUM('planning', 'active', 'completed')
  itinerary: JSONB (일정 데이터)
  created_at: TIMESTAMP

-- 장소 테이블
places:
  id: UUID (Primary Key)
  name: VARCHAR(255)
  category: VARCHAR(50)
  location: GEOGRAPHY(POINT)
  rating: FLOAT
  price_level: INTEGER
  features: JSONB (특징 벡터)
  reviews_count: INTEGER

-- 리뷰 테이블
reviews:
  id: UUID (Primary Key)
  user_id: UUID (Foreign Key → users)
  place_id: UUID (Foreign Key → places)
  rating: INTEGER (1~5)
  comment: TEXT
  sentiment_score: FLOAT (감성 분석 결과)
  created_at: TIMESTAMP

-- 교통편 테이블 (캐싱용)
transportation:
  id: UUID (Primary Key)
  type: ENUM('bus', 'train', 'flight')
  origin: VARCHAR(100)
  destination: VARCHAR(100)
  departure_time: TIMESTAMP
  arrival_time: TIMESTAMP
  price: INTEGER
  provider: VARCHAR(50)
  cached_at: TIMESTAMP (1시간 후 삭제)
```

**인덱싱 전략**:
```sql
-- 지리 정보 인덱스 (빠른 주변 검색)
CREATE INDEX idx_places_location ON places USING GIST(location);

-- 복합 인덱스 (여행 조회 최적화)
CREATE INDEX idx_trips_user_date ON trips(user_id, start_date DESC);

-- 풀텍스트 검색 인덱스
CREATE INDEX idx_places_name ON places USING GIN(to_tsvector('korean', name));
```

---

#### Redis (캐시 및 세션)
**용도**:
1. **API 응답 캐싱** (TTL 5분)
2. **세션 저장** (JWT Refresh Token)
3. **실시간 교통 정보** (TTL 1분)
4. **Rate Limiting** (API 호출 제한)

**데이터 구조**:
```
# 장소 추천 캐싱
KEY: recommend:{user_id}:{location}:{filters_hash}
VALUE: JSON array (추천 결과)
TTL: 300초

# 교통편 검색 캐싱
KEY: transport:{origin}:{destination}:{date}
VALUE: JSON array (교통편 목록)
TTL: 60초

# 세션
KEY: session:{token_id}
VALUE: {user_id, expires_at}
TTL: 2592000초 (30일)

# Rate Limiting
KEY: ratelimit:{user_id}:{endpoint}
VALUE: 호출 횟수
TTL: 60초
LIMIT: 100 req/min
```

---

#### MongoDB (로그 및 분석)
**용도**:
- 사용자 행동 로그 (클릭, 검색, 체류 시간)
- 에러 로그
- A/B 테스트 데이터
- 분석 대시보드 원본 데이터

**컬렉션 구조**:
```javascript
// 사용자 행동 로그
user_events: {
  _id: ObjectId,
  user_id: String,
  event_type: String, // "search", "click", "book"
  event_data: Object,
  timestamp: ISODate,
  session_id: String
}

// 에러 로그
error_logs: {
  _id: ObjectId,
  level: String, // "error", "warning"
  message: String,
  stack_trace: String,
  context: Object,
  timestamp: ISODate
}
```

---

### 2.5 외부 API 통합

#### 교통 정보 API
```
1. 공공데이터포털 (data.go.kr)
   - 전국 버스 도착 정보
   - 지하철 실시간 위치
   - API 호출 제한: 1,000 req/day (무료)

2. 코레일 API
   - KTX, ITX, 무궁화호 등
   - 실시간 좌석 조회
   - 예약 연동 가능

3. SRT API
   - SRT 열차 정보
   - 실시간 운행 정보

4. 항공사 API (Phase 2)
   - 대한항공, 아시아나, 제주항공 등
   - Amadeus API (통합 항공권 검색)
```

#### 지도 API
```
Google Maps Platform:
- Maps JavaScript API (지도 표시)
- Directions API (경로 계산)
- Places API (장소 검색)
- Geocoding API (주소 ↔ 좌표)
- Distance Matrix API (거리 계산)

비용:
- 월 $200 무료 크레딧
- 이후 $0.005/request
```

#### 날씨 API
```
OpenWeatherMap:
- 현재 날씨
- 3시간 단위 예보
- 5일 예보

기상청 API:
- 초단기 예보 (1시간 이내)
- 동네 예보
```

#### 결제 API (Phase 2)
```
PG사: 토스페이먼츠
- 카드 결제
- 간편 결제 (카카오페이, 네이버페이)
- 정기 결제 (구독)
```

---

### 2.6 인프라 (Infrastructure)

#### 클라우드: AWS
**선택 이유**:
- 국내 리전 (서울) 존재 → 낮은 지연시간
- 다양한 관리형 서비스
- 스타트업 크레딧 프로그램

**서비스 구성**:
```
Compute:
- EC2 t3.medium x 3 (Web Server)
- EC2 g4dn.xlarge x 1 (ML Server, GPU)
- Lambda (이미지 리사이징 등)

Database:
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis (Cluster Mode)
- DocumentDB (MongoDB 호환)

Storage:
- S3 (사용자 업로드 이미지)
- CloudFront (CDN)

Networking:
- VPC (가상 네트워크)
- ALB (Application Load Balancer)
- Route 53 (DNS)

Monitoring:
- CloudWatch (로그, 메트릭)
- X-Ray (분산 추적)
```

**비용 예상** (월간, Phase 1 기준):
```
EC2: $200
RDS: $150
ElastiCache: $80
S3 + CloudFront: $50
기타: $70
──────────────
총: $550/월 (약 70만원)
```

---

#### CI/CD 파이프라인
```
GitHub Actions:

1. 코드 푸시 (main 브랜치)
   ↓
2. 자동 테스트 실행
   - Unit Test (Jest, Pytest)
   - Integration Test
   - E2E Test (Detox)
   ↓
3. 빌드
   - Docker 이미지 생성
   - ECR에 푸시
   ↓
4. 배포
   - ECS 롤링 업데이트
   - 헬스 체크
   ↓
5. 알림
   - Slack 알림 (성공/실패)
```

---

#### 모니터링 및 알림
```
모니터링 도구:
- Datadog (APM, 인프라 모니터링)
- Sentry (에러 추적)
- Google Analytics (사용자 분석)
- Mixpanel (이벤트 추적)

알림 조건:
🔴 긴급 (즉시 전화):
   - 서버 다운 (5분 이상)
   - DB 장애
   - 에러율 10% 이상

🟡 경고 (Slack 알림):
   - API 응답 시간 > 2초
   - 에러율 5% 이상
   - 디스크 사용량 80% 이상

🟢 정보 (로그만):
   - 배포 완료
   - 일일 리포트
```

---

## 3. 보안 (Security)

### 3.1 인증 및 인가
```
1. 비밀번호
   - bcrypt (Salt Rounds: 12)
   - 최소 8자, 영문+숫자+특수문자

2. JWT
   - Access Token: 30분 (짧은 만료 시간)
   - Refresh Token: 30일 (Redis 저장)
   - HS256 알고리즘

3. OAuth 2.0
   - 카카오, 네이버, 구글
   - PKCE 플로우 (모바일 앱)

4. API Key (외부 API 호출)
   - AWS Secrets Manager 저장
   - 환경 변수로 주입
```

### 3.2 데이터 보호
```
1. 전송 중 암호화
   - HTTPS (TLS 1.3)
   - Certificate Pinning (앱)

2. 저장 시 암호화
   - PostgreSQL: Transparent Data Encryption
   - S3: Server-Side Encryption (AES-256)

3. 개인정보
   - 위치 정보: 암호화 저장
   - 결제 정보: 비저장 (PG사 토큰)
   - 마스킹: 로그에 민감 정보 제거
```

### 3.3 보안 점검
```
정기 점검:
- 분기별 취약점 스캔
- 연 1회 모의 해킹
- OWASP Top 10 대응

보안 헤더:
- Content-Security-Policy
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Strict-Transport-Security
```

---

## 4. 성능 최적화

### 4.1 백엔드 최적화
```
1. Database Query
   - N+1 문제 방지 (JOIN 사용)
   - 인덱스 최적화
   - Slow Query 로그 분석

2. Caching Strategy
   L1: Application Cache (메모리)
   L2: Redis Cache (분산)
   L3: CDN (정적 파일)

3. API Response
   - Gzip 압축
   - Pagination (50개/페이지)
   - Field Filtering (필요한 필드만)

4. Background Jobs
   - 이메일 발송 (Bull Queue)
   - 이미지 리사이징 (Lambda)
   - 통계 집계 (Cron Job)
```

### 4.2 프론트엔드 최적화
```
1. Bundle Size
   - Tree Shaking (미사용 코드 제거)
   - Code Splitting (라우트별)
   - 현재 크기: 2.5MB → 목표: 1.5MB

2. 이미지 최적화
   - WebP 포맷
   - Lazy Loading
   - Responsive Images (srcset)

3. 네트워크
   - HTTP/2 (다중 연결)
   - Prefetching (다음 페이지 미리 로드)
   - Service Worker (오프라인 지원, Phase 2)
```

### 4.3 AI 모델 최적화
```
1. 모델 경량화
   - Quantization (INT8)
   - Pruning (가지치기)
   - Knowledge Distillation

2. 추론 가속
   - TensorRT (GPU 최적화)
   - ONNX Runtime (크로스 플랫폼)
   - Batch Inference (여러 요청 묶음 처리)

3. 캐싱
   - 사용자별 추천 결과 5분 캐싱
   - 인기 장소 1시간 캐싱
```

---

## 5. 확장성 (Scalability)

### 5.1 수평 확장
```
Stateless Architecture:
- 서버는 상태를 저장하지 않음
- 세션은 Redis에 중앙 관리
- 어느 서버로 요청이 와도 동일한 응답

Auto Scaling:
- CPU > 70% → 인스턴스 추가
- CPU < 30% → 인스턴스 제거
- 최소: 3대, 최대: 20대
```

### 5.2 데이터베이스 확장
```
1. Read Replica
   - Master: 1대 (쓰기)
   - Slave: 2대 (읽기)
   - Read/Write 비율: 80/20

2. Sharding (Phase 3)
   - 사용자 ID 기반 샤딩
   - Shard 1: user_id % 3 == 0
   - Shard 2: user_id % 3 == 1
   - Shard 3: user_id % 3 == 2

3. Caching
   - 90% 이상 캐시 히트율 목표
   - LRU 정책 (Least Recently Used)
```

### 5.3 Microservices (Phase 4)
```
현재: Monolithic Architecture
향후: Microservices

서비스 분리 계획:
1. User Service (사용자 관리)
2. Trip Service (여행 계획)
3. Recommendation Service (추천)
4. Transportation Service (교통)
5. Payment Service (결제)

통신: gRPC (프로토콜 버퍼)
```

---

## 6. 개발 환경 및 도구

### 6.1 개발 도구
```
IDE:
- VSCode (프론트엔드, 백엔드)
- PyCharm (AI/ML)

버전 관리:
- Git + GitHub
- Git Flow 브랜치 전략
  - main (프로덕션)
  - develop (개발)
  - feature/* (기능 개발)
  - hotfix/* (긴급 수정)

프로젝트 관리:
- Jira (이슈 트래킹)
- Confluence (문서)
- Figma (디자인)
```

### 6.2 코드 품질
```
Linting:
- ESLint (JavaScript/TypeScript)
- Pylint (Python)
- Prettier (자동 포맷팅)

Testing:
- Jest (Unit Test)
- Pytest (Python)
- Detox (E2E Test)
- Coverage: 80% 이상 목표

Code Review:
- 모든 PR은 2명 이상 승인 필요
- GitHub PR Template 사용
- SonarQube (정적 분석)
```

---

## 7. 배포 전략

### 7.1 환경 분리
```
1. Development (개발)
   - 개발자 로컬 환경
   - 자유로운 실험

2. Staging (스테이징)
   - 프로덕션과 동일한 환경
   - QA 테스트
   - 실제 데이터 일부 복제

3. Production (운영)
   - 실제 사용자 서비스
   - Blue-Green Deployment
```

### 7.2 배포 절차
```
1. 개발 완료
   ↓
2. PR 생성 및 코드 리뷰
   ↓
3. develop 브랜치 머지
   ↓
4. Staging 환경 자동 배포
   ↓
5. QA 테스트 (2일)
   ↓
6. main 브랜치 머지
   ↓
7. Production 배포
   - 모니터링 강화
   - 롤백 준비
   ↓
8. 배포 후 검증 (1시간)
```

### 7.3 롤백 전략
```
조건:
- 에러율 5% 이상
- API 응답 시간 3초 이상
- 사용자 이탈률 급증

방법:
1. 자동 롤백 (CloudWatch Alarm)
2. 수동 롤백 (Slack 명령어)
3. 롤백 시간: 5분 이내
```

---

## 8. 비용 분석

### 8.1 초기 비용 (Phase 1, 3개월)
```
개발 인건비:
- Full-stack Developer x 2: $60,000
- AI Engineer x 1: $40,000
- Designer x 1: $20,000
────────────────────────────
소계: $120,000 (약 1억 6천만원)

인프라:
- AWS: $1,650 (3개월)
- 도메인: $50
- SSL 인증서: $0 (Let's Encrypt)
────────────────────────────
소계: $1,700 (약 230만원)

외부 API:
- Google Maps: $600 (3개월)
- OpenAI API: $300
- 기타 API: $200
────────────────────────────
소계: $1,100 (약 150만원)

총 초기 비용: $122,800 (약 1억 6천 380만원)
```

### 8.2 운영 비용 (월간, Phase 3 기준)
```
인프라:
- AWS EC2/RDS/Redis: $800
- Google Maps API: $500
- OpenAI API: $200
- CDN: $100
────────────────────────────
소계: $1,600 (약 210만원/월)

인건비:
- 개발팀 5명: $25,000
- 운영팀 2명: $8,000
────────────────────────────
소계: $33,000 (약 4,400만원/월)

마케팅:
- 광고 (Meta, Google): $10,000
- 인플루언서: $5,000
────────────────────────────
소계: $15,000 (약 2,000만원/월)

총 운영 비용: $49,600 (약 6,600만원/월)
```

---

## 9. 마일스톤

### Phase 1: MVP (Month 1~3)
```
Week 1-2: 프로젝트 셋업
- [x] 기획 문서 완성
- [ ] Git 저장소 생성
- [ ] AWS 인프라 구축
- [ ] CI/CD 파이프라인 구축

Week 3-6: 핵심 기능 개발
- [ ] 사용자 인증 (회원가입, 로그인)
- [ ] 여행 계획 생성 (기본 UI)
- [ ] 교통편 검색 (버스, 기차 API 연동)
- [ ] 지도 표시 (Google Maps)

Week 7-10: AI 기능 추가
- [ ] 추천 알고리즘 프로토타입
- [ ] 장소 데이터 크롤링 (1만 건)
- [ ] 기본 추천 기능

Week 11-12: 테스트 및 배포
- [ ] 알파 테스트 (내부 50명)
- [ ] 버그 수정
- [ ] Staging 환경 배포
```

### Phase 2: Beta (Month 4~6)
```
- [ ] AI 추천 엔진 고도화
- [ ] 실시간 교통 정보 연동
- [ ] 3D 지도 시각화
- [ ] 베타 테스터 모집 (1,000명)
- [ ] 피드백 수집 및 개선
```

### Phase 3: Launch (Month 7~9)
```
- [ ] 앱스토어 출시
- [ ] 마케팅 캠페인
- [ ] 결제 시스템 통합
- [ ] 고객 지원 시스템
```

---

## 10. 리스크 및 대응

| 기술 리스크 | 발생 확률 | 영향도 | 대응 방안 |
|-----------|---------|-------|----------|
| API 장애 (교통, 지도) | 높음 | 높음 | 다중 백업 API, 캐싱 |
| AI 모델 성능 부족 | 중간 | 높음 | A/B 테스트, 지속 학습 |
| 서버 과부하 | 중간 | 높음 | Auto Scaling, CDN |
| 보안 침해 | 낮음 | 매우 높음 | 정기 점검, WAF |
| 외부 API 비용 폭증 | 중간 | 중간 | 비용 알림, 대안 API |

---

## 11. 참고 자료

### 오픈소스 라이브러리
- React Native: https://reactnative.dev
- TensorFlow: https://tensorflow.org
- PostgreSQL: https://postgresql.org

### API 문서
- Google Maps Platform: https://developers.google.com/maps
- 공공데이터포털: https://data.go.kr
- 코레일 API: https://api.korail.com

### 아키텍처 참고
- Airbnb Tech Blog: https://medium.com/airbnb-engineering
- Uber Engineering: https://eng.uber.com
- 마이리얼트립 기술 블로그: https://medium.com/myrealtrip-product

---

**문서 승인**:
- [ ] CTO
- [ ] Lead Backend Engineer
- [ ] Lead AI Engineer
- [ ] DevOps Engineer

**버전 히스토리**:
- v1.0.0 (2025-11-06): 초안 작성
