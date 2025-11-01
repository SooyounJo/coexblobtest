import React from 'react';



const Ver2_5 = () => {

  return (

    <div className="container">

      <div className="blob">

        <div className="core"></div>

      </div>

      <style jsx>{`

        .container {

          width: 100%;

          height: 100%;

          position: relative;

          overflow: hidden;

          /* green → white background gradient */

          background: radial-gradient(120% 120% at 50% 35%, #E8FFE8 0%, #F7FFF9 45%, #FFFFFF 100%);

        }

        .blob {

          position: absolute;

          left: 50%;

          top: 50%;

          width: 360px;

          height: 360px;

          transform: translate(-50%, -50%);

          border-radius: 50%;

          /* inner soft ring like the image: 44%, 66%, 100% stops */

          background: radial-gradient(60% 60% at 50% 45%, #EEF0FF 44%, #FAFFFD 66%, rgba(255,255,255,0.61) 100%),

                      radial-gradient(70% 70% at 50% 50%, #FAFFFD 0%, rgba(250,255,253,0.9) 40%, rgba(255,255,255,0.6) 100%);

          box-shadow:

            0 0 55px 0 rgba(180, 210, 255, 0.55),

            inset 0 0 30px rgba(255,255,255,0.8);

        }

        /* subtle outer halo */

        .blob::before {

          content: "";

          position: absolute;

          inset: -28px;

          border-radius: 50%;

          background: radial-gradient(70% 70% at 50% 50%, rgba(190,220,255,0.55) 0%, rgba(190,220,255,0.0) 70%);

          filter: blur(18px);

          z-index: -1;

        }

        /* inner bright core */

        .core {

          position: absolute;

          inset: 18%;

          border-radius: 50%;

          background: radial-gradient(55% 55% at 50% 45%, #FFFFFF 0%, #FAFFFD 60%, rgba(255,255,255,0.75) 100%);

          filter: blur(2px);

        }

        /* responsive */

        @media (max-width: 768px) {

          .blob { width: 300px; height: 300px; }

        }

        @media (max-width: 480px) {

          .blob { width: 240px; height: 240px; }

        }

      `}</style>

    </div>

  );

};

export default Ver2_5;
