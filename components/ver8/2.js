import React from 'react';
import Ver8_1 from './1.js';

export default function Ver8_2() {
  return (
    <>
      <Ver8_1 />
      <style jsx global>{`
        /* v2-only extra inset: do NOT change --modal-shrink so message bar stays the same */
        .container { --modal-extra-inset: clamp(16px, 5vw, 56px); }
        /* v2: switch main modal to ver7 d2 glass style */
        .glass-modal {
          /* match message-bar horizontal frame exactly */
          width: calc(100% - var(--side-left) - var(--side-right) - (var(--modal-shrink) * 2)) !important;
          margin-left: calc(var(--side-left) + var(--modal-shrink)) !important;
          margin-right: calc(var(--side-right) + var(--modal-shrink)) !important;
          aspect-ratio: 142.41 / 190.74 !important;
          display: grid !important;
          place-items: center !important;
          pointer-events: none !important;
        }
        .glass-content {
          display: grid !important;
          gap: clamp(18px, 3.6vw, 26px) !important;
          padding: clamp(22px, 5.2vw, 30px) !important;
          border-radius: 28px !important;
          background: rgba(255,255,255,0.025) !important;
          border: 1px solid rgba(255,255,255,0.4) !important;
          box-shadow:
            0 28px 48px rgba(22, 42, 58, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -10px 28px rgba(255,255,255,0.12) !important;
          backdrop-filter: blur(42px) saturate(2.35) contrast(1.08) !important;
          -webkit-backdrop-filter: blur(42px) saturate(2.35) contrast(1.08) !important;
          text-align: center !important;
          color: #0f2420 !important;
          position: relative !important;
          overflow: hidden !important;
          filter: none !important;
        }
        .glass-content::before {
          content: '' !important;
          position: absolute !important;
          inset: 0 !important;
          border-radius: inherit !important;
          background: linear-gradient(145deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.0) 100%) !important;
          mix-blend-mode: screen !important;
          opacity: 0.48 !important;
          pointer-events: none !important;
        }
        .glass-content::after {
          content: '' !important;
          position: absolute !important;
          inset: -30% !important;
          background:
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.24), transparent 60%),
            radial-gradient(circle at 86% 78%, rgba(118,212,255,0.18), transparent 70%),
            rgba(255,255,255,0.018) !important;
          opacity: 0.16 !important;
          filter: blur(60px) saturate(1.4) !important;
          pointer-events: none !important;
        }
        /* reduce vertical breathing room inside card image for the new ratio */
        .photo { 
          margin-top: clamp(4px, 1.2vw, 8px) !important; 
          margin-bottom: clamp(12px, 3vw, 18px) !important; 
        }
      `}</style>
    </>
  );
}


