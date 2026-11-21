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
    default: "bg-surface text-muted border-rule",
    accent: "bg-accent/10 text-accent border-accent/30",
    purple: "bg-purple/10 text-purple border-purple/30",
    success: "bg-accent/15 text-accent border-accent/40",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border relative overflow-hidden",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
      {children}
    </span>
  );
};
