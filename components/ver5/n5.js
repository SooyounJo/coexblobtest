import React, { useState, useEffect } from 'react';

const N5 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 1600);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverscrollY = document.documentElement.style.overscrollBehaviorY;
    const prevBodyOverscrollY = document.body.style.overscrollBehaviorY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehaviorY = 'none';
    document.body.style.overscrollBehaviorY = 'none';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overscrollBehaviorY = prevHtmlOverscrollY;
      document.body.style.overscrollBehaviorY = prevBodyOverscrollY;
    };
  }, []);

  return (
    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''}`}>
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">중앙에서 퍼져나가는 블롭</p>
      </div>

      <button className="cta" onClick={(e) => { e.stopPropagation(); setMoved(true); }}>
        시작하기
      </button>

      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>

      <div className="center-stage" aria-hidden>
        <div className="center-blob">
          <div className="center-core" />
          <div className="center-bands" />
          <div className="center-gloss" />
          <div className="center-haze" />
        </div>
        <div className="center-wave w1" />
        <div className="center-wave w2" />
        <div className="center-wave w3" />
        <div className="center-wave w4" />
        <div className="center-wave w5" />
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #ffffff;
          position: relative;
          overflow: hidden;
          --blob-size: clamp(320px, 54vh, 580px);
        }

        .hero {
          position: absolute;
          top: 120px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #111;
          z-index: 10;
          opacity: 1;
          transition: opacity 700ms ease, transform 700ms ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: clamp(48px, 9vw, 64px); font-weight: 900; line-height: 1.04; margin: 0 0 12px; }
        .subtitle { font-size: clamp(16px, 3.4vw, 20px); font-weight: 600; margin: 0; opacity: 0.9; }
        .container.moved .hero { opacity: 0; transform: translate(-50%, -12px); }

        .cta {
          position: absolute;
          left: 50%;
          bottom: clamp(44px, 8vh, 72px);
          transform: translateX(-50%);
          width: clamp(240px, 40vw, 360px);
          height: clamp(48px, 8vw, 64px);
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 16px 32px rgba(39,106,115,0.16), inset 0 1px 0 rgba(255,255,255,0.7);
          color: #0f1f16;
          font-size: clamp(15px, 3.2vw, 18px);
          font-weight: 800;
          padding: 0 clamp(16px, 6vw, 24px);
          cursor: pointer;
          z-index: 10;
          transition: opacity 600ms ease, transform 600ms ease, filter 600ms ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .container.moved .cta { opacity: 0; transform: translate(-50%, 12px); pointer-events: none; filter: saturate(1.1); }

        .greet {
          position: absolute;
          top: clamp(24px, 11vh, 72px);
          left: 50%;
          transform: translate(-50%, -8px);
          text-align: center;
          color: #0d2118;
          z-index: 11;
          opacity: 0;
          transition: opacity 900ms ease, transform 900ms ease;
          text-shadow: 0 1px 4px rgba(255,255,255,0.28);
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .greet-line1 { font-size: clamp(22px, 4vw, 30px); font-weight: 800; margin-bottom: 8px; }
        .greet-line2 { font-size: clamp(18px, 3.4vw, 24px); font-weight: 600; opacity: 0.92; }
        .container.arrived .greet { opacity: 1; transform: translate(-50%, 0); transition-delay: 1600ms; }

        .center-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
        }

        .center-blob {
          position: relative;
          width: var(--blob-size);
          height: var(--blob-size);
          transform: scale(0.6);
          border-radius: 50%;
          display: grid;
          place-items: center;
          isolation: isolate;
          transition: transform 900ms cubic-bezier(0.2, 0.8, 0.1, 1);
        }
        .container.moved .center-blob { transform: scale(0.9); }
        .container.arrived .center-blob { animation: centerPop 1300ms cubic-bezier(0.18, 0.82, 0.12, 1) forwards; }

        .center-core {
          position: absolute;
          inset: 18%;
          border-radius: 50%;
          background: radial-gradient(circle at 54% 48%, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.48) 26%, rgba(255,255,255,0.12) 68%, rgba(255,255,255,0) 88%);
          opacity: 0.9;
          filter: blur(24px);
          mix-blend-mode: screen;
        }

        .center-bands {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(circle at 50% 50%,
              rgba(217,255,184,0.92) 0%, rgba(217,255,184,0.92) 20%,
              rgba(159,248,214,0.85) 20%, rgba(159,248,214,0.82) 34%,
              rgba(122,228,255,0.78) 34%, rgba(122,228,255,0.72) 48%,
              rgba(111,139,255,0.68) 48%, rgba(111,139,255,0.60) 62%,
              rgba(90,79,255,0.55) 62%, rgba(90,79,255,0.48) 76%,
              rgba(255,255,255,0.36) 76%, rgba(255,255,255,0.0) 100%);
          clip-path: circle(50%);
          filter: blur(12px);
        }

        .center-gloss {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(126deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.0) 64%);
          mix-blend-mode: screen;
          opacity: 0.48;
          filter: blur(16px);
        }

        .center-haze {
          position: absolute;
          inset: 14%;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 40%, rgba(255,255,255,0.05) 70%);
          filter: blur(38px);
          opacity: 0.7;
          mix-blend-mode: screen;
        }

        .center-wave {
          position: absolute;
          width: calc(var(--blob-size) * 0.94);
          height: calc(var(--blob-size) * 0.94);
          border-radius: 50%;
          transform: scale(0.62);
          border: 3px solid rgba(255,255,255,0.85);
          box-shadow:
            0 0 38px rgba(255,255,255,0.45),
            inset 0 0 22px rgba(255,255,255,0.32);
          opacity: 0;
          filter: blur(6px);
        }

        .container.arrived .center-wave.w1 { animation: centerWave 2400ms ease-out 1400ms infinite; }
        .container.arrived .center-wave.w2 { animation: centerWave 2400ms ease-out 1800ms infinite; }
        .container.arrived .center-wave.w3 { animation: centerWave 2400ms ease-out 2200ms infinite; }
        .container.arrived .center-wave.w4 { animation: centerWave 2400ms ease-out 2600ms infinite; }
        .container.arrived .center-wave.w5 { animation: centerWave 2400ms ease-out 3000ms infinite; }

        @keyframes centerPop {
          0% { transform: scale(0.88); }
          56% { transform: scale(1.22); }
          100% { transform: scale(1.08); }
        }

        @keyframes centerWave {
          0% {
            opacity: 0.55;
            transform: scale(0.64);
            filter: blur(10px);
            border-width: 5px;
          }
          35% {
            opacity: 0.65;
            transform: scale(1.06);
            filter: blur(14px);
            border-width: 4px;
          }
          60% {
            opacity: 0.38;
            transform: scale(1.42);
            filter: blur(18px);
            border-width: 3px;
          }
          100% {
            opacity: 0;
            transform: scale(1.82);
            filter: blur(26px);
            border-width: 1px;
          }
        }

        @media (max-width: 768px) {
          .hero { top: 96px; }
          .container { --blob-size: clamp(280px, 58vw, 480px); }
        }
        @media (max-width: 520px) {
          .hero { top: 82px; }
          .container { --blob-size: clamp(240px, 66vw, 420px); }
        }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default N5;


