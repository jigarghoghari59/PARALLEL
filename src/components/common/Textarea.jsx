// src/components/common/Textarea.jsx
import React from "react";
import { cn } from "../../utils";

export const Textarea = React.forwardRef(
  ({ label, error, helperText, rows = 4, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#A5A7A3] tracking-wider uppercase">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full bg-[#101113] border border-[#292C2C] rounded-xl px-4 py-3 text-sm text-[#F2F3F0] placeholder-[#A5A7A3]/50 focus:outline-none focus:border-[#C8E9A9] focus:ring-1 focus:ring-[#C8E9A9]/30 transition-all resize-y leading-relaxed",
            error && "border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20",
            className
          )}
          {...props}
        />
        {error && <span className="text-[11px] text-rose-400">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-[#A5A7A3]">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
