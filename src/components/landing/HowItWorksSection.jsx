// src/components/landing/HowItWorksSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { GitFork, Orbit, Compass } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Enter a decision",
      subtitle: "What if…?",
      icon: GitFork,
      desc: "Input any pivotal life choice, career fork, or relocation thought into the prompt engine.",
    },
    {
      step: "02",
      title: "Explore realities",
      subtitle: "Discover alternate paths",
      icon: Orbit,
      desc: "The generative multiverse engine maps divergent career outcomes and milestone trajectories.",
    },
    {
      step: "03",
      title: "Experience the journey",
      subtitle: "Live your alternate life",
      icon: Compass,
      desc: "Simulate day-to-day moments, personal relationships, and coherence metrics across the years.",
    },
  ];

  return (
    <section className="relative z-10 py-20 lg:py-28 px-4 sm:px-6 lg:px-12 select-none bg-paper">
      <div className="max-w-[1240px] mx-auto text-center">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-16"
        >
          <span>Explore. </span>
          <span className="text-white">Discover. </span>
          <span className="text-accent">Repeat.</span>
        </motion.h2>

        {/* 3 Connected Steps Container */}
        <div className="relative">
          {/* Animated Connecting Horizontal Line */}
          <div className="hidden md:block absolute top-[22px] left-[16%] right-[16%] h-[1px] bg-rule z-0 overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full bg-gradient-to-r from-transparent via-accent/60 to-transparent origin-left"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative z-10">
            {steps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  {/* Step Number Circle */}
                  <div className="w-11 h-11 rounded-full bg-card border border-rule group-hover:border-accent/70 flex items-center justify-center mb-6 shadow-md transition-colors duration-200">
                    <span className="text-xs font-semibold text-ink group-hover:text-accent">
                      {item.step}
                    </span>
                  </div>

                  {/* Icon Card */}
                  <div className="w-14 h-14 rounded-card bg-surface border border-rule group-hover:border-accent/40 flex items-center justify-center mb-4 transition-colors duration-200">
                    <Icon size={22} className="text-ink group-hover:text-accent transition-colors" aria-hidden="true" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-accent mb-2">
                    {item.subtitle}
                  </p>
                  <p className="text-xs text-muted max-w-[250px] leading-relaxed">
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
