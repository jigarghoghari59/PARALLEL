// src/components/common/Card.jsx
import React from "react";
import { cn } from "../../utils";

export const Card = ({ children, className = "", hover = true, glow = false }) => (
  <div
    className={cn(
      "glass-card text-text rounded-xl p-4.5 shadow-xl relative overflow-hidden",
      hover && "hover:-translate-y-0.5",
      glow && "glass-border-shine border-[#C8E9A9]/40 shadow-[0_0_24px_rgba(200,233,169,0.18)]",
      className
    )}
  >
    {/* Subtle specular top glow reflection line */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
    {children}
  </div>
);
