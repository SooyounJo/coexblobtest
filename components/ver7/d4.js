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
        vec3 leafGreen=vec3(0.25,0.85,0.25);
        vec3 paletteGradient=mix(vibrantGreen, leafGreen, smoothstep(-0.2, 0.52, p.y));
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
        vec3 cY=vec3(0.03,0.90,0.48); vec3 cP=vec3(0.16,0.97,0.68); vec3 cU=vec3(0.30,0.85,0.30);
        w1*=vec3(0.24,1.08,1.02); w2*=vec3(0.24,1.08,1.02); w3*=vec3(0.24,1.08,1.02);
        vec3 flowColor1=cY*w1.x + cP*w1.y + cU*w1.z; vec3 flowColor2=cY*w2.x + cP*w2.y + cU*w2.z; vec3 flowColor3=cY*w3.x + cP*w3.y + cU*w3.z; vec3 flowColor=(0.5*flowColor1 + 0.35*flowColor2 + 0.15*flowColor3);
        float mask1=clamp(w1.x+w1.y+w1.z,0.0,1.0); float mask2=clamp(w2.x+w2.y+w2.z,0.0,1.0); float mask3=clamp(w3.x+w3.y+w3.z,0.0,1.0); float flowMaskAvg=clamp((0.5*mask1 + 0.35*mask2 + 0.15*mask3),0.0,1.0);
        vec3 lit=base; lit=mix(lit,flowColor,flowMaskAvg*0.4);
        vec3 rippleBase=vec3(0.10,0.96,0.42);
        vec3 rippleAlt=vec3(0.25,0.85,0.25);
        vec3 rippleColor=mix(rippleBase, rippleAlt, paletteMix)*totalRipple*mix(0.38,0.62,boost);
        vec3 elasticBase=vec3(0.30,0.85,0.30);
        vec3 elasticAlt=vec3(0.20,0.75,0.20);
        vec3 elasticColor=mix(elasticBase, elasticAlt, paletteMix)*totalElastic*mix(0.24,0.45,boost);
        lit+=rippleColor+elasticColor;
        vec3 innerGreen=vec3(0.08,0.82,0.46);
        vec3 innerLeafGreen=vec3(0.20,0.80,0.20);
        vec3 edgeLeafGreen=vec3(0.15,0.70,0.15);
        lit = mix(lit, mix(vec3(0.05,0.78,0.42), innerGreen, paletteMix), smoothstep(0.0,0.45,length(p))*0.18);
        lit = mix(lit, mix(deepLavender, edgeLeafGreen, paletteMix), bottomFactor * 0.32);
        lit = mix(lit, mix(centerYellow, mix(vibrantGreen, innerLeafGreen, 0.42), paletteMix), centerGlow * 0.62);
        vec3 V=vec3(0.0,0.0,1.0); 
        float fres=pow(1.0 - max(dot(N,V),0.0), 2.2);
        vec3 rimBase=vec3(0.10,0.85,0.58);
        vec3 rimAlt=vec3(0.25,0.80,0.25);
        vec3 rimGlow=mix(rimBase, rimAlt, paletteMix)*fres*0.46;
        float softHalo=smoothstep(0.42, 0.16, r)*0.12;
        vec3 glow=rimGlow + mix(vec3(0.72,0.58,0.94), vec3(0.30,0.85,0.30), paletteMix)*softHalo;
        lit+=glow;
        vec3 undersideGreen=vec3(0.12,0.94,0.62);
        lit+=mix(vec3(0.05,0.90,0.50), undersideGreen, paletteMix)*(1.0-topness)*mix(0.08,0.22,boost);
        vec3 highlightLeafGreen=vec3(0.35,0.90,0.35);
        lit+=mix(centerYellow, highlightLeafGreen, paletteMix * 0.58) * centerGlow * mix(0.18,0.32,boost);
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
        vec3 cU=vec3(0.30,0.85,0.30);
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
        vec3 elasticColor=vec3(0.30,0.85,0.30)*totalElastic*mix(0.14,0.28,boost);
        lit+=rippleColor+elasticColor;
        float centerGlow = smoothstep(0.34, 0.08, r);
        lit = mix(lit, centerYellow, centerGlow * mix(0.35,0.58,boost));
        vec3 paletteTint = mix(vec3(0.18,0.96,0.66), vec3(0.25,0.85,0.25), paletteMix);
        lit = mix(lit, paletteTint, paletteMix * 0.28);
        vec3 V=vec3(0.0,0.0,1.0);
        float fres=pow(1.0 - max(dot(N,V),0.0), 2.4);
        vec3 rimGlow=vec3(0.18,0.88,0.64)*fres*mix(0.22,0.42,boost);
        float softHalo=smoothstep(0.38, 0.14, r)*0.12;
        vec3 glow=rimGlow + vec3(0.30,0.85,0.30)*softHalo;
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

const Scene = ({ boosted, phase, popActive }) => {
  const { camera, viewport } = useThree();
  viewport.getCurrentViewport(camera, [0, 0, 0]);
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

  return (
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

export default function Ver7_D4() {
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
          inset: -30%;
          background:
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.24), transparent 60%),
            radial-gradient(circle at 86% 78%, rgba(118,212,255,0.18), transparent 70%),
            rgba(255,255,255,0.018);
          opacity: 0.16;
          filter: blur(60px) saturate(1.4);
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
      `}</style>
    </div>
  );
}

