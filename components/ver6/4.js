import React from 'react';

const centerX = 39;
const centerY = 33;
const start = 50;
const end = 99;
const blurPx = 0;
const rimTilt = 30;
const feather = 15;
const innerBlur = 0;
const color0 = '#D9FFB8';
const color1 = '#B9FFF3';
const color2 = '#DCD6FF';
const tintAlpha = 0.85;
const boost = 1.9;

const gradient = `radial-gradient(circle at var(--center-x) var(--center-y),
  ${color0} 0%,
  ${color0} 18%,
  ${color1} 35%,
  ${color1} 52%,
  ${color2} 70%,
  #EEF4FF 88%,
  #FFFFFF 100%)`;

const Ver6_4 = () => {
  return (
    <div className="container">
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br />Coex Guide</h1>
        <p className="subtitle">천천히 숨쉬는 블롭</p>
      </div>
      <div className="ambient" aria-hidden>
        <div className="bg-grad"></div>
      </div>
      <div className="top-actions">
        <button className="top-btn" onClick={(e) => e.preventDefault()}>
          라이트 가이드 보기
        </button>
      </div>
      <button className="cta" onClick={(e) => e.preventDefault()}>
        시작하기
      </button>
      <div className="stage">
        <div
          className="blob top"
          style={{
            '--center-x': `${centerX}%`,
            '--center-y': `${centerY}%`,
            '--start': `${start}%`,
            '--end': `${end}%`,
            '--blur': `30px`,
            '--feather': `${feather}%`,
            '--inner-blur': `${innerBlur}px`,
            '--rim-tilt': `${rimTilt}deg`,
            '--bg': gradient,
            '--tint-alpha': tintAlpha,
            '--boost': boost,
          }}
        >
          <div className="ring-boost" />
          <div className="pulse-rim" aria-hidden />
        </div>
        <div
          className="blob bottom"
          style={{
            '--center-x': `${centerX}%`,
            '--center-y': `${centerY}%`,
            '--start': `${start}%`,
            '--end': `${end}%`,
            '--blur': `${blurPx}px`,
            '--feather': `${feather}%`,
            '--inner-blur': `${innerBlur}px`,
            '--rim-tilt': `${rimTilt}deg`,
            '--bg': gradient,
            '--tint-alpha': tintAlpha,
            '--boost': boost,
          }}
        >
          <div className="ring-boost" />
          <div className="pulse-rim" aria-hidden />
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% -18%, rgba(120, 190, 255, 0.36) 0%, rgba(38, 64, 108, 0.48) 28%, rgba(10, 16, 26, 0.92) 76%),
            linear-gradient(180deg, #050a12 0%, #000508 100%);
          --t2-size: 62svh;
          --meet-y: 38%;
          --s-top: 1.28;
          --s-bottom: 1.38;
          --gap: 6px;
          --blob-w: var(--t2-size);
          --r-top: calc(var(--blob-w) * var(--s-top) / 2);
          --r-bottom: calc(var(--blob-w) * var(--s-bottom) / 2);
          --offset: calc((var(--r-top) + var(--r-bottom) + var(--gap)) / 2);
        }
        .hero {
          position: absolute;
          bottom: 150px;
          left: 16px;
          right: 16px;
          color: #f1f6ff;
          z-index: 22;
          mix-blend-mode: screen;
          opacity: 0.92;
          pointer-events: none;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          text-shadow: 0 6px 22px rgba(6, 12, 28, 0.58), 0 0 18px rgba(92, 162, 255, 0.32);
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.12em; margin-bottom: 10px; opacity: 0.78; text-transform: uppercase; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 14px 0; letter-spacing: -0.01em; }
        .subtitle { font-size: 16px; line-height: 1.5; font-weight: 600; margin: 0; opacity: 0.7; }
        .ambient { position:absolute; inset:0; z-index:0; pointer-events:none; }
        .bg-grad {
          position:absolute; inset:0; opacity:0.72;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.72) 0%,
            rgba(12, 18, 42, 0.68) 42%,
            rgba(46, 68, 118, 0.35) 100%
          );
          transform-origin: bottom center;
          transform: translateY(20%) scaleY(0.72);
          will-change: transform, opacity;
        }
        .cta {
          position: absolute;
          left: 50%;
          bottom: clamp(36px, 7.6vw, 52px);
          transform: translateX(-50%);
          width: clamp(240px, 92vw, 360px);
          height: clamp(48px, 10.8vw, 64px);
          border-radius: 999px;
          border: 1px solid rgba(138, 192, 255, 0.32);
          background:
            linear-gradient(205deg, rgba(30, 44, 78, 0.82) 0%, rgba(14, 24, 46, 0.62) 45%, rgba(2, 8, 18, 0.78) 100%),
            rgba(3, 8, 18, 0.72);
          box-shadow:
            0 26px 48px rgba(3, 6, 16, 0.65),
            inset 0 1px 0 rgba(160, 220, 255, 0.32),
            inset 0 -6px 18px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(22px) saturate(1.35) contrast(1.25);
          color: rgba(217, 235, 255, 0.92);
          font-size: clamp(14px, 4.2vw, 17px);
          font-weight: 800;
          padding: 0 clamp(26px, 7.8vw, 48px);
          cursor: pointer;
          z-index: 28;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          letter-spacing: 0.02em;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .cta:focus { outline: none; }
        .cta::before {
          content: '';
          position: absolute;
          inset: 6% 18% 42% 18%;
          border-radius: 999px;
          background: rgba(126, 198, 255, 0.28);
          filter: blur(18px);
          opacity: 0.7;
          pointer-events: none;
        }
        .cta::after {
          content: '';
          position: absolute;
          inset: -18%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 32% 16%, rgba(146, 210, 255, 0.58), transparent 68%),
            radial-gradient(circle at 78% 88%, rgba(24, 52, 98, 0.56), transparent 70%);
          opacity: 0.22;
          filter: blur(42px) saturate(1.4);
          pointer-events: none;
        }
        .cta:hover {
          transform: translateX(-50%) translateY(-2px);
          box-shadow:
            0 30px 60px rgba(6, 12, 22, 0.72),
            inset 0 1px 0 rgba(196, 238, 255, 0.42),
            inset 0 -6px 18px rgba(0, 0, 0, 0.55);
          background:
            linear-gradient(205deg, rgba(34, 56, 98, 0.92) 0%, rgba(18, 28, 52, 0.72) 45%, rgba(6, 12, 24, 0.86) 100%),
            rgba(6, 12, 20, 0.78);
        }
        .top-actions {
          position: absolute;
          top: clamp(24px, 6.5vw, 48px);
          right: clamp(22px, 7vw, 52px);
          z-index: 32;
          pointer-events: auto;
        }
        .top-btn {
          border-radius: 999px;
          border: 1px solid rgba(142, 198, 255, 0.34);
          padding: clamp(6px, 2.2vw, 11px) clamp(20px, 5.6vw, 28px);
          font-size: clamp(12px, 3.2vw, 14px);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(214, 232, 255, 0.9);
          background:
            linear-gradient(190deg, rgba(46, 66, 112, 0.76) 0%, rgba(18, 28, 52, 0.68) 45%, rgba(8, 14, 26, 0.86) 100%),
            rgba(6, 10, 20, 0.78);
          box-shadow:
            0 20px 38px rgba(4, 8, 18, 0.62),
            inset 0 1px 0 rgba(168, 224, 255, 0.32),
            inset 0 -6px 16px rgba(0, 0, 0, 0.46);
          backdrop-filter: blur(20px) saturate(1.32) contrast(1.18);
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .top-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 24px 48px rgba(6, 10, 22, 0.72),
            inset 0 1px 0 rgba(198, 242, 255, 0.42),
            inset 0 -6px 16px rgba(0, 0, 0, 0.54);
          background:
            linear-gradient(190deg, rgba(56, 80, 130, 0.84) 0%, rgba(22, 32, 58, 0.74) 45%, rgba(10, 16, 30, 0.88) 100%),
            rgba(8, 12, 24, 0.84);
        }
        .stage {
          height: 100%;
          display: grid;
          place-items: center;
          position: relative;
          background: transparent;
        }
        .blob {
          position: absolute;
          left: 50%;
          width: var(--t2-size);
          height: var(--t2-size);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: none;
          isolation: isolate;
          --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
          --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
          --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
          animation: ringPulseSlow 7.2s ease-in-out infinite;
        }
        .blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); --blur: 30px; z-index: 1; }
        .blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)) rotate(30deg); z-index: 1; }
        .ring-boost {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--end) - (var(--feather) * 0.7)),
              rgba(235, 201, 255, calc(var(--tint-alpha) * 0.9)) calc(var(--end) + (var(--feather) * 0.3)));
          background-blend-mode: normal, screen;
          filter: none;
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
        }
        .blob::before,
        .blob::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--bg);
        }
        .blob::before {
          filter: none;
          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );
                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );
        }
        .blob::after {
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)),
              rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));
          background-blend-mode: normal, screen;
          filter: none;
          opacity: 1;
          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );
                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );
        }
        .pulse-rim {
          position: absolute;
          inset: -4%;
          border-radius: 50%;
          pointer-events: none;
          opacity: 0;
          transform: translateZ(0) scale(0.92);
          background:
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(255,255,255,0.48) 0%,
              rgba(255,255,255,0.26) 12%,
              rgba(255,255,255,0.12) 20%,
              rgba(255,255,255,0.0) 30%),
            repeating-radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(255,255,255,0.32) 0% 4%,
              rgba(255,255,255,0.0) 4% 10%);
          mix-blend-mode: screen;
          filter: blur(2px);
          box-shadow:
            0 0 10px rgba(255,255,255,0.28),
            inset 0 0 6px rgba(255,255,255,0.22);
          animation: rimPulse 3200ms ease-out 2400ms infinite;
          background-size: 102% 102%, 108% 108%;
        }
        .pulse-rim::before {
          content: '';
          position: absolute;
          inset: -8%;
          border-radius: inherit;
          background: conic-gradient(from 0deg,
            rgba(255,255,255,0.0) 0deg,
            rgba(255,255,255,0.16) 90deg,
            rgba(255,255,255,0.34) 150deg,
            rgba(255,255,255,0.0) 270deg);
          filter: blur(12px);
          opacity: 0.28;
          animation: rimSheen 6200ms linear infinite;
          mix-blend-mode: screen;
        }
        .pulse-rim::after {
          content: '';
          position: absolute;
          inset: 6%;
          border-radius: inherit;
          border: 1px solid rgba(255,255,255,0.46);
          opacity: 0.65;
          filter: blur(1px);
        }
        @keyframes ringPulseSlow {
          0%, 100% {
            --start-wobble: calc(0% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 0%;
            --blur-wobble: calc(0px - var(--blur));
          }
          50% {
            --start-wobble: calc(90% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 4%;
            --blur-wobble: calc(80px - var(--blur));
          }
        }
        @keyframes rimPulse {
          0% {
            opacity: 0.32;
            transform: translateZ(0) scale(0.92);
            filter: blur(2px);
            background-position: 50% 50%, 50% 50%;
          }
          32% {
            opacity: 0.52;
            transform: translateZ(0) scale(1.08);
            filter: blur(3px);
            background-position: 48% 52%, 52% 48%;
          }
          64% {
            opacity: 0.28;
            transform: translateZ(0) scale(1.22);
            filter: blur(4px);
            background-position: 51% 47%, 49% 53%;
          }
          84% {
            opacity: 0.12;
            transform: translateZ(0) scale(1.34);
            filter: blur(5px);
            background-position: 50% 50%, 50% 50%;
          }
          100% {
            opacity: 0;
            transform: translateZ(0) scale(1.42);
            filter: blur(6px);
            background-position: 50% 50%, 50% 50%;
          }
        }
        @keyframes rimSheen {
          to {
            transform: rotate(360deg);
          }
        }
        @media (max-width: 768px) {
          .container { --t2-size: 62svh; --gap: 5px; }
        }
        @media (max-width: 480px) {
          .container { --t2-size: 62svh; --gap: 4px; }
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
        }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default Ver6_4;
