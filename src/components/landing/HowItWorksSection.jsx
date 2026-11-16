// src/components/landing/HowItWorksSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { Edit3, Sparkles, Box } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: 1,
      title: "Enter a Decision",
      subtitle: "What if...?",
      icon: Edit3,
      desc: "Input any pivotal life choice, career fork, or relocation thought.",
    },
    {
      step: 2,
      title: "Explore Realities",
      subtitle: "Discover alternate paths",
      icon: Sparkles,
      desc: "Generative multiverse engine projects branching timelines and outcomes.",
    },
    {
      step: 3,
      title: "Experience the Journey",
      subtitle: "Live your alternate life",
      icon: Box,
      desc: "Simulate day-to-day moments, metrics, and coherence across the years.",
    },
  ];

  return (
    <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-12 select-none">
      <div className="max-w-[1240px] mx-auto text-center">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-3 mb-3"
        >
          <span className="w-8 h-[1px] bg-white/20" />
          <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#C8E9A9]">
            How It Works
          </span>
          <span className="w-8 h-[1px] bg-white/20" />
        </motion.div>

        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F2F3F0] mb-16"
        >
          <span>Explore. </span>
          <span className="text-white">Discover. </span>
          <span className="text-[#C8E9A9]">Repeat.</span>
        </motion.h2>

        {/* 3 Connected Steps Container */}
        <div className="relative">
          {/* Horizontal Connector Line running across desktop nodes */}
          <div className="hidden md:block absolute top-[18px] left-[15%] right-[15%] h-[1px] bg-gradient-to-r from-white/10 via-[#C8E9A9]/40 to-white/10 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Step Number Circle */}
                  <div className="w-9 h-9 rounded-full bg-[#080a0c] border border-white/20 group-hover:border-[#C8E9A9] flex items-center justify-center mb-6 shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-xs font-bold text-white group-hover:text-[#C8E9A9]">
                      {item.step}
                    </span>
                  </div>

                  {/* Icon Card */}
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.08] group-hover:border-[#C8E9A9]/40 flex items-center justify-center mb-4 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(200,233,169,0.2)]">
                    <Icon size={22} className="text-[#F2F3F0] group-hover:text-[#C8E9A9] transition-colors" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#C8E9A9] mb-2 tracking-wide">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-[#A5A7A3] max-w-[240px] leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
