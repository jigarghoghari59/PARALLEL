// src/components/common/Input.jsx
import React from "react";
import { cn } from "../../utils";

export const Input = React.forwardRef(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-[11px] font-semibold text-[#A5A7A3] tracking-wider uppercase">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <input
            ref={ref}
            className={cn(
              "w-full bg-[#0B0D0F] border border-white/[0.08] focus:border-[#C8E9A9] focus-visible:ring-1 focus-visible:ring-[#C8E9A9]/50 rounded-xl px-4 py-2.5 text-sm text-[#F2F3F0] placeholder-[#A5A7A3]/50 focus:outline-none transition-all shadow-inner",
              error && "border-rose-500/60 focus:border-rose-500 focus:shadow-[0_0_16px_rgba(244,63,94,0.25)]",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-[11px] text-rose-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-[#A5A7A3]">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
