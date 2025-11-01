import React, { useState, useEffect } from 'react';



const Ver2_3 = () => {

  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 2000);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  return (

    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''}`}>

      {/* 텍스트 오버레이 */}
      <div className="hero">
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>
      <button className="cta" onClick={(e) => { e.stopPropagation(); setMoved(true); }}>
        시작하기
      </button>
      <button className="backBtn" onClick={(e) => { e.stopPropagation(); setMoved(false); setArrived(false); }}>
        ← 뒤로가기
      </button>
      {/* 전환 후 상단 중앙 안내 문구 */}
      <div className="greet">
        <div className="greet-line1">안녕하세요! 이솔이에요</div>
        <div className="greet-line2">코엑스 안내를 도와드릴게요</div>
      </div>
      {/* 비활성화된 입력 박스 (이미지처럼) */}
      <div className="composer" onClick={(e) => e.stopPropagation()} aria-disabled>
        <span className="plus">+</span>
        <input className="input" type="text" placeholder="메시지 보내기..." disabled />
        <span className="mic">🎤</span>
      </div>

      <div className="blob-container">

        {/* 위쪽 블롭 */}

        <div className="blob-wrapper top-blob">

          <div className="trail-blob t1"></div>

          <div className="trail-blob t2"></div>

          <div className="main-blob color1"></div>

          <div className="main-blob color2"></div>

        </div>

        

        {/* 아래쪽 블롭 */}

        <div className="blob-wrapper bottom-blob">

          <div className="trail-blob t1"></div>

          <div className="trail-blob t2"></div>

          <div className="main-blob color1"></div>

          <div className="main-blob color2"></div>

        </div>

      </div>

      <style jsx>{`

        .container {

          width: 100%;

          height: 100vh;

          background: #FFFFFF;

          position: relative;

          overflow: hidden;

        }

        /* transition visibility between states */
        .hero, .cta { transition: opacity 350ms ease, transform 350ms ease; }
        .container.moved .hero, .container.moved .cta { opacity: 0; transform: translateY(6px); pointer-events: none; }

        .greet {
          position: absolute;
          top: 96px;
          left: 50%;
          transform: translate(-50%, 6px);
          text-align: center;
          color: #111; /* black */
          z-index: 12;
          mix-blend-mode: normal; /* no blend */
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
          left: calc(50% - 376px/2);
          top: 760px;
          transform: none;
          width: 376px;
          height: 44px;
          border-radius: 999px;
          background: rgba(240, 230, 250, 0.85);
          box-shadow: 0 8px 22px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.75);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          z-index: 13;
          opacity: 0;
          transition: opacity 350ms ease;
          pointer-events: none;
        }
        @media (max-width: 420px) { .composer { left: 50%; transform: translateX(-50%); width: calc(100vw - 24px); top: calc(100vh - 92px); } }
        .container.moved .composer { opacity: 1; pointer-events: none; }
        .composer .plus, .composer .mic { color: rgba(0,0,0,0.5); font-weight: 700; }
        .composer .input { flex: 1; border: 0; outline: 0; background: transparent; color: rgba(0,0,0,0.55); font-weight: 600; font-size: 15px; }
        .composer .input::placeholder { color: rgba(0,0,0,0.45); }

        /* hero copy */
        .hero {
          position: absolute;
          bottom: 150px;
          left: 16px;
          right: 16px;
          color: #111;
          z-index: 12;
          mix-blend-mode: normal; /* no blend */
          opacity: 1;
          pointer-events: none; /* 버튼만 상호작용 */
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }

        .cta {
          position: absolute;
          left: 50%;
          bottom: 48px;
          transform: translateX(-50%);
          width: calc(100% - 32px);
          max-width: 360px;
          height: 56px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7);
          color: #111;
          font-size: 17px;
          font-weight: 800;
          cursor: pointer;
          z-index: 13;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }

        .backBtn {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.8);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: #111;
          font-weight: 700;
          cursor: pointer;
          z-index: 14;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }

        .blob-container {

          position: absolute;

          top: 0;

          left: 0;

          right: 0;

          bottom: 0;

          display: flex;

          align-items: center;

          justify-content: center;

        }

        .blob-wrapper {

          position: absolute;

          width: 450px;

          height: 450px;

          left: 50%;

        }

        /* 위쪽 블롭 - 상단에 위치 */

        .top-blob {

          top: var(--initial-top-top-blob);

          transform: translate(-50%, -50%) scale(1.2);

          /* top: slower ease-in (starts slow → accelerates); transform grows first; left slides after a short delay */
          transition: top 2s cubic-bezier(0.4, 0, 1, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), left 0.9s cubic-bezier(0.22, 1, 0.36, 1);

        }

        /* 아래쪽 블롭 - 하단에 위치, 더 크게 */

        .bottom-blob {

          top: var(--initial-top-bottom-blob);

          transform: translate(-50%, -50%) scale(1.3);

          transition: top 2s cubic-bezier(0.4, 0, 1, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1), left 0.9s cubic-bezier(0.22, 1, 0.36, 1);

        }

        /* STEP 1: move UP only */
        .container.moved .top-blob { top: calc(-24% - 400px); left: 50%; }
        .container.moved .bottom-blob { top: calc(44% - 400px); left: 50%; }

        /* STEP 2: grow big (no lateral slide) */
        .container.arrived .top-blob { left: 50%; transform: translate(-50%, -50%) scale(2.2); }
        .container.arrived .bottom-blob { left: 50%; transform: translate(-50%, -50%) scale(2.4); }

        /* 잔상(트레일) */
        .trail-blob {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #B8FFF1 0%, #A5F3DD 30%, #64FFAF 60%, #A9F4DC 85%, #CFF9EE 100%);
          opacity: 0;
          pointer-events: none;
          z-index: 0;
        }
        .top-blob .trail-blob { transform: rotate(0deg); filter: blur(26px); }
        .bottom-blob .trail-blob { transform: rotate(-180deg); filter: blur(10px); }

        .container.moved .top-blob .trail-blob.t1 { animation: trailFade 1.3s ease-out 0s 1 forwards; }
        .container.moved .top-blob .trail-blob.t2 { animation: trailFade 1.5s ease-out 0.06s 1 forwards; }
        .container.moved .bottom-blob .trail-blob.t1 { animation: trailFade 1.3s ease-out 0s 1 forwards; }
        .container.moved .bottom-blob .trail-blob.t2 { animation: trailFade 1.5s ease-out 0.06s 1 forwards; }

        @keyframes trailFade {
          0% { opacity: 0.28; filter: blur(26px); }
          100% { opacity: 0; filter: blur(40px); }
        }

        .main-blob {

          position: absolute;

          width: 100%;

          height: 100%;

          left: 0;

          top: 0;

          border-radius: 50%;

          z-index: 2;

        }

        /* 첫 번째 색상 - 기존 그라디언트 (명도↑ 채도↑) */

        .main-blob.color1 {

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #B8FFF1 0%, #A2F8E1 30%, #64FFAF 60%, #A9F4DC 85%, #CFF9EE 100%);

        }

        /* 두 번째 색상 - 이미지 그라디언트 (명도↑ 채도↑) */

        .main-blob.color2 {

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #AEFFF2 0%, #9EF6E6 28%, #84FFC6 58%, #B6FAEA 85%, #D8FFF6 100%);

        }

        /* 위쪽 블롭의 main-blob은 회전 없음 */

        .top-blob .main-blob {

          transform: rotate(0deg);

          filter: blur(35px) hue-rotate(0deg) brightness(1) saturate(1);

          animation: topColorShift 8s ease-in-out infinite;

        }

        .top-blob .main-blob.color2 {

          animation: topColorShift 10s ease-in-out infinite;

        }

        /* 아래쪽 블롭의 main-blob은 180도 회전 */

        .bottom-blob .main-blob {

          transform: rotate(-180deg);

          filter: blur(5px) hue-rotate(0deg) brightness(1) saturate(1);

          animation: bottomColorShift 8s ease-in-out infinite;

        }

        .bottom-blob .main-blob.color2 {

          animation: bottomColorShift 10s ease-in-out infinite;

        }

        /* (opacity) 페이드 키프레임 제거, 위로 이동은 transition으로 처리 */

        @keyframes topColorShift {

          0%, 100% {

            filter: blur(35px) hue-rotate(0deg) brightness(1) saturate(1);

          }

          25% {

            filter: blur(37px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

          50% {

            filter: blur(40px) hue-rotate(10deg) brightness(1.15) saturate(1.2);

          }

          75% {

            filter: blur(37px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

        }

        @keyframes bottomColorShift {

          0%, 100% {

            filter: blur(5px) hue-rotate(0deg) brightness(1) saturate(1);

          }

          25% {

            filter: blur(6px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

          50% {

            filter: blur(7px) hue-rotate(10deg) brightness(1.15) saturate(1.2);

          }

          75% {

            filter: blur(6px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

        }

        /* Responsive adjustments for the final position */
        .top-blob {
          --initial-top-top-blob: calc(-8% - 70px);
          --final-top-top-blob: 20%; /* Adjusted for being slightly above center */
        }

        .bottom-blob {
          --initial-top-bottom-blob: calc(75% - 70px);
          --final-top-bottom-blob: 45%; /* Adjusted for being slightly above center and clipped */
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .blob-wrapper {
            width: 500px;
            height: 500px;
          }
          .title { font-size: 48px; }
          .subtitle { font-size: 16px; }
          .top-blob {
            --initial-top-top-blob: calc(0% - 70px);
            --final-top-top-blob: 25%; /* Mobile adjustment */
          }
          .bottom-blob {
            --initial-top-bottom-blob: calc(75% - 70px);
            --final-top-bottom-blob: 50%; /* Mobile adjustment */
          }
        }
        @media (max-width: 480px) {
          .blob-wrapper {
            width: 450px;
            height: 450px;
          }
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
          .top-blob {
            --initial-top-top-blob: calc(-2% - 70px);
            --final-top-top-blob: 20%; /* Mobile adjustment */
          }
          .bottom-blob {
            --initial-top-bottom-blob: calc(72% - 70px);
            --final-top-bottom-blob: 40%; /* Mobile adjustment */
          }
        }

      `}</style>

    </div>

  );

};

export default Ver2_3;
