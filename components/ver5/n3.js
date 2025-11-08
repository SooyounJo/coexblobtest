import React, { useEffect, useState } from 'react';

const N3 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 1600);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  // Default params from ver1/t3 (controls removed)
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

  return (
    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''}`}>
      {/* n1-style hero and CTA */}
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">천천히 숨쉬는 블롭</p>
      </div>
      {/* ambient background like n1 */}
      <div className="ambient" aria-hidden>
        <div className="bg-grad"></div>
      </div>
      <button className="cta" onClick={(e) => { e.stopPropagation(); setMoved(true); }}>
        시작하기
      </button>
      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>

      {/* mini floating blobs: spawn from behind during growth, float near bottom */}
      <div className="mini-layer" aria-hidden>
        <div
          className="mini-blob m1"
          style={{
            '--center-x': `${centerX}%`,
            '--center-y': `${centerY}%`,
            '--start': `${start}%`,
            '--end': `${end}%`,
            '--feather': `${feather}%`,
            '--rim-tilt': `${rimTilt}deg`,
            '--bg': gradient,
            '--tint-alpha': tintAlpha,
          }}
        />
        <div
          className="mini-blob m2"
          style={{
            '--center-x': `${centerX}%`,
            '--center-y': `${centerY}%`,
            '--start': `${start}%`,
            '--end': `${end}%`,
            '--feather': `${feather}%`,
            '--rim-tilt': `${rimTilt}deg`,
            '--bg': gradient,
            '--tint-alpha': tintAlpha,
          }}
        />
      </div>

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
        </div>
      </div>

      {/* subtle CTA-like pulse above blob after it grows */}
      <div className="pulse-layer" aria-hidden>
        <div className="pulse p1" />
        <div className="pulse p2" />
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
          background: white;
          transition: filter 900ms ease;
          /* match n1 sizing/placement */
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
          filter: blur(0px);
          transition: opacity 900ms ease-out, transform 900ms ease-out, filter 900ms ease-out;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }
        .container.moved .hero { opacity: 0; transform: translateY(18px); filter: none; }

        .cta {
          position: absolute;
          left: 50%;
          bottom: 48px;
          transform: translateX(-50%);
          width: clamp(240px, 92vw, 360px);
          height: clamp(44px, 9.6vw, 56px);
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
        .container.moved .cta { opacity: 0; transform: translateX(-50%) translateY(18px); filter: none; pointer-events: none; }

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
        .container.arrived .greet { opacity: 1; transform: translate(-50%, 0); transition-delay: 1900ms, 1900ms; }

        @property --move-blur { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }

        .stage {
          height: 100%;
          display: grid;
          place-items: center;
          background: transparent;
          position: relative;
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

          /* start: very slow pulse */
          animation: ringPulseSlow 7.2s ease-in-out infinite;
          transition: top 1.6s cubic-bezier(0.4, 0, 1, 1), transform 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 500ms ease;
          will-change: top, transform;
          backface-visibility: hidden;
          transform: translateZ(0) translate(-50%, -50%);
        }
        .blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); --blur: 30px; z-index: 1; }
        .blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)) rotate(30deg); z-index: 1; }
        /* movement like n1 */
        .container.moved { filter: none; }
        .container.arrived { filter: none; }
        /* rise: cancel elongation (uniform scale only) */
        .container.moved .blob.top { top: calc(-24% - 400px); transform: translate(-50%, -50%) scale(1.2); }
        .container.moved .blob.bottom { top: calc(44% - 400px); transform: translate(-50%, -50%) scale(1.3) rotate(30deg); }
        /* motion gating: no pulse while moving; after arrival faster & wider */
        .container.moved .blob { animation: none; }
        .container.arrived .blob { animation: ringPulseFastWide 2.2s ease-in-out infinite; }
        /* arrival: smooth continue-growth (no pause, no overshoot) */
        .container.arrived .blob.top { animation: ringPulseFastWide 2.2s ease-in-out 0ms infinite, n4GrowSmoothTop 900ms cubic-bezier(0.2, 0.9, 0.1, 1) 0ms 1 both; }
        .container.arrived .blob.bottom { animation: ringPulseFastWide 2.2s ease-in-out 0ms infinite, n4GrowSmoothBottom 900ms cubic-bezier(0.2, 0.9, 0.1, 1) 0ms 1 both; }
        .container.moved .ring-boost { filter: none; }
        .container.arrived .ring-boost { filter: none; }

        /* ambient (match n1) */
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
          transition: opacity 380ms ease-out;
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .container.arrived .bg-grad { opacity: 1; animation: bgSurge 900ms cubic-bezier(0.2, 0.9, 0.1, 1) both; }
        @keyframes bgSurge { 0% { transform: translateY(25%) scaleY(0.65); opacity: 0; } 60% { opacity: 0.85; } 100% { transform: translateY(0) scaleY(1.05); opacity: 1; } }

        /* mini blobs (behind main blobs, below their glow) */
        .mini-layer { position:absolute; inset:0; z-index:0; pointer-events:none; }
        .mini-blob {
          position:absolute;
          border-radius:50%;
          opacity:0;
          transform: translateY(24px) scale(0.78);
          filter: none;
          background: var(--bg);
          mix-blend-mode: screen;
          will-change: transform, opacity;
          backface-visibility: hidden;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.35), 0 0 24px rgba(194,246,255,0.25);
        }
        .mini-blob::after {
          content:"";
          position:absolute;
          inset:0;
          border-radius:inherit;
          background:
            radial-gradient(circle at var(--center-x) var(--center-y),
              rgba(235, 201, 255, 0) 0 calc(var(--start) - (var(--feather) * 0.4)),
              rgba(235, 201, 255, var(--tint-alpha)) calc(var(--end) - (var(--feather) * 0.2)),
              rgba(255,255,255,0.85) calc(var(--end) + (var(--feather) * 0.4)));
          mix-blend-mode: screen;
          opacity:0.55;
        }
        .mini-blob.m1 {
          left: 4%;
          bottom: 198px;
          width: clamp(105px, 21svh, 210px);
          height: clamp(105px, 21svh, 210px);
        }
        .mini-blob.m2 {
          right: 4%;
          bottom: 12px;
          width: clamp(148px, 28svh, 288px);
          height: clamp(148px, 28svh, 288px);
        }
        .container.moved .mini-blob { animation: none; opacity: 0; }
        /* spawn during growth, then float slowly */
        .container.arrived .mini-blob.m1 { animation: miniSpawn 820ms ease-out 200ms 1 both, miniFloatL 15s ease-in-out 1400ms infinite; opacity: 0.42; }
        .container.arrived .mini-blob.m2 { animation: miniSpawn 820ms ease-out 280ms 1 both, miniFloatR 16s ease-in-out 1500ms infinite; opacity: 0.48; }
        @keyframes miniSpawn {
          0%   { opacity:0;   transform: translateY(24px) scale(0.78); }
          100% { opacity:0.55; transform: translateY(0)    scale(1.00); }
        }
        @keyframes miniFloatL {
          0%   { transform: translateY(0) translateX(0) scale(0.97); }
          50%  { transform: translateY(-18px) translateX(28px) scale(1.01); }
          100% { transform: translateY(0) translateX(0) scale(0.97); }
        }
        @keyframes miniFloatR {
          0%   { transform: translateY(0) translateX(0) scale(1.00); }
          50%  { transform: translateY(-22px) translateX(-32px) scale(1.04); }
          100% { transform: translateY(0) translateX(0) scale(1.00); }
        }

        /* CTA pulse overlay: light, transform/opacity only */
        .pulse-layer { position:absolute; inset:0; z-index:7; pointer-events:none; }
        .pulse-layer .pulse {
          position:absolute;
          left:50%;
          top: calc(44% - 400px); /* align roughly with bottom blob center in moved/arrived state */
          width: var(--t2-size);
          height: var(--t2-size);
          transform: translate(-50%, -50%) scale(0.85);
          border-radius:50%;
          opacity:0;
          background: radial-gradient(circle at 50% 50%,
            rgba(255,255,255,0.28) 0%,
            rgba(255,255,255,0.16) 10%,
            rgba(255,255,255,0.00) 38%);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .container.arrived .pulse-layer .pulse.p1 { animation: tapPulse 2.2s ease-out 1900ms infinite; }
        .container.arrived .pulse-layer .pulse.p2 { animation: tapPulse 2.2s ease-out 2700ms infinite; }
        @keyframes tapPulse {
          0%   { opacity:0.22; transform: translate(-50%, -50%) scale(0.85); }
          60%  { opacity:0.12; transform: translate(-50%, -50%) scale(1.30); }
          100% { opacity:0.0;  transform: translate(-50%, -50%) scale(1.70); }
        }

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
          content: "";
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
        /* blur ramp during rise and settle after */
        .container.moved .blob::after { animation: none; }
        .container.arrived .blob::after { animation: none; }

        @supports (mask-composite: intersect) {
          .blob::after {
            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            mask-composite: intersect;
          }
        }

        @supports (-webkit-mask-composite: source-in) {
          .blob::after {
            -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            -webkit-mask-composite: source-in;
          }
        }

        /* start: very slow subtle pulse */
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
        /* after arrival: wider radius and faster pulse */
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
        /* blur rise/settle for movement */
        @keyframes n4BlurRise { from { --move-blur: 0px; } to { --move-blur: 8px; } }
        @keyframes n4BlurSettle { from { --move-blur: 8px; } to { --move-blur: 0px; } }

        /* arrival: smooth growth from moved scale to final scale */
        @keyframes n4GrowSmoothTop {
          0%   { transform: translate(-50%, -50%) scale(1.20); }
          100% { transform: translate(-50%, -50%) scale(1.98); }
        }
        @keyframes n4GrowSmoothBottom {
          0%   { transform: translate(-50%, -50%) scale(1.30) rotate(30deg); }
          100% { transform: translate(-50%, -50%) scale(2.20) rotate(30deg); }
        }
      `}</style>
    </div>
  );
};

export default N3;

