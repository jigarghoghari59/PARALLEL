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
    "inline-flex items-center justify-center gap-2 font-semibold tracking-wide transition-all duration-200 focus:outline-none select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] reflection-sheen";

  const sizes = {
    sm: cn("px-3 py-1.5 text-xs", pill ? "rounded-full" : "rounded-md"),
    md: cn("px-4 py-2 text-xs", pill ? "rounded-full" : "rounded-lg"),
    lg: cn("px-5 py-2.5 text-sm", pill ? "rounded-full" : "rounded-xl"),
    icon: "w-8 h-8 p-0 rounded-full",
  };

  const variants = {
    primary:
      "bg-gradient-to-b from-[#D4F2B7] to-[#B5E090] text-[#050505] border border-[#Dcf5c2] border-t-white shadow-[0_0_22px_rgba(200,233,169,0.35),inset_0_1px_2px_rgba(255,255,255,0.85)] hover:shadow-[0_0_32px_rgba(200,233,169,0.6),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:scale-[1.02]",
    glass:
      "bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.14] border-t-white/[0.3] text-[#F2F3F0] hover:text-white hover:border-[#C8E9A9]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.32),0_8px_24px_-4px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(200,233,169,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.5)]",
    secondary:
      "bg-gradient-to-b from-white/[0.08] to-white/[0.02] backdrop-blur-xl border border-white/[0.14] border-t-white/[0.3] text-[#F2F3F0] hover:text-white hover:border-[#C8E9A9]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.32),0_8px_24px_-4px_rgba(0,0,0,0.6)] hover:shadow-[0_0_20px_rgba(200,233,169,0.25),inset_0_1px_1.5px_rgba(255,255,255,0.5)]",
    ghost:
      "bg-transparent hover:bg-white/[0.05] border border-transparent hover:border-white/[0.12] text-[#A5A7A3] hover:text-white",
    danger:
      "bg-gradient-to-b from-rose-500/20 to-rose-600/10 backdrop-blur-xl border border-rose-500/40 border-t-rose-400/60 text-rose-300 hover:text-white hover:bg-rose-500/30 shadow-[0_0_18px_rgba(244,63,94,0.25),inset_0_1px_1px_rgba(255,255,255,0.3)]",
    purple:
      "bg-gradient-to-b from-[#9678C9]/30 to-[#9678C9]/10 backdrop-blur-xl border border-[#9678C9]/50 border-t-purple-300/60 text-purple-200 hover:text-white hover:bg-[#9678C9]/40 shadow-[0_0_22px_rgba(150,120,201,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]",
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
