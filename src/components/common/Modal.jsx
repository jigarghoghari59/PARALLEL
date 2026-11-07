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
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          "relative z-10 w-full bg-[#0B0D0E] border border-[#292C2C] rounded-2xl p-6 shadow-2xl text-[#F2F3F0] animate-in fade-in zoom-in-95 duration-200",
          maxWidth,
          className
        )}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#292C2C]/50 mb-4">
          <h3 className="text-base font-semibold text-[#F2F3F0] tracking-wide">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-[#292C2C] flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] hover:border-[#383b3b] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
};
