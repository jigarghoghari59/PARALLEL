// src/components/common/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export const Toast = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss?.();
    }, 3200);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-card border border-rule text-xs text-ink shadow-2xl relative overflow-hidden">
        <span className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        <span
          className={`w-2 h-2 rounded-full shrink-0 ${
            isError ? "bg-rose-400" : "bg-accent"
          }`}
          aria-hidden="true"
        />

        {isError ? (
          <AlertCircle size={15} className="text-rose-400 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 size={15} className="text-accent shrink-0" aria-hidden="true" />
        )}

        <span className="font-medium pr-1">
          {toast.message || "Universe auto-saved to local memory"}
        </span>

        <button
          onClick={onDismiss}
          className="w-5 h-5 rounded-full hover:bg-white/10 flex items-center justify-center text-muted hover:text-ink transition-colors ml-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-focus"
          aria-label="Dismiss notification"
        >
          <X size={12} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
