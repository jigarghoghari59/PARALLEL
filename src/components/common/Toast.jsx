// src/components/common/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle2, Sparkles, AlertCircle, Info, X } from "lucide-react";

export const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success" || !toast.type;
  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0B0D0E]/95 border border-[#292C2C] text-xs text-[#F2F3F0] shadow-[0_4px_30px_rgba(0,0,0,0.85)] backdrop-blur-md">
        {/* Glow indicator dot */}
        <span
          className={`w-2 h-2 rounded-full ${
            isError
              ? "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
              : "bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9]"
          }`}
        />

        {/* Icon */}
        {isError ? (
          <AlertCircle size={14} className="text-red-400 shrink-0" />
        ) : (
          <Sparkles size={14} className="text-[#C8E9A9] shrink-0" />
        )}

        {/* Message */}
        <span className="font-medium tracking-wide pr-1">
          {toast.message || "Universe auto-saved to local memory"}
        </span>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors ml-1"
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
