// src/components/common/EmptyState.jsx
import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../utils";

export const EmptyState = ({
  title = "No data found",
  description = "Nothing to display right now.",
  actionLabel,
  onAction,
  icon: Icon = Sparkles,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4 rounded-2xl bg-[#0B0D0E]/60 border border-[#292C2C] max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-[#101113] border border-[#292C2C] flex items-center justify-center text-[#C8E9A9] mb-4 shadow-md">
        <Icon size={22} />
      </div>
      <h3 className="text-lg font-semibold text-[#F2F3F0] mb-2">{title}</h3>
      <p className="text-sm text-[#A5A7A3] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-full bg-[#C8E9A9] text-[#050505] font-semibold text-xs tracking-wider uppercase hover:bg-[#b8dd98] transition-colors shadow-[0_2px_16px_rgba(200,233,169,0.2)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
