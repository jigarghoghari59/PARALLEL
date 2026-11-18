// src/components/landing/HeroSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import EarthAndMoon from "./EarthAndMoon";

// Safe error boundary for 3D WebGL runtime
class PlanetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("[3D Solar System Globe WebGL Notice]:", err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const HeroSection = ({ onLearnMoreClick }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Parallax and scroll-driven blending into #050505
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // 3D Canvas scroll fade & parallax
  const planetY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.55, 0.95], [1, 0.7, 0]);

  // Foreground text & buttons fade
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Dynamic darkness blend veil as user scrolls down
  const scrollDarkness = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.65, 1]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden select-none bg-[#000000]"
    >
      {/* ======================================================== */}
      {/* 1. 3D EARTH GLOBE & MOON (REALISTIC, NO RINGS OR FLASH)   */}
      {/* ======================================================== */}
      <motion.div
        style={{
          y: planetY,
          opacity: planetOpacity,
        }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
      >
        <PlanetErrorBoundary>
          <EarthAndMoon
            cameraDistance={isMobile ? 3.7 : 3.35}
            cameraFov={45}
            mouseInteractive={!isMobile}
            cloudOpacity={0.32}
            starCount={isMobile ? 3000 : 5000}
          />
        </PlanetErrorBoundary>
      </motion.div>

      {/* ======================================================== */}
      {/* 2. SCROLL BLEND OVERLAYS (BLENDS SEAMLESSLY INTO #050505)*/}
      {/* ======================================================== */}
      {/* Top subtle vignette for top navbar */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#000000]/90 via-[#000000]/40 to-transparent pointer-events-none z-10" />

      {/* Permanent deep bottom fade merging hero into StatsStrip */}
      <div className="absolute bottom-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-b from-transparent via-[#050505]/75 to-[#050505] pointer-events-none z-10" />

      {/* Dynamic scroll-driven dark blend layer */}
      <motion.div
        style={{ opacity: scrollDarkness }}
        className="absolute inset-0 bg-[#050505] pointer-events-none z-10"
      />

      {/* ======================================================== */}
      {/* 3. CENTER HEADLINE & FOREGROUND CONTENT (UNIQUE & STYLISH)*/}
      {/* ======================================================== */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4"
      >
        {/* Unique, Stylish Typography with Smooth Entrance & Specular #C8E9A9 Shine */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.18, delayChildren: 0.15 },
            },
          }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-[106px] font-[650] tracking-tighter leading-[0.98] mb-6 flex flex-col items-center drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
        >
          {/* First Line: "One Life," */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap"
          >
            <span className="text-shine-platinum">One</span>
            <span className="text-shine-accent drop-shadow-[0_0_28px_rgba(200,233,169,0.5)]">
              Life,
            </span>
          </motion.div>

          {/* Second Line: "Infinite Possibilities." */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 35, filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap mt-1 sm:mt-2"
          >
            <span className="text-shine-platinum">Infinite</span>
            <span className="text-shine-accent drop-shadow-[0_0_28px_rgba(200,233,169,0.5)]">
              Possibilities.
            </span>
          </motion.div>
        </motion.h1>

        {/* Elegant Sci-Fi Subtitle Pill */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-9 max-w-2xl px-5 py-2.5 rounded-full bg-black/45 border border-white/[0.08] backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
        >
          <p className="text-xs sm:text-sm md:text-base font-light text-zinc-300 leading-relaxed tracking-wide">
            <span className="text-white font-medium">Explore paths</span> · Discover worlds · Create yours. Explore the counterfactual life trajectories and decisions that could have been.
          </p>
        </motion.div>

        {/* Action Buttons: Stylized #C8E9A9 Explore Universes with Shine & Animations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Primary Action Button: #C8E9A9 with Shine, Glow Aura & Hover Animation */}
          <motion.button
            onClick={() => navigate("/explore")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-[#C8E9A9] text-[#050505] font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_30px_rgba(200,233,169,0.4)] hover:shadow-[0_0_45px_rgba(200,233,169,0.7)] transition-shadow duration-300 cursor-pointer overflow-hidden btn-shimmer-sweep"
          >
            {/* Orbiting Planet Icon that spins smoothly on hover */}
            <svg
              className="w-4 h-4 text-[#050505] stroke-[2] transition-transform duration-500 ease-out group-hover:rotate-45 group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="12" cy="12" r="5" />
              <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)" />
            </svg>
            <span className="relative z-10 font-bold tracking-tight">Explore Universes</span>
            <ArrowRight
              size={15}
              className="stroke-[2.4] text-[#050505] ml-0.5 transition-transform duration-300 ease-out group-hover:translate-x-1.5"
            />
          </motion.button>

          {/* Secondary Action Button: Create Reality */}
          <motion.button
            onClick={() => navigate("/create")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group flex items-center gap-2.5 px-7 py-4 rounded-full bg-black/50 hover:bg-white/[0.08] border border-white/[0.14] hover:border-[#C8E9A9]/50 backdrop-blur-xl text-zinc-300 hover:text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer"
          >
            <Plus size={15} className="text-zinc-400 group-hover:text-[#C8E9A9] transition-colors" />
            <span>Create Reality</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ======================================================== */}
      {/* 4. SCROLL TO EXPLORE MOUSE INDICATOR (BOTTOM CENTER)     */}
      {/* ======================================================== */}
      <div
        onClick={onLearnMoreClick}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer group select-none"
      >
        {/* Minimal Mouse Capsule Icon */}
        <div className="w-5 h-8 rounded-full border border-white/30 group-hover:border-white/60 flex justify-center pt-1.5 transition-colors">
          <div className="w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>

        {/* Text Label */}
        <span className="text-[9px] font-mono tracking-[0.28em] uppercase text-zinc-400 group-hover:text-zinc-200 transition-colors">
          SCROLL TO EXPLORE
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
