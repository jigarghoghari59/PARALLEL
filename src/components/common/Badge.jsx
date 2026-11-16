// src/components/common/Badge.jsx
import React from "react";
import { cn } from "../../utils";

export const Badge = ({
  children,
  variant = "default",
  className = "",
  ...props
}) => {
  const variants = {
    default: "bg-white/[0.04] text-[#A5A7A3] border-white/[0.1] border-t-white/[0.2]",
    accent: "bg-[#C8E9A9]/10 text-[#C8E9A9] border-[#C8E9A9]/30 border-t-[#C8E9A9]/50 shadow-[0_0_12px_rgba(200,233,169,0.15)]",
    purple: "bg-[#9678C9]/10 text-[#9678C9] border-[#9678C9]/30 border-t-[#9678C9]/50 shadow-[0_0_12px_rgba(150,120,201,0.15)]",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 border-t-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/30 border-t-amber-400/50",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/30 border-t-rose-400/50 shadow-[0_0_12px_rgba(244,63,94,0.15)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border tracking-wider uppercase relative overflow-hidden",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {/* Specular highlight line */}
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
      {children}
    </span>
  );
};
