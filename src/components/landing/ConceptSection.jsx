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

  const cardRotate = useTransform(scrollYProgress, [0, 1], [-1.5, 1.5]);
  const cardY = useTransform(scrollYProgress, [0, 1], [35, -35]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden select-none"
    >
      {/* Background Curved Orbital Line */}
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full bg-[#9678C9]/[0.025] blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Storytelling / Copy */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {/* Section Subtitle with Accent Rule */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
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

          {/* Line-by-line Heading Reveal */}
          <div className="overflow-hidden mb-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold tracking-tight leading-[1.12] text-[#F2F3F0]"
            >
              Explore Parallel
              <br />
              Realities
            </motion.h2>
          </div>

          {/* Paragraph Narrative with Refined Typography */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base text-[#A5A7A3] font-normal leading-relaxed max-w-md mb-8"
          >
            Every decision shapes your future. PARALLEL lets you explore alternative versions of your life through interactive timelines, divergent turning points, and AI-powered insights.
          </motion.p>

          {/* CTA Button: Discover More */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#121518] hover:bg-[#181C20] text-[#F2F3F0] hover:text-white border border-white/[0.1] hover:border-[#C8E9A9]/50 font-semibold text-xs tracking-wider transition-all duration-200 cursor-pointer group shadow-sm"
            >
              <span>Discover More</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-[#C8E9A9]" />
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Large Perspective Masked Cinematic Card */}
        <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
          <motion.div
            style={{ y: cardY, rotateZ: cardRotate }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[620px] aspect-[16/10] rounded-2xl overflow-hidden border border-white/[0.1] bg-[#07090b] shadow-[0_24px_64px_rgba(0,0,0,0.85)] group cursor-pointer"
            onClick={() => navigate("/explore")}
          >
            {/* Top Specular Hairline Highlight */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-20 pointer-events-none" />

            {/* Cinematic City Skyline Artwork with Masked Entrance */}
            <img
              src="/images/landing-concept-card.png"
              alt="Parallel Realities Skyline"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85";
              }}
            />

            {/* Subtle Gradient Inset Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Top Right Realities Badge */}
            <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              <span className="text-[10px] font-semibold tracking-wider text-[#F2F3F0] uppercase">
                Realities
              </span>
            </div>

            {/* Bottom Right Floating Circular Action Arrow */}
            <div className="absolute bottom-5 right-5 z-20 w-8 h-8 rounded-full bg-black/60 border border-white/15 flex items-center justify-center text-white/80 group-hover:text-white group-hover:border-[#C8E9A9] group-hover:bg-[#C8E9A9] group-hover:text-[#050505] transition-all duration-300">
              <ChevronRight size={15} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
