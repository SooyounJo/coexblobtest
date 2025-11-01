import React, { useState } from 'react';



const Ver2_5 = () => {

  const [stage, setStage] = useState(2); // default: show five blobs (basic status)
  const [activeId, setActiveId] = useState(null); // clicked highlight
  const next = () => setStage((s) => Math.min(2, s + 1));
  const prev = () => setStage((s) => Math.max(0, s - 1));

  return (

    <div className={`container stage-${stage}`}>

      <button className="nav left" onClick={prev}>‹</button>
      <button className="nav right" onClick={next}>›</button>

      {/* Seed blob (stage 0) that grows in stage 1 */}
      <div className="seed">
        <div className="seed-layer sharp"></div>
        <div className="seed-layer blur"></div>
      </div>

      {/* Rising balloons (stage 2) */}
      <div className="balloons">
        <div className={`balloon b1 ${activeId==='b1'?'active':''}`} onClick={()=>setActiveId('b1')}><span className="label">별마당 도서관 정보</span></div>
        <div className={`balloon b2 ${activeId==='b2'?'active':''}`} onClick={()=>setActiveId('b2')}><span className="label">컨퍼런스 위치</span></div>
        <div className={`balloon b3 ${activeId==='b3'?'active':''}`} onClick={()=>setActiveId('b3')}><span className="label">레스토랑 추천</span></div>
        {/* Extra bloom blobs per spec (2 items) */}
        <div className={`balloonA a1 ${activeId==='a1'?'active':''}`} onClick={()=>setActiveId('a1')}><span className="label">가족과의 놀거리 추천</span></div>
        <div className={`balloonB s1 ${activeId==='s1'?'active':''}`} onClick={()=>setActiveId('s1')}><span className="label">카페 추천</span></div>
      </div>

      {/* End button */}
      <button className="endBtn">End</button>

      <style jsx>{`

        .container {

          width: 100%;

          height: 100vh;

          position: relative;

          overflow: hidden;

          /* green → white background gradient */

          background: radial-gradient(120% 120% at 50% 35%, #E8FFE8 0%, #F7FFF9 45%, #FFFFFF 100%);

        }

        .nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 6px 16px rgba(0,0,0,0.15);
          font-size: 20px;
          font-weight: 800;
          cursor: pointer;
          z-index: 10;
        }
        .nav.left { left: 10px; }
        .nav.right { right: 10px; }

        .seed {

          position: absolute;

          left: 50%;

          top: 50%;

          width: 360px;

          height: 360px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          transition: transform 900ms ease-in, width 900ms ease-in, height 900ms ease-in;

        }

        /* seed visual layers copied from ver2/1.js */
        .seed-layer {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          transform: rotate(-180deg);
          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFCB0 0%, #64FFAF 38.04%, #B7FEDC 75.51%, #ABFFBC 91.03%, #EDFFE5 100%);
        }
        .seed-layer.sharp {
          filter: blur(0px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);
                  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);
          z-index: 2;
        }
        .seed-layer.blur {
          filter: blur(25px);
          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);
                  mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);
          z-index: 1;
        }

        /* Stage 1: seed grows to become background */
        .stage-1 .seed, .stage-2 .seed {
          width: 2200px;
          height: 2200px;
          transform: translate(-50%, -50%) scale(1.05);
          opacity: 0.5; /* lighter after background expands */
          filter: blur(12px);
        }

        /* subtle outer halo */

        .seed::before {

          content: "";

          position: absolute;

          inset: -70px;

          border-radius: 50%;

          background: radial-gradient(70% 70% at 50% 50%, rgba(190,220,255,0.75) 0%, rgba(190,220,255,0.0) 72%);

          filter: blur(48px);

          z-index: -1;

        }

        /* sharp outer rim + slight glow (not blurred) */
        .seed::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow:
            0 0 0 2px rgba(230,235,255,0.95),
            0 0 22px 6px rgba(190,210,255,0.5);
          mix-blend-mode: screen;
        }

        /* (no white core) */

        /* responsive */

        @media (max-width: 768px) {
          .seed { width: 300px; height: 300px; }
          .stage-1 .seed, .stage-2 .seed { width: 1500px; height: 1500px; }
        }

        @media (max-width: 480px) {
          .seed { width: 240px; height: 240px; }
          .stage-1 .seed, .stage-2 .seed { width: 1100px; height: 1100px; }
        }

        /* Balloons */
        .balloons { position: absolute; inset: 0; }
        .balloon {
          position: absolute;
          width: 210px;
          height: 210px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          clip-path: circle(50% at 50% 50%);
          background: radial-gradient(50% 50% at 50% 50%, #EEF0FF 43.75%, #FAFFFD 65.87%, rgba(255, 255, 255, 0.61) 100%);
          box-shadow: 0px -14px 20px #FFEFFC, 0px 20px 20px #CBD7F3, 0px 4px 100px #CFE9FF;
          transform: translateY(40vh);
          opacity: 0;
          transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease, box-shadow 250ms ease, filter 250ms ease;
          pointer-events: auto;
          cursor: pointer;
          z-index: 1;
        }
        .balloon .label, .balloonA .label, .balloonB .label{
          position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          font-weight: 800; font-size: 18px; color: rgba(0,0,0,0.25); pointer-events: none;
        }
        .balloon.active .label, .balloonA.active .label, .balloonB.active .label{ color: #111; }
        /* Final attached positions */
        /* 5) Ellipse 2701 — 별마당 도서관 */
        .b1{ left: 18px; top: 588px; width: 233px; height: 233px; z-index: 0; 
          background: radial-gradient(50% 50% at 50% 50%, #D0D6EB 19.23%, #D0D6EB 43.75%, #E2E7F8 65.87%, rgba(255, 255, 255, 0.61) 100%);
          opacity: 0.4; filter: blur(10px); box-shadow: 0px 15px 20px #FFEFFC, -90px 20px 89px #CBD7F3, 0px 4px 100px #CFE9FF;
        }
        /* 2) Ellipse 2699 — 컨퍼런스 위치 */
        .b2{ left: 203px; top: 264px; width: 210px; height: 210px; z-index: 4; 
          background: radial-gradient(50% 50% at 50% 50%, #EEF0FF 43.75%, #FAFFFD 65.87%, rgba(255, 255, 255, 0.61) 100%);
          box-shadow: 0px -14px 20px #FFEFFC, 0px 20px 20px #CBD7F3, 0px 4px 100px #CFE9FF; 
        }
        /* 4) Ellipse 2700 — 레스토랑 추천 */
        .b3{ left: 135px; top: 452px; width: 254px; height: 254px; z-index: 2; 
          background: radial-gradient(50% 50% at 50% 50%, #F0F3FF 43.75%, #E2E7F8 65.87%, rgba(255, 255, 255, 0.61) 100%);
          box-shadow: 0px -14px 20px #FFEFFC, 0px 20px 20px #CBD7F3, 0px 4px 100px #CFE9FF; 
        }
        .stage-2 .balloon { opacity: 0.92; transform: translateY(0); }
        .stage-2 .b1{ opacity: 0.35; }
        .stage-2 .b2{ transition-delay: 80ms; }
        .stage-2 .b3{ transition-delay: 140ms; }
        /* removed b4,b5 for total of 5 */

        /* Ellipse 2695 - large bloom */
        .balloonA{
          position: absolute;
          width: 297px;
          height: 297px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          clip-path: circle(50% at 50% 50%);
          background: radial-gradient(50% 50% at 50% 50%, #DEE6FF 43.75%, #FFFFFF 65.87%, rgba(255, 255, 255, 0.61) 100%);
          box-shadow: 0px -14px 20px #FFEFFC, 0px 20px 20px #CBD7F3, 0px 4px 100px #CFE9FF;
          transform: translateY(40vh);
          opacity: 0;
          transition: transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease, box-shadow 250ms ease, filter 250ms ease;
          backdrop-filter: blur(28.5px);
          -webkit-backdrop-filter: blur(28.5px);
          pointer-events: auto; cursor: pointer; z-index: 1;
        }
        /* 1) Ellipse 2695 — 가족과의 놀거리 추천 */
        .a1{ left: -9px; top: 62px; width: 297px; height: 297px; z-index: 1; 
        }
        /* removed a2 for total of 5 */
        .stage-2 .balloonA{ opacity: 0.65; transform: translateY(0); }

        /* Ellipse 2701 - small plus-lighter */
        .balloonB{
          position: absolute;
          width: 152px;
          height: 152px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          clip-path: circle(50% at 50% 50%);
          background: transparent;
          box-shadow: none;
          transform: translateY(40vh);
          opacity: 0;
          transition: transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease, box-shadow 250ms ease, filter 250ms ease;
          pointer-events: auto; cursor: pointer; z-index: 1;
        }
        .balloonB::before{
          content: "";
          position: absolute; inset: 0; border-radius: 50%;
          background: radial-gradient(50% 50% at 50% 50%, #D0D6EB 43.75%, #E2E7F8 65.87%, rgba(255, 255, 255, 0.61) 100%);
          mix-blend-mode: plus-lighter;
          box-shadow: 0px -14px 20px #FFEFFC, 0px 20px 20px #CBD7F3, 0px 4px 100px #CFE9FF;
          transition: box-shadow 250ms ease, filter 250ms ease, opacity 250ms ease;
        }
        .balloonB.active::before{ box-shadow: 0px -18px 26px #FFEFFC, 0px 26px 26px #CBD7F3, 0px 8px 140px #CFE9FF; }
        /* lock size of cafe (s1) when active to avoid elongation */
        .s1.active{ width: 170px; height: 170px; transform: translateY(0); }
        /* 3) Ellipse 2701 — 카페 추천 */
        .s1{ left: 35px; top: 354px; width: 152px; height: 152px; z-index: 5; }
        /* removed s2 for total of 5 */
        .stage-2 .balloonB{ opacity: 0.23; transform: translateY(0); }

        /* Active highlight: stronger bloom and front-most */
        .balloon.active, .balloonA.active, .balloonB.active{
          box-shadow: 0px -18px 26px #FFEFFC, 0px 26px 26px #CBD7F3, 0px 8px 140px #CFE9FF, 0 0 0 2px rgba(255,255,255,0.9);
          filter: blur(0.5px);
          opacity: 1;
          z-index: 99;
        }

        /* End button styling */
        .endBtn{
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          padding: 15px 85px;
          gap: 10px;
          position: fixed;
          width: 330px;
          height: 56px;
          left: 50%;
          transform: translateX(-50%);
          bottom: 36px;
          background: rgba(135, 254, 200, 0.75);
          box-shadow: inset 0px 0px 50px #EEEEEE;
          border-radius: 68px;
          border: none;
          font-weight: 800;
          color: #0c0c0c;
          cursor: pointer;
          z-index: 2000;
        }

      `}</style>

    </div>

  );

};

export default Ver2_5;
