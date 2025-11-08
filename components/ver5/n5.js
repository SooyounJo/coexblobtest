import React, { useState, useEffect } from 'react';
import UI from './n1/UI';
import BlobMotion from './n1/BlobMotion';

const N5 = () => {
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

      {/* n1-style BlobMotion (two blobs: top/bottom, same placement) */}
      <BlobMotion />

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

export default N5;


