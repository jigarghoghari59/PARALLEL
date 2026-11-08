// src/pages/TimelineDetails.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  GraduationCap,
  Settings,
  Building2,
  Trophy,
  Rocket,
  Briefcase,
  Sparkles,
  Code2,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Play,
  Scale,
  GitBranch,
  ChevronRight,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { BranchModal } from "../components/timeline/BranchModal";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

// Helper to choose event icon based on category/index
function getEventIcon(category, index) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("milestone") || cat.includes("education") || index === 0) {
    return <GraduationCap size={16} className="text-[#F2F3F0]" />;
  }
  if (cat.includes("growth") || cat.includes("skill") || cat.includes("tech")) {
    return <Settings size={16} className="text-[#F2F3F0]" />;
  }
  if (cat.includes("career") || cat.includes("work") || cat.includes("startup")) {
    return <Building2 size={16} className="text-[#F2F3F0]" />;
  }
  if (cat.includes("achievement") || cat.includes("lead") || cat.includes("award")) {
    return <Trophy size={16} className="text-[#F2F3F0]" />;
  }
  if (cat.includes("legacy") || cat.includes("global") || cat.includes("impact")) {
    return <Rocket size={16} className="text-[#F2F3F0]" />;
  }
  return <Sparkles size={16} className="text-[#F2F3F0]" />;
}

export default function TimelineDetails() {
  const { universeId, realityId } = useParams();
  const navigate = useNavigate();
  const { universes } = useUniverse();

  // Find universe
  const universe = useMemo(() => {
    if (universeId) {
      const found = universes.find((u) => u.id === universeId);
      if (found) return found;
    }
    return universes[0] || null;
  }, [universeId, universes]);

  // Find reality
  const reality = useMemo(() => {
    if (!universe || !universe.realities) return null;
    if (realityId) {
      const found = universe.realities.find((r) => r.id === realityId);
      if (found) return found;
    }
    // Default to second reality if available (e.g. Reality B) or first
    return universe.realities[1] || universe.realities[0] || null;
  }, [universe, realityId]);

  const realityIndex = useMemo(() => {
    if (!universe?.realities || !reality) return 1;
    const idx = universe.realities.findIndex((r) => r.id === reality.id);
    return idx >= 0 ? idx : 1;
  }, [universe, reality]);

  const letterBadge = LETTERS[realityIndex] || "B";

  // State for expanded event cards
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [selectedEventForBranch, setSelectedEventForBranch] = useState(null);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  // Reality events sorted by year
  const events = useMemo(() => {
    if (!reality?.events) return [];
    return [...reality.events].sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [reality]);

  // Default expansion to first event if none selected
  const activeExpandedId =
    expandedEventId !== null
      ? expandedEventId
      : events.length > 0
      ? events[0].id
      : null;

  const toggleEventExpand = (id) => {
    setExpandedEventId((curr) => (curr === id ? null : id));
  };

  const handleOpenBranchModal = (event) => {
    setSelectedEventForBranch(event);
    setBranchModalOpen(true);
  };

  const handleBranchSuccess = (childReality) => {
    // Navigate back to Explorer with this newly spawned node focused
    if (universe?.id) {
      navigate(`/explore/${universe.id}`, {
        state: { focusedRealityId: childReality.id },
      });
    }
  };

  if (!universe || !reality) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] flex items-center justify-center p-6">
        <div className="bg-[#0B0D0E] border border-[#292C2C] rounded-2xl p-8 max-w-md text-center shadow-2xl">
          <AlertTriangle size={32} className="text-[#C8E9A9] mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Reality Not Found</h2>
          <p className="text-xs text-[#A5A7A3] mb-6">
            The requested alternate timeline could not be located in local storage.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs shadow-lg hover:bg-[#d8f5be] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  // Derive unique reality insights
  const skillsList =
    Array.isArray(reality.skills) && reality.skills.length > 0
      ? reality.skills.join(", ")
      : "Robotics, AI, Engineering";

  const opportunitiesList =
    Array.isArray(reality.opportunities) && reality.opportunities.length > 0
      ? reality.opportunities.join(", ")
      : "Research, Startups, Innovation";

  const challengesList =
    Array.isArray(reality.challenges) && reality.challenges.length > 0
      ? reality.challenges.join(", ")
      : "High Technical Demands";

  const outcomeText = reality.outcome || "A Pioneer in Robotics Field";

  const uniqueInsightText =
    reality.summary ||
    "You're not just a developer — you're a pioneer in building intelligent machines.";

  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] overflow-x-hidden select-none pb-12">
      {/* Background Celestial Orbit & Distant Moon */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle orbital path arc running through top right */}
        <svg
          className="absolute -top-12 -right-20 w-[850px] h-[550px] opacity-40"
          viewBox="0 0 850 550"
          fill="none"
        >
          <ellipse
            cx="480"
            cy="180"
            rx="360"
            ry="200"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
            strokeDasharray="4 4"
            transform="rotate(-12 480 180)"
          />
        </svg>

        {/* Small orbital moon along the arc */}
        <div className="absolute top-16 right-[38%] w-6 h-6 rounded-full bg-gradient-to-tr from-zinc-900 via-zinc-700 to-zinc-400 shadow-[0_0_15px_rgba(255,255,255,0.15)] opacity-85 border border-white/20" />

        {/* Distant stars */}
        <div className="absolute top-10 left-[18%] w-1 h-1 bg-white rounded-full opacity-60" />
        <div className="absolute top-36 left-[48%] w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-40" />
        <div className="absolute top-28 right-[12%] w-1 h-1 bg-white rounded-full opacity-50" />
      </div>

      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
        {/* TOP HEADER CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          {/* Left: Back to Explorer & Title */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to={universeId ? `/explore/${universeId}` : "/explore"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B0D0E]/90 hover:bg-[#141618] border border-[#292C2C] hover:border-[#3d4040] text-xs text-[#F2F3F0] transition-all shadow-md group"
            >
              <ArrowLeft
                size={13}
                className="text-[#A5A7A3] group-hover:text-[#F2F3F0] transition-colors"
              />
              <span>Back to Explorer</span>
            </Link>

            {/* Vertical sage accent bar + Title */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-9 rounded-full bg-[#C8E9A9] shadow-[0_0_10px_#C8E9A9]" />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-tight leading-none">
                  Timeline Details
                </h1>
                <p className="text-[11px] text-[#A5A7A3] mt-1 font-medium">
                  A complete journey of your alternate reality
                </p>
              </div>
            </div>
          </div>

          {/* Right: View as Timeline Selector */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-[#A5A7A3] font-medium">View as</span>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0D0E] border border-[#292C2C] text-xs font-semibold text-[#F2F3F0] shadow-sm">
              <span>Timeline</span>
              <ChevronDown size={13} className="text-[#A5A7A3]" />
            </div>
          </div>
        </div>

        {/* 3-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: REALITY OVERVIEW CARD (3 Cols)              */}
          {/* ======================================================== */}
          <div className="lg:col-span-3">
            <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-2xl p-5 shadow-2xl relative flex flex-col justify-between backdrop-blur-md">
              {/* Top Planet Visual */}
              <div className="relative w-full h-44 rounded-xl overflow-hidden bg-black/80 border border-white/5 mb-4 group">
                <img
                  src={
                    reality.image ||
                    "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=700&q=80"
                  }
                  alt={reality.name}
                  className="w-full h-full object-cover brightness-[0.8] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-transparent" />
              </div>

              {/* Pill Badge */}
              <div className="inline-block px-3 py-0.5 rounded-full bg-[#141a15] border border-[#C8E9A9]/30 text-[#C8E9A9] text-[10px] font-bold tracking-wider uppercase mb-2.5 w-fit">
                REALITY {letterBadge}
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
                {reality.name || "Mechanical Engineering"}
              </h2>
              <p className="text-xs text-[#A5A7A3] mt-1 leading-relaxed line-clamp-2">
                {reality.summary || "A different path, a different you."}
              </p>

              {/* Attributes List with Icons */}
              <div className="space-y-3.5 my-5 pt-3 border-t border-[#292C2C]/50">
                {/* Career Path */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] shrink-0">
                    <Briefcase size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                      Career Path
                    </div>
                    <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {reality.career || "Robotics Engineer"}
                    </div>
                  </div>
                </div>

                {/* Skills Gained */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] shrink-0">
                    <GraduationCap size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                      Skills Gained
                    </div>
                    <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {Array.isArray(reality.skills)
                        ? reality.skills.slice(0, 3).join(", ")
                        : "Mechanical Design, AI"}
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] shrink-0">
                    <Building2 size={14} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                      Industry
                    </div>
                    <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {reality.industry || "Automation"}
                    </div>
                  </div>
                </div>

                {/* Overall Outlook */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/[0.03] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] shrink-0">
                    <Sparkles size={14} className="text-[#C8E9A9]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                      Overall Outlook
                    </div>
                    <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5">
                      {outcomeText}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() =>
                    navigate(`/simulate/${universe.id}/${reality.id}`)
                  }
                  className="w-full py-2.5 rounded-full bg-[#0B0D0E] hover:bg-[#151817] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs font-semibold text-[#F2F3F0] flex items-center justify-center gap-2 transition-all shadow-md group"
                >
                  <Play
                    size={11}
                    className="fill-current text-[#C8E9A9] group-hover:scale-110 transition-transform"
                  />
                  <span>Explore This Reality</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      navigate(`/simulate/${universe.id}/${reality.id}`)
                    }
                    className="py-1.5 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-[#292C2C] text-[11px] text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
                  >
                    Experience Day
                  </button>
                  <button
                    onClick={() => navigate("/compare")}
                    className="py-1.5 rounded-full bg-white/[0.02] hover:bg-white/[0.05] border border-[#292C2C] text-[11px] text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
                  >
                    Compare Realities
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: VERTICAL CONNECTED TIMELINE PATH (5 Cols) */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 relative">
            <div className="relative pl-2 sm:pl-4 space-y-6">
              {/* Continuous vertical timeline connector line */}
              <div className="absolute top-6 bottom-6 left-[88px] sm:left-[98px] w-[2px] bg-gradient-to-b from-[#C8E9A9] via-[#C8E9A9] to-[#C8E9A9]/30 pointer-events-none z-0" />

              {events.map((evt, idx) => {
                const isExpanded = activeExpandedId === evt.id;

                return (
                  <div
                    key={evt.id || idx}
                    className="relative z-10 flex items-start gap-3 sm:gap-4 group"
                  >
                    {/* Left: Year and Age */}
                    <div className="w-16 sm:w-18 pt-2.5 text-right shrink-0">
                      <div className="text-sm sm:text-base font-extrabold text-[#F2F3F0] tracking-tight group-hover:text-[#C8E9A9] transition-colors">
                        {evt.year}
                      </div>
                      {evt.age && (
                        <div className="text-[11px] text-[#A5A7A3] font-medium">
                          Age {evt.age}
                        </div>
                      )}
                    </div>

                    {/* Timeline Node Icon Circle on the vertical path */}
                    <div className="relative pt-2 shrink-0">
                      {/* Sage glow indicator dot */}
                      <span className="absolute -left-1.5 top-5 w-2 h-2 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />

                      {/* Circular icon node container */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0B0D0E] border border-[#292C2C] group-hover:border-[#C8E9A9]/60 flex items-center justify-center text-[#F2F3F0] shadow-xl transition-all">
                        {getEventIcon(evt.category, idx)}
                      </div>
                    </div>

                    {/* Right: Event Card Container */}
                    <div
                      onClick={() => toggleEventExpand(evt.id)}
                      className={`flex-1 bg-[#0B0D0E]/85 border rounded-2xl p-4 sm:p-5 transition-all duration-300 shadow-xl cursor-pointer ${
                        isExpanded
                          ? "border-[#C8E9A9]/60 bg-[#0E1110] shadow-[0_0_20px_rgba(200,233,169,0.12)]"
                          : "border-[#292C2C] hover:border-[#3d4040] hover:bg-[#101214]"
                      }`}
                    >
                      {/* Event Header: Title & Category Pill */}
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xs sm:text-sm font-bold text-[#F2F3F0] leading-snug group-hover:text-white transition-colors">
                          {evt.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#141a15] border border-[#C8E9A9]/20 text-[#C8E9A9] text-[10px] font-medium tracking-wide shrink-0">
                          {evt.category || "Milestone"}
                        </span>
                      </div>

                      {/* Event Description */}
                      <p className="text-xs text-[#A5A7A3] mt-1.5 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Expandable Details Container */}
                      {isExpanded && (
                        <div
                          className="mt-4 pt-3.5 border-t border-[#292C2C]/60 space-y-3.5 animate-in fade-in duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Skills Chips */}
                          {Array.isArray(evt.skills) && evt.skills.length > 0 && (
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-[#A5A7A3] mb-1.5">
                                Skills Acquired:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {evt.skills.map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-[#292C2C] text-[10px] text-[#F2F3F0]"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Opportunities & Challenges in 2 mini cols */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {evt.opportunities && evt.opportunities.length > 0 && (
                              <div className="bg-[#08090A] p-2.5 rounded-xl border border-[#292C2C]/50">
                                <span className="text-[10px] font-bold text-[#C8E9A9] uppercase block mb-1">
                                  Opportunities
                                </span>
                                <span className="text-[#A5A7A3] text-[11px] leading-relaxed">
                                  {Array.isArray(evt.opportunities)
                                    ? evt.opportunities.join(", ")
                                    : evt.opportunities}
                                </span>
                              </div>
                            )}

                            {evt.challenges && evt.challenges.length > 0 && (
                              <div className="bg-[#08090A] p-2.5 rounded-xl border border-[#292C2C]/50">
                                <span className="text-[10px] font-bold text-amber-400/90 uppercase block mb-1">
                                  Challenges
                                </span>
                                <span className="text-[#A5A7A3] text-[11px] leading-relaxed">
                                  {Array.isArray(evt.challenges)
                                    ? evt.challenges.join(", ")
                                    : evt.challenges}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Long term consequences */}
                          {evt.consequences && (
                            <div className="text-[11px] text-[#A5A7A3] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                              <span className="font-semibold text-[#F2F3F0]">
                                Impact / Consequence:{" "}
                              </span>
                              {evt.consequences}
                            </div>
                          )}

                          {/* "Create branch from this event" Button */}
                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-[10px] text-[#A5A7A3] italic">
                              Speculative scenario
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenBranchModal(evt)}
                              className="px-3.5 py-1.5 rounded-full bg-[#141d16] hover:bg-[#1a291e] border border-[#C8E9A9]/40 hover:border-[#C8E9A9] text-[#C8E9A9] text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(200,233,169,0.15)] group/btn"
                            >
                              <GitBranch
                                size={13}
                                className="group-hover/btn:rotate-45 transition-transform"
                              />
                              <span>Create branch from this event</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: KEY INSIGHTS & MEDIA (4 Cols)              */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 space-y-4">
            {/* Top Robotics Factory Media Banner */}
            <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-[#292C2C] bg-black/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80"
                alt="Robotics Lab"
                className="w-full h-full object-cover brightness-[0.75] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-black/20" />
            </div>

            {/* Section Heading: Key Insights */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2F3F0] tracking-wide pt-1">
              <Sparkles size={13} className="text-[#C8E9A9]" />
              <span>Key Insights</span>
            </div>

            {/* 2x2 Grid of Insight Cards */}
            <div className="grid grid-cols-2 gap-3">
              {/* Card 1: Skills */}
              <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
                <div className="text-[#C8E9A9] mb-2">
                  <Code2 size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                    Skills
                  </div>
                  <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5 line-clamp-2">
                    {skillsList}
                  </div>
                </div>
              </div>

              {/* Card 2: Opportunities */}
              <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
                <div className="text-[#C8E9A9] mb-2">
                  <Briefcase size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                    Opportunities
                  </div>
                  <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5 line-clamp-2">
                    {opportunitiesList}
                  </div>
                </div>
              </div>

              {/* Card 3: Challenges */}
              <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
                <div className="text-[#C8E9A9] mb-2">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                    Challenges
                  </div>
                  <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5 line-clamp-2">
                    {challengesList}
                  </div>
                </div>
              </div>

              {/* Card 4: Outcome */}
              <div className="bg-[#0B0D0E]/90 border border-[#292C2C] rounded-xl p-3.5 shadow-lg flex flex-col justify-between">
                <div className="text-[#C8E9A9] mb-2">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                    Outcome
                  </div>
                  <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5 line-clamp-2">
                    {outcomeText}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: What Makes This Reality Unique? */}
            <div className="relative bg-[#0B0D0E]/90 border border-[#292C2C] rounded-xl p-4 shadow-xl overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#141a15] border border-[#C8E9A9]/20 flex items-center justify-center text-[#C8E9A9] shrink-0 mt-0.5">
                  <Lightbulb size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#F2F3F0]">
                    What Makes This Reality Unique?
                  </h4>
                  <p className="text-xs text-[#A5A7A3] mt-1 leading-relaxed">
                    {uniqueInsightText}
                  </p>
                </div>
              </div>

              {/* Subtle Cosmic sphere at lower right */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-[radial-gradient(circle_at_30%_30%,_#1f2923_0%,_#0B0D0E_70%)] border border-white/5 opacity-80 pointer-events-none" />
            </div>

            {/* Speculative fiction notice */}
            <div className="text-[10px] text-[#A5A7A3]/70 text-center pt-2">
              All scenarios are illustrative speculative fiction generated by AI.
            </div>
          </div>
        </div>
      </div>

      {/* Branch Modal for Event Branching */}
      {universe && (
        <BranchModal
          open={branchModalOpen}
          onClose={() => setBranchModalOpen(false)}
          universe={universe}
          initialReality={reality}
          initialEvent={selectedEventForBranch}
          onSuccess={handleBranchSuccess}
        />
      )}
    </div>
  );
}
