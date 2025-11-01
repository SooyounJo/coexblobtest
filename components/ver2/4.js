import React, { useState, useEffect } from 'react';

const Ver2_4 = () => {
  const [moved, setMoved] = useState(false);
  const [b3, setB3] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setB3(true), 1400);
      return () => clearTimeout(t);
    }
    setB3(false);
  }, [moved]);

  return (
    <div className={`container ${moved ? 'moved' : ''} ${b3 ? 'b3' : ''}`} onClick={() => setMoved(v => !v)} onTouchStart={() => setMoved(v => !v)}>
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
          top: -5%;
          transform: translate(-50%, -50%) scale(1.2);
          transition: top 1.4s cubic-bezier(0.22, 1, 0.36, 1), left 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* 아래쪽 블롭 - 하단에 위치, 더 크게 */
        .bottom-blob {
          top: 78%;
          transform: translate(-50%, -50%) scale(1.3);
          transition: top 1.4s cubic-bezier(0.22, 1, 0.36, 1), left 1.4s cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* moved: 위로 이동 + 살짝 좌측 */
        .container.moved .top-blob { top: calc(-24% - 90px); left: 49%; }
        .container.moved .bottom-blob { top: calc(46% - 90px); left: 49%; }

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
        @keyframes trailFade { 0% { opacity: 0.28; filter: blur(26px); } 100% { opacity: 0; filter: blur(40px); } }
        .main-blob {
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          border-radius: 50%;
        }
        /* 첫 번째 색상 - 기존 그라디언트 (명도↑ 채도↑) */
        .main-blob.color1 {
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFEC4 0%, #B7FFD0 30%, #64FFAF 60%, #B7FEDC 85%, #EDFFE5 100%);
          transition: filter 2s ease, box-shadow 2s ease;
        }
        /* 두 번째 색상 - 이미지 그라디언트 (명도↑ 채도↑) */
        .main-blob.color2 {
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #B8FFF0 0%, #F7FFC8 28%, #84FFC6 58%, #C8FFEA 85%, #EEFFF6 100%);
          transition: filter 2s ease, box-shadow 2s ease;
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
        /* opacity fade animations removed */

        /* B3 스타일로 변환 (moved 완료 후 b3 클래스에서 2초간 변화) */
        .container.b3 .main-blob {
          /* subtle purple glow stroke */
          box-shadow:
            0 0 0 1.5px rgba(176, 160, 255, 0.55),
            0 0 18px 3px rgba(176, 160, 255, 0.45),
            0 0 48px 14px rgba(176, 160, 255, 0.25);
        }
        .container.b3 .top-blob .main-blob,
        .container.b3 .bottom-blob .main-blob {
          transform: rotate(-180deg);
        }
        .container.b3 .top-blob .main-blob.color1,
        .container.b3 .bottom-blob .main-blob.color1 {
          filter: blur(0px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);
                  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);
        }
        .container.b3 .top-blob .main-blob.color2,
        .container.b3 .bottom-blob .main-blob.color2 {
          filter: blur(25px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);
                  mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);
        }
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
        /* 반응형 디자인 */
        @media (max-width: 768px) {
          .blob-wrapper {
            width: 500px;
            height: 500px;
          }
          .top-blob {
            top: 0%;
            transform: translate(-50%, -50%) scale(1.3);
          }
          .bottom-blob {
            top: 75%;
            transform: translate(-50%, -50%) scale(1.4);
          }
        }
        @media (max-width: 480px) {
          .blob-wrapper {
            width: 450px;
            height: 450px;
          }
          .top-blob {
            top: -2%;
            transform: translate(-50%, -50%) scale(1.4);
          }
          .bottom-blob {
            top: 72%;
            transform: translate(-50%, -50%) scale(1.5);
          }
        }
      `}</style>
    </div>
  );
};

export default Ver2_4;
