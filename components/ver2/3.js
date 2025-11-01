import React, { useState, useEffect } from 'react';



const Ver2_3 = () => {

  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 1400);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  return (

    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''}`} onClick={() => setMoved(v => !v)} onTouchStart={() => setMoved(v => !v)}>

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

          height: 100%;

          background: #FFF5E8;

          position: relative;

          overflow: hidden;

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

          transition: top 1.4s cubic-bezier(0.22, 1, 0.36, 1), left 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

        }

        /* 아래쪽 블롭 - 하단에 위치, 더 크게 */

        .bottom-blob {

          top: var(--initial-top-bottom-blob);

          transform: translate(-50%, -50%) scale(1.3);

          transition: top 1.4s cubic-bezier(0.22, 1, 0.36, 1), left 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);

        }

        /* moved 상태에서 위로만 이동하여 멈춤 - 40px 추가 상승 + 살짝 좌측 */
        .container.moved .top-blob { top: calc(-24% - 260px); left: calc(49% - 120px); }
        .container.moved .bottom-blob { top: calc(46% - 260px); left: calc(49% - 120px); }

        /* arrived: 도착 후 살짝 커지기 */
        .container.arrived .top-blob { transform: translate(-50%, -50%) scale(1.34); }
        .container.arrived .bottom-blob { transform: translate(-50%, -50%) scale(1.42); }

        /* 잔상(트레일) */
        .trail-blob {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFEC4 0%, #B7FFD0 30%, #64FFAF 60%, #B7FEDC 85%, #EDFFE5 100%);
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

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFEC4 0%, #B7FFD0 30%, #64FFAF 60%, #B7FEDC 85%, #EDFFE5 100%);

        }

        /* 두 번째 색상 - 이미지 그라디언트 (명도↑ 채도↑) */

        .main-blob.color2 {

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #B8FFF0 0%, #F7FFC8 28%, #84FFC6 58%, #C8FFEA 85%, #EEFFF6 100%);

        }

        /* 위쪽 블롭의 main-blob은 회전 없음 */

        .top-blob .main-blob {

          transform: rotate(0deg);

          filter: blur(35px) hue-rotate(0deg) brightness(1) saturate(1);

          animation: topColorShift 12s ease-in-out infinite;

        }

        .top-blob .main-blob.color2 {

          animation: topColorShift 15s ease-in-out infinite;

        }

        /* 아래쪽 블롭의 main-blob은 180도 회전 */

        .bottom-blob .main-blob {

          transform: rotate(-180deg);

          filter: blur(5px) hue-rotate(0deg) brightness(1) saturate(1);

          animation: bottomColorShift 12s ease-in-out infinite;

        }

        .bottom-blob .main-blob.color2 {

          animation: bottomColorShift 15s ease-in-out infinite;

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
          --initial-top-top-blob: -5%;
          --final-top-top-blob: 20%; /* Adjusted for being slightly above center */
        }

        .bottom-blob {
          --initial-top-bottom-blob: 78%;
          --final-top-bottom-blob: 45%; /* Adjusted for being slightly above center and clipped */
        }

        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .blob-wrapper {
            width: 500px;
            height: 500px;
          }
          .top-blob {
            --initial-top-top-blob: 0%;
            --final-top-top-blob: 25%; /* Mobile adjustment */
          }
          .bottom-blob {
            --initial-top-bottom-blob: 75%;
            --final-top-bottom-blob: 50%; /* Mobile adjustment */
          }
        }
        @media (max-width: 480px) {
          .blob-wrapper {
            width: 450px;
            height: 450px;
          }
          .top-blob {
            --initial-top-top-blob: -2%;
            --final-top-top-blob: 20%; /* Mobile adjustment */
          }
          .bottom-blob {
            --initial-top-bottom-blob: 72%;
            --final-top-bottom-blob: 40%; /* Mobile adjustment */
          }
        }

      `}</style>

    </div>

  );

};

export default Ver2_3;
