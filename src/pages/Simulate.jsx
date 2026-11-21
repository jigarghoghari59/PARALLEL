// src/pages/Simulate.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  RefreshCw,
  Sun,
  Briefcase,
  Code2,
  Dumbbell,
  Moon,
  CheckCircle2,
  Trophy,
  ArrowRight,
  GraduationCap,
  Building2,
  Lightbulb,
  AlertTriangle,
  Clock,
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
    return <Sun size={15} className="text-accent" aria-hidden="true" />;
  }
  if (normalized.includes("briefcase") || normalized.includes("work") || normalized.includes("lab") || normalized.includes("10:") || normalized.includes("11:")) {
    return <Briefcase size={15} className="text-accent" aria-hidden="true" />;
  }
  if (normalized.includes("code") || normalized.includes("decision") || normalized.includes("terminal") || normalized.includes("meeting") || normalized.includes("02:")) {
    return <Code2 size={15} className="text-ink" aria-hidden="true" />;
  }
  if (normalized.includes("dumbbell") || normalized.includes("gym") || normalized.includes("fitness") || normalized.includes("personal") || normalized.includes("07:00 pm")) {
    return <Dumbbell size={15} className="text-purple" aria-hidden="true" />;
  }
  if (normalized.includes("moon") || normalized.includes("night") || normalized.includes("end") || normalized.includes("sleep") || normalized.includes("11:")) {
    return <Moon size={15} className="text-muted" aria-hidden="true" />;
  }
  return <Activity size={15} className="text-accent" aria-hidden="true" />;
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
      <div className="min-h-dvh bg-paper text-ink flex items-center justify-center p-6">
        <div className="bg-card border border-rule rounded-card p-8 max-w-md text-center">
          <AlertTriangle size={32} className="text-accent mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-bold mb-2">Reality not found</h2>
          <p className="text-xs text-muted mb-6">
            The requested universe or reality could not be resolved.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-btn bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs transition-transform focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to explorer
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
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-rule w-fit mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent motion-safe:animate-pulse" />
            <span className="text-xs font-medium text-ink">
              Quantum day simulation
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
            A day in your alternate reality
          </h1>
          <p className="text-xs sm:text-sm text-muted font-normal mt-2">
            Experience morning routines, work decisions, and personal life milestones projected for this timeline.
          </p>
        </div>

        {/* Right Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Day Switcher */}
          {simulations.length > 1 && (
            <div className="flex items-center gap-1 bg-surface border border-rule p-1 rounded-full">
              {simulations.map((sim, sIdx) => (
                <button
                  key={sim.id || sIdx}
                  onClick={() => setActiveSimIndex(sIdx)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
                    activeSimIndex === sIdx
                      ? "bg-accent text-accent-ink font-semibold"
                      : "text-muted hover:text-ink"
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
            className="px-4 py-2 rounded-full bg-surface hover:bg-surface/80 active:bg-paper-2 border border-rule text-xs font-semibold text-ink flex items-center gap-2 transition-colors group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <RefreshCw
              size={13}
              aria-hidden="true"
              className={`text-accent ${
                loading ? "motion-safe:animate-spin" : ""
              }`}
            />
            <span>{loading ? "Simulating day…" : "Generate new day"}</span>
          </button>

          <Link
            to={`/explore/${universe.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-rule hover:border-accent/40 active:bg-paper-2 text-xs text-ink transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
          >
            <ArrowLeft size={13} className="text-accent" aria-hidden="true" />
            <span>Back to explorer</span>
          </Link>
        </div>
      </div>

      {/* 3-COLUMN MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: REALITY CARD (3 Cols) */}
        <div className="lg:col-span-3">
          <div className="bg-card border border-rule rounded-card p-5 flex flex-col justify-between overflow-hidden">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple/10 border border-purple/30 text-purple text-xs font-medium mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple" />
                Reality B
              </div>

              {/* Reality Title & Subtitle */}
              <h2 className="text-xl font-bold text-ink tracking-tight leading-snug">
                {reality.name || "Mechanical Engineering"}
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed">
                {reality.summary || "A different path, a different you."}
              </p>

              {/* Thumbnail Image */}
              <div className="relative w-full h-32 rounded-lg overflow-hidden bg-paper-3 border border-rule my-3">
                <img
                  src={
                    reality.image ||
                    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=85"
                  }
                  alt={reality.name || "Alternate Reality"}
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              {/* Attributes List */}
              <div className="space-y-3 pt-1 border-t border-rule text-xs">
                {/* Career Path */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <Briefcase size={12} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">
                      Career path
                    </div>
                    <div className="text-xs font-medium text-ink mt-0.5">
                      {reality.career || "Robotics Engineer"}
                    </div>
                  </div>
                </div>

                {/* Skills Gained */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <GraduationCap size={12} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">
                      Skills gained
                    </div>
                    <div className="text-xs font-medium text-ink mt-0.5">
                      {Array.isArray(reality.skills)
                        ? reality.skills.slice(0, 3).join(", ")
                        : "Mechanical Design, AI"}
                    </div>
                  </div>
                </div>

                {/* Industry */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <Building2 size={12} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">
                      Industry
                    </div>
                    <div className="text-xs font-medium text-ink mt-0.5">
                      {reality.industry || "Automation"}
                    </div>
                  </div>
                </div>

                {/* Outcome */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <Lightbulb size={12} className="text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs text-muted">
                      Outcome
                    </div>
                    <div className="text-xs font-medium text-ink mt-0.5">
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
              className="mt-5 w-full py-2 px-3 rounded-full bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs flex items-center justify-center gap-2 transition-transform cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
            >
              <span>Explore this reality</span>
              <ArrowRight size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: PANORAMA BANNER & DAY TIMELINE (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          {/* Panoramic Wide Banner */}
          <div className="relative w-full h-40 sm:h-44 rounded-card overflow-hidden bg-card border border-rule flex items-center justify-between p-6">
            {/* Background Skyline */}
            <img
              src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=85"
              alt="Futuristic Skyline"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />

            {/* Inset Typography */}
            <div className="relative z-10 max-w-sm">
              <p className="text-sm font-medium text-ink leading-relaxed">
                Another life, same core self.
              </p>
              <p className="text-xs text-muted mt-1">
                Projected timeline based on your divergent choice vector.
              </p>
            </div>
          </div>

          {/* Vertical Day Timeline Card */}
          <div className="bg-card border border-rule rounded-card p-5 sm:p-6 overflow-hidden">
            {timelineEntries.length === 0 ? (
              /* Empty state when no simulation exists yet */
              <div className="py-10 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-surface border border-rule flex items-center justify-center text-accent mx-auto">
                  <Clock size={20} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">
                    No simulation generated yet
                  </h3>
                  <p className="text-xs text-muted max-w-sm mx-auto mt-1 leading-relaxed">
                    Experience a simulated chronological day in this alternate reality from dawn to dusk.
                  </p>
                </div>

                <button
                  onClick={handleGenerateDay}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-full bg-accent hover:bg-accent/90 active:scale-[0.98] text-accent-ink font-semibold text-xs inline-flex items-center gap-2 cursor-pointer transition-transform whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <Play size={13} className="fill-current" aria-hidden="true" />
                  <span>Simulate this day</span>
                </button>
              </div>
            ) : (
              /* Chronological Day Timeline Entries */
              <div className="relative space-y-4">
                {timelineEntries.map((entry, idx) => {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.05 }}
                      className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 group border-b border-rule/50 pb-3 last:border-b-0 last:pb-0"
                    >
                      {/* Left: Time string */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                        <span className="text-xs font-semibold text-ink w-16 tabular-nums">
                          {entry.time}
                        </span>
                      </div>

                      {/* Center: Icon + Content */}
                      <div className="flex items-start gap-2.5 flex-1 min-w-0 pr-2">
                        <div className="w-7 h-7 rounded-md bg-surface border border-rule flex items-center justify-center shrink-0 mt-0.5">
                          {getTimelineIcon(entry.time, entry.title, entry.iconType)}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-ink leading-snug">
                            {entry.title}
                          </h4>
                          <p className="text-xs text-muted mt-0.5 leading-relaxed line-clamp-2">
                            {entry.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Rectangular Photo Thumbnail */}
                      <div className="w-20 sm:w-24 h-12 sm:h-14 rounded-lg overflow-hidden bg-paper-3 border border-rule shrink-0 relative">
                        <img
                          src={
                            entry.image ||
                            DEFAULT_TIMELINE_IMAGES.work
                          }
                          alt={entry.title}
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: REALITY OVERVIEW & HIGHLIGHTS (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Card 1: Reality Overview */}
          <div className="bg-card border border-rule rounded-card p-5 overflow-hidden">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink mb-3">
              <Layers size={14} className="text-accent" aria-hidden="true" />
              <span>Reality overview</span>
            </div>

            <div className="space-y-2.5 text-xs divide-y divide-rule/60">
              {/* Career */}
              <div className="flex items-center justify-between text-muted pt-1">
                <span>Career</span>
                <span className="font-medium text-ink">
                  {overview.career}
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center justify-between text-muted pt-2">
                <span>Location</span>
                <span className="font-medium text-ink">
                  {overview.location}
                </span>
              </div>

              {/* Lifestyle */}
              <div className="flex items-center justify-between text-muted pt-2">
                <span>Lifestyle</span>
                <span className="font-medium text-ink">
                  {overview.lifestyle}
                </span>
              </div>

              {/* Happiness with progress bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-muted mb-1">
                  <span>Satisfaction rate</span>
                  <span className="font-medium text-ink tabular-nums">
                    {overview.happiness}
                  </span>
                </div>
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full"
                    style={{
                      width:
                        typeof overview.happiness === "string" &&
                        overview.happiness.includes("%")
                          ? overview.happiness
                          : "92%",
                    }}
                  />
                </div>
                <span className="text-[11px] text-muted italic block mt-1">
                  Simulated self-reported score
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Key Highlights */}
          <div className="bg-card border border-rule rounded-card p-5 overflow-hidden">
            <div className="flex items-center gap-2 text-xs font-semibold text-ink mb-3">
              <Trophy size={14} className="text-accent" aria-hidden="true" />
              <span>Key highlights</span>
            </div>

            <div className="space-y-2">
              {(overview.highlights || []).map((highlight, hIdx) => (
                <div
                  key={hIdx}
                  className="flex items-start gap-2 text-xs text-muted leading-relaxed"
                >
                  <CheckCircle2
                    size={13}
                    className="text-accent shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Quote Inset */}
          <div className="bg-surface/50 border border-rule rounded-card p-4 overflow-hidden">
            <p className="text-xs text-muted italic leading-relaxed">
              &ldquo;{overview.quote || "Sometimes, a different choice leads to a happier you."}&rdquo;
            </p>
          </div>

          {/* Speculative fiction disclaimer */}
          <div className="text-[11px] text-center text-muted/70 pt-1">
            All daily itineraries are AI-generated speculative fictional narratives.
          </div>
        </div>
      </div>
    </div>
  );
}
