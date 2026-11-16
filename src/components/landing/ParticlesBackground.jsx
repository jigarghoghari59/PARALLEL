// src/components/landing/ParticlesBackground.jsx
import React, { useEffect, useRef } from "react";

export const ParticlesBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Subtle starfield
    const starCount = Math.floor((width * height) / 9000);
    const stars = Array.from({ length: Math.min(starCount, 120) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      speed: prefersReducedMotion ? 0 : Math.random() * 0.15 + 0.05,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        star.alpha += Math.sin(Date.now() * star.twinkleSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.85, star.alpha));

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 243, 240, ${currentAlpha})`;
        ctx.fill();

        if (!prefersReducedMotion) {
          star.y -= star.speed;
          if (star.y < 0) {
            star.y = height;
            star.x = Math.random() * width;
          }
        }
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
      {/* Deep space base radial gradients */}
      <div className="absolute inset-0 bg-[#050505]" />
      
      {/* Subtle atmospheric nebula glow top right (purple sparingly) */}
      <div className="absolute -top-32 right-[-10%] w-[600px] h-[600px] rounded-full bg-[#9678C9]/[0.035] blur-[140px]" />
      
      {/* Subtle sage green cosmic rim aura */}
      <div className="absolute top-[20%] left-[-15%] w-[700px] h-[700px] rounded-full bg-[#C8E9A9]/[0.025] blur-[160px]" />
      
      {/* Starfield canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-80" />

      {/* Subtle SVG Orbital Paths in background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
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
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="1"
          strokeDasharray="6 12"
        />
      </svg>
    </div>
  );
};
