// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home, Layers } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[65vh] flex items-center justify-center p-6 select-none">
      <div className="relative z-10 glass-card rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl relative overflow-hidden bg-[#07090b] border border-white/[0.12]">
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#C8E9A9]/40 to-transparent pointer-events-none" />

        {/* Glow Compass Icon */}
        <div className="w-16 h-16 rounded-full bg-[#141a15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mx-auto mb-6 shadow-[0_0_25px_rgba(200,233,169,0.25)]">
          <Compass size={30} className="animate-spin duration-1000" style={{ animationDuration: "20s" }} />
        </div>

        {/* 404 Tag matching Landing Page */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl w-fit mx-auto mb-4 shadow-[0_0_20px_rgba(200,233,169,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shadow-[0_0_8px_#C8E9A9] animate-pulse" />
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F2F3F0]">
            404 • Dimension Uncharted
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F2F3F0] tracking-tight mb-3">
          Timeline Divergence Lost
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A5A7A3] leading-relaxed mb-8 max-w-sm mx-auto">
          The quantum coordinate you requested does not exist in any explored parallel timeline. It may have collapsed into an unobserved probability wave.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#C8E9A9] text-[#050505] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(200,233,169,0.35)] hover:shadow-[0_0_30px_rgba(200,233,169,0.65)] hover:bg-[#d5f2b8] active:scale-95 cursor-pointer"
          >
            <Home size={14} /> Return to Home
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full glass-pill hover:border-[#C8E9A9]/50 text-[#F2F3F0] text-xs font-semibold transition-all duration-300 shadow-md active:scale-95 cursor-pointer"
          >
            <Layers size={14} className="text-[#C8E9A9]" /> Multiverse Explorer
          </Link>
        </div>
      </div>
    </div>
  );
}
