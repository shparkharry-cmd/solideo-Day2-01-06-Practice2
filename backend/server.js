const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// SQLite 데이터베이스 연결
const db = new sqlite3.Database('./travelmate.db', (err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err.message);
  } else {
    console.log('✅ SQLite 데이터베이스 연결 성공');
    initDatabase();
  }
});

// 데이터베이스 초기화
function initDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      start_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      duration TEXT NOT NULL,
      budget INTEGER,
      style TEXT,
      itinerary TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS places (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT,
      latitude REAL,
      longitude REAL,
      rating REAL,
      description TEXT
    )
  `, () => {
    // 샘플 장소 데이터 삽입
    insertSamplePlaces();
  });
}

// 샘플 장소 데이터
function insertSamplePlaces() {
  const places = [
    // 부산
    { id: uuidv4(), name: '해운대 해수욕장', category: 'beach', lat: 35.1586, lng: 129.1603, rating: 4.7, desc: '아름다운 백사장과 푸른 바다' },
    { id: uuidv4(), name: '광안리 해수욕장', category: 'beach', lat: 35.1532, lng: 129.1186, rating: 4.6, desc: '광안대교가 보이는 해변' },
    { id: uuidv4(), name: '해운대 암소갈비집', category: 'restaurant', lat: 35.1620, lng: 129.1630, rating: 4.8, desc: '부산 맛집, 신선한 고기' },
    { id: uuidv4(), name: '송정 해수욕장 카페거리', category: 'cafe', lat: 35.1785, lng: 129.1995, rating: 4.5, desc: '감성 카페 가득한 해변' },
    { id: uuidv4(), name: '감천문화마을', category: 'attraction', lat: 35.0976, lng: 129.0103, rating: 4.4, desc: '알록달록 벽화 마을' },
    { id: uuidv4(), name: '자갈치 시장', category: 'market', lat: 35.0965, lng: 129.0306, rating: 4.3, desc: '신선한 해산물 시장' },

    // 제주
    { id: uuidv4(), name: '성산일출봉', category: 'attraction', lat: 33.4584, lng: 126.9426, rating: 4.9, desc: 'UNESCO 세계자연유산' },
    { id: uuidv4(), name: '우도', category: 'island', lat: 33.5000, lng: 126.9500, rating: 4.8, desc: '섬 속의 섬, 아름다운 풍경' },
    { id: uuidv4(), name: '제주 흑돼지 맛집', category: 'restaurant', lat: 33.4996, lng: 126.5312, rating: 4.7, desc: '제주 특산 흑돼지' },
    { id: uuidv4(), name: '협재 해수욕장', category: 'beach', lat: 33.3941, lng: 126.2397, rating: 4.6, desc: '에메랄드빛 바다' },
  ];

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO places (id, name, category, latitude, longitude, rating, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  places.forEach(p => {
    stmt.run(p.id, p.name, p.category, p.lat, p.lng, p.rating, p.desc);
  });

  stmt.finalize();
  console.log('✅ 샘플 장소 데이터 삽입 완료');
}

// ============ API 엔드포인트 ============

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TravelMate AI API Server is running' });
});

// 여행 계획 생성
app.post('/api/trips/create', async (req, res) => {
  const { origin, destination, startDate, startTime, duration, budget, style, userId } = req.body;

  // 유효성 검사
  if (!origin || !destination || !startDate || !startTime || !duration) {
    return res.status(400).json({ error: '필수 정보가 누락되었습니다' });
  }

  const tripId = uuidv4();

  try {
    // Mock AI로 일정 생성 (실제로는 AI 모델 호출)
    const itinerary = await generateItinerary({
      origin,
      destination,
      startDate,
      startTime,
      duration,
      budget,
      style
    });

    // 데이터베이스에 저장
    db.run(
      `INSERT INTO trips (id, user_id, origin, destination, start_date, start_time, duration, budget, style, itinerary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [tripId, userId || 'guest', origin, destination, startDate, startTime, duration, budget, style, JSON.stringify(itinerary)],
      function(err) {
        if (err) {
          console.error('여행 저장 오류:', err);
          return res.status(500).json({ error: '여행 저장 실패' });
        }

        res.json({
          success: true,
          tripId,
          trip: {
            id: tripId,
            origin,
            destination,
            startDate,
            startTime,
            duration,
            budget,
            style,
            itinerary
          }
        });
      }
    );
  } catch (error) {
    console.error('여행 생성 오류:', error);
    res.status(500).json({ error: '여행 생성 실패' });
  }
});

// 여행 조회
app.get('/api/trips/:tripId', (req, res) => {
  const { tripId } = req.params;

  db.get('SELECT * FROM trips WHERE id = ?', [tripId], (err, row) => {
    if (err) {
      return res.status(500).json({ error: '여행 조회 실패' });
    }
    if (!row) {
      return res.status(404).json({ error: '여행을 찾을 수 없습니다' });
    }

    row.itinerary = JSON.parse(row.itinerary);
    res.json({ trip: row });
  });
});

// 장소 검색
app.get('/api/places/search', (req, res) => {
  const { destination, category } = req.query;

  let query = 'SELECT * FROM places WHERE 1=1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: '장소 검색 실패' });
    }
    res.json({ places: rows });
  });
});

// ============ Mock AI 일정 생성 함수 ============
async function generateItinerary({ origin, destination, startDate, startTime, duration, budget, style }) {
  // 실제로는 AI 모델이 여기서 작동
  // 현재는 Mock 데이터 생성

  return new Promise((resolve) => {
    setTimeout(() => {
      // 목적지에 따라 다른 일정 생성
      const isJeju = destination.includes('제주');
      const isBusan = destination.includes('부산');

      let itinerary = {
        transportation: generateTransportation(origin, destination, startTime),
        timeline: generateTimeline(destination, startTime, duration, style, isJeju, isBusan),
        summary: {
          totalCost: budget || 150000,
          totalTime: duration === '당일' ? '12시간' : '2박3일',
          visitCount: 6
        }
      };

      resolve(itinerary);
    }, 2000); // 2초 대기 (AI 생성 시뮬레이션)
  });
}

function generateTransportation(origin, destination, startTime) {
  const isBusan = destination.includes('부산');

  if (isBusan) {
    return [
      {
        type: 'train',
        name: 'KTX 123',
        from: origin,
        to: destination + '역',
        departureTime: startTime,
        arrivalTime: calculateArrivalTime(startTime, 150), // 2시간 30분 후
        duration: '2시간 30분',
        price: 59800
      }
    ];
  }

  // 제주 등 기타
  return [
    {
      type: 'flight',
      name: '대한항공 KE123',
      from: origin,
      to: destination + ' 국제공항',
      departureTime: startTime,
      arrivalTime: calculateArrivalTime(startTime, 60),
      duration: '1시간',
      price: 89000
    }
  ];
}

function generateTimeline(destination, startTime, duration, style, isJeju, isBusan) {
  const timeline = [];
  let currentTime = startTime;

  if (isBusan) {
    // 부산 일정
    timeline.push({
      time: currentTime,
      type: 'departure',
      title: '출발',
      location: '서울역',
      description: 'KTX 탑승'
    });

    currentTime = calculateArrivalTime(currentTime, 150);
    timeline.push({
      time: currentTime,
      type: 'arrival',
      title: '부산역 도착',
      location: '부산역',
      description: '도보 5분'
    });

    currentTime = calculateArrivalTime(currentTime, 30);
    timeline.push({
      time: currentTime,
      type: 'attraction',
      title: '해운대 해수욕장',
      location: '부산 해운대구',
      latitude: 35.1586,
      longitude: 129.1603,
      description: '아름다운 백사장에서 산책',
      duration: '1시간 30분',
      rating: 4.7
    });

    currentTime = calculateArrivalTime(currentTime, 120);
    timeline.push({
      time: currentTime,
      type: 'restaurant',
      title: '해운대 암소갈비집',
      location: '부산 해운대구',
      latitude: 35.1620,
      longitude: 129.1630,
      description: '점심 식사 - 신선한 고기',
      duration: '1시간',
      rating: 4.8,
      priceRange: '20,000~30,000원'
    });

    currentTime = calculateArrivalTime(currentTime, 90);
    timeline.push({
      time: currentTime,
      type: 'cafe',
      title: '송정 해수욕장 카페거리',
      location: '부산 해운대구 송정동',
      latitude: 35.1785,
      longitude: 129.1995,
      description: '감성 카페에서 여유로운 시간',
      duration: '1시간',
      rating: 4.5
    });

    currentTime = calculateArrivalTime(currentTime, 90);
    timeline.push({
      time: currentTime,
      type: 'attraction',
      title: '광안리 해수욕장',
      location: '부산 수영구',
      latitude: 35.1532,
      longitude: 129.1186,
      description: '광안대교 야경 감상',
      duration: '1시간',
      rating: 4.6
    });

    currentTime = calculateArrivalTime(currentTime, 90);
    timeline.push({
      time: currentTime,
      type: 'departure',
      title: '부산역 출발',
      location: '부산역',
      description: 'KTX 탑승 (귀가)'
    });
  } else if (isJeju) {
    // 제주 일정
    timeline.push({
      time: currentTime,
      type: 'departure',
      title: '출발',
      location: '김포공항',
      description: '비행기 탑승'
    });

    currentTime = calculateArrivalTime(currentTime, 60);
    timeline.push({
      time: currentTime,
      type: 'arrival',
      title: '제주 국제공항 도착',
      location: '제주공항',
      description: '렌터카 픽업'
    });

    currentTime = calculateArrivalTime(currentTime, 60);
    timeline.push({
      time: currentTime,
      type: 'attraction',
      title: '성산일출봉',
      location: '제주 서귀포시',
      latitude: 33.4584,
      longitude: 126.9426,
      description: 'UNESCO 세계자연유산',
      duration: '2시간',
      rating: 4.9
    });

    currentTime = calculateArrivalTime(currentTime, 150);
    timeline.push({
      time: currentTime,
      type: 'restaurant',
      title: '제주 흑돼지 맛집',
      location: '제주시',
      latitude: 33.4996,
      longitude: 126.5312,
      description: '제주 특산 흑돼지',
      duration: '1시간 30분',
      rating: 4.7,
      priceRange: '15,000~25,000원'
    });
  }

  return timeline;
}

function calculateArrivalTime(startTime, minutesToAdd) {
  // "09:00" 형식의 시간 문자열을 분 단위로 계산
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
}

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 TravelMate AI 백엔드 서버 시작!`);
  console.log(`📡 포트: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
});

// 종료 시 데이터베이스 연결 닫기
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('데이터베이스 연결 종료');
    process.exit(0);
  });
});
