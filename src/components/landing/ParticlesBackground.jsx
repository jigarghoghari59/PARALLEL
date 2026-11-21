// src/components/landing/ParticlesBackground.jsx
import React, { useEffect, useRef } from "react";

export const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const starCount = width < 768 ? 90 : 180;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      baseAlpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += star.twinkleSpeed * star.direction;
        if (star.alpha > star.baseAlpha + 0.25 || star.alpha < star.baseAlpha - 0.25) {
          star.direction *= -1;
        }

        ctx.fillStyle = `rgba(242, 243, 240, ${Math.max(0.1, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div className="absolute inset-0 bg-paper" />

      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" aria-hidden="true" />

      {/* SVG Orbital Paths in background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <ellipse
          cx="50%"
          cy="25%"
          rx="65%"
          ry="35%"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <ellipse
          cx="70%"
          cy="30%"
          rx="45%"
          ry="20%"
          fill="none"
          stroke="rgba(200, 233, 169, 0.12)"
          strokeWidth="1"
        />
        <ellipse
          cx="30%"
          cy="85%"
          rx="55%"
          ry="25%"
          fill="none"
          stroke="rgba(150, 120, 201, 0.08)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
