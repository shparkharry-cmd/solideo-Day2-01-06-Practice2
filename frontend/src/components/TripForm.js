import React, { useState } from 'react';
import './TripForm.css';

function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    origin: '서울역',
    destination: '부산',
    startDate: '',
    startTime: '09:00',
    duration: '당일',
    budget: 150000,
    style: '힐링 여행'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!formData.origin || !formData.destination || !formData.startDate) {
      alert('필수 정보를 모두 입력해주세요');
      return;
    }

    onSubmit(formData);
  };

  // 오늘 날짜를 YYYY-MM-DD 형식으로
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="trip-form-container">
      <div className="form-header">
        <h2>✨ 여행 계획 만들기</h2>
        <p>AI가 당신만의 완벽한 여행을 설계합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="trip-form">
        {/* 출발지 */}
        <div className="form-group">
          <label htmlFor="origin">🚩 출발지</label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="예: 서울역"
            required
          />
        </div>

        {/* 도착지 */}
        <div className="form-group">
          <label htmlFor="destination">📍 도착지</label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          >
            <option value="부산">부산</option>
            <option value="제주">제주</option>
            <option value="강릉">강릉</option>
            <option value="전주">전주</option>
            <option value="여수">여수</option>
            <option value="경주">경주</option>
          </select>
        </div>

        {/* 날짜 및 시간 */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startDate">📅 출발 날짜</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startTime">⏰ 출발 시간</label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 여행 기간 */}
        <div className="form-group">
          <label htmlFor="duration">📆 여행 기간</label>
          <select
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
          >
            <option value="당일">당일</option>
            <option value="1박2일">1박2일</option>
            <option value="2박3일">2박3일</option>
            <option value="3박4일">3박4일</option>
          </select>
        </div>

        {/* 예산 */}
        <div className="form-group">
          <label htmlFor="budget">💰 예산 (선택)</label>
          <select
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
          >
            <option value={50000}>5만원 이하</option>
            <option value={100000}>10만원</option>
            <option value={150000}>15만원</option>
            <option value={200000}>20만원</option>
            <option value={999999}>제한 없음</option>
          </select>
        </div>

        {/* 여행 스타일 */}
        <div className="form-group">
          <label htmlFor="style">✨ 여행 스타일</label>
          <select
            id="style"
            name="style"
            value={formData.style}
            onChange={handleChange}
          >
            <option value="힐링 여행">🏖️ 힐링 여행 (여유롭게 쉬기)</option>
            <option value="맛집 투어">🍜 맛집 투어 (맛집 탐방)</option>
            <option value="관광 명소">📸 관광 명소 (유명한 곳 둘러보기)</option>
            <option value="액티비티">🏃 액티비티 (체험 활동)</option>
          </select>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className="submit-button">
          🪄 여행 계획 만들기
        </button>
      </form>

      {/* 안내 메시지 */}
      <div className="form-info">
        <p>💡 AI가 약 30초 내에 최적의 여행 일정을 생성합니다</p>
      </div>
    </div>
  );
}

export default TripForm;
