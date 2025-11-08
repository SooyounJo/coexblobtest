import React from 'react';
import BlobMotion from '../ver5/n1/BlobMotion';

const Ver6_2 = () => {
  return (
    <div className="container moved arrived wave-orbit">
      <BlobMotion />
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
          padding: clamp(18px, 4.8vw, 24px) clamp(16px, 4.4vw, 22px);
          border-radius: 24px;
          background: linear-gradient(180deg, rgba(255, 161, 235, 0.2) -8.33%, rgba(255, 255, 255, 0.2) 94.9%);
          border: 1px solid rgba(255,255,255,0.42);
          box-shadow:
            0 28px 52px rgba(36, 82, 94, 0.26),
            inset 0 1px 0 rgba(255,255,255,0.6);
          backdrop-filter: blur(24px) saturate(1.6);
          text-align: center;
          color: #0f2420;
          pointer-events: auto;
        }
        .avatar {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.24);
          display: grid;
          place-items: center;
        }
        .placeholder {
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          border: 1px dashed rgba(255,255,255,0.55);
          background: rgba(255,255,255,0.18);
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
          border: 1px solid rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.28);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.55);
          backdrop-filter: blur(16px) saturate(1.35);
          color: #103330;
          font-weight: 700;
          font-size: clamp(11px, 3.1vw, 13px);
          padding: clamp(7px, 2.2vw, 10px) clamp(18px, 5vw, 24px);
          cursor: pointer;
          transition: box-shadow 160ms ease, transform 160ms ease;
        }
        .primary:hover {
          box-shadow:
            0 12px 22px rgba(30, 76, 78, 0.22),
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

export default Ver6_2;

