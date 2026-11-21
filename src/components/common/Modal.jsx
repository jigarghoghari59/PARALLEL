// src/components/common/Modal.jsx
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils";

export const Modal = ({
  open,
  onClose,
  title,
  children,
  className = "",
  maxWidth = "max-w-lg",
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog window"}
        className={cn(
          "relative z-10 w-full bg-card border border-rule rounded-card p-6 sm:p-7 shadow-2xl text-ink overflow-hidden",
          maxWidth,
          className
        )}
      >
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-rule mb-5">
          <h3 className="text-base font-bold text-ink">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface border border-rule hover:border-accent/50 flex items-center justify-center text-muted hover:text-ink transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-1"
            aria-label="Close dialog"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
