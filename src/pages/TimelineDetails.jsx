// src/pages/TimelineDetails.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  GraduationCap,
  Settings,
  Building2,
  Trophy,
  Rocket,
  Briefcase,
  Activity,
  Target,
  Award,
  Code2,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Play,
  GitBranch,
} from "lucide-react";
import { useUniverse } from "../context/UniverseContext";
import { BranchModal } from "../components/timeline/BranchModal";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function getEventIcon(category, index) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("milestone") || cat.includes("education") || index === 0) {
    return <GraduationCap size={16} className="text-ink" aria-hidden="true" />;
  }
  if (cat.includes("growth") || cat.includes("skill") || cat.includes("tech")) {
    return <Settings size={16} className="text-ink" aria-hidden="true" />;
  }
  if (cat.includes("career") || cat.includes("work") || cat.includes("startup")) {
    return <Building2 size={16} className="text-ink" aria-hidden="true" />;
  }
  if (cat.includes("achievement") || cat.includes("lead") || cat.includes("award")) {
    return <Trophy size={16} className="text-ink" aria-hidden="true" />;
  }
  if (cat.includes("legacy") || cat.includes("global") || cat.includes("impact")) {
    return <Rocket size={16} className="text-ink" aria-hidden="true" />;
  }
  return <Activity size={16} className="text-ink" aria-hidden="true" />;
}

function getMediaBannerForReality(reality) {
  const text = `${reality?.name || ""} ${reality?.career || ""} ${reality?.industry || ""}`.toLowerCase();
  if (text.includes("software") || text.includes("computer") || text.includes("code") || text.includes("web") || text.includes("dev")) {
    return "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85";
  }
  if (text.includes("mech") || text.includes("robot") || text.includes("hardware") || text.includes("engineer")) {
    return "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=85";
  }
  if (text.includes("car") || text.includes("motor") || text.includes("ev") || text.includes("auto")) {
    return "https://images.unsplash.com/photo-1617654112368-307921291f42?auto=format&fit=crop&w=1000&q=85";
  }
  if (text.includes("peace") || text.includes("alpine") || text.includes("cabin") || text.includes("sanctuary")) {
    return "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1000&q=85";
  }
  if (text.includes("space") || text.includes("orbit") || text.includes("astro") || text.includes("flight")) {
    return "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1000&q=85";
  }
  return reality?.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85";
}

export default function TimelineDetails() {
  const { universeId, realityId } = useParams();
  const navigate = useNavigate();
  const { universes } = useUniverse();

  const universe = useMemo(() => {
    if (universeId) {
      const found = universes.find((u) => u.id === universeId);
      if (found) return found;
    }
    return universes[0] || null;
  }, [universeId, universes]);

  const reality = useMemo(() => {
    if (!universe || !universe.realities) return null;
    if (realityId) {
      const found = universe.realities.find((r) => r.id === realityId);
      if (found) return found;
    }
    return universe.realities[1] || universe.realities[0] || null;
  }, [universe, realityId]);

  const realityIndex = useMemo(() => {
    if (!universe?.realities || !reality) return 1;
    const idx = universe.realities.findIndex((r) => r.id === reality.id);
    return idx >= 0 ? idx : 1;
  }, [universe, reality]);

  const letterBadge = LETTERS[realityIndex] || "B";

  const [expandedEventId, setExpandedEventId] = useState(null);
  const [selectedEventForBranch, setSelectedEventForBranch] = useState(null);
  const [branchModalOpen, setBranchModalOpen] = useState(false);

  const events = useMemo(() => {
    if (!reality?.events) return [];
    return [...reality.events].sort((a, b) => (a.year || 0) - (b.year || 0));
  }, [reality]);

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
    if (universe?.id) {
      navigate(`/explore/${universe.id}`, {
        state: { focusedRealityId: childReality.id },
      });
    }
  };

  if (!universe || !reality) {
    return (
      <div className="min-h-[calc(100dvh-65px)] bg-paper text-ink flex items-center justify-center p-6">
        <div className="bg-card border border-rule rounded-card p-8 max-w-md text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent/40 to-transparent pointer-events-none" />
          <AlertTriangle size={32} className="text-accent mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-bold mb-2">Reality not found</h2>
          <p className="text-xs text-muted mb-6">
            The requested alternate timeline could not be located in local storage.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-muted text-accent-ink font-semibold text-xs transition-colors active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
          >
            <ArrowLeft size={14} aria-hidden="true" /> Back to explorer
          </Link>
        </div>
      </div>
    );
  }

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
    "You are not just a developer, you are a pioneer in building intelligent machines.";

  return (
    <div className="relative min-h-[calc(100dvh-65px)] bg-paper text-ink overflow-x-clip select-none pb-12">
      {/* Background Celestial Orbit */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <svg
          className="absolute -top-12 -right-20 w-[850px] h-[550px] opacity-40"
          viewBox="0 0 850 550"
          fill="none"
          aria-hidden="true"
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

        <div className="absolute top-16 right-[38%] w-6 h-6 rounded-full bg-surface border border-rule opacity-85" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 select-none">
        {/* TOP HEADER CONTROLS BAR */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule w-fit mb-3 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
              <span className="text-xs font-medium text-ink">
                Alternate reality journey
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-ink tracking-tight leading-none">
              Timeline details and milestones
            </h1>
            <p className="text-xs sm:text-sm text-muted font-normal mt-2">
              A comprehensive chronological journey of your alternate reality, career trajectory, and key divergence points.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={universeId ? `/explore/${universeId}` : "/explore"}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs text-ink transition-colors shadow-sm group active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
            >
              <ArrowLeft size={13} className="text-accent" aria-hidden="true" />
              <span>Back to explorer</span>
            </Link>
          </div>
        </div>

        {/* 3-COLUMN MAIN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: REALITY OVERVIEW CARD */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-rule rounded-card p-5 relative flex flex-col justify-between overflow-hidden shadow-sm">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

              <div className="relative w-full h-44 rounded-md overflow-hidden bg-paper border border-rule mb-4 group">
                <img
                  src={
                    reality.image ||
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=85"
                  }
                  alt={reality.name}
                  className="w-full h-full object-cover brightness-[0.8]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-surface border border-accent/40 text-accent text-xs font-medium">
                  Reality {letterBadge}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight leading-snug">
                {reality.name || "Mechanical Engineering"}
              </h2>
              <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">
                {reality.summary || "A different path, a different you."}
              </p>

              {/* Attributes List */}
              <div className="space-y-3.5 my-5 pt-3 border-t border-rule">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <Briefcase size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted">
                      Career path
                    </div>
                    <div className="text-xs font-semibold text-ink mt-0.5">
                      {reality.career || "Robotics Engineer"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <GraduationCap size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted">
                      Skills gained
                    </div>
                    <div className="text-xs font-semibold text-ink mt-0.5">
                      {Array.isArray(reality.skills)
                        ? reality.skills.slice(0, 3).join(", ")
                        : "Mechanical Design, AI"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-rule flex items-center justify-center text-muted shrink-0">
                    <Building2 size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted">
                      Industry
                    </div>
                    <div className="text-xs font-semibold text-ink mt-0.5">
                      {reality.industry || "Automation"}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent shrink-0">
                    <Target size={14} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted">
                      Overall outlook
                    </div>
                    <div className="text-xs font-semibold text-ink mt-0.5">
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
                  className="w-full py-2.5 rounded-full bg-accent hover:bg-accent-muted text-xs font-semibold text-accent-ink flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
                >
                  <Play size={11} className="fill-current text-accent-ink" aria-hidden="true" />
                  <span>Explore this reality</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      navigate(`/simulate/${universe.id}/${reality.id}`)
                    }
                    className="py-2 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs text-muted hover:text-ink transition-colors cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    Experience day
                  </button>
                  <button
                    onClick={() => navigate("/compare")}
                    className="py-2 rounded-full bg-surface border border-rule hover:border-accent/40 text-xs text-muted hover:text-ink transition-colors cursor-pointer active:scale-95 focus-visible:outline-2 focus-visible:outline-focus"
                  >
                    Compare realities
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: VERTICAL TIMELINE PATH */}
          <div className="lg:col-span-5 relative">
            <div className="relative pl-2 sm:pl-4 space-y-6">
              <div className="absolute top-6 bottom-6 left-[88px] sm:left-[98px] w-[2px] bg-gradient-to-b from-accent via-accent to-accent/30 pointer-events-none z-0" />

              {events.map((evt, idx) => {
                const isExpanded = activeExpandedId === evt.id;

                return (
                  <div
                    key={evt.id || idx}
                    className="relative z-10 flex items-start gap-3 sm:gap-4 group"
                  >
                    <div className="w-16 sm:w-18 pt-2.5 text-right shrink-0">
                      <div className="text-sm sm:text-base font-bold text-ink tracking-tight group-hover:text-accent transition-colors">
                        {evt.year}
                      </div>
                      {evt.age && (
                        <div className="text-xs text-muted font-normal">
                          Age {evt.age}
                        </div>
                      )}
                    </div>

                    <div className="relative pt-2 shrink-0">
                      <span className="absolute -left-1.5 top-5 w-2 h-2 rounded-full bg-accent" aria-hidden="true" />
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-surface border border-rule group-hover:border-accent/60 flex items-center justify-center text-ink transition-colors">
                        {getEventIcon(evt.category, idx)}
                      </div>
                    </div>

                    {/* Right: Event Card Container */}
                    <div
                      onClick={() => toggleEventExpand(evt.id)}
                      className={`flex-1 bg-card border rounded-card p-4 sm:p-5 transition-colors duration-150 cursor-pointer overflow-hidden ${
                        isExpanded
                          ? "border-accent"
                          : "border-rule hover:border-white/20"
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xs sm:text-sm font-bold text-ink leading-snug group-hover:text-white transition-colors">
                          {evt.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-surface border border-rule text-accent text-xs font-medium shrink-0">
                          {evt.category || "Milestone"}
                        </span>
                      </div>

                      <p className="text-xs text-muted mt-1.5 leading-relaxed">
                        {evt.description}
                      </p>

                      {isExpanded && (
                        <div
                          className="mt-4 pt-3.5 border-t border-rule space-y-3.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {Array.isArray(evt.skills) && evt.skills.length > 0 && (
                            <div>
                              <div className="text-xs font-medium text-muted mb-1.5">
                                Skills acquired:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {evt.skills.map((skill, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2 py-0.5 rounded-md bg-surface border border-rule text-xs text-ink"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {evt.opportunities && evt.opportunities.length > 0 && (
                              <div className="bg-surface border border-rule p-2.5 rounded-lg">
                                <span className="text-xs font-semibold text-accent block mb-1">
                                  Opportunities
                                </span>
                                <span className="text-muted text-xs leading-relaxed">
                                  {Array.isArray(evt.opportunities)
                                    ? evt.opportunities.join(", ")
                                    : evt.opportunities}
                                </span>
                              </div>
                            )}

                            {evt.challenges && evt.challenges.length > 0 && (
                              <div className="bg-surface border border-rule p-2.5 rounded-lg">
                                <span className="text-xs font-semibold text-amber-300 block mb-1">
                                  Challenges
                                </span>
                                <span className="text-muted text-xs leading-relaxed">
                                  {Array.isArray(evt.challenges)
                                    ? evt.challenges.join(", ")
                                    : evt.challenges}
                                </span>
                              </div>
                            )}
                          </div>

                          {evt.consequences && (
                            <div className="text-xs text-muted bg-surface border border-rule p-2.5 rounded-lg">
                              <span className="font-semibold text-ink">
                                Impact / Consequence:{" "}
                              </span>
                              {evt.consequences}
                            </div>
                          )}

                          <div className="pt-1 flex items-center justify-between">
                            <span className="text-xs text-muted italic">
                              Speculative scenario
                            </span>

                            <button
                              type="button"
                              onClick={() => handleOpenBranchModal(evt)}
                              className="px-3.5 py-1.5 rounded-lg bg-accent hover:bg-accent-muted text-accent-ink text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
                            >
                              <GitBranch size={13} aria-hidden="true" />
                              <span>Create branch</span>
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

          {/* RIGHT COLUMN: KEY INSIGHTS & MEDIA */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative w-full h-44 rounded-card overflow-hidden bg-card border border-rule shadow-sm group">
              <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <img
                src={getMediaBannerForReality(reality)}
                alt={reality?.name || "Lab and Innovation"}
                className="w-full h-full object-cover brightness-[0.75]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink pt-1">
              <Award size={14} className="text-accent" aria-hidden="true" />
              <span>Key insights</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border border-rule rounded-card p-3.5 flex flex-col justify-between overflow-hidden shadow-sm">
                <div className="text-accent mb-2">
                  <Code2 size={16} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted">
                    Skills
                  </div>
                  <div className="text-xs font-semibold text-ink mt-0.5 line-clamp-2">
                    {skillsList}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-rule rounded-card p-3.5 flex flex-col justify-between overflow-hidden shadow-sm">
                <div className="text-accent mb-2">
                  <Briefcase size={16} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted">
                    Opportunities
                  </div>
                  <div className="text-xs font-semibold text-ink mt-0.5 line-clamp-2">
                    {opportunitiesList}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-rule rounded-card p-3.5 flex flex-col justify-between overflow-hidden shadow-sm">
                <div className="text-accent mb-2">
                  <AlertTriangle size={16} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted">
                    Challenges
                  </div>
                  <div className="text-xs font-semibold text-ink mt-0.5 line-clamp-2">
                    {challengesList}
                  </div>
                </div>
              </div>

              <div className="bg-card border border-rule rounded-card p-3.5 flex flex-col justify-between overflow-hidden shadow-sm">
                <div className="text-accent mb-2">
                  <TrendingUp size={16} aria-hidden="true" />
                </div>
                <div>
                  <div className="text-xs font-medium text-muted">
                    Outcome
                  </div>
                  <div className="text-xs font-semibold text-ink mt-0.5 line-clamp-2">
                    {outcomeText}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Card: Unique Insight */}
            <div className="relative bg-card border border-rule rounded-card p-4.5 overflow-hidden shadow-sm">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface border border-rule flex items-center justify-center text-accent shrink-0 mt-0.5">
                  <Lightbulb size={16} aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink">
                    What makes this reality unique?
                  </h4>
                  <p className="text-xs text-muted mt-1 leading-relaxed">
                    {uniqueInsightText}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted/70 text-center pt-2">
              All scenarios are illustrative speculative fiction generated by AI.
            </div>
          </div>
        </div>
      </div>

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
