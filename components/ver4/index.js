import React, { useEffect, useState } from 'react';
import In1 from './in1';
import In2 from './in2';
import In3 from './in3';

const Ver4 = () => {
  const [active, setActive] = useState('in1');

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const renderActive = () => {
    switch (active) {
      case 'in1': return <In1 />;
      case 'in2': return <In2 />;
      case 'in3': return <In3 />;
      default: return <In1 />;
    }
  };

  return (
    <div className="container">
      {renderActive()}
      <div className="nav-buttons">
        <button onClick={() => setActive('in1')} className={active === 'in1' ? 'active' : ''}>IN1</button>
        <button onClick={() => setActive('in2')} className={active === 'in2' ? 'active' : ''}>IN2</button>
        <button onClick={() => setActive('in3')} className={active === 'in3' ? 'active' : ''}>IN3</button>
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

export default Ver4;


