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

const Scene = ({ boosted, phase, popActive }) => {
  const { camera, viewport } = useThree();
  viewport.getCurrentViewport(camera, [0, 0, 0]);
  const spacing = 1.68;

  const topPosition = useMemo(() => [0, spacing + 0.3, 0], [spacing]);
  // completed phase에서는 이미 상단으로 이동한 상태이므로 bottomStartPosition도 상단 위치로 설정
  const bottomStartPosition = useMemo(() => 
    phase === 'completed' ? [0, spacing + 0.3, 0] : [0, -(spacing + 0.3), 0], 
    [phase, spacing]
  );
  const bottomTargetPosition = useMemo(
    () => (phase === 'completed' ? [0, spacing + 0.3, 0] : [0, -(spacing + 0.3), 0]),
    [phase, spacing],
  );

  const topOpacityTarget = phase === 'idle' ? 1 : 1;
  // Intro: start larger then settle smaller after typing completes
  const topScaleTarget = phase === 'idle' ? 1.18 : 1;
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
        opacityTarget={phase === 'completed' ? 1 : 0}
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

export default function Ver8_1() {
  // 초기 상태를 'completed'로 설정하여 블롭이 이미 커진 상태에서 시작
  const [boosted, setBoosted] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [popActive, setPopActive] = useState(false); // 타이핑 이후 표시
  const boostTimeoutRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const popTimeoutRef = useRef(null);
  const pulseTimeoutRef = useRef(null);
  const calmTimeoutRef = useRef(null);
  const bottomUiTimeoutRef = useRef(null);

  // 타이핑 효과
  const headingText = '친구와 함께라면 분위기 좋은 식당이 좋겠죠';
  const [typedText, setTypedText] = useState('');
  const [typingDone, setTypingDone] = useState(false);

  // 초기 마운트 시 popActive가 활성화되도록 설정
  useEffect(() => {
    let idx = 0;
    const speed = 60; // ms per char
    const typer = setInterval(() => {
      idx += 1;
      setTypedText(headingText.slice(0, idx));
      if (idx >= headingText.length) {
        clearInterval(typer);
        setTypingDone(true);
        // 타이핑 완료 후 모달 표시
        setTimeout(() => setPhase('completed'), 300);
      }
    }, speed);
    return () => clearInterval(typer);
  }, []);

  useEffect(() => {
    if (popTimeoutRef.current) {
      clearTimeout(popTimeoutRef.current);
    }
    if (phase === 'completed') {
      // completed phase에서는 이미 popActive가 true이므로 타임아웃 없이 유지
      if (!popActive) {
        setPopActive(true);
      }
    } else {
      setPopActive(false);
    }
    return () => {
      if (popTimeoutRef.current) {
        clearTimeout(popTimeoutRef.current);
      }
    };
  }, [phase, popActive]);

  // 모달 이후 하단 UI 페이드인
  const [bottomVisible, setBottomVisible] = useState(false);
  useEffect(() => {
    if (bottomUiTimeoutRef.current) clearTimeout(bottomUiTimeoutRef.current);
    if (popActive) {
      bottomUiTimeoutRef.current = setTimeout(() => setBottomVisible(true), 900);
    } else {
      setBottomVisible(false);
    }
    return () => {
      if (bottomUiTimeoutRef.current) clearTimeout(bottomUiTimeoutRef.current);
    };
  }, [popActive]);

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
    <div className={`container container--bright ${bottomVisible ? 'container--bottom-visible' : ''}`}>
      <CanvasBackground boosted={boosted} phase={phase} popActive={popActive} />
      <div className="top-heading" aria-hidden={false}>
        {typedText}
      </div>
      {popActive && (
        <div className="glass-overlay glass-overlay--visible" aria-hidden={!popActive}>
          <div className="glass-modal">
            <div className="glass-content">
              <div
                className="photo"
                role="img"
                aria-label="딤섬과 음식이 놓인 테이블"
              />
              <div className="text">
                <p>
                  <span className="hl">딤딤섬</span> 에서는 홍콩 딤섬을 맛볼 수 있고,
                </p>
                <p>
                  <span className="hl">무월식탁</span> 에서는 정갈하게 차려낸
                  <br />한식을 즐기실 수 있답니다
                </p>
                <p className="small">두 곳 모두 깔끔하고 모던한 분위기로 인기가 많아요</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`suggestions ${bottomVisible ? 'suggestions--visible' : ''}`} aria-hidden={!bottomVisible}>
        <div className="chip chip--strong">컨퍼런스를 관람하며 쉬기 좋은 곳</div>
        <div className="chip chip--medium">컨퍼런스를 관람하며 쉬기 좋은 곳</div>
        <div className="chip chip--light">컨퍼런스를 관람하며 쉬기 좋은 곳</div>
      </div>
      <div className={`message-bar ${bottomVisible ? 'message-bar--visible' : ''}`} role="form" aria-label="메시지 입력" aria-hidden={!bottomVisible}>
        <button type="button" className="msg-btn add" aria-label="추가">＋</button>
        <input className="msg-input" type="text" placeholder="메시지 보내기..." />
        <button type="button" className="msg-btn voice" aria-label="음성">🎤</button>
      </div>
      <style jsx>{`
        .container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: radial-gradient(circle at 30% 20%, #fffdfc 0%, #fff6fa 38%, #fdeff3 100%);
          transition: background 2s ease;
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
          /* Responsive tokens for exact rounding and horizontal margins */
          --glass-radius: clamp(32px, 10vw, 48px);
          --glass-side: clamp(16px, 5.2vw, 24px);
          --glass-inner: clamp(20px, 5vw, 28px);
          --ui-gray: #E6EBEF; /* cooler gray for message bar */
          --chip-offset: clamp(8px, 2vw, 14px);
          --mb-h: clamp(44px, 7.2vh, 52px);
          --mb-bottom: clamp(36px, 6vh, 56px);
          /* Safe-area aware margins (for iOS notch, etc.) */
          --safe-l: env(safe-area-inset-left, 0px);
          --safe-r: env(safe-area-inset-right, 0px);
          --side-left: calc(var(--glass-side) + var(--safe-l));
          --side-right: calc(var(--glass-side) + var(--safe-r));
          /* Slightly shrink main modal width compared to message bar */
          --modal-shrink: clamp(14px, 3.6vw, 28px);
          /* unified frame width to avoid rounding mismatches across devices */
          --frame-width: calc(100% - var(--side-left) - var(--side-right) - (var(--modal-shrink) * 2));
          /* compensate for asymmetric safe-areas to keep true center aligned */
          --center-fix: calc((var(--safe-l) - var(--safe-r)) / 2);
          /* minimum breathing space between header and modal (responsive) */
          --header-gap: clamp(5px, 1.6vh, 12px);
          /* Small right shift for suggestions */
          --suggest-shift: clamp(6px, 1.6vw, 14px);
          --blob-tint: rgba(118, 212, 255, 0.12);
          /* extra inset for main modal only (v2 can override) */
          --modal-extra-inset: 0px;
        }
        /* enforce Pretendard Variable across the page */
        :global(html), :global(body), :global(input), :global(button), :global(textarea) {
          font-family: 'Pretendard Variable', 'Pretendard', system-ui, -apple-system, 'Segoe UI', Roboto, 'Noto Sans KR', 'Helvetica Neue', 'Apple SD Gothic Neo', 'Malgun Gothic', Arial, 'Nanum Gothic', sans-serif;
        }
        .top-heading {
          position: fixed;
          top: clamp(64px, 12vh, 120px);
          left: 50%;
          transform: translateX(-50%);
          width: calc(100% - var(--side-left) - var(--side-right));
          color: #2e3d46;
          font-weight: 700;
          font-size: 18px;
          text-align: center;
          line-height: 1.5;
          z-index: 60;
          text-shadow: 0 12px 30px rgba(0,0,0,0.06);
        }
        .container--bright {
          background: radial-gradient(circle at 30% 20%, #fffeff 0%, #fff7fb 38%, #fbeff5 100%);
        }
        /* When bottom UI is visible, soften the modal slightly */
        .container--bottom-visible .glass-content {
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 16.666%,
            rgba(255,255,255,0.08) 30%,
            rgba(255,255,255,0.30) 66%,
            rgba(255,255,255,0.56) 100%
          );
          border-color: rgba(255,255,255,0.16);
        }
        .glass-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          /* Keep vertical space flexible, lock horizontal to match reference */
          padding: calc(clamp(48px, 14vh, 96px) + var(--header-gap)) 0 clamp(32px, 12vh, 72px) 0;
          pointer-events: none;
          z-index: 90;
        }
        .glass-overlay--visible {
          pointer-events: auto;
        }
        .glass-modal {
          /* Hard-match message-bar horizontal margins */
          --modal-w: calc(var(--frame-width) - (var(--modal-extra-inset) * 2));
          width: var(--modal-w);
          margin-left: calc(var(--side-left) + var(--modal-shrink) + var(--modal-extra-inset) - var(--center-fix));
          margin-right: calc(var(--side-right) + var(--modal-shrink) + var(--modal-extra-inset) + var(--center-fix));
          /* Slightly wider card to avoid overly tall feel */
          aspect-ratio: 164 / 190;
          display: grid;
          place-items: center;
          transform: translateY(-10vh);
          pointer-events: none;
          position: relative;
          z-index: 1;
        }
        .glass-modal, .glass-content { box-sizing: border-box; }
        /* Top scanline that draws once on mount */
        .glass-modal::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: rgba(255,255,255,0.75);
          box-shadow: 0 0 8px rgba(255,255,255,0.38);
          opacity: 0;
          transform-origin: left center;
          transform: scaleX(0);
          pointer-events: none;
        }
        .glass-overlay--visible .glass-modal::before {
          animation: drawLine 600ms ease-out forwards;
        }
        .glass-content {
          /* scale inner layout proportionally to modal width (base ≈ 420px) */
          --modal-scale: clamp(0.84, calc(var(--modal-w) / 420px), 1.20);
          display: grid;
          gap: calc(20px * var(--modal-scale));
          padding: calc(26px * var(--modal-scale)) var(--glass-inner) calc(26px * var(--modal-scale));
          border-radius: var(--glass-radius);
          transform: scaleY(0.02);
          transform-origin: top center;
          will-change: transform;
          /* Softer, more transparent glass: top 30% → bottom 70% white */
          background: linear-gradient(
            180deg,
            rgba(255,255,255,0.00) 0%,
            rgba(255,255,255,0.00) 16.666%,
            rgba(255,255,255,0.12) 30%,
            rgba(255,255,255,0.38) 66%,
            rgba(255,255,255,0.70) 100%
          );
          border: 0.5px solid rgba(255,255,255,0.20);
          box-shadow:
            0 28px 48px rgba(22, 42, 58, 0.10),
            inset 0 0.5px 0 rgba(255,255,255,0.18),
            inset 0 -12px 36px rgba(255,255,255,0.05);
          backdrop-filter: blur(40px) saturate(0.9) brightness(1.04) contrast(0.96);
          -webkit-backdrop-filter: blur(40px) saturate(0.9) brightness(1.04) contrast(0.96);
          /* Desaturate inner contents slightly for a washed, matte look */
          filter: saturate(0.92);
          text-align: center;
          color: #1f2640;
          position: relative;
          overflow: hidden;
        }
        .glass-overlay--visible .glass-content {
          animation: receiptPrint 740ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .glass-content::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          /* Glossy sheen, but toned down for more transparency */
          background: linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 55%, rgba(255,255,255,0.0) 100%);
          mix-blend-mode: screen;
          opacity: 0.06;
          pointer-events: none;
        }
        .glass-content::after {
          content: '';
          position: absolute;
          inset: -28%;
          background:
            radial-gradient(circle at 18% 14%, rgba(255,255,255,0.08), transparent 60%),
            radial-gradient(circle at 86% 78%, rgba(118,212,255,0.035), transparent 70%),
            rgba(255,255,255,0.010);
          opacity: 0.07;
          filter: blur(50px) saturate(1.0);
          pointer-events: none;
        }
        .photo {
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: calc(var(--glass-radius) - (12px * var(--modal-scale)));
          background:
            url('https://images.unsplash.com/photo-1604908177522-b4f0c19e6bd0?q=80&w=1200&auto=format&fit=crop') center / cover no-repeat,
            rgba(255,255,255,0.10);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.48);
          margin-top: calc(8px * var(--modal-scale));
          margin-bottom: calc(20px * var(--modal-scale));
        }
        .text {
          display: grid;
          gap: clamp(12px, 3vw, 16px);
          color: #204a53;
          font-weight: 700;
          text-align: center;
          letter-spacing: -0.01em;
        }
        .text p { margin: 0; line-height: 2.02; }
        .text .small {
          color: #2b5b64;
          font-weight: 600;
          opacity: 0.88;
          /* appear as if it's on a new paragraph with indent */
          margin-top: clamp(18px, 4.2vw, 26px);
          text-align: left;
          text-indent: 1.2em;
          max-width: none;
          width: 100%;
          white-space: nowrap;
          word-break: keep-all;
          margin-left: auto;
          margin-right: auto;
        }
        .hl {
          display: inline-block;
          padding: 0.08em 0.68em;
          border-radius: 999px;
          background: linear-gradient(180deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.72) 100%);
          border: 1px solid rgba(255,255,255,1);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            0 3px 10px rgba(16,24,40,0.12);
          backdrop-filter: blur(12px) saturate(1.25);
          -webkit-backdrop-filter: blur(12px) saturate(1.25);
          color: #0f3a41;
        }
        @keyframes receiptPrint {
          0% { transform: scaleY(0.02); }
          70% { transform: scaleY(1.04); }
          100% { transform: scaleY(1); }
        }
        @keyframes drawLine {
          0%   { opacity: 0; transform: scaleX(0); }
          20%  { opacity: 1; }
          100% { opacity: 0; transform: scaleX(1); }
        }
        .glass-content h3 {
          margin: 0;
          font-size: clamp(18px, 4.6vw, 22px);
          font-weight: 800;
        }
        .glass-content p {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          opacity: 0.84;
          line-height: 1.6;
        }
        .primary {
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.58);
          background: linear-gradient(135deg, rgba(255,255,255,0.56) 0%, rgba(255,255,255,0.46) 50%, rgba(255,255,255,0.34) 100%);
          box-shadow:
            0 8px 18px rgba(30, 76, 78, 0.12),
            inset 0 1px 0 rgba(255,255,255,0.72);
          backdrop-filter: blur(18px) saturate(1.0) brightness(1.00);
          color: #2a2f42;
          font-weight: 700;
          font-size: clamp(12px, 3.2vw, 14px);
          padding: clamp(9px, 2.6vw, 12px) clamp(24px, 6.2vw, 32px);
          cursor: pointer;
          transition: box-shadow 180ms ease, transform 180ms ease;
        }
        .primary:hover {
          box-shadow:
            0 24px 42px rgba(30, 76, 78, 0.20),
            inset 0 1px 0 rgba(255,255,255,0.66);
          transform: translateY(-2px);
        }
        .primary:focus { outline: none; }
        /* Bottom suggestion chips (glass-like) */
        .suggestions {
          position: fixed;
          left: calc(var(--side-left) + var(--modal-shrink) - var(--center-fix));
          right: calc(var(--side-right) + var(--modal-shrink) + var(--center-fix));
          transform: none;
          bottom: calc(var(--mb-bottom) + var(--mb-h) + 18px);
          display: grid;
          gap: 12px;
          width: auto;
          z-index: 55; /* above modal, below message bar */
          pointer-events: none;
          justify-items: start;
          opacity: 0;
          transform: translate(var(--suggest-shift), 10px);
          transition: opacity 520ms ease, transform 520ms ease;
        }
        .suggestions--visible { opacity: 1; transform: translate(var(--suggest-shift), 0); pointer-events: auto; }
        .chip {
          justify-self: start;
          max-width: 100%;
          padding: clamp(12px, 3.2vw, 14px) clamp(16px, 4vw, 18px);
          border-radius: 999px;
          border: 0.5px solid rgba(255,255,255,0.34);
          background: linear-gradient(180deg, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.18) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.78),
            0 6px 16px rgba(40, 80, 96, 0.08);
          backdrop-filter: blur(14px) saturate(1.08);
          color: rgba(56,65,85,0.54);
          font-weight: 500;
          font-size: 14px;
          pointer-events: auto;
          white-space: nowrap;
        }
        /* Press chips slightly with blob-tint; upper chips are more "pressed" */
        .suggestions .chip:nth-child(1) {
          border-color: rgba(255,255,255,0.30);
          background:
            radial-gradient(120% 90% at 15% 15%, rgba(118,212,255,0.28), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.12) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.62),
            0 5px 12px rgba(40, 80, 96, 0.06);
          color: rgba(56,65,85,0.58);
        }
        .suggestions .chip:nth-child(2) {
          border-color: rgba(255,255,255,0.28);
          background:
            radial-gradient(120% 80% at 80% 0%, rgba(118,212,255,0.20), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.36) 0%, rgba(255,255,255,0.16) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.70),
            0 6px 14px rgba(40, 80, 96, 0.07);
          color: rgba(56,65,85,0.56);
        }
        .suggestions .chip:nth-child(3) {
          border-color: rgba(255,255,255,0.26);
          background:
            radial-gradient(120% 80% at 85% 0%, rgba(118,212,255,0.12), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.16) 100%);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.72),
            0 6px 15px rgba(40, 80, 96, 0.07);
          color: rgba(56,65,85,0.54);
        }
        .chip--medium {
          border-color: rgba(255,255,255,0.32);
          background: linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.18) 100%);
        }
        .chip--light {
          border-color: rgba(255,255,255,0.28);
          background: linear-gradient(180deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.14) 100%);
        }
        /* Message input bar */
        .message-bar {
          position: fixed;
          width: var(--frame-width);
          margin-left: calc(var(--side-left) + var(--modal-shrink) - var(--center-fix));
          margin-right: calc(var(--side-right) + var(--modal-shrink) + var(--center-fix));
          transform: none;
          bottom: calc(var(--mb-bottom) - 4px);
          height: var(--mb-h);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 10px;
          padding: 0 12px;
          border-radius: 999px;
          border: none;
          background: var(--ui-gray);
          box-shadow: none;
          backdrop-filter: none;
          z-index: 60;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 520ms ease, transform 520ms ease;
          box-sizing: border-box;
        }
        .message-bar--visible { opacity: 1; transform: translateY(0); }
        .msg-input {
          border: none;
          background: transparent;
          font-size: 14px;
          color: #4b4f5c;
          font-weight: 600;
          outline: none;
        }
        .msg-input::placeholder {
          color: rgba(60, 60, 72, 0.55);
          font-weight: 500;
        }
        .msg-btn {
          border: none;
          background: transparent;
          color: #586076;
          font-size: 18px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease;
        }
        .msg-btn:hover {
          transform: translateY(-2px);
          background: rgba(0,0,0,0.04);
        }
        .msg-btn:focus { outline: none; }
      `}</style>
    </div>
  );
}

