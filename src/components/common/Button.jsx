// src/components/common/Button.jsx
import React from "react";
import { cn } from "../../utils";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  pill = false,
  icon: Icon,
  ...rest
}) => {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 focus:outline-none select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizes = {
    sm: cn("px-3 py-1.5 text-xs", pill ? "rounded-full" : "rounded-md"),
    md: cn("px-4 py-2 text-xs", pill ? "rounded-full" : "rounded-lg"),
    lg: cn("px-5 py-2.5 text-sm", pill ? "rounded-full" : "rounded-xl"),
    icon: "w-8 h-8 p-0 rounded-full",
  };

  const variants = {
    primary:
      "bg-[#C8E9A9] text-[#050505] font-bold shadow-[0_0_20px_rgba(200,233,169,0.35)] hover:bg-[#d5f2b8] hover:shadow-[0_0_28px_rgba(200,233,169,0.55)] hover:scale-[1.02]",
    glass:
      "bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-white/20 text-[#F2F3F0] hover:text-white shadow-sm",
    secondary:
      "bg-[#121518] hover:bg-[#181C20] border border-white/[0.08] hover:border-white/20 text-[#F2F3F0] hover:text-white shadow-sm",
    ghost:
      "bg-transparent hover:bg-white/[0.05] border border-transparent hover:border-white/[0.12] text-[#A5A7A3] hover:text-white",
    danger:
      "bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/50 shadow-sm",
    purple:
      "bg-[#181520] border border-[#9678C9]/40 text-[#9678C9] hover:text-white hover:bg-[#9678C9]/20 shadow-sm",
  };

  return (
    <button
      className={cn(base, sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className)}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} className="shrink-0" />}
      {children}
    </button>
  );
};
