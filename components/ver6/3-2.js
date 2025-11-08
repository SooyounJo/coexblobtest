import React from 'react';
import BlobMotion from '../ver5/n1/BlobMotion';

const miniBlobStyles = {
  '--center-x': '39%',
  '--center-y': '33%',
  '--start': '50%',
  '--end': '99%',
  '--feather': '15%',
  '--rim-tilt': '30deg',
  '--bg': `radial-gradient(circle at 42% 28%, #d9ffb8 0%, #c4ff82 34%, #8df25a 68%, #57cf41 100%)`,
  '--tint-alpha': 0.65,
  '--boost': 1.6,
};

const Ver6_3_2 = () => {
  return (
    <div className="container moved arrived wave-orbit">
      <BlobMotion />
      <div className="mini-layer" aria-hidden>
        <div className="mini-blob m1" style={miniBlobStyles} />
        <div className="mini-blob m2" style={miniBlobStyles} />
      </div>
      <div className="glass-modal">
        <div className="glass-content">
          <div className="avatar placeholder" />
          <h3>캐릭터 라이선싱 페어</h3>
          <p>
            다양한 캐릭터와 체험 부스를 온 가족과 함께
            <br />&nbsp;&nbsp;&nbsp;즐겨보세요.
          </p>
          <button className="primary">코엑스 홈페이지 바로가기</button>
        </div>
      </div>
      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
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
        .mini-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 6;
          filter: none;
        }
        .mini-blob {
          position: absolute;
          border-radius: 50%;
          width: clamp(140px, 24vw, 200px);
          height: clamp(140px, 24vw, 200px);
          background: var(--bg);
          opacity: 0.62;
          mix-blend-mode: normal;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.7),
            0 28px 42px rgba(32, 66, 86, 0.26);
          animation: miniFloat 15s ease-in-out infinite;
        }
        .mini-blob.m1 {
          top: 18%;
          left: 12%;
          animation-delay: 0s;
        }
        .mini-blob.m2 {
          bottom: 10%;
          right: 14%;
          animation-delay: 3.2s;
        }
        @keyframes miniFloat {
          0% { transform: translate3d(0, 0, 0) scale(0.95); opacity: 0.24; }
          25% { transform: translate3d(12px, -18px, 0) scale(1.04); opacity: 0.34; }
          50% { transform: translate3d(-8px, -6px, 0) scale(1.02); opacity: 0.28; }
          75% { transform: translate3d(14px, 16px, 0) scale(1.07); opacity: 0.36; }
          100% { transform: translate3d(0, 0, 0) scale(0.95); opacity: 0.24; }
        }
        .glass-modal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 12;
          padding: 0 clamp(16px, 6vw, 48px);
        }
        .glass-content {
          width: min(260px, 70vw);
          aspect-ratio: 142.41 / 216.74;
          display: grid;
          gap: clamp(12px, 3vw, 18px);
          padding: clamp(17px, 4.4vw, 22px);
          border-radius: 26px;
          background:
            linear-gradient(148deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.04) 100%),
            rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.64);
          box-shadow:
            0 48px 72px rgba(22, 54, 80, 0.36),
            inset 0 1px 0 rgba(255,255,255,0.98),
            inset 0 -18px 42px rgba(255,255,255,0.22);
          backdrop-filter: blur(38px) saturate(2.6) contrast(1.08);
          text-align: center;
          color: #0f2420;
          pointer-events: auto;
          position: relative;
          overflow: hidden;
        }
        .glass-content::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.86) 0%, rgba(255,255,255,0.35) 58%, rgba(255,255,255,0.06) 100%),
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 62%),
            radial-gradient(circle at 84% 16%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 58%);
          mix-blend-mode: screen;
          opacity: 0.9;
          pointer-events: none;
        }
        .glass-content::after {
          content: '';
          position: absolute;
          inset: -34%;
          background:
            radial-gradient(circle at 12% 14%, rgba(255,255,255,0.32), transparent 62%),
            radial-gradient(circle at 88% 82%, rgba(110,214,255,0.28), transparent 70%),
            rgba(255,255,255,0.04);
          opacity: 0.32;
          filter: blur(70px) saturate(1.5);
          pointer-events: none;
        }
        .avatar {
          width: 100%;
          border-radius: 18px;
          overflow: hidden;
          background: rgba(255,255,255,0.18);
          display: grid;
          place-items: center;
          backdrop-filter: blur(10px) saturate(1.6);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.68);
        }
        .placeholder {
          aspect-ratio: 1 / 1;
          border-radius: 18px;
          border: 1px dashed rgba(255,255,255,0.48);
          background: rgba(255,255,255,0.12);
        }
        .glass-content h3 {
          margin: 0;
          font-size: clamp(15px, 4vw, 18px);
          font-weight: 800;
        }
        .glass-content p {
          margin: 0;
          font-size: clamp(12px, 3vw, 14px);
          font-weight: 500;
          opacity: 0.82;
          line-height: 1.5;
        }
        .primary {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.7);
          background:
            linear-gradient(165deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.32) 58%, rgba(255,255,255,0.1) 100%),
            rgba(255,255,255,0.22);
          box-shadow:
            0 26px 40px rgba(30, 76, 86, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.86);
          backdrop-filter: blur(26px) saturate(1.75);
          color: #103330;
          font-weight: 700;
          font-size: clamp(11px, 3.1vw, 13px);
          padding: clamp(7px, 2.2vw, 10px) clamp(20px, 5.4vw, 26px);
          cursor: pointer;
          transition: box-shadow 160ms ease, transform 160ms ease;
          position: relative;
          overflow: hidden;
        }
        .primary::before {
          content: '';
          position: absolute;
          inset: 18% 18% 38% 18%;
          border-radius: inherit;
          background: rgba(255,255,255,0.65);
          filter: blur(14px);
          opacity: 0.6;
          pointer-events: none;
        }
        .primary:hover {
          box-shadow:
            0 12px 22px rgba(30, 76, 78, 0.26),
            inset 0 1px 0 rgba(255,255,255,0.55);
          transform: translateY(-1px);
        }
        .primary:focus { outline: none; }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default Ver6_3_2;

