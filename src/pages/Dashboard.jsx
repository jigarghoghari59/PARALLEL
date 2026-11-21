// src/pages/Dashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GitFork,
  ArrowRight,
  Play,
  Activity,
  Calendar,
  Crosshair,
  Layers,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { settingsService } from "../services/settingsService";

export default function Dashboard() {
  const navigate = useNavigate();
  const { universes, stats } = useUniverse();

  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const [profile, setProfile] = useState(() => settingsService.getProfile());

  useEffect(() => {
    const handleProfileUpdate = (e) => {
      if (e.detail) setProfile(e.detail);
    };
    window.addEventListener("parallel:profile-updated", handleProfileUpdate);
    return () => window.removeEventListener("parallel:profile-updated", handleProfileUpdate);
  }, []);

  const universesCount = stats?.totalUniverses > 12 ? `${stats.totalUniverses}+` : "12+";
  const timelinesCount = stats?.totalTimelines > 48 ? `${stats.totalTimelines}+` : "48+";
  const decisionsCount = stats?.totalDecisions > 120 ? `${stats.totalDecisions}+` : "120+";

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
      {/* 1. HERO SECTION: TEXT + PORTAL CINEMATIC ARTWORK */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] items-center gap-4 py-2 flex-1 min-h-[260px] lg:min-h-[290px]">
        {/* Left Column */}
        <div className="flex flex-col justify-center max-w-[490px] z-10">
          {/* Welcome Capsule Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule w-fit mb-3.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-xs font-medium text-ink">
              Welcome back, <span className="text-accent">{profile.name?.split(" ")[0] || "Explorer"}</span>
            </span>
          </div>

          <div className="relative mb-3">
            <motion.h1
              initial="hidden"
              animate="visible"
              className="font-syne text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight leading-[1.1] select-none"
            >
              <div className="overflow-hidden py-0.5">
                <motion.span
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 },
                    },
                  }}
                  className="inline-block text-white"
                >
                  One life.
                </motion.span>
              </div>

              <div className="overflow-hidden mt-0.5 py-0.5">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 },
                      },
                    }}
                    className="inline-block text-accent font-semibold"
                  >
                    Infinite
                  </motion.span>
                  <motion.span
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.25 },
                      },
                    }}
                    className="inline-block text-white font-bold"
                  >
                    possibilities.
                  </motion.span>
                </div>
              </div>
            </motion.h1>
          </div>

          <p className="text-xs sm:text-sm text-muted font-normal leading-relaxed max-w-[380px] mb-6">
            Explore the paths not taken. Discover the lives
            that could have been across digital timelines.
          </p>

          {/* Action Button Row */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-accent hover:bg-accent-muted active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none text-accent-ink font-semibold text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              <GitFork size={14} className="stroke-[2.5]" aria-hidden="true" />
              <span>Create reality</span>
              <ArrowRight size={13} className="stroke-[2.5]" aria-hidden="true" />
            </button>

            <button
              onClick={() => navigate("/explore")}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface hover:bg-card active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none border border-rule hover:border-accent/40 text-ink font-semibold text-xs transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
            >
              <Play size={11} className="text-accent fill-transparent stroke-[2.4] ml-0.5" aria-hidden="true" />
              <span>Explore timelines</span>
            </button>
          </div>
        </div>

        {/* Right Column: Portal Artwork */}
        <div className="relative w-full h-[240px] sm:h-[280px] lg:h-[300px] flex items-center justify-end overflow-hidden pointer-events-none select-none">
          <div className="relative w-full h-full max-w-[560px] flex items-center justify-end">
            <img
              src="/images/portal-hero.png"
              alt="Cosmic portal horizon"
              className="w-full h-full object-contain object-right"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=85";
              }}
            />
          </div>
        </div>
      </section>

      {/* 2. STATISTICS & QUOTE HORIZONTAL BAR */}
      <section className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-3.5 my-2 w-full">
        {/* Left Statistics Panel */}
        <div className="rounded-card bg-card border border-rule px-5 py-3 flex items-center justify-around gap-2 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* Stat 1: Universes Created */}
          <div
            onClick={() => navigate("/saved")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-8 h-8 text-accent" fill="none" aria-hidden="true">
                <ellipse
                  cx="16"
                  cy="16"
                  rx="14"
                  ry="6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                  transform="rotate(-25 16 16)"
                />
                <ellipse
                  cx="16"
                  cy="16"
                  rx="10"
                  ry="4"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  transform="rotate(-25 16 16)"
                />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-ink leading-none group-hover:text-accent transition-colors">
                {universesCount}
              </p>
              <p className="text-xs text-muted font-normal mt-1 whitespace-nowrap">
                Universes created
              </p>
            </div>
          </div>

          <div className="w-[1px] h-9 bg-rule shrink-0" />

          {/* Stat 2: Timelines Explored */}
          <div
            onClick={() => navigate("/explore")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 32 32" className="w-7 h-7 text-accent" fill="none" aria-hidden="true">
                <circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 10V18" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 18L10 24" stroke="currentColor" strokeWidth="1.6" />
                <path d="M16 18L22 24" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="9" cy="25" r="2.5" fill="currentColor" />
                <circle cx="23" cy="25" r="2.5" fill="currentColor" />
              </svg>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-ink leading-none group-hover:text-accent transition-colors">
                {timelinesCount}
              </p>
              <p className="text-xs text-muted font-normal mt-1 whitespace-nowrap">
                Timelines explored
              </p>
            </div>
          </div>

          <div className="w-[1px] h-9 bg-rule shrink-0" />

          {/* Stat 3: Decisions Explored */}
          <div
            onClick={() => navigate("/create")}
            className="flex items-center gap-3.5 cursor-pointer group flex-1 justify-center transition-colors"
          >
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-accent">
              <GitFork size={22} className="stroke-[2]" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-ink leading-none group-hover:text-accent transition-colors">
                {decisionsCount}
              </p>
              <p className="text-xs text-muted font-normal mt-1 whitespace-nowrap">
                Decisions explored
              </p>
            </div>
          </div>
        </div>

        {/* Right Quote Panel */}
        <div className="relative rounded-card bg-card border border-rule px-5 py-3 flex items-center gap-3 min-w-[280px] lg:min-w-[310px] overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-start gap-2.5 z-10 max-w-[210px]">
            <span className="text-muted font-serif text-3xl leading-none select-none" aria-hidden="true">
              “
            </span>
            <p className="text-xs italic text-ink font-normal leading-snug mt-1">
              Every decision creates
              <br />
              a new reality…
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none select-none overflow-hidden">
            <img
              src="/images/quote-moon.png"
              alt="Crescent planet"
              className="w-full h-full object-cover object-left opacity-90"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?auto=format&fit=crop&w=600&q=85";
              }}
            />
          </div>
        </div>
      </section>

      {/* 3. FOUR LOWER CARDS ROW */}
      <section className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2 pb-1 w-full">
        {/* Card 1: Your Realities */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-card bg-card hover:bg-surface border border-rule hover:border-accent/40 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Layers size={13} className="text-accent stroke-[2.2]" aria-hidden="true" />
              <span className="text-xs font-semibold text-ink">
                Your realities
              </span>
            </div>
            <span className="text-xs text-muted">
              2 universes
            </span>
          </div>

          <div className="w-full h-[84px] rounded-md overflow-hidden bg-paper relative border border-rule my-1">
            <img
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=85"
              alt="Computer engineering workspace"
              className="w-full h-full object-cover brightness-90"
              onError={(e) => {
                e.currentTarget.src = "/images/card-city.png";
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs font-semibold text-ink leading-tight">
                Computer engineer
              </p>
              <p className="text-xs text-muted leading-tight mt-0.5">
                Original reality
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-surface border border-rule group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent flex items-center justify-center text-muted transition-colors">
              <ArrowRight size={12} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Card 2: Recent Exploration */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-card bg-card hover:bg-surface border border-rule hover:border-accent/40 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Crosshair size={13} className="text-accent" aria-hidden="true" />
              <span className="text-xs font-semibold text-ink">
                Recent exploration
              </span>
            </div>
            <span className="text-xs text-muted">
              2h ago
            </span>
          </div>

          <div className="w-full h-[84px] rounded-md overflow-hidden bg-paper relative border border-rule my-1">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=85"
              alt="Autonomous robotics engineering"
              className="w-full h-full object-cover brightness-90"
              onError={(e) => {
                e.currentTarget.src = "/images/card-station.png";
              }}
            />
          </div>

          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-xs font-semibold text-ink leading-tight">
                Mechanical engineer
              </p>
              <p className="text-xs text-muted leading-tight mt-0.5">
                Alternative reality
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-surface border border-rule group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent flex items-center justify-center text-muted transition-colors">
              <ArrowRight size={12} aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Card 3: Timeline Activity */}
        <div
          onClick={() => navigate("/explore")}
          className="rounded-card bg-card hover:bg-surface border border-rule hover:border-accent/40 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-colors relative overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Activity size={13} className="text-accent" aria-hidden="true" />
              <span className="text-xs font-semibold text-ink">
                Timeline activity
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 my-auto pl-1">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-ink text-xs font-medium">
                  Explored a new branch
                </span>
              </div>
              <span className="text-xs text-muted">
                2h ago
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-ink text-xs font-medium">
                  Created a universe
                </span>
              </div>
              <span className="text-xs text-muted">
                1d ago
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-ink text-xs font-medium">
                  Compared realities
                </span>
              </div>
              <span className="text-xs text-muted">
                2d ago
              </span>
            </div>
          </div>

          <div className="h-0.5" />
        </div>

        {/* Card 4: Upcoming Branches */}
        <div
          onClick={() => navigate("/create?decision=What+if+I+moved+to+Japan")}
          className="relative rounded-card bg-card hover:bg-surface border border-rule hover:border-accent/40 p-4 flex flex-col justify-between h-[190px] cursor-pointer group transition-colors overflow-hidden"
        >
          <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          <div className="absolute right-0 top-0 bottom-0 w-32 pointer-events-none select-none overflow-hidden">
            <img
              src="/images/card-japan.png"
              alt="Japan torii gate"
              className="w-full h-full object-cover object-right opacity-90"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=800&q=85";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-card via-card/60 to-transparent" />
          </div>

          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-accent" aria-hidden="true" />
              <span className="text-xs font-semibold text-ink">
                Upcoming branches
              </span>
            </div>
          </div>

          <div className="z-10 my-auto max-w-[170px]">
            <h4 className="text-xs sm:text-[13px] font-bold text-ink leading-tight">
              What if I moved to Japan?
            </h4>
            <p className="text-xs text-muted leading-relaxed mt-1 font-normal">
              Explore a new possibility from your robotics journey.
            </p>
          </div>

          <div className="flex items-center justify-end z-10">
            <div className="w-7 h-7 rounded-full bg-surface border border-rule group-hover:bg-accent group-hover:text-accent-ink group-hover:border-accent flex items-center justify-center text-muted transition-colors shadow-sm">
              <ArrowRight size={12} aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOTTOM STATUS FOOTER LINE */}
      <footer className="relative z-10 flex items-center justify-center gap-3 pt-4 pb-1 w-full text-center">
        <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-r from-transparent to-rule" />
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span>Step into another reality…</span>
        </div>
        <div className="h-[1px] w-12 sm:w-24 bg-gradient-to-l from-transparent to-rule" />
      </footer>
    </div>
  );
}
