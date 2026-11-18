// src/pages/Simulate.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  RefreshCw,
  Sun,
  Briefcase,
  Code2,
  Dumbbell,
  Moon,
  Coffee,
  CheckCircle2,
  Trophy,
  ArrowRight,
  GraduationCap,
  Building2,
  Lightbulb,
  AlertTriangle,
  Clock,
  Quote,
  Compass,
  Layers,
  Play,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { api } from "../services/apiClient";

const DEFAULT_TIMELINE_IMAGES = {
  morning: "https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=600&q=85",
  work: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=85",
  decision: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=85",
  fitness: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=85",
  night: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=85",
};

// Helper to choose appropriate entry icon
function getTimelineIcon(timeStr = "", title = "", iconType = "") {
  const normalized = `${timeStr} ${title} ${iconType}`.toLowerCase();
  if (normalized.includes("sun") || normalized.includes("morning") || normalized.includes("07:") || normalized.includes("08:")) {
    return <Sun size={15} className="text-amber-300" />;
  }
  if (normalized.includes("briefcase") || normalized.includes("work") || normalized.includes("lab") || normalized.includes("10:") || normalized.includes("11:")) {
    return <Briefcase size={15} className="text-[#C8E9A9]" />;
  }
  if (normalized.includes("code") || normalized.includes("decision") || normalized.includes("terminal") || normalized.includes("meeting") || normalized.includes("02:")) {
    return <Code2 size={15} className="text-cyan-300" />;
  }
  if (normalized.includes("dumbbell") || normalized.includes("gym") || normalized.includes("fitness") || normalized.includes("personal") || normalized.includes("07:00 pm")) {
    return <Dumbbell size={15} className="text-[#9678C9]" />;
  }
  if (normalized.includes("moon") || normalized.includes("night") || normalized.includes("end") || normalized.includes("sleep") || normalized.includes("11:")) {
    return <Moon size={15} className="text-indigo-300" />;
  }
  return <Activity size={15} className="text-[#C8E9A9]" />;
}

export default function Simulate() {
  const { universeId, realityId } = useParams();
  const navigate = useNavigate();
  const { universes, addSimulation } = useUniverse();

  // Find universe and reality
  const universe = useMemo(() => {
    if (universeId) {
      const found = universes.find((u) => u.id === universeId);
      if (found) return found;
    }
    return universes[0] || null;
  }, [universeId, universes]);

  const reality = useMemo(() => {
    if (!universe?.realities) return null;
    if (realityId) {
      const found = universe.realities.find((r) => r.id === realityId);
      if (found) return found;
    }
    return (
      universe.realities.find((r) => r.id === "real-mechanical-eng") ||
      universe.realities[1] ||
      universe.realities[0] ||
      null
    );
  }, [universe, realityId]);

  const simulations = useMemo(() => {
    return reality?.simulations || [];
  }, [reality]);

  // Active simulation index (0 is latest)
  const [activeSimIndex, setActiveSimIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Active simulation object
  const currentSimulation = simulations[activeSimIndex] || simulations[0] || null;

  // Handle generating a new day simulation
  const handleGenerateDay = useCallback(async () => {
    if (!universe || !reality) return;

    setLoading(true);
    setError(null);

    try {
      const payload = {
        universeId: universe.id,
        realityId: reality.id,
        reality: {
          name: reality.name,
          career: reality.career || "Professional",
          industry: reality.industry || "General",
          location: reality.location || "Earth",
          summary: reality.summary || "",
        },
      };

      const res = await api.simulateDay(payload);
      const generated = res?.simulation;

      if (!generated || !generated.entries) {
        throw new Error("Invalid simulation received from AI engine.");
      }

      // Add day label & enrich entries with default visuals if missing
      const enrichedSim = {
        id: `sim-${Date.now()}`,
        dayLabel: `Day ${simulations.length + 1}`,
        overview: {
          career: generated.overview.career || reality.career,
          location: generated.overview.location || reality.location,
          lifestyle: generated.overview.lifestyle || "Balanced & Active",
          happiness: generated.overview.happiness || "92%",
          quote: "Sometimes, a different choice leads to a happier you.",
          highlights: generated.overview.highlights?.length
            ? generated.overview.highlights
            : [
                "Led a successful robotics project",
                "Traveled to Japan for research",
                "Maintained a healthy lifestyle",
              ],
        },
        entries: (generated.entries || []).map((entry, idx) => {
          let fallbackImg = DEFAULT_TIMELINE_IMAGES.work;
          if (idx === 0) fallbackImg = DEFAULT_TIMELINE_IMAGES.morning;
          if (idx === 1) fallbackImg = DEFAULT_TIMELINE_IMAGES.work;
          if (idx === 2) fallbackImg = DEFAULT_TIMELINE_IMAGES.decision;
          if (idx === 3) fallbackImg = DEFAULT_TIMELINE_IMAGES.fitness;
          if (idx >= 4) fallbackImg = DEFAULT_TIMELINE_IMAGES.night;

          return {
            time: entry.time,
            title: entry.title,
            description: entry.description,
            experience: entry.experience || "",
            important: Boolean(entry.important),
            image: entry.image || fallbackImg,
          };
        }),
      };

      addSimulation(universe.id, reality.id, enrichedSim);
      setActiveSimIndex(0);
      setLoading(false);
    } catch (err) {
      console.error("[SimulateDay] Error generating day:", err);
      setError(
        err.message ||
          "Failed to simulate a day in this universe. Please check backend connection and retry."
      );
      setLoading(false);
    }
  }, [universe, reality, simulations, addSimulation]);

  if (!universe || !reality) {
    return (
      <div className="min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] flex items-center justify-center p-6">
        <div className="bg-[#0E1114] border border-white/[0.08] rounded-xl p-8 max-w-md text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8E9A9]/40 to-transparent pointer-events-none" />
          <AlertTriangle size={32} className="text-[#C8E9A9] mx-auto mb-3" />
          <h2 className="text-xl font-bold mb-2">Reality Not Found</h2>
          <p className="text-xs text-[#A5A7A3] mb-6">
            The requested universe or reality could not be resolved.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#C8E9A9] hover:bg-[#d5f5b7] text-[#050505] font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Explorer
          </Link>
        </div>
      </div>
    );
  }

  // Active overview metrics
  const overview = currentSimulation?.overview || {
    career: reality.career || "Robotics Engineer",
    location: reality.location || "Bangalore, India",
    lifestyle: "Balanced & Active",
    happiness: "92%",
    quote: "Sometimes, a different choice leads to a happier you.",
    highlights: [
      "Led a successful robotics project",
      "Traveled to Japan for research",
      "Maintained a healthy lifestyle",
    ],
  };

  const timelineEntries = currentSimulation?.entries || [];

  return (
    <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
      {/* Top Header matching Landing Page */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1114] border border-white/[0.08] w-fit mb-3 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2F3F0]">
              Quantum Day Simulation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#F2F3F0] tracking-tight leading-none">
            A DAY IN YOUR ALTERNATE REALITY
          </h1>
          <p className="text-xs sm:text-sm text-[#A5A7A3] font-normal mt-2">
            Experience morning routines, work decisions, and personal life milestones projected for this timeline.
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Day Switcher (if multiple days saved) */}
          {simulations.length > 1 && (
            <div className="flex items-center gap-1 bg-[#0E1114] border border-white/[0.08] p-1 shadow-sm rounded-full">
              {simulations.map((sim, sIdx) => (
                <button
                  key={sim.id || sIdx}
                  onClick={() => setActiveSimIndex(sIdx)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                    activeSimIndex === sIdx
                      ? "bg-[#C8E9A9] text-[#050505] shadow-[0_0_10px_rgba(200,233,169,0.35)] font-bold"
                      : "text-[#A5A7A3] hover:text-[#F2F3F0]"
                  }`}
                >
                  {sim.dayLabel || `Day ${sIdx + 1}`}
                </button>
              ))}
            </div>
          )}

          {/* Generate New Day Button */}
          <button
            onClick={handleGenerateDay}
            disabled={loading}
            className="px-4 py-2 rounded-full bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-white/20 text-xs font-semibold text-[#F2F3F0] flex items-center gap-2 transition-all shadow-md group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95"
          >
            <RefreshCw
              size={13}
              className={`text-[#C8E9A9] ${
                loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"
              }`}
            />
            <span>{loading ? "Simulating Day..." : "Generate New Day"}</span>
          </button>

          <Link
            to={`/explore/${universe.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0E1114] border border-white/[0.08] hover:border-white/20 text-xs text-[#F2F3F0] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={13} className="text-[#C8E9A9]" />
            <span>Back to Explorer</span>
          </Link>
        </div>
      </div>

        {/* ======================================================== */}
        {/* 3-COLUMN MAIN LAYOUT                                     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* LEFT COLUMN: REALITY CARD (3 Cols)                       */}
          {/* ======================================================== */}
          <div className="lg:col-span-3">
            <div className="bg-[#0B0D0F] border border-white/[0.08] rounded-2xl p-5 shadow-xl flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div>
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#141a15] border border-[#C8E9A9]/40 text-[#C8E9A9] text-[9px] font-bold tracking-wider uppercase mb-2 shadow-[0_0_10px_rgba(200,233,169,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                  REALITY B
                </div>

                {/* Reality Title & Subtitle */}
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
                  {reality.name || "Mechanical Engineering"}
                </h2>
                <p className="text-xs text-[#A5A7A3] mt-1 leading-relaxed">
                  {reality.summary || "A different path, a different you."}
                </p>

                {/* Thumbnail Image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden bg-black/80 border border-white/5 my-4 group">
                  <img
                    src={
                      reality.image ||
                      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=85"
                    }
                    alt={reality.name || "Alternate Reality"}
                    className="w-full h-full object-cover brightness-[0.75] contrast-[1.05] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-transparent" />
                </div>

                {/* Attributes List */}
                <div className="space-y-3.5 pt-1 border-t border-white/10 text-xs">
                  {/* Career Path */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#121518] border border-white/[0.08] flex items-center justify-center text-[#A5A7A3] shrink-0">
                      <Briefcase size={13} />
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
                    <div className="w-7 h-7 rounded-lg bg-[#121518] border border-white/[0.08] flex items-center justify-center text-[#A5A7A3] shrink-0">
                      <GraduationCap size={13} />
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
                    <div className="w-7 h-7 rounded-lg bg-[#121518] border border-white/[0.08] flex items-center justify-center text-[#A5A7A3] shrink-0">
                      <Building2 size={13} />
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

                  {/* Outcome */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#121518] border border-white/[0.08] flex items-center justify-center text-[#A5A7A3] shrink-0">
                      <Lightbulb size={13} className="text-[#C8E9A9]" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#A5A7A3] tracking-wide">
                        Outcome
                      </div>
                      <div className="text-xs font-semibold text-[#F2F3F0] mt-0.5">
                        {reality.outcome || "Innovation Leader"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Button: Explore This Reality */}
              <button
                onClick={() =>
                  navigate(`/universe/${universe.id}/reality/${reality.id}`)
                }
                className="mt-6 w-full py-2.5 rounded-full bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(200,233,169,0.35)] cursor-pointer active:scale-95"
              >
                <span>Explore This Reality</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CENTER COLUMN: PANORAMA BANNER & DAY TIMELINE (6 Cols)   */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-4">
            {/* Panoramic Wide Banner */}
            <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#0B0D0F] border border-white/[0.08] shadow-xl flex items-center justify-between p-6 sm:p-8 group">
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {/* Background Futuristic Skyline */}
              <img
                src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85"
                alt="Futuristic Skyline"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.6] contrast-[1.1] group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/80 pointer-events-none" />

              {/* Explorer Silhouette in the Center */}
              <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none">
                <div className="w-20 h-28 bg-gradient-to-t from-black via-zinc-950 to-zinc-900 rounded-t-full opacity-90 blur-[0.5px]" />
              </div>

              {/* Right Inset Typography */}
              <div className="relative z-10 ml-auto text-right">
                <p className="text-[11px] sm:text-xs font-semibold text-[#A5A7A3] tracking-[0.26em] uppercase leading-relaxed font-mono">
                  ANOTHER LIFE. <br />
                  SAME YOU.
                </p>
              </div>
            </div>

            {/* Vertical Day Timeline Card */}
            <div className="bg-[#0B0D0F] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              {timelineEntries.length === 0 ? (
                /* Empty state when no simulation exists yet */
                <div className="py-12 text-center space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-[#141a15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mx-auto shadow-lg">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F2F3F0]">
                      No Simulation Generated Yet
                    </h3>
                    <p className="text-xs text-[#A5A7A3] max-w-sm mx-auto mt-1 leading-relaxed">
                      Experience a fully simulated chronological day in this alternate reality from dawn to dusk.
                    </p>
                  </div>

                  <button
                    onClick={handleGenerateDay}
                    disabled={loading}
                    className="px-6 py-3 rounded-full bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(200,233,169,0.35)] inline-flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Play size={14} className="fill-current" />
                    <span>Experience a Day in this Universe</span>
                  </button>
                </div>
              ) : (
                /* Chronological Day Timeline Entries */
                <div className="relative space-y-5">
                  {/* Continuous Vertical Line */}
                  <div className="absolute top-3 bottom-6 left-[72px] sm:left-[82px] w-[2px] bg-gradient-to-b from-[#C8E9A9] via-[#C8E9A9] to-[#C8E9A9]/20 pointer-events-none" />

                  {timelineEntries.map((entry, idx) => {
                    const isFirst = idx === 0;

                    return (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, delay: idx * 0.08 }}
                        className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 group"
                      >
                        {/* Left: Time and Glowing Indicator */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          {/* Glowing Dot on path */}
                          <div className="relative flex items-center justify-center">
                            {isFirst ? (
                              <div className="w-4 h-4 rounded-full border-2 border-[#C8E9A9] flex items-center justify-center bg-[#050505]">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9]" />
                              </div>
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
                            )}
                          </div>

                          {/* Time string */}
                          <span className="text-[11px] sm:text-xs font-bold text-[#F2F3F0] w-16 sm:w-18 tracking-tight font-mono">
                            {entry.time}
                          </span>
                        </div>

                        {/* Center: Circular Icon + Content */}
                        <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                          {/* Icon Circle */}
                          <div className="w-8 h-8 rounded-full bg-[#121518] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                            {getTimelineIcon(entry.time, entry.title, entry.iconType)}
                          </div>

                          {/* Title and Description */}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#F2F3F0] leading-snug group-hover:text-white transition-colors">
                              {entry.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-[#A5A7A3] mt-0.5 leading-relaxed line-clamp-2">
                              {entry.description}
                            </p>
                          </div>
                        </div>

                        {/* Right: Rectangular Photo Thumbnail */}
                        <div className="w-24 sm:w-28 h-14 sm:h-16 rounded-xl overflow-hidden bg-black/60 border border-white/5 shrink-0 relative shadow-md group-hover:scale-105 transition-transform duration-300">
                          <img
                            src={
                              entry.image ||
                              DEFAULT_TIMELINE_IMAGES.work
                            }
                            alt={entry.title}
                            className="w-full h-full object-cover brightness-[0.8] contrast-[1.05]"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: REALITY OVERVIEW & HIGHLIGHTS (3 Cols)     */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 space-y-4">
            {/* Card 1: Reality Overview */}
            <div className="bg-[#0B0D0F] border border-white/[0.08] rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F2F3F0] tracking-wide mb-4">
                <Layers size={14} className="text-[#C8E9A9] stroke-[2.2]" />
                <span>Reality Overview</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Career */}
                <div className="flex items-center justify-between text-[#A5A7A3]">
                  <span>Career</span>
                  <span className="font-semibold text-[#F2F3F0]">
                    {overview.career}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between text-[#A5A7A3]">
                  <span>Location</span>
                  <span className="font-semibold text-[#F2F3F0]">
                    {overview.location}
                  </span>
                </div>

                {/* Lifestyle */}
                <div className="flex items-center justify-between text-[#A5A7A3]">
                  <span>Lifestyle</span>
                  <span className="font-semibold text-[#F2F3F0]">
                    {overview.lifestyle}
                  </span>
                </div>

                {/* Happiness with progress bar */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[#A5A7A3] mb-1">
                    <span>Happiness</span>
                    <span className="font-semibold text-[#F2F3F0]">
                      {overview.happiness}
                    </span>
                  </div>
                  <div className="w-full bg-[#161a15] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#C8E9A9] h-full rounded-full"
                      style={{
                        width:
                          typeof overview.happiness === "string" &&
                          overview.happiness.includes("%")
                            ? overview.happiness
                            : "92%",
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-[#A5A7A3]/60 italic block mt-1">
                    Fictional happiness index
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Key Highlights */}
            <div className="bg-[#0B0D0F] border border-white/[0.08] rounded-2xl p-5 shadow-xl overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="flex items-center gap-2 text-xs font-bold text-[#F2F3F0] tracking-wide mb-3">
                <Trophy size={14} className="text-[#C8E9A9]" />
                <span>Key Highlights</span>
              </div>

              <div className="space-y-2.5">
                {(overview.highlights || []).map((highlight, hIdx) => (
                  <div
                    key={hIdx}
                    className="flex items-start gap-2 text-xs text-[#A5A7A3] leading-relaxed"
                  >
                    <CheckCircle2
                      size={14}
                      className="text-[#C8E9A9] shrink-0 mt-0.5"
                    />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: Quote Card */}
            <div className="relative bg-[#0B0D0F] border border-white/[0.08] rounded-2xl p-5 shadow-xl overflow-hidden min-h-[140px] flex flex-col justify-between">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <div className="relative z-10">
                <span className="text-2xl text-[#C8E9A9] font-serif font-black leading-none block mb-1">
                  “
                </span>
                <p className="text-xs text-[#A5A7A3] italic leading-relaxed">
                  {overview.quote ||
                    "Sometimes, a different choice leads to a happier you."}
                </p>
              </div>

              {/* Cosmic sphere in bottom-right corner */}
              <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full overflow-hidden pointer-events-none opacity-85">
                <img
                  src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=85"
                  alt="Planet from orbit"
                  className="w-full h-full object-cover brightness-[0.8] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D0E] via-transparent to-transparent" />
              </div>
            </div>

            {/* Speculative fiction disclaimer */}
            <div className="text-[10px] text-center text-[#A5A7A3]/70 pt-2">
              All daily itineraries are AI-generated speculative fictional narratives.
            </div>
          </div>
        </div>
      </div>
  );
}
