import React, { useMemo } from 'react';

const St3 = () => {
  // Copy of current ver3/st1 blob with upward exit
  const centerX = 29;
  const centerY = 28;
  const stop1Percent = 55;
  const stop2Percent = 81;

  const color0 = '#C6FFB0';
  const color1 = '#B4FDE5';
  const color2 = '#CCF2FF';
  const color3 = '#EEEFFF';

  const blurPx = 19;
  const progBlurPx = 10;

  const showRim = true;
  const rimX = 72;
  const rimY = 78;
  const rimStart = 77;
  const rimMid = 88;
  const rimPeak = 97;
  const rimColor1 = '#EBC9FF';
  const rimColor2 = '#FFBDE4';
  const rimIntensity = 0.88;

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
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
  };

  const mainGradient = useMemo(() => {
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
    const s = 32; const e = 37; const a = 40;
    return `linear-gradient(${a}deg, rgba(0,0,0,0) ${s}%, rgba(0,0,0,1) ${e}%)`;
  }, []);

  return (
    <div className="stage">
      <div className="blob-container">
        <div className="intro-wrap">
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
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stage { position: absolute; inset: 0; background: #FFFFFF; overflow: hidden; }

        .blob-container { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }

        .intro-wrap { position: absolute; width: 559px; height: 559px; left: 50%; top: 50%; transform: translate(-50%, -50%); animation: introRise 1.6s cubic-bezier(0.22, 1, 0.36, 1) both; will-change: transform; z-index: 0; }

        .blob-wrapper { position: absolute; inset: 0; }

        .blob { position: absolute; inset: 0; background: var(--bg); border-radius: 50%; --cx: calc(var(--cx-base, 29%) + var(--cx-wobble)); --cy: calc(var(--cy-base, 28%) + var(--cy-wobble)); --p1: calc(var(--p1-base, 55%) + var(--p1-wobble)); --p2: calc(var(--p2-base, 81%) + var(--p2-wobble)); filter: blur(calc(var(--p-blur) + var(--base-blur-wobble) + var(--intro-extra-blur))); animation: colorWobble 3.8s ease-in-out infinite, blurWobble 3.8s ease-in-out infinite, centerWobble 4.2s ease-in-out infinite; }

        .blob::before { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--bg); filter: blur(calc(var(--blur) + var(--prog-blur-wobble) + var(--intro-extra-blur))); -webkit-mask-image: var(--p-mask); mask-image: var(--p-mask); mask-mode: alpha; mask-repeat: no-repeat; mask-size: 100% 100%; pointer-events: none; }

        .blob::after { content: ''; position: absolute; inset: 0; border-radius: 50%; background: var(--rim); mix-blend-mode: screen; pointer-events: none; }

        @media (max-width: 768px) { .intro-wrap { width: 400px; height: 400px; } }
        @media (max-width: 480px) { .intro-wrap { width: 300px; height: 300px; } }

        @property --p1-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --p2-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --base-blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --prog-blur-wobble { syntax: '<length>'; inherits: true; initial-value: 0px; }
        @property --cx-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --cy-wobble { syntax: '<percentage>'; inherits: true; initial-value: 0%; }
        @property --c0r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c0b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c1r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c1b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c2r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c2b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3r-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3b-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --c3g-shift { syntax: '<number>'; inherits: true; initial-value: 0; }
        @property --intro-extra-blur { syntax: '<length>'; inherits: true; initial-value: 0px; }

        @keyframes introRise {
          0% { transform: translate(-50%, calc(-50% + 110vh)) scale(0.7); --intro-extra-blur: 0px; opacity: 1; }
          40% { transform: translate(-50%, -50%) scale(1.0); --intro-extra-blur: 6px; }
          70% { transform: translate(-50%, calc(-50% - 20vh)) scale(1.8); --intro-extra-blur: 22px; }
          100% { transform: translate(-50%, calc(-50% - 140vh)) scale(2.8); --intro-extra-blur: 44px; opacity: 1; }
        }

        @keyframes colorWobble { 0%, 100% { --p1-wobble: 0%; --p2-wobble: 0%; --c0r-shift: 0; --c0b-shift: 0; --c1r-shift: 0; --c1b-shift: 0; --c2r-shift: 0; --c2b-shift: 0; --c3r-shift: 0; --c3b-shift: 0; } 25% { --p1-wobble: 8%; --p2-wobble: 12%; --c0r-shift: 0; --c0b-shift: 0; --c1r-shift: 0; --c1b-shift: 0; --c2r-shift: 0; --c2b-shift: 0; --c3r-shift: 12; --c3b-shift: 20; --c3g-shift: -14; } 50% { --p1-wobble: 12%; --p2-wobble: 18%; --c0r-shift: 0; --c0b-shift: 0; --c1r-shift: 0; --c1b-shift: 0; --c2r-shift: 0; --c2b-shift: 0; --c3r-shift: 18; --c3b-shift: 32; --c3g-shift: -24; } 75% { --p1-wobble: -10%; --p2-wobble: -14%; --c0r-shift: 0; --c0b-shift: 0; --c1r-shift: 0; --c1b-shift: 0; --c2r-shift: 0; --c2b-shift: 0; --c3r-shift: 6; --c3b-shift: 10; --c3g-shift: -8; } }

        @keyframes blurWobble { 0%, 100% { --base-blur-wobble: 0px; --prog-blur-wobble: 0px; } 50% { --base-blur-wobble: 5px; --prog-blur-wobble: 8px; } }
        @keyframes centerWobble { 0%, 100% { --cx-wobble: 0%; --cy-wobble: 0%; } 25% { --cx-wobble: 1.8%; --cy-wobble: 1.0%; } 50% { --cx-wobble: 2.5%; --cy-wobble: 1.5%; } 75% { --cx-wobble: -1.8%; --cy-wobble: -1.0%; } }
        @keyframes scalePulse { 0%, 100% { transform: scale(0.985); } 50% { transform: scale(1.02); } }
      `}</style>
    </div>
  );
};

export default St3;

