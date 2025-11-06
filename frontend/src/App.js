import React, { useState } from 'react';
import './App.css';
import TripForm from './components/TripForm';
import LoadingScreen from './components/LoadingScreen';
import TripView from './components/TripView';

function App() {
  const [currentView, setCurrentView] = useState('home'); // home, loading, trip
  const [tripData, setTripData] = useState(null);

  const handleTripCreate = async (formData) => {
    setCurrentView('loading');

    try {
      const response = await fetch('http://localhost:3001/api/trips/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setTripData(data.trip);
        setTimeout(() => {
          setCurrentView('trip');
        }, 2000); // 로딩 애니메이션 2초 더 보여주기
      } else {
        alert('여행 생성 실패: ' + (data.error || '알 수 없는 오류'));
        setCurrentView('home');
      }
    } catch (error) {
      console.error('여행 생성 오류:', error);
      alert('서버 연결 실패. 백엔드 서버가 실행 중인지 확인해주세요.');
      setCurrentView('home');
    }
  };

  const handleBack = () => {
    setCurrentView('home');
    setTripData(null);
  };

  return (
    <div className="App">
      {/* 헤더 */}
      <header className="App-header">
        <div className="header-content">
          <h1 className="logo" onClick={handleBack}>🌍 TravelMate AI</h1>
          <p className="tagline">3분 만에 완성되는 나만의 완벽한 여행</p>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="App-main">
        {currentView === 'home' && (
          <TripForm onSubmit={handleTripCreate} />
        )}

        {currentView === 'loading' && (
          <LoadingScreen />
        )}

        {currentView === 'trip' && tripData && (
          <TripView trip={tripData} onBack={handleBack} />
        )}
      </main>

      {/* 푸터 */}
      <footer className="App-footer">
        <p>© 2025 TravelMate AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
