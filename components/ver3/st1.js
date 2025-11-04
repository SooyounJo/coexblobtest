import React from 'react';

const St1 = () => {
  return (
    <div className="stage">
      <div className="label">ST1</div>
      <style jsx>{`
        .stage { position: absolute; inset: 0; background: #FFFFFF; display: grid; place-items: center; }
        .label { font-weight: 900; font-size: 24px; color: #111; }
      `}</style>
    </div>
  );
};

export default St1;


