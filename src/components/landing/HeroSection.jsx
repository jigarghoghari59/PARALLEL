// src/components/landing/HeroSection.jsx
import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronDown } from "lucide-react";

export const HeroSection = ({ onLearnMoreClick }) => {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  // Parallax transformations tied to Lenis scroll
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const planetY = useTransform(scrollYProgress, [0, 1], [0, 110]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.25]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[94vh] lg:min-h-screen flex items-center pt-24 sm:pt-28 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      {/* Planetary Horizon & Celestial Silhouette Visual */}
      <motion.div
        style={{ y: planetY }}
        className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      >
        {/* Massive Atmospheric Planet Horizon */}
        <div className="absolute right-[-15%] sm:right-[-6%] top-[3%] sm:top-[-4%] w-[85vw] sm:w-[68vw] lg:w-[60vw] max-w-[880px] aspect-square rounded-full">
          {/* Subtle slow rotation simulation container */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 240, repeat: Infinity, ease: "linear" }}
            className="w-full h-full relative rounded-full"
          >
            {/* Planet Inner Ambient Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#050505] via-[#091114] to-[#1c3337] opacity-90 shadow-[inset_-30px_-30px_90px_rgba(5,5,5,0.95)]" />

            {/* Atmospheric Rim Light (Cyan/Sage/White) */}
            <div className="absolute inset-0 rounded-full border border-white/20 shadow-[0_0_80px_rgba(200,233,169,0.3),inset_0_0_50px_rgba(255,255,255,0.25)]" />

            {/* Background Planet Texture / Artwork */}
            <img
              src="/images/landing-hero-planet.png"
              alt="Parallel Universe Planet"
              className="w-full h-full object-cover object-center rounded-full opacity-90 mix-blend-screen scale-105"
              onError={(e) => {
                e.currentTarget.src = "/images/portal-hero.png";
              }}
            />
          </motion.div>

          {/* Light Beams Rising from Horizon */}
          <div className="absolute bottom-[20%] left-[30%] w-1.5 h-64 bg-gradient-to-t from-white/60 via-white/20 to-transparent blur-sm rotate-[-12deg]" />
          <div className="absolute bottom-[18%] left-[35%] w-1 h-72 bg-gradient-to-t from-[#C8E9A9]/70 via-[#C8E9A9]/20 to-transparent blur-[2px] rotate-[-8deg]" />
          <div className="absolute bottom-[22%] left-[42%] w-1 h-56 bg-gradient-to-t from-[#9678C9]/40 via-transparent to-transparent blur-sm" />
        </div>

        {/* Ambient Dark Gradient Wash to Blend Planet into Deep Space */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-1" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-1" />
      </motion.div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Headline Column */}
        <motion.div
          style={{ y: textY, opacity: heroOpacity }}
          className="lg:col-span-7 flex flex-col justify-center"
        >
          {/* Category Pill Badge with Restrained Glow */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1114] border border-white/[0.1] w-fit mb-6 shadow-[0_2px_16px_rgba(0,0,0,0.5)] group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#F2F3F0]">
              Digital Parallel Universe
            </span>
            <Sparkles size={11} className="text-[#C8E9A9] ml-0.5" />
          </motion.div>

          {/* Monumental Editorial Headline with Staggered Line Animation */}
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
              }}
              className="text-4xl sm:text-6xl lg:text-[72px] font-extrabold tracking-tight leading-[1.05] text-[#F2F3F0]"
            >
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="block"
              >
                ONE LIFE.
              </motion.span>
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 35 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="block text-white"
              >
                INFINITE POSSIBILITIES.
              </motion.span>
            </motion.h1>
          </div>

          {/* Subtitle with Refined Editorial Hierarchy */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: "easeOut" }}
            className="text-sm sm:text-base lg:text-lg text-[#A5A7A3] font-normal leading-relaxed max-w-lg mb-8"
          >
            Explore the paths not taken. Discover the divergent milestones, careers, and lives that could have been.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.38, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-4"
          >
            {/* Primary Action Button: Start Exploring */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_24px_rgba(200,233,169,0.35)] hover:shadow-[0_0_36px_rgba(200,233,169,0.65)] hover:bg-[#d5f2b8] cursor-pointer"
            >
              <span>Start Exploring</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </motion.button>

            {/* Secondary Action Button: Learn More */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLearnMoreClick}
              className="flex items-center gap-2 px-5 py-3.5 rounded-full bg-[#121518] hover:bg-[#181C20] text-[#F2F3F0] hover:text-white border border-white/[0.1] hover:border-white/25 font-semibold text-xs tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
            >
              <span>Learn More</span>
              <Play size={10} className="fill-[#F2F3F0] text-[#F2F3F0] ml-0.5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Atmospheric Area with Floating Badge */}
        <div className="lg:col-span-5 relative h-64 lg:h-[460px] flex items-center justify-end pointer-events-none">
          {/* Floating Pill Badge: Explore Alternate Realities */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.45 }}
            className="hidden sm:inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#090b0d] border border-white/12 shadow-[0_16px_36px_rgba(0,0,0,0.8)] pointer-events-auto cursor-pointer hover:border-[#C8E9A9]/50 transition-all hover:scale-105 mr-4"
            onClick={() => navigate("/explore")}
          >
            <div className="w-5 h-5 rounded-full bg-[#141a15] border border-[#C8E9A9]/40 flex items-center justify-center text-[#C8E9A9]">
              <Sparkles size={11} />
            </div>
            <div className="text-left">
              <span className="text-[10px] text-[#A5A7A3] uppercase tracking-wider block font-medium">Explore</span>
              <span className="text-xs font-bold text-[#F2F3F0] block leading-none">Alternate Realities</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Editorial Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[9px] font-mono tracking-[0.24em] uppercase text-[#A5A7A3]/70">
          Scroll to explore
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-[#C8E9A9] to-transparent animate-pulse" />
      </motion.div>
    </section>
  );
};
