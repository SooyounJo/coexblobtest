import React, { useEffect, useRef, useState } from 'react';
import Ver2_2 from './2';



const Ver2_6 = () => {

  const audioRef = useRef(null); // used for <video> as well
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [intro, setIntro] = useState(false); // show entering blobs
  const [fadeVideo, setFadeVideo] = useState(false); // fade video out
  const [swapToV2, setSwapToV2] = useState(false); // mount Ver2_2
  const [showHero, setShowHero] = useState(false); // delayed hero text

  // prevent page scroll while this view is active
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onCanPlay = () => setReady(true);
    const onError = () => setError('오디오를 불러오지 못했습니다. public 폴더에 sori.* 파일을 확인해주세요.');
    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onError);
    return () => {
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onError);
    };
  }, []);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    try {
      if (playing) {
        el.pause();
        setPlaying(false);
      } else {
        // iOS/Safari 정책 대응: 사용자 제스처에서만 play 호출
        // reset state if we finished a run
        setSwapToV2(false);
        setFadeVideo(false);
        setIntro(false);
        setShowHero(false);
        setError(null);
        el.currentTime = 0;
        await el.play();
        setPlaying(true);
        // start blob intro at 2s
        setTimeout(() => setIntro(true), 2000);
        // start video fade near 3s so by 4s it's gone
        setTimeout(() => setFadeVideo(true), 3000);
        // by 4s: pause video and keep blobs on screen
        setTimeout(() => {
          try { el.pause(); } catch (_) {}
          setPlaying(false);
        }, 4000);
        // show hero 2s after video stop (≈6s from start)
        setTimeout(() => setShowHero(true), 6000);
      }
    } catch (e) {
      setError('재생할 수 없습니다. 다른 형식(sori.mp3/m4a/ogg/wav)을 시도해보세요.');
    }
  };

  return (

    <div className={`container ${intro ? 'intro' : ''} ${fadeVideo ? 'fadeVideo' : ''}`}>

      <video
        className="player"
        ref={audioRef}
        playsInline
        preload="auto"
        // iOS/WebKit: hint to keep inline
        webkit-playsinline="true"
        // No native controls; control with the bottom button
        controls={false}
        controlsList="nodownload noplaybackrate nofullscreen"
        disablePictureInPicture
        src="/sori.mp4"
      />

      {/* hero removed */}

      <button className="cta" onClick={togglePlay}>
        {playing ? '일시정지' : (ready ? (fadeVideo ? '다시 재생' : '재생') : '로딩 중...')}
      </button>

      {error && <div className="hint">{error}</div>}

      {/* Intro blobs (enter like 1.js then settle to 2.js positions) */}
      {!swapToV2 && (
        <div className="blob-container" aria-hidden={!intro}>
          <div className="blob-wrapper top-blob">
            <div className="main-blob color1"></div>
            <div className="main-blob color2"></div>
          </div>
          <div className="blob-wrapper bottom-blob">
            <div className="main-blob color1"></div>
            <div className="main-blob color2"></div>
          </div>
        </div>
      )}

      {/* Back button after sequence, while blobs stay on screen */}
      {(fadeVideo && !playing) && (
        <button
          className="backBtn"
          onClick={() => {
            const el = audioRef.current;
            try { if (el) { el.pause(); el.currentTime = 0; } } catch (_) {}
            setFadeVideo(false);
            setIntro(false);
            setPlaying(false);
            setShowHero(false);
            setError(null);
          }}
        >
          ← 뒤로가기
        </button>
      )}
      {/* Delayed hero copy (same as 3.js) */}
      <div className={`heroDelayed ${showHero ? 'visible' : ''}`}>
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br/>Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>

      <style jsx>{`
        .container {
          width: 100%;
          height: 100vh;
          background: #FFFFFF;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          /* video scale control */
          --video-scale: 1.8; /* centered scale factor */
          --enter-duration: 1600ms;
          --enter-ease: cubic-bezier(0.4, 0, 1, 1);
        }
        .player {
          width: min(92vw, 480px);
          max-height: 60vh;
          border-radius: 12px;
          background: #000;
        }
        .heroDelayed {
          position: absolute;
          bottom: 150px;
          left: 16px;
          right: 16px;
          color: #111;
          z-index: 12;
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 1000ms ease, transform 1000ms ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .heroDelayed.visible { opacity: 1; transform: translateY(0); }
        .eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.02em; margin-bottom: 8px; }
        .title { font-size: 44px; line-height: 1.05; font-weight: 900; margin: 0 0 10px 0; }
        .subtitle { font-size: 15px; line-height: 1.4; font-weight: 600; margin: 0; opacity: 0.9; }
        .cta {
          position: absolute;
          left: 50%;
          bottom: 48px;
          transform: translateX(-50%);
          width: clamp(240px, 92vw, 360px);
          height: clamp(44px, 9.6vw, 56px);
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.06);
          background: rgba(255,255,255,0.92);
          box-shadow: 0 12px 28px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.7);
          color: #111;
          font-size: clamp(14px, 4.2vw, 17px);
          font-weight: 800;
          padding: 0 clamp(12px, 4vw, 18px);
          cursor: pointer;
          z-index: 3;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          box-sizing: border-box;
        }
        .hint {
          position: absolute;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          color: #666;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          text-align: center;
          z-index: 3;
        }
        .backBtn {
          position: fixed;
          top: 16px; left: 16px;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.9);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: #111; font-weight: 700; cursor: pointer;
          z-index: 4000;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        @media (max-width: 480px) {
          .cta {
            position: fixed;
            bottom: calc(30px + env(safe-area-inset-bottom, 0px));
            left: 50%; transform: translateX(-50%);
          }
          .hint { bottom: calc(120px + env(safe-area-inset-bottom, 0px)); }
        }
        /* Full-bleed video */
        .player {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 100vw;
          height: 100vh;
          object-fit: contain; /* preserve source aspect ratio */
          object-position: center center;
          transform: translate(-50%, -50%) scale(var(--video-scale));
          transform-origin: center center; /* lock scale to the center */
          will-change: transform;
          z-index: 1;
          pointer-events: none; /* interactions go to CTA */
          user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
          background: #000;
        }
        .container.fadeVideo .player { opacity: 0; transition: opacity 1000ms ease; }
        /* Intro blobs */
        .blob-container {
          position: absolute; inset: 0; z-index: 2; pointer-events: none; opacity: 0;
          transition: opacity 300ms ease;
        }
        .container.intro .blob-container { opacity: 1; }
        .blob-wrapper { position: absolute; width: 450px; height: 450px; left: 50%; }
        .top-blob { top: -70%; transform: translate(-50%, -50%) scale(1.2); transition: top var(--enter-duration) var(--enter-ease); }
        .bottom-blob { top: 140%; transform: translate(-50%, -50%) scale(1.3); transition: top var(--enter-duration) var(--enter-ease); }
        /* Settle to 2.js default positions */
        .container.intro .top-blob { top: calc(-8% - 70px); animation: springTop 950ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both; }
        .container.intro .bottom-blob { top: calc(75% - 70px); animation: springBottom 950ms cubic-bezier(0.22, 1, 0.36, 1) 0ms 1 both; }
        .main-blob { position: absolute; inset: 0; border-radius: 50%; }
        /* Orientation to match 2.js */
        .top-blob .main-blob { transform: rotate(0deg); }
        .bottom-blob .main-blob { transform: rotate(-180deg); }
        /* initial: heavy blur while entering */
        .container .top-blob .main-blob,
        .container .bottom-blob .main-blob {
          filter: blur(60px) hue-rotate(0deg) brightness(1) saturate(1);
          transition: filter 1200ms cubic-bezier(0.22, 1, 0.36, 1);
        }
        /* settle to 2.js blur levels */
        .container.intro .top-blob .main-blob { filter: blur(10px) hue-rotate(0deg) brightness(1) saturate(1); }
        .container.intro .bottom-blob .main-blob { filter: blur(1px) hue-rotate(0deg) brightness(1) saturate(1); }
        .main-blob.color1 { background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFEC4 0%, #B7FFD0 30%, #64FFAF 60%, #B7FEDC 85%, #EDFFE5 100%); }
        .main-blob.color2 { background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #99FFEE 0%, #FFFFBB 38%, #99FFEE 76%, #99FF99 91%, #99FFEE 100%); }

        /* Spring keyframes – slight overshoot and settle to final scales */
        @keyframes springTop {
          0% { transform: translate(-50%, -50%) scale(1.2); }
          60% { transform: translate(-50%, -52.2%) scale(1.62); } /* overshoot up & bigger */
          82% { transform: translate(-50%, -49.2%) scale(1.46); }
          100% { transform: translate(-50%, -50%) scale(1.5); }
        }
        @keyframes springBottom {
          0% { transform: translate(-50%, -50%) scale(1.3); }
          60% { transform: translate(-50%, -47.6%) scale(1.72); } /* overshoot down & bigger */
          82% { transform: translate(-50%, -50.6%) scale(1.58); }
          100% { transform: translate(-50%, -50%) scale(1.65); }
        }
      `}</style>
    </div>

  );

};



export default Ver2_6;


