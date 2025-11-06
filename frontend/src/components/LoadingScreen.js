import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { icon: '🚆', text: '교통편 검색 중...' },
    { icon: '🏖️', text: '최적 경로 계산 중...' },
    { icon: '🍜', text: '취향 맞춤 장소 추천 중...' },
    { icon: '📅', text: '일정 최적화 중...' }
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        {/* 지구본 애니메이션 */}
        <div className="globe-animation">
          <span className="globe">🌍</span>
        </div>

        {/* 메시지 */}
        <h2 className="loading-title">✨ AI가 당신만의 여행을</h2>
        <h2 className="loading-title">설계하고 있어요</h2>

        {/* 프로그레스 바 */}
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="progress-text">{progress}%</p>

        {/* 단계별 표시 */}
        <div className="steps-container">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`step ${index <= currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            >
              <span className="step-icon">{step.icon}</span>
              <span className="step-text">{step.text}</span>
              {index < currentStep && <span className="check">✓</span>}
              {index === currentStep && <span className="spinner">⟳</span>}
            </div>
          ))}
        </div>

        {/* 팁 */}
        <div className="loading-tip">
          <p>💡 잠깐!</p>
          <p>부산은 11월에 일교차가 큽니다. 겉옷을 챙기세요!</p>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
