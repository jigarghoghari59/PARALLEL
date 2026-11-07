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
        "flex flex-col items-center justify-center text-center py-12 px-6 rounded-2xl bg-[#130d0e]/60 border border-rose-900/30 max-w-lg mx-auto",
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-rose-950/40 border border-rose-800/40 flex items-center justify-center text-rose-400 mb-4">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-base font-semibold text-[#F2F3F0] mb-2">{title}</h3>
      <p className="text-xs text-[#A5A7A3] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#101113] border border-[#292C2C] hover:border-[#C8E9A9]/50 text-[#F2F3F0] font-medium text-xs tracking-wider uppercase transition-colors"
        >
          <RotateCcw size={13} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
