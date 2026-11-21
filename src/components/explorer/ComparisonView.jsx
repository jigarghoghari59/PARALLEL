// src/components/explorer/ComparisonView.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Briefcase,
  Globe,
  Sparkles,
  ArrowLeftRight,
  MoreVertical,
  Check,
  Star,
  Layers,
  ChevronDown,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ComparisonView({
  universe,
  selectedCategory = "All",
  timeFilter = "All Time",
  onTimeFilterChange,
}) {
  const navigate = useNavigate();

  // State for swapping Reality A and B
  const [isSwapped, setIsSwapped] = useState(false);
  const [activeScrubber, setActiveScrubber] = useState(50); // percentage 0-100
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // 'A' | 'B' | null

  // Data for Reality A
  const defaultRealityA = {
    badge: "Reality A",
    badgeColor: "cyan",
    title: "Software Developer",
    subtitle: "Senior Software Developer • San Francisco, CA",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85",
    meta: [
      { icon: Calendar, label: "2026 - Present" },
      { icon: MapPin, label: "San Francisco, CA" },
      { icon: Briefcase, label: "Career" },
    ],
    keyEvents: [
      { title: "Started at Google", date: "Jul 2026", active: true },
      { title: "Got promoted to Senior Dev", date: "Jan 2027", active: true },
      { title: "Working on Gemini AI", date: "Present", active: true },
    ],
    realityId: universe?.realities?.[0]?.id || "real-software-dev",
  };

  // Data for Reality B
  const defaultRealityB = {
    badge: "Reality B",
    badgeColor: "purple",
    title: "Travel Photographer",
    subtitle: "Freelancer • Remote",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
    meta: [
      { icon: Calendar, label: "2026 - Present" },
      { icon: Globe, label: "Worldwide" },
      { icon: Briefcase, label: "Lifestyle" },
    ],
    keyEvents: [
      { title: "Started travel blogging", date: "Jun 2026", active: true },
      { title: "Published 100+ photos", date: "Dec 2026", active: true },
      { title: "Exploring Iceland", date: "Present", active: true },
    ],
    realityId: universe?.realities?.[1]?.id || "real-mechanical-eng",
  };

  const leftData = isSwapped ? defaultRealityB : defaultRealityA;
  const rightData = isSwapped ? defaultRealityA : defaultRealityB;

  const handleSwap = () => {
    setIsSwapped((prev) => !prev);
  };

  const timeOptions = ["All Time", "2026 - 2030", "Past 5 Years", "Milestones Only"];

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Top Header of View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-rule/50">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                <path d="M7 21h10" />
                <path d="M12 3v18" />
                <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Comparison view
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Compare different realities and explore what could have been.
          </p>
        </div>

        {/* Time Filter Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs font-medium text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Clock size={13} className="text-muted" aria-hidden="true" />
            <span>{timeFilter}</span>
            <ChevronDown
              size={12}
              className={`text-muted transition-transform duration-200 ${
                timeDropdownOpen ? "rotate-180" : ""
              }`}
              aria-hidden="true"
            />
          </button>

          {timeDropdownOpen && (
            <div className="absolute right-0 mt-1.5 w-44 rounded-xl bg-card border border-rule shadow-xl p-1.5 z-50">
              {timeOptions.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onTimeFilterChange?.(opt);
                    setTimeDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    timeFilter === opt
                      ? "bg-accent/15 text-accent"
                      : "text-muted hover:text-ink hover:bg-surface"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Row: Side-by-Side Comparison Cards + Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left & Middle: Two Reality Cards with Central VS divider (8 Cols) */}
        <div className="lg:col-span-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full relative">
            {/* Reality A Card (or Swapped) */}
            <motion.div
              layout
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card/90 backdrop-blur-sm border border-rule rounded-2xl p-5 flex flex-col justify-between hover:border-rule/80 transition-colors shadow-lg relative overflow-hidden group"
            >
              <div>
                {/* Top Header inside Card */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full text-xs font-medium border ${
                      leftData.badgeColor === "cyan"
                        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        : "bg-purple/15 text-purple border-purple/30"
                    }`}
                  >
                    {leftData.badge}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === "A" ? null : "A")}
                      className="w-7 h-7 rounded-lg hover:bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
                      aria-label="Reality options"
                    >
                      <MoreVertical size={14} aria-hidden="true" />
                    </button>

                    {activeMenu === "A" && (
                      <div className="absolute right-0 mt-1 w-40 bg-paper border border-rule rounded-xl shadow-xl p-1 z-30 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            navigate(`/universe/${universe?.id || "uni-computer-eng-01"}/reality/${leftData.realityId}`);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-ink hover:bg-surface cursor-pointer"
                        >
                          View Reality Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            navigate(`/simulate/${universe?.id || "uni-computer-eng-01"}/${leftData.realityId}`);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-ink hover:bg-surface cursor-pointer"
                        >
                          Simulate A Day
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-ink tracking-tight">
                  {leftData.title}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {leftData.subtitle}
                </p>

                {/* Card Image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-surface border border-rule/60 my-4">
                  <img
                    src={leftData.image}
                    alt={leftData.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Metadata Row */}
                <div className="space-y-2 text-xs text-muted mb-4">
                  {leftData.meta.map((m, idx) => {
                    const IconComp = m.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-muted">
                        <IconComp size={13} className="text-muted shrink-0" aria-hidden="true" />
                        <span>{m.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Key Events */}
                <div className="pt-3 border-t border-rule/60">
                  <h4 className="text-xs font-semibold text-ink mb-2">Key Events</h4>
                  <div className="space-y-2">
                    {leftData.keyEvents.map((evt, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              leftData.badgeColor === "cyan" ? "bg-cyan-400" : "bg-purple"
                            }`}
                          />
                          <span className="text-ink/90 font-medium">{evt.title}</span>
                        </div>
                        <span className="text-muted text-[11px] font-mono">{evt.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Central Circular "VS" Badge */}
            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-surface border border-rule/80 items-center justify-center text-[10px] font-bold text-muted pointer-events-none shadow-md">
              VS
            </div>

            {/* Reality B Card (or Swapped) */}
            <motion.div
              layout
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-card/90 backdrop-blur-sm border border-rule rounded-2xl p-5 flex flex-col justify-between hover:border-rule/80 transition-colors shadow-lg relative overflow-hidden group"
            >
              <div>
                {/* Top Header inside Card */}
                <div className="flex items-center justify-between mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full text-xs font-medium border ${
                      rightData.badgeColor === "cyan"
                        ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                        : "bg-purple/15 text-purple border-purple/30"
                    }`}
                  >
                    {rightData.badge}
                  </span>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setActiveMenu(activeMenu === "B" ? null : "B")}
                      className="w-7 h-7 rounded-lg hover:bg-surface flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer"
                      aria-label="Reality options"
                    >
                      <MoreVertical size={14} aria-hidden="true" />
                    </button>

                    {activeMenu === "B" && (
                      <div className="absolute right-0 mt-1 w-40 bg-paper border border-rule rounded-xl shadow-xl p-1 z-30 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            navigate(`/universe/${universe?.id || "uni-computer-eng-01"}/reality/${rightData.realityId}`);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-ink hover:bg-surface cursor-pointer"
                        >
                          View Reality Details
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenu(null);
                            navigate(`/simulate/${universe?.id || "uni-computer-eng-01"}/${rightData.realityId}`);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg text-ink hover:bg-surface cursor-pointer"
                        >
                          Simulate A Day
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-bold text-ink tracking-tight">
                  {rightData.title}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  {rightData.subtitle}
                </p>

                {/* Card Image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-surface border border-rule/60 my-4">
                  <img
                    src={rightData.image}
                    alt={rightData.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Metadata Row */}
                <div className="space-y-2 text-xs text-muted mb-4">
                  {rightData.meta.map((m, idx) => {
                    const IconComp = m.icon;
                    return (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-muted">
                        <IconComp size={13} className="text-muted shrink-0" aria-hidden="true" />
                        <span>{m.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Key Events */}
                <div className="pt-3 border-t border-rule/60">
                  <h4 className="text-xs font-semibold text-ink mb-2">Key Events</h4>
                  <div className="space-y-2">
                    {rightData.keyEvents.map((evt, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              rightData.badgeColor === "cyan" ? "bg-cyan-400" : "bg-purple"
                            }`}
                          />
                          <span className="text-ink/90 font-medium">{evt.title}</span>
                        </div>
                        <span className="text-muted text-[11px] font-mono">{evt.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Rightmost Column: Comparison Insights (4 Cols) */}
        <div className="lg:col-span-4 bg-card/90 backdrop-blur-sm border border-rule rounded-2xl p-5 flex flex-col justify-between shadow-lg">
          <div className="space-y-5">
            {/* Header: Sparkles + Title */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink mb-3">
                <Sparkles size={14} className="text-accent" aria-hidden="true" />
                <span>Comparison Insights</span>
              </div>

              {/* 3 Metrics: Realities, Similarities, Differences */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 px-1 rounded-xl bg-surface/60 border border-rule/50">
                <div>
                  <p className="text-lg font-bold text-ink">2</p>
                  <p className="text-[11px] text-muted">Realities</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-accent">70%</p>
                  <p className="text-[11px] text-muted">Similarities</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-purple">30%</p>
                  <p className="text-[11px] text-muted">Differences</p>
                </div>
              </div>
            </div>

            {/* Key Differences */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-2.5">
                <Layers size={13} className="text-accent" aria-hidden="true" />
                <span>Key Differences</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2.5 text-muted">
                  <Briefcase size={12} className="text-muted shrink-0" aria-hidden="true" />
                  <span>Career vs Lifestyle</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted">
                  <MapPin size={12} className="text-muted shrink-0" aria-hidden="true" />
                  <span>Location: San Francisco vs Worldwide</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted">
                  <Star size={12} className="text-muted shrink-0" aria-hidden="true" />
                  <span>Goals: Growth vs Freedom</span>
                </div>
              </div>
            </div>

            {/* Common Ground */}
            <div className="pt-3 border-t border-rule/60">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-2.5">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 h-3.5 text-accent"
                  aria-hidden="true"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <span>Common Ground</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted">
                  <Check size={12} className="text-accent shrink-0" aria-hidden="true" />
                  <span>Interest in Technology</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Check size={12} className="text-accent shrink-0" aria-hidden="true" />
                  <span>Love for Learning</span>
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Check size={12} className="text-accent shrink-0" aria-hidden="true" />
                  <span>Ambitious Mindset</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Button: Swap Realities */}
          <div className="pt-4 border-t border-rule/60 mt-4">
            <button
              type="button"
              onClick={handleSwap}
              className="w-full py-2.5 px-4 rounded-xl border border-rule hover:border-accent/50 bg-surface hover:bg-surface/80 text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ArrowLeftRight size={13} className="text-accent" aria-hidden="true" />
              <span>Swap Realities</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Timeline Scrubber */}
      <div className="w-full bg-card/60 border border-rule/60 rounded-xl px-5 py-3 flex items-center justify-between gap-4">
        <span className="text-xs font-mono font-medium text-muted">2026</span>

        {/* Timeline track with nodes */}
        <div className="relative flex-1 h-1.5 bg-surface rounded-full flex items-center mx-2">
          {/* Progress fill */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-400 to-purple rounded-full"
            style={{ width: `${activeScrubber}%` }}
          />

          {/* Interactive node: Jul 2026 (cyan) */}
          <button
            type="button"
            onClick={() => setActiveScrubber(30)}
            title="Jul 2026: Started at Google / Travel blogging"
            className="absolute left-[30%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-card shadow-sm cursor-pointer hover:scale-125 transition-transform"
          />

          {/* Interactive node: Dec 2026 (purple) */}
          <button
            type="button"
            onClick={() => setActiveScrubber(70)}
            title="Dec 2026: Published 100+ photos / Promoted"
            className="absolute left-[70%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-purple border-2 border-card shadow-sm cursor-pointer hover:scale-125 transition-transform"
          />
        </div>

        <span className="text-xs font-mono font-medium text-muted">Present</span>
      </div>
    </div>
  );
}
