import React, { useState, useEffect } from 'react';



const Ver2_2 = () => {
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

      {/* (no hero/cta) - blobs only */}
 
      <div className="blob-container">

        {/* 위쪽 블롭 */}

        <div className="blob-wrapper top-blob">

          <div className="main-blob color1"></div>

          <div className="main-blob color2"></div>

        </div>

        

        {/* 아래쪽 블롭 */}

        <div className="blob-wrapper bottom-blob">

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
        }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }

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
          transition: opacity 300ms ease, transform 300ms ease;
        }

        .hero, .cta { transition: opacity 350ms ease, transform 350ms ease; }
        .container.moved .hero, .container.moved .cta { opacity: 0; transform: translateY(6px); pointer-events: none; }

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
        }
        .greet-line1 { font-size: 20px; font-weight: 800; margin-bottom: 6px; }
        .greet-line2 { font-size: 18px; font-weight: 700; opacity: 0.9; }
        .container.arrived .greet { opacity: 1; transform: translate(-50%, 0); }

        .composer {
          position: absolute;
          left: calc(50% - 376px/2);
          top: 785px;
          transform: none;
          width: 376px;
          height: 44px;
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 9px 20px;
          gap: 300px;
          background: linear-gradient(90deg, rgba(211, 178, 226, 0.407) 0%, rgba(255, 255, 255, 0.55) 76.44%, rgba(223, 199, 234, 0.3245) 100%);
          border-radius: 22px;
          z-index: 12;
          opacity: 0;
          pointer-events: none;
          transition: opacity 600ms ease-in;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        @media (max-width: 480px) {
          .composer {
            position: fixed;
            left: 50%;
            transform: translateX(-50%);
            width: calc(100vw - 24px);
            top: auto;
            bottom: max(12px, env(safe-area-inset-bottom, 12px));
            gap: 10px;
            padding: 9px 14px;
          }
        }
        .container.arrived .composer { opacity: 1; }
        .composer .plus, .composer .mic { width: 18px; height: 18px; color: #878181; font-weight: 400; flex: none; }
        .composer .input { flex: 1; border: 0; outline: 0; background: transparent; color: #878181; font-weight: 400; font-size: 15px; line-height: 150%; }
        .composer .input::placeholder { color: #878181; opacity: 1; }

        /* (no hero/cta) - blobs only */

        .blob-container {

          position: absolute;

          top: 0;

          left: 0;

          right: 0;

          bottom: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          z-index: 1; /* blobs behind text/buttons */

        }

        .blob-wrapper {

          position: absolute;

          width: 450px;

          height: 450px;

          left: 50%;

        }

        /* 위쪽 블롭 - 상단에 위치 */

        .top-blob {

          top: calc(-8% - 70px);

          transform: translate(-50%, -50%) scale(1.2);

          transition: top 2s cubic-bezier(0.4, 0, 1, 1), left 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);

          opacity: 0.78; /* 상단 블롭 전체 투명도 약간 낮춤 */

        }

        /* 아래쪽 블롭 - 하단에 위치, 더 크게 */

        .bottom-blob {

          top: calc(75% - 70px);

          transform: translate(-50%, -50%) scale(1.3);

          transition: top 2s cubic-bezier(0.4, 0, 1, 1), left 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 1.5s cubic-bezier(0.22, 1, 0.36, 1);

        }

        /* moved: 위로 이동 (중앙축) */
        .container.moved .top-blob { top: calc(-24% - 400px); left: 50%; }

        .container.moved .bottom-blob { top: calc(44% - 400px); left: 50%; }

        /* arrived: 도착 후 확대 */
        .container.arrived .top-blob { left: 50%; transform: translate(-50%, -50%) scale(2.2); }
        .container.arrived .bottom-blob { left: 50%; transform: translate(-50%, -50%) scale(2.4); }

        .main-blob {

          position: absolute;

          width: 100%;

          height: 100%;

          left: 0;

          top: 0;

          border-radius: 50%;

          box-shadow: 0 0 0 1px rgba(255,255,255,0.35), 0 0 10px rgba(255,255,255,0.15);

        }

        /* 첫 번째 색상 - 기존 그라디언트 (명도↑ 채도↑) */

        .main-blob.color1 {
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFEC4 0%, #B7FFD0 30%, #64FFAF 60%, #B7FEDC 85%, #EDFFE5 100%);
          animation: fadeInOut1 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
        }

        /* 두 번째 색상 - 이미지 그라디언트 (명도↑ 채도↑) */

        .main-blob.color2 {

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #99FFEE 0%, #FFFFBB 38%, #99FFEE 76%, #99FF99 91%, #99FFEE 100%);

          animation: fadeInOut2 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

        }

        /* 위쪽 블롭의 main-blob은 회전 없음 */

        .top-blob .main-blob {

          transform: rotate(0deg);

          filter: blur(10px) hue-rotate(0deg) brightness(1) saturate(1);

          transition: filter 1.6s cubic-bezier(0.22, 1, 0.36, 1);

          animation: fadeInOut1 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite, topColorShift 12s ease-in-out infinite;

        }

        .top-blob .main-blob.color2 {

          animation: fadeInOut2 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite, topColorShift 15s ease-in-out infinite;

        }

        /* 아래쪽 블롭의 main-blob은 180도 회전 */

        .bottom-blob .main-blob {

          transform: rotate(-180deg);

          filter: blur(1px) hue-rotate(0deg) brightness(1) saturate(1);

          transition: filter 1.6s cubic-bezier(0.22, 1, 0.36, 1);

          animation: fadeInOut1 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite, bottomColorShift 12s ease-in-out infinite;

        }

        .bottom-blob .main-blob.color2 {

          animation: fadeInOut2 10s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite, bottomColorShift 15s ease-in-out infinite;

        }

        /* moved: 더 블러리해지도록 */

        .container.moved .top-blob .main-blob { filter: blur(14px) hue-rotate(0deg) brightness(1.02) saturate(1.05); }

        .container.moved .bottom-blob .main-blob { filter: blur(2px) hue-rotate(0deg) brightness(1.02) saturate(1.05); }

        @keyframes fadeInOut1 {

          0%, 100% {

            opacity: 1;

          }

          50% {

            opacity: 0;

          }

        }

        @keyframes fadeInOut2 {

          0%, 100% {

            opacity: 0;

          }

          50% {

            opacity: 1;

          }

        }

        @keyframes topColorShift {

          0%, 100% {

            filter: blur(10px) hue-rotate(0deg) brightness(1) saturate(1);

          }

          25% {

            filter: blur(12px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

          50% {

            filter: blur(14px) hue-rotate(10deg) brightness(1.15) saturate(1.2);

          }

          75% {

            filter: blur(12px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

        }

        @keyframes bottomColorShift {

          0%, 100% {

            filter: blur(1px) hue-rotate(0deg) brightness(1) saturate(1);

          }

          25% {

            filter: blur(1.3px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

          50% {

            filter: blur(1.6px) hue-rotate(10deg) brightness(1.15) saturate(1.2);

          }

          75% {

            filter: blur(1.3px) hue-rotate(5deg) brightness(1.08) saturate(1.1);

          }

        }

        /* 반응형 디자인 */

        @media (max-width: 768px) {

          .blob-wrapper {

            width: 500px;

            height: 500px;

          }

          .top-blob {

            top: calc(0% - 70px);

            transform: translate(-50%, -50%) scale(1.3);

          }

          .bottom-blob {

            top: calc(75% - 70px);

            transform: translate(-50%, -50%) scale(1.4);

          }

        }

        @media (max-width: 480px) {

          .blob-wrapper {

            width: 450px;

            height: 450px;

          }

          .top-blob {

            top: calc(-2% - 70px);

            transform: translate(-50%, -50%) scale(1.4);

          }

          .bottom-blob {

            top: calc(72% - 70px);

            transform: translate(-50%, -50%) scale(1.5);

          }

        }

      `}</style>

    </div>

  );

};

export default Ver2_2;
