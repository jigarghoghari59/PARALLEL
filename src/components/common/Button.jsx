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
    "inline-flex items-center justify-center gap-2 font-medium transition-colors transition-transform duration-150 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const sizes = {
    sm: cn("px-3 py-1.5 text-xs", pill ? "rounded-full" : "rounded-md"),
    md: cn("px-4 py-2 text-sm", pill ? "rounded-full" : "rounded-lg"),
    lg: cn("px-5 py-2.5 text-sm", pill ? "rounded-full" : "rounded-xl"),
    icon: "w-8 h-8 p-0 rounded-full",
  };

  const variants = {
    primary:
      "bg-accent text-accent-ink font-semibold hover:bg-accent-muted active:bg-accent",
    glass:
      "bg-surface hover:bg-card border border-rule text-ink hover:text-white",
    secondary:
      "bg-surface hover:bg-card border border-rule text-ink hover:text-white",
    ghost:
      "bg-transparent hover:bg-surface border border-transparent text-muted hover:text-ink",
    danger:
      "bg-rose-950/40 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-900/60",
    purple:
      "bg-purple/10 border border-purple/30 text-purple hover:text-white hover:bg-purple/20",
  };

  return (
    <button
      className={cn(base, sizes[size] ?? sizes.md, variants[variant] ?? variants.primary, className)}
      {...rest}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} className="shrink-0" aria-hidden="true" />}
      {children}
    </button>
  );
};
