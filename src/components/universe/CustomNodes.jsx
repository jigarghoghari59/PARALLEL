// src/components/universe/CustomNodes.jsx
import React from "react";
import { Handle, Position } from "@xyflow/react";
import {
  GraduationCap,
  ArrowRight,
  Plus,
  BarChart3,
  Laptop,
  Cpu,
  GitBranch,
  Sparkles,
} from "lucide-react";

/**
 * Root Node: "Your decision" / Turning Point
 */
export const DecisionRootNode = ({ data }) => {
  return (
    <div className="relative bg-card border border-rule rounded-full px-5 py-3 shadow-md flex items-center gap-3.5 min-w-[280px] max-w-[360px] transition-colors hover:border-accent/50 group select-none">
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-full" />

      {/* Top Badge */}
      <div className="absolute -top-2.5 right-6 px-2.5 py-0.5 rounded-full bg-surface border border-accent/40 text-accent text-xs font-medium shadow-sm flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
        <span>Your decision</span>
      </div>

      {/* Left Icon Sphere */}
      <div className="w-10 h-10 rounded-full bg-surface border border-rule flex items-center justify-center text-ink shrink-0 group-hover:border-accent/40 transition-colors">
        <GraduationCap size={18} className="text-accent" aria-hidden="true" />
      </div>

      {/* Decision Text & Year */}
      <div className="flex-1 pr-2 min-w-0">
        <h3 className="text-xs font-bold text-ink leading-snug line-clamp-2">
          {data.title || "Original Turning Point"}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted font-normal">
            Year {data.year || new Date().getFullYear()}
          </span>
          {data.category && (
            <>
              <span className="text-muted text-xs">•</span>
              <span className="text-xs text-accent font-medium">
                {data.category}
              </span>
            </>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-accent !border-none !opacity-0"
      />
    </div>
  );
};

/**
 * Junction Node: Sage pivot point where divergent branches originate.
 */
export const JunctionNode = ({ data }) => {
  return (
    <div
      className="relative flex items-center justify-center w-7 h-7 group cursor-pointer"
      title={data?.label || "Divergence Waypoint"}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />

      <div className="absolute inset-0 rounded-full bg-accent/20 motion-safe:animate-ping opacity-30 motion-reduce:hidden" />
      <div className="w-4 h-4 rounded-full bg-paper border-2 border-accent flex items-center justify-center shadow-sm">
        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />
    </div>
  );
};

/**
 * Reality Card Node: Represents a diverging parallel timeline (Reality A, B, C...)
 */
export const RealityNode = ({ data, selected }) => {
  const isSelected = selected || data.isSelected;
  const isDimmed = data.isDimmed;
  const badgeLabel = data.badgeLabel || "Reality";

  const badgeColors = {
    sage: "bg-accent/10 text-accent border-accent/40",
    blue: "bg-sky-500/10 text-sky-300 border-sky-500/40",
    purple: "bg-purple/10 text-purple border-purple/40",
  };
  const currentBadgeColor = data.badgeColor
    ? badgeColors[data.badgeColor] || badgeColors.sage
    : badgeColors.sage;

  const handleClick = (e) => {
    e.stopPropagation();
    data.onSelect?.(data.reality || data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      data.onSelect?.(data.reality || data);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Inspect ${data.name || "reality"}`}
      className={`relative group bg-card border rounded-card p-2.5 transition-colors duration-150 cursor-pointer flex items-center gap-3 w-[275px] shadow-sm select-none focus-visible:outline-2 focus-visible:outline-focus ${
        isDimmed
          ? "opacity-30 filter grayscale hover:opacity-60 border-rule"
          : isSelected
          ? "border-2 border-accent ring-2 ring-accent/25 shadow-md shadow-accent/10"
          : "border-rule hover:border-accent/40 hover:bg-surface"
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />

      {/* Thumbnail or Themed Icon */}
      <div className="w-14 h-14 rounded-md overflow-hidden bg-paper border border-rule shrink-0 relative flex items-center justify-center">
        {data.image ? (
          <img
            src={data.image}
            alt={data.name || "Timeline thumbnail"}
            className="w-full h-full object-cover brightness-85"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : data.badgeColor === "blue" ? (
          <div className="flex flex-col items-center justify-center text-sky-300">
            <Laptop size={20} aria-hidden="true" />
          </div>
        ) : data.badgeColor === "purple" ? (
          <div className="flex flex-col items-center justify-center text-purple">
            <Cpu size={20} aria-hidden="true" />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-accent">
            <BarChart3 size={20} aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span
            className={`inline-block px-2 py-0.2 rounded-full text-xs font-semibold border ${currentBadgeColor}`}
          >
            {badgeLabel}
          </span>
          {data.coherence && (
            <span className="text-xs text-muted font-normal">
              {data.coherence}% coh.
            </span>
          )}
        </div>

        <h4 className="text-xs font-bold text-ink truncate leading-tight group-hover:text-white transition-colors">
          {data.name || "Alternate Career"}
        </h4>

        <p className="text-xs text-muted truncate mt-0.5">
          {data.subtitle || `${data.industry || "General"} • 2030+`}
        </p>
      </div>

      {/* Right Arrow Action */}
      <div className="w-6 h-6 rounded-full bg-surface border border-rule flex items-center justify-center text-muted group-hover:text-ink group-hover:border-accent/50 transition-colors shrink-0">
        <ArrowRight size={10} aria-hidden="true" />
      </div>

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
  const handleClick = (e) => {
    e.stopPropagation();
    data.onClick?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      data.onClick?.();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Branch from this timeline"
      className="relative flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-rule hover:border-accent/60 text-xs text-muted hover:text-ink transition-colors cursor-pointer shadow-sm group active:scale-95 select-none focus-visible:outline-2 focus-visible:outline-focus"
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none rounded-full" />
      <Handle
        type="target"
        position={Position.Top}
        className="!w-1 !h-1 !bg-transparent !border-none !opacity-0"
      />
      <Plus size={12} className="text-accent transition-colors" aria-hidden="true" />
      <span className="text-xs font-medium">Branch timeline</span>
    </div>
  );
};
