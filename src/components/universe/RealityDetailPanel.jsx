// src/components/universe/RealityDetailPanel.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  ArrowRight,
  Briefcase,
  AlertTriangle,
  Compass,
  X,
  Target,
  GitBranch,
  GitFork,
  Clock,
} from "lucide-react";

export const RealityDetailPanel = ({
  reality,
  universeId,
  badgeLabel = "REALITY",
  badgeColor = "sage",
  onClose,
  onExploreMoreBranches,
}) => {
  const navigate = useNavigate();

  if (!reality) return null;

  const handleExploreReality = () => {
    navigate(`/universe/${universeId}/reality/${reality.id}`);
  };

  const skills = Array.isArray(reality.skills) && reality.skills.length > 0
    ? reality.skills
    : ["Strategy", "Leadership", "Execution"];

  const opportunities = Array.isArray(reality.opportunities) && reality.opportunities.length > 0
    ? reality.opportunities.join(", ")
    : "Product Leadership, Global Startup Opportunities";

  const challenges = Array.isArray(reality.challenges) && reality.challenges.length > 0
    ? reality.challenges.join(", ")
    : "High Responsibility, Market Ambiguity";

  const outcome = reality.outcome || "A fulfilling and impactful trajectory shaped by this distinct choice.";

  // Default banner image
  const bannerImage =
    reality.image ||
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85";

  return (
    <div className="w-full h-full bg-[#0B0D0F] border border-white/[0.08] rounded-xl overflow-hidden flex flex-col shadow-2xl relative">
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-20" />
      {/* Top Banner Image with Overlay Badge */}
      <div className="relative w-full h-44 sm:h-48 overflow-hidden shrink-0 bg-black">
        <img
          src={bannerImage}
          alt={reality.name}
          className="w-full h-full object-cover brightness-[0.75]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D0E] via-transparent to-black/30" />

        {/* Badge Overlay */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_6px_#C8E9A9]" />
          <span className="text-[10px] font-bold text-[#F2F3F0] tracking-wider uppercase">
            {badgeLabel}
          </span>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Panel Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title & Industry / Year */}
        <div>
          <h2 className="text-xl font-extrabold text-[#F2F3F0] tracking-tight leading-snug">
            {reality.name}
          </h2>
          <p className="text-xs text-[#A5A7A3] mt-0.5 font-medium">
            {reality.career || reality.industry || "Tech Product"} • 2030+
          </p>
        </div>

        {/* Summary Description */}
        <p className="text-xs text-[#A5A7A3] leading-relaxed">
          {reality.summary ||
            "You chose to lead products instead of building them. You're now shaping key architectures, guiding multidisciplinary teams into the future."}
        </p>

        {/* Key Skills */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F2F3F0] tracking-wider uppercase">
            <Award size={12} className="text-[#C8E9A9]" />
            <span>Key Skills</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-[#121518] border border-white/[0.08] text-[11px] text-[#F2F3F0] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F2F3F0] tracking-wider uppercase">
            <Compass size={12} className="text-[#C8E9A9]" />
            <span>Opportunities</span>
          </div>
          <p className="text-xs text-[#A5A7A3] leading-relaxed">
            {opportunities}
          </p>
        </div>

        {/* Challenges */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F2F3F0] tracking-wider uppercase">
            <AlertTriangle size={12} className="text-amber-400" />
            <span>Challenges</span>
          </div>
          <p className="text-xs text-[#A5A7A3] leading-relaxed">
            {challenges}
          </p>
        </div>

        {/* Outcome */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#F2F3F0] tracking-wider uppercase">
            <Target size={12} className="text-[#C8E9A9]" />
            <span>Outcome</span>
          </div>
          <p className="text-xs text-[#A5A7A3] leading-relaxed">
            {outcome}
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-[#0E1114] space-y-2 shrink-0 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        <button
          onClick={handleExploreReality}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C8E9A9] hover:bg-[#d5f2b8] text-[#050505] font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(200,233,169,0.35)] active:scale-95 cursor-pointer"
        >
          <span>Explore This Reality</span>
          <ArrowRight size={14} />
        </button>

        <button
          onClick={() => navigate(`/simulate/${universeId}/${reality.id}`)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-white/20 text-[#F2F3F0] font-semibold text-xs transition-all active:scale-95 cursor-pointer"
        >
          <Clock size={13} className="text-[#C8E9A9]" />
          <span>Experience a Day</span>
        </button>

        {onExploreMoreBranches && (
          <button
            onClick={onExploreMoreBranches}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-white/20 text-[#F2F3F0] font-semibold text-xs transition-all active:scale-95 cursor-pointer"
          >
            <GitBranch size={13} className="text-[#C8E9A9]" />
            <span>Explore More Branches</span>
          </button>
        )}

        <p className="text-[10px] text-center text-[#A5A7A3]/70">
          Speculative fiction narrative • Non-predictive
        </p>
      </div>
    </div>
  );
};
