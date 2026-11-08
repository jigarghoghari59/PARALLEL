// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-[calc(100vh-65px)] bg-[#050505] text-[#F2F3F0] flex items-center justify-center p-6 select-none overflow-hidden">
      {/* Background Star Dots & Celestial Rings */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 1000 700"
          fill="none"
        >
          <ellipse
            cx="500"
            cy="350"
            rx="400"
            ry="200"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
        </svg>
        <div className="absolute top-20 left-1/4 w-1.5 h-1.5 bg-[#C8E9A9] rounded-full opacity-60" />
        <div className="absolute bottom-24 right-1/4 w-1.5 h-1.5 bg-[#9678C9] rounded-full opacity-60" />
      </div>

      <div className="relative z-10 bg-[#0B0D0E]/90 border border-[#292C2C] rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center shadow-2xl backdrop-blur-xl">
        {/* Glow Compass Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#141a15] border border-[#C8E9A9]/30 flex items-center justify-center text-[#C8E9A9] mx-auto mb-6 shadow-[0_0_25px_rgba(200,233,169,0.2)]">
          <Compass size={32} className="animate-spin duration-1000" style={{ animationDuration: "20s" }} />
        </div>

        {/* 404 Tag */}
        <span className="inline-block px-3 py-1 rounded-full bg-[#121413] border border-[#C8E9A9]/20 text-[#C8E9A9] text-xs font-bold tracking-widest uppercase mb-3">
          404 • Dimension Uncharted
        </span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F2F3F0] tracking-tight mb-3">
          Timeline Divergence Lost
        </h1>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#A5A7A3] leading-relaxed mb-8 max-w-sm mx-auto">
          The quantum coordinate you requested does not exist in any explored parallel timeline. It may have collapsed into another state.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#C8E9A9] hover:bg-[#d8f5be] text-[#050505] font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
          >
            <Home size={14} /> Return to Dashboard
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#0B0D0E] hover:bg-[#141618] border border-[#292C2C] text-[#F2F3F0] text-xs font-semibold transition-colors"
          >
            <Sparkles size={14} className="text-[#C8E9A9]" /> Multiverse Explorer
          </Link>
        </div>
      </div>
    </div>
  );
}
