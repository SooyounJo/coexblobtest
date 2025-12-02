import React from 'react';
import Ver8_1 from './1.js';

export default function Ver8_2() {
  return (
    <>
      <Ver8_1 />
      <style jsx global>{`
        /* Use 1.js modal as-is; keep only v2's tweaks */
        .container { --glass-radius: 30px; }
        /* Make the main modal noticeably more transparent in v2 */
        .glass-content {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 18%,
            rgba(255,255,255,0.06) 30%,
            rgba(255,255,255,0.18) 66%,
            rgba(255,255,255,0.70) 100%
          ) !important;
          border: 0.5px solid rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(36px) saturate(0.88) brightness(1.02) contrast(0.92) !important;
          -webkit-backdrop-filter: blur(36px) saturate(0.88) brightness(1.02) contrast(0.92) !important;
          filter: saturate(0.90) !important;
          border-radius: 28px !important;
        }
        /* Make highlight pill taller in v2 */
        .hl { padding: 0.20em 0.72em !important; }
        /* Nudge inner contents slightly upward */
        .photo {
          margin-bottom: calc(16px * var(--modal-scale)) !important;
          border-radius: 12px !important;
        }
        .text { margin-top: -4px !important; }
        /* v2: top two suggestion chips are gray glassmorphism */
        .suggestions .chip:nth-child(1) {
          background: linear-gradient(180deg, rgba(224,228,232,0.58) 0%, rgba(206,210,216,0.28) 100%) !important;
          border-color: rgba(255,255,255,0.86) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.66),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(0.94) brightness(1.01) !important;
          -webkit-backdrop-filter: blur(14px) saturate(0.94) brightness(1.01) !important;
          color: rgba(52,60,70,0.62) !important;
        }
        .suggestions .chip:nth-child(2) {
          background: linear-gradient(180deg, rgba(230,232,236,0.54) 0%, rgba(212,216,224,0.26) 100%) !important;
          border-color: rgba(255,255,255,0.80) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.64),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(0.96) brightness(1.01) !important;
          -webkit-backdrop-filter: blur(14px) saturate(0.96) brightness(1.01) !important;
          color: rgba(52,60,70,0.60) !important;
        }
      `}</style>
    </>
  );
}


