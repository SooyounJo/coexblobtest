import React from 'react';
import Ver8_1 from './1.js';

export default function Ver8_2() {
  return (
    <>
      <Ver8_1 />
      <style jsx global>{`
        /* Use 1.js modal as-is; keep only v2's tweaks */
        .container { --glass-radius: 24px; }
        /* Make the main modal noticeably more transparent in v2 */
        .glass-content {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 18%,
            rgba(255,255,255,0.06) 30%,
            rgba(255,255,255,0.18) 66%,
            rgba(255,255,255,0.38) 100%
          ) !important;
          border: 0.5px solid rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(36px) saturate(0.88) brightness(1.02) contrast(0.92) !important;
          -webkit-backdrop-filter: blur(36px) saturate(0.88) brightness(1.02) contrast(0.92) !important;
          filter: saturate(0.90) !important;
          border-radius: 24px !important;
        }
        /* Make highlight pill taller in v2 */
        .hl { padding: 0.14em 0.72em !important; }
        /* Nudge inner contents slightly upward */
        .photo {
          margin-bottom: calc(16px * var(--modal-scale)) !important;
          border-radius: 12px !important;
        }
        .text { margin-top: -4px !important; }
        /* v2: top two suggestion chips are gray glassmorphism */
        .suggestions .chip:nth-child(1) {
          background: linear-gradient(180deg, rgba(245,246,248,0.80) 0%, rgba(232,234,238,0.48) 100%) !important;
          border-color: rgba(208,214,222,0.90) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.66),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(0.88) brightness(0.98) !important;
          -webkit-backdrop-filter: blur(14px) saturate(0.88) brightness(0.98) !important;
          color: rgba(58,62,72,0.72) !important;
        }
        .suggestions .chip:nth-child(2) {
          background: linear-gradient(180deg, rgba(244,246,249,0.72) 0%, rgba(230,234,240,0.40) 100%) !important;
          border-color: rgba(210,216,224,0.80) !important;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.64),
            0 4px 10px rgba(15,23,42,0.06) !important;
          backdrop-filter: blur(14px) saturate(0.90) brightness(0.99) !important;
          -webkit-backdrop-filter: blur(14px) saturate(0.90) brightness(0.99) !important;
          color: rgba(58,62,72,0.68) !important;
        }
      `}</style>
    </>
  );
}


