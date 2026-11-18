// src/components/landing/CtaSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GitFork } from "lucide-react";

export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-20 py-16 lg:py-24 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-[1340px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl overflow-hidden bg-[#07090b] border border-white/[0.1] shadow-[0_24px_64px_rgba(0,0,0,0.85)] p-8 sm:p-12 lg:p-14"
        >
          {/* Top specular hairline highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          {/* Left Orbital Space Structure Graphic with Restrained Contrast */}
          <div className="absolute left-0 top-0 bottom-0 w-full sm:w-[45%] pointer-events-none overflow-hidden opacity-50 sm:opacity-75">
            <img
              src="/images/landing-cta-station.png"
              alt="Orbital Station Structure"
              className="w-full h-full object-cover object-left"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1600&q=85";
              }}
            />
            {/* Smooth gradient blend into the dark center/right container */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#07090b]/85 to-[#07090b]" />
          </div>

          {/* Center / Right Content with Editorial Hierarchy */}
          <div className="relative z-10 flex flex-col items-center sm:items-end text-center sm:text-right max-w-xl ml-auto">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C8E9A9]">
                Ready to Begin?
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight text-[#F2F3F0] leading-tight mb-3">
              Your Alternate Reality Awaits
            </h2>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-[#A5A7A3] font-normal leading-relaxed max-w-md mb-8">
              Step into the multiverse and explore the pathways and decisions that could have shaped your life.
            </p>

            {/* Primary Action Button with Directional Hover */}
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/create")}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_24px_rgba(200,233,169,0.35)] hover:shadow-[0_0_36px_rgba(200,233,169,0.65)] cursor-pointer"
            >
              <GitFork size={14} className="stroke-[2.5]" />
              <span>Create Your Universe</span>
              <ArrowRight size={14} className="stroke-[2.5]" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
