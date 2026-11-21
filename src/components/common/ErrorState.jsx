// src/components/common/ErrorState.jsx
import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { cn } from "../../utils";

export const ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred while communicating with the multiverse engine.",
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-12 px-6 rounded-card bg-card border border-rule max-w-lg mx-auto relative overflow-hidden",
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-surface border border-rule flex items-center justify-center text-accent mb-3">
        <AlertCircle size={20} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-xs text-muted max-w-sm mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-accent hover:bg-accent/90 active:bg-accent/80 text-accent-ink font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
        >
          <RotateCcw size={13} aria-hidden="true" />
          <span>Retry operation</span>
        </button>
      )}
    </div>
  );
};
