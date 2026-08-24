'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
}

export function useDotGrid(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const mouseRef = useRef<{ x: number; y: number; isInside: boolean }>({
    x: -1000,
    y: -1000,
    isInside: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let dots: Dot[] = [];
    const spacing = 28;
    const dotRadius = 1.75;
    const repulseRadius = 120;
    const repulseStrength = 18;
    const friction = 0.82;
    const spring = 0.08;

    const initDots = () => {
      dots = [];
      const width = canvas.width;
      const height = canvas.height;

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;
          dots.push({
            originX: x,
            originY: y,
            currentX: x,
            currentY: y,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
      initDots();

      if (prefersReducedMotion) {
        drawStatic();
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        ctx.beginPath();
        ctx.arc(dot.originX, dot.originY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';

      const mouse = mouseRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (mouse.isInside) {
          const dx = mouse.x - dot.currentX;
          const dy = mouse.y - dot.currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulseRadius && dist > 0) {
            const force = (1 - dist / repulseRadius) * repulseStrength;
            const angle = Math.atan2(dy, dx);
            dot.vx -= Math.cos(angle) * force;
            dot.vy -= Math.sin(angle) * force;
          }
        }

        // Spring back to origin
        const springDx = dot.originX - dot.currentX;
        const springDy = dot.originY - dot.currentY;

        dot.vx += springDx * spring;
        dot.vy += springDy * spring;

        dot.vx *= friction;
        dot.vy *= friction;

        dot.currentX += dot.vx;
        dot.currentY += dot.vy;

        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isInside: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isInside = false;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (!prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      animationFrameId = requestAnimationFrame(render);
    } else {
      drawStatic();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [canvasRef]);
}
