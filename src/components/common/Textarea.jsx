// src/components/common/Textarea.jsx
import React from "react";
import { cn } from "../../utils";

export const Textarea = React.forwardRef(
  ({ label, error, helperText, rows = 4, className = "", ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-muted">
            {label}
          </label>
        )}
        <div className="relative w-full">
          <textarea
            ref={ref}
            rows={rows}
            className={cn(
              "w-full bg-card border border-rule focus:border-accent rounded-card px-4 py-3 text-sm text-ink placeholder-muted/50 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1 transition-colors resize-y leading-relaxed",
              error && "border-rose-500/60 focus:border-rose-500",
              className
            )}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-rose-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
