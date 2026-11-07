// src/components/common/Button.jsx
import React from "react";
import { cn } from "../../utils";

export const Button = ({ children, className = "", variant = "primary", size = "md", ...rest }) => {
  const base = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none";
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const variants = {
    primary: "bg-accent text-bg hover:bg-accent-muted",
    ghost: "bg-transparent border border-border text-text hover:bg-surface",
  };
  return (
    <button
      className={cn(base, sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className)}
      {...rest}
    >
      {children}
    </button>
  );
};

