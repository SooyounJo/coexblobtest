import React, { useEffect, useRef, useState } from 'react';

/**
 * v10/1.js 모달 로직
 * 타이핑 애니메이션과 모달 UI를 담당하는 재사용 가능한 훅 및 컴포넌트
 */

/**
 * 타이핑 애니메이션 로직을 처리하는 커스텀 훅
 * @param {string} fullText - 타이핑할 전체 텍스트
 * @param {number} speed - 타이핑 속도 (ms per char)
 * @returns {object} { typed, progress, typingDone }
 */
export function useTypingAnimation(fullText, speed = 28) {
  const [typed, setTyped] = useState('');
  const [progress, setProgress] = useState(0);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      const next = fullText.slice(0, i);
      setTyped(next);
      const p = Math.min(1, next.length / fullText.length);
      setProgress(p);
      if (i >= fullText.length) {
        clearInterval(timer);
        setTypingDone(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [fullText, speed]);

  return { typed, progress, typingDone };
}

/**
 * 모달 카드 높이를 동적으로 계산하는 커스텀 훅
 * @param {React.RefObject} innerRef - 모달 내부 컨텐츠 ref
 * @param {string} typed - 현재 타이핑된 텍스트
 * @param {number} progress - 타이핑 진행도
 * @param {number} minHeight - 최소 높이
 * @returns {number} cardHeight
 */
export function useModalCardHeight(innerRef, typed, progress, minHeight = 56) {
  const [cardHeight, setCardHeight] = useState(minHeight);

  useEffect(() => {
    const update = () => {
      if (!innerRef.current) return;
      const h = innerRef.current.scrollHeight;
      setCardHeight(Math.max(minHeight, h));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [typed, progress, minHeight, innerRef]);

  return cardHeight;
}

/**
 * 모달 UI 컴포넌트
 */
export function ModalContent({ fullText, speed = 28 }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const { typed, progress, typingDone } = useTypingAnimation(fullText, speed);
  const cardHeight = useModalCardHeight(innerRef, typed, progress);

  return (
    <>
      <div className="modal2-wrapper">
        <div className="modal2-wrap">
          <div className="modal2-card" ref={cardRef} style={{ height: cardHeight }}>
            <div className="modal2-inner" ref={innerRef}>
              <div className="modal2-text">
                {typed.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
              <div className={`modal2-photo ${typingDone ? 'is-in' : ''}`} aria-hidden />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* ============ v10/1.js 모달 스타일 ============ */
        /* Pretendard Variable 폰트 로드 (public 폴더) */
        @font-face {
          font-family: 'Pretendard Variable';
          src: url('/PretendardVariable.woff2') format('woff2');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
        /* 모달에 필요한 CSS 변수 정의 (바로 옮기기 편하도록 모두 포함) */
        .modal2-wrapper {
          --glass-radius: clamp(28px, 8vw, 36px);
          --glass-side: clamp(16px, 5.2vw, 24px);
          --glass-inner: clamp(20px, 5vw, 28px);
          --safe-l: env(safe-area-inset-left, 0px);
          --safe-r: env(safe-area-inset-right, 0px);
          --side-left: calc(var(--glass-side) + var(--safe-l));
          --side-right: calc(var(--glass-side) + var(--safe-r));
          --modal-shrink: clamp(14px, 3.6vw, 28px);
          --frame-width: calc(100% - var(--side-left) - var(--side-right) - (var(--modal-shrink) * 2));
          --center-fix: calc((var(--safe-l) - var(--safe-r)) / 2);
          --header-gap: clamp(5px, 1.6vh, 12px);
        }
        .modal2-wrap {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: start center;
          padding-top: calc(clamp(28px, 10vh, 64px) + var(--header-gap));
          pointer-events: none;
          z-index: 90;
        }
        .modal2-card {
          --w: calc(var(--frame-width));
          width: var(--w);
          border-radius: calc(var(--glass-radius) + 12px);
          background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.70) 100%);
          border: 0.5px solid rgba(255,255,255,0.20);
          box-shadow:
            0 28px 48px rgba(22, 42, 58, 0.10),
            inset 0 0.5px 0 rgba(255,255,255,0.18);
          backdrop-filter: blur(38px) saturate(0.95);
          -webkit-backdrop-filter: blur(38px) saturate(0.95);
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 1fr;
          align-items: start;
          pointer-events: auto;
          transition: height 140ms ease;
        }
        .modal2-inner {
          width: 100%;
          box-sizing: border-box;
          padding: var(--glass-inner);
          display: grid;
          gap: var(--glass-inner);
        }
        .modal2-text {
          padding: 0;
          color: #1f2640;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          font-weight: 700;
          text-align: center;
          word-break: keep-all;
        }
        .modal2-text p {
          margin: 6px 0;
          line-height: 1.72;
          text-indent: 1em;
        }
        .modal2-photo {
          margin: 0 var(--glass-inner) 0;
          border-radius: calc(var(--glass-radius) + 12px - 16px);
          background:
            url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop') center / cover no-repeat,
            rgba(255,255,255,0.10);
          height: 0;
          opacity: 0;
          transform: translateY(12px) scale(0.98);
          filter: blur(2.5px);
          transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
                      filter 500ms cubic-bezier(0.16, 1, 0.3, 1),
                      height 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal2-photo.is-in {
          height: auto;
          aspect-ratio: 4 / 3;
          margin: 0;
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
      `}</style>
    </>
  );
}

/**
 * 모달 로직 전체를 통합하는 메인 컴포넌트
 * v10/1.js에서 바로 사용할 수 있도록 설계
 */
export function ModalLogic({ fullText, speed = 28 }) {
  return <ModalContent fullText={fullText} speed={speed} />;
}

