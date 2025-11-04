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
      const t = setTimeout(() => setArrived(true), 1400);
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

      {/* Ambient background blobs + gradient for dramatic entrance */}
      <div className="ambient" aria-hidden>
        <div className="a-blob left"></div>
        <div className="a-blob right"></div>
        <div className="a-blob bottom"></div>
        <div className="bg-fade"></div>
      </div>

      {/* Core blobs */}
      <div className="blob-container" aria-hidden>
        <div className="blob-wrapper top-blob">
          <div className="main-blob color1">
            <div className="tone" />
          </div>
          <div className="main-blob color2">
            <div className="tone" />
          </div>
        </div>
        <div className="blob-wrapper bottom-blob">
          <div className="main-blob color1">
            <div className="tone" />
          </div>
          <div className="main-blob color2">
            <div className="tone" />
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

        /* ambient background elements - dramatic companions */
        .ambient { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .a-blob {
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 50%;
          filter: blur(22px) saturate(1.05) brightness(1.03);
          opacity: 0;
          transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease;
          background: radial-gradient(70% 70% at 40% 60%, #C7FFE9 0%, #E8FFF7 60%, #F6FFFE 100%);
        }
        .a-blob.left { left: -30%; top: 55%; transform: translate(-50%, -50%) scale(0.8); }
        .a-blob.right { right: -28%; top: 35%; transform: translate(50%, -50%) scale(0.85); }
        .a-blob.bottom { left: 50%; bottom: -32%; transform: translate(-50%, 50%) scale(0.9); }
        .container.moved .a-blob.left { left: 8%; opacity: 0.35; transform: translate(0, -50%) scale(1); }
        .container.moved .a-blob.right { right: 6%; opacity: 0.3; transform: translate(0, -50%) scale(1.05); }
        .container.moved .a-blob.bottom { bottom: -6%; opacity: 0.28; transform: translate(-50%, 0) scale(1.1); }
        .bg-fade {
          position: absolute;
          inset: -20% -20% -20% -20%;
          background: radial-gradient(60% 60% at 50% 60%, rgba(214, 243, 255, 0) 0%, rgba(214, 243, 255, 0.4) 55%, rgba(214, 243, 255, 0.65) 100%);
          opacity: 0;
          transition: opacity 1200ms ease;
          filter: blur(40px);
        }
        .container.moved .bg-fade { opacity: 0.22; }

        /* main blobs */
        .blob-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 1; }
        .blob-wrapper { position: absolute; width: 450px; height: 450px; left: 50%; }

        .top-blob { top: calc(-8% - 70px); transform: translate(-50%, -50%) scale(1.2); transition: top 1400ms cubic-bezier(0.4, 0, 1, 1), transform 1200ms cubic-bezier(0.22, 1, 0.36, 1); opacity: 0.9; }
        .bottom-blob { top: calc(75% - 70px); transform: translate(-50%, -50%) scale(1.3); transition: top 1400ms cubic-bezier(0.4, 0, 1, 1), transform 1200ms cubic-bezier(0.22, 1, 0.36, 1); }

        /* upward move + slight scale-up (125%) and dissolving edges */
        .container.moved .top-blob { top: calc(-24% - 240px); transform: translate(-50%, -50%) scale(1.25); }
        .container.moved .bottom-blob { top: calc(44% - 240px); transform: translate(-50%, -50%) scale(1.25); }

        .main-blob { position: absolute; inset: 0; border-radius: 50%; overflow: hidden; }
        .main-blob .tone { position: absolute; inset: 0; border-radius: 50%; opacity: 0; transition: opacity 1200ms ease; }

        /* color layers */
        .main-blob.color1 {
          /* base center slightly above middle to suggest weight above */
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #B8FFF1 0%, #A2F8E1 30%, #64FFAF 60%, #A9F4DC 85%, #CFF9EE 100%);
        }
        .main-blob.color1 .tone {
          /* shifted center lower to simulate tone flow downward */
          background: radial-gradient(70.32% 70.88% at 47.16% 97.2%, #B8FFF1 0%, #9EF6E6 30%, #7AFFC4 60%, #B6FAEA 85%, #DAFFF6 100%);
        }
        .main-blob.color2 {
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #AEFFF2 0%, #9EF6E6 28%, #84FFC6 58%, #B6FAEA 85%, #D8FFF6 100%);
        }
        .main-blob.color2 .tone {
          background: radial-gradient(70.32% 70.88% at 47.16% 97.2%, #AEFFF2 0%, #94F2E4 28%, #7CF6C8 58%, #B6FAEA 85%, #D8FFF6 100%);
        }

        /* top blob sharper base, dissolves when moving */
        .top-blob .main-blob { transform: rotate(0deg); filter: blur(10px) hue-rotate(0deg) brightness(1) saturate(1); transition: filter 1400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1200ms ease; }
        .bottom-blob .main-blob { transform: rotate(-180deg); filter: blur(1px) hue-rotate(0deg) brightness(1) saturate(1); transition: filter 1400ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1200ms ease; }

        .container.moved .top-blob .main-blob { filter: blur(18px) hue-rotate(4deg) brightness(1.06) saturate(1.1); opacity: 0.92; }
        .container.moved .bottom-blob .main-blob { filter: blur(4px) hue-rotate(2deg) brightness(1.05) saturate(1.08); opacity: 0.94; }
        .container.moved .main-blob .tone { opacity: 1; }

        /* responsive sizing */
        @media (max-width: 768px) {
          .blob-wrapper { width: 500px; height: 500px; }
          .top-blob { top: calc(0% - 70px); transform: translate(-50%, -50%) scale(1.3); }
          .bottom-blob { top: calc(75% - 70px); transform: translate(-50%, -50%) scale(1.4); }
          .container.moved .top-blob, .container.moved .bottom-blob { transform: translate(-50%, -50%) scale(1.25); }
        }
        @media (max-width: 480px) {
          .blob-wrapper { width: 450px; height: 450px; }
          .title { font-size: 40px; }
          .subtitle { font-size: 15px; }
          .top-blob { top: calc(-2% - 70px); transform: translate(-50%, -50%) scale(1.35); }
          .bottom-blob { top: calc(72% - 70px); transform: translate(-50%, -50%) scale(1.5); }
          .container.moved .top-blob, .container.moved .bottom-blob { transform: translate(-50%, -50%) scale(1.25); }
        }
      `}</style>
    </div>
  );
};

export default In1;


