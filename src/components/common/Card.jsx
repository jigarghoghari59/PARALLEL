// src/components/common/Card.jsx
import React from "react";
import { cn } from "../../utils";

export const Card = ({ children, className = "", hover = true, glow = false }) => (
  <div
    className={cn(
      "bg-[#0B0D0F] border border-white/[0.08] text-text rounded-xl p-4.5 shadow-xl relative overflow-hidden transition-all duration-200",
      hover && "hover:-translate-y-0.5 hover:border-white/20",
      glow && "border-[#C8E9A9]/40 shadow-[0_0_24px_rgba(200,233,169,0.18)]",
      className
    )}
  >
    {/* Subtle specular top glow line */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
    {children}
  </div>
);
