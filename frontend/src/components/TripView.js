import React, { useState } from 'react';
import './TripView.css';

function TripView({ trip, onBack }) {
  const [activeTab, setActiveTab] = useState('timeline'); // timeline, map, cost

  const { origin, destination, startDate, itinerary } = trip;
  const { transportation, timeline, summary } = itinerary;

  return (
    <div className="trip-view">
      {/* 헤더 */}
      <div className="trip-header">
        <button className="back-button" onClick={onBack}>
          ← 뒤로
        </button>
        <h2 className="trip-title">{destination} 여행</h2>
        <div className="trip-meta">
          <span>📅 {startDate}</span>
          <span className="separator">·</span>
          <span>⏱️ {summary.totalTime}</span>
          <span className="separator">·</span>
          <span>💰 {summary.totalCost.toLocaleString()}원</span>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          타임라인
        </button>
        <button
          className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          지도
        </button>
        <button
          className={`tab ${activeTab === 'cost' ? 'active' : ''}`}
          onClick={() => setActiveTab('cost')}
        >
          비용
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="trip-content">
        {/* 타임라인 뷰 */}
        {activeTab === 'timeline' && (
          <div className="timeline-view">
            <div className="summary-box">
              <h3>📊 여행 요약</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="label">총 소요 시간</span>
                  <span className="value">{summary.totalTime}</span>
                </div>
                <div className="summary-item">
                  <span className="label">총 비용</span>
                  <span className="value">{summary.totalCost.toLocaleString()}원</span>
                </div>
                <div className="summary-item">
                  <span className="label">방문 장소</span>
                  <span className="value">{summary.visitCount}곳</span>
                </div>
              </div>
            </div>

            {/* 교통편 */}
            {transportation && transportation.length > 0 && (
              <div className="section">
                <h3 className="section-title">🚆 교통편</h3>
                {transportation.map((t, index) => (
                  <div key={index} className="transport-card">
                    <div className="transport-header">
                      <span className="transport-type">{t.name}</span>
                      <span className="transport-price">{t.price.toLocaleString()}원</span>
                    </div>
                    <div className="transport-route">
                      <span>{t.from}</span>
                      <span className="arrow">→</span>
                      <span>{t.to}</span>
                    </div>
                    <div className="transport-time">
                      {t.departureTime} - {t.arrivalTime} ({t.duration})
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 타임라인 */}
            {timeline && timeline.length > 0 && (
              <div className="section">
                <h3 className="section-title">📅 일정</h3>
                <div className="timeline">
                  {timeline.map((item, index) => (
                    <div key={index} className={`timeline-item ${item.type}`}>
                      <div className="timeline-dot"></div>
                      <div className="timeline-connector"></div>
                      <div className="timeline-content">
                        <div className="timeline-time">{item.time}</div>
                        <div className="timeline-card">
                          <div className="timeline-header">
                            <h4>{item.title}</h4>
                            {item.rating && (
                              <span className="rating">⭐ {item.rating}</span>
                            )}
                          </div>
                          <p className="timeline-location">{item.location}</p>
                          <p className="timeline-description">{item.description}</p>
                          {item.duration && (
                            <p className="timeline-duration">⏱️ {item.duration}</p>
                          )}
                          {item.priceRange && (
                            <p className="timeline-price">💰 {item.priceRange}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 지도 뷰 */}
        {activeTab === 'map' && (
          <div className="map-view">
            <div className="map-placeholder">
              <span className="map-icon">🗺️</span>
              <p>Google Maps 통합</p>
              <p className="map-note">(API 키 필요 - 기획서 참고)</p>
              <div className="map-info">
                {timeline && timeline
                  .filter(t => t.latitude && t.longitude)
                  .map((t, i) => (
                    <div key={i} className="map-marker">
                      <span className="marker-icon">📍</span>
                      <span>{t.title}</span>
                      <span className="marker-coords">
                        ({t.latitude.toFixed(4)}, {t.longitude.toFixed(4)})
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* 비용 뷰 */}
        {activeTab === 'cost' && (
          <div className="cost-view">
            <div className="cost-summary">
              <h3>💰 예상 비용</h3>
              <div className="cost-total">{summary.totalCost.toLocaleString()}원</div>
            </div>

            <div className="cost-breakdown">
              <h4>상세 내역</h4>
              {transportation && transportation.map((t, i) => (
                <div key={i} className="cost-item">
                  <span className="cost-label">🚆 {t.name}</span>
                  <span className="cost-value">{t.price.toLocaleString()}원</span>
                </div>
              ))}
              {timeline && timeline
                .filter(t => t.priceRange)
                .map((t, i) => (
                  <div key={i} className="cost-item">
                    <span className="cost-label">
                      {t.type === 'restaurant' ? '🍽️' : '☕'} {t.title}
                    </span>
                    <span className="cost-value">{t.priceRange}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* 액션 버튼 */}
      <div className="trip-actions">
        <button className="action-button secondary">
          수정하기
        </button>
        <button className="action-button primary">
          여행 확정하기 ✓
        </button>
      </div>
    </div>
  );
}

export default TripView;
