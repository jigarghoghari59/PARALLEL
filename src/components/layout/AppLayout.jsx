// src/components/layout/AppLayout.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { ScrollProgressBar } from "../landing/ScrollProgressBar";
import { ParticlesBackground } from "../landing/ParticlesBackground";
import { LandingNav } from "../landing/LandingNav";
import { LandingFooter } from "../landing/LandingFooter";

gsap.registerPlugin(ScrollTrigger);

export const AppLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.8,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  // Scroll to top on page navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F2F3F0] font-sans antialiased selection:bg-[#C8E9A9] selection:text-[#050505] overflow-x-hidden flex flex-col justify-between">
      {/* 1. Global Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* 2. Global Cosmic Starfield & Ambient Nebula Background */}
      <ParticlesBackground />

      {/* 3. Global Floating Top Navigation Bar */}
      <LandingNav />

      {/* 4. Main Page Content Container */}
      <main className="w-full flex-1 flex flex-col relative z-10 pt-20 sm:pt-24 min-h-[calc(100vh-160px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="w-full flex-1 flex flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 5. Global Professional Footer */}
      <LandingFooter />
    </div>
  );
};
