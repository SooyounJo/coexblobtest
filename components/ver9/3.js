import React, { useEffect, useRef, useState } from 'react';
import BlobBackground9_3 from './BlobBackground9_3';

export default function Ver9_1() {
  const [phase] = useState('completed');
  const [centered, setCentered] = useState(false);
  const [waving, setWaving] = useState(false);
  const [waveLevel, setWaveLevel] = useState(0); // 0..0.7
  const waveLevelRef = useRef(0);
  useEffect(() => { waveLevelRef.current = waveLevel; }, [waveLevel]);
  const tweenRef = useRef(null);
  const tweenWave = (to, duration = 400, easingType = 'easeInOut') => {
    if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    const from = waveLevelRef.current;
    const start = performance.now();
    
    // 다양한 easing 함수들
    const easings = {
      easeInOut: (t) => 0.5 - 0.5 * Math.cos(Math.PI * t), // 기본 - 가장 부드러운
      easeIn: (t) => t * t, // 천천히 시작
      easeOut: (t) => 1 - (1 - t) * (1 - t), // 천천히 끝
      easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // 부드러운 가속/감속
      easeOutCubic: (t) => 1 - Math.pow(1 - t, 3), // 부드러운 감속
      easeInOutQuart: (t) => t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2, // 더 부드러운
      easeOutQuart: (t) => 1 - Math.pow(1 - t, 4), // 매우 부드러운 감속
      easeOutQuint: (t) => 1 - Math.pow(1 - t, 5), // 더욱 부드러운 감속
      easeInOutExpo: (t) => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2, // 지수적 감쇠
      easeOutExpo: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t), // 지수적 감쇠 (종료)
      easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2, // 사인파 - 매우 부드러운
    };
    
    const ease = easings[easingType] || easings.easeInOut;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      setWaveLevel(from + (to - from) * ease(t));
      if (t < 1) tweenRef.current = requestAnimationFrame(step);
    };
    tweenRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    // 부드러운 active wave: 천천히 시작 → 빠르게 상승 → 천천히 감소
    const t0 = setTimeout(() => {
      setWaving(true);
      // 1단계: 천천히 시작 (0 → 0.25)
      tweenWave(0.25, 400, 'easeIn');
    }, 1000);
    
    const t1 = setTimeout(() => {
      // 2단계: 빠르게 상승 (0.25 → 0.85) - 더 격렬한 웨이브
      tweenWave(0.85, 280, 'easeOut');
    }, 1000 + 400);
    
    const t1_5 = setTimeout(() => {
      // 2.5단계: 최고점에서 잠시 유지 (0.85 유지)
      // 유지만 하므로 tweenWave 호출 안 함
    }, 1000 + 400 + 280);
    
    const t2 = setTimeout(() => {
      // 3단계: 처음 빠르게 감소 (0.85 → 0.55) - 빠르게 시작
      tweenWave(0.55, 600, 'easeOutCubic');
    }, 1000 + 400 + 280 + 500);
    
    const t3 = setTimeout(() => {
      // 4단계: 중간 속도로 감소 (0.55 → 0.32) - 점진적 감속
      tweenWave(0.32, 850, 'easeOutQuart');
    }, 1000 + 400 + 280 + 500 + 600);
    
    const t4 = setTimeout(() => {
      // 5단계: 천천히 감소 (0.32 → 0.15) - 더 부드럽게
      tweenWave(0.15, 1200, 'easeOutQuart');
    }, 1000 + 400 + 280 + 500 + 600 + 850);
    
    const t4_5 = setTimeout(() => {
      // 5.5단계: 더 천천히 감소 (0.15 → 0.08)
      tweenWave(0.08, 1400, 'easeOutQuint');
    }, 1000 + 400 + 280 + 500 + 600 + 850 + 1200);
    
    const t5 = setTimeout(() => {
      // 6단계: 매우 천천히 감소 (0.08 → 0.03)
      tweenWave(0.03, 1800, 'easeOutQuint');
    }, 1000 + 400 + 280 + 500 + 600 + 850 + 1200 + 1400);
    
    const t6 = setTimeout(() => {
      // 7단계: 완전히 멈춤 (0.03 → 0.0) - 가장 부드럽게
      tweenWave(0.0, 2400, 'easeInOutSine');
    }, 1000 + 400 + 280 + 500 + 600 + 850 + 1200 + 1400 + 1800);
    
    const t7 = setTimeout(() => {
      // waveLevel이 거의 0이 될 때 setWaving(false) - variant 전환 후 호출
      setWaving(false);
    }, 1000 + 400 + 280 + 500 + 600 + 850 + 1200 + 1400 + 1800 + 2400 + 500);
    
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t1_5);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t4_5);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      if (tweenRef.current) cancelAnimationFrame(tweenRef.current);
    };
  }, []);

  return (
    <div className="container container--bright">
      <BlobBackground9_3 phase={phase} centered={centered} waving={waving} waveLevel={waveLevel} />
      <div className="status" role="status" aria-live="polite">생각 중이에요</div>
      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 30% 20%, #fffdfc 0%, #fff6fa 38%, #fdeff3 100%);
          transition: background 2s ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          /* Responsive tokens to match v9/3 background exactly */
          --glass-radius: clamp(28px, 8vw, 36px);
          --glass-side: clamp(16px, 5.2vw, 24px);
          --glass-inner: clamp(20px, 5vw, 28px);
          --ui-gray: #E6EBEF;
          --chip-offset: clamp(8px, 2vw, 14px);
          --chip-gap: 12px;
          --mb-h: clamp(44px, 7.2vh, 52px);
          --mb-bottom: clamp(36px, 6vh, 56px);
          --safe-l: env(safe-area-inset-left, 0px);
          --safe-r: env(safe-area-inset-right, 0px);
          --side-left: calc(var(--glass-side) + var(--safe-l));
          --side-right: calc(var(--glass-side) + var(--safe-r));
          --modal-shrink: clamp(14px, 3.6vw, 28px);
          --frame-width: calc(100% - var(--side-left) - var(--side-right) - (var(--modal-shrink) * 2));
          --center-fix: calc((var(--safe-l) - var(--safe-r)) / 2);
          --header-gap: clamp(5px, 1.6vh, 12px);
          --suggest-shift: clamp(6px, 1.6vw, 14px);
          --blob-tint: rgba(118, 212, 255, 0.12);
          --modal-extra-inset: 0px;
        }
        .container--bright {
          background: radial-gradient(circle at 30% 20%, #fffeff 0%, #fff7fb 38%, #fbeff5 100%);
        }
        .status {
          position: absolute;
          top: 24vh;
          left: 0;
          right: 0;
          text-align: center;
          color: #0f3a41;
          font-weight: 700;
          font-size: 18px;
          text-shadow: 0 10px 30px rgba(0,0,0,0.06);
          z-index: 50;
        }
      `}</style>
    </div>
  );
}


