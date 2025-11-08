import React, { useState, useEffect } from 'react';
import UI from './n1/UI';
import BlobMotion from './n1/BlobMotion';

const N4 = () => {
  const [moved, setMoved] = useState(false);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    if (moved) {
      const t = setTimeout(() => setArrived(true), 2000);
      return () => clearTimeout(t);
    }
    setArrived(false);
  }, [moved]);

  // prevent page scroll while this view is mounted
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverscrollY = document.documentElement.style.overscrollBehaviorY;
    const prevBodyOverscrollY = document.body.style.overscrollBehaviorY;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehaviorY = 'none';
    document.body.style.overscrollBehaviorY = 'none';
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overscrollBehaviorY = prevHtmlOverscrollY;
      document.body.style.overscrollBehaviorY = prevBodyOverscrollY;
    };
  }, []);

  return (
    <div className={`container ${moved ? 'moved' : ''} ${arrived ? 'arrived' : ''} wave-orbit`}>
      <UI onStart={() => setMoved(true)} />
      <BlobMotion />
      <div className="wave-video" aria-hidden>
        <video
          src="/wave.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className="center-stage" aria-hidden>
        <div className="center-wave w1" />
        <div className="center-wave w2" />
        <div className="center-wave w3" />
        <div className="center-wave w4" />
        <div className="center-wave w5" />
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
          /* match n1 sizing/placement */
          --control-w: clamp(240px, 92vw, 360px);
          --control-h: clamp(44px, 9.6vw, 56px);
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
        .wave-video {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 1200ms ease;
          mix-blend-mode: screen;
          z-index: 8;
          filter: saturate(1.25);
          clip-path: circle(calc(var(--t2-size) * 0.64) at 50% calc(var(--meet-y) + var(--offset)));
        }
        @supports (mask-image: radial-gradient(circle, #000 0%, transparent 100%)) {
          .wave-video {
            clip-path: none;
            mask-image: radial-gradient(circle at 50% calc(var(--meet-y) + var(--offset)),
              rgba(0,0,0,1) calc(var(--t2-size) * 0.28),
              rgba(0,0,0,0.8) calc(var(--t2-size) * 0.46),
              rgba(0,0,0,0.0) calc(var(--t2-size) * 0.66));
            -webkit-mask-image: radial-gradient(circle at 50% calc(var(--meet-y) + var(--offset)),
              rgba(0,0,0,1) calc(var(--t2-size) * 0.28),
              rgba(0,0,0,0.8) calc(var(--t2-size) * 0.46),
              rgba(0,0,0,0.0) calc(var(--t2-size) * 0.66));
          }
        }
        .wave-video video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: blur(18px) saturate(1.1);
        }
        .container.arrived .wave-video {
          opacity: 0.58;
        }
        .center-stage {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 9;
        }
        .center-wave {
          position: absolute;
          left: 50%;
          top: calc(var(--meet-y) + var(--offset));
          width: calc(var(--t2-size) * 0.74);
          height: calc(var(--t2-size) * 0.74);
          transform: translate(-50%, -50%) scale(0.66);
          border-radius: 50%;
          border: 3px solid rgba(255,255,255,0.82);
          box-shadow:
            0 0 28px rgba(255,255,255,0.34),
            inset 0 0 18px rgba(255,255,255,0.28);
          opacity: 0;
          mix-blend-mode: screen;
          filter: blur(6px);
          will-change: transform, opacity, filter;
          backface-visibility: hidden;
        }
        .container.arrived .center-wave.w1 { animation: centerRipple 2400ms ease-out 1500ms infinite; }
        .container.arrived .center-wave.w2 { animation: centerRipple 2400ms ease-out 1900ms infinite; }
        .container.arrived .center-wave.w3 { animation: centerRipple 2400ms ease-out 2300ms infinite; }
        .container.arrived .center-wave.w4 { animation: centerRipple 2400ms ease-out 2700ms infinite; }
        .container.arrived .center-wave.w5 { animation: centerRipple 2400ms ease-out 3100ms infinite; }
        @keyframes centerRipple {
          0% {
            opacity: 0.48;
            transform: translate(-50%, -50%) scale(0.68);
            filter: blur(8px);
            border-width: 5px;
          }
          38% {
            opacity: 0.60;
            transform: translate(-50%, -50%) scale(1.04);
            filter: blur(12px);
            border-width: 4px;
          }
          62% {
            opacity: 0.32;
            transform: translate(-50%, -50%) scale(1.34);
            filter: blur(16px);
            border-width: 3px;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.62);
            filter: blur(20px);
            border-width: 1px;
          }
        }
        @media (max-width: 768px) {
          .container { --t2-size: 62svh; --gap: 5px; }
        }
        @media (max-width: 480px) {
          .container { --t2-size: 62svh; --gap: 4px; }
        }
      `}</style>
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default N4;







