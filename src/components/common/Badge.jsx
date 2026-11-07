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
    default: "bg-[#101113] text-[#A5A7A3] border-[#292C2C]",
    accent: "bg-[#C8E9A9]/10 text-[#C8E9A9] border-[#C8E9A9]/20",
    purple: "bg-[#9678C9]/10 text-[#9678C9] border-[#9678C9]/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-wide uppercase",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
