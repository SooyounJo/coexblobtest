import React, { useState } from 'react';
import T1 from './t1';
import T2 from './t2';
import T3 from './t3';



const Ver1 = () => {

  const [tab, setTab] = useState('t1');

  const renderContent = () => {
    switch (tab) {
      case 't1':
        return <T1 />;
      case 't2':
        return <T2 />;
      case 't3':
        return <T3 />;
      default:
        return <T1 />;
    }
  };

  return (

    <div className="ver1-wrapper">

      {renderContent()}

      <div className="ver1-nav" role="tablist" aria-label="Ver1 variants">
        <button
          className={`tab-btn ${tab === 't1' ? 'active' : ''}`}
          onClick={() => setTab('t1')}
          aria-selected={tab === 't1'}
          role="tab"
        >T1</button>
        <button
          className={`tab-btn ${tab === 't2' ? 'active' : ''}`}
          onClick={() => setTab('t2')}
          aria-selected={tab === 't2'}
          role="tab"
        >T2</button>
        <button
          className={`tab-btn ${tab === 't3' ? 'active' : ''}`}
          onClick={() => setTab('t3')}
          aria-selected={tab === 't3'}
          role="tab"
        >T3</button>
      </div>

      <style jsx>{`

        .ver1-wrapper {

          width: 100%;

          height: 100vh;

          position: relative;

          overflow: hidden;

          background: white;

        }

        .ver1-nav {

          position: fixed;

          left: 50%;

          transform: translateX(-50%);

          bottom: 28px;

          display: flex;

          gap: 8px;

          padding: 8px;

          border-radius: 999px;

          background: rgba(255,255,255,0.75);

          border: 1px solid rgba(0,0,0,0.06);

          backdrop-filter: saturate(120%) blur(8px);

          z-index: 1200;

        }

        .tab-btn {

          width: 44px;

          height: 44px;

          border-radius: 999px;

          border: 1px solid rgba(0,0,0,0.08);

          background: #ffffff;

          color: #222;

          font-weight: 700;

          cursor: pointer;

          opacity: 0.85;

        }

        .tab-btn.active {

          background: #111;

          color: #fff;

          opacity: 0.95;

        }

      `}</style>

    </div>

  );

};



export default Ver1;
