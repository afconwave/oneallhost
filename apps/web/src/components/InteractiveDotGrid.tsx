'use client';

import React, { useEffect, useRef } from 'react';

export const InteractiveDotGrid: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates
    const mouse = { x: -1000, y: -1000, radius: 140 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Create grid dots
    const spacing = 28;
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    interface Dot {
      originX: number;
      originY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }

    const dots: Dot[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;
        dots.push({
          originX: x,
          originY: y,
          x,
          y,
          vx: 0,
          vy: 0,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        const dx = mouse.x - dot.x;
        const dy = mouse.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repel / displacement on mouse hover
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          const targetX = dot.originX - Math.cos(angle) * force * 24;
          const targetY = dot.originY - Math.sin(angle) * force * 24;
          dot.vx += (targetX - dot.x) * 0.15;
          dot.vy += (targetY - dot.y) * 0.15;
        } else {
          dot.vx += (dot.originX - dot.x) * 0.08;
          dot.vy += (dot.originY - dot.y) * 0.08;
        }

        dot.vx *= 0.82;
        dot.vy *= 0.82;
        dot.x += dot.vx;
        dot.y += dot.vy;

        // Draw individual dot
        const distRatio = Math.max(0, 1 - dist / mouse.radius);
        const dotRadius = dist < mouse.radius ? 1.8 + distRatio * 1.5 : 1.2;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
        if (dist < mouse.radius) {
          // Color shift to vibrant blue / lime near cursor
          ctx.fillStyle = `rgba(27, 111, 201, ${0.4 + distRatio * 0.5})`;
        } else {
          ctx.fillStyle = 'rgba(200, 205, 215, 0.45)';
        }
        ctx.fill();

        // Connect nearby points near the mouse to form an interactive web/net
        if (dist < mouse.radius * 0.8) {
          dots.forEach((other) => {
            const d = Math.hypot(dot.x - other.x, dot.y - other.y);
            if (d < spacing * 1.3 && d > 0) {
              ctx.beginPath();
              ctx.moveTo(dot.x, dot.y);
              ctx.lineTo(other.x, other.y);
              ctx.strokeStyle = `rgba(124, 179, 66, ${0.35 * (1 - d / (spacing * 1.3))})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};
