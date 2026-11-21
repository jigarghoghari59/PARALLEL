// src/components/landing/ConceptSection.jsx
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
      className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-12 overflow-hidden select-none bg-paper"
    >
      <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Storytelling */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="overflow-hidden mb-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight leading-[1.12] text-ink"
            >
              Explore parallel
              <br />
              realities
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="text-sm sm:text-base text-muted font-normal leading-relaxed max-w-md mb-8"
          >
            Every decision shapes your future. Parallel lets you explore alternative versions of your life through interactive timelines, divergent turning points, and AI-powered insights.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/explore")}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-surface hover:bg-card text-ink border border-rule hover:border-accent/50 font-semibold text-xs transition-colors cursor-pointer group shadow-sm focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              <span>Discover more</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform text-accent" aria-hidden="true" />
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column: Large Perspective Card */}
        <div className="lg:col-span-7 relative flex items-center justify-center lg:justify-end">
          <motion.div
            style={{ y: cardY, rotateZ: cardRotate }}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[620px] aspect-[16/10] rounded-card overflow-hidden border border-rule bg-card shadow-2xl group cursor-pointer"
            onClick={() => navigate("/explore")}
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none" />

            <img
              src="/images/landing-concept-card.png"
              alt="Parallel realities skyline"
              className="w-full h-full object-cover brightness-95"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85";
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent opacity-60 pointer-events-none" />

            <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper/85 border border-rule">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-xs font-medium text-ink">Realities</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
