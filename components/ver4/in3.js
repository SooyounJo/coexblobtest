import React, { useEffect, useState } from 'react';

const In1 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 1100);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  return (
    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''}`}>
      {/* Hero + CTA */}
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>
      <button className="cta" onClick={(e) => { e.stopPropagation(); setMoved(true); }}>
        시작하기
      </button>

      {/* 전환 후 상단 중앙 안내 문구 (ver2/2와 동일 타이밍) */}
      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>

      {/* 비활성화된 입력 박스 (ver2/2와 동일 타이밍) */}
      <div className="composer" aria-disabled onClick={(e)=>e.stopPropagation()}>
        <span className="plus">+</span>
        <input className="input" type="text" placeholder="메시지 보내기..." disabled />
        <span className="mic">🎤</span>
      </div>

      {/* Ambient background blobs + gradient for dramatic entrance */}
      <div className="ambient" aria-hidden>
        <div className="bg-grad"></div>
        <div className="pop-purple"></div>
        <div className="a-blob left"></div>
        <div className="a-blob right"></div>
        <div className="a-blob bottom"></div>
        <div className="bg-fade"></div>
      </div>

      {/* Bottom floating mini-blobs (very blurry, weak, small) */}
      <div className="floaters" aria-hidden>
        <div className="floater f1" />
        <div className="floater f2" />
        <div className="floater f3" />
      </div>

      {/* Core blobs (t3 style, same sizes/positions) */}
      <div className="blob-container" aria-hidden>
        <div className="blob-wrapper top-blob">
          <div className="main-blob"><div className="ring-boost" /><div className="white-bloom" /></div>
        </div>
        <div className="blob-wrapper bottom-blob">
          <div className="main-blob">
            <div className="ring-boost" />
            <div className="white-bloom" />
            {/* gooey falling drips */}
            <div className="goo" aria-hidden>
              <div className="drip d1" />
              <div className="drip d2" />
              <div className="drip d3" />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          overflow: hidden;
          --control-w: clamp(240px, 92vw, 360px);
          --control-h: clamp(44px, 9.6vw, 56px);
          /* non-overlap sizing/placement for main blobs */
          --blob-size: 560px;
          --s-top: 1.35;
          --s-bottom: 1.45;
          --gap: 8px;
          --r-top: calc(var(--blob-size) * var(--s-top) / 2);
          --r-bottom: calc(var(--blob-size) * var(--s-bottom) / 2);
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
          transition: opacity 350ms ease, transform 350ms ease;
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

        /* composer */
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
          border-radius: 999px; /* match CTA */
          border: 1px solid rgba(0,0,0,0.06);
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
            width: var(--control-w);
            bottom: calc(30px + env(safe-area-inset-bottom, 0px));
            gap: 10px;
            padding: 0 clamp(12px, 4vw, 18px);
            border-radius: 999px;
            overflow: hidden;
          }
        }
        .container.arrived .composer { opacity: 0.95; }
        .composer .plus, .composer .mic { width: 18px; height: 18px; color: #878181; font-weight: 400; flex: none; }
        .composer .input { flex: 1; border: 0; outline: 0; background: transparent; color: #878181; font-weight: 400; font-size: 15px; line-height: 150%; }
        .composer .input::placeholder { color: #878181; opacity: 1; }

        /* ambient background elements - dramatic companions */
        .ambient { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .bg-grad {
          position: absolute;
          inset: 0;
          opacity: 0;
          background: linear-gradient(
            to top,
            rgba(206, 145, 255, 0.16) 0%,
            rgba(244, 250, 248, 0.46) 55%,
            rgba(230, 255, 241, 0.54) 100%
          );
          transition: opacity 380ms ease-out;
          transform-origin: bottom center;
          transform: translateY(25%) scaleY(0.65);
          will-change: transform, opacity;
          backface-visibility: hidden;
        }
        .container.arrived .bg-grad { opacity: 1; animation: bgSurge 900ms cubic-bezier(0.2, 0.9, 0.1, 1) both; }

        .pop-purple {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform-origin: bottom center;
          transform: translateY(40%) scaleY(0.5);
          background: radial-gradient(60% 70% at 50% 80%, rgba(235, 201, 255, 0.0) 0%, rgba(199, 125, 255, 0.36) 52%, rgba(219, 165, 255, 0.64) 78%, rgba(255, 189, 228, 0.92) 100%);
          mix-blend-mode: screen;
          filter: saturate(1.45) blur(44px) drop-shadow(0 30px 56px rgba(186, 136, 255, 0.75));
          will-change: transform, opacity, filter;
          pointer-events: none;
        }
        .container.arrived .pop-purple { animation: purpleSurge 420ms cubic-bezier(0.2, 0.9, 0.1, 1) both, purpleBreath 6s ease-in-out 0.8s infinite; }
        .a-blob {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(22px) saturate(1.05) brightness(1.03);
          opacity: 0;
          transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease;
          background: radial-gradient(70% 70% at 40% 60%, #C7FFE9 0%, #E8FFF7 60%, #F6FFFE 100%);
          will-change: transform, opacity;
        }
        .a-blob.left { left: -30%; top: 55%; transform: translate(-50%, -50%) scale(0.8); }
        .a-blob.right { right: -28%; top: 35%; transform: translate(50%, -50%) scale(0.85); }
        .a-blob.bottom { left: 50%; bottom: -32%; transform: translate(-50%, 50%) scale(0.9); }
        .container.moved .a-blob.left { left: 8%; opacity: 0.35; transform: translate(0, -50%) scale(1.1); }
        .container.moved .a-blob.right { right: 6%; opacity: 0.32; transform: translate(0, -50%) scale(1.15); }
        .container.moved .a-blob.bottom { bottom: -6%; opacity: 0.3; transform: translate(-50%, 0) scale(1.2); }
        .container.arrived .a-blob.left { left: 2%; opacity: 0.4; transform: translate(0, -50%) scale(1.25); }
        .container.arrived .a-blob.right { right: 2%; opacity: 0.36; transform: translate(0, -50%) scale(1.3); }
        .container.arrived .a-blob.bottom { bottom: -2%; opacity: 0.35; transform: translate(-50%, 0) scale(1.3); }
        .bg-fade {
          position: absolute;
          inset: -20% -20% -20% -20%;
          background: radial-gradient(60% 60% at 50% 60%, rgba(214, 243, 255, 0) 0%, rgba(214, 243, 255, 0.4) 55%, rgba(214, 243, 255, 0.65) 100%);
          opacity: 0;
          transition: opacity 1200ms ease;
          filter: blur(40px);
        }
        .container.moved .bg-fade { opacity: 0.22; }
        .container.arrived .bg-grad { opacity: 1; }
        .container.arrived .bg-fade { opacity: 0.35; }

        /* bottom floating mini blobs */
        .floaters { position: absolute; left: 0; right: 0; bottom: 0; height: 34%; pointer-events: none; z-index: 0; }
        .floater {
          position: absolute;
          width: 180px; height: 180px; border-radius: 50%;
          background: radial-gradient(68% 68% at 48% 52%, rgba(255,255,255,0.98) 0%, rgba(240,255,252,0.82) 28%, rgba(0,0,0,0) 82%);
          filter: blur(50px) saturate(1.08) brightness(1.08);
          mix-blend-mode: screen;
          opacity: 0;
          transform: translate(-50%, 0) scale(1);
          transition: opacity 600ms ease;
        }
        .floater.f1 { left: 18%; bottom: 8%; }
        .floater.f2 { left: 50%; bottom: 5%; }
        .floater.f3 { left: 80%; bottom: 9%; }
        /* start floating only at pop moment */
        .container.moved .floater { opacity: 0; animation: none; }
        .container.arrived .floater { opacity: 0.36; }
        .container.arrived .floater.f1 { animation: floatA 8.2s ease-in-out 0s infinite alternate; }
        .container.arrived .floater.f2 { animation: floatB 9.6s ease-in-out 0.1s infinite alternate; }
        .container.arrived .floater.f3 { animation: floatC 7.8s ease-in-out 0.2s infinite alternate; }
        @keyframes floatA {
          0% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(calc(-50% + 12px), -10px) scale(1.04); }
          100% { transform: translate(calc(-50% - 8px), 2px) scale(0.98); }
        }
        @keyframes floatB {
          0% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(calc(-50% - 10px), -8px) scale(1.03); }
          100% { transform: translate(calc(-50% + 6px), 4px) scale(0.99); }
        }
        @keyframes floatC {
          0% { transform: translate(-50%, 0) scale(1); }
          50% { transform: translate(calc(-50% + 8px), -12px) scale(1.05); }
          100% { transform: translate(calc(-50% - 6px), 0px) scale(0.98); }
        }

        /* main blobs */
        .blob-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; contain: layout paint; will-change: transform; }
        .blob-wrapper { position: absolute; width: var(--blob-size); height: var(--blob-size); left: 50%; will-change: transform; transform: translateZ(0); }

        /* non-overlap landing positions (kiss but no overlap) */
        .top-blob { top: calc(50% - var(--offset)); transform: translate(-50%, -50%) scale(var(--s-top)); transition: top 1100ms cubic-bezier(0.22, 1, 0.36, 1), transform 1100ms cubic-bezier(0.22, 1, 0.36, 1); opacity: 0.92; will-change: transform, top; backface-visibility: hidden; contain: layout paint; }
        .bottom-blob { top: calc(50% + var(--offset)); transform: translate(-50%, -50%) scale(var(--s-bottom)); transition: top 1100ms cubic-bezier(0.22, 1, 0.36, 1), transform 1100ms cubic-bezier(0.22, 1, 0.36, 1); will-change: top, transform; backface-visibility: hidden; contain: layout paint; }

        /* upward move + in2-like gentle growth */
        .container.moved .top-blob { top: calc(-24% - 400px); transform: translate(-50%, -50%) scale(1.2); }
        .container.moved .bottom-blob { top: calc(44% - 400px); transform: translate(-50%, -50%) scale(1.3); }
        /* large expansion with pop (moderate) */
        .container.arrived .top-blob { transform: translate(-50%, -50%) scale(1.95); animation: popGrowTop 260ms cubic-bezier(0.2, 0.9, 0.1, 1) both; transition: none; }
        .container.arrived .bottom-blob { transform: translate(-50%, -50%) scale(2.10); animation: popGrowBottom 260ms cubic-bezier(0.2, 0.9, 0.1, 1) both; transition: none; }

        /* Register CSS custom properties used by t3 effect */
        @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --center-y { syntax: '<percentage>'; inherits: true; initial-value: 33%; }
        @property --blur { syntax: '<length>'; inherits: true; initial-value: 56px; }

        /* t3-style blob mapped into main-blob */
        .main-blob {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          isolation: isolate;
          background: none;
          /* defaults from t3 */
          --center-x: 39%;
          --center-y: 33%;
          --start: 50%;
          --end: 99%;
          --blur: 56px;
          --feather: 15%;
          --inner-blur: 20px;
          --rim-tilt: 30deg;
          --tint-alpha: 0.93;
          --boost: 2.05;
          --bg: radial-gradient(circle at var(--center-x) var(--center-y), #D9FFB8 0 30%, #B9FFF3 55%, #DCD6FF 100%);
          /* animated wobble */
          --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
          --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
          --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);
          animation: none;
          filter: saturate(1.14) brightness(1.05);
        }
        .main-blob::before,
        .main-blob::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: var(--bg);
        }
        .main-blob::before {
          filter: blur(var(--inner-blur));
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), #000 0 calc(var(--start-anim) - var(--feather-anim)), transparent calc(var(--start-anim) + var(--feather-anim)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), #000 0 calc(var(--start-anim) - var(--feather-anim)), transparent calc(var(--start-anim) + var(--feather-anim)));
        }
        .main-blob::after {
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y), rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)), rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));
          background-blend-mode: normal, screen;
          filter: blur(calc(var(--blur) + var(--blur-wobble))) drop-shadow(0 24px 36px rgba(186, 136, 255, 0.4));
          opacity: 1;
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim)));
        }
        @supports (mask-composite: intersect) {
          .main-blob::after {
            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            mask-composite: intersect;
          }
        }
        @supports (-webkit-mask-composite: source-in) {
          .main-blob::after {
            -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            -webkit-mask-composite: source-in;
          }
        }
        .main-blob .ring-boost {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background:
            var(--bg),
            radial-gradient(circle at var(--center-x) var(--center-y), rgba(235, 201, 255, 0) 0 calc(var(--end) - (var(--feather) * 0.7)), rgba(235, 201, 255, calc(var(--tint-alpha) * 0.9)) calc(var(--end) + (var(--feather) * 0.3)));
          background-blend-mode: normal, screen;
          filter: blur(calc((var(--blur) + var(--blur-wobble)) * var(--boost))) drop-shadow(0 26px 40px rgba(186, 136, 255, 0.35));
          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));
        }

        /* white bloom overlay that expands wider after pop */
        .main-blob .white-bloom {
          position: absolute;
          inset: -6%;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 78%,
            rgba(255,255,255,0.0) 0 56%,
            rgba(255,255,255,0.55) 72%,
            rgba(255,255,255,0.0) 92%
          );
          mix-blend-mode: screen;
          filter: blur(18px) saturate(1.15);
          opacity: 0;
          transform: translateY(8%) scale(0.70);
          z-index: 2;
          will-change: transform, opacity, filter;
        }
        .container.arrived .white-bloom { opacity: 0.18; animation: whiteBloomWide 2200ms ease-in-out 0s infinite; }

        @keyframes whiteBloomWide {
          0%   { opacity: 0.14; transform: translateY(8%) scale(0.70); filter: blur(18px) saturate(1.15); }
          45%  { opacity: 0.28; transform: translateY(2%) scale(1.18); filter: blur(24px) saturate(1.22); }
          100% { opacity: 0.16; transform: translateY(0) scale(1.35); filter: blur(28px) saturate(1.18); }
        }

        /* gooey drips falling from bottom of main blob */
        .main-blob .goo { position: absolute; left: 50%; top: 72%; width: 66%; height: 40%; transform: translateX(-50%); filter: url(#gooey); opacity: 0; pointer-events: none; overflow: visible; }
        .container.arrived .main-blob .goo { opacity: 1; }
        .goo .drip { position: absolute; bottom: 0; width: 44px; height: 44px; border-radius: 50%; background: radial-gradient(circle at 50% 45%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0) 80%); mix-blend-mode: screen; filter: blur(14px) saturate(1.18); opacity: 0; }
        .goo .drip.d1 { left: 26%; animation: dripY 2.6s ease-in 0.0s infinite; }
        .goo .drip.d2 { left: 50%; animation: dripY 2.8s ease-in 0.4s infinite; }
        .goo .drip.d3 { left: 72%; animation: dripY 2.4s ease-in 0.2s infinite; }
        @keyframes dripY {
          0% { transform: translateY(0) scale(1.00); opacity: 0; }
          10% { opacity: 0.22; }
          70% { transform: translateY(120px) scale(0.92); opacity: 0.26; }
          100% { transform: translateY(160px) scale(0.86); opacity: 0; }
        }

        /* stronger blur and tone flow while moving, then stabilize */
        .container:not(.moved) .main-blob { animation: ringPulse 6s ease-in-out infinite; }
        .container.moved .main-blob { animation: centerFlow 1000ms ease-out 0s 1 forwards, blurRise 1100ms cubic-bezier(0.22, 1, 0.36, 1) 0s 1 forwards; }
        .container.arrived .main-blob { --center-y: 42%; --blur: 60px; --boost: 1.9; filter: saturate(1.06) brightness(1.03); animation: ringPulse 6s ease-in-out 0.4s infinite; }

        /* lighten heavy shadow during movement to reduce paint cost */
        .container.moved .main-blob::after { filter: blur(calc(var(--blur) + var(--blur-wobble))); }

        @keyframes ringPulse {
          0%, 100% {
            --start-wobble: calc(0% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 0%;
            --blur-wobble: calc(0px - var(--blur));
          }
          50% {
            --start-wobble: calc(90% - var(--start));
            --end-wobble: 0%;
            --feather-wobble: 5%;
            --blur-wobble: calc(120px - var(--blur));
          }
        }

        @keyframes centerFlow {
          0% { --center-y: 33%; }
          50% { --center-y: 54%; }
          100% { --center-y: 42%; }
        }

        /* progressively increase blur while rising */
        @keyframes blurRise {
          0% { --blur: 56px; }
          100% { --blur: 110px; }
        }

        /* background surge from bottom during rise */
        @keyframes bgSurge {
          0% { transform: translateY(25%) scaleY(0.65); opacity: 0; }
          60% { opacity: 0.85; }
          100% { transform: translateY(0) scaleY(1.05); opacity: 1; }
        }

        /* purple ring surge at pop moment */
        @keyframes purpleSurge {
          0% { transform: translateY(40%) scaleY(0.5); opacity: 0; filter: saturate(1.0) blur(44px) drop-shadow(0 18px 34px rgba(186,136,255,0.5)); }
          60% { transform: translateY(6%) scaleY(1.06); opacity: 1; filter: saturate(1.9) blur(56px) drop-shadow(0 36px 66px rgba(186,136,255,0.92)); }
          100% { transform: translateY(0) scaleY(1.0); opacity: 1; filter: saturate(1.6) blur(44px) drop-shadow(0 28px 52px rgba(186,136,255,0.78)); }
        }

        /* continuous purple breathing after arrival */
        @keyframes purpleBreath {
          0%, 100% { opacity: 0.9; filter: saturate(1.45) blur(44px) drop-shadow(0 28px 52px rgba(186,136,255,0.78)); }
          50% { opacity: 1; filter: saturate(1.85) blur(52px) drop-shadow(0 34px 66px rgba(186,136,255,0.92)); }
        }

        /* pop overshoot animations */
        @keyframes popGrowTop {
          0% { transform: translate(-50%, -50%) scale(var(--s-top)); }
          62% { transform: translate(-50%, -50%) scale(2.15); }
          100% { transform: translate(-50%, -50%) scale(1.95); }
        }
        @keyframes popGrowBottom {
          0% { transform: translate(-50%, -50%) scale(var(--s-bottom)); }
          62% { transform: translate(-50%, -50%) scale(2.30); }
          100% { transform: translate(-50%, -50%) scale(2.10); }
        }


        /* (t3 style replaces previous color layers and direct blur transitions) */

        /* responsive sizing */
        @media (max-width: 768px) {
          .container { --blob-size: 520px; }
          .top-blob { top: calc(0% - 70px); transform: translate(-50%, -50%) scale(1.3); }
          .bottom-blob { top: calc(75% - 70px); transform: translate(-50%, -50%) scale(1.4); }
          .container.moved .top-blob, .container.moved .bottom-blob { transform: translate(-50%, -50%) scale(1.5); }
        }
        @media (max-width: 480px) {
          .container { --blob-size: 480px; }
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
          .top-blob { top: calc(-2% - 70px); transform: translate(-50%, -50%) scale(1.35); }
          .bottom-blob { top: calc(72% - 70px); transform: translate(-50%, -50%) scale(1.5); }
          .container.moved .top-blob, .container.moved .bottom-blob { transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
      {/* SVG defs for gooey filter */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden>
        <defs>
          <filter id="gooey">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default In1;


