// src/components/common/Spinner.jsx
import React from "react";
import { cn } from "../../utils";

export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
    lg: "w-10 h-10 border-3",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-t-[#C8E9A9] border-r-transparent border-b-[#C8E9A9]/20 border-l-transparent",
        sizes[size] || sizes.md,
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
};
