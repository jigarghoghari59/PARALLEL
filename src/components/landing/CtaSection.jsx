// src/components/landing/CtaSection.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, GitFork } from "lucide-react";

export const CtaSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative z-20 py-16 lg:py-24 px-4 sm:px-6 lg:px-12 select-none bg-paper">
      <div className="max-w-[1340px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-card overflow-hidden bg-card border border-rule p-8 sm:p-12 lg:p-14"
        >
          {/* Top specular hairline highlight */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* Left Orbital Graphic */}
          <div className="absolute left-0 top-0 bottom-0 w-full sm:w-[45%] pointer-events-none overflow-hidden opacity-50 sm:opacity-75">
            <img
              src="/images/landing-cta-station.png"
              alt="Orbital station structure"
              className="w-full h-full object-cover object-left"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=1600&q=85";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/85 to-card" />
          </div>

          {/* Right Content */}
          <div className="relative z-10 flex flex-col items-center sm:items-end text-center sm:text-right max-w-xl ml-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-ink leading-tight mb-3">
              Your alternate reality awaits
            </h2>

            <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed max-w-md mb-8">
              Step into the multiverse and explore the pathways and decisions that could have shaped your life.
            </p>

            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/create")}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-accent hover:bg-accent-muted text-accent-ink font-semibold text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              <GitFork size={14} className="stroke-[2.5]" aria-hidden="true" />
              <span>Create your universe</span>
              <ArrowRight size={14} className="stroke-[2.5]" aria-hidden="true" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
