// src/components/landing/HeroSection.jsx
import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import EarthAndMoon from "./EarthAndMoon";

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

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const planetY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const planetOpacity = useTransform(scrollYProgress, [0, 0.55, 0.95], [1, 0.7, 0]);

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  const scrollDarkness = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0.65, 1]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-dvh w-full flex flex-col items-center justify-start pt-28 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-12 overflow-hidden select-none bg-paper"
    >
      {/* 1. 3D EARTH GLOBE & MOON */}
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

      {/* 2. SCROLL BLEND OVERLAYS */}
      <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-paper/90 via-paper/40 to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-0 inset-x-0 h-48 sm:h-64 bg-gradient-to-b from-transparent via-paper/75 to-paper pointer-events-none z-10" />

      <motion.div
        style={{ opacity: scrollDarkness }}
        className="absolute inset-0 bg-paper pointer-events-none z-10"
      />

      {/* 3. CENTER HEADLINE & FOREGROUND CONTENT */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4"
      >
        {/* Demo-matched Flickering Status Pill */}
        <p className="etichetta" data-page-label="">
          <span className="etichetta__quadro" />
          PARALLEL ENGINE v2.0
        </p>

        <div className="relative mb-5">
          <h1 className="font-syne text-4xl sm:text-5xl md:text-6xl lg:text-[68px] xl:text-[76px] font-bold tracking-tight leading-[1.04] flex flex-col items-center select-none">
            {/* Line 1: One Life, */}
            <div className="overflow-hidden py-0.5">
              <div className="flex items-baseline justify-center gap-2.5 sm:gap-4 flex-wrap">
                <span className="inline-block text-white">
                  {"One".split("").map((c, i) => (
                    <span key={i} data-page-char="" className="inline-block">
                      {c}
                    </span>
                  ))}
                </span>

                <span className="inline-block text-accent">
                  {"Life,".split("").map((c, i) => (
                    <span key={i} data-page-char="" className="inline-block">
                      {c}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            {/* Line 2: Infinite Possibilities. */}
            <div className="overflow-hidden py-0.5 mt-0.5 sm:mt-1">
              <div className="flex items-baseline justify-center gap-2.5 sm:gap-4 flex-wrap">
                <span className="inline-block text-accent">
                  {"Infinite".split("").map((c, i) => (
                    <span key={i} data-page-char="" className="inline-block">
                      {c}
                    </span>
                  ))}
                </span>

                <span className="inline-block text-white">
                  {"Possibilities.".split("").map((c, i) => (
                    <span key={i} data-page-char="" className="inline-block">
                      {c}
                    </span>
                  ))}
                </span>
              </div>
            </div>
          </h1>
        </div>

        {/* Subtitle Pill */}
        <div
          data-page-line=""
          className="mb-9 max-w-2xl px-5 py-2.5 rounded-full bg-card/80 border border-rule"
        >
          <p className="text-xs sm:text-sm md:text-base font-normal text-muted leading-relaxed">
            Explore counterfactual life trajectories and decisions that could have been across parallel digital realities.
          </p>
        </div>

        {/* Action Buttons */}
        <div
          data-page-actions=""
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6"
        >
          {/* Primary Action Button */}
          <motion.button
            onClick={() => navigate("/explore")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group relative flex items-center gap-3 px-8 py-4 rounded-full bg-accent text-accent-ink font-semibold text-xs sm:text-sm tracking-tight cursor-pointer overflow-hidden btn-shimmer-sweep focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            <svg
              className="w-4 h-4 text-accent-ink stroke-[2] transition-transform duration-300 ease-out group-hover:rotate-45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <ellipse cx="12" cy="12" rx="10" ry="3.5" transform="rotate(-25 12 12)" />
            </svg>
            <span className="relative z-10 font-bold">Explore Universes</span>
            <ArrowRight
              size={15}
              className="stroke-[2.4] text-accent-ink ml-0.5 transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </motion.button>

          {/* Secondary Action Button */}
          <motion.button
            onClick={() => navigate("/create")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group flex items-center gap-2.5 px-7 py-4 rounded-full bg-card hover:bg-surface border border-rule hover:border-accent/40 text-muted hover:text-ink font-medium text-xs sm:text-sm cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
          >
            <Plus size={15} className="text-muted group-hover:text-accent transition-colors" aria-hidden="true" />
            <span>Create Reality</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 4. SCROLL INDICATOR */}
      <div
        onClick={onLearnMoreClick}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 cursor-pointer group select-none"
      >
        <div className="w-5 h-8 rounded-full border border-rule group-hover:border-accent/50 flex justify-center pt-1.5 transition-colors">
          <div className="w-1 h-2 rounded-full bg-muted/80" />
        </div>

        <span className="text-xs text-muted group-hover:text-ink transition-colors">
          Scroll to explore
        </span>
      </div>
    </section>
  );
};

export default HeroSection;
