// src/components/explorer/TimelineView.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Calendar,
  Briefcase,
  MapPin,
  ArrowRight,
  Maximize2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function TimelineView({
  universe,
  selectedCategory = "All",
  timeFilter = "All Time",
  onTimeFilterChange,
}) {
  const navigate = useNavigate();
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Selected event / reality on the right panel
  const [selectedMilestoneId, setSelectedMilestoneId] = useState("milestone-1");

  // Timeline events matching Image 3
  const milestones = [
    {
      id: "milestone-1",
      year: "2026",
      date: "Mar 2026",
      category: "Career",
      title: "Software Developer",
      description: "You chose to build a career in tech.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=85",
      panelData: {
        badge: "REALITY A",
        title: "Software Developer",
        subtitle: "A successful tech journey in the digital world.",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=85",
        meta: [
          { icon: Calendar, label: "2026 - Present" },
          { icon: Briefcase, label: "Career" },
          { icon: MapPin, label: "Remote" },
        ],
        stats: { events: 4, branches: 2, successRate: "95%" },
        keyEvents: [
          "Started coding in college",
          "Built first major project",
          "Got placed at a top tech company",
        ],
        realityId: "real-software-dev",
      },
    },
    {
      id: "milestone-2",
      year: "2027",
      date: "Jul 2027",
      category: "Lifestyle",
      title: "Travel the World",
      description: "You started exploring the world.",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85",
      panelData: {
        badge: "BRANCH B",
        title: "Global Nomad",
        subtitle: "A journey of discovery through continents and cultures.",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85",
        meta: [
          { icon: Calendar, label: "2027 - Present" },
          { icon: Briefcase, label: "Lifestyle" },
          { icon: MapPin, label: "Worldwide" },
        ],
        stats: { events: 6, branches: 3, successRate: "92%" },
        keyEvents: [
          "Published alpine photo collection",
          "Reached 50k expedition readers",
          "Established remote creative studio",
        ],
        realityId: "real-mechanical-eng",
      },
    },
    {
      id: "milestone-3",
      year: "2027",
      date: "Jan 2027",
      category: "Education",
      title: "Start a Company",
      description: "You founded your own tech company.",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=85",
      panelData: {
        badge: "VENTURE PATH",
        title: "Tech Entrepreneur",
        subtitle: "Pioneering intelligent software systems for global markets.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1000&q=85",
        meta: [
          { icon: Calendar, label: "2027 - Present" },
          { icon: Briefcase, label: "Venture" },
          { icon: MapPin, label: "San Francisco" },
        ],
        stats: { events: 5, branches: 2, successRate: "88%" },
        keyEvents: [
          "Incorporated cloud platform",
          "Raised angel seed funding",
          "Built foundational engineering team",
        ],
        realityId: "real-product-manager",
      },
    },
    {
      id: "milestone-4",
      year: "2028",
      date: "Oct 2028",
      category: "Personal",
      title: "Better Health",
      description: "You focused on your health and wellness.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85",
      panelData: {
        badge: "WELLNESS VECTOR",
        title: "Holistic Wellness",
        subtitle: "Cultivating balance, longevity, and peaceful daily life.",
        image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85",
        meta: [
          { icon: Calendar, label: "2028 - Present" },
          { icon: Briefcase, label: "Lifestyle" },
          { icon: MapPin, label: "Alps & Coastal" },
        ],
        stats: { events: 4, branches: 1, successRate: "98%" },
        keyEvents: [
          "Adopted restorative physical routine",
          "Balanced professional and personal time",
          "Reached peak physical vitality",
        ],
        realityId: "real-software-dev",
      },
    },
  ];

  // Filter milestones by category if selected
  const filteredMilestones = milestones.filter((m) => {
    if (!selectedCategory || selectedCategory === "All") return true;
    return m.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const activeMilestone =
    milestones.find((m) => m.id === selectedMilestoneId) || milestones[0];
  const activePanel = activeMilestone.panelData;
  const timeOptions = ["All Time", "2026 - 2030", "Past 5 Years", "Milestones Only"];

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-rule/50">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent">
              <Clock size={16} aria-hidden="true" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
              Timeline
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Explore the journey of your alternate realities through time.
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

      {/* Main Grid: Vertical Timeline (7-8 cols) + Detail Panel (4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Vertical Timeline Track & Cards (8 Cols) */}
        <div className="lg:col-span-8 bg-card/80 backdrop-blur-sm border border-rule rounded-2xl p-5 sm:p-7 relative shadow-lg">
          <div className="relative pl-16 sm:pl-24">
            {/* Vertical Spine Line */}
            <div className="absolute left-[39px] sm:left-[55px] top-4 bottom-8 w-[1.5px] bg-gradient-to-b from-accent/80 via-white/20 to-purple" />

            {/* Milestones List */}
            <div className="space-y-6">
              {filteredMilestones.map((m) => {
                const isSelected = selectedMilestoneId === m.id;

                return (
                  <div key={m.id} className="relative flex items-center">
                    {/* Left Year Label & Spine Node */}
                    <div className="absolute -left-16 sm:-left-24 flex items-center gap-2">
                      <span className="text-xs font-semibold text-muted font-mono tracking-tight">
                        • {m.year}
                      </span>
                    </div>

                    {/* Circular Node on Spine */}
                    <div
                      className={`absolute -left-[30px] sm:-left-[46px] w-4 h-4 rounded-full border-2 border-card flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-accent shadow-[0_0_10px_rgba(200,233,169,0.8)] scale-110"
                          : "bg-surface hover:bg-accent/50"
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-paper" />
                    </div>

                    {/* Milestone Card */}
                    <motion.button
                      layout
                      type="button"
                      onClick={() => setSelectedMilestoneId(m.id)}
                      className={`w-full text-left p-3.5 sm:p-4 rounded-xl border bg-surface/90 backdrop-blur-sm flex items-center justify-between gap-4 transition-all cursor-pointer group shadow-sm ${
                        isSelected
                          ? "border-accent ring-1 ring-accent shadow-[0_0_18px_rgba(200,233,169,0.18)]"
                          : "border-rule hover:border-rule/80 hover:bg-surface"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-paper shrink-0 border border-rule/50">
                          <img
                            src={m.image}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Text */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-semibold text-accent">
                              {m.category}
                            </span>
                            <span className="text-[11px] text-muted font-mono">
                              {m.date}
                            </span>
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-ink truncate leading-tight">
                            {m.title}
                          </h4>
                          <p className="text-xs text-muted truncate mt-0.5">
                            {m.description}
                          </p>
                        </div>
                      </div>

                      {/* Right Circle Arrow Button */}
                      <div
                        className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "bg-accent text-accent-ink border-accent"
                            : "bg-paper border-rule text-muted group-hover:text-ink group-hover:border-accent/40"
                        }`}
                      >
                        <ArrowRight size={13} aria-hidden="true" />
                      </div>
                    </motion.button>
                  </div>
                );
              })}

              {/* End of Timeline marker */}
              <div className="relative flex items-center pt-2">
                {/* Purple Glowing Star / Sparkle Node */}
                <div className="absolute -left-[32px] sm:-left-[48px] w-6 h-6 rounded-full bg-purple/20 border border-purple flex items-center justify-center text-purple shadow-[0_0_12px_rgba(150,120,201,0.5)]">
                  <Sparkles size={11} aria-hidden="true" />
                </div>

                <div className="p-3 rounded-xl border border-rule/60 bg-surface/50 w-full">
                  <p className="text-xs font-bold text-ink">End of Timeline</p>
                  <p className="text-[11px] text-muted">This is the current branch.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Detail Panel matching Image 3 (4 Cols) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMilestone.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:col-span-4 bg-card/90 backdrop-blur-sm border border-rule rounded-2xl p-5 flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Large Image Preview with Astronaut visual & Expand button */}
              <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface border border-rule/60 mb-4 group">
                <img
                  src={activePanel.image}
                  alt={activePanel.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="absolute top-2.5 right-2.5 w-7 h-7 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                  aria-label="Expand preview"
                >
                  <Maximize2 size={13} aria-hidden="true" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent pointer-events-none" />
              </div>

              {/* REALITY A Badge (Purple/Indigo pill) */}
              <div className="mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-0.8 rounded-full text-xs font-semibold bg-purple/15 text-purple border border-purple/40">
                  {activePanel.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-bold text-ink tracking-tight">
                {activePanel.title}
              </h3>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {activePanel.subtitle}
              </p>

              {/* Meta Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted py-3 my-2 border-y border-rule/50">
                {activePanel.meta.map((m, idx) => {
                  const Icon = m.icon;
                  return (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-muted">
                      <Icon size={12} className="text-muted" aria-hidden="true" />
                      <span>{m.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Timeline Summary 3-Column Stats */}
              <div className="py-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <Sparkles size={13} className="text-accent" aria-hidden="true" />
                  <span>Timeline Summary</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center py-2 px-1 rounded-xl bg-surface/60 border border-rule/50">
                  <div>
                    <p className="text-base font-bold text-ink">{activePanel.stats.events}</p>
                    <p className="text-[11px] text-muted">Events</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-ink">{activePanel.stats.branches}</p>
                    <p className="text-[11px] text-muted">Branches</p>
                  </div>
                  <div>
                    <p className="text-base font-bold text-accent">{activePanel.stats.successRate}</p>
                    <p className="text-[11px] text-muted">Success Rate</p>
                  </div>
                </div>
              </div>

              {/* Key Events List */}
              <div className="pt-3 border-t border-rule/50 mt-2 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>Key Events</span>
                </div>
                <div className="space-y-1.5 pl-1">
                  {activePanel.keyEvents.map((evt, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                      <span>{evt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Button: View Full Details */}
            <div className="pt-4 border-t border-rule/60 mt-4">
              <button
                type="button"
                onClick={() => {
                  navigate(
                    `/universe/${universe?.id || "uni-computer-eng-01"}/reality/${activePanel.realityId}`
                  );
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-rule hover:border-accent/50 bg-surface hover:bg-surface/80 text-xs font-semibold text-ink flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-focus"
              >
                <span>View Full Details</span>
                <ArrowRight size={13} className="text-accent" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Full Preview Modal */}
      {previewModalOpen && (
        <div
          onClick={() => setPreviewModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-2xl overflow-hidden border border-rule bg-card p-2"
          >
            <img
              src={activePanel.image}
              alt={activePanel.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
