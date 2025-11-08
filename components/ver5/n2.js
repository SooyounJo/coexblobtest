import React, { useState, useEffect } from 'react';

const In1 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  // fixed orbit mode (remove dev toggles/labels)

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 2000);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  useEffect(() => {
    if (arrived) {
      const t = setTimeout(() => setCleaned(true), 900);
      return () => clearTimeout(t);
    }
    setCleaned(false);
  }, [arrived]);

  // removed dev key toggles

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
    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''} ${cleaned ? 'cleaned' : ''} wave-orbit`}>
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
          <div className="t2-ripple r1" />
          <div className="t2-ripple r2" />
          <div className="t2-wave w1" />
          <div className="t2-wave w2" />
          <div className="t2-swirl s1" />
          <div className="t2-caustic">
            <svg className="t2-caustic-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <filter id="t2CausticTop">
                  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.018" numOctaves="3" seed="2" result="noise">
                    <animate attributeName="baseFrequency" values="0.012 0.018;0.017 0.020;0.010 0.015;0.012 0.018" dur="8.4s" repeatCount="indefinite" />
                    <animate attributeName="seed" values="2;3;4;2" dur="12s" repeatCount="indefinite" />
                  </feTurbulence>
                  <feGaussianBlur in="noise" stdDeviation="0.45" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cm" />
                </filter>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" filter="url(#t2CausticTop)" />
            </svg>
          </div>
          <div className="t2-bloom b1" />
          <div className="t2-bloom b2" />
          <div className="t2-trail t1" />
          <div className="t2-trail t2" />
          <div className="t2-core" />
          <div className="t2-ring" />
        </div>
        <div className="t2-blob bottom">
          <div className="t2-flow f1" />
          <div className="t2-ripple r1" />
          <div className="t2-ripple r2" />
          <div className="t2-wave w1" />
          <div className="t2-wave w2" />
          <div className="t2-swirl s1" />
          <div className="t2-caustic">
            <svg className="t2-caustic-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <defs>
                <filter id="t2CausticBottom">
                  <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="3" seed="5" result="noise">
                    <animate attributeName="baseFrequency" values="0.011 0.016;0.016 0.019;0.009 0.014;0.011 0.016" dur="8.4s" repeatCount="indefinite" />
                    <animate attributeName="seed" values="5;6;7;5" dur="12s" repeatCount="indefinite" />
                  </feTurbulence>
                  <feGaussianBlur in="noise" stdDeviation="0.45" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="cm" />
                </filter>
              </defs>
              <rect x="0" y="0" width="100%" height="100%" filter="url(#t2CausticBottom)" />
            </svg>
          </div>
          <div className="t2-bloom b1" />
          <div className="t2-bloom b2" />
          <div className="t2-trail t1" />
          <div className="t2-trail t2" />
          <div className="t2-core" />
          <div className="t2-ring" />
        </div>
      </div>

      {/* n4 overlay: fades in over 2s after arrival */}
      <div className="n4-stage" aria-hidden>
        <div
          className="n4-blob top"
          style={{
            '--center-x': `39%`,
            '--center-y': `33%`,
            '--start': `50%`,
            '--end': `99%`,
            '--blur': `52px`,
            '--feather': `15%`,
            '--inner-blur': `20px`,
            '--rim-tilt': `30deg`,
            '--bg': `radial-gradient(circle at var(--center-x) var(--center-y), #D9FFB8 0%, #D9FFB8 18%, #B9FFF3 35%, #B9FFF3 52%, #DCD6FF 70%, #EEF4FF 88%, #FFFFFF 100%)`,
            '--tint-alpha': 0.85,
            '--boost': 1.9,
          }}
        >
          <div className="n4-ring-boost" />
        </div>
        {/* bottom overlay removed per spec */}
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
          --t2-size: 62svh;
          --meet-y: 38%;
          /* non-overlap placement vars */
          --s-top: 1.28;
          --s-bottom: 1.38;
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
          z-index: 100;
          mix-blend-mode: normal;
          opacity: 1;
          pointer-events: none;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          filter: blur(0px);
          transition: opacity 900ms ease-out, transform 900ms ease-out, filter 900ms ease-out;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }
        .container.moved .hero { opacity: 1; transform: none; filter: none; }
        .container.arrived .hero { opacity: 0; transform: translateY(18px); filter: none; }

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
          filter: blur(0px);
          transition: opacity 800ms ease-out, transform 800ms ease-out, filter 800ms ease-out;
        }
        .container.moved .cta { opacity: 1; transform: translateX(-50%); filter: blur(6px) saturate(1.02); pointer-events: none; }

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
          z-index: 110;
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
        .container.moved .composer { opacity: 0; }
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
          transition: opacity 2000ms ease;
        }
        .container.arrived .t2-stage { opacity: 0; transition-delay: 0ms; transition-duration: 150ms; visibility: hidden; }
        /* after cleanup: remove all visuals except text and composer */
        .container.cleaned .ambient,
        .container.cleaned .t2-stage { display: none !important; }
        .t2-blob {
          position: absolute;
          left: 50%;
          width: var(--t2-size);
          height: var(--t2-size);
          transform: translate(-50%, -50%) scale(1.25);
          border-radius: 50%;
          isolation: isolate;
          transition: top 1.6s cubic-bezier(0.4, 0, 1, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
          will-change: top, transform;
          backface-visibility: hidden;
          transform: translateZ(0) translate(-50%, -50%) scale(1.25);
        }

        /* blurry trails while rising */
        .t2-trail { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: radial-gradient(72% 72% at 48% 90%, rgba(184,255,241,0.35) 0%, rgba(165,243,221,0.24) 30%, rgba(100,255,175,0.18) 60%, rgba(0,0,0,0) 100%); filter: blur(26px) saturate(1.02); opacity: 0; z-index: 0; will-change: transform, opacity, filter; }
        .container.moved .t2-blob .t2-trail.t1 { animation: t2TrailFade 0.8s ease-out 0.18s 1 forwards; }
        .container.moved .t2-blob .t2-trail.t2 { animation: t2TrailFade 0.95s ease-out 0.26s 1 forwards; }

        .t2-blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); }
        .t2-blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)); }
        /* keep T2 in place until big blob arrives, then move up */
        .container.moved .t2-blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); }
        .container.moved .t2-blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)); }
        .container.arrived .t2-blob.top { top: calc(-24% - 400px); transform: translate(-50%, -50%) scale(1.2); animation: none; }
        .container.arrived .t2-blob.bottom { top: calc(44% - 400px); transform: translate(-50%, -50%) scale(1.3); animation: none; }

        /* anim variables */
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
          /* static base; bloom layers provide motion */
          animation: none;
          transition: --t2-blur 1000ms ease, --t2-sat 1000ms ease, --t2-bri 1000ms ease, --t2-hue 1000ms ease, --gX 1000ms ease, --gY 1000ms ease;
        }
        /* noise mode: apply SVG displacement to base gradient to make waves very visible */
        .container.wave-noise .t2-blob::before { filter: url(#t2Displace) blur(var(--t2-blur)) hue-rotate(var(--t2-hue)) saturate(var(--t2-sat)) brightness(var(--t2-bri)); }
        /* landing: keep brightness/saturation stable to avoid flicker */
        .container:not(.moved) .t2-blob::before { --t2-sat: 1.10; --t2-bri: 1.02; }
        /* landing blur for top blob (reduced for sharper look) */
        .t2-blob.top::before { --t2-blur: 18px; }
        /* 1) start: bottom blob without blur */
        .container:not(.moved) .t2-blob.bottom::before { --t2-blur: 0px; filter: none; }
        /* idle: bottom blob gently orbits and breathes */
        .container:not(.moved) .t2-blob.bottom { animation: orbitHotspot 6.8s ease-in-out infinite; }
        .container:not(.moved) .t2-blob.bottom .t2-core { animation: t2Breathe 3.4s ease-in-out infinite; }
        /* smooth rise: start blur immediately at current position (slower ramp) */
        .container.moved .t2-blob.top::before { animation: t2BlurRiseTop 1200ms ease-out 0ms 1 forwards; }
        .container.moved .t2-blob.bottom::before { animation: t2BlurRiseBottom 1200ms ease-out 0ms 1 forwards; }
        /* morph T2 look toward n4 before overlay fade-in */
        .container.arrived { --gX: 39%; --gY: 33%; }
        .container.arrived .t2-blob::before { animation: t2MorphToN4 1000ms ease 0s 1 forwards; }
        /* 2) on rise: gradually add a little blur, then clear when grown */
        .container.moved .t2-blob::before { --t2-blur: 14px; transition: filter 420ms ease-out, transform 420ms ease-out; transform: rotate(0deg); }

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
          filter: saturate(1.3) blur(34px) drop-shadow(0 28px 44px rgba(186, 136, 255, 0.58));
        }
        /* after growth, keep ring subtle for crisp overall look */
        .container.arrived .t2-ring { filter: saturate(1.10) blur(12px); }

        /* n4 overlay */
        .n4-stage {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
          opacity: 0;
          transition: opacity 2000ms ease;
        }
        /* show overlay as soon as movement starts to avoid white gap */
        .container.moved .n4-stage { opacity: 1; transition-delay: 0ms; transition-duration: 0ms; }
        .container.arrived .n4-stage { opacity: 1; transition-delay: 0ms; transition-duration: 150ms; }
        .n4-blob {
          position: absolute;
          left: 50%;
          width: var(--t2-size);
          height: var(--t2-size);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          isolation: isolate;
          --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
          --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
          --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
          animation: none;
          transition: top 1.6s cubic-bezier(0.4, 0, 1, 1), transform 680ms cubic-bezier(0.2, 0.9, 0.1, 1);
        }
        .n4-blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); opacity: 1; }
        /* start above and small; animate down on moved, then flourish on arrived */
        .container:not(.moved) .n4-blob.top { top: calc(-24% - 400px); transform: translate(-50%, -50%) scale(0.55); opacity: 0.85; }
        .container.moved .n4-blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); animation: none; opacity: 0.85; }
        .container.arrived .n4-blob.top { animation: none; opacity: 1; }
        .n4-blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)); }
        .n4-blob::before,
        .n4-blob::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--bg);
        }
        .n4-blob::before {
          filter: blur(var(--inner-blur));
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
        .n4-blob::after {
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)),
              rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));
          background-blend-mode: normal, screen;
          filter: blur(calc(var(--blur) + var(--blur-wobble))) drop-shadow(0 24px 36px rgba(186, 136, 255, 0.4));
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
        @supports (mask-composite: intersect) {
          .n4-blob::after {
            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            mask-composite: intersect;
          }
        }
        @supports (-webkit-mask-composite: source-in) {
          .n4-blob::after {
            -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            -webkit-mask-composite: source-in;
          }
        }
        .n4-ring-boost {
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
          filter: blur(calc((var(--blur) + var(--blur-wobble)) * var(--boost))) drop-shadow(0 26px 40px rgba(186, 136, 255, 0.35));
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
        }

        /* n4 pulse variables/animation */
        @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @keyframes ringPulseFastWide {
          0%, 100% {
            --start-wobble: calc(0% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 0%;
            --blur-wobble: calc(0px - var(--blur));
          }
          50% {
            --start-wobble: calc(92% - var(--start));
            --end-wobble: -5%;
            --feather-wobble: 14%;
            --blur-wobble: calc(220px - var(--blur));
          }
        }
        

        /* freeze base blobs in-place on arrival */
        .container.arrived .t2-blob { transition: none; }
        .container.arrived .t2-blob.top { top: calc(-24% - 400px); opacity: 1; }
        .container.arrived .t2-blob.bottom { top: calc(44% - 400px); opacity: 1; }

        /* noise caustic overlay (SVG turbulence) */
        .t2-caustic {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          mix-blend-mode: soft-light;
          opacity: 0; /* default off */
          z-index: 1;
          animation: causticDrift 8s linear infinite;
          filter: saturate(1.18);
        }
        .t2-caustic-svg { width: 100%; height: 100%; display: block; clip-path: circle(50% at 50% 50%); }
        .container.wave-noise .t2-caustic { opacity: 0.50; }
        /* perf: pause heavy layers during movement */
        .container.moved .t2-caustic { display: none; animation: none; }
        .container.moved .t2-ring { opacity: 0; filter: none; }
        .container.moved .t2-bloom,
        .container.moved .t2-wave,
        .container.moved .t2-swirl,
        .container.moved .t2-ripple { opacity: 0; animation: none; }
        /* in noise mode, quiet other overlays for clean test */
        .container.wave-noise .t2-flow,
        .container.wave-noise .t2-ripple,
        .container.wave-noise .t2-wave,
        .container.wave-noise .t2-swirl { opacity: 0; animation: none; }
        @keyframes causticDrift {
          0% { transform: translate(0%, 0%) scale(1.00); }
          50% { transform: translate(-1.2%, 0.8%) scale(1.02); }
          100% { transform: translate(0%, 0%) scale(1.00); }
        }

        /* moving glint inside the blob */
        .t2-glint { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; z-index: 2; }
        .t2-glint::before {
          content: '';
          position: absolute; left: 50%; top: 50%; width: 16%; height: 16%; border-radius: 50%;
          transform-origin: -150% -150%;
          transform: translate(-50%, -50%) rotate(0deg);
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.4) 35%, rgba(255,255,255,0) 70%);
          filter: blur(10px) saturate(1.2);
          mix-blend-mode: soft-light;
          opacity: 0.22;
          animation: glintOrbit 3.0s linear infinite;
        }
        .container.moved .t2-glint::before { animation-duration: 2.2s; }
        .container.arrived .t2-glint { opacity: 0; }
        @keyframes glintOrbit { to { transform: translate(-50%, -50%) rotate(360deg); } }
        /* perf: stop glint rotation during movement */
        .container.moved .t2-glint::before { animation: none; }

        .t2-core { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.16) 0%, rgba(235,201,255,0.12) 30%, rgba(255,189,228,0.08) 48%, rgba(0,0,0,0) 70%); mix-blend-mode: screen; filter: saturate(1.06) blur(18px); opacity: 0.14; transform: scale(0.99); }
        .container.moved .t2-core { animation: t2CorePulseStrong 1.8s ease-in-out infinite; }
        .container.arrived .t2-core { animation: t2Breathe 3.2s ease-in-out infinite; }
        /* perf: compositor hints */
        .t2-blob,
        .t2-blob::before,
        .t2-flow,
        .t2-core { will-change: transform, opacity, filter; backface-visibility: hidden; }

        /* directional flow overlay */
        .t2-flow {
          position: absolute;
          inset: -6%;
          border-radius: 50%;
          pointer-events: none;
          background: linear-gradient(90deg,
            rgba(199,125,255,0.18) 0%,
            rgba(235,201,255,0.26) 20%,
            rgba(255,189,228,0.18) 40%,
            rgba(235,201,255,0.10) 60%,
            rgba(199,125,255,0.00) 80%
          );
          mix-blend-mode: screen;
          filter: blur(32px) saturate(1.2);
          background-size: 300% 100%;
          background-position: 0% 50%;
          animation: flowX 2.2s linear infinite;
          opacity: 0.38;
          z-index: 1;
        }
        .t2-flow.f1 { animation-duration: 2.0s; opacity: 0.32; }
        /* intensify flow during move/after pop for shader-like effect */
        .container.moved .t2-flow { animation: flowX 1.2s linear infinite; opacity: 0.55; filter: blur(36px) saturate(1.35) brightness(1.06); }
        .container.arrived .t2-flow { animation: none; opacity: 0; filter: none; }
        /* perf override: lighten flow during movement */
        .container.moved .t2-flow { animation: flowX 1.35s linear infinite; opacity: 0.28; filter: blur(22px) saturate(1.08) brightness(1.02); }

        @keyframes flowX {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        /* wave mode 1: orbit hotspot (animate gradient origin) */
        .container.wave-orbit .t2-blob { animation: orbitHotspot 3.8s ease-in-out infinite; }
        /* n1: disable orbit in non-arrived state only (preserve arrival pop) */
        .container.wave-orbit:not(.arrived) .t2-blob { animation: none; }
        @keyframes orbitHotspot {
          0%   { --gX: 26%; --gY: 28%; }
          25%  { --gX: 74%; --gY: 34%; }
          50%  { --gX: 52%; --gY: 70%; }
          75%  { --gX: 30%; --gY: 46%; }
          100% { --gX: 26%; --gY: 28%; }
        }

        /* wave mode 2: traveling thin ring */
        .t2-wave {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 0 58%, rgba(255,255,255,0.45) 60%, rgba(0,0,0,0) 62%);
          opacity: 0;
          transform: scale(0.5);
          filter: blur(18px) saturate(1.15);
          z-index: 1;
        }
        .container.wave-ring .t2-wave.w1 { animation: ringTravel 1.6s linear infinite; }
        .container.wave-ring .t2-wave.w2 { animation: ringTravel 1.6s linear 0.8s infinite; }
        @keyframes ringTravel {
          0% { opacity: 0.28; transform: scale(0.50); filter: blur(18px) saturate(1.15); }
          70% { opacity: 0.12; transform: scale(1.50); filter: blur(24px) saturate(1.18); }
          100% { opacity: 0; transform: scale(1.85); filter: blur(28px) saturate(1.10); }
        }
        /* idle state: gentle center-out pulse */
        .container:not(.moved) .t2-wave.w1 { opacity: 0.20; animation: ringTravel 2.8s ease-out infinite; }
        .container:not(.moved) .t2-wave.w2 { opacity: 0.14; animation: ringTravel 2.8s ease-out 1.4s infinite; }

        /* wave mode 3: swirl flow via conic gradient */
        .t2-swirl {
          position: absolute;
          inset: -4%;
          border-radius: 50%;
          pointer-events: none;
          background: conic-gradient(from 0deg at 50% 50%, rgba(186,136,255,0.22), rgba(235,201,255,0.10), rgba(160,255,220,0.18), rgba(186,136,255,0.22));
          -webkit-mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0 70%, rgba(0,0,0,0) 84%);
                  mask-image: radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0 70%, rgba(0,0,0,0) 84%);
          opacity: 0;
          z-index: 1;
          transform: rotate(0deg);
        }
        .container.wave-swirl .t2-swirl { opacity: 0.35; animation: swirlSpin 6.8s linear infinite; }
        /* n1: disable swirl for static base */
        .t2-swirl { opacity: 0; animation: none !important; }
        @keyframes swirlSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        /* idle state: slight right rotation on base gradient */
        .container:not(.moved) .t2-blob::before { animation: idleSpin 8s ease-in-out infinite alternate; }
        @keyframes idleSpin {
          0% { transform: rotate(1deg); }
          100% { transform: rotate(3deg); }
        }

        /* wave mode 4: hue wave using CSS vars (doesn't collide with ::before animations) */
        .container.wave-hue .t2-blob { animation: waveHue 1.15s ease-in-out infinite; }
        @keyframes waveHue {
          0%, 100% { --t2-hue: 0deg; --t2-sat: 1.08; }
          50% { --t2-hue: 18deg; --t2-sat: 1.38; }
        }

        /* transitions */
        @keyframes t2BlurRise { 0% { --t2-blur: 2px; } 100% { --t2-blur: 18px; } }
        @keyframes t2BlurRiseTop { 0% { --t2-blur: 30px; } 100% { --t2-blur: 18px; } }
        @keyframes t2BlurRiseBottom { 0% { --t2-blur: 0px; } 100% { --t2-blur: 14px; } }
        /* return color richness to base while moving */
        @keyframes t2ColorReturn {
          0% { --t2-sat: 1.42; --t2-bri: 0.96; }
          100% { --t2-sat: 1.10; --t2-bri: 1.04; }
        }
        /* after pop: return to clarity (reduced final blur) */
        @keyframes t2BlurSettle { 0% { --t2-blur: 18px; } 100% { --t2-blur: 8px; } }
        /* morph toward n4 palette/center before overlay appears */
        @keyframes t2MorphToN4 {
          0% {
            --t2-sat: 1.10;
            --t2-bri: 1.02;
            --t2-hue: 0deg;
            --t2-blur: 8px;
            --gX: 29%;
            --gY: 28%;
          }
          100% {
            --t2-sat: 1.18;
            --t2-bri: 1.02;
            --t2-hue: 0deg;
            --t2-blur: 12px;
            --gX: 39%;
            --gY: 33%;
          }
        }

        /* strong core pulse for shader-like feel */
        @keyframes t2CorePulseStrong {
          0%, 100% { opacity: 0.16; transform: scale(0.985); filter: saturate(1.12) blur(16px); }
          50% { opacity: 0.32; transform: scale(1.06); filter: saturate(1.35) blur(24px); }
        }
        /* n1: gentle breathing animation (ease-in-out) */
        @keyframes t2Breathe {
          0%, 100% { opacity: 0.16; transform: scale(0.99); filter: saturate(1.10) blur(16px); }
          50% { opacity: 0.26; transform: scale(1.015); filter: saturate(1.18) blur(19px); }
        }

        /* circular ripples to emulate shader ripples */
        .t2-ripple {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.14) 12%, rgba(255,255,255,0.0) 52%);
          mix-blend-mode: screen;
          filter: saturate(1.18) blur(16px);
          opacity: 0.18;
          transform: scale(0.78);
          animation: ripplePulse 1.8s linear infinite;
          will-change: transform, opacity, filter;
          z-index: 1;
        }
        .t2-ripple.r2 { animation-delay: 0.8s; }
        @keyframes ripplePulse {
          0% { transform: scale(0.78); opacity: 0.30; filter: saturate(1.30) brightness(1.00) blur(20px); }
          60% { transform: scale(1.45); opacity: 0.16; filter: saturate(1.35) brightness(1.08) blur(24px); }
          100% { transform: scale(1.85); opacity: 0; filter: saturate(1.20) brightness(1.04) blur(28px); }
        }

        /* bloom pulses from gradient origin */
        .t2-bloom {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(50% 50% at var(--gX) var(--gY), rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.22) 16%, rgba(255,255,255,0.0) 56%);
          filter: blur(10px) saturate(1.18) brightness(1.05);
          opacity: 0;
          transform: scale(0.35);
          animation: bloomPulse 1.6s ease-out infinite;
          will-change: transform, opacity, filter;
          z-index: 1;
        }
        .t2-bloom.b2 { animation-delay: 0.8s; }
        .container.moved .t2-bloom { animation: none; opacity: 0; }
        .container.arrived .t2-bloom { animation: none; opacity: 0; }

        @keyframes bloomPulse {
          0% { opacity: 0.34; transform: scale(0.35); filter: blur(10px) saturate(1.18) brightness(1.06); }
          55% { opacity: 0.18; transform: scale(1.10); filter: blur(20px) saturate(1.26) brightness(1.10); }
          100% { opacity: 0; transform: scale(1.55); filter: blur(28px) saturate(1.12) brightness(1.05); }
        }
        @keyframes bloomPulseWide {
          0%, 100% { opacity: 0.14; transform: scale(0.80); filter: blur(16px) saturate(1.20) brightness(1.06); }
          50% { opacity: 0.26; transform: scale(1.20); filter: blur(26px) saturate(1.30) brightness(1.10); }
        }

        @keyframes t2PopSpringTop {
          0% { transform: translate(-50%, -50%) scale(1.28); }
          62% { transform: translate(-50%, -50%) scale(2.06); }
          84% { transform: translate(-50%, -50%) scale(1.92); }
          100% { transform: translate(-50%, -50%) scale(1.98); }
        }
        @keyframes t2PopSpringBottom {
          0% { transform: translate(-50%, -50%) scale(1.38); }
          62% { transform: translate(-50%, -50%) scale(2.28); }
          84% { transform: translate(-50%, -50%) scale(2.14); }
          100% { transform: translate(-50%, -50%) scale(2.20); }
        }

        @keyframes t2TrailFade { 0% { opacity: 0.16; filter: blur(20px) saturate(1.02); transform: translateY(8px) scale(1.01); } 100% { opacity: 0; filter: blur(30px) saturate(1.0); transform: translateY(20px) scale(1.05); } }
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
      {/* SVG defs for displacement filter (noise-based wave) */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="t2Displace">
            <feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="3" result="noise">
              <animate attributeName="baseFrequency" values="0.008 0.012;0.012 0.016;0.006 0.010;0.008 0.012" dur="6s" repeatCount="indefinite" />
              <animate attributeName="seed" values="3;4;5;3" dur="10s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" values="10;18;8;14" dur="4.8s" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      
    </div>
  );
};

export default In1;





