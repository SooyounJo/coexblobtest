import React from 'react';
import Ver8_1 from './1.js';

export default function Ver8_2() {
  return (
    <>
      <Ver8_1 />
      <style jsx global>{`
        /* v2-only extra inset: do NOT change --modal-shrink so message bar stays the same */
        .container {
          --modal-extra-inset: clamp(16px, 5vw, 56px);
          /* v2: radius 32px */
          --glass-radius: 32px;
          /* v2: fractional resizing based on frame width to avoid clamp plateaus */
          --frame-outer: calc(100% - var(--side-left) - var(--side-right));
          --modal-inset-frac: 0.04; /* tune this to match Note20 Ultra look */
          --modal-shrink: calc(var(--frame-outer) * var(--modal-inset-frac));
          /* v2: slight downward drop for the main modal */
          --v2-drop: 8vh;
        }
        /* v2: switch main modal to ver7 d2 glass style */
        .glass-modal {
          /* anchor left/right to eliminate rounding mismatch across devices */
          position: absolute !important;
          left: calc(var(--side-left) + var(--modal-shrink) - var(--center-fix)) !important;
          right: calc(var(--side-right) + var(--modal-shrink) + var(--center-fix)) !important;
          width: auto !important;
          margin: 0 !important;
          top: 50% !important;
          transform: translateY(calc(-50% - var(--v2-drop))) !important;
          aspect-ratio: 142.41 / 190.74 !important;
          display: grid !important;
          place-items: center !important;
          pointer-events: none !important;
        }
        .glass-content {
          /* ensure the visible card matches the anchored modal width exactly */
          width: 100% !important;
          max-width: none !important;
          --modal-scale: clamp(0.84, calc(var(--modal-w) / 420px), 1.20) !important;
          gap: calc(20px * var(--modal-scale)) !important;
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 14.285%,
            rgba(255,255,255,0.08) 28%,
            rgba(255,255,255,0.30) 66%,
            rgba(255,255,255,0.60) 100%
          ) !important;
          border: 0.5px solid rgba(255,255,255,0.14) !important;
          backdrop-filter: blur(40px) saturate(0.82) brightness(1.02) contrast(0.92) !important;
          -webkit-backdrop-filter: blur(40px) saturate(0.82) brightness(1.02) contrast(0.92) !important;
          filter: saturate(0.84) !important;
          /* radius 32px */
          border-radius: 32px !important;
          /* v2: slightly longer vertical padding */
          padding: calc(28px * var(--modal-scale)) var(--glass-inner) calc(28px * var(--modal-scale)) !important;
        }
        /* ensure modal is the topmost layer */
        .glass-overlay { z-index: 90 !important; }
        /* v2: brighter, whiter highlight pill and slightly larger leading */
        .hl {
          background: linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 100%) !important;
          border: 1px solid rgba(255,255,255,1) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            0 3px 10px rgba(16,24,40,0.12) !important;
          backdrop-filter: blur(12px) saturate(1.25) !important;
          -webkit-backdrop-filter: blur(12px) saturate(1.25) !important;
          color: #0c3140 !important;
          padding: 0.08em 0.68em !important;
        }
        .text p { line-height: 2.06 !important; }
        .container--bottom-visible .glass-content {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 14.285%,
            rgba(255,255,255,0.04) 28%,
            rgba(255,255,255,0.24) 66%,
            rgba(255,255,255,0.48) 100%
          ) !important;
          border-color: rgba(255,255,255,0.14) !important;
        }
        /* v2: make first two suggestion chips slightly gray-toned */
        .suggestions .chip:nth-child(1) {
          background: linear-gradient(180deg, rgba(242,244,247,0.55) 0%, rgba(232,236,242,0.28) 100%) !important;
          border-color: rgba(210,217,226,0.72) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.66),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(1.02) brightness(1.02) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.02) brightness(1.02) !important;
          filter: saturate(0.96) brightness(0.995) !important;
          color: rgba(52,64,84,0.62) !important;
        }
        .suggestions .chip:nth-child(2) {
          background: linear-gradient(180deg, rgba(240,242,246,0.50) 0%, rgba(228,232,240,0.24) 100%) !important;
          border-color: rgba(206,214,224,0.70) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.64),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(1.02) brightness(1.01) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.02) brightness(1.01) !important;
          filter: saturate(0.96) brightness(0.995) !important;
          color: rgba(52,64,84,0.60) !important;
        }
        /* v2: bottom chip stays white glassmorphism */
        .suggestions .chip:nth-child(3) {
          background: linear-gradient(180deg, rgba(255,255,255,0.60) 0%, rgba(255,255,255,0.34) 100%) !important;
          border-color: rgba(255,255,255,0.78) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.76),
            0 6px 14px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(1.06) brightness(1.02) !important;
          -webkit-backdrop-filter: blur(14px) saturate(1.06) brightness(1.02) !important;
          color: rgba(51,60,72,0.58) !important;
        }
        /* v2: suggestions closer to message bar and slightly shorter chips */
        .suggestions {
          bottom: calc(var(--mb-bottom) + var(--mb-h) + 6px) !important;
        }
        .suggestions .chip {
          padding: clamp(10px, 2.8vw, 12px) clamp(16px, 4vw, 18px) !important;
        }
        /* v2: left/right anchor message bar to match modal exactly (and nudge down) */
        .message-bar {
          position: fixed !important;
          left: calc(var(--side-left) + var(--modal-shrink) - var(--center-fix)) !important;
          right: calc(var(--side-right) + var(--modal-shrink) + var(--center-fix)) !important;
          width: auto !important;
          margin: 0 !important;
          bottom: calc(var(--mb-bottom) - 4px) !important;
        }
        /* ensure inner media corners match */
        .photo { border-radius: 32px !important; }
      `}</style>
    </>
  );
}


