// src/components/landing/HeroSection.jsx
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";

export const HeroSection = ({ onLearnMoreClick }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Scroll parallax for planetary visual
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const planetY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.2]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] lg:min-h-screen flex items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      {/* Planetary Horizon & Celestial Silhouette Visual */}
      <motion.div
        style={{ y: planetY }}
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Massive Atmospheric Planet Horizon */}
        <div className="absolute right-[-15%] sm:right-[-5%] top-[5%] sm:top-[-4%] w-[85vw] sm:w-[65vw] lg:w-[58vw] max-w-[850px] aspect-square rounded-full">
          {/* Planet Inner Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#050505] via-[#0b141a] to-[#254247] opacity-90 shadow-[inset_-30px_-30px_90px_rgba(5,5,5,0.95)]" />
          
          {/* Atmospheric Rim Light (Cyan/Sage/White) */}
          <div className="absolute inset-0 rounded-full border border-white/20 shadow-[0_0_80px_rgba(200,233,169,0.35),inset_0_0_50px_rgba(255,255,255,0.3)]" />

          {/* Background Planet Texture / Artwork */}
          <img
            src="/images/landing-hero-planet.png"
            alt="Parallel Universe Planet"
            className="w-full h-full object-cover object-center rounded-full opacity-90 mix-blend-screen scale-105"
            onError={(e) => {
              // Fallback to high-res cinematic planet if crop not loaded
              e.currentTarget.src = "/images/portal-hero.png";
            }}
          />

          {/* Light Beams Rising from Horizon */}
          <div className="absolute bottom-[20%] left-[30%] w-1.5 h-64 bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-sm rotate-[-12deg]" />
          <div className="absolute bottom-[18%] left-[35%] w-1 h-72 bg-gradient-to-t from-[#C8E9A9]/70 via-[#C8E9A9]/20 to-transparent blur-[2px] rotate-[-8deg]" />
          <div className="absolute bottom-[22%] left-[42%] w-1 h-56 bg-gradient-to-t from-[#9678C9]/50 via-transparent to-transparent blur-sm" />
        </div>

        {/* Ambient Dark Gradient Wash to Blend Planet into Deep Space */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/75 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-1" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline Column */}
        <motion.div
          style={{ y: textY, opacity }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Category Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl w-fit mb-5 shadow-[0_0_20px_rgba(200,233,169,0.15)] group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2F3F0]">
              Digital Parallel Universe
            </span>
            <Sparkles size={11} className="text-[#C8E9A9] ml-0.5" />
          </motion.div>

          {/* Monumental Headline matching reference */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-[#F2F3F0] mb-5"
          >
            <span className="block">ONE LIFE.</span>
            <span className="block text-white">
              INFINITE POSSIBILITIES.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base lg:text-lg text-[#A5A7A3] font-normal leading-relaxed max-w-lg mb-8"
          >
            Explore the paths not taken. Discover the lives that could have been.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary Action Button: Start Exploring */}
            <button
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_28px_rgba(200,233,169,0.4)] hover:shadow-[0_0_40px_rgba(200,233,169,0.7)] hover:bg-[#d4f2b7] hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <span>Start Exploring</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </button>

            {/* Secondary Action Button: Learn More */}
            <button
              onClick={onLearnMoreClick}
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#F2F3F0] hover:text-white border border-white/[0.12] hover:border-white/30 backdrop-blur-xl font-semibold text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Learn More</span>
              <Play size={10} className="fill-[#F2F3F0] text-[#F2F3F0] ml-0.5" />
            </button>
          </motion.div>
        </motion.div>

        {/* Right Atmospheric Area with Floating Badge */}
        <div className="lg:col-span-5 relative h-64 lg:h-[460px] flex items-center justify-end pointer-events-none">
          {/* Floating Pill Badge: Explore Alternate Realities */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#090b0d]/80 border border-white/15 backdrop-blur-2xl shadow-[0_16px_36px_rgba(0,0,0,0.8)] pointer-events-auto cursor-pointer hover:border-[#C8E9A9]/50 transition-all hover:scale-105 mr-4"
            onClick={() => navigate("/explore")}
          >
            <div className="w-5 h-5 rounded-lg bg-[#C8E9A9]/10 border border-[#C8E9A9]/30 flex items-center justify-center">
              <Sparkles size={11} className="text-[#C8E9A9]" />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-bold text-white tracking-wider">Explore</p>
              <p className="text-[9px] text-[#A5A7A3]">Alternate Realities</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Edge Scroll Down Indicator matching reference */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="hidden xl:flex flex-col items-center gap-2 absolute right-8 top-1/2 -translate-y-1/2 z-20"
      >
        <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1 bg-white/[0.02] backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-1 h-2 rounded-full bg-[#C8E9A9]"
          />
        </div>
        <span className="text-[8.5px] uppercase tracking-[0.25em] text-[#A5A7A3] [writing-mode:vertical-lr] rotate-180">
          Scroll Down
        </span>
      </motion.div>
    </section>
  );
};
