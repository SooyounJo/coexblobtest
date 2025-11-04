import React, { useState, useEffect } from 'react';

const In2 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 1600);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  // prevent page scroll while this view is mounted
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
      {/* 텍스트 오버레이 (ver2/2 그대로) */}
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>
      <button className="cta" onClick={(e) => { e.stopPropagation(); setMoved(true); }}>
        시작하기
      </button>

      {/* 전환 후 상단 중앙 안내 문구 */}
      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>

      {/* 비활성화된 입력 박스 (ver2/2 그대로) */}
      <div className="composer" aria-disabled onClick={(e)=>e.stopPropagation()}>
        <span className="plus">+</span>
        <input className="input" type="text" placeholder="메시지 보내기..." disabled />
        <span className="mic">🎤</span>
      </div>

      {/* 백그라운드 그라디언트 (도착 순간 아래에서 퍼짐) */}
      <div className="ambient" aria-hidden>
        <div className="bg-grad"></div>
      </div>

      {/* T2 스타일 블롭 2개 (위/아래) */}
      <div className="t2-stage" aria-hidden>
        <div className="t2-blob top">
          <div className="t2-flow f1" />
          <div className="t2-purple p1" />
          <div className="t2-purple p2" />
          <div className="t2-mint mg1" />
          <div className="t2-ripple r1" />
          <div className="t2-ripple r2" />
          <div className="t2-trail t1" />
          <div className="t2-trail t2" />
          <div className="t2-core" />
          <div className="t2-ring" />
        </div>
        <div className="t2-blob bottom">
          <div className="t2-flow f1" />
          <div className="t2-purple p1" />
          <div className="t2-purple p2" />
          <div className="t2-mint mg1" />
          <div className="t2-ripple r1" />
          <div className="t2-ripple r2" />
          <div className="t2-trail t1" />
          <div className="t2-trail t2" />
          <div className="t2-core" />
          <div className="t2-ring" />
        </div>
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
          --control-w: clamp(240px, 92vw, 360px);
          --control-h: clamp(44px, 9.6vw, 56px);
          /* T2 base size (wrapper size) */
          --t2-size: 62svh;
          --meet-y: 38%;
          /* non-overlap placement vars */
          --s-top: 1.38;
          --s-bottom: 1.28;
          --gap: 6px;
          --blob-w: var(--t2-size);
          --r-top: calc(var(--blob-w) * var(--s-top) / 2);
          --r-bottom: calc(var(--blob-w) * var(--s-bottom) / 2);
          --offset: calc((var(--r-top) + var(--r-bottom) + var(--gap)) / 2);
        }

        /* hero copy */
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
          transition: opacity 350ms ease, transform 350ms ease;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }
        .container.moved .hero { opacity: 0; transform: translateY(6px); }

        .cta {
          position: absolute;
          left: 50%;
          bottom: 48px;
          transform: translateX(-50%);
          width: var(--control-w);
          height: var(--control-h);
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7);
          color: #111;
          font-size: clamp(14px, 4.2vw, 17px);
          font-weight: 800;
          padding: 0 clamp(12px, 4vw, 18px);
          cursor: pointer;
          z-index: 11;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          box-sizing: border-box;
        }
        .container.moved .cta { opacity: 0; transform: translateY(6px); pointer-events: none; }

        /* greet after arrived */
        .greet {
          position: absolute;
          top: 96px;
          left: 50%;
          transform: translate(-50%, 6px);
          text-align: center;
          color: #111;
          z-index: 12;
          mix-blend-mode: normal;
          opacity: 0;
          transition: opacity 1000ms ease-in, transform 1000ms ease-in;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          text-shadow: 0 1px 6px rgba(255,255,255,0.35);
        }
        .greet-line1 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
        .greet-line2 { font-size: 18px; font-weight: 700; opacity: 0.9; }
        .container.arrived .greet { opacity: 1; transform: translate(-50%, 0); }

        .composer {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 48px; /* align with CTA */
          width: var(--control-w); /* match CTA */
          height: var(--control-h); /* match CTA */
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 0 clamp(12px, 4vw, 18px);
          gap: 10px;
          background: linear-gradient(90deg, rgba(211, 178, 226, 0.407) 0%, rgba(255, 255, 255, 0.55) 76.44%, rgba(223, 199, 234, 0.3245) 100%);
          border-radius: 999px; /* match CTA shape */
          border: 1px solid rgba(0,0,0,0.06); /* match CTA stroke (color differs) */
          z-index: 12;
          opacity: 0;
          pointer-events: none;
          transition: opacity 600ms ease-in;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          box-sizing: border-box;
        }
        @media (max-width: 480px) {
          .composer {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            width: var(--control-w); /* match CTA */
            bottom: calc(30px + env(safe-area-inset-bottom, 0px));
            gap: 10px;
            padding: 0 clamp(12px, 4vw, 18px); /* match CTA */
            border-radius: 999px; /* match CTA */
            overflow: hidden; /* ensure gradient corners clip */
          }
        }
        .container.arrived .composer { opacity: 0.95; }
        .composer .plus, .composer .mic { width: 18px; height: 18px; color: #878181; font-weight: 400; flex: none; }
        .composer .input { flex: 1; border: 0; outline: 0; background: transparent; color: #878181; font-weight: 400; font-size: 15px; line-height: 150%; }
        .composer .input::placeholder { color: #878181; opacity: 1; }

        /* ambient */
        .ambient { position: absolute; inset: 0; z-index: 4; pointer-events: none; }
        .bg-grad {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(
            to top,
            rgba(235, 201, 255, 0.22) 0%,
            rgba(244, 250, 248, 0.52) 55%,
            rgba(230, 255, 241, 0.70) 100%
          );
          transform-origin: bottom center;
          transform: translateY(25%) scaleY(0.65);
          transition: opacity 380ms ease-out;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .container.arrived .bg-grad { opacity: 1; animation: bgSurge 900ms cubic-bezier(0.2, 0.9, 0.1, 1) both; }

        /* T2 blobs */
        .t2-stage {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          pointer-events: none;
          z-index: 5;
        }
        .t2-blob {
          position: absolute;
          left: 50%;
          width: var(--t2-size);
          height: var(--t2-size);
          transform: translate(-50%, -50%) scale(1.25) rotate(0deg);
          border-radius: 50%;
          transform-origin: 50% 50%;
          isolation: isolate;
          transition: top 900ms cubic-bezier(0.4, 0, 1, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* circular ripple waves (idle + arrived, hidden while moving) */
        .t2-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.12) 10%, rgba(255,255,255,0.0) 52%);
          mix-blend-mode: screen;
          filter: blur(14px) saturate(1.12);
          opacity: 0.16;
          transform: scale(0.8);
          animation: ripplePulse 3.6s linear infinite;
          will-change: transform, opacity, filter;
          z-index: 1;
        }
        .t2-ripple.r2 { animation-delay: 1.8s; }
        .container.moved .t2-ripple { opacity: 0; animation: none; }
        /* blurry trails shown only while rising */
        .t2-trail {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(72% 72% at 48% 90%, rgba(184,255,241,0.35) 0%, rgba(165,243,221,0.24) 30%, rgba(100,255,175,0.18) 60%, rgba(0,0,0,0) 100%);
          filter: blur(26px) saturate(1.02);
          opacity: 0;
          z-index: 0;
          will-change: transform, opacity, filter;
        }
        .container.moved .t2-blob .t2-trail.t1 { animation: t2TrailFade 1.2s ease-out 0s 1 forwards; }
        .container.moved .t2-blob .t2-trail.t2 { animation: t2TrailFade 1.4s ease-out 0.06s 1 forwards; }
        .t2-blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); }
        .t2-blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)); }

        .container.moved .t2-blob.top { top: calc(-24% - 400px); transform: translate(-50%, -50%) scale(1.2) rotate(180deg); }
        .container.moved .t2-blob.bottom { top: calc(44% - 400px); transform: translate(-50%, -50%) scale(1.3); }

        .container.arrived .t2-blob.top { animation: t2PopSpringTop 520ms cubic-bezier(0.2, 0.9, 0.1, 1) both; }
        .container.arrived .t2-blob.bottom { animation: t2PopSpringBottom 520ms cubic-bezier(0.2, 0.9, 0.1, 1) both; }

        @property --t2-blur { syntax: '<length>'; inherits: true; initial-value: 2px; }
        @property --t2-sat { syntax: '<number>'; inherits: true; initial-value: 1; }
        @property --t2-bri { syntax: '<number>'; inherits: true; initial-value: 1; }
        @property --t2-hue { syntax: '<angle>'; inherits: true; initial-value: 0deg; }
        @property --gX { syntax: '<percentage>'; inherits: true; initial-value: 29%; }
        @property --gY { syntax: '<percentage>'; inherits: true; initial-value: 28%; }

        .t2-blob::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: radial-gradient(75% 75% at var(--gX) var(--gY), #C6FFB0 0%, #B4FDE5 55%, #CCF2FF 81%, #EEEFFF 100%);
          filter: blur(var(--t2-blur)) hue-rotate(var(--t2-hue)) saturate(var(--t2-sat)) brightness(var(--t2-bri));
          /* idle: gentle breath only to avoid directional jump */
          animation: t2ColorBreathIdle 6.2s ease-in-out 0s infinite;
        }
        /* stronger landing blur on top blob and disable idle anim to keep 20px */
        .t2-blob.top::before { --t2-blur: 20px; animation: none; }
        .container.moved .t2-blob::before { animation: t2BlurRise 900ms cubic-bezier(0.4, 0, 1, 1) 0s 1 forwards; }
        .container.moved .t2-blob.top::before { animation: t2BlurRiseTop 900ms cubic-bezier(0.4, 0, 1, 1) 0s 1 forwards; }
        .container.arrived .t2-blob::before { animation: t2BlurSettle 220ms ease-out 0s 1 forwards, t2ColorBreath 3.6s ease-in-out 0.4s infinite; }

        .t2-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background:
            radial-gradient(circle at 72% 78%,
              rgba(235, 201, 255, 0) 0 74%,
              rgba(179, 225, 255, 0.28) 82%,
              rgba(235, 201, 255, 0.55) 90%,
              rgba(255, 189, 228, 0.8) 100%
            );
          mix-blend-mode: screen;
          filter: saturate(1.35) blur(40px) drop-shadow(0 22px 36px rgba(186, 136, 255, 0.52));
          animation: t2Ring 7.2s ease-in-out 1.2s infinite alternate;
        }

        /* purple pulse overlays - positioned near top at start */
        .t2-purple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            circle at var(--pX, 50%) var(--pY, 20%),
            rgba(186,136,255,0.50) 0%,
            rgba(172,120,255,0.34) 28%,
            rgba(160,100,250,0.20) 56%,
            rgba(0,0,0,0) 86%
          );
          mix-blend-mode: screen;
          filter: saturate(1.55) blur(22px);
          opacity: 0.54;
          transform: scale(0.92);
          animation: purplePulse 2.2s ease-in-out infinite;
          z-index: 2;
        }
        .t2-purple.p2 { animation-delay: 1.2s; opacity: 0.38; }
        .container:not(.moved) .t2-purple { animation: purplePulse 2.2s ease-in-out infinite, purpleDriftIdle 4.2s ease-in-out infinite; }
        .container.moved .t2-purple { animation: purpleFlowMove 1100ms ease-in-out 0s 1 forwards; }
        .container.arrived .t2-purple { animation: purpleFlowArrive 1000ms ease-in-out 0s 1 forwards, purplePulse 2.6s ease-in-out 0.4s infinite; }

        /* mint glow reinforcement (subtle) */
        .t2-mint {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            60% 60% at 50% 60%,
            rgba(198,255,176,0.42) 0%,
            rgba(180,253,229,0.22) 36%,
            rgba(0,0,0,0) 72%
          );
          mix-blend-mode: screen;
          filter: blur(20px) saturate(1.2);
          opacity: 0.28;
          transform: scale(0.98);
          animation: mintPulse 3.2s ease-in-out 0.6s infinite;
          z-index: 1;
        }
        @keyframes purplePulse {
          0%, 100% { opacity: 0.44; filter: blur(22px) saturate(1.45); }
          50% { opacity: 0.60; filter: blur(26px) saturate(1.60); }
        }
        @keyframes purpleDriftIdle {
          0%   { --pX: 48%; --pY: 18%; }
          50%  { --pX: 54%; --pY: 24%; }
          100% { --pX: 48%; --pY: 18%; }
        }
        @keyframes purpleFlowMove {
          0%   { --pX: 50%; --pY: 20%; opacity: 0.50; }
          100% { --pX: 50%; --pY: 80%; opacity: 0.58; }
        }
        @keyframes purpleFlowArrive {
          0%   { --pX: 50%; --pY: 76%; }
          50%  { --pX: 56%; --pY: 82%; }
          100% { --pX: 50%; --pY: 78%; }
        }
        @keyframes mintPulse {
          0%, 100% { opacity: 0.26; filter: blur(20px) saturate(1.20); }
          50% { opacity: 0.36; filter: blur(26px) saturate(1.28); }
        }

        /* center pulse overlay to simulate shader-like core ripple */
        .t2-core {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.22) 0%, rgba(235,201,255,0.18) 30%, rgba(255,189,228,0.12) 48%, rgba(0,0,0,0) 70%);
          mix-blend-mode: screen;
          filter: saturate(1.2) blur(20px);
          opacity: 0.16;
          transform: scale(0.98);
          /* idle gentle pulse */
          animation: t2CorePulseIdle 6.4s ease-in-out 0s infinite;
        }
        .container.arrived .t2-core { animation: t2CorePulse 5.0s ease-in-out 0.8s infinite; }
        @keyframes t2BlurRise {
          0% { --t2-blur: 2px; --t2-sat: 1; --t2-bri: 1; }
          100% { --t2-blur: 18px; --t2-sat: 1.12; --t2-bri: 1.06; }
        }
        @keyframes t2BlurRiseTop {
          0% { --t2-blur: 20px; --t2-sat: 1; --t2-bri: 1; }
          100% { --t2-blur: 18px; --t2-sat: 1.12; --t2-bri: 1.06; }
        }
        @keyframes t2BlurSettle {
          0% { --t2-blur: 18px; --t2-sat: 1.14; --t2-bri: 1.06; }
          100% { --t2-blur: 4px; --t2-sat: 1.10; --t2-bri: 1.04; }
        }
        @keyframes t2Ring {
          0%, 100% {
            opacity: 0.82;
            filter: saturate(1.3) blur(50px) drop-shadow(0 28px 44px rgba(186, 136, 255, 0.58));
          }
          50% {
            opacity: 1;
            filter: saturate(1.75) blur(66px) drop-shadow(0 36px 64px rgba(186, 136, 255, 0.88));
          }
        }
        @keyframes t2PopSpringTop {
          0% { transform: translate(-50%, -50%) scale(1.28); }
          62% { transform: translate(-50%, -50%) scale(2.5); }
          84% { transform: translate(-50%, -50%) scale(2.28); }
          100% { transform: translate(-50%, -50%) scale(2.35); }
        }
        @keyframes t2PopSpringBottom {
          0% { transform: translate(-50%, -50%) scale(1.38); }
          62% { transform: translate(-50%, -50%) scale(2.72); }
          84% { transform: translate(-50%, -50%) scale(2.52); }
          100% { transform: translate(-50%, -50%) scale(2.60); }
        }
        @keyframes t2CorePulse {
          0%, 100% { opacity: 0.16; transform: scale(0.98); filter: saturate(1.20) brightness(1.00) blur(20px); }
          50% { opacity: 0.34; transform: scale(1.06); filter: saturate(1.40) brightness(1.10) blur(26px); }
        }
        @keyframes t2CorePulseIdle {
          0%, 100% { opacity: 0.14; transform: scale(0.985); filter: saturate(1.12) brightness(1.00) blur(18px); }
          50% { opacity: 0.24; transform: scale(1.015); filter: saturate(1.24) brightness(1.08) blur(22px); }
        }
        @keyframes t2ColorBreath {
          0%, 100% { filter: blur(var(--t2-blur)) hue-rotate(0deg) saturate(1.08) brightness(1.04); }
          50% { filter: blur(calc(var(--t2-blur) + 4px)) hue-rotate(22deg) saturate(1.65) brightness(1.24); }
        }
        @keyframes t2ColorBreathIdle {
          0%, 100% { --t2-sat: 1.08; --t2-bri: 1.02; --t2-hue: 0deg; --t2-blur: 2px; }
          50% { --t2-sat: 1.16; --t2-bri: 1.06; --t2-hue: 6deg; --t2-blur: 3px; }
        }
        @keyframes ripplePulse {
          0% { transform: scale(0.78); opacity: 0.22; filter: saturate(1.20) brightness(1.00) blur(18px); }
          60% { transform: scale(1.36); opacity: 0.12; filter: saturate(1.18) brightness(1.08) blur(22px); }
          100% { transform: scale(1.78); opacity: 0; filter: saturate(1.10) brightness(1.04) blur(28px); }
        }
        @keyframes flowDiag {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        @keyframes t2TrailFade { 0% { opacity: 0.26; filter: blur(26px) saturate(1.02); transform: translateY(10px) scale(1.02); } 100% { opacity: 0; filter: blur(42px) saturate(1.0); transform: translateY(22px) scale(1.06); } }
        @keyframes bgSurge { 0% { transform: translateY(25%) scaleY(0.65); opacity: 0; } 60% { opacity: 0.85; } 100% { transform: translateY(0) scaleY(1.05); opacity: 1; } }

        /* responsive */
        @media (max-width: 768px) {
          .title { font-size: 48px; }
          .subtitle { font-size: 16px; }
          .container { --t2-size: 62svh; --gap: 5px; }
        }
        @media (max-width: 480px) {
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
          .container { --t2-size: 62svh; --gap: 4px; }
        }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default In2;


