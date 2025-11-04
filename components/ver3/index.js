import React, { useEffect, useState } from 'react';
import St1 from './st1';
import St2 from './st2';
import St3 from './st3';

const Ver3 = () => {
  const [active, setActive] = useState('st1');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const renderActive = () => {
    switch (active) {
      case 'st1': return <St1 />;
      case 'st2': return <St2 />;
      case 'st3': return <St3 />;
      default: return <St1 />;
    }
  };

  return (
    <div className="container">
      {renderActive()}
      <div className="nav-buttons">
        <button onClick={() => setActive('st1')} className={active === 'st1' ? 'active' : ''}>ST1</button>
        <button onClick={() => setActive('st2')} className={active === 'st2' ? 'active' : ''}>ST2</button>
        <button onClick={() => setActive('st3')} className={active === 'st3' ? 'active' : ''}>ST3</button>
      </div>
      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          overflow: hidden;
        }
        .nav-buttons {
          position: fixed;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 8px;
          z-index: 2000;
        }
        .nav-buttons button {
          padding: 9px 14px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.08);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6);
          font-weight: 800;
          font-size: 13px;
          cursor: pointer;
        }
        .nav-buttons button.active {
          background: #111;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default Ver3;


