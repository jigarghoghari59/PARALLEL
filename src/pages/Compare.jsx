import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, GitCompare } from "lucide-react";

export default function Compare() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <GitCompare size={13} />
          <span>Cross-Reality Comparison</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-2">Compare Realities</h1>
        <p className="text-sm text-[#A5A7A3] mb-6">Side-by-side life vector comparison and radar analysis (Phase 4).</p>
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-[#A5A7A3] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8E9A9] shrink-0" />
          <span>Speculative fiction notice: All ratings, scores, and comparisons are illustrative AI-generated models, not guaranteed predictions.</span>
        </div>
      </div>
    </div>
  );
}
