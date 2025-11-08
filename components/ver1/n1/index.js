import React, { useEffect, useState } from 'react';
import BlobMotion from './BlobMotion';
import UI from './UI';

const N1 = () => {
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
      <style jsx global>{`
        html, body, #__next { height: 100%; overflow: hidden; overscroll-behavior-y: none; }
      `}</style>
    </div>
  );
};

export default N1;


