// src/components/common/Card.jsx
import React from "react";
import { cn } from "../../utils";

export const Card = ({ children, className = "", hover = true, glow = false }) => (
  <div
    className={cn(
      "bg-card border border-rule text-ink rounded-card p-4.5 relative overflow-hidden transition-colors transition-transform duration-150",
      hover && "hover:-translate-y-0.5 hover:border-white/20",
      glow && "border-accent/40 shadow-card",
      className
    )}
  >
    {/* Subtle specular top glow line */}
    <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
    {children}
  </div>
);
