import React, { useEffect, useMemo, useRef, useState } from 'react';



const B3 = () => {

  const [centerX, setCenterX] = useState(29);
  const [centerY, setCenterY] = useState(28);
  const [stop1Percent, setStop1Percent] = useState(55);
  const [stop2Percent, setStop2Percent] = useState(81);

  const [color0, setColor0] = useState('#C6FFB0');
  const [color1, setColor1] = useState('#B4FDE5');
  const [color2, setColor2] = useState('#CCF2FF');
  const [color3, setColor3] = useState('#EEEFFF');

  const [blurPx, setBlurPx] = useState(19);
  const [progBlurPx, setProgBlurPx] = useState(10);

  const [showRim, setShowRim] = useState(true);
  const [rimX, setRimX] = useState(72);
  const [rimY, setRimY] = useState(78);
  const [rimStart, setRimStart] = useState(77);
  const [rimMid, setRimMid] = useState(88);
  const [rimPeak, setRimPeak] = useState(97);
  const [rimColor1, setRimColor1] = useState('#EBC9FF');
  const [rimColor2, setRimColor2] = useState('#FFBDE4');
  const [rimIntensity, setRimIntensity] = useState(0.88);

  // Progressive blur mask (start/end in %, angle in deg)
  const [progStart, setProgStart] = useState(32);
  const [progEnd, setProgEnd] = useState(37);
  const [progAngle, setProgAngle] = useState(40);

  // Live display of animated values
  const [live, setLive] = useState({
    cx: centerX,
    cy: centerY,
    p1: stop1Percent,
    p2: stop2Percent,
    baseBlurNow: 0,
    progBlurNow: 0,
  });

  const blobRef = useRef(null);

  const hexToRgb = (hex) => {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return '255, 255, 255';
    const bigint = parseInt(normalized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
  };

  const hexToRgbParts = (hex) => {
    const normalized = hex.replace('#', '');
    if (normalized.length !== 6) return { r: 255, g: 255, b: 255 };
    const bigint = parseInt(normalized, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  };

  const mainGradient = useMemo(() => {
    // Colors are driven by CSS vars so we can animate R/B with the wobble
    return `radial-gradient(75% 75% at var(--cx) var(--cy),
      rgb(calc(var(--c0r) + var(--c0r-shift)), var(--c0g), calc(var(--c0b) + var(--c0b-shift))) 0%,
      rgb(calc(var(--c1r) + var(--c1r-shift)), var(--c1g), calc(var(--c1b) + var(--c1b-shift))) var(--p1),
      rgb(calc(var(--c2r) + var(--c2r-shift)), var(--c2g), calc(var(--c2b) + var(--c2b-shift))) var(--p2),
      rgb(calc(var(--c3r) + var(--c3r-shift)), calc(var(--c3g) + var(--c3g-shift)), calc(var(--c3b) + var(--c3b-shift))) 100%)`;
  }, []);

  const rimGradient = useMemo(() => {
    if (!showRim) return 'none';
    const c1 = hexToRgb(rimColor1);
    const c2 = hexToRgb(rimColor2);
    const i = Math.max(0, Math.min(2, rimIntensity));
    const a1 = Math.min(1, 0.18 * i);
    const a2 = Math.min(1, 0.42 * i);
    const a3 = Math.min(1, 0.6 * i);
    const s = Math.max(0, Math.min(98, rimStart));
    const m = Math.max(s + 1, Math.min(99, rimMid));
    const pk = Math.max(m + 1, Math.min(100, rimPeak));
    return `radial-gradient(circle at ${rimX}% ${rimY}%, rgba(${c1}, 0) ${s}%, rgba(${c1}, ${a1}) ${m}%, rgba(${c1}, ${a2}) ${pk}%, rgba(${c2}, ${a3}) 100%)`;
  }, [showRim, rimX, rimY, rimStart, rimMid, rimPeak, rimColor1, rimColor2, rimIntensity]);

  const progressiveMask = useMemo(() => {
    const s = Math.max(0, Math.min(100, progStart));
    const e = Math.max(s, Math.min(100, progEnd));
    const a = Math.max(0, Math.min(360, progAngle));
    return `linear-gradient(${a}deg, rgba(0,0,0,0) ${s}%, rgba(0,0,0,1) ${e}%)`;
  }, [progStart, progEnd, progAngle]);

  // Read animated CSS variables so the control panel shows live values
  useEffect(() => {
    let raf;
    const read = () => {
      const el = blobRef.current;
      if (el) {
        const cs = getComputedStyle(el);
        const num = (v) => {
          const n = parseFloat(v);
          return Number.isFinite(n) ? n : 0;
        };
        const cxW = num(cs.getPropertyValue('--cx-wobble'));
        const cyW = num(cs.getPropertyValue('--cy-wobble'));
        const p1W = num(cs.getPropertyValue('--p1-wobble'));
        const p2W = num(cs.getPropertyValue('--p2-wobble'));
        const bbW = num(cs.getPropertyValue('--base-blur-wobble'));
        const pbW = num(cs.getPropertyValue('--prog-blur-wobble'));
        setLive({
          cx: centerX + cxW,
          cy: centerY + cyW,
          p1: stop1Percent + p1W,
          p2: stop2Percent + p2W,
          baseBlurNow: blurPx + bbW,
          progBlurNow: progBlurPx + pbW,
        });
      }
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, [centerX, centerY, stop1Percent, stop2Percent, blurPx, progBlurPx]);

  return (

    <div className="container">

      <div className="blob-container">

        {/* 단일 블롭 */}
        <div className="blob-wrapper">
          <div
            className="blob"
            style={{
              '--bg': mainGradient,
              '--rim': rimGradient,
              '--blur': `${blurPx}px`,
              '--p-mask': progressiveMask,
              '--p-blur': `${progBlurPx}px`,
              '--p1-base': `${stop1Percent}%`,
              '--p2-base': `${stop2Percent}%`,
              '--cx-base': `${centerX}%`,
              '--cy-base': `${centerY}%`,
              // base color channels from pickers
              '--c0r': hexToRgbParts(color0).r,
              '--c0g': hexToRgbParts(color0).g,
              '--c0b': hexToRgbParts(color0).b,
              '--c1r': hexToRgbParts(color1).r,
              '--c1g': hexToRgbParts(color1).g,
              '--c1b': hexToRgbParts(color1).b,
              '--c2r': hexToRgbParts(color2).r,
              '--c2g': hexToRgbParts(color2).g,
              '--c2b': hexToRgbParts(color2).b,
              '--c3r': hexToRgbParts(color3).r,
              '--c3g': hexToRgbParts(color3).g,
              '--c3b': hexToRgbParts(color3).b,
            }}
            ref={blobRef}
          ></div>
        </div>

      </div>

      {/* Controls */}
      <div className="controls">
        <div className="row">
          <label>Center X</label>
          <input type="range" min="0" max="100" value={centerX} onChange={(e) => setCenterX(Number(e.target.value))} />
          <span>{centerX}% → {Math.round(live.cx)}%</span>
        </div>
        <div className="row">
          <label>Center Y</label>
          <input type="range" min="0" max="100" value={centerY} onChange={(e) => setCenterY(Number(e.target.value))} />
          <span>{centerY}% → {Math.round(live.cy)}%</span>
        </div>
        <div className="row">
          <label>Stop1 %</label>
          <input type="range" min="0" max="100" step="10" value={stop1Percent} onChange={(e) => setStop1Percent(Number(e.target.value))} />
          <span>{stop1Percent}% → {Math.round(live.p1)}%</span>
        </div>
        <div className="row">
          <label>Stop2 %</label>
          <input type="range" min="0" max="100" step="10" value={stop2Percent} onChange={(e) => setStop2Percent(Number(e.target.value))} />
          <span>{stop2Percent}% → {Math.round(live.p2)}%</span>
        </div>
        <div className="row colors">
          <label>C0</label><input type="color" value={color0} onChange={(e) => setColor0(e.target.value)} />
          <label>C1</label><input type="color" value={color1} onChange={(e) => setColor1(e.target.value)} />
          <label>C2</label><input type="color" value={color2} onChange={(e) => setColor2(e.target.value)} />
          <label>C3</label><input type="color" value={color3} onChange={(e) => setColor3(e.target.value)} />
        </div>
        <div className="row">
          <label>Base Blur</label>
          <input type="range" min="0" max="40" value={blurPx} onChange={(e) => setBlurPx(Number(e.target.value))} />
          <span>{blurPx}px → {Math.round(live.baseBlurNow)}px</span>
        </div>
        <div className="row">
          <label>Prog Blur</label>
          <input type="range" min="0" max="80" value={progBlurPx} onChange={(e) => setProgBlurPx(Number(e.target.value))} />
          <span>{progBlurPx}px → {Math.round(live.progBlurNow)}px</span>
        </div>
        <div className="row">
          <label>Prog Start</label>
          <input type="range" min="0" max="100" step="10" value={progStart} onChange={(e) => setProgStart(Number(e.target.value))} />
          <span>{progStart}%</span>
        </div>
        <div className="row">
          <label>Prog End</label>
          <input type="range" min="0" max="100" step="10" value={progEnd} onChange={(e) => setProgEnd(Number(e.target.value))} />
          <span>{progEnd}%</span>
        </div>
        <div className="row">
          <label>Prog Angle</label>
          <input type="range" min="0" max="360" value={progAngle} onChange={(e) => setProgAngle(Number(e.target.value))} />
          <span>{progAngle}°</span>
        </div>
        <div className="row presets">
          <button onClick={() => setProgAngle(0)}>↑</button>
          <button onClick={() => setProgAngle(45)}>↗</button>
          <button onClick={() => setProgAngle(90)}>→</button>
          <button onClick={() => setProgAngle(135)}>↘</button>
          <button onClick={() => setProgAngle(180)}>↓</button>
          <button onClick={() => setProgAngle(225)}>↙</button>
          <button onClick={() => setProgAngle(270)}>←</button>
          <button onClick={() => setProgAngle(315)}>↖</button>
        </div>
        <hr />
        <div className="row">
          <label>Rim</label>
          <input type="checkbox" checked={showRim} onChange={(e) => setShowRim(e.target.checked)} />
        </div>
        <div className="row">
          <label>Rim X</label>
          <input type="range" min="0" max="100" value={rimX} onChange={(e) => setRimX(Number(e.target.value))} />
          <span>{rimX}%</span>
        </div>
        <div className="row">
          <label>Rim Y</label>
          <input type="range" min="0" max="100" value={rimY} onChange={(e) => setRimY(Number(e.target.value))} />
          <span>{rimY}%</span>
        </div>
        <div className="row">
          <label>Rim Start</label>
          <input type="range" min="50" max="95" value={rimStart} onChange={(e) => setRimStart(Number(e.target.value))} />
          <span>{rimStart}%</span>
        </div>
        <div className="row">
          <label>Rim Mid</label>
          <input type="range" min="60" max="98" value={rimMid} onChange={(e) => setRimMid(Number(e.target.value))} />
          <span>{rimMid}%</span>
        </div>
        <div className="row">
          <label>Rim Peak</label>
          <input type="range" min="70" max="100" value={rimPeak} onChange={(e) => setRimPeak(Number(e.target.value))} />
          <span>{rimPeak}%</span>
        </div>
        <div className="row colors">
          <label>Rim C1</label><input type="color" value={rimColor1} onChange={(e) => setRimColor1(e.target.value)} />
          <label>Rim C2</label><input type="color" value={rimColor2} onChange={(e) => setRimColor2(e.target.value)} />
        </div>
        <div className="row">
          <label>Rim Intensity</label>
          <input type="range" min="0" max="2" step="0.01" value={rimIntensity} onChange={(e) => setRimIntensity(Number(e.target.value))} />
          <span>{rimIntensity.toFixed(2)}</span>
        </div>
      </div>

      <style jsx>{`

        .container {

          width: 100%;

          height: 100%;

          background: white;

          position: relative;

          overflow: hidden;

        }

        /* Animatable custom properties */
        @property --p1-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --p2-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --base-blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --prog-blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --cx-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --cy-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }

        /* R/B channel wobble (number in 0-255 domain) */
        @property --c0r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c0b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c1r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c1b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c2r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c2b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3g-shift { syntax: '<number>'; inherits: true; initial-value: 0; }

        

        .blob-container {

          position: absolute;

          top: 0;

          left: 0;

          right: 0;

          bottom: 0;

          display: flex;

          align-items: center;

          justify-content: center;

        }

        .blob-wrapper {

          position: absolute;

          width: 559px;

          height: 559px;

          left: 50%;

          top: 50%;

          transform: translate(-50%, -50%);

          z-index: 0;

          animation: floatY 7s ease-in-out infinite;

        }

        .blob {

          position: absolute;

          width: 100%;

          height: 100%;

          left: 0;

          top: 0;

          background: var(--bg);

          border-radius: 50%;

          /* compute animated center/stops from base + wobble */
          --cx: calc(var(--cx-base, 29%) + var(--cx-wobble));
          --cy: calc(var(--cy-base, 28%) + var(--cy-wobble));
          --p1: calc(var(--p1-base, 55%) + var(--p1-wobble));
          --p2: calc(var(--p2-base, 81%) + var(--p2-wobble));

          filter: blur(calc(var(--p-blur) + var(--base-blur-wobble)));

          animation: scalePulse 6s cubic-bezier(0.6, 0.0, 0.4, 1) infinite, colorWobble 3.8s ease-in-out infinite, blurWobble 3.8s ease-in-out infinite, centerWobble 4.2s ease-in-out infinite;

        }

        /* Progressive blur overlay */
        .blob::before {

          content: '';

          position: absolute;

          inset: 0;

          border-radius: 50%;

          background: var(--bg);

          filter: blur(calc(var(--blur) + var(--prog-blur-wobble)));

          -webkit-mask-image: var(--p-mask);

          mask-image: var(--p-mask);

          mask-mode: alpha;

          mask-repeat: no-repeat;

          mask-size: 100% 100%;

          pointer-events: none;

        }

        @keyframes colorWobble {

          0%, 100% {

            --p1-wobble: 0%;

            --p2-wobble: 0%;

            --c0r-shift: 0; --c0b-shift: 0;
            --c1r-shift: 0; --c1b-shift: 0;
            --c2r-shift: 0; --c2b-shift: 0;
            --c3r-shift: 0; --c3b-shift: 0;

          }

          25% {

            --p1-wobble: 8%;

            --p2-wobble: 12%;

            --c0r-shift: 0; --c0b-shift: 0;
            --c1r-shift: 0; --c1b-shift: 0;
            --c2r-shift: 0; --c2b-shift: 0; /* C2 고정 */
            --c3r-shift: 12; --c3b-shift: 20; --c3g-shift: -14; /* 보라만 강화 */

          }

          50% {

            --p1-wobble: 12%;

            --p2-wobble: 18%;

            --c0r-shift: 0; --c0b-shift: 0;
            --c1r-shift: 0; --c1b-shift: 0;
            --c2r-shift: 0; --c2b-shift: 0; /* C2 고정 */
            --c3r-shift: 18; --c3b-shift: 32; --c3g-shift: -24;

          }

          75% {

            --p1-wobble: -10%;

            --p2-wobble: -14%;

            --c0r-shift: 0; --c0b-shift: 0;
            --c1r-shift: 0; --c1b-shift: 0;
            --c2r-shift: 0; --c2b-shift: 0; /* C2 고정 */
            --c3r-shift: 6; --c3b-shift: 10; --c3g-shift: -8; /* G는 절대 플러스 금지 */

          }

        }

        @keyframes blurWobble {

          0%, 100% {

            --base-blur-wobble: 0px;

            --prog-blur-wobble: 0px;

          }

          50% {

            --base-blur-wobble: 5px;

            --prog-blur-wobble: 8px;

          }

        }

        @keyframes centerWobble {

          0%, 100% {

            --cx-wobble: 0%;

            --cy-wobble: 0%;

          }

          25% {

            --cx-wobble: 1.8%;

            --cy-wobble: 1.0%;

          }

          50% {

            --cx-wobble: 2.5%;

            --cy-wobble: 1.5%;

          }

          75% {

            --cx-wobble: -1.8%;

            --cy-wobble: -1.0%;

          }

        }

        .blob::after {

          content: '';

          position: absolute;

          inset: 0;

          border-radius: 50%;

          background: var(--rim);

          mix-blend-mode: screen;

          pointer-events: none;

        }

        .controls {

          position: absolute;

          left: 16px;

          bottom: 16px;

          display: flex;

          flex-direction: column;

          gap: 6px;

          padding: 10px 12px;

          background: rgba(255, 255, 255, 0.85);

          border-radius: 8px;

          box-shadow: 0 4px 16px rgba(0,0,0,0.08);

          font-size: 12px;

          z-index: 10;

        }

        .row {

          display: flex;

          align-items: center;

          gap: 8px;

        }

        .row input[type="range"] {

          width: 160px;

        }

        .row.colors input[type="color"] {

          width: 22px;

          height: 22px;

          padding: 0;

          border: none;

          background: transparent;

        }

        .row.presets {

          gap: 4px;

        }

        .row.presets button {

          font-size: 12px;

          padding: 2px 6px;

          border: 1px solid #ddd;

          border-radius: 4px;

          background: white;

          cursor: pointer;

        }

        @keyframes scalePulse {

          0%, 100% {

            transform: scale(0.985);

          }

          50% {

            transform: scale(1.02);

          }

        }

        @keyframes floatY {

          0%, 100% {

            transform: translate(-50%, -50%);

          }

          50% {

            transform: translate(-50%, calc(-50% - 12px));

          }

        }

        


        

        /* 반응형 디자인 */

        @media (max-width: 768px) {

          .blob-wrapper {

            width: 400px;

            height: 400px;

          }

        }

        @media (max-width: 480px) {

          .blob-wrapper {

            width: 300px;

            height: 300px;

          }

        }

      `}</style>

    </div>

  );

};

export default B3;
