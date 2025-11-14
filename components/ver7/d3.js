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
      float bumpMove(float c,float w,float f){ float d0=abs(f-(c-1.0)); float d1=abs(f-c); float d2=abs(f-(c+1.0)); float d=min(d0,min(d1,d2)); float aa=fwidth(f)*1.2; return smoothstep(w+aa,0.0+aa,d);}      
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
});

const createWaterShaderMaterial = () => new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    lightDir: { value: new THREE.Vector3(0.2, 0.9, 0.3).normalize() },
    ringDir: { value: new THREE.Vector3(0.08, 0.56, 0.86).normalize() },
    boost: { value: 0 },
    globalAlpha: { value: 1 },
    paletteMix: { value: 0 },
  },
  vertexShader: `
      uniform float time;
      uniform float boost;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorldPos;
      float hash(vec2 p){
        p = fract(p*vec2(123.34, 345.45));
        p += dot(p, p+34.345);
        return fract(p.x*p.y);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i+vec2(1.0,0.0));
        float c = hash(i+vec2(0.0,1.0));
        float d = hash(i+vec2(1.0,1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
      }
      float waterDropEffect(vec3 pos, float time) {
        float drop1 = sin(time * 2.0) * 0.3 + 0.5;
        float drop2 = sin(time * 1.7 + 1.5) * 0.25 + 0.5;
        float drop3 = sin(time * 2.3 + 3.1) * 0.2 + 0.5;
        float dist1 = length(pos.xy - vec2(0.2, drop1));
        float dist2 = length(pos.xy - vec2(-0.3, drop2));
        float dist3 = length(pos.xy - vec2(0.4, drop3));
        float ripple1 = sin(dist1 * 20.0 - time * 15.0) * exp(-dist1 * 8.0) * 0.02;
        float ripple2 = sin(dist2 * 18.0 - time * 12.0) * exp(-dist2 * 6.0) * 0.015;
        float ripple3 = sin(dist3 * 22.0 - time * 18.0) * exp(-dist3 * 7.0) * 0.018;
        float shake1 = sin(time * 8.0) * exp(-dist1 * 5.0) * 0.01;
        float shake2 = sin(time * 6.0 + 1.0) * exp(-dist2 * 4.0) * 0.008;
        float shake3 = sin(time * 10.0 + 2.0) * exp(-dist3 * 6.0) * 0.012;
        float intensity = 1.0 + boost * 1.35;
        return (ripple1 + ripple2 + ripple3 + shake1 + shake2 + shake3) * intensity;
      }
      float waterSurfaceDeform(vec3 pos, float time) {
        float wave1 = sin(pos.x * 3.0 + time * 2.0) * cos(pos.y * 2.5 + time * 1.5) * 0.015;
        float wave2 = sin(pos.x * 5.0 + time * 3.0) * cos(pos.y * 4.0 + time * 2.5) * 0.008;
        float wave3 = sin(pos.x * 7.0 + time * 4.0) * cos(pos.y * 6.0 + time * 3.5) * 0.005;
        float noise1 = noise(pos.xy * 2.0 + time * 0.5) * 0.01;
        float noise2 = noise(pos.yz * 1.5 + time * 0.7) * 0.008;
        float noise3 = noise(pos.zx * 2.5 + time * 0.9) * 0.006;
        float surfaceIntensity = 1.0 + boost * 1.1;
        return (wave1 + wave2 + wave3 + noise1 + noise2 + noise3) * surfaceIntensity;
      }
      void main() {
        vUv = uv;
        vec3 pos = position;
        float dropEffect = waterDropEffect(pos, time);
        pos += normal * dropEffect;
        float surfaceDeform = waterSurfaceDeform(pos, time);
        pos += normal * surfaceDeform;
        vNormal = normalize(normalMatrix * normal);
        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,
  fragmentShader: `
      precision highp float;
      uniform float time;
      uniform float boost;
      uniform vec3 lightDir;
      uniform vec3 ringDir;
      uniform float globalAlpha;
      uniform float paletteMix;
      varying vec2 vUv;
      varying vec3 vNormal;
      float hash(vec2 p){ p = fract(p*vec2(123.34,345.45)); p += dot(p,p+34.345); return fract(p.x*p.y);}      
      float n2(vec2 p){ vec2 i=floor(p); vec2 f=fract(p); float a=hash(i); float b=hash(i+vec2(1.0,0.0)); float c=hash(i+vec2(0.0,1.0)); float d=hash(i+vec2(1.0,1.0)); vec2 u=f*f*(3.0-2.0*f); return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);}      
      float noise(vec2 p) { return sin(p.x) * cos(p.y) + sin(p.x*2.0)*cos(p.y*2.0)*0.5; }
      float elasticWave(float x, float frequency, float amplitude){ float wave=sin(x*frequency)*amplitude; float decay=exp(-x*0.05); float bounce=sin(x*frequency*2.0)*amplitude*0.3; return (wave+bounce)*decay; }
      float bumpMove(float c,float w,float f){ float d0=abs(f-(c-1.0)); float d1=abs(f-c); float d2=abs(f-(c+1.0)); float d=min(d0,min(d1,d2)); float aa=fwidth(f)*1.2; return smoothstep(w+aa,0.0+aa,d);}      
      vec3 bandWeights(float f){ float width=0.24; float y=bumpMove(0.18,width,f); float p=bumpMove(0.52,width,f); float u=bumpMove(0.86,width,f); return vec3(y,p,u);}      
      float softBlur(float x, float strength) { return exp(-x * x / strength); }
      void main(){
        vec3 N=normalize(vNormal);
        vec3 L=normalize(lightDir);
        vec2 p = vUv - 0.5;
        float r=length(p);
        float topness=clamp(dot(N,normalize(ringDir))*0.5+0.5,0.0,1.0);
        vec3 emerald=vec3(0.04, 0.92, 0.50);
        vec3 neonMint=vec3(0.30, 0.98, 0.75);
        vec3 vividGreen=vec3(0.00, 0.90, 0.35);
        vec3 centerYellow=vec3(1.00, 0.95, 0.45);
        vec3 lavender=vec3(0.90, 0.62, 1.00);
        vec3 deepLavender=vec3(0.60, 0.45, 0.95);
        vec3 base=mix(neonMint,emerald,clamp(0.4+0.6*topness,0.0,1.0));
        base=mix(base,vividGreen,smoothstep(0.1,0.36,topness));
        base=mix(base,lavender,smoothstep(0.0,0.55,1.0-topness));
        base=mix(base,deepLavender,smoothstep(-0.36,0.2,p.y)*0.42);
        float loopSec=12.0; float loopT=mod(time,loopSec)/loopSec; float phase=-loopT;
        float rippleIntensity = 1.0 + boost * 1.25;
        float drop1=sin(time*2.0)*0.3+0.5; float drop2=sin(time*1.7+1.5)*0.25+0.5; float drop3=sin(time*2.3+3.1)*0.2+0.5;
        float dist1=length(vUv-vec2(0.2,drop1)); float dist2=length(vUv-vec2(-0.3,drop2)); float dist3=length(vUv-vec2(0.4,drop3));
        float ripple1=sin(dist1*18.0-time*8.4)*exp(-dist1*7.5)*0.08*rippleIntensity;
        float ripple2=sin(dist2*16.0-time*7.2)*exp(-dist2*5.8)*0.06*rippleIntensity;
        float ripple3=sin(dist3*19.0-time*9.6)*exp(-dist3*6.4)*0.075*rippleIntensity;
        float totalRipple=ripple1+ripple2+ripple3;
        float elastic1=elasticWave(topness*2.0+time*0.38,3.0,0.12);
        float elastic2=elasticWave(topness*3.0+time*0.62,2.2,0.07);
        float totalElastic=(elastic1+elastic2) * (1.0 + boost * 0.85);
        float blurAmount=0.012;
        float f1=topness*1.8+phase+totalRipple+totalElastic;
        float f2=topness*1.8+phase+blurAmount+totalRipple*0.82+totalElastic*0.64;
        float f3=topness*1.8+phase+(blurAmount*1.5)+totalRipple*0.6+totalElastic*0.4;
        float perturb=0.02*n2(vUv*1.5+time*0.05);
        vec3 w1=bandWeights(f1+perturb);
        vec3 w2=bandWeights(f2+perturb*0.8);
        vec3 w3=bandWeights(f3+perturb*0.6);
        float wobble1=0.996+0.0025*n2(vUv*2.2+time*0.05+1.0);
        float wobble2=0.996+0.0025*n2(vUv*2.2+time*0.05+2.4);
        float wobble3=0.996+0.0025*n2(vUv*2.2+time*0.05+3.7);
        w1*=wobble1; w2*=wobble2; w3*=wobble3;
        vec3 cY=vec3(0.10,0.92,0.58);
        vec3 cP=vec3(0.22,0.96,0.70);
        vec3 cU=vec3(0.66,0.50,0.98);
        w1*=vec3(0.22,1.10,1.05);
        w2*=vec3(0.22,1.10,1.05);
        w3*=vec3(0.22,1.10,1.05);
        vec3 flowColor1=cY*w1.x + cP*w1.y + cU*w1.z;
        vec3 flowColor2=cY*w2.x + cP*w2.y + cU*w2.z;
        vec3 flowColor3=cY*w3.x + cP*w3.y + cU*w3.z;
        vec3 flowColor=(0.5*flowColor1 + 0.35*flowColor2 + 0.15*flowColor3);
        float mask1=clamp(w1.x+w1.y+w1.z,0.0,1.0);
        float mask2=clamp(w2.x+w2.y+w2.z,0.0,1.0);
        float mask3=clamp(w3.x+w3.y+w3.z,0.0,1.0);
        float flowMaskAvg=clamp((0.5*mask1 + 0.35*mask2 + 0.15*mask3),0.0,1.0);
        vec3 lit=base;
        lit=mix(lit,flowColor,flowMaskAvg*mix(0.32,0.58,boost));
        vec3 rippleColor=vec3(0.10,0.98,0.52)*totalRipple*mix(0.18,0.36,boost);
        vec3 elasticColor=vec3(0.58,0.60,0.96)*totalElastic*mix(0.14,0.28,boost);
        lit+=rippleColor+elasticColor;
        float centerGlow = smoothstep(0.34, 0.08, r);
        lit = mix(lit, centerYellow, centerGlow * mix(0.35,0.58,boost));
        vec3 paletteTint = mix(vec3(0.18,0.96,0.66), vec3(0.48,0.44,0.98), paletteMix);
        lit = mix(lit, paletteTint, paletteMix * 0.28);
        vec3 V=vec3(0.0,0.0,1.0);
        float fres=pow(1.0 - max(dot(N,V),0.0), 2.4);
        vec3 rimGlow=vec3(0.18,0.88,0.64)*fres*mix(0.22,0.42,boost);
        float softHalo=smoothstep(0.38, 0.14, r)*0.12;
        vec3 glow=rimGlow + vec3(0.68,0.54,0.96)*softHalo;
        lit+=glow;
        lit+=vec3(0.08,0.94,0.60)*(1.0-topness)*mix(0.12,0.22,boost);
        vec3 gray=vec3(dot(lit,vec3(0.299,0.587,0.114)));
        float loopPhase = 0.5 + 0.5 * sin(6.28318530718 * time / 9.5);
        float sat = 1.0 + 0.6 * loopPhase;
        lit = mix(gray, lit, sat);
        float brightness = 1.0 + 0.1 * loopPhase;
        lit *= brightness;
        float contrast = 1.0 + 0.2 * loopPhase;
        lit = (lit - 0.5) * contrast + 0.5;
        lit=pow(lit,vec3(0.92));
        lit*=1.04;
        lit=mix(lit,vec3(1.0),0.015);
        lit=clamp(lit,0.0,1.0);
        float edgeBase = smoothstep(0.54, 0.30, r);
        float edgeGlow = softBlur(r - 0.36, 0.18);
        float edgeFeather = edgeBase * (1.0 + edgeGlow * 0.22);
        float alpha = 0.8 * edgeFeather + fres * 0.16;
        alpha = clamp(alpha, 0.0, 0.95);
        gl_FragColor=vec4(lit,alpha * globalAlpha);
      }
    `,
  transparent: true,
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
    return variant === 'water' ? createWaterShaderMaterial() : createDefaultShaderMaterial();
  }, [variant]);

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

// 미니 블롭 전용 민트 컬러 shader material
const createMintShaderMaterial = () => new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    lightDir: { value: new THREE.Vector3(0.2, 0.9, 0.3).normalize() },
    ringDir: { value: new THREE.Vector3(0.08, 0.56, 0.86).normalize() },
    boost: { value: 0 },
    globalAlpha: { value: 1 },
    paletteMix: { value: 1 }, // 민트 컬러 강조를 위해 높게 설정
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
      float bumpMove(float c,float w,float f){ float d0=abs(f-(c-1.0)); float d1=abs(f-c); float d2=abs(f-(c+1.0)); float d=min(d0,min(d1,d2)); float aa=fwidth(f)*1.2; return smoothstep(w+aa,0.0+aa,d);}      
      vec3 bandWeights(float f){ float width=0.25; float y=bumpMove(0.18,width,f); float p=bumpMove(0.52,width,f); float u=bumpMove(0.86,width,f); return vec3(y,p,u);}      
      float softBlur(float x, float strength) {
        return exp(-x * x / strength);
      }
      void main(){
        vec3 N=normalize(vNormal); vec3 L=normalize(lightDir); vec2 p=vUv-0.5; float r=length(p);
        float breathing=breathingMotion(time * 0.32);
        r=r*(1.0+breathing*0.14);
        float topness=clamp(dot(N,normalize(ringDir))*0.5+0.5,0.0,1.0);
        // 민트 컬러 팔레트 강조
        vec3 mintGreen=vec3(0.20, 0.95, 0.70);
        vec3 lightMint=vec3(0.35, 0.98, 0.80);
        vec3 emerald=vec3(0.08, 0.88, 0.55);
        vec3 turquoise=vec3(0.15, 0.90, 0.75);
        vec3 softMint=vec3(0.40, 0.96, 0.82);
        vec3 base=mix(lightMint, mintGreen, clamp(0.4+0.6*topness,0.0,1.0));
        base=mix(base, emerald, smoothstep(0.12,0.38,topness));
        base=mix(base, turquoise, smoothstep(0.0,0.35,1.0-topness));
        base=mix(base, softMint, smoothstep(-0.3,0.15,p.y)*0.4);
        // 민트 그라디언트 강화
        vec3 mintGradient=mix(mintGreen, lightMint, smoothstep(-0.2, 0.5, p.y));
        base=mix(base, mintGradient, 0.75);
        float centerGlow = smoothstep(0.32, 0.05, length(p));
        base = mix(base, softMint, centerGlow * 0.35);
        float bottomFactor = 1.0 - smoothstep(-0.45, 0.05, p.y);
        base = mix(base, emerald, bottomFactor * 0.45);
        float loopSec=10.0; float loopT=mod(time,loopSec)/loopSec; float phase=-loopT;
        float boostFactor = 1.0 + boost * 2.0;
        float waveSpeed = mix(1.0, 2.5, boost);
        float waveFreq  = mix(8.0, 16.0, boost);
        float pulse = 0.5 + 0.5 * sin(time * mix(0.5, 0.9, boost));
        pulse = smoothstep(0.25, 0.9, pulse);
        float wave0 = sin(waveFreq * r - waveSpeed * time);
        float wave1 = sin((waveFreq * 1.6) * r - (waveSpeed * 1.2) * time);
        float wave2 = sin((waveFreq * 2.3) * r - (waveSpeed * 1.6) * time + 1.2);
        float radialEnv = smoothstep(0.0, 0.9, r);
        float outwardWave = radialEnv * pulse * (
          mix(0.08, 0.22, boost) * wave0 +
          mix(0.05, 0.15, boost) * wave1 +
          mix(0.03, 0.10, boost) * wave2
        );
        float ripple1=noise(vUv*3.0+time*0.26)*0.015*boostFactor; float ripple2=noise(vUv*5.0+time*0.2)*0.01*boostFactor; float ripple3=noise(vUv*7.0+time*0.4)*0.006*boostFactor; float totalRipple=ripple1+ripple2+ripple3;
        float elastic1=elasticWave(topness*2.0+time*0.32,3.0,0.04*boostFactor); float elastic2=elasticWave(topness*3.0+time*0.52,2.1,0.03*boostFactor); float totalElastic=elastic1+elastic2;
        float blurAmount=0.012; float f1=topness*1.8+phase+totalRipple+totalElastic + outwardWave; float f2=topness*1.8+phase+blurAmount+totalRipple*0.8+totalElastic*0.6 + outwardWave * 0.72; float f3=topness*1.8+phase+(blurAmount*1.5)+totalRipple*0.6+totalElastic*0.4 + outwardWave * 0.45;
        float perturb=0.01*n2(vUv*1.5+time*0.05); vec3 w1=bandWeights(f1+perturb); vec3 w2=bandWeights(f2+perturb*0.8); vec3 w3=bandWeights(f3+perturb*0.6);
        float wobble1=0.995+0.002*n2(vUv*2.2+time*0.06); float wobble2=0.995+0.002*n2(vUv*2.2+time*0.06+1.7); float wobble3=0.995+0.002*n2(vUv*2.2+time*0.06+3.1); w1*=wobble1; w2*=wobble2; w3*=wobble3;
        // 민트 컬러 강조
        vec3 cY=vec3(0.15,0.92,0.65); vec3 cP=vec3(0.25,0.96,0.75); vec3 cU=vec3(0.30,0.94,0.78);
        w1*=vec3(0.8,1.12,1.05); w2*=vec3(0.8,1.12,1.05); w3*=vec3(0.8,1.12,1.05);
        vec3 flowColor1=cY*w1.x + cP*w1.y + cU*w1.z; vec3 flowColor2=cY*w2.x + cP*w2.y + cU*w2.z; vec3 flowColor3=cY*w3.x + cP*w3.y + cU*w3.z; vec3 flowColor=(0.5*flowColor1 + 0.35*flowColor2 + 0.15*flowColor3);
        float mask1=clamp(w1.x+w1.y+w1.z,0.0,1.0); float mask2=clamp(w2.x+w2.y+w2.z,0.0,1.0); float mask3=clamp(w3.x+w3.y+w3.z,0.0,1.0); float flowMaskAvg=clamp((0.5*mask1 + 0.35*mask2 + 0.15*mask3),0.0,1.0);
        vec3 lit=base; lit=mix(lit,flowColor,flowMaskAvg*0.5);
        vec3 rippleMint=vec3(0.18,0.95,0.68);
        vec3 rippleColor=rippleMint*totalRipple*mix(0.32,0.52,boost);
        vec3 elasticMint=vec3(0.22,0.92,0.72);
        vec3 elasticColor=elasticMint*totalElastic*mix(0.20,0.38,boost);
        lit+=rippleColor+elasticColor;
        vec3 innerMint=vec3(0.12,0.88,0.65);
        lit = mix(lit, innerMint, smoothstep(0.0,0.45,length(p))*0.15);
        lit = mix(lit, emerald, bottomFactor * 0.28);
        lit = mix(lit, softMint, centerGlow * 0.55);
        vec3 V=vec3(0.0,0.0,1.0); 
        float fres=pow(1.0 - max(dot(N,V),0.0), 2.2);
        vec3 rimMint=vec3(0.20,0.90,0.70);
        vec3 rimGlow=rimMint*fres*0.42;
        float softHalo=smoothstep(0.42, 0.16, r)*0.12;
        vec3 glow=rimGlow + mintGreen*softHalo;
        lit+=glow;
        vec3 undersideMint=vec3(0.18,0.92,0.68);
        lit+=undersideMint*(1.0-topness)*mix(0.06,0.18,boost);
        lit+=softMint * centerGlow * mix(0.15,0.28,boost);
        vec3 gray=vec3(dot(lit,vec3(0.299,0.587,0.114)));
        float loopPhase = 0.5 + 0.5 * sin(6.28318530718 * time / 7.0);
        float sat = 1.0 + 0.7 * loopPhase;
        lit = mix(gray, lit, sat);
        float brightness = 1.0 + 0.12 * loopPhase;
        lit *= brightness;
        float contrast = 1.0 + 0.28 * loopPhase;
        lit = (lit - 0.5) * contrast + 0.5;
        lit=pow(lit,vec3(0.92)); lit*=mix(1.0,1.04,boost); lit=mix(lit,vec3(1.0),0.02); lit=clamp(lit,0.0,1.0);
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
});

// 미니 블롭 컴포넌트
const MiniBubble = ({
  startPosition,
  targetPosition,
  phase,
  delay = 0,
  scale = 0.32,
}) => {
  const material = useMemo(() => createMintShaderMaterial(), []);
  const meshRef = useRef(null);
  const [spawnTime, setSpawnTime] = useState(null);
  const opacityRef = useRef(0);
  const scaleRef = useRef(0); // 시작 시 0에서 시작하여 커짐
  const positionRef = useRef(new THREE.Vector3(...startPosition));
  const targetPositionRef = useRef(new THREE.Vector3(...targetPosition));
  const currentTargetRef = useRef(new THREE.Vector3(...targetPosition));

  useEffect(() => {
    // completed/settling phase로 전환될 때 생성 시간 기록
    if (phase === 'completed' || phase === 'settling') {
      if (spawnTime === null) {
        setSpawnTime(Date.now());
        // 초기 위치 설정
        positionRef.current.set(...startPosition);
      }
      // 타겟 위치 업데이트 (phase 변경 시)
      targetPositionRef.current.set(...targetPosition);
      currentTargetRef.current.set(...targetPosition);
    } else {
      // 다른 phase로 전환되면 spawnTime 리셋
      if (spawnTime !== null) {
        setSpawnTime(null);
        opacityRef.current = 0;
        scaleRef.current = 0;
      }
    }
  }, [phase, targetPosition, startPosition]);

  useFrame((state, delta) => {
    material.uniforms.time.value += delta;
    const time = state.clock.getElapsedTime();

    // completed/settling phase에서만 표시
    if (phase === 'completed' || phase === 'settling') {
      if (spawnTime !== null) {
        const elapsed = (Date.now() - spawnTime) / 1000; // 초 단위
        const delayTime = delay;
        
        // 지연 후 나타남
        if (elapsed >= delayTime) {
          const spawnProgress = Math.min((elapsed - delayTime) / 0.6, 1); // 0.6초에 걸쳐 나타남
          
          // opacity: 0에서 0.85로 증가 (더 빠르게 나타나도록)
          const targetOpacity = 0.85 * spawnProgress;
          opacityRef.current = THREE.MathUtils.lerp(
            opacityRef.current,
            targetOpacity,
            0.25
          );
          
          // scale: 0에서 목표 크기로 증가
          const targetScale = scale * spawnProgress;
          scaleRef.current = THREE.MathUtils.lerp(
            scaleRef.current,
            targetScale,
            0.28
          );
          
          // 위치: 시작 위치에서 타겟 위치로 이동하면서 떠다님
          const moveProgress = Math.min((elapsed - delayTime) / 2.5, 1); // 2.5초에 걸쳐 이동
          const lerpSpeed = 0.08 * (1 - moveProgress * 0.4); // 점점 느려지면서 이동
          positionRef.current.lerp(currentTargetRef.current, lerpSpeed);
          
          // 떠다니는 애니메이션 (부유 효과) - 차분하게 부유 (일렁임 감소)
          const floatY = Math.sin(time * 0.2 + delay * 10) * 0.05; // 속도와 진폭 대폭 감소
          const floatX = Math.cos(time * 0.18 + delay * 8) * 0.04;
          const floatZ = Math.sin(time * 0.22 + delay * 12) * 0.04;
          
          // 회전 애니메이션 - 매우 느리게
          const rotateY = time * 0.08 + delay * 5; // 회전 속도 대폭 감소
          const rotateX = Math.sin(time * 0.12 + delay * 7) * 0.05; // 회전 진폭 대폭 감소
          
          if (meshRef.current) {
            const finalPos = new THREE.Vector3(
              positionRef.current.x + floatX,
              positionRef.current.y + floatY,
              positionRef.current.z + floatZ
            );
            meshRef.current.position.copy(finalPos);
            
            // 회전 적용
            meshRef.current.rotation.y = rotateY;
            meshRef.current.rotation.x = rotateX;
            
            // 호흡 애니메이션 - 매우 차분하게
            const breatheFactor = 1 + Math.sin(time * 0.25 + delay * 6) * 0.03; // 속도와 진폭 대폭 감소
            meshRef.current.scale.setScalar(scaleRef.current * breatheFactor);
          }
        } else {
          // 지연 시간 동안은 투명하게
          opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, 0.3);
          scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.3);
        }
      } else {
        // spawnTime이 아직 설정되지 않았으면 초기화
        opacityRef.current = 0;
        scaleRef.current = 0;
      }
    } else {
      // 다른 phase에서는 보이지 않음
      opacityRef.current = THREE.MathUtils.lerp(opacityRef.current, 0, 0.3);
      scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 0, 0.3);
    }

    if (material.uniforms.globalAlpha != null) {
      material.uniforms.globalAlpha.value = Math.max(0, Math.min(1, opacityRef.current));
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.58, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Scene = ({ boosted, phase, popActive }) => {
  const { camera, viewport } = useThree();
  const v = viewport.getCurrentViewport(camera, [0, 0, 0]);
  const spacing = 1.68;

  const topPosition = useMemo(() => [0, spacing + 0.3, 0], [spacing]);
  const bottomStartPosition = useMemo(() => [0, -(spacing + 0.3), 0], [spacing]);
  const bottomTargetPosition = useMemo(
    () => (phase === 'completed' ? [0, spacing + 0.3, 0] : [0, -(spacing + 0.3), 0]),
    [phase, spacing],
  );

  const topOpacityTarget = phase === 'idle' ? 1 : 0;
  const topScaleTarget = phase === 'transitioning' ? 1.12 : 1;
  const bottomScaleTarget = popActive ? 2.0 : phase === 'completed' ? 1.04 : 1;
  const bottomPositionLerp = phase === 'completed' ? 0.12 : 0.04;
  const bottomScaleLerp = popActive ? 0.2 : 0.14;
  const bottomVariant = phase === 'transitioning' ? 'water' : 'default';

  // settling phase에서 completed로 전환될 때 블롭이 커지며 아래로 내려오는 순간 작은 블롭 생성
  // 화면 하단 위치 계산 - 카메라 z=6, fov=50일 때 화면 하단이 보이도록
  const screenBottomY = useMemo(() => {
    // viewport height는 약 5.2 정도이므로, 화면 하단을 약 -2.2 정도로 설정
    return -v.height / 2 + 0.4; // 화면 하단 근처 (화면 안에 보이도록)
  }, [v.height]);
  
  const miniBubblesConfig = useMemo(() => {
    // settling/completed phase가 아니면 빈 배열
    if (phase !== 'settling' && phase !== 'completed') {
      return [];
    }
    
    const count = 3;
    const configs = [];
    
    // 고정된 시드 값으로 결정적 위치 생성
    const fixedSeeds = [0.12, 0.56, 0.34];
    const fixedDelays = [0.0, 0.15, 0.08]; // 생성 시각 차이
    const fixedScales = [0.32, 0.35, 0.30];
    
    // 화면 하단을 기준으로 다양한 위치에 배치 (가로로 퍼져서 배치)
    const horizontalOffsets = [-1.2, 0, 1.2]; // x 오프셋 (왼쪽, 중앙, 오른쪽)
    const baseY = 0; // 그룹 내부 상대 y (그룹 자체가 화면 하단에 배치됨)
    const baseZ = 0; // 그룹 내부 상대 z
    
    // 각 블롭마다 다른 높이 오프셋 (살짝씩 다른 높낮이)
    const heightOffsets = [-0.25, 0.15, -0.08]; // 각 블롭의 기본 높이 차이
    const targetHeightOffsets = [0.1, 0.35, 0.18]; // 타겟 위치의 높이 차이
    
    for (let i = 0; i < count; i++) {
      // 시작 위치: 화면 하단 기준으로 가로로 퍼져서 배치
      const startX = horizontalOffsets[i] + (fixedSeeds[i] - 0.5) * 0.3; // 약간의 랜덤성
      const startY = baseY + heightOffsets[i] + (fixedSeeds[i] - 0.5) * 0.12; // 각 블롭마다 다른 높이
      const startZ = baseZ + 0.5 + (fixedSeeds[i] - 0.5) * 0.3; // 앞쪽에 배치하여 잘 보이도록
      
      // 타겟 위치: 화면 하단 근처에서 떠다니는 위치 (각 블롭마다 다른 높이로 부유)
      const targetX = horizontalOffsets[i] + (fixedSeeds[i] - 0.5) * 0.5; // 더 넓게 퍼짐
      const targetY = baseY + targetHeightOffsets[i] + (fixedSeeds[i] - 0.5) * 0.2; // 각 블롭마다 다른 높이
      const targetZ = baseZ + 0.5 + (fixedSeeds[i] - 0.5) * 0.4; // 앞쪽에 유지
      
      configs.push({
        startPosition: [startX, startY, startZ],
        targetPosition: [targetX, targetY, targetZ],
        delay: fixedDelays[i],
        scale: fixedScales[i],
      });
    }
    return configs;
  }, [phase]);

  return (
    <>
      {/* 메인 블롭들 */}
      <group position={[0, 0.8, 1]} renderOrder={1000}>
        <AgenticBubble
          boosted={false}
          position={topPosition}
          targetPosition={topPosition}
          variant="default"
          opacityTarget={topOpacityTarget}
          scaleTarget={topScaleTarget}
          positionLerp={0.08}
          opacityLerp={0.06}
          scaleLerp={0.18}
          paletteTarget={0}
          paletteLerp={0.1}
        />
        <AgenticBubble
          boosted={boosted}
          position={bottomStartPosition}
          targetPosition={bottomTargetPosition}
          variant={bottomVariant}
          opacityTarget={1}
          scaleTarget={bottomScaleTarget}
          positionLerp={bottomPositionLerp}
          opacityLerp={0.1}
          scaleLerp={bottomScaleLerp}
          paletteTarget={popActive ? 0.7 : 0.2}
          paletteLerp={0.16}
          breathe={popActive}
        />
      </group>
      {/* 미니 블롭들 - completed/settling phase에서만 생성되어 화면 하단에서 부유 */}
      {(phase === 'completed' || phase === 'settling') && miniBubblesConfig.length > 0 && (
        <group position={[0, screenBottomY, 0]} renderOrder={999}>
          {miniBubblesConfig.map((config, index) => (
            <MiniBubble
              key={`mini-${phase}-${index}-${config.startPosition[0]}-${config.startPosition[1]}`}
              startPosition={config.startPosition}
              targetPosition={config.targetPosition}
              phase={phase}
              delay={config.delay}
              scale={config.scale}
            />
          ))}
        </group>
      )}
    </>
  );
};

const CanvasBackground = ({ boosted, phase, popActive }) => {
  return (
    <div className="canvas-wrapper" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 6, 8]} intensity={0.8} />
        <Scene boosted={boosted || phase === 'idle'} phase={phase} popActive={popActive} />
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

export default function Ver7_D3() {
  const [boosted, setBoosted] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [popActive, setPopActive] = useState(false);
  const boostTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const popTimeoutRef = useRef(null);
  const pulseTimeoutRef = useRef(null);
  const calmTimeoutRef = useRef(null);

  const handleBoost = () => {
    if (phase !== 'idle') return;
    if (boostTimeoutRef.current) {
      clearTimeout(boostTimeoutRef.current);
    }
    if (settleTimeoutRef.current) {
      clearTimeout(settleTimeoutRef.current);
    }
    if (popTimeoutRef.current) {
      clearTimeout(popTimeoutRef.current);
    }
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    if (calmTimeoutRef.current) {
      clearTimeout(calmTimeoutRef.current);
    }
    setPopActive(false);
    setPhase('transitioning');
    setBoosted(true);
    boostTimeoutRef.current = setTimeout(() => {
      setBoosted(false);
      setPhase('settling');
      settleTimeoutRef.current = setTimeout(() => {
        setPhase('completed');
      }, 900);
    }, 2000);
  };

  useEffect(() => {
    if (popTimeoutRef.current) {
      clearTimeout(popTimeoutRef.current);
    }
    if (phase === 'completed') {
      popTimeoutRef.current = setTimeout(() => {
        setPopActive(true);
      }, 1500);
    } else {
      setPopActive(false);
    }
    return () => {
      if (popTimeoutRef.current) {
        clearTimeout(popTimeoutRef.current);
      }
    };
  }, [phase]);

  useEffect(() => {
    if (pulseTimeoutRef.current) {
      clearTimeout(pulseTimeoutRef.current);
    }
    if (calmTimeoutRef.current) {
      clearTimeout(calmTimeoutRef.current);
    }
    if (popActive) {
      pulseTimeoutRef.current = setTimeout(() => {
        setBoosted(true);
        calmTimeoutRef.current = setTimeout(() => {
          setBoosted(false);
        }, 2800);
      }, 1000);
    } else {
      setBoosted(false);
    }
    return () => {
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      if (calmTimeoutRef.current) {
        clearTimeout(calmTimeoutRef.current);
      }
    };
  }, [popActive]);

  useEffect(() => {
    return () => {
      if (boostTimeoutRef.current) {
        clearTimeout(boostTimeoutRef.current);
      }
      if (settleTimeoutRef.current) {
        clearTimeout(settleTimeoutRef.current);
      }
      if (popTimeoutRef.current) {
        clearTimeout(popTimeoutRef.current);
      }
      if (pulseTimeoutRef.current) {
        clearTimeout(pulseTimeoutRef.current);
      }
      if (calmTimeoutRef.current) {
        clearTimeout(calmTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={`container ${phase !== 'idle' ? 'container--bright' : ''}`}>
      <CanvasBackground boosted={boosted || phase === 'idle'} phase={phase} popActive={popActive} />
      <div className={`message-top ${popActive ? 'message-top--visible' : ''}`} aria-hidden={!popActive}>
        <div className="message-top__text">
          <span className="message-eyebrow">안녕하세요! 이솔이에요</span>
          <span className="message-sub">코엑스 안내를 도와드릴게요</span>
        </div>
      </div>
      <div className={`hero ${phase !== 'idle' ? 'hero--exit' : ''}`} aria-hidden={phase !== 'idle'}>
        <div className="eyebrow">Welcome To</div>
        <h1 className="title">Sori<br />Coex Guide</h1>
        <p className="subtitle">오늘 538번째로 대화하는 중이에요</p>
      </div>
      <button
        className={`cta ${phase !== 'idle' ? 'cta--exit' : ''}`}
        onClick={handleBoost}
        disabled={phase !== 'idle'}
        aria-hidden={phase !== 'idle'}
      >
        시작하기
      </button>
      {popActive && (
        <div className="glass-overlay glass-overlay--visible" aria-hidden={!popActive}>
          <div className="glass-modal">
            <div className="glass-content">
              <div className="avatar placeholder" />
              <h3>캐릭터 라이선싱 페어</h3>
              <p>
                다양한 캐릭터와 체험 부스를 온 가족과 함께
                <br />즐겨보세요.
              </p>
              <button className="primary">코엑스 홈페이지 바로가기</button>
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 30% 25%, #fdf0f6 0%, #fce6ef 45%, #f7d7e4 100%);
          transition: background 2s ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .container--bright {
          background: radial-gradient(circle at 30% 20%, #fff6fb 0%, #fdeef5 38%, #fadce8 100%);
        }
        .hero {
          position: absolute;
          bottom: clamp(120px, 20vh, 220px);
          left: clamp(18px, 6vw, 64px);
          right: clamp(18px, 6vw, 64px);
          color: #4e4967;
          z-index: 2;
          pointer-events: none;
          text-shadow: 0 18px 48px rgba(15, 40, 36, 0.18);
          transition: transform 2s cubic-bezier(0.45, 0, 0.25, 1), opacity 2s ease, filter 2s ease;
        }
        .hero--exit {
          transform: translateY(96px);
          opacity: 0;
          filter: blur(6px);
          pointer-events: none;
        }
        .eyebrow {
          font-size: clamp(14px, 3.4vw, 18px);
          font-weight: 600;
          letter-spacing: 0.02em;
          margin-bottom: clamp(6px, 1.6vw, 12px);
        }
        .title {
          margin: 0 0 clamp(10px, 2.5vw, 18px) 0;
          font-size: clamp(40px, 10vw, 62px);
          line-height: 1.05;
          font-weight: 900;
        }
        .subtitle {
          margin: 0;
          font-size: clamp(14px, 3.2vw, 18px);
          font-weight: 600;
          opacity: 0.82;
        }
        .cta {
          position: absolute;
          left: 50%;
          bottom: clamp(40px, 8vh, 72px);
          transform: translateX(-50%);
          width: clamp(240px, 92vw, 360px);
          height: clamp(44px, 9.6vw, 56px);
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.45);
          background: linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.42) 45%, rgba(255,255,255,0.18) 100%);
          box-shadow:
            0 18px 36px rgba(36, 82, 94, 0.22),
            inset 0 1px 0 rgba(255,255,255,0.88);
          backdrop-filter: blur(22px) saturate(1.55);
          color: #4e4967;
          font-size: clamp(14px, 4.2vw, 17px);
          font-weight: 800;
          padding: 0 clamp(12px, 4vw, 18px);
          cursor: pointer;
          z-index: 3;
          box-sizing: border-box;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease,
            background 160ms ease,
            color 160ms ease,
            opacity 2s ease,
            filter 2s ease;
        }
        .cta:hover {
          transform: translateX(-50%) translateY(-2px);
          box-shadow:
            0 24px 46px rgba(36, 82, 94, 0.28),
            inset 0 1px 0 rgba(255,255,255,0.92);
          background: linear-gradient(135deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.52) 48%, rgba(255,255,255,0.26) 100%);
          color: #443f60;
        }
        .cta--exit {
          transform: translateX(-50%) translateY(32px);
          opacity: 0;
          filter: blur(5px);
          pointer-events: none;
        }
        .cta--exit:hover {
          transform: translateX(-50%) translateY(32px);
        }
        .glass-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(16px, 6vw, 48px);
          pointer-events: none;
          z-index: 5;
        }
        .glass-overlay--visible {
          pointer-events: auto;
        }
        .glass-modal {
          width: min(360px, 82vw);
          aspect-ratio: 142.41 / 190.74;
          display: grid;
          place-items: center;
          pointer-events: none;
        }
        .glass-content {
          display: grid;
          gap: clamp(18px, 3.6vw, 26px);
          padding: clamp(22px, 5.2vw, 30px);
          border-radius: 28px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.4);
          box-shadow:
            0 28px 48px rgba(22, 42, 58, 0.24),
            inset 0 1px 0 rgba(255,255,255,0.88),
            inset 0 -10px 28px rgba(255,255,255,0.12);
          backdrop-filter: blur(42px) saturate(2.35) contrast(1.08);
          text-align: center;
          color: #0f2420;
          position: relative;
          overflow: hidden;
        }
        .glass-content::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(145deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 55%, rgba(255,255,255,0.0) 100%);
          mix-blend-mode: screen;
          opacity: 0.48;
          pointer-events: none;
        }
        .glass-content::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 65%;
          background: linear-gradient(to top, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0.35) 35%, rgba(255,255,255,0.12) 60%, transparent 100%);
          border-radius: inherit;
          pointer-events: none;
        }
        .avatar {
          width: 100%;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(255,255,255,0.24);
          display: grid;
          place-items: center;
        }
        .placeholder {
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          border: 1px dashed rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.06);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.32);
        }
        .glass-content h3 {
          margin: 0;
          font-size: clamp(18px, 4.6vw, 22px);
          font-weight: 800;
        }
        .glass-content p {
          margin: 0;
          font-size: clamp(13px, 3.4vw, 15px);
          font-weight: 500;
          opacity: 0.82;
          line-height: 1.6;
        }
        .primary {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.14);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.4);
          backdrop-filter: blur(28px) saturate(1.6);
          color: #103330;
          font-weight: 700;
          font-size: clamp(12px, 3.2vw, 14px);
          padding: clamp(9px, 2.6vw, 12px) clamp(24px, 6.2vw, 32px);
          cursor: pointer;
          transition: box-shadow 180ms ease, transform 180ms ease;
        }
        .primary:hover {
          box-shadow:
            0 24px 42px rgba(30, 76, 78, 0.32),
            inset 0 1px 0 rgba(255,255,255,0.58);
          transform: translateY(-2px);
        }
        .primary:focus { outline: none; }
        .message-top {
          position: absolute;
          top: clamp(24px, 8vh, 80px);
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          pointer-events: none;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 1.1s ease, transform 1.1s cubic-bezier(0.32, 0, 0.18, 1);
          z-index: 3;
        }
        .message-top--visible {
          opacity: 1;
          transform: translateY(0);
        }
        .message-top__text {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(4px, 1.2vw, 8px);
          padding: 0;
          color: #35295C;
          font-weight: 700;
          text-align: center;
        }
        .message-top__text .message-sub {
          color: #514570;
        }
      `}</style>
    </div>
  );
}
