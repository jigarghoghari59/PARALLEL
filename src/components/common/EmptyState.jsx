// src/components/common/EmptyState.jsx
import React from "react";
import { Compass } from "lucide-react";
import { cn } from "../../utils";

export const EmptyState = ({
  title = "No data found",
  description = "Nothing to display right now.",
  actionLabel,
  onAction,
  icon: Icon = Compass,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 rounded-xl glass-card max-w-lg mx-auto relative overflow-hidden",
        className
      )}
    >
      {/* Specular top reflection line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.14] border-t-white/[0.3] flex items-center justify-center text-[#C8E9A9] mb-4 shadow-[0_0_20px_rgba(200,233,169,0.18)]">
        <Icon size={22} className="stroke-[1.8]" />
      </div>
      <h3 className="text-lg font-bold text-[#F2F3F0] mb-2 tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-[#A5A7A3] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg bg-gradient-to-b from-[#D4F2B7] to-[#B5E090] text-[#050505] font-bold text-xs tracking-wider uppercase border border-[#dcf5c2] shadow-[0_0_20px_rgba(200,233,169,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.8)] hover:shadow-[0_0_28px_rgba(200,233,169,0.55)] transition-all cursor-pointer active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
