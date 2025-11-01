import React from 'react';



const T1 = () => {

  return (

    <div className="container">

      <div className="blob-container">

        {/* 잔상 레이어들 - 뒤에서 앞으로 */}

        <div className="trail-blob trail-5"></div>

        <div className="trail-blob trail-4"></div>

        <div className="trail-blob trail-3"></div>

        <div className="trail-blob trail-2"></div>

        <div className="trail-blob trail-1"></div>
        

        {/* 메인 블롭 - 그라디언트 블러 효과 */}
        

        <div className="blob-wrapper">

          {/* 선명한 레이어 (위쪽) */}

          <div className="main-blob sharp"></div>

          {/* 블러 레이어 (아래쪽) */}

          <div className="main-blob blurred"></div>

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

          z-index: 5;

          animation: shaderWave 8s ease-in-out infinite;

        }

        .main-blob {

          position: absolute;

          width: 100%;

          height: 100%;

          left: 0;

          top: 0;

          transform: rotate(-180deg);

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFCB0 0%, #64FFAF 38.04%, #B7FEDC 75.51%, #ABFFBC 91.03%, #EDFFE5 100%);

          border-radius: 50%;

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.4),

            0 0 5px 1px rgba(100, 255, 175, 0.2);

        }

        .main-blob.sharp {

          filter: blur(0px);

          mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);

          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 30%, rgba(0,0,0,0) 60%);

          z-index: 2;

        }

        .main-blob.blurred {

          filter: blur(25px);

          mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);

          -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,1) 70%);

          z-index: 1;

        }

        .trail-blob {

          position: absolute;

          width: 559px;

          height: 559px;

          left: 50%;

          top: 50%;

          transform: translate(-50%, -50%) rotate(-180deg);

          background: radial-gradient(70.32% 70.88% at 47.16% 93.14%, #FFFCB0 0%, #64FFAF 38.04%, #B7FEDC 75.51%, #ABFFBC 91.03%, #EDFFE5 100%);

          border-radius: 50%;

          filter: blur(15px);

          animation: shaderWave 8s ease-in-out infinite;

        }

        /* 잔상 레이어들 - 뒤에서 점점 흐려지는 효과 */

        .trail-blob {

          z-index: 0;

        }

        .trail-1 {

          z-index: 4;

          opacity: 0.7;

          animation-delay: -0.3s;

          filter: blur(17px);

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.25),

            0 0 5px 1px rgba(100, 255, 175, 0.15);

        }

        .trail-2 {

          z-index: 3;

          opacity: 0.5;

          animation-delay: -0.6s;

          filter: blur(19px);

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.2),

            0 0 5px 1px rgba(100, 255, 175, 0.1);

        }

        .trail-3 {

          z-index: 2;

          opacity: 0.35;

          animation-delay: -0.9s;

          filter: blur(21px);

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.15),

            0 0 5px 1px rgba(100, 255, 175, 0.08);

        }

        .trail-4 {

          z-index: 1;

          opacity: 0.22;

          animation-delay: -1.2s;

          filter: blur(23px);

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.1),

            0 0 5px 1px rgba(100, 255, 175, 0.05);

        }

        .trail-5 {

          z-index: 0;

          opacity: 0.12;

          animation-delay: -1.5s;

          filter: blur(25px);

          box-shadow: 

            0 0 0 1px rgba(100, 255, 175, 0.07),

            0 0 5px 1px rgba(100, 255, 175, 0.03);

        }

        @keyframes shaderWave {

          0%, 100% {

            transform: translate(-50%, -50%) scale(1) rotate(0deg);

          }

          12.5% {

            transform: translate(-50.3%, -50.2%) scale(1.008) rotate(0.3deg);

          }

          25% {

            transform: translate(-50.5%, -49.8%) scale(1.012) rotate(0.5deg);

          }

          37.5% {

            transform: translate(-50.2%, -50.5%) scale(1.005) rotate(0.2deg);

          }

          50% {

            transform: translate(-49.8%, -50.3%) scale(0.998) rotate(-0.2deg);

          }

          62.5% {

            transform: translate(-50.2%, -49.7%) scale(1.002) rotate(0.1deg);

          }

          75% {

            transform: translate(-49.6%, -50.1%) scale(1.006) rotate(-0.3deg);

          }

          87.5% {

            transform: translate(-50.4%, -50.4%) scale(1.003) rotate(0.2deg);

          }

        }

        /* 반응형 디자인 */

        @media (max-width: 768px) {

          .blob-wrapper,

          .trail-blob {

            width: 400px;

            height: 400px;

          }

        }

        @media (max-width: 480px) {

          .blob-wrapper,

          .trail-blob {

            width: 300px;

            height: 300px;

          }

        }

      `}</style>

    </div>

  );

};



export default T1;


