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
        "flex flex-col items-center justify-center text-center py-14 px-6 rounded-xl bg-[#0E1114] border border-rose-900/40 border-t-rose-500/30 max-w-lg mx-auto shadow-2xl relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-400/30 to-transparent pointer-events-none" />

      <div className="w-12 h-12 rounded-xl bg-rose-950/50 border border-rose-700/40 flex items-center justify-center text-rose-400 mb-4 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
        <AlertCircle size={22} />
      </div>
      <h3 className="text-base font-bold text-[#F2F3F0] mb-2">{title}</h3>
      <p className="text-xs text-[#A5A7A3] max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.05] border border-white/[0.12] hover:border-[#C8E9A9]/50 text-[#F2F3F0] font-semibold text-xs tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
};
