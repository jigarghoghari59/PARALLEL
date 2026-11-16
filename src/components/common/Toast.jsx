// src/components/common/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

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
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full glass-panel border-white/[0.15] text-xs text-[#F2F3F0] shadow-[0_12px_40px_rgba(0,0,0,0.85)] relative overflow-hidden">
        {/* Specular highlight line */}
        <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* Glow indicator dot */}
        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isError
              ? "bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
              : "bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9]"
          }`}
        />

        {/* Icon */}
        {isError ? (
          <AlertCircle size={15} className="text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 size={15} className="text-[#C8E9A9] shrink-0" />
        )}

        {/* Message */}
        <span className="font-semibold tracking-wide pr-1">
          {toast.message || "Universe auto-saved to local memory"}
        </span>

        {/* Close Button */}
        <button
          onClick={onDismiss}
          className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-[#A5A7A3] hover:text-[#F2F3F0] transition-colors ml-1 cursor-pointer"
          aria-label="Dismiss notification"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
};
