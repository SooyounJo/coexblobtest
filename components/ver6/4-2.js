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

const Ver6_4_2 = () => {
  return (
    <div className="container moved arrived wave-orbit">
      <BlobMotion />
      <div className="mini-layer" aria-hidden>
        <div className="mini-blob m1" style={miniBlobStyles} />
        <div className="mini-blob m2" style={miniBlobStyles} />
      </div>
      <div className="top-actions">
        <button className="top-btn" onClick={(e) => e.preventDefault()}>
          라이트 가이드 보기
        </button>
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
          background:
            radial-gradient(circle at 50% -18%, rgba(110, 178, 255, 0.35) 0%, rgba(34, 58, 104, 0.52) 30%, rgba(6, 10, 20, 0.94) 78%),
            linear-gradient(190deg, #04070f 0%, #000508 100%);
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
          opacity: 0.58;
          mix-blend-mode: screen;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.6),
            0 32px 48px rgba(6, 12, 24, 0.42);
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
          0% { transform: translate3d(0, 0, 0) scale(0.95); opacity: 0.42; }
          25% { transform: translate3d(12px, -18px, 0) scale(1.06); opacity: 0.56; }
          50% { transform: translate3d(-8px, -6px, 0) scale(1.03); opacity: 0.48; }
          75% { transform: translate3d(14px, 16px, 0) scale(1.08); opacity: 0.6; }
          100% { transform: translate3d(0, 0, 0) scale(0.95); opacity: 0.42; }
        }
        .glass-modal {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 18;
          padding: 0 clamp(16px, 6vw, 48px);
        }
        .glass-content {
          width: min(260px, 70vw);
          aspect-ratio: 142.41 / 216.74;
          display: grid;
          gap: clamp(12px, 3vw, 18px);
          padding: clamp(19px, 4.6vw, 24px);
          border-radius: 28px;
          background:
            linear-gradient(155deg, rgba(24, 40, 78, 0.78) 0%, rgba(12, 20, 42, 0.68) 48%, rgba(4, 8, 20, 0.88) 100%),
            rgba(6, 10, 20, 0.82);
          border: 1px solid rgba(134, 198, 255, 0.34);
          box-shadow:
            0 42px 64px rgba(4, 8, 18, 0.72),
            inset 0 1px 0 rgba(172, 228, 255, 0.28),
            inset 0 -18px 44px rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(30px) saturate(1.42) contrast(1.24);
          text-align: center;
          color: rgba(222, 236, 255, 0.92);
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
            linear-gradient(140deg, rgba(190, 236, 255, 0.42) 0%, rgba(120, 186, 255, 0.18) 48%, rgba(74, 132, 220, 0.06) 100%),
            radial-gradient(circle at 18% 16%, rgba(166, 220, 255, 0.48) 0%, rgba(118, 182, 255, 0) 60%),
            radial-gradient(circle at 82% 12%, rgba(166, 220, 255, 0.36) 0%, rgba(130, 186, 255, 0) 58%);
          mix-blend-mode: screen;
          opacity: 0.78;
          pointer-events: none;
        }
        .glass-content::after {
          content: '';
          position: absolute;
          inset: -30%;
          background:
            radial-gradient(circle at 14% 18%, rgba(108, 182, 255, 0.36), transparent 68%),
            radial-gradient(circle at 86% 82%, rgba(36, 68, 128, 0.58), transparent 74%),
            rgba(6, 10, 22, 0.4);
          opacity: 0.32;
          filter: blur(60px) saturate(1.24);
          pointer-events: none;
        }
        .avatar {
          width: 100%;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(18, 24, 44, 0.68);
          display: grid;
          place-items: center;
          backdrop-filter: blur(12px) saturate(1.3);
          box-shadow: inset 0 1px 0 rgba(168, 220, 255, 0.28);
        }
        .placeholder {
          aspect-ratio: 1 / 1;
          border-radius: 20px;
          border: 1px dashed rgba(190, 220, 255, 0.45);
          background: rgba(14, 22, 40, 0.6);
        }
        .glass-content h3 {
          margin: 0;
          font-size: clamp(16px, 4.2vw, 20px);
          font-weight: 800;
          letter-spacing: 0.01em;
        }
        .glass-content p {
          margin: 0;
          font-size: clamp(12px, 3.2vw, 14px);
          font-weight: 500;
          opacity: 0.78;
          line-height: 1.55;
        }
        .primary {
          border-radius: 999px;
          border: 1px solid rgba(166, 220, 255, 0.38);
          background:
            linear-gradient(168deg, rgba(58, 96, 148, 0.74) 0%, rgba(32, 52, 98, 0.64) 52%, rgba(14, 24, 50, 0.82) 100%),
            rgba(12, 20, 40, 0.84);
          box-shadow:
            0 22px 38px rgba(6, 12, 24, 0.62),
            inset 0 1px 0 rgba(188, 236, 255, 0.38),
            inset 0 -8px 20px rgba(0, 0, 0, 0.48);
          backdrop-filter: blur(20px) saturate(1.42) contrast(1.18);
          color: rgba(224, 240, 255, 0.94);
          font-weight: 700;
          font-size: clamp(11px, 3.1vw, 13px);
          padding: clamp(8px, 2.4vw, 11px) clamp(22px, 5.6vw, 30px);
          cursor: pointer;
          transition: box-shadow 160ms ease, transform 160ms ease;
          position: relative;
          overflow: hidden;
        }
        .primary::before {
          content: '';
          position: absolute;
          inset: 20% 18% 40% 18%;
          border-radius: inherit;
          background: rgba(198, 236, 255, 0.38);
          filter: blur(16px);
          opacity: 0.68;
          pointer-events: none;
        }
        .primary:hover {
          box-shadow:
            0 16px 28px rgba(10, 18, 32, 0.56),
            inset 0 1px 0 rgba(214, 244, 255, 0.48),
            inset 0 -8px 18px rgba(0, 0, 0, 0.52);
          transform: translateY(-1px);
        }
        .primary:focus { outline: none; }
        .top-actions {
          position: absolute;
          top: clamp(24px, 6.5vw, 48px);
          right: clamp(22px, 7vw, 52px);
          z-index: 28;
          pointer-events: auto;
        }
        .top-btn {
          border-radius: 999px;
          border: 1px solid rgba(154, 210, 255, 0.34);
          padding: clamp(6px, 2.2vw, 11px) clamp(20px, 5.6vw, 28px);
          font-size: clamp(12px, 3.2vw, 14px);
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(214, 236, 255, 0.9);
          background:
            linear-gradient(192deg, rgba(48, 70, 120, 0.78) 0%, rgba(22, 34, 60, 0.7) 45%, rgba(10, 16, 30, 0.86) 100%),
            rgba(6, 10, 22, 0.82);
          box-shadow:
            0 20px 38px rgba(4, 10, 22, 0.66),
            inset 0 1px 0 rgba(180, 230, 255, 0.34),
            inset 0 -8px 18px rgba(0, 0, 0, 0.48);
          backdrop-filter: blur(20px) saturate(1.3) contrast(1.2);
          cursor: pointer;
          transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
        }
        .top-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 24px 46px rgba(6, 12, 24, 0.74),
            inset 0 1px 0 rgba(204, 242, 255, 0.42),
            inset 0 -8px 18px rgba(0, 0, 0, 0.56);
          background:
            linear-gradient(192deg, rgba(58, 86, 138, 0.86) 0%, rgba(28, 42, 72, 0.76) 45%, rgba(12, 20, 34, 0.88) 100%),
            rgba(8, 12, 24, 0.86);
        }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default Ver6_4_2;

