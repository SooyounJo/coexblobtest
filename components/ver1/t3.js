import React, { useMemo, useState } from 'react';



const T3 = () => {

  const [centerX, setCenterX] = useState(39);

  const [centerY, setCenterY] = useState(33);

  const [start, setStart] = useState(50);

  const [end, setEnd] = useState(99);

  const [blurPx, setBlurPx] = useState(52);

  const [rimTilt, setRimTilt] = useState(30);

  const [feather, setFeather] = useState(15);

  const [innerBlur, setInnerBlur] = useState(20);

  const [color0, setColor0] = useState('#D9FFB8');

  const [color1, setColor1] = useState('#B9FFF3');

  const [color2, setColor2] = useState('#DCD6FF');

  const [tintAlpha, setTintAlpha] = useState(0.85);
  const [boost, setBoost] = useState(1.9);

  const gradient = useMemo(() => {

    return `radial-gradient(circle at var(--center-x) var(--center-y), ${color0} 0 30%, ${color1} 55%, ${color2} 100%)`;

  }, [color0, color1, color2]);

  return (

    <div className="container">

      <div className="stage">
        <div className="bg-glow" />
        <div
          className="blob"
          style={{
            '--center-x': `${centerX}%`,
            '--center-y': `${centerY}%`,
            '--start': `${start}%`,
            '--end': `${end}%`,
            '--blur': `${blurPx}px`,
            '--feather': `${feather}%`,
            '--inner-blur': `${innerBlur}px`,
            '--rim-tilt': `${rimTilt}deg`,
            '--bg': gradient,
            '--tint-alpha': tintAlpha,
            '--boost': boost,
          }}
        >
          <div className="ring-boost" />
        </div>

      </div>

      <div className="controls">
        <div className="row"><label>Center X</label><input type="range" min="0" max="100" value={centerX} onChange={(e) => setCenterX(Number(e.target.value))} /><span>{centerX}%</span></div>
        <div className="row"><label>Center Y</label><input type="range" min="0" max="100" value={centerY} onChange={(e) => setCenterY(Number(e.target.value))} /><span>{centerY}%</span></div>
        <div className="row"><label>Start</label><input type="range" min="0" max="95" step="10" value={start} onChange={(e) => setStart(Math.min(Number(e.target.value), end - 1))} /><span>{start}%</span></div>
        <div className="row"><label>End</label><input type="range" min={start + 1} max="100" step="10" value={end} onChange={(e) => setEnd(Math.max(Number(e.target.value), start + 1))} /><span>{end}%</span></div>
        <div className="row"><label>Blur</label><input type="range" min="0" max="100" value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} /><span>{blurPx}px</span></div>
        <div className="row"><label>Feather</label><input type="range" min="0" max="15" value={feather} onChange={(e) => setFeather(Number(e.target.value))} /><span>{feather}%</span></div>
        <div className="row"><label>Inner Blur</label><input type="range" min="0" max="20" value={innerBlur} onChange={(e) => setInnerBlur(Number(e.target.value))} /><span>{innerBlur}px</span></div>
        <div className="row"><label>Rim Tint</label><input type="range" min="0" max="1" step="0.01" value={tintAlpha} onChange={(e) => setTintAlpha(Number(e.target.value))} /><span>{tintAlpha.toFixed(2)}</span></div>
        <div className="row"><label>Rim Tilt</label><input type="range" min="-30" max="30" value={rimTilt} onChange={(e) => setRimTilt(Number(e.target.value))} /><span>{rimTilt}°</span></div>
        <div className="row"><label>Outer Boost</label><input type="range" min="1" max="2.2" step="0.05" value={boost} onChange={(e) => setBoost(Number(e.target.value))} /><span>{boost.toFixed(2)}×</span></div>
        <div className="row colors">
          <label>C0</label><input type="color" value={color0} onChange={(e) => setColor0(e.target.value)} />
          <label>C1</label><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
          <label>C2</label><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
        </div>
      </div>

      <style jsx>{`

        .container {

          width: 100%;

          height: 100%;

          position: relative;

          overflow: hidden;

          background: white;

        }

        @property --start-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --end-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --feather-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }

        .stage {

          height: 80vh;

          display: grid;

          place-items: center;

          background: #ffffff;

          position: relative;

        }

        .blob {

          width: 70vmin;

          aspect-ratio: 1;

          position: relative;

          border-radius: 50%;

          background: none;
          isolation: isolate;

          --start-anim: clamp(0%, calc(var(--start) + var(--start-wobble)), 90%);
          --end-anim: clamp(0%, calc(var(--end) + var(--end-wobble)), 100%);
          --feather-anim: clamp(0%, calc(var(--feather) + var(--feather-wobble)), 25%);

          animation: ringPulse 6s ease-in-out infinite;

        }

        .ring-boost {

          position: absolute;

          inset: 0;

          border-radius: 50%;

          pointer-events: none;

          background:

            var(--bg),

            radial-gradient(circle at var(--center-x) var(--center-y),

              rgba(235, 201, 255, 0) 0 calc(var(--end) - (var(--feather) * 0.7)),

              rgba(235, 201, 255, calc(var(--tint-alpha) * 0.9)) calc(var(--end) + (var(--feather) * 0.3)));

          background-blend-mode: normal, screen;

          filter: blur(calc((var(--blur) + var(--blur-wobble)) * var(--boost))) drop-shadow(0 26px 40px rgba(186, 136, 255, 0.35));

          -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));

                  mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--end) - var(--feather)), #000 calc(var(--end) - var(--feather)) calc(var(--end) + (var(--feather) * 1.6)), transparent calc(var(--end) + (var(--feather) * 1.8)));

        }

        .bg-glow {

          position: absolute;

          width: 80vmin;

          aspect-ratio: 1;

          border-radius: 50%;

          left: 64%;

          top: 66%;

          transform: translate(-50%, -50%);

          z-index: 0;

          pointer-events: none;

          background: radial-gradient(circle at 50% 50%, rgba(235,201,255,0.42) 0%, rgba(235,201,255,0.26) 40%, rgba(235,201,255,0) 72%);

          filter: blur(70px);

        }

        .blob::before,

        .blob::after {

          content: "";

          position: absolute;

          inset: 0;

          border-radius: inherit;

          background: var(--bg);

        }

        .blob::before {

          filter: blur(var(--inner-blur));

          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );

                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            #000 0 calc(var(--start-anim) - var(--feather-anim)),
            transparent calc(var(--start-anim) + var(--feather-anim))
          );

        }

        .blob::after {

          background:

            var(--bg),

            radial-gradient(circle at var(--center-x) var(--center-y),

              rgba(235, 201, 255, 0) 0 calc(var(--start-anim) - var(--feather-anim)),

              rgba(235, 201, 255, var(--tint-alpha)) var(--end-anim));

          background-blend-mode: normal, screen;

          filter: blur(calc(var(--blur) + var(--blur-wobble))) drop-shadow(0 24px 36px rgba(186, 136, 255, 0.4));

          opacity: 1;

          -webkit-mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );

                  mask: radial-gradient(
            circle at var(--center-x) var(--center-y),
            transparent 0 calc(var(--start-anim) - var(--feather-anim)),
            #000 var(--start-anim) var(--end-anim),
            transparent calc(var(--end-anim) + var(--feather-anim))
          );

        }

        @supports (mask-composite: intersect) {

          .blob::after {

            mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            mask-composite: intersect;

          }

        }

        @supports (-webkit-mask-composite: source-in) {

          .blob::after {

            -webkit-mask: radial-gradient(circle at var(--center-x) var(--center-y), transparent 0 calc(var(--start-anim) - var(--feather-anim)), #000 var(--start-anim) var(--end-anim), transparent calc(var(--end-anim) + var(--feather-anim))), linear-gradient(calc(180deg + var(--rim-tilt)), transparent 35%, #000 60%);
            -webkit-mask-composite: source-in;

          }

        }

        .controls {

          position: absolute;

          left: 16px;

          bottom: 16px;

          display: flex;

          flex-direction: column;

          gap: 8px;

          padding: 10px 12px;

          background: rgba(255, 255, 255, 0.9);

          border-radius: 8px;

          box-shadow: 0 4px 16px rgba(0,0,0,0.08);

          font-size: 12px;

          z-index: 10;

        }

        .row { display: flex; align-items: center; gap: 8px; }

        .row input[type="range"] { width: 160px; }

        .row.colors input[type="color"] { width: 22px; height: 22px; padding: 0; border: none; background: transparent; }

        @keyframes ringPulse {

          0%, 100% {

            --start-wobble: calc(0% - var(--start));

            --end-wobble: 0%;

            --feather-wobble: 0%;

            --blur-wobble: calc(0px - var(--blur));

          }

          50% {

            --start-wobble: calc(90% - var(--start));

            --end-wobble: 0%;

            --feather-wobble: 5%;

            --blur-wobble: calc(120px - var(--blur));

          }

        }

      `}</style>

    </div>

  );

};



export default T3;


