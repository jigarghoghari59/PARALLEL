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
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full glass-panel rounded-xl p-6 sm:p-7 shadow-[0_24px_64px_rgba(0,0,0,0.9)] text-[#F2F3F0] animate-in fade-in zoom-in-95 duration-200 overflow-hidden",
          maxWidth,
          className
        )}
      >
        {/* Specular Top Reflection Line */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08] mb-5">
          <h3 className="text-base font-bold text-[#F2F3F0] tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.12] hover:border-[#C8E9A9]/50 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label="Close dialog"
          >
            <X size={15} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
