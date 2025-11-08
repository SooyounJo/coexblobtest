import React from 'react';

const UI = ({ onStart }) => {
  return (
    <>
      {/* 텍스트 오버레이 */}
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>
      <button className="cta" onClick={(e) => { e.stopPropagation(); onStart?.(); }}>
        시작하기
      </button>

      {/* 전환 후 상단 중앙 안내 문구 */}
      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>

      {/* 비활성화된 입력 박스 */}
      <div className="composer" aria-disabled onClick={(e)=>e.stopPropagation()}>
        <span className="plus">+</span>
        <input className="input" type="text" placeholder="메시지 보내기..." disabled />
        <span className="mic">🎤</span>
      </div>

      {/* local-scoped styles */}
      <style jsx>{`
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

        .composer .plus, .composer .mic { width: 18px; height: 18px; color: #878181; font-weight: 400; flex: none; }
        .composer .input { flex: 1; border: 0; outline: 0; background: transparent; color: #878181; font-weight: 400; font-size: 15px; line-height: 150%; }
        .composer .input::placeholder { color: #878181; opacity: 1; }

        /* responsive (titles only) */
        @media (max-width: 768px) {
          .title { font-size: 48px; }
          .subtitle { font-size: 16px; }
        }
        @media (max-width: 480px) {
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
        }
      `}</style>

      {/* global selectors depending on container state */}
      <style jsx global>{`
        .container.moved .hero { opacity: 0; transform: translateY(18px); filter: none; }
        .container.moved .cta { opacity: 0; transform: translateX(-50%) translateY(18px); filter: none; pointer-events: none; }
        .container.arrived .greet { opacity: 1; transform: translate(-50%, 0); }
        .container.arrived .composer { opacity: 0.95; }
      `}</style>
    </>
  );
};

export default UI;


