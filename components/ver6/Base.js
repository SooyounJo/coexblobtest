import React from 'react';

const Ver6Base = ({ title, subtitle, children }) => {
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
  const miniColorA = '#C6FFF0';
  const miniColorB = '#D8D3FF';

  const gradient = `radial-gradient(circle at var(--center-x) var(--center-y),
    ${color0} 0%,
    ${color0} 18%,
    ${color1} 35%,
    ${color1} 52%,
    ${color2} 70%,
    #EEF4FF 88%,
    #FFFFFF 100%)`;
  const miniGradient = `radial-gradient(circle at var(--center-x) var(--center-y),
    ${miniColorA} 0%,
    ${miniColorA} 52%,
    ${miniColorB} 100%)`;

  return (
    <div className="container moved arrived">
      <div className="ambient" aria-hidden>
        <div className="bg-grad"></div>
      </div>

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
            '--mini-bg': miniGradient,
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
            '--mini-bg': miniGradient,
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

      <div className="glass-card">
        {title && <h2>{title}</h2>}
        {subtitle && <p>{subtitle}</p>}
        {children}
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
          animation: ringPulseFastWide 2.2s ease-in-out infinite;
          will-change: top, transform;
          backface-visibility: hidden;
          transform: translateZ(0) translate(-50%, -50%);
        }
        .blob.top { top: calc(var(--meet-y) - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); --blur: 30px; z-index: 1; animation: ringPulseFastWide 2.2s ease-in-out 0ms infinite, n4GrowSmoothTop 900ms cubic-bezier(0.2, 0.9, 0.1, 1) 0ms 1 both; }
        .blob.bottom { top: calc(var(--meet-y) + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)) rotate(30deg); z-index: 1; animation: ringPulseFastWide 2.2s ease-in-out 0ms infinite, n4GrowSmoothBottom 900ms cubic-bezier(0.2, 0.9, 0.1, 1) 0ms 1 both; }

        .mini-layer { position:absolute; inset:0; z-index:0; pointer-events:none; }
        .mini-blob {
          position:absolute;
          border-radius:50%;
          opacity:0.45;
          transform: translateY(24px) scale(0.78);
          filter: none;
          background: var(--mini-bg);
          mix-blend-mode: screen;
          will-change: transform, opacity;
          backface-visibility: hidden;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.32), 0 0 18px rgba(186,230,255,0.18);
        }
        .mini-blob::after {
          content:"";
          position:absolute;
          inset:0;
          border-radius:inherit;
          background: radial-gradient(circle at calc(var(--center-x) * 1%) calc(var(--center-y) * 1%),
            rgba(255,255,255,0.45) 0%,
            rgba(255,255,255,0.16) 42%,
            rgba(255,255,255,0) 82%);
          mix-blend-mode: screen;
          opacity:0.5;
        }
        .mini-blob.m1 {
          left: 4%;
          bottom: 198px;
          width: clamp(105px, 21svh, 210px);
          height: clamp(105px, 21svh, 210px);
          animation: miniSpawn 820ms ease-out 200ms 1 both, miniFloatL 15s ease-in-out 1400ms infinite;
        }
        .mini-blob.m2 {
          right: 4%;
          bottom: 12px;
          width: clamp(148px, 28svh, 288px);
          height: clamp(148px, 28svh, 288px);
          animation: miniSpawn 820ms ease-out 280ms 1 both, miniFloatR 16s ease-in-out 1500ms infinite;
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

        .glass-card {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(460px, 84vw);
          padding: 38px 42px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(18px) saturate(1.45);
          border: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            0 24px 48px rgba(90, 126, 139, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.55);
          color: #0b1c18;
          z-index: 5;
          display: grid;
          gap: 18px;
          text-align: center;
        }
        .glass-card h2 {
          margin: 0;
          font-size: clamp(24px, 4vw, 32px);
          font-weight: 800;
          letter-spacing: -0.01em;
        }
        .glass-card p {
          margin: 0;
          font-size: clamp(16px, 3.2vw, 20px);
          font-weight: 500;
          opacity: 0.85;
        }

        .glass-card :global(button) {
          border-radius: 999px;
          border: none;
          padding: 14px 22px;
          font-size: 15px;
          font-weight: 700;
          background: linear-gradient(135deg, rgba(255,255,255,0.85), rgba(255,255,255,0.38));
          color: #0a2a23;
          box-shadow: 0 10px 26px rgba(10, 42, 35, 0.18);
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }
        .glass-card :global(button:hover) {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(10,42,35,0.22);
        }

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
        @keyframes n4GrowSmoothTop {
          0%   { transform: translate(-50%, -50%) scale(1.20); }
          100% { transform: translate(-50%, -50%) scale(1.98); }
        }
        @keyframes n4GrowSmoothBottom {
          0%   { transform: translate(-50%, -50%) scale(1.30) rotate(30deg); }
          100% { transform: translate(-50%, -50%) scale(2.20) rotate(30deg); }
        }
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
        @keyframes bgSurge { 0% { transform: translateY(25%) scaleY(0.65); opacity: 0; } 60% { opacity: 0.85; } 100% { transform: translateY(0) scaleY(1.05); opacity: 1; } }
        @keyframes rimPulseL { 0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.90); } 50% { opacity: 0.45; transform: translate(-50%, -50%) scale(1.10); } }
        @keyframes rimPulseR { 0%, 100% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.92); } 50% { opacity: 0.50; transform: translate(-50%, -50%) scale(1.14); } }

        @media (max-width: 768px) {
          .container { --t2-size: 62svh; --gap: 5px; }
          .glass-card { width: min(420px, 90vw); padding: 32px 28px; }
          .glass-card h2 { font-size: clamp(22px, 5.4vw, 28px); }
          .glass-card p { font-size: clamp(15px, 3.6vw, 18px); }
        }
        @media (max-width: 520px) {
          .container { --t2-size: 64svh; --gap: 4px; }
          .glass-card { padding: 28px 24px; border-radius: 20px; gap: 16px; }
        }
      `}</style>
    </div>
  );
};

export default Ver6Base;

