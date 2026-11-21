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
        "flex flex-col items-center justify-center text-center py-16 px-6 rounded-card bg-card border border-rule max-w-lg mx-auto relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl bg-surface border border-rule flex items-center justify-center text-accent mb-4">
        <Icon size={22} className="stroke-[1.8]" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-ink mb-2">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-lg bg-accent text-accent-ink font-semibold text-sm hover:bg-accent-muted focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 transition-colors cursor-pointer active:scale-95"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
