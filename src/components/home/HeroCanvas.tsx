'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate floating Minecraft-style isometric cubes / cyber particles
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
      isCube: boolean;
      rot: number;
    }> = [];

    const colors = [
      '#8b5cf6', // purple
      '#00f5ff', // cyan
      '#ec4899', // pink
      '#6366f1', // indigo
      '#f59e0b', // gold
    ];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 3,
        speedY: -(Math.random() * 0.4 + 0.1),
        speedX: (Math.random() - 0.5) * 0.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.6 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        isCube: Math.random() > 0.4,
        rot: Math.random() * Math.PI * 2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Cyber ambient fog
      const grad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.3,
        50,
        width * 0.5,
        height * 0.5,
        width * 0.7
      );
      grad.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
      grad.addColorStop(0.5, 'rgba(0, 245, 255, 0.04)');
      grad.addColorStop(1, 'rgba(6, 7, 12, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Render floating cube / particle items
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rot += 0.005;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = p.alpha;

        if (p.isCube) {
          // Draw mini voxel cube outline
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.strokeRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.fillStyle = p.color + '22';
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else {
          // Glowing orb particle
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
