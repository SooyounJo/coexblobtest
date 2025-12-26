import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});

const createDefaultShaderMaterial = () => new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    lightDir: { value: new THREE.Vector3(0.2, 0.9, 0.3).normalize() },
    ringDir: { value: new THREE.Vector3(0.08, 0.56, 0.86).normalize() },
    boost: { value: 0 },
    globalAlpha: { value: 1 },
    paletteMix: { value: 0 },
  },
  vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
  fragmentShader: `
      precision highp float;
      uniform float time;
      uniform vec3 lightDir;
      uniform vec3 ringDir;
      uniform float boost;
      uniform float globalAlpha;
      uniform float paletteMix;
      varying vec2 vUv;
      varying vec3 vNormal;
      float hash(vec2 p){ p=fract(p*vec2(123.34,345.45)); p+=dot(p,p+34.345); return fract(p.x*p.y);}      
      float n2(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1.0,0.0)); float c=hash(i+vec2(0.0,1.0)); float d=hash(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);}      
      float noise(vec2 p) { return sin(p.x) * cos(p.y) + sin(p.x*2.0)*cos(p.y*2.0)*0.5; }
      float elasticWave(float x, float frequency, float amplitude){ float wave=sin(x*frequency)*amplitude; float decay=exp(-x*0.05); float bounce=sin(x*frequency*2.0)*amplitude*0.3; return (wave+bounce)*decay; }
      float breathingMotion(float time){ float slow=sin(time*0.3)*0.15; float fast=sin(time*0.8)*0.08; float deep=sin(time*0.15)*0.25; return slow+fast+deep; }
      float bumpMove(float c,float w,float f){ float d0=abs(f-(c-1.0)); float d1=abs(f-c); float d2=abs(f-(c+1.0)); float d=min(d0,min(d1,d2)); float aa=0.0025; return smoothstep(w+aa,0.0+aa,d);}      
      vec3 bandWeights(float f){ float width=0.25; float y=bumpMove(0.18,width,f); float p=bumpMove(0.52,width,f); float u=bumpMove(0.86,width,f); return vec3(y,p,u);}      
      float softBlur(float x, float strength) {
        return exp(-x * x / strength);
      }
      void main(){
        vec3 N=normalize(vNormal); vec3 L=normalize(lightDir); vec2 p=vUv-0.5; float r=length(p);
        float breathing=breathingMotion(time * 0.32);
        r=r*(1.0+breathing*0.14);
        float topness=clamp(dot(N,normalize(ringDir))*0.5+0.5,0.0,1.0);
        vec3 emerald=vec3(0.04, 0.92, 0.50);
        vec3 neonMint=vec3(0.30, 0.98, 0.75);
        vec3 vividGreen=vec3(0.00, 0.90, 0.35);
        vec3 centerYellow=vec3(1.00, 0.95, 0.45);
        vec3 lavender=vec3(0.90, 0.62, 1.00);
        vec3 deepLavender=vec3(0.60, 0.45, 0.95);
        vec3 base=mix(neonMint,emerald,clamp(0.45+0.55*topness,0.0,1.0));
        base=mix(base,vividGreen,smoothstep(0.12,0.38,topness));
        base=mix(base,lavender,smoothstep(0.0,0.45,1.0-topness));
        base=mix(base,deepLavender,smoothstep(-0.4,0.2,p.y)*0.35);
        vec3 vibrantGreen=vec3(0.18,0.98,0.62);
        vec3 richPurple=vec3(0.52,0.34,0.96);
        vec3 paletteGradient=mix(vibrantGreen, richPurple, smoothstep(-0.2, 0.52, p.y));
        base=mix(base, paletteGradient, paletteMix * 0.6);
        float centerGlow = smoothstep(0.32, 0.05, length(p));
        base = mix(base, centerYellow, centerGlow * 0.48);
        float bottomFactor = 1.0 - smoothstep(-0.45, 0.05, p.y);
        base = mix(base, lavender, bottomFactor * 0.55);
        float loopSec=10.0; float loopT=mod(time,loopSec)/loopSec; float phase=-loopT;
        float boostFactor = 1.0 + boost * 2.6;
        float waveSpeed = mix(1.3, 3.0, boost);
        float waveFreq  = mix(9.5, 18.0, boost);
        float pulse = 0.5 + 0.5 * sin(time * mix(0.55, 1.05, boost));
        pulse = smoothstep(0.25, 0.9, pulse);
        float wave0 = sin(waveFreq * r - waveSpeed * time);
        float wave1 = sin((waveFreq * 1.6) * r - (waveSpeed * 1.2) * time);
        float wave2 = sin((waveFreq * 2.3) * r - (waveSpeed * 1.6) * time + 1.2);
        float radialEnv = smoothstep(0.0, 0.9, r);
        float outwardWave = radialEnv * pulse * (
          mix(0.1, 0.28, boost) * wave0 +
          mix(0.06, 0.18, boost) * wave1 +
          mix(0.04, 0.12, boost) * wave2
        );
        float ripple1=noise(vUv*3.0+time*0.26)*0.02*boostFactor; float ripple2=noise(vUv*5.0+time*0.2)*0.012*boostFactor; float ripple3=noise(vUv*7.0+time*0.4)*0.008*boostFactor; float totalRipple=ripple1+ripple2+ripple3;
        float elastic1=elasticWave(topness*2.0+time*0.32,3.0,0.05*boostFactor); float elastic2=elasticWave(topness*3.0+time*0.52,2.1,0.036*boostFactor); float totalElastic=elastic1+elastic2;
        float blurAmount=0.012; float f1=topness*1.8+phase+totalRipple+totalElastic + outwardWave; float f2=topness*1.8+phase+blurAmount+totalRipple*0.8+totalElastic*0.6 + outwardWave * 0.72; float f3=topness*1.8+phase+(blurAmount*1.5)+totalRipple*0.6+totalElastic*0.4 + outwardWave * 0.45;
        float perturb=0.01*n2(vUv*1.5+time*0.05); vec3 w1=bandWeights(f1+perturb); vec3 w2=bandWeights(f2+perturb*0.8); vec3 w3=bandWeights(f3+perturb*0.6);
        float wobble1=0.995+0.0025*n2(vUv*2.2+time*0.06); float wobble2=0.995+0.0025*n2(vUv*2.2+time*0.06+1.7); float wobble3=0.995+0.0025*n2(vUv*2.2+time*0.06+3.1); w1*=wobble1; w2*=wobble2; w3*=wobble3;
        vec3 cY=vec3(0.03,0.90,0.48); vec3 cP=vec3(0.16,0.97,0.68); vec3 cU=vec3(0.82,0.58,0.98);
        w1*=vec3(0.24,1.08,1.02); w2*=vec3(0.24,1.08,1.02); w3*=vec3(0.24,1.08,1.02);
        vec3 flowColor1=cY*w1.x + cP*w1.y + cU*w1.z; vec3 flowColor2=cY*w2.x + cP*w2.y + cU*w2.z; vec3 flowColor3=cY*w3.x + cP*w3.y + cU*w3.z; vec3 flowColor=(0.5*flowColor1 + 0.35*flowColor2 + 0.15*flowColor3);
        float mask1=clamp(w1.x+w1.y+w1.z,0.0,1.0); float mask2=clamp(w2.x+w2.y+w2.z,0.0,1.0); float mask3=clamp(w3.x+w3.y+w3.z,0.0,1.0); float flowMaskAvg=clamp((0.5*mask1 + 0.35*mask2 + 0.15*mask3),0.0,1.0);
        vec3 lit=base; lit=mix(lit,flowColor,flowMaskAvg*0.4);
        vec3 rippleBase=vec3(0.10,0.96,0.42);
        vec3 rippleAlt=vec3(0.34,0.62,0.98);
        vec3 rippleColor=mix(rippleBase, rippleAlt, paletteMix)*totalRipple*mix(0.38,0.62,boost);
        vec3 elasticBase=vec3(0.62,0.62,0.98);
        vec3 elasticAlt=vec3(0.42,0.58,0.96);
        vec3 elasticColor=mix(elasticBase, elasticAlt, paletteMix)*totalElastic*mix(0.24,0.45,boost);
        lit+=rippleColor+elasticColor;
        vec3 innerGreen=vec3(0.08,0.82,0.46);
        vec3 innerPurple=vec3(0.58,0.42,0.96);
        vec3 edgePurple=vec3(0.36,0.24,0.78);
        lit = mix(lit, mix(vec3(0.05,0.78,0.42), innerGreen, paletteMix), smoothstep(0.0,0.45,length(p))*0.18);
        lit = mix(lit, mix(deepLavender, edgePurple, paletteMix), bottomFactor * 0.32);
        lit = mix(lit, mix(centerYellow, mix(vibrantGreen, innerPurple, 0.42), paletteMix), centerGlow * 0.62);
        vec3 V=vec3(0.0,0.0,1.0); 
        float fres=pow(1.0 - max(dot(N,V),0.0), 2.2);
        vec3 rimBase=vec3(0.10,0.85,0.58);
        vec3 rimAlt=vec3(0.32,0.46,0.96);
        vec3 rimGlow=mix(rimBase, rimAlt, paletteMix)*fres*0.46;
        float softHalo=smoothstep(0.42, 0.16, r)*0.12;
        vec3 glow=rimGlow + mix(vec3(0.72,0.58,0.94), vec3(0.46,0.70,0.96), paletteMix)*softHalo;
        lit+=glow;
        vec3 undersideGreen=vec3(0.12,0.94,0.62);
        lit+=mix(vec3(0.05,0.90,0.50), undersideGreen, paletteMix)*(1.0-topness)*mix(0.08,0.22,boost);
        vec3 highlightPurple=vec3(0.62,0.44,0.98);
        lit+=mix(centerYellow, highlightPurple, paletteMix * 0.58) * centerGlow * mix(0.18,0.32,boost);
        vec3 gray=vec3(dot(lit,vec3(0.299,0.587,0.114)));
        float loopPhase = 0.5 + 0.5 * sin(6.28318530718 * time / 7.0);
        float sat = 1.0 + 0.85 * loopPhase;
        lit = mix(gray, lit, sat);
        float brightness = 1.0 + 0.14 * loopPhase;
        lit *= brightness;
        float contrast = 1.0 + 0.32 * loopPhase;
        lit = (lit - 0.5) * contrast + 0.5;
        lit=pow(lit,vec3(0.92)); lit*=mix(1.0,1.05,boost); lit=mix(lit,vec3(1.0),0.02); lit=clamp(lit,0.0,1.0);
        float edgeBase = smoothstep(0.56, 0.32, r);
        float edgeGlow = softBlur(r - 0.4, 0.15);
        float edgeFeather = edgeBase * (1.0 + edgeGlow * 0.3);
        float alpha = 0.88 * edgeFeather + fres * 0.15;
        alpha = alpha * (1.0 - softBlur(r - 0.45, 0.2) * 0.3);
        alpha = clamp(alpha, 0.0, 0.95);
        gl_FragColor=vec4(lit,alpha * globalAlpha);
      }
    `,
  transparent: true,
  extensions: { derivatives: true },
});

const AgenticBubble = ({
  position,
  targetPosition = position,
  boosted,
  variant = 'default',
  opacityTarget = 1,
  scaleTarget = 1,
  positionLerp = 0.08,
  opacityLerp = 0.08,
  scaleLerp = 0.16,
  paletteTarget = 0,
  paletteLerp = 0.12,
  breathe = false,
}) => {
  const material = useMemo(() => {
    return createDefaultShaderMaterial();
  }, []);

  const meshRef = useRef(null);
  const boostValueRef = useRef(0);
  const opacityRef = useRef(opacityTarget);
  const scaleRef = useRef(scaleTarget);
  const paletteRef = useRef(paletteTarget);
  const targetPositionRef = useRef(new THREE.Vector3(...position));

  useEffect(() => {
    targetPositionRef.current.set(...targetPosition);
  }, [targetPosition[0], targetPosition[1], targetPosition[2]]);

  useFrame((state, delta) => {
    material.uniforms.time.value += delta;
    const boostTarget = boosted ? 1 : 0;
    const boostLerp = boosted ? 0.14 : 0.04;
    boostValueRef.current = THREE.MathUtils.lerp(boostValueRef.current, boostTarget, boostLerp);
    if (material.uniforms.boost != null) {
      material.uniforms.boost.value = boostValueRef.current;
    }

    opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, opacityTarget, opacityLerp);
    if (material.uniforms.globalAlpha != null) {
      material.uniforms.globalAlpha.value = opacityRef.current;
    }

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, scaleTarget, scaleLerp);

    paletteRef.current = THREE.MathUtils.lerp(paletteRef.current, paletteTarget, paletteLerp);
    if (material.uniforms.paletteMix != null) {
      material.uniforms.paletteMix.value = paletteRef.current;
    }

    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      const smoothFreq = breathe ? 0.28 : 0.18;
      const smoothAmp = breathe ? 0.04 : 0.006;
      const breatheFactor = 1 + Math.sin(time * smoothFreq) * smoothAmp;
      meshRef.current.scale.setScalar(scaleRef.current * breatheFactor);
      if (positionLerp > 0) {
        meshRef.current.position.lerp(targetPositionRef.current, positionLerp);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[1.9, 256, 256]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Scene = () => {
  const { camera, viewport } = useThree();
  viewport.getCurrentViewport(camera, [0, 0, 0]);
  const spacing = 1.68;

  const topPosition = useMemo(() => [0, spacing + 0.3, 0], [spacing]);

  return (
    <group position={[0, 0.8, 1]} renderOrder={1000}>
      <AgenticBubble
        boosted={false}
        position={topPosition}
        targetPosition={topPosition}
        variant="default"
        opacityTarget={1}
        scaleTarget={1.18}
        positionLerp={0.08}
        opacityLerp={0.06}
        scaleLerp={0.18}
        paletteTarget={0}
        paletteLerp={0.1}
      />
    </group>
  );
};

const CanvasBackground = () => {
  return (
    <div className="canvas-wrapper" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 8]} intensity={0.8} />
        <Scene />
      </Canvas>
      <style jsx>{`
        .canvas-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        :global(canvas) {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }
      `}</style>
    </div>
  );
};

// 이미지가 먼저 나타나고, 그 다음 텍스트가 타이핑되는 모달
function ModalWithImageFirst({ fullText, speed = 28 }) {
  const [imageVisible, setImageVisible] = useState(false);
  const [typed, setTyped] = useState('');
  const [progress, setProgress] = useState(0);
  const [typingDone, setTypingDone] = useState(false);
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const [cardHeight, setCardHeight] = useState(56);

  // 이미지 먼저 표시
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 이미지가 나타난 후 텍스트 타이핑 시작
  useEffect(() => {
    if (!imageVisible) return;

    let i = 0;
    const delayBeforeTyping = 400; // 이미지가 나타난 후 400ms 후 타이핑 시작
    
    const startTypingTimer = setTimeout(() => {
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
    }, delayBeforeTyping);

    return () => clearTimeout(startTypingTimer);
  }, [imageVisible, fullText, speed]);

  // 카드 높이 동적 계산
  useEffect(() => {
    const update = () => {
      if (!innerRef.current) return;
      const h = innerRef.current.scrollHeight;
      setCardHeight(Math.max(56, h));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [typed, progress, imageVisible]);

  return (
    <>
      <div className="modal2-wrapper">
        <div className="modal2-wrap">
          <div className="modal2-card" ref={cardRef} style={{ height: cardHeight }}>
            <div className="modal2-inner" ref={innerRef}>
              {/* 이미지가 먼저 상단에 나타남 */}
              <div className={`modal2-photo ${imageVisible ? 'is-in' : ''}`} aria-hidden />
              
              {/* 그 다음 텍스트가 타이핑됨 */}
              <div className="modal2-text">
                {typed.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        /* 폰트는 _document.js에서 전역으로 로드됨 */
        /* 모달에 필요한 CSS 변수 정의 */
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
          background: linear-gradient(180deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.70) 100%);
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
        /* 이미지가 상단에 먼저 나타남 */
        .modal2-photo {
          width: 100%;
          height: 0;
          opacity: 0;
          transform: translateY(12px) scale(0.98);
          filter: blur(2.5px);
          border-radius: calc(var(--glass-radius) + 12px - 16px);
          background:
            url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop') center / cover no-repeat,
            rgba(255,255,255,0.10);
          transition: opacity 500ms cubic-bezier(0.16, 1, 0.3, 1),
                      transform 600ms cubic-bezier(0.16, 1, 0.3, 1),
                      filter 500ms cubic-bezier(0.16, 1, 0.3, 1),
                      height 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .modal2-photo.is-in {
          height: auto;
          aspect-ratio: 4 / 3;
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
        /* 텍스트는 이미지 아래에 타이핑됨 */
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
      `}</style>
    </>
  );
}

export default function Ver10_2() {
  const fullText =
    "친구와 함께라면 ‘무월식탁’이라는 한식당이나 ‘피에프창’이라는 아시안 비스트로가 좋을 거예요\n둘 다 분위기도 좋고 음식 종류도 다양해서 선택지가 많습니다";

  return (
    <div className="container container--bright">
      <CanvasBackground />

      {/* 이미지가 먼저 나타나고, 그 다음 텍스트가 타이핑되는 모달 */}
      <ModalWithImageFirst fullText={fullText} speed={28} />

      <style jsx>{`
        /* 폰트는 _document.js에서 전역으로 로드됨 */
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 30% 20%, #fffdfc 0%, #fff6fa 38%, #fdeff3 100%);
          transition: background 2s ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        /* enforce Pretendard Variable across the page */
        :global(html), :global(body), :global(input), :global(button), :global(textarea) {
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .container--bright {
          background: radial-gradient(circle at 30% 20%, #fffeff 0%, #fff7fb 38%, #fbeff5 100%);
        }
      `}</style>
    </div>
  );
}
