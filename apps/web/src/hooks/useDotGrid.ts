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

/**
 * Interactive dot-grid canvas with mouse repulsion.
 * Optimized: DPR capped at 1.5, paused when offscreen via IntersectionObserver,
 * passive listeners, and transform reset (no scale compounding on resize).
 */
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

    let animationFrameId: number | null = null;
    let isVisible = true;
    let dots: Dot[] = [];
    const spacing = 30;
    const dotRadius = 1.6;
    const repulseRadius = 130;
    const repulseStrength = 16;
    const friction = 0.84;
    const spring = 0.075;

    const initDots = () => {
      dots = [];
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const cols = Math.floor(width / spacing);
      const rows = Math.floor(height / spacing);

      const offsetX = (width - cols * spacing) / 2;
      const offsetY = (height - rows * spacing) / 2;

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = offsetX + i * spacing;
          const y = offsetY + j * spacing;
          dots.push({ originX: x, originY: y, currentX: x, currentY: y, vx: 0, vy: 0 });
        }
      }
    };

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = parent.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initDots();

      if (prefersReducedMotion) drawStatic();
    };

    const drawStatic = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';
      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];
        ctx.beginPath();
        ctx.arc(dot.originX, dot.originY, dotRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.38)';

      const mouse = mouseRef.current;

      for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        if (mouse.isInside) {
          const dx = mouse.x - dot.currentX;
          const dy = mouse.y - dot.currentY;
          const distSq = dx * dx + dy * dy;

          if (distSq < repulseRadius * repulseRadius && distSq > 0) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / repulseRadius) * repulseStrength;
            const angle = Math.atan2(dy, dx);
            dot.vx -= Math.cos(angle) * force;
            dot.vy -= Math.sin(angle) * force;
          }
        }

        dot.vx += (dot.originX - dot.currentX) * spring;
        dot.vy += (dot.originY - dot.currentY) * spring;

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

    const startRendering = () => {
      if (animationFrameId === null && !prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isInside: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.isInside = false;
    };

    // Pause the animation loop when the hero scrolls out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry.isIntersecting;
        if (isVisible) startRendering();
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    let resizeRaf: number | null = null;
    const handleResize = () => {
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resizeCanvas);
    };

    resizeCanvas();
    window.addEventListener('resize', handleResize, { passive: true });

    const host = canvas.parentElement ?? canvas;
    if (!prefersReducedMotion) {
      host.addEventListener('pointermove', handlePointerMove, { passive: true });
      host.addEventListener('pointerleave', handlePointerLeave, { passive: true });
      startRendering();
    } else {
      drawStatic();
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      host.removeEventListener('pointermove', handlePointerMove);
      host.removeEventListener('pointerleave', handlePointerLeave);
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      if (resizeRaf !== null) cancelAnimationFrame(resizeRaf);
    };
  }, [canvasRef]);
}
