// src/components/universe/RealityDetailPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  ArrowRight,
  AlertTriangle,
  Compass,
  X,
  Target,
  GitBranch,
  Clock,
  Scale,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const RealityDetailPanel = ({
  reality,
  universeId,
  letter = "A",
  badgeLabel = "Reality",
  onClose,
  onExploreMoreBranches,
}) => {
  const navigate = useNavigate();

  if (!reality) return null;

  const handleExploreReality = () => {
    navigate(`/universe/${universeId}/reality/${reality.id}`);
  };

  const handleSimulateDay = () => {
    navigate(`/simulate/${universeId}/${reality.id}`);
  };

  const handleCompare = () => {
    navigate(`/compare?universe=${universeId}&a=${reality.id}`);
  };

  const skills = Array.isArray(reality.skills) && reality.skills.length > 0
    ? reality.skills
    : ["Strategic Architecture", "Systems Thinking", "Execution"];

  const opportunities = Array.isArray(reality.opportunities) && reality.opportunities.length > 0
    ? reality.opportunities.join(", ")
    : "Key Leadership, Cross-disciplinary Innovation, Global Scale";

  const challenges = Array.isArray(reality.challenges) && reality.challenges.length > 0
    ? reality.challenges.join(", ")
    : "High Ambiguity, Rapid Technological Shifts";

  const outcome = reality.outcome || "A deeply fulfilling trajectory shaped by this distinct turning point choice.";

  const bannerImage =
    reality.image ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85";

  const events = Array.isArray(reality.events) && reality.events.length > 0
    ? reality.events.slice(0, 3)
    : [
        {
          id: "m-1",
          year: 2026,
          title: "Initial Trajectory Pivot",
          description: "Transitioned focus toward specialized domain mastery.",
        },
        {
          id: "m-2",
          year: 2029,
          title: "Strategic Growth Phase",
          description: "Expanded core responsibility and scaled multidisciplinary initiatives.",
        },
        {
          id: "m-3",
          year: 2033,
          title: "Long-term Horizon Realization",
          description: "Established enduring industry presence and leadership.",
        },
      ];

  return (
    <div className="w-full h-full bg-card border border-rule rounded-card overflow-hidden flex flex-col relative select-none">
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none z-20" />

      {/* Top Banner Image with Overlay Badge */}
      <div className="relative w-full h-40 sm:h-44 overflow-hidden shrink-0 bg-paper">
        <img
          src={bannerImage}
          alt={reality.name}
          className="w-full h-full object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-black/20 to-black/40" />

        {/* Badge Overlay */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-paper/90 border border-rule shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="text-xs font-semibold text-ink">
            {badgeLabel} {letter}
          </span>
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-paper/90 border border-rule flex items-center justify-center text-muted hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer"
            aria-label="Close reality inspector"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title & Metadata */}
        <div>
          <h2 className="text-xl font-bold text-ink tracking-tight leading-snug">
            {reality.name}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted">
            <span className="font-medium text-accent">
              {reality.career || reality.industry || "Technology"}
            </span>
            <span>•</span>
            <span>{reality.location || "Global"}</span>
            <span>•</span>
            <span>2030+</span>
          </div>
        </div>

        {/* Summary */}
        <p className="text-xs text-muted leading-relaxed">
          {reality.summary ||
            "You charted a distinct path diverging from your initial turning point. This timeline details the skills, milestones, and impacts experienced along this journey."}
        </p>

        {/* Milestones Preview */}
        <div className="space-y-2 pt-1 border-t border-rule/70">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
              <Calendar size={12} className="text-accent" aria-hidden="true" />
              <span>Timeline milestones</span>
            </div>
            <button
              onClick={handleExploreReality}
              className="text-xs text-accent hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
            >
              <span>Full timeline</span>
              <ExternalLink size={10} aria-hidden="true" />
            </button>
          </div>

          <div className="space-y-2">
            {events.map((evt, idx) => (
              <div
                key={evt.id || idx}
                className="p-2.5 rounded-lg bg-surface/80 border border-rule flex items-start gap-2.5"
              >
                <div className="px-1.5 py-0.5 rounded bg-paper border border-rule text-xs font-mono font-medium text-accent shrink-0">
                  {evt.year || 2026 + idx * 3}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-semibold text-ink truncate">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">
                    {evt.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Skills */}
        <div className="space-y-1.5 pt-1 border-t border-rule/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Award size={12} className="text-accent" aria-hidden="true" />
            <span>Key capabilities</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-surface border border-rule text-xs text-ink font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="space-y-1 pt-1 border-t border-rule/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Compass size={12} className="text-accent" aria-hidden="true" />
            <span>Opportunities</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {opportunities}
          </p>
        </div>

        {/* Challenges */}
        <div className="space-y-1 pt-1 border-t border-rule/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <AlertTriangle size={12} className="text-amber-400" aria-hidden="true" />
            <span>Challenges</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {challenges}
          </p>
        </div>

        {/* Outcome */}
        <div className="space-y-1 pt-1 border-t border-rule/70">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-ink">
            <Target size={12} className="text-accent" aria-hidden="true" />
            <span>Projected trajectory</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {outcome}
          </p>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="p-4 border-t border-rule bg-surface space-y-2 shrink-0 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        <button
          onClick={handleExploreReality}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent hover:bg-accent-muted text-accent-ink font-semibold text-xs transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
        >
          <span>Explore reality details</span>
          <ArrowRight size={13} aria-hidden="true" />
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleSimulateDay}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-paper hover:bg-surface border border-rule hover:border-accent/40 text-ink font-medium text-xs transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Clock size={12} className="text-accent" aria-hidden="true" />
            <span className="truncate">Simulate day</span>
          </button>

          <button
            onClick={handleCompare}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-paper hover:bg-surface border border-rule hover:border-accent/40 text-ink font-medium text-xs transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          >
            <Scale size={12} className="text-accent" aria-hidden="true" />
            <span className="truncate">Compare</span>
          </button>
        </div>

        {onExploreMoreBranches && (
          <button
            onClick={() => onExploreMoreBranches(reality)}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-paper hover:bg-surface border border-rule hover:border-accent/40 text-ink font-medium text-xs transition-colors active:scale-95 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus whitespace-nowrap"
          >
            <GitBranch size={13} className="text-accent" aria-hidden="true" />
            <span>Branch timeline</span>
          </button>
        )}

        <p className="text-xs text-center text-muted pt-1">
          Speculative fiction narrative, non-predictive
        </p>
      </div>
    </div>
  );
};
