// src/components/universe/CustomNodes.jsx
import React from "react";
import { Handle, Position } from "@xyflow/react";
import { GraduationCap, ArrowRight, Plus, BarChart3, Laptop, Cpu } from "lucide-react";

/**
 * Root Node: "YOUR DECISION"
 * Displays the original turning point in an elegant dark pill with glowing decision badge.
 */
export const DecisionRootNode = ({ data }) => {
  return (
    <div className="relative bg-[#0B0D0E]/95 border border-[#292C2C] hover:border-[#3d4040] rounded-full px-5 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.8)] backdrop-blur-md flex items-center gap-3.5 min-w-[280px] max-w-[340px] transition-all">
      {/* Top Badge: "YOUR DECISION" */}
      <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-[#101411] border border-[#C8E9A9]/40 text-[#C8E9A9] text-[9px] font-bold tracking-widest uppercase shadow-sm">
        YOUR DECISION
      </div>

      {/* Left Icon Sphere */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center text-[#F2F3F0] shrink-0 shadow-inner">
        <GraduationCap size={18} className="text-[#F2F3F0]" />
      </div>

      {/* Decision Text & Year */}
      <div className="flex-1 pr-2">
        <h3 className="text-xs font-bold text-[#F2F3F0] leading-snug line-clamp-2">
          {data.title || "Original Decision"}
        </h3>
        <span className="text-[10px] text-[#A5A7A3] font-medium tracking-wide">
          ({data.year || new Date().getFullYear()})
        </span>
      </div>

      {/* Source Handle (Bottom Center) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-[#C8E9A9] !border-none !opacity-0"
      />
    </div>
  );
};

/**
 * Junction Node: Small glowing sage pivot point where branches diverge.
 */
export const JunctionNode = () => {
  return (
    <div className="relative flex items-center justify-center w-6 h-6">
      {/* Target Handle from Root */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />

      {/* Glowing Outer Halo */}
      <div className="absolute w-6 h-6 rounded-full bg-[#C8E9A9]/20 animate-pulse" />
      {/* Central Node Dot */}
      <div className="w-3.5 h-3.5 rounded-full bg-[#050505] border-2 border-[#C8E9A9] shadow-[0_0_10px_#C8E9A9]" />

      {/* Source Handle to Realities */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />
    </div>
  );
};

/**
 * Reality Card Node: Represents a diverging timeline (Reality A, Reality B, Reality C)
 */
export const RealityNode = ({ data, selected }) => {
  const isSelected = selected || data.isSelected;
  const isOriginal = data.type === "original";
  const badgeLabel = data.badgeLabel || "REALITY";

  // Badge Color Styles matching the screenshot
  const badgeColors = {
    sage: "bg-[#C8E9A9]/10 text-[#C8E9A9] border-[#C8E9A9]/30",
    blue: "bg-[#78a9c9]/10 text-[#78a9c9] border-[#78a9c9]/30",
    purple: "bg-[#9678C9]/10 text-[#9678C9] border-[#9678C9]/30",
  };
  const currentBadgeColor = data.badgeColor
    ? badgeColors[data.badgeColor] || badgeColors.sage
    : isSelected || isOriginal
    ? badgeColors.sage
    : badgeColors.purple;

  return (
    <div
      onClick={() => data.onSelect?.(data.reality)}
      className={`relative group bg-[#0B0D0E]/95 backdrop-blur-md rounded-2xl p-2.5 transition-all duration-300 cursor-pointer flex items-center gap-3 w-[260px] shadow-2xl ${
        isSelected
          ? "border-2 border-[#C8E9A9] shadow-[0_0_25px_rgba(200,233,169,0.22)]"
          : "border border-[#292C2C] hover:border-[#404343]"
      }`}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />

      {/* Left Thumbnail or Themed Icon */}
      <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 border border-white/5 shrink-0 relative flex items-center justify-center">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover brightness-85 group-hover:scale-105 transition-transform"
          />
        ) : data.badgeColor === "blue" ? (
          <div className="flex flex-col items-center justify-center text-cyan-300">
            <Laptop size={20} />
          </div>
        ) : data.badgeColor === "purple" ? (
          <div className="flex flex-col items-center justify-center text-purple-300">
            <Cpu size={20} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-[#C8E9A9]">
            <BarChart3 size={20} />
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="flex-1 min-w-0 pr-1">
        {/* Capsule Badge */}
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase border mb-1 ${currentBadgeColor}`}
        >
          {badgeLabel}
        </span>

        {/* Title */}
        <h4 className="text-xs font-bold text-[#F2F3F0] truncate leading-tight group-hover:text-white transition-colors">
          {data.name || "Alternate Career"}
        </h4>

        {/* Subtitle / Industry & Year */}
        <p className="text-[10px] text-[#A5A7A3] truncate mt-0.5">
          {data.subtitle || `${data.industry || "General"} • 2030+`}
        </p>
      </div>

      {/* Arrow Icon */}
      <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-[#A5A7A3] group-hover:text-[#F2F3F0] group-hover:border-[#C8E9A9]/40 transition-colors shrink-0">
        <ArrowRight size={10} />
      </div>

      {/* Bottom Handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />
    </div>
  );
};

/**
 * Add Branch Node: "+ Explore More Branches"
 */
export const AddBranchNode = ({ data }) => {
  return (
    <div
      onClick={data.onClick}
      className="relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0D0E]/90 hover:bg-[#141618] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-xs text-[#A5A7A3] hover:text-[#F2F3F0] transition-all cursor-pointer shadow-lg group"
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />
      <Plus size={13} className="text-[#A5A7A3] group-hover:text-[#C8E9A9] transition-colors" />
      <span className="text-[11px] font-medium tracking-wide">Explore More Branches</span>
    </div>
  );
};
