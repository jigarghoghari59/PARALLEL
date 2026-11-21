// src/components/landing/StatsStrip.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const StatsStrip = ({ stats }) => {
  const navigate = useNavigate();

  const universesCount = stats?.totalUniverses > 10000 ? `${(stats.totalUniverses / 1000).toFixed(1)}K+` : "10K+";
  const timelinesCount = stats?.totalTimelines > 50000 ? `${(stats.totalTimelines / 1000).toFixed(1)}K+` : "50K+";
  const decisionsCount = stats?.totalDecisions > 1000000 ? `${(stats.totalDecisions / 1000000).toFixed(1)}M+` : "1M+";

  const statItems = [
    {
      value: universesCount,
      label: "Universes created",
      path: "/saved",
      icon: (
        <svg viewBox="0 0 32 32" className="w-7 h-7 text-accent" fill="none" aria-hidden="true">
          <ellipse
            cx="16"
            cy="16"
            rx="14"
            ry="6"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeOpacity="0.4"
            transform="rotate(-25 16 16)"
          />
          <ellipse
            cx="16"
            cy="16"
            rx="10"
            ry="4"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(-25 16 16)"
          />
          <circle cx="16" cy="16" r="3.2" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: timelinesCount,
      label: "Timelines explored",
      path: "/explore",
      icon: (
        <svg viewBox="0 0 32 32" className="w-7 h-7 text-accent" fill="none" aria-hidden="true">
          <circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 10V18" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 18L10 24" stroke="currentColor" strokeWidth="1.6" />
          <path d="M16 18L22 24" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="9" cy="25" r="2.5" fill="currentColor" />
          <circle cx="23" cy="25" r="2.5" fill="currentColor" />
        </svg>
      ),
    },
    {
      value: decisionsCount,
      label: "Decisions explored",
      path: "/create",
      icon: (
        <svg viewBox="0 0 32 32" className="w-7 h-7 text-accent" fill="none" aria-hidden="true">
          <circle cx="10" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="22" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="16" cy="23" r="3" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M16 20V15M16 15L10 12M16 15L22 12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="relative z-20 px-4 sm:px-6 lg:px-12 my-6">
      <div className="max-w-[1240px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative rounded-card bg-card border border-rule p-4 sm:p-6 overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          {/* 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
            {statItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="flex items-center justify-center gap-4 py-3 sm:py-2 px-4 cursor-pointer group transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-surface border border-rule flex items-center justify-center shrink-0 group-hover:border-accent/40 transition-colors">
                  {item.icon}
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-ink tracking-tight group-hover:text-accent transition-colors leading-none">
                    {item.value}
                  </div>
                  <div className="text-xs text-muted font-normal mt-1">
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
