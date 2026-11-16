// src/components/landing/ConceptSection.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronRight, Layers } from "lucide-react";

export const ConceptSection = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const cardRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const cardY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Curved Orbital Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-[#9678C9]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Storytelling / Copy */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Section Subtitle with Accent Rule */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-4"
          >
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8E9A9]">
              The Concept
            </span>
            <span className="w-12 h-[1px] bg-[#C8E9A9]/50" />
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.12] text-[#F2F3F0] mb-5"
          >
            Explore Parallel
            <br />
            Realities
          </motion.h2>

          {/* Paragraph Narrative */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-sm sm:text-base text-[#A5A7A3] font-normal leading-relaxed max-w-md mb-8"
          >
            Every decision shapes your future. PARALLEL lets you explore alternative versions of your life through interactive timelines and AI-powered insights.
          </motion.p>

          {/* CTA Button: Discover More */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <button
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-[#F2F3F0] hover:text-white border border-white/[0.12] hover:border-[#C8E9A9]/50 backdrop-blur-xl font-semibold text-xs tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer group"
            >
              <span>Discover More</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#C8E9A9]" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Large Perspective Floating Cinematic Card */}
        <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
          <motion.div
            style={{ y: cardY, rotateZ: cardRotate }}
            className="relative w-full max-w-[620px] aspect-[16/10] rounded-3xl overflow-hidden border border-white/[0.14] bg-[#07090b] shadow-[0_24px_64px_rgba(0,0,0,0.9),0_0_40px_rgba(150,120,201,0.06)] group cursor-pointer"
            onClick={() => navigate("/explore")}
          >
            {/* Top Specular Reflection Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

            {/* Cinematic City Skyline Artwork */}
            <img
              src="/images/landing-concept-card.png"
              alt="Parallel Realities Skyline"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              onError={(e) => {
                e.currentTarget.src = "/images/card-city.png";
              }}
            />

            {/* Inner Vignette and Atmospheric Lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-black/30 pointer-events-none" />

            {/* Top Right Floating Badge: Realities */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              <span className="text-[11px] font-semibold text-white tracking-wide">Realities</span>
            </div>

            {/* Bottom Card Title Overlay */}
            <div className="absolute bottom-5 left-6 right-6 z-20 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-[#C8E9A9]">Alternate Timeline</p>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">Metropolitan Pioneer Reality</h3>
              </div>

              {/* Circular Action Arrow inside card */}
              <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/20 backdrop-blur-md flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg">
                <ChevronRight size={16} />
              </div>
            </div>
          </motion.div>

          {/* Floating Right Directional Button outside the card matching reference */}
          <button
            onClick={() => navigate("/explore")}
            aria-label="Next reality"
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0d1013]/90 hover:bg-[#C8E9A9] text-white hover:text-[#050505] border border-white/20 backdrop-blur-xl items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl z-20 cursor-pointer"
          >
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </section>
  );
};
