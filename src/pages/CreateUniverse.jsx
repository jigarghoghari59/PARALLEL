import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function CreateUniverse() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#A5A7A3] hover:text-[#C8E9A9] transition-colors mb-6">
        <ArrowLeft size={14} /> Back to Dashboard
      </Link>
      <div className="bg-[#0B0D0E]/80 border border-[#292C2C] rounded-2xl p-8 backdrop-blur shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101113] border border-[#292C2C] text-[11px] font-medium text-[#C8E9A9] uppercase tracking-wider mb-4">
          <Sparkles size={13} />
          <span>New Reality Generation</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#F2F3F0] mb-3">Create Universe</h1>
        <p className="text-sm text-[#A5A7A3] leading-relaxed mb-6">
          Formulate a decision or hypothetical turning point. The digital multiverse engine will branch multiple diverging timelines.
        </p>
        <div className="p-4 rounded-xl bg-[#101113] border border-[#292C2C] text-xs text-[#A5A7A3]">
          Creation wizard arriving in Phase 2.
        </div>
      </div>
    </div>
  );
}
