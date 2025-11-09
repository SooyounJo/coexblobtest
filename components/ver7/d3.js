import React, { useEffect, useRef } from 'react';

const Ver7_D3 = () => {
  const canvasRef = useRef(null);
  const frameRef = useRef(0);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return () => {};
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => {};

    const parent = canvas.parentElement;
    if (!parent) return () => {};

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width: rect.width, height: rect.height, dpr };
    };

    resize();

    let observer;
    if (window.ResizeObserver) {
      observer = new ResizeObserver(resize);
      observer.observe(parent);
    } else {
      window.addEventListener('resize', resize);
    }

    const bubbles = new Array(36).fill(null).map((_, idx) => ({
      seed: idx * 17,
      radius: 20 + Math.random() * 36,
      drift: 0.6 + Math.random() * 0.8,
    }));

    const draw = (time) => {
      const { width, height } = sizeRef.current;
      const t = time * 0.0006;
      ctx.clearRect(0, 0, width, height);

      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, 'rgba(248, 254, 255, 1)');
      bg.addColorStop(1, 'rgba(212, 234, 255, 1)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = 'rgba(180, 220, 255, 0.25)';
      for (let i = 0; i < 5; i += 1) {
        const radius = width * (0.45 + i * 0.12);
        const gradient = ctx.createRadialGradient(
          width * 0.5 + Math.cos(t * 2 + i) * 40,
          height * 0.55 + Math.sin(t * 1.6 + i) * 20,
          radius * 0.15,
          width * 0.5,
          height * 0.55,
          radius
        );
        gradient.addColorStop(0, `rgba(200, 240, 255, ${0.16 - i * 0.02})`);
        gradient.addColorStop(1, 'rgba(200, 240, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.55, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      bubbles.forEach((bubble) => {
        const swirl = t * bubble.drift + bubble.seed;
        const x = width * 0.5 + Math.cos(swirl) * (width * 0.28);
        const y = height * 0.55 + Math.sin(swirl * 1.2) * (height * 0.25);
        const highlight = ctx.createRadialGradient(x - bubble.radius * 0.3, y - bubble.radius * 0.35, 2, x, y, bubble.radius);
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        highlight.addColorStop(0.35, 'rgba(196, 236, 255, 0.65)');
        highlight.addColorStop(1, 'rgba(196, 236, 255, 0.05)');
        ctx.fillStyle = highlight;
        ctx.beginPath();
        ctx.arc(x, y, bubble.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.strokeStyle = 'rgba(140, 186, 255, 0.32)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i <= 10; i += 1) {
        const progress = i / 10;
        const x = progress * width;
        const y = height * 0.75 + Math.sin(t * 2 + progress * Math.PI * 4) * 28;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (observer) {
        observer.disconnect();
      } else {
        window.removeEventListener('resize', resize);
      }
    };
  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas ref={canvasRef} />
      <style jsx>{`
        .canvas-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: #f2f8ff;
        }
        canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default Ver7_D3;
