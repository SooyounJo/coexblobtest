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

const Ver6_1 = () => {
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
          background: white;
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
          color: #111;
          z-index: 10;
          mix-blend-mode: normal;
          opacity: 1;
          pointer-events: none;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }
        .ambient { position:absolute; inset:0; z-index:0; pointer-events:none; }
        .bg-grad {
          position:absolute; inset:0; opacity:0;
          background: linear-gradient(
            to top,
            rgba(235, 201, 255, 0.22) 0%,
            rgba(244, 250, 248, 0.52) 55%,
            rgba(230, 255, 241, 0.70) 100%
          );
          transform-origin: bottom center;
          transform: translateY(25%) scaleY(0.65);
          will-change: transform, opacity;
        }
        .cta {
          position: absolute;
          left: 50%;
          bottom: 48px;
          transform: translateX(-50%);
          width: clamp(240px, 92vw, 360px);
          height: clamp(44px, 9.6vw, 56px);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.45);
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.75) 0%,
            rgba(255,255,255,0.42) 45%,
            rgba(255,255,255,0.18) 100%
          );
          box-shadow:
            0 18px 36px rgba(36, 82, 94, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.88);
          backdrop-filter: blur(22px) saturate(1.55);
          color: #102421;
          font-size: clamp(14px, 4.2vw, 17px);
          font-weight: 800;
          padding: 0 clamp(12px, 4vw, 18px);
          cursor: default;
          z-index: 11;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          box-sizing: border-box;
        }
        .cta:focus { outline: none; }
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

export default Ver6_1;

